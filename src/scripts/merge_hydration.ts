import fs from 'fs';
import path from 'path';

const hydrated = JSON.parse(fs.readFileSync('hydrated.json', 'utf8'));
const globalPath = path.join(process.cwd(), 'src', 'data', 'aims', 'global.json');
const globalData = JSON.parse(fs.readFileSync(globalPath, 'utf8'));

Object.assign(globalData, hydrated);

fs.writeFileSync(globalPath, JSON.stringify(globalData, null, 1));
console.log('Merged hydrated markers.');
