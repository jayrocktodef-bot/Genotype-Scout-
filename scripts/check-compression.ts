import fs from 'fs';
import path from 'path';

const files = [
  { name: 'parsed_haplogroups.json', path: './src/data/haplogroups/parsed_haplogroups.json' },
  { name: 'mt_haplogroups.json', path: './src/data/mitochondrial/mt_haplogroups.json' },
  { name: 'master_aims_normalized.json', path: './src/data/master_aims_normalized.json' },
  { name: 'master_ydna.json', path: './src/data/master_ydna.json' }
];

for (const file of files) {
  if (fs.existsSync(file.path)) {
    const raw = fs.readFileSync(file.path, 'utf-8');
    const size = raw.length;
    
    // Test parsing and minifying
    try {
      // If the file is currently truncated, parsing JSON will fail. Let's try to restore first or check raw minify.
      let minSize = -1;
      try {
        const parsed = JSON.parse(raw);
        const minified = JSON.stringify(parsed);
        minSize = minified.length;
      } catch (err: any) {
        // If truncated, let's estimate or see if we can do a simple whitespace strip for diagnostic purposes
        const stripped = raw.replace(/\s+/g, '');
        minSize = stripped.length;
      }
      
      console.log(`File: ${file.name}`);
      console.log(` - Current/Truncated size: ${size} bytes`);
      console.log(` - Estimated Minified size: ${minSize} bytes`);
      console.log(` - Space saved: ${((1 - minSize / (size || 1)) * 100).toFixed(1)}%`);
    } catch (e: any) {
      console.error(`Error processing ${file.name}: ${e.message}`);
    }
  } else {
    console.log(`File NOT found: ${file.path}`);
  }
}
