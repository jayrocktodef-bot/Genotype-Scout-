import { loadMasterAims } from '../data/index';

// Initialize on first use or cache
let masterAimsCache: any = null;
const getMasterAims = () => {
  if (!masterAimsCache) masterAimsCache = loadMasterAims();
  return masterAimsCache;
};
import hoReferenceKernel from '../data/raw_aims/ho_modern_reference_kernel.json';
import graf10kIndex from '../data/raw_aims/graf_10k_index.json';
import { getPopulationInfo } from '../services/populationMapper';
import { solveNNLS } from '../utils/nnls';
import { pruneMarkersByPhysicalDistance } from '../utils/ancestry/ldPruner';
import forensicPanels from '../data/raw_aims/forensic_panels.json';

export interface AIM {
  rsid: string;
  chromosome: string;
  subpop?: string;
  continent: string;
  alleles?: string;
}

export interface UserGenotype {
  rsid: string;
  genotype: string;
}

export interface SubpopBreakdown {
  subpop: string;
  distance: number;
  similarityScore: number;
  markersCompared: number;
  count: number;
}

export interface AdmixtureComponent {
  popCode: string;
  name: string;
  percentage: number;
}

export interface OracleResult {
  topMatch: string;
  subpopAimsUsed: number;
  unmappedAims: AIM[];
  breakdown: SubpopBreakdown[];
  admixtureMix: AdmixtureComponent[];
}

// Map of 1000 Genomes population codes to detailed, scientific, and readable names
const POPULATION_NAMES_MAP: Record<string, string> = {
  'CEU': 'Central European (CEU)',
  'GBR': 'British Isles (GBR)',
  'FIN': 'Uralic & North-East European (FIN)',
  'TSI': 'Central Mediterranean / Tuscan (TSI)',
  'IBS': 'Iberian Peninsula (IBS)',
  'YRI': 'Yoruba / West African (YRI)',
  'ESN': 'Esan / West African (ESN)',
  'GWD': 'Gambian / West African (GWD)',
  'MSL': 'Mende / Sierra Leonean (MSL)',
  'LWK': 'Luhya / East African (LWK)',
  'BEB': 'Bengali / South Asian (BEB)',
  'GIH': 'Gujarati / South Asian (GIH)',
  'PJL': 'Punjabi / South Asian (PJL)',
  'ITU': 'Telugu / South Asian (ITU)',
  'STU': 'Tamil / South Asian (STU)',
  'CHB': 'Han Chinese / Beijing (CHB)',
  'CHS': 'Southern Han Chinese (CHS)',
  'JPT': 'Japanese / Yamato (JPT)',
  'KHV': 'Kinh Vietnamese / SE Asian (KHV)',
  'CDX': 'Chinese Dai / SE Asian (CDX)',
  'MXL': 'Mexican / Indigenous-Admixed (MXL)',
  'PUR': 'Puerto Rican / Indigenous-Admixed (PUR)',
  'CLM': 'Colombian / Indigenous-Admixed (CLM)',
  'PEL': 'Peruvian / Indigenous American (PEL)',
  'ASW': 'African-American / SW US (ASW)',
  'ACB': 'African Caribbean / Barbados (ACB)',
  // gnomAD populations
  'AFR_gnomAD': 'African (gnomAD)',
  'AMI_gnomAD': 'Amish / Germanic European (AMI)',
  'AMR_gnomAD': 'Latino / Admixed American (gnomAD)',
  'ASJ_gnomAD': 'Ashkenazi Jewish (ASJ)',
  'EAS_gnomAD': 'East Asian (gnomAD)',
  'FIN_gnomAD': 'Finnish (gnomAD)',
  'MID_gnomAD': 'Middle Eastern (gnomAD)',
  'NFE_gnomAD': 'Non-Finnish European (gnomAD)',
  'SAS_gnomAD': 'South Asian (gnomAD)',
  // ALFA populations
  'ALFA_AfAm': 'African-American (ALFA)',
  'ALFA_African': 'African (ALFA)',
  'ALFA_EAS': 'East Asian (ALFA)',
  'ALFA_EUR': 'European (ALFA)',
  'ALFA_LatAm1': 'Latin American 1 (ALFA)',
  'ALFA_LatAm2': 'Latin American 2 (ALFA)',
  'ALFA_SAS': 'South Asian (ALFA)',
  // Forensic and regional additions
  'GWF_Fula': 'Fula / West African (GWF)',
  'GWJ_Jola': 'Jola / West African (GWJ)',
  'GWW_Wolof': 'Wolof / West African (GWW)',
  'GEMJ_Japan': 'Japanese (GEM-J)',
  // Custom sub-populations
  'LMB': 'Lumbee / NC Indigenous-Admixed (LMB)',
  'GLL': 'Gullah Geechee / Atlantic Coast (GLL)',
  'CHK': 'Cherokee / Southern Appalachian (CHK)',
  'LNP': 'Lenape / Delaware Woodlands (LNP)',
  'NAN': 'Nanticoke / Delmarva Indigenous-Admixed (NAN)',
  'CAT': 'Catawba / Piedmont Siouan Admixture Proxy (CAT)',
  'WDN': 'Eastern Woodlands Indigenous (WDN)',
  'ASJ': 'Ashkenazi Jewish / European (ASJ)',
  'SEJ': 'Sephardic Jewish / Mediterranean (SEJ)',
  'MZJ': 'Mizrahi Jewish / Middle Eastern (MZJ)',
  'YMJ': 'Yemenite Jewish / Arabian (YMJ)',
  'MEL': 'Melungeon / Appalachian Tri-Racial (MEL)',
  // SGDP Injected Populations
  'sgdp_luo': 'Luo / Nilotic East African (Luo)',
  'sgdp_masai': 'Maasai / Nilotic East African (Masai)',
  'sgdp_bantuherero': 'Herero / Southern Bantu (SGDP)',
  'sgdp_bantukenya': 'Kenya Bantu / East African (SGDP)',
  'sgdp_bantutswana': 'Tswana / Southern Bantu (SGDP)',
  'sgdp_biaka': 'Biaka Pygmy / Central African (SGDP)',
  'sgdp_mbuti': 'Mbuti Pygmy / Central African (SGDP)',
  'sgdp_khomani_san': '‡Khomani San / Southern African (SGDP)',
  'sgdp_ju_hoan_north': 'Ju|\'hoansi / San Hunter-Gatherer (SGDP)',
  'sgdp_somali': 'Somali / Cushitic East African (SGDP)',
  'sgdp_malagasy': 'Malagasy / Madagascar (SGDP)',
  'sgdp_yoruba': 'Yoruba / West African (SGDP)',
  'sgdp_mandenka': 'Mandenka / West African (SGDP)',
  'sgdp_mende': 'Mende / Sierra Leonean (SGDP)',
  'sgdp_esan': 'Esan / Nigerian (SGDP)',
  'sgdp_gambian': 'Gambian / West African (SGDP)',
  'sgdp_luhya': 'Luhya / East African (SGDP)',
  'hgdp_yoruba': 'Yoruba / West African (HGDP)',
  'hgdp_mandenka': 'Mandenka / West African (HGDP)',
  'sgdp_jew_iraqi': 'Mizrahi Jewish / Iraqi (SGDP)',
  'sgdp_jew_yemenite': 'Yemenite Jewish (SGDP)',
  'sgdp_samaritan': 'Samaritan (SGDP)',
  'sgdp_karitiana': 'Karitiana / Amazonian (SGDP)',
  'sgdp_surui': 'Surui / Amazonian (SGDP)',
  'sgdp_pima': 'Pima / Central American (SGDP)',
  'sgdp_mixe': 'Mixe / Mexican Indigenous (SGDP)',
  'sgdp_mixtec': 'Mixtec / Mexican Indigenous (SGDP)',
  'sgdp_mayan': 'Maya / Central American (SGDP)',
  'sgdp_mexico_zapotec': 'Zapotec / Mexican Indigenous (SGDP)',
  'sgdp_quechua': 'Quechua / Andean (SGDP)',
  'sgdp_piapoco': 'Piapoco / Orinoco (SGDP)',
  'sgdp_tlingit': 'Tlingit / Pacific Northwest Indigenous (SGDP)',
  'sgdp_aleut': 'Aleutian Islander / Eskimo-Aleut (SGDP)',
  'sgdp_eskimo_chaplin': 'Siberian Eskimo / Chaplin (SGDP)',
  'sgdp_eskimo_naukan': 'Siberian Eskimo / Naukan (SGDP)',
  'sgdp_eskimo_sireniki': 'Siberian Eskimo / Sireniki (SGDP)',
  // Middle Eastern, North African, and Spanish Injected Populations
  'sgdp_spanish': 'Spanish / Southern European (SGDP)',
  'sgdp_saharawi': 'Saharawi / North African (SGDP)',
  'sgdp_mozabite': 'Mozabite / North African (SGDP)',
  'hgdp_mozabite': 'Mozabite / North African (HGDP)',
  'sgdp_bedouinb': 'Bedouin / Arabian Peninsula (SGDP)',
  'sgdp_druze': 'Druze / Levant (SGDP)',
  'sgdp_palestinian': 'Palestinian / Levant (SGDP)',
  'sgdp_jordanian': 'Jordanian / Levant (SGDP)',
  'sgdp_iranian': 'Iranian / Middle Eastern (SGDP)',
  'hgdp_bedouin': 'Bedouin / Arabian Peninsula (HGDP)',
  'hgdp_druze': 'Druze / Levant (HGDP)',
  'hgdp_palestinian': 'Palestinian / Levant (HGDP)',
  // Oceanian and Central Asian / Siberian Injected Populations
  'sgdp_australian': 'Aboriginal Australian (SGDP)',
  'sgdp_bougainville': 'Bougainville Islander (SGDP)',
  'sgdp_hawaiian': 'Native Hawaiian / Polynesian (SGDP)',
  'sgdp_maori': 'Māori / Polynesian (SGDP)',
  'sgdp_papuan': 'Papuan / Oceanian (SGDP)',
  'sgdp_altaian': 'Altaian / Siberian (SGDP)',
  'sgdp_chukchi': 'Chukchi / Siberian (SGDP)',
  'sgdp_even': 'Even / Siberian (SGDP)',
  'sgdp_itelmen': 'Itelmen / Siberian (SGDP)',
  'sgdp_kyrgyz_kyrgyzstan': 'Kyrgyz / Central Asian (SGDP)',
  'sgdp_mansi': 'Mansi / Siberian (SGDP)',
  'sgdp_tubalar': 'Tubalar / Siberian (SGDP)',
  'sgdp_ulchi': 'Ulchi / Siberian (SGDP)',
  'sgdp_uyghur': 'Uyghur / Central Asian (SGDP)',
  'sgdp_yakut': 'Yakut / Siberian (SGDP)',
  'hgdp_yakut': 'Yakut / Siberian (HGDP)',
  'hgdp_uygur': 'Uyghur / Central Asian (HGDP)',
  'hgdp_mongola': 'Mongolian / East Asian (HGDP)',
  'sgdp_mongola': 'Mongolian / East Asian (SGDP)',
  'hgdp_hazara': 'Hazara / Central Asian (HGDP)',
  'sgdp_hazara': 'Hazara / Central Asian (SGDP)',
  'hgdp_daur': 'Daur / East Asian (HGDP)',
  'sgdp_daur': 'Daur / East Asian (SGDP)',
  'hgdp_hezhen': 'Hezhen / East Asian (HGDP)',
  'sgdp_hezhen': 'Hezhen / East Asian (SGDP)',
  'hgdp_oroqen': 'Oroqen / Siberian (HGDP)',
  'sgdp_oroqen': 'Oroqen / Siberian (SGDP)',
  'hgdp_tujia': 'Tujia / East Asian (HGDP)',
  'sgdp_tujia': 'Tujia / East Asian (SGDP)',
  'hgdp_xibo': 'Xibo / East Asian (HGDP)',
  'sgdp_xibo': 'Xibo / East Asian (SGDP)',
  // US Synthetic Demographics
  'IRISH_AM': 'Irish American / Celtic (IRISH_AM)',
  'ITALIAN_AM': 'Italian American / Southern European (ITALIAN_AM)',
  'GERMAN_AM': 'German American / Central European (GERMAN_AM)',
  'CUBAN_AM': 'Cuban American / Caribbean (CUBAN_AM)',
  'DOMINICAN_AM': 'Dominican American / Caribbean (DOMINICAN_AM)',
  'FILIPINO_AM': 'Filipino American / SE Asian (FILIPINO_AM)',
  'VIETNAMESE_AM': 'Vietnamese American / SE Asian (VIETNAMESE_AM)',
  'AFRAM_SOUTH': 'African-American / Southern US (AFRAM_SOUTH)',
  'AFRAM_NORTHEAST': 'African-American / Northeast US (AFRAM_NORTHEAST)',
  'AFRAM_WEST': 'African-American / Western US (AFRAM_WEST)',
  'LOUISIANA_CREOLE': 'Louisiana Creole / Tri-Racial (LOUISIANA_CREOLE)',
  // Superpopulations and Global References
  'ALL': 'Global Reference (ALL)',
  'EUR': 'European Reference (EUR)',
  'AFR': 'African Reference (AFR)',
  'EAS': 'East Asian Reference (EAS)',
  'SAS': 'South Asian Reference (SAS)',
  'AMR': 'Indigenous American Reference (AMR)',
  'MENA': 'Middle Eastern Reference (MENA)',
  'OCE': 'Oceanian Reference (OCE)',
  'CAS': 'Central Asian & Siberian Reference (CAS)'
};

// Macro-continental Group Classifications for Hierarchy-Aware Matching
const MACRO_GROUPS: Record<string, string[]> = {
  'AFR': [
    'ESN', 'GWD', 'LWK', 'MSL', 'YRI',
    'GWF_Fula', 'GWJ_Jola', 'GWW_Wolof', 'ALFA_African', 'AFR_gnomAD',
    'sgdp_luo', 'sgdp_masai', 'sgdp_bantuherero', 'sgdp_bantukenya', 
    'sgdp_bantutswana', 'sgdp_biaka', 'sgdp_mbuti', 'sgdp_khomani_san', 
    'sgdp_ju_hoan_north', 'sgdp_somali', 'sgdp_malagasy', 'sgdp_yoruba', 
    'sgdp_mandenka', 'sgdp_mende', 'sgdp_esan', 'sgdp_gambian', 'sgdp_luhya',
    'hgdp_yoruba', 'hgdp_mandenka'
  ],
  'AFRAM': [
    'ACB', 'ASW', 'GLL', 'ALFA_AfAm', 'AFRAM_SOUTH', 'AFRAM_NORTHEAST', 
    'AFRAM_WEST', 'LOUISIANA_CREOLE'
  ],
  'EUR': [
    'CEU', 'FIN', 'GBR', 'IBS', 'TSI',
    'AMI_gnomAD', 'NFE_gnomAD', 'FIN_gnomAD', 'ALFA_EUR',
    'ASJ_gnomAD', 'ASJ', 'SEJ',
    'IRISH_AM', 'ITALIAN_AM', 'GERMAN_AM', 'sgdp_spanish'
  ],
  'EAS': [
    'CDX', 'CHB', 'CHS', 'JPT', 'KHV',
    'GEMJ_Japan', 'EAS_gnomAD', 'ALFA_EAS',
    'FILIPINO_AM', 'VIETNAMESE_AM'
  ],
  'SAS': [
    'BEB', 'GIH', 'ITU', 'PJL', 'STU',
    'SAS_gnomAD', 'ALFA_SAS'
  ],
  'AMR': [
    'PEL', 'LMB', 'CHK', 'LNP', 'NAN', 'CAT', 'WDN', 'MEL',
    'sgdp_karitiana', 'sgdp_surui', 'sgdp_pima', 'sgdp_mixe', 'sgdp_mixtec', 
    'sgdp_mayan', 'sgdp_mexico_zapotec', 'sgdp_quechua', 'sgdp_piapoco',
    'sgdp_tlingit', 'sgdp_aleut', 'sgdp_eskimo_chaplin', 'sgdp_eskimo_naukan',
    'sgdp_eskimo_sireniki'
  ],
  'AMER': [
    'CLM', 'MXL', 'PUR', 'ALFA_LatAm1', 'ALFA_LatAm2', 'AMR_gnomAD',
    'CUBAN_AM', 'DOMINICAN_AM'
  ],
  'MENA': [
    'MID_gnomAD', 'MZJ', 'YMJ', 'sgdp_jew_iraqi', 'sgdp_jew_yemenite', 'sgdp_samaritan',
    'sgdp_saharawi', 'sgdp_mozabite', 'hgdp_mozabite', 'sgdp_bedouinb', 'sgdp_druze', 
    'sgdp_palestinian', 'sgdp_jordanian', 'sgdp_iranian', 'hgdp_bedouin', 'hgdp_druze', 
    'hgdp_palestinian'
  ],
  'OCE': [
    'sgdp_australian', 'sgdp_bougainville', 'sgdp_hawaiian', 'sgdp_maori', 'sgdp_papuan'
  ],
  'CAS': [
    'sgdp_altaian', 'sgdp_chukchi', 'sgdp_even', 'sgdp_itelmen', 'sgdp_kyrgyz_kyrgyzstan', 
    'sgdp_mansi', 'sgdp_tubalar', 'sgdp_ulchi', 'sgdp_uyghur', 'sgdp_yakut', 'hgdp_yakut', 
    'hgdp_uygur', 'hgdp_mongola', 'sgdp_mongola', 'hgdp_hazara', 'sgdp_hazara',
    'hgdp_daur', 'sgdp_daur', 'hgdp_hezhen', 'sgdp_hezhen', 'hgdp_oroqen', 'sgdp_oroqen',
    'hgdp_tujia', 'sgdp_tujia', 'hgdp_xibo', 'sgdp_xibo'
  ]
};

/**
 * Fast, highly optimized Damerau-Levenshtein Edit Distance Solver
 * Calculates the exact distance allowing insertion, deletion, substitution, and transposition of characters.
 */
function damerauLevenshtein(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  const d: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && s1[i - 1] === s2[j - 2] && s1[i - 2] === s2[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }
  return d[len1][len2];
}

function alignGenotype(genotype: string, targetAlleles: string[]): string {
  const upperGeno = genotype.toUpperCase();
  if (upperGeno === '--' || upperGeno.length === 0) return upperGeno;

  const hasDirectMatch = upperGeno.split('').some(char => targetAlleles.includes(char));
  if (hasDirectMatch) {
    return upperGeno;
  }

  const complementMap: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
  const complementGeno = upperGeno.split('').map(b => complementMap[b] || b).join('');
  const hasCompMatch = complementGeno.split('').some(char => targetAlleles.includes(char));
  if (hasCompMatch) {
    return complementGeno;
  }

  return upperGeno;
}

// Local high-performance index caching variables
let isSnpCacheInitialized = false;
const normalizedKeyToOriginal = new Map<string, string>();
const snpBucketMap = new Map<string, string[]>(); // Hash bucketing for O(1) group filtering

/**
 * Lazy initializer for AIM markers index to prevent memory bloat
 */
function initializeSnpCache(databaseKeys: string[]) {
  if (isSnpCacheInitialized) return;
  for (const key of databaseKeys) {
    const clean = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean) {
      normalizedKeyToOriginal.set(clean, key);
      const prefix = clean.substring(0, 3);
      if (!snpBucketMap.has(prefix)) {
        snpBucketMap.set(prefix, []);
      }
      snpBucketMap.get(prefix)!.push(clean);
    }
  }
  isSnpCacheInitialized = true;
}

/**
 * Fuzzy-matching resolver to handle nomenclature variations or typos
 */
function resolveSnpName(userRsid: string, databaseKeys: string[], allowFuzzy = false): string | null {
  const raw = userRsid.toLowerCase();
  
  // 1. Direct short-circuit matches
  if (normalizedKeyToOriginal.has(raw)) {
    return normalizedKeyToOriginal.get(raw) || null;
  }
  
  initializeSnpCache(databaseKeys);
  
  const cleanUser = raw.replace(/[^a-z0-9]/g, '');
  if (!cleanUser) return null;

  // 2. Direct normalized match
  const normMatch = normalizedKeyToOriginal.get(cleanUser);
  if (normMatch) {
    return normMatch;
  }

  if (!allowFuzzy) {
    return null;
  }

  // 3. Tabix-inspired local bucketing fuzzy match using Levenshtein distance <= 2
  const prefix = cleanUser.substring(0, 3);
  const candidates = snpBucketMap.get(prefix) || [];
  
  let bestMatch: string | null = null;
  let bestDistance = 3; // allowable threshold = 2

  for (const candidate of candidates) {
    if (Math.abs(candidate.length - cleanUser.length) > 2) continue;
    const dist = damerauLevenshtein(cleanUser, candidate);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestMatch = normalizedKeyToOriginal.get(candidate) || null;
    }
  }

  return bestMatch;
}


/**
 * Pure TypeScript Non-Negative Least Squares (NNLS) solver using Lawson-Hanson.
 * Multi-source deconvolution of mixed ancestral profiles.
 */
export function solveAdmixtureProportions(
  userDosages: Float32Array,
  popExpectedDosages: Record<string, Float32Array>,
  aimWeights: Float32Array,
  numIterations = 200
): Record<string, number> {
  const popCodes = Object.keys(popExpectedDosages);
  if (popCodes.length === 0 || userDosages.length === 0) return {};

  const P = popCodes.length;
  const M = userDosages.length;

  // Build A matrix (M x P)
  // A[i][j] = expected dosage of marker i in pop j
  const A: number[][] = new Array(M);
  for (let i = 0; i < M; i++) {
    A[i] = new Array(P);
    for (let p = 0; p < P; p++) {
      A[i][p] = popExpectedDosages[popCodes[p]][i];
    }
  }

  // userDosages is Float32Array, convert to standard array for solveNNLS
  const b = Array.from(userDosages);
  const w = Array.from(aimWeights);

  // To enforce sum(x) = 1, we augment A and b with a heavily weighted row.
  // We want sum_p x_p = 1. So lambda * sum_p x_p = lambda.
  const LAMBDA = 1000;
  const augA = new Array(P).fill(LAMBDA);
  A.push(augA);
  b.push(LAMBDA);
  w.push(1.0); // Augment weight

  // Solve exact NNLS using Lawson-Hanson
  const x = solveNNLS(A, b, w);

  // Normalize exact proportions (to fix tiny floating point residuals from lambda enforcement)
  const sum = x.reduce((acc, val) => acc + val, 0);
  const normalized = sum > 0 ? x.map(val => val / sum) : x;

  const result: Record<string, number> = {};
  popCodes.forEach((code, idx) => {
    if (normalized[idx] > 0.005) { // Minimum listing threshold of 0.5%
      result[code] = normalized[idx] * 100;
    }
  });

  return result;
}

/**
 * Primary High Resolution Bayesian Ancestry and Subpopulation Oracle Solver (Engine v3)
 */
export function processSubpopulations(
  userGenotypes: UserGenotype[],
  aimsDatabase: AIM[],
  sampleId?: string,
  snpMetaMap?: Record<string, { chrom: string; pos: number }>,
  panel: 'all' | 'kidd55' | 'seldin128' | 'euroforgen' = 'all'
): OracleResult {
  const normalizedDatabase = getMasterAims() as Record<string, any>;
  const referenceDatabase = hoReferenceKernel as Record<string, { region: string; frequencies: Record<string, number> }>;
  const GLOBAL_REFERENCE_CODES = new Set([
    // Superpopulations and Global References
    'ALL', 'EUR', 'AFR', 'EAS', 'SAS', 'AMR',
    // Broad gnomAD panels
    'AFR_gnomAD', 'AMR_gnomAD', 'EAS_gnomAD', 'SAS_gnomAD', 'NFE_gnomAD',
    // Broad ALFA panels
    'ALFA_African', 'ALFA_EAS', 'ALFA_EUR', 'ALFA_LatAm1', 'ALFA_LatAm2', 'ALFA_SAS', 'ALFA_AfAm'
  ]);
  const dbKeys = Object.keys(normalizedDatabase);

  // Build a fast lookup mapping from base rsid to the database key
  const dbBaseMap = new Map<string, string>();
  for (const key of dbKeys) {
    const base = key.split('_')[0].toLowerCase();
    if (!dbBaseMap.has(base)) {
      dbBaseMap.set(base, key);
    }
  }

  // Pre-index user genotypes by their standard base RSID
  const genotypeMap = new Map<string, string>();
  for (const g of userGenotypes) {
    if (g.genotype && g.genotype !== '--') {
      const resolved = resolveSnpName(g.rsid, dbKeys);
      if (resolved) {
        genotypeMap.set(resolved.toLowerCase(), g.genotype);
      } else {
        const base = g.rsid.split('_')[0].toLowerCase();
        genotypeMap.set(base, g.genotype);
      }
    }
  }

  let breakdown: SubpopBreakdown[] = [];
  const unmappedAims: AIM[] = [];
  const usedAimsSet = new Set<string>();

  // Intermediate raw pop metrics
  const popDistances = new Map<string, number>();
  const popMarkerCounts = new Map<string, number>();
  const negativeViolations = new Map<string, number>();

  // --- COMPONENT 1: Spatial Gene-Locus Mapping (All Available Markers) ---
  const prunedGenotypesMap = new Map<string, { genotype: string; gene?: string; weight: number }>();
  const markersToPrune: Array<{ rsid: string; dbKey: string; chromosome: string; position: number; genotype: string; gene?: string; weight: number }> = [];

  for (const [rsid, genotype] of genotypeMap.entries()) {
    // Apply panel filter if specified
    if (panel !== 'all') {
      const panelSet = new Set((forensicPanels as any)[panel]?.map((id: string) => id.toLowerCase()) || []);
      const baseRsid = rsid.split('_')[0].toLowerCase();
      if (!panelSet.has(baseRsid)) {
        continue;
      }
    }

    const dbKey = dbBaseMap.get(rsid) || rsid;
    const aim = normalizedDatabase[dbKey] || normalizedDatabase[dbKey.toUpperCase()] || normalizedDatabase[rsid] || normalizedDatabase[rsid.toUpperCase()];
    if (aim) {
      // Find chromosome and position from metadata or database entry
      const meta = snpMetaMap?.[rsid] || snpMetaMap?.[rsid.toUpperCase()] || snpMetaMap?.[dbKey] || snpMetaMap?.[dbKey.toUpperCase()];
      const chrom = meta?.chrom || aim.chromosome;
      const position = meta?.pos || aim.position;

      // Filter out Y-DNA, mtDNA, and sex chromosomes (X/Y) to isolate deconvolution from haplogroups
      const chromStr = String(chrom || '').toUpperCase().replace('CHR', '');
      const isSexOrMt = chromStr === 'X' || chromStr === 'Y' || chromStr === 'MT' || chromStr === 'M' ||
                        chromStr === '23' || chromStr === '24' || chromStr === '25' || chromStr === '26';
      
      const isSexOrMtKey = (k: string) => {
        const kl = k.toLowerCase();
        return kl.startsWith('chry_') || kl.startsWith('chrx_') || kl.startsWith('chrmt_') || kl.startsWith('chrm_') ||
               kl.startsWith('chr23_') || kl.startsWith('chr24_') || kl.startsWith('chr25_') || kl.startsWith('chr26_');
      };

      if (isSexOrMt || isSexOrMtKey(rsid) || isSexOrMtKey(dbKey)) {
        continue;
      }
      
      // Align raw genotype to target alleles using base-complementation if needed
      const targetAlleles: string[] = [];
      const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid.toLowerCase()] ||
                     (graf10kIndex as any)[dbKey] || (graf10kIndex as any)[dbKey.toUpperCase()] || (graf10kIndex as any)[dbKey.toLowerCase()];
      if (marker) {
        targetAlleles.push(marker.ref.toUpperCase(), marker.alt.toUpperCase());
      } else if (aim.alleles) {
        if (Array.isArray(aim.alleles)) {
          targetAlleles.push(...aim.alleles.map((a: string) => a.toUpperCase()));
        } else if (typeof aim.alleles === 'string') {
          targetAlleles.push(...aim.alleles.toUpperCase().split(''));
        }
      }
      const alignedGenotype = alignGenotype(genotype, targetAlleles);
      
      let popVarianceWeight = 1.5;
      if (aim.frequencies) {
        const freqs = Object.values(aim.frequencies) as number[];
        if (freqs.length > 1) {
          const mean = freqs.reduce((a, b) => a + b, 0) / freqs.length;
          const variance = freqs.reduce((a, b) => a + (b - mean) ** 2, 0) / freqs.length;
          popVarianceWeight = 0.5 + (variance * 4.0);
        }
      }
      
      const entry = {
        genotype: alignedGenotype,
        gene: aim.gene,
        weight: (aim.weight || 1.0) * popVarianceWeight
      };

      if (chrom && typeof position === 'number' && !isNaN(position)) {
        markersToPrune.push({
          rsid,
          dbKey: dbKey.toLowerCase(),
          chromosome: String(chrom),
          position,
          genotype: alignedGenotype,
          gene: aim.gene,
          weight: (aim.weight || 1.0) * popVarianceWeight
        });
      } else {
        // If coordinate metadata is missing, fallback to including it directly
        prunedGenotypesMap.set(rsid, entry);
        prunedGenotypesMap.set(dbKey.toLowerCase(), entry);
      }
    }
  }

  // Use the centralized pruner with 50kb physical distance threshold
  const prunedList = pruneMarkersByPhysicalDistance(markersToPrune, 50000);
  prunedList.forEach(m => {
    const entry = { genotype: m.genotype, gene: m.gene, weight: m.weight };
    prunedGenotypesMap.set(m.rsid, entry);
    prunedGenotypesMap.set(m.dbKey, entry);
  });

  // Iterate over each population in the 1000 Genomes reference kernel to compute distances & negative SNP counts
  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    if (GLOBAL_REFERENCE_CODES.has(popCode)) continue;
    const frequencies = popData.frequencies;
    const matchedKeys: string[] = [];
    const matchedUserDosages: number[] = [];
    const matchedRefFreqs: number[] = [];
    const matchedWeights: number[] = [];
    let violations = 0;

    for (const [rsid, refFreq] of Object.entries(frequencies)) {
      const rsidLower = rsid.toLowerCase();
      const meta = prunedGenotypesMap.get(rsidLower);

      if (!meta) {
        continue;
      }

      matchedKeys.push(rsidLower);
      usedAimsSet.add(rsidLower);

      const genotype = meta.genotype;
      const aim = normalizedDatabase[rsidLower] || normalizedDatabase[rsid.toUpperCase()] || normalizedDatabase[rsid];
      let userDosageDiscrete = 1; // Default to heterozygous (1 copy)

      const marker = (graf10kIndex as any)[rsidLower] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid];
      if (marker) {
        const alt = marker.alt.toUpperCase();
        let matchCount = 0;
        for (const char of genotype.toUpperCase()) {
          if (char === alt) {
            matchCount++;
          }
        }
        userDosageDiscrete = matchCount; // Will yield 0, 1, or 2
      } else if (aim && aim.alleles && aim.alleles.length > 0) {
        const testAllele = aim.alleles[0];
        let matchCount = 0;
        for (const char of genotype) {
          if (char === testAllele) {
            matchCount++;
          }
        }
        userDosageDiscrete = matchCount; // Will yield 0, 1, or 2
      } else {
        // Fallback dosage calculation when allele identity is unknown.
        // For homozygous calls we default to 1 (het equivalent) rather than
        // guessing 0 or 2 based on frequency, which was producing systematic errors
        // (homozygous REF was being scored as dosage 2 when it should be 0).
        if (genotype[0] === genotype[1]) {
          userDosageDiscrete = 1; // Uncertain homozygous: use middle ground
        } else {
          userDosageDiscrete = 1; // Heterozygous
        }
      }

      matchedUserDosages.push(userDosageDiscrete);
      matchedRefFreqs.push(refFreq);
      matchedWeights.push(meta.weight);

      // --- COMPONENT 2: Explicit Cladistic Negation Gating ---
      // If the reference clade strictly requires this derived allele (frequency >= 0.85)
      // but the user exhibits the ancestral homozygous state (dosage is 0), count as a decisive violation
      if (refFreq >= 0.85 && userDosageDiscrete === 0) {
        violations++;
      }

      // Mutual diagnostic gating for highly fixated population-defining markers
      // rs2814778 (Duffy Null): Fixated in sub-Saharan Africans, absent in Europeans
      if (rsidLower === 'rs2814778') {
        const isAfricanPop = MACRO_GROUPS['AFR'].includes(popCode);
        const isEuropeanPop = MACRO_GROUPS['EUR'].includes(popCode);
        if (isAfricanPop && userDosageDiscrete === 0) {
          // European carrying CC (ancestral, non-Duffy-null homozygous) gets a penalty against African clades
          violations += 2.0; 
        } else if (isEuropeanPop && userDosageDiscrete === 2) {
          // African carrying G/G or T/T (Duffy null homozygous) gets a penalty against European clades
          violations += 2.0;
        }
      }

      // rs1426654 (SLC24A5) and rs16891982 (SLC45A2): Nearly 100% fixated for European alleles
      if (rsidLower === 'rs1426654' || rsidLower === 'rs16891982') {
        const isAfricanPop = MACRO_GROUPS['AFR'].includes(popCode);
        const isEuropeanPop = MACRO_GROUPS['EUR'].includes(popCode);
        if (isAfricanPop && userDosageDiscrete === 2) {
          // User has homozygous European-derived allele: penalize African clades
          violations += 1.5;
        } else if (isEuropeanPop && userDosageDiscrete === 0) {
          // User has homozygous African ancestral allele (0 copies of European allele): penalize European clades
          violations += 1.5;
        }
      }

      // rs3827760 (EDAR): East Asian (EAS) and Native American (AMR) diagnostic marker. High frequency in EAS/AMR, absent in EUR/AFR
      if (rsidLower === 'rs3827760') {
        const isEastAsianPop = MACRO_GROUPS['EAS'].includes(popCode);
        const isAmrPop = MACRO_GROUPS['AMR'].includes(popCode);
        const isEuropeanPop = MACRO_GROUPS['EUR'].includes(popCode);
        const isAfricanPop = MACRO_GROUPS['AFR'].includes(popCode);
        if ((isEastAsianPop || isAmrPop) && userDosageDiscrete === 0) {
          // Lacks EDAR derived allele: penalize EAS and AMR clades
          violations += 2.0;
        } else if ((isEuropeanPop || isAfricanPop) && userDosageDiscrete === 2) {
          // Has homozygous derived allele: penalize European/African clades
          violations += 2.0;
        }
      }

      // rs3094315: Highly diagnostic Indigenous American (AMR) marker (associated with unadmixed AMR populations like PEL/MXL)
      if (rsidLower === 'rs3094315') {
        const isAmrPop = MACRO_GROUPS['AMR'].includes(popCode);
        const isEuropeanPop = MACRO_GROUPS['EUR'].includes(popCode);
        const isAfricanPop = MACRO_GROUPS['AFR'].includes(popCode);
        if (isAmrPop && userDosageDiscrete === 0) {
          // User lacks Indigenous American alleles: penalize AMR reference clades
          violations += 1.5;
        } else if ((isEuropeanPop || isAfricanPop) && userDosageDiscrete === 2) {
          // User is homozygous AMR-allele: penalize European and African reference populations
          violations += 1.5;
        }
      }

      // rs16139 and rs2229765: African (AFR) vs Non-African diagnostic variants (highly fixated in AFR, rare/absent elsewhere)
      if (rsidLower === 'rs16139' || rsidLower === 'rs2229765') {
        const isAfricanPop = MACRO_GROUPS['AFR'].includes(popCode);
        const isEuropeanPop = MACRO_GROUPS['EUR'].includes(popCode);
        const isEastAsianPop = MACRO_GROUPS['EAS'].includes(popCode);
        if (isAfricanPop && userDosageDiscrete === 0) {
          // User lacks African-fixated variant: penalize African reference clades
          violations += 1.5;
        } else if ((isEuropeanPop || isEastAsianPop) && userDosageDiscrete === 2) {
          // User has homozygous African variant: penalize European/East Asian clades
          violations += 1.5;
        }
      }

      // rs7388531 (ABCC11) and rs671 (ALDH2): Specific East Asian (EAS) diagnostic variants
      if (rsidLower === 'rs7388531' || rsidLower === 'rs671') {
        const isEastAsianPop = MACRO_GROUPS['EAS'].includes(popCode);
        const isEuropeanPop = MACRO_GROUPS['EUR'].includes(popCode);
        const isAfricanPop = MACRO_GROUPS['AFR'].includes(popCode);
        if (isEastAsianPop && userDosageDiscrete === 0) {
          // Lacks EAS variants: penalize EAS clades
          violations += 1.5;
        } else if ((isEuropeanPop || isAfricanPop) && userDosageDiscrete === 2) {
          // Homozygous for EAS variants: penalize European and African clades
          violations += 1.5;
        }
      }

      // rs12203592 (IRF4): South Asian (SAS) diagnostic variant
      if (rsidLower === 'rs12203592') {
        const isSouthAsianPop = MACRO_GROUPS['SAS'].includes(popCode);
        const isAfricanPop = MACRO_GROUPS['AFR'].includes(popCode);
        const isEastAsianPop = MACRO_GROUPS['EAS'].includes(popCode);
        if (isSouthAsianPop && userDosageDiscrete === 0) {
          // Lacks South Asian variant: penalize SAS reference clades
          violations += 1.0;
        } else if ((isAfricanPop || isEastAsianPop) && userDosageDiscrete === 2) {
          // Homozygous for SAS variant: penalize African/East Asian clades
          violations += 1.0;
        }
      }

      // rs1042602 (TYR): Diagnostic Native American/European vs East Asian/African variant
      if (rsidLower === 'rs1042602') {
        const isAmrPop = MACRO_GROUPS['AMR'].includes(popCode);
        const isEuropeanPop = MACRO_GROUPS['EUR'].includes(popCode);
        const isEastAsianPop = MACRO_GROUPS['EAS'].includes(popCode);
        const isAfricanPop = MACRO_GROUPS['AFR'].includes(popCode);
        if ((isAmrPop || isEuropeanPop) && userDosageDiscrete === 0) {
          violations += 1.0;
        } else if ((isEastAsianPop || isAfricanPop) && userDosageDiscrete === 2) {
          violations += 1.0;
        }
      }
    }

    const M = matchedUserDosages.length;
    popMarkerCounts.set(popCode, M);
    negativeViolations.set(popCode, violations);

    if (M >= 10) {
      // Euclidean Distance calculations vectorized in Float32Array
      const userVector = new Float32Array(M);
      const refVector = new Float32Array(M);

      for (let i = 0; i < M; i++) {
        userVector[i] = matchedUserDosages[i];
        refVector[i] = matchedRefFreqs[i] * 2.0; // Expected continuous dosage [0, 2]
      }

      let weightedSquaredDiffSum = 0;
      let totalW = 0;
      for (let i = 0; i < M; i++) {
        const wt = matchedWeights[i];
        const normalDiff = (userVector[i] - refVector[i]) / 2.0; // range [0, 2] / 2 -> [0, 1] scope
        weightedSquaredDiffSum += (normalDiff * normalDiff) * wt;
        totalW += wt;
      }

      const meanW = totalW / M;
      const baseDistance = Math.sqrt(weightedSquaredDiffSum / (totalW || 1.0));

      // Scale penalties for ancestral allele/cladistic conflicts.
      // Uniform penalty across all populations — previously EUR had a lower penalty (0.12)
      // which gave European populations a systematic scoring advantage over all others.
      const penaltyFactor = 0.18;
      const normalizedViolations = violations / (M / 100.0);
      const adjustedDistance = baseDistance * (1.0 + penaltyFactor * normalizedViolations);
      popDistances.set(popCode, adjustedDistance);
    } else {
      popDistances.set(popCode, 1.0); // Insufficient markers fallback
    }
  }

  // --- COMPONENT 3: Hierarchy-Aware Segment Allocation PASS ---
  const macroDistances: Record<string, number> = {};
  for (const [macro, pops] of Object.entries(MACRO_GROUPS)) {
    let sumDist = 0;
    let validCount = 0;
    for (const popCode of pops) {
      const dist = popDistances.get(popCode);
      if (dist !== undefined && dist < 1.0) {
        sumDist += dist;
        validCount++;
      }
    }
    macroDistances[macro] = validCount > 0 ? sumDist / validCount : 1.0;
  }

  // Identify dominant continental macro cluster.
  // Default is 'UNKNOWN' (not 'EUR') to prevent false European assignments
  // when marker coverage is insufficient.
  let dominantMacro = 'UNKNOWN';
  let minMacroDist = Infinity;
  for (const [macro, dist] of Object.entries(macroDistances)) {
    if (dist < minMacroDist) {
      minMacroDist = dist;
      dominantMacro = macro;
    }
  }

  // Final continental prioritization — raw distances only, no circular boost.
  // Previously the dominant macro's populations received a 0.90× discount while
  // all others received a 1.08× penalty AFTER the winner was already chosen,
  // creating a positive-feedback loop that obliterated realistic admixture proportions.
  // NNLS (Component 4 below) handles admixture proportions; the breakdown list
  // is now sorted purely by distance with no post-hoc adjustments.
  const rawBreakdown: Array<{ subpop: string; distance: number; markersCompared: number; count: number }> = [];
  const MIN_MARKERS = panel !== 'all' ? 1 : 5; // Lower limit when a panel is active so thin marker sets do not result in empty breakdowns
  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    if (GLOBAL_REFERENCE_CODES.has(popCode)) continue;
    const finalDistance = popDistances.get(popCode) ?? 1.0;
    const markersCompared = popMarkerCounts.get(popCode) ?? 0;

    if (markersCompared >= MIN_MARKERS) {
      const popName = POPULATION_NAMES_MAP[popCode] || popCode;

      rawBreakdown.push({
        subpop: popName,
        distance: finalDistance,
        markersCompared,
        count: markersCompared
      });
    }
  }

  // Sort breakdown list so closest proximity matches are first
  rawBreakdown.sort((a, b) => a.distance - b.distance);

  const minDist = rawBreakdown.length > 0 ? rawBreakdown[0].distance : 0.0;
  breakdown = rawBreakdown.map(item => {
    const uiDistance = 0.05 + (item.distance - minDist);
    const similarityScore = Math.max(5.0, Math.min(99.8, (1.0 - (uiDistance * 2.2)) * 100));
    return {
      subpop: item.subpop,
      distance: item.distance,
      similarityScore,
      markersCompared: item.markersCompared,
      count: item.count
    };
  });
  
  let topMatch = 'Unknown';
  if (breakdown.length > 0) {
    topMatch = breakdown[0].subpop;
  } else {
    const SUPER_POP_LABELS: Record<string, string> = {
      'AFR': 'African (AFR)',
      'AFRAM': 'African-American (AFRAM)',
      'EUR': 'European (EUR)',
      'EAS': 'East Asian (EAS)',
      'SAS': 'South Asian (SAS)',
      'AMR': 'Indigenous American (AMR)',
      'AMER': 'Admixed American (AMER)',
      'MENA': 'Middle Eastern / North African (MENA)',
      'OCE': 'Oceanian (OCE)',
      'CAS': 'Central Asian & Siberian (CAS)'
    };
    // Use the detected dominant macro — 'UNKNOWN' is surfaced as 'Undetermined'
    // rather than silently defaulting to European.
    const macroName = SUPER_POP_LABELS[dominantMacro] ?? 'Undetermined (Insufficient Markers)';
    topMatch = macroName;
    breakdown.push({
      subpop: macroName,
      distance: macroDistances[dominantMacro] ?? 0.5,
      similarityScore: Math.max(30.0, (1.0 - ((macroDistances[dominantMacro] ?? 0.5) * 2.2)) * 100),
      markersCompared: usedAimsSet.size,
      count: usedAimsSet.size
    });
  }

  // --- COMPONENT 4: Deconvolution Admixture Modeling (NNLS Solver) ---
  // Compile the collective list of reference alleles and user genotypes
  const activeSnpKeys = Array.from(usedAimsSet);
  const activeM = activeSnpKeys.length;

  const nnlsWeights = new Float32Array(activeM);
  const nnlsUserDosages = new Float32Array(activeM);
  const nnlsPopExpectedDosages: Record<string, Float32Array> = {};

  // Build the expected matrices
  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    if (GLOBAL_REFERENCE_CODES.has(popCode)) continue;
    nnlsPopExpectedDosages[popCode] = new Float32Array(activeM);
  }

  activeSnpKeys.forEach((rsid, idx) => {
    const meta = prunedGenotypesMap.get(rsid)!;
    nnlsWeights[idx] = meta.weight;

    const aim = normalizedDatabase[rsid] || normalizedDatabase[rsid.toUpperCase()];
    let uDosage = 1;

    const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid.toLowerCase()];
    if (marker) {
      const alt = marker.alt.toUpperCase();
      let matchCount = 0;
      for (const char of meta.genotype.toUpperCase()) {
        if (char === alt) matchCount++;
      }
      uDosage = matchCount;
    } else if (aim && aim.alleles && aim.alleles.length > 0) {
      const testAllele = aim.alleles[0];
      let matchCount = 0;
      for (const char of meta.genotype) {
        if (char === testAllele) matchCount++;
      }
      uDosage = matchCount;
    } else {
      // Fallback: dosage 1 (middle ground) avoids incorrect REF/ALT homozygous assignment
      uDosage = 1;
    }
    
    nnlsUserDosages[idx] = uDosage;

    // Fill in expected frequencies or apply Soft Bayesian priors for missing subpopulation values
    for (const [popCode, popData] of Object.entries(referenceDatabase)) {
      if (GLOBAL_REFERENCE_CODES.has(popCode)) continue;
      let freq = popData.frequencies[rsid] || popData.frequencies[rsid.toUpperCase()];
      
      if (freq === undefined) {
        // Soft Bayesian Prior Imputation fallback:
        // Use the macro-group continental frequency from the AIM database.
        // Previously this fell back to 'EUR' when the pop code was unrecognized,
        // causing missing-data imputation to use European allele frequencies for non-EUR pops.
        const macroCode = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) ?? null;
        freq = macroCode ? (aim?.frequencies?.[macroCode] ?? 0.5) : 0.5;
      }
      
      nnlsPopExpectedDosages[popCode][idx] = freq * 2.0; // continuous expected dosage
    }
  });

  // Calculate the Multi-source Admixture profile with Hierarchical (Two-Pass) Admixture Routing
  let admixtureMix: AdmixtureComponent[] = [];
  if (activeM >= 5) {
    // Pass 1: Run initial NNLS across all reference subpopulations
    const firstPassProportions = solveAdmixtureProportions(nnlsUserDosages, nnlsPopExpectedDosages, nnlsWeights);
    
    // Aggregate continental ancestry percentages based on MACRO_GROUPS
    const continentalAncestry: Record<string, number> = {
      'EUR': 0, 'AFR': 0, 'AFRAM': 0, 'EAS': 0, 'SAS': 0, 'AMR': 0, 'AMER': 0, 'MENA': 0, 'OCE': 0, 'CAS': 0
    };
    Object.entries(firstPassProportions).forEach(([popCode, pct]) => {
      const macroCode = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) || 'EUR';
      continentalAncestry[macroCode] = (continentalAncestry[macroCode] || 0) + pct;
    });

    // Sub-select populations: include continental groups with >= 2.0% ancestry
    const activeMacroGroups = Object.entries(continentalAncestry)
      .filter(([_, pct]) => pct >= 2.0)
      .map(([macro, _]) => macro);

    // Fallback if no group meets the threshold: select the single macro group with the highest percentage
    if (activeMacroGroups.length === 0) {
      let maxPct = -1;
      let maxMacro = 'EUR';
      Object.entries(continentalAncestry).forEach(([macro, pct]) => {
        if (pct > maxPct) {
          maxPct = pct;
          maxMacro = macro;
        }
      });
      activeMacroGroups.push(maxMacro);
    }

    // Pass 2: Filter reference clades to only keep populations in active continental groups
    const filteredPopExpectedDosages: Record<string, Float32Array> = {};
    for (const popCode of Object.keys(nnlsPopExpectedDosages)) {
      const macroCode = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) || 'EUR';
      if (activeMacroGroups.includes(macroCode)) {
        filteredPopExpectedDosages[popCode] = nnlsPopExpectedDosages[popCode];
      }
    }

    // Run final Pass 2 NNLS deconvolution on sub-selected populations
    const finalProportions = solveAdmixtureProportions(nnlsUserDosages, filteredPopExpectedDosages, nnlsWeights);

    admixtureMix = Object.entries(finalProportions)
      .map(([popCode, percentage]) => ({
        popCode,
        name: POPULATION_NAMES_MAP[popCode] || popCode,
        percentage
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  if (admixtureMix.length === 0) {
    const SUPER_POP_LABELS: Record<string, string> = {
      'AFR': 'African (AFR)',
      'AFRAM': 'African-American (AFRAM)',
      'EUR': 'European (EUR)',
      'EAS': 'East Asian (EAS)',
      'SAS': 'South Asian (SAS)',
      'AMR': 'Indigenous American (AMR)',
      'AMER': 'Admixed American (AMER)',
      'MENA': 'Middle Eastern / North African (MENA)',
      'OCE': 'Oceanian (OCE)',
      'CAS': 'Central Asian & Siberian (CAS)'
    };
    // Use the actual dominant macro rather than defaulting to EUR
    admixtureMix.push({
      popCode: dominantMacro,
      name: SUPER_POP_LABELS[dominantMacro] ?? 'Undetermined',
      percentage: 100.0
    });
  }

  // Map unmapped broad regional segments for metrics
  for (const [rsidLower, genotype] of genotypeMap.entries()) {
    if (!usedAimsSet.has(rsidLower)) {
      const aim = normalizedDatabase[rsidLower];
      if (aim) {
        let chrom = 'Unknown';
        if (snpMetaMap && snpMetaMap[rsidLower.toLowerCase()]) {
          chrom = snpMetaMap[rsidLower.toLowerCase()].chrom;
        } else if (aim.chromosome) {
          chrom = aim.chromosome;
        }
        let continentVal = aim.region || 'Unknown';
        if (continentVal === 'Unknown' || !continentVal) {
          if (aim.frequencies) {
            let maxFreq = -1;
            let maxPop = '';
            for (const [pop, freq] of Object.entries(aim.frequencies)) {
              if (typeof freq === 'number' && freq > maxFreq) {
                maxFreq = freq;
                maxPop = pop;
              }
            }
            const SUPER_POP_LABELS: Record<string, string> = {
              'AFR': 'African',
              'EUR': 'European',
              'EAS': 'East Asian',
              'SAS': 'South Asian',
              'AMR': 'Native American'
            };
            if (maxPop && SUPER_POP_LABELS[maxPop]) {
              continentVal = SUPER_POP_LABELS[maxPop];
            }
          }
        }

        unmappedAims.push({
          rsid: aim.rsid,
          chromosome: chrom,
          continent: continentVal
        });
      }
    }
  }

  return {
    topMatch,
    subpopAimsUsed: usedAimsSet.size,
    unmappedAims,
    breakdown,
    admixtureMix
  };
}
