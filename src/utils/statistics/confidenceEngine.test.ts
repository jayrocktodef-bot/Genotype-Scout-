import { describe, it, expect } from 'vitest';
import {
  calculateWilsonCI,
  calculateAdmixtureCI,
  calculateHaplogroupConfidence,
  calculatePgxConfidence,
  calculateBloodTypeConfidence,
  calculatePrsConfidence,
} from './confidenceEngine';

describe('confidenceEngine', () => {
  describe('calculateWilsonCI', () => {
    it('calculates valid 95% Wilson confidence intervals', () => {
      const ci = calculateWilsonCI(50, 100, 0.95);
      expect(ci.estimate).toBe(0.5);
      expect(ci.lower).toBeGreaterThan(0.39);
      expect(ci.upper).toBeLessThan(0.61);
    });

    it('handles zero trials gracefully', () => {
      const ci = calculateWilsonCI(0, 0);
      expect(ci.estimate).toBe(0);
      expect(ci.lower).toBe(0);
      expect(ci.upper).toBe(0);
    });
  });

  describe('calculateAdmixtureCI', () => {
    it('computes binomial confidence interval bounds and confidence score', () => {
      const result = calculateAdmixtureCI(45.5, 200);
      expect(result.percentage).toBe(45.5);
      expect(parseFloat(result.low)).toBeLessThan(45.5);
      expect(parseFloat(result.high)).toBeGreaterThan(45.5);
      expect(result.confidenceLevel).toBe('High');
      expect(result.isSignificant).toBe(true);
    });
  });

  describe('calculateHaplogroupConfidence', () => {
    it('evaluates derived marker confidence for Y-DNA / mtDNA', () => {
      const conf = calculateHaplogroupConfidence(8, 0, 10, false);
      expect(conf.confidenceScore).toBe(100); // capped high
      expect(conf.confidenceLevel).toBe('High');
      expect(conf.badge).toContain('High Confidence');
    });

    it('returns No Y-DNA for female samples', () => {
      const conf = calculateHaplogroupConfidence(0, 0, 0, true);
      expect(conf.confidenceLevel).toBe('No Y-DNA');
      expect(conf.badge).toContain('Female');
    });
  });

  describe('calculatePgxConfidence', () => {
    it('calculates coverage percent and diplotype call confidence', () => {
      const pgx = calculatePgxConfidence(18, 20);
      expect(pgx.coveragePercent).toBe(90);
      expect(pgx.confidenceLevel).toBe('High');
    });
  });

  describe('calculateBloodTypeConfidence', () => {
    it('calculates phenotype confidence and 95% CI', () => {
      const blood = calculateBloodTypeConfidence(0.95, 4);
      expect(blood.confidenceScore).toBe(95);
      expect(blood.confidenceLevel).toBe('High');
      expect(blood.badge).toContain('95%');
    });
  });

  describe('calculatePrsConfidence', () => {
    it('calculates effect weight coverage and 95% risk percentile interval', () => {
      const prs = calculatePrsConfidence(85, 100, 75);
      expect(prs.effectWeightCoverage).toBe(85);
      expect(prs.confidenceLevel).toBe('High');
      expect(prs.percentileLow).toBeLessThanOrEqual(75);
      expect(prs.percentileHigh).toBeGreaterThanOrEqual(75);
    });
  });
});
