import fs from 'fs';
import path from 'path';

const TEST_FILE = path.resolve('./src/data/test_limit.json');

try {
  // Generate a large string of 3,000,000 'a' characters in a JSON shape
  const obj = {
    data: 'a'.repeat(3000000)
  };
  const jsonStr = JSON.stringify(obj, null, 2);
  console.log(`Writing test JSON of size: ${jsonStr.length} bytes`);
  fs.writeFileSync(TEST_FILE, jsonStr, 'utf-8');
  
  const stat = fs.statSync(TEST_FILE);
  console.log(`Saved file size: ${stat.size} bytes`);
  
  const readContent = fs.readFileSync(TEST_FILE, 'utf-8');
  console.log(`Read back length: ${readContent.length} bytes`);
  
  // Cleanup
  fs.unlinkSync(TEST_FILE);
} catch (err: any) {
  console.error(`Error during limit test: ${err.message}`);
}
