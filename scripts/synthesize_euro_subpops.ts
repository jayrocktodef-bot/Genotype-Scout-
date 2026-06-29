import fs from 'fs';
import path from 'path';

// Define the source and target files
const GRAF_WEIGHTS_FILE = path.join(process.cwd(), 'public', 'data', 'graf_10k_weights.json');
const HO_KERNEL_FILE = path.join(process.cwd(), 'public', 'data', 'ho_modern_reference_kernel.json');

// Define new synthetic populations and their admixture blends based on existing 1000G codes
const SYNTHETIC_POPS: Record<string, Record<string, number>> = {
  'BALKAN': { 'TSI': 0.6, 'CEU': 0.4 },
  'BALTIC': { 'FIN': 0.5, 'CEU': 0.5 },
  'SLAVIC': { 'FIN': 0.4, 'CEU': 0.4, 'TSI': 0.2 },
  'SCANDINAVIAN': { 'CEU': 0.6, 'FIN': 0.3, 'GBR': 0.1 },
  'BASQUE': { 'IBS': 0.8, 'CEU': 0.2 },
  'GERMAN': { 'CEU': 0.70, 'GBR': 0.15, 'TSI': 0.15 },
  'SWEDISH': { 'CEU': 0.65, 'FIN': 0.25, 'GBR': 0.10 },
  'DUTCH': { 'CEU': 0.75, 'GBR': 0.20, 'TSI': 0.05 },
  'IRISH': { 'GBR': 0.85, 'CEU': 0.15 },
  'FRENCH': { 'CEU': 0.60, 'IBS': 0.25, 'TSI': 0.15 },
  'SPANISH': { 'IBS': 0.90, 'TSI': 0.10 },
  'POLISH': { 'CEU': 0.50, 'FIN': 0.40, 'TSI': 0.10 },
  'GREEK': { 'TSI': 0.80, 'IBS': 0.20 }
};

function run() {
  console.log("🛠️ Generating Synthetic European Sub-Populations...");

  if (!fs.existsSync(GRAF_WEIGHTS_FILE) || !fs.existsSync(HO_KERNEL_FILE)) {
    console.error("❌ Required reference files not found.");
    return;
  }

  const grafWeights = JSON.parse(fs.readFileSync(GRAF_WEIGHTS_FILE, 'utf-8'));
  const hoKernel = JSON.parse(fs.readFileSync(HO_KERNEL_FILE, 'utf-8'));

  let updatedGrafCount = 0;

  // 1. Update graf_10k_weights.json
  for (const rsid in grafWeights) {
    const freqs = grafWeights[rsid];
    
    for (const [newPop, blend] of Object.entries(SYNTHETIC_POPS)) {
      let blendedFreq = 0;
      let validWeights = 0;

      for (const [refPop, weight] of Object.entries(blend)) {
        if (freqs[refPop] !== undefined) {
          blendedFreq += freqs[refPop] * weight;
          validWeights += weight;
        }
      }

      // If we got valid frequencies for the blending components, compute normalized
      if (validWeights > 0) {
        freqs[newPop] = parseFloat((blendedFreq / validWeights).toFixed(4));
      }
    }
    updatedGrafCount++;
  }

  // Write updated GRAF weights
  fs.writeFileSync(GRAF_WEIGHTS_FILE, JSON.stringify(grafWeights, null, 2));
  console.log(`✅ Updated GRAF weights for ${updatedGrafCount} markers with synthetic European sub-pops.`);

  // 2. Update ho_modern_reference_kernel.json
  // Structure: popCode -> region, frequencies: rsid(lowercase) -> freq
  for (const [newPop, blend] of Object.entries(SYNTHETIC_POPS)) {
    hoKernel[newPop] = {
      region: 'Europe',
      frequencies: {}
    };

    let populatedSnps = 0;
    
    // Iterate over all rsids in grafWeights to generate kernel frequencies
    for (const rsid in grafWeights) {
      if (grafWeights[rsid][newPop] !== undefined) {
        hoKernel[newPop].frequencies[rsid.toLowerCase()] = grafWeights[rsid][newPop];
        populatedSnps++;
      }
    }
    
    console.log(`  Added ${populatedSnps} SNPs for ${newPop} to modern reference kernel.`);
  }

  fs.writeFileSync(HO_KERNEL_FILE, JSON.stringify(hoKernel, null, 2));
  console.log(`✅ Reference Kernel updated with synthetic European populations.`);
}

run();
