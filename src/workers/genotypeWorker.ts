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

compileReferenceKernel();

async function runGenotypeScout(
    imputedSnpMap: Record<string, string>,
    mergedSnpMetaMap: Record<string, { chrom: string, pos: number }>,
    names: string[],
    sab: any
) {
    const allSources = getAllSources();
    console.log("Total sources length in worker:", allSources.length);
    const numWorkers = navigator.hardwareConcurrency || 4;
    const chunkSize = Math.ceil(allSources.length / numWorkers);
    const workerPromises = [];
    
    for (let i = 0; i < allSources.length; i += chunkSize) {
      const chunk = allSources.slice(i, i + chunkSize);
      workerPromises.push(new Promise((resolve, reject) => {
        const worker = new Worker(new URL('../workers/markerProcessingWorker.ts', import.meta.url), { type: 'module' });
        worker.postMessage({ markers: chunk, imputedSnpMap, snpMetaMap: mergedSnpMetaMap });
        worker.onmessage = (e) => { resolve(e.data.payload); worker.terminate(); };
        worker.onerror = (e) => { reject(e); worker.terminate(); };
      }));
    }
    
    const [ancestryResult, bloodResult] = await Promise.all([
      (async () => {
        const workerResults = await Promise.all(workerPromises);
        return ([] as any[]).concat(...workerResults);
      })(),
      (async () => {
         const snpMapForEngine = new Map(Object.entries(imputedSnpMap));
         const [
          ancientAdmixture, individualMatches, famousMatches, healthWellness,
          populationProximity, markerBenchmarks, mdlpResults_raw, grafResults_raw,
          microHapResults, comprehensiveResults
        ] = await Promise.all([
          calculateAncientAdmixture(imputedSnpMap),
          calculateIndividualMatches(imputedSnpMap),
          calculateFamousMatches(imputedSnpMap),
          matchHealthAndWellness(imputedSnpMap),
          calculatePopulationProximityOptimized(snpMapForEngine),
          calculateMarkerBenchmarks(imputedSnpMap),
          (async () => { const { calculateMDLPK16Scores } = await import("../engines/ancestry/mdlpAncEngine"); return calculateMDLPK16Scores(imputedSnpMap); })(),
          (async () => { const { calculateRegionalScores } = await import("../engines/ancestry/grafAncEngine"); return calculateRegionalScores(imputedSnpMap); })(),
          (async () => { const { identifyMicroHapSignatures } = await import("../engines/ancestry/microHapEngine"); return identifyMicroHapSignatures(imputedSnpMap); })(),
          (async () => { const { calculateComprehensiveScores } = await import("../engines/ancestry/comprehensiveEngine"); return calculateComprehensiveScores(imputedSnpMap); })()
        ]);
        return { ancientAdmixture, individualMatches, famousMatches, healthWellness, populationProximity, markerBenchmarks, mdlpResults_raw, grafResults_raw, microHapResults, comprehensiveResults };
      })()
    ]);

    const sampleId = names[0] ? extractSampleId(names[0]) : undefined;
    const oracleResults = await calculateAncestryOracle(ancestryResult.filter(r => r.category === 'Ancestry'), undefined, undefined, bloodResult.grafResults_raw, bloodResult.mdlpResults_raw, bloodResult.comprehensiveResults, sampleId);
    
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
          const actualFile = (obj: any): any => obj.stream ? obj : (obj.file ? obj.file : null);
          const getFileName = (obj: any): string => obj.name || (obj.file ? obj.file.name : 'Uploaded Kit');
          const file = actualFile(fileObj);
          const fileName = getFileName(fileObj);
          
          let parsed;
          if (file && typeof file.stream === 'function') {
            parsed = await parseRawDNAStream(file, allowlist, (processed, total, snps) => {
                if (sab) {
                    const progressArray = new Int32Array(sab);
                    Atomics.store(progressArray, 0, processed); Atomics.store(progressArray, 1, total); Atomics.store(progressArray, 2, snps);
                }
            });
          } else if (fileObj.buffer) {
            parsed = parseRawDNA(decoder.decode(fileObj.buffer), allowlist);
          } else {
            parsed = parseRawDNA(decoder.decode(await file.arrayBuffer()), allowlist);
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

    if (sab) { Atomics.store(new Int32Array(sab), 3, 2); }
    
    // Orchestration
    const { ancestryResult, bloodResult, oracleResults } = await runGenotypeScout(imputedSnpMap, mergedSnpMetaMap, names, sab);
    
    const predictedYDNA = predictYDNAHaplogroup(mergedYMap, Y_DNA_TREE);
    const predictedMtDNA = analyzeMtDNA(mergedMtMap);
    
    const userGenotypes = Object.entries(imputedSnpMap).map(([rsid, genotype]) => ({ rsid, genotype }));
    const sampleId = names[0] ? extractSampleId(names[0]) : undefined;
    const subpopulationOracle = processSubpopulations(userGenotypes, [], sampleId, mergedSnpMetaMap);
    const naiveEstimates = calculateNaiveEthnicity(imputedSnpMap); 
    
    if (sab) { Atomics.store(new Int32Array(sab), 3, 3); }

    self.postMessage({ 
      type: 'SUCCESS', 
      payload: { 
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
      } 
    });
  } catch (err) {
    if (sab) { Atomics.store(new Int32Array(sab), 3, 4); }
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

    for (const [rsid, genotype] of Object.entries(snpMap)) {
        const aim = aims[rsid];
        if (aim && aim.frequencies) {
            if (usedRsids.has(aim.gene)) continue;

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
                const p = freq as number;
                const distance = (userFreq - p) * (userFreq - p);
                const sim = 1.0 - distance;
                totalSim[pop] = (totalSim[pop] || 0) + sim;
                counts[pop] = (counts[pop] || 0) + 1;
            }

            usedRsids.add(aim.gene);
        }
    }

    const avgSim: Record<string, number> = {};
    for (const pop in totalSim) {
        if (counts[pop] > 5) { // Require a baseline of comparison SNPs
            avgSim[pop] = totalSim[pop] / counts[pop];
        }
    }

    // Power transformation to boost contrast and resolve distinct ancestral profiles cleanly
    const transformed: Record<string, number> = {};
    let totalTransformed = 0;
    for (const pop in avgSim) {
        const val = Math.pow(avgSim[pop], 5);
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
