import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('./src/data');

function scanDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        JSON.parse(content);
        console.log(`✅ ${path.relative(DATA_DIR, fullPath)} is VALID (${stat.size} bytes)`);
      } catch (err: any) {
        console.error(`❌ ${path.relative(DATA_DIR, fullPath)} is INVALID! Error: ${err.message}`);
        // Let's print around the invalid index
        const posMatch = err.message.match(/position (\d+)/);
        if (posMatch) {
          const pos = parseInt(posMatch[1], 10);
          console.error(`Error around position ${pos}`);
        }
      }
    }
  }
}

console.log('🔍 Validating all JSON files in src/data...');
scanDir(DATA_DIR);
