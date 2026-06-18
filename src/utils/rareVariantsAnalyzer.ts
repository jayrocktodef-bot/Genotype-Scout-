export interface RareVariant {
  rsid: string;
  genotype: string;
  type: 'internal' | 'unmapped' | 'rare_allele';
  description?: string;
  globalFrequency?: number;
}

export function identifyRareAndNovelVariants(
  userSnpMap: Record<string, string>,
  knownDbKeys: Set<string>,
  aimsDatabase?: Record<string, any>
): RareVariant[] {
  const variants: RareVariant[] = [];
  let unmappedCount = 0;
  let rareCount = 0;
  
  for (const [rsid, genotype] of Object.entries(userSnpMap)) {
    const cleanRsid = rsid.toLowerCase();
    
    // Skip no-calls
    if (genotype.includes('-') || genotype === '??' || genotype === 'II' || genotype === 'DD') continue;

    // 1. Internal commercial markers
    if (cleanRsid.match(/^i\d+$/) && variants.filter(v => v.type === 'internal').length < 100) {
      variants.push({
        rsid,
        genotype,
        type: 'internal',
        description: 'Internal microarray marker. Used by commercial tests when a dbSNP RSID was unavailable at chip design.'
      });
      continue;
    }
    
    // 2. Unmapped / Novel RSIDs (sample up to 50 for discovery)
    if (cleanRsid.startsWith('rs') && !knownDbKeys.has(cleanRsid) && unmappedCount < 50) {
       variants.push({
         rsid,
         genotype,
         type: 'unmapped',
         description: 'Variant detected in file but unmapped in local database. May be a newly assigned or rare clinical SNP.'
       });
       unmappedCount++;
       continue;
    }

    // 3. Globally Rare Alleles
    // Check if the user has an allele that is extremely rare globally (< 1%)
    if (aimsDatabase && rareCount < 100) {
      // The aim key might have _suffix, but userSnpMap is just rsid.
      // We look up by the cleanRsid. Since aims keys can have suffixes (e.g. rs123_A), we just check the first matching base RSID.
      // Or we can just do a direct lookup if aims is keyed by rsid.
      // In master_aims, keys are usually just the rsid unless there are multiple.
      const aim = aimsDatabase[cleanRsid] || aimsDatabase[cleanRsid.toUpperCase()];
      
      if (aim && aim.frequencies && aim.alleles && aim.alleles.length > 0) {
        const effectAllele = aim.alleles[0];
        // Calculate global average frequency for the effect allele
        const popFreqs = Object.values(aim.frequencies) as number[];
        if (popFreqs.length > 0) {
          const globalEffectFreq = popFreqs.reduce((a, b) => a + b, 0) / popFreqs.length;
          
          // What alleles does the user have?
          const userAlleles = genotype.split('');
          
          let isRare = false;
          let minFreq = 1.0;
          
          for (const a of userAlleles) {
            // If user allele is the effect allele
            if (a === effectAllele) {
              if (globalEffectFreq < 0.01) {
                isRare = true;
                minFreq = Math.min(minFreq, globalEffectFreq);
              }
            } else {
              // If user allele is the alternate (we assume biallelic)
              const altFreq = 1 - globalEffectFreq;
              if (altFreq < 0.01) {
                isRare = true;
                minFreq = Math.min(minFreq, altFreq);
              }
            }
          }
          
          if (isRare) {
            variants.push({
              rsid,
              genotype,
              type: 'rare_allele',
              description: `You carry a globally rare allele at this position (estimated < 1% worldwide).`,
              globalFrequency: minFreq
            });
            rareCount++;
          }
        }
      }
    }
  }
  
  return variants;
}
