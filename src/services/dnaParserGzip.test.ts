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
});
