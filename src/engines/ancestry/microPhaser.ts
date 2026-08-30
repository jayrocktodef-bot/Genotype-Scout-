/**
 * microPhaser.ts
 * Lightweight utility for pseudo-phasing commercial DNA data.
 * Splits unphased genotype calls into Two Strands (A/B) for LAI engines.
 * Includes strand complement resolution and effect allele orientation.
 */

export interface PhasedStrands {
  strandA: string[];
  strandB: string[];
  confidence: number;
}

const COMPLEMENTS: Record<string, string> = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };

/**
 * Compute a global reference allele frequency from per-population frequency data.
 * The AIM database stores frequencies keyed by population code (AFR, EUR, EAS, …),
 * NOT a global "AF" key. Averaging across populations is a reasonable proxy.
 */
function computeGlobalFreq(frequencies: Record<string, number>): number {
  const vals = Object.values(frequencies).filter(f => typeof f === 'number' && f >= 0 && f <= 1);
  if (vals.length === 0) return 0.5;
  return vals.reduce((sum, f) => sum + f, 0) / vals.length;
}

/**
 * microPhase
 * Performs a greedy, frequency-based phasing of unphased SNPs.
 * 
 * @param userSnps - Array of parsed SNPs for a specific chromosome
 * @param aimsDatabase - Dictionary/Map from master_aims_normalized.json
 */
export function microPhase(
  userSnps: { rsid: string; genotype: string }[],
  aimsDatabase: Record<string, any>
): PhasedStrands {
  const strandA: string[] = [];
  const strandB: string[] = [];
  let heteroCount = 0;
  let anchoredCount = 0;

  for (const snp of userSnps) {
    const rsid = snp.rsid.toLowerCase();
    const genotype = snp.genotype;
    
    // Skip invalid or empty genotypes
    if (!genotype || genotype.length < 2) {
      strandA.push('?');
      strandB.push('?');
      continue;
    }

    const allele1 = genotype[0];
    const allele2 = genotype[1];

    // Case 1: Homozygous - trivial phase
    if (allele1 === allele2) {
      strandA.push(allele1);
      strandB.push(allele2);
    } else {
      // Case 2: Heterozygous - perform greedy frequency-based assignment
      heteroCount++;
      let reference = aimsDatabase[rsid];
      if (!reference) {
        const possibleSuffixes = ['_afr', '_eur', '_eas', '_sas', '_nat', '_global', '_mena', '_safr'];
        for (const suffix of possibleSuffixes) {
          if (aimsDatabase[rsid + suffix]) {
            reference = aimsDatabase[rsid + suffix];
            break;
          }
        }
      }

      if (reference && reference.frequencies && Object.keys(reference.frequencies).length > 0) {
        anchoredCount++;

        // Compute a global allele frequency by averaging across all available populations.
        const globalFreq = computeGlobalFreq(reference.frequencies);

        // The "effect allele" tracked in the AIM is the first listed allele (reference.alleles[0]).
        // We assign it to strandA when it is the major (more common) allele, else strandB.
        const effectAllele: string | undefined = reference.alleles?.[0]?.toUpperCase();

        if (effectAllele) {
          const a1Up = allele1.toUpperCase();
          const a2Up = allele2.toUpperCase();
          const compEffect = COMPLEMENTS[effectAllele] || effectAllele;
          const isPalindromicLocus = (a1Up === 'A' && a2Up === 'T') ||
                                    (a1Up === 'T' && a2Up === 'A') ||
                                    (a1Up === 'C' && a2Up === 'G') ||
                                    (a1Up === 'G' && a2Up === 'C');

          let matchedA1 = (a1Up === effectAllele);
          let matchedA2 = (a2Up === effectAllele);

          // If direct match failed and variant locus is non-palindromic, check reverse strand complement
          if (!matchedA1 && !matchedA2 && !isPalindromicLocus) {
            matchedA1 = (a1Up === compEffect);
            matchedA2 = (a2Up === compEffect);
          }

          if (matchedA1) {
            // allele1 is the effect allele
            if (globalFreq > 0.5) {
              // Effect allele is major → put it on strandA
              strandA.push(allele1);
              strandB.push(allele2);
            } else {
              // Effect allele is minor → put it on strandB
              strandA.push(allele2);
              strandB.push(allele1);
            }
          } else if (matchedA2) {
            // allele2 is the effect allele
            if (globalFreq > 0.5) {
              strandA.push(allele2);
              strandB.push(allele1);
            } else {
              strandA.push(allele1);
              strandB.push(allele2);
            }
          } else {
            // Neither allele matches effect allele — consistent default assignment
            if (globalFreq > 0.5) {
              strandA.push(allele1);
              strandB.push(allele2);
            } else {
              strandA.push(allele2);
              strandB.push(allele1);
            }
          }
        } else {
          // No effect allele info; use frequency to determine major strand
          if (globalFreq > 0.5) {
            strandA.push(allele1);
            strandB.push(allele2);
          } else {
            strandA.push(allele2);
            strandB.push(allele1);
          }
        }
      } else {
        // Fallback for unknown heterozygous: consistent assignment (allele order preserved)
        strandA.push(allele1);
        strandB.push(allele2);
      }
    }
  }

  const confidence = heteroCount === 0 ? 1.0 : (anchoredCount / heteroCount);

  return {
    strandA,
    strandB,
    confidence
  };
}
