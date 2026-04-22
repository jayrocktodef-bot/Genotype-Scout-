
import fs from 'fs';
import snps from './src/data/snps.json';

// Mapping rsids to more new subpopulation details
const subPopUpdates: Record<string, { subPopulation: string, subRegion: string }> = {
  "rs2814778": { subPopulation: "West African", subRegion: "Sub-Saharan Africa" },
  "rs334": { subPopulation: "West African", subRegion: "Sub-Saharan Africa" },
  "rs12913832": { subPopulation: "Sub-Saharan", subRegion: "African Continent" },
  "rs1800407": { subPopulation: "Sub-Saharan", subRegion: "African Continent" }
};

const updatedSnps = snps.map(snp => {
  const update = subPopUpdates[snp.rsid];
  if (update) {
    return { ...snp, ...update };
  }
  return snp;
});

fs.writeFileSync('./src/data/snps.json', JSON.stringify(updatedSnps, null, 2));
console.log('Successfully updated more subpopulations for selected markers.');
