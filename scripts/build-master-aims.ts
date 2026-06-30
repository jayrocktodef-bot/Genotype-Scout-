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
  GLOBAL: "#95A5A6", // Asbestos
  "South Asian": "#9B59B6",
  "East Asian": "#F1C40F",
  "African": "#2ECC71",
  "European": "#3498DB",
  "Native American": "#E74C3C",
  "Middle Eastern": "#1ABC9C",
  "Oceanian": "#E67E22",
  "Central Asian": "#F59E0B",
  "North African": "#C084FC"
};

function normalizeRegion(rawRegion: string): string {
  if (!rawRegion) return 'Global';
  const r = rawRegion.trim().toUpperCase();
  
  if (r === 'AFR' || r === 'AFRICAN' || r === 'AFRICA') return 'African';
  if (r === 'EUR' || r === 'EUROPEAN' || r === 'EUROPE') return 'European';
  if (r === 'SAS' || r === 'SOUTH ASIAN' || r === 'SOUTH_ASIAN') return 'South Asian';
  if (r === 'EAS' || r === 'EAST ASIAN' || r === 'EAST_ASIAN' || r === 'ASI' || r === 'ASIAN' || r === 'ASIA') return 'East Asian';
  if (r === 'CAS' || r === 'CENTRAL ASIAN' || r === 'CENTRAL_ASIAN') return 'Central Asian';
  if (r === 'AMR' || r === 'NAT' || r === 'AMERICAN' || r === 'AMERICAS' || r === 'NATIVE AMERICAN' || r === 'NATIVE_AMERICAN') return 'Native American';
  if (r === 'OCE' || r === 'OCEANIAN' || r === 'OCEANIA') return 'Oceanian';
  if (r === 'MEA' || r === 'MENA' || r === 'MIDDLE EAST' || r === 'MIDDLE EASTERN' || r === 'MIDDLE_EASTERN') return 'Middle Eastern';
  if (r === 'NAFR' || r === 'NORTH AFRICAN' || r === 'NORTH_AFRICAN') return 'North African';
  if (r === 'GLOBAL' || r === 'GLOBAL_AIMS') return 'Global';
  
  return rawRegion.charAt(0).toUpperCase() + rawRegion.slice(1);
}

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

        const region = normalizeRegion(entry.region || 'GLOBAL');

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
          frequencies: entry.frequencies || entry.freqs || (() => {
            const f: Record<string, number> = {};
            const possiblePops = ['AFR', 'EUR', 'EAS', 'SAS', 'AMR', 'OCE', 'MENA', 'NAFR', 'Global'];
            possiblePops.forEach(pop => {
              if (entry[pop] !== undefined) f[pop] = entry[pop];
            });
            return f;
          })(),
          subFrequencies: entry.subFrequencies || {},
          deepFrequencies: entry.deepFrequencies || {},
          weight: typeof entry.weight === 'number' ? entry.weight : 1.0,
          gene: entry.gene || undefined,
          trait: entry.trait || undefined,
          description: entry.description || '',
          significance: entry.significance || undefined
        };

        // Track collisions/duplicates
        let mergedAim = standardAim;
        if (globalAimMap.has(normalizedRsid)) {
          const existing = globalAimMap.get(normalizedRsid)!;
          duplicateCount++;
          mergedAim = {
            ...existing,
            ...standardAim,
            region: (standardAim.region && standardAim.region !== 'Global') ? standardAim.region : existing.region,
            color: (standardAim.region && standardAim.region !== 'Global') ? standardAim.color : existing.color,
            chromosome: standardAim.chromosome || existing.chromosome,
            position: standardAim.position || existing.position,
            frequencies: { ...existing.frequencies, ...standardAim.frequencies },
            subFrequencies: { ...existing.subFrequencies, ...standardAim.subFrequencies },
            deepFrequencies: { ...existing.deepFrequencies, ...standardAim.deepFrequencies },
            gene: standardAim.gene || existing.gene,
            trait: standardAim.trait || existing.trait,
            description: standardAim.description || existing.description,
            alleles: standardAim.alleles.length > 0 ? standardAim.alleles : existing.alleles,
          };
        }

        globalAimMap.set(normalizedRsid, mergedAim);
      });
    });
  });

  // Convert Map to a standard JS Object for JSON serialization
  const compiledData = Object.fromEntries(globalAimMap);
  const outputPath = path.resolve(__dirname, '../src/data/master_aims_normalized.json');

  // Write to disk (Streamed)
  const stream = fs.createWriteStream(outputPath);
  stream.write(JSON.stringify(compiledData, null, 2)); // Wait, if compiledData is a huge object in memory, this still strings it all at once...
  stream.end();

  // Print Summary
  console.log('\n✅ Compilation Complete!');
  console.log('-----------------------------------');
  console.log(`Total Unique Markers: **${globalAimMap.size.toLocaleString()}**`);
  console.log(`Duplicates Resolved:  **${duplicateCount}**`);
  console.log(`Skipped (No rsID):    **${missingDataCount}**`);
  console.log(`Output saved to:      ${outputPath}`);
}

buildMasterAims();
