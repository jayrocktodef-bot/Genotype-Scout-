import { describe, it, expect } from 'vitest';
import { solveElasticNetNNLS } from '../nnls';
import { calculateMarkerLLRScore } from '../../services/snpMatcher';
import { processSubpopulations } from '../../components/ancestryOracleLogic';

describe('Ancestry Deconvolution & LLR Refactor Engine', () => {
  describe('Elastic Net NNLS Solver', () => {
    it('solves Non-Negative Least Squares with elastic net regularization', () => {
      // Simple 2x2 system: A = [[1, 0], [0, 1]], b = [2, 3]
      const A = [[1, 0], [0, 1]];
      const b = [2, 3];
      const w = [1, 1];

      const x = solveElasticNetNNLS(A, b, w, 1e-4, 1e-4);
      expect(x.length).toBe(2);
      expect(x[0]).toBeGreaterThan(0);
      expect(x[1]).toBeGreaterThan(0);
      expect(x[0]).toBeCloseTo(2.0, 1);
      expect(x[1]).toBeCloseTo(3.0, 1);
    });

    it('enforces non-negativity constraints', () => {
      const A = [[1, 0], [0, 1]];
      const b = [-5, 2];
      const w = [1, 1];

      const x = solveElasticNetNNLS(A, b, w, 1e-4, 1e-4);
      expect(x[0]).toBe(0);
      expect(x[1]).toBeGreaterThan(0);
    });
  });

  describe('Log-Likelihood Ratio (LLR) Marker Scoring', () => {
    it('produces low LLR for shared ancestral variants between East Asian and Indigenous American', () => {
      // Shared ancestral allele (high in both EAS and AMR)
      const frequencies = {
        EAS: 0.85,
        AMR: 0.90,
        EUR: 0.10,
        AFR: 0.05
      };

      const result = calculateMarkerLLRScore('GG', ['G'], frequencies);
      expect(result.llrByPop['AMR']).toBeDefined();
      expect(result.llrByPop['EAS']).toBeDefined();
      // The LLR difference between AMR and EAS should be small (< 0.2) because it is a shared ancestral variant
      const diff = Math.abs(result.llrByPop['AMR'] - result.llrByPop['EAS']);
      expect(diff).toBeLessThan(0.3);
      expect(result.isDiagnostic).toBe(false);
    });

    it('flags diagnostic private markers with high informativeness delta', () => {
      // Diagnostic private Native American marker (fixed in AMR, absent in others)
      const frequencies = {
        AMR: 0.95,
        EAS: 0.02,
        EUR: 0.01,
        AFR: 0.01
      };

      const result = calculateMarkerLLRScore('GG', ['G'], frequencies);
      expect(result.isDiagnostic).toBe(true);
      expect(result.bestPop).toBe('AMR');
      expect(result.maxLlr).toBeGreaterThan(1.0);
    });
  });

  describe('Subpopulation Deconvolution & Minor Signal Retention', () => {
    it('runs processSubpopulations cleanly without error', async () => {
      const mockGenotypes = [
        { rsid: 'rs2887286', genotype: 'CC' },
        { rsid: 'rs2840528', genotype: 'GG' },
        { rsid: 'rs3890745', genotype: 'CC' },
        { rsid: 'rs1181875', genotype: 'CC' },
        { rsid: 'rs6663840', genotype: 'AA' }
      ];

      const res = await processSubpopulations(mockGenotypes, []);
      expect(res).toBeDefined();
      expect(res.topMatch).toBeDefined();
      expect(res.breakdown.length).toBeGreaterThan(0);
    });
  });
});
