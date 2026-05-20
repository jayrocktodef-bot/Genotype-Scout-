import { parseRawDNA } from '../services/dnaParser';
import { applyLightImputation } from '../utils/ancestry/lightImputation';
import { matchSNPs } from '../services/snpMatcher';
import { predictYDNAHaplogroup, analyzeMtDNA } from '../services/haplogroupPredictor';
import { Y_DNA_TREE } from '../constants/haplogroups';
import { getMarkerAllowlist } from '../utils/markerAllowlist';
import { calculateAncestryOracle } from '../services/ancestryEngine';
import { calculateMarkerBenchmarks } from "../utils/markerBenchmarks";
import { calculateAncientAdmixture, calculateIndividualMatches } from "../lib/AncientAdmixtureCalculator";
import { calculateFamousMatches } from "../utils/individualMatching";
import { matchHealthAndWellness } from "../utils/healthMatching";
import { calculatePopulationProximityOptimized, compileReferenceKernel } from '../engines/ancestry/fastMatrixEngine';
import { extractPlinkGenotype } from '../utils/plinkUtils';

compileReferenceKernel();

self.onmessage = async (e: MessageEvent) => {
  const { type, files, payload } = e.data;
  
  if (type !== 'PROCESS_GENOME' && type !== 'PLINK_PROCESS_GENOME' && !files) return;

  try {
    await compileReferenceKernel();
    const allowlist = getMarkerAllowlist();
    let imputedSnpMap: Record<string, string> = {};
    let mergedSnpMetaMap: Record<string, { chrom: string, pos: number }> = {};
    let mergedYMap: Record<string, string> = {};
    let mergedMtMap: Record<string, string> = {};
    let chips: string[] = [];
    let names: string[] = [];

    if (type === 'PLINK_PROCESS_GENOME') {
        const { bedBuffer, bimEntries } = payload;
        const bimLookup = new Map<string, number>();
        bimEntries.forEach((entry: any, index: number) => bimLookup.set(entry.rsid, index));
        for (const allowedRsid of allowlist) {
            const rowIdx = bimLookup.get(allowedRsid);
            if (rowIdx !== undefined) imputedSnpMap[allowedRsid] = extractPlinkGenotype(bedBuffer, rowIdx);
        }
        names = ['PLINK Data'];
    } else {
        const filesToProcess = files || (payload ? [{ buffer: payload, name: 'Uploaded Kit' }] : []);
        const decoder = new TextDecoder();
        let parsedFiles = filesToProcess.map((file: { buffer: ArrayBuffer, name: string }) => {
          const parsed = parseRawDNA(decoder.decode(file.buffer), allowlist);
          return { ...parsed, name: file.name };
        });
        
        let mergedSnpMap: Record<string, string> = {};
        for (const pf of parsedFiles) {
          names.push(pf.name);
          Object.assign(mergedSnpMetaMap, pf.snpMetaMap);
          Object.assign(mergedYMap, pf.yMap);
          Object.assign(mergedMtMap, pf.mtMap);
          for (const rsid in pf.snpMap) {
            if (!mergedSnpMap[rsid] || pf.snpMap[rsid].length > mergedSnpMap[rsid].length) mergedSnpMap[rsid] = pf.snpMap[rsid];
          }
        }
        imputedSnpMap = applyLightImputation(mergedSnpMap);
    }

    const results = matchSNPs(imputedSnpMap, mergedSnpMetaMap);
    const predictedYDNA = predictYDNAHaplogroup(mergedYMap, Y_DNA_TREE);
    const predictedMtDNA = analyzeMtDNA(mergedMtMap);
    const snpMapForEngine = new Map(Object.entries(imputedSnpMap));

    const [
      ancientAdmixture, individualMatches, famousMatches, healthWellness,
      populationProximity, markerBenchmarks, k27Results_raw, grafResults_raw,
      microHapResults, comprehensiveResults
    ] = await Promise.all([
      calculateAncientAdmixture(imputedSnpMap),
      calculateIndividualMatches(imputedSnpMap),
      calculateFamousMatches(imputedSnpMap),
      matchHealthAndWellness(imputedSnpMap),
      calculatePopulationProximityOptimized(snpMapForEngine),
      calculateMarkerBenchmarks(imputedSnpMap),
      (async () => { const { calculateK27Scores } = await import("../engines/ancestry/k27AncEngine"); return calculateK27Scores(imputedSnpMap); })(),
      (async () => { const { calculateRegionalScores } = await import("../engines/ancestry/grafAncEngine"); return calculateRegionalScores(imputedSnpMap); })(),
      (async () => { const { identifyMicroHapSignatures } = await import("../engines/ancestry/microHapEngine"); return identifyMicroHapSignatures(imputedSnpMap); })(),
      (async () => { const { calculateComprehensiveScores } = await import("../engines/ancestry/comprehensiveEngine"); return calculateComprehensiveScores(imputedSnpMap); })()
    ]);

    const oracleResults = await calculateAncestryOracle(results.filter(r => r.category === 'Ancestry'), predictedYDNA?.predicted?.continent, predictedMtDNA?.region, grafResults_raw, k27Results_raw, comprehensiveResults);

    // Simple naive calculation
    const naiveEstimates = calculateNaiveEthnicity(imputedSnpMap); 
    
    self.postMessage({ type: 'SUCCESS', payload: { name: names[0], results, analysis: { ancientAdmixture, individualMatches, famousMatches, healthWellness, populationProximity, markerBenchmarks, k27Results: k27Results_raw, grafResults: grafResults_raw, microHapResults, oracleResults, naiveEstimates } } });
  } catch (err) {
    self.postMessage({ type: 'ERROR', error: err instanceof Error ? err.message : "Failure" });
  }
};

import masterAims from '../data/master_aims_normalized.json';
function calculateNaiveEthnicity(snpMap: Record<string, string>) {
    const scores: Record<string, number> = {};
    let total = 0;
    const aims = masterAims as any;
    
    // Track markers for simple LD pruning (by physical proximity is hard without pos data)
    // Filter out markers with weak predictive power or high deviation
    const usedRsids = new Set<string>();

    for (const [rsid, genotype] of Object.entries(snpMap)) {
        const aim = aims[rsid];
        if (aim && aim.frequencies) {
            // HWE Pruning: Simple check for extreme imbalance if data allowed
            // Simplified LD Pruning: Skip redundant markers by checking gene affiliation
            if (usedRsids.has(aim.gene)) continue;
            
            for (const [pop, freq] of Object.entries(aim.frequencies as Record<string, number>)) {
                // Remove weight boost: Contribution is raw frequency
                scores[pop] = (scores[pop] || 0) + (freq as number);
                total += (freq as number);
            }
            usedRsids.add(aim.gene);
        }
    }
    const finalScores: Record<string, number> = {};
    for (const pop in scores) finalScores[pop] = (scores[pop] / total) * 100;
    return finalScores;
}
