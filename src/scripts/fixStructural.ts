import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

// The file ends at definedSNPs array:
// ... "definingSNPs": [
//       ...
//       "Z34947"
//     ]

// It needs:
// ,
//    "rsids": []
//  }
// ]

const fix = ',\n    "rsids": []\n  }\n]';
const fixedContent = content + fix;
fs.writeFileSync(path, fixedContent);
console.log('Fixed JSON by adding missing keys and closing braces');
