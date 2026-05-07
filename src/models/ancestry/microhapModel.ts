import microhapMarkers from '../../data/microhap_markers.json' assert { type: 'json' };
import popFrequencies from '../../data/microhap_frequencies.json' assert { type: 'json' };

export interface PopResult {
  population: string;
  probability: number;
  likelihood: number;
}

export function runMicrohapInference(userSnps: Record<string, string>): PopResult[] {
  const results: PopResult[] = [];
  const populations = Object.keys(popFrequencies);

  populations.forEach(pop => {
    let logLikelihood = 0;

    // Iterate through microhaplotype loci (clusters of SNPs)
    (microhapMarkers as any[]).forEach(locus => {
      // Reconstruct the haplotype from the user's raw SNPs (e.g., rs1, rs2)
      const haplotype = locus.snps
        .map((rsid: string) => userSnps[rsid.toLowerCase()] || '?')
        .join('');

      if (!haplotype.includes('?')) {
        const freq = (popFrequencies as any)[pop][locus.id]?.[haplotype] || 0.0001; // Laplacian smoothing
        logLikelihood += Math.log(freq);
      }
    });

    results.push({ 
      population: pop, 
      likelihood: logLikelihood,
      probability: 0 // Calculated after normalization
    });
  });

  // Normalize log-likelihoods to probabilities (Softmax-style)
  const maxLog = Math.max(...results.map(r => r.likelihood));
  const exps = results.map(r => Math.exp(r.likelihood - maxLog));
  const sumExps = exps.reduce((a, b) => a + b, 0);

  return results.map((r, i) => ({
    ...r,
    probability: (exps[i] / (sumExps || 1)) * 100
  })).sort((a, b) => b.probability - a.probability);
}
