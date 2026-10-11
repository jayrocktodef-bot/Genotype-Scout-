import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { deconvolveMicrohaplotypes, getDetectedMicrohaplotypes } from './microhapAdmixture';
import { validateMicrohapKernel } from '../dataValidator';
import microHapKernel from '../../data/raw_aims/microhap_top100_kernel.json';

describe('Microhaplotype Deconvolution Engine', () => {
  it('loads verified Kenneth Kidd / MicroHapDB kernel with at least 100 loci', () => {
    expect(Array.isArray(microHapKernel)).toBe(true);
    expect(microHapKernel.length).toBeGreaterThanOrEqual(100);

    const firstLocus = microHapKernel[0] as any;
    expect(firstLocus).toHaveProperty('id');
    expect(firstLocus).toHaveProperty('chrom');
    expect(firstLocus).toHaveProperty('pos');
    expect(firstLocus).toHaveProperty('snps');
    expect(firstLocus.snps.length).toBeGreaterThanOrEqual(2);
    expect(firstLocus).toHaveProperty('weights');
    expect(firstLocus.weights).toHaveProperty('AFR');
    expect(firstLocus.weights).toHaveProperty('EUR');
  });

  it('handles empty genotypes gracefully', () => {
    const res = deconvolveMicrohaplotypes({});
    expect(res.length).toBe(0);
    expect(res.detectedLoci).toEqual([]);
    expect(res.locusCount).toBe(0);
  });

  it('detects and phases homozygous and heterozygous loci', () => {
    const locus = microHapKernel[0] as any;
    const [rs1, rs2] = locus.snps;

    // Simulate heterozygous at rs1 and homozygous at rs2
    const mockGenotypes = {
      [rs1]: 'AG',
      [rs2]: 'TT'
    };

    const detected = getDetectedMicrohaplotypes(mockGenotypes);
    expect(detected.length).toBeGreaterThanOrEqual(1);

    const match = detected.find(d => d.id === locus.id);
    expect(match).toBeDefined();
    expect(match?.isHeterozygous).toBe(true);
    expect(match?.calledHaplotypes.length).toBe(2);
    expect(match?.typedSnps).toContain(rs1);
    expect(match?.typedSnps).toContain(rs2);
  });

  it('deconvolves simulated European sample accurately into EUR majority', () => {
    // Construct simulated EUR user by taking modal EUR haplotypes from top 40 loci
    const mockSnps: Record<string, string> = {};

    microHapKernel.slice(0, 40).forEach((locus: any) => {
      const eurWeights = locus.weights?.EUR || {};
      const sortedHaps = Object.entries(eurWeights).sort((a: any, b: any) => b[1] - a[1]);
      if (sortedHaps.length > 0) {
        const topHap = sortedHaps[0][0]; // string of alleles for locus.snps
        locus.snps.forEach((rs: string, idx: number) => {
          const allele = topHap[idx] || 'A';
          mockSnps[rs] = `${allele}${allele}`;
        });
      }
    });

    const res = deconvolveMicrohaplotypes(mockSnps);
    expect(res.length).toBe(5); // Returns all 5 continental superpopulations
    expect(res.locusCount).toBeGreaterThanOrEqual(30);

    const eurResult = res.find(r => r.popCode === 'EUR');
    expect(eurResult).toBeDefined();
    expect(eurResult?.percentage).toBeGreaterThan(60); // Strong European call
    expect(res[0].popCode).toBe('EUR'); // EUR is rank #1
  });

  it('deconvolves simulated African sample accurately into AFR majority', () => {
    const mockSnps: Record<string, string> = {};

    microHapKernel.slice(0, 40).forEach((locus: any) => {
      const afrWeights = locus.weights?.AFR || {};
      const sortedHaps = Object.entries(afrWeights).sort((a: any, b: any) => b[1] - a[1]);
      if (sortedHaps.length > 0) {
        const topHap = sortedHaps[0][0];
        locus.snps.forEach((rs: string, idx: number) => {
          const allele = topHap[idx] || 'A';
          mockSnps[rs] = `${allele}${allele}`;
        });
      }
    });

    const res = deconvolveMicrohaplotypes(mockSnps);
    expect(res.length).toBe(5);
    expect(res.locusCount).toBeGreaterThanOrEqual(30);

    const afrResult = res.find(r => r.popCode === 'AFR');
    expect(afrResult).toBeDefined();
    expect(afrResult?.percentage).toBeGreaterThan(60);
    expect(res[0].popCode).toBe('AFR');

    // Verify distanceRanked is strictly sorted by ascending distance
    expect(res.distanceRanked).toBeDefined();
    expect(res.distanceRanked!.length).toBe(5);
    for (let i = 0; i < res.distanceRanked!.length - 1; i++) {
      expect(res.distanceRanked![i].distance).toBeLessThanOrEqual(res.distanceRanked![i + 1].distance);
    }
  });

  it('provides distanceRanked sorted strictly by ascending vector distance', () => {
    // Mixed genotype dataset
    const mockSnps: Record<string, string> = {
      'rs333113': 'AG',
      'rs8074965': 'CC',
      'rs11657785': 'CT',
      'rs2278007': 'AA',
      'rs16891982': 'CG'
    };

    const res = deconvolveMicrohaplotypes(mockSnps);
    expect(res.distanceRanked).toBeDefined();
    const distances = res.distanceRanked!.map(r => r.distance);
    for (let i = 0; i < distances.length - 1; i++) {
      expect(distances[i]).toBeLessThanOrEqual(distances[i + 1]);
    }
  });

  describe('Microhaplotype Kernel Validator Coverage', () => {
    it('successfully validates the cleaned microhap kernel file', () => {
      const kernelPath = path.join(process.cwd(), 'src/data/raw_aims/microhap_top100_kernel.json');
      const res = validateMicrohapKernel(kernelPath);
      expect(res.valid).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it('rejects corrupt locus with invalid haplotype string length', () => {
      const tempPath = path.join(process.cwd(), '__temp_bad_hap_len.json');
      try {
        const corruptLocus = [
          {
            id: 'mh_test_bad_len',
            chrom: '1',
            pos: 1000,
            snps: ['rs1', 'rs2'],
            weights: {
              AFR: { TGC: 1.0 } // 3 chars for 2 snps
            }
          }
        ];
        fs.writeFileSync(tempPath, JSON.stringify(corruptLocus));
        expect(() => validateMicrohapKernel(tempPath)).toThrow(/MICROHAP KERNEL VIOLATION/);
      } finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    });

    it('rejects corrupt locus with frequency sum outside [0.95, 1.05]', () => {
      const tempPath = path.join(process.cwd(), '__temp_bad_freq_sum.json');
      try {
        const corruptLocus = [
          {
            id: 'mh_test_bad_sum',
            chrom: '1',
            pos: 1000,
            snps: ['rs1', 'rs2'],
            weights: {
              AFR: { AA: 0.8, AT: 0.5 } // sum = 1.3
            }
          }
        ];
        fs.writeFileSync(tempPath, JSON.stringify(corruptLocus));
        expect(() => validateMicrohapKernel(tempPath)).toThrow(/MICROHAP KERNEL VIOLATION/);
      } finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    });

    it('rejects duplicate locus IDs in kernel', () => {
      const tempPath = path.join(process.cwd(), '__temp_dup_id.json');
      try {
        const corruptLocus = [
          {
            id: 'mh_dup_1',
            chrom: '1',
            pos: 1000,
            snps: ['rs1'],
            weights: { AFR: { A: 1.0 } }
          },
          {
            id: 'mh_dup_1',
            chrom: '1',
            pos: 2000,
            snps: ['rs2'],
            weights: { AFR: { T: 1.0 } }
          }
        ];
        fs.writeFileSync(tempPath, JSON.stringify(corruptLocus));
        expect(() => validateMicrohapKernel(tempPath)).toThrow(/MICROHAP KERNEL VIOLATION/);
      } finally {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    });
  });
});
