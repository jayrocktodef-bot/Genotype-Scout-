/**
 * analysisWorker.ts — Generic analysis worker for parallel engine dispatch.
 *
 * This worker accepts a task message specifying which engine to run,
 * along with the required SNP data. It dynamically dispatches to the
 * correct engine function and returns the result.
 *
 * Used by genotypeWorker.ts to fan out CPU-bound analysis across
 * multiple real threads via navigator.hardwareConcurrency.
 */

import { matchSNPs, getAllSources } from '../services/snpMatcher';
import { calculateMarkerBenchmarks } from '../utils/markerBenchmarks';
import { calculateAncientAdmixture, calculateIndividualMatches } from '../lib/AncientAdmixtureCalculator';
import { calculateFamousMatches } from '../utils/individualMatching';
import { matchHealthAndWellness } from '../utils/healthMatching';
import { calculatePopulationProximityOptimized, compileReferenceKernel } from '../engines/ancestry/fastMatrixEngine';
import { calculateHumanOriginsScores } from '../engines/ancestry/humanOriginsEngine';
import { calculateRegionalScores } from '../engines/ancestry/grafAncEngine';
import { identifyMicroHapSignatures } from '../engines/ancestry/microHapEngine';
import { calculateComprehensiveScores } from '../engines/ancestry/comprehensiveEngine';

// Pre-compile the reference kernel on worker init so it's ready when tasks arrive
compileReferenceKernel();

type EngineName =
  | 'matchSNPs'
  | 'calculateAncientAdmixture'
  | 'calculateIndividualMatches'
  | 'calculateFamousMatches'
  | 'matchHealthAndWellness'
  | 'calculatePopulationProximityOptimized'
  | 'calculateMarkerBenchmarks'
  | 'calculateHumanOriginsScores'
  | 'calculateRegionalScores'
  | 'identifyMicroHapSignatures'
  | 'calculateComprehensiveScores';

self.onmessage = async (e: MessageEvent) => {
  const { taskId, engine, snpMap, snpMetaMap } = e.data as {
    taskId: string;
    engine: EngineName;
    snpMap: Record<string, string>;
    snpMetaMap?: Record<string, { chrom: string; pos: number }>;
  };

  try {
    await compileReferenceKernel();

    let result: any;

    switch (engine) {
      case 'matchSNPs':
        result = matchSNPs(snpMap, snpMetaMap);
        break;
      case 'calculateAncientAdmixture':
        result = await calculateAncientAdmixture(snpMap);
        break;
      case 'calculateIndividualMatches':
        result = await calculateIndividualMatches(snpMap);
        break;
      case 'calculateFamousMatches':
        result = await calculateFamousMatches(snpMap);
        break;
      case 'matchHealthAndWellness':
        result = await matchHealthAndWellness(snpMap);
        break;
      case 'calculatePopulationProximityOptimized':
        result = await calculatePopulationProximityOptimized(new Map(Object.entries(snpMap)));
        break;
      case 'calculateMarkerBenchmarks':
        result = await calculateMarkerBenchmarks(snpMap);
        break;
      case 'calculateHumanOriginsScores':
        result = await calculateHumanOriginsScores(snpMap);
        break;
      case 'calculateRegionalScores':
        result = await calculateRegionalScores(snpMap);
        break;
      case 'identifyMicroHapSignatures':
        result = await identifyMicroHapSignatures(snpMap);
        break;
      case 'calculateComprehensiveScores':
        result = await calculateComprehensiveScores(snpMap);
        break;
      default:
        throw new Error(`Unknown engine: ${engine}`);
    }

    self.postMessage({ taskId, type: 'SUCCESS', result });
  } catch (err) {
    self.postMessage({
      taskId,
      type: 'ERROR',
      error: err instanceof Error ? err.message : String(err)
    });
  }
};
