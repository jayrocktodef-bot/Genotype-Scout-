
import fs from 'fs';
import path from 'path';

const masterYdnaPath = path.resolve('./src/data/master_ydna.json');
const data = JSON.parse(fs.readFileSync(masterYdnaPath, 'utf-8'));

console.log('Tree type:', typeof data.isoggTree);
console.log('Tree length:', data.isoggTree.length);
console.log('First 2 branches:', JSON.stringify(data.isoggTree.slice(0, 2), null, 2));
