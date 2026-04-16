export const mapToRegion = (continent: string): string => {
  if (!continent) return "Global";
  const c = continent.toLowerCase();
  if (c.includes('african') || c.includes('africa')) return "Africa";
  if (c.includes('european') || c.includes('europe') || c.includes('caucasian')) return "Europe";
  if (c.includes('central asian')) return "Central Asia";
  if (c.includes('asian') || c.includes('asia')) return "Asia";
  if (c.includes('native american') || c.includes('americas') || c.includes('inuit')) return "Americas";
  if (c.includes('oceanian') || c.includes('oceania')) return "Oceania";
  if (c.includes('middle eastern') || c.includes('middle east')) return "Middle East";
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

export function isSubpopMatch(snpSubpop: string, target: string) {
  if (snpSubpop === target) return true;
  const groups: Record<string, string[]> = {
    'West African': ['Yoruba', 'Igbo', 'Mandinka', 'Esan', 'Mende', 'Akan', 'Ga-Adangbe', 'Ewe', 'Fon', 'Baule', 'Mossi', 'Temne', 'Mbundu', 'Efik', 'Ibibio', 'Edo', 'Limba', 'Sherbro', 'Kru', 'Grebo', 'Bassa', 'Vai', 'Gola', 'Kpelle', 'Loma', 'Mano', 'Dan', 'Wolof', 'Hausa', 'Fulani', 'Nigerian', 'Cameroon', 'Congo', 'Benin', 'Ghana', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Cape Verdean', 'Senegal', 'Gambia', 'Guinea', 'Balanta', 'Papel', 'Bijago', 'Dogon', 'Bambara', 'Songhai'],
    'East African': ['Luhya', 'Maasai', 'Somali', 'Ethiopian', 'Amhara', 'Kikuyu', 'Baganda', 'Tigrayan', 'Oromo', 'Luo', 'Sudan', 'Nubian', 'Horn', 'East African', 'Kenya', 'Tanzania', 'Uganda', 'Eritrea', 'Djibouti', 'South Sudan'],
    'Central African': ['Cameroon', 'Congo', 'Pygmy', 'Bamoun', 'Fang', 'Kongo', 'Luba', 'Mongo', 'Bakongo', 'Baluba', 'Ovimbundu', 'Chokwe', 'Central African', 'DRC', 'Angola', 'Bamileke'],
    'Southern African': ['San', 'Khoisan', 'Khoe-San', 'Zulu', 'Xhosa', 'Sotho', 'Shona', 'Tsonga', 'Ndebele', 'Tswana', 'Venda', 'Lozi', 'Bemba', 'Tonga', 'Chewa', 'Yao', 'Makua', 'Southern African', 'Botswana', 'Zimbabwe', 'Namibia', 'Mozambique', 'Malawi', 'Zambia'],
    'North African': ['Berber', 'Moroccan', 'Algerian', 'Tunisian', 'Libyan', 'Egyptian', 'Maghreb', 'North African', 'Tuareg', 'Sahrawi'],
    'European': ['British', 'English', 'Scottish', 'Irish', 'French', 'German', 'Scandinavian', 'Italian', 'Spanish', 'Greek', 'Ashkenazi', 'Finnish', 'Eastern European', 'European', 'Belgian', 'Austrian', 'Swiss', 'Czech', 'Slovak', 'Hungarian', 'Romanian', 'Bulgarian', 'Serbian', 'Croatian', 'Slovenian', 'Albanian', 'Slavic', 'Russian', 'Polish', 'Ukrainian', 'Belarusian', 'Saami', 'Orcadian', 'Icelandic', 'Maltese', 'Cypriot', 'Basque', 'Sardinian', 'Balkan', 'Iberian', 'Baltic', 'Celtic', 'Portuguese', 'Dutch'],
    'Northern European': ['Scandinavian', 'Finnish', 'Icelandic', 'Saami', 'Norwegian', 'Swedish', 'Danish'],
    'Southern European': ['Italian', 'Spanish', 'Portuguese', 'Greek', 'Balkan', 'Maltese', 'Sardinian', 'Iberian', 'Basque', 'Cypriot'],
    'Eastern European': ['Slavic', 'Baltic', 'Eastern European', 'Russian', 'Polish', 'Ukrainian', 'Belarusian', 'Lithuanian', 'Latvian', 'Estonian', 'Czech', 'Slovak', 'Hungarian', 'Romanian', 'Bulgarian'],
    'Western European': ['British', 'English', 'Scottish', 'Irish', 'French', 'German', 'Belgian', 'Swiss', 'Austrian', 'Dutch', 'Celtic'],
    'Middle Eastern': ['Bedouin', 'Assyrian', 'Druze', 'Palestinian', 'Jewish', 'Turkish', 'Iranian', 'Arab', 'Middle Eastern', 'Levantine', 'Anatolian', 'Mizrahi', 'Kurdish', 'Persian', 'Cypriot'],
    'East Asian': ['Han', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Filipino', 'Malay', 'Indonesian', 'East Asian', 'Mongolian', 'Tibetan', 'Ainu', 'Ryukyuan', 'Miao', 'Yi', 'Tujia'],
    'South Asian': ['Indian', 'Pakistani', 'Bengali', 'Sri Lankan', 'Tamil', 'Punjabi', 'Gujarati', 'South Asian', 'Nepalese', 'Marathi', 'Malayali', 'Dravidian', 'Kalash', 'Pathan', 'Sindhi', 'Balochi'],
    'Central Asian': ['Kazakh', 'Kyrgyz', 'Uzbek', 'Turkmen', 'Tajik', 'Uyghur', 'Central Asian', 'Hazara'],
    'Native American': ['Mayan', 'Incan', 'Aztec', 'Pima', 'Karitiana', 'Surui', 'Quechua', 'Aymara', 'Native American', 'Andean', 'Central American', 'Amazonian', 'Eastern Woodland', 'Plains Indigenous', 'Southwest Indigenous', 'Arctic Indigenous', 'North American', 'Caribbean Indigenous', 'Taino', 'Navajo', 'Cherokee', 'Sioux', 'Ojibwe', 'Apache', 'Inuit', 'Iroquois', 'Cree', 'Metis', 'Yanomami', 'Nahua', 'Maya', 'Guarani', 'Mapuche', 'Indigenous', 'Beringian'],
    'Oceanian': ['Melanesian', 'Papuan', 'Australian Aboriginal', 'Polynesian', 'Micronesian', 'Hawaiian', 'Samoan', 'Chamorro', 'Oceanian', 'Fijian', 'Aboriginal Australian'],
  };
  for (const [group, members] of Object.entries(groups)) {
    if (group === target && members.includes(snpSubpop)) return true;
    if (snpSubpop === group && members.includes(target)) return true;
    if (members.includes(snpSubpop) && members.includes(target)) return true;
  }
  return false;
}
