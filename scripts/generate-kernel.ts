
import fs from 'fs';
import path from 'path';

// This script generates a robust population reference kernel based on 1000 Genomes Project Phase 3 frequencies
// for a set of high-impact AIMs (Ancestry Informative Markers).

const SOURCE_FILE = path.join(process.cwd(), 'src', 'data', 'ancestry', 'graf_10k_weights.json');
const TARGET_FILE = path.join(process.cwd(), 'src', 'data', 'ancestry', 'ho_modern_reference_kernel.json');

const REGION_MAP: Record<string, string> = {
  'GBR': 'European', 'CEU': 'European', 'FIN': 'European', 'TSI': 'European', 'IBS': 'European',
  'YRI': 'African', 'LWK': 'African', 'ESN': 'African', 'MSL': 'African', 'GWD': 'African', 'ASW': 'African', 'ACB': 'African',
  'CHB': 'East Asian', 'JPT': 'East Asian', 'CHS': 'East Asian', 'CDX': 'East Asian', 'KHV': 'East Asian',
  'GIH': 'South Asian', 'PJL': 'South Asian', 'BEB': 'South Asian', 'STU': 'South Asian', 'ITU': 'South Asian',
  'MXL': 'American', 'PUR': 'American', 'CLM': 'American', 'PEL': 'American'
};

function generateKernel() {
  console.log("🛠️ Generating Modern Reference Kernel from GRAF 10k...");
  
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error("Source file missing!");
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf-8'));
  const kernel: Record<string, any> = {};

  // Data structure: rsID -> popCode -> frequency
  // Need: popCode -> rsID -> frequency
  
  for (const rsid in rawData) {
    const snpPopFreqs = rawData[rsid];

    for (const popCode in snpPopFreqs) {
      if (!kernel[popCode]) {
        kernel[popCode] = {
          region: REGION_MAP[popCode] || 'Global',
          frequencies: {}
        };
      }

      kernel[popCode].frequencies[rsid.toLowerCase()] = parseFloat(snpPopFreqs[popCode].toFixed(4));
    }
  }

  fs.writeFileSync(TARGET_FILE, JSON.stringify(kernel, null, 2));
  console.log(`✅ Reference Kernel updated with ${Object.keys(kernel).length} populations.`);
}

generateKernel();
