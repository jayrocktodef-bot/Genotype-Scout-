import { parseRawDNA, parseRawDNAStream, GenomicsParseError } from '../services/dnaParser';
import { unzipSync } from 'fflate';
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
import { calculateHumanOriginsScores } from "../engines/ancestry/humanOriginsEngine";
import { calculateRegionalScores } from "../engines/ancestry/grafAncEngine";
import { identifyMicroHapSignatures } from "../engines/ancestry/microHapEngine";
import { calculateComprehensiveScores } from "../engines/ancestry/comprehensiveEngine";
import { identifyRareAndNovelVariants } from "../utils/rareVariantsAnalyzer";
import { calculatePharmacogenomics } from '../services/pgxEngine';

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
  calculateHumanOriginsScores: 'Running Human Origins K61 calculator',
  calculateRegionalScores: 'Determining regional affinity',
  identifyMicroHapSignatures: 'Detecting microhaplotype signatures',
  calculateComprehensiveScores: 'Running comprehensive engine',
};

// ── Helper to filter out Y-DNA, mtDNA, and sex chromosomes (X/Y) to isolate deconvolution from haplogroups ──
function filterAutosomalSNPs(
  snpMap: Record<string, string>,
  snpMetaMap: Record<string, { chrom: string; pos: number }>
): { filteredSnpMap: Record<string, string>; filteredMetaMap: Record<string, { chrom: string; pos: number }> } {
  const filteredSnpMap: Record<string, string> = {};
  const filteredMetaMap: Record<string, { chrom: string; pos: number }> = {};

  const isSexOrMt = (chrom: string): boolean => {
    const c = String(chrom).toUpperCase().replace('CHR', '');
    return c === 'X' || c === 'Y' || c === 'MT' || c === 'M' || c === '23' || c === '24' || c === '25' || c === '26';
  };

  const isSexOrMtKey = (key: string): boolean => {
    const k = key.toLowerCase();
    return k.startsWith('chry_') ||
           k.startsWith('chrx_') ||
           k.startsWith('chrmt_') ||
           k.startsWith('chrm_') ||
           k.startsWith('chr23_') ||
           k.startsWith('chr24_') ||
           k.startsWith('chr25_') ||
           k.startsWith('chr26_');
  };

  for (const rsid in snpMap) {
    if (isSexOrMtKey(rsid)) continue;

    const meta = snpMetaMap[rsid];
    if (meta && isSexOrMt(meta.chrom)) continue;

    const genotype = snpMap[rsid];
    filteredSnpMap[rsid] = genotype;
    if (meta) {
      filteredMetaMap[rsid] = meta;
    }
  }

  return { filteredSnpMap, filteredMetaMap };
}

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
  autosomalSnpMap: Record<string, string>,
  autosomalMetaMap: Record<string, { chrom: string; pos: number }>,
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
    'calculateHumanOriginsScores',
    'calculateRegionalScores',
    'identifyMicroHapSignatures',
    'calculateComprehensiveScores',
  ];

  const totalEngines = engines.length;
  let completedCount = 0;

  // ── Try parallel dispatch via nested workers ───────────────────
  if (canSpawnNestedWorkers()) {
    try {
      // Allow up to the hardware concurrency (capped at 8 for sanity) to maximize parallel dispatch for heavy calculations
      const poolSize = Math.min(Math.min(navigator.hardwareConcurrency || 4, 8), engines.length);
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

          const isDeconvolutionEngine = engine !== 'matchSNPs' && engine !== 'matchHealthAndWellness' && engine !== 'calculateMarkerBenchmarks';
          const targetSnpMap = isDeconvolutionEngine ? autosomalSnpMap : imputedSnpMap;
          const targetMetaMap = isDeconvolutionEngine ? autosomalMetaMap : mergedSnpMetaMap;

          worker.postMessage({
            taskId,
            engine,
            snpMap: targetSnpMap,
            snpMetaMap: engine === 'matchSNPs' ? targetMetaMap : undefined,
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
  return runEnginesSequential(imputedSnpMap, mergedSnpMetaMap, autosomalSnpMap, autosomalMetaMap, onEngineProgress);
}

// ── Sequential fallback ──────────────────────────────────────────────
async function runEnginesSequential(
  imputedSnpMap: Record<string, string>,
  mergedSnpMetaMap: Record<string, { chrom: string; pos: number }>,
  autosomalSnpMap: Record<string, string>,
  autosomalMetaMap: Record<string, { chrom: string; pos: number }>,
  onEngineProgress: (completed: number, total: number, label: string) => void
): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  const autosomalSnpMapForEngine = new Map(Object.entries(autosomalSnpMap));
  let completed = 0;
  const total = 10;

  const run = async (name: string, fn: () => any) => {
    onEngineProgress(completed, total, ENGINE_LABELS[name] || name);
    // Yield to the event loop to let progress updates transmit and reset watchdog
    await new Promise(resolve => setTimeout(resolve, 0));
    results[name] = await fn();
    completed++;
  };

  await run('matchSNPs', () => matchSNPs(imputedSnpMap, mergedSnpMetaMap));
  await run('calculateAncientAdmixture', () => calculateAncientAdmixture(autosomalSnpMap));
  await run('calculateIndividualMatches', () => calculateIndividualMatches(autosomalSnpMap));
  await run('calculateFamousMatches', () => calculateFamousMatches(autosomalSnpMap));
  await run('matchHealthAndWellness', () => matchHealthAndWellness(imputedSnpMap));
  await run('calculatePopulationProximityOptimized', () => calculatePopulationProximityOptimized(autosomalSnpMapForEngine));
  await run('calculateMarkerBenchmarks', () => calculateMarkerBenchmarks(imputedSnpMap));
  await run('calculateHumanOriginsScores', () => calculateHumanOriginsScores(autosomalSnpMap));
  await run('calculateRegionalScores', () => calculateRegionalScores(autosomalSnpMap));
  await run('identifyMicroHapSignatures', () => identifyMicroHapSignatures(autosomalSnpMap));
  await run('calculateComprehensiveScores', () => calculateComprehensiveScores(autosomalSnpMap));

  onEngineProgress(total, total, 'All engines complete');
  return results;
}

// ── Main orchestration ───────────────────────────────────────────────
async function runGenotypeScout(
    imputedSnpMap: Record<string, string>,
    mergedSnpMetaMap: Record<string, { chrom: string, pos: number }>,
    autosomalSnpMap: Record<string, string>,
    autosomalMetaMap: Record<string, { chrom: string, pos: number }>,
    names: string[],
    sab: any
) {
    // Fan out all CPU-bound engines across real worker threads
    const engineResults = await runEnginesParallel(
      imputedSnpMap,
      mergedSnpMetaMap,
      autosomalSnpMap,
      autosomalMetaMap,
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
      humanOriginsResults_raw: engineResults.calculateHumanOriginsScores,
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
      bloodResult.humanOriginsResults_raw,
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
          try {
            if (fileObj.buffer) {
              let actualBuffer = fileObj.buffer;
              
              // 1. Detect ZIP signature (PK\x03\x04) for automatic decompression
              const headerBytes = new Uint8Array(actualBuffer, 0, Math.min(4, actualBuffer.byteLength));
              if (headerBytes.length >= 4 && headerBytes[0] === 0x50 && headerBytes[1] === 0x4B && headerBytes[2] === 0x03 && headerBytes[3] === 0x04) {
                const unzipped = unzipSync(new Uint8Array(actualBuffer));
                // Find the first valid text file in the archive (ignoring __MACOSX etc)
                const textFileKey = Object.keys(unzipped).find(k => !k.startsWith('__MACOSX/') && (k.endsWith('.txt') || k.endsWith('.csv') || !k.includes('.')));
                if (textFileKey) {
                  actualBuffer = unzipped[textFileKey].buffer;
                } else {
                  throw new GenomicsParseError("ZIP archive does not contain a recognizable text file.", { errorCode: "ERR_ZIP_DECODE_02" });
                }
              }

              // 2. Use Stream-based parsing via Blob to prevent V8 String 1GB Limit / OOM
              const actualFile = new Blob([actualBuffer]);
              parsed = await parseRawDNAStream(actualFile, allowlist, (processed, total, snps) => {
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
                // If it doesn't support streams, fallback to arrayBuffer
                parsed = await parseRawDNAStream(new Blob([await actualFile.arrayBuffer()]), allowlist, (processed, total, snps) => {
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
          } catch (error: any) {
             console.error("Worker parsing error:", error);
             throw error; // Re-throw so the main try-catch catches it and posts ERR
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
    
    const { filteredSnpMap: autosomalSnpMap, filteredMetaMap: autosomalMetaMap } = filterAutosomalSNPs(imputedSnpMap, mergedSnpMetaMap);

    // Orchestration — now fans out across multiple workers
    const { ancestryResult, bloodResult, oracleResults } = await runGenotypeScout(imputedSnpMap, mergedSnpMetaMap, autosomalSnpMap, autosomalMetaMap, names, sab);
    
    const predictedYDNA = predictYDNAHaplogroup(mergedYMap, Y_DNA_TREE);
    const predictedMtDNA = analyzeMtDNA(mergedMtMap);
    
    const autosomalUserGenotypes = Object.entries(autosomalSnpMap).map(([rsid, genotype]) => ({ rsid, genotype }));
    const sampleId = names[0] ? (extractSampleId(names[0]) ?? undefined) : undefined;
    const subpopulationOracle = await processSubpopulations(autosomalUserGenotypes, [], sampleId, autosomalMetaMap);
    const naiveEstimates = calculateNaiveEthnicity(autosomalSnpMap); 
    
    if (sab) { 
      Atomics.store(new Int32Array(sab), 3, 3); 
    } else {
      self.postMessage({ type: 'PROGRESS', payload: { step: "Completing Profiler..." } });
    }

    // ── Rare & Novel Variants Identification ──
    const knownDbKeys = new Set<string>();
    const aims = getMasterAims();
    if (aims) {
      for (const k of Object.keys(aims)) knownDbKeys.add(k.toLowerCase().split('_')[0]);
    }
    const rareAndNovelVariants = identifyRareAndNovelVariants(imputedSnpMap, knownDbKeys, aims);

    // Targeted sanitization — replaces the expensive JSON.parse(JSON.stringify()) round-trip.
    // Only strips non-structured-cloneable types (Maps, Sets, Promises, functions).
    const rawPayload = { 
      name: names[0], 
      results: ancestryResult, 
      chip: chips[0] || "Unknown Chip",
      snpCount: totalSnps,
      predictedYDNA, predictedMtDNA, mergedMtMap,

      mergedSnpMap: imputedSnpMap,
      prsResults: undefined,
      pgxResults: calculatePharmacogenomics(imputedSnpMap),
      mergedSnpMetaMap,
      rareAndNovelVariants,
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

function calculateNaiveEthnicity(snpMap: Record<string, string>): Record<string, number> {
    const MIN_MARKERS = 5;           // minimum markers to report a population
    const SMOOTH = 0.001;            // floor/ceiling for allele frequencies to avoid log(0)

    const totalLogProb: Record<string, number> = {};
    const markerCounts: Record<string, number> = {};

    const aims = getMasterAims() as any;
    const aimBaseMap = new Map<string, any[]>();
    // Pre-map AIMS by their base rsid (ignore region/isoform suffixes)
    for (const [key, value] of Object.entries(aims)) {
        const base = key.split('_')[0].toLowerCase();
        if (!aimBaseMap.has(base)) aimBaseMap.set(base, []);
        aimBaseMap.get(base)!.push(value);
    }

    const usedRsids = new Set<string>();   // avoid processing the same user rsid twice

    for (const rsid in snpMap) {
        const base = rsid.toLowerCase();
        const matchedAims = aimBaseMap.get(base);
        if (!matchedAims || usedRsids.has(base)) continue;
        usedRsids.add(base);

        const genotype = snpMap[rsid];

        // Clean genotype: remove whitespace, '/', '_'; keep only A, C, G, T, I, D
        const cleanGenotype = genotype.toUpperCase().replace(/[\s\/_]/g, '');
        if (!cleanGenotype || cleanGenotype.includes('-') || cleanGenotype.includes('N')) continue;

        // Extract valid allele characters; determine ploidy
        let validAlleles = '';
        for (const ch of cleanGenotype) {
            if ('ACGTID'.includes(ch)) validAlleles += ch;
        }
        const ploidy = validAlleles.length;
        if (ploidy === 0) continue;

        // For each matched AIM entry (allows multiple entries per rsid)
        for (const aim of matchedAims) {
            if (!aim || !aim.frequencies) continue;
            const effectAlleles = aim.alleles || [];
            if (effectAlleles.length === 0) continue;
            const effectAllele = effectAlleles[0].toUpperCase();

            // Count how many effect alleles are present
            let k = 0;
            for (const ch of validAlleles) {
                if (ch === effectAllele) k++;
            }

            // Helper: HWE-based genotype probability for a given p
            const genotypeProbability = (p: number): number => {
                const pClamp = Math.max(SMOOTH, Math.min(1 - SMOOTH, p));
                if (ploidy === 1) {
                    return k === 1 ? pClamp : (1 - pClamp);
                } else {
                    // assume diploid
                    if (k === 0) return (1 - pClamp) ** 2;
                    if (k === 1) return 2 * pClamp * (1 - pClamp);
                    if (k === 2) return pClamp ** 2;
                    // fallback for polyploidy (unlikely in common AIMs)
                    return 0;
                }
            };

            // Accumulate log-probabilities per population
            for (const [pop, freq] of Object.entries(aim.frequencies as Record<string, number>)) {
                const cleanPop = pop.toUpperCase().trim();
                if (cleanPop === 'GLOBAL' || cleanPop === 'ASI') continue;

                const p = freq as number;
                const prob = genotypeProbability(p);
                if (prob <= 0) continue;   // safety, though clamping prevents this

                totalLogProb[cleanPop] = (totalLogProb[cleanPop] || 0) + Math.log(prob);
                markerCounts[cleanPop] = (markerCounts[cleanPop] || 0) + 1;
            }
        }
    }

    // Convert average log-prob into an unnormalised score (geometric mean)
    const scores: Record<string, number> = {};
    let sumScores = 0;
    for (const pop in totalLogProb) {
        if (markerCounts[pop] >= MIN_MARKERS) {
            const avgLogProb = totalLogProb[pop] / markerCounts[pop];
            scores[pop] = Math.exp(avgLogProb);   // per-marker geometric mean
            sumScores += scores[pop];
        }
    }

    // Normalise to percentages
    const finalScores: Record<string, number> = {};
    if (sumScores > 0) {
        for (const pop in scores) {
            finalScores[pop] = (scores[pop] / sumScores) * 100;
        }
    }
    return finalScores;
}
