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
  ): Promise<Record<string, LAISegment[]>> {
    this.initPool();

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
    populations: string[],
    chromTasks: Record<string, any[]>
  ): Record<string, LAISegment[]> {
    const finalSegments: Record<string, LAISegment[]> = {};

    workerResults.forEach(res => {
      const { chromosome, resultStrandA, resultStrandB, nWindows, nPopulations } = res;
      const chromSnps = chromTasks[chromosome].sort((a, b) => a.pos - b.pos);
      
      // Extract segments from Strand A (Primary)
      finalSegments[chromosome] = this.extractTracts(resultStrandA, nWindows, nPopulations, populations, chromSnps);
      
      // Optionally combine with Strand B or keep as separate tracks if UI supports it.
      // For standard ChromosomePainter, we'll merge them or just use Strand A for now.
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
