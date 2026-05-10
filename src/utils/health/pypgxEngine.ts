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
      // Check for *4 (rs3892097)
      const rs3892097 = userSnps['rs3892097'];
      if (rs3892097 === 'AA') {
          allele1 = "*4";
          allele2 = "*4";
      } else if (rs3892097 === 'AG') {
          allele2 = "*4";
      }
      
      // Check for *10 (rs1065852) if not already *4
      if (allele1 === "*1") {
          const rs1065852 = userSnps['rs1065852'];
          if (rs1065852 === 'AA') allele1 = "*10";
          else if (rs1065852 === 'AG' && allele2 === "*1") allele2 = "*10";
      }
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

function getMarkersForGene(gene: string): string[] {
    const map: Record<string, string[]> = {
        'CYP2D6': ['rs3892097', 'rs1065852', 'rs28371725'],
        'CYP2C19': ['rs12248560', 'rs28399504'],
        'DPYD': ['rs3918290', 'rs55886062']
    };
    return map[gene] || [];
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
