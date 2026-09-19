import { describe, it, expect } from 'vitest';
import { LineAssembler, checkUnsupportedArchive } from './byteStream';
import { detectHeaderColumns, sniffDelimiter, detectVendorAndChip } from './formatSniffer';
import { decodeVcfGenotype, parseVcfLine } from './vcfTokenizer';
import { cleanGenotypeString, parseLineBytes, parseAdaptiveLine } from './tabularTokenizer';
import { parseRawDNA, parseRawDNAStream } from './engine';
import { GenomicsErrorCode } from '../errorCaller';

describe('Rebuilt Parser Engine — Micro-benchmarks & Edge Seams', () => {
  it('should correctly assemble lines split across arbitrary tiny byte chunks without data corruption', () => {
    const assembler = new LineAssembler();
    const fullText = `rs1\t1\t100\tAA\nrs2\t1\t200\tGG\r\nrs3\t1\t300\tCC\nrs4\t1\t400\tTT`;
    const encoder = new TextEncoder();
    const bytes = encoder.encode(fullText);

    const emittedLines: string[] = [];
    // Slice into tiny 3-byte chunks to stress test chunk boundary handling
    const CHUNK_SIZE = 3;
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
      for (const line of assembler.pushChunk(chunk)) {
        emittedLines.push(new TextDecoder().decode(line));
      }
    }
    for (const line of assembler.flush()) {
      emittedLines.push(new TextDecoder().decode(line));
    }

    expect(emittedLines).toEqual([
      'rs1\t1\t100\tAA',
      'rs2\t1\t200\tGG',
      'rs3\t1\t300\tCC',
      'rs4\t1\t400\tTT'
    ]);
  });

  it('should handle CRLF split directly between \\r and \\n across chunk boundaries', () => {
    const assembler = new LineAssembler();
    const encoder = new TextEncoder();

    // Chunk 1 ends with \r
    const chunk1 = encoder.encode('rs100\t1\t1000\tAG\r');
    // Chunk 2 begins with \n
    const chunk2 = encoder.encode('\nrs200\t1\t2000\tCT\n');

    const emittedLines: string[] = [];
    for (const line of assembler.pushChunk(chunk1)) {
      emittedLines.push(new TextDecoder().decode(line));
    }
    for (const line of assembler.pushChunk(chunk2)) {
      emittedLines.push(new TextDecoder().decode(line));
    }
    for (const line of assembler.flush()) {
      emittedLines.push(new TextDecoder().decode(line));
    }

    expect(emittedLines).toEqual([
      'rs100\t1\t1000\tAG',
      'rs200\t1\t2000\tCT'
    ]);
  });

  it('should decode multiallelic and phased genotypes accurately', () => {
    // REF=A, ALT=C,T, GT=1/2 -> CT
    const multi = decodeVcfGenotype('A', 'C,T', '1/2');
    expect(multi).toBeDefined();
    expect(multi?.genotype).toBe('CT');
    expect(multi?.isPhased).toBe(false);

    // Phased GT=0|1 -> A|G
    const phased = decodeVcfGenotype('A', 'G', '0|1', '100');
    expect(phased).toBeDefined();
    expect(phased?.genotype).toBe('AG');
    expect(phased?.isPhased).toBe(true);
    expect(phased?.allele1).toBe('A');
    expect(phased?.allele2).toBe('G');
    expect(phased?.phaseSet).toBe('100');
  });

  it('should stream parse VCF with dot (.) IDs using dual coordinate allowlist keys', async () => {
    const vcfContent = `##fileformat=VCFv4.2
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE1
1\t500100\t.\tA\tC\t99\tPASS\t.\tGT\t0/1
2\t600200\t.\tG\tT\t99\tPASS\t.\tGT\t1/1
`;
    const file = new Blob([vcfContent]);
    const allowlist = new Set<string>(['chr1_500100', '2_600200']);

    const parsed = await parseRawDNAStream(file, allowlist);
    expect(parsed.snpCount).toBe(2);
    expect(parsed.snpMap['chr1_500100']).toBe('AC');
    expect(parsed.snpMap['chr2_600200']).toBe('TT');
  });

  it('should cleanly reject unsupported archive formats with structured error codes', () => {
    const sevenZipBytes = new Uint8Array([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c, 0x00]);
    expect(() => checkUnsupportedArchive(sevenZipBytes)).toThrow(/Unsupported 7-Zip/);

    const rarBytes = new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07]);
    expect(() => checkUnsupportedArchive(rarBytes)).toThrow(/Unsupported RAR/);
  });
});
