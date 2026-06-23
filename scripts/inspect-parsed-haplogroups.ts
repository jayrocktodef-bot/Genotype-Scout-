
import fs from 'fs';
import path from 'path';

const file = path.resolve('./src/data/haplogroups/parsed_haplogroups.json');
const raw = fs.readFileSync(file, 'utf-8');

console.log(raw.substring(0, 500));
