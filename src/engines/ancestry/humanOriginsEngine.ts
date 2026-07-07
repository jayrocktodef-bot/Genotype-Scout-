import graf10kIndex from '../../data/raw_aims/graf_10k_index.json';
import { solveNNLS } from '../../utils/nnls';
import { fetchJsonAsset } from '../../utils/fetchHelper';

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
  const hoModernKernel = await fetchJsonAsset('/data/ho_modern_reference_kernel.json');

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
    if (!userCall || userCall.length !== 2 || userCall === '--') return false;
    
    const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()];
    if (!marker || !marker.alt) return false; // skip markers without alt allele

    // Ensure all populations have a defined frequency for this marker
    return pops.every(pop => {
      const freq = (hoModernKernel as any)[pop].frequencies[rsid];
      return typeof freq === 'number' && freq >= 0;
    });
  });

  const M = matchedRsids.length;
  if (M < 10) return [];

  // Build A (M x N) and b (M)
  const A: number[][] = Array.from({ length: M }, () => new Array(N).fill(0));
  const b: number[] = new Array(M).fill(0);

  for (let i = 0; i < M; i++) {
    const rsid = matchedRsids[i];
    const userCall = normalizedUserSnps[rsid.toLowerCase()];
    
    // Accurate Dosage Calculation mapped to exact Alternative Allele
    let dosage = 0.0;
    const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()];
    const alt = marker.alt.toUpperCase();
    const a1 = userCall[0].toUpperCase();
    const a2 = userCall[1].toUpperCase();
    if (a1 === alt) dosage += 0.5;
    if (a2 === alt) dosage += 0.5;

    b[i] = dosage;

    for (let j = 0; j < N; j++) {
      const popName = pops[j];
      const popData = (hoModernKernel as any)[popName];
      A[i][j] = popData.frequencies[rsid]; // guaranteed to exist from filter above
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
