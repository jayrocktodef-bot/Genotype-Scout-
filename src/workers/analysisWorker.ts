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
import { calculatePopulationProximityOptimized } from '../engines/ancestry/fastMatrixEngine';
import { calculateHumanOriginsScores } from '../engines/ancestry/humanOriginsEngine';
import { calculateRegionalScores } from '../engines/ancestry/grafAncEngine';
import { identifyMicroHapSignatures } from '../engines/ancestry/microHapEngine';
import { calculateComprehensiveScores } from '../engines/ancestry/comprehensiveEngine';

import { serializeGenomicsError } from '../services/errorCaller';

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

// ── Global Worker Error & Unhandled Rejection Listeners ─────────────
self.addEventListener('error', (event: ErrorEvent) => {
  console.error("analysisWorker unhandled error:", event.error || event.message);
  self.postMessage({
    type: 'ERROR',
    error: serializeGenomicsError(event.error || event.message, 'ANALYSIS_WORKER')
  });
});

self.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error("analysisWorker unhandled promise rejection:", event.reason);
  self.postMessage({
    type: 'ERROR',
    error: serializeGenomicsError(event.reason, 'ANALYSIS_WORKER')
  });
});

self.onmessage = async (e: MessageEvent) => {
  const { taskId, engine, snpMap, snpMetaMap, ancientAdmixture } = e.data as {
    taskId: string;
    engine: EngineName;
    snpMap: Record<string, string>;
    snpMetaMap?: Record<string, { chrom: string; pos: number }>;
    ancientAdmixture?: any;
  };

  try {
    let result: any;

    switch (engine) {
      case 'matchSNPs':
        result = matchSNPs(snpMap, snpMetaMap);
        break;
      case 'calculateAncientAdmixture':
        result = await calculateAncientAdmixture(snpMap);
        break;
      case 'calculateIndividualMatches':
        result = await calculateIndividualMatches(snpMap, ancientAdmixture);
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
      error: serializeGenomicsError(err, 'ENGINE_EXECUTION', { failedEngine: engine })
    });
  }
};
