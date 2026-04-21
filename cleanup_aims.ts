
import fs from 'fs';
import aimsData from './src/aims.json' with { type: 'json' };

const processAims = (aims: any[]) => {
  const seenCount: Record<string, number> = {};
  
  return aims.map(aim => {
    const originalRsid = aim.rsid;
    let newRsid = originalRsid;

    // If there's a region, use it as a suffix if not already present
    if (aim.region && !originalRsid.includes('_')) {
        const suffix = aim.region.split(' ')[0].toUpperCase().substring(0, 3);
        newRsid = `${originalRsid}_${suffix}`;
    }

    // Keep track of counts for truly duplicate entries (same rsid and same region)
    const key = `${newRsid}_${aim.region}`;
    if (!seenCount[key]) {
        seenCount[key] = 0;
    }
    seenCount[key]++;
    
    if (seenCount[key] > 1) {
        newRsid = `${newRsid}_${seenCount[key]}`;
    }

    return { ...aim, rsid: newRsid };
  });
};

const cleanedData = processAims(aimsData);
fs.writeFileSync('src/aims.cleaned.json', JSON.stringify(cleanedData, null, 2));
console.log("Cleanup complete. Saved to src/aims.cleaned.json");
