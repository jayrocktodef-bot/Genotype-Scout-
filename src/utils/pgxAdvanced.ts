
export enum MetabolizerStatus {
  ULTRARAPID = "ultrarapid",
  NORMAL = "normal",
  INTERMEDIATE = "intermediate",
  POOR = "poor"
}

export function calculateCYP2D6Status(genotypes: Record<string, string>) {
  const norm = (rsid: string) => {
    const val = genotypes[rsid] || genotypes[rsid.toLowerCase()] || genotypes[rsid.toUpperCase()];
    return val ? val.trim().toUpperCase().replace(/[\s\/_]/g, '') : null;
  };

  const g3892097 = norm('rs3892097');  // *4 (Null, score 0.0)
  const g1065852 = norm('rs1065852');  // *10 (Decreased, score 0.25)
  const g28371725 = norm('rs28371725'); // *41 (Decreased, score 0.5)
  const dupMarker = norm('rs59421388') || norm('CYP2D6_DUP'); // Duplication marker

  let numStar4 = 0;
  if (g3892097 === 'AA' || g3892097 === 'TT') numStar4 = 2;
  else if (['AG', 'GA', 'TC', 'CT'].includes(g3892097 || '')) numStar4 = 1;

  let numStar10 = 0;
  if (g1065852 === 'AA' || g1065852 === 'TT') numStar10 = 2;
  else if (['AG', 'GA', 'TC', 'CT'].includes(g1065852 || '')) numStar10 = 1;

  let numStar41 = 0;
  if (g28371725 === 'AA' || g28371725 === 'TT') numStar41 = 2;
  else if (['AG', 'GA', 'TC', 'CT'].includes(g28371725 || '')) numStar41 = 1;

  const mutated: string[] = [];
  for (let i = 0; i < numStar4; i++) mutated.push("*4");
  for (let i = 0; i < numStar10; i++) mutated.push("*10");
  for (let i = 0; i < numStar41; i++) mutated.push("*41");

  const allele1 = mutated[0] || "*1";
  const allele2 = mutated[1] || "*1";

  const values: Record<string, number> = {
    '*1': 1.0,
    '*4': 0.0,
    '*10': 0.25,
    '*41': 0.5
  };

  let totalScore = (values[allele1] ?? 1.0) + (values[allele2] ?? 1.0);

  // If duplication marker detected on active allele
  const isDuplication = dupMarker && ['DUP', 'INS', 'A', 'T', '1'].includes(dupMarker);
  if (isDuplication && totalScore >= 1.0) {
    totalScore += 1.0;
  }

  // CPIC CYP2D6 Phenotype Assignment:
  // Activity score 0: Poor
  // 0 < Activity score < 1.25: Intermediate
  // 1.25 <= Activity score <= 2.25: Normal
  // Activity score > 2.25: Ultrarapid
  let status = MetabolizerStatus.NORMAL;
  if (totalScore > 2.0) status = MetabolizerStatus.ULTRARAPID;
  else if (totalScore <= 0.25) status = MetabolizerStatus.POOR;
  else if (totalScore < 1.25) status = MetabolizerStatus.INTERMEDIATE;

  return { totalScore, status };
}
