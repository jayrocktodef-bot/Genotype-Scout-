import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

// The last 100 chars show:
// "rsids": []
//   }
// ]
// }

// Let's print chars around the end
console.log('End of file:', JSON.stringify(content.slice(-50)));

// It seems to be:
// ... "rsids": []\n  }\n]\n}
// The last ] is at 1999567.
// The } at 1999568.

// The index 1999568 is a }, the last char. 
// If I remove the last character, I might fix it.

const fixedContent = content.slice(0, -1);
fs.writeFileSync(path, fixedContent);
console.log('Fixed JSON by removing the last character');
