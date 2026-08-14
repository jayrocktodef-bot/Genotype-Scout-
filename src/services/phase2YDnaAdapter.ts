import { RawSnp } from '../types/haplogroup';
import { YDnaPredictorV2, YDnaPredictionDetails } from './yDnaPredictorV2';
import { YPhylotreeDataset } from '../utils/yPhylotree';
// @ts-ignore - y_phylotree.json import
import yPhylotreeDataset from '../data/y_phylotree.json' assert { type: 'json' };
import { getHaplogroupDetails } from '../utils/haplogroupDetails';

/**
 * Phase 2 Y-DNA Analysis Bridge
 *
 * Integrates YDnaPredictorV2 (Phase 2) with the existing haplogroupPredictor flow.
 * Converts SNP maps to RawSnp format and executes the new derived-only validation engine.
 * Falls back gracefully if y_phylotree.json is unavailable.
 */

let predictorInstance: YDnaPredictorV2 | null = null;

function initializePredictor(): YDnaPredictorV2 | null {
  if (!predictorInstance) {
    try {
      if (!yPhylotreeDataset || !yPhylotreeDataset.branches) {
        console.warn('[Phase2] y_phylotree.json not available or invalid; Phase 2 analysis will be skipped.');
        return null;
      }
      predictorInstance = new YDnaPredictorV2(yPhylotreeDataset as YPhylotreeDataset);
    } catch (e) {
      console.error('[Phase2] Failed to initialize YDnaPredictorV2:', e);
      return null;
    }
  }
  return predictorInstance;
}

// @ts-ignore - y_snp_index.json import
import ySnpIndex from '../data/y_snp_index.json' assert { type: 'json' };

interface YSnpEntry {
  name: string;
  posHg38?: number;
  posHg19?: number;
  rsid?: string;
  ancestral?: string;
  derived?: string;
}

// Pre-build position and alias lookup tables for fast chip-to-tree resolution
const yPos38ToNameMap = new Map<string, string>();
const yPos19ToNameMap = new Map<string, string>();
const yAliasToNameMap = new Map<string, string>();

if (ySnpIndex && typeof ySnpIndex === 'object') {
  for (const [key, val] of Object.entries(ySnpIndex as Record<string, YSnpEntry>)) {
    if (!val) continue;
    const snpName = val.name || key;
    const keyLower = key.toLowerCase();
    yAliasToNameMap.set(keyLower, snpName);

    if (val.rsid) {
      yAliasToNameMap.set(val.rsid.toLowerCase(), snpName);
    }
    if (val.posHg38) {
      yPos38ToNameMap.set(`chry_${val.posHg38}`, snpName);
      yPos38ToNameMap.set(`${val.posHg38}`, snpName);
    }
    if (val.posHg19) {
      yPos19ToNameMap.set(`chry_${val.posHg19}`, snpName);
      yPos19ToNameMap.set(`${val.posHg19}`, snpName);
    }
  }
}

/**
 * Convert SNP map (rsid/name/position -> allele) to RawSnp array.
 * Cross-references microarray chip calls (AncestryDNA, 23andMe, MyHeritage, FTDNA, Dante WGS)
 * by rsid, coordinate (hg19/hg38), or alias name directly into y_phylotree SNP names.
 */
function snpMapToRawSnpArray(yMap: Record<string, string>): RawSnp[] {
  const result: RawSnp[] = [];
  const seenSnps = new Map<string, string>();

  for (const [rawKey, allele] of Object.entries(yMap)) {
    if (!allele || allele === '--' || allele === '00' || allele === '?' || allele === '.') {
      continue;
    }

    const keyLower = rawKey.toLowerCase();
    // 1. Direct name or alias lookup (e.g. rsid or alias -> M269)
    let canonicalName = yAliasToNameMap.get(keyLower);

    // 2. Position lookup (hg38 / hg19 coordinate cross-referencing)
    if (!canonicalName) {
      canonicalName = yPos38ToNameMap.get(keyLower) || yPos19ToNameMap.get(keyLower);
    }

    // 3. Fallback to raw key if structured name
    if (!canonicalName) {
      canonicalName = /^[A-Z]+\d+/i.test(rawKey) ? rawKey : keyLower;
    }

    if (canonicalName && !seenSnps.has(canonicalName)) {
      seenSnps.set(canonicalName, allele);
      result.push({
        name: canonicalName,
        rsid: keyLower.startsWith('rs') ? keyLower : undefined,
        allele
      });
    }
  }

  return result;
}

/**
 * Phase 2 Analysis: runs YDnaPredictorV2 against the enriched y_phylotree dataset.
 *
 * @param yMap User's Y-DNA SNP map (rsid/name -> allele)
 * @returns Phase 2 analysis result with allele validation + coverage, or null if Phase 2 unavailable
 */
export function analyzePhase2YDna(yMap: Record<string, string>): YDnaPredictionDetails | null {
  const predictor = initializePredictor();
  if (!predictor) return null;

  const rawSnps = snpMapToRawSnpArray(yMap);
  if (rawSnps.length === 0) return null;

  try {
    return predictor.predict(rawSnps);
  } catch (e) {
    console.error('[Phase2] Prediction failed:', e);
    return null;
  }
}

/**
 * Format Phase 2 result for UI display/logging.
 * Provides structured transparency on derived-only validation + coverage metrics.
 */
export function formatPhase2Result(result: YDnaPredictionDetails): {
  haplogroup: string;
  confidence: number;
  coverage: number;
  derivedMarkers: number;
  ancestralMarkers: number;
  path: string[];
  rejectedBranches: string[];
  region: string;
  description: string;
} {
  if (result.derivedSnpCount === 0 || result.terminalHaplogroup === 'N/A') {
    return {
      haplogroup: 'N/A',
      confidence: 0,
      coverage: 0,
      derivedMarkers: 0,
      ancestralMarkers: result.ancestralSnpCount,
      path: [],
      rejectedBranches: [],
      region: 'N/A',
      description: 'No derived Y-chromosome markers detected (Female XX genotype or no Y-chromosome coverage).'
    };
  }

  const details = getHaplogroupDetails(result.terminalHaplogroup, false);
  return {
    haplogroup: result.terminalHaplogroup,
    confidence: result.confidence,
    coverage: result.coverage,
    derivedMarkers: result.derivedSnpCount,
    ancestralMarkers: result.ancestralSnpCount,
    path: result.path,
    rejectedBranches: result.rejectedBranches,
    region: details.region,
    description: details.description,
  };
}
