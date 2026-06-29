import fs from 'fs';
import path from 'path';

const GRAF_WEIGHTS_FILE = path.join(process.cwd(), 'public', 'data', 'graf_10k_weights.json');
const HO_KERNEL_FILE = path.join(process.cwd(), 'public', 'data', 'ho_modern_reference_kernel.json');

const REGION_MAP: Record<string, string> = {
  'GBR': 'Europe', 'CEU': 'Europe', 'FIN': 'Europe', 'TSI': 'Europe', 'IBS': 'Europe',
  'YRI': 'Africa', 'LWK': 'Africa', 'ESN': 'Africa', 'MSL': 'Africa', 'GWD': 'Africa', 'ASW': 'Africa', 'ACB': 'Africa',
  'CHB': 'East Asia', 'JPT': 'East Asia', 'CHS': 'East Asia', 'CDX': 'East Asia', 'KHV': 'East Asia',
  'GIH': 'South Asia', 'PJL': 'South Asia', 'BEB': 'South Asia', 'STU': 'South Asia', 'ITU': 'South Asia',
  'MXL': 'Americas', 'PUR': 'Americas', 'CLM': 'Americas', 'PEL': 'Americas'
};

const SYNTHETIC_US_POPS: Record<string, Record<string, number>> = {
  'IRISH_AM': { 'GBR': 0.6, 'CEU': 0.4 },
  'ITALIAN_AM': { 'TSI': 0.8, 'IBS': 0.2 },
  'GERMAN_AM': { 'CEU': 0.7, 'FIN': 0.1, 'GBR': 0.2 },
  'CUBAN_AM': { 'IBS': 0.65, 'YRI': 0.25, 'PEL': 0.10 },
  'DOMINICAN_AM': { 'YRI': 0.45, 'IBS': 0.45, 'PEL': 0.10 },
  'FILIPINO_AM': { 'CDX': 0.6, 'CHB': 0.2, 'PEL': 0.1, 'IBS': 0.1 },
  'VIETNAMESE_AM': { 'KHV': 0.8, 'CHS': 0.2 }
};

function rebuild() {
  const grafWeights = JSON.parse(fs.readFileSync(GRAF_WEIGHTS_FILE, 'utf-8'));
  const hoKernel = JSON.parse(fs.readFileSync(HO_KERNEL_FILE, 'utf-8'));

  // 1. Ensure all GRAF weights are fully populated in ho_kernel (fixing the 131 bug)
  for (const rsid in grafWeights) {
    const freqs = grafWeights[rsid];
    for (const popCode in freqs) {
      if (!hoKernel[popCode]) {
        hoKernel[popCode] = { region: REGION_MAP[popCode] || 'Global', frequencies: {} };
      }
      hoKernel[popCode].frequencies[rsid.toLowerCase()] = parseFloat(freqs[popCode].toFixed(4));
    }
  }

  // 2. Build Synthetic US Populations
  for (const [newPop, blend] of Object.entries(SYNTHETIC_US_POPS)) {
    hoKernel[newPop] = { region: 'US Demographics', frequencies: {} };
    for (const rsid in grafWeights) {
      const freqs = grafWeights[rsid];
      let blendedFreq = 0;
      let validWeights = 0;
      for (const [refPop, weight] of Object.entries(blend)) {
        if (freqs[refPop] !== undefined) {
          blendedFreq += freqs[refPop] * weight;
          validWeights += weight;
        }
      }
      if (validWeights > 0) {
        hoKernel[newPop].frequencies[rsid.toLowerCase()] = parseFloat((blendedFreq / validWeights).toFixed(4));
      }
    }
  }

  fs.writeFileSync(HO_KERNEL_FILE, JSON.stringify(hoKernel, null, 2));
  console.log(`✅ Rebuilt Kernel with full 10k markers and new US Demographics!`);
}
rebuild();
