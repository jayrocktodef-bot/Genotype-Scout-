import fs from 'fs';
import path from 'path';

function main() {
  const refDir = path.resolve('src/data/reference');
  if (fs.existsSync(refDir)) {
    const files = fs.readdirSync(refDir);
    console.log('Files in src/data/reference:', files);
    for (const f of files) {
      const filePath = path.join(refDir, f);
      const stat = fs.statSync(filePath);
      console.log(`- ${f}: size: ${stat.size} bytes`);
      if (f.endsWith('.json')) {
        try {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (Array.isArray(data)) {
            console.log(`  Array of length ${data.length}`);
            if (data.length > 0) {
              console.log(`  Sample item:`, data[0]);
            }
          } else {
            const keys = Object.keys(data);
            console.log(`  Object/Map with ${keys.length} keys`);
            if (keys.length > 0) {
              console.log(`  Sample item for key "${keys[0]}":`, data[keys[0]]);
            }
          }
        } catch(e) {
          console.error(`  Error reading ${f}:`, e);
        }
      }
    }
  }
}

main();
