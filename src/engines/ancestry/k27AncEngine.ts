import hoReferenceKernel from '../../data/raw_aims/ho_modern_reference_kernel.json';

export interface AdmixtureComponent {
  population: string;
  region: string;
  percentage: number;
  distance: number;
}

/**
 * K27 Modern Ancestry Engine
 * Uses 27 MDLP components to estimate high-resolution ancestry proportions.
 */
export async function calculateK27Scores(userSnps: Record<string, string>): Promise<AdmixtureComponent[]> {
  const components: AdmixtureComponent[] = [];
  
  // Normalize user SNPs keys
  const normalizedUserSnps: Record<string, string> = {};
  for (const rsid in userSnps) {
    normalizedUserSnps[rsid.toLowerCase()] = userSnps[rsid];
  }

  const affinities: Record<string, number> = {};
  let totalAffinity = 0;

  for (const popName in hoReferenceKernel) {
    const popData = (hoReferenceKernel as any)[popName];
    let score = 0;
    let markersMatched = 0;
    const frequencies = popData.frequencies;

    for (const rsid in frequencies) {
      const refFreq = frequencies[rsid];
      const userCall = normalizedUserSnps[rsid.toLowerCase()];
      
      if (!userCall || userCall.length !== 2) continue;

      // Numerical genotype (0, 1, or 2 alleles of a certain type)
      // Since we don't have the exact allele orientation for every kernel, 
      // we'll assume the frequency corresponds to a consistent 'secondary' allele.
      // A more robust way is to check the proximity.
      
      let userVal = 0;
      if (userCall[0] === userCall[1]) {
        // Homozygous: could be 0 or 1 dosage.
        // We look at which is more likely given the population frequency.
        // This is a heuristic for when we don't have the full allele map.
        userVal = refFreq > 0.5 ? 1.0 : 0.0;
      } else {
        // Heterozygous
        userVal = 0.5;
      }

      // Log-likelihood or simpler similarity
      const diff = 1.0 - Math.abs(userVal - refFreq);
      score += Math.log(diff + 0.01); // avoid log(0)
      markersMatched++;
    }

    if (markersMatched > 0) {
      // Normalize score by markers matched
      const normalizedScore = Math.exp(score / markersMatched);
      affinities[popName] = normalizedScore;
      totalAffinity += normalizedScore;
    }
  }

  // Convert to percentages
  if (totalAffinity > 0) {
    for (const popName in affinities) {
      const percentage = (affinities[popName] / totalAffinity) * 100;
      if (percentage > 0.5) { // Filter small noise
        components.push({
          population: popName.replace(/-/g, ' '),
          region: (hoReferenceKernel as any)[popName].region,
          percentage: Number(percentage.toFixed(2)),
          distance: 1.0 - (affinities[popName] / totalAffinity) // Placeholder for 'distance' UI
        });
      }
    }
  }

  return components.sort((a, b) => b.percentage - a.percentage);
}
