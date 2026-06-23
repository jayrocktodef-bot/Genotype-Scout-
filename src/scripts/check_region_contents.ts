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
  console.log(`Initial empty shells count: ${emptyShells.size}`);

  const rawDir = path.join(process.cwd(), 'src', 'data', 'raw_aims');
  const files = [
    'africa.json',
    'americas.json',
    'europe.json',
    'central-asia.json',
    'east-asia.json',
    'global.json',
    'middle-east.json',
    'oceania.json',
    'south-asia.json'
  ];

  let matchedInFiles = 0;
  let populatedMatches = 0;

  for (const f of files) {
    const filePath = path.join(rawDir, f);
    if (!fs.existsSync(filePath)) continue;
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const entries = Array.isArray(content) ? content : Object.entries(content).map(([k, v]) => ({ ...(v as object), rsid: k }));
      let fileMatch = 0;
      let filePopMap = 0;
      for (const entry of entries) {
        if (entry && entry.rsid) {
          const rsLower = entry.rsid.toLowerCase();
          const rsClean = entry.rsid.split('_')[0].split('-')[0].toLowerCase();
          if (emptyShells.has(rsLower) || emptyShells.has(rsClean)) {
            fileMatch++;
            if (entry.frequencies && Object.keys(entry.frequencies).length > 0) {
              filePopMap++;
            }
          }
        }
      }
      console.log(`- ${f}: total matches = ${fileMatch}, has frequencies = ${filePopMap}`);
      matchedInFiles += fileMatch;
      populatedMatches += filePopMap;
    } catch (e: any) {
      console.log(`Error reading ${f}: ${e.message}`);
    }
  }

  console.log(`Total matched empty shells across regional files: ${matchedInFiles}`);
  console.log(`Total matched empty shells with frequencies in regional files: ${populatedMatches}`);
}

run();
