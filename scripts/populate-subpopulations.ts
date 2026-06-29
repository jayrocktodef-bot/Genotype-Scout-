import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MASTER_PATH = path.resolve(__dirname, '../src/data/master_aims_normalized.json');
const REGIONAL_DIR = path.resolve(__dirname, '../src/data/raw_aims');
const REF_1000G_PATH = path.resolve(__dirname, '../src/data/reference/1000genomes_frequencies.json');

function cleanRsId(rsid: string): string {
  if (!rsid) return '';
  return rsid.toLowerCase().split('_')[0].trim();
}

function runPopulate() {
  console.log('🏁 Starting subpopulation frequency population pipeline...\n');

  if (!fs.existsSync(MASTER_PATH)) {
    console.error(`❌ Master database not found at ${MASTER_PATH}`);
    return;
  }

  // 1. Load Master Normalized Database
  console.log('📂 Loading master database...');
  const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf-8'));
  const masterKeys = Object.keys(masterData);
  console.log(`📊 Loaded ${masterKeys.length.toLocaleString()} master SNPs.`);

  // Helpers to keep track of updates
  let grafMerged = 0;
  let commercialMerged = 0;
  let africanDeepResMerged = 0;
  let regionalMerged = 0;
  let ref1000gMerged = 0;

  // 2. Load and Populate from graf_10k_weights.json
  const grafPath = path.resolve(__dirname, '../public/data/graf_10k_weights.json');
  if (fs.existsSync(grafPath)) {
    console.log('📂 Loading GRAF-10k weights...');
    const grafWeights = JSON.parse(fs.readFileSync(grafPath, 'utf-8'));
    Object.entries(grafWeights).forEach(([rsid, freqs]) => {
      const cleanId = cleanRsId(rsid);
      if (masterData[cleanId]) {
        masterData[cleanId].subFrequencies = {
          ...(masterData[cleanId].subFrequencies || {}),
          ...(freqs as Record<string, number>)
        };
        grafMerged++;
      }
    });
    console.log(`✅ Merged GRAF-10k weights for ${grafMerged.toLocaleString()} SNPs.`);
  }

  // 3. Load and Populate from commercial_aim_weights.json
  const commercialPath = path.join(REGIONAL_DIR, 'commercial_aim_weights.json');
  if (fs.existsSync(commercialPath)) {
    console.log('📂 Loading commercial AIM weights...');
    const commercialWeights = JSON.parse(fs.readFileSync(commercialPath, 'utf-8'));
    Object.entries(commercialWeights).forEach(([rsid, d]) => {
      const cleanId = cleanRsId(rsid);
      if (masterData[cleanId]) {
        // Only merge actual frequency entries (e.g. non-metadata, numeric fields)
        const cleanFreqs: Record<string, number> = {};
        Object.entries(d as any).forEach(([pop, freq]) => {
          if (typeof freq === 'number') {
            cleanFreqs[pop] = freq;
          }
        });
        masterData[cleanId].subFrequencies = {
          ...(masterData[cleanId].subFrequencies || {}),
          ...cleanFreqs
        };
        commercialMerged++;
      }
    });
    console.log(`✅ Merged commercial weights for ${commercialMerged.toLocaleString()} SNPs.`);
  }

  // 4. Load and Populate from african_deep_res_weights.json
  const africanDeepResPath = path.join(REGIONAL_DIR, 'african_deep_res_weights.json');
  if (fs.existsSync(africanDeepResPath)) {
    console.log('📂 Loading African deep-res weights...');
    const africanDeepWeights = JSON.parse(fs.readFileSync(africanDeepResPath, 'utf-8'));
    Object.entries(africanDeepWeights).forEach(([rsid, freqs]) => {
      const cleanId = cleanRsId(rsid);
      if (masterData[cleanId]) {
        masterData[cleanId].subFrequencies = {
          ...(masterData[cleanId].subFrequencies || {}),
          ...(freqs as Record<string, number>)
        };
        africanDeepResMerged++;
      }
    });
    console.log(`✅ Merged African deep-res weights for ${africanDeepResMerged.toLocaleString()} SNPs.`);
  }

  // 5. Load and Populate from Regional JSON files
  const REGIONAL_FILES = [
    'africa.json', 'americas.json', 'central-asia.json', 'east-asia.json',
    'europe.json', 'middle-east.json', 'oceania.json', 'south-asia.json'
  ];

  REGIONAL_FILES.forEach(filename => {
    const filePath = path.join(REGIONAL_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Regional file not found: ${filename}`);
      return;
    }
    console.log(`📂 Processing regional file: ${filename}...`);
    try {
      const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (Array.isArray(rawData)) {
        rawData.forEach((entry: any) => {
          if (!entry.rsid) return;
          const cleanId = cleanRsId(entry.rsid);
          if (masterData[cleanId]) {
            let hasUpdated = false;
            if (entry.subFrequencies && Object.keys(entry.subFrequencies).length > 0) {
              masterData[cleanId].subFrequencies = {
                ...(masterData[cleanId].subFrequencies || {}),
                ...entry.subFrequencies
              };
              hasUpdated = true;
            }
            if (entry.deepFrequencies && Object.keys(entry.deepFrequencies).length > 0) {
              masterData[cleanId].deepFrequencies = {
                ...(masterData[cleanId].deepFrequencies || {}),
                ...entry.deepFrequencies
              };
              hasUpdated = true;
            }
            if (hasUpdated) regionalMerged++;
          }
        });
      }
    } catch (err: any) {
      console.error(`❌ Failed processing ${filename}: ${err.message}`);
    }
  });
  console.log(`✅ Merged regional sub/deep frequencies for ${regionalMerged.toLocaleString()} instances.`);

  // 6. Compute and Populate from 1000genomes_frequencies.json genotypes
  if (fs.existsSync(REF_1000G_PATH)) {
    console.log('📂 Processing 1000 Genomes reference genotypes...');
    try {
      const refGenomes = JSON.parse(fs.readFileSync(REF_1000G_PATH, 'utf-8'));
      Object.entries(refGenomes).forEach(([rsid, refEntry]: [string, any]) => {
        if (rsid.startsWith('_')) return; // skip metadata keys like _metadata

        const cleanId = cleanRsId(rsid);
        const masterEntry = masterData[cleanId];
        if (masterEntry && refEntry.populations) {
          // Get target allele from master entry
          const alleles = masterEntry.alleles || [];
          if (alleles.length === 0) return;
          const targetAllele = alleles[0].toUpperCase();

          const computedFreqs: Record<string, number> = {};
          
          Object.entries(refEntry.populations).forEach(([popCode, genoFreqs]: [string, any]) => {
            let alleleFreq = 0;
            let totalGenoFreq = 0;

            Object.entries(genoFreqs).forEach(([geno, freq]: [string, any]) => {
              if (typeof freq !== 'number') return;
              const cleanGeno = geno.toUpperCase();
              
              // Count occurrences of targetAllele in the genotype
              let count = 0;
              for (let i = 0; i < cleanGeno.length; i++) {
                if (cleanGeno[i] === targetAllele) count++;
              }

              const weight = cleanGeno.length > 0 ? count / cleanGeno.length : 0;
              alleleFreq += freq * weight;
              totalGenoFreq += freq;
            });

            // Normalize in case genotype freqs sum to something slightly != 1.0
            if (totalGenoFreq > 0) {
              computedFreqs[popCode] = Number((alleleFreq / totalGenoFreq).toFixed(6));
            } else {
              computedFreqs[popCode] = Number(alleleFreq.toFixed(6));
            }
          });

          if (Object.keys(computedFreqs).length > 0) {
            masterData[cleanId].subFrequencies = {
              ...(masterData[cleanId].subFrequencies || {}),
              ...computedFreqs
            };
            ref1000gMerged++;
          }
        }
      });
      console.log(`✅ Computed and merged 1000G allele frequencies for ${ref1000gMerged.toLocaleString()} SNPs.`);
    } catch (err: any) {
      console.error(`❌ Failed processing 1000 Genomes reference frequencies: ${err.message}`);
    }
  }

  // 7. Write consolidated database back to disk
  console.log('💾 Saving consolidated master database back to disk...');
  fs.writeFileSync(MASTER_PATH, JSON.stringify(masterData, null, 2));
  console.log('✨ All subpopulations populated successfully!');
}

runPopulate();
