
import fs from 'fs';

const genotypeData = fs.readFileSync('./src/genotypeData.ts', 'utf8');
const aimsData = JSON.parse(fs.readFileSync('./src/aims.cleaned.json', 'utf8'));

const rsidsInGenotype = new Set();
const matches = genotypeData.matchAll(/rs[0-9]+/g);
for (const match of matches) {
  rsidsInGenotype.add(match[0]);
}

const rsidsInAims = new Set(aimsData.map(aim => aim.rsid));

const missingRsids = [];
for (const rsid of rsidsInGenotype) {
  if (!rsidsInAims.has(rsid)) {
    missingRsids.push(rsid);
  }
}

console.log('Missing RSIDs:', missingRsids);
