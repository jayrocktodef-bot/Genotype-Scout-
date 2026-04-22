
import fs from 'fs';
import snps from './src/data/snps.json';

// Mapping rsids to more new subpopulation details
const subPopUpdates: Record<string, { subPopulation: string, subRegion: string }> = {
  "rs13342692": { subPopulation: "Indigenous American", subRegion: "Mesoamerica" },
  "rs117767867": { subPopulation: "Indigenous American", subRegion: "Beringian/North America" },
  "rs75418188": { subPopulation: "Indigenous American", subRegion: "Mesoamerica" },
  "rs13342232": { subPopulation: "Indigenous American", subRegion: "Mesoamerica" },
  "rs9282541": { subPopulation: "Indigenous American", subRegion: "Andean Region" },
  "rs10811661": { subPopulation: "Indigenous American", subRegion: "North America" }
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
