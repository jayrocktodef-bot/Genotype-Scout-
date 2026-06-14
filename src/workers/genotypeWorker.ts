import { parseRawDNA, parseRawDNAStream } from '../services/dnaParser';
import { applyLightImputation } from '../utils/ancestry/lightImputation';
import { matchSNPs, getAllSources } from '../services/snpMatcher';
import { predictYDNAHaplogroup, analyzeMtDNA } from '../services/haplogroupPredictor';
import { Y_DNA_TREE } from '../constants/haplogroups';
import { getMarkerAllowlist } from '../utils/markerAllowlist';
import { calculateAncestryOracle } from '../services/ancestryEngine';
import { extractSampleId } from '../services/populationMapper';
import { calculateMarkerBenchmarks } from "../utils/markerBenchmarks";
import { calculateAncientAdmixture, calculateIndividualMatches } from "../lib/AncientAdmixtureCalculator";
import { calculateFamousMatches } from "../utils/individualMatching";
import { matchHealthAndWellness } from "../utils/healthMatching";
import { calculatePopulationProximityOptimized, compileReferenceKernel } from '../engines/ancestry/fastMatrixEngine';
import { extractPlinkGenotype } from '../utils/plinkUtils';
import { processSubpopulations } from '../components/ancestryOracleLogic';
import { loadMasterAims } from '../data/index';
import { calculateMDLPK16Scores } from "../engines/ancestry/mdlpAncEngine";
import { calculateRegionalScores } from "../engines/ancestry/grafAncEngine";
import { identifyMicroHapSignatures } from "../engines/ancestry/microHapEngine";
import { calculateComprehensiveScores } from "../engines/ancestry/comprehensiveEngine";

compileReferenceKernel();

// ── Sanitize payload without the expensive JSON round-trip ───────────
// Recursively strips non-structured-cloneable values (Promises, functions,
// Maps, Sets) without serializing/deserializing the entire result tree.
function sanitizePayload(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'function' || obj instanceof Promise) return undefined;
  if (obj instanceof Map) return Object.fromEntries(obj);
  if (obj instanceof Set) return Array.from(obj);
  if (ArrayBuffer.isView(obj)) return obj; // TypedArrays are cloneable
  if (obj instanceof ArrayBuffer) return obj;
  if (Array.isArray(obj)) {
    const arr: any[] = new Array(obj.length);
    for (let i = 0; i < obj.length; i++) {
      arr[i] = sanitizePayload(obj[i]);
    }
    return arr;
  }
  if (typeof obj === 'object') {
    const clean: any = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const val = sanitizePayload(obj[keys[i]]);
      if (val !== undefined) clean[keys[i]] = val;
    }
    return clean;
  }
  return obj; // primitives (string, number, boolean)
}

// ── Engine metadata for progress reporting ───────────────────────────
const ENGINE_LABELS: Record<string, string> = {
  matchSNPs: 'Matching 17K+ genomic markers',
  calculateAncientAdmixture: 'Computing ancient admixture',
  calculateIndividualMatches: 'Matching individual profiles',
  calculateFamousMatches: 'Analyzing notable matches',
  matchHealthAndWellness: 'Scoring health & wellness markers',
  calculatePopulationProximityOptimized: 'Computing population proximity matrix',
  calculateMarkerBenchmarks: 'Benchmarking marker coverage',
  calculateMDLPK16Scores: 'Running MDLP-K16 calculator',
  calculateRegionalScores: 'Running GRAF regional scorer',
  identifyMicroHapSignatures: 'Detecting microhaplotype signatures',
  calculateComprehensiveScores: 'Running comprehensive engine',
};

// ── Parallel analysis engine dispatcher ──────────────────────────────
// Fans out CPU-bound analysis tasks across real worker threads.
// Falls back to sequential execution if nested workers aren't supported.
type EngineTask = {
  engine: string;
  snpMap: Record<string, string>;
  snpMetaMap?: Record<string, { chrom: string; pos: number }>;
};

function canSpawnNestedWorkers(): boolean {
  try {
    // Feature-detect by checking if Worker constructor is available in worker scope
    return typeof Worker !== 'undefined';
  } catch {
    return false;
  }
}

async function runEnginesParallel(
  imputedSnpMap: Record<string, string>,
  mergedSnpMetaMap: Record<string, { chrom: string; pos: number }>,
  onEngineProgress: (completed: number, total: number, label: string) => void
): Promise<Record<string, any>> {
  const engines = [
    'matchSNPs',
    'calculateAncientAdmixture',
    'calculateIndividualMatches',
    'calculateFamousMatches',
    'matchHealthAndWellness',
    'calculatePopulationProximityOptimized',
    'calculateMarkerBenchmarks',
    'calculateMDLPK16Scores',
    'calculateRegionalScores',
    'identifyMicroHapSignatures',
    'calculateComprehensiveScores',
  ];

  const totalEngines = engines.length;
  let completedCount = 0;

  // ── Try parallel dispatch via nested workers ───────────────────
  if (canSpawnNestedWorkers()) {
    try {
      // Cap the pool size at 2 to avoid memory pressure from spawning multiple heavy (15MB+) worker threads
      const poolSize = Math.min(Math.min(navigator.hardwareConcurrency || 4, 2), engines.length);
      const workers: Worker[] = [];

      for (let i = 0; i < poolSize; i++) {
        workers.push(
          new Worker(new URL('./analysisWorker.ts', import.meta.url), { type: 'module' })
        );
      }

      const results: Record<string, any> = {};
      const queue = [...engines];
      let nextWorkerIdx = 0;

      await new Promise<void>((resolve, reject) => {
        let settled = false;

        const dispatchNext = (worker: Worker) => {
          const engine = queue.shift();
          if (!engine) return;

          const taskId = engine;
          const onMsg = (e: MessageEvent) => {
            if (e.data.taskId !== taskId) return;
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);

            if (e.data.type === 'SUCCESS') {
              results[engine] = e.data.result;
              completedCount++;
              onEngineProgress(completedCount, totalEngines, ENGINE_LABELS[engine] || engine);

              // Dispatch next task to this free worker
              if (queue.length > 0) {
                dispatchNext(worker);
              }

              if (completedCount === totalEngines && !settled) {
                settled = true;
                // Terminate all workers
                workers.forEach(w => w.terminate());
                resolve();
              }
            } else if (e.data.type === 'ERROR' && !settled) {
              settled = true;
              workers.forEach(w => w.terminate());
              reject(new Error(`Engine ${engine} failed: ${e.data.error}`));
            }
          };

          const onErr = (err: any) => {
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);
            if (!settled) {
              settled = true;
              workers.forEach(w => w.terminate());
              reject(err);
            }
          };

          worker.addEventListener('message', onMsg);
          worker.addEventListener('error', onErr);

          worker.postMessage({
            taskId,
            engine,
            snpMap: imputedSnpMap,
            snpMetaMap: engine === 'matchSNPs' ? mergedSnpMetaMap : undefined,
          });
        };

        // Launch initial batch — one task per worker
        for (const worker of workers) {
          if (queue.length > 0) {
            dispatchNext(worker);
          }
        }
      });

      return results;
    } catch (nestedErr) {
      console.warn('⚠️ Nested workers failed, falling back to sequential:', nestedErr);
      // Fall through to sequential
    }
  }

  // ── Sequential fallback (Safari, or nested worker failure) ─────
  return runEnginesSequential(imputedSnpMap, mergedSnpMetaMap, onEngineProgress);
}

// ── Sequential fallback ──────────────────────────────────────────────
async function runEnginesSequential(
  imputedSnpMap: Record<string, string>,
  mergedSnpMetaMap: Record<string, { chrom: string; pos: number }>,
  onEngineProgress: (completed: number, total: number, label: string) => void
): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  const snpMapForEngine = new Map(Object.entries(imputedSnpMap));
  let completed = 0;
  const total = 11;

  const run = async (name: string, fn: () => any) => {
    onEngineProgress(completed, total, ENGINE_LABELS[name] || name);
    results[name] = await fn();
    completed++;
  };

  await run('matchSNPs', () => matchSNPs(imputedSnpMap, mergedSnpMetaMap));
  await run('calculateAncientAdmixture', () => calculateAncientAdmixture(imputedSnpMap));
  await run('calculateIndividualMatches', () => calculateIndividualMatches(imputedSnpMap));
  await run('calculateFamousMatches', () => calculateFamousMatches(imputedSnpMap));
  await run('matchHealthAndWellness', () => matchHealthAndWellness(imputedSnpMap));
  await run('calculatePopulationProximityOptimized', () => calculatePopulationProximityOptimized(snpMapForEngine));
  await run('calculateMarkerBenchmarks', () => calculateMarkerBenchmarks(imputedSnpMap));
  await run('calculateMDLPK16Scores', () => calculateMDLPK16Scores(imputedSnpMap));
  await run('calculateRegionalScores', () => calculateRegionalScores(imputedSnpMap));
  await run('identifyMicroHapSignatures', () => identifyMicroHapSignatures(imputedSnpMap));
  await run('calculateComprehensiveScores', () => calculateComprehensiveScores(imputedSnpMap));

  onEngineProgress(total, total, 'All engines complete');
  return results;
}

// ── Main orchestration ───────────────────────────────────────────────
async function runGenotypeScout(
    imputedSnpMap: Record<string, string>,
    mergedSnpMetaMap: Record<string, { chrom: string, pos: number }>,
    names: string[],
    sab: any
) {
    // Fan out all CPU-bound engines across real worker threads
    const engineResults = await runEnginesParallel(
      imputedSnpMap,
      mergedSnpMetaMap,
      (completed, total, label) => {
        if (sab) {
          const progressArray = new Int32Array(sab);
          Atomics.store(progressArray, 0, completed);
          Atomics.store(progressArray, 1, total);
          Atomics.store(progressArray, 3, 2); // still in "analyzing" phase
        } else {
          self.postMessage({
            type: 'PROGRESS',
            payload: { 
              step: `${label}... (${completed}/${total})`,
              completed,
              totalEngines: total,
              statusVal: 2
            }
          });
        }
      }
    );

    const ancestryResult = engineResults.matchSNPs;
    const bloodResult = {
      ancientAdmixture: engineResults.calculateAncientAdmixture,
      individualMatches: engineResults.calculateIndividualMatches,
      famousMatches: engineResults.calculateFamousMatches,
      healthWellness: engineResults.matchHealthAndWellness,
      populationProximity: engineResults.calculatePopulationProximityOptimized,
      markerBenchmarks: engineResults.calculateMarkerBenchmarks,
      mdlpResults_raw: engineResults.calculateMDLPK16Scores,
      grafResults_raw: engineResults.calculateRegionalScores,
      microHapResults: engineResults.identifyMicroHapSignatures,
      comprehensiveResults: engineResults.calculateComprehensiveScores,
    };

    const sampleId = names[0] ? (extractSampleId(names[0]) ?? undefined) : undefined;
    const oracleResults = await calculateAncestryOracle(
      ancestryResult.filter((r: any) => r.category === 'Ancestry'),
      undefined,
      undefined,
      bloodResult.grafResults_raw,
      bloodResult.mdlpResults_raw,
      bloodResult.comprehensiveResults,
      sampleId
    );

    return { ancestryResult, bloodResult, oracleResults };
}

self.onmessage = async (e: MessageEvent) => {
  const { type, files, payload, sab } = e.data;
  if (type !== 'PROCESS_GENOME' && type !== 'PLINK_PROCESS_GENOME' && !files) return;
  if (sab) { new Int32Array(sab)[3] = 1; }

  try {
    await compileReferenceKernel();
    const allowlist = getMarkerAllowlist();
    let imputedSnpMap: Record<string, string> = {};
    let mergedSnpMetaMap: Record<string, { chrom: string, pos: number }> = {};
    let mergedYMap: Record<string, string> = {};
    let mergedMtMap: Record<string, string> = {};
    let chips: string[] = [];
    let names: string[] = [];
    let totalSnps = 0;

    if (type === 'PLINK_PROCESS_GENOME') {
        const { bedBuffer, bimEntries } = payload;
        const bimLookup = new Map<string, number>();
        bimEntries.forEach((entry: any, index: number) => bimLookup.set(entry.rsid, index));
        for (const allowedRsid of allowlist) {
            const rowIdx = bimLookup.get(allowedRsid);
            if (rowIdx !== undefined) imputedSnpMap[allowedRsid] = extractPlinkGenotype(bedBuffer, rowIdx);
        }
        names = ['PLINK Data']; chips = ['PLINK Dataset']; totalSnps = bimEntries.length;
    } else {
        const filesToProcess = files || (payload ? [{ buffer: payload, name: 'Uploaded Kit' }] : []);
        const decoder = new TextDecoder();
        let parsedFiles = [];
        
        for (const fileObj of filesToProcess) {
          const fileName = fileObj.name || 'Uploaded Kit';
          
          let parsed;
          if (fileObj.buffer) {
            parsed = parseRawDNA(decoder.decode(fileObj.buffer), allowlist, (processed, total, snps) => {
              if (sab) {
                const progressArray = new Int32Array(sab);
                Atomics.store(progressArray, 0, processed); Atomics.store(progressArray, 1, total); Atomics.store(progressArray, 2, snps);
              } else {
                self.postMessage({ type: 'PROGRESS', payload: { processed, total, snps } });
              }
            });
          } else {
            // Fallback for standard non-transferred File/Blob object
            const actualFile = fileObj.stream ? fileObj : (fileObj.file ? fileObj.file : null);
            if (actualFile && typeof actualFile.stream === 'function') {
              parsed = await parseRawDNAStream(actualFile, allowlist, (processed, total, snps) => {
                if (sab) {
                  const progressArray = new Int32Array(sab);
                  Atomics.store(progressArray, 0, processed); Atomics.store(progressArray, 1, total); Atomics.store(progressArray, 2, snps);
                } else {
                  self.postMessage({ type: 'PROGRESS', payload: { processed, total, snps } });
                }
              });
            } else if (actualFile) {
              parsed = parseRawDNA(decoder.decode(await actualFile.arrayBuffer()), allowlist, (processed, total, snps) => {
                if (sab) {
                  const progressArray = new Int32Array(sab);
                  Atomics.store(progressArray, 0, processed); Atomics.store(progressArray, 1, total); Atomics.store(progressArray, 2, snps);
                } else {
                  self.postMessage({ type: 'PROGRESS', payload: { processed, total, snps } });
                }
              });
            } else {
              throw new Error("Invalid file object structure passed to worker");
            }
          }
          parsedFiles.push({ ...parsed, name: fileName });
        }
        
        let mergedSnpMap: Record<string, string> = {};
        for (const pf of parsedFiles) {
          names.push(pf.name); chips.push(pf.chip); totalSnps += pf.snpCount;
          Object.assign(mergedSnpMetaMap, pf.snpMetaMap); Object.assign(mergedYMap, pf.yMap); Object.assign(mergedMtMap, pf.mtMap);
          for (const rsid in pf.snpMap) {
            if (!mergedSnpMap[rsid] || pf.snpMap[rsid].length > mergedSnpMap[rsid].length) mergedSnpMap[rsid] = pf.snpMap[rsid];
          }
        }
        imputedSnpMap = applyLightImputation(mergedSnpMap);
    }

    if (sab) { 
      Atomics.store(new Int32Array(sab), 3, 2); 
    } else {
      self.postMessage({ type: 'PROGRESS', payload: { step: "Engaging Bayesian Ancestry Engine..." } });
    }
    
    // Orchestration — now fans out across multiple workers
    const { ancestryResult, bloodResult, oracleResults } = await runGenotypeScout(imputedSnpMap, mergedSnpMetaMap, names, sab);
    
    const predictedYDNA = predictYDNAHaplogroup(mergedYMap, Y_DNA_TREE);
    const predictedMtDNA = analyzeMtDNA(mergedMtMap);
    
    const userGenotypes = Object.entries(imputedSnpMap).map(([rsid, genotype]) => ({ rsid, genotype }));
    const sampleId = names[0] ? (extractSampleId(names[0]) ?? undefined) : undefined;
    const subpopulationOracle = processSubpopulations(userGenotypes, [], sampleId, mergedSnpMetaMap);
    const naiveEstimates = calculateNaiveEthnicity(imputedSnpMap); 
    
    if (sab) { 
      Atomics.store(new Int32Array(sab), 3, 3); 
    } else {
      self.postMessage({ type: 'PROGRESS', payload: { step: "Completing Profiler..." } });
    }

    // Targeted sanitization — replaces the expensive JSON.parse(JSON.stringify()) round-trip.
    // Only strips non-structured-cloneable types (Maps, Sets, Promises, functions).
    const rawPayload = { 
      name: names[0], 
      results: ancestryResult, 
      chip: chips[0] || "Unknown Chip",
      snpCount: totalSnps,
      predictedYDNA, predictedMtDNA, mergedMtMap,
      mergedSnpMap: imputedSnpMap,
      analysis: { 
        ...bloodResult,
        oracleResults, 
        naiveEstimates,
        subpopulationOracle
      } 
    };
    const safePayload = sanitizePayload(rawPayload);

    self.postMessage({ 
      type: 'SUCCESS', 
      payload: safePayload 
    });
  } catch (err) {
    if (sab) { 
      Atomics.store(new Int32Array(sab), 3, 4); 
    } else {
      self.postMessage({ type: 'PROGRESS', payload: { step: "Ingestion failed." } });
    }
    self.postMessage({ type: 'ERROR', error: { message: err instanceof Error ? err.message : String(err) } });
  }
};

let masterAimsCache: any = null;
const getMasterAims = () => {
  if (!masterAimsCache) masterAimsCache = loadMasterAims();
  return masterAimsCache;
};

function calculateNaiveEthnicity(snpMap: Record<string, string>) {
    const totalSim: Record<string, number> = {};
    const counts: Record<string, number> = {};
    const aims = getMasterAims() as any;
    const usedRsids = new Set<string>();

    // Pre-map the database by base rsid (without regional suffix)
    const aimBaseMap = new Map<string, any[]>();
    for (const [key, value] of Object.entries(aims)) {
        const base = key.split('_')[0].toLowerCase();
        if (!aimBaseMap.has(base)) aimBaseMap.set(base, []);
        aimBaseMap.get(base)!.push(value);
    }

    for (const [rsid, genotype] of Object.entries(snpMap)) {
        const matchedAims = aimBaseMap.get(rsid.toLowerCase());
        if (matchedAims) {
            for (const aim of matchedAims) {
                if (aim && aim.frequencies) {
                    if (usedRsids.has(rsid)) continue;

                    const cleanGenotype = genotype.toUpperCase().replace(/[\s\/_]/g, '');
                    if (!cleanGenotype || cleanGenotype.length < 1 || cleanGenotype.includes('-') || cleanGenotype.includes('N')) {
                        continue;
                    }

                    const effectAlleles = aim.alleles || [];
                    if (effectAlleles.length === 0) continue;
                    const effectAllele = effectAlleles[0].toUpperCase();

                    let k = 0;
                    let validLength = 0;
                    for (const char of cleanGenotype) {
                        if (['A', 'C', 'G', 'T', 'I', 'D'].includes(char)) {
                            validLength++;
                            if (char === effectAllele) {
                                k++;
                            }
                        }
                    }

                    if (validLength === 0) continue;

                    let dosage = k;
                    if (validLength === 1) {
                        dosage = k * 2;
                    }

                    const userFreq = dosage / 2; // 0.0, 0.5, or 1.0

                    for (const [pop, freq] of Object.entries(aim.frequencies as Record<string, number>)) {
                        // Skip system, global, or compound reference tags
                        const cleanPop = pop.toUpperCase().trim();
                        if (cleanPop === 'GLOBAL' || cleanPop === 'ASI') {
                            continue;
                        }

                        const p = freq as number;
                        const distance = (userFreq - p) * (userFreq - p);
                        const sim = 1.0 - distance;
                        totalSim[pop] = (totalSim[pop] || 0) + sim;
                        counts[pop] = (counts[pop] || 0) + 1;
                    }

                    // Deduplicate by rsid (not gene name) so that multiple distinct markers
                    // on the same gene (e.g., multiple HBB sickle-cell markers) are all scored.
                    usedRsids.add(rsid);
                }
            }
        }
    }

    const avgSim: Record<string, number> = {};
    for (const pop in totalSim) {
        // Enforce a higher baseline threshold (e.g., 20) for naive estimates to prevent
        // thin reference panel components (e.g., Siberian, Oceanian) from getting inflated
        // averages due to a handful of matched SNPs.
        if (counts[pop] >= 20) {
            avgSim[pop] = totalSim[pop] / counts[pop];
        }
    }

    // Power transformation to boost contrast and resolve distinct ancestral profiles cleanly
    const transformed: Record<string, number> = {};
    let totalTransformed = 0;
    for (const pop in avgSim) {
        const val = Math.pow(avgSim[pop], 8); // Slightly higher exponent for cleaner resolution
        transformed[pop] = val;
        totalTransformed += val;
    }

    const finalScores: Record<string, number> = {};
    if (totalTransformed > 0) {
        for (const pop in transformed) {
            finalScores[pop] = (transformed[pop] / totalTransformed) * 100;
        }
    }
    return finalScores;
}
