
import fs from 'fs';
import snps from './src/data/snps.json';

// Updated logic to find African markers without subpopulation and tag them
const updatedSnps = snps.map(snp => {
  if (snp.continent === 'African' && !snp.subPopulation) {
    // If we have a hint in description or trait, use it, otherwise default
    if (snp.trait?.includes('East African')) {
      return { ...snp, subPopulation: 'East African', subRegion: 'East Africa' };
    }
    if (snp.trait?.includes('West African')) {
      return { ...snp, subPopulation: 'West African', subRegion: 'West Africa' };
    }
    if (snp.description?.includes('Khoe-San')) {
        return { ...snp, subPopulation: 'Khoisan', subRegion: 'Southern Africa' };
    }
    // Default fallback for general African markers
    return { ...snp, subPopulation: 'Sub-Saharan', subRegion: 'African Continent' };
  }
  
  // Add Russian / Slavic markers
  if (snp.rsid === 'rs10860570') {
     return { ...snp, continent: 'European', subPopulation: 'Slavic', subRegion: 'Eastern Europe' };
  }
  if (snp.rsid === 'rs10860571') {
     return { ...snp, continent: 'European', subPopulation: 'Russian', subRegion: 'Eastern Europe' };
  }

  return snp;
});

fs.writeFileSync('./src/data/snps.json', JSON.stringify(updatedSnps, null, 2));
console.log('Successfully updated subpopulations.');
