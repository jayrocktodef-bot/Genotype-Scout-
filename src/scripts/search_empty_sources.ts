import fs from 'fs';
import path from 'path';

function run() {
  const MASTER_FILE = path.join(process.cwd(), 'src', 'data', 'master_aims_normalized.json');
  const master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
  const emptyShells = [];
  for (const [rsid, item] of Object.entries(master)) {
    const it = item as any;
    if (it.region === 'GLOBAL' && Object.keys(it.frequencies || {}).length === 0 && it.weight === 1) {
      emptyShells.push(rsid);
    }
  }

  console.log(`Found ${emptyShells.length} empty shells in master.`);
  const sampleEmpty = new Set(emptyShells.slice(0, 50));
  
  // Search raw_aims files
  const rawDir = path.join(process.cwd(), 'src', 'data', 'raw_aims');
  const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.json'));
  for (const f of files) {
    try {
      const filePath = path.join(rawDir, f);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let matchCount = 0;
      let hasFreq = false;
      
      const entries = Array.isArray(content) ? content : Object.entries(content).map(([k, v]) => ({ ...(v as object), rsid: k }));
      for (const entry of entries) {
        if (entry && entry.rsid) {
          const rsLower = entry.rsid.toLowerCase();
          const rsClean = entry.rsid.split('_')[0].split('-')[0].toLowerCase();
          if (sampleEmpty.has(rsLower) || sampleEmpty.has(rsClean)) {
            matchCount++;
            if (entry.frequencies || entry.freqs) hasFreq = true;
          }
        }
      }
      if (matchCount > 0) {
        console.log(`File ${f} matched ${matchCount} sample empty shells. Has frequencies? ${hasFreq}`);
      }
    } catch (err: any) {
      console.log(`Error parsing ${f}: ${err.message}`);
    }
  }
}

run();
