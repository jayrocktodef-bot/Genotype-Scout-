import graf10kIndex from '../../data/raw_aims/graf_10k_index.json';
import { solveNNLS } from '../../utils/nnls';
import { fetchJsonAsset } from '../../utils/fetchHelper';

export interface AdmixtureComponent {
  population: string;
  region: string;
  percentage: number;
  distance: number;
}

let hoModernKernelCache: any = null;
let hoModernKernelPromise: Promise<any> | null = null;
async function getHoModernKernel(): Promise<any> {
  if (hoModernKernelCache) return hoModernKernelCache;
  if (!hoModernKernelPromise) {
    hoModernKernelPromise = fetchJsonAsset('/data/ho_modern_reference_kernel.json');
  }
  hoModernKernelCache = await hoModernKernelPromise;
  return hoModernKernelCache;
}

/**
 * Human Origins Ancestry Engine (K61)
 * Uses a Non-Negative Least Squares (NNLS) solver to estimate optimal population mixture proportions
 * based on the comprehensive Human Origins reference dataset.
 */
export async function calculateHumanOriginsScores(userSnps: Record<string, string>): Promise<AdmixtureComponent[]> {
  const hoModernKernel = await getHoModernKernel();

  // Normalize user SNPs keys and extract cleaned genotypes
  const normalizedUserSnps: Record<string, string> = {};
  for (const key in userSnps) {
    const rawVal = userSnps[key];
    if (!rawVal || rawVal === '--' || rawVal === '00' || rawVal === '??' || rawVal === 'NN' || rawVal === '.') continue;
    const clean = rawVal.trim().toUpperCase().replace(/[\s\/_]/g, '');
    if (clean.length === 1) {
      normalizedUserSnps[key.toLowerCase()] = clean + clean;
    } else if (clean.length >= 2) {
      normalizedUserSnps[key.toLowerCase()] = clean.slice(0, 2);
    }
  }

  // Helper to resolve genotype by RSID or chromosomal coordinate
  const getUserGenotype = (rsid: string, marker: any): string | null => {
    const rLower = rsid.toLowerCase();
    if (normalizedUserSnps[rLower]) return normalizedUserSnps[rLower];
    if (marker && marker.chr && marker.pos) {
      const c = String(marker.chr).replace(/^chr/i, '').toLowerCase();
      const p = marker.pos;
      return normalizedUserSnps[`chr${c}_${p}`] ||
             normalizedUserSnps[`${c}_${p}`] ||
             normalizedUserSnps[`chr${c}:${p}`] ||
             normalizedUserSnps[`${c}:${p}`] ||
             null;
    }
    return null;
  };

  // Filter to reference populations with genome-wide Human Origins coverage (>= 7000 markers).
  // This cleanly isolates the 222 primary Human Origins populations and excludes sparse proxy panels.
  const pops = Object.keys(hoModernKernel).filter(pop => {
    const freqs = (hoModernKernel as any)[pop]?.frequencies;
    return freqs && Object.keys(freqs).length >= 7000;
  });
  const N = pops.length;
  if (N === 0) return [];
  
  // Find all rsids that are common across the kernel and present in user SNPs
  const firstPop = pops[0];
  const allRsids = Object.keys((hoModernKernel as any)[firstPop].frequencies);
  const matchedRsids = allRsids.filter(rsid => {
    const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid.toLowerCase()];
    if (!marker || !marker.alt) return false;

    const userCall = getUserGenotype(rsid, marker);
    if (!userCall || userCall.length !== 2) return false;

    // Ensure all reference populations have a defined frequency for this marker
    return pops.every(pop => {
      const freq = (hoModernKernel as any)[pop].frequencies?.[rsid];
      return typeof freq === 'number' && freq >= 0;
    });
  });

  const M = matchedRsids.length;
  if (M < 10) return [];

  // Build A (M x N) and b (M)
  const A: number[][] = Array.from({ length: M }, () => new Array(N).fill(0));
  const b: number[] = new Array(M).fill(0);

  const complement = (base: string): string => {
    switch (base.toUpperCase()) {
      case 'A': return 'T';
      case 'T': return 'A';
      case 'C': return 'G';
      case 'G': return 'C';
      default: return base;
    }
  };

  for (let i = 0; i < M; i++) {
    const rsid = matchedRsids[i];
    const marker = (graf10kIndex as any)[rsid] || (graf10kIndex as any)[rsid.toUpperCase()] || (graf10kIndex as any)[rsid.toLowerCase()];
    const userCall = getUserGenotype(rsid, marker)!;
    
    // Accurate Dosage Calculation mapped to exact Alternative Allele
    let dosage = 0.0;
    const ref = (marker.ref || '').toUpperCase();
    const alt = (marker.alt || '').toUpperCase();
    const a1 = userCall[0].toUpperCase();
    const a2 = userCall[1].toUpperCase();

    // Palindromic guard: A/T or C/G mutations are ambiguous under reverse-strand inversion
    const isPalindromic = (ref === 'A' && alt === 'T') || (ref === 'T' && alt === 'A') ||
                          (ref === 'C' && alt === 'G') || (ref === 'G' && alt === 'C');

    if (a1 === alt) {
      dosage += 0.5;
    } else if (!isPalindromic && complement(a1) === alt) {
      dosage += 0.5;
    }

    if (a2 === alt) {
      dosage += 0.5;
    } else if (!isPalindromic && complement(a2) === alt) {
      dosage += 0.5;
    }

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
        // Calculate true Euclidean genetic distance to this reference population
        let sumSqDiff = 0;
        for (let i = 0; i < M; i++) {
          const diff = b[i] - A[i][j];
          sumSqDiff += diff * diff;
        }
        const distance = Number(Math.sqrt(sumSqDiff / M).toFixed(4));

        components.push({
          population: popName.replace(/_/g, ' '),
          region: (hoModernKernel as any)[popName].region,
          percentage: Number(rawPercentage.toFixed(2)),
          distance
        });
      }
    }
  }

  return components.sort((a, b) => b.percentage - a.percentage);
}
