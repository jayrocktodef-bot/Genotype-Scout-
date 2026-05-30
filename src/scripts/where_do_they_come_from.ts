import fs from 'fs';
import path from 'path';

function run() {
  const MASTER_FILE = path.join(process.cwd(), 'src', 'data', 'master_aims_normalized.json');
  const master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
  const emptyShells = new Set<string>();
  for (const [rsid, item] of Object.entries(master)) {
    const it = item as any;
    if (it.region === 'GLOBAL' && Object.keys(it.frequencies || {}).length === 0 && it.weight === 1) {
      emptyShells.add(rsid);
    }
  }

  const rawDir = path.join(process.cwd(), 'src', 'data', 'raw_aims');
  const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.json'));

  for (const f of files) {
    try {
      const filePath = path.join(rawDir, f);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let matchCount = 0;
      
      const entries = Array.isArray(content) ? content : Object.entries(content).map(([k, v]) => ({ ...(v as object), rsid: k }));
      for (const entry of entries) {
        if (entry && entry.rsid) {
          const rsLower = entry.rsid.toLowerCase();
          const rsClean = entry.rsid.split('_')[0].split('-')[0].toLowerCase();
          if (emptyShells.has(rsLower) || emptyShells.has(rsClean)) {
            matchCount++;
          }
        }
      }
      if (matchCount > 0) {
        console.log(`- ${f}: matches ${matchCount} empty shells`);
      }
    } catch {
      // Ignored
    }
  }
}

run();
