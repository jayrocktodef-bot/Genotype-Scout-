/**
 * rfmixTypeScript.ts
 * Pure TypeScript implementation of the Local Ancestry Inference (LAI) smoothing logic.
 * Optimised for high-throughput processing of genomic windows.
 */

export interface LAIResults {
  smoothedProbs: Float32Array;
  nWindows: number;
  nPopulations: number;
}

/**
 * Local Ancestry Inference Engine
 * Implements a Conditional Random Field (CRF) style smoothing algorithm 
 * to resolve noisy classification outputs into distinct ancestry tracts.
 */
export class RFMixTypeScript {
  /**
   * smooth
   * Performs a Forward-Backward HMM smoothing pass across chromosome windows.
   * 
   * @param rawProbs - Float32Array containing probability vectors [win0_p0, win0_p1, ..., winN_pN]
   * @param nWindows - Number of genetic windows
   * @param nPopulations - Number of reference populations
   * @param transitionProbParam - Static probability or array of per-window transition probabilities
   */
  public static smooth(
    rawProbs: Float32Array,
    nWindows: number,
    nPopulations: number,
    transitionProbParam: number | number[] = 0.99
  ): Float32Array {
    const alpha = new Float32Array(nWindows * nPopulations);
    const beta = new Float32Array(nWindows * nPopulations);
    const smoothed = new Float32Array(nWindows * nPopulations);
    
    const getTransitionProbs = (idx: number) => {
      const tp = (Array.isArray(transitionProbParam) ? transitionProbParam[idx] : transitionProbParam) ?? 0.99;
      const sp = (1 - tp) / (nPopulations - 1);
      return { tp, sp };
    };

    // 1. Forward Pass
    // Initialize alpha at t=0
    let sumAlpha0 = 0;
    for (let p = 0; p < nPopulations; p++) {
      alpha[p] = rawProbs[p] * (1 / nPopulations);
      sumAlpha0 += alpha[p];
    }
    for (let p = 0; p < nPopulations; p++) alpha[p] /= sumAlpha0;

    for (let i = 1; i < nWindows; i++) {
      const { tp, sp } = getTransitionProbs(i - 1);
      let sumAlpha = 0;
      for (let p = 0; p < nPopulations; p++) {
        let transitionSum = 0;
        for (let prevP = 0; prevP < nPopulations; prevP++) {
          const t = (p === prevP) ? tp : sp;
          transitionSum += alpha[(i - 1) * nPopulations + prevP] * t;
        }
        alpha[i * nPopulations + p] = rawProbs[i * nPopulations + p] * transitionSum;
        sumAlpha += alpha[i * nPopulations + p];
      }
      // Re-scale to prevent underflow
      if (sumAlpha > 0) {
        for (let p = 0; p < nPopulations; p++) alpha[i * nPopulations + p] /= sumAlpha;
      }
    }

    // 2. Backward Pass
    // Initialize beta at t=N-1
    for (let p = 0; p < nPopulations; p++) {
      beta[(nWindows - 1) * nPopulations + p] = 1.0 / nPopulations;
    }

    for (let i = nWindows - 2; i >= 0; i--) {
      const { tp, sp } = getTransitionProbs(i);
      let sumBeta = 0;
      for (let p = 0; p < nPopulations; p++) {
        let transitionSum = 0;
        for (let nextP = 0; nextP < nPopulations; nextP++) {
          const t = (p === nextP) ? tp : sp;
          transitionSum += beta[(i + 1) * nPopulations + nextP] * rawProbs[(i + 1) * nPopulations + nextP] * t;
        }
        beta[i * nPopulations + p] = transitionSum;
        sumBeta += beta[i * nPopulations + p];
      }
      // Re-scale
      if (sumBeta > 0) {
        for (let p = 0; p < nPopulations; p++) beta[i * nPopulations + p] /= sumBeta;
      }
    }

    // 3. Combine
    for (let i = 0; i < nWindows; i++) {
      let windowSum = 0;
      for (let p = 0; p < nPopulations; p++) {
        smoothed[i * nPopulations + p] = alpha[i * nPopulations + p] * beta[i * nPopulations + p];
        windowSum += smoothed[i * nPopulations + p];
      }
      if (windowSum > 0) {
        for (let p = 0; p < nPopulations; p++) smoothed[i * nPopulations + p] /= windowSum;
      }
    }

    return smoothed;
  }

  /**
   * identifyTracts
   * Converts smoothed probabilities into discrete ancestry assignments (Max-Likelihood).
   */
  public static identifyTracts(smoothed: Float32Array, nWindows: number, nPopulations: number): Int32Array {
    const assignments = new Int32Array(nWindows);
    for (let i = 0; i < nWindows; i++) {
      let maxProb = -1;
      let maxPop = 0;
      for (let p = 0; p < nPopulations; p++) {
        const prob = smoothed[i * nPopulations + p];
        if (prob > maxProb) {
          maxProb = prob;
          maxPop = p;
        }
      }
      assignments[i] = maxPop;
    }
    return assignments;
  }
}
