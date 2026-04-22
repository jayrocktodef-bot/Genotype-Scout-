
import fs from 'fs';

const markers = [
  { id: "D9S1120", gene: "N/A", trait: "Native American Ancestry Marker", description: 'The "9-repeat allele" is a private marker found in almost all Native American groups but absent in Asia.' },
  { id: "rs7089424", gene: "ARID5B", trait: "Native American Ancestry Marker", description: "Strongly correlated with Native American ancestry; associated with B-cell ALL risk." },
  { id: "rs7088318", gene: "PIP4K2A", trait: "Native American Ancestry Marker", description: "Another high-frequency risk allele linked to increased Native American genetic heritage." },
  { id: "rs3731217", gene: "CDKN2A", trait: "Native American Ancestry Marker", description: "Positively correlated with Native American ancestry and childhood leukemia susceptibility." },
  { id: "rs2239633", gene: "CEBPE", trait: "Native American Ancestry Marker", description: "A specific marker used to differentiate ancestry profiles in admixed US populations." }
];

const aimsPath = './src/aims.cleaned.json';
const snpsPath = './src/data/snps.json';

const aims = JSON.parse(fs.readFileSync(aimsPath, 'utf-8'));
const snps = JSON.parse(fs.readFileSync(snpsPath, 'utf-8'));

markers.forEach(m => {
  // Add to Aims
  if (!aims.find((a: any) => a.rsid.startsWith(m.id))) {
    aims.push({
      rsid: `${m.id}_AMR`,
      region: "Native American",
      alleles: ["A"], // Placeholder
      weight: 9,
      frequencies: { AMR: 0.95 },
      subFrequencies: { "Indigenous American": 0.95 },
      trait: m.trait,
      category: "Ancestry",
      description: m.description
    });
  }

  // Add to Snps
  if (!snps.find((s: any) => s.markerId === m.id)) {
    snps.push({
      markerId: m.id,
      rsid: m.id,
      continent: "Native American",
      subPopulation: "Indigenous American",
      subRegion: "Americas",
      alleles: ["A"],
      description: m.description,
      trait: m.trait,
      significance: "High",
      category: "Ancestry",
      gene: m.gene,
      frequencies: { AMR: 0.95 }
    });
  }
});

fs.writeFileSync(aimsPath, JSON.stringify(aims, null, 2));
fs.writeFileSync(snpsPath, JSON.stringify(snps, null, 2));

console.log('Successfully added new Native American ancestral markers.');
