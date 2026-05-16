/**
 * rfmixWorker.ts
 * Web Worker for Local Ancestry Inference via WebAssembly.
 */

import { RFMixTypeScript } from '../engines/ancestry/rfmixTypeScript';
import { microPhase } from '../engines/ancestry/microPhaser';
import { correctPhasingErrors } from '../engines/ancestry/phasingCorrector';
import { interpolator } from '../engines/ancestry/geneticMapInterpolator';

interface RFMixTask {
    type: 'RUN_INFERENCE' | 'RUN_FULL_PIPELINE' | 'PROCESS_CHROMOSOME';
    payload: {
        rawProbs?: Float32Array;
        nWindows?: number;
        nPopulations?: number;
        smoothness: number;

        // For RUN_FULL_PIPELINE and PROCESS_CHROMOSOME
        snps?: { rsid: string; genotype: string; chrom?: string; pos?: number }[];
        aimsDatabase?: Record<string, any>;
        chromosome?: string;
        populations?: string[];
        windowSize?: number;
        stepSize?: number;
    };
}

let wasmEngine: any = null;

/**
 * Attempt to load the Wasm module if available
 */
async function initWasmEngine() {
    try {
        // Dynamic import hidden from static analysis to prevent build failures
        const wasmPath = '../engines/ancestry/wasm/rfmix_engine.js';
        // @ts-ignore
        const { default: createRFMixModule } = await import(/* @vite-ignore */ wasmPath);
        const Module = await createRFMixModule();
        wasmEngine = new Module.RFMixEngine();
        console.log("🚀 RFMix Wasm Engine Loaded Successfully");
        return true;
    } catch (e) {
        console.warn("⚠️ Wasm Engine not found or failed to load. Using hardware-accelerated TypeScript fallback.");
        return false;
    }
}

/**
 * calculateRawProbs
 * Generates window-based probability vectors for a single phased strand.
 */
function getWindowTransitionProbs(
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
        // stayProb = exp(-generations * distMorgans)
        const stayProb = Math.exp(-generations * (distCm / 100));
        transitionProbs.push(Math.max(0.7, Math.min(0.9999, stayProb)));
    }
    return transitionProbs;
}

function calculateRawProbs(
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

self.onmessage = async (e: MessageEvent<RFMixTask>) => {
    const { type, payload } = e.data;

    if (type === 'RUN_INFERENCE' || type === 'RUN_FULL_PIPELINE' || type === 'PROCESS_CHROMOSOME') {
        try {
            if (type === 'RUN_INFERENCE') {
                const { rawProbs, nWindows, nPopulations, smoothness } = payload;
                if (!rawProbs || nWindows === undefined || nPopulations === undefined) throw new Error("Missing parameters for inference");

                // Try Wasm first, otherwise use optimized TypeScript
                if (wasmEngine || await initWasmEngine()) {
                    const resultView = wasmEngine.processChromosome(
                        rawProbs,
                        new Float32Array(nPopulations).fill(1/nPopulations),
                        nWindows,
                        nPopulations
                    );
                    const result = new Float32Array(resultView).slice();
                    (self as any).postMessage({ type: 'SUCCESS', result: result, nWindows, nPopulations }, [result.buffer]);
                } else {
                    const smoothedResult = RFMixTypeScript.smooth(rawProbs, nWindows, nPopulations, smoothness);
                    (self as any).postMessage({ type: 'SUCCESS', result: smoothedResult, nWindows, nPopulations }, [smoothedResult.buffer]);
                }
            } else {
                // RUN_FULL_PIPELINE or PROCESS_CHROMOSOME
                const { snps, aimsDatabase, populations, smoothness, windowSize, stepSize, chromosome = "1" } = payload;
                if (!snps || !aimsDatabase || !populations) throw new Error("Missing data for full pipeline");

                // 0. Sanitize Aims Database to handle RSID suffixes (e.g., _AFR)
                const sanitizedDatabase: Record<string, any> = {};
                for (const [key, value] of Object.entries(aimsDatabase)) {
                    const baseKey = key.split('_')[0].toLowerCase();
                    sanitizedDatabase[baseKey] = value;
                }

                const rsids = snps.map(s => s.rsid);
                
                // 1. Initial Phasing
                let { strandA, strandB } = microPhase(snps, sanitizedDatabase);

                // Pre-calculate transition probabilities
                const { windowIndices, markerToWindow } = calculateRawProbs(strandA, rsids, sanitizedDatabase, populations, windowSize, stepSize);
                const transitionProbs = getWindowTransitionProbs(windowIndices, snps, chromosome, smoothness);

                const executeLAIForStrand = async (strand: string[]) => {
                    let { rawProbs, nWindows } = calculateRawProbs(strand, rsids, sanitizedDatabase, populations, windowSize, stepSize);
                    let result: Float32Array;

                    if (wasmEngine || await initWasmEngine()) {
                        const resultView = wasmEngine.processChromosome(rawProbs, new Float32Array(populations.length).fill(1/populations.length), nWindows, populations.length);
                        result = new Float32Array(resultView).slice();
                    } else {
                        result = RFMixTypeScript.smooth(rawProbs, nWindows, populations.length, transitionProbs);
                    }
                    
                    // Memory Cleanup: clear rawProbs after smoothing
                    (rawProbs as any) = null;
                    return { result, nWindows };
                };

                // Pass 1: Baseline Ancestry
                const laiA1 = await executeLAIForStrand(strandA);
                const laiB1 = await executeLAIForStrand(strandB);

                // STEP 2: Phasing Correction
                const corrected = correctPhasingErrors(
                    strandA, strandB, 
                    { smoothedProbs: laiA1.result, nWindows: laiA1.nWindows, nPopulations: populations.length },
                    { smoothedProbs: laiB1.result, nWindows: laiB1.nWindows, nPopulations: populations.length },
                    sanitizedDatabase, rsids, markerToWindow, populations
                );
                
                // Explicit Memory Cleanup for Pass 1
                (laiA1.result as any) = null;
                (laiB1.result as any) = null;

                // Pass 2: Polished Output
                const laiA2 = await executeLAIForStrand(corrected.strandA);
                const laiB2 = await executeLAIForStrand(corrected.strandB);

                const resultStrandA = laiA2.result;
                const resultStrandB = laiB2.result;

                (self as any).postMessage({
                    type: 'SUCCESS',
                    chromosome,
                    resultStrandA,
                    resultStrandB,
                    nWindows: laiA2.nWindows,
                    nPopulations: populations.length,
                    correctedStrands: { strandA: corrected.strandA, strandB: corrected.strandB }
                }, [resultStrandA.buffer, resultStrandB.buffer]);
            }

        } catch (error) {
            console.error("Local Ancestry Error:", error);
            (self as any).postMessage({
                type: 'ERROR',
                message: error instanceof Error ? error.message : "Inference failure"
            });
        }
    }
};

export {};
