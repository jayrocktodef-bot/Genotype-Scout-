import fs from 'fs';
import path from 'path';

const REGION_MAP: Record<string, string> = {
  'Nilotic-Omotic': 'African',
  'Ancestral-South-Indian': 'South Asian',
  'North-European-Baltic': 'European',
  'Uralic': 'Central Asian',
  'Australo-Melanesian': 'Oceanian',
  'East-Siberean': 'East Asian',
  'Ancestral-Yayoi': 'East Asian',
  'Caucasian-Near-Eastern': 'Middle Eastern',
  'Tibeto-Burman': 'East Asian',
  'Austronesian': 'Oceanian',
  'Central-African-Pygmean': 'African',
  'Central-African-Hunter-Catherers': 'African',
  'Nilo-Sahrian': 'African',
  'North-African': 'Middle Eastern',
  'Gedrosia-Caucasian': 'Middle Eastern',
  'Cushitic': 'African',
  'Congo-Pygmean': 'African',
  'Bushmen': 'African',
  'South-Meso-Amerindian': 'Native American',
  'South-West-European': 'European',
  'North-Amerindian': 'Native American',
  'Arabic': 'Middle Eastern',
  'North-Circumpolar': 'Central Asian',
  'Kalash': 'Central Asian',
  'Papuan-Australian': 'Oceanian',
  'Papuan-Australo-Melanesian': 'Oceanian',
  'Baltic-Finnic': 'European',
  'Bantu': 'African'
};

const DATA_DIR = path.join(process.cwd(), 'src', 'data', 'temp_models');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'ancestry', 'ho_modern_reference_kernel.json');

async function parseMatrix() {
  console.log("🧩 Starting Admixture Matrix Parser (MDLP K27 Integration)...");
  
  const popsFile = path.join(DATA_DIR, 'populations.txt');
  const snpsFile = path.join(DATA_DIR, 'snps.txt');
  const freqFile = path.join(DATA_DIR, 'frequencies.txt');

  if (!fs.existsSync(popsFile) || !fs.existsSync(snpsFile) || !fs.existsSync(freqFile)) {
    console.error("❌ Missing input files in src/data/temp_models/");
    return;
  }

  const pops = fs.readFileSync(popsFile, 'utf8').split('\n').map(p => p.trim()).filter(p => p.length > 0);
  const snps = fs.readFileSync(snpsFile, 'utf8').split('\n').map(s => s.trim().split(/\s+/)[0]).filter(s => s.length > 0);
  const freqs = fs.readFileSync(freqFile, 'utf8').split('\n').filter(l => l.trim().length > 0);

  console.log(`📊 Populations: ${pops.length}`);
  console.log(`📊 SNPs: ${snps.length}`);
  console.log(`📊 Frequencies entries: ${freqs.length}`);

  const kernel: any = {};

  // Initialize kernel with populations
  pops.forEach(pop => {
    kernel[pop] = {
      region: REGION_MAP[pop] || 'Global',
      frequencies: {}
    };
  });

  const iterations = Math.min(snps.length, freqs.length);
  for (let i = 0; i < iterations; i++) {
    const rsid = snps[i].toLowerCase();
    const values = freqs[i].trim().split(/\s+/).map(Number);

    for (let j = 0; j < pops.length; j++) {
      if (!isNaN(values[j])) {
        kernel[pops[j]].frequencies[rsid] = values[j];
      }
    }

    if (i % 5000 === 0) process.stdout.write('.');
  }

  console.log("\n💾 Saving kernel...");
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(kernel, null, 2));
  
  console.log(`✅ Success! Kernel successfully written to: ${OUTPUT_FILE}`);
}

parseMatrix().catch(error => {
  console.error("❌ Parser error:", error);
  process.exit(1);
});
