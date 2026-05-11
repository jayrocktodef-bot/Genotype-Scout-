import axios from 'axios';
import fs from 'fs';

const REPO_API_URL = 'https://api.github.com/repos/open-pgx/openpgx/contents/data/pgx/studies';

export async function syncOpenPGx() {
  console.log('💊 Cannibalizing OpenPGx drug-gene library...');

  try {
    const { data: files } = await axios.get(REPO_API_URL);
    const fullLibrary = [];

    for (const file of files) {
      if (file.name.endsWith('.json')) {
        const { data: study } = await axios.get(file.download_url);
        
        // Automated Data Masking: Prevent sensitive medical advice
        if (study.severity === 'critical_medical') {
          study.interpretation = "Information restricted. This variant requires consultation with a clinical geneticist.";
        }
        
        fullLibrary.push(study);
      }
    }

    // Ensure data directory exists
    const outDir = './src/data/health_pgx';
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(`${outDir}/pharmacogenomics.json`, JSON.stringify(fullLibrary, null, 2));
    console.log(`✅ Success! Imported ${fullLibrary.length} clinical studies.`);
  } catch (error) {
    console.error('❌ Failed to sync OpenPGx:', error);
  }
}

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncOpenPGx();
}
