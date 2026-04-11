
const fs = require('fs');
const aims = JSON.parse(fs.readFileSync('src/aims.json', 'utf8'));
const genotypeData = fs.readFileSync('src/genotypeData.ts', 'utf8');

const aimRsids = new Set(aims.map(a => a.rsid));
const rsidRegex = /rs[0-9]+/g;
const foundRsids = new Set(genotypeData.match(rsidRegex));

const missing = [];
for (const rsid of foundRsids) {
  if (!aimRsids.has(rsid)) {
    missing.push(rsid);
  }
}

console.log("RSIDs in genotypeData but not in aims.json:", missing);
