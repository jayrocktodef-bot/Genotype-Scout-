/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { processSubpopulations } from '../components/ancestryOracleLogic';
import { analyzeMtDNA, predictYDNAHaplogroup } from './haplogroupPredictor';
import { Y_DNA_TREE } from '../genotypeData';
import { loadSnpMapFromOPFS } from './opfsStorageService';

export const CURRENT_DATASET_SCHEMA_VERSION = 5;

export interface HealResult {
  updated: any[];
  hasChanges: boolean;
}

/**
 * Validates, reconstructs, and heals cached genomic datasets loaded from IndexedDB / local storage.
 * 
 * Features:
 * 1. Schema versioning (_schemaVersion = 5). Skips already-healed records for idempotency.
 * 2. Non-mutating & Atomic: Operates on deep clones; if an error occurs, falls back safely to original.
 * 3. Reconstructs missing mergedSnpMap from raw results.
 * 4. Recalculates collapsed or outdated subpopulation oracles (v3-bayesian-deconv).
 * 5. Auto-heals missing or unresolved predicted mtDNA haplogroups.
 * 6. Auto-heals missing or unresolved predicted Y-DNA haplogroups.
 */
export async function healCachedDatasets(
  saved: any[],
  snpMapsRef?: { current: Record<number, Record<string, string>> }
): Promise<HealResult> {
  if (!saved || !Array.isArray(saved) || saved.length === 0) {
    return { updated: [], hasChanges: false };
  }

  let hasChanges = false;

  const updated = await Promise.all(
    saved.map(async (ds: any, idx: number) => {
      if (!ds || typeof ds !== 'object') return ds;

      // Check if dataset is already at current schema version and fully healed
      const isAlreadyCurrent = 
        ds._schemaVersion === CURRENT_DATASET_SCHEMA_VERSION &&
        ds.mergedSnpMap &&
        ds.analysis?.subpopulationOracle?._engineVersion === 'v3-bayesian-deconv';

      if (isAlreadyCurrent) {
        if (snpMapsRef && ds.mergedSnpMap) {
          snpMapsRef.current[idx] = ds.mergedSnpMap;
        }
        return ds;
      }

      // Work on an isolated clone to ensure atomic commit semantics
      const healed = structuredClone(ds);
      let datasetModified = false;

      try {
        // 1. Backward compatibility & OPFS: retrieve mergedSnpMap if missing
        if (!healed.mergedSnpMap) {
          const datasetKey = healed.id || healed.name;
          if (datasetKey) {
            const opfsMap = await loadSnpMapFromOPFS(datasetKey);
            if (opfsMap && Object.keys(opfsMap).length > 0) {
              healed.mergedSnpMap = opfsMap;
              datasetModified = true;
            }
          }
        }

        if (!healed.mergedSnpMap && healed.results) {
          console.log('[AutoHealer] Reconstructing mergedSnpMap from results for:', healed.name);
          const reconstructed: Record<string, string> = {};
          healed.results.forEach((r: any) => {
            const rsid = (r.rsid || r.markerId || '').toLowerCase();
            if (rsid && r.genotype && r.genotype !== '--') {
              reconstructed[rsid] = r.genotype;
            }
          });
          healed.mergedSnpMap = reconstructed;
          datasetModified = true;
        }

        if (healed.mergedSnpMap && snpMapsRef) {
          snpMapsRef.current[idx] = healed.mergedSnpMap;
        }

        // 2. Auto-heal outdated, collapsed, or duplicate subpopulation deconvolution
        if (healed.analysis && healed.mergedSnpMap) {
          const oracle = healed.analysis.subpopulationOracle;
          const isCollapsed =
            !oracle ||
            !oracle.admixtureMix ||
            oracle.admixtureMix.length <= 1 ||
            (oracle.admixtureMix.length === 1 && oracle.admixtureMix[0].percentage === 100);

          const hasDuplicateBreakdown =
            oracle?.breakdown &&
            Array.isArray(oracle.breakdown) &&
            oracle.breakdown.some((b: any, index: number, arr: any[]) => {
              const name = (b.subpop || b.name || '')
                .toLowerCase()
                .replace(/\s*\([^)]*\)/g, '')
                .trim();
              return (
                arr.findIndex(
                  (x: any) =>
                    (x.subpop || x.name || '')
                      .toLowerCase()
                      .replace(/\s*\([^)]*\)/g, '')
                      .trim() === name
                ) !== index
              );
            });

          const isOutdatedEngine =
            !oracle?._engineVersion || oracle._engineVersion !== 'v3-bayesian-deconv';

          if (isCollapsed || hasDuplicateBreakdown || isOutdatedEngine) {
            console.log('[AutoHealer] Recalculating subpopulationOracle for cached dataset:', healed.name);
            const userGenotypes = Object.entries(healed.mergedSnpMap).map(([rsid, genotype]) => ({
              rsid,
              genotype: genotype as string,
            }));
            const freshOracle = await processSubpopulations(userGenotypes, []);
            healed.analysis.subpopulationOracle = {
              ...freshOracle,
              all: freshOracle,
            };
            datasetModified = true;
          }
        }

        // 3. Auto-heal missing or unresolved predictedMtDNA
        const hasResolvedMt =
          typeof healed.predictedMtDNA?.predicted === 'string' && healed.predictedMtDNA.predicted.length > 0;
        if (!hasResolvedMt && (healed.mergedMtMap || healed.mergedSnpMap)) {
          let mtMap = healed.mergedMtMap;
          if (!mtMap || Object.keys(mtMap).length === 0) {
            mtMap = {};
            if (healed.mergedSnpMetaMap) {
              for (const [rsid, meta] of Object.entries(
                healed.mergedSnpMetaMap as Record<string, { chrom: string; pos: number }>
              )) {
                if (meta && (meta.chrom === 'MT' || meta.chrom === '26' || meta.chrom === 'M')) {
                  const geno = healed.mergedSnpMap?.[rsid];
                  if (geno && geno !== '--' && geno !== '00') {
                    const allele = geno.length === 2 && geno[0] === geno[1] ? geno[0] : geno[0];
                    if (allele && allele !== '-') mtMap[String(meta.pos)] = allele;
                  }
                }
              }
            }
            if (healed.mergedSnpMap) {
              for (const [key, geno] of Object.entries(healed.mergedSnpMap as Record<string, string>)) {
                const match = key.match(/^chr(?:mt|m|26)_(\d+)$/i);
                if (match && geno && geno !== '--' && geno !== '00') {
                  const posStr = match[1];
                  const allele = geno.length === 2 && geno[0] === geno[1] ? geno[0] : geno[0];
                  if (allele && allele !== '-') mtMap[posStr] = allele;
                }
              }
            }
            if (Object.keys(mtMap).length > 0) {
              healed.mergedMtMap = mtMap;
              datasetModified = true;
            }
          }
          if (mtMap && Object.keys(mtMap).length > 0) {
            try {
              console.log('[AutoHealer] Auto-healing predictedMtDNA for cached dataset:', healed.name);
              healed.predictedMtDNA = analyzeMtDNA(mtMap, healed.mergedSnpByPosition || healed.snpByPosition);
              datasetModified = true;
            } catch (mtErr) {
              console.warn('[AutoHealer] Failed to auto-heal predictedMtDNA:', mtErr);
            }
          }
        }

        // 4. Auto-heal missing or unresolved predictedYDNA
        const hasResolvedY =
          typeof (
            healed.predictedYDNA?.phase2?.haplogroup ||
            healed.predictedYDNA?.predicted?.name ||
            (typeof healed.predictedYDNA?.predicted === 'string' ? healed.predictedYDNA.predicted : undefined)
          ) === 'string';

        if (!hasResolvedY && (healed.mergedYMap || healed.mergedSnpMap)) {
          let yMap = healed.mergedYMap;
          if (!yMap || Object.keys(yMap).length === 0) {
            yMap = {};
            if (healed.mergedSnpMetaMap) {
              for (const [rsid, meta] of Object.entries(
                healed.mergedSnpMetaMap as Record<string, { chrom: string; pos: number }>
              )) {
                if (meta && (meta.chrom === 'Y' || meta.chrom === '24')) {
                  const geno = healed.mergedSnpMap?.[rsid];
                  if (geno && geno !== '--') yMap[rsid] = geno;
                }
              }
            }
            if (healed.mergedSnpMap) {
              for (const [key, geno] of Object.entries(healed.mergedSnpMap as Record<string, string>)) {
                if ((key.startsWith('chry_') || key.startsWith('chr24_')) && geno && geno !== '--') {
                  yMap[key] = geno;
                }
              }
            }
            if (Object.keys(yMap).length > 0) {
              healed.mergedYMap = yMap;
              datasetModified = true;
            }
          }
          if (yMap && Object.keys(yMap).length > 0) {
            try {
              console.log('[AutoHealer] Auto-healing predictedYDNA for cached dataset:', healed.name);
              healed.predictedYDNA = predictYDNAHaplogroup(
                yMap,
                Y_DNA_TREE,
                healed.mergedSnpByPosition || healed.snpByPosition
              );
              datasetModified = true;
            } catch (yErr) {
              console.warn('[AutoHealer] Failed to auto-heal predictedYDNA:', yErr);
            }
          }
        }

        // Stamp schema version and migration metadata
        healed._schemaVersion = CURRENT_DATASET_SCHEMA_VERSION;
        healed._healedAt = Date.now();
        if (datasetModified) {
          hasChanges = true;
        }

        return healed;
      } catch (err) {
        console.error('[AutoHealer] Error during dataset healing, returning safe original:', err);
        return ds;
      }
    })
  );

  return { updated, hasChanges };
}
