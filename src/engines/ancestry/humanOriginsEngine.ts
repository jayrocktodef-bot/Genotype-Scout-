import hoModernKernel from '../../data/raw_aims/ho_modern_reference_kernel.json';
import { solveNNLS } from '../../utils/nnls';

export interface AdmixtureComponent {
  population: string;
  region: string;
  percentage: number;
  distance: number;
}

/**
 * Human Origins Ancestry Engine (K61)
 * Uses a Non-Negative Least Squares (NNLS) solver to estimate optimal population mixture proportions
 * based on the 61-population Human Origins reference dataset.
 */
export async function calculateHumanOriginsScores(userSnps: Record<string, string>): Promise<AdmixtureComponent[]> {
  // Normalize user SNPs keys
  const normalizedUserSnps: Record<string, string> = {};
  for (const rsid in userSnps) {
    normalizedUserSnps[rsid.toLowerCase()] = userSnps[rsid];
  }

  const pops = Object.keys(hoModernKernel);
  const N = pops.length;
  
  // Find all rsids that are common across the kernel and present in user SNPs
  const firstPop = pops[0];
  const allRsids = Object.keys((hoModernKernel as any)[firstPop].frequencies);
  const matchedRsids = allRsids.filter(rsid => {
    const userCall = normalizedUserSnps[rsid.toLowerCase()];
    return userCall && userCall.length === 2 && userCall !== '--';
  });

  const totalMatched = matchedRsids.length;
  if (totalMatched < 10) {
    return [];
  }

  // Cap the number of markers evaluated for NNLS performance
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
    
    // Determine the average frequency across all populations to resolve dosage direction
    let sumFreq = 0;
    for (let j = 0; j < N; j++) {
      const popName = pops[j];
      const popData = (hoModernKernel as any)[popName];
      sumFreq += popData.frequencies[rsid] || 0;
    }
    const avgFreq = sumFreq / N;

    // Calculate user call value
    const userCall = normalizedUserSnps[rsid.toLowerCase()];
    let userVal = 0.5; // Heterozygous
    if (userCall[0] === userCall[1]) {
      // Homozygous: Assumes major allele direction correlates with >0.5 average freq
      userVal = avgFreq > 0.5 ? 1.0 : 0.0;
    }

    b[i] = userVal;

    for (let j = 0; j < N; j++) {
      const popName = pops[j];
      const popData = (hoModernKernel as any)[popName];
      A[i][j] = popData.frequencies[rsid] || 0;
    }
  }

  // Solve NNLS
  const weights = solveNNLS(A, b);
  const sumWeights = weights.reduce((sum, w) => sum + w, 0);

  const components: AdmixtureComponent[] = [];
  if (sumWeights > 0) {
    for (let j = 0; j < N; j++) {
      const popName = pops[j];
      const rawPercentage = (weights[j] / sumWeights) * 100;
      if (rawPercentage > 0.5) { // Only return >0.5% contributions
        components.push({
          population: popName.replace(/_/g, ' '),
          region: (hoModernKernel as any)[popName].region,
          percentage: Number(rawPercentage.toFixed(2)),
          distance: 0.0
        });
      }
    }
  }

  return components.sort((a, b) => b.percentage - a.percentage);
}
