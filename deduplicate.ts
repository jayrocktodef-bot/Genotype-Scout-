
import fs from 'fs';
import snps from './src/data/snps.json';

// Keep only the first occurrence of each unique marker based on rsid/markerId
const seen = new Set();
const uniqueSnps = [];

// Assuming rsid as the unique key, if missing use markerId
snps.forEach(snp => {
  const key = snp.rsid || snp.markerId;
  if (!seen.has(key)) {
    uniqueSnps.push(snp);
    seen.add(key);
  }
});

fs.writeFileSync('./src/data/snps.json', JSON.stringify(uniqueSnps, null, 2));
console.log(`Deduplication complete. Reduced ${snps.length} markers to ${uniqueSnps.length}.`);
