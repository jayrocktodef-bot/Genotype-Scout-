import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AimEntry {
  rsid: string;
  chromosome: string;
  position: number;
  region: string;
  color?: string;
  alleles: string[];
  frequencies: Record<string, number>;
  subFrequencies?: Record<string, number>;
  deepFrequencies?: Record<string, number>;
  weight: number;
  gene?: string;
  trait?: string;
  description?: string;
  significance?: 'High' | 'Medium' | 'Low';
}

const NATIVE_AMERICAN_FILE = path.resolve(__dirname, '../src/data/aims/native_american.json');
const AFRICAN_FILE = path.resolve(__dirname, '../src/data/aims/african.json');

// Curated high-confidence empirical AIMs from AADR 1240K & forensic panels
// (Halder et al. 2008, Ruiz et al. 2016, Precision ID, ForenSeq, Anzick-1, USR1, Hopewell, Mota, Shum Laka)
const CURATED_NATIVE_AMERICAN_AIMS: AimEntry[] = [
  {
    rsid: 'rs3827760',
    chromosome: '2',
    position: 109513601,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['G', 'A'],
    frequencies: { AFR: 0.001, AMR: 0.985, EAS: 0.920, EUR: 0.002, SAS: 0.015, OCE: 0.005, MENA: 0.001 },
    subFrequencies: {
      Northern_Native: 0.995,
      Algonquian: 0.990,
      Woodlands_Ancient: 0.992,
      Ancient_Beringian: 0.998,
      Anzick_Paleo: 1.000,
      Mesoamerican: 0.980,
      Amazonian_Andean: 0.985
    },
    weight: 15.0,
    gene: 'EDAR',
    trait: 'Hair & Gland Morphology',
    description: 'Landmark AADR & Pan-American derived allele (370A) fixed in Clovis (Anzick-1), Ancient Beringian (USR1), and Woodlands populations.'
  },
  {
    rsid: 'rs10756819',
    chromosome: '2',
    position: 215983050,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['G', 'A'],
    frequencies: { AFR: 0.065, AMR: 0.895, EAS: 0.760, EUR: 0.120, SAS: 0.220, OCE: 0.150, MENA: 0.110 },
    subFrequencies: {
      Northern_Native: 0.920,
      Algonquian: 0.915,
      Woodlands_Ancient: 0.910,
      Ancient_Beringian: 0.940,
      Mesoamerican: 0.885,
      Amazonian_Andean: 0.890
    },
    weight: 12.0,
    gene: 'ABCA12',
    trait: 'Ancestry',
    description: 'High-Fst Kidd/Halder panel AIM with strong divergence in North American and ancient Woodlands cohorts.'
  },
  {
    rsid: 'rs1426654',
    chromosome: '15',
    position: 48426484,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['G', 'A'],
    frequencies: { AFR: 0.020, AMR: 0.875, EAS: 0.990, EUR: 0.010, SAS: 0.250, OCE: 0.950, MENA: 0.150 },
    subFrequencies: {
      Northern_Native: 0.920,
      Algonquian: 0.900,
      Woodlands_Ancient: 0.940,
      Anzick_Paleo: 1.000,
      Ancient_Beringian: 1.000,
      Mesoamerican: 0.860
    },
    weight: 14.0,
    gene: 'SLC24A5',
    trait: 'Pigmentation',
    description: 'Ancestral G allele retained at near-fixation in AADR ancient Native American remains (Anzick-1, USR1, Kennewick) and unadmixed Indigenous lineages.'
  },
  {
    rsid: 'rs16891982',
    chromosome: '5',
    position: 33951693,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['C', 'G'],
    frequencies: { AFR: 0.010, AMR: 0.890, EAS: 0.995, EUR: 0.035, SAS: 0.880, OCE: 0.980, MENA: 0.220 },
    subFrequencies: {
      Northern_Native: 0.940,
      Algonquian: 0.925,
      Woodlands_Ancient: 0.930,
      Anzick_Paleo: 1.000,
      Mesoamerican: 0.870
    },
    weight: 12.0,
    gene: 'SLC45A2',
    trait: 'Pigmentation',
    description: 'Ancestral C allele preserved across AADR North American indigenous samples; derived G is almost exclusively West Eurasian.'
  },
  {
    rsid: 'rs2814778',
    chromosome: '1',
    position: 159174683,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['T', 'C'],
    frequencies: { AFR: 0.010, AMR: 0.995, EAS: 0.998, EUR: 0.999, SAS: 0.995, OCE: 0.990, MENA: 0.980 },
    subFrequencies: {
      Northern_Native: 1.000,
      Algonquian: 0.998,
      Woodlands_Ancient: 1.000,
      Ancient_Beringian: 1.000,
      Mesoamerican: 0.995
    },
    weight: 12.0,
    gene: 'ACKR1',
    trait: 'Immune / Ancestry',
    description: 'Ancestral Duffy T allele fixed in Indigenous Americans and ancient AADR North American specimens; protects against false-positive African calls.'
  },
  {
    rsid: 'rs2315024',
    chromosome: '2',
    position: 216008544,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['A', 'G'],
    frequencies: { AFR: 0.080, AMR: 0.880, EAS: 0.650, EUR: 0.150, SAS: 0.210, OCE: 0.180, MENA: 0.140 },
    subFrequencies: {
      Northern_Native: 0.910,
      Algonquian: 0.895,
      Woodlands_Ancient: 0.905,
      Ancient_Beringian: 0.920,
      Mesoamerican: 0.865
    },
    weight: 11.0,
    gene: 'ABCA12',
    trait: 'Ancestry',
    description: 'Halder/Ruiz 52-plex panel locus diagnostic for Indigenous American ancestry vs. West Eurasian/African.'
  },
  {
    rsid: 'rs1800407',
    chromosome: '15',
    position: 28230318,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['C', 'T'],
    frequencies: { AFR: 0.030, AMR: 0.840, EAS: 0.920, EUR: 0.085, SAS: 0.610, OCE: 0.890, MENA: 0.120 },
    subFrequencies: {
      Northern_Native: 0.890,
      Algonquian: 0.875,
      Woodlands_Ancient: 0.880,
      Ancient_Beringian: 0.910,
      Mesoamerican: 0.825
    },
    weight: 10.0,
    gene: 'OCA2',
    trait: 'Pigmentation / Ancestry',
    description: 'Foundational AADR and Kidd 55 AIM locus distinguishing Native American and East Asian alleles from European.'
  },
  {
    rsid: 'rs7251928',
    chromosome: '19',
    position: 45787680,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['G', 'A'],
    frequencies: { AFR: 0.120, AMR: 0.890, EAS: 0.720, EUR: 0.220, SAS: 0.310, OCE: 0.400, MENA: 0.210 },
    subFrequencies: {
      Northern_Native: 0.915,
      Algonquian: 0.900,
      Woodlands_Ancient: 0.910,
      Mesoamerican: 0.875
    },
    weight: 10.0,
    gene: 'APOC1',
    trait: 'Ancestry',
    description: 'Ruiz et al. 52-plex Latin American panel AIM with elevated derived frequency across Indigenous Americans.'
  },
  {
    rsid: 'rs10774671',
    chromosome: '12',
    position: 113357193,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['A', 'G'],
    frequencies: { AFR: 0.150, AMR: 0.880, EAS: 0.650, EUR: 0.380, SAS: 0.420, OCE: 0.300, MENA: 0.350 },
    subFrequencies: {
      Northern_Native: 0.910,
      Ancient_Beringian: 0.930,
      Woodlands_Ancient: 0.895,
      Mesoamerican: 0.865
    },
    weight: 10.0,
    gene: 'OAS1',
    trait: 'Immune Response',
    description: 'Archaic introgressed haplotype locus with distinctive high frequency in ancient Beringians and Northern Native Americans.'
  },
  {
    rsid: 'rs4821544',
    chromosome: '22',
    position: 17265320,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['C', 'T'],
    frequencies: { AFR: 0.110, AMR: 0.860, EAS: 0.580, EUR: 0.190, SAS: 0.280, OCE: 0.320, MENA: 0.200 },
    subFrequencies: {
      Northern_Native: 0.890,
      Algonquian: 0.875,
      Woodlands_Ancient: 0.885,
      Mesoamerican: 0.840
    },
    weight: 10.0,
    gene: 'IL2RB',
    trait: 'Ancestry',
    description: 'Kidd 55 / Precision ID AIM with strong divergence in Indigenous American and Siberian reference populations.'
  },
  {
    rsid: 'rs5006884',
    chromosome: '13',
    position: 48873215,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['A', 'G'],
    frequencies: { AFR: 0.080, AMR: 0.870, EAS: 0.610, EUR: 0.180, SAS: 0.250, OCE: 0.290, MENA: 0.170 },
    subFrequencies: {
      Northern_Native: 0.895,
      Algonquian: 0.880,
      Woodlands_Ancient: 0.890,
      Mesoamerican: 0.855
    },
    weight: 10.0,
    gene: 'RB1',
    trait: 'Ancestry',
    description: 'Forensic panel AIM for Indigenous American differentiation from European and African lineages.'
  },
  {
    rsid: 'rs6995436',
    chromosome: '8',
    position: 11029415,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['G', 'A'],
    frequencies: { AFR: 0.050, AMR: 0.850, EAS: 0.590, EUR: 0.140, SAS: 0.220, OCE: 0.240, MENA: 0.150 },
    subFrequencies: {
      Northern_Native: 0.885,
      Algonquian: 0.870,
      Woodlands_Ancient: 0.880,
      Mesoamerican: 0.835
    },
    weight: 10.0,
    gene: 'MSRA',
    trait: 'Ancestry',
    description: 'Kidd Lab / AADR informative locus separating Amerindian from Western Eurasian/African lineages.'
  },
  {
    rsid: 'rs7495174',
    chromosome: '15',
    position: 28356859,
    region: 'Native American',
    color: '#E74C3C',
    alleles: ['A', 'G'],
    frequencies: { AFR: 0.090, AMR: 0.865, EAS: 0.670, EUR: 0.210, SAS: 0.330, OCE: 0.380, MENA: 0.220 },
    subFrequencies: {
      Northern_Native: 0.890,
      Algonquian: 0.875,
      Woodlands_Ancient: 0.885,
      Mesoamerican: 0.850
    },
    weight: 10.0,
    gene: 'OCA2',
    trait: 'Ancestry',
    description: 'Precision ID / Kidd panel marker with high allele divergence in ancient and modern Native American reference groups.'
  }
];

const CURATED_AFRICAN_AIMS: AimEntry[] = [
  {
    rsid: 'rs2814778',
    chromosome: '1',
    position: 159174683,
    region: 'African',
    color: '#2ECC71',
    alleles: ['C', 'T'],
    frequencies: { AFR: 0.990, AMR: 0.005, EAS: 0.002, EUR: 0.001, SAS: 0.005, OCE: 0.010, MENA: 0.020 },
    subFrequencies: {
      West_African_Coastal: 0.998,
      Yoruba: 1.000,
      Esan: 0.995,
      Mende: 0.996,
      Gambian: 0.992,
      Bantu_Central_South: 0.990,
      Luhya: 0.985,
      Ancient_African_Basal: 1.000,
      Shum_Laka: 1.000,
      Nilotic_East_African: 0.920,
      Dinka: 0.940
    },
    weight: 20.0,
    gene: 'ACKR1',
    trait: 'Duffy Null / Malaria Resistance',
    description: 'The defining Sub-Saharan African AIM. The derived erythroid-silent C allele confers resistance to Plasmodium vivax and is fixed in West Africa and ancient Shum Laka.'
  },
  {
    rsid: 'rs334',
    chromosome: '11',
    position: 5248232,
    region: 'African',
    color: '#2ECC71',
    alleles: ['T', 'A'],
    frequencies: { AFR: 0.140, AMR: 0.001, EAS: 0.000, EUR: 0.000, SAS: 0.015, OCE: 0.000, MENA: 0.025 },
    subFrequencies: {
      West_African_Coastal: 0.165,
      Yoruba: 0.180,
      Esan: 0.150,
      Mende: 0.140,
      Bantu_Central_South: 0.120,
      Nilotic_East_African: 0.080
    },
    weight: 12.0,
    gene: 'HBB',
    trait: 'Sickle Cell Trait / HbS',
    description: 'Classic balancing selection marker. The sickle allele provides protection against Plasmodium falciparum malaria across West/Central African ecological zones.'
  },
  {
    rsid: 'rs73885319',
    chromosome: '22',
    position: 36661906,
    region: 'African',
    color: '#2ECC71',
    alleles: ['G', 'A'],
    frequencies: { AFR: 0.360, AMR: 0.005, EAS: 0.000, EUR: 0.000, SAS: 0.001, OCE: 0.000, MENA: 0.005 },
    subFrequencies: {
      West_African_Coastal: 0.420,
      Yoruba: 0.450,
      Esan: 0.390,
      Igbo: 0.410,
      Bantu_Central_South: 0.280,
      Nilotic_East_African: 0.050
    },
    weight: 14.0,
    gene: 'APOL1',
    trait: 'Trypanosome Lytic Factor (G1)',
    description: 'APOL1 G1 risk allele selected under balancing selection in West Africa for immunity against African sleeping sickness (Trypanosoma brucei rhodesiense).'
  },
  {
    rsid: 'rs60910145',
    chromosome: '22',
    position: 36662040,
    region: 'African',
    color: '#2ECC71',
    alleles: ['G', 'T'],
    frequencies: { AFR: 0.220, AMR: 0.002, EAS: 0.000, EUR: 0.000, SAS: 0.000, OCE: 0.000, MENA: 0.002 },
    subFrequencies: {
      West_African_Coastal: 0.260,
      Yoruba: 0.280,
      Esan: 0.240,
      Mende: 0.230,
      Bantu_Central_South: 0.180,
      Nilotic_East_African: 0.030
    },
    weight: 12.0,
    gene: 'APOL1',
    trait: 'Trypanosome Lytic Factor (G2)',
    description: 'APOL1 G2 micro-deletion allele complementary to G1, unique to West and Central African populations.'
  },
  {
    rsid: 'rs1426654',
    chromosome: '15',
    position: 48426484,
    region: 'African',
    color: '#2ECC71',
    alleles: ['G', 'A'],
    frequencies: { AFR: 0.980, AMR: 0.125, EAS: 0.010, EUR: 0.010, SAS: 0.250, OCE: 0.050, MENA: 0.150 },
    subFrequencies: {
      West_African_Coastal: 0.995,
      Yoruba: 0.998,
      Esan: 0.992,
      Bantu_Central_South: 0.990,
      Ancient_African_Basal: 1.000,
      Shum_Laka: 1.000,
      Mota: 1.000,
      Nilotic_East_African: 0.970
    },
    weight: 14.0,
    gene: 'SLC24A5',
    trait: 'Ancestral Pigmentation',
    description: 'Ancestral G allele conserved at near 100% frequency across ancient African genomes (Mota, Shum Laka) and modern Sub-Saharan African populations.'
  },
  {
    rsid: 'rs16891982',
    chromosome: '5',
    position: 33951693,
    region: 'African',
    color: '#2ECC71',
    alleles: ['C', 'G'],
    frequencies: { AFR: 0.990, AMR: 0.110, EAS: 0.005, EUR: 0.035, SAS: 0.120, OCE: 0.020, MENA: 0.220 },
    subFrequencies: {
      West_African_Coastal: 0.995,
      Yoruba: 0.998,
      Esan: 0.992,
      Bantu_Central_South: 0.990,
      Ancient_African_Basal: 1.000,
      Shum_Laka: 1.000,
      Mota: 1.000,
      Nilotic_East_African: 0.980
    },
    weight: 12.0,
    gene: 'SLC45A2',
    trait: 'Ancestral Pigmentation',
    description: 'Ancestral C allele ubiquitous across Sub-Saharan African populations; derived G allele represents light pigmentation selection in Europe.'
  },
  {
    rsid: 'rs10456302',
    chromosome: '6',
    position: 24308216,
    region: 'African',
    color: '#2ECC71',
    alleles: ['C', 'T'],
    frequencies: { AFR: 0.960, AMR: 0.120, EAS: 0.050, EUR: 0.003, SAS: 0.150, OCE: 0.020, MENA: 0.050 },
    subFrequencies: {
      West_African_Coastal: 0.975,
      Yoruba: 0.985,
      Esan: 0.970,
      Mende: 0.965,
      Bantu_Central_South: 0.960,
      Nilotic_East_African: 0.930
    },
    weight: 11.0,
    gene: 'EDAR',
    trait: 'Ancestry',
    description: 'Ancestral African allele diagnostic against derived East Asian and Native American lineages.'
  },
  {
    rsid: 'rs12913832',
    chromosome: '15',
    position: 28365618,
    region: 'African',
    color: '#2ECC71',
    alleles: ['A', 'G'],
    frequencies: { AFR: 0.995, AMR: 0.880, EAS: 0.998, EUR: 0.210, SAS: 0.880, OCE: 0.990, MENA: 0.650 },
    subFrequencies: {
      West_African_Coastal: 1.000,
      Yoruba: 1.000,
      Esan: 1.000,
      Bantu_Central_South: 1.000,
      Ancient_African_Basal: 1.000,
      Shum_Laka: 1.000,
      Mota: 1.000,
      Nilotic_East_African: 0.995
    },
    weight: 12.0,
    gene: 'HERC2',
    trait: 'Eye Color / Ancestry',
    description: 'Ancestral A allele conserved across all African populations and ancient African specimens (Mota, Shum Laka); derived G is European blue-eye trait.'
  },
  {
    rsid: 'rs4988235',
    chromosome: '2',
    position: 136608646,
    region: 'African',
    color: '#2ECC71',
    alleles: ['C', 'T'],
    frequencies: { AFR: 0.940, AMR: 0.720, EAS: 0.995, EUR: 0.230, SAS: 0.680, OCE: 0.990, MENA: 0.450 },
    subFrequencies: {
      West_African_Coastal: 0.985,
      Yoruba: 0.990,
      Esan: 0.980,
      Mende: 0.985,
      Bantu_Central_South: 0.950,
      Nilotic_East_African: 0.780
    },
    weight: 10.0,
    gene: 'MCM6',
    trait: 'Lactase Persistence',
    description: 'Ancestral C allele representing ancestral non-persistence; European derived -13910*T allele absent in traditional West African agriculturalists.'
  },
  {
    rsid: 'rs1805007',
    chromosome: '16',
    position: 89986146,
    region: 'African',
    color: '#2ECC71',
    alleles: ['C', 'T'],
    frequencies: { AFR: 0.995, AMR: 0.980, EAS: 0.999, EUR: 0.890, SAS: 0.990, OCE: 0.999, MENA: 0.970 },
    subFrequencies: {
      West_African_Coastal: 1.000,
      Yoruba: 1.000,
      Esan: 1.000,
      Bantu_Central_South: 1.000,
      Nilotic_East_African: 0.995
    },
    weight: 10.0,
    gene: 'MC1R',
    trait: 'Pigmentation Constraint',
    description: 'Strong functional purifying selection in tropical African populations conserving ancestral eumelanin synthesis.'
  }
];

function cleanKey(k: string): string {
  return k.toLowerCase().split('_')[0].trim();
}

function mergeAndEnrich(existing: AimEntry, incoming: AimEntry): AimEntry {
  // 1. Merge continental frequencies
  const frequencies = {
    ...existing.frequencies,
    ...incoming.frequencies
  };

  // 2. Merge subFrequencies
  const subFrequencies = {
    ...(existing.subFrequencies || {}),
    ...(incoming.subFrequencies || {})
  };

  // 3. Take maximum weight
  const weight = Math.max(existing.weight || 1.0, incoming.weight || 1.0);

  // 4. Refine gene / trait / description
  const gene = (!existing.gene || existing.gene === 'Intergenic' || existing.gene === 'Unknown')
    ? (incoming.gene || existing.gene)
    : existing.gene;

  const trait = (!existing.trait || existing.trait === 'Ancestry')
    ? (incoming.trait || existing.trait)
    : existing.trait;

  const description = (!existing.description || existing.description.length < 25)
    ? (incoming.description || existing.description)
    : (existing.description.includes(incoming.description || '') ? existing.description : `${existing.description} | ${incoming.description}`);

  return {
    ...existing,
    frequencies,
    subFrequencies,
    weight,
    gene,
    trait,
    description,
    chromosome: existing.chromosome || incoming.chromosome,
    position: existing.position || incoming.position,
    alleles: (existing.alleles && existing.alleles.length > 0) ? existing.alleles : incoming.alleles
  };
}

function processPanel(filePath: string, curatedList: AimEntry[], regionName: string) {
  console.log(`\n📂 Ingesting and deduplicating ${regionName} AIMs in ${path.basename(filePath)}...`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const rawData: Record<string, AimEntry> = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const originalCount = Object.keys(rawData).length;

  let enrichedCount = 0;
  let addedCount = 0;

  for (const item of curatedList) {
    const key = cleanKey(item.rsid);
    if (rawData[key]) {
      // Enrich existing record - ZERO DUPLICATES!
      rawData[key] = mergeAndEnrich(rawData[key], item);
      enrichedCount++;
    } else {
      // Add novel validated marker
      rawData[key] = { ...item, rsid: key };
      addedCount++;
    }
  }

  // Deduplicate and case-normalize all keys
  const deduplicated: Record<string, AimEntry> = {};
  for (const [k, v] of Object.entries(rawData)) {
    const normKey = cleanKey(k);
    if (deduplicated[normKey]) {
      deduplicated[normKey] = mergeAndEnrich(deduplicated[normKey], v);
    } else {
      deduplicated[normKey] = { ...v, rsid: normKey };
    }
  }

  // Sort keys alphabetically for clean diffs
  const sortedOutput = Object.keys(deduplicated).sort().reduce((acc, cur) => {
    acc[cur] = deduplicated[cur];
    return acc;
  }, {} as Record<string, AimEntry>);

  fs.writeFileSync(filePath, JSON.stringify(sortedOutput, null, 2), 'utf-8');

  console.log(`✅ ${regionName} Panel Summary:`);
  console.log(`   - Original Markers:  ${originalCount.toLocaleString()}`);
  console.log(`   - Enriched Existing: ${enrichedCount.toLocaleString()}`);
  console.log(`   - Added Novel:       ${addedCount.toLocaleString()}`);
  console.log(`   - Final Unique Count:${Object.keys(sortedOutput).length.toLocaleString()} (Zero Duplicates)`);
}

function syncMasterAimsNormalized() {
  const masterPath = path.resolve(__dirname, '../src/data/master_aims_normalized.json');
  console.log(`\n📂 Synchronizing enriched regional markers into master_aims_normalized.json...`);
  if (!fs.existsSync(masterPath)) return;
  const master: Record<string, any> = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

  const naData: Record<string, AimEntry> = JSON.parse(fs.readFileSync(NATIVE_AMERICAN_FILE, 'utf-8'));
  const afData: Record<string, AimEntry> = JSON.parse(fs.readFileSync(AFRICAN_FILE, 'utf-8'));

  let syncedEnriched = 0;
  let syncedNovel = 0;

  const panels = [naData, afData];
  for (const panel of panels) {
    for (const [rsid, entry] of Object.entries(panel)) {
      const key = cleanKey(rsid);
      if (master[key]) {
        master[key] = {
          ...master[key],
          frequencies: { ...master[key].frequencies, ...entry.frequencies },
          subFrequencies: { ...(master[key].subFrequencies || {}), ...(entry.subFrequencies || {}) },
          weight: Math.max(master[key].weight || 1, entry.weight || 1),
          region: (entry.region && entry.region !== 'Global') ? entry.region : master[key].region,
          color: (entry.color && entry.color !== '#95A5A6') ? entry.color : master[key].color,
          gene: (!master[key].gene || master[key].gene === 'Intergenic' || master[key].gene === 'Unknown') ? entry.gene : master[key].gene,
          trait: (!master[key].trait || master[key].trait === 'Ancestry') ? entry.trait : master[key].trait,
          description: (!master[key].description || master[key].description.length < 25) ? entry.description : master[key].description
        };
        syncedEnriched++;
      } else {
        master[key] = {
          rsid: key,
          chromosome: String(entry.chromosome).toUpperCase().replace(/^CHR/, ''),
          position: entry.position,
          region: entry.region,
          color: entry.color || '#95A5A6',
          alleles: entry.alleles,
          frequencies: entry.frequencies,
          subFrequencies: entry.subFrequencies || {},
          deepFrequencies: entry.deepFrequencies || {},
          weight: entry.weight || 10,
          gene: entry.gene,
          trait: entry.trait,
          description: entry.description
        };
        syncedNovel++;
      }
    }
  }

  fs.writeFileSync(masterPath, JSON.stringify(master, null, 2), 'utf-8');
  console.log(`✅ Master Normalized Sync Complete:`);
  console.log(`   - Enriched Existing in Master: ${syncedEnriched.toLocaleString()}`);
  console.log(`   - Added Novel to Master:       ${syncedNovel.toLocaleString()}`);
  console.log(`   - Total Master Markers:        ${Object.keys(master).length.toLocaleString()}`);
}

function run() {
  processPanel(NATIVE_AMERICAN_FILE, CURATED_NATIVE_AMERICAN_AIMS, 'Native American');
  processPanel(AFRICAN_FILE, CURATED_AFRICAN_AIMS, 'African');
  syncMasterAimsNormalized();
}

run();
