import { describe, it, expect } from 'vitest';
import { 
  resolveSnpName, 
  isPalindromicMarker, 
  alignGenotype, 
  processSubpopulations 
} from '../../components/ancestryOracleLogic';

describe('Ancestry Oracle V3 Audit Verification', () => {
  describe('P0: Zero Fuzzy Matching on RSIDs', () => {
    const dbKeys = ['rs10001', 'rs10005', 'rs2814778', 'rs1426654'];

    it('resolves exact match and exact case-insensitive matches', () => {
      expect(resolveSnpName('rs10001', dbKeys)).toBe('rs10001');
      expect(resolveSnpName('RS10001', dbKeys)).toBe('rs10001');
      expect(resolveSnpName('rs2814778', dbKeys)).toBe('rs2814778');
    });

    it('normalizes alphanumeric prefixes and leading zeros', () => {
      expect(resolveSnpName('rs0010001', dbKeys)).toBe('rs10001');
    });

    it('STRICTLY rejects fuzzy match between different sequential RS numbers (P0 Fix)', () => {
      // In V2, Damerau-Levenshtein distance <= 2 would falsely map rs10002 to rs10001
      expect(resolveSnpName('rs10002', dbKeys)).toBeNull();
      expect(resolveSnpName('rs10003', dbKeys)).toBeNull();
      expect(resolveSnpName('rs10004', dbKeys)).toBeNull();
    });
  });

  describe('P0: Palindromic (A/T, C/G) Marker QC & Strand Resolution', () => {
    it('identifies palindromic and non-palindromic allele pairs', () => {
      expect(isPalindromicMarker(['A', 'T'])).toBe(true);
      expect(isPalindromicMarker(['T', 'A'])).toBe(true);
      expect(isPalindromicMarker(['C', 'G'])).toBe(true);
      expect(isPalindromicMarker(['G', 'C'])).toBe(true);
      expect(isPalindromicMarker(['A', 'G'])).toBe(false);
      expect(isPalindromicMarker(['C', 'T'])).toBe(false);
    });

    it('keeps palindromic heterozygotes unaltered (invariant under complement)', () => {
      expect(alignGenotype('AT', ['A', 'T'])).toBe('AT');
      expect(alignGenotype('CG', ['C', 'G'])).toBe('CG');
    });

    it('complements homozygous palindromic calls when reference frequency strongly contradicts call', () => {
      // User is AA, but target allele A has reference frequency 0.02 (near zero), while complement T is ~0.98
      expect(alignGenotype('AA', ['A', 'T'], 0.02)).toBe('TT');
      // User is TT, but target allele A has reference frequency 0.98
      expect(alignGenotype('TT', ['A', 'T'], 0.98)).toBe('AA');
    });

    it('standardly aligns non-palindromic reverse-strand calls', () => {
      // Non-palindromic A/G target: user call is TC (reverse strand for AG)
      expect(alignGenotype('CC', ['A', 'G'])).toBe('GG');
      expect(alignGenotype('TT', ['A', 'G'])).toBe('AA');
    });
  });

  describe('V3 Engine Execution & Statistical Confidence Intervals', () => {
    it('returns v3-bayesian-deconv engine tag and valid confidence intervals', async () => {
      const mockGenotypes = [
        { rsid: 'rs2814778', genotype: 'CC' },
        { rsid: 'rs1426654', genotype: 'AG' },
        { rsid: 'rs2887286', genotype: 'TT' },
        { rsid: 'rs2840528', genotype: 'AA' },
        { rsid: 'rs3890745', genotype: 'TT' }
      ];

      const result = await processSubpopulations(mockGenotypes, []);
      expect(result).toBeDefined();
      expect(result._engineVersion).toBe('v3-bayesian-deconv');
      expect(result.confidenceIntervals).toBeDefined();

      if (result.admixtureMix.length > 0) {
        const top = result.admixtureMix[0];
        expect(result.confidenceIntervals![top.popCode]).toBeDefined();
        expect(result.confidenceIntervals![top.popCode].low).toBeLessThanOrEqual(top.percentage);
        expect(result.confidenceIntervals![top.popCode].high).toBeGreaterThanOrEqual(top.percentage);
      }
    }, 20000);
  });
});
