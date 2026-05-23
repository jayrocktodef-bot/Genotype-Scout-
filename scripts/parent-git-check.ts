import fs from 'fs';
import path from 'path';

let current = process.cwd();
console.log(`Starting scan from: ${current}`);

while (true) {
  const gitPath = path.join(current, '.git');
  console.log(`Checking: ${gitPath}`);
  if (fs.existsSync(gitPath)) {
    console.log(`🎉 Found .git folder at: ${current}`);
    break;
  }
  const parent = path.dirname(current);
  if (parent === current) {
    console.log('❌ Reached filesystem root, no .git folder found.');
    break;
  }
  current = parent;
}
