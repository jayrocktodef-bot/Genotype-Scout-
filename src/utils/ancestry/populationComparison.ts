import graf10kIndex from '../../data/raw_aims/graf_10k_index.json';
import { fetchJsonAsset } from '../fetchHelper';

export interface PopulationProximity {
  population: string;
  region: string;
  distance: number;
  similarityScore: number;
  markersCompared: number;
}

export async function calculatePopulationProximity(userSnps: Record<string, string>): Promise<PopulationProximity[]> {
  const hoReferenceKernel = await fetchJsonAsset('/data/ho_modern_reference_kernel.json');
  const results: PopulationProximity[] = [];
  
  // Normalize user SNPs keys once
  const normalizedUserSnps: Record<string, string> = {};
  for (const rsid in userSnps) {
    normalizedUserSnps[rsid.toLowerCase()] = userSnps[rsid];
  }

  for (const popCode in hoReferenceKernel) {
    const popData = (hoReferenceKernel as any)[popCode];
    let totalEuclideanDistance = 0;
    let validMarkers = 0;
    const frequencies = popData.frequencies;

    for (const rsid in frequencies) {
      const refFreq = frequencies[rsid];
      const userCall = normalizedUserSnps[rsid.toLowerCase()];
      
      if (!userCall || userCall.length !== 2) continue;

      // Precise dosage calculation mapping alt/ref alleles using master_aims_normalized
      const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()];
      let userDosage = 0.0;
      const c0 = userCall[0].toUpperCase();
      const c1 = userCall[1].toUpperCase();

      if (marker) {
        const alt = marker.alt.toUpperCase();
        if (c0 === alt) userDosage += 0.5;
        if (c1 === alt) userDosage += 0.5;
      } else {
        // Fallback to frequency heuristic if marker details aren't in index
        if (c0 !== c1) {
          userDosage = 0.5;
        } else {
          userDosage = refFreq > 0.5 ? 1.0 : 0.0; 
        }
      }

      const diff = userDosage - refFreq;
      totalEuclideanDistance += (diff * diff);
      validMarkers++;
    }

    if (validMarkers > 0) {
      const meanDistance = Math.sqrt(totalEuclideanDistance / validMarkers);
      const similarityScore = Math.max(0, 100 - (meanDistance * 100));

      results.push({
        population: popCode.replace(/_/g, ' '),
        region: popData.region,
        distance: meanDistance,
        similarityScore: Math.round(similarityScore * 100) / 100,
        markersCompared: validMarkers
      });
    }
  }

  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
