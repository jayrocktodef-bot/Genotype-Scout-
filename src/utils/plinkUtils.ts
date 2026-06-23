/**
 * Helper utilities for working with PLINK binary files.
 * Used by different workers to decode 2-bit genotype format.
 */

export function translateGenotype(code: number): string {
  // Mapping based on typical PLINK interpretation
  // 00: Homozygous for first allele
  // 01: Missing/Unknown
  // 10: Heterozygous
  // 11: Homozygous for second allele
  switch (code) {
    case 0: return "HOM_ALLELE1";
    case 1: return "MISSING";
    case 2: return "HET";
    case 3: return "HOM_ALLELE2";
    default: return "UNKNOWN";
  }
}

/**
 * Extracts a specific SNP genotype from a BED buffer.
 * Assumes SNP-major mode (1 byte per SNP for 1 individual).
 */
export function extractPlinkGenotype(bedBuffer: ArrayBuffer, rowIdx: number): string {
    const view = new Uint8Array(bedBuffer);
    // Skip 3-byte magic header, each SNP takes 1 byte in row-major for 1 individual
    const byteOffset = 3 + rowIdx;
    if (byteOffset >= view.length) return "UNKNOWN";
    
    const byte = view[byteOffset];
    const genotypeCode = (byte & 0x03); 
    
    return translateGenotype(genotypeCode);
}
