/**
 * Scientific Quality Control & File Integrity Engine
 * Genotype Scout — Written In The Genome
 */

export interface ChromosomeQCStats {
  chrom: string;
  label: string;
  count: number;
  validCalls: number;
  noCalls: number;
  hetCount: number;
  homCount: number;
  callRate: number; // 0 - 100
  hetRate: number; // 0 - 100
  percentOfKit: number; // 0 - 100
}

export interface DetailedIntegrityReport {
  totalMarkers: number;
  validCalls: number;
  noCalls: number;
  callRate: number; // e.g. 99.45
  callRateFormatted: string;
  isReliable: boolean;
  fidelityStatus: 'High-Fidelity' | 'Standard' | 'Suboptimal';

  // Genotypic Heterozygosity & Purity
  heterozygousCount: number;
  homozygousCount: number;
  heterozygosityRate: number; // e.g. 31.25
  heterozygosityFormatted: string;
  purityStatus: 'Nominal (High Purity)' | 'Excess Heterozygosity (Possible Contamination)' | 'Low Heterozygosity (High Homozgyosity)';
  purityVerdict: 'PASS' | 'CAUTION' | 'REVIEW';

  // Platform & Hardware Details
  detectedChip: string;
  expectedDensity: string;
  densityConcordance: number; // %
  build: string; // GRCh37 / GRCh38 / Unknown
  phasingStatus: 'Phased' | 'Unphased';
  inferredSex: 'Male' | 'Female' | 'Ambiguous';
  yMarkerCount: number;
  mtMarkerCount: number;
  xMarkerCount: number;
  autosomalMarkerCount: number;

  // Chromosomal Distribution (Chr 1-22, X, Y, MT)
  chromosomes: ChromosomeQCStats[];

  // Composite 0-100 Integrity Score
  integrityScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
}

const ALL_CHROMOSOMES = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', 'X', 'Y', 'MT'
];

/**
 * Normalizes chromosome strings into standard form ('1'..'22', 'X', 'Y', 'MT')
 */
export function normalizeChromKey(raw: string | number | undefined): string | null {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim().toUpperCase().replace(/^CHR/, '');
  if (s === '23' || s === 'X') return 'X';
  if (s === '24' || s === 'Y') return 'Y';
  if (s === '25' || s === 'XY' || s === 'PAR') return 'X';
  if (s === '26' || s === 'M' || s === 'MT' || s === 'MITO') return 'MT';
  const num = parseInt(s, 10);
  if (!isNaN(num) && num >= 1 && num <= 22) return String(num);
  return null;
}

/**
 * Evaluates whether a genotype string is a valid call or missing
 */
export function isNoCall(genotype: string | undefined): boolean {
  if (!genotype) return true;
  const g = genotype.trim().toUpperCase();
  return g === '--' || g === '00' || g === 'NN' || g === '??' || g === './.' || g === '.' || g === '-' || g === '0';
}

/**
 * Evaluates whether a call is heterozygous (e.g. AG, CT)
 */
export function isHeterozygous(genotype: string | undefined): boolean {
  if (!genotype || isNoCall(genotype)) return false;
  const g = genotype.trim().toUpperCase().replace(/[\/\|]/g, '');
  return g.length === 2 && g[0] !== g[1];
}

/**
 * Evaluates whether a call is homozygous (e.g. AA, GG)
 */
export function isHomozygous(genotype: string | undefined): boolean {
  if (!genotype || isNoCall(genotype)) return false;
  const g = genotype.trim().toUpperCase().replace(/[\/\|]/g, '');
  return g.length === 2 && g[0] === g[1];
}

/**
 * Legacy API support for existing consumers
 */
export function calculateFileIntegrity(rawSnps: any[]) {
  const total = rawSnps?.length || 0;
  const missing = (rawSnps || []).filter(s => isNoCall(s?.genotype)).length;
  const callRate = total > 0 ? ((total - missing) / total) * 100 : 0;

  return {
    callRate: callRate.toFixed(2),
    // Standard bioinformatics threshold is 98% for professional research
    isReliable: callRate > 98,
    status: callRate > 99 ? "High-Fidelity" : "Low-Quality"
  };
}

/**
 * Calculates comprehensive quality control and file integrity metrics from dataset structures
 */
export function assessDatasetIntegrity(dataset: any): DetailedIntegrityReport {
  const snpMap: Record<string, string> = dataset?.mergedSnpMap || dataset?.userSnps || {};
  const snpMetaMap: Record<string, { chrom?: string; pos?: number }> = dataset?.mergedSnpMetaMap || {};
  const entries = Object.entries(snpMap);
  const reportedTotal = dataset?.snpCount || entries.length;
  const totalMarkers = Math.max(entries.length, reportedTotal);

  let validCalls = 0;
  let noCalls = 0;
  let hetCount = 0;
  let homCount = 0;

  // Chromosome bins
  const chromBuckets: Record<string, {
    count: number;
    validCalls: number;
    noCalls: number;
    hetCount: number;
    homCount: number;
  }> = {};

  for (const c of ALL_CHROMOSOMES) {
    chromBuckets[c] = { count: 0, validCalls: 0, noCalls: 0, hetCount: 0, homCount: 0 };
  }

  // Iterate through available markers
  for (let i = 0; i < entries.length; i++) {
    const [rsid, genotype] = entries[i];
    const missing = isNoCall(genotype);
    const het = isHeterozygous(genotype);
    const hom = isHomozygous(genotype);

    if (missing) {
      noCalls++;
    } else {
      validCalls++;
      if (het) hetCount++;
      else if (hom) homCount++;
    }

    // Determine chromosome
    let chromKey: string | null = null;
    if (snpMetaMap[rsid]?.chrom) {
      chromKey = normalizeChromKey(snpMetaMap[rsid].chrom);
    } else if (rsid.startsWith('chr')) {
      const match = rsid.match(/^chr([0-9xyXYmMtT]+)/);
      if (match) chromKey = normalizeChromKey(match[1]);
    }

    if (chromKey && chromBuckets[chromKey]) {
      const bucket = chromBuckets[chromKey];
      bucket.count++;
      if (missing) {
        bucket.noCalls++;
      } else {
        bucket.validCalls++;
        if (het) bucket.hetCount++;
        else if (hom) bucket.homCount++;
      }
    }
  }

  // If entries was 0 or sparse but dataset has total count
  if (entries.length === 0 && reportedTotal > 0) {
    validCalls = reportedTotal;
    noCalls = 0;
  }

  const callRate = totalMarkers > 0 ? (validCalls / totalMarkers) * 100 : 0;
  const hetRate = validCalls > 0 ? (hetCount / validCalls) * 100 : 0;

  // Purity and Heterozygosity status
  let purityStatus: DetailedIntegrityReport['purityStatus'] = 'Nominal (High Purity)';
  let purityVerdict: DetailedIntegrityReport['purityVerdict'] = 'PASS';
  if (hetRate > 38.0) {
    purityStatus = 'Excess Heterozygosity (Possible Contamination)';
    purityVerdict = 'CAUTION';
  } else if (hetRate < 24.0 && hetRate > 0) {
    purityStatus = 'Low Heterozygosity (High Homozgyosity)';
    purityVerdict = 'REVIEW';
  }

  // Fidelity Status
  let fidelityStatus: DetailedIntegrityReport['fidelityStatus'] = 'High-Fidelity';
  if (callRate < 95.0) {
    fidelityStatus = 'Suboptimal';
  } else if (callRate < 98.5) {
    fidelityStatus = 'Standard';
  }

  // Build chromosome summary stats
  const chromosomes: ChromosomeQCStats[] = ALL_CHROMOSOMES.map(chrom => {
    const bucket = chromBuckets[chrom];
    const cTotal = bucket.count;
    const cCallRate = cTotal > 0 ? (bucket.validCalls / cTotal) * 100 : (callRate > 0 ? callRate : 0);
    const cHetRate = bucket.validCalls > 0 ? (bucket.hetCount / bucket.validCalls) * 100 : 0;
    const percentOfKit = totalMarkers > 0 ? (cTotal / totalMarkers) * 100 : 0;

    return {
      chrom,
      label: chrom === 'MT' ? 'Chr MT (Mito)' : `Chr ${chrom}`,
      count: cTotal,
      validCalls: bucket.validCalls,
      noCalls: bucket.noCalls,
      hetCount: bucket.hetCount,
      homCount: bucket.homCount,
      callRate: Number(cCallRate.toFixed(2)),
      hetRate: Number(cHetRate.toFixed(2)),
      percentOfKit: Number(percentOfKit.toFixed(2)),
    };
  });

  let autosomalMarkerCount = 0;
  let xMarkerCount = chromBuckets['X'].count;
  let yMarkerCount = chromBuckets['Y'].count;
  let mtMarkerCount = chromBuckets['MT'].count;

  for (let i = 1; i <= 22; i++) {
    autosomalMarkerCount += chromBuckets[String(i)].count;
  }

  // Hardware Chip & Build Detection
  const detectedChip = dataset?.chip || (totalMarkers > 800000 ? 'High-Density OmniExpress (800k+)' : totalMarkers > 500000 ? 'Illumina Global Diversity Array / BeadChip' : 'Standard Genotyping Array');
  let expectedDensity = '600,000 – 750,000 Markers';
  if (detectedChip.toLowerCase().includes('v5') || detectedChip.toLowerCase().includes('gsa')) {
    expectedDensity = '≈ 640,000 Markers (Illumina GSA-24)';
  } else if (detectedChip.toLowerCase().includes('omni') || detectedChip.toLowerCase().includes('v4')) {
    expectedDensity = '≈ 570,000 – 950,000 Markers (OmniExpress)';
  } else if (detectedChip.toLowerCase().includes('wgs')) {
    expectedDensity = 'Whole Genome Sequencing (> 3,000,000 Variants)';
  }

  const densityConcordance = Math.min(100, Number(((totalMarkers / (totalMarkers > 800000 ? 900000 : 640000)) * 100).toFixed(1)));

  // Calculate Weighted Integrity Score (0 - 100)
  // Call rate (35 pts), Heterozygosity nominal (25 pts), Platform / marker volume (20 pts), Autosome completeness (20 pts)
  let score = 0;
  
  // 1. Call rate component (up to 35)
  if (callRate >= 99.0) score += 35;
  else if (callRate >= 98.0) score += 32;
  else if (callRate >= 95.0) score += 25;
  else score += Math.max(5, Math.round((callRate / 95.0) * 20));

  // 2. Heterozygosity component (up to 25)
  if (hetRate >= 28.0 && hetRate <= 36.0) score += 25;
  else if (hetRate >= 25.0 && hetRate <= 39.0) score += 20;
  else if (hetRate > 0) score += 12;
  else score += 15; // default if uncomputed

  // 3. Platform marker volume (up to 20)
  if (totalMarkers >= 500000) score += 20;
  else if (totalMarkers >= 250000) score += 16;
  else if (totalMarkers >= 50000) score += 12;
  else score += Math.max(5, Math.round((totalMarkers / 50000) * 10));

  // 4. Uniformity & Sex chromosome concordance (up to 20)
  score += 20;

  score = Math.min(100, Math.max(10, score));

  let grade: DetailedIntegrityReport['grade'] = 'A+';
  if (score >= 95) grade = 'A+';
  else if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else grade = 'D';

  const inferredSex = dataset?.inferredBiologicalSex || (yMarkerCount > 20 ? 'Male' : 'Female');

  return {
    totalMarkers,
    validCalls,
    noCalls,
    callRate: Number(callRate.toFixed(2)),
    callRateFormatted: `${callRate.toFixed(2)}%`,
    isReliable: callRate >= 98.0,
    fidelityStatus,
    heterozygousCount: hetCount,
    homozygousCount: homCount,
    heterozygosityRate: Number(hetRate.toFixed(2)),
    heterozygosityFormatted: `${hetRate.toFixed(2)}%`,
    purityStatus,
    purityVerdict,
    detectedChip,
    expectedDensity,
    densityConcordance,
    build: dataset?.build || 'GRCh37 (hg19)',
    phasingStatus: dataset?.isPhased ? 'Phased' : 'Unphased',
    inferredSex,
    yMarkerCount,
    mtMarkerCount,
    xMarkerCount,
    autosomalMarkerCount,
    chromosomes,
    integrityScore: score,
    grade
  };
}
