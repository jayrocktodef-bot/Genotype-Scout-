
import fs from 'fs';
import snps from './src/data/snps.json';

// Mapping rsids to new subpopulation details
const subPopUpdates: Record<string, { subPopulation: string, subRegion: string }> = {
  "rs2862": { subPopulation: "Yoruba", subRegion: "West Africa" },
  "rs1129038": { subPopulation: "Bantu-speaking", subRegion: "Central/Southern Africa" },
  "rs6726715": { subPopulation: "Quechua", subRegion: "Andean Region" },
  "rs16891982": { subPopulation: "Levantine", subRegion: "Eastern Mediterranean" }
};

const updatedSnps = snps.map(snp => {
  const update = subPopUpdates[snp.rsid];
  if (update) {
    return { ...snp, ...update };
  }
  return snp;
});

fs.writeFileSync('./src/data/snps.json', JSON.stringify(updatedSnps, null, 2));
console.log('Successfully updated subpopulations for selected markers.');
