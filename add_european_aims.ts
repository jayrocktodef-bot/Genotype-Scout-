
import fs from 'fs';

const newAims = [
  {
    rsid: "rs1042714_EUR",
    region: "European",
    alleles: ["C"],
    weight: 8,
    frequencies: { AFR: 0.1, EUR: 0.8, EAS: 0.1, AMR: 0.2, SAS: 0.3, MENA: 0.4, OCE: 0.1 },
    subFrequencies: { "Northern European": 0.9, "Southern European": 0.6 },
    description: "Ancestry Informative Marker for European populations, with higher frequency in Northern lineage.",
    trait: "Ancestry",
    category: "Ancestry"
  },
  {
    rsid: "rs4988235_EUR",
    region: "European",
    alleles: ["T"],
    weight: 8,
    frequencies: { AFR: 0.05, EUR: 0.75, EAS: 0.05, AMR: 0.1, SAS: 0.2, MENA: 0.15, OCE: 0.05 },
    subFrequencies: { "Northern European": 0.85, "Southern European": 0.3 },
    description: "LCT variation marker frequently observed in Northern European population expansions.",
    trait: "Ancestry",
    category: "Ancestry"
  },
  {
    rsid: "rs1426654_EUR",
    region: "European",
    alleles: ["A"],
    weight: 8,
    frequencies: { AFR: 0.1, EUR: 0.95, EAS: 0.1, AMR: 0.2, SAS: 0.4, MENA: 0.5, OCE: 0.1 },
    subFrequencies: { "Northern European": 0.98, "Southern European": 0.9 },
    description: "SLC24A5 marker associated with skin pigmentation and high frequency across European populations.",
    trait: "Ancestry",
    category: "Ancestry"
  }
];

const aims = JSON.parse(fs.readFileSync('./src/aims.cleaned.json', 'utf-8'));
aims.push(...newAims);
fs.writeFileSync('./src/aims.cleaned.json', JSON.stringify(aims, null, 2));
console.log('Successfully added new European AIMs.');
