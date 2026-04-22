
import fs from 'fs';

const aboSnps = [
  { markerId: "rs8176746", rsid: "rs8176746", gene: "ABO", description: "ABO Blood Group Marker", continent: "Global", subPopulation: "Global", alleles: ["G", "T"], significance: "High", category: "Health", trait: "Blood Type", frequencies: { Global: 0.5 } },
  { markerId: "rs8176747", rsid: "rs8176747", gene: "ABO", description: "ABO Blood Group Marker", continent: "Global", subPopulation: "Global", alleles: ["G", "T"], significance: "High", category: "Health", trait: "Blood Type", frequencies: { Global: 0.5 } },
  { markerId: "rs8176750", rsid: "rs8176750", gene: "ABO", description: "ABO Blood Group Marker", continent: "Global", subPopulation: "Global", alleles: ["G", "A"], significance: "High", category: "Health", trait: "Blood Type", frequencies: { Global: 0.5 } }
];

const snps = JSON.parse(fs.readFileSync('./src/data/snps.json', 'utf-8'));
aboSnps.forEach(s => {
  if (!snps.find((existing: any) => existing.rsid === s.rsid)) {
    snps.push(s);
  }
});

fs.writeFileSync('./src/data/snps.json', JSON.stringify(snps, null, 2));
console.log('Successfully added ABO blood type markers.');
