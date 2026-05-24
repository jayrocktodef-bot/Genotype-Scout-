// src/utils/ancestry/subPopulationLogic.ts
import regionalWeights from '../../data/raw_aims/graf_10k_weights.json';
import grafIndex from '../../data/raw_aims/graf_10k_index.json';

const EUROPEAN_POPS = ["CEU", "GBR", "FIN", "IBS", "TSI"];
const EUROPEAN_BOOST = 1.05; // 5% boost for European fine-mapping

/**
 * Calculates the resonance (likelihood) of 26 sub-populations.
 * This is the core of the "Engine" mode for high-precision ethnicity.
 */
export function calculateSubPopResonance(userGenotypes: Record<string, string>) {
  const popScores: Record<string, number> = {};
  const populations = Object.keys(Object.values(regionalWeights)[0] || {});

  if (populations.length === 0) return [];

  populations.forEach(pop => popScores[pop] = 0);

  Object.entries(userGenotypes).forEach(([rsid, genotype]) => {
    const weights = (regionalWeights as any)[rsid];
    if (!weights) return;

    const marker = (grafIndex as any)[rsid];
    if (!marker) return;

    const ref = marker.ref;
    const alt = marker.alt;

    populations.forEach(pop => {
      // Clamp p to [0.0001, 0.9999] to prevent log(0) and extreme likelihoods
      const p = Math.max(0.0001, Math.min(0.9999, weights[pop] || 0.01)); 
      const q = 1 - p;               // Freq of Ref Allele
      
      let prob = 1e-6; // Laplacian smoothing
      
      // Determine if genotype matches ref/alt
      const isAltAlt = genotype === (alt + alt);
      const isRefRef = genotype === (ref + ref);
      const isHetero = genotype.length === 2 && 
                      ((genotype[0] === ref && genotype[1] === alt) || 
                       (genotype[0] === alt && genotype[1] === ref));

      if (isAltAlt) prob = p * p;
      else if (isHetero) prob = 2 * p * q;
      else if (isRefRef) prob = q * q;
      else {
        // Fallback for strand flips or mismatched data:
        // Try simple homozygous vs heterozygous check as a heuristic if strict base matching fails
        if (genotype.length === 2 && genotype[0] === genotype[1]) {
           prob = Math.max(p * p, q * q); 
        } else {
           prob = 2 * p * q;
        }
      }
      
      // Apply boost for European AIMs
      const boost = EUROPEAN_POPS.includes(pop) ? EUROPEAN_BOOST : 1.0;
      popScores[pop] += Math.log(prob) * boost;
    });
  });

  // Sort by highest log-likelihood (least negative)
  return Object.entries(popScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Return top 10 ethnic signatures for a broader look
}


