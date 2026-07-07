import { getAncientMarkers } from '../data/GenomicDataService';
import masterAncient from '../data/master_ancient_profiles.json';
import { solveNNLS } from '../utils/nnls';
import ancientCladesFrequencies from '../data/raw_ancient/ancient_clades_frequencies.json';
import grafIndex from '../data/raw_aims/graf_10k_index.json';
import { fetchJsonAsset } from '../utils/fetchHelper';

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

const CLADE_INFO: Record<string, { name: string; region: string; period: string; description: string }> = {
  Yamnaya: {
    name: "Yamnaya Steppe Pastoralist",
    region: "Pontic Steppe",
    period: "Bronze Age (~3,300 BCE)",
    description: "Bronze Age nomadic herders who migrated from the Pontic-Caspian steppe, massively altering Europe's genetic landscape."
  },
  WHG: {
    name: "Western Hunter-Gatherer",
    region: "Europe",
    period: "Mesolithic (~8,000 BCE)",
    description: "Post-Ice Age hunter-gatherers of Europe, genetically characterized by dark skin and light/blue eyes."
  },
  EEF: {
    name: "Early European Farmer",
    region: "Anatolia / Europe",
    period: "Neolithic (~6,000 BCE)",
    description: "Neolithic agriculturalists who migrated from Anatolia, introducing farming and lighter skin alleles into Europe."
  },
  Ancient_East_Asian: {
    name: "Ancient East Asian / Paleo-Indian",
    region: "East Asia / Siberia",
    period: "Pleistocene (~15,000 BCE)",
    description: "Paleolithic hunter-gatherers of East Asia and Siberia, ancestral to modern East Asians and Native Americans."
  },
  Ancient_African: {
    name: "Ancient African",
    region: "Sub-Saharan Africa",
    period: "Paleolithic (~10,000 BCE)",
    description: "Deeply diverse hunter-gatherer and early agricultural lineages that did not experience the Out-of-Africa bottleneck."
  },
  Oceanian: {
    name: "Deep Oceanian / Sahul",
    region: "Sahul / Melanesia",
    period: "Pleistocene (~40,000 BCE)",
    description: "Lineages of early modern human migrations to Papua New Guinea and Australia, retaining high levels of Denisovan admixture."
  }
};

export const calculateAncientAdmixture = async (userGenotypes: Record<string, string>): Promise<AncientSampleMatch[]> => {
  const grafWeights = await fetchJsonAsset('/data/graf_10k_weights.json');
  const clades = Object.keys(CLADE_INFO);
  const A: number[][] = [];
  const b: number[] = [];
  const weights: number[] = [];
  let markersCompared = 0;

  // Normalized user SNPs
  const normalizedUserSnps: Record<string, string> = {};
  for (const rsid in userGenotypes) {
    if (userGenotypes[rsid] && userGenotypes[rsid] !== '--') {
      normalizedUserSnps[rsid.toLowerCase()] = userGenotypes[rsid];
    }
  }

  // Iterate over matched SNPs to build matrices for deconvolution
  Object.keys(grafIndex).forEach(rsid => {
    const genotype = normalizedUserSnps[rsid.toLowerCase()];
    if (!genotype || genotype.length !== 2) return;

    const marker = (grafIndex as any)[rsid];
    if (!marker) return;

    const ref = marker.ref.toUpperCase();
    const alt = marker.alt.toUpperCase();

    // Determine ALT allele dosage (0, 1, or 2)
    let uDosage = 0;
    if (genotype[0] === alt) uDosage++;
    if (genotype[1] === alt) uDosage++;

    // Compile expected dosages for all clades
    const popExpectations: number[] = Array(clades.length).fill(0);
    let validCount = 0;

    clades.forEach((clade, idx) => {
      let freq = 0.5; // fallback prior

      if (clade === "WHG" || clade === "EEF" || clade === "Yamnaya") {
        const cladeFreqs = (ancientCladesFrequencies as any)[rsid] || (ancientCladesFrequencies as any)[rsid.toLowerCase()];
        if (cladeFreqs && cladeFreqs[clade] !== undefined) {
          freq = cladeFreqs[clade];
          validCount++;
        }
      } else if (clade === "Ancient_East_Asian") {
        const w = (grafWeights as any)[rsid] || (grafWeights as any)[rsid.toLowerCase()];
        if (w) {
          const han = w["sgdp_han"] ?? 0.5;
          const jpt = w["sgdp_japanese"] ?? 0.5;
          const dai = w["sgdp_dai"] ?? 0.5;
          freq = (han + jpt + dai) / 3.0;
          validCount++;
        }
      } else if (clade === "Ancient_African") {
        const w = (grafWeights as any)[rsid] || (grafWeights as any)[rsid.toLowerCase()];
        if (w) {
          const yri = w["sgdp_yoruba"] ?? 0.5;
          const mbuti = w["sgdp_mbuti"] ?? 0.5;
          const san = w["sgdp_khomani_san"] ?? 0.5;
          freq = (yri + mbuti + san) / 3.0;
          validCount++;
        }
      } else if (clade === "Oceanian") {
        const w = (grafWeights as any)[rsid] || (grafWeights as any)[rsid.toLowerCase()];
        if (w) {
          const papuan = w["sgdp_papuan"] ?? w["sgdp_papuan.dg"] ?? 0.5;
          const boug = w["sgdp_bougainville"] ?? w["sgdp_bougainville.dg"] ?? 0.5;
          freq = (papuan + boug) / 2.0;
          validCount++;
        }
      }

      popExpectations[idx] = freq * 2.0; // expected continuous dosage [0, 2]
    });

    if (validCount > 0) {
      A.push(popExpectations);
      b.push(uDosage);
      weights.push(1.0); // uniform weight for global ancient markers
      markersCompared++;
    }
  });

  if (markersCompared < 5) {
    // Return empty results if insufficient marker coverage
    return [];
  }

  // To enforce sum(proportions) = 1, augment with a heavily weighted constraint row
  const P = clades.length;
  const LAMBDA = 1000;
  const A_aug = [...A];
  const b_aug = [...b];
  const w_aug = [...weights];

  const augRow = new Array(P).fill(LAMBDA);
  A_aug.push(augRow);
  b_aug.push(LAMBDA);
  w_aug.push(1.0);

  // Solve exact deconvolution using Lawson-Hanson NNLS
  const x = solveNNLS(A_aug, b_aug, w_aug);
  const sum = x.reduce((acc, val) => acc + val, 0);
  const normalized = sum > 0 ? x.map(val => val / sum) : x;

  const finalMatches: AncientSampleMatch[] = clades.map((clade, idx) => {
    const info = CLADE_INFO[clade];
    const score = normalized[idx] * 100;

    return {
      popCode: clade,
      popName: info.name,
      score: score,
      description: info.description,
      period: info.period,
      region: info.region,
      matchingMarkers: markersCompared
    };
  })
  .filter(r => r.score >= 0.1) // omit trace scores < 0.1%
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

    const userGenotype = userGenotypes[rsid] || userGenotypes[rsid.toLowerCase()] || userGenotypes[rsid.toUpperCase()];
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
  const rawSamples = [
    ...Object.values(masterAncient.samples).filter(s => (s as any).id),
    ...(masterAncient as any).matches
  ];
  
  const seenIds = new Set<string>();
  const samples: any[] = [];
  for (const s of rawSamples) {
    const id = s.id || s.sampleId;
    if (id && !seenIds.has(id)) {
      seenIds.add(id);
      samples.push(s);
    }
  }
  
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
      const userGenotype = userGenotypes[rsid] || userGenotypes[rsid.toLowerCase()] || userGenotypes[rsid.toUpperCase()];
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
      matchingMarkers: Object.keys(sampleSnps).filter(rsid => {
        const uG = userGenotypes[rsid] || userGenotypes[rsid.toLowerCase()] || userGenotypes[rsid.toUpperCase()];
        return uG && uG === sampleSnps[rsid];
      }).length,
      markersCompared: markersCompared,
      culture: sample.culture_name || sample.culture,
      age_bp: sample.age_bp
    } as AncientSampleMatch & { distance: number; markersCompared: number };
  });
  
  return results
    .filter(r => r.markersCompared > 0)
    .sort((a, b) => a.distance - b.distance);
};
