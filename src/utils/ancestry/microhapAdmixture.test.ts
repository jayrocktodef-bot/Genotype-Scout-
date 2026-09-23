import { describe, it, expect } from 'vitest';
import { deconvolveMicrohaplotypes, getDetectedMicrohaplotypes } from './microhapAdmixture';
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
  });
});
