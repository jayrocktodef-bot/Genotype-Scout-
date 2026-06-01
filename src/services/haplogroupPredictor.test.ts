import { describe, it, expect, vi } from 'vitest';
import { predictYDNAHaplogroup, analyzeMtDNA } from './haplogroupPredictor';

// Mock dependencies
vi.mock('../data/snpDatabase', () => ({
  SNP_LOOKUP: new Map([
    ['rs1', { alleles: ['A'], markerId: 'rs1' }],
    ['rs2', { alleles: ['G'], markerId: 'rs2' }]
  ])
}));

vi.mock('../constants/haplogroups', () => ({
  Y_DNA_TREE: {
    branchName: 'Y-DNA Root (Adam)',
    children: [
      {
        branchName: 'Haplogroup R',
        snp: ['rs1'],
        children: [
          { branchName: 'Haplogroup R1b', snp: ['rs2'] }
        ]
      }
    ]
  },
  MT_DNA_TREE: {
    branchName: 'mtDNA Root (Eve)',
    children: [
      {
        branchName: 'Haplogroup H',
        mutations: ['A769G'],
        children: []
      }
    ]
  }
}));

vi.mock('./snpMatcher', () => ({
  getMarkerDescription: vi.fn(() => 'Description')
}));

vi.mock('./mtHaplogroupService', () => ({
  findMatchesInMtHaplogroups: vi.fn(() => []),
  searchMtHaplogroupTree: vi.fn(() => [])
}));

describe('predictYDNAHaplogroup', () => {
  it('should predict Y-DNA haplogroup correctly', () => {
    const yMap = { 'rs1': 'A', 'rs2': 'G' };
    const result = predictYDNAHaplogroup(yMap);
    expect(result.predicted?.name).toBe('R1b');
    expect(result.path).toContain('Haplogroup R1b');
  });

  it('should handle negative results', () => {
    const yMap = { 'rs1': 'C' }; // rs1 is A derived
    const result = predictYDNAHaplogroup(yMap);
    expect(result.predicted).toBeNull();
  });

  it('should ignore heterozygous Y calls (haploid no-call)', () => {
    // rs1 derived allele is A; a het 'AG' call must NOT be counted as derived.
    const result = predictYDNAHaplogroup({ 'rs1': 'AG' });
    expect(result.predicted).toBeNull();
  });
});

describe('analyzeMtDNA', () => {
  it('should predict mtDNA haplogroup correctly', () => {
    const mtMap = { '769': 'G' };
    const result = analyzeMtDNA(mtMap);
    expect(result.predicted).toBe('Haplogroup H');
    expect(result.path).toContain('Haplogroup H');
  });
});
