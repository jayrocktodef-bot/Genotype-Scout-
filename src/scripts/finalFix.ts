import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

// The file ends with ],
// We need to complete the object and close the array.

const fix = '\n    "rsids": []\n  }\n]';
const fixedContent = content + fix;
fs.writeFileSync(path, fixedContent);
console.log('Fixed JSON by adding missing keys and closing braces');
