
import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('./src/data/master_aims_normalized.json');
if (!fs.existsSync(dataPath)) {
    console.error('File not found');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const outDir = path.resolve('./src/data/aims');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const regions: Record<string, any> = {};

for (const rsid in data) {
    const region = (data[rsid].region || 'UNKNOWN').replace(/\s+/g, '_').toLowerCase();
    if (!regions[region]) {
        regions[region] = {};
    }
    regions[region][rsid] = data[rsid];
}

for (const region in regions) {
    fs.writeFileSync(path.join(outDir, `${region}.json`), JSON.stringify(regions[region], null, 2));
}

console.log('Successfully split aims into:', Object.keys(regions).map(r => `${r}.json`).join(', '));
