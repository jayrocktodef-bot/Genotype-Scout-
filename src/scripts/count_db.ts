import fs from 'fs';
import path from 'path';

function run() {
  const MASTER_FILE = path.join(process.cwd(), 'src', 'data', 'master_aims_normalized.json');
  if (!fs.existsSync(MASTER_FILE)) {
    console.log('Error: Master file not found');
    return;
  }
  const master = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
  const entries = Object.entries(master);
  let total = entries.length;
  let emptyCount = 0;
  let skipsCount = 0;
  let populatedCount = 0;

  const emptySample: string[] = [];
  const skipSample: string[] = [];
  const popSample: string[] = [];

  for (const [rsid, item] of entries) {
    const it = item as any;
    if (it.SKIP) {
      skipsCount++;
      if (skipSample.length < 5) skipSample.push(rsid);
    } else if (it.region === 'GLOBAL' && Object.keys(it.frequencies || {}).length === 0 && it.weight === 1) {
      emptyCount++;
      if (emptySample.length < 5) emptySample.push(rsid);
    } else {
      populatedCount++;
      if (popSample.length < 5) popSample.push(rsid);
    }
  }

  console.log(`TOTAL ENTRIES: ${total}`);
  console.log(`POPULATED: ${populatedCount}`);
  console.log(`EMPTY SHELLS: ${emptyCount}`);
  console.log(`SKIPPED: ${skipsCount}`);
  console.log('--- Samples ---');
  console.log('Populated:', popSample);
  console.log('Empty:', emptySample);
  console.log('Skipped:', skipSample);
}

run();
