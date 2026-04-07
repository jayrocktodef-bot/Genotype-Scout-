import { UT_AIM250_DATA } from '../utAim250Data';

export interface AIMWeight {
  targetAllele: string;
  freq: {
    "Sub-Saharan Africa": number;
    "Europe": number;
    "East Asian": number;
  };
}

export type AIMWeights = Record<string, AIMWeight>;

export async function fetchAIMWeights(): Promise<AIMWeights> {
  // We are now fully independent and rely solely on local data.
  return UT_AIM250_DATA;
}

export function calculateAncestry(userGenotypes: Record<string, string>, weights: AIMWeights) {
  let logLikelihood = {
    "Sub-Saharan Africa": 0,
    "Europe": 0,
    "East Asian": 0
  };

  let markersFound = 0;

  for (const [rsid, weight] of Object.entries(weights)) {
    const genotype = userGenotypes[rsid.toLowerCase()];
    if (!genotype) continue;

    markersFound++;
    const target = weight.targetAllele;
    const count = (genotype[0] === target ? 1 : 0) + (genotype[1] === target ? 1 : 0);

    // Simple likelihood calculation
    // P(genotype | freq) = (freq^count) * ((1-freq)^(2-count))
    // We use log-likelihood to avoid underflow
    for (const [pop, freq] of Object.entries(weight.freq)) {
      const f = Math.max(0.001, Math.min(0.999, freq)); // Avoid log(0)
      const p = Math.pow(f, count) * Math.pow(1 - f, 2 - count);
      logLikelihood[pop as keyof typeof logLikelihood] += Math.log(p);
    }
  }

  if (markersFound === 0) return { results: { "Sub-Saharan Africa": 0, "Europe": 0, "East Asian": 0 }, markersFound: 0 };

  // Convert log-likelihoods to probabilities
  const maxLog = Math.max(...Object.values(logLikelihood));
  const relativeLikelihoods = Object.fromEntries(
    Object.entries(logLikelihood).map(([pop, log]) => [pop, Math.exp(log - maxLog)])
  );

  const sum = Object.values(relativeLikelihoods).reduce((a, b) => a + b, 0);
  const results = Object.fromEntries(
    Object.entries(relativeLikelihoods).map(([pop, rel]) => [pop, (rel / sum) * 100])
  );

  return { results, markersFound };
}
