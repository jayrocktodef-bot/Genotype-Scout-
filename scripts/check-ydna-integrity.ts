
import fs from 'fs';
import path from 'path';

const masterYdnaPath = path.resolve('./src/data/master_ydna.json');
const data = JSON.parse(fs.readFileSync(masterYdnaPath, 'utf-8'));

const badBranches = data.isoggTree.filter((b: any) => !Array.isArray(b.rsids) || !Array.isArray(b.definingSNPs));
console.log('Bad branches:', badBranches.length);
if (badBranches.length > 0) {
    console.log('First bad branch:', JSON.stringify(badBranches[0]));
}
