/**
 * Strict Data Integrity & Anti-Synthetic SNP Validator
 *
 * Hard Rule: Fails with non-zero exit code if ANY synthetic SNP, placeholder coordinate,
 * fake RSID, unmapped patch scaffold, or dummy frequency profile is detected.
 */
import * as fs from 'fs';
import * as path from 'path';

export interface AimEntry {
  rsid: string;
  chromosome: string;
  position: number;
  region: string;
  color?: string;
  alleles?: string[];
  frequencies: Record<string, number>;
  weight: number;
  gene?: string;
  trait?: string;
  description?: string;
  build?: string;
  palindromic?: boolean;
  [key: string]: any;
}

const VALID_CHROMOSOMES = new Set([
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', 'X', 'Y', 'MT', 'M'
]);

// 1. dbSNP Merged Accessions Map
const MERGED_MAP_PATH = path.join(process.cwd(), 'src/data/reference/dbsnp_merged_map.json');
export let dbsnpMergedMap: Record<string, string> = {};
if (fs.existsSync(MERGED_MAP_PATH)) {
  try {
    dbsnpMergedMap = JSON.parse(fs.readFileSync(MERGED_MAP_PATH, 'utf-8'));
  } catch (err) {
    console.warn(`[validate:data] Failed to load dbsnp_merged_map.json:`, err);
  }
}

// 2. Local Ensembl GRCh38 Cache for Spot-Checking
const ENSEMBL_CACHE_PATH = path.join(process.cwd(), 'src/data/reference/ensembl_cache.json');
export let ensemblCache: Record<string, { chromosome: string; position: number; alleles?: string }> = {};
if (fs.existsSync(ENSEMBL_CACHE_PATH)) {
  try {
    ensemblCache = JSON.parse(fs.readFileSync(ENSEMBL_CACHE_PATH, 'utf-8'));
  } catch (err) {
    console.warn(`[validate:data] Failed to load ensembl_cache.json:`, err);
  }
}

export function validateAIMsData(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    console.warn(`[validate:data] Skipping nonexistent file: ${filePath}`);
    return true;
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data: Record<string, AimEntry> = JSON.parse(rawData);

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error(`File does not contain a JSON dictionary object: ${filePath}`);
  }

  const errors: string[] = [];
  const entries = Object.entries(data);

  for (const [key, entry] of entries) {
    const rsid = (entry.rsid || key).toLowerCase();
    const cleanKey = key.toLowerCase();

    // 0. Hard Rule: Reject merged / deprecated dbSNP accessions unless current ID is used
    const currentTarget = dbsnpMergedMap[rsid] || dbsnpMergedMap[cleanKey];
    if (currentTarget && rsid !== currentTarget.toLowerCase() && cleanKey !== currentTarget.toLowerCase()) {
      errors.push(
        `Deprecated merged dbSNP accession detected: '${key}' in ${path.basename(filePath)}. Record must use current accession '${currentTarget}'.`
      );
    }

    // 1. Hard Rule: Reject mock or fabricated RSIDs
    if (
      rsid.includes('mock') ||
      rsid.includes('dummy') ||
      rsid.includes('synthetic') ||
      rsid.startsWith('test_')
    ) {
      errors.push(`Synthetic RSID detected: '${key}' in ${path.basename(filePath)}`);
    }

    // RSID must be valid format: dbSNP (rs...), coordinate ID (chr..._...), or Kidd/ALFRED microhaplotype (mh...)
    const isValidRsid =
      /^rs\d+$/i.test(rsid) ||
      /^chr([1-9]|1\d|2[0-2]|x|y|mt)_\d+$/i.test(rsid) ||
      /^mh\d+[a-z0-9_\-\.]+$/i.test(rsid);
    if (!isValidRsid) {
      errors.push(`Invalid / non-standard accession format: '${key}' in ${path.basename(filePath)}`);
    }

    // 2. Hard Rule: Reject synthetic/placeholder positions
    const pos = Number(entry.position);
    if (pos === 1000000) {
      errors.push(`Synthetic placeholder position 1,000,000 detected: '${key}' in ${path.basename(filePath)}`);
    } else if (!pos || isNaN(pos) || pos <= 0) {
      errors.push(`Invalid physical coordinate '${entry.position}': '${key}' in ${path.basename(filePath)}`);
    }

    // 3. Hard Rule: Reject patch scaffolds or malformed chromosomes
    const chrStr = String(entry.chromosome || '').trim().toUpperCase().replace(/^CHR/, '');
    if (!VALID_CHROMOSOMES.has(chrStr)) {
      errors.push(`Unmapped or malformed chromosome '${entry.chromosome}': '${key}' in ${path.basename(filePath)}`);
    }

    // 4. Hard Rule: Reject empty or dummy frequency profiles
    if (!entry.frequencies || typeof entry.frequencies !== 'object' || Array.isArray(entry.frequencies)) {
      errors.push(`Missing frequencies object: '${key}' in ${path.basename(filePath)}`);
    } else {
      const freqKeys = Object.keys(entry.frequencies);
      if (freqKeys.length === 0) {
        errors.push(`Empty frequencies object: '${key}' in ${path.basename(filePath)}`);
      } else if (freqKeys.length === 1 && freqKeys[0].toUpperCase() === 'GLOBAL') {
        errors.push(`Synthetic single GLOBAL frequency: '${key}' in ${path.basename(filePath)}`);
      }

      // Validate frequency values are numbers in [0, 1] and keys are not raw RSIDs
      for (const [pCode, pFreq] of Object.entries(entry.frequencies)) {
        if (pCode.toLowerCase().startsWith('rs') || pCode.length > 25) {
          errors.push(`Corrupted frequency key '${pCode}': '${key}' in ${path.basename(filePath)}`);
        }
        if (typeof pFreq !== 'number' || isNaN(pFreq) || pFreq < 0 || pFreq > 1) {
          errors.push(`Invalid frequency value '${pFreq}' for pop '${pCode}': '${key}' in ${path.basename(filePath)}`);
        }
      }
    }

    // 5. Weight must be positive number
    if (typeof entry.weight !== 'number' || isNaN(entry.weight) || entry.weight < 0) {
      errors.push(`Invalid weight '${entry.weight}': '${key}' in ${path.basename(filePath)}`);
    }

    // 6. Ensembl GRCh38 Spot-Check: if marker declares GRCh38 and is cached, verify chromosome/position/alleles
    const cached = ensemblCache[rsid] || ensemblCache[cleanKey];
    if (cached && entry.build === 'GRCh38') {
      const cachedChr = String(cached.chromosome || '').trim().toUpperCase().replace(/^CHR/, '');
      if (chrStr !== cachedChr) {
        errors.push(
          `Ensembl GRCh38 chromosome mismatch for '${key}' in ${path.basename(filePath)}: panel chr${chrStr} vs Ensembl chr${cachedChr}`
        );
      }
      if (pos !== Number(cached.position)) {
        errors.push(
          `Ensembl GRCh38 position mismatch for '${key}' in ${path.basename(filePath)}: panel ${pos} vs Ensembl ${cached.position}`
        );
      }
      if (entry.alleles && cached.alleles) {
        const allowed = cached.alleles.toUpperCase().split(/[\/,|]/);
        for (const a of entry.alleles) {
          if (!allowed.includes(a.toUpperCase())) {
            errors.push(
              `Ensembl GRCh38 allele mismatch for '${key}' in ${path.basename(filePath)}: allele '${a}' not in Ensembl alleles '${cached.alleles}'`
            );
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    const errorDetails = errors.slice(0, 10).map(e => `  - ${e}`).join('\n') +
      (errors.length > 10 ? `\n  ... and ${errors.length - 10} more.` : '');
    const fullMsg = `\n❌ [validate:data] ${errors.length} HARD RULE VIOLATION(S) in ${path.basename(filePath)}:\n${errorDetails}`;
    console.error(fullMsg);
    throw new Error(fullMsg);
  }

  console.log(`✓ [validate:data] ${path.basename(filePath).padEnd(28)}: ${entries.length.toString().padStart(5)} markers verified (Zero synthetic SNPs)`);
  return true;
}

export function runFullValidation(customFiles?: string[]) {
  console.log('🧬 Running Hard-Rule Data Validation against synthetic/mock SNPs...\n');

  const filesToValidate = customFiles || [
    'src/data/master_aims_normalized.json',
    'src/data/aims/global.json',
    'src/data/aims/african.json',
    'src/data/aims/african_american.json',
    'src/data/aims/central_asian.json',
    'src/data/aims/east_asian.json',
    'src/data/aims/european.json',
    'src/data/aims/middle_eastern.json',
    'src/data/aims/native_american.json',
    'src/data/aims/north_african.json',
    'src/data/aims/oceanian.json',
    'src/data/aims/south_asian.json',
    'src/data/quarantined_sex_aims.json',
    'src/data/quarantined_mt_aims.json'
  ];

  for (const relPath of filesToValidate) {
    const fullPath = path.isAbsolute(relPath) ? relPath : path.join(process.cwd(), relPath);
    validateAIMsData(fullPath);
  }

  console.log('\n🎉 All databases strictly comply with the Zero Synthetic SNPs / RSIDs Hard Rule.');
}

// Fail runFullValidation() loudly on import or execution
try {
  runFullValidation();
} catch (err) {
  if (process.argv[1] && (process.argv[1].endsWith('dataValidator.ts') || process.argv[1].endsWith('dataValidator.js'))) {
    process.exit(1);
  }
  throw err;
}
