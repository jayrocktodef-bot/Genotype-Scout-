import * as fs from 'fs';
import * as path from 'path';

function walk(dir: string) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (item === 'node_modules' || item === '.git' || item === 'dist') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      if (item.toLowerCase().includes('global')) {
        console.log(fullPath);
      }
    }
  }
}

walk(process.cwd());
