import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

console.log('File length:', content.length);
console.log('Last 200 characters:', JSON.stringify(content.slice(-200)));
