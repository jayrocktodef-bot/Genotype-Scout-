/**
 * WebWorker for extracting genotypes from PLINK .bed binary files
 */

// Bitwise PLINK BED mapping (SNP-major mode)
// 00: Homozygous for first allele (or missing)
// 01: Missing/Unknown
// 10: Heterozygous
// 11: Homozygous for second allele

self.onmessage = async (e: MessageEvent) => {
  const { bedBuffer, bimEntries, targetRsIds } = e.data;

  // 1. Build a fast lookup for rsIDs in the .bim data to find row indices
  const bimLookup = new Map<string, number>();
  bimEntries.forEach((entry: any, index: number) => {
    bimLookup.set(entry.rsid, index);
  });

  const results: Record<string, string> = {};

  // 2. Iterate through requested rsIDs
  for (const rsid of targetRsIds) {
    const rowIdx = bimLookup.get(rsid);
    if (rowIdx === undefined) continue;

    // 3. Jump to the correct byte in the .bed file (skipping 3-byte magic header)
    // In SNP-major Mode: Each SNP takes ceil(N / 4) bytes for N individuals
    // Since we are likely dealing with one individual (N=1), this formula simplifies to 1 byte per SNP.
    const byteOffset = 3 + rowIdx;
    const view = new Uint8Array(bedBuffer);
    const byte = view[byteOffset];
    
    // 4. Extract 2-bit genotype
    // Extracting bits 0-1 from the byte for the first individual
    const genotypeCode = (byte & 0x03); 
    
    results[rsid] = translateGenotype(genotypeCode);
  }

  self.postMessage({ results });
};

function translateGenotype(code: number): string {
  // Mapping based on typical PLINK interpretation
  // NOTE: This requires access to the bim file alleles to be accurate.
  // Returning raw codes for now to be safe.
  switch (code) {
    case 0: return "HOM_ALLELE1";
    case 1: return "MISSING";
    case 2: return "HET";
    case 3: return "HOM_ALLELE2";
    default: return "UNKNOWN";
  }
}
