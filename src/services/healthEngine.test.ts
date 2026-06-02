import { describe, it, expect } from 'vitest';
import { calculateCYP2D6Status, MetabolizerStatus } from '../utils/pgxAdvanced';
import { callStarAlleles } from '../engines/health/pypgxEngine';
import { inferRhFactor } from './bloodPredictorService';

describe('Pharmacogenomics (PGx) Engines Core Logic', () => {
  describe('calculateCYP2D6Status (pgxAdvanced)', () => {
    it('correctly predicts Poor Metabolizer (status and activity score) for double heterozygous *4/*10', () => {
      const genotypes = {
        'rs3892097': 'AG', // *4 (Null) heterozygous
        'rs1065852': 'AG', // *10 (Decreased) heterozygous
        'rs28371725': 'GG'  // *41 (Decreased) wildtype
      };
      
      const result = calculateCYP2D6Status(genotypes);
      expect(result.totalScore).toBe(0.25);
      expect(result.status).toBe(MetabolizerStatus.POOR);
    });

    it('correctly predicts Normal Metabolizer for fully wildtype genotype', () => {
      const genotypes = {
        'rs3892097': 'GG',
        'rs1065852': 'GG',
        'rs28371725': 'GG'
      };
      
      const result = calculateCYP2D6Status(genotypes);
      expect(result.totalScore).toBe(2.0);
      expect(result.status).toBe(MetabolizerStatus.NORMAL);
    });

    it('correctly predicts Intermediate Metabolizer for *41/*41 homozygous carrier', () => {
      const genotypes = {
        'rs3892097': 'GG',
        'rs1065852': 'GG',
        'rs28371725': 'AA' // *41 homozygous
      };
      
      const result = calculateCYP2D6Status(genotypes);
      expect(result.totalScore).toBe(1.0);
      expect(result.status).toBe(MetabolizerStatus.INTERMEDIATE);
    });
  });

  describe('callStarAlleles (pypgxEngine)', () => {
    describe('CYP2D6', () => {
      it('resolves *4/*10 double heterozygous diplotype and Poor Metabolizer phenotype', () => {
        const userSnps = {
          'rs3892097': 'AG', // *4 heterozygous
          'rs1065852': 'AG', // *10 heterozygous
          'rs28371725': 'GG'
        };

        const result = callStarAlleles('CYP2D6', userSnps);
        expect(result.diplotype).toBe('*4/*10');
        expect(result.activityScore).toBe(0.25);
        expect(result.phenotype).toBe('Poor Metabolizer');
      });

      it('resolves *1/*4 heterozygous diplotype and Intermediate Metabolizer phenotype', () => {
        const userSnps = {
          'rs3892097': 'AG', // *4 heterozygous
          'rs1065852': 'GG',
          'rs28371725': 'GG'
        };

        const result = callStarAlleles('CYP2D6', userSnps);
        expect(result.diplotype).toBe('*4/*1');
        expect(result.activityScore).toBe(1.0);
        expect(result.phenotype).toBe('Intermediate Metabolizer');
      });
    });

    describe('CYP2C19', () => {
      it('resolves *17/*17 homozygous increased function phenotype', () => {
        const userSnps = {
          'rs12248560': 'TT', // *17 homozygous
          'rs28399504': 'GG'  // *2 wildtype
        };

        const result = callStarAlleles('CYP2C19', userSnps);
        expect(result.diplotype).toBe('*17/*17');
        expect(result.activityScore).toBe(2.0);
        expect(result.phenotype).toBe('Normal Metabolizer');
      });

      it('resolves *2/*2 homozygous loss of function Poor Metabolizer phenotype', () => {
        const userSnps = {
          'rs12248560': 'CC', // *17 wildtype
          'rs28399504': 'AA'  // *2 homozygous
        };

        const result = callStarAlleles('CYP2C19', userSnps);
        expect(result.diplotype).toBe('*2/*2');
        expect(result.activityScore).toBe(0.0);
        expect(result.phenotype).toBe('Poor Metabolizer');
      });

      it('resolves *2/*17 heterozygous carrier phenotype', () => {
        const userSnps = {
          'rs12248560': 'TC', // *17 heterozygous
          'rs28399504': 'AG'  // *2 heterozygous
        };

        const result = callStarAlleles('CYP2C19', userSnps);
        expect(result.diplotype).toBe('*2/*17');
        expect(result.activityScore).toBe(1.0);
        expect(result.phenotype).toBe('Intermediate Metabolizer');
      });
    });

    describe('DPYD', () => {
      it('resolves *2A/*13 double heterozygous Poor Metabolizer phenotype', () => {
        const userSnps = {
          'rs3918290': 'AG',  // *2A heterozygous
          'rs55886062': 'AG' // *13 heterozygous
        };

        const result = callStarAlleles('DPYD', userSnps);
        expect(result.diplotype).toBe('*2A/*13');
        expect(result.activityScore).toBe(0.0);
        expect(result.phenotype).toBe('Poor Metabolizer');
      });

      it('resolves *1/*1 wildtype phenotype', () => {
        const userSnps = {
          'rs3918290': 'GG',
          'rs55886062': 'GG'
        };

        const result = callStarAlleles('DPYD', userSnps);
        expect(result.diplotype).toBe('*1/*1');
        expect(result.activityScore).toBe(2.0);
        expect(result.phenotype).toBe('Normal Metabolizer');
      });
    });
  });

  describe('inferRhFactor (bloodPredictorService)', () => {
    it('correctly predicts Rh phenotype with standard forward strand genotypes', () => {
      const genotypes = {
        'rs590787': 'TT', // Likely Rh-
        'rs609320': 'AA'  // Likely Rh-
      };

      const result = inferRhFactor(genotypes);
      expect(result.phenotype).toBe('Negative');
      expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('correctly predicts Rh phenotype when alleles are flipped/reverse strand (complement)', () => {
      const genotypes = {
        'rs590787': 'AA', // Complement of TT (Negative)
        'rs609320': 'TT'  // Complement of AA (Negative)
      };

      const result = inferRhFactor(genotypes);
      expect(result.phenotype).toBe('Negative');
      expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('correctly predicts Rh positive with heterozygous or homozygous carriers', () => {
      const genotypes = {
        'rs590787': 'CC', // Likely Rh+
        'rs609320': 'GG'  // Likely Rh+
      };

      const result = inferRhFactor(genotypes);
      expect(result.phenotype).toBe('Positive');
    });
  });
});
