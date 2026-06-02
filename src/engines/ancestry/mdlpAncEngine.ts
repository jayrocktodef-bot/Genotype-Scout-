import hoReferenceKernel from '../../data/raw_aims/ho_modern_reference_kernel.json';
import { solveNNLS } from '../../utils/nnls';

export interface AdmixtureComponent {
  population: string;
  region: string;
  percentage: number;
  distance: number;
}

/**
 * MDLP K16 Modern Ancestry Engine
 * Uses a Non-Negative Least Squares (NNLS) solver to estimate optimal population mixture proportions.
 */
export async function calculateMDLPK16Scores(userSnps: Record<string, string>): Promise<AdmixtureComponent[]> {
  // Normalize user SNPs keys
  const normalizedUserSnps: Record<string, string> = {};
  for (const rsid in userSnps) {
    normalizedUserSnps[rsid.toLowerCase()] = userSnps[rsid];
  }

  const pops = Object.keys(hoReferenceKernel);
  const N = pops.length;
  
  // Find all rsids that are common across the kernel and present in user SNPs
  const firstPop = pops[0];
  const allRsids = Object.keys((hoReferenceKernel as any)[firstPop].frequencies);
  const matchedRsids = allRsids.filter(rsid => {
    const userCall = normalizedUserSnps[rsid.toLowerCase()];
    return userCall && userCall.length === 2 && userCall !== '--';
  });

  const M = matchedRsids.length;
  if (M < 5) {
    // Fallback if too few markers matched
    return [];
  }

  // Build A (M x N) and b (M)
  const A: number[][] = Array.from({ length: M }, () => new Array(N).fill(0));
  const b: number[] = new Array(M).fill(0);

  for (let i = 0; i < M; i++) {
    const rsid = matchedRsids[i];
    
    // Determine the average frequency across all populations to resolve dosage direction consistently
    let sumFreq = 0;
    for (let j = 0; j < N; j++) {
      const popName = pops[j];
      const popData = (hoReferenceKernel as any)[popName];
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
      const popData = (hoReferenceKernel as any)[popName];
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
          population: popName.replace(/-/g, ' '),
          region: (hoReferenceKernel as any)[popName].region,
          percentage: Number(rawPercentage.toFixed(2)),
          distance: 0.0 // NNLS computes a direct linear mix fit
        });
      }
    }
  }

  return components.sort((a, b) => b.percentage - a.percentage);
}
