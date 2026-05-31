import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'src/data/aims/global.json');
const rawData = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(rawData);

const updates = {
  eyecolor: {
    gene: "OCA2/HERC2",
    trait: "Phenotypic",
    description: "Marker panel for eye color prediction."
  },
  haircolor: {
    gene: "MC1R",
    trait: "Phenotypic",
    description: "Marker panel for hair color prediction."
  },
  skintone: {
    gene: "SLC24A5",
    trait: "Phenotypic",
    description: "Marker panel for skin tone prediction."
  }
};

for (const [key, update] of Object.entries(updates)) {
  if (data[key]) {
    data[key] = { ...data[key], ...update };
    console.log(`Hydrated ${key}`);
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Hydration complete.');
