/**
 * Strict Data Integrity & Anti-Synthetic SNP Validator
 *
 * Hard Rule: Fails with non-zero exit code if ANY synthetic SNP, placeholder coordinate,
 * fake RSID, unmapped patch scaffold, or dummy frequency profile is detected.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export const VALIDATOR_SEED = 20261003;
export const SAMPLE_RATE = 0.05;

export function isSampledMarker(rsid: string, seed: number = VALIDATOR_SEED): boolean {
  const hash = crypto.createHash('sha256').update(`${rsid.toLowerCase()}:${seed}`).digest('hex');
  return (parseInt(hash.slice(0, 8), 16) % 10000) < Math.floor(SAMPLE_RATE * 10000);
}

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
  status?: string;
  [key: string]: any;
}

const VALID_CHROMOSOMES = new Set([
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', 'X', 'Y', 'MT', 'M'
]);

// Single source of truth for parked tiebreaker anchors (hand-verified with documented reasons)
const PARKED_ANCHORS_PATH = path.join(process.cwd(), 'src/data/reference/parked_tiebreaker_anchors.json');
export const PARKED_TIEBREAKER_ANCHORS_MAP: Record<string, string> = JSON.parse(
  fs.readFileSync(PARKED_ANCHORS_PATH, 'utf-8')
);
export const PARKED_TIEBREAKER_ANCHORS = new Set<string>(
  Object.keys(PARKED_TIEBREAKER_ANCHORS_MAP).map(k => k.toLowerCase())
);

export const PANEL_FILES = new Set([
  'global.json',
  'african.json',
  'african_american.json',
  'central_asian.json',
  'east_asian.json',
  'european.json',
  'middle_eastern.json',
  'native_american.json',
  'north_african.json',
  'oceanian.json',
  'south_asian.json',
]);

// 1. dbSNP Merged Accessions Map
const MERGED_MAP_PATH = path.join(process.cwd(), 'src/data/reference/dbsnp_merged_map.json');

export function loadDbsnpMergedMap(filePath: string = MERGED_MAP_PATH): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`[validate:data] dbSNP merged map missing at: ${filePath}`);
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error(`[validate:data] dbSNP merged map is not a valid JSON dictionary: ${filePath}`);
    }
    return parsed;
  } catch (err: any) {
    if (err.message && err.message.startsWith('[validate:data]')) {
      throw err;
    }
    throw new Error(`[validate:data] Failed to parse dbSNP merged map at ${filePath}: ${err.message || err}`);
  }
}

export let dbsnpMergedMap: Record<string, string> = loadDbsnpMergedMap();

// 2. Local Ensembl GRCh38 Cache for Spot-Checking & Authenticity Verification
const ENSEMBL_CACHE_PATH = path.join(process.cwd(), 'src/data/reference/ensembl_cache.json');

export function loadEnsemblCache(
  filePath: string = ENSEMBL_CACHE_PATH
): Record<string, { chromosome: string; position: number; alleles?: string; status?: string }> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`[validate:data] Ensembl cache missing at: ${filePath}`);
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error(`[validate:data] Ensembl cache is not a valid JSON dictionary: ${filePath}`);
    }
    return parsed;
  } catch (err: any) {
    if (err.message && err.message.startsWith('[validate:data]')) {
      throw err;
    }
    throw new Error(`[validate:data] Failed to parse Ensembl cache at ${filePath}: ${err.message || err}`);
  }
}

export let ensemblCache: Record<string, { chromosome: string; position: number; alleles?: string; status?: string }> =
  loadEnsemblCache();

export function validateAimRecord(
  entry: AimEntry,
  key?: string,
  sourceName: string = 'record'
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const k = key || entry.rsid || 'unknown';
  const rsid = (entry.rsid || k).toLowerCase();
  const cleanKey = k.toLowerCase();

  // 0. Hard Rule: Reject merged / deprecated dbSNP accessions unless current ID is used
  const currentTarget = dbsnpMergedMap[rsid] || dbsnpMergedMap[cleanKey];
  if (currentTarget && rsid !== currentTarget.toLowerCase() && cleanKey !== currentTarget.toLowerCase()) {
    errors.push(
      `Deprecated merged dbSNP accession detected: '${k}' in ${sourceName}. Record must use current accession '${currentTarget}'.`
    );
  }

  // 1. Hard Rule: Reject mock or fabricated RSIDs
  if (
    rsid.includes('mock') ||
    rsid.includes('dummy') ||
    rsid.includes('synthetic') ||
    rsid.startsWith('test_')
  ) {
    errors.push(`Synthetic RSID detected: '${k}' in ${sourceName}`);
  }

  // RSID must be valid format: dbSNP (rs...), coordinate ID (chr..._...), or Kidd/ALFRED microhaplotype (mh...)
  const isValidRsid =
    /^rs\d+$/i.test(rsid) ||
    /^chr([1-9]|1\d|2[0-2]|x|y|mt)_\d+$/i.test(rsid) ||
    /^mh\d+[a-z0-9_\-\.]+$/i.test(rsid);
  if (!isValidRsid) {
    errors.push(`Invalid / non-standard accession format: '${k}' in ${sourceName}`);
  }

  // 2. Hard Rule: Reject synthetic/placeholder positions
  const pos = Number(entry.position);
  if (pos === 1000000) {
    errors.push(`Synthetic placeholder position 1,000,000 detected: '${k}' in ${sourceName}`);
  } else if (!pos || isNaN(pos) || pos <= 0) {
    errors.push(`Invalid physical coordinate '${entry.position}': '${k}' in ${sourceName}`);
  }

  // 3. Hard Rule: Reject patch scaffolds or malformed chromosomes
  const chrStr = String(entry.chromosome || '').trim().toUpperCase().replace(/^CHR/, '');
  if (!VALID_CHROMOSOMES.has(chrStr)) {
    errors.push(`Unmapped or malformed chromosome '${entry.chromosome}': '${k}' in ${sourceName}`);
  }

  // 4. Hard Rule: Reject empty or dummy frequency profiles
  if (!entry.frequencies || typeof entry.frequencies !== 'object' || Array.isArray(entry.frequencies)) {
    errors.push(`Missing frequencies object: '${k}' in ${sourceName}`);
  } else {
    const freqKeys = Object.keys(entry.frequencies);
    if (freqKeys.length === 0) {
      errors.push(`Empty frequencies object: '${k}' in ${sourceName}`);
    } else if (freqKeys.length === 1 && freqKeys[0].toUpperCase() === 'GLOBAL') {
      errors.push(`Synthetic single GLOBAL frequency: '${k}' in ${sourceName}`);
    }

    // Validate frequency values are numbers in [0, 1] and keys are not raw RSIDs
    for (const [pCode, pFreq] of Object.entries(entry.frequencies)) {
      if (pCode.toLowerCase().startsWith('rs') || pCode.length > 25) {
        errors.push(`Corrupted frequency key '${pCode}': '${k}' in ${sourceName}`);
      }
      if (typeof pFreq !== 'number' || isNaN(pFreq) || pFreq < 0 || pFreq > 1) {
        errors.push(`Invalid frequency value '${pFreq}' for pop '${pCode}': '${k}' in ${sourceName}`);
      }
    }
  }

  // 5. Weight must be positive number
  if (typeof entry.weight !== 'number' || isNaN(entry.weight) || entry.weight < 0) {
    errors.push(`Invalid weight '${entry.weight}': '${k}' in ${sourceName}`);
  }

  // 6. Hard Rule: Build must be declared as GRCh38
  if (!entry.build || entry.build !== 'GRCh38') {
    errors.push(
      `Missing or invalid build '${entry.build}': '${k}' in ${sourceName}. All records must declare build: 'GRCh38'.`
    );
  }

  // 7. Ensembl GRCh38 Authenticity & Hermetic Cache Verification
  // All weight >= 5 markers and the seeded 5% sample in all 11 panels must be present in the cache,
  // must not be UNRESOLVED, and must match chromosome and alleles.
  const isParked =
    (entry.gene && entry.gene.includes('DEEP-AIM')) ||
    PARKED_TIEBREAKER_ANCHORS.has(rsid);

  const baseSourceName = path.basename(sourceName);
  const isPanelSource = PANEL_FILES.has(baseSourceName) || baseSourceName === 'record' || sourceName === 'record';
  const isChecked = isPanelSource && !isParked && (entry.weight >= 5 || isSampledMarker(rsid));
  const cached = ensemblCache[rsid] || ensemblCache[cleanKey];

  if (isChecked && rsid.startsWith('rs')) {
    if (!cached) {
      errors.push(
        `Ensembl GRCh38 cache miss for checked marker '${k}' (weight: ${entry.weight}) in ${sourceName}. CI and validator run hermetically; all weight>=5 and sampled markers must be in ensembl_cache.json.`
      );
    } else if (cached.status === 'UNRESOLVED') {
      errors.push(
        `Ensembl GRCh38 unresolved marker '${k}' in ${sourceName}: accession could not be resolved against Ensembl variation database.`
      );
    }
  }

  if (isPanelSource && cached && cached.status !== 'UNRESOLVED' && !isParked) {
    const cachedChr = String(cached.chromosome || '').trim().toUpperCase().replace(/^CHR/, '');
    if (chrStr !== cachedChr) {
      errors.push(
        `Ensembl GRCh38 chromosome mismatch for '${k}' in ${sourceName}: panel chr${chrStr} vs Ensembl chr${cachedChr}`
      );
    }
    if (entry.alleles && cached.alleles) {
      const allowed = cached.alleles.toUpperCase().split(/[\/,|]/);
      const comp = (b: string) => ({ A: 'T', T: 'A', C: 'G', G: 'C' }[b] || b);
      for (const a of entry.alleles) {
        const upperA = a.toUpperCase();
        if (!allowed.includes(upperA) && !allowed.includes(comp(upperA))) {
          errors.push(
            `Ensembl GRCh38 allele mismatch for '${k}' in ${sourceName}: allele '${a}' not in Ensembl alleles '${cached.alleles}'`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAIMsData(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    throw new Error(`[validate:data] Panel file does not exist: ${filePath}`);
  }

  let rawData: string;
  try {
    rawData = fs.readFileSync(filePath, 'utf-8');
  } catch (err: any) {
    throw new Error(`[validate:data] Failed to read panel file at ${filePath}: ${err.message || err}`);
  }

  let data: Record<string, AimEntry>;
  try {
    data = JSON.parse(rawData);
  } catch (err: any) {
    throw new Error(`[validate:data] Corrupt or unparseable JSON in ${filePath}: ${err.message || err}`);
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error(`File does not contain a JSON dictionary object: ${filePath}`);
  }

  const errors: string[] = [];
  const entries = Object.entries(data);

  for (const [key, entry] of entries) {
    const res = validateAimRecord(entry, key, path.basename(filePath));
    if (!res.valid) {
      errors.push(...res.errors);
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

export function lintUniqueWeightSets(filePath: string): { valid: boolean; errors: string[] } {
  if (!fs.existsSync(filePath)) {
    throw new Error(`[validate:data] Weight set file missing: ${filePath}`);
  }
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch (err: any) {
    throw new Error(`[validate:data] Failed to read weight set file ${filePath}: ${err.message || err}`);
  }
  let data: Record<string, any>;
  try {
    data = JSON.parse(raw);
  } catch (err: any) {
    throw new Error(`[validate:data] Failed to parse JSON in ${filePath}: ${err.message || err}`);
  }

  const errors: string[] = [];
  const seenSets = new Map<string, string>();

  for (const [key, weights] of Object.entries(data)) {
    if (typeof weights !== 'object' || weights === null || Array.isArray(weights)) {
      continue;
    }
    const sortedKeys = Object.keys(weights).sort();
    const serialized = JSON.stringify(weights, sortedKeys);
    if (seenSets.has(serialized)) {
      const priorKey = seenSets.get(serialized)!;
      errors.push(
        `Byte-identical weight set twins detected in ${path.basename(filePath)}: '${key}' and '${priorKey}' share ${serialized}`
      );
    } else {
      seenSets.set(serialized, key);
    }
  }

  if (errors.length > 0) {
    const errorDetails = errors.slice(0, 10).map(e => `  - ${e}`).join('\n') +
      (errors.length > 10 ? `\n  ... and ${errors.length - 10} more.` : '');
    const fullMsg = `\n❌ [validate:data] ${errors.length} BYTE-IDENTICAL WEIGHT SET VIOLATION(S) in ${path.basename(filePath)}:\n${errorDetails}`;
    console.error(fullMsg);
    throw new Error(fullMsg);
  }

  console.log(`✓ [validate:data] ${path.basename(filePath).padEnd(28)}: ${Object.keys(data).length.toString().padStart(5)} unique weight sets verified (No identical twins)`);
  return { valid: true, errors: [] };
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

  // Weight set uniqueness lint
  const curatedWeightsPath = path.join(process.cwd(), 'src/data/raw_aims/custom_curated_markers.json');
  if (fs.existsSync(curatedWeightsPath)) {
    lintUniqueWeightSets(curatedWeightsPath);
  }

  console.log('\n🎉 All databases strictly comply with the Zero Synthetic SNPs / RSIDs Hard Rule.');
}

// Execute full validation when run as CLI
if (process.argv[1] && (process.argv[1].endsWith('dataValidator.ts') || process.argv[1].endsWith('dataValidator.js'))) {
  try {
    runFullValidation();
  } catch (err) {
    process.exit(1);
  }
}
