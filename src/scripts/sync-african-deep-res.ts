import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Target rsIDs for St. Helena, Takarkori, and Sickle Cell Haplotypes
const AFRICAN_DEEP_MARKERS = [
  "rs334", "rs2814778", // Sickle Cell & Duffy Null
  "rs12913832", "rs1426654", // General High-Res AIMs
  "rs11568828", "rs13097409", // Specific Takarkori / Saharan Ghost variants
  "rs11542042", "rs11542041", // Supporting markers for haplotype matching
  "rs73885319", // APOL1
];

const TARGET_POPS = ["GWD", "MSL", "ESN", "YRI", "LWK"]; // 1kGP African populations

export async function syncAfricanDeepRes() {
  console.log("🧬 Syncing Deep African Resolution Weights (St. Helena, Takarkori, Sickle Cell)...");
  const weights: Record<string, any> = {};

  for (const rsid of AFRICAN_DEEP_MARKERS) {
    try {
      console.log(`📡 Fetching ${rsid}...`);
      const response = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json;pop_genetics=1`);
      const populations = response.data.populations || [];

      weights[rsid] = {
        rsid: rsid,
        populations: populations.filter((p: any) => 
          TARGET_POPS.some(target => p.population.includes(target))
        )
      };

      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.warn(`⚠️ Failed to fetch frequencies for ${rsid}`);
    }
  }

  const dataDir = path.join(process.cwd(), 'src', 'data', 'raw_aims');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(path.join(dataDir, 'african_deep_res_weights.json'), JSON.stringify(weights, null, 2));
  console.log("✅ Success: src/data/raw_aims/african_deep_res_weights.json generated.");
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncAfricanDeepRes();
}
