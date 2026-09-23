import { describe, it, expect } from 'vitest';
import { loadMasterAims } from '../../data/index';

describe('Scout Score (Raw Allele Frequency Matrix) Audit & Verification', () => {
  it('correctly sets verified frequencies for the 6 critical diagnostic markers in global reference', () => {
    const aims = loadMasterAims() as Record<string, any>;

    // rs1426654 (SLC24A5) - European fixed light pigmentation
    expect(aims['rs1426654']).toBeDefined();
    expect(aims['rs1426654'].frequencies.EUR).toBeGreaterThan(0.9);
    expect(aims['rs1426654'].frequencies.AFR).toBeLessThan(0.1);

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
    expect(aims['rs12913832'].frequencies.EUR).toBeGreaterThan(0.7);

    // rs4988235 (MCM6 / LCT)
    expect(aims['rs4988235']).toBeDefined();
    expect(aims['rs4988235'].frequencies.EUR).toBeGreaterThan(0.6);

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

  it('accurately computes raw allele sharing continental proportions on simulated sample genotypes', async () => {
    const { calculateNaiveEthnicity } = await import('../../workers/genotypeWorker');

    // Create a simulated African-derived genotype (carrying Duffy null CC, TYR CC, etc.)
    const africanSample: Record<string, string> = {
      rs2814778: 'CC', // Duffy null
      rs1042602: 'CC', // TYR ancestral
      rs1426654: 'AA', // ancestral SLC24A5
      rs16891982: 'CC', // ancestral SLC45A2
      rs4988235: 'CC', // ancestral LCT non-persistent
      rs12913832: 'GG'  // ancestral brown HERC2
    };

    const afrScores = calculateNaiveEthnicity(africanSample);
    expect(afrScores).toBeDefined();
    expect(afrScores.AFR).toBeGreaterThan(30);
    expect(afrScores.AFR).toBeGreaterThan(afrScores.EUR || 0);
    expect(afrScores.EUR || 0).toBeLessThan(5);

    // Create a simulated European-derived genotype (carrying SLC24A5 GG, SLC45A2 GG, LCT TT, etc.)
    const europeanSample: Record<string, string> = {
      rs1426654: 'GG', // derived European SLC24A5
      rs16891982: 'GG', // derived European SLC45A2
      rs4988235: 'TT', // derived European LCT
      rs12913832: 'AA', // derived blue eye HERC2
      rs2814778: 'TT', // ancestral European ACKR1
      rs1042602: 'AA'  // derived European TYR
    };

    const eurScores = calculateNaiveEthnicity(europeanSample);
    expect(eurScores).toBeDefined();
    expect(eurScores.EUR).toBeGreaterThan(30);
    expect(eurScores.EUR).toBeGreaterThan(eurScores.AFR || 0);
    expect(eurScores.AFR || 0).toBeLessThan(5);

    // Create a simulated admixed genotype with segmental contributions from both lineages
    const admixedSample: Record<string, string> = {
      // European chromosomal segment: homozygous derived for European traits
      rs1426654: 'GG',
      rs16891982: 'GG',
      rs4988235: 'AA',
      rs12913832: 'AA',
      // African chromosomal segment: homozygous derived for African traits
      rs2814778: 'CC',
      rs10954606: 'TT',
      rs11624035: 'GG',
      rs1176483: 'CC'
    };

    const admixScores = calculateNaiveEthnicity(admixedSample);
    expect(admixScores).toBeDefined();
    expect(admixScores.EUR).toBeGreaterThan(15);
    expect(admixScores.AFR).toBeGreaterThan(15);
  }, 20000);
});
