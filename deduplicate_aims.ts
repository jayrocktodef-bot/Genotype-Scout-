
import fs from 'fs';
import aims from './src/aims.cleaned.json';

// Keep only the first occurrence of each unique AIM based on rsid
const seen = new Set();
const uniqueAims = [];

aims.forEach(aim => {
  const key = aim.rsid;
  if (!seen.has(key)) {
    uniqueAims.push(aim);
    seen.add(key);
  }
});

fs.writeFileSync('./src/aims.cleaned.json', JSON.stringify(uniqueAims, null, 2));
console.log(`Deduplication complete. Reduced ${aims.length} markers to ${uniqueAims.length}.`);
