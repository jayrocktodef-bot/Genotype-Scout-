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
  continent?: string;
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

export interface HomininSourceBreakdown {
  score: number;
  comparedMarkers: number;
  carriedAlleles: number;
  percentile: string;
}

export interface ArchaicIntrogressionResult {
  score: number;
  comparedMarkers: number;
  carriedAlleles: number;
  neanderthal: HomininSourceBreakdown;
  denisovan: HomininSourceBreakdown;
  details: ArchaicVariantDetail[];
}

const CLADE_INFO: Record<string, { name: string; region: string; continent: string; period: string; description: string; culture?: string }> = {
  WHG: {
    name: "Western Hunter-Gatherer",
    region: "Western/Central Europe",
    continent: "Europe",
    period: "Mesolithic (~15,000-5,000 BCE)",
    culture: "Loschbour / Cheddar Man",
    description: "Post-glacial foragers of Western Europe, genetically characterized by dark skin, bright blue eyes, and high physical endurance."
  },
  EHG: {
    name: "Eastern Hunter-Gatherer",
    region: "Eastern Europe / Samara / Urals",
    continent: "Europe",
    period: "Mesolithic (~13,000-5,000 BCE)",
    culture: "Karelia / Samara",
    description: "Robust cold-adapted hunter-fishers of the East European forest-steppe carrying high Ancient North Eurasian (ANE) ancestry."
  },
  ANF: {
    name: "Early Anatolian Farmer",
    region: "Anatolia / Aegean",
    continent: "Asia",
    period: "Neolithic (~8,500-4,000 BCE)",
    culture: "Çatalhöyük / Barcın",
    description: "First agriculturalists who domesticated wheat and barley in Anatolia, introducing sedentary farming and light skin alleles to Europe."
  },
  EEF: {
    name: "Early European Farmer",
    region: "Europe",
    continent: "Europe",
    period: "Neolithic (~6,000 BCE)",
    culture: "LBK / Cardial",
    description: "Neolithic farmers carrying predominantly Anatolian Farmer ancestry mixed with European hunter-gatherer lineages."
  },
  Yamnaya: {
    name: "Yamnaya Steppe Pastoralist",
    region: "Pontic-Caspian Steppe",
    continent: "Europe",
    period: "Bronze Age (~3,300-2,600 BCE)",
    culture: "Kurgan / Corded Ware",
    description: "Bronze Age nomadic horse herders and wagon pioneers who massively altered Eurasia's genetic landscape and spread Indo-European languages."
  },
  CHG: {
    name: "Caucasus Hunter-Gatherer",
    region: "Caucasus Mountains / Iran",
    continent: "Asia",
    period: "Upper Paleolithic (~13,000-6,000 BCE)",
    culture: "Kotias Klde / Satsurblia",
    description: "Deeply isolated mountain foragers of the Caucasus who contributed heavily to Yamnaya steppe pastoralists and Iranian farmers."
  },
  NAT: {
    name: "Natufian Sedentary Forager",
    region: "Levant / Middle East",
    continent: "Asia",
    period: "Epipaleolithic (~15,000-11,500 BCE)",
    culture: "Ain Mallaha / Levant",
    description: "First sedentary foragers of the Near East who harvested wild cereals and established the ancestral root of Middle Eastern agriculturalists."
  },
  Ancient_East_Asian: {
    name: "Ancient East Asian (Tianyuan)",
    region: "East Asia / Siberia",
    continent: "Asia",
    period: "Upper Paleolithic (~40,000-10,000 BCE)",
    culture: "Tianyuan / Jomon",
    description: "Deep ancestral lineage of East Asia and Beringia, ancestral to modern East Asians, Siberians, and Native Americans."
  },
  Ancient_Beringian: {
    name: "Ancient Beringian (Clovis)",
    region: "Beringia / North America",
    continent: "Americas",
    period: "Paleolithic (~20,000-11,000 BCE)",
    culture: "Anzick-1 / Clovis",
    description: "Ice-Age megafauna hunters who crossed the Bering Land Bridge, ancestral to nearly all Indigenous peoples of North and South America."
  },
  AASI: {
    name: "Ancient Ancestral South Indian",
    region: "South Asia / Deccan Plateau",
    continent: "Asia",
    period: "Pleistocene (~50,000-4,000 BCE)",
    culture: "Pre-Neolithic South Asia",
    description: "Indigenous hunter-gatherer lineage of the Indian subcontinent, representing one of the earliest Out-of-Africa expansions into Asia."
  },
  Ancient_African: {
    name: "Ancient African (Mota)",
    region: "Sub-Saharan Africa / Ethiopian Highlands",
    continent: "Africa",
    period: "Paleolithic (~10,000-2,000 BCE)",
    culture: "Mota Cave / Pre-Bantu",
    description: "Deeply diverse indigenous African hunter-gatherers predating both the Bantu expansion and back-migrations from Eurasia."
  },
  TAF: {
    name: "Taforalt (Iberomaurusian)",
    region: "North Africa / Maghreb",
    continent: "Africa",
    period: "Upper Paleolithic (~15,000-11,000 BCE)",
    culture: "Grotte des Pigeons",
    description: "Late Stone Age foragers of North Africa carrying a unique mixture of Sub-Saharan African and Natufian-like Eurasian lineages."
  },
  Oceanian: {
    name: "Deep Sahul / Oceanian",
    region: "Sahul / New Guinea / Australia",
    continent: "Oceania",
    period: "Pleistocene (~50,000-10,000 BCE)",
    culture: "Willandra Lakes / Kow Swamp",
    description: "Ancient lineages of early modern human expansion across Sahul, preserving high proportions of Denisovan archaic introgression."
  }
};

export const calculateAncientAdmixture = async (userGenotypes: Record<string, string>): Promise<AncientSampleMatch[]> => {
  const grafWeights = await fetchJsonAsset('/data/graf_10k_weights.json');
  const clades = Object.keys(CLADE_INFO);
  const A: number[][] = [];
  const b: number[] = [];
  const weights: number[] = [];
  let markersCompared = 0;

  const normalizedUserSnps: Record<string, string> = {};
  for (const rsid in userGenotypes) {
    if (userGenotypes[rsid] && userGenotypes[rsid] !== '--') {
      normalizedUserSnps[rsid.toLowerCase()] = userGenotypes[rsid];
    }
  }

  Object.keys(grafIndex).forEach(rsid => {
    const genotype = normalizedUserSnps[rsid.toLowerCase()];
    if (!genotype || genotype.length !== 2) return;

    const marker = (grafIndex as any)[rsid];
    if (!marker) return;

    const ref = marker.ref.toUpperCase();
    const alt = marker.alt.toUpperCase();

    let uDosage = 0;
    if (genotype[0] === alt) uDosage++;
    if (genotype[1] === alt) uDosage++;

    const popExpectations: number[] = [];
    let validAll = true;

    for (let idx = 0; idx < clades.length; idx++) {
      const clade = clades[idx];
      let freq: number | undefined;

      const cladeFreqs = (ancientCladesFrequencies as any)[rsid] || (ancientCladesFrequencies as any)[rsid.toLowerCase()];
      const w = (grafWeights as any)[rsid] || (grafWeights as any)[rsid.toLowerCase()];

      if (clade === "WHG") {
        freq = cladeFreqs?.["WHG"];
      } else if (clade === "EEF") {
        freq = cladeFreqs?.["EEF"] ?? cladeFreqs?.["ANF"];
      } else if (clade === "ANF") {
        freq = cladeFreqs?.["ANF"] ?? cladeFreqs?.["EEF"];
      } else if (clade === "Yamnaya") {
        freq = cladeFreqs?.["Yamnaya"];
      } else if (clade === "EHG") {
        freq = cladeFreqs?.["EHG"] ?? (cladeFreqs?.["WHG"] !== undefined && cladeFreqs?.["Yamnaya"] !== undefined ? (cladeFreqs["WHG"] + cladeFreqs["Yamnaya"]) / 2 : cladeFreqs?.["WHG"]);
      } else if (clade === "CHG") {
        const proxies = [w?.sgdp_georgian, w?.sgdp_armenian, cladeFreqs?.["Yamnaya"]].filter(v => v !== undefined);
        if (proxies.length > 0) freq = proxies.reduce((a, b) => a + b, 0) / proxies.length;
      } else if (clade === "NAT") {
        const proxies = [w?.sgdp_palestinian, w?.sgdp_bedouin, cladeFreqs?.["ANF"], cladeFreqs?.["EEF"]].filter(v => v !== undefined);
        if (proxies.length > 0) freq = proxies.reduce((a, b) => a + b, 0) / proxies.length;
      } else if (clade === "Ancient_East_Asian") {
        if (w) {
          const proxies = [w.sgdp_han, w.sgdp_japanese, w.sgdp_dai].filter(v => v !== undefined);
          if (proxies.length > 0) freq = proxies.reduce((a, b) => a + b, 0) / proxies.length;
        }
      } else if (clade === "Ancient_Beringian") {
        if (w) {
          const proxies = [w.sgdp_karitiana, w.sgdp_surui, w.sgdp_pima, w.sgdp_han].filter(v => v !== undefined);
          if (proxies.length > 0) freq = proxies.reduce((a, b) => a + b, 0) / proxies.length;
        }
      } else if (clade === "AASI") {
        if (w) {
          const proxies = [w.sgdp_onge, w.sgdp_paniya, w.sgdp_indian].filter(v => v !== undefined);
          if (proxies.length > 0) freq = proxies.reduce((a, b) => a + b, 0) / proxies.length;
        }
      } else if (clade === "Ancient_African") {
        if (w) {
          const proxies = [w.sgdp_yoruba, w.sgdp_mbuti, w.sgdp_khomani_san].filter(v => v !== undefined);
          if (proxies.length > 0) freq = proxies.reduce((a, b) => a + b, 0) / proxies.length;
        }
      } else if (clade === "TAF") {
        if (w) {
          const proxies = [w.sgdp_mozabite, w.sgdp_yoruba, w.sgdp_bedouin].filter(v => v !== undefined);
          if (proxies.length > 0) freq = proxies.reduce((a, b) => a + b, 0) / proxies.length;
        }
      } else if (clade === "Oceanian") {
        if (w) {
          const papuan = w.sgdp_papuan ?? w["sgdp_papuan.dg"];
          const boug = w.sgdp_bougainville ?? w["sgdp_bougainville.dg"];
          const proxies = [papuan, boug].filter(v => v !== undefined);
          if (proxies.length > 0) freq = proxies.reduce((a, b) => a + b, 0) / proxies.length;
        }
      }

      if (freq === undefined) {
        const avail = [cladeFreqs?.["WHG"], cladeFreqs?.["EEF"], cladeFreqs?.["Yamnaya"]].filter((v): v is number => v !== undefined);
        freq = avail.length > 0 ? avail.reduce((a, b) => a + b, 0) / avail.length : 0.5;
      }

      popExpectations.push(freq * 2.0);
    }

    if (validAll) {
      A.push(popExpectations);
      b.push(uDosage);
      weights.push(1.0);
      markersCompared++;
    }
  });

  if (markersCompared < 5) {
    return [];
  }

  const P = clades.length;
  const LAMBDA = 1000 * markersCompared;
  const A_aug = [...A];
  const b_aug = [...b];
  const w_aug = [...weights];

  const augRow = new Array(P).fill(LAMBDA);
  A_aug.push(augRow);
  b_aug.push(LAMBDA);
  w_aug.push(1.0);

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
      continent: info.continent,
      matchingMarkers: markersCompared
    };
  })
  .filter(r => r.score >= 0.1)
  .sort((a, b) => b.score - a.score);

  return finalMatches;
};

export const calculateArchaicIntrogression = (userGenotypes: Record<string, string>): ArchaicIntrogressionResult => {
  const markers = getAncientMarkers();
  const markersList = Object.entries(markers).filter(([rsid]) => !rsid.startsWith('_'));
  
  let comparedMarkers = 0;
  let carriedAlleles = 0;
  let totalMaxPossible = 0;

  let neanderthalCompared = 0;
  let neanderthalCarried = 0;
  let neanderthalMax = 0;

  let denisovanCompared = 0;
  let denisovanCarried = 0;
  let denisovanMax = 0;

  const details: ArchaicVariantDetail[] = [];

  markersList.forEach(([rsid, marker]) => {
    const source = marker.introgression?.source || 
      (marker.ancient_context && Object.keys(marker.ancient_context).includes('Neanderthal') ? 'Neanderthal' :
       marker.ancient_context && Object.keys(marker.ancient_context).includes('Denisovan') ? 'Denisovan' : null);
      
    if (!source) return;

    const userGenotype = userGenotypes[rsid] || userGenotypes[rsid.toLowerCase()] || userGenotypes[rsid.toUpperCase()];
    if (!userGenotype || userGenotype === '--') return;

    comparedMarkers++;
    const derivedAllele = marker.derived_allele.toUpperCase();
    const ancestralAllele = (marker.ancestral_allele || '').toUpperCase();
    const normUser = userGenotype.toUpperCase();

    let userCarriedCount = 0;
    let maxForThisMarker = 2;

    if (normUser.length === 1) {
      if (normUser === derivedAllele) userCarriedCount = 1;
      maxForThisMarker = 1;
    } else if (normUser.length === 2) {
      if (normUser[0] === derivedAllele) userCarriedCount++;
      if (normUser[1] === derivedAllele) userCarriedCount++;
    } else {
      maxForThisMarker = 0;
    }

    carriedAlleles += userCarriedCount;
    totalMaxPossible += maxForThisMarker;

    if (source === 'Neanderthal') {
      neanderthalCompared++;
      neanderthalCarried += userCarriedCount;
      neanderthalMax += maxForThisMarker;
    } else if (source === 'Denisovan') {
      denisovanCompared++;
      denisovanCarried += userCarriedCount;
      denisovanMax += maxForThisMarker;
    }

    const hasDerived = userCarriedCount > 0;

    details.push({
      rsid,
      gene: marker.gene || 'Unknown',
      trait: marker.trait || 'Archaic Variant',
      userGenotype,
      derivedAllele: marker.derived_allele,
      ancestralAllele: marker.ancestral_allele || '',
      source: source as 'Neanderthal' | 'Denisovan',
      hasDerived,
      history: marker.history || ''
    });
  });

  const score = totalMaxPossible > 0 ? (carriedAlleles / totalMaxPossible) * 100 : 0;
  const nScore = neanderthalMax > 0 ? (neanderthalCarried / neanderthalMax) * 100 : 0;
  const dScore = denisovanMax > 0 ? (denisovanCarried / denisovanMax) * 100 : 0;

  const getPercentile = (s: number, type: 'neanderthal' | 'denisovan') => {
    if (s > 40) return '95th+ Percentile (Extremely High)';
    if (s > 25) return '80th Percentile (Higher than average)';
    if (s > 10) return '50th Percentile (Average non-African)';
    if (s > 0) return '15th Percentile (Trace carrier)';
    return '0th Percentile (Ancestral baseline)';
  };

  return {
    score,
    comparedMarkers,
    carriedAlleles,
    neanderthal: {
      score: nScore,
      comparedMarkers: neanderthalCompared,
      carriedAlleles: neanderthalCarried,
      percentile: getPercentile(nScore, 'neanderthal')
    },
    denisovan: {
      score: dScore,
      comparedMarkers: denisovanCompared,
      carriedAlleles: denisovanCarried,
      percentile: getPercentile(dScore, 'denisovan')
    },
    details
  };
};

export const calculateIndividualMatches = (userGenotypes: Record<string, string>) => {
  const rawSamples = [
    ...Object.values(masterAncient.samples).filter(s => (s as any).id),
    ...((masterAncient as any).matches || [])
  ];
  
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const samples: any[] = [];
  for (const s of rawSamples) {
    const id = s.id || s.sampleId;
    const rawName = (s.name || '').toLowerCase();
    // Normalize name to deduplicate e.g. "Mota" vs "Mota Man", "Anzick-1" vs "Anzick-1 (Clovis Boy)"
    const nameKey = rawName.replace(/\(.*?\)/g, '').replace(/[^a-z]/g, '');
    if (id && !seenIds.has(id) && !seenNames.has(nameKey)) {
      seenIds.add(id);
      seenNames.add(nameKey);
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
    "rs4988235": 15.0,
    "rs334": 25.0,
    "rs601338": 12.0,
    "rs1805007": 10.0,
    "rs12203592": 10.0,
    "rs12821256": 10.0,
    "rs174546": 12.0,
    "rs1229984": 15.0,
    "rs671": 20.0,
    "rs2675348": 10.0,
    "rs694341": 10.0,
    "rs1815739": 10.0,
    "rs1801133": 10.0,
    "rs4680": 10.0,
    "rs1042522": 10.0,
    "rs35264875": 10.0,
    "rs6058017": 10.0
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
        const normUser = (userGenotype as string).toUpperCase();
        const normSample = (sampleGenotype as string).toUpperCase();
        if (normUser.length !== 2 || normSample.length !== 2) return;

        markersCompared++;
        const weight = markerImportance[rsid] || 1.0;
        
        let distance = 0;
        if (normUser === normSample) {
          distance = 0;
        } else {
          let shared = 0;
          const sampleCounts: Record<string, number> = {};
          for (let i = 0; i < normSample.length; i++) {
            const a = normSample[i];
            sampleCounts[a] = (sampleCounts[a] || 0) + 1;
          }
          for (let i = 0; i < normUser.length; i++) {
            const a = normUser[i];
            if (sampleCounts[a] && sampleCounts[a] > 0) {
              shared++;
              sampleCounts[a]--;
            }
          }
          distance = 2 - shared;
        }
        
        weightedDistance += distance * weight;
        maxPossibleWeightedDistance += 2 * weight;
        totalDistance += distance;
      }
    });
    
    const affinity = maxPossibleWeightedDistance > 0 
      ? Math.max(0, 100 * (1 - (weightedDistance / maxPossibleWeightedDistance))) 
      : 0;
    
    const getContinent = (s: any) => {
      if (s.continent) return s.continent;
      const text = `${s.region || ''} ${s.country || ''} ${s.site || ''} ${s.name || ''}`.toLowerCase();
      if (text.includes('africa') || text.includes('ethiopia') || text.includes('cameroon') || text.includes('sudan') || text.includes('morocco') || text.includes('namibia') || text.includes('botswana') || text.includes('ghana') || text.includes('egypt') || text.includes('mali')) return 'Africa';
      if (text.includes('america') || text.includes('usa') || text.includes('brazil') || text.includes('peru') || text.includes('chile') || text.includes('montana') || text.includes('washington') || text.includes('nevada') || text.includes('maryland')) return 'Americas';
      if (text.includes('oceania') || text.includes('australia') || text.includes('willandra') || text.includes('sahul')) return 'Oceania';
      if (text.includes('asia') || text.includes('china') || text.includes('japan') || text.includes('india') || text.includes('turkey') || text.includes('anatolian') || text.includes('eurasia') || text.includes('steppe')) return 'Asia';
      if (text.includes('europe') || text.includes('luxembourg') || text.includes('uk') || text.includes('england') || text.includes('germany') || text.includes('russia')) return 'Europe';
      return 'Other';
    };

    return {
      popCode: sample.id || sample.sampleId,
      popName: sample.name,
      score: affinity,
      distance: weightedDistance,
      description: sample.description,
      period: sample.period,
      region: sample.region,
      continent: getContinent(sample),
      matchingMarkers: Object.keys(sampleSnps).filter(rsid => {
        const uG = (userGenotypes[rsid] || userGenotypes[rsid.toLowerCase()] || userGenotypes[rsid.toUpperCase()])?.toUpperCase();
        const sG = (sampleSnps[rsid] as string)?.toUpperCase();
        return uG && sG && uG === sG;
      }).length,
      markersCompared: markersCompared,
      culture: sample.culture_name || sample.culture,
      age_bp: sample.age_bp
    } as AncientSampleMatch & { distance: number; markersCompared: number };
  });
  
  return results
    .filter(r => r.markersCompared > 0)
    .sort((a, b) => b.score - a.score || a.distance - b.distance);
};
