import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

console.log('Last 500 chars:');
console.log(content.slice(-500));
