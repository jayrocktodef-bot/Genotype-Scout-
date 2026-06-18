const fs = require('fs');

const populations = ['AFR', 'EUR', 'EAS', 'AMR', 'SAS'];

function calculateRawProbs(
    strand, 
    rsids, 
    aimsDatabase, 
    populations,
    windowSize = 40,
    stepSize = 20
) {
    const nPopulations = populations.length;
    const nMarkers = rsids.length;
    
    const windowIndices = [];
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

function smooth(
    rawProbs,
    nWindows,
    nPopulations,
    transitionProbParam = 0.99
) {
    const alpha = new Float32Array(nWindows * nPopulations);
    const beta = new Float32Array(nWindows * nPopulations);
    const smoothed = new Float32Array(nWindows * nPopulations);
    
    const getTransitionProbs = (idx) => {
        const tp = (Array.isArray(transitionProbParam) ? transitionProbParam[idx] : transitionProbParam) ?? 0.99;
        const sp = (1 - tp) / (nPopulations - 1);
        return { tp, sp };
    };

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
        if (sumAlpha > 0) {
            for (let p = 0; p < nPopulations; p++) alpha[i * nPopulations + p] /= sumAlpha;
        }
    }

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
        if (sumBeta > 0) {
            for (let p = 0; p < nPopulations; p++) beta[i * nPopulations + p] /= sumBeta;
        }
    }

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

const aimsDb = {
    'rs1': { alleles: ['A', 'G'], frequencies: { EUR: 0.9, AFR: 0.1 } },
    'rs2': { alleles: ['C', 'T'], frequencies: { EUR: 0.1, AFR: 0.9 } },
    'rs3': { alleles: ['G', 'C'], frequencies: { EUR: 0.5, AFR: 0.5 } }
};

const strandA = ['A', 'C', 'G'];
const rsids = ['rs1', 'rs2', 'rs3'];

const res = calculateRawProbs(strandA, rsids, aimsDb, populations, 2, 1);
console.log("Raw Probs:", res.rawProbs);

const smoothed = smooth(res.rawProbs, res.nWindows, populations.length, 0.99);
console.log("Smoothed:", smoothed);
