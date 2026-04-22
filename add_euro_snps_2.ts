
import fs from 'fs';

const newSnps = [
  { markerId: "rs1129038_Irish", rsid: "rs1129038", continent: "European", subPopulation: "Irish", subRegion: "Western Europe", alleles: ["A"], description: "HERC2 variant common in Irish ancestry.", trait: "Ancestry", significance: "Medium", category: "Ancestry", frequencies: { EUR: 0.75 } },
  { markerId: "rs61986422_Scottish", rsid: "rs61986422", continent: "European", subPopulation: "Scottish", subRegion: "Northern Europe", alleles: ["C"], description: "Pigmentation variant observed in Scottish lineages.", trait: "Ancestry", significance: "Medium", category: "Ancestry", frequencies: { EUR: 0.65 } },
  { markerId: "rs6059655_English", rsid: "rs6059655", continent: "European", subPopulation: "English", subRegion: "Western Europe", alleles: ["T"], description: "Ancestry marker common in English populations.", trait: "Ancestry", significance: "High", category: "Ancestry", frequencies: { EUR: 0.88 } }
];

const snps = JSON.parse(fs.readFileSync('./src/data/snps.json', 'utf-8'));
snps.push(...newSnps);
fs.writeFileSync('./src/data/snps.json', JSON.stringify(snps, null, 2));
console.log('Successfully added new European SNPs.');
