import { describe, it, expect, vi } from 'vitest';
import { predictYDNAHaplogroup, analyzeMtDNA, evaluateMtCoverage } from './haplogroupPredictor';

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
        children: [
          {
            branchName: 'Haplogroup H1',
            mutations: ['G16129A!'],
            children: [
              {
                branchName: 'Haplogroup H1a',
                mutations: ['C498d'],
                children: [
                  {
                    branchName: 'Haplogroup H1a1',
                    mutations: ['8281-8289d'],
                    children: [
                      {
                        branchName: 'Haplogroup H1a1a',
                        mutations: ['2491.1C'],
                        children: [
                          {
                            branchName: 'Haplogroup H1a1a1',
                            mutations: ['573.XC'],
                            children: [
                              {
                                branchName: 'Haplogroup H1a1a1a',
                                mutations: ['5899.1d!']
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
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

  it('should handle trailing reversals (!) correctly', () => {
    const mtMap = { '769': 'G', '16129': 'A' };
    const result = analyzeMtDNA(mtMap);
    expect(result.predicted).toBe('Haplogroup H1');
    expect(result.path).toContain('Haplogroup H1');
  });

  it('should handle single deletions (d) correctly', () => {
    const mtMap = { '769': 'G', '16129': 'A', '498': '-' };
    const result = analyzeMtDNA(mtMap);
    expect(result.predicted).toBe('Haplogroup H1a');
    expect(result.path).toContain('Haplogroup H1a');
  });

  it('should handle range deletions (e.g. 8281-8289d) correctly', () => {
    const mtMap = { '769': 'G', '16129': 'A', '498': '-', '8281': '-', '8285': '-' };
    const result = analyzeMtDNA(mtMap);
    expect(result.predicted).toBe('Haplogroup H1a1');
    expect(result.path).toContain('Haplogroup H1a1');
  });

  it('should handle insertions (e.g. 2491.1C) correctly', () => {
    const mtMap = { '769': 'G', '16129': 'A', '498': '-', '8281': '-', '2491.1': 'C' };
    const result = analyzeMtDNA(mtMap);
    expect(result.predicted).toBe('Haplogroup H1a1a');
    expect(result.path).toContain('Haplogroup H1a1a');
  });

  it('should handle custom XC insertions correctly', () => {
    const mtMap = { '769': 'G', '16129': 'A', '498': '-', '8281': '-', '2491.1': 'C', '573': 'C' };
    const result = analyzeMtDNA(mtMap);
    expect(result.predicted).toBe('Haplogroup H1a1a1');
    expect(result.path).toContain('Haplogroup H1a1a1');
  });

  it('should handle deletion of an insertion (5899.1d!) correctly', () => {
    const mtMap = { '769': 'G', '16129': 'A', '498': '-', '8281': '-', '2491.1': 'C', '573': 'C', '5899.1': '-' };
    const result = analyzeMtDNA(mtMap);
    expect(result.predicted).toBe('Haplogroup H1a1a1a');
    expect(result.path).toContain('Haplogroup H1a1a1a');
  });

  it('should return undetermined for sparse chip with no signal (Tery-class)', () => {
    // Synthetic mtMap of ~120 positions sampled from the tree's mutation set,
    // with alleles overwhelmingly ancestral and 0 derived markers.
    const sparseMtMap: Record<string, string> = {
      '769': 'A',
      '16129': 'G',
      '498': 'C',
      '8281': 'A',
      '2491.1': 'A',
      '573': 'A',
      '5899.1': 'A'
    };
    for (let p = 1000; p < 1115; p++) {
      sparseMtMap[p.toString()] = 'A';
    }

    const result = analyzeMtDNA(sparseMtMap);
    expect(result.predicted).toBeNull();
    expect(result.path).toEqual([]);
    expect(result.undeterminedReason).toBe('SPARSE_DATA');
    expect(result.coverage.guardTriggered).toBe(true);
    expect(result.coverage.isSparse).toBe(true);
    expect(result.testedMarkers.length).toBeGreaterThan(0);
    expect(result.userMutations).toEqual([]);
  });

  it('should still predict haplogroup for sparse chip with genuine deep signal', () => {
    // Same 120-position scaffold, but with 4+ derived markers converging on H1a1
    const deepMtMap: Record<string, string> = {
      '769': 'G',
      '16129': 'A',
      '498': '-',
      '8281': '-',
      '8285': '-',
      '2491.1': 'A',
      '573': 'A',
      '5899.1': 'A'
    };
    for (let p = 1000; p < 1115; p++) {
      deepMtMap[p.toString()] = 'A';
    }

    const result = analyzeMtDNA(deepMtMap);
    expect(result.predicted).toBe('Haplogroup H1a1');
    expect(result.path).toContain('Haplogroup H1a1');
    expect(result.undeterminedReason).toBeUndefined();
    expect(result.coverage.guardTriggered).toBe(false);
    expect(result.coverage.winningDepth).toBeGreaterThan(2);
  });
});

describe('evaluateMtCoverage', () => {
  it('should trigger on thin coverage or low derived counts', () => {
    // Thin coverage trigger (< 1 informative tested)
    const thinReport = evaluateMtCoverage([], [], ['mtDNA Root (Eve)', 'Haplogroup H'], 0);
    expect(thinReport.informativeTested).toBe(0);
    expect(thinReport.derivedObserved).toBe(0);
    expect(thinReport.winningDepth).toBe(1);
    expect(thinReport.isSparse).toBe(true);
    expect(thinReport.guardTriggered).toBe(true);

    // Low derived trigger with custom threshold (e.g. 10 tested, 1 derived < 3)
    const lowDerivedReport = evaluateMtCoverage(
      new Array(10).fill({ status: 'ancestral' }),
      ['A769G'],
      ['mtDNA Root (Eve)', 'Haplogroup H'],
      1,
      { minInformative: 10, minDerived: 3, maxBasalDepth: 2 }
    );
    expect(lowDerivedReport.informativeTested).toBe(10);
    expect(lowDerivedReport.derivedObserved).toBe(1);
    expect(lowDerivedReport.isSparse).toBe(true);
    expect(lowDerivedReport.guardTriggered).toBe(true);
  });

  it('should exempt deep calls from sparse guard regardless of coverage', () => {
    // Depth 3 (> MT_BASAL_MAX_DEPTH of 2) with 0 informative tested
    const deepReport = evaluateMtCoverage(
      [],
      [],
      ['mtDNA Root (Eve)', 'Haplogroup H', 'Haplogroup H1', 'Haplogroup H1a'],
      0
    );
    expect(deepReport.winningDepth).toBe(3);
    expect(deepReport.isSparse).toBe(true);
    expect(deepReport.guardTriggered).toBe(false);
  });

  it('should respect boundary values for coverage thresholds', () => {
    // Exactly meeting thresholds at boundary
    const boundaryReport = evaluateMtCoverage(
      [{ status: 'derived' }],
      ['A769G'],
      ['mtDNA Root (Eve)', 'Haplogroup H', 'Haplogroup H1'],
      2
    );
    expect(boundaryReport.informativeTested).toBe(1);
    expect(boundaryReport.derivedObserved).toBe(1);
    expect(boundaryReport.winningDepth).toBe(2);
    expect(boundaryReport.isSparse).toBe(false);
    expect(boundaryReport.guardTriggered).toBe(false);
  });
});
