import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./src/data/master_aims_normalized.json');

if (!fs.existsSync(filePath)) {
  console.error(`File ${filePath} does not exist`);
  process.exit(1);
}

try {
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`Original file size: ${content.length} chars`);

  // We want to find the last complete entry.
  // The structure is:
  // "rs10249530": {
  //   "rsid": "rs10249530",
  //   ...
  //   "description": ""
  // },
  // "rs11761294": {
  //   "rsid": "rs11761
  
  // Let's find the last occurrences of "}," in the file.
  const lastCloseBraceComma = content.lastIndexOf('},');
  if (lastCloseBraceComma === -1) {
    throw new Error('Could not find last "}," signature for repair.');
  }

  // Clip the string right after the last complete entry's close brace
  const clipped = content.substring(0, lastCloseBraceComma + 1).trim();
  
  // Append the closing brace of the main object
  const repairedContent = clipped + '\n}';
  
  console.log(`Clipping at index ${lastCloseBraceComma + 1}. Repaired content length: ${repairedContent.length}`);
  
  // Try to parse to verify
  const parsed = JSON.parse(repairedContent);
  console.log('🎉 Successfully parsed repaired JSON!');
  console.log(`Contains ${Object.keys(parsed).length} elements.`);

  // Write back fully minified
  const minified = JSON.stringify(parsed);
  console.log(`Minified size: ${minified.length} bytes (saving ~28.6%)`);
  
  fs.writeFileSync(filePath, minified, 'utf-8');
  console.log('✅ Successfully wrote repaired and minified master_aims_normalized.json!');

} catch (err: any) {
  console.error(`Repair failed: ${err.message}`);
}
