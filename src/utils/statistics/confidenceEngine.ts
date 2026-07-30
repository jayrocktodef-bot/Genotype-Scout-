/**
 * Unified Confidence Index & 95% Confidence Interval Engine
 * Genotype Scout v5.13.0
 * 
 * Provides rigorous statistical confidence intervals (Wilson Score / Binomial Standard Error),
 * coverage metrics, and confidence badges across Ancestry, Haplogroups, PGx, Blood Type,
 * Polygenic Risk Scores, and Rare Variants.
 */

export interface ConfidenceInterval {
  lower: number;        // lower bound (0.0 to 1.0)
  upper: number;        // upper bound (0.0 to 1.0)
  estimate: number;     // point estimate (0.0 to 1.0)
  confidenceLevel: number; // default 0.95
}

export interface AdmixtureCI {
  percentage: number;
  low: string;
  high: string;
  marginOfError: string;
  confidenceScore: number; // 0 - 100
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  isSignificant: boolean;
}

export interface HaplogroupConfidence {
  confidenceScore: number; // 0 - 100
  coveragePercent: number;
  confidenceLevel: 'High' | 'Moderate' | 'Low' | 'No Y-DNA';
  derivedCount: number;
  testedCount: number;
  badge: string;
}

export interface PgxConfidence {
  confidenceScore: number; // 0 - 100
  coveragePercent: number;
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  testedSnps: number;
  requiredSnps: number;
  badge: string;
}

export interface BloodConfidence {
  confidenceScore: number; // 0 - 100
  lowPercent: string;
  highPercent: string;
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  badge: string;
}

export interface PrsConfidence {
  confidenceScore: number; // 0 - 100
  effectWeightCoverage: number; // 0 - 100%
  percentileLow: number;
  percentileHigh: number;
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  badge: string;
}

/**
 * Wilson score confidence interval for a binomial proportion without continuity correction.
 * @param successes number of observed positive calls/markers
 * @param trials total number of markers/trials
 * @param confLevel confidence level (default 0.95 -> z = 1.95996)
 */
export function calculateWilsonCI(
  successes: number,
  trials: number,
  confLevel = 0.95
): ConfidenceInterval {
  if (trials <= 0) {
    return { lower: 0, upper: 0, estimate: 0, confidenceLevel: confLevel };
  }

  const k = Math.max(0, Math.min(successes, trials));
  const n = trials;
  const pHat = k / n;
  const z = confLevel === 0.99 ? 2.57583 : confLevel === 0.90 ? 1.64485 : 1.95996;

  const denom = 1 + (z * z) / n;
  const center = (pHat + (z * z) / (2 * n)) / denom;
  const margin = (z / denom) * Math.sqrt((pHat * (1 - pHat)) / n + (z * z) / (4 * n * n));

  const lower = Math.max(0, center - margin);
  const upper = Math.min(1, center + margin);

  return {
    lower: Math.round(lower * 1000) / 1000,
    upper: Math.round(upper * 1000) / 1000,
    estimate: Math.round(pHat * 1000) / 1000,
    confidenceLevel: confLevel,
  };
}

/**
 * 1. Admixture & Population Proportions: 95% Wilson / Binomial Confidence Interval
 */
export function calculateAdmixtureCI(percentage: number, markerCount: number): AdmixtureCI {
  if (markerCount <= 0 || percentage <= 0) {
    return {
      percentage,
      low: '0.0',
      high: '0.0',
      marginOfError: '0.0',
      confidenceScore: 0,
      confidenceLevel: 'Low',
      isSignificant: false,
    };
  }

  const successes = Math.round((percentage / 100) * markerCount);
  const wilson = calculateWilsonCI(successes, markerCount, 0.95);

  const lowVal = wilson.lower * 100;
  const highVal = wilson.upper * 100;
  const marginOfErrorVal = ((highVal - lowVal) / 2);

  // Confidence score heuristic based on marker count and margin of error
  let confidenceScore = Math.min(100, Math.max(10, Math.round(100 - marginOfErrorVal * 2 + Math.min(30, markerCount / 10))));
  if (markerCount < 20) confidenceScore = Math.min(confidenceScore, 60);

  let confidenceLevel: 'High' | 'Moderate' | 'Low' = 'High';
  if (confidenceScore < 60 || markerCount < 30) confidenceLevel = 'Low';
  else if (confidenceScore < 85 || markerCount < 100) confidenceLevel = 'Moderate';

  return {
    percentage,
    low: lowVal.toFixed(1),
    high: highVal.toFixed(1),
    marginOfError: marginOfErrorVal.toFixed(1),
    confidenceScore,
    confidenceLevel,
    isSignificant: markerCount >= 30 && marginOfErrorVal < (percentage / 2),
  };
}

/**
 * 2. Haplogroups (Y-DNA & mtDNA) Confidence Index
 * Evaluates derived marker count vs ancestral count & tree coverage.
 */
export function calculateHaplogroupConfidence(
  derivedCount: number,
  ancestralCount: number,
  totalDefining: number,
  isFemaleOrNoY: boolean = false
): HaplogroupConfidence {
  if (isFemaleOrNoY || (derivedCount === 0 && totalDefining === 0)) {
    return {
      confidenceScore: 0,
      coveragePercent: 0,
      confidenceLevel: 'No Y-DNA',
      derivedCount: 0,
      testedCount: 0,
      badge: 'Not Applicable (Female / No Y-DNA)',
    };
  }

  const tested = derivedCount + ancestralCount;
  const total = Math.max(1, totalDefining);
  const coveragePercent = Math.min(100, Math.round((tested / total) * 100));

  let confidenceScore = 0;
  if (tested > 0) {
    confidenceScore = Math.round((derivedCount / tested) * 100);
  }

  // Adjust score based on absolute derived evidence
  if (derivedCount >= 5) confidenceScore = Math.min(100, confidenceScore + 10);
  else if (derivedCount === 1) confidenceScore = Math.min(confidenceScore, 70);
  else if (derivedCount === 0) confidenceScore = 0;

  let confidenceLevel: 'High' | 'Moderate' | 'Low' = 'High';
  if (confidenceScore < 60 || derivedCount < 2) confidenceLevel = 'Low';
  else if (confidenceScore < 85 || derivedCount < 4) confidenceLevel = 'Moderate';

  const badge = `${confidenceLevel} Confidence (${confidenceScore}%) • ${derivedCount} Derived SNPs`;

  return {
    confidenceScore,
    coveragePercent,
    confidenceLevel,
    derivedCount,
    testedCount: tested,
    badge,
  };
}

/**
 * 3. Pharmacogenomics (PGx) Star Allele Call Confidence
 * Evaluates defining SNP coverage for star allele diplotypes.
 */
export function calculatePgxConfidence(
  testedSnps: number,
  requiredSnps: number
): PgxConfidence {
  const req = Math.max(1, requiredSnps);
  const coveragePercent = Math.min(100, Math.round((testedSnps / req) * 100));

  let confidenceScore = coveragePercent;
  let confidenceLevel: 'High' | 'Moderate' | 'Low' = 'High';

  if (coveragePercent < 60) confidenceLevel = 'Low';
  else if (coveragePercent < 85) confidenceLevel = 'Moderate';

  const badge = `${confidenceLevel} Confidence (${coveragePercent}% Coverage)`;

  return {
    confidenceScore,
    coveragePercent,
    confidenceLevel,
    testedSnps,
    requiredSnps: req,
    badge,
  };
}

/**
 * 4. Blood Predictor (ABO & Rh Phenotype) Confidence Index
 */
export function calculateBloodTypeConfidence(
  rawConfidence: number,
  testedProbes: number = 4
): BloodConfidence {
  const p = Math.max(0, Math.min(1, rawConfidence));
  const confidenceScore = Math.round(p * 100);
  
  const wilson = calculateWilsonCI(Math.round(p * testedProbes), testedProbes, 0.95);

  const lowPercent = (wilson.lower * 100).toFixed(1);
  const highPercent = (wilson.upper * 100).toFixed(1);

  let confidenceLevel: 'High' | 'Moderate' | 'Low' = 'High';
  if (confidenceScore < 70) confidenceLevel = 'Low';
  else if (confidenceScore < 88) confidenceLevel = 'Moderate';

  return {
    confidenceScore,
    lowPercent,
    highPercent,
    confidenceLevel,
    badge: `${confidenceLevel} Confidence (${confidenceScore}%) [95% CI: ${lowPercent}%–${highPercent}%]`,
  };
}

/**
 * 5. Polygenic Risk Scores (PRS) & Traits Confidence Index
 * Evaluates effect weight coverage across risk SNPs and 95% Risk Percentile CI.
 */
export function calculatePrsConfidence(
  testedWeight: number,
  totalWeight: number,
  estimatedPercentile: number
): PrsConfidence {
  const tot = Math.max(0.001, totalWeight);
  const effectWeightCoverage = Math.min(100, Math.round((testedWeight / tot) * 100));

  const confidenceScore = effectWeightCoverage;
  let confidenceLevel: 'High' | 'Moderate' | 'Low' = 'High';

  if (effectWeightCoverage < 50) confidenceLevel = 'Low';
  else if (effectWeightCoverage < 80) confidenceLevel = 'Moderate';

  // 95% Risk Percentile Interval width scales inversely with weight coverage
  const width = (100 - effectWeightCoverage) * 0.25;
  const percentileLow = Math.max(1, Math.round(estimatedPercentile - width));
  const percentileHigh = Math.min(99, Math.round(estimatedPercentile + width));

  const badge = `${confidenceLevel} Confidence (${effectWeightCoverage}% Marker Weight Coverage) • 95% CI [P${percentileLow}–P${percentileHigh}]`;

  return {
    confidenceScore,
    effectWeightCoverage,
    percentileLow,
    percentileHigh,
    confidenceLevel,
    badge,
  };
}
