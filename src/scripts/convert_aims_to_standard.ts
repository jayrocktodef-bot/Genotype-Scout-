import fs from 'fs';
import path from 'path';

// Load raw files
const masterAimsPath = path.resolve('./src/data/master_aims_normalized.json');
const grafIndexPath = path.resolve('./src/data/raw_aims/graf_10k_index.json');

console.log('Loading datasets...');
const masterAims = JSON.parse(fs.readFileSync(masterAimsPath, 'utf8'));
const grafIndex = JSON.parse(fs.readFileSync(grafIndexPath, 'utf8'));

console.log(`Original entries in master aims: ${Object.keys(masterAims).length}`);

// Group entries by clean base rsID
const groups: Record<string, any[]> = {};

Object.entries(masterAims).forEach(([key, value]: [string, any]) => {
  // Extract clean base rsid (e.g., 'rs10456291' from 'rs10456291_afr')
  let cleanId = key.trim().toLowerCase();
  const suffixIdx = cleanId.indexOf('_');
  if (suffixIdx > 0) {
    cleanId = cleanId.substring(0, suffixIdx);
  }
  
  if (!groups[cleanId]) {
    groups[cleanId] = [];
  }
  groups[cleanId].push({ originalKey: key, data: value });
});

console.log(`Unique base rsIDs: ${Object.keys(groups).length}`);

// Process and select/merge entries for each base rsID
const convertedAims: Record<string, any> = {};

Object.entries(groups).forEach(([baseRsid, entries]) => {
  // Rank and select the best candidate entry if multiple exist
  let bestEntry = entries[0];
  
  if (entries.length > 1) {
    // Sort entries:
    // 1. Prefer higher weight
    // 2. Prefer non-empty frequencies
    // 3. Prefer non-empty alleles
    // 4. Prefer having chromosome defined
    entries.sort((a, b) => {
      const wA = a.data.weight || 0;
      const wB = b.data.weight || 0;
      if (wA !== wB) return wB - wA; // descending weight

      const freqCountA = Object.keys(a.data.frequencies || {}).length;
      const freqCountB = Object.keys(b.data.frequencies || {}).length;
      if (freqCountA !== freqCountB) return freqCountB - freqCountA;

      const alleleCountA = (a.data.alleles || []).length;
      const alleleCountB = (b.data.alleles || []).length;
      if (alleleCountA !== alleleCountB) return alleleCountB - alleleCountA;

      const descLenA = (a.data.description || "").length;
      const descLenB = (b.data.description || "").length;
      return descLenB - descLenA;
    });
    bestEntry = entries[0];
  }

  // Clone selected data and standardize identifiers
  const cleanData = { ...bestEntry.data };
  cleanData.rsid = baseRsid; // Set clean standard rsID

  // Inline coordinate injection from GRAF-10k index if available
  const coords = grafIndex[baseRsid];
  if (coords) {
    cleanData.chromosome = coords.chr || coords.chrom;
    if (coords.pos) {
      cleanData.position = parseInt(coords.pos, 10);
    }
    cleanData.ref = coords.ref;
    cleanData.alt = coords.alt;
  }

  convertedAims[baseRsid] = cleanData;
});

console.log(`Finished converting database: ${Object.keys(convertedAims).length} unified records.`);

// Overwrite the original normalized aims database file
fs.writeFileSync(masterAimsPath, JSON.stringify(convertedAims, null, 2), 'utf8');
console.log('Successfully wrote standardized master_aims_normalized.json!');
