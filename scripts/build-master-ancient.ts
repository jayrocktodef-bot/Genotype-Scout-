import fs from 'fs';
import path from 'path';

const RAW_DIR = path.join(process.cwd(), 'src/data/raw_ancient');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/master_ancient_profiles.json');

function main() {
  const master: any = {
    metadata: {
      description: "Unified Ancient and Historical Genomic Data",
      generated_at: new Date().toISOString(),
      ancient_populations: {}
    },
    markers: {},
    samples: {},
    clusters: [],
    african_weights: {},
    matches: []
  };

  if (!fs.existsSync(RAW_DIR)) {
    console.error(`❌ Directory not found: ${RAW_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(RAW_DIR);

  files.forEach(file => {
    const filePath = path.join(RAW_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (file === 'ancient_dna_markers.json') {
      if (content._metadata?.ancient_populations) {
        master.metadata.ancient_populations = content._metadata.ancient_populations;
      }
      Object.entries(content).forEach(([key, val]) => {
        if (key !== '_metadata') {
          master.markers[key] = val;
        }
      });
    } else if (file === 'ancient_samples.json') {
      Object.entries(content).forEach(([key, val]) => {
        if (key !== '_metadata') {
          master.samples[key] = val;
        }
      });
    } else if (file === 'historical_clusters.json') {
      master.clusters = content.clusters || [];
    } else if (file === 'ancient_african_weights.json') {
        master.african_weights = content;
    } else if (file === 'ancientMatches.json') {
        master.matches = content;
    }
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(master, null, 2));
  console.log(`✅ Master ancient file generated at ${OUTPUT_FILE}`);
}

main();
