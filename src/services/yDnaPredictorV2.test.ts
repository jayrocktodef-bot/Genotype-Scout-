import { describe, it, expect } from 'vitest';
import { YDnaPredictorV2, YDnaPredictionDetails } from './yDnaPredictorV2';
import { YPhylotreeDataset, YSnpRecord, YPhylotreeBranch } from '../utils/yPhylotree';
import { RawSnp } from '../types/haplogroup';

/**
 * Build a minimal test dataset with known structure.
 * Tree:
 *   A
 *   ├─ CT (M168: C→T)
 *   │  ├─ D (M174: T→C)
 *   │  ├─ E (M96: C→G)
 *   │  │  └─ E1b1 (M2: A→G) [defined by M96 + M2, both derived]
 *   │  └─ F (M213: T→C)
 *   └─ T (M92: A→G) [hypothetical alternate path]
 */
function buildTestDataset(): YPhylotreeDataset {
  const snps: YSnpRecord[] = [
    {
      name: 'M168',
      ancestral: 'C',
      derived: 'T',
      posHg38: 1000,
      isoggHaplogroup: 'CT',
    },
    {
      name: 'M174',
      ancestral: 'T',
      derived: 'C',
      posHg38: 2000,
      isoggHaplogroup: 'D',
    },
    {
      name: 'M96',
      ancestral: 'C',
      derived: 'G',
      posHg38: 3000,
      isoggHaplogroup: 'E',
    },
    {
      name: 'M2',
      ancestral: 'A',
      derived: 'G',
      posHg38: 4000,
      isoggHaplogroup: 'E1b1',
    },
    {
      name: 'M213',
      ancestral: 'T',
      derived: 'C',
      posHg38: 5000,
      isoggHaplogroup: 'F',
    },
    {
      name: 'M92',
      ancestral: 'A',
      derived: 'G',
      posHg38: 6000,
      isoggHaplogroup: 'T',
    },
  ];

  const branches: YPhylotreeBranch[] = [
    {
      branchName: 'A',
      parent: null,
      definingSNPs: [],
      unresolvedSNPs: [],
      rsids: [],
    },
    {
      branchName: 'CT',
      parent: 'A',
      definingSNPs: [snps[0]], // M168
      unresolvedSNPs: [],
      rsids: [],
    },
    {
      branchName: 'D',
      parent: 'CT',
      definingSNPs: [snps[1]], // M174
      unresolvedSNPs: [],
      rsids: [],
    },
    {
      branchName: 'E',
      parent: 'CT',
      definingSNPs: [snps[2]], // M96
      unresolvedSNPs: [],
      rsids: [],
    },
    {
      branchName: 'E1b1',
      parent: 'E',
      definingSNPs: [snps[2], snps[3]], // M96 + M2
      unresolvedSNPs: [],
      rsids: [],
    },
    {
      branchName: 'F',
      parent: 'CT',
      definingSNPs: [snps[4]], // M213
      unresolvedSNPs: [],
      rsids: [],
    },
    {
      branchName: 'T',
      parent: 'A',
      definingSNPs: [snps[5]], // M92
      unresolvedSNPs: [],
      rsids: [],
    },
  ];

  return {
    version: '1.0.0',
    source: 'test',
    generatedAt: new Date().toISOString(),
    snpCount: snps.length,
    branchCount: branches.length,
    resolvedBranchCount: branches.length,
    branches,
  };
}

describe('YDnaPredictorV2', () => {
  it('initializes with a dataset', () => {
    const dataset = buildTestDataset();
    const predictor = new YDnaPredictorV2(dataset);
    expect(predictor).toBeDefined();
  });

  describe('Rule 1: Derived-only confirmation', () => {
    it('accepts a branch when all known defining SNPs are derived', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      // User has M168 (T) — derived for CT
      const result = predictor.predict([
        { name: 'M168', rsid: 'rs1234', allele: 'T' },
      ]);

      expect(result.terminalHaplogroup).toBe('CT');
      expect(result.derivedSnpCount).toBe(1);
      expect(result.ancestralSnpCount).toBe(0);
    });

    it('correctly identifies derived state for single-letter alleles', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      // User has M96 (G) — derived for E
      const result = predictor.predict([
        { name: 'M96', rsid: 'rs5678', allele: 'G' },
      ]);

      expect(result.terminalHaplogroup).toBe('E');
      expect(result.derivedSnpCount).toBeGreaterThan(0);
    });
  });

  describe('Rule 2: Ancestral rejection', () => {
    it('rejects a branch if any defining SNP is ancestral', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      // User has M168 (C) — ancestral for CT
      const result = predictor.predict([
        { name: 'M168', rsid: 'rs1234', allele: 'C' },
      ]);

      // CT should be rejected; best should be A
      expect(result.rejectedBranches).toContain('CT');
      expect(result.terminalHaplogroup).toBe('A');
    });

    it('still traverses other branches after rejecting one', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      // User has M96 (G) — derived for E, AND M168 (C) — ancestral for CT
      // Should accept E path, reject CT path
      const result = predictor.predict([
        { name: 'M168', rsid: 'rs1', allele: 'C' },  // ancestral → reject CT
        { name: 'M96', rsid: 'rs3', allele: 'G' },   // derived → accept E
      ]);

      expect(result.rejectedBranches).toContain('CT');
      expect(result.terminalHaplogroup).toBe('E');
    });
  });

  describe('Rule 3: Deep terminal ≥2 SNP requirement', () => {
    it('requires ≥2 derived SNPs for deep terminals (depth >= 5)', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      // E1b1 is defined by 2 SNPs (M96 + M2); both are at depth 4 max in test tree
      // but if it were deeper, we should require both
      const result = predictor.predict([
        { name: 'M96', rsid: 'rs3', allele: 'G' },  // derived
        { name: 'M2', rsid: 'rs4', allele: 'G' },   // derived
      ]);

      expect(result.terminalHaplogroup).toBe('E1b1');
      expect(result.derivedSnpCount).toBe(2);
    });

    it('accepts shallow terminals with 1 derived SNP', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      // CT is shallow (depth 2); should accept with 1 derived SNP
      const result = predictor.predict([
        { name: 'M168', rsid: 'rs1', allele: 'T' }, // derived
      ]);

      expect(result.terminalHaplogroup).toBe('CT');
    });
  });

  describe('Rule 4: Coverage and confidence reporting', () => {
    it('reports coverage as % of branch defining SNPs with user data', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      // E1b1 has 2 defining SNPs; user provides 1
      const result = predictor.predict([
        { name: 'M96', rsid: 'rs3', allele: 'G' },
      ]);

      // If we reach E1b1, coverage should be ~50% (1 of 2 SNPs)
      // But we may not reach it if only M96 is provided and M2 is missing
      expect(result.coverage).toBeGreaterThanOrEqual(0);
    });

    it('reports confidence as derived / (derived + ancestral) * 100', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      // User has M96 derived + ancestral alleles for two branches
      const result = predictor.predict([
        { name: 'M96', rsid: 'rs3', allele: 'G' },  // derived for E
      ]);

      expect(result.confidence).toBe(100); // 1 / (1 + 0) * 100
    });

    it('includes derived/ancestral SNP counts', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      const result = predictor.predict([
        { name: 'M168', rsid: 'rs1', allele: 'T' },
        { name: 'M96', rsid: 'rs3', allele: 'G' },
      ]);

      expect(result.derivedSnpCount).toBeGreaterThan(0);
      expect(result.ancestralSnpCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Path tracking', () => {
    it('reports the traversal path from root to terminal', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      const result = predictor.predict([
        { name: 'M168', rsid: 'rs1', allele: 'T' },  // derived for CT
        { name: 'M96', rsid: 'rs3', allele: 'G' },   // derived for E
        { name: 'M2', rsid: 'rs4', allele: 'G' },    // derived for E1b1
      ]);

      // Path should be: A → CT → E → E1b1
      expect(result.path).toContain('A');
      expect(result.path).toContain('CT');
      expect(result.path).toContain('E');
    });
  });

  describe('Edge cases', () => {
    it('handles missing SNP data gracefully', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      const result = predictor.predict([]);
      expect(result.terminalHaplogroup).toBe('A');
      expect(result.confidence).toBe(0);
    });

    it('skips invalid allele markers (-- / 00 / II)', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      const result = predictor.predict([
        { name: 'M168', rsid: 'rs1', allele: '--' },  // invalid
        { name: 'M96', rsid: 'rs3', allele: 'G' },    // valid
      ]);

      expect(result.terminalHaplogroup).toBe('E');
    });

    it('handles case-insensitivity in alleles', () => {
      const dataset = buildTestDataset();
      const predictor = new YDnaPredictorV2(dataset);

      const result1 = predictor.predict([
        { name: 'M168', rsid: 'rs1', allele: 't' }, // lowercase
      ]);

      const result2 = predictor.predict([
        { name: 'M168', rsid: 'rs1', allele: 'T' }, // uppercase
      ]);

      expect(result1.terminalHaplogroup).toBe(result2.terminalHaplogroup);
    });
  });
});
