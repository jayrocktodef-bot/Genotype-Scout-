// src/utils/ancestry/microHapEngine.ts
import microHapKernel from '../../data/microhap_top100_kernel.json';

export interface MicroHapSignature {
  id: string;
  population: string;
  signature: string;
  confidence: number;
}

/**
 * Identifies high-confidence MicroHaplotype signatures in user data.
 * MicroHaps are clusters of SNPs that are inherited together.
 */
export function identifyMicroHapSignatures(userSnps: Record<string, string>): MicroHapSignature[] {
  const detectedSignatures: MicroHapSignature[] = [];

  microHapKernel.forEach((hap: any) => {
    // 1. Extract the user's alleles for this specific SNP cluster
    // MicroHaps in raw data are often homozygous in the context of forensic signatures
    const userAlleles = hap.snps.map((rsid: string) => {
      const g = userSnps[rsid.toLowerCase()];
      // For unphased data, we check if it's homozygous to be sure of the haplotype
      if (g && g.length === 2 && g[0] === g[1]) return g[0];
      return null;
    });

    // 2. Check if we have data for all SNPs in the cluster (No-calls invalidate the hap)
    if (userAlleles.every((allele: string | null) => !!allele)) {
      const haplotypeString = userAlleles.join(''); // e.g., "AGC"

      // 3. Find the population where this specific string is a "Diagnostic Signature"
      const popEntries = Object.entries(hap.weights);
      if (popEntries.length === 0) return;

      const topPopEntry = popEntries.reduce((prev: [string, any], curr: [string, any]) => {
        const prevFreq = prev[1][haplotypeString] || 0;
        const currFreq = curr[1][haplotypeString] || 0;
        return currFreq > prevFreq ? curr : prev;
      });

      const topFreq = (topPopEntry[1] as any)[haplotypeString] || 0;

      if (topFreq > 0.4) { // 40% frequency threshold
        detectedSignatures.push({
          id: hap.id,
          population: topPopEntry[0],
          signature: haplotypeString,
          confidence: hap.global_ae
        });
      }
    }
  });

  return detectedSignatures.sort((a, b) => b.confidence - a.confidence);
}
