
import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('./src/data/master_aims_normalized.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const regions = new Set<string>();
for (const rsid in data) {
    regions.add(data[rsid].region || 'UNKNOWN');
}

console.log(Array.from(regions));
