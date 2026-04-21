export const mapToRegion = (continent: string): string => {
  if (!continent) return "Global";
  const c = continent.toLowerCase();
  if (c.includes('north african')) return "North African";
  if (c.includes('central asian')) return "Central Asian";
  if (c.includes('south asian')) return "South Asian";
  if (c.includes('east asian')) return "East Asian";
  if (c.includes('african') || c.includes('africa')) return "African";
  if (c.includes('european') || c.includes('europe') || c.includes('caucasian')) return "European";
  if (c.includes('native american') || c.includes('americas')) return "Native American";
  if (c.includes('oceanian') || c.includes('oceania')) return "Oceanian";
  if (c.includes('middle east')) return "Middle Eastern";
  return "Global";
};

export function groupByCategory(results: any[]) {
  const groups: Record<string, any[]> = {};
  for (const r of results) {
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  }
  return groups;
}

export function groupByContinent(results: any[]) {
  const groups: Record<string, any[]> = {};
  for (const r of results) {
    if (!groups[r.continent]) groups[r.continent] = [];
    groups[r.continent].push(r);
  }
  return groups;
}

export function mapContinentToFreqKey(continent: string): string {
  switch (continent) {
    case 'African': return 'AFR';
    case 'European': return 'EUR';
    case 'East Asian': return 'EAS';
    case 'South Asian': return 'SAS';
    case 'Middle Eastern': return 'MENA';
    case 'North African': return 'NAFR';
    case 'Native American': return 'AMR';
    case 'Oceanian': return 'OCE';
    case 'Central Asian': return 'CAS';
    case 'Caucasian': return 'MENA';
    default: return '';
  }
}

export const SUBPOP_SYNONYMS: Record<string, string[]> = {
  'African': ['Bantu', 'Sub-Saharan African', 'Afro-American', 'Atlantic-Congo', 'Niger-Congo'],
  'European': ['Caucasian', 'White', 'West Eurasian', 'Indo-European'],
  'East Asian': ['Austronesian', 'Sino-Tibetan', 'Hmong-Mien', 'Tai-Kadai', 'Northeast Asian', 'Southeast Asian'],
  'South Asian': ['Indo-Aryan', 'Dravidian', 'Munda', 'Tibeto-Burman', 'Ancestral South Indian', 'ASI', 'ANI', 'Ancestral North Indian'],
  'Middle Eastern': ['West Asian', 'Levantine', 'Anatolian', 'Cypriot', 'Near Eastern', 'Semitic', 'Mesopotamian'],
  'Native American': ['Indigenous American', 'Amerindian', 'Americas', 'Beringian', 'First Nations'],
  'Oceanian': ['Melanesian', 'Papuan', 'Austronesian', 'Polynesian', 'Micronesian'],
  'Central Asian': ['Altaic', 'Turkic', 'Inner Asian', 'Silk Road'],
  'North African': ['Maghreb', 'Berber', 'Amazigh', 'Sahrawi'],
};

export function isSubpopMatch(snpSubpop: string, target: string) {
  if (!snpSubpop || !target) return false;
  
  const snp = snpSubpop.trim().toLowerCase();
  const tgt = target.trim().toLowerCase();
  
  if (snp === tgt) return true;

  // Broad groups mapping
  const groups: Record<string, string[]> = {
    'African': ['Yoruba', 'Igbo', 'Mandinka', 'Esan', 'Mende', 'Akan', 'Ga-Adangbe', 'Ewe', 'Fon', 'Baule', 'Mossi', 'Temne', 'Mbundu', 'Efik', 'Ibibio', 'Edo', 'Limba', 'Sherbro', 'Kru', 'Grebo', 'Bassa', 'Vai', 'Gola', 'Kpelle', 'Loma', 'Mano', 'Dan', 'Wolof', 'Hausa', 'Fulani', 'Nigerian', 'Cameroon', 'Congo', 'Benin', 'Ghana', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Cape Verdean', 'Senegal', 'Gambia', 'Guinea', 'Balanta', 'Papel', 'Bijago', 'Dogon', 'Bambara', 'Songhai', 'Luhya', 'Maasai', 'Somali', 'Ethiopian', 'Amhara', 'Kikuyu', 'Baganda', 'Tigrayan', 'Oromo', 'Luo', 'Sudan', 'Nubian', 'Horn', 'Kenya', 'Tanzania', 'Uganda', 'Eritrea', 'Djibouti', 'South Sudan', 'Pygmy', 'Bamoun', 'Fang', 'Kongo', 'Luba', 'Mongo', 'Bakongo', 'Baluba', 'Ovimbundu', 'Chokwe', 'DRC', 'Angola', 'Bamileke', 'San', 'Khoisan', 'Khoe-San', 'Zulu', 'Xhosa', 'Sotho', 'Shona', 'Tsonga', 'Ndebele', 'Tswana', 'Venda', 'Lozi', 'Bemba', 'Tonga', 'Chewa', 'Yao', 'Makua', 'Botswana', 'Zimbabwe', 'Namibia', 'Mozambique', 'Malawi', 'Zambia', 'Bantu', 'Sub-Saharan African'],
    'West African': ['Yoruba', 'Igbo', 'Mandinka', 'Esan', 'Mende', 'Akan', 'Ga-Adangbe', 'Ewe', 'Fon', 'Baule', 'Mossi', 'Temne', 'Mbundu', 'Efik', 'Ibibio', 'Edo', 'Limba', 'Sherbro', 'Kru', 'Grebo', 'Bassa', 'Vai', 'Gola', 'Kpelle', 'Loma', 'Mano', 'Dan', 'Wolof', 'Hausa', 'Fulani', 'Nigerian', 'Cameroon', 'Congo', 'Benin', 'Ghana', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Cape Verdean', 'Senegal', 'Gambia', 'Guinea', 'Balanta', 'Papel', 'Bijago', 'Dogon', 'Bambara', 'Songhai'],
    'East African': ['Luhya', 'Maasai', 'Somali', 'Ethiopian', 'Amhara', 'Kikuyu', 'Baganda', 'Tigrayan', 'Oromo', 'Luo', 'Sudan', 'Nubian', 'Horn', 'East African', 'Kenya', 'Tanzania', 'Uganda', 'Eritrea', 'Djibouti', 'South Sudan'],
    'Central African': ['Cameroon', 'Congo', 'Pygmy', 'Bamoun', 'Fang', 'Kongo', 'Luba', 'Mongo', 'Bakongo', 'Baluba', 'Ovimbundu', 'Chokwe', 'Central African', 'DRC', 'Angola', 'Bamileke'],
    'Southern African': ['San', 'Khoisan', 'Khoe-San', 'Zulu', 'Xhosa', 'Sotho', 'Shona', 'Tsonga', 'Ndebele', 'Tswana', 'Venda', 'Lozi', 'Bemba', 'Tonga', 'Chewa', 'Yao', 'Makua', 'Southern African', 'Botswana', 'Zimbabwe', 'Namibia', 'Mozambique', 'Malawi', 'Zambia'],
    'North African': ['Berber', 'Moroccan', 'Algerian', 'Tunisian', 'Libyan', 'Egyptian', 'Maghreb', 'North African', 'Tuareg', 'Sahrawi', 'Amazigh'],
    'European': ['British', 'English', 'Scottish', 'Irish', 'French', 'German', 'Scandinavian', 'Italian', 'Spanish', 'Greek', 'Ashkenazi', 'Finnish', 'Eastern European', 'European', 'Belgian', 'Austrian', 'Swiss', 'Czech', 'Slovak', 'Hungarian', 'Romanian', 'Bulgarian', 'Serbian', 'Croatian', 'Slovenian', 'Albanian', 'Slavic', 'Russian', 'Polish', 'Ukrainian', 'Belarusian', 'Saami', 'Orcadian', 'Icelandic', 'Maltese', 'Cypriot', 'Basque', 'Sardinian', 'Balkan', 'Iberian', 'Baltic', 'Celtic', 'Portuguese', 'Dutch', 'Caucasian', 'White', 'West Eurasian'],
    'Northern European': ['Scandinavian', 'Finnish', 'Icelandic', 'Saami', 'Norwegian', 'Swedish', 'Danish'],
    'Southern European': ['Italian', 'Spanish', 'Portuguese', 'Greek', 'Balkan', 'Maltese', 'Sardinian', 'Iberian', 'Basque', 'Cypriot'],
    'Eastern European': ['Slavic', 'Baltic', 'Eastern European', 'Russian', 'Polish', 'Ukrainian', 'Belarusian', 'Lithuanian', 'Latvian', 'Estonian', 'Czech', 'Slovak', 'Hungarian', 'Romanian', 'Bulgarian'],
    'Western European': ['British', 'English', 'Scottish', 'Irish', 'French', 'German', 'Belgian', 'Swiss', 'Austrian', 'Dutch', 'Celtic'],
    'Middle Eastern': ['Bedouin', 'Assyrian', 'Druze', 'Palestinian', 'Jewish', 'Turkish', 'Iranian', 'Arab', 'Middle Eastern', 'Levantine', 'Anatolian', 'Mizrahi', 'Kurdish', 'Persian', 'Cypriot', 'West Asian', 'Near Eastern', 'Semitic', 'Mesopotamian'],
    'East Asian': ['Han', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Filipino', 'Malay', 'Indonesian', 'East Asian', 'Mongolian', 'Tibetan', 'Ainu', 'Ryukyuan', 'Miao', 'Yi', 'Tujia', 'Austronesian', 'Sino-Tibetan', 'Hmong-Mien', 'Tai-Kadai', 'Northeast Asian', 'Southeast Asian'],
    'South Asian': ['Indian', 'Pakistani', 'Bengali', 'Sri Lankan', 'Tamil', 'Punjabi', 'Gujarati', 'South Asian', 'Nepalese', 'Marathi', 'Malayali', 'Dravidian', 'Kalash', 'Pathan', 'Sindhi', 'Balochi', 'Indo-Aryan', 'Munda', 'Tibeto-Burman', 'Ancestral South Indian', 'ASI', 'ANI', 'Ancestral North Indian'],
    'Central Asian': ['Kazakh', 'Kyrgyz', 'Uzbek', 'Turkmen', 'Tajik', 'Uyghur', 'Central Asian', 'Hazara', 'Altaic', 'Turkic', 'Inner Asian', 'Silk Road'],
    'Native American': ['Mayan', 'Incan', 'Aztec', 'Pima', 'Karitiana', 'Surui', 'Quechua', 'Aymara', 'Native American', 'Andean', 'Central American', 'Amazonian', 'Eastern Woodland', 'Plains Indigenous', 'Southwest Indigenous', 'Arctic Indigenous', 'North American', 'Caribbean Indigenous', 'Taino', 'Navajo', 'Cherokee', 'Sioux', 'Ojibwe', 'Apache', 'Inuit', 'Iroquois', 'Cree', 'Metis', 'Yanomami', 'Nahua', 'Maya', 'Guarani', 'Mapuche', 'Indigenous', 'Beringian', 'Indigenous American', 'Amerindian', 'Americas', 'First Nations'],
    'Oceanian': ['Melanesian', 'Papuan', 'Australian Aboriginal', 'Polynesian', 'Micronesian', 'Hawaiian', 'Samoan', 'Chamorro', 'Oceanian', 'Fijian', 'Aboriginal Australian', 'Austronesian'],
  };

  const normalizedGroups: Record<string, string[]> = {};
  for (const [key, values] of Object.entries(groups)) {
    normalizedGroups[key.toLowerCase()] = values.map(v => v.toLowerCase());
  }

  const normalizedSynonyms: Record<string, string[]> = {};
  for (const [key, values] of Object.entries(SUBPOP_SYNONYMS)) {
    normalizedSynonyms[key.toLowerCase()] = values.map(v => v.toLowerCase());
  }

  // Check synonyms
  for (const [parent, syns] of Object.entries(normalizedSynonyms)) {
    if (parent === snp && syns.includes(tgt)) return true;
    if (parent === tgt && syns.includes(snp)) return true;
    if (syns.includes(snp) && syns.includes(tgt)) return true;
  }

  // Check group membership
  for (const [group, members] of Object.entries(normalizedGroups)) {
    if (group === tgt && members.includes(snp)) return true;
    if (snp === group && members.includes(tgt)) return true;
    if (members.includes(snp) && members.includes(tgt)) return true;
  }

  // Fuzzy match for plurals or minor text differences
  const isFuzzyMatch = (s1: string, s2: string) => {
    const clean = (s: string) => s.replace(/s$/i, '').replace(/-/g, ' '); // simple plural removal and dash to space
    return clean(s1) === clean(s2);
  };

  if (isFuzzyMatch(snp, tgt)) return true;

  return false;
}
