import { describe, it, expect, vi } from 'vitest';
import { runAncestryInference, calculateAncestryOracle } from './ancestryEngine';

// Mock dependencies
vi.mock('../anchorAims', () => ({
  ANCHOR_AIMS: [
    { rsid: 'rs1', region: 'Europe', alleles: ['A'], frequencies: { EUR: 0.9, AFR: 0.1 } }
  ]
}));

vi.mock('../data/snpDatabase', () => ({
  SNP_DB: []
}));

vi.mock('../constants/genotypeConstants', () => ({
  CONTINENT_TO_CODE: {
    'European': 'EUR',
    'African': 'AFR',
    'East Asian': 'EAS',
    'South Asian': 'SAS',
    'Middle Eastern': 'MENA',
    'Native American': 'AMR',
    'Oceanian': 'OCE',
    'North African': 'NAFR',
    'Central Asian': 'CAS'
  }
}));

describe('runAncestryInference', () => {
  it('should return empty results for no markers', () => {
    const result = runAncestryInference([], {});
    expect(result.continents).toEqual([]);
    expect(result.continentalScores).toEqual({});
  });

  it('should calculate scores for provided markers', () => {
    const markers = [
      { rsid: 'rs1', chrom: '1', pos: 100, alleles: ['A'], genotype: 'AA', significance: 'High', continent: 'Europe' }
    ];
    const userGenotype = { 'rs1': 'AA' };
    const result = runAncestryInference(markers, userGenotype);
    
    expect(result.continents).toContain('European');
    expect(result.continentalScores['European']).toBeGreaterThan(0);
  });
});

describe('calculateAncestryOracle', () => {
  it('should run inference for different marker sets', () => {
    const results = [
      { markerId: 'rs1', rsid: 'rs1', chrom: '1', pos: 100, alleles: ['A'], genotype: 'AA', status: 'matched', category: 'Ancestry' }
    ];
    const oracle = calculateAncestryOracle(results);
    
    expect(oracle.primary).toBeDefined();
    expect(oracle.secondary).toBeDefined();
    expect(oracle.commercial).toBeDefined();
  });
});
