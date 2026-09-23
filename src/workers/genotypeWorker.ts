import { parseRawDNA, parseRawDNAStream, GenomicsParseError, decompressGenomicBuffer } from '../services/dnaParser';
import { GenomicsError, GenomicsErrorCode, callGenomicsError, serializeGenomicsError } from '../services/errorCaller';
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
import { calculatePopulationProximityOptimized } from '../engines/ancestry/fastMatrixEngine';
import { extractPlinkGenotype } from '../utils/plinkUtils';
import { processSubpopulations } from '../components/ancestryOracleLogic';
import { loadMasterAims } from '../data/index';
import { calculateHumanOriginsScores } from "../engines/ancestry/humanOriginsEngine";
import { calculateRegionalScores } from "../engines/ancestry/grafAncEngine";
import { identifyMicroHapSignatures } from "../engines/ancestry/microHapEngine";
import { calculateComprehensiveScores } from "../engines/ancestry/comprehensiveEngine";
import { identifyRareAndNovelVariants } from "../utils/rareVariantsAnalyzer";
import { calculatePharmacogenomics } from '../services/pgxEngine';
import { computeAncientMatches } from '../services/ancientMatchEngine';
import { calculateArchaicAffinity } from '../services/archaicEngine';
import { Y_DNA_HAPLOGROUPS, MT_DNA_HAPLOGROUPS } from '../data/haplogroupTree';
import { computeDatasetLAI, computePaintedAncestry } from '../utils/ancestry/paintedAncestry';

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
  const independentEngines = [
    'matchSNPs',
    'calculateAncientAdmixture',
    'calculateFamousMatches',
    'matchHealthAndWellness',
    'calculatePopulationProximityOptimized',
    'calculateMarkerBenchmarks',
    'calculateHumanOriginsScores',
    'calculateRegionalScores',
    'identifyMicroHapSignatures',
    'calculateComprehensiveScores',
  ];

  const totalEngines = independentEngines.length + 1; // 11 total engines (includes calculateIndividualMatches)
  let completedCount = 0;

  // ── Try parallel dispatch via nested workers ───────────────────
  if (canSpawnNestedWorkers()) {
    try {
      // Allow up to the hardware concurrency (capped at 8 for sanity) to maximize parallel dispatch for heavy calculations
      const poolSize = Math.min(Math.min(navigator.hardwareConcurrency || 4, 8), totalEngines);
      const workers: Worker[] = [];

      for (let i = 0; i < poolSize; i++) {
        workers.push(
          new Worker(new URL('./analysisWorker.ts', import.meta.url), { type: 'module' })
        );
      }

      const results: Record<string, any> = {};
      const queue = [...independentEngines];
      const idleWorkers: Worker[] = [];
      let individualMatchesQueued = false;

      await new Promise<void>((resolve, reject) => {
        let settled = false;

        const cleanup = () => {
          settled = true;
          workers.forEach(w => w.terminate());
        };

        const tryDispatch = () => {
          if (settled) return;
          while (queue.length > 0 && idleWorkers.length > 0) {
            const worker = idleWorkers.pop()!;
            const engine = queue.shift()!;
            dispatchTask(worker, engine);
          }
        };

        const dispatchTask = (worker: Worker, engine: string) => {
          const taskId = engine;
          const onMsg = (e: MessageEvent) => {
            if (e.data.taskId !== taskId) return;
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);

            if (e.data.type === 'SUCCESS') {
              results[engine] = e.data.result;
              completedCount++;
              onEngineProgress(completedCount, totalEngines, ENGINE_LABELS[engine] || engine);

              if (engine === 'calculateAncientAdmixture' && !individualMatchesQueued) {
                individualMatchesQueued = true;
                queue.push('calculateIndividualMatches');
              }

              if (completedCount === totalEngines && !settled) {
                cleanup();
                resolve();
                return;
              }

              idleWorkers.push(worker);
              tryDispatch();
            } else if (e.data.type === 'ERROR' && !settled) {
              cleanup();
              reject(new Error(`Engine ${engine} failed: ${e.data.error}`));
            }
          };

          const onErr = (err: any) => {
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);
            if (!settled) {
              cleanup();
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
            ancientAdmixture: engine === 'calculateIndividualMatches' ? results['calculateAncientAdmixture'] : undefined,
          });
        };

        // Populate idle workers and kick off
        for (const worker of workers) {
          idleWorkers.push(worker);
        }
        tryDispatch();
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
  const total = 11;

  const run = async (name: string, fn: () => any) => {
    onEngineProgress(completed, total, ENGINE_LABELS[name] || name);
    // Yield to the event loop to let progress updates transmit and reset watchdog
    await new Promise(resolve => setTimeout(resolve, 0));
    try {
      results[name] = await fn();
      completed++;
    } catch (err: any) {
      console.error(`Calculation engine ${name} failed:`, err);
      throw new GenomicsError(`Engine ${name} execution failed: ${err?.message || String(err)}`, {
        errorCode: GenomicsErrorCode.ERR_ENGINE_FAILED,
        subsystem: 'ENGINE_EXECUTION',
        failedEngine: name,
        technicalMessage: err?.stack || String(err),
        suggestedSolution: `The ${name} population analysis module failed on this specimen. Your dataset may have sparse markers in this specific genomic region.`
      });
    }
  };

  await run('matchSNPs', () => matchSNPs(imputedSnpMap, mergedSnpMetaMap));
  await run('calculateAncientAdmixture', () => calculateAncientAdmixture(autosomalSnpMap));
  await run('calculateIndividualMatches', () => calculateIndividualMatches(autosomalSnpMap, results['calculateAncientAdmixture']));
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
        }
        self.postMessage({
          type: 'PROGRESS',
          payload: { 
            step: `${label}... (${completed}/${total})`,
            completed,
            totalEngines: total,
            statusVal: 2,
            percent: 50 + Math.round((completed / total) * 40)
          }
        });
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

// ── Global Worker Error & Unhandled Rejection Listeners ─────────────
if (typeof self !== 'undefined') {
  self.addEventListener('error', (event: ErrorEvent) => {
    console.error("genotypeWorker unhandled error:", event.error || event.message);
    self.postMessage({
      type: 'ERROR',
      error: serializeGenomicsError(event.error || event.message || event, 'GENOTYPE_WORKER')
    });
  });

  self.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    console.error("genotypeWorker unhandled promise rejection:", event.reason);
    self.postMessage({
      type: 'ERROR',
      error: serializeGenomicsError(event.reason || 'Unhandled promise rejection in genotype worker', 'GENOTYPE_WORKER')
    });
  });

  self.onmessage = async (e: MessageEvent) => {
  const { type, files, payload, sab } = e.data;
  if (type !== 'PROCESS_GENOME' && type !== 'PLINK_PROCESS_GENOME' && !files) return;
  if (sab) { new Int32Array(sab)[3] = 1; }

  // Heartbeat interval to continually notify the main thread that the worker is actively computing
  const heartbeatTimer = setInterval(() => {
    self.postMessage({ type: 'HEARTBEAT', payload: { timestamp: Date.now() } });
  }, 1500);

  try {
    const allowlist = getMarkerAllowlist();
    let imputedSnpMap: Record<string, string> = {};
    let mergedSnpMetaMap: Record<string, { chrom: string, pos: number }> = {};
    let mergedYMap: Record<string, string> = {};
    let mergedMtMap: Record<string, string> = {};
    let mergedSnpByPosition: Record<string, string> = {};
    let mergedHaplotype1Map: Record<string, string> = {};
    let mergedHaplotype2Map: Record<string, string> = {};
    let isAnyPhased = false;
    let inferredSex: 'MALE' | 'FEMALE' | 'UNKNOWN' = 'UNKNOWN';
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
        let parsedFiles: any[] = [];
        let lastParsingError: any = null;
        
        for (const fileObj of filesToProcess) {
          const fileName = fileObj.name || 'Uploaded Kit';
          
          let parsed;
          try {
            // Directly pass the File or Blob to parseRawDNAStream to utilize non-blocking Web Streams
            const actualFile: Blob = fileObj.file || (fileObj.buffer ? new Blob([fileObj.buffer]) : (fileObj.stream ? fileObj : null));
            if (!actualFile) {
              throw new Error("Invalid file object structure passed to worker");
            }

            parsed = await parseRawDNAStream(actualFile, allowlist, (processed, total, snps) => {
              if (sab) {
                const progressArray = new Int32Array(sab);
                Atomics.store(progressArray, 0, processed);
                Atomics.store(progressArray, 1, total);
                Atomics.store(progressArray, 2, snps);
              }
              self.postMessage({ type: 'PROGRESS', payload: { processed, total, snps } });
            });

            if (parsed && parsed.snpCount > 0) {
              parsedFiles.push({ ...parsed, name: fileName });
            }
          } catch (error: any) {
             console.warn(`Worker parsing warning for file ${fileName}:`, error);
             lastParsingError = error;
             if (filesToProcess.length === 1) {
               throw error;
             }
          }
        }

        if (parsedFiles.length === 0) {
          if (lastParsingError) throw lastParsingError;
          throw new GenomicsParseError(
            `ERR-4025FGD1: No valid genetic marker files could be parsed from the upload batch (${filesToProcess.length} file(s) checked).`,
            {
              errorCode: 'ERR-4025FGD1',
              errorCategory: 'Empty Batch Spectrum',
              suggestedSolution: 'Ensure your raw data file contains autosomal genotype data (.txt, .csv, .tsv, .vcf) with valid rsIDs or coordinates from a supported provider.'
            }
          );
        }
        
        let mergedSnpMap: Record<string, string> = {};
        mergedSnpByPosition = {};
        for (const pf of parsedFiles) {
          names.push(pf.name); chips.push(pf.chip); totalSnps += pf.snpCount;
          Object.assign(mergedSnpMetaMap, pf.snpMetaMap); Object.assign(mergedYMap, pf.yMap); Object.assign(mergedMtMap, pf.mtMap);
          if (pf.snpByPosition) Object.assign(mergedSnpByPosition, pf.snpByPosition);
          if (pf.haplotype1Map) Object.assign(mergedHaplotype1Map, pf.haplotype1Map);
          if (pf.haplotype2Map) Object.assign(mergedHaplotype2Map, pf.haplotype2Map);
          if (pf.isPhased) isAnyPhased = true;
          if (pf.inferredBiologicalSex && pf.inferredBiologicalSex !== 'UNKNOWN') {
            inferredSex = pf.inferredBiologicalSex;
          }
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
    
    const predictedYDNA = predictYDNAHaplogroup(mergedYMap, Y_DNA_TREE, mergedSnpByPosition);
    const predictedMtDNA = analyzeMtDNA(mergedMtMap, mergedSnpByPosition);

    // ── Haplotype-Scout: Ancient Archaeological Match & Archaic Hominin Affinity ──
    const yCode = predictedYDNA?.phase2?.haplogroup || predictedYDNA?.predicted?.name;
    const mtCode = predictedMtDNA?.predicted;

    const userYDef = yCode
      ? (Y_DNA_HAPLOGROUPS.find(h => h.code.toLowerCase() === yCode.toLowerCase() || yCode.toLowerCase().startsWith(h.code.toLowerCase())) || { code: yCode, cladeName: yCode } as any)
      : null;
    const userMtDef = mtCode
      ? (MT_DNA_HAPLOGROUPS.find(h => h.code.toLowerCase() === mtCode.toLowerCase() || mtCode.toLowerCase().startsWith(h.code.toLowerCase())) || { code: mtCode, cladeName: mtCode } as any)
      : null;

    const ancientLineageMatches = computeAncientMatches(userYDef, userMtDef);

    // Build coordinate position lookup for archaic introgression engine
    const snpByPosition: Record<string, string> = { ...mergedSnpByPosition };
    for (const [rsid, genotype] of Object.entries(imputedSnpMap)) {
      const meta = mergedSnpMetaMap[rsid];
      if (meta && meta.chrom && meta.pos) {
        snpByPosition[`${meta.chrom.toLowerCase()}:${meta.pos}`] = genotype;
      }
    }
    const archaicAffinity = calculateArchaicAffinity(imputedSnpMap, snpByPosition);
    
    const autosomalUserGenotypes = Object.entries(autosomalSnpMap).map(([rsid, genotype]) => ({ rsid, genotype }));
    const sampleId = names[0] ? (extractSampleId(names[0]) ?? undefined) : undefined;
    
    self.postMessage({ type: 'PROGRESS', payload: { step: "Analyzing Subpopulation Oracles (Global)...", percent: 92 } });
    await new Promise(resolve => setTimeout(resolve, 0));
    const allResult = await processSubpopulations(autosomalUserGenotypes, [], sampleId, autosomalMetaMap, 'all');
    
    self.postMessage({ type: 'PROGRESS', payload: { step: "Calculating Kidd55 & Seldin128 Oracles...", percent: 94 } });
    await new Promise(resolve => setTimeout(resolve, 0));
    const kidd55Result = await processSubpopulations(autosomalUserGenotypes, [], sampleId, autosomalMetaMap, 'kidd55');
    const seldin128Result = await processSubpopulations(autosomalUserGenotypes, [], sampleId, autosomalMetaMap, 'seldin128');
    
    self.postMessage({ type: 'PROGRESS', payload: { step: "Finalizing EuroForGen & Microhaplotypes...", percent: 96 } });
    await new Promise(resolve => setTimeout(resolve, 0));
    const euroforgenResult = await processSubpopulations(autosomalUserGenotypes, [], sampleId, autosomalMetaMap, 'euroforgen');
    const ramosResult = await processSubpopulations(autosomalUserGenotypes, [], sampleId, autosomalMetaMap, 'ramos');
    const microhapResult = await processSubpopulations(autosomalUserGenotypes, [], sampleId, autosomalMetaMap, 'microhap');

    const subpopulationOracle = {
      ...allResult,
      all: allResult,
      kidd55: kidd55Result,
      seldin128: seldin128Result,
      euroforgen: euroforgenResult,
      ramos: ramosResult,
      microhap: microhapResult
    };
    const naiveEstimates = calculateNaiveEthnicity(autosomalSnpMap); 
    
    self.postMessage({ type: 'PROGRESS', payload: { step: "Computing Chromosome Painting (LAI)...", percent: 98 } });
    await new Promise(resolve => setTimeout(resolve, 0));

    // ── Rare & Novel Variants Identification ──
    const knownDbKeys = new Set<string>();
    const aims = getMasterAims();
    if (aims) {
      for (const k of Object.keys(aims)) knownDbKeys.add(k.toLowerCase().split('_')[0]);
    }
    const rareAndNovelVariants = identifyRareAndNovelVariants(imputedSnpMap, knownDbKeys, aims);

    // ── Precalculate Local Ancestry Inference (Chromosome Painting) ──
    let segments: any = null;
    let paintedAncestry: any = null;
    let aimsUsed: any[] = [];
    let parentalDifferentiation: any = null;
    try {
      const fallbackProportions = (oracleResults?.primary as any)?.continentalScores || naiveEstimates || {};
      const laiResult = computeDatasetLAI({
        mergedSnpMap: imputedSnpMap,
        mergedSnpMetaMap,
        haplotype1Map: Object.keys(mergedHaplotype1Map).length > 0 ? mergedHaplotype1Map : undefined,
        haplotype2Map: Object.keys(mergedHaplotype2Map).length > 0 ? mergedHaplotype2Map : undefined,
        isPhased: isAnyPhased,
        inferredBiologicalSex: inferredSex,
        yMap: mergedYMap,
        mtMap: mergedMtMap,
        predictedYDNA: yCode || predictedYDNA?.phase2?.haplogroup || predictedYDNA?.predicted?.name,
        predictedMtDNA: mtCode || predictedMtDNA?.predicted
      }, fallbackProportions);

      if (laiResult) {
        segments = laiResult.segments;
        aimsUsed = laiResult.aimsUsed;
        paintedAncestry = computePaintedAncestry(segments, fallbackProportions);
        parentalDifferentiation = laiResult.parentalDifferentiation;
      }
    } catch (laiErr) {
      console.warn("Precomputed LAI skipped in worker:", laiErr);
    }

    // Targeted sanitization — replaces the expensive JSON.parse(JSON.stringify()) round-trip.
    // Only strips non-structured-cloneable types (Maps, Sets, Promises, functions).
    const rawPayload = { 
      name: names[0], 
      results: ancestryResult, 
      chip: chips[0] || "Unknown Chip",
      snpCount: totalSnps,
      inferredBiologicalSex: inferredSex,
      isPhased: isAnyPhased,
      haplotype1Map: Object.keys(mergedHaplotype1Map).length > 0 ? mergedHaplotype1Map : undefined,
      haplotype2Map: Object.keys(mergedHaplotype2Map).length > 0 ? mergedHaplotype2Map : undefined,
      predictedYDNA, predictedMtDNA, mergedMtMap, mergedYMap,
      mergedSnpByPosition,
      ancientLineageMatches,
      archaicAffinity,

      mergedSnpMap: imputedSnpMap,
      prsResults: undefined,
      pgxResults: calculatePharmacogenomics(imputedSnpMap),
      mergedSnpMetaMap,
      rareAndNovelVariants,
      analysis: { 
        ...bloodResult,
        oracleResults, 
        naiveEstimates,
        subpopulationOracle,
        segments,
        paintedAncestry,
        aimsUsed,
        parentalDifferentiation,
        inferredBiologicalSex: inferredSex
      } 
    };
    const safePayload = sanitizePayload(rawPayload);

    if (sab) {
      Atomics.store(new Int32Array(sab), 3, 3);
    }

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
    const serialized = serializeGenomicsError(err, 'GENOTYPE_WORKER');
    self.postMessage({
      type: 'ERROR',
      error: serialized
    });
  } finally {
    clearInterval(heartbeatTimer);
  }
};
}

let masterAimsCache: any = null;
const getMasterAims = () => {
  if (!masterAimsCache) masterAimsCache = loadMasterAims();
  return masterAimsCache;
};

function getMacroContinentalGroup(popKey: string): string | null {
    const clean = popKey.toUpperCase().trim().replace(/^(HGDP_|SGDP_|AGCP_|1000G_)/i, '').replace(/(_GNOMAD|_PROXY)$/i, '');
    if (['GLOBAL', 'ASI', 'ALL'].includes(clean)) return null;

    if (['AFR', 'YORUBA', 'ESN', 'ESAN', 'GWD', 'GAMBIAN', 'MSL', 'MENDE', 'LWK', 'LUHYA', 'IGBO', 'AKAN', 'AKAN_ASHANTI', 'EWE', 'EWE_FON', 'FULANI', 'HAUSA', 'BAKONGO', 'LUBA', 'MBUTI', 'BIAKA', 'MBUTI_BIAKA', 'PYGMY', 'DINKA', 'DINKA_NUER', 'SAN', 'KHOE', 'SAN_KHOE', 'KHOISAN', 'ZULU', 'XHOSA', 'ZULU_XHOSA', 'MASAI', 'HERERO', 'TSWANA', 'MANDENKA', 'GWF_FULA', 'GWJ_JOLA', 'GWW_WOLOF', 'ALFA_AFRICAN', 'AFR_GNOMAD'].includes(clean)) return 'AFR';
    if (['EUR', 'CEU', 'GBR', 'FIN', 'TSI', 'IBS', 'GERMAN', 'SWEDISH', 'DUTCH', 'IRISH', 'FRENCH', 'SPANISH', 'POLISH', 'GREEK', 'BALKAN', 'BALTIC', 'BASQUE', 'SLAVIC', 'SCANDINAVIAN', 'ORCADIAN', 'CRETAN', 'SARDINIAN', 'NFE_GNOMAD', 'FIN_GNOMAD', 'ALFA_EUR', 'AMI_GNOMAD'].includes(clean)) return 'EUR';
    if (['CAU', 'CHECHEN', 'GEORGIAN', 'ADYGEI', 'NORTHOSSETIAN', 'RUSSIA_NORTHOSSETIAN', 'ABKHASIAN', 'RUSSIA_ABKHASIAN', 'LEZGIN'].includes(clean)) return 'CAU';
    if (['EAS', 'CHB', 'CHS', 'JPT', 'KHV', 'CDX', 'HAN', 'JAPANESE', 'DAI', 'KINH', 'TIBETAN', 'MONGOLIAN', 'EAS_GNOMAD', 'ALFA_EAS', 'DAUR', 'HEZHEN', 'OROQEN', 'TUJIA', 'XIBO', 'NAXI', 'YI', 'SHE', 'MIAO', 'LAHU'].includes(clean)) return 'EAS';
    if (['CAS', 'ALTAIAN', 'CHUKCHI', 'EVEN', 'ITELMEN', 'KYRGYZ', 'KYRGYZ_KYRGYZSTAN', 'MANSI', 'TUBALAR', 'ULCHI', 'UYGHUR', 'UYGUR', 'YAKUT', 'HAZARA', 'TAJIK'].includes(clean)) return 'CAS';
    if (['SAS', 'BEB', 'GIH', 'PJL', 'ITU', 'STU', 'PUNJABI', 'TAMIL', 'TELUGU', 'GUJARATI', 'BENGALI', 'BRAHMIN', 'SINDHI', 'PATHAN', 'SAS_GNOMAD', 'ALFA_SAS', 'KALASH', 'BALOCHI', 'BRAHUI', 'MAKRANI', 'BURUSHO', 'KUSUNDA'].includes(clean)) return 'SAS';
    if (['AMR', 'PEL', 'MXL', 'CLM', 'PUR', 'KARITIANA', 'SURUI', 'PIMA', 'MAYA', 'MIXTEC', 'ZAPOTEC', 'QUECHUA', 'PIAPOCO', 'TLINGIT', 'AYMARA', 'GUARANI', 'INUIT', 'ESKIMO', 'AMR_GNOMAD', 'ALFA_LATAM1', 'ALFA_LATAM2'].includes(clean)) return 'AMR';
    if (['OCE', 'PAPUAN', 'AUSTRALIAN', 'BOUGAINVILLE', 'HAWAIIAN', 'MAORI', 'POLYNESIAN'].includes(clean)) return 'OCE';
    if (['MENA', 'MID', 'MID_GNOMAD', 'MOZABITE', 'BERBER', 'AMAZIGH', 'AMAZIGH_BERBER', 'BEDOUIN', 'DRUZE', 'PALESTINIAN', 'JORDANIAN', 'IRANIAN', 'IRAQI', 'SAMARITAN', 'YEMENITE', 'SAHARAWI', 'TUAREG', 'TURKISH'].includes(clean)) return 'MENA';

    return null;
}

export function calculateNaiveEthnicity(snpMap: Record<string, string>): Record<string, number> {
    const MIN_MARKERS = 5;

    const totalProximity: Record<string, number> = {};
    const totalWeight: Record<string, number> = {};
    const markerCounts: Record<string, number> = {};

    const aims = getMasterAims() as any;
    const aimBaseMap = new Map<string, any[]>();
    for (const [key, value] of Object.entries(aims)) {
        const base = key.split('_')[0].toLowerCase();
        if (!aimBaseMap.has(base)) aimBaseMap.set(base, []);
        aimBaseMap.get(base)!.push(value);
    }

    const usedRsids = new Set<string>();

    for (const rsid in snpMap) {
        const base = rsid.toLowerCase();
        const matchedAims = aimBaseMap.get(base);
        if (!matchedAims || usedRsids.has(base)) continue;
        usedRsids.add(base);

        const genotype = snpMap[rsid];
        const cleanGenotype = genotype.toUpperCase().replace(/[\s\/_]/g, '');
        if (!cleanGenotype || cleanGenotype.includes('-') || cleanGenotype.includes('N')) continue;

        let validAlleles = '';
        for (const ch of cleanGenotype) {
            if ('ACGTID'.includes(ch)) validAlleles += ch;
        }
        const ploidy = validAlleles.length;
        if (ploidy === 0) continue;

        for (const aim of matchedAims) {
            if (!aim || (!aim.frequencies && !aim.subFrequencies)) continue;
            // Reject any synthetic placeholder markers
            if (aim.position === 1000000) continue;
            if (aim.frequencies?.GLOBAL !== undefined) continue;

            const effectAlleles = aim.alleles || [];
            if (effectAlleles.length === 0) continue;
            const effectAllele = effectAlleles[0].toUpperCase();

            // Direct effect allele matching: compute user dosage in [0.0, 1.0]
            let k = 0;
            for (const ch of validAlleles) {
                if (ch === effectAllele) k++;
            }
            const userDosage = k / ploidy;

            // Informativeness / Fst marker weighting
            const markerWeight = typeof aim.fst === 'number' && aim.fst > 0
                ? Math.min(3.5, Math.max(0.5, aim.fst * 6.0))
                : (typeof aim.weight === 'number' && aim.weight > 0 ? Math.min(3.5, Math.max(0.5, aim.weight)) : 1.0);

            // Aggregate population frequencies into standard continental macro-groups
            const macroFreqs: Record<string, number[]> = {};
            if (aim.frequencies) {
                for (const [pop, freq] of Object.entries(aim.frequencies as Record<string, number>)) {
                    const macroGroup = getMacroContinentalGroup(pop);
                    if (!macroGroup || typeof freq !== 'number' || isNaN(freq)) continue;
                    if (!macroFreqs[macroGroup]) macroFreqs[macroGroup] = [];
                    macroFreqs[macroGroup].push(freq);
                }
            }
            if (aim.subFrequencies) {
                for (const [pop, freq] of Object.entries(aim.subFrequencies as Record<string, number>)) {
                    const macroGroup = getMacroContinentalGroup(pop);
                    if (!macroGroup || typeof freq !== 'number' || isNaN(freq)) continue;
                    if (!macroFreqs[macroGroup]) macroFreqs[macroGroup] = [];
                    macroFreqs[macroGroup].push(freq);
                }
            }

            // Require at least 3 macro continental groups represented for fair cross-population evaluation
            if (Object.keys(macroFreqs).length < 3) continue;

            for (const [macroPop, freqs] of Object.entries(macroFreqs)) {
                const avgFreq = freqs.reduce((a, b) => a + b, 0) / freqs.length;
                // Single-Locus Raw Allele Sharing Proximity: P_locus = 1.0 - |user_dosage - f_ref|
                const locusProximity = Math.max(0.0, Math.min(1.0, 1.0 - Math.abs(userDosage - avgFreq)));

                totalProximity[macroPop] = (totalProximity[macroPop] || 0) + (markerWeight * locusProximity);
                totalWeight[macroPop] = (totalWeight[macroPop] || 0) + markerWeight;
                markerCounts[macroPop] = (markerCounts[macroPop] || 0) + 1;
            }
        }
    }

    const avgProximities: Record<string, number> = {};
    let minAvgProx = Infinity;
    let maxAvgProx = -Infinity;

    for (const pop in totalProximity) {
        if (markerCounts[pop] >= MIN_MARKERS && totalWeight[pop] > 0) {
            const avg = totalProximity[pop] / totalWeight[pop];
            avgProximities[pop] = avg;
            if (avg < minAvgProx) minAvgProx = avg;
            if (avg > maxAvgProx) maxAvgProx = avg;
        }
    }

    const pops = Object.keys(avgProximities);
    if (pops.length === 0) return {};

    const spread = maxAvgProx - minAvgProx;
    const finalScores: Record<string, number> = {};

    if (spread <= 1e-6) {
        const uniform = 100 / pops.length;
        for (const pop of pops) finalScores[pop] = uniform;
        return finalScores;
    }

    // Baseline contrast normalization: calculate excess proximity above baseline
    // Contrast exponent p = 1.8 sharpens distinct signals while preserving additive linear admixture
    const CONTRAST_POWER = 1.8;
    const excessScores: Record<string, number> = {};
    let sumExcess = 0;

    for (const pop of pops) {
        const excess = Math.max(0, avgProximities[pop] - minAvgProx);
        const powered = Math.pow(excess, CONTRAST_POWER);
        excessScores[pop] = powered;
        sumExcess += powered;
    }

    if (sumExcess > 0) {
        for (const pop of pops) {
            finalScores[pop] = Math.round((excessScores[pop] / sumExcess) * 1000) / 10;
        }
    }

    return finalScores;
}
