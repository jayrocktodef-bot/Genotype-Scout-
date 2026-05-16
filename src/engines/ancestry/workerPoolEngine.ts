import { POPULATION_MAP } from '../../utils/populationMapper';

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
    this.maxWorkers = navigator.hardwareConcurrency || 4;
  }

  private async initPool(aimsDatabase: any, populations: string[]) {
    const poolSize = navigator.hardwareConcurrency || 4;
    
    // Always update database for existing workers, or create them
    const initPromises = [];
    for (let i = 0; i < poolSize; i++) {
      let worker;
      if (this.workers[i]) {
        worker = this.workers[i];
      } else {
        worker = new Worker(new URL('../../workers/rfmixWorker.ts', import.meta.url), { type: 'module' });
        this.workers.push(worker);
      }
      
      const p = new Promise<void>((resolve) => {
        const onMsg = (e: MessageEvent) => {
          if (e.data.type === 'DATABASE_SET') {
            worker.removeEventListener('message', onMsg);
            resolve();
          }
        };
        worker.addEventListener('message', onMsg);
        worker.postMessage({ type: 'SET_DATABASE', payload: { aimsDatabase, populations }});
      });
      initPromises.push(p);
    }
    await Promise.all(initPromises);
  }

  public async runParallelAncestry(
    snps: any[],
    aimsDatabase: any,
    populations: string[],
    smoothness: number = 20,
    windowSize: number = 40,
    stepSize: number = 20
  ): Promise<Record<string, { A: LAISegment[], B: LAISegment[] }>> {
    await this.initPool(aimsDatabase, populations);

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
    let nextWorkerIdx = 0;
    
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

  private reassemble(
    workerResults: any[],
    _populations: string[],
    _chromTasks: Record<string, any[]>
  ): Record<string, { A: LAISegment[], B: LAISegment[] }> {
    const finalSegments: Record<string, { A: LAISegment[], B: LAISegment[] }> = {};

    workerResults.forEach(res => {
      const { chromosome, resultStrandA, resultStrandB, isCompressed } = res;
      
      if (isCompressed) {
        const decodedA = JSON.parse(new TextDecoder().decode(resultStrandA));
        const decodedB = JSON.parse(new TextDecoder().decode(resultStrandB));
        finalSegments[chromosome] = { A: decodedA, B: decodedB };
      }
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
    if (nWindows === 0) return [];

    const windowSize = Math.ceil(snps.length / nWindows);
    
    let currentPopIdx = -1;
    let startIdx = 0;

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
          const sIdx = startIdx * windowSize;
          const eIdx = Math.min(i * windowSize, snps.length - 1);
          segments.push({
            continent: populations[currentPopIdx],
            start: snps[sIdx].pos,
            end: snps[eIdx].pos,
            confidence: probs[(i-1) * nPopulations + currentPopIdx]
          });
        }
        currentPopIdx = maxPop;
        startIdx = i;
      }
    }

    // Final segment
    if (currentPopIdx !== -1) {
      const sIdx = startIdx * windowSize;
      const eIdx = snps.length - 1;
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
