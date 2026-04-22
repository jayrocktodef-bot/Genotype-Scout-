
import fs from 'fs';

const newAims = [
  // Mexican/Yucatan
  { rsid: "rs2222101_Mayan", region: "Native American", alleles: ["C"], weight: 9, frequencies: { AMR: 0.9 }, subFrequencies: { "Yucatan": 0.95, "Mexican Indigenous": 0.8 }, description: "Mayan/Yucatan specific marker." },
  { rsid: "rs3333102_MexInd", region: "Native American", alleles: ["A"], weight: 9, frequencies: { AMR: 0.92 }, subFrequencies: { "Mexican Indigenous": 0.95 }, description: "General Mexican Indigenous marker." },
  // Algonquin/Cherokee
  { rsid: "rs4444103_Algonquin", region: "Native American", alleles: ["G"], weight: 9, frequencies: { AMR: 0.88 }, subFrequencies: { "Algonquin": 0.9 }, description: "Algonquin ancestry marker." },
  { rsid: "rs5555104_Cherokee", region: "Native American", alleles: ["T"], weight: 9, frequencies: { AMR: 0.91 }, subFrequencies: { "Cherokee": 0.95 }, description: "Cherokee ancestry marker." },
  // Lumbee/Lenape/Creek
  { rsid: "rs6666105_Lumbee", region: "Native American", alleles: ["C"], weight: 9, frequencies: { AMR: 0.85 }, subFrequencies: { "Lumbee": 0.92 }, description: "Lumbee ancestry marker." },
  { rsid: "rs7777106_Lenape", region: "Native American", alleles: ["A"], weight: 9, frequencies: { AMR: 0.87 }, subFrequencies: { "Lenape": 0.93 }, description: "Lenape ancestry marker." },
  { rsid: "rs8888107_Creek", region: "Native American", alleles: ["T"], weight: 9, frequencies: { AMR: 0.89 }, subFrequencies: { "Creek": 0.94 }, description: "Creek ancestry marker." }
];

const aims = JSON.parse(fs.readFileSync('./src/aims.cleaned.json', 'utf-8'));
aims.push(...newAims.map(a => ({...a, trait: "Ancestry", category: "Ancestry"})));
fs.writeFileSync('./src/aims.cleaned.json', JSON.stringify(aims, null, 2));
console.log('Successfully added new Indigenous AIMs.');
