import { describe, it, expect } from 'vitest';
import { calculateAncientAdmixture } from '../../lib/AncientAdmixtureCalculator';

describe('Ancient Admixture Calculator', () => {
  it('should compute ancient admixture proportions that sum to 100%', () => {
    const mockGenotypes = {
      'rs2887286': 'CC',
      'rs2840528': 'GG',
      'rs3890745': 'CC',
      'rs1181875': 'CC',
      'rs6663840': 'AA'
    };

    const results = calculateAncientAdmixture(mockGenotypes);
    expect(results.length).toBeGreaterThan(0);

    const totalScore = results.reduce((acc, val) => acc + val.score, 0);
    expect(totalScore).toBeCloseTo(100.0, 1);

    results.forEach(res => {
      expect(res.score).toBeGreaterThanOrEqual(0.1);
      expect(res.popName).toBeDefined();
      expect(res.region).toBeDefined();
      expect(res.period).toBeDefined();
    });
  });

  it('should return empty results if there are insufficient markers', () => {
    const mockGenotypes = {
      'rs2887286': 'CC'
    };
    const results = calculateAncientAdmixture(mockGenotypes);
    expect(results).toEqual([]);
  });
});
