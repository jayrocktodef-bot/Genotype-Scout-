const fs = require('fs');
const content = fs.readFileSync('src/genotypeData.ts', 'utf8');
const match = content.match(/export const SNP_DB: SNP\[\] = \[([\s\S]*?)\];/);
if (match) {
  const snps = match[1].split('},');
  snps.forEach(s => {
    if (s.includes('Haplogroup')) {
      const traitMatch = s.match(/trait:\s*\"([^\"]+)\"/);
      const rsidMatch = s.match(/rsid:\s*\"([^\"]+)\"/);
      const markerMatch = s.match(/markerId:\s*\"([^\"]+)\"/);
      if (traitMatch) {
         console.log(traitMatch[1], '->', rsidMatch ? rsidMatch[1] : (markerMatch ? markerMatch[1] : 'none'));
      }
    }
  });
}
