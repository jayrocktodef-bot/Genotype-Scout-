
export enum MetabolizerStatus {
  ULTRARAPID = "ultrarapid",
  NORMAL = "normal",
  INTERMEDIATE = "intermediate",
  POOR = "poor"
}

export function calculateCYP2D6Status(genotypes: Record<string, string>) {
  // Activity scores based on CPIC/PharmGKB guidelines for core CYP2D6 SNPs
  // Activity values: 1 (Normal), 0.5 (Decreased), 0 (Non-functional)
  const scores: Record<string, Record<string, number>> = {
    "rs3892097": { "AA": 0, "AG": 0.5, "GG": 1 },  // *4 (Null)
    "rs1065852": { "AA": 0.25, "AG": 0.625, "GG": 1 }, // *10 (Decreased)
    "rs28371725": { "AA": 0.5, "AG": 0.75, "GG": 1 }   // *41 (Decreased)
  };

  let totalScore = 2.0; // Assume two functional alleles initially

  Object.entries(genotypes).forEach(([rsid, geno]) => {
    if (scores[rsid] && scores[rsid][geno] !== undefined) {
      const reduction = 1.0 - scores[rsid][geno];
      totalScore -= reduction;
    }
  });

  // Clamp score to non-negative
  totalScore = Math.max(0, totalScore);

  // Determine Phenotype based on total activity score
  let status = MetabolizerStatus.NORMAL;
  if (totalScore >= 2.25) status = MetabolizerStatus.ULTRARAPID;
  else if (totalScore <= 0.25) status = MetabolizerStatus.POOR;
  else if (totalScore < 1.25) status = MetabolizerStatus.INTERMEDIATE;

  return { totalScore, status };
}
