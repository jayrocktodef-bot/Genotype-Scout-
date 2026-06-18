import fs from 'fs';
import path from 'path';

async function testPainterPrep() {
  const datasetPath = path.join(process.cwd(), 'src/data/aims/european.json');
  const european = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  
  // mock normalizedUserSnpMap
  const normalizedUserSnpMap = new Map();
  // Insert some european AIMs
  const keys = Object.keys(european).slice(0, 500);
  for (const k of keys) {
      normalizedUserSnpMap.set(k.toLowerCase(), 'AG');
  }
  
  // mock indexedDbKeys
  let indexedDbKeys = Object.keys(european).map(k => k.toLowerCase());
  
  let rawMatchingRsids = indexedDbKeys.filter(key => {
    const base = key.split('_')[0];
    return normalizedUserSnpMap.has(key) || normalizedUserSnpMap.has(base);
  });
  
  console.log("rawMatchingRsids.length:", rawMatchingRsids.length);
  
  // mock aimsDb
  let aimsDb = {};
  for (const k of rawMatchingRsids) {
      const origKey = Object.keys(european).find(x => x.toLowerCase() === k);
      aimsDb[k] = european[origKey];
  }
  
  let snpsForLAI = rawMatchingRsids
    .map((key) => {
      const aim = aimsDb[key];
      const base = key.split('_')[0];
      const genotype = normalizedUserSnpMap.get(key) || normalizedUserSnpMap.get(base) || '--';
      const chrom = aim?.chromosome || aim?.chrom;
      const pos = aim?.position !== undefined ? aim.position : aim?.pos;
      return {
        rsid: key,
        genotype: genotype || '--',
        chrom: chrom ? String(chrom).replace('chr', '').toUpperCase() : '',
        pos: typeof pos === 'number' ? pos : (pos ? parseInt(pos, 10) : undefined)
      };
    })
    .filter((s) => {
      if (!s.chrom || s.pos === undefined || isNaN(s.pos)) return false;
      const chromStr = String(s.chrom).toUpperCase().replace('CHR', '');
      if (chromStr === 'X' || chromStr === '23') return true;
      const n = parseInt(chromStr, 10);
      return !isNaN(n) && n >= 1 && n <= 22;
    });

  console.log("snpsForLAI.length:", snpsForLAI.length);
  if (snpsForLAI.length > 0) {
      console.log("First snp:", snpsForLAI[0]);
  }
}

testPainterPrep().catch(console.error);
