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
    base: '#94a3b8',
    tints: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'],
    gradient: 'from-slate-500 to-slate-400',
    border: 'border-slate-500/30',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    icon: '🌐'
  }
};

export const assignContinent = (name: string, popCode?: string): string => {
  const code = (popCode || '').toLowerCase();
  const text = name.toLowerCase();

  if (
    code.startsWith('sgdp_mandenka') || code.startsWith('sgdp_yoruba') || code.startsWith('sgdp_esan') ||
    code.startsWith('sgdp_mende') || code.startsWith('sgdp_gambian') || code.startsWith('sgdp_luo') ||
    code.startsWith('sgdp_bantukenya') || code.startsWith('sgdp_bantutswana') || code.startsWith('sgdp_luhya') ||
    code.startsWith('sgdp_biaka') || code.startsWith('sgdp_mbuti') || code.startsWith('sgdp_khomani') ||
    code.startsWith('sgdp_ju_hoan') || code.startsWith('sgdp_masai') || code.startsWith('sgdp_somali') ||
    code.startsWith('hgdp_yoruba') || code.startsWith('hgdp_mandenka') ||
    text.includes('african') || text.includes('yoruba') || text.includes('mandenka') || text.includes('bantu') ||
    text.includes('luo') || text.includes('luhya') || text.includes('tswana') || text.includes('fula') ||
    text.includes('wolof') || text.includes('jola') || text.includes('mende') || text.includes('esan') ||
    text.includes('pygmy') || text.includes('san ') || text.includes('khoisan')
  ) {
    return 'African';
  }

  if (
    code.startsWith('sgdp_tlingit') || code.startsWith('cat') || code.startsWith('wdn') ||
    code.startsWith('lmb') || code.startsWith('chk') || code.startsWith('sgdp_pima') ||
    code.startsWith('sgdp_mayan') || code.startsWith('sgdp_mexico') || code.startsWith('sgdp_karitiana') ||
    code.startsWith('sgdp_surui') || code.startsWith('sgdp_quechua') || code.startsWith('sgdp_aleut') ||
    code.startsWith('sgdp_eskimo') || code.startsWith('hgdp_pima') || code.startsWith('hgdp_maya') ||
    code.startsWith('hgdp_karitiana') || code.startsWith('hgdp_surui') || code.startsWith('hgdp_colombian') ||
    text.includes('indigenous') || text.includes('tlingit') || text.includes('catawba') ||
    text.includes('cherokee') || text.includes('lumbee') || text.includes('zapotec') ||
    text.includes('maya') || text.includes('pima') || text.includes('karitiana') ||
    text.includes('surui') || text.includes('eskimo') || text.includes('aleut') ||
    text.includes('woodlands') || text.includes('algonquian') || text.includes('native') ||
    text.includes('quechua') || text.includes('andean') || text.includes('amazonian')
  ) {
    return 'Indigenous American';
  }

  if (
    code.startsWith('sgdp_french') || code.startsWith('sgdp_english') || code.startsWith('sgdp_orcadian') ||
    code.startsWith('sgdp_basque') || code.startsWith('sgdp_sardinian') || code.startsWith('sgdp_italian') ||
    code.startsWith('sgdp_greek') || code.startsWith('sgdp_russian') || code.startsWith('sgdp_finnish') ||
    code.startsWith('ceu') || code.startsWith('gbr') || code.startsWith('tsi') || code.startsWith('ibs') ||
    code.startsWith('fin') || code.startsWith('hgdp_french') || code.startsWith('hgdp_basque') ||
    code.startsWith('hgdp_sardinian') || code.startsWith('hgdp_russian') ||
    text.includes('european') || text.includes('english') || text.includes('british') ||
    text.includes('orcadian') || text.includes('french') || text.includes('spanish') ||
    text.includes('italian') || text.includes('greek') || text.includes('russian') ||
    text.includes('finnish') || text.includes('basque') || text.includes('cretan')
  ) {
    return 'European';
  }

  if (
    code.startsWith('sgdp_jew') || code.startsWith('sgdp_samaritan') || code.startsWith('sgdp_druze') ||
    code.startsWith('sgdp_bedouin') || code.startsWith('sgdp_palestinian') || code.startsWith('sgdp_jordanian') ||
    code.startsWith('sgdp_iranian') || code.startsWith('sgdp_turkish') || code.startsWith('sgdp_saharawi') ||
    code.startsWith('mzj') || code.startsWith('ymj') || code.startsWith('asj') || code.startsWith('sej') ||
    text.includes('jewish') || text.includes('samaritan') || text.includes('middle eastern') ||
    text.includes('druze') || text.includes('bedouin') || text.includes('palestinian') ||
    text.includes('arabian') || text.includes('turkish') || text.includes('caucasian') ||
    text.includes('adygei') || text.includes('armenian') || text.includes('levant')
  ) {
    return 'Middle Eastern';
  }

  if (
    code.startsWith('sgdp_han') || code.startsWith('sgdp_japanese') || code.startsWith('sgdp_dai') ||
    code.startsWith('sgdp_korean') || code.startsWith('chb') || code.startsWith('jpt') ||
    code.startsWith('chs') || code.startsWith('cdx') || code.startsWith('khv') ||
    text.includes('east asian') || text.includes('han') || text.includes('japanese') ||
    text.includes('chinese') || text.includes('korean') || text.includes('dai') || text.includes('tu ')
  ) {
    return 'East Asian';
  }

  if (
    code.startsWith('sgdp_brahui') || code.startsWith('sgdp_balochi') || code.startsWith('sgdp_sindhi') ||
    code.startsWith('sgdp_punjabi') || code.startsWith('gih') || code.startsWith('pjb') ||
    text.includes('south asian') || text.includes('indian') || text.includes('brahui') ||
    text.includes('balochi') || text.includes('sindhi') || text.includes('pathan') ||
    text.includes('punjabi') || text.includes('bengali')
  ) {
    return 'South Asian';
  }

  if (
    code.startsWith('sgdp_papuan') || code.startsWith('sgdp_bougainville') || code.startsWith('sgdp_australian') ||
    text.includes('oceanian') || text.includes('papuan') || text.includes('bougainville') ||
    text.includes('australian') || text.includes('maori') || text.includes('hawaiian')
  ) {
    return 'Oceanian';
  }

  return 'Other';
};
