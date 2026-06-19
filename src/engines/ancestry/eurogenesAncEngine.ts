import eurogenesKernel from '../../data/raw_aims/eurogenes_k13_kernel.json';
import { solveNNLS } from '../../utils/nnls';

export interface AdmixtureComponent {
  population: string;
  region: string;
  percentage: number;
  distance: number;
}

/**
 * Eurogenes K13 Ancestry Engine
 * Uses a Non-Negative Least Squares (NNLS) solver to estimate optimal population mixture proportions
 * based on the Eurogenes K13 reference dataset.
 */
export async function calculateEurogenesK13Scores(userSnps: Record<string, string>): Promise<AdmixtureComponent[]> {
  // Normalize user SNPs keys
  const normalizedUserSnps: Record<string, string> = {};
  for (const rsid in userSnps) {
    normalizedUserSnps[rsid.toLowerCase()] = userSnps[rsid];
  }

  const pops = Object.keys(eurogenesKernel);
  const N = pops.length;
  
  // Find all rsids that are common across the kernel and present in user SNPs
  const firstPop = pops[0];
  const allRsids = Object.keys((eurogenesKernel as any)[firstPop].frequencies);
  const matchedRsids = allRsids.filter(rsid => {
    const userCall = normalizedUserSnps[rsid.toLowerCase()];
    return userCall && userCall.length === 2 && userCall !== '--';
  });

  const totalMatched = matchedRsids.length;
  if (totalMatched < 1) {
    // Return empty if no markers match (the placeholder kernel only has 2 SNPs for now)
    return [];
  }

  // Thin markers if there are too many
  const MAX_MARKERS = 1000;
  const thinnedRsids = totalMatched > MAX_MARKERS 
    ? matchedRsids.filter((_, idx) => idx % Math.ceil(totalMatched / MAX_MARKERS) === 0).slice(0, MAX_MARKERS)
    : matchedRsids;

  const M = thinnedRsids.length;

  // Build A (M x N) and b (M)
  const A: number[][] = Array.from({ length: M }, () => new Array(N).fill(0));
  const b: number[] = new Array(M).fill(0);

  for (let i = 0; i < M; i++) {
    const rsid = thinnedRsids[i];
    
    // Determine the average frequency across all populations to resolve dosage direction consistently
    let sumFreq = 0;
    for (let j = 0; j < N; j++) {
      const popName = pops[j];
      const popData = (eurogenesKernel as any)[popName];
      sumFreq += popData.frequencies[rsid] || 0;
    }
    const avgFreq = sumFreq / N;

    // Calculate user call value based on average frequency direction
    const userCall = normalizedUserSnps[rsid.toLowerCase()];
    let userVal = 0.5; // Heterozygous
    if (userCall[0] === userCall[1]) {
      userVal = avgFreq > 0.5 ? 1.0 : 0.0;
    }

    b[i] = userVal;

    for (let j = 0; j < N; j++) {
      const popName = pops[j];
      const popData = (eurogenesKernel as any)[popName];
      A[i][j] = popData.frequencies[rsid] || 0;
    }
  }

  // Solve NNLS: Minimizes ||Ax - b|| subject to x >= 0
  const weights = solveNNLS(A, b);
  const sumWeights = weights.reduce((sum, w) => sum + w, 0);

  const components: AdmixtureComponent[] = [];
  if (sumWeights > 0) {
    for (let j = 0; j < N; j++) {
      const popName = pops[j];
      const rawPercentage = (weights[j] / sumWeights) * 100;
      if (rawPercentage > 0.5) {
        components.push({
          population: popName.replace(/_/g, ' '),
          region: (eurogenesKernel as any)[popName].region,
          percentage: Number(rawPercentage.toFixed(2)),
          distance: 0.0 // NNLS computes a direct linear mix fit
        });
      }
    }
  }

  return components.sort((a, b) => b.percentage - a.percentage);
}
