import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KERNEL_PATHS = [
  path.resolve(__dirname, '../public/data/ho_modern_reference_kernel.json'),
  path.resolve(__dirname, '../src/data/raw_aims/ho_modern_reference_kernel.json')
];

function addRomaniProxy() {
  console.log('🚀 Starting Romani Proxy Admixture generation...');

  KERNEL_PATHS.forEach(kernelPath => {
    if (!fs.existsSync(kernelPath)) {
      console.warn(`⚠️ Kernel not found at: ${kernelPath}`);
      return;
    }

    console.log(`📂 Loading kernel from ${kernelPath}...`);
    const kernel = JSON.parse(fs.readFileSync(kernelPath, 'utf-8'));
    
    // Check if romani_proxy already exists
    if (kernel['romani_proxy']) {
      console.log(`ℹ️ 'romani_proxy' entry already exists in ${path.basename(kernelPath)}. Overwriting...`);
    }

    // We will use sgdp_punjabi (South Asian / Indo-Aryan) and sgdp_french (European) as ancestral proxies
    const sasKey = 'sgdp_punjabi';
    const eurKey = 'sgdp_french';

    if (!kernel[sasKey]) {
      console.error(`❌ Ancestral South Asian proxy '${sasKey}' not found in kernel.`);
      return;
    }
    if (!kernel[eurKey]) {
      console.error(`❌ Ancestral European proxy '${eurKey}' not found in kernel.`);
      return;
    }

    const sasFreqs = kernel[sasKey].frequencies || {};
    const eurFreqs = kernel[eurKey].frequencies || {};

    const allSnps = new Set([
      ...Object.keys(sasFreqs),
      ...Object.keys(eurFreqs)
    ]);

    const romaniFreqs: Record<string, number> = {};

    allSnps.forEach(snp => {
      const fSas = sasFreqs[snp] !== undefined ? sasFreqs[snp] : null;
      const fEur = eurFreqs[snp] !== undefined ? eurFreqs[snp] : null;

      if (fSas !== null && fEur !== null) {
        // 35% South Asian, 65% European Admixture
        romaniFreqs[snp] = Number((0.35 * fSas + 0.65 * fEur).toFixed(4));
      } else if (fSas !== null) {
        romaniFreqs[snp] = fSas;
      } else if (fEur !== null) {
        romaniFreqs[snp] = fEur;
      }
    });

    kernel['romani_proxy'] = {
      region: 'Americas', // Map to Americas or Global/Europe? Let's use 'Europe' or 'Global'. The code changes will assign it to MACRO_GROUPS anyway.
      frequencies: romaniFreqs
    };

    console.log(`💾 Saving updated kernel with 'romani_proxy' population (contains ${Object.keys(romaniFreqs).length} SNPs)...`);
    fs.writeFileSync(kernelPath, JSON.stringify(kernel, null, 2));
    console.log(`✅ Successfully updated ${path.basename(kernelPath)}.`);
  });
}

addRomaniProxy();
