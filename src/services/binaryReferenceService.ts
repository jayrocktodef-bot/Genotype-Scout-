/**
 * @license
 * Written In The Genome
 * BinaryReferenceService (GSR1: Genotype Scout Reference Format v1)
 * High-performance binary typed array encoding and zero-copy query engine
 * for genomic reference datasets (AIMs, SNP indices, phylotree nodes).
 * 
 * Replaces multi-megabyte JSONs with flat ArrayBuffers, reducing memory usage by 10x-50x
 * and enabling instant O(log N) binary search on sorted Uint32 coordinate arrays.
 */

export const GSR1_MAGIC = 0x31525347; // "GSR1" in Little Endian (0x47, 0x53, 0x52, 0x31)
export const GSR1_VERSION = 1;

export const CHROMOSOME_MAP: Record<string, number> = {
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  '11': 11, '12': 12, '13': 13, '14': 14, '15': 15,
  '16': 16, '17': 17, '18': 18, '19': 19, '20': 20,
  '21': 21, '22': 22, 'X': 23, 'Y': 24, 'MT': 25, 'M': 25
};

export const REVERSE_CHROMOSOME_MAP: string[] = [
  'UNKNOWN',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', 'X', 'Y', 'MT'
];

export const NUCLEOTIDE_CODE: Record<string, number> = {
  'A': 0, 'C': 1, 'G': 2, 'T': 3, 'I': 4, 'D': 5, 'N': 6, '0': 7
};

export const REVERSE_NUCLEOTIDE_CODE: string[] = ['A', 'C', 'G', 'T', 'I', 'D', 'N', '0'];

export interface ReferenceMarkerInput {
  rsid?: string;
  chr: string | number;
  pos: number;
  refAllele: string;
  altAllele: string;
  weight?: number;
  populationIndex?: number;
}

export interface BinaryReferenceHeader {
  magic: number;
  version: number;
  flags: number;
  totalMarkers: number;
  chrTableOffset: number;
  positionsOffset: number;
  allelesOffset: number;
  weightsOffset: number;
  popIndicesOffset: number;
}

export interface ChromosomeIndexEntry {
  startIndex: number;
  count: number;
}

export interface BinaryReferenceView {
  header: BinaryReferenceHeader;
  chromosomeTable: ChromosomeIndexEntry[]; // indexed 1..25
  positions: Uint32Array;
  packedAlleles: Uint8Array;
  weights: Float32Array;
  popIndices: Uint8Array;
  rawBuffer: ArrayBuffer;
}

/**
 * Packs ref and alt alleles into a single uint8 byte
 * Upper 4 bits: ref allele (0..7), Lower 4 bits: alt allele (0..7)
 */
export function packAllelePair(ref: string, alt: string): number {
  const r = NUCLEOTIDE_CODE[ref.toUpperCase()] ?? 7;
  const a = NUCLEOTIDE_CODE[alt.toUpperCase()] ?? 7;
  return ((r & 0x0f) << 4) | (a & 0x0f);
}

/**
 * Unpacks a uint8 byte into [refAllele, altAllele]
 */
export function unpackAllelePair(byte: number): [string, string] {
  const r = (byte >> 4) & 0x0f;
  const a = byte & 0x0f;
  return [REVERSE_NUCLEOTIDE_CODE[r] || 'N', REVERSE_NUCLEOTIDE_CODE[a] || 'N'];
}

/**
 * Binary search for a specific genomic coordinate within a chromosome range.
 * Returns the global marker index if found, or -1 if not found.
 */
export function binarySearchPosition(
  positions: Uint32Array,
  startIndex: number,
  count: number,
  targetPos: number
): number {
  let low = startIndex;
  let high = startIndex + count - 1;

  while (low <= high) {
    const mid = (low + high) >>> 1;
    const midPos = positions[mid];
    if (midPos === targetPos) {
      return mid;
    } else if (midPos < targetPos) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}

/**
 * Validates whether an ArrayBuffer starts with valid GSR1 binary headers
 */
export function isValidBinaryReference(buffer: ArrayBuffer): boolean {
  if (!buffer || buffer.byteLength < 48) return false;
  const view = new DataView(buffer);
  const magic = view.getUint32(0, true);
  const version = view.getUint16(4, true);
  return magic === GSR1_MAGIC && version === GSR1_VERSION;
}

/**
 * Encodes an array of genomic reference markers into a compact GSR1 ArrayBuffer
 */
export function encodeReferenceToBinary(markers: ReferenceMarkerInput[]): ArrayBuffer {
  // 1. Sort markers by Chromosome ID (1..25), then position
  const sorted = [...markers].sort((a, b) => {
    const chrA = typeof a.chr === 'number' ? a.chr : (CHROMOSOME_MAP[String(a.chr).toUpperCase()] || 99);
    const chrB = typeof b.chr === 'number' ? b.chr : (CHROMOSOME_MAP[String(b.chr).toUpperCase()] || 99);
    if (chrA !== chrB) return chrA - chrB;
    return a.pos - b.pos;
  });

  const totalMarkers = sorted.length;
  const numChromosomes = 26; // 0..25

  // Calculate layout offsets
  // Header: 48 bytes
  const headerSize = 48;
  // Chromosome table: 26 entries * 8 bytes (startIndex uint32 + count uint32) = 208 bytes
  const chrTableSize = numChromosomes * 8;
  const chrTableOffset = headerSize;

  // Positions: totalMarkers * 4 bytes
  const positionsOffset = chrTableOffset + chrTableSize;
  const positionsSize = totalMarkers * 4;

  // Packed Alleles: totalMarkers * 1 byte
  const allelesOffset = positionsOffset + positionsSize;
  const allelesSize = totalMarkers * 1;

  // Weights (Float32): totalMarkers * 4 bytes (aligned to 4 bytes)
  const weightsOffset = (allelesOffset + allelesSize + 3) & ~3;
  const weightsSize = totalMarkers * 4;

  // Population Indices: totalMarkers * 1 byte
  const popIndicesOffset = weightsOffset + weightsSize;
  const popIndicesSize = totalMarkers * 1;

  // Total buffer length aligned to 8 bytes
  const totalLength = (popIndicesOffset + popIndicesSize + 7) & ~7;
  const buffer = new ArrayBuffer(totalLength);
  const dataView = new DataView(buffer);

  // Write Header
  dataView.setUint32(0, GSR1_MAGIC, true);
  dataView.setUint16(4, GSR1_VERSION, true);
  dataView.setUint16(6, 0, true); // flags
  dataView.setUint32(8, totalMarkers, true);
  dataView.setUint32(12, chrTableOffset, true);
  dataView.setUint32(16, positionsOffset, true);
  dataView.setUint32(20, allelesOffset, true);
  dataView.setUint32(24, weightsOffset, true);
  dataView.setUint32(28, popIndicesOffset, true);

  // Typed array views into target buffer
  const positionsArray = new Uint32Array(buffer, positionsOffset, totalMarkers);
  const allelesArray = new Uint8Array(buffer, allelesOffset, totalMarkers);
  const weightsArray = new Float32Array(buffer, weightsOffset, totalMarkers);
  const popIndicesArray = new Uint8Array(buffer, popIndicesOffset, totalMarkers);

  // Populate Chromosome index table and arrays
  const chrCounts: number[] = new Array(numChromosomes).fill(0);
  const chrStarts: number[] = new Array(numChromosomes).fill(0);

  // Find start and count for each chromosome
  let currentChr = -1;
  for (let i = 0; i < totalMarkers; i++) {
    const m = sorted[i];
    const c = typeof m.chr === 'number' ? m.chr : (CHROMOSOME_MAP[String(m.chr).toUpperCase()] || 0);
    const validChr = (c >= 1 && c <= 25) ? c : 0;

    if (validChr !== currentChr) {
      currentChr = validChr;
      chrStarts[currentChr] = i;
    }
    chrCounts[currentChr]++;

    positionsArray[i] = m.pos >>> 0;
    allelesArray[i] = packAllelePair(m.refAllele, m.altAllele);
    weightsArray[i] = m.weight !== undefined ? m.weight : 1.0;
    popIndicesArray[i] = m.populationIndex !== undefined ? (m.populationIndex & 0xff) : 0;
  }

  // Write Chromosome Table
  for (let c = 0; c < numChromosomes; c++) {
    const entryOffset = chrTableOffset + (c * 8);
    dataView.setUint32(entryOffset, chrStarts[c], true);
    dataView.setUint32(entryOffset + 4, chrCounts[c], true);
  }

  return buffer;
}

/**
 * Decodes a GSR1 binary ArrayBuffer into a zero-copy typed view
 */
export function decodeBinaryReference(buffer: ArrayBuffer): BinaryReferenceView {
  if (!isValidBinaryReference(buffer)) {
    throw new Error('[BinaryReferenceService] Invalid GSR1 binary reference buffer signature.');
  }

  const dataView = new DataView(buffer);
  const magic = dataView.getUint32(0, true);
  const version = dataView.getUint16(4, true);
  const flags = dataView.getUint16(6, true);
  const totalMarkers = dataView.getUint32(8, true);
  const chrTableOffset = dataView.getUint32(12, true);
  const positionsOffset = dataView.getUint32(16, true);
  const allelesOffset = dataView.getUint32(20, true);
  const weightsOffset = dataView.getUint32(24, true);
  const popIndicesOffset = dataView.getUint32(28, true);

  const header: BinaryReferenceHeader = {
    magic,
    version,
    flags,
    totalMarkers,
    chrTableOffset,
    positionsOffset,
    allelesOffset,
    weightsOffset,
    popIndicesOffset,
  };

  // Decode Chromosome Table (26 entries)
  const chromosomeTable: ChromosomeIndexEntry[] = [];
  for (let c = 0; c < 26; c++) {
    const entryOffset = chrTableOffset + (c * 8);
    chromosomeTable.push({
      startIndex: dataView.getUint32(entryOffset, true),
      count: dataView.getUint32(entryOffset + 4, true),
    });
  }

  // Zero-copy typed array views directly mapping into buffer memory
  const positions = new Uint32Array(buffer, positionsOffset, totalMarkers);
  const packedAlleles = new Uint8Array(buffer, allelesOffset, totalMarkers);
  const weights = new Float32Array(buffer, weightsOffset, totalMarkers);
  const popIndices = new Uint8Array(buffer, popIndicesOffset, totalMarkers);

  return {
    header,
    chromosomeTable,
    positions,
    packedAlleles,
    weights,
    popIndices,
    rawBuffer: buffer,
  };
}

/**
 * Fast lookup of a marker by chromosome and coordinate using O(log N) binary search
 */
export function queryMarkerByCoord(
  view: BinaryReferenceView,
  chr: string | number,
  pos: number
): {
  index: number;
  chr: string;
  pos: number;
  refAllele: string;
  altAllele: string;
  weight: number;
  populationIndex: number;
} | null {
  const chrNum = typeof chr === 'number' ? chr : (CHROMOSOME_MAP[String(chr).toUpperCase()] || 0);
  if (chrNum < 1 || chrNum > 25) return null;

  const entry = view.chromosomeTable[chrNum];
  if (!entry || entry.count === 0) return null;

  const markerIdx = binarySearchPosition(view.positions, entry.startIndex, entry.count, pos);
  if (markerIdx === -1) return null;

  const [refAllele, altAllele] = unpackAllelePair(view.packedAlleles[markerIdx]);

  return {
    index: markerIdx,
    chr: REVERSE_CHROMOSOME_MAP[chrNum],
    pos: view.positions[markerIdx],
    refAllele,
    altAllele,
    weight: view.weights[markerIdx],
    populationIndex: view.popIndices[markerIdx],
  };
}

/**
 * Returns a typed slice view of all markers for a specific chromosome
 */
export function getChromosomeSlice(
  view: BinaryReferenceView,
  chr: string | number
): {
  startIndex: number;
  count: number;
  positions: Uint32Array;
  packedAlleles: Uint8Array;
  weights: Float32Array;
  popIndices: Uint8Array;
} | null {
  const chrNum = typeof chr === 'number' ? chr : (CHROMOSOME_MAP[String(chr).toUpperCase()] || 0);
  if (chrNum < 1 || chrNum > 25) return null;

  const entry = view.chromosomeTable[chrNum];
  if (!entry || entry.count === 0) return null;

  return {
    startIndex: entry.startIndex,
    count: entry.count,
    positions: view.positions.subarray(entry.startIndex, entry.startIndex + entry.count),
    packedAlleles: view.packedAlleles.subarray(entry.startIndex, entry.startIndex + entry.count),
    weights: view.weights.subarray(entry.startIndex, entry.startIndex + entry.count),
    popIndices: view.popIndices.subarray(entry.startIndex, entry.startIndex + entry.count),
  };
}
