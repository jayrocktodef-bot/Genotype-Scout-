import fs from 'fs';
import path from 'path';

function run() {
  const file1 = path.join(process.cwd(), 'src', 'data', 'raw_aims', 'graf_10k_index.json');
  const file2 = path.join(process.cwd(), 'src', 'data', 'raw_aims', 'graf_10k_weights.json');

  if (fs.existsSync(file1)) {
    const data1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
    console.log('--- graf_10k_index.json ---');
    if (Array.isArray(data1)) {
      console.log(`Array with ${data1.length} items. Sample:`, data1.slice(0, 3));
    } else {
      const keys = Object.keys(data1);
      console.log(`Map with ${keys.length} keys. Sample keys:`, keys.slice(0, 10));
      console.log(`Sample value:`, data1[keys[0]]);
    }
  }

  if (fs.existsSync(file2)) {
    const data2 = JSON.parse(fs.readFileSync(file2, 'utf8'));
    console.log('--- graf_10k_weights.json ---');
    if (Array.isArray(data2)) {
      console.log(`Array with ${data2.length} items. Sample:`, data2.slice(0, 3));
    } else {
      const keys = Object.keys(data2);
      console.log(`Map with ${keys.length} keys. Sample keys:`, keys.slice(0, 10));
      console.log(`Sample value:`, data2[keys[0]]);
    }
  }
}

run();
