import fs from 'fs';
const path = 'src/data/haplogroups/parsed_haplogroups.json';
const content = fs.readFileSync(path, 'utf8');

try {
  JSON.parse(content);
  console.log('JSON is valid!');
} catch (e: any) {
  console.error('JSON is still invalid:', e.message);
  console.log('Error at position:', e.at);
  // Log around error
  if (e.message.includes('position')) {
    const pos = parseInt(e.message.match(/position (\d+)/)[1]);
    console.log('Snippet around error:', JSON.stringify(content.slice(pos - 50, pos + 50)));
  }
}
