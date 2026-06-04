/**
 * microPhaser.ts
 * Lightweight utility for pseudo-phasing commercial DNA data.
 * splits unphased genotype calls into Two Strands (A/B) for LAI engines.
 */

export interface PhasedStrands {
  strandA: string[];
  strandB: string[];
  confidence: number;
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

      if (reference && reference.frequencies) {
        anchoredCount++;
        // Identify which allele is "Major" globally or in reference sets
        // We look for the frequency of the reference 'ref' allele
        const refAllele = reference.ref;
        const refFreq = reference.frequencies.AF || 0.5; // Default to balanced if missing

        // If allele1 matches the reference allele and its frequency is high,
        // we assign the "major" allele to Strand A.
        if (allele1 === refAllele) {
          if (refFreq > 0.5) {
            strandA.push(allele1);
            strandB.push(allele2);
          } else {
            strandA.push(allele2);
            strandB.push(allele1);
          }
        } else {
          // If allele2 is the reference allele
          if (refFreq > 0.5) {
            strandA.push(allele2);
            strandB.push(allele1);
          } else {
            strandA.push(allele1);
            strandB.push(allele2);
          }
        }
      } else {
        // Fallback for unknown heterozygous: random/consistent assignment
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
