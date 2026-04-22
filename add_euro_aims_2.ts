
import fs from 'fs';

const newAims = [
  { rsid: "rs1129038_EUR", region: "European", alleles: ["A"], weight: 8, frequencies: { EUR: 0.75, AFR: 0.1, EAS: 0.05, AMR: 0.15, SAS: 0.15 }, subFrequencies: { "Irish": 0.85, "Scottish": 0.82, "English": 0.80 }, description: "HERC2/OCA2 variation related to blue eye color in Western European populations.", trait: "Pigmentation", category: "Ancestry" },
  { rsid: "rs61986422_EUR", region: "European", alleles: ["C"], weight: 7, frequencies: { EUR: 0.65, AFR: 0.05, EAS: 0.05, AMR: 0.1, SAS: 0.1 }, subFrequencies: { "Irish": 0.7, "English": 0.68 }, description: "Marker associated with European hair color and skin pigmentation.", trait: "Pigmentation", category: "Ancestry" },
  { rsid: "rs6059655_EUR", region: "European", alleles: ["T"], weight: 8, frequencies: { EUR: 0.88, AFR: 0.05, EAS: 0.05, AMR: 0.1, SAS: 0.15 }, subFrequencies: { "Scottish": 0.9, "Irish": 0.88 }, description: "High-frequency marker in British Isles lineages.", trait: "Ancestry", category: "Ancestry" }
];

const aims = JSON.parse(fs.readFileSync('./src/aims.cleaned.json', 'utf-8'));
aims.push(...newAims);
fs.writeFileSync('./src/aims.cleaned.json', JSON.stringify(aims, null, 2));
console.log('Successfully added new European AIMs.');
