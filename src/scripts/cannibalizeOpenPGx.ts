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
        
        // Automated Data Masking: Prevent sensitive medical advice & sanitize proprietary terms
        if (study.severity === 'critical_medical') {
          study.interpretation = "Information restricted. This variant requires consultation with a clinical geneticist.";
        }
        if (study.source && study.source.title) {
          study.source.title = study.source.title.replace(/PharmGKB summary:\s*/gi, 'Pharmacogene Scientific Review: ');
        }
        if (study.snps && Array.isArray(study.snps)) {
          study.snps.forEach((snp: any) => {
            if (snp.interpretations) {
              Object.values(snp.interpretations).forEach((interp: any) => {
                if (interp.recommendation) {
                  interp.recommendation = interp.recommendation.replace(/CPIC\/PharmGKB Level A recommendation/gi, 'CPIC Level A clinical consensus guideline');
                  interp.recommendation = interp.recommendation.replace(/PharmGKB\s*/gi, '');
                }
              });
            }
          });
        }
        
        fullLibrary.push(study);
      }
    }

    // Ensure data directory exists
    const outDir = './src/data/raw_health';
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
