import fs from 'fs';
const lines = fs.readFileSync('src/data/haplogroups/parsed_haplogroups.json', 'utf8').split('\n');
console.log(lines.slice(-20).join('\n'));
