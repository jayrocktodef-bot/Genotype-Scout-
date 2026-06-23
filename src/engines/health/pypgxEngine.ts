// src/utils/health/pypgxEngine.ts

export interface StarAlleleResult {
  gene: string;
  diplotype: string; // e.g., *1/*4
  activityScore: number;
  phenotype: string;
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
      const rs3892097 = userSnps['rs3892097']; // *4 (Null, score 0.0)
      const rs1065852 = userSnps['rs1065852']; // *10 (Decreased, score 0.25)
      const rs28371725 = userSnps['rs28371725']; // *41 (Decreased, score 0.5)

      let numStar4 = 0;
      if (rs3892097 === 'AA') numStar4 = 2;
      else if (rs3892097 === 'AG' || rs3892097 === 'GA') numStar4 = 1;

      let numStar10 = 0;
      if (rs1065852 === 'AA') numStar10 = 2;
      else if (rs1065852 === 'AG' || rs1065852 === 'GA') numStar10 = 1;

      let numStar41 = 0;
      if (rs28371725 === 'AA') numStar41 = 2;
      else if (rs28371725 === 'AG' || rs28371725 === 'GA') numStar41 = 1;

      const mutated: string[] = [];
      for (let i = 0; i < numStar4; i++) mutated.push("*4");
      for (let i = 0; i < numStar10; i++) mutated.push("*10");
      for (let i = 0; i < numStar41; i++) mutated.push("*41");

      allele1 = mutated[0] || "*1";
      allele2 = mutated[1] || "*1";
  } else if (gene === 'CYP2C19') {
      const rs12248560 = userSnps['rs12248560']; // *17 (Increased, score 1.0)
      const rs28399504 = userSnps['rs28399504']; // *2 (Null, score 0.0)

      let numStar17 = 0;
      if (rs12248560 === 'TT') numStar17 = 2;
      else if (rs12248560 === 'TC' || rs12248560 === 'CT' || rs12248560 === 'TG' || rs12248560 === 'GT' || rs12248560 === 'AT' || rs12248560 === 'TA') numStar17 = 1;

      let numStar2 = 0;
      if (rs28399504 === 'AA') numStar2 = 2;
      else if (rs28399504 === 'AG' || rs28399504 === 'GA' || rs28399504 === 'AC' || rs28399504 === 'CA' || rs28399504 === 'AT' || rs28399504 === 'TA') numStar2 = 1;

      const mutated: string[] = [];
      for (let i = 0; i < numStar2; i++) mutated.push("*2");
      for (let i = 0; i < numStar17; i++) mutated.push("*17");

      allele1 = mutated[0] || "*1";
      allele2 = mutated[1] || "*1";
  } else if (gene === 'DPYD') {
      const rs3918290 = userSnps['rs3918290']; // *2A (Null, score 0.0)
      const rs55886062 = userSnps['rs55886062']; // *13 (Null, score 0.0)

      let numStar2A = 0;
      if (rs3918290 === 'AA') numStar2A = 2;
      else if (rs3918290 === 'AG' || rs3918290 === 'GA' || rs3918290 === 'AC' || rs3918290 === 'CA' || rs3918290 === 'AT' || rs3918290 === 'TA') numStar2A = 1;

      let numStar13 = 0;
      if (rs55886062 === 'AA') numStar13 = 2;
      else if (rs55886062 === 'AG' || rs55886062 === 'GA' || rs55886062 === 'AC' || rs55886062 === 'CA' || rs55886062 === 'AT' || rs55886062 === 'TA') numStar13 = 1;

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
    'CYP2C19': ['rs12248560', 'rs28399504'],
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
