import graf10kIndex from '../../data/raw_aims/graf_10k_index.json';
import { fetchJsonAsset } from '../fetchHelper';

export interface PopulationProximity {
  population: string;
  region: string;
  distance: number;          // Euclidean distance in allele frequency space
  similarityScore: number;   // 0–100, higher is more similar
  markersCompared: number;
}

/**
 * Computes genetic similarity between a user and multiple populations
 * by comparing user allele dosages against population allele frequencies.
 *
 * Assumptions:
 * - popData.frequencies[rsid] contains the ALTERNATE allele frequency (0..1).
 * - user SNPs are bi-allelic, diploid calls of length 2.
 * - When no orientation info is available (missing from graf10kIndex),
 *   the SNP is excluded from comparison to avoid guessing.
 * - Distance metric: Euclidean distance un-normalised, then converted
 *   to a similarity score by scaling against max possible distance.
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

  for (const popCode in hoReferenceKernel) {
    const popData = (hoReferenceKernel as any)[popCode];
    const frequencies: Record<string, number> = popData.frequencies;
    let sumSquaredDiffs = 0;
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

      // Resolve strand ambiguity: if the user's alleles don't directly match
      // ref or alt, try their complements. If both complements match, we flip.
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
          // Ambiguous; safe to skip this marker
          continue;
        }
      }

      // Compute dosage of the ALT allele (0, 0.5, 1, 1.5, 2)
      // Assuming frequencies represent ALT frequency.
      let dosage = 0;
      if (allele1 === alt) dosage += 0.5;
      if (allele2 === alt) dosage += 0.5;

      const diff = dosage - refFreq;
      sumSquaredDiffs += diff * diff;
      validMarkers++;
    }

    if (validMarkers > 0) {
      // Standard Euclidean distance (not RMSD)
      const euclideanDistance = Math.sqrt(sumSquaredDiffs);

      // Max possible Euclidean distance if all differences were 1
      const maxPossibleDistance = Math.sqrt(validMarkers);
      // Similarity score: 0 = worst, 100 = identical frequencies
      const similarityScore = Math.max(
        0,
        100 * (1 - euclideanDistance / maxPossibleDistance)
      );

      results.push({
        population: popCode.replace(/_/g, ' '),
        region: popData.region,
        distance: euclideanDistance,
        similarityScore: Math.round(similarityScore * 100) / 100,
        markersCompared: validMarkers,
      });
    }
  }

  // Sort by highest similarity (closest genetic proximity)
  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
