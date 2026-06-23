
export enum MetabolizerStatus {
  ULTRARAPID = "ultrarapid",
  NORMAL = "normal",
  INTERMEDIATE = "intermediate",
  POOR = "poor"
}

export function calculateCYP2D6Status(genotypes: Record<string, string>) {
  const rs3892097 = genotypes['rs3892097']; // *4 (Null, score 0.0)
  const rs1065852 = genotypes['rs1065852']; // *10 (Decreased, score 0.25)
  const rs28371725 = genotypes['rs28371725']; // *41 (Decreased, score 0.5)

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

  const allele1 = mutated[0] || "*1";
  const allele2 = mutated[1] || "*1";

  const values: Record<string, number> = {
    '*1': 1.0,
    '*4': 0.0,
    '*10': 0.25,
    '*41': 0.5
  };

  const totalScore = (values[allele1] ?? 1.0) + (values[allele2] ?? 1.0);

  // Determine Phenotype based on total activity score
  let status = MetabolizerStatus.NORMAL;
  if (totalScore >= 2.25) status = MetabolizerStatus.ULTRARAPID;
  else if (totalScore <= 0.25) status = MetabolizerStatus.POOR;
  else if (totalScore < 1.25) status = MetabolizerStatus.INTERMEDIATE;

  return { totalScore, status };
}
