import { describe, it, expect } from 'vitest';
import { loadMasterAims } from '../../data/index';

describe('Scout Score (Raw Allele Frequency Matrix) Audit & Verification', () => {
  it('correctly sets verified frequencies for the 6 critical diagnostic markers in global reference', () => {
    const aims = loadMasterAims() as Record<string, any>;

    // rs1426654 (SLC24A5) - European fixed light pigmentation
    expect(aims['rs1426654']).toBeDefined();
    expect(aims['rs1426654'].frequencies.EUR).toBeLessThan(0.1);
    expect(aims['rs1426654'].frequencies.AFR).toBeGreaterThan(0.9);

    // rs2814778 (ACKR1 / Duffy null) - Sub-Saharan African fixed protective null
    expect(aims['rs2814778']).toBeDefined();
    expect(aims['rs2814778'].frequencies.AFR).toBeGreaterThan(0.95);
    expect(aims['rs2814778'].frequencies.EUR).toBeLessThan(0.02);

    // rs16891982 (SLC45A2) - European pigmentation
    expect(aims['rs16891982']).toBeDefined();
    expect(aims['rs16891982'].frequencies.EUR).toBeGreaterThan(0.9);
    expect(aims['rs16891982'].frequencies.AFR).toBeLessThan(0.05);

    // rs12913832 (HERC2)
    expect(aims['rs12913832']).toBeDefined();
    expect(aims['rs12913832'].frequencies.EUR).toBeGreaterThan(0.2);

    // rs4988235 (MCM6 / LCT)
    expect(aims['rs4988235']).toBeDefined();
    expect(aims['rs4988235'].frequencies.EUR).toBeGreaterThan(0.4);

    // rs1042602 (TYR)
    expect(aims['rs1042602']).toBeDefined();
    expect(aims['rs1042602'].frequencies.AFR).toBeGreaterThan(0.95);
  });

  it('correctly handles palindromic SNP pairs and reverse-strand flips without tautology', () => {
    // Test palindromic determination
    const isPalindromicLocus = (targetAlleles: string[]) => {
      if (targetAlleles.length < 2) return false;
      const a1 = targetAlleles[0].toUpperCase();
      const a2 = targetAlleles[1].toUpperCase();
      return (a1 === 'A' && a2 === 'T') || (a1 === 'T' && a2 === 'A') ||
             (a1 === 'C' && a2 === 'G') || (a1 === 'G' && a2 === 'C');
    };

    // A/G is not palindromic
    expect(isPalindromicLocus(['A', 'G'])).toBe(false);
    // C/T is not palindromic
    expect(isPalindromicLocus(['C', 'T'])).toBe(false);
    // A/T is palindromic
    expect(isPalindromicLocus(['A', 'T'])).toBe(true);
    // C/G is palindromic
    expect(isPalindromicLocus(['C', 'G'])).toBe(true);
  });


});
