// src/utils/health/pypgxEngine.ts

export interface StarAlleleResult {
  gene: string;
  diplotype: string; // e.g., *1/*4
  activityScore: number;
  phenotype: string;
}

function getSnp(userSnps: Record<string, string> | undefined, ...rsids: string[]): string | null {
  if (!userSnps) return null;
  for (const rsid of rsids) {
    const val = userSnps[rsid] || userSnps[rsid.toLowerCase()] || userSnps[rsid.toUpperCase()];
    if (val && val !== '--' && val !== '00' && val !== 'NN' && val !== '??') {
      return val.trim().toUpperCase().replace(/[\s\/_]/g, '');
    }
  }
  return null;
}

/**
 * Star Allele Caller inspired by PyPGx 
 * Uses activity scores and haplotype pattern matching for clinical pharmacogenomics.
 */
export function callStarAlleles(gene: string, userSnps: Record<string, string>): StarAlleleResult {
  // 1. Identify the variants found in the user's data
  // Logic cannibalized from PyPGx: Haplotype pattern matching
  let allele1 = "*1"; // Default (Functional)
  let allele2 = "*1";

  // Simplified logic for core genes
  if (gene === 'CYP2D6') {
      const rs3892097 = getSnp(userSnps, 'rs3892097'); // *4 (Null, score 0.0)
      const rs1065852 = getSnp(userSnps, 'rs1065852'); // *10 (Decreased, score 0.25)
      const rs28371725 = getSnp(userSnps, 'rs28371725'); // *41 (Decreased, score 0.5)

      let numStar4 = 0;
      if (rs3892097 === 'AA' || rs3892097 === 'TT') numStar4 = 2;
      else if (['AG', 'GA', 'TC', 'CT'].includes(rs3892097 || '')) numStar4 = 1;

      let numStar10 = 0;
      if (rs1065852 === 'AA' || rs1065852 === 'TT') numStar10 = 2;
      else if (['AG', 'GA', 'TC', 'CT'].includes(rs1065852 || '')) numStar10 = 1;

      let numStar41 = 0;
      if (rs28371725 === 'AA' || rs28371725 === 'TT') numStar41 = 2;
      else if (['AG', 'GA', 'TC', 'CT'].includes(rs28371725 || '')) numStar41 = 1;

      const mutated: string[] = [];
      for (let i = 0; i < numStar4; i++) mutated.push("*4");
      for (let i = 0; i < numStar10; i++) mutated.push("*10");
      for (let i = 0; i < numStar41; i++) mutated.push("*41");

      allele1 = mutated[0] || "*1";
      allele2 = mutated[1] || "*1";
  } else if (gene === 'CYP2C19') {
      const rs12248560 = getSnp(userSnps, 'rs12248560'); // *17 (Increased, score 1.0)
      const rs2 = getSnp(userSnps, 'rs4244285', 'rs28399504'); // *2 (Null, score 0.0)

      let numStar17 = 0;
      if (rs12248560 === 'TT' || rs12248560 === 'AA') numStar17 = 2;
      else if (rs12248560 && (rs12248560.includes('T') || rs12248560.includes('A'))) numStar17 = 1;

      let numStar2 = 0;
      if (rs2 === 'AA' || rs2 === 'TT') numStar2 = 2;
      else if (rs2 && (rs2.includes('A') || rs2.includes('T'))) numStar2 = 1;

      const mutated: string[] = [];
      for (let i = 0; i < numStar2; i++) mutated.push("*2");
      for (let i = 0; i < numStar17; i++) mutated.push("*17");

      allele1 = mutated[0] || "*1";
      allele2 = mutated[1] || "*1";
  } else if (gene === 'DPYD') {
      const rs3918290 = getSnp(userSnps, 'rs3918290'); // *2A (Null, score 0.0)
      const rs55886062 = getSnp(userSnps, 'rs55886062'); // *13 (Null, score 0.0)

      let numStar2A = 0;
      if (rs3918290 === 'AA' || rs3918290 === 'TT') numStar2A = 2;
      else if (rs3918290 && (rs3918290.includes('A') || rs3918290.includes('T'))) numStar2A = 1;

      let numStar13 = 0;
      if (rs55886062 === 'AA' || rs55886062 === 'TT') numStar13 = 2;
      else if (rs55886062 && (rs55886062.includes('A') || rs55886062.includes('T'))) numStar13 = 1;

      const mutated: string[] = [];
      for (let i = 0; i < numStar2A; i++) mutated.push("*2A");
      for (let i = 0; i < numStar13; i++) mutated.push("*13");

      allele1 = mutated[0] || "*1";
      allele2 = mutated[1] || "*1";
  }

  // 2. Calculate the score
  const score1 = getAlleleValue(gene, allele1);
  const score2 = getAlleleValue(gene, allele2);
  const totalScore = score1 + score2;

  // 3. Map score to Phenotype
  const phenotype = mapScoreToPhenotype(totalScore);

  return { 
    gene, 
    diplotype: `${allele1}/${allele2}`, 
    activityScore: totalScore, 
    phenotype 
  };
}

export const PGX_MARKERS_MAP: Record<string, string[]> = {
    'CYP2D6': ['rs3892097', 'rs1065852', 'rs28371725'],
    'CYP2C19': ['rs12248560', 'rs4244285', 'rs28399504'],
    'DPYD': ['rs3918290', 'rs55886062']
};

function getMarkersForGene(gene: string): string[] {
    return PGX_MARKERS_MAP[gene] || [];
}

function getAlleleValue(gene: string, allele: string): number {
    // Activity values: 1 (Normal), 0.5 (Decreased), 0 (Non-functional)
    const values: Record<string, Record<string, number>> = {
        'CYP2D6': {
            '*1': 1.0,
            '*2': 1.0,
            '*4': 0.0,
            '*10': 0.25,
            '*41': 0.5
        },
        'CYP2C19': {
            '*1': 1.0,
            '*2': 0.0,
            '*3': 0.0,
            '*17': 1.0 // Increased, but activity score usually 1.0 in standard models
        },
        'DPYD': {
            '*1': 1.0,
            '*2A': 0.0,
            '*13': 0.0
        }
    };
    return values[gene]?.[allele] ?? 1.0;
}

function mapScoreToPhenotype(score: number): string {
    if (score >= 2.5) return "Ultrarapid Metabolizer";
    if (score >= 1.25) return "Normal Metabolizer";
    if (score >= 0.5) return "Intermediate Metabolizer";
    return "Poor Metabolizer";
}
