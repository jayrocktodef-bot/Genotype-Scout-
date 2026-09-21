import { getAncientMarkers } from '../data/GenomicDataService';
import masterAncient from '../data/master_ancient_profiles.json';
import { solveNNLS, solveProjectedGradientSimplex } from '../utils/nnls';
import ancientCladesFrequencies from '../data/raw_ancient/ancient_clades_frequencies.json';
import grafIndex from '../data/raw_aims/graf_10k_index.json';
import { fetchJsonAsset } from '../utils/fetchHelper';
import ancientSamplesRaw from '../data/raw_ancient/ancient_samples.json';
import ancientMatchesRaw from '../data/raw_ancient/ancientMatches.json';

export interface AncientSampleMatch {
  popCode: string;
  popName: string;
  score: number;
  distance?: number;
  description: string;
  period: string;
  region: string;
  continent?: string;
  matchingMarkers: number;
  markersCompared?: number;
  culture?: string;
  age_bp?: number;
  confidence?: 'High' | 'Moderate' | 'Low';
  cladeAffinity?: string;
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
  const m = A.length;

  // Form normal equations M = A^T A (P x P) and v = A^T b (P) once in O(m * P^2)
  const M_mat = new Float64Array(P * P);
  const v_vec = new Float64Array(P);

  for (let i = 0; i < m; i++) {
    const row = A[i];
    const bi = b[i];
    for (let j = 0; j < P; j++) {
      v_vec[j] += row[j] * bi;
      const rj = row[j];
      for (let k = j; k < P; k++) {
        M_mat[j * P + k] += rj * row[k];
      }
    }
  }
  for (let j = 0; j < P; j++) {
    for (let k = 0; k < j; k++) {
      M_mat[j * P + k] = M_mat[k * P + j];
    }
  }

  // Mild Tikhonov regularization for numerical stability
  for (let j = 0; j < P; j++) M_mat[j * P + j] += 1e-6;

  // Projected gradient descent directly on the probability simplex (sum(x) = 1, x >= 0)
  // Guarantees O(1) convergence without the ill-conditioning of large penalty rows.
  const simplexSol = solveProjectedGradientSimplex(M_mat, v_vec, P, 300);
  const normalized = Array.from(simplexSol);

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

const ANCIENT_MARKER_COORDS: Record<string, { chr: string; pos: number; ref?: string; alt?: string }> = {
  rs1426654: { chr: '15', pos: 48426484, ref: 'G', alt: 'A' },
  rs16891982: { chr: '5', pos: 33951693, ref: 'C', alt: 'G' },
  rs12913832: { chr: '15', pos: 28365618, ref: 'A', alt: 'G' },
  rs4988235: { chr: '2', pos: 136608646, ref: 'G', alt: 'A' },
  rs3827760: { chr: '2', pos: 109513601, ref: 'A', alt: 'G' },
  rs2814778: { chr: '1', pos: 159174683, ref: 'T', alt: 'C' },
  rs1800414: { chr: '15', pos: 28230318, ref: 'C', alt: 'T' },
  rs1042602: { chr: '11', pos: 89178528, ref: 'C', alt: 'A' },
  rs334: { chr: '11', pos: 5248232, ref: 'T', alt: 'A' },
  rs601338: { chr: '19', pos: 49206674, ref: 'G', alt: 'A' },
  rs1805007: { chr: '16', pos: 89986117, ref: 'C', alt: 'T' },
  rs12203592: { chr: '6', pos: 396321, ref: 'C', alt: 'T' },
  rs12821256: { chr: '12', pos: 88544949, ref: 'T', alt: 'C' },
  rs174546: { chr: '11', pos: 61570783, ref: 'C', alt: 'T' },
  rs1229984: { chr: '4', pos: 100239319, ref: 'G', alt: 'A' },
  rs671: { chr: '12', pos: 112241766, ref: 'G', alt: 'A' },
  rs2675348: { chr: '7', pos: 141972804, ref: 'T', alt: 'C' },
  rs694341: { chr: '6', pos: 26042456, ref: 'A', alt: 'G' },
  rs1815739: { chr: '11', pos: 66560624, ref: 'C', alt: 'T' },
  rs72921001: { chr: '12', pos: 56488349, ref: 'A', alt: 'G' },
  rs10774671: { chr: '12', pos: 113357193, ref: 'G', alt: 'A' },
  rs35744605: { chr: '22', pos: 42526613, ref: 'T', alt: 'C' },
  rs16139: { chr: '1', pos: 159174683, ref: 'A', alt: 'G' },
  rs1065852: { chr: '19', pos: 49206132, ref: 'C', alt: 'T' },
  rs11568828: { chr: '17', pos: 63918913, ref: 'T', alt: 'C' },
  rs13097409: { chr: '3', pos: 20126338, ref: 'T', alt: 'G' },
  rs885479: { chr: '16', pos: 89919746, ref: 'T', alt: 'C' },
  rs1393350: { chr: '11', pos: 89277878, ref: 'G', alt: 'A' }
};

const SPECIMEN_CLADE_MAP: Record<string, string[]> = {
  loschbour: ['WHG'],
  cheddar: ['WHG'],
  villabruna: ['WHG'],
  bichon: ['WHG'],
  westernhuntergatherer: ['WHG'],
  stuttgart: ['EEF', 'ANF'],
  boncuklu: ['ANF', 'EEF'],
  earlyeuropeanfarmer: ['EEF', 'ANF'],
  oetzi: ['EEF', 'ANF'],
  otzi: ['EEF', 'ANF'],
  yamnaya: ['Yamnaya'],
  yamnayasamara: ['Yamnaya'],
  yamnayasteppe: ['Yamnaya'],
  anzick: ['Ancient_Beringian'],
  kennewick: ['Ancient_Beringian'],
  usr1: ['Ancient_Beringian'],
  upwardsunriver: ['Ancient_Beringian'],
  spiritcave: ['Ancient_Beringian'],
  lovelock: ['Ancient_Beringian'],
  luzia: ['Ancient_Beringian'],
  lauricocha: ['Ancient_Beringian'],
  machupicchu: ['Ancient_Beringian'],
  fuegian: ['Ancient_Beringian'],
  mota: ['Ancient_African'],
  shumlaka: ['Ancient_African'],
  catoctin: ['Ancient_African', 'EEF'],
  kulubnarti: ['Ancient_African', 'NAT'],
  ghk: ['Ancient_African', 'NAT'],
  deepsan: ['Ancient_African'],
  namasan: ['Ancient_African'],
  ballito: ['Ancient_African'],
  asselar: ['Ancient_African'],
  gyamfi: ['Ancient_African'],
  taforalt: ['TAF'],
  guanche: ['TAF', 'EEF'],
  tianyuan: ['Ancient_East_Asian'],
  jomon: ['Ancient_East_Asian'],
  rakhigarhi: ['AASI', 'CHG'],
  satsurblia: ['CHG'],
  kotias: ['CHG'],
  australian: ['Oceanian'],
  willandra: ['Oceanian'],
  malta: ['EHG'],
  kostenki: ['WHG', 'EHG'],
  sunghir: ['WHG', 'EHG'],
  oase: ['WHG'],
  denisova: ['Oceanian'],
  chagyrskaya: ['WHG', 'EEF'],
  viking: ['EEF', 'WHG', 'Yamnaya']
};

export const calculateIndividualMatches = (
  userGenotypes: Record<string, string>,
  ancientAdmixture?: AncientSampleMatch[]
) => {
  const rawSamples = [
    ...Object.values(masterAncient.samples || {}),
    ...((masterAncient as any).matches || []),
    ...(Array.isArray(ancientSamplesRaw) ? ancientSamplesRaw : Object.values(ancientSamplesRaw || {})),
    ...(Array.isArray(ancientMatchesRaw) ? ancientMatchesRaw : Object.values(ancientMatchesRaw || {}))
  ];

  const cleanKey = (name: string) => {
    return (name || '')
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .replace(/\b(man|boy|ancestor|individual|warrior|farmer|herder|mummy|child|lbk|iron workers|one)\b/g, '')
      .replace(/[^a-z0-9]/g, '');
  };

  const sampleMap = new Map<string, any>();
  for (const s of rawSamples) {
    if (!s) continue;
    const nameKey = cleanKey(s.name || s.popName || s.id);
    if (!nameKey) continue;

    const existing = sampleMap.get(nameKey);
    const snps = { ...(s.snps || {}), ...(s.genotypes || {}) };

    if (!existing) {
      sampleMap.set(nameKey, {
        ...s,
        snps,
        genotypes: snps,
        nameKey
      });
    } else {
      const mergedSnps = {
        ...(existing.snps || existing.genotypes || {}),
        ...snps
      };
      existing.snps = mergedSnps;
      existing.genotypes = mergedSnps;
      if (!existing.description && s.description) existing.description = s.description;
      if (!existing.period && s.period) existing.period = s.period;
      if (!existing.culture && (s.culture || s.culture_name)) existing.culture = s.culture || s.culture_name;
      if (!existing.region && s.region) existing.region = s.region;
      if (!existing.continent && s.continent) existing.continent = s.continent;
      if (!existing.ancestry_group && s.ancestry_group) existing.ancestry_group = s.ancestry_group;
      if (!existing.age_bp && s.age_bp) existing.age_bp = s.age_bp;
    }
  }

  const samples = Array.from(sampleMap.values());

  const markerImportance: Record<string, number> = {
    "rs1426654": 15.0,
    "rs16891982": 15.0,
    "rs12913832": 12.0,
    "rs3827760": 18.0,
    "rs16139": 15.0,
    "rs2814778": 18.0,
    "rs1042531": 10.0,
    "rs1042602": 10.0,
    "rs1800414": 10.0,
    "rs4988235": 12.0,
    "rs334": 20.0,
    "rs601338": 10.0,
    "rs1805007": 12.0,
    "rs12203592": 10.0,
    "rs12821256": 10.0,
    "rs174546": 12.0,
    "rs1229984": 12.0,
    "rs671": 18.0,
    "rs2675348": 10.0,
    "rs694341": 10.0,
    "rs1815739": 10.0,
    "rs1801133": 10.0,
    "rs4680": 10.0,
    "rs1042522": 10.0,
    "rs35264875": 10.0,
    "rs6058017": 10.0
  };

  const comp = (b: string) => b === 'A' ? 'T' : b === 'T' ? 'A' : b === 'C' ? 'G' : b === 'G' ? 'C' : b;

  const getUserCall = (rsid: string): string | null => {
    const direct = userGenotypes[rsid] || userGenotypes[rsid.toLowerCase()] || userGenotypes[rsid.toUpperCase()];
    if (direct) {
      const clean = direct.replace(/[^ATCGatcg]/g, '').toUpperCase();
      if (clean.length === 1) return clean + clean;
      if (clean.length >= 2) return clean.slice(0, 2);
    }
    const coord = ANCIENT_MARKER_COORDS[rsid] || (grafIndex as any)[rsid];
    if (coord && coord.chr && coord.pos) {
      const c = String(coord.chr).replace(/^chr/i, '').toLowerCase();
      const p = coord.pos;
      const byCoord = userGenotypes[`chr${c}_${p}`] ||
                      userGenotypes[`${c}_${p}`] ||
                      userGenotypes[`chr${c}:${p}`] ||
                      userGenotypes[`${c}:${p}`] ||
                      userGenotypes[`chr${c.toUpperCase()}_${p}`] ||
                      userGenotypes[`${c.toUpperCase()}_${p}`] ||
                      userGenotypes[`chr${c.toUpperCase()}:${p}`] ||
                      userGenotypes[`${c.toUpperCase()}:${p}`];
      if (byCoord) {
        const clean = byCoord.replace(/[^ATCGatcg]/g, '').toUpperCase();
        if (clean.length === 1) return clean + clean;
        if (clean.length >= 2) return clean.slice(0, 2);
      }
    }
    return null;
  };

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

  const results = samples.map((sample: any) => {
    let markersCompared = 0;
    let matchingMarkers = 0;
    let weightedDistance = 0;
    let maxPossibleWeightedDistance = 0;

    const sampleSnps = sample.snps || sample.genotypes || {};

    Object.entries(sampleSnps).forEach(([rsid, rawSampleGenotype]) => {
      const userCall = getUserCall(rsid);
      if (!userCall || userCall.length !== 2) return;

      const sampleCall = (rawSampleGenotype as string).replace(/[^ATCGatcg]/g, '').toUpperCase();
      if (sampleCall.length !== 2) return;

      markersCompared++;
      const weight = markerImportance[rsid] || 1.0;
      const coord = ANCIENT_MARKER_COORDS[rsid];
      const isPalindromic = coord?.ref && coord?.alt && (
        (coord.ref === 'A' && coord.alt === 'T') || (coord.ref === 'T' && coord.alt === 'A') ||
        (coord.ref === 'C' && coord.alt === 'G') || (coord.ref === 'G' && coord.alt === 'C')
      );

      let distance = 0;
      if (userCall === sampleCall) {
        distance = 0;
        matchingMarkers++;
      } else {
        let sharedDirect = 0;
        const sCounts: Record<string, number> = {};
        for (let i = 0; i < sampleCall.length; i++) {
          const a = sampleCall[i];
          sCounts[a] = (sCounts[a] || 0) + 1;
        }
        for (let i = 0; i < userCall.length; i++) {
          const a = userCall[i];
          if (sCounts[a] && sCounts[a] > 0) {
            sharedDirect++;
            sCounts[a]--;
          }
        }

        // Reverse-strand complement check for non-palindromic SNPs
        if (sharedDirect === 0 && !isPalindromic) {
          const compUser = comp(userCall[0]) + comp(userCall[1]);
          const sCountsComp: Record<string, number> = {};
          for (let i = 0; i < sampleCall.length; i++) {
            const a = sampleCall[i];
            sCountsComp[a] = (sCountsComp[a] || 0) + 1;
          }
          let sharedComp = 0;
          for (let i = 0; i < compUser.length; i++) {
            const a = compUser[i];
            if (sCountsComp[a] && sCountsComp[a] > 0) {
              sharedComp++;
              sCountsComp[a]--;
            }
          }
          if (sharedComp > 0) {
            distance = 2 - sharedComp;
            if (distance === 0) matchingMarkers++;
          } else {
            distance = 2;
          }
        } else {
          distance = 2 - sharedDirect;
        }
      }

      weightedDistance += distance * weight;
      maxPossibleWeightedDistance += 2 * weight;
    });

    const rawAffinity = maxPossibleWeightedDistance > 0
      ? Math.max(0, 100 * (1 - (weightedDistance / maxPossibleWeightedDistance)))
      : 50.0;

    // Empirical Bayes Shrinkage toward neutral prior 50.0 to eliminate small-N noise
    const KAPPA = 8.0;
    const PRIOR = 50.0;
    const shrunkenAffinity = (markersCompared / (markersCompared + KAPPA)) * rawAffinity +
                             (KAPPA / (markersCompared + KAPPA)) * PRIOR;

    // Clade-informed Composite Affinity
    let finalScore = shrunkenAffinity;
    let matchedCladeName: string | undefined;
    if (ancientAdmixture && ancientAdmixture.length > 0) {
      const clades = SPECIMEN_CLADE_MAP[sample.nameKey] || [];
      if (clades.length > 0) {
        let maxCladePct = 0;
        for (const c of clades) {
          const m = ancientAdmixture.find(a => a.popCode === c);
          if (m && m.score > maxCladePct) {
            maxCladePct = m.score;
            matchedCladeName = m.popName || m.popCode;
          }
        }
        if (maxCladePct > 0) {
          const cladeScore = Math.min(100, maxCladePct * 2.5);
          finalScore = 0.70 * shrunkenAffinity + 0.30 * cladeScore;
        }
      }
    }

    const confidence: 'High' | 'Moderate' | 'Low' =
      markersCompared >= 10 ? 'High' :
      markersCompared >= 5 ? 'Moderate' : 'Low';

    return {
      popCode: sample.id || sample.sampleId,
      popName: sample.name,
      score: Number(finalScore.toFixed(1)),
      distance: Number(weightedDistance.toFixed(2)),
      description: sample.description,
      period: sample.period,
      region: sample.region,
      continent: getContinent(sample),
      matchingMarkers,
      markersCompared,
      culture: sample.culture_name || sample.culture,
      age_bp: sample.age_bp,
      confidence,
      cladeAffinity: matchedCladeName
    } as AncientSampleMatch;
  });

  return results
    .filter(r => (r.markersCompared ?? 0) >= 2)
    .sort((a, b) => b.score - a.score || (b.markersCompared ?? 0) - (a.markersCompared ?? 0));
};
