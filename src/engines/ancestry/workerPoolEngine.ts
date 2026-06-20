import { POPULATION_MAP } from '../../utils/populationMapper';
import { microPhase } from './microPhaser';
import { correctPhasingErrors } from './phasingCorrector';
import { interpolator } from './geneticMapInterpolator';
import { RFMixTypeScript } from './rfmixTypeScript';

export interface LAISegment {
  continent: string;
  start: number;
  end: number;
  confidence: number;
}

export class WorkerPoolEngine {
  private workers: Worker[] = [];
  private maxWorkers: number;

  constructor() {
    this.maxWorkers = Math.min(navigator.hardwareConcurrency || 4, 4);
  }

  private initPool() {
    if (this.workers.length > 0) return;
    for (let i = 0; i < this.maxWorkers; i++) {
      this.workers.push(new Worker(new URL('../../workers/rfmixWorker.ts', import.meta.url), { type: 'module' }));
    }
  }

  public async runParallelAncestry(
    snps: any[],
    aimsDatabase: any,
    populations: string[],
    smoothness: number = 20,
    windowSize: number = 40,
    stepSize: number = 20
  ): Promise<Record<string, { strandA: LAISegment[]; strandB: LAISegment[] }>> {
    try {
      this.initPool();
      return await this.runParallelAncestryWithWorkers(snps, aimsDatabase, populations, smoothness, windowSize, stepSize);
    } catch (err) {
      console.warn("⚠️ Worker pool failed or was blocked. Falling back to main-thread local ancestry inference.", err);
      return this.runAncestryMainThread(snps, aimsDatabase, populations, smoothness, windowSize, stepSize);
    }
  }

  private runParallelAncestryWithWorkers(
    snps: any[],
    aimsDatabase: any,
    populations: string[],
    smoothness: number = 20,
    windowSize: number = 40,
    stepSize: number = 20
  ): Promise<Record<string, { strandA: LAISegment[]; strandB: LAISegment[] }>> {
    // Group snps by chromosome
    const chromTasks: Record<string, any[]> = {};
    snps.forEach(s => {
      const c = (s.chrom || s.chromosome || "").replace('chr', '').toUpperCase();
      if (!c) return;
      if (!chromTasks[c]) chromTasks[c] = [];
      chromTasks[c].push(s);
    });

    const chromosomes = Object.keys(chromTasks).sort((a, b) => {
      if (a === 'X') return 1;
      if (b === 'X') return -1;
      const nA = parseInt(a);
      const nB = parseInt(b);
      if (isNaN(nA)) return 1;
      if (isNaN(nB)) return -1;
      return nA - nB;
    });

    const results: any[] = [];
    const queue = [...chromosomes];
    
    return new Promise((resolve, reject) => {
      if (chromosomes.length === 0) {
        resolve({});
        return;
      }

      const checkFinished = () => {
        if (results.length === chromosomes.length) {
          resolve(this.reassemble(results, populations, chromTasks));
        }
      };

      const spawnTask = (worker: Worker, chrom: string) => {
        const onMsg = (e: MessageEvent) => {
          if (e.data.type === 'SUCCESS') {
            results.push(e.data);
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);
            
            const nextChrom = queue.shift();
            if (nextChrom) {
              spawnTask(worker, nextChrom);
            }
            checkFinished();
          } else if (e.data.type === 'ERROR') {
            worker.removeEventListener('message', onMsg);
            worker.removeEventListener('error', onErr);
            reject(new Error(e.data.message));
          }
        };

        const onErr = (err: any) => {
          worker.removeEventListener('message', onMsg);
          worker.removeEventListener('error', onErr);
          reject(err);
        };

        worker.addEventListener('message', onMsg);
        worker.addEventListener('error', onErr);

        worker.postMessage({
          type: 'PROCESS_CHROMOSOME',
          payload: {
            snps: chromTasks[chrom].sort((a, b) => a.pos - b.pos),
            aimsDatabase,
            populations,
            smoothness,
            windowSize,
            stepSize,
            chromosome: chrom
          }
        });
      };

      // Start initial batch
      const initialBatchCount = Math.min(this.maxWorkers, chromosomes.length);
      for (let i = 0; i < initialBatchCount; i++) {
        const chrom = queue.shift()!;
        spawnTask(this.workers[i], chrom);
      }
    });
  }

  public async runAncestryMainThread(
    snps: any[],
    aimsDatabase: any,
    populations: string[],
    smoothness: number = 20,
    windowSize: number = 40,
    stepSize: number = 20
  ): Promise<Record<string, { strandA: LAISegment[]; strandB: LAISegment[] }>> {
    const chromTasks: Record<string, any[]> = {};
    snps.forEach(s => {
      const c = (s.chrom || s.chromosome || "").replace('chr', '').toUpperCase();
      if (!c) return;
      if (!chromTasks[c]) chromTasks[c] = [];
      chromTasks[c].push(s);
    });

    const chromosomes = Object.keys(chromTasks).sort((a, b) => {
      if (a === 'X') return 1;
      if (b === 'X') return -1;
      const nA = parseInt(a);
      const nB = parseInt(b);
      if (isNaN(nA)) return 1;
      if (isNaN(nB)) return -1;
      return nA - nB;
    });

    const sanitizedDatabase: Record<string, any> = {};
    for (const [key, value] of Object.entries(aimsDatabase)) {
      const baseKey = key.split('_')[0].toLowerCase();
      sanitizedDatabase[baseKey] = value;
    }

    const finalSegments: Record<string, { strandA: LAISegment[]; strandB: LAISegment[] }> = {};

    for (const chrom of chromosomes) {
      // Allow minor UI releases
      await new Promise(r => setTimeout(r, 0));

      const chromSnps = chromTasks[chrom].sort((a, b) => a.pos - b.pos);
      const rsids = chromSnps.map(s => s.rsid);

      // 1. Initial Phasing
      const { strandA, strandB } = microPhase(chromSnps, sanitizedDatabase);

      // Pre-calculate transition probabilities
      const { windowIndices, markerToWindow } = this.calculateRawProbs(strandA, rsids, sanitizedDatabase, populations, windowSize, stepSize);
      const transitionProbs = this.getWindowTransitionProbs(windowIndices, chromSnps, chrom, smoothness);

      const executeLAIForStrand = (strand: string[]) => {
        const { rawProbs, nWindows } = this.calculateRawProbs(strand, rsids, sanitizedDatabase, populations, windowSize, stepSize);
        const result = RFMixTypeScript.smooth(rawProbs, nWindows, populations.length, transitionProbs);
        return { result, nWindows };
      };

      // Pass 1: Baseline Ancestry
      const laiA1 = executeLAIForStrand(strandA);
      const laiB1 = executeLAIForStrand(strandB);

      // STEP 2: Phasing Correction
      const corrected = correctPhasingErrors(
        strandA,
        strandB,
        { smoothedProbs: laiA1.result, nWindows: laiA1.nWindows, nPopulations: populations.length },
        { smoothedProbs: laiB1.result, nWindows: laiB1.nWindows, nPopulations: populations.length },
        sanitizedDatabase,
        rsids,
        markerToWindow,
        populations
      );

      // Pass 2: Polished Output
      const laiA2 = executeLAIForStrand(corrected.strandA);
      const laiB2 = executeLAIForStrand(corrected.strandB);

      finalSegments[chrom] = {
        strandA: this.extractTracts(laiA2.result, laiA2.nWindows, populations.length, populations, chromSnps),
        strandB: this.extractTracts(laiB2.result, laiB2.nWindows, populations.length, populations, chromSnps)
      };
    }

    return finalSegments;
  }

  private getWindowTransitionProbs(
    windowIndices: number[][],
    snps: any[],
    chromosome: string,
    generations: number = 20
  ): number[] {
    const transitionProbs: number[] = [];
    for (let i = 0; i < windowIndices.length - 1; i++) {
      const midIdx1 = windowIndices[i][Math.floor(windowIndices[i].length / 2)];
      const midIdx2 = windowIndices[i+1][Math.floor(windowIndices[i+1].length / 2)];
      const pos1 = snps[midIdx1].pos || 0;
      const pos2 = snps[midIdx2].pos || 0;
      
      const distCm = interpolator.getCMDistance(chromosome, pos1, pos2);
      const stayProb = Math.exp(-generations * (distCm / 100));
      transitionProbs.push(Math.max(0.7, Math.min(0.9999, stayProb)));
    }
    return transitionProbs;
  }

  private calculateRawProbs(
    strand: string[], 
    rsids: string[], 
    aimsDatabase: Record<string, any>, 
    populations: string[],
    windowSize: number = 40,
    stepSize: number = 20
  ) {
    const nPopulations = populations.length;
    const nMarkers = rsids.length;
    
    const windowIndices: number[][] = [];
    const markerToWindow = new Array(nMarkers).fill(-1);
    
    for (let i = 0; i < nMarkers; i += stepSize) {
      const end = Math.min(i + windowSize, nMarkers);
      const win = [];
      for (let j = i; j < end; j++) {
        win.push(j);
        if (markerToWindow[j] === -1) markerToWindow[j] = windowIndices.length;
      }
      windowIndices.push(win);
      if (end === nMarkers) break;
    }
    
    const nWindows = windowIndices.length;
    const rawProbs = new Float32Array(nWindows * nPopulations);
    
    for (let w = 0; w < nWindows; w++) {
      const markerIdxs = windowIndices[w];
      const logProbs = new Float64Array(nPopulations).fill(0);
      
      for (const mIdx of markerIdxs) {
        const rsid = rsids[mIdx].toLowerCase();
        const allele = strand[mIdx];
        const markerData = aimsDatabase[rsid];
        
        if (!markerData || !markerData.frequencies || allele === '?' || allele === '-') continue;
        
        const targetAllele = markerData.alleles[0];
        
        for (let p = 0; p < nPopulations; p++) {
          const popCode = populations[p];
          const freq = Math.max(0.001, Math.min(0.999, markerData.frequencies[popCode] || 0.01));
          const prob = (allele === targetAllele) ? freq : (1 - freq);
          logProbs[p] += Math.log(prob);
        }
      }
      
      const maxLog = Math.max(...logProbs);
      let sumProb = 0;
      for (let p = 0; p < nPopulations; p++) {
        const prob = Math.exp(logProbs[p] - maxLog);
        rawProbs[w * nPopulations + p] = prob;
        sumProb += prob;
      }
      if (sumProb > 0) {
        for (let p = 0; p < nPopulations; p++) rawProbs[w * nPopulations + p] /= sumProb;
      } else {
        for (let p = 0; p < nPopulations; p++) rawProbs[w * nPopulations + p] = 1 / nPopulations;
      }
    }
    
    return { rawProbs, nWindows, markerToWindow, windowIndices };
  }

  private reassemble(
    workerResults: any[],
    populations: string[],
    chromTasks: Record<string, any[]>
  ): Record<string, { strandA: LAISegment[]; strandB: LAISegment[] }> {
    const finalSegments: Record<string, { strandA: LAISegment[]; strandB: LAISegment[] }> = {};

    workerResults.forEach(res => {
      const { chromosome, resultStrandA, resultStrandB, nWindows, nPopulations } = res;
      if (!chromTasks[chromosome]) return;
      const chromSnps = chromTasks[chromosome].sort((a, b) => a.pos - b.pos);
      
      // Ensure we have Float32Array views (buffers may arrive as ArrayBuffer after transfer)
      const probsA = resultStrandA instanceof Float32Array 
        ? resultStrandA 
        : new Float32Array(resultStrandA);
      const probsB = resultStrandB instanceof Float32Array 
        ? resultStrandB 
        : new Float32Array(resultStrandB);
      
      finalSegments[chromosome] = {
        strandA: this.extractTracts(probsA, nWindows, nPopulations, populations, chromSnps),
        strandB: this.extractTracts(probsB, nWindows, nPopulations, populations, chromSnps)
      };
    });

    return finalSegments;
  }

  private extractTracts(
    probs: Float32Array,
    nWindows: number,
    nPopulations: number,
    populations: string[],
    snps: any[]
  ): LAISegment[] {
    const segments: LAISegment[] = [];
    if (nWindows === 0 || snps.length === 0) return [];

    // Reconstruct the same window-to-SNP midpoint mapping used in calculateRawProbs.
    // The windows were built with windowSize=40, stepSize=20 (sliding).
    const calcWindowSize = 40;
    const calcStepSize = 20;
    const nMarkers = snps.length;

    // Build a mapping: windowIndex → representative SNP index (midpoint of window)
    const windowMidpoints: number[] = [];
    for (let i = 0; i < nMarkers; i += calcStepSize) {
      const end = Math.min(i + calcWindowSize, nMarkers);
      const mid = Math.min(Math.floor((i + end) / 2), nMarkers - 1);
      windowMidpoints.push(mid);
      if (end === nMarkers) break;
    }

    // If the reconstructed count differs from nWindows, fall back to uniform mapping
    const useReconstructed = windowMidpoints.length === nWindows;

    const getSnpIdx = (windowIdx: number): number => {
      if (useReconstructed) {
        return Math.min(windowMidpoints[windowIdx], nMarkers - 1);
      }
      // Fallback: linear interpolation
      return Math.min(Math.round((windowIdx / Math.max(nWindows - 1, 1)) * (nMarkers - 1)), nMarkers - 1);
    };

    let currentPopIdx = -1;
    let startWindowIdx = 0;

    for (let i = 0; i < nWindows; i++) {
      let maxProb = -1;
      let maxPop = 0;
      for (let p = 0; p < nPopulations; p++) {
        const prob = probs[i * nPopulations + p];
        if (prob > maxProb) {
          maxProb = prob;
          maxPop = p;
        }
      }

      if (maxPop !== currentPopIdx) {
        if (currentPopIdx !== -1) {
          const sIdx = getSnpIdx(startWindowIdx);
          const eIdx = getSnpIdx(i);
          segments.push({
            continent: populations[currentPopIdx],
            start: snps[sIdx].pos,
            end: snps[eIdx].pos,
            confidence: probs[(i - 1) * nPopulations + currentPopIdx]
          });
        }
        currentPopIdx = maxPop;
        startWindowIdx = i;
      }
    }

    // Final segment
    if (currentPopIdx !== -1) {
      const sIdx = getSnpIdx(startWindowIdx);
      const eIdx = nMarkers - 1;
      segments.push({
        continent: populations[currentPopIdx],
        start: snps[sIdx].pos,
        end: snps[eIdx].pos,
        confidence: probs[(nWindows - 1) * nPopulations + currentPopIdx]
      });
    }

    return segments;
  }

  public terminateAll() {
    this.workers.forEach(w => w.terminate());
    this.workers = [];
  }
}

export const workerPoolEngine = new WorkerPoolEngine();
