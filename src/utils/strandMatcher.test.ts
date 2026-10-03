import { describe, it, expect } from 'vitest';
import {
  complementBase,
  isPalindromicPair,
  parseUserGenotype,
  matchGenotypeAlleles,
} from './strandMatcher';

describe('strandMatcher', () => {
  it('correctly complements nucleotide bases', () => {
    expect(complementBase('A')).toBe('T');
    expect(complementBase('T')).toBe('A');
    expect(complementBase('C')).toBe('G');
    expect(complementBase('G')).toBe('C');
    expect(complementBase('a')).toBe('T');
  });

  it('correctly detects palindromic allele pairs', () => {
    expect(isPalindromicPair('A', 'T')).toBe(true);
    expect(isPalindromicPair('T', 'A')).toBe(true);
    expect(isPalindromicPair('C', 'G')).toBe(true);
    expect(isPalindromicPair('G', 'C')).toBe(true);
    expect(isPalindromicPair('A', 'G')).toBe(false);
    expect(isPalindromicPair('C', 'T')).toBe(false);
  });

  it('parses diverse genotype formats', () => {
    expect(parseUserGenotype('AG')).toEqual(['A', 'G']);
    expect(parseUserGenotype('A/G')).toEqual(['A', 'G']);
    expect(parseUserGenotype('A|G')).toEqual(['A', 'G']);
    expect(parseUserGenotype('A')).toEqual(['A']);
    expect(parseUserGenotype('--')).toEqual([]);
    expect(parseUserGenotype('00')).toEqual([]);
    expect(parseUserGenotype(null)).toEqual([]);
  });

  it('performs exact forward matching first (case-insensitive)', () => {
    const res1 = matchGenotypeAlleles('AG', 'A', { otherAllele: 'G' });
    expect(res1.dosage).toBe(1);
    expect(res1.isComplement).toBe(false);
    expect(res1.isPalindromic).toBe(false);

    const res2 = matchGenotypeAlleles('AA', 'A', { otherAllele: 'G' });
    expect(res2.dosage).toBe(2);
    expect(res2.isComplement).toBe(false);

    const res3 = matchGenotypeAlleles('gg', 'G', { otherAllele: 'A' });
    expect(res3.dosage).toBe(2);
    expect(res3.isComplement).toBe(false);
  });

  it('complements reverse-strand kits on non-palindromic SNPs', () => {
    // Non-palindromic: locus is A/G (target A, other G).
    // Minus strand kit calls T/C instead of A/G.
    // Target is A.
    // T complements to A -> match! C complements to G -> non-match.
    const res = matchGenotypeAlleles('TC', 'A', { otherAllele: 'G' });
    expect(res.dosage).toBe(1);
    expect(res.isComplement).toBe(true);
    expect(res.isPalindromic).toBe(false);

    // Minus strand homozygous: TT for target A.
    // Both complement to A.
    const resHom = matchGenotypeAlleles('TT', 'A', { otherAllele: 'G' });
    expect(resHom.dosage).toBe(2);
    expect(resHom.isComplement).toBe(true);
  });

  it('NEVER complements palindromic SNPs (A/T, C/G)', () => {
    // Palindromic locus: A/T. Target is A.
    // User genotype is 'TT'.
    // If complement were allowed, TT would complement to AA and score 2!
    // But H-3 strict policy forbids complement on palindromic SNPs.
    const resPal = matchGenotypeAlleles('TT', 'A', { otherAllele: 'T' });
    expect(resPal.dosage).toBe(0);
    expect(resPal.isComplement).toBe(false);
    expect(resPal.isPalindromic).toBe(true);

    // Heterozygote 'AT' with target A:
    // A matches forward (dosage 1), T must NOT be complemented to A!
    const resHet = matchGenotypeAlleles('AT', 'A', { otherAllele: 'T' });
    expect(resHet.dosage).toBe(1);
    expect(resHet.isComplement).toBe(false);
    expect(resHet.isPalindromic).toBe(true);

    // Palindromic C/G locus: Target is C.
    // User genotype is 'GG'. Must not score for C!
    const resCG = matchGenotypeAlleles('GG', 'C', { otherAllele: 'G' });
    expect(resCG.dosage).toBe(0);
    expect(resCG.isPalindromic).toBe(true);
  });
});
