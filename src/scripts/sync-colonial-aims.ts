import axios from 'axios';
import fs from 'fs';
import path from 'path';

const COLONIAL_MARKERS = [
  "rs1426654", // SLC24A5 (Pigmentation/Ancestry)
  "rs16891982", // SLC45A2 (Pigmentation/Ancestry)
  "rs12913832", // HERC2/OCA2 (Eye color/Ancestry)
  "rs2814778",  // Duffy Null (Sub-Saharan African diagnostic)
  "rs16139",    // African diagnostic
  "rs1476413",  // Seldin AIM
  "rs10756819"  // Kidd AIM
];

const TARGET_POPS = ["GBR", "YRI", "MXL"]; // British, Yoruba, Mexican (Admixed)

export async function syncColonialAIMs() {
  console.log("🧬 Syncing Colonial High-Resolution AIMs from Ensembl...");
  const weights: Record<string, any> = {};

  for (const rsid of COLONIAL_MARKERS) {
    try {
      const response = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json;pop_genetics=1`);
      const populations = response.data.populations || [];

      weights[rsid] = {
        rsid,
        frequencies: {}
      };

      for (const pop of populations) {
        const popName = pop.population || "";
        if (TARGET_POPS.some(target => popName.includes(target))) {
          weights[rsid].frequencies[popName] = pop.allele_freqs;
        }
      }
      
      // Delay to respect Ensembl rate limits
      await new Promise(r => setTimeout(r, 200));
    } catch (error) {
      console.warn(`⚠️ Failed to fetch frequencies for ${rsid}:`, error instanceof Error ? error.message : String(error));
    }
  }

  const dataDir = path.join(process.cwd(), 'src', 'data', 'ancestry');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(path.join(dataDir, 'colonial_aim_weights.json'), JSON.stringify(weights, null, 2));
  console.log("✅ Success: src/data/ancestry/colonial_aim_weights.json generated.");
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncColonialAIMs();
}
