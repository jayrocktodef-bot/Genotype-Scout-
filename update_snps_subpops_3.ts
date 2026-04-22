
import fs from 'fs';
import snps from './src/data/snps.json';

// Mapping rsids to more new subpopulation details
const subPopUpdates: Record<string, { subPopulation: string, subRegion: string }> = {
  "rs1042602": { subPopulation: "Sub-Saharan", subRegion: "African Continent" },
  "rs2032582": { subPopulation: "Bantu-speaking", subRegion: "Central Africa" },
  "rs1800414": { subPopulation: "Sub-Saharan", subRegion: "African Continent" },
  "rs1426654": { subPopulation: "West African", subRegion: "Sub-Saharan Africa" },
  "rs3827760": { subPopulation: "Indigenous American", subRegion: "Beringian/North America" },
  "rs75493593": { subPopulation: "Indigenous American", subRegion: "Mesoamerica" }
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
