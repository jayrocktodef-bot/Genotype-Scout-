import { describe, it, expect } from 'vitest';
import { evaluateXLinkedTraits } from './xLinkedHealthEngine';

describe('X-Linked Health & Pharmacogenomics Engine', () => {
  it('should flag male hemizygous G6PD A- variant as High Risk Affected', () => {
    const snpMap = {
      'rs1050829': 'T' // Male single T allele
    };

    const report = evaluateXLinkedTraits(snpMap, 'male');
    expect(report.overallRiskCategory).toBe('High Risk Flagged');
    const g6pd = report.evaluatedTraits.find(t => t.rsid === 'rs1050829');
    expect(g6pd).toBeDefined();
    expect(g6pd?.zygosity).toBe('hemizygous_variant');
    expect(g6pd?.phenotypeStatus).toBe('Affected / High Susceptibility');
    expect(g6pd?.riskLevel).toBe('high');
    expect(g6pd?.actionableGuidance).toContain('fava beans');
  });

  it('should classify female heterozygous G6PD A- variant as Carrier', () => {
    const snpMap = {
      'rs1050829': 'CT' // Female CT carrier
    };

    const report = evaluateXLinkedTraits(snpMap, 'female');
    expect(report.overallRiskCategory).toBe('Carrier Flagged');
    const g6pd = report.evaluatedTraits.find(t => t.rsid === 'rs1050829');
    expect(g6pd?.zygosity).toBe('heterozygous_carrier');
    expect(g6pd?.phenotypeStatus).toBe('Carrier');
    expect(g6pd?.riskLevel).toBe('moderate');
  });

  it('should classify male hemizygous AR baldness variant correctly', () => {
    const snpMap = {
      'rs6152': 'G'
    };

    const report = evaluateXLinkedTraits(snpMap, 'male');
    const ar = report.evaluatedTraits.find(t => t.rsid === 'rs6152');
    expect(ar?.zygosity).toBe('hemizygous_variant');
    expect(ar?.phenotypeStatus).toBe('Affected / High Susceptibility');
    expect(ar?.clinicalSummary).toContain('androgen receptor sensitivity');
  });

  it('should handle uncalled markers gracefully', () => {
    const snpMap = {};
    const report = evaluateXLinkedTraits(snpMap, 'male');
    expect(report.overallRiskCategory).toBe('Insufficient Data');
    expect(report.evaluatedTraits.every(t => t.zygosity === 'uncalled')).toBe(true);
  });
});
