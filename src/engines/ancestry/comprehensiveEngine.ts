import masterAims from '../../data/master_aims_normalized.json';

const CONTINENT_MAP: Record<string, string> = {
  'AFR': 'African',
  'EUR': 'European',
  'EAS': 'East Asian',
  'SAS': 'South Asian',
  'AMR': 'Native American',
  'MENA': 'Middle Eastern',
  'OCN': 'Oceanian',
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

  let markersUsed = 0;

  for (const [key, marker] of Object.entries(masterAims as Record<string, any>)) {
    // Two-step fallback lookup: Primary (rsid), Secondary (coordinate-based)
    let genotype = userGenotypes[marker.rsid.toLowerCase()];
    
    if (!genotype && marker.chromosome && marker.position) {
      const coordId = `chr${marker.chromosome}_${marker.position}`.toLowerCase();
      genotype = userGenotypes[coordId];
    }

    if (!genotype || genotype === '--') continue;

    const frequencies = marker.frequencies;
    const alleles = marker.alleles || [];
    
    // Simple frequency approach: assume the 'alleles' list in masterAims 
    // corresponds to the frequencies provided.
    // If multiple alleles are provided, we sum their frequencies for the check.
    
    markersUsed++;

    for (const popCode of populations) {
      const continent = CONTINENT_MAP[popCode];
      if (!continent) continue;

      const p = Math.max(0.001, Math.min(0.999, frequencies?.[popCode] || 0.01));
      const q = 1 - p;

      let prob = 1e-6; // Laplacian smoothing

      // Check user genotype for the targeted alleles
      let matchCount = 0;
      for (const char of genotype) {
        if (alleles.includes(char)) matchCount++;
      }

      if (matchCount === 2) prob = p * p;
      else if (matchCount === 1) prob = 2 * p * q;
      else prob = q * q;

      continentalLogLikelihoods[continent] += Math.log(prob);
    }
  }

  // Convert log-likelihoods to relative percentages
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
