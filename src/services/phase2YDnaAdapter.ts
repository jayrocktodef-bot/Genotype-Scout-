import { RawSnp } from '../types/haplogroup';
import { YDnaPredictorV2, YDnaPredictionDetails } from './yDnaPredictorV2';
import { YPhylotreeDataset } from '../utils/yPhylotree';
// @ts-ignore - y_phylotree.json import
import yPhylotreeDataset from '../data/y_phylotree.json' assert { type: 'json' };

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

/**
 * Convert SNP map (rsid/name -> allele) to RawSnp array.
 * Prioritizes SNP names (M269, M2, etc.) over rsids for y_phylotree lookup.
 */
function snpMapToRawSnpArray(yMap: Record<string, string>): RawSnp[] {
  const result: RawSnp[] = [];
  for (const [key, allele] of Object.entries(yMap)) {
    if (!allele || allele === '--' || allele === '00' || allele === '?' || allele === '.') {
      continue;
    }
    // Try to detect if key is SNP name (M269) or rsid (rs123)
    const isSNPName = /^[A-Z]+\d+/.test(key);
    result.push(
      isSNPName
        ? { name: key, allele }
        : { rsid: key, allele }
    );
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
} {
  return {
    haplogroup: result.terminalHaplogroup,
    confidence: result.confidence,
    coverage: result.coverage,
    derivedMarkers: result.derivedSnpCount,
    ancestralMarkers: result.ancestralSnpCount,
    path: result.path,
    rejectedBranches: result.rejectedBranches,
  };
}
