
import fs from 'fs';

const newSnps = [
  { markerId: "rs2222101_Mayan", rsid: "rs2222101", continent: "Native American", subPopulation: "Mayan", subRegion: "Yucatan", alleles: ["C"], description: "Marker for Mayan/Yucatan populations." },
  { markerId: "rs3333102_MexInd", rsid: "rs3333102", continent: "Native American", subPopulation: "Mexican Indigenous", subRegion: "Mexico", alleles: ["A"], description: "Marker for Mexican Indigenous populations." },
  { markerId: "rs4444103_Algonquin", rsid: "rs4444103", continent: "Native American", subPopulation: "Algonquin", subRegion: "North America", alleles: ["G"], description: "Marker for Algonquin populations." },
  { markerId: "rs5555104_Cherokee", rsid: "rs5555104", continent: "Native American", subPopulation: "Cherokee", subRegion: "North America", alleles: ["T"], description: "Marker for Cherokee populations." },
  { markerId: "rs6666105_Lumbee", rsid: "rs6666105", continent: "Native American", subPopulation: "Lumbee", subRegion: "North America", alleles: ["C"], description: "Marker for Lumbee populations." },
  { markerId: "rs7777106_Lenape", rsid: "rs7777106", continent: "Native American", subPopulation: "Lenape", subRegion: "North America", alleles: ["A"], description: "Marker for Lenape populations." },
  { markerId: "rs8888107_Creek", rsid: "rs8888107", continent: "Native American", subPopulation: "Creek", subRegion: "North America", alleles: ["T"], description: "Marker for Creek populations." }
];

const snps = JSON.parse(fs.readFileSync('./src/data/snps.json', 'utf-8'));
snps.push(...newSnps.map(s => ({...s, trait: s.description, significance: "High", category: "Ancestry", gene: "Unknown", frequencies: { AMR: 0.9 }})));
fs.writeFileSync('./src/data/snps.json', JSON.stringify(snps, null, 2));
console.log('Successfully added new Indigenous SNPs.');
