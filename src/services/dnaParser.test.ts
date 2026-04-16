import { describe, it, expect } from 'vitest';
import { parseRawDNA } from './dnaParser';

describe('parseRawDNA', () => {
  it('should parse 23andMe format correctly', () => {
    const rawData = `
# 23andMe v5
# rsid	chromosome	position	genotype
rs123	1	100	AA
rs456	Y	200	G
rs789	MT	300	C
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('23andMe');
    expect(result.snpMap['rs123']).toBe('AA');
    expect(result.yMap['rs456']).toBe('G');
    expect(result.mtMap['300']).toBe('C');
    expect(result.snpCount).toBe(3);
  });

  it('should parse AncestryDNA format correctly', () => {
    const rawData = `
# AncestryDNA v2
rsid	chromosome	position	allele1	allele2
rs123	1	100	A	A
rs456	Y	200	G	0
rs789	MT	300	C	0
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('AncestryDNA');
    expect(result.snpMap['rs123']).toBe('AA');
    expect(result.yMap['rs456']).toBe('G');
    expect(result.mtMap['300']).toBe('C');
  });

  it('should throw error for empty file', () => {
    expect(() => parseRawDNA('')).toThrow('The file appears to be empty');
  });

  it('should throw error for invalid data', () => {
    const rawData = 'invalid data';
    expect(() => parseRawDNA(rawData)).toThrow('The file appears to be empty');
  });
});
