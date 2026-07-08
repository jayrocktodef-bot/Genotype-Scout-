import graf10kIndex from '../../data/raw_aims/graf_10k_index.json';
import { fetchJsonAsset } from '../fetchHelper';

export interface PopulationProximity {
  population: string;
  region: string;
  distance: number;          // Average negative log-likelihood per marker
  similarityScore: number;   // 0–100, higher is more similar
  markersCompared: number;
}

/**
 * Computes genetic similarity between a user and multiple populations
 * by comparing user allele genotypes against population allele frequencies
 * using a Hardy-Weinberg Genotype Likelihood model.
 */
export async function calculatePopulationProximity(
  userSnps: Record<string, string>
): Promise<PopulationProximity[]> {
  const hoReferenceKernel = await fetchJsonAsset('/data/ho_modern_reference_kernel.json');
  const results: PopulationProximity[] = [];

  // Normalize user SNP keys to lowercase for case-insensitive lookup
  const normalizedUserSnps: Record<string, string> = {};
  for (const rsid in userSnps) {
    normalizedUserSnps[rsid.toLowerCase()] = userSnps[rsid];
  }

  const complement = (base: string): string => {
    switch (base.toUpperCase()) {
      case 'A': return 'T';
      case 'T': return 'A';
      case 'C': return 'G';
      case 'G': return 'C';
      default: return base;
    }
  };

  const EPSILON = 1e-6;
  const D_MAX = 3.5; // Constant to scale average negative log-likelihood to a 0-100% score

  for (const popCode in hoReferenceKernel) {
    const popData = (hoReferenceKernel as any)[popCode];
    const frequencies: Record<string, number> = popData.frequencies;
    let sumLogP = 0;
    let validMarkers = 0;

    for (const rsid in frequencies) {
      const refFreq = frequencies[rsid]; // assuming ALT allele frequency
      const rawUserCall = normalizedUserSnps[rsid.toLowerCase()];

      // Require user call to be a valid diploid genotype
      if (!rawUserCall || rawUserCall.length !== 2) continue;

      const marker = (graf10kIndex as any)[rsid] ?? (graf10kIndex as any)[rsid.toUpperCase()];

      // If we cannot determine the reference/alternate alleles, skip to avoid guessing
      if (!marker || !marker.ref || !marker.alt) continue;

      const ref = marker.ref.toUpperCase();
      const alt = marker.alt.toUpperCase();

      let allele1 = rawUserCall[0].toUpperCase();
      let allele2 = rawUserCall[1].toUpperCase();

      // Resolve strand ambiguity
      if (
        (allele1 !== ref && allele1 !== alt) ||
        (allele2 !== ref && allele2 !== alt)
      ) {
        const comp1 = complement(allele1);
        const comp2 = complement(allele2);
        if (
          (comp1 === ref || comp1 === alt) &&
          (comp2 === ref || comp2 === alt)
        ) {
          allele1 = comp1;
          allele2 = comp2;
        } else {
          continue;
        }
      }

      // Compute dosage of the ALT allele (0, 0.5, or 1.0)
      let dosage = 0;
      if (allele1 === alt) dosage += 0.5;
      if (allele2 === alt) dosage += 0.5;

      // Hardy-Weinberg probability
      const safeP = Math.max(EPSILON, Math.min(refFreq, 1 - EPSILON));
      let prob = EPSILON;

      if (dosage === 1.0) {
        prob = safeP * safeP;
      } else if (dosage === 0.5) {
        prob = 2 * safeP * (1 - safeP);
      } else if (dosage === 0.0) {
        prob = (1 - safeP) * (1 - safeP);
      }

      sumLogP += Math.log(prob);
      validMarkers++;
    }

    if (validMarkers > 0) {
      const avgNegLogL = -sumLogP / validMarkers;
      // Map average negative log-likelihood to a highly descriptive 0-100% score
      const similarityScore = Math.max(0, 100 * (1 - avgNegLogL / D_MAX));

      results.push({
        population: popCode.replace(/_/g, ' '),
        region: popData.region,
        distance: avgNegLogL,
        similarityScore: Math.round(similarityScore * 100) / 100,
        markersCompared: validMarkers,
      });
    }
  }

  // Sort by highest similarity (closest genetic proximity)
  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
