// src/scripts/sync-scout.ts
import { syncOpenPGx } from './cannibalizeOpenPGx';
import { fetchGrafWeights } from './fetchGrafWeights';
import { syncCommercialAims } from './sync-commercial-aims';
import { syncMicroHapDB } from './sync-microhaps';
import { syncColonialAIMs } from './sync-colonial-aims';
import { syncAncientAfricanWeights } from './fetchAncientAfricanWeights';
import { syncAfricanDeepRes } from './sync-african-deep-res';
import fs from 'fs';
import path from 'path';

async function runAutomation() {
  console.log("🚀 Initializing Genotype Scout Automated Sync...");

  try {
    // 1. Sync African Deep Resolution Weights
    console.log("\n🧪 Step 1: Syncing Deep African Resolution Weights...");
    await syncAfricanDeepRes();

    // 2. Fetch Health/PGx Data from OpenPGx
    console.log("\n📦 Step 2: Syncing Pharmacogenomics from OpenPGx...");
    await syncOpenPGx();

    // 3. Fetch Ancestry Weights (Sub-populations)
    console.log("\n🧬 Step 3: Fetching 10k GRAF Regional Weights (1kGP)...");
    await fetchGrafWeights();

    // 4. Fetch Commercial AIMs (Kidd/Seldin)
    console.log("\n🧪 Step 4: Syncing Commercial Core AIMs (Kidd/Seldin)...");
    await syncCommercialAims();

    // 5. Fetch MicroHapDB (Forensic Resolution)
    console.log("\n🚓 Step 5: Syncing MicroHap Forensic Kernel...");
    await syncMicroHapDB();

    // 6. Fetch African and Colonial Specialized Weights
    console.log("\n🌍 Step 6: Syncing Ancient African and Colonial African-Diaspora Weights...");
    await syncColonialAIMs();
    await syncAncientAfricanWeights();

    // 7. Generate Phenotypic Weights (Avatar Engine)
    console.log("\n👤 Step 7: Generating HIrisPlex-S Avatar Data...");
    const avatarWeights = {
      eyeColor: { 
        rs12913832: { gene: "HERC2", weight: 0.45, alleles: ["A", "G"] }, 
        rs1800407: { gene: "OCA2", weight: 0.15, alleles: ["C", "T"] },
        rs12896399: { gene: "SLC24A4", weight: 0.10, alleles: ["G", "T"] }
      },
      hairColor: { 
        rs1805007: { gene: "MC1R", weight: 0.30, alleles: ["C", "T"] }, 
        rs16891982: { gene: "SLC45A2", weight: 0.20, alleles: ["C", "G"] },
        rs12913832: { gene: "HERC2", weight: 0.15, alleles: ["A", "G"] }
      },
      skinTone: {
        rs1426654: { gene: "SLC24A5", weight: 0.40, alleles: ["A", "G"] },
        rs16891982: { gene: "SLC45A2", weight: 0.25, alleles: ["C", "G"] },
        rs885479: { gene: "MC1R", weight: 0.10, alleles: ["A", "G"] }
      }
      // Weights sourced from HIrisPlex-S published AUC metrics and forensic standards
    };
    
    const dataDir = path.join(process.cwd(), 'src', 'data', 'phenotype_forensic');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    fs.writeFileSync(path.join(dataDir, 'appearance_weights.json'), JSON.stringify(avatarWeights, null, 2));
    console.log("✅ Avatar metadata generated: src/data/phenotype_forensic/appearance_weights.json");

    console.log("\n✨ All genomic kernels updated and optimized.");
  } catch (error) {
    console.error("❌ Automation failed:", error);
    process.exit(1);
  }
}

runAutomation();
