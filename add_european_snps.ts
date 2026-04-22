
import fs from 'fs';

const newSnps = [
  {
    markerId: "rs7690467_NorthernEurope",
    rsid: "rs7690467",
    gene: "Unknown",
    trait: "Northern European Ancestry Marker",
    continent: "European",
    subpop: "Northern European",
    alleles: ["A"],
    significance: "Medium",
    category: "Ancestry",
    description: "Ancestry Informative Marker for Northern European populations.",
    frequencies: { AFR: 0.02, AMR: 0.1, EAS: 0.05, EUR: 0.85, SAS: 0.1, MENA: 0.05 },
    subPopulation: "Northern European",
    subRegion: "Northern Europe"
  },
  {
    markerId: "rs1712435_NorthernEurope",
    rsid: "rs1712435",
    gene: "Unknown",
    trait: "Northern European Ancestry Marker",
    continent: "European",
    subpop: "Northern European",
    alleles: ["G"],
    significance: "Medium",
    category: "Ancestry",
    description: "Ancestry Informative Marker for Northern European populations.",
    frequencies: { AFR: 0.01, AMR: 0.08, EAS: 0.02, EUR: 0.9, SAS: 0.05, MENA: 0.03 },
    subPopulation: "Northern European",
    subRegion: "Northern Europe"
  },
  {
    markerId: "rs9955196_NorthernEurope",
    rsid: "rs9955196",
    gene: "Unknown",
    trait: "Northern European Ancestry Marker",
    continent: "European",
    subpop: "Northern European",
    alleles: ["T"],
    significance: "High",
    category: "Ancestry",
    description: "Ancestry Informative Marker for Northern European populations.",
    frequencies: { AFR: 0.0, AMR: 0.05, EAS: 0.0, EUR: 0.95, SAS: 0.02, MENA: 0.01 },
    subPopulation: "Northern European",
    subRegion: "Northern Europe"
  }
];

const snps = JSON.parse(fs.readFileSync('./src/data/snps.json', 'utf-8'));
snps.push(...newSnps);
fs.writeFileSync('./src/data/snps.json', JSON.stringify(snps, null, 2));
console.log('Successfully added new European SNPs.');
