/**
 * Genomic Masking & Signal Integrity Utilities
 * 
 * Provides bioinformatic guards for:
 * 1. Palindromic SNP strand-ambiguity (A/T and C/G unstranded array dropout).
 * 2. Multi-allelic & symbolic indel matching (D/I, -/+, <DEL>, <INS>).
 * 3. Y-chromosome ampliconic & AZF microdeletion region masking.
 * 4. NUMT (Nuclear Mitochondrial DNA Segment) masking for mtDNA deconvolution.
 */

export interface YAmpliconicInterval {
  name: string;
  startHg19: number;
  endHg19: number;
  startHg38: number;
  endHg38: number;
  description: string;
}

export const Y_AMPLICONIC_REGIONS: YAmpliconicInterval[] = [
  {
    name: 'AZFa',
    startHg19: 14380000,
    endHg19: 15260000,
    startHg38: 12280000,
    endHg38: 13160000,
    description: 'Azoospermia factor a (USP9Y, DDX3Y deletion hotspot)'
  },
  {
    name: 'AZFb',
    startHg19: 19900000,
    endHg19: 26000000,
    startHg38: 17800000,
    endHg38: 23900000,
    description: 'Azoospermia factor b (RBMY ampliconic repeat clusters)'
  },
  {
    name: 'AZFc_Palindromes',
    startHg19: 24600000,
    endHg19: 28100000,
    startHg38: 22500000,
    endHg38: 26000000,
    description: 'AZFc and palindromes P1-P8 (DAZ cluster, gr/gr, b2/b4 deletions)'
  }
];

/**
 * Checks if a genomic coordinate on chromosome Y falls within known
 * ampliconic palindromes or AZF microdeletion regions.
 */
export function isYAmpliconicRegion(posHg19?: number, posHg38?: number): boolean {
  for (const reg of Y_AMPLICONIC_REGIONS) {
    if (posHg19 && posHg19 >= reg.startHg19 && posHg19 <= reg.endHg19) return true;
    if (posHg38 && posHg38 >= reg.startHg38 && posHg38 <= reg.endHg38) return true;
  }
  return false;
}

/**
 * Tests if a mutation is palindromic (A <-> T or C <-> G).
 * In unstranded array data without flanking strand metadata, these mutations
 * cannot distinguish forward from reverse complement probe readouts.
 */
export function isPalindromicMutation(ancestral: string, derived: string): boolean {
  const anc = (ancestral || '').trim().toUpperCase();
  const der = (derived || '').trim().toUpperCase();

  if ((anc === 'A' && der === 'T') || (anc === 'T' && der === 'A')) return true;
  if ((anc === 'C' && der === 'G') || (anc === 'G' && der === 'C')) return true;

  return false;
}

export interface YParInterval {
  name: string;
  startHg19: number;
  endHg19: number;
  startHg38: number;
  endHg38: number;
}

export const Y_PAR_REGIONS: YParInterval[] = [
  {
    name: 'PAR1',
    startHg19: 10001,
    endHg19: 2781479,
    startHg38: 10001,
    endHg38: 2781479
  },
  {
    name: 'PAR2',
    startHg19: 56887903,
    endHg19: 57217415,
    startHg38: 56887903,
    endHg38: 57217415
  }
];

/**
 * Checks if a coordinate on chromosome Y falls within Pseudoautosomal Regions (PAR1 or PAR2).
 * Variants in PAR recombine with X and must be excluded from non-recombining Y (NRY) haplogroup trees.
 */
export function isYPARRegion(posHg19?: number, posHg38?: number): boolean {
  for (const par of Y_PAR_REGIONS) {
    if (posHg19 && posHg19 >= par.startHg19 && posHg19 <= par.endHg19) return true;
    if (posHg38 && posHg38 >= par.startHg38 && posHg38 <= par.endHg38) return true;
  }
  return false;
}

/**
 * Flexible genotype matching supporting standard single-base nucleotides,
 * haploid hemizygous representations (single 'A' or pseudo-homozygous 'AA'),
 * IUPAC ambiguity codes, and multi-vendor indel notations.
 */
export function matchGenotypeAllele(userGenotype: string, targetAllele: string): boolean {
  if (!userGenotype || !targetAllele) return false;

  const u = userGenotype.trim().toUpperCase();
  const t = targetAllele.trim().toUpperCase();

  // 1. Direct equality
  if (u === t) return true;

  // 2. IUPAC ambiguity codes mapping
  const IUPAC_EXPANSION: Record<string, string> = {
    'R': 'AG', 'Y': 'CT', 'S': 'GC', 'W': 'AT', 'K': 'GT', 'M': 'AC',
    'B': 'CGT', 'D': 'AGT', 'H': 'ACT', 'V': 'ACG', 'N': 'ACGT'
  };

  if (u.length === 1 && IUPAC_EXPANSION[u]) {
    return IUPAC_EXPANSION[u].includes(t);
  }

  // 3. Haploid single-letter / pseudo-homozygous match ('A' or 'AA' matches target 'A')
  // Note: Heterozygous calls on non-PAR Y chromosome ('AG') are probe artifacts/noise and are excluded.
  if (u.length === 2 && u[0] === u[1] && u[0] === t) return true;
  if (u.length === 1 && u === t) return true;

  // 4. Deletion normalization
  const isUserDel = (
    u === 'D' ||
    u === 'DD' ||
    u === 'DEL' ||
    u === '-' ||
    u === '--' ||
    u === '<DEL>' ||
    u === '*'
  );
  const isTargetDel = (
    t === 'D' ||
    t === 'DEL' ||
    t === '-' ||
    t === '<DEL>' ||
    t === '*' ||
    t.startsWith('DEL')
  );
  if (isUserDel && isTargetDel) return true;

  // 5. Insertion normalization
  const isUserIns = (
    u === 'I' ||
    u === 'II' ||
    u === 'INS' ||
    u === '+' ||
    u === '++' ||
    u === '<INS>'
  );
  const isTargetIns = (
    t === 'I' ||
    t === 'INS' ||
    t === '+' ||
    t === '<INS>' ||
    t.startsWith('INS')
  );
  if (isUserIns && isTargetIns) return true;

  return false;
}

/**
 * Known autosomal NUMT (Nuclear Mitochondrial DNA Segment) homology hotspots.
 * Variants in these mtDNA positions frequently exhibit spurious heteroplasmy or
 * false calls due to co-amplification of ancient nuclear pseudogenes.
 */
export const NUMT_HOTSPOT_INTERVALS = [
  { start: 4761, end: 5600, name: 'Chr1-NUMT', desc: 'Chr 1p36.33 large NUMT insertion' },
  { start: 8281, end: 8289, name: '9-bp COII/tRNA-Lys', desc: 'Common 9-bp deletion/NUMT region' },
  { start: 8300, end: 9100, name: 'Chr5-NUMT', desc: 'Chr 5q14 high-homology pseudogene' },
  { start: 16024, end: 16383, name: 'Chr17-Dloop-NUMT', desc: 'Chr 17 D-loop pseudo-translocation' }
];

export function isPotentialNumtLocus(mtPos: number): boolean {
  return NUMT_HOTSPOT_INTERVALS.some(h => mtPos >= h.start && mtPos <= h.end);
}
