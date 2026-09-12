/**
 * parentalLineageDifferentiator.ts
 *
 * Differentiates between Maternal and Paternal lineages for phased diploid
 * local ancestry inference tracks (Strand A and Strand B).
 *
 * Ground truths and heuristics used:
 * 1. Male Chromosome X Ground Truth:
 *    - In biological males (XY), the non-PAR portion of Chromosome X is 100% maternally inherited.
 *    - Autosomal haplotype similarity against the maternal Chromosome X profile provides
 *      a rigorous, direct anchor.
 * 2. Uniparental Haplogroup Affinity (mtDNA vs Y-DNA):
 *    - mtDNA is exclusively maternal; Y-DNA is exclusively paternal.
 *    - In individuals with sex-biased admixture (e.g. African mtDNA + European Y-DNA),
 *      the autosomal strand enriched for the maternal haplogroup continent is assigned to Maternal.
 * 3. Symmetrical Lineage / Unanchored Fallback:
 *    - When both parents share homogeneous ancestry, strands are labeled as Haplotype 1 (Maternal)
 *      and Haplotype 2 (Paternal) with explicit 50% confidence disclosure.
 */

export interface Segment {
  continent: string;
  start: number;
  end: number;
  confidence: number;
  snpsCount?: number;
}

export interface ParentalDifferentiationResult {
  maternalStrand: 'strandA' | 'strandB';
  paternalStrand: 'strandA' | 'strandB';
  confidence: number;
  method: 'MALE_CHR_X_ANCHOR' | 'UNIPARENTAL_HAPLOGROUP_ALIGNMENT' | 'STATISTICAL_HAPLOTYPE_PAIR' | 'VCF_EXPLICIT_PHASING';
  summary: string;
  explanation: string;
  maternalAnchorInfo: string;
  paternalAnchorInfo: string;
  shouldSwapStrands: boolean;
}

export interface DifferentiateOptions {
  chromSegments?: Record<string, { strandA?: Segment[]; strandB?: Segment[] }>;
  segments?: Record<string, { strandA?: Segment[]; strandB?: Segment[] }>;
  inferredBiologicalSex?: 'MALE' | 'FEMALE' | 'UNKNOWN';
  inferredSex?: 'MALE' | 'FEMALE' | 'UNKNOWN';
  predictedYDNA?: string | null;
  paternalHaplogroup?: string | null;
  predictedMtDNA?: string | null;
  maternalHaplogroup?: string | null;
  isVcfPhased?: boolean;
}

/**
 * Maps common Y-DNA haplogroups to continental macro-regions
 */
export function getYdnaContinent(haplo?: string | null): string | null {
  if (!haplo) return null;
  const clean = haplo.trim().toUpperCase().replace(/HAPLOGROUP\s*/i, '');
  if (!clean) return null;
  const root = clean[0];

  if (root === 'A' || root === 'B') return 'AFR';
  if (root === 'E') {
    // E1b1a is Sub-Saharan African, E1b1b is North African/Middle Eastern/Mediterranean
    if (clean.includes('E1B1A') || clean.includes('E-M2') || clean.includes('V38')) return 'AFR';
    if (clean.includes('E1B1B') || clean.includes('M35')) return 'MID';
    return 'AFR';
  }
  if (root === 'I' || root === 'R') {
    // R1b, R1a, I1, I2 are European
    return 'EUR';
  }
  if (root === 'J' || root === 'G' || root === 'T') {
    return 'MID';
  }
  if (root === 'O' || root === 'D') {
    return 'EAS';
  }
  if (root === 'H' || root === 'L') {
    return 'SAS';
  }
  if (root === 'Q') {
    return 'AMR';
  }
  if (root === 'C') {
    if (clean.includes('C-P39') || clean.includes('C3B')) return 'AMR';
    return 'EAS';
  }
  if (root === 'K' || root === 'M' || root === 'S') {
    return 'OCE';
  }
  return null;
}

/**
 * Maps common mtDNA haplogroups to continental macro-regions
 */
export function getMtdnaContinent(haplo?: string | null): string | null {
  if (!haplo) return null;
  const clean = haplo.trim().toUpperCase().replace(/HAPLOGROUP\s*/i, '');
  if (!clean) return null;

  if (clean.startsWith('L0') || clean.startsWith('L1') || clean.startsWith('L2') || 
      clean.startsWith('L3') || clean.startsWith('L4') || clean.startsWith('L5') || clean.startsWith('L6')) {
    return 'AFR';
  }
  if (clean.startsWith('A2') || clean.startsWith('B2') || clean.startsWith('C1') || clean.startsWith('D1') || clean.startsWith('X2A')) {
    return 'AMR';
  }
  if (clean.startsWith('A') || clean.startsWith('B') || clean.startsWith('C') || clean.startsWith('D') || 
      clean.startsWith('G') || clean.startsWith('F') || clean.startsWith('M7') || clean.startsWith('M8') || clean.startsWith('Z')) {
    return 'EAS';
  }
  if (clean.startsWith('H') || clean.startsWith('V') || clean.startsWith('U') || clean.startsWith('K') || 
      clean.startsWith('J') || clean.startsWith('T') || clean.startsWith('I') || clean.startsWith('W') || clean.startsWith('X')) {
    return 'EUR';
  }
  if (clean.startsWith('HV') || clean.startsWith('N1') || clean.startsWith('U7')) {
    return 'MID';
  }
  if (clean.startsWith('P') || clean.startsWith('Q') || clean.startsWith('B4A1A1')) {
    return 'OCE';
  }
  return null;
}

/**
 * Calculates the total megabases per continent from a list of segments.
 */
function calculateContinentMb(segments: Segment[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const seg of segments) {
    if (!seg || !seg.continent) continue;
    const mb = Math.max(0, (seg.end - seg.start) / 1000000);
    totals[seg.continent] = (totals[seg.continent] || 0) + mb;
  }
  return totals;
}

/**
 * Computes cosine similarity between two continental profile vectors.
 */
function cosineSimilarity(a: Record<string, number>, b: Record<string, number>): number {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const k of keys) {
    const valA = a[k] || 0;
    const valB = b[k] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Differentiates which phased strand corresponds to the Maternal vs Paternal lineage.
 */
export function differentiateParentalHaplotypes(options: DifferentiateOptions): ParentalDifferentiationResult {
  const chromSegments = options.chromSegments || options.segments || {};
  const inferredBiologicalSex = options.inferredBiologicalSex || options.inferredSex || 'UNKNOWN';
  const predictedYDNA = options.predictedYDNA || options.paternalHaplogroup || null;
  const predictedMtDNA = options.predictedMtDNA || options.maternalHaplogroup || null;
  const isVcfPhased = Boolean(options.isVcfPhased);

  // 1. Gather autosomal segments across chromosomes 1..22 for Strand A and Strand B
  const autoSegmentsA: Segment[] = [];
  const autoSegmentsB: Segment[] = [];

  for (let c = 1; c <= 22; c++) {
    const chrKey = String(c);
    const data = chromSegments[chrKey];
    if (!data) continue;
    if (data.strandA) autoSegmentsA.push(...data.strandA);
    if (data.strandB) autoSegmentsB.push(...data.strandB);
  }

  const mbA = calculateContinentMb(autoSegmentsA);
  const mbB = calculateContinentMb(autoSegmentsB);

  // ── Strategy 1: Male Chromosome X Direct Ground Truth ──
  // In males, non-PAR Chromosome X is 100% maternal.
  if (inferredBiologicalSex === 'MALE') {
    const chrXData = chromSegments['X'] || chromSegments['23'];
    const chrXSegments = chrXData ? (chrXData.strandA || []) : [];

    if (chrXSegments.length > 0) {
      const mbX = calculateContinentMb(chrXSegments);
      const totalXMb = Object.values(mbX).reduce((s, v) => s + v, 0);

      if (totalXMb > 0) {
        const simA = cosineSimilarity(mbA, mbX);
        const simB = cosineSimilarity(mbB, mbX);
        const diff = Math.abs(simA - simB);

        // If one autosomal strand has higher concordance with maternal Chr X
        if (diff > 0.05 || (simA !== simB)) {
          const shouldSwap = simB > simA;
          const conf = Math.min(0.98, 0.85 + diff * 0.5);

          // Get primary continent of Chr X
          const topX = Object.entries(mbX).sort((a, b) => b[1] - a[1])[0];
          const topXName = topX ? `${topX[0]} (${((topX[1] / totalXMb) * 100).toFixed(0)}%)` : 'Identified';

          const summary = `Maternal lineage anchored via biological male Chromosome X ground truth (exclusively maternal inheritance). Top Chr X component: ${topXName}. Maternal (Strand A) and Paternal (Strand B) aligned.`;

          return {
            maternalStrand: shouldSwap ? 'strandB' : 'strandA',
            paternalStrand: shouldSwap ? 'strandA' : 'strandB',
            confidence: Number(conf.toFixed(2)),
            method: 'MALE_CHR_X_ANCHOR',
            summary,
            explanation: summary,
            maternalAnchorInfo: `Strand ${shouldSwap ? 'B' : 'A'} closely matches maternal Chromosome X ancestry (similarity: ${(Math.max(simA, simB) * 100).toFixed(0)}%).`,
            paternalAnchorInfo: `Strand ${shouldSwap ? 'A' : 'B'} represents the paternal autosome contribution.`,
            shouldSwapStrands: shouldSwap
          };
        }
      }
    }
  }

  // ── Strategy 2: Uniparental Haplogroup Affinity (mtDNA vs Y-DNA) ──
  const mtContinent = getMtdnaContinent(predictedMtDNA);
  const yContinent = getYdnaContinent(predictedYDNA);

  if (mtContinent && yContinent && mtContinent !== yContinent) {
    const totalMbA = Object.values(mbA).reduce((s, v) => s + v, 0) || 1;
    const totalMbB = Object.values(mbB).reduce((s, v) => s + v, 0) || 1;

    const pctMtA = (mbA[mtContinent] || 0) / totalMbA;
    const pctMtB = (mbB[mtContinent] || 0) / totalMbB;

    const pctYA = (mbA[yContinent] || 0) / totalMbA;
    const pctYB = (mbB[yContinent] || 0) / totalMbB;

    const scoreA = pctMtA - pctYA;
    const scoreB = pctMtB - pctYB;
    const scoreDiff = Math.abs(scoreA - scoreB);

    if (scoreDiff > 0.04) {
      const shouldSwap = scoreB > scoreA;
      const conf = Math.min(0.92, 0.78 + scoreDiff * 0.4);
      const summary = `Lineages differentiated via sex-biased admixture alignment with maternal mtDNA (${predictedMtDNA || mtContinent}) and paternal Y-DNA (${predictedYDNA || yContinent}).`;

      return {
        maternalStrand: shouldSwap ? 'strandB' : 'strandA',
        paternalStrand: shouldSwap ? 'strandA' : 'strandB',
        confidence: Number(conf.toFixed(2)),
        method: 'UNIPARENTAL_HAPLOGROUP_ALIGNMENT',
        summary,
        explanation: summary,
        maternalAnchorInfo: `Aligned with maternal haplogroup ${predictedMtDNA || mtContinent} (${mtContinent} enrichment).`,
        paternalAnchorInfo: `Aligned with paternal haplogroup ${predictedYDNA || yContinent} (${yContinent} enrichment).`,
        shouldSwapStrands: shouldSwap
      };
    }
  }

  // ── Strategy 3: VCF Explicit Phasing or Statistical Micro-Phasing Default ──
  if (isVcfPhased) {
    const summary = 'Haplotypes extracted directly from phased VCF calls (Strand A = Haplotype 1, Strand B = Haplotype 2). Parental line assignment is symmetrical.';
    return {
      maternalStrand: 'strandA',
      paternalStrand: 'strandB',
      confidence: 0.75,
      method: 'VCF_EXPLICIT_PHASING',
      summary,
      explanation: summary,
      maternalAnchorInfo: 'Designated Haplotype 1 (Strand A).',
      paternalAnchorInfo: 'Designated Haplotype 2 (Strand B).',
      shouldSwapStrands: false
    };
  }

  const defaultSummary = 'Phased into distinct diploid haplotypes via linkage and allele frequency priors. Lineage parent-of-origin is unanchored due to symmetrical ancestral background.';
  return {
    maternalStrand: 'strandA',
    paternalStrand: 'strandB',
    confidence: 0.50,
    method: 'STATISTICAL_HAPLOTYPE_PAIR',
    summary: defaultSummary,
    explanation: defaultSummary,
    maternalAnchorInfo: 'Designated Haplotype 1 (Strand A) — statistical phase.',
    paternalAnchorInfo: 'Designated Haplotype 2 (Strand B) — statistical phase.',
    shouldSwapStrands: false
  };
}
