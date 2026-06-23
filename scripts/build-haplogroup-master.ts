import fs from 'fs';
import path from 'path';

const MT_HAPLOGROUPS_PATH = path.join(process.cwd(), 'src/data/mitochondrial/mt_haplogroups.json');
const MITO_TRAITS_PATH = path.join(process.cwd(), 'src/data/mitochondrial/mito_traits.json');
const MT_DESCRIPTIONS_PATH = path.join(process.cwd(), 'src/data/mitochondrial/mtDescriptions.json');
const Y_HAPLOGROUPS_PATH = path.join(process.cwd(), 'src/data/haplogroups/parsed_haplogroups.json');

const MASTER_MTDNA_PATH = path.join(process.cwd(), 'src/data/master_mtdna.json');
const MASTER_YDNA_PATH = path.join(process.cwd(), 'src/data/master_ydna.json');

function runHaplogroupConsolidation() {
  console.log('🏁 Starting Y-DNA and mtDNA Haplogroup/Marker Consolidation...\n');

  // Utility to read and parse JSON
  const loadJson = (filePath: string): any => {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found at ${filePath}`);
      process.exit(1);
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err: any) {
      console.error(`❌ Failed to parse JSON file at ${filePath}: ${err.message}`);
      process.exit(1);
    }
  };

  // 1. mtDNA: mt_haplogroups.json
  console.log('🧪 Reading mt_haplogroups.json...');
  const mtHaplos = loadJson(MT_HAPLOGROUPS_PATH);
  if (!Array.isArray(mtHaplos) || mtHaplos.length === 0) {
    console.error('❌ mt_haplogroups.json is malformed or empty.');
    process.exit(1);
  }
  const sampleMtHap = mtHaplos[0];
  if (!sampleMtHap.branchName || !Array.isArray(sampleMtHap.mutations)) {
    console.warn('⚠️ Warning: Primary elements in mt_haplogroups may be malformed (missing branchName or mutations array).');
  } else {
    console.log(`✅ mt_haplogroups validated: found ${mtHaplos.length} branches.`);
  }

  // 2. mtDNA: mito_traits.json
  console.log('🧪 Reading mito_traits.json...');
  const mitoTraits = loadJson(MITO_TRAITS_PATH);
  if (!Array.isArray(mitoTraits) || mitoTraits.length === 0) {
    console.error('❌ mito_traits.json is malformed or empty.');
    process.exit(1);
  }
  const sampleTrait = mitoTraits[0];
  if (!sampleTrait.position || !sampleTrait.allele) {
    console.warn('⚠️ Warning: Primary elements in mito_traits.json may be malformed (missing position or allele).');
  } else {
    console.log(`✅ mito_traits validated: found ${mitoTraits.length} traits.`);
  }

  // 3. mtDNA: mtDescriptions.json
  console.log('🧪 Reading mtDescriptions.json...');
  const mtDescriptions = loadJson(MT_DESCRIPTIONS_PATH);
  if (typeof mtDescriptions !== 'object' || mtDescriptions === null || Array.isArray(mtDescriptions)) {
    console.error('❌ mtDescriptions.json is malformed (expected a key-value object).');
    process.exit(1);
  }
  const descKeys = Object.keys(mtDescriptions);
  console.log(`✅ mtDescriptions validated: found ${descKeys.length} matching descriptions.`);

  // 4. Y-DNA: parsed_haplogroups.json
  console.log('🧪 Reading parsed_haplogroups.json...');
  const yHaplos = loadJson(Y_HAPLOGROUPS_PATH);
  if (!Array.isArray(yHaplos) || yHaplos.length === 0) {
    console.error('❌ parsed_haplogroups.json is malformed or empty.');
    process.exit(1);
  }
  const sampleYHap = yHaplos[0];
  // Note: First item is a title row/header placeholder, check subsequent
  const hasValidShape = yHaplos.some(item => item && item.branchName && Array.isArray(item.definingSNPs));
  if (!hasValidShape) {
    console.warn('⚠️ Warning: parsed_haplogroups elements do not seem to have branchName and definingSNPs.');
  } else {
    console.log(`✅ parsed_haplogroups validated: found ${yHaplos.length} branches.`);
  }

  // 5. Construct and write master_mtdna.json
  console.log(`\n✍️ Writing consolidated mtDNA master: ${MASTER_MTDNA_PATH}`);
  const masterMtdna = {
    haplogroups: mtHaplos,
    traits: mitoTraits,
    descriptions: mtDescriptions,
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(MASTER_MTDNA_PATH, JSON.stringify(masterMtdna), 'utf-8');
  console.log('✨ master_mtdna.json written successfully.');

  // 6. Construct and write master_ydna.json
  console.log(`✍️ Writing consolidated Y-DNA master: ${MASTER_YDNA_PATH}`);
  const masterYdna = {
    isoggTree: yHaplos,
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(MASTER_YDNA_PATH, JSON.stringify(masterYdna), 'utf-8');
  console.log('✨ master_ydna.json written successfully.');

  console.log('\n🎉 Consolidation completed successfully!');
}

runHaplogroupConsolidation();
