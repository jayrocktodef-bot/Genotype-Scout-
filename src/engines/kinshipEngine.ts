export interface IBDSegment {
  chrom: string;
  start: number;
  end: number;
  lengthCM: number;
  snpsCount: number;
}

export interface KinshipResult {
  datasetAIndex: number;
  datasetBIndex: number;
  datasetAName: string;
  datasetBName: string;
  totalSharedCM: number;
  longestBlockCM: number;
  segments: IBDSegment[];
  predictedRelationship: string;
}

// Predict relationship based on total shared cM
function predictRelationship(cM: number): string {
  if (cM > 3400) return 'Identical Twin / Self';
  if (cM > 3300) return 'Parent / Child';
  if (cM > 2400) return 'Full Sibling';
  if (cM > 1300) return 'Grandparent / Aunt / Uncle / Half-Sibling';
  if (cM > 600) return '1st Cousin / Great-Grandparent';
  if (cM > 200) return '2nd Cousin';
  if (cM > 50) return '3rd Cousin';
  if (cM > 20) return '4th Cousin';
  if (cM > 7) return 'Distant Relative';
  return 'Unrelated';
}

function getIBS(gt1: string, gt2: string): number {
  if (!gt1 || !gt2 || gt1.length !== 2 || gt2.length !== 2) return 0;
  if (gt1 === '--' || gt2 === '--' || gt1.includes('0') || gt2.includes('0')) return 0; // Skip no-calls
  
  const a1 = gt1[0];
  const a2 = gt1[1];
  const b1 = gt2[0];
  const b2 = gt2[1];

  if ((a1 === b1 && a2 === b2) || (a1 === b2 && a2 === b1)) return 2; // Full match
  if (a1 === b1 || a1 === b2 || a2 === b1 || a2 === b2) return 1; // Half match
  return 0; // No match
}

export async function comparePairwise(datasets: any[], activeIndex: number): Promise<KinshipResult[]> {
  const activeDataset = datasets[activeIndex];
  if (!activeDataset) return [];

  const results: KinshipResult[] = [];

  // Group active dataset SNPs by chromosome
  const activeChromMap = new Map<string, { pos: number, gt: string }[]>();
  
  const activeSnps = activeDataset.results || [];
  for (const snp of activeSnps) {
    let chrom = String(snp.chromosome || snp.chrom || '').toUpperCase().replace('CHR', '');
    if (!chrom) {
      // fallback to meta map if available
      const rsid = (snp.rsid || snp.markerId || '').toLowerCase();
      if (activeDataset.mergedSnpMetaMap && activeDataset.mergedSnpMetaMap[rsid]) {
        chrom = String(activeDataset.mergedSnpMetaMap[rsid].chrom).toUpperCase().replace('CHR', '');
      }
    }
    const pos = Number(snp.position || snp.pos);
    const gt = String(snp.genotype || '--').toUpperCase();
    
    if (chrom && !isNaN(pos) && gt !== '--') {
      const n = parseInt(chrom, 10);
      if (!isNaN(n) && n >= 1 && n <= 22) { // Only autosomes for kinship
        if (!activeChromMap.has(chrom)) activeChromMap.set(chrom, []);
        activeChromMap.get(chrom)!.push({ pos, gt });
      }
    }
  }

  // Sort positions
  for (const [chrom, arr] of activeChromMap.entries()) {
    arr.sort((a, b) => a.pos - b.pos);
  }

  // Compare against all other datasets
  for (let i = 0; i < datasets.length; i++) {
    if (i === activeIndex) continue;
    const targetDataset = datasets[i];
    
    const targetSnps = targetDataset.results || [];
    const targetChromMap = new Map<string, Map<number, string>>();
    
    for (const snp of targetSnps) {
      let chrom = String(snp.chromosome || snp.chrom || '').toUpperCase().replace('CHR', '');
      if (!chrom) {
        const rsid = (snp.rsid || snp.markerId || '').toLowerCase();
        if (targetDataset.mergedSnpMetaMap && targetDataset.mergedSnpMetaMap[rsid]) {
          chrom = String(targetDataset.mergedSnpMetaMap[rsid].chrom).toUpperCase().replace('CHR', '');
        }
      }
      const pos = Number(snp.position || snp.pos);
      const gt = String(snp.genotype || '--').toUpperCase();
      
      if (chrom && !isNaN(pos) && gt !== '--') {
        const n = parseInt(chrom, 10);
        if (!isNaN(n) && n >= 1 && n <= 22) {
          if (!targetChromMap.has(chrom)) targetChromMap.set(chrom, new Map());
          targetChromMap.get(chrom)!.set(pos, gt);
        }
      }
    }

    const sharedSegments: IBDSegment[] = [];
    let totalSharedCM = 0;
    let longestBlockCM = 0;

    // Minimum thresholds to consider a valid IBD segment
    const MIN_CM = 7.0; 
    const MIN_SNPS = 500;
    const MAX_GAP = 500000; // 500kbp max gap between SNPs
    
    for (const [chrom, activeArr] of activeChromMap.entries()) {
      const targetMap = targetChromMap.get(chrom);
      if (!targetMap) continue;

      let currentStartPos = -1;
      let lastPos = -1;
      let currentSnps = 0;
      let mismatches = 0;
      
      const flushSegment = (endPos: number) => {
        if (currentStartPos !== -1 && currentSnps >= MIN_SNPS) {
          const lengthCM = (endPos - currentStartPos) / 1000000; // Approx 1 Mbp = 1 cM
          if (lengthCM >= MIN_CM) {
            sharedSegments.push({
              chrom,
              start: currentStartPos,
              end: endPos,
              lengthCM,
              snpsCount: currentSnps
            });
            totalSharedCM += lengthCM;
            if (lengthCM > longestBlockCM) longestBlockCM = lengthCM;
          }
        }
        currentStartPos = -1;
        currentSnps = 0;
        mismatches = 0;
      };

      for (const { pos, gt: activeGt } of activeArr) {
        const targetGt = targetMap.get(pos);
        if (!targetGt) continue;

        const ibs = getIBS(activeGt, targetGt);
        
        // Check for massive gaps which break linkage phase
        if (lastPos !== -1 && (pos - lastPos) > MAX_GAP && currentStartPos !== -1) {
          flushSegment(lastPos);
        }

        if (ibs >= 1) {
          // Match
          if (currentStartPos === -1) {
            currentStartPos = pos;
          }
          currentSnps++;
          mismatches = 0; // reset mismatches
        } else {
          // Mismatch
          if (currentStartPos !== -1) {
            mismatches++;
            // Error tolerance: allow 2 consecutive mismatches before breaking the block
            if (mismatches > 2) {
              flushSegment(lastPos);
            } else {
              currentSnps++; // absorb error
            }
          }
        }
        lastPos = pos;
      }
      
      // End of chromosome
      flushSegment(lastPos);
    }

    results.push({
      datasetAIndex: activeIndex,
      datasetBIndex: i,
      datasetAName: activeDataset.name || `Kit ${activeIndex + 1}`,
      datasetBName: targetDataset.name || `Kit ${i + 1}`,
      totalSharedCM: Math.round(totalSharedCM * 10) / 10,
      longestBlockCM: Math.round(longestBlockCM * 10) / 10,
      segments: sharedSegments.sort((a, b) => b.lengthCM - a.lengthCM),
      predictedRelationship: predictRelationship(totalSharedCM)
    });
  }

  return results.sort((a, b) => b.totalSharedCM - a.totalSharedCM);
}
