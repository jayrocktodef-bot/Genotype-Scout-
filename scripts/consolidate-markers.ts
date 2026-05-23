import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_AIMS_DIR = path.resolve(__dirname, '../src/data/raw_aims');
const OUTPUT_FILE = path.join(RAW_AIMS_DIR, 'index.ts');

function toCamelCase(filename: string): string {
  const withoutExt = filename.replace(/\.json$/, '');
  return withoutExt.replace(/[-_]([a-z])/g, (_, g) => g.toUpperCase());
}

function runConsolidation() {
  console.log('🔍 Starting Marker Consolidation & Validation...\n');

  if (!fs.existsSync(RAW_AIMS_DIR)) {
    console.error(`❌ Target directory not found at ${RAW_AIMS_DIR}`);
    process.exit(1);
  }

  // 1. Scan directory for ALL JSON files
  const files = fs.readdirSync(RAW_AIMS_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json')).sort();

  console.log(`📁 Found ${jsonFiles.length} total JSON files in ${RAW_AIMS_DIR}.`);

  const validFiles: { filename: string; variableName: string; size: number }[] = [];
  const malformedFiles: { filename: string; reason: string }[] = [];

  // 2. Validate files
  jsonFiles.forEach(file => {
    const filePath = path.join(RAW_AIMS_DIR, file);
    try {
      const contentRaw = fs.readFileSync(filePath, 'utf-8');
      const content = JSON.parse(contentRaw);

      if (!Array.isArray(content)) {
        malformedFiles.push({
          filename: file,
          reason: 'JSON content is not an array (e.g. is a direct dictionary, map, or config file).'
        });
        return;
      }

      if (content.length === 0) {
        malformedFiles.push({
          filename: file,
          reason: 'JSON array is empty.'
        });
        return;
      }

      // Check if EVERY element has rsid and frequency properties
      let missingFieldsCount = 0;
      let sampleMissing: string[] = [];

      content.forEach((item: any, idx) => {
        if (!item || typeof item !== 'object') {
          missingFieldsCount++;
          return;
        }

        const hasRsid = 'rsid' in item && typeof item.rsid === 'string' && item.rsid.trim() !== '';
        const hasFrequency = 'frequency' in item || 'frequencies' in item || 'subFrequencies' in item || 'deepFrequencies' in item;

        if (!hasRsid || !hasFrequency) {
          missingFieldsCount++;
          if (sampleMissing.length < 3) {
            sampleMissing.push(`Index ${idx} (rsid: ${item.rsid || 'undefined'})`);
          }
        }
      });

      if (missingFieldsCount > 0) {
        const percent = ((missingFieldsCount / content.length) * 100).toFixed(1);
        malformedFiles.push({
          filename: file,
          reason: `Missing rsid or frequency/frequencies fields in ${missingFieldsCount} of ${content.length} elements (${percent}%). Sample: [${sampleMissing.join(', ')}]`
        });
        return;
      }

      // If valid, translate to a safe variable name and record
      validFiles.push({
        filename: file,
        variableName: toCamelCase(file),
        size: content.length
      });

    } catch (err: any) {
      malformedFiles.push({
        filename: file,
        reason: `Failed to read or parse JSON: ${err.message}`
      });
    }
  });

  // 3. Log results summary
  console.log('\n=========================================');
  console.log('       CONSOLIDATION REPORT & SUMMARY    ');
  console.log('=========================================');
  console.log(`✅ Valid Marker Source Files found: ${validFiles.length}`);
  validFiles.forEach(f => {
    console.log(` - ${f.filename} (${f.size} markers) -> resolved as variable: ${f.variableName}`);
  });

  console.log(`\n⚠️ Malformed or Configuration Files Skipped: ${malformedFiles.length}`);
  malformedFiles.forEach(f => {
    console.log(` ❌ ${f.filename}`);
    console.log(`    Reason: ${f.reason}`);
  });
  console.log('=========================================\n');

  // 4. Generate the src/data/raw_aims/index.ts file
  console.log(`✍️ Creating index file at: ${OUTPUT_FILE}`);

  let code = `// ==========================================================================\n`;
  code += `// Generated dynamically via scripts/consolidate-markers.ts. DO NOT HAND EDIT.\n`;
  code += `// ==========================================================================\n\n`;

  // Static imports
  validFiles.forEach(f => {
    code += `import ${f.variableName} from './${f.filename}';\n`;
  });

  code += `\n// Export individual collections for fine-grained engine access\n`;
  code += `export {\n`;
  const exportNames = validFiles.map(f => `  ${f.variableName}`).join(',\n');
  code += `${exportNames}\n`;
  code += `};\n\n`;

  // Export AimsRegistry object
  code += `/**\n * A consolidated registry mapping geography/population names to their validated structural marker lists.\n */\n`;
  code += `export const AimsRegistry = {\n`;
  validFiles.forEach(f => {
    code += `  ${f.variableName},\n`;
  });
  code += `};\n\n`;

  // Export getAllAims() function
  code += `/**\n * Flattens all validated marker sets into a single continuous master array of all AIMs.\n */\n`;
  code += `export function getAllAims(): any[] {\n`;
  code += `  return [\n`;
  validFiles.forEach(f => {
    code += `    ...${f.variableName},\n`;
  });
  code += `  ];\n`;
  code += `}\n`;

  fs.writeFileSync(OUTPUT_FILE, code, 'utf-8');
  console.log(`✨ Successfully generated src/data/raw_aims/index.ts!`);
}

runConsolidation();
