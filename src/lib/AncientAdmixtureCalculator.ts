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

export interface ArchaicVariantDetail {
  rsid: string;
  gene: string;
  trait: string;
  userGenotype: string;
  derivedAllele: string;
  ancestralAllele: string;
  source: 'Neanderthal' | 'Denisovan';
  hasDerived: boolean;
  history: string;
}

export interface ArchaicIntrogressionResult {
  score: number;
  comparedMarkers: number;
  carriedAlleles: number;
  details: ArchaicVariantDetail[];
}

export const calculateAncientAdmixture = (userGenotypes: Record<string, string>) => {
  const markers = getAncientMarkers();
  const markersList = Object.entries(markers).filter(([rsid]) => !rsid.startsWith('_'));
  const metadata = (markers as any)._metadata?.ancient_populations || {};

  const archaicPops = ['Neanderthal', 'Denisovan'];
  const popCodes = Object.keys(metadata).filter(code => !archaicPops.includes(code));

  // Initialize log-likelihoods and counts
  const logLikelihoods: Record<string, number> = {};
  const markerCounts: Record<string, number> = {};
  
  popCodes.forEach(code => {
    logLikelihoods[code] = 0;
    markerCounts[code] = 0;
  });

  // Map frequency category strings to estimated allele frequencies (p)
  const getFreqValue = (freq: string): number => {
    switch (freq?.toLowerCase()) {
      case 'fixed': return 1.0;
      case 'high': return 0.9;
      case 'moderate':
      case 'variable': return 0.5;
      case 'low': return 0.2;
      case 'rare': return 0.05;
      case 'absent': return 0.0;
      default: return 0.0;
    }
  };

  markersList.forEach(([rsid, marker]) => {
    const userGenotype = userGenotypes[rsid];
    if (!userGenotype || userGenotype === '--') return;

    // Skip archaic markers for the Holocene admixture
    if (marker.introgression || (marker.ancient_context && Object.keys(marker.ancient_context).every(k => archaicPops.includes(k)))) {
      return;
    }

    const derivedAllele = marker.derived_allele;
    if (!derivedAllele) return;

    // Count derived alleles (0, 1, or 2)
    let derivedCount = 0;
    if (userGenotype.length === 1) {
      if (userGenotype === derivedAllele) derivedCount = 2;
    } else if (userGenotype.length === 2) {
      if (userGenotype[0] === derivedAllele) derivedCount++;
      if (userGenotype[1] === derivedAllele) derivedCount++;
    }

    popCodes.forEach(popCode => {
      const context = marker.ancient_context?.[popCode];
      const p = context ? getFreqValue(context.frequency) : 0.0;
      
      // Apply Laplace smoothing to keep frequencies strictly within [0.01, 0.99]
      const adjP = Math.max(0.01, Math.min(0.99, p));
      
      // Calculate Hardy-Weinberg genotype probabilities
      let prob = 1.0;
      if (derivedCount === 2) {
        prob = adjP * adjP;
      } else if (derivedCount === 1) {
        prob = 2 * adjP * (1 - adjP);
      } else {
        prob = (1 - adjP) * (1 - adjP);
      }

      logLikelihoods[popCode] += Math.log(prob);
      markerCounts[popCode] += 1;
    });
  });

  // Convert log-likelihoods to relative percentages using Softmax normalization
  const maxLog = Math.max(...Object.values(logLikelihoods));
  const relProbs: Record<string, number> = {};
  let sumRelProbs = 0;

  popCodes.forEach(code => {
    const rel = Math.exp(logLikelihoods[code] - maxLog);
    relProbs[code] = rel;
    sumRelProbs += rel;
  });

  const finalMatches: AncientSampleMatch[] = popCodes
    .map(popCode => {
      const popInfo = metadata[popCode] || {};
      const score = sumRelProbs > 0 ? (relProbs[popCode] / sumRelProbs) * 100 : 0;
      
      return {
        popCode,
        popName: popInfo.name || popCode,
        score,
        description: popInfo.description || '',
        period: popInfo.period || '',
        region: popInfo.region || '',
        matchingMarkers: markerCounts[popCode] || 0
      };
    })
    .sort((a, b) => b.score - a.score);

  return finalMatches;
};

export const calculateArchaicIntrogression = (userGenotypes: Record<string, string>): ArchaicIntrogressionResult => {
  const markers = getAncientMarkers();
  const markersList = Object.entries(markers).filter(([rsid]) => !rsid.startsWith('_'));
  
  let comparedMarkers = 0;
  let carriedAlleles = 0;
  const details: ArchaicVariantDetail[] = [];

  markersList.forEach(([rsid, marker]) => {
    const source = marker.introgression?.source || 
      (marker.ancient_context && Object.keys(marker.ancient_context).includes('Neanderthal') ? 'Neanderthal' : null);
      
    if (!source) return;

    const userGenotype = userGenotypes[rsid];
    if (!userGenotype || userGenotype === '--') return;

    comparedMarkers++;
    const derivedAllele = marker.derived_allele;
    const ancestralAllele = marker.ancestral_allele || '';

    let userCarriedCount = 0;
    if (userGenotype.length === 1) {
      if (userGenotype === derivedAllele) userCarriedCount = 2;
    } else if (userGenotype.length === 2) {
      if (userGenotype[0] === derivedAllele) userCarriedCount++;
      if (userGenotype[1] === derivedAllele) userCarriedCount++;
    }

    carriedAlleles += userCarriedCount;
    const hasDerived = userCarriedCount > 0;

    details.push({
      rsid,
      gene: marker.gene || 'Unknown',
      trait: marker.trait || 'Archaic Variant',
      userGenotype,
      derivedAllele,
      ancestralAllele,
      source: source as 'Neanderthal' | 'Denisovan',
      hasDerived,
      history: marker.history || ''
    });
  });

  const maxPossible = 2 * comparedMarkers;
  const score = maxPossible > 0 ? (carriedAlleles / maxPossible) * 100 : 0;

  return {
    score,
    comparedMarkers,
    carriedAlleles,
    details
  };
};

export const calculateIndividualMatches = (userGenotypes: Record<string, string>) => {
  const samples = [
    ...Object.values(masterAncient.samples).filter(s => (s as any).id),
    ...(masterAncient as any).matches
  ];
  
  const markerImportance: Record<string, number> = {
    "rs1426654": 20.0,
    "rs16891982": 18.0,
    "rs12913832": 15.0,
    "rs3827760": 20.0,
    "rs16139": 18.0,
    "rs2814778": 20.0,
    "rs1042531": 10.0,
    "rs1042602": 10.0,
    "rs1800414": 12.0,
    "rs4988235": 10.0,
    "rs334": 25.0
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
        
        let distance = 0;
        const u = (userGenotype as string).split('');
        const s = (sampleGenotype as string).split('');
        
        if (userGenotype === sampleGenotype) {
          distance = 0;
        } else {
          const shared = u.filter((allele) => {
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
    
    const affinity = maxPossibleWeightedDistance > 0 
      ? Math.max(0, 100 * (1 - (weightedDistance / maxPossibleWeightedDistance))) 
      : 0;
    
    return {
      popCode: sample.id,
      popName: sample.name,
      score: affinity,
      distance: weightedDistance,
      description: sample.description,
      period: sample.period,
      region: sample.region,
      matchingMarkers: Object.keys(sampleSnps).filter(rsid => userGenotypes[rsid] && userGenotypes[rsid] === sampleSnps[rsid]).length,
      culture: sample.culture_name || sample.culture,
      age_bp: sample.age_bp
    } as AncientSampleMatch & { distance: number };
  });
  
  return results
    .filter(r => r.matchingMarkers > 0)
    .sort((a, b) => a.distance - b.distance);
};
