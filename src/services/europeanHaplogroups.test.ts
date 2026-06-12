import { describe, it, expect, vi } from 'vitest';
vi.unmock('../constants/haplogroups');
vi.unmock('../data/snpDatabase');
import { predictYDNAHaplogroup, analyzeMtDNA } from './haplogroupPredictor';
import { Y_DNA_TREE, MT_DNA_TREE } from '../constants/haplogroups';

describe('European Y-DNA Haplogroups Integration', () => {
  it('should predict Haplogroup R1b-DF27 correctly', () => {
    // DF27 is a subclade under R1b1a2 (M269)
    // We simulate derived alleles for:
    // M343 (R1b) -> M269 (R1b1a2) -> DF27 (R1b-DF27)
    // Note: M343 is C->A (derived A), M269 is C->T (derived T), DF27 is C->T (derived T)
    const yMap = {
      'm343': 'A',
      'm269': 'T',
      'df27': 'T'
    };

    const result = predictYDNAHaplogroup(yMap, Y_DNA_TREE);
    expect(result.predicted?.name).toBe('R1b-DF27');
    expect(result.predicted?.continent).toBe('Southwestern Europe / Iberia');
    expect(result.predicted?.description).toContain('Iberian');
    expect(result.path).toContain('Haplogroup R1b-DF27');
  });

  it('should predict Haplogroup R1a-M458 correctly under R1a-Z282', () => {
    // M420 (R1a) is undefined in database, but M17 (R1a1), Z282 (R1a-Z282), and M458 are defined
    // M17: T/A (derived), Z282: T (derived), M458: T (derived)
    const yMap = {
      'm17': 'T',
      'z282': 'T',
      'm458': 'T'
    };

    const result = predictYDNAHaplogroup(yMap, Y_DNA_TREE);
    expect(result.predicted?.name).toBe('R1a-M458');
    expect(result.predicted?.continent).toBe('Central/Eastern Europe');
    expect(result.predicted?.description).toContain('Slavic');
  });

  it('should predict Haplogroup I1-L22 correctly', () => {
    // M170: C (derived), M253: C (derived), L22: A (derived)
    const yMap = {
      'm170': 'C',
      'm253': 'C',
      'l22': 'A'
    };

    const result = predictYDNAHaplogroup(yMap, Y_DNA_TREE);
    expect(result.predicted?.name).toBe('I1-L22');
    expect(result.predicted?.continent).toBe('Scandinavia / Finland');
  });

  it('should predict Haplogroup I2a-M26 correctly', () => {
    // M170: C (derived), M438: A (derived), P37.2: G (derived), M26: A (derived)
    const yMap = {
      'm170': 'C',
      'm438': 'A',
      'p37.2': 'G',
      'm26': 'A'
    };

    const result = predictYDNAHaplogroup(yMap, Y_DNA_TREE);
    expect(result.predicted?.name).toBe('I2a-M26');
    expect(result.predicted?.continent).toBe('Sardinia / Western Europe');
  });
});

describe('European mtDNA Haplogroups Integration', () => {
  it('should predict H1 maternal haplogroup and resolve details correctly', () => {
    // H1 is defined by G3010A under H (G2706A, G7028A)
    const mtMap = {
      '2706': 'A',
      '7028': 'A',
      '3010': 'A'
    };

    const result = analyzeMtDNA(mtMap);
    expect(result.predicted).toBe('H1');
    expect(result.region).toBe('Western Europe');
    expect(result.description).toContain('Iberia and the British Isles');
  });

  it('should predict U5b maternal haplogroup correctly', () => {
    // U5b is defined by C150T, A7768G, T14182C under U5 (C16192T, C16270T)
    const mtMap = {
      '11467': 'A', // U root
      '12308': 'A', // U root
      '16270': 'C', // U5 root / WHG
      '16192': 'T', // U5 root
      '150': 'T',   // U5b
      '7768': 'G',  // U5b
      '14182': 'C'  // U5b
    };

    const result = analyzeMtDNA(mtMap);
    expect(result.predicted).toBe('U5b');
    expect(result.region).toBe('Western / Northern Europe');
    expect(result.description).toContain('Basques and Saami');
  });
});
