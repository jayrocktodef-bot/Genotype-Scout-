import { getAncientMarkers } from '../data/GenomicDataService';
import masterAncient from '../data/master_ancient_profiles.json';

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
  const samples = [
    ...Object.values(masterAncient.samples).filter(s => (s as any).id),
    ...(masterAncient as any).matches
  ];
  
    // Weights for importance of specific markers (Deep Ancestry Diagnostic Weights)
    const markerImportance: Record<string, number> = {
      "rs1426654": 20.0, // SLC24A5 (Critically diagnostic for West Eurasian vs African)
      "rs16891982": 18.0, // SLC45A2 
      "rs12913832": 15.0, // HERC2
      "rs3827760": 20.0,  // EDAR (East Asian specific)
      "rs16139": 18.0,    // African diagnostic
      "rs2814778": 20.0,  // Duffy Null (Sub-Saharan African fixated)
      "rs1042531": 10.0,
      "rs1042602": 10.0,
      "rs1800414": 12.0,  // OCA2
      "rs4988235": 10.0,  // MCM6 (Lactase)
      "rs334": 25.0       // HBB (Extreme forensic weight for Diaspora migration)
    };

  const results = samples.map((sample: any) => {
    let totalDistance = 0;
    let markersCompared = 0;
    let weightedDistance = 0;
    let maxPossibleWeightedDistance = 0;
    
    const sampleSnps = sample.snps || sample.genotypes || {};
    
    Object.entries(sampleSnps).forEach(([rsid, sampleGenotype]) => {
      const userGenotype = userGenotypes[rsid];
      if (userGenotype && sampleGenotype) {
        markersCompared++;
        const weight = markerImportance[rsid] || 1.0;
        
        // Calculate Allelic Distance (IBS)
        // 0: Identical, 1: Half-match (Heg/Hom), 2: Complete Mismatch
        let distance = 0;
        const u = (userGenotype as string).split('');
        const s = (sampleGenotype as string).split('');
        
        // Perfect match
        if (userGenotype === sampleGenotype) {
          distance = 0;
        } else {
          // Check shared alleles
          const shared = u.filter((allele, index) => {
            const matchIndex = s.indexOf(allele);
            if (matchIndex !== -1) {
              s.splice(matchIndex, 1);
              return true;
            }
            return false;
          });
          
          distance = 2 - shared.length;
        }
        
        weightedDistance += distance * weight;
        maxPossibleWeightedDistance += 2 * weight;
        totalDistance += distance;
      }
    });
    
    // Affinity Score: 100% - normalized weighted distance
    const affinity = maxPossibleWeightedDistance > 0 
      ? Math.max(0, 100 * (1 - (weightedDistance / maxPossibleWeightedDistance))) 
      : 0;
    
    return {
      popCode: sample.id,
      popName: sample.name,
      score: affinity,
      distance: weightedDistance, // Low = closer
      description: sample.description,
      period: sample.period,
      region: sample.region,
      matchingMarkers: Object.keys(sampleSnps).filter(rsid => userGenotypes[rsid] && userGenotypes[rsid] === sampleSnps[rsid]).length,
      culture: sample.culture_name || sample.culture,
      age_bp: sample.age_bp
    } as AncientSampleMatch & { distance: number };
  });
  
  // Order from closest (lowest weighted distance) to furthest
  return results
    .filter(r => r.matchingMarkers > 0)
    .sort((a, b) => a.distance - b.distance);
};
