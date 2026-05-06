import { getAncientMarkers } from '../data/GenomicDataService';
import ancientSamples from '../data/reference/ancient_samples.json';

export interface AncientSampleMatch {
  popCode: string;
  popName: string;
  score: number;
  description: string;
  period: string;
  region: string;
  matchingMarkers: number;
  culture?: string;
  age_bp?: number;
}

export const calculateAncientAdmixture = (userGenotypes: Record<string, string>) => {
  const markers = getAncientMarkers();
  const markersList = Object.entries(markers).filter(([rsid]) => !rsid.startsWith('_'));
  
  const scores: Record<string, { total: number; count: number }> = {};
  const metadata = (markers as any)._metadata?.ancient_populations || {};

  markersList.forEach(([rsid, marker]) => {
    const userGenotype = userGenotypes[rsid];
    if (!userGenotype) return;

    Object.entries(marker.ancient_context).forEach(([popCode, context]) => {
      if (!scores[popCode]) scores[popCode] = { total: 0, count: 0 };
      
      // Calculate probability weight based on frequency category
      let weight = 0;
      if (context.frequency === 'high') weight = 1.0;
      else if (context.frequency === 'moderate') weight = 0.5;
      else if (context.frequency === 'rare') weight = 0.1;

      // Check if user has the derived allele
      const hasDerived = userGenotype.includes(marker.derived_allele);
      if (hasDerived) {
        scores[popCode].total += weight;
        scores[popCode].count += 1;
      }
    });
  });

  const finalMatches: AncientSampleMatch[] = Object.entries(scores)
    .map(([popCode, data]) => {
      const popInfo = metadata[popCode] || {};
      return {
        popCode,
        popName: popInfo.name || popCode,
        score: (data.total / (data.count || 1)) * 100,
        description: popInfo.description || '',
        period: popInfo.period || '',
        region: popInfo.region || '',
        matchingMarkers: data.count
      };
    })
    .sort((a, b) => b.score - a.score);

  return finalMatches;
};

export const calculateIndividualMatches = (userGenotypes: Record<string, string>) => {
  const samples = Object.values(ancientSamples).filter(s => (s as any).id);
  
  // Weights for importance of specific markers
  const markerImportance: Record<string, number> = {
    "rs1426654": 5.0, // SLC24A5
    "rs16891982": 4.0, // SLC45A2
    "rs12913832": 4.0, // HERC2
    "rs1042602": 3.0,
    "rs1800414": 3.0
  };

  const results = samples.map((sample: any) => {
    let weightedMatch = 0;
    let totalWeight = 0;
    
    Object.entries(sample.snps).forEach(([rsid, sampleGenotype]) => {
      const userGenotype = userGenotypes[rsid];
      if (userGenotype) {
        const weight = markerImportance[rsid] || 1.0;
        totalWeight += weight;
        
        // Simple distance instead of binary match
        // 0 match = 0, 1 match = 0.5, 2 matches = 1.0
        let matchScore = 0;
        let hits = 0;
        for (const char of userGenotype) {
          if ((sampleGenotype as string).includes(char)) hits++;
        }
        matchScore = hits / 2;
                
        weightedMatch += matchScore * weight;
      }
    });
    
    const affinity = totalWeight > 0 ? (weightedMatch / totalWeight) * 100 : 0;
    
    return {
      popCode: sample.id,
      popName: sample.name,
      score: affinity,
      description: sample.description,
      period: sample.period,
      region: sample.region,
      matchingMarkers: Object.keys(sample.snps).filter(rsid => userGenotypes[rsid] && userGenotypes[rsid] === sample.snps[rsid]).length,
      culture: sample.culture_name,
      age_bp: sample.age_bp
    } as AncientSampleMatch;
  });
  
  return results.sort((a, b) => b.score - a.score);
};
