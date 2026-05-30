import fs from 'fs';
import path from 'path';

function run() {
  const dir = path.join(process.cwd(), 'src', 'data', 'raw_aims');
  if (!fs.existsSync(dir)) {
    console.log('No raw_aims directory');
    return;
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const filePath = path.join(dir, f);
    const stat = fs.statSync(filePath);
    console.log(`- ${f}: ${(stat.size / 1024).toFixed(1)} KB`);
    if (f === 'ensembl_154_cache.json' || f === 'global.json' || f === 'deep_resolution_aims.json' || f === 'cosmopolitan_aims.json') {
      try {
        const text = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          console.log(`  Array with ${data.length} items. First item:`, JSON.stringify(data[0], null, 2).slice(0, 300));
        } else {
          const keys = Object.keys(data);
          console.log(`  Map with ${keys.length} keys. First key: "${keys[0]}". Value:`, JSON.stringify(data[keys[0]], null, 2).slice(0, 300));
        }
      } catch (err: any) {
        console.log('  Error reading/parsing:', err.message);
      }
    }
  }
}

run();
