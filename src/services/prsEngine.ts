import prsModels from '../data/prs_models.json';

export interface PrsTraitResult {
  traitName: string;
  description: string;
  category: string;
  rawScore: number;
  zScore: number;
  percentile: number;
  riskLevel: 'Low' | 'Average' | 'High';
  snpsTested: number;
  totalSnps: number;
}

// Approximation of the Normal CDF (Cumulative Distribution Function) to calculate percentiles
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

export function calculateAllPRS(userSnps: Record<string, string>): PrsTraitResult[] {
  const results: PrsTraitResult[] = [];

  // Normalize user SNPs to uppercase keys
  const normalizedSnps: Record<string, string> = {};
  for (const [rsid, genotype] of Object.entries(userSnps)) {
    normalizedSnps[rsid.toLowerCase()] = genotype.toUpperCase();
  }

  for (const [traitName, model] of Object.entries(prsModels)) {
    let rawScore = 0;
    let snpsTested = 0;
    const snps = (model as any).snps;
    const totalSnps = Object.keys(snps).length;

    for (const [rsid, snpData] of Object.entries(snps)) {
      const userGenotype = normalizedSnps[rsid.toLowerCase()];
      if (!userGenotype) continue;

      const effectAllele = (snpData as any).effect_allele.toUpperCase();
      const weight = (snpData as any).weight;

      // Calculate dosage: count occurrences of the effect allele
      let dosage = 0;
      for (let i = 0; i < userGenotype.length; i++) {
        if (userGenotype[i] === effectAllele) {
          dosage++;
        }
      }

      rawScore += dosage * weight;
      snpsTested++;
    }

    // Even if we miss some SNPs, we still calculate the score for prototype purposes.
    // In a strict clinical pipeline, we'd adjust the mean/std based on missingness.
    const mean = (model as any).population_mean;
    const std = (model as any).population_std;
    
    // Fallback if std is 0
    const zScore = std > 0 ? (rawScore - mean) / std : 0;
    const percentile = normalCDF(zScore) * 100;

    let riskLevel: 'Low' | 'Average' | 'High' = 'Average';
    if (percentile >= 80) riskLevel = 'High';
    else if (percentile <= 20) riskLevel = 'Low';

    results.push({
      traitName,
      description: (model as any).description,
      category: (model as any).category,
      rawScore,
      zScore,
      percentile,
      riskLevel,
      snpsTested,
      totalSnps
    });
  }

  return results.sort((a, b) => b.percentile - a.percentile);
}
