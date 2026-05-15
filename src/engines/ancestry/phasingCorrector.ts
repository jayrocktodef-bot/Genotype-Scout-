
import { LAIResults } from './rfmixTypeScript';

/**
 * identifyTracts returns an Int32Array of assignment indices.
 * But we might want the smoothedProbs to get the max pop.
 */
function getMaxPop(probs: Float32Array, windowIdx: number, nPopulations: number): number {
  let maxProb = -1;
  let maxPop = 0;
  for (let p = 0; p < nPopulations; p++) {
    const prob = probs[windowIdx * nPopulations + p];
    if (prob > maxProb) {
      maxProb = prob;
      maxPop = p;
    }
  }
  return maxPop;
}

/**
 * correctPhasingErrors
 * Gnofix-style LAI-driven phasing feedback loop.
 * 
 * @param strandA - Array of alleles for Strand A
 * @param strandB - Array of alleles for Strand B
 * @param laiResultsA - Result of LAI run on Strand A
 * @param laiResultsB - Result of LAI run on Strand B
 * @param aimsDatabase - Dictionary/Map from master_aims_normalized.json
 * @param rsids - List of RSIDs matching the order of strands
 * @param markerToWindow - Mapping of marker index to window index
 * @param populations - Array of population codes (e.g., ['AFR', 'EUR', ...]) matching LAI indices
 */
export function correctPhasingErrors(
  strandA: string[],
  strandB: string[],
  laiResultsA: LAIResults,
  laiResultsB: LAIResults,
  aimsDatabase: Record<string, any>,
  rsids: string[],
  markerToWindow: number[],
  populations: string[]
): { strandA: string[], strandB: string[] } {
  const correctedA = [...strandA];
  const correctedB = [...strandB];
  let swaps = 0;

  for (let i = 0; i < rsids.length; i++) {
    const rsid = rsids[i].toLowerCase();
    const windowIdx = markerToWindow[i];
    
    // 1. Identify predicted ancestry for this window on both strands
    const popIdxA = getMaxPop(laiResultsA.smoothedProbs, windowIdx, populations.length);
    const popIdxB = getMaxPop(laiResultsB.smoothedProbs, windowIdx, populations.length);
    
    const popA = populations[popIdxA];
    const popB = populations[popIdxB];

    // If both strands are predicted as the same ancestry, swapping doesn't help based on ancestry alone
    if (popIdxA === popIdxB) continue;

    const markerData = aimsDatabase[rsid];
    if (!markerData || !markerData.frequencies) continue;

    const alleleA = correctedA[i];
    const alleleB = correctedB[i];

    // Heterozygous check (otherwise swap is pointless)
    if (alleleA === alleleB || alleleA === '?' || alleleB === '?') continue;

    // 2. Statistical likelihood check
    // In master_aims_normalized, 'frequencies' contains the frequency of the 'alleles' in the list.
    // If multiple alleles are provided, we'll assume it's the frequency of the first one or we match.
    const targetAllele = markerData.alleles[0];
    const freqA = markerData.frequencies[popA] || 0.01;
    const freqB = markerData.frequencies[popB] || 0.01;

    // Probability of seeing alleleA in popA
    const pA_a = (alleleA === targetAllele) ? freqA : (1 - freqA);
    // Probability of seeing alleleB in popB
    const pB_b = (alleleB === targetAllele) ? freqB : (1 - freqB);
    
    // Probability of seeing alleleA in popB
    const pB_a = (alleleA === targetAllele) ? freqB : (1 - freqB);
    // Probability of seeing alleleB in popA
    const pA_b = (alleleB === targetAllele) ? freqA : (1 - freqA);

    // Swap if: (current state is very unlikely) AND (swapped state is much more likely)
    const currentLikelihood = pA_a * pB_b;
    const swappedLikelihood = pA_b * pB_a;

    // Threshold: Only swap if the swapped state is significantly better (e.g., 20x more likely)
    if (swappedLikelihood > currentLikelihood * 20) {
      correctedA[i] = alleleB;
      correctedB[i] = alleleA;
      swaps++;
    }
  }

  console.log(`🧬 Phasing Corrector: Applied ${swaps} swaps based on LAI feedback.`);
  return { strandA: correctedA, strandB: correctedB };
}
