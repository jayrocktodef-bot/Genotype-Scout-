
import fs from 'fs';
import currentAims from './src/aims.cleaned.json';
import newAims from './src/data/new_aims.json';

const updatedAims = [...currentAims, ...newAims];
fs.writeFileSync('./src/aims.cleaned.json', JSON.stringify(updatedAims, null, 2));

console.log(`Successfully added ${newAims.length} new AIMs. New total: ${updatedAims.length}`);
