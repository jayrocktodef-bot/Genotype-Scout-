/**
 * @license
 * Written In The Genome
 * Unit tests for BinaryReferenceService (GSR1 format)
 */

import { describe, it, expect } from 'vitest';
import {
  packAllelePair,
  unpackAllelePair,
  binarySearchPosition,
  encodeReferenceToBinary,
  decodeBinaryReference,
  queryMarkerByCoord,
  getChromosomeSlice,
  isValidBinaryReference,
  ReferenceMarkerInput,
} from './binaryReferenceService';

describe('BinaryReferenceService (GSR1)', () => {
  it('correctly packs and unpacks allele pairs into single bytes', () => {
    const pairs: [string, string][] = [
      ['A', 'C'],
      ['G', 'T'],
      ['A', 'G'],
      ['C', 'T'],
      ['I', 'D'],
      ['T', 'A'],
      ['0', '0'],
    ];

    for (const [ref, alt] of pairs) {
      const packed = packAllelePair(ref, alt);
      const [unpackedRef, unpackedAlt] = unpackAllelePair(packed);
      expect(unpackedRef).toBe(ref);
      expect(unpackedAlt).toBe(alt);
    }
  });

  it('performs accurate O(log N) binary search on sorted position arrays', () => {
    const positions = new Uint32Array([1000, 2500, 5000, 7500, 10000, 20000, 50000]);

    expect(binarySearchPosition(positions, 0, positions.length, 5000)).toBe(2);
    expect(binarySearchPosition(positions, 0, positions.length, 1000)).toBe(0);
    expect(binarySearchPosition(positions, 0, positions.length, 50000)).toBe(6);
    expect(binarySearchPosition(positions, 0, positions.length, 9999)).toBe(-1);
    expect(binarySearchPosition(positions, 0, positions.length, 100)).toBe(-1);
  });

  it('encodes and decodes multi-chromosome reference markers with 100% roundtrip fidelity', () => {
    const testMarkers: ReferenceMarkerInput[] = [
      { chr: '1', pos: 10500, refAllele: 'A', altAllele: 'G', weight: 0.85, populationIndex: 1 },
      { chr: '1', pos: 50000, refAllele: 'C', altAllele: 'T', weight: 1.25, populationIndex: 2 },
      { chr: '2', pos: 12000, refAllele: 'G', altAllele: 'A', weight: 0.50, populationIndex: 1 },
      { chr: 'X', pos: 30000, refAllele: 'T', altAllele: 'C', weight: 2.00, populationIndex: 3 },
      { chr: 'MT', pos: 16519, refAllele: 'T', altAllele: 'C', weight: 1.00, populationIndex: 4 },
    ];

    const buffer = encodeReferenceToBinary(testMarkers);
    expect(isValidBinaryReference(buffer)).toBe(true);
    expect(buffer.byteLength).toBeGreaterThan(48);

    const view = decodeBinaryReference(buffer);
    expect(view.header.totalMarkers).toBe(5);

    // Query markers across chromosomes
    const chr1Match = queryMarkerByCoord(view, '1', 50000);
    expect(chr1Match).not.toBeNull();
    expect(chr1Match?.refAllele).toBe('C');
    expect(chr1Match?.altAllele).toBe('T');
    expect(chr1Match?.weight).toBeCloseTo(1.25, 2);
    expect(chr1Match?.populationIndex).toBe(2);

    const xMatch = queryMarkerByCoord(view, 'X', 30000);
    expect(xMatch).not.toBeNull();
    expect(xMatch?.chr).toBe('X');
    expect(xMatch?.refAllele).toBe('T');
    expect(xMatch?.altAllele).toBe('C');

    const mtMatch = queryMarkerByCoord(view, 'MT', 16519);
    expect(mtMatch).not.toBeNull();
    expect(mtMatch?.chr).toBe('MT');
    expect(mtMatch?.refAllele).toBe('T');

    // Missing marker lookup
    const missing = queryMarkerByCoord(view, '1', 99999);
    expect(missing).toBeNull();
  });

  it('provides zero-copy chromosome slices for fast batch evaluation', () => {
    const testMarkers: ReferenceMarkerInput[] = [
      { chr: '1', pos: 100, refAllele: 'A', altAllele: 'G' },
      { chr: '1', pos: 200, refAllele: 'C', altAllele: 'T' },
      { chr: '1', pos: 300, refAllele: 'G', altAllele: 'A' },
      { chr: '2', pos: 500, refAllele: 'T', altAllele: 'C' },
    ];

    const buffer = encodeReferenceToBinary(testMarkers);
    const view = decodeBinaryReference(buffer);

    const chr1Slice = getChromosomeSlice(view, '1');
    expect(chr1Slice).not.toBeNull();
    expect(chr1Slice?.count).toBe(3);
    expect(Array.from(chr1Slice!.positions)).toEqual([100, 200, 300]);

    const chr2Slice = getChromosomeSlice(view, '2');
    expect(chr2Slice).not.toBeNull();
    expect(chr2Slice?.count).toBe(1);
    expect(chr2Slice!.positions[0]).toBe(500);

    const chr3Slice = getChromosomeSlice(view, '3');
    expect(chr3Slice).toBeNull();
  });

  it('rejects invalid or corrupted binary buffers', () => {
    const invalidBuffer = new ArrayBuffer(16);
    expect(isValidBinaryReference(invalidBuffer)).toBe(false);
    expect(() => decodeBinaryReference(invalidBuffer)).toThrow('Invalid GSR1 binary reference buffer signature');
  });
});
