import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

console.log('File length:', content.length);
console.log('Last 100 characters:', JSON.stringify(content.slice(-100)));

// Try to find if there is an unclosed brace
const lastOpeningBrace = content.lastIndexOf('{');
const lastClosingBrace = content.lastIndexOf('}');
const lastOpeningBracket = content.lastIndexOf('[');
const lastClosingBracket = content.lastIndexOf(']');

console.log('Last { index:', lastOpeningBrace);
console.log('Last } index:', lastClosingBrace);
console.log('Last [ index:', lastOpeningBracket);
console.log('Last ] index:', lastClosingBracket);
