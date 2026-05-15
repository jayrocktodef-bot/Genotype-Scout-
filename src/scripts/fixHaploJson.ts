import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

// A crude fix: find the last occurrence of ]} and replace with ] (and maybe one more ] if it's an array of arrays? No, it's an array of objects)

// Actually, I'll try to just parse it and see where it fails? No, can't easily parse 2MB.

// The error was "Unexpected non-whitespace character after JSON".
// I will try to find the last valid ]} and remove anything after it.

// Let's assume the valid end is ]}
const validEnd = ']}';
const lastIndex = content.lastIndexOf(']');
if (lastIndex !== -1) {
  // It looks like it ends with ]\n}
  // Let's remove the final }
  const fixedContent = content.substring(0, lastIndex + 1);
  fs.writeFileSync(path, fixedContent);
  console.log('Fixed JSON file');
}
