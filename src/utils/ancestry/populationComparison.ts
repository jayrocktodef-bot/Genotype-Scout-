import hoReferenceKernel from '../../data/ancestry/ho_modern_reference_kernel.json';

export interface PopulationProximity {
  population: string;
  region: string;
  distance: number;
  similarityScore: number;
  markersCompared: number;
}

export function calculatePopulationProximity(userSnps: Record<string, string>): PopulationProximity[] {
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

      // Dosage Calculation
      // 0.5 for hetero, 1.0 or 0.0 for homo based on refFreq proximity
      let userDosage = 0.0;
      const c0 = userCall[0];
      const c1 = userCall[1];
      
      if (c0 !== c1) {
        userDosage = 0.5;
      } else {
        // Approximate homozygous dosage
        userDosage = refFreq > 0.5 ? 1.0 : 0.0; 
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
