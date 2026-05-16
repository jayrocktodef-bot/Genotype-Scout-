import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

const last5 = content.slice(-5);
console.log('Last 5 chars:', JSON.stringify(last5));
console.log('Last 5 char codes:', Array.from(last5).map(c => c.charCodeAt(0)));
