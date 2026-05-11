import axios from 'axios';
import fs from 'fs';
import path from 'path';

const ANCIENT_AFRICAN_MARKERS = [
  "rs1426654", // SLC24A5
  "rs16891982", // SLC45A2
  "rs12913832", // HERC2
  "rs2814778",  // Duffy
  "rs16139",    // African diagnostic
  "rs1065852",
  "rs1042531",
  "rs1042602"
];

const REF_POPS = ["LWK", "YRI", "MSL", "ESN", "GWD"]; // 1kGP African populations

export async function syncAncientAfricanWeights() {
  console.log("🌍 Syncing Ancient African Diagnostic Weights...");
  const weights: Record<string, any> = {};

  for (const rsid of ANCIENT_AFRICAN_MARKERS) {
    try {
      const response = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json;pop_genetics=1`);
      const populations = response.data.populations || [];

      weights[rsid] = {
        rsid,
        ref_frequencies: {}
      };

      for (const pop of populations) {
        const popName = pop.population || "";
        // Match 1kGP African populations
        if (REF_POPS.some(ref => popName.includes(ref))) {
            weights[rsid].ref_frequencies[popName] = pop.allele_freqs;
        }
      }
      
      await new Promise(r => setTimeout(r, 200));
    } catch (error) {
      console.warn(`⚠️ Failed to fetch frequencies for ${rsid}:`, error instanceof Error ? error.message : String(error));
    }
  }

  const dataDir = path.join(process.cwd(), 'src', 'data', 'ancient_historical');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(path.join(dataDir, 'ancient_african_weights.json'), JSON.stringify(weights, null, 2));
  console.log("✅ Success: src/data/ancient_historical/ancient_african_weights.json generated.");
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncAncientAfricanWeights();
}
