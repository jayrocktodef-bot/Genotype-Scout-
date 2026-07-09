import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KERNEL_PATH = path.resolve(__dirname, '../public/data/ho_modern_reference_kernel.json');

function addLembaProxy() {
  console.log('🚀 Starting Lemba Proxy Admixture generation...');

  if (!fs.existsSync(KERNEL_PATH)) {
    console.warn(`⚠️ Kernel not found at: ${KERNEL_PATH}`);
    return;
  }

  console.log(`📂 Loading kernel from ${KERNEL_PATH}...`);
  const kernel = JSON.parse(fs.readFileSync(KERNEL_PATH, 'utf-8'));
  
  if (kernel['lemba_proxy']) {
    console.log(`ℹ️ 'lemba_proxy' entry already exists. Overwriting...`);
  }

  const jewKey = 'sgdp_jew_yemenite';
  const bantuKey = 'sgdp_bantuherero';

  if (!kernel[jewKey]) {
    console.error(`❌ Semitic proxy '${jewKey}' not found in kernel.`);
    return;
  }
  if (!kernel[bantuKey]) {
    console.error(`❌ Southern Bantu proxy '${bantuKey}' not found in kernel.`);
    return;
  }

  const jewFreqs = kernel[jewKey].frequencies || {};
  const bantuFreqs = kernel[bantuKey].frequencies || {};

  const allSnps = new Set([
    ...Object.keys(jewFreqs),
    ...Object.keys(bantuFreqs)
  ]);

  const lembaFreqs: Record<string, number> = {};

  allSnps.forEach(snp => {
    const fJew = jewFreqs[snp] !== undefined ? jewFreqs[snp] : null;
    const fBantu = bantuFreqs[snp] !== undefined ? bantuFreqs[snp] : null;

    if (fJew !== null && fBantu !== null) {
      // 25% Semitic/Jewish, 75% Southern Bantu Admixture
      lembaFreqs[snp] = Number((0.25 * fJew + 0.75 * fBantu).toFixed(4));
    } else if (fBantu !== null) {
      lembaFreqs[snp] = fBantu;
    } else if (fJew !== null) {
      lembaFreqs[snp] = fJew;
    }
  });

  kernel['lemba_proxy'] = {
    region: 'Africa',
    frequencies: lembaFreqs
  };

  console.log(`💾 Saving updated kernel with 'lemba_proxy' population (contains ${Object.keys(lembaFreqs).length} SNPs)...`);
  fs.writeFileSync(KERNEL_PATH, JSON.stringify(kernel, null, 2));
  console.log(`✅ Successfully updated ho_modern_reference_kernel.json.`);
}

addLembaProxy();
