import { parseRawDNA } from '../services/dnaParser';
import { applyLightImputation } from '../utils/ancestry/lightImputation'; // Added
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

// Pre-compile the matrix the moment the worker boots up in the background
compileReferenceKernel();

self.onmessage = async (e: MessageEvent) => {
  const { type, files, payload } = e.data;
  
  if (type !== 'PROCESS_GENOME' && type !== 'PROCESS_PARSED_DATA' && !files && !e.data.data) return;

  try {
    // 🚨 Ensure the kernel is loaded from the DB before doing math!
    await compileReferenceKernel();

    const allowlist = getMarkerAllowlist();
    let mergedSnpMap: Record<string, string> = {};
    let mergedSnpMetaMap: Record<string, { chrom: string, pos: number }> = {};
    let mergedYMap: Record<string, string> = {};
    let mergedMtMap: Record<string, string> = {};
    let chips: string[] = [];
    let names: string[] = [];

    if (type === 'PROCESS_PARSED_DATA') {
      const parsedResults = e.data.data;
      for (const pr of parsedResults) {
        names.push(pr.fileName);
        if (pr.chip && pr.chip !== "Unknown Chip") {
          chips.push(pr.chip);
        }
        const markers = pr.result;
        for (const m of markers) {
          const { rsid, chromosome, position, genotype } = m;
          
          if (!mergedSnpMap[rsid] || genotype.length > mergedSnpMap[rsid].length) {
            mergedSnpMap[rsid] = genotype;
          }
          
          mergedSnpMetaMap[rsid] = { chrom: chromosome, pos: position };
          
          // Coordinate ID
          const coordId = `chr${chromosome}_${position}`.toLowerCase();
          if (!mergedSnpMap[coordId]) {
            mergedSnpMap[coordId] = genotype;
          }

          // Y-DNA
          if (chromosome === "Y" || chromosome === "24") {
            mergedYMap[rsid] = genotype;
          }

          // mtDNA
          if (chromosome === "MT" || chromosome === "M" || chromosome === "26" || chromosome === "25") {
            mergedMtMap[position.toString()] = genotype[0];
          }
        }
      }
    } else {
      const decoder = new TextDecoder();
      // Support both multiple files or a single payload buffer
      const filesToProcess = files || (payload ? [{ buffer: payload, name: 'Uploaded Kit' }] : []);

      if (filesToProcess.length === 0) {
        self.postMessage({ type: 'ERROR', error: "No files provided for processing." });
        return;
      }

      let parsedFiles = filesToProcess.map((file: { buffer: ArrayBuffer, name: string }) => {
        const text = decoder.decode(file.buffer);
        const parsed = parseRawDNA(text, allowlist);
        return { ...parsed, name: file.name };
      });

      if (parsedFiles.length === 0) {
        self.postMessage({ type: 'ERROR', error: "No files parsed" });
        return;
      }
      
      for (const pf of parsedFiles) {
        names.push(pf.name);
        if (pf.chip && pf.chip !== "Unknown Chip") {
          chips.push(pf.chip);
        }
        
        const snpMap = pf.snpMap;
        for (const rsid in snpMap) {
          const genotype = snpMap[rsid];
          if (!mergedSnpMap[rsid] || genotype.length > mergedSnpMap[rsid].length) {
            mergedSnpMap[rsid] = genotype;
          }
        }

        Object.assign(mergedSnpMetaMap, pf.snpMetaMap);
        
        const yMap = pf.yMap;
        for (const rsid in yMap) {
          const genotype = yMap[rsid];
          if (!mergedYMap[rsid] || mergedYMap[rsid].length < genotype.length) {
            mergedYMap[rsid] = genotype;
          }
        }

        Object.assign(mergedMtMap, pf.mtMap);
      }
      // MEMORY PRUNING: Clear large intermediate results
      (parsedFiles as any) = null;
    }

    const uniqueSnps = Object.keys(mergedSnpMap).length;
    const mergedName = names.length > 1 ? `Merged Kit (${names.length} files)` : names[0];
    const mergedChip = chips.length > 0 ? Array.from(new Set(chips)).join(" + ") : "Unknown Chip";
    
    // LIGHT IMPUTATION
    const imputedSnpMap = applyLightImputation(mergedSnpMap); 

    // CORE ANALYSIS
    const results = matchSNPs(imputedSnpMap, mergedSnpMetaMap);
    const predictedYDNA = predictYDNAHaplogroup(mergedYMap, Y_DNA_TREE);
    const predictedMtDNA = analyzeMtDNA(mergedMtMap);

    // ADVANCED CALCULATIONS (Heavy Lifting in Worker)
    
    const snpMapForEngine = new Map(Object.entries(imputedSnpMap));

    // Run heavy lifting in parallel
    const [
      ancientAdmixture,
      individualMatches,
      famousMatches,
      healthWellness,
      populationProximity,
      markerBenchmarks,
      k27Results_raw,
      grafResults_raw,
      microHapResults,
      comprehensiveResults
    ] = await Promise.all([
      calculateAncientAdmixture(imputedSnpMap),
      calculateIndividualMatches(imputedSnpMap),
      calculateFamousMatches(imputedSnpMap),
      matchHealthAndWellness(imputedSnpMap),
      calculatePopulationProximityOptimized(snpMapForEngine),
      calculateMarkerBenchmarks(imputedSnpMap),
      (async () => {
        const { calculateK27Scores } = await import("../engines/ancestry/k27AncEngine");
        return calculateK27Scores(imputedSnpMap);
      })(),
      (async () => {
        const { calculateRegionalScores } = await import("../engines/ancestry/grafAncEngine");
        return calculateRegionalScores(imputedSnpMap);
      })(),
      (async () => {
        const { identifyMicroHapSignatures } = await import("../engines/ancestry/microHapEngine");
        return identifyMicroHapSignatures(imputedSnpMap);
      })(),
      (async () => {
        const { calculateComprehensiveScores } = await import("../engines/ancestry/comprehensiveEngine");
        return calculateComprehensiveScores(imputedSnpMap);
      })()
    ]);

    // Oracle now runs AFTER GraF and K27 calculations have finished
    const oracleResults = await calculateAncestryOracle(
        results.filter(r => r.category === 'Ancestry'),
        predictedYDNA?.predicted?.continent,
        predictedMtDNA?.region,
        grafResults_raw,
        k27Results_raw,
        comprehensiveResults
      );

    self.postMessage({
      type: 'SUCCESS',
      payload: {
        name: mergedName,
        results,
        chip: mergedChip,
        snpCount: uniqueSnps,
        predictedYDNA,
        predictedMtDNA,
        mergedSnpMap,
        mergedMtMap,
        analysis: {
          ancientAdmixture,
          individualMatches,
          famousMatches,
          healthWellness,
          populationProximity,
          markerBenchmarks,
          k27Results: k27Results_raw,
          grafResults: grafResults_raw,
          microHapResults: microHapResults,
          oracleResults
        }
      }
    });
  } catch (err) {
    self.postMessage({
      type: 'ERROR',
      error: err instanceof Error ? err.message : "Unknown worker error"
    });
  }
};
