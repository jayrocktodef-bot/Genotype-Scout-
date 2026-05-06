import frequencies from '../data/reference/1000genomes_frequencies.json';

export interface PopulationProximity {
  code: string;
  name: string;
  region: string;
  similarity: number;
  markersMatched: number;
}

export function calculatePopulationProximity(userSnps: Record<string, string>): PopulationProximity[] {
  const populationScores: Record<string, { totalFreq: number; count: number }> = {};
  
  // Initialize population containers based on metadata
  const metadata = (frequencies as any)._metadata.populations;
  const popInfo: Record<string, { name: string; region: string }> = {};
  
  for (const [region, subPops] of Object.entries(metadata)) {
    for (const [code, info] of Object.entries(subPops as any)) {
      popInfo[code] = {
        name: (info as any).name,
        region: region as string
      };
      populationScores[code] = { totalFreq: 0, count: 0 };
    }
  }

  // Iterate through all markers in the frequency database
  for (const [rsid, data] of Object.entries(frequencies)) {
    if (rsid.startsWith('_')) continue;
    
    const userGenotype = userSnps[rsid.toLowerCase()] || userSnps[rsid];
    if (!userGenotype) continue;

    const normalizedUserGenotype = userGenotype.split('').sort().join('');
    
    const popFreqs = (data as any).populations;
    if (!popFreqs) continue;

    for (const [popCode, genotypes] of Object.entries(popFreqs)) {
      if (!populationScores[popCode]) continue;

      // Find the frequency of the user's genotype in this population
      // Handle both orderings (e.g. AG vs GA)
      let freq = 0;
      for (const [g, f] of Object.entries(genotypes as any)) {
        if (g.split('').sort().join('') === normalizedUserGenotype) {
          freq = f as number;
          break;
        }
      }

      populationScores[popCode].totalFreq += freq;
      populationScores[popCode].count += 1;
    }
  }

  // Convert to array and calculate final similarity percentage
  const results: PopulationProximity[] = Object.entries(populationScores)
    .filter(([_, data]) => data.count > 0)
    .map(([code, data]) => {
      const info = popInfo[code];
      return {
        code,
        name: info?.name || code,
        region: info?.region || 'Unknown',
        similarity: Math.round((data.totalFreq / data.count) * 100),
        markersMatched: data.count
      };
    });

  // Sort by similarity descending
  return results.sort((a, b) => b.similarity - a.similarity);
}
