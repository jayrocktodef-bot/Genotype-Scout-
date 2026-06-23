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
  console.log(`Initial empty shells: ${emptyShells.size}`);

  // 1. Regional Files
  const rawDir = path.join(process.cwd(), 'src', 'data', 'raw_aims');
  const regionalFiles = [
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

  const resolvedByRegions = new Set<string>();
  for (const f of regionalFiles) {
    const filePath = path.join(rawDir, f);
    if (!fs.existsSync(filePath)) continue;
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const entries = Array.isArray(content) ? content : Object.entries(content).map(([k, v]) => ({ ...(v as object), rsid: k }));
    for (const entry of entries) {
      if (entry && entry.rsid) {
        const rsLower = entry.rsid.toLowerCase();
        const rsClean = entry.rsid.split('_')[0].split('-')[0].toLowerCase();
        if (emptyShells.has(rsLower) && entry.frequencies && Object.keys(entry.frequencies).length > 0) {
          resolvedByRegions.add(rsLower);
        } else if (emptyShells.has(rsClean) && entry.frequencies && Object.keys(entry.frequencies).length > 0) {
          resolvedByRegions.add(rsClean);
        }
      }
    }
  }
  console.log(`Resolved by regional files: ${resolvedByRegions.size}`);

  // 2. Graf weights
  const grafWeightsFile = path.join(rawDir, 'graf_10k_weights.json');
  const resolvedByGraf = new Set<string>();
  if (fs.existsSync(grafWeightsFile)) {
    const graf = JSON.parse(fs.readFileSync(grafWeightsFile, 'utf8'));
    for (const rsid of emptyShells) {
      const rsClean = rsid.split('_')[0].split('-')[0];
      if (graf[rsid] || graf[rsClean]) {
        if (!resolvedByRegions.has(rsid)) {
          resolvedByGraf.add(rsid);
        }
      }
    }
  }
  console.log(`Resolved by GRAF 10K (non-overlapping): ${resolvedByGraf.size}`);

  const totalLocallyResolved = resolvedByRegions.size + resolvedByGraf.size;
  console.log(`Total locally resolvable empty shells: ${totalLocallyResolved}`);
  console.log(`Remaining residual empty shells: ${emptyShells.size - totalLocallyResolved}`);
}

run();
