import microHapKernel from '../../data/raw_aims/microhap_top100_kernel.json';
import { getDetectedMicrohaplotypes } from '../../utils/ancestry/microhapAdmixture';

export interface MicroHapSignature {
  id: string;
  population: string;
  signature: string;
  confidence: number;
}

const SUPER_POPS = ['AFR', 'EUR', 'EAS', 'SAS', 'AMR'] as const;

/**
 * Identifies high-confidence MicroHaplotype signatures in user data.
 * MicroHaps are clusters of SNPs that are inherited together.
 */
export function identifyMicroHapSignatures(userSnps: Record<string, string>): MicroHapSignature[] {
  const detectedLoci = getDetectedMicrohaplotypes(userSnps);
  const detectedSignatures: MicroHapSignature[] = [];
  const kernelMap = new Map<string, any>();
  if (Array.isArray(microHapKernel)) {
    microHapKernel.forEach((k: any) => kernelMap.set(k.id, k));
  }

  for (const locus of detectedLoci) {
    if (locus.typedSnps.length < 2) continue; // Require at least 2 typed SNPs in cluster for high confidence
    const k = kernelMap.get(locus.id);
    if (!k) continue;

    // Determine typed indices in original kernel SNP list
    const typedIndices: number[] = [];
    k.snps.forEach((rs: string, idx: number) => {
      if (locus.typedSnps.some((ts) => ts.toLowerCase() === rs.toLowerCase())) {
        typedIndices.push(idx);
      }
    });
    if (typedIndices.length < 2) continue;

    // Marginalize reference population frequencies for typed indices
    const marginalFreqs: Record<string, Record<string, number>> = {};
    SUPER_POPS.forEach((sp) => {
      marginalFreqs[sp] = {};
      const popWeights = (k.weights as Record<string, Record<string, number>>)?.[sp] || {};
      for (const [fullHap, freq] of Object.entries(popWeights)) {
        let subHap = '';
        for (const idx of typedIndices) {
          subHap += fullHap[idx] || '';
        }
        if (subHap.length === typedIndices.length) {
          marginalFreqs[sp][subHap] = (marginalFreqs[sp][subHap] || 0) + freq;
        }
      }
    });

    const uniqueCalledHaps = Array.from(new Set(locus.calledHaplotypes));
    for (const h of uniqueCalledHaps) {
      const popScores: Array<{ pop: string; freq: number }> = [];
      SUPER_POPS.forEach((sp) => {
        popScores.push({ pop: sp, freq: marginalFreqs[sp][h] || 0 });
      });
      popScores.sort((a, b) => b.freq - a.freq);

      const top = popScores[0];
      const second = popScores[1] || { freq: 0 };
      const delta = top.freq - second.freq;

      if (top.freq >= 0.35 && (delta >= 0.15 || top.freq >= 0.60)) {
        detectedSignatures.push({
          id: locus.id,
          population: top.pop,
          signature: h,
          confidence: Number(top.freq.toFixed(3)),
        });
      }
    }
  }

  return detectedSignatures.sort((a, b) => b.confidence - a.confidence);
}
