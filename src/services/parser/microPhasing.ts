import { ParsedGenomicDataset } from './types';

/**
 * Micro-phases an unphased commercial DNA dataset into Strand A (Haplotype 1)
 * and Strand B (Haplotype 2) using AIM allele frequencies and reference priors.
 */
export function microPhaseDataset(
  parsed: ParsedGenomicDataset,
  aimsDatabase: Record<string, any> = {}
): ParsedGenomicDataset & { confidence: number } {
  const haplotype1Map: Record<string, string> = {};
  const haplotype2Map: Record<string, string> = {};
  let totalHetero = 0;
  let anchoredHetero = 0;

  for (const [rsid, geno] of Object.entries(parsed.snpMap)) {
    if (!geno || geno.length < 2) {
      haplotype1Map[rsid] = geno || '-';
      haplotype2Map[rsid] = geno || '-';
      continue;
    }

    const a1 = geno[0];
    const a2 = geno[1];

    if (a1 === a2) {
      haplotype1Map[rsid] = a1;
      haplotype2Map[rsid] = a2;
    } else {
      totalHetero++;
      const lower = rsid.toLowerCase();
      const aim = aimsDatabase[lower] || aimsDatabase[rsid];
      const effAllele = aim?.alleles?.[0]?.toUpperCase();
      const freqs = aim?.frequencies || {};
      const vals = Object.values(freqs).filter((v): v is number => typeof v === 'number');
      const avgFreq = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0.5;

      if (effAllele && (a1.toUpperCase() === effAllele || a2.toUpperCase() === effAllele)) {
        anchoredHetero++;
        if (a1.toUpperCase() === effAllele) {
          if (avgFreq >= 0.5) {
            haplotype1Map[rsid] = a1;
            haplotype2Map[rsid] = a2;
          } else {
            haplotype1Map[rsid] = a2;
            haplotype2Map[rsid] = a1;
          }
        } else {
          if (avgFreq >= 0.5) {
            haplotype1Map[rsid] = a2;
            haplotype2Map[rsid] = a1;
          } else {
            haplotype1Map[rsid] = a1;
            haplotype2Map[rsid] = a2;
          }
        }
      } else {
        // Unanchored het locus: maintain consistent order
        haplotype1Map[rsid] = a1;
        haplotype2Map[rsid] = a2;
      }
    }
  }

  const confidence = totalHetero === 0 ? 1.0 : Number((anchoredHetero / totalHetero).toFixed(2));
  return {
    ...parsed,
    isPhased: true,
    phasedCount: Object.keys(haplotype1Map).length,
    phasingMethod: 'STATISTICAL_MICROPHASED',
    haplotype1Map,
    haplotype2Map,
    confidence
  };
}
