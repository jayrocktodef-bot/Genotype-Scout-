
import fs from 'fs';

const marker = {
  // Aims
  aim: {
    rsid: "rs112735431_EUR",
    region: "European",
    alleles: ["T"],
    weight: 8,
    frequencies: { EUR: 0.8, AFR: 0.05, EAS: 0.05, AMR: 0.05, SAS: 0.05 },
    description: "Added marker rs112735431.",
    trait: "Ancestry",
    category: "Ancestry"
  },
  // SNP
  snp: {
    markerId: "rs112735431",
    rsid: "rs112735431",
    continent: "European",
    subPopulation: "European",
    subRegion: "General",
    alleles: ["T"],
    description: "Added marker rs112735431.",
    trait: "Ancestry",
    significance: "Medium",
    category: "Ancestry",
    gene: "Unknown",
    frequencies: { Global: 0.2 }
  }
};

const aims = JSON.parse(fs.readFileSync('./src/aims.cleaned.json', 'utf-8'));
aims.push(marker.aim);
fs.writeFileSync('./src/aims.cleaned.json', JSON.stringify(aims, null, 2));

const snps = JSON.parse(fs.readFileSync('./src/data/snps.json', 'utf-8'));
snps.push(marker.snp);
fs.writeFileSync('./src/data/snps.json', JSON.stringify(snps, null, 2));

console.log('Successfully added rs112735431 to database.');
