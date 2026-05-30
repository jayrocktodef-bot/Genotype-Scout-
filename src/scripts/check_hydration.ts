import fs from 'fs';
import path from 'path';

const globalPath = path.join(process.cwd(), 'src', 'data', 'aims', 'global.json');
const globalData = JSON.parse(fs.readFileSync(globalPath, 'utf8'));

const markerData = fs.readFileSync('markers.txt', 'utf8');
const allMarkers = markerData.split(',').map(m => m.trim()).filter(m => m.length > 0);

const hydratedKeys = Object.keys(globalData);
const missing = allMarkers.filter(m => !hydratedKeys.includes(m));

const placeholder = allMarkers.filter(m => {
  const data = globalData[m];
  return data && (data.region === "GLOBAL" || data.weight === 1);
});

console.log('Markers completely missing:', missing);
console.log('Markers with placeholder data:', placeholder);
