import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

const lastChars = content.slice(-20);
console.log('Last 20 chars (as ASCII codes):', Array.from(lastChars).map(c => c.charCodeAt(0)));
console.log('Last 20 chars (as string):', JSON.stringify(lastChars));
