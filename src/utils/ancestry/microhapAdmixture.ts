import microHapKernel from '../../data/raw_aims/microhap_top100_kernel.json';
import { solveAdmixtureProportions } from '../../components/ancestryOracleLogic';

export interface MicroHapResult {
  popCode: string;
  name: string;
  percentage: number;
  distance: number;
}

export interface MicroHapLocusCall {
  id: string;
  chrom: string;
  pos: number;
  snps: string[];
  typedSnps: string[];
  calledHaplotypes: string[];
  isHeterozygous: boolean;
  userGenotypes: Record<string, string>;
}

export interface MicroHapAdmixtureOutput extends Array<MicroHapResult> {
  detectedLoci: MicroHapLocusCall[];
  locusCount: number;
  totalSnpsTyped: number;
  proportions: Record<string, number>;
}

const POP_LABEL_MAP: Record<string, string> = {
  'EUR': 'European Reference (EUR)',
  'AFR': 'African Reference (AFR)',
  'EAS': 'East Asian Reference (EAS)',
  'SAS': 'South Asian Reference (SAS)',
  'AMR': 'Indigenous American Reference (AMR)'
};

const SUPER_POPS = ['AFR', 'EUR', 'EAS', 'SAS', 'AMR'] as const;

/**
 * Extracts and statistically phases detected Kenneth Kidd forensic microhaplotypes from user genotypes.
 */
export function getDetectedMicrohaplotypes(userSnps: Record<string, string>): MicroHapLocusCall[] {
  const normalizedSnps: Record<string, string> = {};
  for (const [k, v] of Object.entries(userSnps)) {
    if (!v) continue;
    const cleanG = v.toUpperCase().replace(/[^ACGT]/g, '');
    if (cleanG.length > 0) {
      normalizedSnps[k.toLowerCase()] = cleanG;
    }
  }

  const detectedLoci: MicroHapLocusCall[] = [];

  if (!Array.isArray(microHapKernel)) return detectedLoci;

  for (const k of microHapKernel as any[]) {
    const typedIndices: number[] = [];
    const typedSnps: string[] = [];
    const typedGeno: string[] = [];
    const userGenos: Record<string, string> = {};

    k.snps.forEach((rs: string, idx: number) => {
      const g = normalizedSnps[rs.toLowerCase()];
      if (g) {
        typedIndices.push(idx);
        typedSnps.push(rs);
        typedGeno.push(g.length === 1 ? g + g : g.slice(0, 2));
        userGenos[rs] = g;
      }
    });

    if (typedIndices.length === 0) continue;

    // Marginalize reference population frequencies for typed indices
    const marginalFreqs: Record<string, Record<string, number>> = {};
    SUPER_POPS.forEach(sp => {
      marginalFreqs[sp] = {};
      const popWeights = (k.weights as Record<string, Record<string, number>>)?.[sp] || {};
      for (const [fullHap, freq] of Object.entries(popWeights)) {
        let subHap = '';
        for (const idx of typedIndices) {
          subHap += fullHap[idx] || '';
        }
        if (subHap.length === typedIndices.length) {
          marginalFreqs[sp][subHap] = (marginalFreqs[sp][subHap] || 0) + freq;
        }
      }
    });

    const a1 = typedGeno.map(g => g[0]).join('');
    const a2 = typedGeno.map(g => g[1]).join('');
    let calledHaps: string[] = [];
    let isHet = false;

    if (a1 === a2) {
      calledHaps = [a1, a1];
    } else {
      isHet = true;
      const hetPositions: number[] = [];
      typedGeno.forEach((g, idx) => {
        if (g[0] !== g[1]) hetPositions.push(idx);
      });

      if (hetPositions.length <= 1) {
        calledHaps = [a1, a2];
      } else {
        const numCombos = 1 << hetPositions.length;
        let bestPair = [a1, a2];
        let bestScore = -1;
        for (let mask = 0; mask < (numCombos >> 1); mask++) {
          let hA = '';
          let hB = '';
          typedGeno.forEach((g, idx) => {
            const hIdx = hetPositions.indexOf(idx);
            if (hIdx === -1) {
              hA += g[0];
              hB += g[0];
            } else {
              const bit = (mask >> hIdx) & 1;
              hA += bit ? g[1] : g[0];
              hB += bit ? g[0] : g[1];
            }
          });
          let score = 0;
          SUPER_POPS.forEach(sp => {
            score += (marginalFreqs[sp][hA] || 0) * (marginalFreqs[sp][hB] || 0);
          });
          if (score > bestScore) {
            bestScore = score;
            bestPair = [hA, hB];
          }
        }
        calledHaps = bestPair;
      }
    }

    detectedLoci.push({
      id: k.id,
      chrom: String(k.chrom),
      pos: k.pos,
      snps: k.snps,
      typedSnps,
      calledHaplotypes: calledHaps,
      isHeterozygous: isHet,
      userGenotypes: userGenos
    });
  }

  return detectedLoci;
}

/**
 * Performs continental deconvolution across forensic microhaplotypes with diploid phase-awareness,
 * marginal likelihood weighting, and Patterson standardization.
 */
export function deconvolveMicrohaplotypes(userSnps: Record<string, string>): MicroHapAdmixtureOutput {
  const normalizedSnps: Record<string, string> = {};
  for (const [k, v] of Object.entries(userSnps)) {
    if (!v) continue;
    const cleanG = v.toUpperCase().replace(/[^ACGT]/g, '');
    if (cleanG.length > 0) {
      normalizedSnps[k.toLowerCase()] = cleanG;
    }
  }

  const detectedLoci: MicroHapLocusCall[] = [];
  const rawFeatures: Array<{
    dosage: number;
    weight: number;
    popFreqs: Record<string, number>;
  }> = [];

  let totalSnpsTyped = 0;

  if (Array.isArray(microHapKernel)) {
    for (const k of microHapKernel as any[]) {
      const typedIndices: number[] = [];
      const typedSnps: string[] = [];
      const typedGeno: string[] = [];
      const userGenos: Record<string, string> = {};

      k.snps.forEach((rs: string, idx: number) => {
        const g = normalizedSnps[rs.toLowerCase()];
        if (g) {
          typedIndices.push(idx);
          typedSnps.push(rs);
          typedGeno.push(g.length === 1 ? g + g : g.slice(0, 2));
          userGenos[rs] = g;
        }
      });

      if (typedIndices.length === 0) continue;

      totalSnpsTyped += typedIndices.length;

      // Marginalize population frequencies for typed indices
      const marginalFreqs: Record<string, Record<string, number>> = {};
      SUPER_POPS.forEach(sp => {
        marginalFreqs[sp] = {};
        const popWeights = (k.weights as Record<string, Record<string, number>>)?.[sp] || {};
        for (const [fullHap, freq] of Object.entries(popWeights)) {
          let subHap = '';
          for (const idx of typedIndices) {
            subHap += fullHap[idx] || '';
          }
          if (subHap.length === typedIndices.length) {
            marginalFreqs[sp][subHap] = (marginalFreqs[sp][subHap] || 0) + freq;
          }
        }
      });

      const a1 = typedGeno.map(g => g[0]).join('');
      const a2 = typedGeno.map(g => g[1]).join('');
      let calledHaps: string[] = [];
      let isHet = false;

      if (a1 === a2) {
        calledHaps = [a1, a1];
      } else {
        isHet = true;
        const hetPositions: number[] = [];
        typedGeno.forEach((g, idx) => {
          if (g[0] !== g[1]) hetPositions.push(idx);
        });

        if (hetPositions.length <= 1) {
          calledHaps = [a1, a2];
        } else {
          const numCombos = 1 << hetPositions.length;
          let bestPair = [a1, a2];
          let bestScore = -1;
          for (let mask = 0; mask < (numCombos >> 1); mask++) {
            let hA = '';
            let hB = '';
            typedGeno.forEach((g, idx) => {
              const hIdx = hetPositions.indexOf(idx);
              if (hIdx === -1) {
                hA += g[0];
                hB += g[0];
              } else {
                const bit = (mask >> hIdx) & 1;
                hA += bit ? g[1] : g[0];
                hB += bit ? g[0] : g[1];
              }
            });
            let score = 0;
            SUPER_POPS.forEach(sp => {
              score += (marginalFreqs[sp][hA] || 0) * (marginalFreqs[sp][hB] || 0);
            });
            if (score > bestScore) {
              bestScore = score;
              bestPair = [hA, hB];
            }
          }
          calledHaps = bestPair;
        }
      }

      detectedLoci.push({
        id: k.id,
        chrom: String(k.chrom),
        pos: k.pos,
        snps: k.snps,
        typedSnps,
        calledHaplotypes: calledHaps,
        isHeterozygous: isHet,
        userGenotypes: userGenos
      });

      const locusWeight = typedIndices.length >= 2 ? 1.5 : 1.0;

      if (!isHet) {
        const hap = calledHaps[0];
        const freqs: Record<string, number> = {};
        SUPER_POPS.forEach(sp => {
          freqs[sp] = (marginalFreqs[sp][hap] || 0) * 2.0;
        });
        rawFeatures.push({
          dosage: 2.0,
          weight: locusWeight,
          popFreqs: freqs
        });
      } else {
        const h1 = calledHaps[0];
        const h2 = calledHaps[1];

        const freqs1: Record<string, number> = {};
        const freqs2: Record<string, number> = {};
        SUPER_POPS.forEach(sp => {
          freqs1[sp] = (marginalFreqs[sp][h1] || 0) * 2.0;
          freqs2[sp] = (marginalFreqs[sp][h2] || 0) * 2.0;
        });

        rawFeatures.push({
          dosage: 1.0,
          weight: locusWeight,
          popFreqs: freqs1
        });
        rawFeatures.push({
          dosage: 1.0,
          weight: locusWeight,
          popFreqs: freqs2
        });
      }
    }
  }

  if (rawFeatures.length === 0) {
    const emptyOutput = [] as unknown as MicroHapAdmixtureOutput;
    emptyOutput.detectedLoci = [];
    emptyOutput.locusCount = 0;
    emptyOutput.totalSnpsTyped = 0;
    emptyOutput.proportions = {};
    return emptyOutput;
  }

  const M = rawFeatures.length;
  const userDosages = new Float32Array(M);
  const popExpectedDosages: Record<string, Float32Array> = {};
  SUPER_POPS.forEach(sp => {
    popExpectedDosages[sp] = new Float32Array(M);
  });
  const aimWeights = new Float32Array(M);

  rawFeatures.forEach((feat, idx) => {
    userDosages[idx] = feat.dosage;
    aimWeights[idx] = feat.weight;
    SUPER_POPS.forEach(sp => {
      popExpectedDosages[sp][idx] = feat.popFreqs[sp] ?? 0;
    });
  });

  const proportions = solveAdmixtureProportions(userDosages, popExpectedDosages, aimWeights);

  // Compute standardized vector distance to each superpopulation
  const distances: Record<string, number> = {};
  SUPER_POPS.forEach(sp => {
    let sumDiff = 0;
    for (let i = 0; i < M; i++) {
      const userF = userDosages[i] / 2.0;
      const popF = popExpectedDosages[sp][i] / 2.0;
      sumDiff += Math.abs(userF - popF);
    }
    distances[sp] = Number((sumDiff / Math.max(1, M)).toFixed(4));
  });

  const results: MicroHapResult[] = SUPER_POPS.map(popCode => ({
    popCode,
    name: POP_LABEL_MAP[popCode] || popCode,
    percentage: proportions[popCode] ?? 0,
    distance: distances[popCode] ?? 0.1
  })).sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return a.distance - b.distance;
  });

  const output = results as MicroHapAdmixtureOutput;
  output.detectedLoci = detectedLoci;
  output.locusCount = detectedLoci.length;
  output.totalSnpsTyped = totalSnpsTyped;
  output.proportions = proportions;

  return output;
}
