import { describe, it, expect, vi } from 'vitest';
import { predictYDNAHaplogroup, analyzeMtDNA, evaluateMtCoverage, isDeepRefinementOfTreeCall } from './haplogroupPredictor';
import { findMatchesInMtHaplogroups } from './mtHaplogroupService';

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

  it('calibration: logs winningMatches for all fixtures and confirms >= 1 for positive predictions', () => {
    const fixtures: Array<{
      name: string;
      map: Record<string, string>;
      expectedCall: string;
      expectedDepth: number;
      expectedMatches: number;
    }> = [
      { name: '769:G', map: { '769': 'G' }, expectedCall: 'Haplogroup H', expectedDepth: 1, expectedMatches: 1 },
      { name: '+16129:A', map: { '769': 'G', '16129': 'A' }, expectedCall: 'Haplogroup H1', expectedDepth: 2, expectedMatches: 2 },
      { name: '+498:-', map: { '769': 'G', '16129': 'A', '498': '-' }, expectedCall: 'Haplogroup H1a', expectedDepth: 3, expectedMatches: 3 },
      { name: '8281-8289d', map: { '769': 'G', '16129': 'A', '498': '-', '8281': '-', '8285': '-' }, expectedCall: 'Haplogroup H1a1', expectedDepth: 4, expectedMatches: 4 },
      { name: '2491.1C', map: { '769': 'G', '16129': 'A', '498': '-', '8281': '-', '2491.1': 'C' }, expectedCall: 'Haplogroup H1a1a', expectedDepth: 5, expectedMatches: 5 },
      { name: '573.XC', map: { '769': 'G', '16129': 'A', '498': '-', '8281': '-', '2491.1': 'C', '573': 'C' }, expectedCall: 'Haplogroup H1a1a1', expectedDepth: 6, expectedMatches: 6 },
      { name: '5899.1d!', map: { '769': 'G', '16129': 'A', '498': '-', '8281': '-', '2491.1': 'C', '573': 'C', '5899.1': '-' }, expectedCall: 'Haplogroup H1a1a1a', expectedDepth: 7, expectedMatches: 7 },
    ];

    for (const f of fixtures) {
      const res = analyzeMtDNA(f.map);
      process.stdout.write(`Calibration fixture ${f.name} -> call: ${res.predicted}, depth: ${res.coverage.winningDepth}, matches: ${res.coverage.winningMatches}\n`);
      expect(res.predicted).toBe(f.expectedCall);
      expect(res.coverage.winningDepth).toBe(f.expectedDepth);
      expect(res.coverage.winningMatches).toBe(f.expectedMatches);
      expect(res.coverage.winningMatches).toBeGreaterThanOrEqual(1);
    }
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

  it('should return undetermined for realistic sparse chip latch with off-path derived markers', () => {
    // Realistic chip: ~120 positions, mostly ancestral alleles at tree positions,
    // plus 2-3 derived markers placed off the winning basal path (recurrent hypervariable markers).
    const latchMtMap: Record<string, string> = {
      '16129': 'G', // ancestral at H1
      '498': 'C',   // ancestral at H1a
      '8281': 'A',  // ancestral at H1a1
      '2491.1': 'A',
      '573': 'A',
      '5899.1': 'A',
      // 3 derived markers off the winning path:
      '16519': 'C',
      '309.1': 'C',
      '315.1': 'C'
    };
    for (let p = 1000; p < 1111; p++) {
      latchMtMap[p.toString()] = 'A';
    }

    const result = analyzeMtDNA(latchMtMap);
    expect(result.predicted).toBeNull();
    expect(result.path).toEqual([]);
    expect(result.undeterminedReason).toBe('SPARSE_DATA');
    expect(result.coverage.guardTriggered).toBe(true);
    expect(result.coverage.winningMatches).toBe(0);
    expect(result.coverage.winningDepth).toBeLessThanOrEqual(2);
    expect(result.testedMarkers.length).toBeGreaterThan(0);
  });

  it('iterates sortedDeep and selects first valid refinement when top candidate is lateral', () => {
    // Mock findMatchesInMtHaplogroups to construct a controlled test where a lateral candidate
    // has more matches than a genuine refinement, verifying candidate iteration skips the lateral
    // candidate and selects the refinement.
    vi.mocked(findMatchesInMtHaplogroups).mockReturnValueOnce([
      {
        branch: { branchName: 'U5a', mutations: ['m1', 'm2', 'm3'] },
        matches: ['m1', 'm2', 'm3'],
        similarity: 0.9
      },
      {
        branch: { branchName: 'H1a1', mutations: ['m1', 'm2'] },
        matches: ['m1', 'm2'],
        similarity: 0.7
      }
    ]);

    const result = analyzeMtDNA({ '769': 'G', '16129': 'A' });
    // Tree call is Haplogroup H1 (matchCount: 2).
    // Candidate 1 (U5a): 3 matches, but fails isDeepRefinementOfTreeCall('U5a', 'Haplogroup H1').
    // Candidate 2 (H1a1): 2 matches (>= 2 and >= bestMatch.matchCount of 2), passes refinement gate.
    expect(result.predicted).toBe('H1a1');
    expect(result.path).toContain('H1a1');
  });
});

describe('evaluateMtCoverage', () => {
  it('should trigger on thin coverage or low derived counts', () => {
    // Thin coverage case with zero path support (< 1 winningMatches) triggers
    const thinReport = evaluateMtCoverage([], [], ['mtDNA Root (Eve)', 'Haplogroup H'], 0);
    expect(thinReport.informativeTested).toBe(0);
    expect(thinReport.derivedObserved).toBe(0);
    expect(thinReport.winningDepth).toBe(1);
    expect(thinReport.winningMatches).toBe(0);
    expect(thinReport.isSparse).toBe(true);
    expect(thinReport.guardTriggered).toBe(true);

    // Under v2 path-support rule, winningMatches = 0 triggers the guard for basal calls even with tested markers
    const noPathSupportReport = evaluateMtCoverage(
      new Array(10).fill({ status: 'ancestral' }),
      ['A769G'],
      ['mtDNA Root (Eve)', 'Haplogroup H'],
      0,
      { minInformative: 10, minDerived: 3, maxBasalDepth: 2, minBasalPathMatches: 1 }
    );
    expect(noPathSupportReport.informativeTested).toBe(10);
    expect(noPathSupportReport.derivedObserved).toBe(1);
    expect(noPathSupportReport.winningMatches).toBe(0);
    expect(noPathSupportReport.isSparse).toBe(true);
    expect(noPathSupportReport.guardTriggered).toBe(true);

    // Under v2 rule, winningMatches = 1 has on-path support, so it does not trigger the basal latch guard
    const pathSupportReport = evaluateMtCoverage(
      new Array(10).fill({ status: 'ancestral' }),
      ['A769G'],
      ['mtDNA Root (Eve)', 'Haplogroup H'],
      1,
      { minInformative: 10, minDerived: 3, maxBasalDepth: 2, minBasalPathMatches: 1 }
    );
    expect(pathSupportReport.winningMatches).toBe(1);
    expect(pathSupportReport.guardTriggered).toBe(false);
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

describe('analyzeMtDNA - heteroplasmy handling', () => {
  it('counts single-letter IUPAC at a derived position as derived and heteroplasmic', () => {
    const result = analyzeMtDNA({ '769': 'R' });
    expect(result.userMutations).toContain('A769G');
    const marker = result.testedMarkers.find(m => m.pos === '769');
    expect(marker).toBeDefined();
    expect(marker?.status).toBe('derived');
    expect(marker?.heteroplasmic).toBe(true);
  });

  it('counts two-letter expanded form at a derived position as derived and heteroplasmic', () => {
    const result = analyzeMtDNA({ '769': 'AG' });
    expect(result.userMutations).toContain('A769G');
    const marker = result.testedMarkers.find(m => m.pos === '769');
    expect(marker).toBeDefined();
    expect(marker?.status).toBe('derived');
    expect(marker?.heteroplasmic).toBe(true);
  });

  it('does not count mixture not containing the derived base as derived', () => {
    // 'Y' expands to 'CT', which does not contain derived 'G'
    const result = analyzeMtDNA({ '769': 'Y' });
    expect(result.userMutations).not.toContain('A769G');
    const marker = result.testedMarkers.find(m => m.pos === '769');
    expect(marker?.status).not.toBe('derived');
  });

  it('treats N at a derived position with known ancestral base as no-call (no testedMarkers entry)', () => {
    const result = analyzeMtDNA({ '769': 'N' });
    expect(result.userMutations).not.toContain('A769G');
    const marker = result.testedMarkers.find(m => m.pos === '769');
    expect(marker).toBeUndefined();
  });
});

describe('isDeepRefinementOfTreeCall', () => {
  it('correctly evaluates candidate refinements per phylogenetic rules', () => {
    expect(isDeepRefinementOfTreeCall('H1a1', 'Haplogroup H1a')).toBe(true);
    expect(isDeepRefinementOfTreeCall('H1a', 'Haplogroup H1a')).toBe(true);
    expect(isDeepRefinementOfTreeCall('HV', 'Haplogroup H')).toBe(false); // sibling
    expect(isDeepRefinementOfTreeCall('JT', 'Haplogroup J')).toBe(false); // sibling
    expect(isDeepRefinementOfTreeCall('U5a', 'Haplogroup H')).toBe(false); // lateral
    expect(isDeepRefinementOfTreeCall('T2b4a', 'Haplogroup T2b4')).toBe(true);
    expect(isDeepRefinementOfTreeCall('L0a', 'Haplogroup L0')).toBe(true);
    expect(isDeepRefinementOfTreeCall('', 'Haplogroup H')).toBe(false);
  });
});

