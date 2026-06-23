// src/utils/ancestry/subPopulationLogic.ts
import regionalWeights from '../../data/raw_aims/graf_10k_weights.json';
import grafIndex from '../../data/raw_aims/graf_10k_index.json';

const EUROPEAN_POPS = [
  "CEU", "GBR", "FIN", "IBS", "TSI"
];
const EUROPEAN_BOOST = 1.05; // 5% boost for European fine-mapping

// Helper for UI presentation of the real populations
export const POPULATION_NAMES: Record<string, string> = {
  "CEU": "Northwestern European (CEU)",
  "GBR": "British & Irish (GBR)",
  "FIN": "Finnish / Uralic (FIN)",
  "IBS": "Iberian (IBS)",
  "TSI": "Southern European / Italian (TSI)",
  "ACB": "African Caribbean (ACB)",
  "ASW": "African American (ASW)",
  "ESN": "Esan in Nigeria (ESN)",
  "GWD": "Gambian (GWD)",
  "LWK": "Luhya in Kenya (LWK)",
  "MSL": "Mende in Sierra Leone (MSL)",
  "YRI": "Yoruba in Nigeria (YRI)",
  "CDX": "Chinese Dai (CDX)",
  "CHB": "Han Chinese (CHB)",
  "CHS": "Southern Han Chinese (CHS)",
  "JPT": "Japanese (JPT)",
  "KHV": "Kinh in Vietnam (KHV)",
  "BEB": "Bengali (BEB)",
  "GIH": "Gujarati Indian (GIH)",
  "ITU": "Indian Telugu (ITU)",
  "PJL": "Punjabi (PJL)",
  "STU": "Sri Lankan Tamil (STU)",
  "CLM": "Colombian (CLM)",
  "MXL": "Mexican (MXL)",
  "PEL": "Peruvian (PEL)",
  "PUR": "Puerto Rican (PUR)"
};

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

    const ref = marker.ref.toUpperCase();
    const alt = marker.alt.toUpperCase();

    const getComplement = (b: string) => {
      const map: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
      return map[b] || b;
    };

    const compRef = getComplement(ref);
    const compAlt = getComplement(alt);

    populations.forEach(pop => {
      // Clamp p to [0.0001, 0.9999] to prevent log(0) and extreme likelihoods
      const p = Math.max(0.0001, Math.min(0.9999, weights[pop] || 0.01)); 
      const q = 1 - p;               // Freq of Ref Allele
      
      let prob = 1e-6; // Laplacian smoothing
      
      // Determine if genotype matches ref/alt on forward or complement strand
      const gUpper = genotype.toUpperCase();
      const isAltAlt = gUpper === (alt + alt) || gUpper === (compAlt + compAlt);
      const isRefRef = gUpper === (ref + ref) || gUpper === (compRef + compRef);
      const isHetero = gUpper.length === 2 && 
                      ((gUpper[0] === ref && gUpper[1] === alt) || 
                       (gUpper[0] === alt && gUpper[1] === ref) ||
                       (gUpper[0] === compRef && gUpper[1] === compAlt) || 
                       (gUpper[0] === compAlt && gUpper[1] === compRef));

      if (isAltAlt) prob = p * p;
      else if (isHetero) prob = 2 * p * q;
      else if (isRefRef) prob = q * q;
      else {
        // Fallback for strand flips or mismatched data (rarely hit now due to complement checks):
        // Try simple homozygous vs heterozygous check as a heuristic if strict base matching fails
        if (gUpper.length === 2 && gUpper[0] === gUpper[1]) {
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


