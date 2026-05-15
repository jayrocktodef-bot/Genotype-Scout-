import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

console.log('Start (first 200 chars):');
console.log(content.slice(0, 200));
console.log('---');
console.log('End (last 500 chars):');
console.log(content.slice(-500));
