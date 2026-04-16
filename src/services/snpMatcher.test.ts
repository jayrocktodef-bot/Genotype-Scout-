import { describe, it, expect, vi } from 'vitest';
import { matchSNPs, getMarkerDescription } from './snpMatcher';

// Mock the dependencies
vi.mock('../data/snpDatabase', () => ({
  SNP_DB: [
    {
      markerId: 'rs123',
      rsid: 'rs123',
      alleles: ['A'],
      description: 'Test SNP',
      interpretations: { 'AA': 'Interpretation AA', 'AG': 'Interpretation AG' }
    }
  ],
  SNP_LOOKUP: new Map([
    ['rs123', { description: 'Test SNP' }]
  ])
}));

vi.mock('../anchorAims', () => ({
  ANCHOR_AIMS: []
}));

describe('getMarkerDescription', () => {
  it('should return description for known SNP', () => {
    expect(getMarkerDescription('rs123')).toBe('Test SNP');
  });

  it('should return description for mtDNA mutation', () => {
    expect(getMarkerDescription('A769G')).toContain('Mitochondrial mutation at position 769');
  });
});

describe('matchSNPs', () => {
  it('should match a tested SNP', () => {
    const snpMap = { 'rs123': 'AA' };
    const results = matchSNPs(snpMap);
    const rs123 = results.find(r => r.markerId === 'rs123');
    expect(rs123.status).toBe('matched');
    expect(rs123.genotype).toBe('AA');
    expect(rs123.interpretation).toBe('Interpretation AA');
  });

  it('should mark SNP as not_tested if missing from map', () => {
    const snpMap = {};
    const results = matchSNPs(snpMap);
    const rs123 = results.find(r => r.markerId === 'rs123');
    expect(rs123.status).toBe('not_tested');
  });

  it('should handle partial matches', () => {
    const snpMap = { 'rs123': 'AG' };
    const results = matchSNPs(snpMap);
    const rs123 = results.find(r => r.markerId === 'rs123');
    expect(rs123.status).toBe('matched');
    expect(rs123.interpretation).toBe('Interpretation AG');
  });
});
