import fs from 'fs';
import path from 'path';

const searchRoot = '/app';
console.log(`Starting search for backups in ${searchRoot}...`);

function search(dir: string) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          // Skip node_modules and .git
          if (file !== 'node_modules' && file !== '.git') {
            search(fullPath);
          }
        } else if (file.includes('master_aims_normalized')) {
          console.log(`Found: ${fullPath} (${stat.size} bytes)`);
        }
      } catch (err) {}
    }
  } catch (err) {}
}

search(searchRoot);
console.log('Search complete.');
