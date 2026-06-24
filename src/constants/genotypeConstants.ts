export const CONTINENT_META: Record<string, {color: string, icon: string}> = {
  "African":        {color:"#E8A838", icon:"🌍"},
  "European":       {color:"#4B8BE8", icon:"🌍"},
  "East Asian":     {color:"#E84B4B", icon:"🌏"},
  "Native American":{color:"#C25C1A", icon:"🌎"},
  "Oceanian":       {color:"#14b8a6", icon:"🏝️"},
  "Middle Eastern": {color:"#8b5cf6", icon:"🌍"},
  "Central Asian":  {color:"#f59e0b", icon:"🌏"},
  "South Asian":    {color:"#f472b6", icon:"🇮🇳"},
  "North African":  {color:"#c084fc", icon:"🏜️"},
  "African-American":{color:"#059669", icon:"🇺🇸"},
  "Admixed American": {color:"#db2777", icon:"🇺🇸"},
  "Global":         {color:"#10b981", icon:"🌐"}
};

export const CATEGORY_META = {
  "Health":     { color: "#E84B4B", icon: "🏥" },
  "Ancestry":   { color: "#C25C1A", icon: "🌎" },
  "Lifestyle":  { color: "#4B8BE8", icon: "🧘" },
  "Nutrition":  { color: "#E8A838", icon: "🥗" },
  "Performance": { color: "#4BE8B8", icon: "⚡" },
  "Private":     { color: "#8b5cf6", icon: "🔒" },
};

export const SIG_COLOR = { High: "#E84B4B", Medium: "#E8A838", Low: "#4BE8B8" };

export const REGION_CODES: Record<string, string> = {
  AFR: 'African',
  EUR: 'European',
  EAS: 'East Asian',
  AMR: 'Native American',
  SAS: 'South Asian',
  MENA: 'Middle Eastern',
  OCE: 'Oceanian',
  NAFR: 'North African',
  CAS: 'Central Asian',
  AFRAM: 'African-American',
  AMER: 'Admixed American'
};

export const CONTINENT_TO_CODE: Record<string, string> = {
  'African': 'AFR',
  'European': 'EUR',
  'East Asian': 'EAS',
  'Native American': 'AMR',
  'South Asian': 'SAS',
  'Middle Eastern': 'MENA',
  'North African': 'NAFR',
  'Oceanian': 'OCE',
  'Central Asian': 'CAS',
  'African-American': 'AFRAM',
  'Admixed American': 'AMER'
};

export const IUPAC_MAP: Record<string, string> = {
  'M': 'AC', 'R': 'AG', 'W': 'AT', 'S': 'CG', 'Y': 'CT', 'K': 'GT',
  'V': 'ACG', 'H': 'ACT', 'D': 'AGT', 'B': 'CGT', 'X': 'ACGT', 'N': 'ACGT'
};
