import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directories based on Genotype Scout's structure
const DATA_DIRS = [
  path.resolve(__dirname, '../src/data/raw_aims')
];

 // The unified structure every marker must conform to
interface StandardAim {
  rsid: string;
  chromosome?: string;
  position?: number;
  region: string;
  color?: string;
  alleles: string[];
  ref?: string;
  alt?: string;
  frequencies: Record<string, number>;
  subFrequencies?: Record<string, number>;
  deepFrequencies?: Record<string, number>;
  weight: number;
  gene?: string;
  trait?: string;
  description?: string;
  significance?: 'High' | 'Medium' | 'Low';
}

const REGION_COLORS: Record<string, string> = {
  AFR: "#2ECC71", // Emerald
  EUR: "#3498DB", // Peter River
  NAT: "#E74C3C", // Alizarin
  EAS: "#F1C40F", // Sunflower
  SAS: "#9B59B6", // Amethyst
  OCE: "#E67E22", // Carrot
  MEA: "#1ABC9C", // Turquoise
  AMR: "#E74C3C", // Alizarin (NAT/Americas)
  ASIA: "#F1C40F",
  GLOBAL: "#95A5A6" // Asbestos
};

function buildMasterAims() {
  const globalAimMap = new Map<string, StandardAim>();
  let duplicateCount = 0;
  let missingDataCount = 0;

  console.log('🧬 Starting Genotype Scout Master AIMs Compilation (with Dynamic Color Injection)...\n');

  DATA_DIRS.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️  Directory not found: ${dir}`);
      return;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

    files.forEach(file => {
      const filePath = path.join(dir, file);
      let rawData: any;

      try {
        rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (err) {
        console.error(`❌ Failed to parse ${file}. Skipping.`);
        return;
      }

      const entries = Array.isArray(rawData) ? rawData : Object.entries(rawData).map(([k, v]) => ({ ...(v as object), rsid: k }));

      entries.forEach((entry: any) => {
        const rsid = entry.rsid;

        if (!rsid) {
          missingDataCount++;
          return;
        }

        const region = entry.region || 'GLOBAL';

        let chromosome = entry.chromosome || entry.chrom || entry.chr;
        let position = typeof entry.position === 'number' ? entry.position : (typeof entry.pos === 'number' ? entry.pos : undefined);
        let normalizedRsid = rsid.toLowerCase();

        // If chromosome/position missing, try to infer from rsid (e.g. chr1_12345 or chrchr1_12345)
        const coordMatch = normalizedRsid.match(/(?:chr)+(X|Y|MT|\d+)_(\d+)/i);
        if (coordMatch) {
          const chrom = coordMatch[1].toUpperCase();
          const pos = parseInt(coordMatch[2], 10);
          chromosome = chromosome || chrom;
          position = position || pos;
          
          // Force a clean coordinate ID format: chr1_12345
          normalizedRsid = `chr${chrom}_${pos}`.toLowerCase();
        }

        // Standardize the marker
        const standardAim: StandardAim = {
          rsid: normalizedRsid,
          chromosome: chromosome,
          position: position,
          region: region,
          color: REGION_COLORS[region] || REGION_COLORS['GLOBAL'],
          alleles: Array.isArray(entry.alleles) ? entry.alleles : [],
          ref: entry.ref || undefined,
          alt: entry.alt || undefined,
          frequencies: entry.frequencies || entry.freqs || {},
          subFrequencies: entry.subFrequencies || {},
          deepFrequencies: entry.deepFrequencies || {},
          weight: typeof entry.weight === 'number' ? entry.weight : 1.0,
          gene: entry.gene || undefined,
          trait: entry.trait || undefined,
          description: entry.description || '',
          significance: entry.significance || undefined
        };

        // Track collisions/duplicates
        if (globalAimMap.has(normalizedRsid)) {
          console.warn(`[COLLISION] rsID ${normalizedRsid} found in ${file}. Overwriting older entry.`);
          duplicateCount++;
        }

        globalAimMap.set(normalizedRsid, standardAim);
      });
    });
  });

  // Convert Map to a standard JS Object for JSON serialization
  const compiledData = Object.fromEntries(globalAimMap);
  const outputPath = path.resolve(__dirname, '../src/data/master_aims_normalized.json');

  // Write to disk
  fs.writeFileSync(outputPath, JSON.stringify(compiledData, null, 2));

  // Print Summary
  console.log('\n✅ Compilation Complete!');
  console.log('-----------------------------------');
  console.log(`Total Unique Markers: **${globalAimMap.size.toLocaleString()}**`);
  console.log(`Duplicates Resolved:  **${duplicateCount}**`);
  console.log(`Skipped (No rsID):    **${missingDataCount}**`);
  console.log(`Output saved to:      ${outputPath}`);
}

buildMasterAims();
