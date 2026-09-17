import { describe, it, expect } from 'vitest';
import {
  calculateFileIntegrity,
  assessDatasetIntegrity,
  isNoCall,
  isHeterozygous,
  isHomozygous,
  normalizeChromKey
} from './qualityControl';

describe('Quality Control & File Integrity Engine', () => {
  describe('Helper functions', () => {
    it('detects no-calls correctly', () => {
      expect(isNoCall('--')).toBe(true);
      expect(isNoCall('00')).toBe(true);
      expect(isNoCall('NN')).toBe(true);
      expect(isNoCall('??')).toBe(true);
      expect(isNoCall('./.')).toBe(true);
      expect(isNoCall('-')).toBe(true);
      expect(isNoCall('AA')).toBe(false);
      expect(isNoCall('AG')).toBe(false);
    });

    it('detects heterozygous genotypes correctly', () => {
      expect(isHeterozygous('AG')).toBe(true);
      expect(isHeterozygous('CT')).toBe(true);
      expect(isHeterozygous('A/G')).toBe(true);
      expect(isHeterozygous('A|G')).toBe(true);
      expect(isHeterozygous('AA')).toBe(false);
      expect(isHeterozygous('--')).toBe(false);
    });

    it('detects homozygous genotypes correctly', () => {
      expect(isHomozygous('AA')).toBe(true);
      expect(isHomozygous('GG')).toBe(true);
      expect(isHomozygous('T/T')).toBe(true);
      expect(isHomozygous('AG')).toBe(false);
      expect(isHomozygous('--')).toBe(false);
    });

    it('normalizes chromosome identifiers correctly', () => {
      expect(normalizeChromKey('chr1')).toBe('1');
      expect(normalizeChromKey('22')).toBe('22');
      expect(normalizeChromKey('chrX')).toBe('X');
      expect(normalizeChromKey('23')).toBe('X');
      expect(normalizeChromKey('chrY')).toBe('Y');
      expect(normalizeChromKey('24')).toBe('Y');
      expect(normalizeChromKey('chrM')).toBe('MT');
      expect(normalizeChromKey('MT')).toBe('MT');
      expect(normalizeChromKey('invalid')).toBe(null);
    });
  });

  describe('calculateFileIntegrity (legacy API)', () => {
    it('computes call rate and fidelity status', () => {
      const snps = [
        { rsid: 'rs1', genotype: 'AA' },
        { rsid: 'rs2', genotype: 'AG' },
        { rsid: 'rs3', genotype: '--' },
        { rsid: 'rs4', genotype: 'GG' },
      ];
      const result = calculateFileIntegrity(snps);
      expect(result.callRate).toBe('75.00');
      expect(result.isReliable).toBe(false);
      expect(result.status).toBe('Low-Quality');
    });

    it('handles high-fidelity data (>99%)', () => {
      const snps = Array.from({ length: 1000 }, (_, i) => ({
        rsid: `rs${i}`,
        genotype: i < 5 ? '--' : 'AA'
      }));
      const result = calculateFileIntegrity(snps);
      expect(Number(result.callRate)).toBeGreaterThan(99);
      expect(result.isReliable).toBe(true);
      expect(result.status).toBe('High-Fidelity');
    });
  });

  describe('assessDatasetIntegrity', () => {
    it('analyzes dataset with chromosomes, call rate, and heterozygosity', () => {
      const dataset = {
        name: 'test_sample.txt',
        chip: '23andMe v5',
        snpCount: 10,
        mergedSnpMap: {
          'rs1': 'AA',
          'rs2': 'AG',
          'rs3': 'CT',
          'rs4': '--',
          'rs5': 'GG',
          'rs6': 'TT',
          'chrX_100': 'AA',
          'chrY_200': 'G',
          'chrMT_300': 'A',
          'rs10': 'AC'
        },
        mergedSnpMetaMap: {
          'rs1': { chrom: '1', pos: 1000 },
          'rs2': { chrom: '1', pos: 2000 },
          'rs3': { chrom: '2', pos: 3000 },
          'rs4': { chrom: '2', pos: 4000 },
          'rs5': { chrom: '3', pos: 5000 },
          'rs6': { chrom: '3', pos: 6000 },
          'rs10': { chrom: '22', pos: 7000 }
        }
      };

      const report = assessDatasetIntegrity(dataset);
      expect(report.totalMarkers).toBe(10);
      expect(report.validCalls).toBe(9);
      expect(report.noCalls).toBe(1);
      expect(report.callRate).toBe(90);
      expect(report.heterozygousCount).toBe(3); // rs2 (AG), rs3 (CT), rs10 (AC)
      expect(report.chromosomes.length).toBe(25); // 22 autosomes + X + Y + MT

      const chr1 = report.chromosomes.find(c => c.chrom === '1');
      expect(chr1?.count).toBe(2);
      expect(chr1?.validCalls).toBe(2);
      expect(chr1?.hetCount).toBe(1);

      expect(report.integrityScore).toBeGreaterThan(0);
      expect(report.grade).toBeDefined();
    });

    it('flags high heterozygosity as potential contamination', () => {
      const dataset = {
        name: 'contaminated_sample.txt',
        mergedSnpMap: {
          'rs1': 'AG',
          'rs2': 'CT',
          'rs3': 'AC',
          'rs4': 'GT',
          'rs5': 'AG',
        }
      };
      const report = assessDatasetIntegrity(dataset);
      expect(report.heterozygosityRate).toBe(100);
      expect(report.purityVerdict).toBe('CAUTION');
      expect(report.purityStatus).toContain('Excess Heterozygosity');
    });
  });
});
