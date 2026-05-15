import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

console.log('Last 100 chars (as string):', JSON.stringify(content.slice(-100)));
