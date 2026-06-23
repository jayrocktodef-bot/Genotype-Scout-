/**
 * 1KGP Population Dictionary
 * Maps population codes to human-readable names and macro-continental groups.
 */

export interface PopulationInfo {
  name: string;
  continent: string;
  code: string;
}

export const POPULATION_MAP: Record<string, PopulationInfo> = {
  // AFR (Africa)
  'YRI': { code: 'YRI', name: 'Yoruba', continent: 'AFR' },
  'LWK': { code: 'LWK', name: 'Luhya', continent: 'AFR' },
  'GWD': { code: 'GWD', name: 'Gambian', continent: 'AFR' },
  'MSL': { code: 'MSL', name: 'Mende', continent: 'AFR' },
  'ESN': { code: 'ESN', name: 'Esan', continent: 'AFR' },
  'ASW': { code: 'ASW', name: 'African Ancestry SW US', continent: 'AFR' },
  'ACB': { code: 'ACB', name: 'African Caribbean', continent: 'AFR' },
  
  // AMR (Americas)
  'MXL': { code: 'MXL', name: 'Mexican Ancestry', continent: 'AMR' },
  'PUR': { code: 'PUR', name: 'Puerto Rican', continent: 'AMR' },
  'PEL': { code: 'PEL', name: 'Peruvian', continent: 'AMR' },
  'CLM': { code: 'CLM', name: 'Colombian', continent: 'AMR' },
  
  // EAS (East Asia)
  'CHB': { code: 'CHB', name: 'Han Chinese', continent: 'EAS' },
  'JPT': { code: 'JPT', name: 'Japanese', continent: 'EAS' },
  'CHS': { code: 'CHS', name: 'Southern Han', continent: 'EAS' },
  'CDX': { code: 'CDX', name: 'Chinese Dai', continent: 'EAS' },
  'KHV': { code: 'KHV', name: 'Kinh Vietnamese', continent: 'EAS' },
  
  // EUR (Europe)
  'CEU': { code: 'CEU', name: 'NW European', continent: 'EUR' },
  'TSI': { code: 'TSI', name: 'Tuscan', continent: 'EUR' },
  'FIN': { code: 'FIN', name: 'Finnish', continent: 'EUR' },
  'GBR': { code: 'GBR', name: 'British', continent: 'EUR' },
  'IBS': { code: 'IBS', name: 'Iberian', continent: 'EUR' },
  
  // SAS (South Asia)
  'GIH': { code: 'GIH', name: 'Gujarati Indian', continent: 'SAS' },
  'PJL': { code: 'PJL', name: 'Punjabi', continent: 'SAS' },
  'BEB': { code: 'BEB', name: 'Bengali', continent: 'SAS' },
  'STU': { code: 'STU', name: 'Sri Lankan Tamil', continent: 'SAS' },
  'ITU': { code: 'ITU', name: 'Indian Telugu', continent: 'SAS' }
};

export const CONTINENT_LABELS: Record<string, string> = {
  'AFR': 'Africa',
  'AMR': 'Americas',
  'EAS': 'East Asia',
  'EUR': 'Europe',
  'SAS': 'South Asia'
};

export const getPopulationByCode = (code: string): PopulationInfo | undefined => {
  return POPULATION_MAP[code.toUpperCase()];
};

export const getPopulationsByContinent = (continent: string): PopulationInfo[] => {
  return Object.values(POPULATION_MAP).filter(p => p.continent === continent);
};
