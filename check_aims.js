
import { ALL_REGION_AIMS } from './src/data/aims/index';
// This assumes this is run in an environment that can import the JSONs directly if I mock it or just analyze keys.
// To do this simply, I will just inspect the keys.
const cosmopolitanAims = require('./src/data/raw_aims/cosmopolitan_aims.json');
const currentRsidSet = new Set(Object.keys(ALL_REGION_AIMS));

const newAnchors = Object.keys(cosmopolitanAims).filter(rsid => !currentRsidSet.has(rsid));

console.log(`Current anchors: ${currentRsidSet.size}`);
console.log(`Cosmopolitan aiming to add: ${newAnchors.length}`);
console.log(`Sample of new: ${newAnchors.slice(0, 5)}`);
