import { describe, it, expect } from 'vitest';
import { parseRawDNA, parseRawDNAStream, decompressGenomicBuffer } from './dnaParser';
import { gzipSync, zipSync, strToU8 } from 'fflate';

describe('DNA Parser Decompression & Format Parsing', () => {
  it('should parse a standard 23andMe raw text string', () => {
    const rawText = `# 23andMe raw data
rs1234	1	1000	AA
rs5678	1	2000	AG
`;
    const res = parseRawDNA(rawText);
    expect(res.snpCount).toBe(2);
    expect(res.snpMap['rs1234']).toBe('AA');
    expect(res.snpMap['rs5678']).toBe('AG');
  });

  it('should automatically decompress GZIP (.txt.gz) buffers', () => {
    const rawText = `# 23andMe raw data
rs1234	1	1000	AA
rs5678	1	2000	AG
`;
    const compressed = gzipSync(strToU8(rawText));
    const decompressed = decompressGenomicBuffer(compressed);
    const res = parseRawDNA(new TextDecoder().decode(decompressed));
    expect(res.snpCount).toBe(2);
    expect(res.snpMap['rs1234']).toBe('AA');
  });

  it('should automatically decompress GZIP files in parseRawDNAStream', async () => {
    const rawText = `# 23andMe raw data
rs1000	1	5000	CC
rs2000	1	6000	TT
`;
    const compressed = gzipSync(strToU8(rawText));
    const blob = new Blob([compressed]);
    const res = await parseRawDNAStream(blob);
    expect(res.snpCount).toBe(2);
    expect(res.snpMap['rs1000']).toBe('CC');
    expect(res.snpMap['rs2000']).toBe('TT');
  });

  it('should automatically decompress ZIP archives with case-variant file extensions', () => {
    const rawText = `rs999\t1\t1234\tGG\n`;
    const zipped = zipSync({ "genome_sample.TXT": strToU8(rawText) });
    const decompressed = decompressGenomicBuffer(zipped);
    const res = parseRawDNA(new TextDecoder().decode(decompressed));
    expect(res.snpCount).toBe(1);
    expect(res.snpMap['rs999']).toBe('GG');
  });

  it('should parse non-rsID and coordinate/probe marker formats (Affx-, ILMN-, chr_pos)', () => {
    const rawText = `# Vendor raw data
Affx-12345	1	10000	AA
ILMN_6789	1	20000	GG
`;
    const res = parseRawDNA(rawText);
    expect(res.snpCount).toBe(2);
    expect(res.snpMap['affx-12345']).toBe('AA');
    expect(res.snpMap['ilmn_6789']).toBe('GG');
    expect(res.snpMap['chr1_10000']).toBe('AA');
    expect(res.snpMap['chr1_20000']).toBe('GG');
  });

  it('should handle double GZIP compression (GZIP inside GZIP)', async () => {
    const rawText = `# Genotype export\nchr1_5000\t1\t5000\tCC\nchr1_6000\t1\t6000\tTT\n`;
    const innerGz = gzipSync(strToU8(rawText));
    const doubleGz = gzipSync(innerGz);

    // Test buffer decompression
    const decompressed = decompressGenomicBuffer(doubleGz);
    const resBuffer = parseRawDNA(new TextDecoder().decode(decompressed));
    expect(resBuffer.snpCount).toBe(2);
    expect(resBuffer.snpMap['chr1_5000']).toBe('CC');

    // Test streaming decompression
    const resStream = await parseRawDNAStream(new Blob([doubleGz]));
    expect(resStream.snpCount).toBe(2);
    expect(resStream.snpMap['chr1_6000']).toBe('TT');
  });

  it('should handle GZIP inside ZIP (e.g. MyHeritage WGS .vcf.gz inside .zip)', async () => {
    const rawVcf = `##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
chr1	5000	chr1_5000	C	T	50	PASS	.	GT	0/1
chr1	6000	chr1_6000	G	A	50	PASS	.	GT	1/1
`;
    const innerGz = gzipSync(strToU8(rawVcf));
    const zipWithGz = zipSync({ "MyHeritage_sample.vcf.gz": innerGz });

    const decompressed = decompressGenomicBuffer(zipWithGz);
    const res = parseRawDNA(new TextDecoder().decode(decompressed));
    expect(res.snpCount).toBe(2);
    expect(res.snpMap['chr1_5000']).toBe('CT');
    expect(res.snpMap['chr1_6000']).toBe('AA');

    // Also via parseRawDNAStream
    const resStream = await parseRawDNAStream(new Blob([zipWithGz]));
    expect(resStream.snpCount).toBe(2);
    expect(resStream.snpMap['chr1_5000']).toBe('CT');
  });

  it('should handle nested ZIP inside ZIP archive', () => {
    const rawText = `chr1_7000\t1\t7000\tAA\nchr1_8000\t1\t8000\tGG\n`;
    const innerZip = zipSync({ "nested_dna.txt": strToU8(rawText) });
    const outerZip = zipSync({ "archive.zip": innerZip });

    const decompressed = decompressGenomicBuffer(outerZip);
    const res = parseRawDNA(new TextDecoder().decode(decompressed));
    expect(res.snpCount).toBe(2);
    expect(res.snpMap['chr1_7000']).toBe('AA');
    expect(res.snpMap['chr1_8000']).toBe('GG');
  });

  it('should handle ZIP inside GZIP (.zip.gz)', async () => {
    const rawText = `chr1_9000\t1\t9000\tCC\n`;
    const innerZip = zipSync({ "data.txt": strToU8(rawText) });
    const outerGz = gzipSync(innerZip);

    const decompressed = decompressGenomicBuffer(outerGz);
    const res = parseRawDNA(new TextDecoder().decode(decompressed));
    expect(res.snpCount).toBe(1);
    expect(res.snpMap['chr1_9000']).toBe('CC');

    const resStream = await parseRawDNAStream(new Blob([outerGz]));
    expect(resStream.snpCount).toBe(1);
    expect(resStream.snpMap['chr1_9000']).toBe('CC');
  });
});
