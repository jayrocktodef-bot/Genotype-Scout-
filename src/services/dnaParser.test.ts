import { describe, it, expect } from 'vitest';
import { parseRawDNA, parseRawDNAStream } from './dnaParser';

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

  it('should parse VCF format correctly', () => {
    const rawData = `##fileformat=VCFv4.2
##FILTER=<ID=PASS,Description="All filters passed">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
1	100	rs123	A	G	.	PASS	.	GT	0/1
Y	200	rs456	T	C	.	PASS	.	GT	1/1
MT	300	.	C	G,T	.	PASS	.	GT	2/2
`;
    const result = parseRawDNA(rawData);
    expect(result.format).toBe('VCF');
    expect(result.snpMap['rs123']).toBe('AG'); // heterozygous
    expect(result.yMap['rs456']).toBe('CC'); // homozygous alt
    expect(result.mtMap['300']).toBe('T');   // multiallelic second alt
    expect(result.snpMap['chr1_100']).toBe('AG');
    expect(result.snpMap['chrmt_300']).toBe('TT');
    expect(result.snpCount).toBe(3);
  });

  it('should throw error for empty file', () => {
    expect(() => parseRawDNA('')).toThrow('This file is completely empty.');
  });

  it('should throw error for invalid data', () => {
    const rawData = 'invalid data';
    expect(() => parseRawDNA(rawData)).toThrow('The file contains no parseable genetic markers (SNPs).');
  });
});

describe('parseRawDNAStream', () => {
  it('should parse 23andMe stream correctly', async () => {
    const rawData = `
# 23andMe v5
# rsid	chromosome	position	genotype
rs123	1	100	AA
rs456	Y	200	G
rs789	MT	300	C
`;
    const file = new File([rawData], '23andme.txt', { type: 'text/plain' });
    const progressCalls: any[] = [];
    const result = await parseRawDNAStream(file, undefined, (bytes, total, snps) => {
      progressCalls.push({ bytes, total, snps });
    });

    expect(result.format).toBe('23andMe');
    expect(result.snpMap['rs123']).toBe('AA');
    expect(result.yMap['rs456']).toBe('G');
    expect(result.mtMap['300']).toBe('C');
    expect(result.snpCount).toBe(3);
    expect(progressCalls.length).toBeGreaterThan(0);
    expect(progressCalls[progressCalls.length - 1].snps).toBe(3);
  });

  it('should parse VCF stream correctly', async () => {
    const rawData = `##fileformat=VCFv4.2
##FILTER=<ID=PASS,Description="All filters passed">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
1	100	rs123	A	G	.	PASS	.	GT	0/1
Y	200	rs456	T	C	.	PASS	.	GT	1/1
MT	300	.	C	G,T	.	PASS	.	GT	2/2
`;
    const file = new File([rawData], 'vcf.vcf', { type: 'text/plain' });
    const result = await parseRawDNAStream(file);
    expect(result.format).toBe('VCF');
    expect(result.snpMap['rs123']).toBe('AG');
    expect(result.yMap['rs456']).toBe('CC');
    expect(result.mtMap['300']).toBe('T');
    expect(result.snpCount).toBe(3);
  });

  it('should filter SNPs using allowlist in stream', async () => {
    const rawData = `
# 23andMe v5
# rsid	chromosome	position	genotype
rs123	1	100	AA
rs456	Y	200	G
rs789	MT	300	C
`;
    const file = new File([rawData], '23andme.txt', { type: 'text/plain' });
    const allowlist = new Set(['rs123']);
    const result = await parseRawDNAStream(file, allowlist);
    expect(result.snpMap['rs123']).toBe('AA');
    expect(result.snpMap['rs456']).toBe('G');
    expect(result.mtMap['300']).toBe('C');
    expect(result.snpCount).toBe(3);
  });

  it('should throw error for empty stream', async () => {
    const file = new File([''], 'empty.txt', { type: 'text/plain' });
    await expect(parseRawDNAStream(file)).rejects.toThrow('This file is completely empty.');
  });
});
