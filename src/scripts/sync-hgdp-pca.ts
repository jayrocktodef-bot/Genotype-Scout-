import axios from 'axios';
import fs from 'fs';
import { PCA } from 'ml-pca';

// Map population codes to Macro-Regions for the UI colors
const REGION_MAP: Record<string, { region: string, color: string }> = {
  // 1kGP
  'YRI': { region: 'Africa', color: '#10b981' },
  'CEU': { region: 'Europe', color: '#3b82f6' },
  'CHB': { region: 'Asia', color: '#ef4444' },
  'PEL': { region: 'Americas', color: '#a855f7' },
  // HGDP
  'Karitiana': { region: 'Americas', color: '#a855f7' },
  'Papuan': { region: 'Oceania', color: '#06b6d4' },
  'Druze': { region: 'Middle East', color: '#f59e0b' },
  'Mbuti': { region: 'Africa', color: '#10b981' },
  'Kalash': { region: 'Central Asia', color: '#8b5cf6' }
  // Add remaining 1kGP/HGDP population mappings here...
};

async function generateHybridPCA() {
  console.log("🌍 Initiating lightweight HGDP/1kGP API fetch...");

  // 1. Load the Commercial AIMs we synced earlier (e.g., Kidd 55, Seldin 128)
  // We use these highly informative markers to build the PCA space
  const weightsFile = './src/data/ancestry/commercial_aim_weights.json';
  if (!fs.existsSync(weightsFile)) {
    console.error("❌ commercial_aim_weights.json not found. Run sync-commercial-aims first.");
    return;
  }
  
  const targetMarkers = JSON.parse(fs.readFileSync(weightsFile, 'utf8'));
  const rsIDs = Object.keys(targetMarkers).slice(0, 150); // Use top 150 AIMs for speed

  const referenceKernel: Record<string, { region: string, frequencies: Record<string, number> }> = {};

  // 2. Fetch Allele Frequencies
  for (const rsid of rsIDs) {
    try {
      const response = await axios.get(`https://rest.ensembl.org/variation/human/${rsid}?content-type=application/json&pops=1`);
      
      if (response.data.populations) {
        response.data.populations
          .filter((p: any) => p.population.includes('1000GENOMES:phase_3') || p.population.includes('HGDP:'))
          .forEach((p: any) => {
            const popCode = p.population.split(':').pop();
            if (!referenceKernel[popCode]) {
              referenceKernel[popCode] = {
                region: REGION_MAP[popCode]?.region || 'Global',
                frequencies: {}
              };
            }
            referenceKernel[popCode].frequencies[rsid] = p.frequency;
          });
      }
        
      process.stdout.write('.'); // Progress dot
      await new Promise(resolve => setTimeout(resolve, 150)); // Respect API rate limits
    } catch (e) {
      console.error(`\n❌ Failed to fetch ${rsid}`);
    }
  }

  console.log("\n🧬 Frequency matrix built. Running Principal Component Analysis...");

  // 3. Matrix Construction for PCA
  const populations = Object.keys(referenceKernel);
  if (populations.length === 0) {
    console.error("❌ No population data fetched. Matrix construction failed.");
    return;
  }

  const matrix = populations.map(pop => {
    return rsIDs.map(rsid => referenceKernel[pop].frequencies[rsid] || 0.0); // Fill missing with 0
  });

  // 4. Calculate PCA
  const pca = new PCA(matrix);
  const coordinates = pca.predict(matrix).to2DArray(); // Returns projected data

  // 5. Build the UI Map Data
  const pcaMapData = populations.map((pop, idx) => ({
    population: pop,
    region: referenceKernel[pop].region,
    color: REGION_MAP[pop]?.color || '#94a3b8',
    pc1: coordinates[idx][0],
    pc2: coordinates[idx][1]
  }));

  // 6. Save the outputs
  fs.writeFileSync('./src/data/ancestry/pca_reference_data.json', JSON.stringify(pcaMapData, null, 2));
  fs.writeFileSync('./src/data/ancestry/ho_modern_reference_kernel.json', JSON.stringify(referenceKernel, null, 2));
  
  // Also save the PCA model and the rsIDs used (order is critical)
  const pcaModel = {
    rsIDs,
    model: pca.toJSON()
  };
  fs.writeFileSync('./src/data/ancestry/pca_model.json', JSON.stringify(pcaModel, null, 2));

  console.log("✅ Success! HGDP expansion integrated and PCA space calculated.");
}

generateHybridPCA().catch(console.error);
