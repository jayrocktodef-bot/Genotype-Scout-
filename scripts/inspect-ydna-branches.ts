
import fs from 'fs';
import path from 'path';

const masterYdnaPath = path.resolve('./src/data/master_ydna.json');
const data = JSON.parse(fs.readFileSync(masterYdnaPath, 'utf-8'));

// Sample 5 branches after the header
console.log('Sample branches:', JSON.stringify(data.isoggTree.slice(1, 6), null, 2));
