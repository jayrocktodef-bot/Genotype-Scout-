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

  // 1. Regional Files & GRAF 10K
  const rawDir = path.join(process.cwd(), 'src', 'data', 'raw_aims');
  const regionalFiles = [
    'africa.json', 'americas.json', 'europe.json', 'central-asia.json',
    'east-asia.json', 'global.json', 'middle-east.json', 'oceania.json', 'south-asia.json'
  ];
  const resolvedLocally = new Set<string>();

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
          resolvedLocally.add(rsLower);
        } else if (emptyShells.has(rsClean) && entry.frequencies && Object.keys(entry.frequencies).length > 0) {
          resolvedLocally.add(rsClean);
        }
      }
    }
  }

  const grafWeightsFile = path.join(rawDir, 'graf_10k_weights.json');
  if (fs.existsSync(grafWeightsFile)) {
    const graf = JSON.parse(fs.readFileSync(grafWeightsFile, 'utf8'));
    for (const rsid of emptyShells) {
      const rsClean = rsid.split('_')[0].split('-')[0];
      if (graf[rsid] || graf[rsClean]) {
        resolvedLocally.add(rsid);
      }
    }
  }

  const remaining = [];
  for (const rsid of emptyShells) {
    if (!resolvedLocally.has(rsid)) {
      remaining.push(rsid);
    }
  }
  console.log(`Remaining after first phase: ${remaining.length}`);
  const remainingSet = new Set(remaining);

  // Search microhap_db.json
  const microhapPath = path.join(rawDir, 'microhap_db.json');
  if (fs.existsSync(microhapPath)) {
    try {
      const microhap = JSON.parse(fs.readFileSync(microhapPath, 'utf8'));
      let mCount = 0;
      const keys = Object.keys(microhap);
      for (const k of keys) {
        if (remainingSet.has(k.toLowerCase())) mCount++;
      }
      console.log(`microhap_db.json matches: ${mCount}`);
    } catch (e: any) {
      console.log('Error reading microhap_db:', e.message);
    }
  }

  // Search commercial_aim_weights.json
  const commPath = path.join(rawDir, 'commercial_aim_weights.json');
  if (fs.existsSync(commPath)) {
    try {
      const comm = JSON.parse(fs.readFileSync(commPath, 'utf8'));
      let cCount = 0;
      const entries = Array.isArray(comm) ? comm : Object.entries(comm).map(([k, v]) => ({ ...(v as object), rsid: k }));
      for (const entry of entries) {
        if (entry && entry.rsid && remainingSet.has(entry.rsid.toLowerCase())) {
          cCount++;
        }
      }
      console.log(`commercial_aim_weights.json matches: ${cCount}`);
    } catch (e: any) {
      console.log('Error reading commercial_aim_weights:', e.message);
    }
  }

  // Search ho_modern_reference_kernel.json
  const hoPath = path.join(rawDir, 'ho_modern_reference_kernel.json');
  if (fs.existsSync(hoPath)) {
    try {
      const ho = JSON.parse(fs.readFileSync(hoPath, 'utf8'));
      let hoCount = 0;
      const keys = Object.keys(ho);
      for (const k of keys) {
        if (remainingSet.has(k.toLowerCase())) hoCount++;
      }
      console.log(`ho_modern_reference_kernel.json matches: ${hoCount}`);
    } catch (e: any) {
      console.log('Error reading ho_modern_reference_kernel:', e.message);
    }
  }
}

run();
