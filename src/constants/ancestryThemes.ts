/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContinentPalette {
  base: string;
  tints: string[];
  gradient: string;
  border: string;
  bg: string;
  text: string;
  icon: string;
}

export const CONTINENT_PALETTES: Record<string, ContinentPalette> = {
  'Indigenous American': {
    base: '#06b6d4',
    tints: ['#0891b2', '#06b6d4', '#22d3ee', '#14b8a6', '#0d9488', '#5eead4'],
    gradient: 'from-cyan-500 to-teal-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    icon: '🌿'
  },
  'African': {
    base: '#10b981',
    tints: ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
    gradient: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    icon: '🌍'
  },
  'European': {
    base: '#6366f1',
    tints: ['#4338ca', '#4f46e5', '#6366f1', '#818cf8', '#3b82f6', '#60a5fa'],
    gradient: 'from-indigo-500 to-sky-400',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    icon: '🏛️'
  },
  'Middle Eastern': {
    base: '#f43f5e',
    tints: ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#a855f7', '#c084fc'],
    gradient: 'from-rose-500 to-amber-500',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    icon: '🕌'
  },
  'East Asian': {
    base: '#f59e0b',
    tints: ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fde047'],
    gradient: 'from-amber-500 to-yellow-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    icon: '🏮'
  },
  'South Asian': {
    base: '#f97316',
    tints: ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74'],
    gradient: 'from-orange-500 to-rose-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    icon: '🪷'
  },
  'Oceanian': {
    base: '#ec4899',
    tints: ['#be185d', '#db2777', '#ec4899', '#f472b6', '#fbcfe8'],
    gradient: 'from-pink-500 to-purple-400',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    icon: '🌊'
  },
  'Other': {
    base: '#c084fc',
    tints: [
      '#a855f7', // Vivid Purple
      '#d946ef', // Electric Fuchsia
      '#ec4899', // Hot Pink
      '#f43f5e', // Vibrant Rose
      '#fb923c', // Warm Coral
      '#facc15', // Radiant Amber Gold
      '#2dd4bf', // Luminous Teal
      '#38bdf8'  // Electric Sky Blue
    ],
    gradient: 'from-purple-500 via-pink-500 to-amber-400',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
    text: 'text-purple-300',
    icon: '✨'
  }
};

/**
 * Direct lookup dictionary for standard 1000 Genomes, gnomAD, ALFA, SGDP, and regional cohorts.
 */
const EXACT_POPULATION_CONTINENT_MAP: Record<string, string> = {
  // 1000 Genomes African
  'yri': 'African',
  'lwk': 'African',
  'gwd': 'African',
  'msl': 'African',
  'esn': 'African',
  'asw': 'African',
  'acb': 'African',
  'afr': 'African',
  // gnomAD & ALFA African
  'afr_gnomad': 'African',
  'alfa_afam': 'African',
  'alfa_african': 'African',
  'afram_south': 'African',
  'afram_northeast': 'African',
  'afram_west': 'African',
  'gll': 'African',
  'louisiana_creole': 'African',
  'gwf_fula': 'African',
  'gwj_jola': 'African',
  'gww_wolof': 'African',

  // 1000 Genomes European
  'ceu': 'European',
  'fin': 'European',
  'gbr': 'European',
  'ibs': 'European',
  'tsi': 'European',
  'eur': 'European',
  'nfe_gnomad': 'European',
  'fin_gnomad': 'European',
  'ami_gnomad': 'European',
  'alfa_eur': 'European',
  'irish_am': 'European',
  'italian_am': 'European',
  'german_am': 'European',

  // 1000 Genomes East Asian
  'chb': 'East Asian',
  'chs': 'East Asian',
  'jpt': 'East Asian',
  'khv': 'East Asian',
  'cdx': 'East Asian',
  'eas': 'East Asian',
  'eas_gnomad': 'East Asian',
  'alfa_eas': 'East Asian',
  'gemj_japan': 'East Asian',
  'filipino_am': 'East Asian',
  'vietnamese_am': 'East Asian',

  // 1000 Genomes South Asian
  'beb': 'South Asian',
  'gih': 'South Asian',
  'itu': 'South Asian',
  'pjl': 'South Asian',
  'stu': 'South Asian',
  'sas': 'South Asian',
  'sas_gnomad': 'South Asian',
  'alfa_sas': 'South Asian',

  // 1000 Genomes / Admixed & Indigenous American
  'pel': 'Indigenous American',
  'mxl': 'Indigenous American',
  'clm': 'Indigenous American',
  'pur': 'Indigenous American',
  'amr': 'Indigenous American',
  'amr_gnomad': 'Indigenous American',
  'alfa_latam1': 'Indigenous American',
  'alfa_latam2': 'Indigenous American',
  'cuban_am': 'Indigenous American',
  'dominican_am': 'Indigenous American',
  'lmb': 'Indigenous American',
  'cat': 'Indigenous American',
  'chk': 'Indigenous American',
  'wdn': 'Indigenous American',
  'mel': 'Indigenous American',

  // Middle Eastern
  'mid_gnomad': 'Middle Eastern',
  'asj_gnomad': 'Middle Eastern',
  'asj': 'Middle Eastern',
  'sej': 'Middle Eastern',
  'mzj': 'Middle Eastern',
  'ymj': 'Middle Eastern',

  // Central Asian, Caucasus, & East Asian references
  'sgdp_tajik': 'South Asian',
  'sgdp_hazara': 'South Asian',
  'hgdp_hazara': 'South Asian',
  'sgdp_russia_abkhasian': 'Middle Eastern',
  'sgdp_russia_northossetian': 'Middle Eastern',
  'sgdp_lezgin': 'Middle Eastern',
  'sgdp_tu': 'East Asian',
  'hgdp_tu': 'East Asian',
  'sgdp_china_lahu': 'East Asian',
  'hgdp_lahu': 'East Asian',
  'hgdp_naxi': 'East Asian',
  'hgdp_cambodian': 'East Asian',
  'hgdp_she': 'East Asian'
};

export const assignContinent = (name: string, popCode?: string, regionHint?: string): string => {
  const code = (popCode || '').toLowerCase().trim();
  const text = (name || '').toLowerCase().trim();
  const region = (regionHint || '').toLowerCase().trim();

  // 1. Direct code/name lookup
  if (EXACT_POPULATION_CONTINENT_MAP[code]) return EXACT_POPULATION_CONTINENT_MAP[code];
  if (EXACT_POPULATION_CONTINENT_MAP[text]) return EXACT_POPULATION_CONTINENT_MAP[text];

  // 2. African prefixes & keywords
  if (
    code.startsWith('sgdp_mandenka') || code.startsWith('sgdp_yoruba') || code.startsWith('sgdp_esan') ||
    code.startsWith('sgdp_mende') || code.startsWith('sgdp_gambian') || code.startsWith('sgdp_luo') ||
    code.startsWith('sgdp_bantukenya') || code.startsWith('sgdp_bantutswana') || code.startsWith('sgdp_luhya') ||
    code.startsWith('sgdp_biaka') || code.startsWith('sgdp_mbuti') || code.startsWith('sgdp_khomani') ||
    code.startsWith('sgdp_ju_hoan') || code.startsWith('sgdp_masai') || code.startsWith('sgdp_somali') ||
    code.startsWith('sgdp_bantuherero') || code.startsWith('sgdp_malagasy') ||
    code.startsWith('hgdp_yoruba') || code.startsWith('hgdp_mandenka') || code.startsWith('hgdp_biaka') ||
    code.startsWith('hgdp_mbuti') || code.startsWith('hgdp_san') || code.startsWith('hgdp_bantu') ||
    text.includes('african') || text.includes('yoruba') || text.includes('mandenka') || text.includes('bantu') ||
    text.includes('luo') || text.includes('luhya') || text.includes('tswana') || text.includes('fula') ||
    text.includes('wolof') || text.includes('jola') || text.includes('mende') || text.includes('esan') ||
    text.includes('pygmy') || text.includes('san ') || text.includes('khoisan') || text.includes('nilotic') ||
    text.includes('somali') || text.includes('herero') || text.includes('dinka') || text.includes('gambia')
  ) {
    return 'African';
  }

  // 3. Indigenous American & Admixed American prefixes & keywords
  if (
    code.startsWith('sgdp_tlingit') || code.startsWith('cat') || code.startsWith('wdn') ||
    code.startsWith('lmb') || code.startsWith('chk') || code.startsWith('sgdp_pima') ||
    code.startsWith('sgdp_mayan') || code.startsWith('sgdp_mexico') || code.startsWith('sgdp_karitiana') ||
    code.startsWith('sgdp_surui') || code.startsWith('sgdp_quechua') || code.startsWith('sgdp_aleut') ||
    code.startsWith('sgdp_eskimo') || code.startsWith('sgdp_mixe') || code.startsWith('sgdp_mixtec') ||
    code.startsWith('sgdp_piapoco') || code.startsWith('sgdp_ticuna') ||
    code.startsWith('hgdp_pima') || code.startsWith('hgdp_maya') ||
    code.startsWith('hgdp_karitiana') || code.startsWith('hgdp_surui') || code.startsWith('hgdp_colombian') ||
    text.includes('indigenous') || text.includes('tlingit') || text.includes('catawba') ||
    text.includes('cherokee') || text.includes('lumbee') || text.includes('zapotec') ||
    text.includes('maya') || text.includes('pima') || text.includes('karitiana') ||
    text.includes('surui') || text.includes('eskimo') || text.includes('aleut') ||
    text.includes('woodlands') || text.includes('algonquian') || text.includes('native') ||
    text.includes('quechua') || text.includes('andean') || text.includes('amazonian') ||
    text.includes('aymara') || text.includes('guarani') || text.includes('mixe') ||
    text.includes('mixtec') || text.includes('piapoco') || text.includes('ticuna')
  ) {
    return 'Indigenous American';
  }

  // 4. European prefixes & keywords
  if (
    code.startsWith('sgdp_french') || code.startsWith('sgdp_english') || code.startsWith('sgdp_orcadian') ||
    code.startsWith('sgdp_basque') || code.startsWith('sgdp_sardinian') || code.startsWith('sgdp_italian') ||
    code.startsWith('sgdp_greek') || code.startsWith('sgdp_russian') || code.startsWith('sgdp_finnish') ||
    code.startsWith('sgdp_albanian') || code.startsWith('sgdp_bulgarian') || code.startsWith('sgdp_czech') ||
    code.startsWith('sgdp_estonian') || code.startsWith('sgdp_hungarian') || code.startsWith('sgdp_icelandic') ||
    code.startsWith('sgdp_norwegian') || code.startsWith('sgdp_polish') || code.startsWith('sgdp_bergamo') ||
    code.startsWith('sgdp_cretan') || code.startsWith('sgdp_saami') ||
    code.startsWith('sgdp_tuscan') || code.startsWith('sgdp_spanish') ||
    code.startsWith('hgdp_french') || code.startsWith('hgdp_basque') || code.startsWith('hgdp_sardinian') ||
    code.startsWith('hgdp_russian') || code.startsWith('hgdp_italian') || code.startsWith('hgdp_orcadian') ||
    code.startsWith('balkan') || code.startsWith('baltic') || code.startsWith('basque') ||
    code.startsWith('slavic') || code.startsWith('scandinavian') ||
    text.includes('european') || text.includes('english') || text.includes('british') ||
    text.includes('orcadian') || text.includes('french') || text.includes('spanish') ||
    text.includes('italian') || text.includes('greek') || text.includes('russian') ||
    text.includes('finnish') || text.includes('basque') || text.includes('cretan') ||
    text.includes('polish') || text.includes('german') || text.includes('swedish') ||
    text.includes('norwegian') || text.includes('dutch') || text.includes('irish') ||
    text.includes('balkan') || text.includes('baltic') || text.includes('slavic') ||
    text.includes('scandinavian') || text.includes('hungarian') || text.includes('czech')
  ) {
    return 'European';
  }

  // 5. Middle Eastern & Caucasus prefixes & keywords
  if (
    code.startsWith('sgdp_jew') || code.startsWith('sgdp_samaritan') || code.startsWith('sgdp_druze') ||
    code.startsWith('sgdp_bedouin') || code.startsWith('sgdp_palestinian') || code.startsWith('sgdp_jordanian') ||
    code.startsWith('sgdp_iranian') || code.startsWith('sgdp_turkish') || code.startsWith('sgdp_saharawi') ||
    code.startsWith('sgdp_mozabite') || code.startsWith('sgdp_armenian') || code.startsWith('sgdp_georgian') ||
    code.startsWith('sgdp_adygei') || code.startsWith('sgdp_chechen') ||
    code.startsWith('hgdp_bedouin') || code.startsWith('hgdp_druze') ||
    code.startsWith('hgdp_palestinian') || code.startsWith('hgdp_mozabite') || code.startsWith('hgdp_adygei') ||
    text.includes('jewish') || text.includes('samaritan') || text.includes('middle eastern') ||
    text.includes('druze') || text.includes('bedouin') || text.includes('palestinian') ||
    text.includes('arabian') || text.includes('turkish') || text.includes('caucasian') ||
    text.includes('adygei') || text.includes('armenian') || text.includes('levant') ||
    text.includes('mozabite') || text.includes('saharawi') || text.includes('berber') ||
    text.includes('iranian') || text.includes('iraqi') || text.includes('jordanian') ||
    text.includes('chechen') || text.includes('georgian')
  ) {
    return 'Middle Eastern';
  }

  // 6. East Asian & Siberian prefixes & keywords
  if (
    code.startsWith('sgdp_han') || code.startsWith('sgdp_japanese') || code.startsWith('sgdp_dai') ||
    code.startsWith('sgdp_korean') || code.startsWith('sgdp_naxi') || code.startsWith('sgdp_yi') ||
    code.startsWith('sgdp_she') || code.startsWith('sgdp_miao') || code.startsWith('sgdp_burmese') ||
    code.startsWith('sgdp_thai') || code.startsWith('sgdp_cambodian') || code.startsWith('sgdp_kinh') ||
    code.startsWith('sgdp_ami') || code.startsWith('sgdp_atayal') || code.startsWith('sgdp_dusun') ||
    code.startsWith('sgdp_igorot') || code.startsWith('sgdp_mongola') || code.startsWith('sgdp_daur') ||
    code.startsWith('sgdp_hezhen') || code.startsWith('sgdp_tujia') || code.startsWith('sgdp_xibo') ||
    code.startsWith('sgdp_yakut') || code.startsWith('sgdp_even') || code.startsWith('sgdp_itelmen') ||
    code.startsWith('sgdp_oroqen') || code.startsWith('sgdp_mansi') || code.startsWith('sgdp_altaian') ||
    code.startsWith('sgdp_chukchi') || code.startsWith('sgdp_tubalar') || code.startsWith('sgdp_ulchi') ||
    code.startsWith('sgdp_uyghur') || code.startsWith('sgdp_kyrgyz') ||
    code.startsWith('hgdp_han') || code.startsWith('hgdp_japanese') || code.startsWith('hgdp_mongola') ||
    code.startsWith('hgdp_daur') || code.startsWith('hgdp_hezhen') || code.startsWith('hgdp_oroqen') ||
    code.startsWith('hgdp_tujia') || code.startsWith('hgdp_xibo') || code.startsWith('hgdp_yakut') ||
    code.startsWith('hgdp_uygur') ||
    text.includes('east asian') || text.includes('han') || text.includes('japanese') ||
    text.includes('chinese') || text.includes('korean') || text.includes('dai') || text.includes('tu ') ||
    text.includes('mongolian') || text.includes('siberian') || text.includes('yakut') ||
    text.includes('tibetan') || text.includes('uyghur') || text.includes('vietnamese')
  ) {
    return 'East Asian';
  }

  // 7. South Asian prefixes & keywords
  if (
    code.startsWith('sgdp_brahui') || code.startsWith('sgdp_balochi') || code.startsWith('sgdp_sindhi') ||
    code.startsWith('sgdp_punjabi') || code.startsWith('sgdp_bengali') || code.startsWith('sgdp_brahmin') ||
    code.startsWith('sgdp_kapu') || code.startsWith('sgdp_madiga') || code.startsWith('sgdp_mala') ||
    code.startsWith('sgdp_relli') || code.startsWith('sgdp_yadava') || code.startsWith('sgdp_irula') ||
    code.startsWith('sgdp_kalash') || code.startsWith('sgdp_khonda') || code.startsWith('sgdp_makrani') ||
    code.startsWith('sgdp_burusho') || code.startsWith('sgdp_kusunda') || code.startsWith('sgdp_pathan') ||
    code.startsWith('hgdp_kalash') || code.startsWith('hgdp_sindhi') || code.startsWith('hgdp_pathan') ||
    code.startsWith('hgdp_balochi') || code.startsWith('hgdp_brahui') || code.startsWith('hgdp_makrani') ||
    code.startsWith('hgdp_burusho') ||
    text.includes('south asian') || text.includes('indian') || text.includes('brahui') ||
    text.includes('balochi') || text.includes('sindhi') || text.includes('pathan') ||
    text.includes('punjabi') || text.includes('bengali') || text.includes('tamil') ||
    text.includes('telugu') || text.includes('gujarati') || text.includes('brahmin')
  ) {
    return 'South Asian';
  }

  // 8. Oceanian prefixes & keywords
  if (
    code.startsWith('sgdp_papuan') || code.startsWith('sgdp_bougainville') || code.startsWith('sgdp_australian') ||
    code.startsWith('sgdp_hawaiian') || code.startsWith('sgdp_maori') ||
    code.startsWith('hgdp_papuan') || code.startsWith('hgdp_melanesian') ||
    text.includes('oceanian') || text.includes('papuan') || text.includes('bougainville') ||
    text.includes('australian') || text.includes('maori') || text.includes('hawaiian') ||
    text.includes('polynesian') || text.includes('melanesian')
  ) {
    return 'Oceanian';
  }

  // 9. Region hint fallback if supplied
  if (region) {
    if (region.includes('africa')) return 'African';
    if (region.includes('europe')) return 'European';
    if (region.includes('east asia') || region === 'asia') return 'East Asian';
    if (region.includes('south asia')) return 'South Asian';
    if (region.includes('america')) return 'Indigenous American';
    if (region.includes('middle east')) return 'Middle Eastern';
    if (region.includes('oceania')) return 'Oceanian';
  }

  return 'Other';
};

