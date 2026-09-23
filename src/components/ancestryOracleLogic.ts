import { loadMasterAims } from '../data/index';
import { fetchJsonAsset } from '../utils/fetchHelper';

// Initialize on first use or cache
let masterAimsCache: any = null;
const getMasterAims = () => {
  if (!masterAimsCache) masterAimsCache = loadMasterAims();
  return masterAimsCache;
};
let hoReferenceKernelCache: any = null;
let hoReferenceKernelPromise: Promise<any> | null = null;
async function getHoReferenceKernel() {
  if (hoReferenceKernelCache) return hoReferenceKernelCache;
  if (!hoReferenceKernelPromise) {
    hoReferenceKernelPromise = fetchJsonAsset('/data/ho_modern_reference_kernel.json');
  }
  hoReferenceKernelCache = await hoReferenceKernelPromise;
  return hoReferenceKernelCache;
}
import graf10kIndex from '../data/raw_aims/graf_10k_index.json';
import { solveNNLS, solveElasticNetNNLS } from '../utils/nnls';
import { pruneMarkersByPhysicalDistance } from '../utils/ancestry/ldPruner';
import forensicPanels from '../data/raw_aims/forensic_panels.json';
import microHapKernel from '../data/raw_aims/microhap_top100_kernel.json';
import { deconvolveMicrohaplotypes } from '../utils/ancestry/microhapAdmixture';
import { refineWithSecretorStatus } from '../utils/ancestry/secretorPostProcessor';

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
  _engineVersion?: string;
  confidenceIntervals?: Record<string, { low: number; high: number }>;
  continentalScores?: Record<string, number>;
}

// Map of 1000 Genomes population codes to detailed, scientific, and readable names
const POPULATION_NAMES_MAP: Record<string, string> = {
  'CEU': 'Central European (CEU)',
  'GBR': 'British Isles (GBR)',
  'FIN': 'Uralic & North-East European (FIN)',
  'TSI': 'Central Mediterranean / Tuscan (TSI)',
  'IBS': 'Iberian Peninsula (IBS)',
  'GERMAN': 'German / Central European (GERMAN)',
  'SWEDISH': 'Swedish / Scandinavian (SWEDISH)',
  'DUTCH': 'Dutch / North Sea Germanic (DUTCH)',
  'IRISH': 'Irish / Celtic (IRISH)',
  'FRENCH': 'French / Western European (FRENCH)',
  'SPANISH': 'Spanish / Iberian (SPANISH)',
  'POLISH': 'Polish / Eastern European (POLISH)',
  'GREEK': 'Greek / Southern European (GREEK)',
  'YRI': 'Yoruba / West African (YRI)',
  'MSL': 'Mende / Sierra Leonean (MSL)',
  'GWD': 'Gambian Mandinka & Wolof (GWD)',
  'ESN': 'Esan / West African (ESN)',
  'IGBO': 'Igbo / Southeastern Nigerian (IGBO)',
  'AKAN_ASHANTI': 'Akan & Ashanti / Gold Coast (AKAN)',
  'EWE_FON': 'Ewe & Fon / Dahomey (EWE_FON)',
  'FULANI': 'Fulani / Trans-Sahelian Pastoralist (FULANI)',
  'HAUSA': 'Hausa / Chadic Afroasiatic (HAUSA)',
  'BAKONGO': 'Bakongo / Kingdom of Kongo (BAKONGO)',
  'LUBA': 'Luba / Central Congo (LUBA)',
  'MBUTI_BIAKA': 'Mbuti & Biaka / Rainforest Pygmies (PYGMY)',
  'SOMALI': 'Somali / Horn of Africa Cushitic (SOMALI)',
  'AMHARA_TIGRAY': 'Amhara & Tigray / Ethiopian Highlands (AMHARA)',
  'OROMO': 'Oromo / Horn of Africa Cushitic (OROMO)',
  'DINKA_NUER': 'Dinka & Nuer / South Sudan Nilotic (DINKA)',
  'MASAI': 'Maasai / East African Nilotic (MASAI)',
  'ZULU_XHOSA': 'Zulu & Xhosa / Southern Bantu (ZULU)',
  'SAN_KHOE': 'San & Khoe / Kalahari Bushmen (KHOISAN)',
  'AMAZIGH_BERBER': 'Mozabite & Kabyle Berber / Amazigh (BERBER)',
  'TUAREG': 'Tuareg / Sahara Nomad (TUAREG)',
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
  'CAT': 'Catawba / Piedmont Siouan Admixture Proxy (CAT)',
  'WDN': 'Eastern Woodlands Algonquian (WDN)',
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
  'sgdp_ticuna': 'Ticuna / Upper Amazon (SGDP)',
  'aymara': 'Aymara / Lake Titicaca Altiplano (AYM)',
  'guarani': 'Guaraní / Paraná Basin (GUA)',
  'algonquian': 'Algonquian & Ojibwe / Eastern Woodlands (ALG)',
  // Middle Eastern, North African, and Spanish Injected Populations
  'sgdp_spanish': 'Spanish / Southern European (SGDP)',
  'sgdp_albanian': 'Albanian / Balkan European (SGDP)',
  'sgdp_basque': 'Basque / Southwestern European (SGDP)',
  'sgdp_bulgarian': 'Bulgarian / Balkan European (SGDP)',
  'sgdp_czech': 'Czech / Central European (SGDP)',
  'sgdp_english': 'English / British Isles (SGDP)',
  'sgdp_estonian': 'Estonian / Baltic European (SGDP)',
  'sgdp_french': 'French / Western European (SGDP)',
  'sgdp_greek': 'Greek / Southern European (SGDP)',
  'sgdp_hungarian': 'Hungarian / Central European (SGDP)',
  'sgdp_icelandic': 'Icelandic / Northern European (SGDP)',
  'sgdp_norwegian': 'Norwegian / Scandinavian (SGDP)',
  'sgdp_orcadian': 'Orcadian / Orkney Islands (SGDP)',
  'sgdp_polish': 'Polish / Eastern European (SGDP)',
  'sgdp_russian': 'Russian / Eastern European (SGDP)',
  'sgdp_sardinian': 'Sardinian / Mediterranean (SGDP)',
  'sgdp_bergamo': 'Bergamo / Northern Italian (SGDP)',
  'sgdp_cretan': 'Cretan / Southern Greek (SGDP)',
  'sgdp_chechen': 'Chechen / North Caucasus (SGDP)',
  'sgdp_finnish': 'Finnish / Northern European (SGDP)',
  'BALKAN': 'Balkan / Southeastern European (BALKAN)',
  'BALTIC': 'Baltic / Northeastern European (BALTIC)',
  'BASQUE': 'Basque / Southwestern European (BASQUE)',
  'SLAVIC': 'Slavic / Eastern European (SLAVIC)',
  'SCANDINAVIAN': 'Scandinavian / Northern European (SCANDINAVIAN)',
  'sgdp_saharawi': 'Saharawi / Amazigh Berber (SGDP)',
  'sgdp_mozabite': 'Mozabite / Amazigh Berber (SGDP)',
  'hgdp_mozabite': 'Mozabite / Amazigh Berber (HGDP)',
  'lemba_proxy': 'Lemba / Jewish-Bantu Admixture Proxy (LEM)',
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
  // South Asian and Indo-Aryan Injected Populations
  'sgdp_bengali': 'Bengali / South Asian (SGDP)',
  'sgdp_brahmin': 'Brahmin / South Asian (SGDP)',
  'sgdp_kapu': 'Kapu / South Asian (SGDP)',
  'sgdp_madiga': 'Madiga / South Asian (SGDP)',
  'sgdp_mala': 'Mala / South Asian (SGDP)',
  'sgdp_punjabi': 'Punjabi / Indo-Aryan (SGDP)',
  'sgdp_relli': 'Relli / South Asian (SGDP)',
  'sgdp_yadava': 'Yadava / Indo-Aryan (SGDP)',
  'hgdp_kalash': 'Kalash / Indo-Aryan Isolated (HGDP)',
  'hgdp_sindhi': 'Sindhi / Indo-Aryan (HGDP)',
  'hgdp_pathan': 'Pathan / Pashtun Indo-Iranian (HGDP)',
  'hgdp_balochi': 'Balochi / Iranian (HGDP)',
  'hgdp_brahui': 'Brahui / Dravidian (HGDP)',
  'hgdp_makrani': 'Makrani / Afro-South Asian (HGDP)',
  'sgdp_balochi': 'Balochi / Iranian (SGDP)',
  'sgdp_brahui': 'Brahui / Dravidian (SGDP)',
  'sgdp_irula': 'Irula / Dravidian South Asian (SGDP)',
  'sgdp_kalash': 'Kalash / Indo-Aryan Isolated (SGDP)',
  'sgdp_khonda_dora': 'Khonda Dora / South Asian (SGDP)',
  'sgdp_makrani': 'Makrani / Afro-South Asian (SGDP)',
  'sgdp_sindhi': 'Sindhi / Indo-Aryan (SGDP)',
  'romani_proxy': 'Romani / European-Indo-Aryan Admixture Proxy (ROM)',
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
  'sgdp_lezgin': 'Lezgin / Northeast Caucasus (SGDP)',
  // Superpopulations and Global References
  'ALL': 'Global Reference (ALL)',
  'EUR': 'European Reference (EUR)',
  'AFR': 'African Reference (AFR)',
  'EAS': 'East Asian Reference (EAS)',
  'SAS': 'South Asian Reference (SAS)',
  'AMR': 'Indigenous American Reference (AMR)',
  'MENA': 'Middle Eastern Reference (MENA)',
  'OCE': 'Oceanian Reference (OCE)',
  'PAP': 'Papuan / New Guinea (PAP)',
  'BOU': 'Bougainville Melanesian (BOU)',
  'CAS': 'Central Asian & Siberian Reference (CAS)',
  'CAU': 'Caucasus Reference (CAU)'
};

/**
 * Converts a raw population code (e.g. 'sgdp_orcadian', 'hgdp_mozabite') into a human-readable label.
 * Falls back to a prettified version of the code when no direct mapping is found.
 */
export function humanizePopName(rawName: string): string {
  if (!rawName) return 'Unknown';
  if (POPULATION_NAMES_MAP[rawName]) return POPULATION_NAMES_MAP[rawName];

  let cleaned = rawName;
  let prefixTag = '';

  if (/^hgdp_/i.test(cleaned)) { prefixTag = 'HGDP'; cleaned = cleaned.replace(/^hgdp_/i, ''); }
  else if (/^sgdp_/i.test(cleaned)) { prefixTag = 'SGDP'; cleaned = cleaned.replace(/^sgdp_/i, ''); }
  else if (/^agcp_/i.test(cleaned)) { prefixTag = 'AGCP'; cleaned = cleaned.replace(/^agcp_/i, ''); }
  else if (/_gnomAD$/i.test(cleaned)) { prefixTag = 'gnomAD'; cleaned = cleaned.replace(/_gnomAD$/i, ''); }
  else if (/_proxy$/i.test(cleaned)) { cleaned = cleaned.replace(/_proxy$/i, ''); }

  cleaned = cleaned.replace(/[_]/g, ' ').trim();
  cleaned = cleaned.split(' ').map(w => {
    const lower = w.toLowerCase();
    if (lower === 'am') return 'American';
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');

  return prefixTag ? `${cleaned} (${prefixTag})` : cleaned;
}

/**
 * Returns a normalized base key for a population, stripping dataset prefix (hgdp_, sgdp_, agcp_)
 * and suffix (_gnomad, _proxy) to allow deduplication across source datasets.
 */
export function getBasePopKey(popCode: string, popName: string): string {
  let key = (popCode || popName).toLowerCase();
  key = key.replace(/^(hgdp_|sgdp_|agcp_|1000g_)/i, '');
  key = key.replace(/(_gnomad|_proxy)$/i, '');
  key = key.replace(/[^a-z0-9]/g, '');
  return key;
}

// Macro-continental Group Classifications for Hierarchy-Aware Matching
const MACRO_GROUPS: Record<string, string[]> = {
  'AFR': [
    'ESN', 'GWD', 'LWK', 'MSL', 'YRI', 'IGBO', 'AKAN_ASHANTI', 'EWE_FON', 'FULANI',
    'HAUSA', 'BAKONGO', 'LUBA', 'MBUTI_BIAKA', 'SOMALI', 'AMHARA_TIGRAY', 'OROMO',
    'DINKA_NUER', 'MASAI', 'ZULU_XHOSA', 'SAN_KHOE',
    'GWF_Fula', 'GWJ_Jola', 'GWW_Wolof', 'ALFA_African', 'AFR_gnomAD',
    'sgdp_luo', 'sgdp_masai', 'sgdp_bantuherero', 'sgdp_bantukenya', 
    'sgdp_bantutswana', 'sgdp_biaka', 'sgdp_mbuti', 'sgdp_khomani_san', 
    'sgdp_ju_hoan_north', 'sgdp_somali', 'sgdp_malagasy', 'sgdp_yoruba', 
    'sgdp_mandenka', 'sgdp_mende', 'sgdp_esan', 'sgdp_gambian', 'sgdp_luhya',
    'hgdp_yoruba', 'hgdp_mandenka', 'lemba_proxy'
  ],
  'AFRAM': [
    'ACB', 'ASW', 'GLL', 'ALFA_AfAm', 'AFRAM_SOUTH', 'AFRAM_NORTHEAST', 
    'AFRAM_WEST', 'LOUISIANA_CREOLE'
  ],
  'EUR': [
    'CEU', 'FIN', 'GBR', 'IBS', 'TSI',
    'AMI_gnomAD', 'NFE_gnomAD', 'FIN_gnomAD', 'ALFA_EUR',
    'ASJ_gnomAD', 'ASJ', 'SEJ',
    'IRISH_AM', 'ITALIAN_AM', 'GERMAN_AM', 'sgdp_spanish',
    'GERMAN', 'SWEDISH', 'DUTCH', 'IRISH', 'FRENCH', 'SPANISH', 'POLISH', 'GREEK',
    'sgdp_albanian', 'sgdp_basque', 'sgdp_bulgarian', 'sgdp_czech',
    'sgdp_english', 'sgdp_estonian', 'sgdp_french', 'sgdp_greek',
    'sgdp_hungarian', 'sgdp_icelandic', 'sgdp_norwegian', 'sgdp_orcadian',
    'sgdp_polish', 'sgdp_russian', 'sgdp_sardinian', 'sgdp_bergamo',
    'sgdp_cretan', 'sgdp_finnish', 'sgdp_saami',
    'sgdp_italian_north', 'sgdp_tuscan', 'BALKAN', 'BALTIC',
    'BASQUE', 'SLAVIC', 'SCANDINAVIAN'
  ],
  'CAU': [
    'sgdp_chechen', 'sgdp_russia_northossetian', 'sgdp_russia_abkhasian',
    'sgdp_georgian', 'sgdp_adygei', 'sgdp_lezgin'
  ],
  'EAS': [
    'CDX', 'CHB', 'CHS', 'JPT', 'KHV',
    'GEMJ_Japan', 'EAS_gnomAD', 'ALFA_EAS',
    'FILIPINO_AM', 'VIETNAMESE_AM', 'sgdp_dai', 'sgdp_dusun', 'sgdp_igorot',
    'sgdp_ami', 'sgdp_atayal', 'sgdp_kinh', 'sgdp_cambodian', 'sgdp_thai',
    'sgdp_burmese', 'sgdp_han', 'hgdp_han', 'sgdp_japanese', 'hgdp_japanese',
    'sgdp_korean', 'sgdp_naxi', 'hgdp_naxi', 'sgdp_yi', 'sgdp_she', 'hgdp_she',
    'sgdp_miao', 'sgdp_china_lahu', 'hgdp_lahu',
    'hgdp_daur', 'sgdp_daur', 'hgdp_hezhen', 'sgdp_hezhen',
    'hgdp_oroqen', 'sgdp_oroqen', 'hgdp_tujia', 'sgdp_tujia',
    'hgdp_xibo', 'sgdp_xibo'
  ],
  'SAS': [
    'BEB', 'GIH', 'ITU', 'PJL', 'STU',
    'SAS_gnomAD', 'ALFA_SAS',
    'sgdp_bengali', 'sgdp_brahmin', 'sgdp_kapu', 'sgdp_madiga', 'sgdp_mala',
    'sgdp_punjabi', 'sgdp_relli', 'sgdp_yadava', 'hgdp_kalash', 'hgdp_sindhi',
    'hgdp_pathan', 'hgdp_balochi', 'hgdp_brahui', 'hgdp_makrani', 'sgdp_balochi',
    'sgdp_brahui', 'sgdp_irula', 'sgdp_kalash', 'sgdp_khonda_dora', 'sgdp_makrani',
    'sgdp_sindhi', 'sgdp_burusho', 'hgdp_burusho', 'sgdp_kusunda', 'sgdp_pathan',
    'romani_proxy'
  ],
  'AMR': [
    'PEL', 'LMB', 'CHK', 'LNP', 'NAN', 'CAT', 'WDN', 'MEL',
    'sgdp_karitiana', 'sgdp_surui', 'sgdp_pima', 'sgdp_mixe', 'sgdp_mixtec', 
    'sgdp_mayan', 'sgdp_mexico_zapotec', 'sgdp_quechua', 'sgdp_piapoco',
    'sgdp_tlingit', 'sgdp_aleut', 'sgdp_eskimo_chaplin', 'sgdp_eskimo_naukan',
    'sgdp_eskimo_sireniki', 'hgdp_karitiana', 'hgdp_surui', 'hgdp_maya',
    'hgdp_pima', 'hgdp_colombian'
  ],
  'AMER': [
    'CLM', 'MXL', 'PUR', 'ALFA_LatAm1', 'ALFA_LatAm2', 'AMR_gnomAD',
    'CUBAN_AM', 'DOMINICAN_AM'
  ],
  'MENA': [
    'MID_gnomAD', 'MZJ', 'YMJ', 'sgdp_jew_iraqi', 'sgdp_jew_yemenite', 'sgdp_samaritan',
    'sgdp_saharawi', 'sgdp_mozabite', 'hgdp_mozabite', 'sgdp_bedouinb', 'sgdp_druze', 
    'sgdp_palestinian', 'sgdp_jordanian', 'sgdp_iranian', 'hgdp_bedouin', 'hgdp_druze', 
    'hgdp_palestinian', 'sgdp_turkish', 'AMAZIGH_BERBER', 'TUAREG'
  ],
  'OCE': [
    'OCE', 'PAP', 'BOU', 'MEL', 'sgdp_australian', 'sgdp_bougainville', 'sgdp_hawaiian', 'sgdp_maori', 'sgdp_papuan'
  ],
  'CAS': [
    'sgdp_altaian', 'sgdp_chukchi', 'sgdp_even', 'sgdp_itelmen', 'sgdp_kyrgyz_kyrgyzstan', 
    'sgdp_mansi', 'sgdp_tubalar', 'sgdp_ulchi', 'sgdp_uyghur', 'sgdp_yakut', 'hgdp_yakut', 
    'hgdp_uygur', 'hgdp_mongola', 'sgdp_mongola', 'hgdp_hazara', 'sgdp_hazara', 'sgdp_tajik'
  ]
};

/**
 * Detects whether marker alleles form a palindromic (A/T or C/G) pair.
 * Palindromic SNPs require likelihood or manifest strand verification
 * because reverse-complement pairs match the same two nucleotide characters.
 */
export function isPalindromicMarker(alleles: string[]): boolean {
  if (!alleles || alleles.length < 2) return false;
  const a1 = alleles[0].toUpperCase();
  const a2 = alleles[1].toUpperCase();
  return (a1 === 'A' && a2 === 'T') || (a1 === 'T' && a2 === 'A') ||
         (a1 === 'C' && a2 === 'G') || (a1 === 'G' && a2 === 'C');
}

/**
 * Aligns raw genotype to target reference alleles using complementation when needed,
 * with explicit palindromic strand resolution.
 */
export function alignGenotype(genotype: string, targetAlleles: string[], refFreq?: number): string {
  const upperGeno = genotype.toUpperCase();
  if (upperGeno === '--' || upperGeno.length === 0) return upperGeno;

  const complementMap: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
  const complementGeno = upperGeno.split('').map(b => complementMap[b] || b).join('');

  // 1. Palindromic markers (A/T or C/G)
  if (isPalindromicMarker(targetAlleles)) {
    const chars = upperGeno.split('');
    const isHetero = chars.length === 2 && chars[0] !== chars[1];
    if (isHetero) {
      // For heterozygous A/T or C/G, unordered alleles are invariant under complement
      return upperGeno;
    }
    // For homozygous calls (e.g. A/A vs T/T), test reference frequency expectation if available
    if (typeof refFreq === 'number' && !isNaN(refFreq)) {
      const primaryTarget = targetAlleles[0].toUpperCase();
      const isHomozygousPrimary = chars.every(c => c === primaryTarget);
      if (isHomozygousPrimary && refFreq < 0.10) {
        return complementGeno;
      }
      if (!isHomozygousPrimary && refFreq > 0.90) {
        return complementGeno;
      }
    }
    return upperGeno;
  }

  // 2. Non-palindromic markers: standard direct and complement checks
  const hasDirectMatch = upperGeno.split('').some(char => targetAlleles.includes(char));
  if (hasDirectMatch) {
    return upperGeno;
  }

  const hasCompMatch = complementGeno.split('').some(char => targetAlleles.includes(char));
  if (hasCompMatch) {
    return complementGeno;
  }

  return upperGeno;
}

/**
 * Resolves polarity of reference allele frequency against macro-continental reference.
 * Eliminates the static 0.20 margin dead-zone identified in the V2 audit.
 */
function alignPolarity(refFreq: number, macroFreq?: number): number {
  if (macroFreq === undefined || isNaN(macroFreq)) return refFreq;
  const distFwd = Math.abs(refFreq - macroFreq);
  const distRev = Math.abs((1.0 - refFreq) - macroFreq);
  // If the flipped frequency is strictly closer to macro frequency by a significant margin (0.08)
  if (distRev + 0.08 < distFwd) {
    return 1.0 - refFreq;
  }
  return refFreq;
}

/**
 * Demographic-aware F_ST genetic drift parameters for Balding-Nichols shrinkage.
 * Replaces the universal static F_k = 0.04 with empirical divergence parameters.
 */
const DEMOGRAPHIC_FST_DRIFT: Record<string, number> = {
  'EUR': 0.020,
  'AFR': 0.025,
  'AFRAM': 0.025,
  'EAS': 0.035,
  'SAS': 0.040,
  'MENA': 0.030,
  'AMR': 0.075,
  'AMER': 0.045,
  'OCE': 0.100,
  'CAS': 0.050,
  'CAU': 0.028
};

/**
 * Known highly admixed basis cohorts that should be excluded from acting as reference
 * vectors in Pass 2 NNLS deconvolution to eliminate the interior-sink collinearity trap.
 * These cohorts remain in MACRO_GROUPS and POPULATION_NAMES_MAP for distance ranking /
 * nearest-neighbor identification.
 */
const ADMIXED_BASIS_COHORTS = new Set([
  'ACB', 'ASW', 'CLM', 'MXL', 'PUR', 'GLL', 'ALFA_AfAm', 'ALFA_LatAm1', 'ALFA_LatAm2',
  'AFRAM_SOUTH', 'AFRAM_NORTHEAST', 'AFRAM_WEST', 'LOUISIANA_CREOLE', 'CUBAN_AM', 'DOMINICAN_AM',
  'lemba_proxy', 'romani_proxy', 'sgdp_malagasy', 'MEL'
]);

// Local high-performance index caching variables
let isSnpCacheInitialized = false;
const normalizedKeyToOriginal = new Map<string, string>();

/**
 * Lazy initializer for AIM markers index to prevent memory bloat
 */
function initializeSnpCache(databaseKeys: string[]) {
  if (isSnpCacheInitialized) return;
  for (const key of databaseKeys) {
    const clean = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean) {
      normalizedKeyToOriginal.set(clean, key);
      const strippedLeadingZero = clean.replace(/^rs0+([1-9]\d*)/, 'rs$1');
      if (strippedLeadingZero !== clean) {
        normalizedKeyToOriginal.set(strippedLeadingZero, key);
      }
    }
  }
  isSnpCacheInitialized = true;
}

/**
 * Strict, zero-false-positive marker resolver.
 * Enforces exact alphanumeric RSID matching and canonical alias normalization.
 * Completely purges Damerau-Levenshtein edit-distance matching on sequential dbSNP RSIDs (P0 audit fix).
 */
export function resolveSnpName(userRsid: string, databaseKeys: string[], _allowFuzzy = false): string | null {
  initializeSnpCache(databaseKeys);

  // 1. Direct match (case-sensitive lookup first for high speed)
  const directMatch = normalizedKeyToOriginal.get(userRsid);
  if (directMatch) return directMatch;

  const raw = userRsid.toLowerCase();
  
  // 2. Direct short-circuit matches
  if (normalizedKeyToOriginal.has(raw)) {
    return normalizedKeyToOriginal.get(raw) || null;
  }
  
  // 3. Normalized alphanumeric match
  const cleanUser = raw.replace(/[^a-z0-9]/g, '');
  if (cleanUser && normalizedKeyToOriginal.has(cleanUser)) {
    return normalizedKeyToOriginal.get(cleanUser) || null;
  }

  // 4. Handle prefix aliases like 'rs00123' -> 'rs123'
  const strippedLeadingZero = cleanUser.replace(/^rs0+([1-9]\d*)/, 'rs$1');
  if (strippedLeadingZero !== cleanUser && normalizedKeyToOriginal.has(strippedLeadingZero)) {
    return normalizedKeyToOriginal.get(strippedLeadingZero) || null;
  }

  return null;
}


/**
 * Pure TypeScript Non-Negative Least Squares (NNLS) solver using Lawson-Hanson with
 * Standardized Patterson Genetic Drift Coordinates.
 * Subtracts the universal shared ancestral human baseline and scales by binomial standard deviation.
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

  // Build standardized Patterson drift matrix (M x P)
  const A: number[][] = new Array(M);
  const b: number[] = new Array(M);
  const w: number[] = new Array(M);

  for (let i = 0; i < M; i++) {
    A[i] = new Array(P);
    let sumF = 0;
    const freqs: number[] = new Array(P);
    for (let p = 0; p < P; p++) {
      const f = popExpectedDosages[popCodes[p]][i] / 2.0;
      freqs[p] = f;
      sumF += f;
    }
    const meanF = sumF / P;

    // Skip monomorphic SNPs (no signal)
    if (meanF <= 0.0 || meanF >= 1.0) {
      A[i] = new Array(P).fill(0);
      b[i] = 0;
      w[i] = 0;
      continue;
    }

    // Fix #2: Use tighter floor (1e-6) instead of 0.005 to avoid flattening rare alleles
    const sigma = Math.sqrt(Math.max(1e-6, meanF * (1.0 - meanF)));

    for (let p = 0; p < P; p++) {
      A[i][p] = (freqs[p] - meanF) / sigma;
    }
    b[i] = (userDosages[i] / 2.0 - meanF) / sigma;

    // Fix #3/#4: Pass external weights directly without internal Fisher double-weighting.
    // The Patterson standardization already accounts for allele frequency variance.
    w[i] = aimWeights[i] || 1.0;
  }

  // Fix #5: Strengthen sum-to-one constraint so NNLS inherently satisfies sum=1
  const LAMBDA = Math.max(50, M * 0.5);
  const augA = new Array(P).fill(LAMBDA);
  A.push(augA);
  b.push(LAMBDA);
  w.push(1.0);

  // Solve Elastic-Net NNLS with L1 sparsity and L2 Ridge regularization
  const x = solveElasticNetNNLS(A, b, w, 1e-4, 1e-3);

  // Fix #12: Normalize proportions (tight LAMBDA makes this a minor adjustment)
  const sum = x.reduce((acc, val) => acc + val, 0);
  const normalized = sum > 0 ? x.map(val => val / sum) : x;

  const result: Record<string, number> = {};
  popCodes.forEach((code, idx) => {
    // Fix #13: Lower threshold to 0.05% to allow trace ancestry
    if (normalized[idx] >= 0.0005) {
      result[code] = normalized[idx] * 100;
    }
  });

  return result;
}


/**
 * Primary High Resolution Bayesian Ancestry and Subpopulation Oracle Solver (Engine v3)
 */
export async function processSubpopulations(
  userGenotypes: UserGenotype[],
  aimsDatabase: AIM[],
  sampleId?: string,
  snpMetaMap?: Record<string, { chrom: string; pos: number }>,
  panel: 'all' | 'kidd55' | 'seldin128' | 'euroforgen' | 'ramos' | 'microhap' = 'all'
): Promise<OracleResult> {
  const popToMacroMap = new Map<string, string>();
  for (const [macro, pops] of Object.entries(MACRO_GROUPS)) {
    for (const pop of pops) {
      popToMacroMap.set(pop, macro);
    }
  }

  const isPopAllowedForPanel = (popCode: string) => {
    if (panel === 'all' || panel === 'kidd55' || panel === 'seldin128' || panel === 'microhap') {
      return true;
    }
    if (panel === 'euroforgen') {
      const macroCode = popToMacroMap.get(popCode) || '';
      return macroCode === 'EUR' || macroCode === 'MENA' || macroCode === 'CAU';
    }
    if (panel === 'ramos') {
      const macroCode = popToMacroMap.get(popCode) || '';
      return macroCode === 'AFR' || macroCode === 'AFRAM';
    }
    return true;
  };

  const normalizedDatabase = getMasterAims() as Record<string, any>;
  const referenceDatabase = await getHoReferenceKernel() as Record<string, { region: string; frequencies: Record<string, number> }>;
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

  // Diagnostic log for custom tiebreaker markers
  let matchedNewTiebreakersCount = 0;
  for (let idx = 1001; idx <= 1270; idx++) {
    const baseRsid = `rs${idx}`;
    if (genotypeMap.has(baseRsid)) {
      matchedNewTiebreakersCount++;
    }
  }
  const bioTiebreakers = [
    "rs2567608", "rs3814134", "rs2814778", "rs4988235", "rs11803701", "rs12913832",
    "rs16891982", "rs2279744", "rs3827760", "rs671", "rs17822931", "rs1229984",
    "rs174537", "rs2033028", "rs2032457", "rs7327831", "rs2284553", "rs10735788",
    "rs62588102", "rs45523335", "rs11578877", "rs373863828", "rs7388531"
  ];
  let matchedBioCount = 0;
  for (const rsid of bioTiebreakers) {
    if (genotypeMap.has(rsid)) matchedBioCount++;
  }
  console.log(`[Ancestry Oracle V2] Matched regional tiebreaker AIMs: ${matchedNewTiebreakersCount}/270 grid, ${matchedBioCount}/${bioTiebreakers.length} high-Fst biological`);

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

  // Build panel filter set ONCE outside the loop (not on every iteration)
  let microhapSnpsSet: Set<string> | null = null;
  if (panel === 'microhap') {
    microhapSnpsSet = new Set<string>();
    Object.keys(normalizedDatabase).forEach(k => {
      const kl = k.toLowerCase();
      if (kl.startsWith('mh') || normalizedDatabase[k]?.trait === 'Forensic Microhaplotype') {
        microhapSnpsSet!.add(kl);
        const aim = normalizedDatabase[k];
        if (aim?.rsid) microhapSnpsSet!.add(aim.rsid.toLowerCase());
        if (Array.isArray(aim?.snps)) aim.snps.forEach((s: string) => microhapSnpsSet!.add(s.toLowerCase()));
      }
    });
    if (Array.isArray(microHapKernel)) {
      microHapKernel.forEach((hap: any) => {
        if (Array.isArray(hap.snps)) {
          hap.snps.forEach((s: string) => microhapSnpsSet!.add(s.toLowerCase()));
        }
      });
    }
  }

  const panelSet: Set<string> | null = panel !== 'all'
    ? panel === 'microhap'
      ? microhapSnpsSet
      : new Set(
          ((forensicPanels as any)[panel] as string[] || [])
            .filter((id: string) => {
              const num = parseInt(id.replace(/^rs/i, ''), 10);
              return isNaN(num) || num < 1001 || num > 1999 || num < 1001415;
            })
            .map((id: string) => id.toLowerCase())
        )
    : null;

  for (const [rsid, genotype] of genotypeMap.entries()) {
    // Apply panel filter if specified
    if (panelSet !== null) {
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
          // Dampened sqrt scaling — prevents high-FST markers from dominating the distance
          popVarianceWeight = 0.5 + (Math.sqrt(variance) * 2.0);
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

  // Get active reference SNPs that the user actually has
  const firstPop = Object.values(referenceDatabase)[0];
  const referenceKeys = firstPop ? Object.keys(firstPop.frequencies) : [];
  // Merge reference keys with all keys from the master database to include new tiebreaker AIMs
  const refSnpKeys = Array.from(new Set([...referenceKeys, ...Object.keys(normalizedDatabase)]));
  const activeRefSnps: { rsid: string; rsidLower: string; meta: any; userDosage: number }[] = [];

  for (const rsid of refSnpKeys) {
    const rsidLower = rsid.toLowerCase();
    const meta = prunedGenotypesMap.get(rsidLower);
    if (!meta) continue;

    const genotype = meta.genotype;
    const aim = normalizedDatabase[rsidLower] || normalizedDatabase[rsid.toUpperCase()] || normalizedDatabase[rsid];
    let userDosageDiscrete = -1;

    if (aim && aim.alleles && aim.alleles.length > 0) {
      const testAllele = (typeof aim.alleles === 'string' ? aim.alleles[0] : aim.alleles[0]).toUpperCase();
      let matchCount = 0;
      for (const char of genotype.toUpperCase()) {
        if (char === testAllele) matchCount++;
      }
      userDosageDiscrete = matchCount;
    } else {
      const marker = (graf10kIndex as any)[rsidLower] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid];
      if (marker) {
        const alt = marker.alt.toUpperCase();
        let matchCount = 0;
        for (const char of genotype.toUpperCase()) {
          if (char === alt) matchCount++;
        }
        userDosageDiscrete = matchCount;
      } else {
        continue;
      }
    }

    activeRefSnps.push({
      rsid,
      rsidLower,
      meta,
      userDosage: userDosageDiscrete
    });
  }

  // Pre-populate usedAimsSet with all active reference SNPs that the user has
  activeRefSnps.forEach(s => usedAimsSet.add(s.rsidLower));

  // Iterate over each population in the 1000 Genomes reference kernel to compute distances & negative SNP counts
  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    if (GLOBAL_REFERENCE_CODES.has(popCode)) continue;
    if (popCode === 'LNP' || popCode === 'NAN') continue; // Deprecated: Consolidated into WDN
    if (!isPopAllowedForPanel(popCode)) continue;
    const frequencies = popData.frequencies;
    const matchedUserDosages: number[] = [];
    const matchedRefFreqs: number[] = [];
    const matchedWeights: number[] = [];
    let violations = 0;

    const macroCode = popToMacroMap.get(popCode) || '';
    const isAfricanPop = macroCode === 'AFR';
    const isEuropeanPop = macroCode === 'EUR';
    const isEastAsianPop = macroCode === 'EAS';
    const isSouthAsianPop = macroCode === 'SAS';
    const isAmrPop = macroCode === 'AMR';

    for (let i = 0; i < activeRefSnps.length; i++) {
      const activeSnp = activeRefSnps[i];
      const baseRsid = activeSnp.rsid.split('_')[0].toLowerCase();
      let refFreq = frequencies[activeSnp.rsid] ?? frequencies[activeSnp.rsidLower] ?? frequencies[baseRsid];
      if (refFreq === undefined || refFreq === -1.0) continue;

      const aim = normalizedDatabase[activeSnp.rsidLower] || normalizedDatabase[activeSnp.rsid.toUpperCase()];
      if (macroCode && aim?.frequencies?.[macroCode] !== undefined) {
        const macroFreq = aim.frequencies[macroCode];
        refFreq = alignPolarity(refFreq, macroFreq);
      }

      const userDosageDiscrete = activeSnp.userDosage;
      const rsidLower = activeSnp.rsidLower;

      usedAimsSet.add(rsidLower);
      matchedUserDosages.push(userDosageDiscrete);
      matchedRefFreqs.push(refFreq);
      matchedWeights.push(activeSnp.meta.weight);

      // --- COMPONENT 2: Continuous Probabilistic Cladistic Scoring (V3) ---
      // Instead of an all-or-nothing threshold (>=0.85 and dosage==0) that penalizes 
      // genuine heterozygotes and admixed individuals, compute continuous binomial log-loss deviation.
      const pSmooth = Math.max(0.002, Math.min(0.998, refFreq));
      let genotypeProb = (1.0 - pSmooth) * (1.0 - pSmooth); // dosage 0
      if (userDosageDiscrete === 1) {
        genotypeProb = 2.0 * pSmooth * (1.0 - pSmooth);     // dosage 1
      } else if (userDosageDiscrete === 2) {
        genotypeProb = pSmooth * pSmooth;                   // dosage 2
      }
      if (genotypeProb < 0.03) {
        const markerLoss = Math.min(3.0, -Math.log(genotypeProb + 1e-4) - 3.5);
        if (markerLoss > 0) {
          violations += markerLoss * 0.20;
        }
      }

      // Check specific diagnostic markers using ancestry-aware likelihoods
      if (rsidLower === 'rs2814778') {
        if (isAfricanPop && userDosageDiscrete === 0) {
          violations += 1.0; 
        } else if (isEuropeanPop && userDosageDiscrete === 2) {
          violations += 1.0;
        }
      } else if (rsidLower === 'rs1426654' || rsidLower === 'rs16891982') {
        if (isAfricanPop && userDosageDiscrete === 2) {
          violations += 0.8;
        } else if (isEuropeanPop && userDosageDiscrete === 0) {
          violations += 0.8;
        }
      } else if (rsidLower === 'rs3827760') {
        if ((isEastAsianPop || isAmrPop) && userDosageDiscrete === 0) {
          violations += 1.0;
        } else if ((isEuropeanPop || isAfricanPop) && userDosageDiscrete === 2) {
          violations += 1.0;
        }
      } else if (rsidLower === 'rs3094315') {
        if (isAmrPop && userDosageDiscrete === 0) {
          violations += 0.8;
        } else if ((isEuropeanPop || isAfricanPop) && userDosageDiscrete === 2) {
          violations += 0.8;
        }
      } else if (rsidLower === 'rs16139' || rsidLower === 'rs2229765') {
        if (isAfricanPop && userDosageDiscrete === 0) {
          violations += 0.8;
        } else if ((isEuropeanPop || isEastAsianPop) && userDosageDiscrete === 2) {
          violations += 0.8;
        }
      } else if (rsidLower === 'rs7388531' || rsidLower === 'rs671') {
        if (isEastAsianPop && userDosageDiscrete === 0) {
          violations += 0.8;
        } else if ((isEuropeanPop || isAfricanPop) && userDosageDiscrete === 2) {
          violations += 0.8;
        }
      } else if (rsidLower === 'rs12203592') {
        if (isSouthAsianPop && userDosageDiscrete === 0) {
          violations += 0.6;
        } else if ((isAfricanPop || isEastAsianPop) && userDosageDiscrete === 2) {
          violations += 0.6;
        }
      } else if (rsidLower === 'rs1042602') {
        if ((isAmrPop || isEuropeanPop) && userDosageDiscrete === 0) {
          violations += 0.6;
        } else if ((isEastAsianPop || isAfricanPop) && userDosageDiscrete === 2) {
          violations += 0.6;
        }
      }
    }

    const M = matchedUserDosages.length;
    popMarkerCounts.set(popCode, M);
    negativeViolations.set(popCode, violations);

    if (M >= 4) {
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

      const baseDistance = Math.sqrt(weightedSquaredDiffSum / (totalW || 1.0));

      // Scale penalties smoothly using a bounded curve to protect admixed and outbred individuals
      const penaltyFactor = 1.0 + (0.10 * Math.min(8.0, violations));
      const adjustedDistance = baseDistance * penaltyFactor;
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
  // Minimum markers required: forensic panels need enough markers to differentiate populations.
  // With fewer than 10 markers the Euclidean distances collapse to near-identical values
  // because there are insufficient independent loci to distinguish populations.
  // Panel-specific minimum marker thresholds for meaningful population differentiation.
  // Kidd55/Seldin128 have ~50-100 kernel-matched markers → min=10 forces real differentiation.
  // EuroForGen has only 8 kernel-matched markers → min=4 to allow at least some output.
  // Ramos/all use a lower default since they rely on thousands of markers.
  const MIN_MARKERS_BY_PANEL: Record<string, number> = {
    'kidd55': 10,
    'seldin128': 10,
    'euroforgen': 4,
    'ramos': 4,
    'all': 5
  };
  const MIN_MARKERS = MIN_MARKERS_BY_PANEL[panel] ?? 5;

  const rawBreakdown: Array<{ subpop: string; distance: number; markersCompared: number; count: number; popCode: string }> = [];
  for (const [popCode, popData] of Object.entries(referenceDatabase)) {
    if (GLOBAL_REFERENCE_CODES.has(popCode)) continue;
    if (popCode === 'LNP' || popCode === 'NAN') continue; // Deprecated: Consolidated into WDN
    if (!isPopAllowedForPanel(popCode)) continue;
    const finalDistance = popDistances.get(popCode) ?? 1.0;
    const markersCompared = popMarkerCounts.get(popCode) ?? 0;

    if (markersCompared >= MIN_MARKERS) {
      const popName = POPULATION_NAMES_MAP[popCode] || humanizePopName(popCode);

      rawBreakdown.push({
        subpop: popName,
        distance: finalDistance,
        markersCompared,
        count: markersCompared,
        popCode
      });
    }
  }

  // Log panel coverage for diagnostics
  const panelCoverage = rawBreakdown.length > 0 ? rawBreakdown[0].markersCompared : 0;
  console.log(`[Oracle ${panel}] ${rawBreakdown.length} populations with ≥${MIN_MARKERS} markers. Top pop has ${panelCoverage} markers.`);

  // Sort by distance so closest populations appear first
  rawBreakdown.sort((a, b) => a.distance - b.distance);

  // Deduplicate entries by base population key and display name to prevent identical duplicate labels
  const seenBreakdownKeys = new Set<string>();
  const seenSubpopNames = new Set<string>();
  const deduplicatedBreakdown: typeof rawBreakdown = [];
  for (const item of rawBreakdown) {
    const baseKey = getBasePopKey(item.popCode, item.subpop);
    const subpopNameClean = item.subpop.toLowerCase().trim();
    const isSgdp = item.popCode.toLowerCase().startsWith('sgdp_');

    if (seenSubpopNames.has(subpopNameClean)) {
      continue;
    }
    if (isSgdp && seenBreakdownKeys.has(baseKey)) {
      continue;
    }
    seenSubpopNames.add(subpopNameClean);
    seenBreakdownKeys.add(baseKey);
    deduplicatedBreakdown.push(item);
  }

  const minDist = deduplicatedBreakdown.length > 0 ? deduplicatedBreakdown[0].distance : 0.0;
  breakdown = deduplicatedBreakdown.map(item => {
    const uiDistance = item.distance - minDist;
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
    if (!isPopAllowedForPanel(popCode)) continue;
    nnlsPopExpectedDosages[popCode] = new Float32Array(activeM);
  }

  activeSnpKeys.forEach((rsid, idx) => {
    const meta = prunedGenotypesMap.get(rsid)!;
    const aim = normalizedDatabase[rsid] || normalizedDatabase[rsid.toUpperCase()];

    // 1. Regularized Binomial Variance Weights
    let sumFreq = 0;
    let validPopsCount = 0;
    for (const [popCode, popData] of Object.entries(referenceDatabase)) {
      if (GLOBAL_REFERENCE_CODES.has(popCode)) continue;
      if (!isPopAllowedForPanel(popCode)) continue;
      const baseKey = rsid.split('_')[0].toLowerCase();
      let freq = popData.frequencies[rsid] || popData.frequencies[rsid.toUpperCase()] || popData.frequencies[rsid.toLowerCase()] || popData.frequencies[baseKey];
      if (freq === undefined) {
        const macroCode = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) ?? null;
        freq = macroCode ? (aim?.frequencies?.[macroCode] ?? 0.5) : 0.5;
      }
      if (freq !== undefined && !isNaN(freq)) {
        sumFreq += freq;
        validPopsCount++;
      }
    }
    const meanFreq = validPopsCount > 0 ? (sumFreq / validPopsCount) : 0.5;
    // Fisher Information Weight for binomial observation: w_i = 1 / (2 * p * (1 - p) + 0.03)
    const binomialVar = 2.0 * meanFreq * (1.0 - meanFreq);
    const fisherWeight = 1.0 / (binomialVar + 0.03);

    nnlsWeights[idx] = meta.weight * fisherWeight;

    let uDosage = -1; // -1 = unresolved

    if (aim && aim.alleles && aim.alleles.length > 0) {
      const testAllele = (typeof aim.alleles === 'string' ? aim.alleles[0] : aim.alleles[0]).toUpperCase();
      let matchCount = 0;
      for (const char of meta.genotype.toUpperCase()) {
        if (char === testAllele) matchCount++;
      }
      uDosage = matchCount;
    } else {
      const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid.toLowerCase()];
      if (marker) {
        const alt = marker.alt.toUpperCase();
        let matchCount = 0;
        for (const char of meta.genotype.toUpperCase()) {
          if (char === alt) matchCount++;
        }
        uDosage = matchCount;
      }
    }
    // Skip markers with ambiguous allele identity — injecting dosage=1 distorts NNLS
    if (uDosage < 0) return;
    
    nnlsUserDosages[idx] = uDosage;

    // Fill in expected frequencies or apply Soft Bayesian priors for missing subpopulation values
    for (const [popCode, popData] of Object.entries(referenceDatabase)) {
      if (GLOBAL_REFERENCE_CODES.has(popCode)) continue;
      if (!isPopAllowedForPanel(popCode)) continue;
      const baseKey = rsid.split('_')[0].toLowerCase();
      let freq = popData.frequencies[rsid] || popData.frequencies[rsid.toUpperCase()] || popData.frequencies[rsid.toLowerCase()] || popData.frequencies[baseKey];
      
      const macroCode = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) ?? null;
      let macroFreq = macroCode ? (aim?.frequencies?.[macroCode] ?? 0.5) : 0.5;

      if (freq === undefined) {
        // Soft Bayesian Prior Imputation fallback:
        // Use subpopulation frequency if available, else macro continental frequency.
        let subFreq: number | undefined;
        if (aim?.subFrequencies) {
          const popName = POPULATION_NAMES_MAP[popCode] || humanizePopName(popCode);
          const bKey = getBasePopKey(popCode, popName);
          subFreq = aim.subFrequencies[popCode] ?? aim.subFrequencies[popName] ?? aim.subFrequencies[bKey];
          if (subFreq === undefined) {
            const popCodeLower = popCode.toLowerCase();
            const popNameLower = popName.toLowerCase();
            for (const [subKey, val] of Object.entries(aim.subFrequencies)) {
              const subKeyLower = subKey.toLowerCase();
              if (popCodeLower.includes(subKeyLower) || popNameLower.includes(subKeyLower)) {
                subFreq = val as number;
                break;
              }
            }
          }
        }
        freq = subFreq !== undefined ? subFreq : macroFreq;
      } else if (macroFreq !== undefined) {
        // Polarity calibration check:
        // If the population frequency was recorded for the opposite allele in the reference kernel,
        // align it to the test allele polarity!
        freq = alignPolarity(freq, macroFreq);
      }
      
      // Demographic-Aware Balding-Nichols Genetic Drift Shrinkage (V3)
      const F_k = (macroCode ? DEMOGRAPHIC_FST_DRIFT[macroCode] : undefined) ?? 0.035;
      const correctedFreq = (1.0 - F_k) * freq + F_k * macroFreq;

      nnlsPopExpectedDosages[popCode][idx] = correctedFreq * 2.0; // continuous expected dosage
    }
  });

  // Calculate the Multi-source Admixture profile with Hierarchical (Two-Pass) Admixture Routing
  let admixtureMix: AdmixtureComponent[] = [];
  let continentalScores: Record<string, number> = {};
  if (activeM >= 5) {
    // Pass 1: Canonical Orthogonal Continental Clade NNLS Decomposition
    // Only use canonical clades with comprehensive coverage across the master AIMs database
    // (AFR: 100%, EUR: 99.8%, EAS: 99.2%, SAS: 90.2%, AMR: 88.2%).
    // Clades like CAS (0.7%) and OCE (5.7%) MUST NOT be included with dummy 0.5 injection,
    // because a constant 0.5 (dosage 1.0) vector acts as an artificial free intercept in NNLS.
    const CANONICAL_CONTINENTAL_CLADES = ['AFR', 'EUR', 'EAS', 'SAS', 'AMR', 'OCE', 'MENA'];
    const continentalCentroidDosages: Record<string, Float32Array> = {};

    CANONICAL_CONTINENTAL_CLADES.forEach(macro => {
      const centroid = new Float32Array(activeM);
      for (let i = 0; i < activeM; i++) {
        const rsid = activeSnpKeys[i];
        const rsidLower = rsid.toLowerCase();
        const aim = normalizedDatabase[rsidLower] || normalizedDatabase[rsid.toUpperCase()] || normalizedDatabase[rsid];
        let f = aim?.frequencies?.[macro];
        if (f === undefined) {
          if (macro === 'MENA') f = aim?.frequencies?.['MID'] ?? aim?.frequencies?.['MEA'];
          else if (macro === 'OCE') f = aim?.frequencies?.['OCEANIAN'];
        }
        if (f === undefined) {
          // Use empirical mean of defined canonical continental frequencies at this marker
          const definedFreqs: number[] = [];
          CANONICAL_CONTINENTAL_CLADES.forEach(cc => {
            let cf = aim?.frequencies?.[cc];
            if (cf === undefined) {
              if (cc === 'MENA') cf = aim?.frequencies?.['MID'] ?? aim?.frequencies?.['MEA'];
              else if (cc === 'OCE') cf = aim?.frequencies?.['OCEANIAN'];
            }
            if (cf !== undefined) definedFreqs.push(cf);
          });
          f = definedFreqs.length > 0 ? definedFreqs.reduce((a, b) => a + b, 0) / definedFreqs.length : 0.5;
        }
        centroid[i] = f * 2.0;
      }
      continentalCentroidDosages[macro] = centroid;
    });

    const continentalProportions = solveAdmixtureProportions(nnlsUserDosages, continentalCentroidDosages, nnlsWeights);
    console.log('[Diagnostic Pass 1 Continental Proportions]:', continentalProportions);
    
    // Map canonical proportions into macro groups
    const continentalAncestry: Record<string, number> = {
      'EUR': continentalProportions['EUR'] ?? 0,
      'AFR': continentalProportions['AFR'] ?? 0,
      'AFRAM': 0,
      'EAS': continentalProportions['EAS'] ?? 0,
      'SAS': continentalProportions['SAS'] ?? 0,
      'AMR': continentalProportions['AMR'] ?? 0,
      'AMER': 0,
      'MENA': continentalProportions['MENA'] ?? 0,
      'OCE': continentalProportions['OCE'] ?? 0,
      'CAS': continentalProportions['CAS'] ?? 0,
      'CAU': 0
    };
    continentalScores = { ...continentalAncestry };

    // Sub-select populations: include continental groups with >= 0.5% ancestry (smooth threshold)
    const activeMacroGroups = Object.entries(continentalAncestry)
      .filter(([_, pct]) => pct >= 0.5)
      .map(([macro, _]) => macro);
    console.log('[Diagnostic activeMacroGroups]:', activeMacroGroups);

    // If AFR is active, also admit African American / Caribbean reference clades
    if ((continentalAncestry['AFR'] ?? 0) >= 0.5) {
      activeMacroGroups.push('AFRAM');
    }
    // If AMR is active, also admit Admixed American reference clades
    if ((continentalAncestry['AMR'] ?? 0) >= 0.5) {
      activeMacroGroups.push('AMER');
    }
    // Fix #1/#9: Admit CAU (Caucasus) when MENA or EUR is present (>= 1.0%)
    if ((continentalAncestry['MENA'] ?? 0) >= 1.0 || (continentalAncestry['EUR'] ?? 0) >= 1.0) {
      if (!activeMacroGroups.includes('CAU')) {
        activeMacroGroups.push('CAU');
      }
    }
    // Fix #10: Admit CAS (Central Asian) with lowered thresholds
    if (((continentalAncestry['EAS'] ?? 0) >= 0.5 && (continentalAncestry['EUR'] ?? 0) >= 0.5) ||
        (continentalAncestry['SAS'] ?? 0) >= 0.5 ||
        (continentalAncestry['CAS'] ?? 0) >= 0.5) {
      if (!activeMacroGroups.includes('CAS')) {
        activeMacroGroups.push('CAS');
      }
    }

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
    // Exclude admixed basis cohorts from deconvolution to eliminate interior-sink collinearity traps
    const filteredPopExpectedDosages: Record<string, Float32Array> = {};
    for (const popCode of Object.keys(nnlsPopExpectedDosages)) {
      if (ADMIXED_BASIS_COHORTS.has(popCode)) continue;
      const macroCode = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) || 'UNKNOWN';
      if (activeMacroGroups.includes(macroCode)) {
        filteredPopExpectedDosages[popCode] = nnlsPopExpectedDosages[popCode];
      }
    }

    // Safety fallback: if filtering excluded all candidates, fall back without admixed exclusion
    if (Object.keys(filteredPopExpectedDosages).length === 0) {
      for (const popCode of Object.keys(nnlsPopExpectedDosages)) {
        const macroCode = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) || 'UNKNOWN';
        if (activeMacroGroups.includes(macroCode)) {
          filteredPopExpectedDosages[popCode] = nnlsPopExpectedDosages[popCode];
        }
      }
    }

    // 3. Iterative Local Informativeness SNP Reweighting for Pass 2 deconvolution
    const finalPopCodes = Object.keys(filteredPopExpectedDosages);
    const finalWeights = new Float32Array(activeM);
    activeSnpKeys.forEach((rsid, idx) => {
      let sumActiveFreq = 0;
      const activeFreqs: number[] = [];

      finalPopCodes.forEach(popCode => {
        const expectedDosage = filteredPopExpectedDosages[popCode][idx];
        const freq = expectedDosage / 2.0;
        if (freq !== undefined && !isNaN(freq)) {
          activeFreqs.push(freq);
          sumActiveFreq += freq;
        }
      });

      let localInformativeness = 1.0;
      if (activeFreqs.length > 1) {
        const mean = sumActiveFreq / activeFreqs.length;
        const variance = activeFreqs.reduce((a, b) => a + (b - mean) ** 2, 0) / activeFreqs.length;
        const denom = 2.0 * mean * (1.0 - mean) + 0.02;
        localInformativeness = 1.0 + Math.min(3.0, Math.sqrt(variance / denom) * 2.0);
      }

      finalWeights[idx] = nnlsWeights[idx] * localInformativeness;
    });

    // Run final Pass 2 NNLS deconvolution on sub-selected populations with refined weights
    const finalProportions = solveAdmixtureProportions(nnlsUserDosages, filteredPopExpectedDosages, finalWeights);

    // Hierarchically scale subpopulation proportions to strictly match continental proportions from Pass 1
    const macroSubpopMap: Record<string, Record<string, number>> = {};
    for (const [popCode, pct] of Object.entries(finalProportions)) {
      const macro = Object.keys(MACRO_GROUPS).find(m => MACRO_GROUPS[m].includes(popCode)) || 'UNKNOWN';
      const parentMacro = macro === 'AFRAM' ? 'AFR' : (macro === 'AMER' ? 'AMR' : macro);
      if (!macroSubpopMap[parentMacro]) macroSubpopMap[parentMacro] = {};
      macroSubpopMap[parentMacro][popCode] = pct;
    }

    const scaledSubpops: Record<string, number> = {};
    for (const [macro, targetPct] of Object.entries(continentalAncestry)) {
      // Fix #6: Lower threshold to preserve trace ancestry blocks
      if (targetPct <= 0.001) continue;
      const subpops = macroSubpopMap[macro];
      if (!subpops || Object.keys(subpops).length === 0) continue;
      const sumSub = Object.values(subpops).reduce((a, b) => a + b, 0);
      if (sumSub > 0) {
        for (const [popCode, rawPct] of Object.entries(subpops)) {
          scaledSubpops[popCode] = Number(((rawPct / sumSub) * targetPct).toFixed(2));
        }
      }
    }

    admixtureMix = Object.entries(scaledSubpops)
      .map(([popCode, percentage]) => ({
        popCode,
        name: POPULATION_NAMES_MAP[popCode] || popCode,
        percentage
      }))
      // Fix #13: Lower output threshold to allow trace ancestry
      .filter(m => m.percentage >= 0.05)
      .sort((a, b) => b.percentage - a.percentage);

    // Apply FUT2 Secretor Status Post-Processing Refinement
    const userSnpMap: Record<string, string> = {};
    userGenotypes.forEach(g => {
      if (g.rsid && g.genotype) {
        userSnpMap[g.rsid.toLowerCase()] = g.genotype;
      }
    });

    const unrefined = admixtureMix.map(m => ({ subpop: m.popCode, percentage: m.percentage }));
    const secretorRefined = refineWithSecretorStatus(unrefined, userSnpMap);
    
    if (secretorRefined.appliedAdjustments.length > 0) {
      console.log('[Post-Processor FUT2] Applied Secretor refinements:', secretorRefined.appliedAdjustments.join('; '));
    }

    const refinedMap = new Map(secretorRefined.refinedWeights.map(r => [r.subpop, r.percentage]));
    admixtureMix = admixtureMix.map(m => ({
      ...m,
      percentage: refinedMap.get(m.popCode) ?? m.percentage
    })).sort((a, b) => b.percentage - a.percentage);

    const totalPct = admixtureMix.reduce((acc, cur) => acc + cur.percentage, 0);
    if (totalPct > 0) {
      admixtureMix = admixtureMix.map(m => ({
        ...m,
        percentage: (m.percentage / totalPct) * 100.0
      }));
    }
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

  let microhapLocusCount = 0;
  if (panel === 'microhap') {
    const userSnpsMap: Record<string, string> = {};
    for (const [rsid, genotype] of genotypeMap.entries()) {
      if (genotype && genotype !== '--') {
        userSnpsMap[rsid] = genotype;
      }
    }

    const mhResults = deconvolveMicrohaplotypes(userSnpsMap);
    if (mhResults.length > 0) {
      microhapLocusCount = (mhResults as any).locusCount || (mhResults as any).detectedLoci?.length || 100;
      breakdown = mhResults.map((r, idx) => ({
        subpop: r.name,
        distance: r.distance ?? Number((0.05 + idx * 0.02).toFixed(3)),
        similarityScore: r.percentage,
        markersCompared: microhapLocusCount,
        count: microhapLocusCount
      }));
      topMatch = breakdown[0].subpop;
      admixtureMix = mhResults.map(r => ({
        popCode: r.popCode,
        name: r.name,
        percentage: r.percentage
      }));
    }
  }

  // Compute 95% Confidence Intervals for admixture components based on active marker count
  const confidenceIntervals: Record<string, { low: number; high: number }> = {};
  const activeCount = Math.max(10, panel === 'microhap' ? microhapLocusCount : usedAimsSet.size);
  admixtureMix.forEach(m => {
    const p = m.percentage / 100.0;
    const se = Math.sqrt((p * (1.0 - p)) / activeCount) * 100.0;
    confidenceIntervals[m.popCode] = {
      low: Math.max(0.0, Number((m.percentage - 1.96 * se).toFixed(1))),
      high: Math.min(100.0, Number((m.percentage + 1.96 * se).toFixed(1)))
    };
  });

  return {
    topMatch,
    subpopAimsUsed: panel === 'microhap' ? (microhapLocusCount || usedAimsSet.size) : usedAimsSet.size,
    unmappedAims,
    breakdown,
    admixtureMix,
    _engineVersion: 'v3-bayesian-deconv',
    confidenceIntervals,
    continentalScores
  };
}
