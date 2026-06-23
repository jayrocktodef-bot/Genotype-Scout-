import { loadMasterAims } from '../../data/index';

// Initialize on first use or cache
let masterAimsCache: any = null;
const getMasterAims = () => {
  if (!masterAimsCache) masterAimsCache = loadMasterAims();
  return masterAimsCache;
};

const CONTINENT_MAP: Record<string, string> = {
  'AFR': 'African',
  'EUR': 'European',
  'EAS': 'East Asian',
  'SAS': 'South Asian',
  'AMR': 'Native American',
  'MENA': 'Middle Eastern',
  'OCE': 'Oceanian',
  'NAFR': 'North African',
  'CAS': 'Central Asian'
};

/**
 * Comprehensive Ancestry Engine
 * Uses the full master_aims_normalized.json database for high-resolution 
 * Bayesian inference across all available informative markers.
 */
export function calculateComprehensiveScores(userGenotypes: Record<string, string>) {
  const continentalLogLikelihoods: Record<string, number> = {};
  const populations = Object.keys(CONTINENT_MAP);
  
  populations.forEach(pop => {
    const continent = CONTINENT_MAP[pop];
    if (continent) continentalLogLikelihoods[continent] = 0;
  });

  // Pre-index user genotypes to lower case keys for O(1) matching in loops
  const lowerUserGenotypes = new Map<string, string>();
  for (const k in userGenotypes) {
    const genotype = userGenotypes[k];
    if (genotype && genotype !== '--') {
      lowerUserGenotypes.set(k.toLowerCase(), genotype);
    }
  }

  let markersUsed = 0;
  const aims = getMasterAims() as Record<string, any>;

  for (const key in aims) {
    const marker = aims[key];
    const rsidLower = marker.rsid.toLowerCase();
    
    // O(1) Map matching
    let genotype = lowerUserGenotypes.get(rsidLower);
    
    if (!genotype) {
      const splitIdx = rsidLower.indexOf('_');
      if (splitIdx !== -1) {
        genotype = lowerUserGenotypes.get(rsidLower.substring(0, splitIdx));
      }
    }
    
    if (!genotype && marker.chromosome && marker.position) {
      const coordId = 'chr' + marker.chromosome + '_' + marker.position;
      genotype = lowerUserGenotypes.get(coordId);
    }

    if (!genotype) continue;

    const frequencies = marker.frequencies;
    const alleles = marker.alleles || [];
    
    markersUsed++;

    // Pre-extract genotype string length and content
    const matchCount = (alleles.includes(genotype[0]) ? 1 : 0) + (genotype[1] && alleles.includes(genotype[1]) ? 1 : 0);

    for (const popCode of populations) {
      const continent = CONTINENT_MAP[popCode];
      if (!continent) continue;

      const p = Math.max(0.001, Math.min(0.999, frequencies?.[popCode] || 0.01));
      const q = 1 - p;

      let prob = 1e-6; // Laplacian smoothing
      if (matchCount === 2) prob = p * p;
      else if (matchCount === 1) prob = 2 * p * q;
      else prob = q * q;

      continentalLogLikelihoods[continent] += Math.log(prob);
    }
  }

  const continents = Object.keys(continentalLogLikelihoods);
  if (continents.length === 0 || markersUsed === 0) return {};

  const topScore = Math.max(...Object.values(continentalLogLikelihoods));
  const relativeProbs: Record<string, number> = {};
  let totalProb = 0;

  continents.forEach(c => {
    const p = Math.exp(continentalLogLikelihoods[c] - topScore);
    relativeProbs[c] = p;
    totalProb += p;
  });

  const finalScores: Record<string, number> = {};
  continents.forEach(c => {
    const percentage = (relativeProbs[c] / totalProb) * 100;
    if (percentage > 0.1) {
      finalScores[c] = percentage;
    }
  });

  return finalScores;
}

