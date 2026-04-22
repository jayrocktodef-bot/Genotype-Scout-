
import fs from 'fs';

const markers = [
  { rsid: "rs1815739", gene: "ACTN3", description: "ACTN3 (Muscle Performance)", category: "Health" },
  { rsid: "rs1799971", gene: "APOE", description: "APOE-epsilon 4 marker", category: "Health" },
  { rsid: "rs429358", gene: "APOE", description: "APOE-epsilon 4 marker", category: "Health" },
  { rsid: "rs73885319", gene: "APOL1", description: "APOL1 G1 (Kidney Disease Risk)", category: "Health" },
  { rsid: "rs60910145", gene: "APOL1", description: "APOL1 G1 (Kidney Disease Risk)", category: "Health" },
  { rsid: "rs2814778", gene: "DARC", description: "Duffy Null (Malaria Resistance/Low Neutrophils)", category: "Health" },
  { rsid: "rs3827760", gene: "EDAR", description: "EDAR (Hair/Teeth Shape)", category: "Health" },
  { rsid: "rs6025", gene: "F5", description: "Factor V Leiden (Blood Clot Risk)", category: "Health" },
  { rsid: "rs1050829", gene: "G6PD", description: "G6PD Deficiency (A- variant)", category: "Health" },
  { rsid: "rs1050828", gene: "G6PD", description: "G6PD Deficiency (A- variant)", category: "Health" },
  { rsid: "rs1800562", gene: "HFE", description: "HFE C282Y (Hemochromatosis)", category: "Health" },
  { rsid: "rs4988235", gene: "MCM6", description: "MCM6 (Lactose Intolerance)", category: "Health" },
  { rsid: "rs1801131", gene: "MTHFR", description: "MTHFR A1298C (Folate Metabolism)", category: "Health" },
  { rsid: "rs1801133", gene: "MTHFR", description: "MTHFR C677T (Folate Metabolism)", category: "Health" },
  { rsid: "rs1799963", gene: "F2", description: "Prothrombin G20210A (Blood Clot Risk)", category: "Health" },
  { rsid: "rs76992529", gene: "TTR", description: "TTR Val122Ile (Transthyretin Amyloidosis)", category: "Health" }
];

const snps = JSON.parse(fs.readFileSync('./src/data/snps.json', 'utf-8'));

markers.forEach(m => {
  if (!snps.find((s: any) => s.rsid === m.rsid)) {
    snps.push({
      markerId: m.rsid,
      rsid: m.rsid,
      continent: "N/A",
      subPopulation: "N/A",
      subRegion: "N/A",
      alleles: [],
      ...m,
      trait: m.description,
      significance: "High",
      frequencies: { Global: 0.0 }
    });
  }
});

fs.writeFileSync('./src/data/snps.json', JSON.stringify(snps, null, 2));
console.log('Successfully accounted for requested markers.');
