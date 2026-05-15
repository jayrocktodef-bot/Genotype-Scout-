import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

// I need to see the last 200 characters to be sure.
console.log(content.slice(-200));
