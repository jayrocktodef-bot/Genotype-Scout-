import { describe, it, expect } from 'vitest';
import { refineWithSecretorStatus } from './secretorPostProcessor';

describe('secretorPostProcessor', () => {
  it('boosts East Asian sub-clusters when rs1047781 T allele is present', () => {
    const initial = [
      { subpop: 'CHB', percentage: 40.0 },
      { subpop: 'CEU', percentage: 60.0 },
    ];
    const snpMap = { 'rs1047781': 'AT' };

    const result = refineWithSecretorStatus(initial, snpMap);
    expect(result.eastAsianBoosted).toBe(true);
    expect(result.appliedAdjustments.length).toBeGreaterThan(0);

    const chb = result.refinedWeights.find(w => w.subpop === 'CHB');
    expect(chb?.percentage).toBeGreaterThan(40.0);
  });

  it('filters Amerindian over-prediction when rs601338 is homozygous AA non-secretor', () => {
    const initial = [
      { subpop: 'PEL', percentage: 80.0 },
      { subpop: 'CEU', percentage: 20.0 },
    ];
    const snpMap = { 'rs601338': 'AA' };

    const result = refineWithSecretorStatus(initial, snpMap);
    expect(result.amerindianFiltered).toBe(true);

    const pel = result.refinedWeights.find(w => w.subpop === 'PEL');
    expect(pel?.percentage).toBeLessThan(80.0);
  });

  it('normalizes total percentages to 100%', () => {
    const initial = [
      { subpop: 'YRI', percentage: 50.0 },
      { subpop: 'CEU', percentage: 50.0 },
    ];
    const snpMap = { 'rs281377': 'TT' };

    const result = refineWithSecretorStatus(initial, snpMap);
    const sum = result.refinedWeights.reduce((acc, curr) => acc + curr.percentage, 0);
    expect(Math.abs(sum - 100.0)).toBeLessThan(0.5);
  });
});
