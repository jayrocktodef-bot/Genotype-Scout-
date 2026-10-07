import { describe, it, expect } from 'vitest';
import { RohDetector } from './rohDetector';
import masterAims from '../../data/master_aims_normalized.json';
import { ParsedGenomicDataset } from '../../services/parser/types';

describe('RohDetector', () => {
  it('should detect a known homozygous stretch constructed from real panel markers', () => {
    // Construct synthetic case from real panel markers
    const allAims = Object.values(masterAims) as any[];
    
    // Pick markers from chr 1 to form a continuous stretch
    const chr1Aims = allAims
      .filter(a => a.chromosome === '1' || a.chromosome === 'chr1')
      .sort((a, b) => Number(a.position) - Number(b.position));

    // We need enough markers for a run (e.g., minSnps = 50)
    expect(chr1Aims.length).toBeGreaterThan(100);

    const snpMap: Record<string, string> = {};
    const snpMetaMap: Record<string, { chrom: string; pos: number }> = {};

    let expectedStart = 0;
    let expectedEnd = 0;

    // Create a 60-SNP homozygous run
    for (let i = 0; i < 60; i++) {
      const aim = chr1Aims[i];
      snpMap[aim.rsid] = 'AA'; // Homozygous
      snpMetaMap[aim.rsid] = { chrom: '1', pos: Number(aim.position) };
      if (i === 0) expectedStart = Number(aim.position);
      if (i === 59) expectedEnd = Number(aim.position);
    }

    // Add 40 heterozygous SNPs after it to break the run
    for (let i = 60; i < 100; i++) {
      const aim = chr1Aims[i];
      snpMap[aim.rsid] = 'AG'; // Heterozygous
      snpMetaMap[aim.rsid] = { chrom: '1', pos: Number(aim.position) };
    }

    const dataset = {
      format: 'Unknown',
      chip: 'Synthetic',
      build: 'GRCh38',
      totalSnps: 100,
      yDnaSnps: 0,
      yDnaCalledSnps: 0,
      mtDnaSnps: 0,
      inferredBiologicalSex: 'UNKNOWN',
      snpMap,
      snpMetaMap,
      xMap: {},
      yMap: {},
      mtMap: {},
      snpCount: 100,
      snpByRsid: {},
      snpByPosition: {},
      isPhased: false,
      phasingMethod: 'UNPHASED'
    } as ParsedGenomicDataset;

    const detector = new RohDetector({
      minLengthMb: 0.1, // extremely small for the test since we only took 60 SNPs
      minSnps: 50,
      maxGapMb: 100.0 // ignore gaps for this basic test
    });

    const result = detector.detect(dataset);

    expect(result.intervals.length).toBe(1);
    const run = result.intervals[0];

    expect(run.chrom).toBe('1');
    expect(run.snpCount).toBe(60);
    
    // Assert the detector recovers it within 10% of total ROH length
    const expectedLengthMb = (expectedEnd - expectedStart) / 1e6;
    expect(run.lengthMb).toBeCloseTo(expectedLengthMb, 1);
    
    expect(result.totalRohMb).toBe(run.lengthMb);
    expect(result.fRoh).toBeGreaterThan(0);
  });

  it('should return empty output for a negative control with no long ROH', () => {
    const allAims = Object.values(masterAims) as any[];
    const chr2Aims = allAims
      .filter(a => a.chromosome === '2' || a.chromosome === 'chr2')
      .sort((a, b) => Number(a.position) - Number(b.position))
      .slice(0, 100);

    const snpMap: Record<string, string> = {};
    const snpMetaMap: Record<string, { chrom: string; pos: number }> = {};

    // Alternate homozygous and heterozygous to prevent any runs
    for (let i = 0; i < chr2Aims.length; i++) {
      const aim = chr2Aims[i];
      snpMap[aim.rsid] = i % 2 === 0 ? 'AA' : 'AG';
      snpMetaMap[aim.rsid] = { chrom: '2', pos: Number(aim.position) };
    }

    const dataset = {
      format: 'Unknown',
      chip: 'Synthetic',
      build: 'GRCh38',
      totalSnps: 100,
      yDnaSnps: 0,
      yDnaCalledSnps: 0,
      mtDnaSnps: 0,
      inferredBiologicalSex: 'UNKNOWN',
      snpMap,
      snpMetaMap,
      xMap: {},
      yMap: {},
      mtMap: {},
      snpCount: 100,
      snpByRsid: {},
      snpByPosition: {},
      isPhased: false,
      phasingMethod: 'UNPHASED'
    } as ParsedGenomicDataset;

    const detector = new RohDetector({
      minLengthMb: 0.1,
      minSnps: 50
    });

    const result = detector.detect(dataset);

    expect(result.intervals).toEqual([]);
    expect(result.totalRohMb).toBe(0);
    expect(result.fRoh).toBe(0);
  });
});
