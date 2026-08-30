import { gunzipSync, unzipSync } from 'fflate';

// ── Module-level constants (allocated once) ──────────────────────────
const VALID_BASE_CODES = new Set([
  65/*A*/, 67/*C*/, 71/*G*/, 84/*T*/, 68/*D*/, 73/*I*/, 78/*N*/, 45/*-*/
]);

const TAB = 0x09;
const LF = 0x0A;
const CR = 0x0D;
const HASH = 0x23;
const QUOTE = 0x22;
const SPACE = 0x20;
const COMMA = 0x2C;
const SEMICOLON = 0x3B;
const DECODER = new TextDecoder('utf-8');

/**
 * Automatically inspects magic bytes and decompresses GZIP (\x1f\x8b) or ZIP (PK\x03\x04) buffers.
 * Selects the primary genetic data file (.txt, .csv, .vcf, .tsv, .dat) case-insensitively.
 * Strips UTF-8 BOM (\xef\xbb\xbf) if present.
 */
export function decompressGenomicBuffer(buf: Uint8Array): Uint8Array {
  if (!buf || buf.length < 4) return buf;

  let result = buf;

  // 1. Check for GZIP magic bytes (\x1f\x8b)
  if (buf[0] === 0x1f && buf[1] === 0x8b) {
    try {
      result = gunzipSync(buf);
    } catch (e) {
      console.warn("fflate gunzipSync warning:", e);
      result = buf;
    }
  }

  // 2. Check for ZIP magic bytes (PK\x03\x04, PK\x05\x06, PK\x07\x08)
  else if (buf[0] === 0x50 && buf[1] === 0x4b && (buf[2] === 0x03 || buf[2] === 0x05 || buf[2] === 0x07)) {
    try {
      const unzipped = unzipSync(buf);
      const fileKeys = Object.keys(unzipped).filter(k => {
        const lower = k.toLowerCase();
        return !lower.startsWith('__macosx/') &&
               !lower.includes('.ds_store') &&
               !lower.endsWith('/') &&
               !lower.endsWith('.pdf') &&
               !lower.endsWith('.html') &&
               !lower.endsWith('.png') &&
               !lower.endsWith('.jpg');
      });

      if (fileKeys.length > 0) {
        fileKeys.sort((a, b) => {
          const score = (key: string) => {
            const l = key.toLowerCase();
            let s = 0;
            if (l.endsWith('.vcf') || l.endsWith('.vcf.gz')) s += 100;
            if (l.endsWith('.txt') || l.endsWith('.txt.gz')) s += 90;
            if (l.endsWith('.csv') || l.endsWith('.csv.gz')) s += 80;
            if (l.endsWith('.tsv') || l.endsWith('.tsv.gz')) s += 70;
            if (l.endsWith('.dat')) s += 60;
            if (l.includes('genome') || l.includes('dna') || l.includes('ancestry') || l.includes('23andme') || l.includes('myheritage') || l.includes('ftdna') || l.includes('livingdna')) s += 30;
            return s;
          };
          return score(b) - score(a);
        });

        let innerBuffer = unzipped[fileKeys[0]];
        if (innerBuffer.length >= 2 && innerBuffer[0] === 0x1f && innerBuffer[1] === 0x8b) {
          innerBuffer = gunzipSync(innerBuffer);
        }
        result = innerBuffer;
      }
    } catch (e) {
      console.warn("fflate unzipSync warning:", e);
      result = buf;
    }
  }

  // 3. Strip UTF-8 BOM (\xef\xbb\xbf)
  if (result.length >= 3 && result[0] === 0xef && result[1] === 0xbb && result[2] === 0xbf) {
    result = result.subarray(3);
  }

  return result;
}

/**
 * Standardize chromosome identifier across all commercial formats.
 * Maps AncestryDNA chr23->X, chr24->Y, chr25->X (PAR), chr26->MT.
 */
export function normalizeChromosome(chromRaw: string): string {
  let chrom = chromRaw.trim().toUpperCase();
  if (chrom.startsWith('CHR')) chrom = chrom.slice(3);
  if (chrom === '23' || chrom === 'X') return 'X';
  if (chrom === '24' || chrom === 'Y') return 'Y';
  // AncestryDNA uses '25' for the Pseudoautosomal Region (PAR) on X; also handle 'PAR' and 'XY'
  if (chrom === '25' || chrom === 'PAR' || chrom === 'XY') return 'X';
  if (chrom === '26' || chrom === 'M' || chrom === 'MT' || chrom === 'MITO' || chrom === 'MITOCHONDRIAL') return 'MT';
  if (chrom === '0' || chrom === 'UN' || chrom === 'UNKNOWN') return 'UN';
  return chrom;
}

/**
 * Validate and clean genotype string.
 * Handles split alleles, slashes, indels (I/D, +/-), and alphabetical sorting.
 */
export function isValidGenotype(genotype: string): boolean {
  if (!genotype) return false;
  const g = genotype.trim().toUpperCase().replace(/["'\s\/|_]/g, '');
  if (g === '--' || g === '__' || g === '00' || g === '??' || g === './.' || g === '.|.' || g === '-' || g === '.' || g === '0' || g === 'NA' || g === 'NN' || g === 'NULL') {
    return false;
  }
  const len = g.length;
  if (len === 0 || len > 2) return false;
  if (!VALID_BASE_CODES.has(g.charCodeAt(0))) return false;
  if (len === 2 && !VALID_BASE_CODES.has(g.charCodeAt(1))) return false;
  return true;
}

export function cleanGenotypeString(rawGenotype: string): string | null {
  if (!rawGenotype) return null;
  let g = rawGenotype.trim().toUpperCase().replace(/["'\s\/|_]/g, '');
  if (g === '--' || g === '__' || g === '00' || g === '??' || g === './.' || g === '.|.' || g === '-' || g === '.' || g === '0' || g === 'NA' || g === 'NN' || g === 'NULL') {
    return null;
  }
  // Convert '+' and '-' indel notations to I / D
  if (g === '++') g = 'II';
  else if (g === '+-') g = 'ID';
  else if (g === '-+') g = 'ID';
  else if (g === '+') g = 'I';

  // Ancestry-specific "0" cleaning (e.g. 'A0' -> 'A')
  if (g.length === 2 && g.includes('0')) {
    g = g.replace(/0/g, '');
  }

  const len = g.length;
  if (len === 0 || len > 2) return null;
  if (!VALID_BASE_CODES.has(g.charCodeAt(0))) return null;
  if (len === 2 && !VALID_BASE_CODES.has(g.charCodeAt(1))) return null;

  // Sort SNP alleles alphabetically to be position independent (e.g. TC -> CT) unless indels
  if (len === 2 && g[0] !== 'I' && g[0] !== 'D' && g[1] !== 'I' && g[1] !== 'D') {
    if (g.charCodeAt(0) > g.charCodeAt(1)) {
      g = g[1] + g[0];
    }
  }

  return g;
}

interface ParsedFields {
  markerId: string;  // already lowercased
  chrom: string;     // already normalized uppercase
  posStr: string;
  pos: number;
  genotype: string;  // already normalized uppercase
}

export interface ColumnMapping {
  rsidIdx: number;
  chromIdx: number;
  posIdx: number;
  gtIdx: number;
  allele1Idx: number;
  allele2Idx: number;
  hasSplitAlleles: boolean;
  isCustom: boolean;
}

/**
 * Adaptive column detector for headers across all commercial vendors.
 * Detects standard formats as well as TellmeGen, 24Genetics, Spanish/Russian vendor formats.
 */
export function detectHeaderColumns(headerLine: string, delim: string): ColumnMapping | null {
  const rawTokens = headerLine.replace(/^#+/, '').replace(/"/g, '').split(delim).map(t => t.trim().toLowerCase());
  if (rawTokens.length < 3) return null;

  let rsidIdx = -1;
  let chromIdx = -1;
  let posIdx = -1;
  let gtIdx = -1;
  let allele1Idx = -1;
  let allele2Idx = -1;

  for (let i = 0; i < rawTokens.length; i++) {
    const t = rawTokens[i];
    if (t === 'rsid' || t === 'marker' || t === 'snp' || t === 'id' || t === 'name' || t === 'probe set id' || t === 'dbsnp rs id' || t === 'probeset' || t === 'marker_id' || t === 'snp_name' || t === 'markername') {
      if (rsidIdx === -1) rsidIdx = i;
    } else if (t === 'chromosome' || t === 'chrom' || t === 'chr' || t === 'chromosome_name' || t === 'chr_name') {
      if (chromIdx === -1) chromIdx = i;
    } else if (t === 'position' || t === 'pos' || t === 'physical position' || t === 'coordinate' || t === 'phys_pos' || t === 'location' || t === 'chr_pos') {
      if (posIdx === -1) posIdx = i;
    } else if (t === 'genotype' || t === 'result' || t === 'call' || t === 'gt' || t === 'genotype_call' || t === 'alleles') {
      if (gtIdx === -1) gtIdx = i;
    } else if (t === 'allele1' || t === 'allele 1' || t === 'allele1 - top' || t === 'allele1_top' || t === 'a1' || t === 'allele_1') {
      if (allele1Idx === -1) allele1Idx = i;
    } else if (t === 'allele2' || t === 'allele 2' || t === 'allele2 - top' || t === 'allele2_top' || t === 'a2' || t === 'allele_2') {
      if (allele2Idx === -1) allele2Idx = i;
    }
  }

  const hasSplit = allele1Idx !== -1 && allele2Idx !== -1;
  const isCustom = rsidIdx !== 0 || chromIdx !== 1 || posIdx !== 2 || (hasSplit ? (allele1Idx !== 3 || allele2Idx !== 4) : (gtIdx !== 3 && gtIdx !== -1));

  if (chromIdx !== -1 && posIdx !== -1 && (gtIdx !== -1 || hasSplit || rsidIdx !== -1)) {
    return {
      rsidIdx: rsidIdx !== -1 ? rsidIdx : 0,
      chromIdx,
      posIdx,
      gtIdx: gtIdx !== -1 ? gtIdx : 3,
      allele1Idx: allele1Idx !== -1 ? allele1Idx : 3,
      allele2Idx: allele2Idx !== -1 ? allele2Idx : 4,
      hasSplitAlleles: hasSplit,
      isCustom
    };
  }

  return null;
}

function parseAdaptiveLine(line: string, delimStr: string, mapping: ColumnMapping): ParsedFields | null {
  const parts = line.split(delimStr);
  if (parts.length <= Math.max(mapping.chromIdx, mapping.posIdx)) return null;

  const stripQ = (s: string) => {
    let res = s.trim();
    if (res.charCodeAt(0) === QUOTE) res = res.substring(1);
    if (res.length > 0 && res.charCodeAt(res.length - 1) === QUOTE) res = res.substring(0, res.length - 1);
    return res.trim();
  };

  const rawChrom = mapping.chromIdx < parts.length ? stripQ(parts[mapping.chromIdx]) : '';
  const rawPos = mapping.posIdx < parts.length ? stripQ(parts[mapping.posIdx]) : '';
  if (!rawChrom || !rawPos) return null;

  const pos = parseInt(rawPos, 10);
  if (isNaN(pos)) return null;

  let rawGenotype = '';
  if (mapping.hasSplitAlleles && mapping.allele1Idx < parts.length && mapping.allele2Idx < parts.length) {
    const a1 = stripQ(parts[mapping.allele1Idx]);
    const a2 = stripQ(parts[mapping.allele2Idx]);
    if (a1 && a2 && a1 !== '0' && a2 !== '0' && a1 !== '-' && a2 !== '-') {
      rawGenotype = a1 + a2;
    } else if (a1 && a1 !== '0' && a1 !== '-') {
      rawGenotype = a1;
    }
  } else if (mapping.gtIdx < parts.length) {
    rawGenotype = stripQ(parts[mapping.gtIdx]);
  }

  const genotype = cleanGenotypeString(rawGenotype);
  if (!genotype) return null;

  const chrom = normalizeChromosome(rawChrom);
  let rawMarker = mapping.rsidIdx < parts.length ? stripQ(parts[mapping.rsidIdx]).toLowerCase() : '';
  if (!rawMarker || rawMarker === '.' || rawMarker === '-') {
    rawMarker = `chr${chrom}_${pos}`.toLowerCase();
  }

  return {
    markerId: rawMarker,
    chrom,
    posStr: String(pos),
    pos,
    genotype
  };
}

function parseLineBytes(buf: Uint8Array, start: number, end: number, delimByte: number): ParsedFields | null {
  // Strip trailing CR if present
  let logicalEnd = end;
  if (logicalEnd > start && buf[logicalEnd - 1] === CR) logicalEnd--;

  // Field 0: rsID (raw byte range after quote stripping)
  let f0DataStart = start;
  let p = f0DataStart;
  while (p < logicalEnd && buf[p] !== delimByte) p++;
  if (p === logicalEnd) return null;
  let f0RawEnd = p;

  if (f0DataStart < f0RawEnd && buf[f0DataStart] === QUOTE) f0DataStart++;
  if (f0RawEnd > f0DataStart && buf[f0RawEnd - 1] === QUOTE) f0RawEnd--;
  const f0Len = f0RawEnd - f0DataStart;

  if (f0Len > 0) {
    const c0 = buf[f0DataStart];
    if (c0 === HASH) return null;
    const f0Str = DECODER.decode(buf.subarray(f0DataStart, f0RawEnd)).toLowerCase();
    if (f0Str === 'rsid' || f0Str === 'marker' || f0Str === 'name' || f0Str === 'id' || f0Str === 'chrom' || f0Str === 'chromosome' || f0Str === 'snp') return null;
  } else {
    if (start < f0RawEnd && buf[start] !== QUOTE) return null;
  }

  // Field 1: chromosome
  let f1RawStart = f0RawEnd + 1;
  while (f1RawStart < logicalEnd && buf[f1RawStart] === delimByte) f1RawStart++;
  p = f1RawStart;
  while (p < logicalEnd && buf[p] !== delimByte) p++;
  if (p === logicalEnd) return null;
  let f1RawEnd = p;

  let f1DataStart = f1RawStart;
  let f1DataEnd = f1RawEnd;
  if (f1DataStart < f1DataEnd && buf[f1DataStart] === QUOTE) f1DataStart++;
  if (f1DataEnd > f1DataStart && buf[f1DataEnd - 1] === QUOTE) f1DataEnd--;

  // Field 2: position
  let f2RawStart = f1RawEnd + 1;
  while (f2RawStart < logicalEnd && buf[f2RawStart] === delimByte) f2RawStart++;
  p = f2RawStart;
  while (p < logicalEnd && buf[p] !== delimByte) p++;
  let f2RawEnd = p;

  let f2DataStart = f2RawStart;
  let f2DataEnd = f2RawEnd;
  if (f2DataStart < f2DataEnd && buf[f2DataStart] === QUOTE) f2DataStart++;
  if (f2DataEnd > f2DataStart && buf[f2DataEnd - 1] === QUOTE) f2DataEnd--;

  let pos = 0;
  for (let i = f2DataStart; i < f2DataEnd; i++) {
    const byte = buf[i];
    if (byte >= 0x30 && byte <= 0x39) {
      pos = pos * 10 + (byte - 0x30);
    } else {
      return null;
    }
  }

  // Field 3: genotype
  let f3RawStart = f2RawEnd < logicalEnd ? f2RawEnd + 1 : f2RawEnd;
  while (f3RawStart < logicalEnd && buf[f3RawStart] === delimByte) f3RawStart++;
  p = f3RawStart;
  while (p < logicalEnd && buf[p] !== delimByte) p++;
  let f3RawEnd = p;

  let f3DataStart = f3RawStart;
  let f3DataEnd = f3RawEnd;
  if (f3DataStart < f3DataEnd && buf[f3DataStart] === QUOTE) f3DataStart++;
  if (f3DataEnd > f3DataStart && buf[f3DataEnd - 1] === QUOTE) f3DataEnd--;

  const allele1Len = f3DataEnd - f3DataStart;
  let allele1Byte = 0;
  let allele2Byte = 0;
  let hasSecondAllele = false;

  if (allele1Len === 1) {
    allele1Byte = buf[f3DataStart];
    if (f3RawEnd < logicalEnd) {
      let s2 = f3RawEnd + 1;
      while (s2 < logicalEnd && (buf[s2] === delimByte || buf[s2] === SPACE)) s2++;
      let e2 = s2;
      while (e2 < logicalEnd && buf[e2] !== delimByte) e2++;

      let a2dStart = s2;
      let a2dEnd = e2;
      if (a2dStart < a2dEnd && buf[a2dStart] === QUOTE) a2dStart++;
      if (a2dEnd > a2dStart && buf[a2dEnd - 1] === QUOTE) a2dEnd--;

      if (a2dEnd - a2dStart === 1) {
        allele2Byte = buf[a2dStart];
        hasSecondAllele = true;
      }
    }
  } else if (allele1Len === 2) {
    allele1Byte = buf[f3DataStart];
    allele2Byte = buf[f3DataStart + 1];
    hasSecondAllele = true;
  } else if (allele1Len !== 0) {
    return null;
  }

  const upper = (b: number) => b >= 0x61 && b <= 0x7a ? b - 0x20 : b;
  let genotype = '';
  let valid = true;

  if (allele1Len === 1 || allele1Len === 2) {
    const b = upper(allele1Byte);
    if (b !== 0x30) {
      if (!(b === 0x41 || b === 0x43 || b === 0x47 || b === 0x54 || b === 0x49 || b === 0x44 || b === 0x2D)) {
        valid = false;
      } else {
        genotype = String.fromCharCode(b);
      }
    }
  }

  if (valid && hasSecondAllele) {
    const b2 = upper(allele2Byte);
    if (b2 !== 0x30) {
      if (!(b2 === 0x41 || b2 === 0x43 || b2 === 0x47 || b2 === 0x54 || b2 === 0x49 || b2 === 0x44 || b2 === 0x2D)) {
        valid = false;
      } else {
        genotype += String.fromCharCode(b2);
      }
    }
  }

  if (!valid || genotype.length === 0 || genotype.length > 2) return null;

  if (genotype.length === 2 && genotype[0] !== 'I' && genotype[0] !== 'D' && genotype[1] !== 'I' && genotype[1] !== 'D') {
    if (genotype.charCodeAt(0) > genotype.charCodeAt(1)) {
      genotype = genotype[1] + genotype[0];
    }
  }

  const chromRaw = DECODER.decode(buf.subarray(f1DataStart, f1DataEnd));
  const chrom = normalizeChromosome(chromRaw);

  const markerIdRaw = DECODER.decode(buf.subarray(f0DataStart, f0RawEnd)).toLowerCase();
  const rawMarkerId = markerIdRaw && markerIdRaw !== '.' && markerIdRaw !== '-' ? markerIdRaw : `chr${chrom}_${pos}`.toLowerCase();

  return {
    markerId: rawMarkerId,
    chrom,
    posStr: String(pos),
    pos,
    genotype
  };
}

function fastParseLine(line: string, delim: number, delimStr: string): ParsedFields | null {
  // Field 0: rsID / marker ID
  let start = 0;
  let end = line.indexOf(delimStr, start);
  if (end === -1) return null;
  let field0 = line.substring(start, end);
  // Strip quotes
  if (field0.charCodeAt(0) === QUOTE) field0 = field0.substring(1);
  if (field0.length > 0 && field0.charCodeAt(field0.length - 1) === QUOTE) field0 = field0.substring(0, field0.length - 1);
  if (!field0 || field0.length === 0) return null;
  const f0Lower = field0.toLowerCase();
  if (f0Lower === 'rsid' || f0Lower === 'marker' || f0Lower === 'name' || f0Lower === 'id' || f0Lower === 'chrom' || f0Lower === 'chromosome' || f0Lower.startsWith('#')) return null;

  // Field 1: chromosome
  start = end + 1;
  while (start < line.length && line.charCodeAt(start) === delim) start++;
  end = line.indexOf(delimStr, start);
  if (end === -1) return null;
  let field1 = line.substring(start, end);
  if (field1.charCodeAt(0) === QUOTE) field1 = field1.substring(1);
  if (field1.length > 0 && field1.charCodeAt(field1.length - 1) === QUOTE) field1 = field1.substring(0, field1.length - 1);

  // Field 2: position
  start = end + 1;
  while (start < line.length && line.charCodeAt(start) === delim) start++;
  end = line.indexOf(delimStr, start);
  if (end === -1) end = line.length;
  let field2 = line.substring(start, end);
  if (field2.charCodeAt(0) === QUOTE) field2 = field2.substring(1);
  if (field2.length > 0 && field2.charCodeAt(field2.length - 1) === QUOTE) field2 = field2.substring(0, field2.length - 1);

  // Field 3+: genotype (may be 1 field "AG" or 2 fields "A" "G")
  start = end < line.length ? end + 1 : end;
  while (start < line.length && line.charCodeAt(start) === delim) start++;
  let genoEnd = line.indexOf(delimStr, start);
  if (genoEnd === -1) genoEnd = line.length;
  let field3 = line.substring(start, genoEnd);
  if (field3.charCodeAt(0) === QUOTE) field3 = field3.substring(1);
  if (field3.length > 0 && field3.charCodeAt(field3.length - 1) === QUOTE) field3 = field3.substring(0, field3.length - 1);

  let rawGenotype = field3;

  // Check for split alleles (AncestryDNA: "A\tG" → "AG")
  if (rawGenotype.length === 1 && genoEnd < line.length) {
    let s2 = genoEnd + 1;
    while (s2 < line.length && line.charCodeAt(s2) === delim) s2++;
    let e2 = line.indexOf(delimStr, s2);
    if (e2 === -1) e2 = line.length;
    let allele2 = line.substring(s2, e2);
    if (allele2.charCodeAt(0) === QUOTE) allele2 = allele2.substring(1);
    if (allele2.length > 0 && allele2.charCodeAt(allele2.length - 1) === QUOTE) allele2 = allele2.substring(0, allele2.length - 1);
    if (allele2.length === 1) {
      rawGenotype += allele2;
    }
  }

  const genotype = cleanGenotypeString(rawGenotype);
  if (!genotype) return null;

  const chrom = normalizeChromosome(field1);
  let rawMarkerId = field0.toLowerCase();
  if (!rawMarkerId || rawMarkerId === '.' || rawMarkerId === '-') {
    rawMarkerId = `chr${chrom}_${field2}`.toLowerCase();
  }

  return {
    markerId: rawMarkerId,
    chrom,
    posStr: field2,
    pos: parseInt(field2, 10),
    genotype
  };
}

export interface GenomicsParseErrorDetails {
  format?: string;
  chip?: string;
  bytesTotal?: number;
  linesTotal?: number;
  linesCommented?: number;
  linesMalformed?: number;
  headerPreview?: string;
  errorCategory?: string;
  suggestedSolution?: string;
  errorCode?: string;
}

export class GenomicsParseError extends Error {
  details: GenomicsParseErrorDetails;

  constructor(message: string, details: GenomicsParseErrorDetails) {
    super(message);
    this.name = "GenomicsParseError";
    this.details = details;
  }
}

export function checkFileFormatHealth(text: string): { healthy: boolean; reason?: string; category?: string; solution?: string } {
  if (!text || text.trim().length === 0) {
    return {
      healthy: false,
      category: "Empty Document",
      reason: "This file is completely empty.",
      solution: "Please check your DNA data export; it should be between 5MB and 45MB in size."
    };
  }
  
  const header = text.slice(0, 5000);

  // 1. Check for PDF
  if (header.startsWith("%PDF")) {
    return {
      healthy: false,
      category: "PDF Binary Document",
      reason: "The file is an Adobe PDF format report, not raw DNA text data.",
      solution: "Please upload the original raw data text download from your provider. Visual reports or PDFs cannot be processed by bioinformatics tools."
    };
  }

  // 2. Check for HTML
  if (header.trim().toLowerCase().startsWith("<!doctype html") || header.includes("<html") || header.includes("<head") || header.includes("schema.org")) {
    return {
      healthy: false,
      category: "HTML Webpage Page",
      reason: "The file is an HTML webpage, not raw DNA text data.",
      solution: "It look like you may have saved the vendor dashboard page using 'Save Page As'. Go back to your DNA provider, navigate to 'Settings / Download Raw Data', and request the real data download."
    };
  }

  // 3. Check for Excel or formats
  if (header.includes("workbook") || header.includes("<workbook") || header.includes("xmlns:o=\"urn:schemas-microsoft-com:office")) {
    return {
      healthy: false,
      category: "Excel Spreadsheet Format",
      reason: "The file is an Excel document or Microsoft Office XML representation.",
      solution: "Please export your spreadsheet or workbook into an ASCII/UTF-8 Tab-delimited plain text file (.txt or .csv) and try uploading again."
    };
  }

  // 4. Binary scan - excessive non-printable characters or null bytes
  let binaryCharCount = 0;
  const testLimit = Math.min(text.length, 1000);
  for (let i = 0; i < testLimit; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode === 0 || (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13)) {
      binaryCharCount++;
    }
  }
  if (binaryCharCount > 15) {
    return {
      healthy: false,
      category: "Non-Text Binary Format (BAM/CRAM/BCF)",
      reason: "The file contains non-text binary characters. Our browser-side consumer engine expects processed 23andMe standard text representation.",
      solution: "Please convert your BAM or FastQ sequence alignment data into 23andMe or AncestryDNA tab-delimited SNP format before analysis."
    };
  }

  return { healthy: true };
}

export function isPARRegion(chrom: string, pos: number): boolean {
  if (chrom !== 'X' && chrom !== '23' && chrom !== '25' && chrom !== 'PAR') return false;
  if (pos >= 10001 && pos <= 2781479) return true; // PAR1 (GRCh37/38)
  if (pos >= 154931044 && pos <= 156030895) return true; // PAR2 (GRCh37/38)
  return false;
}

export function parseRawDNA(
  rawText: string, 
  allowlist?: Set<string>,
  onProgress?: (bytesProcessed: number, totalBytes: number, snpsFound: number) => void
) {
  let text = rawText;
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  const snpMap: Record<string, string> = {};
  const snpMetaMap: Record<string, { chrom: string, pos: number }> = {};
  const xMap: Record<string, string> = {};
  const yMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  let format = "Unknown";
  let chip = "Unknown Chip";
  let snpCount = 0;
  
  const header = text.slice(0, 1000);
  
  const health = checkFileFormatHealth(text);
  if (!health.healthy) {
    throw new GenomicsParseError(health.reason || "Invalid file format", {
      headerPreview: header.slice(0, 300),
      errorCategory: health.category,
      suggestedSolution: health.solution,
      bytesTotal: text.length
    });
  }

  if (header.includes("23andMe")) {
    format = "23andMe";
    if (header.includes("v5")) chip = "23andMe v5 (GSA)";
    else if (header.includes("v4")) chip = "23andMe v4 (OmniExpress)";
    else if (header.includes("v3")) chip = "23andMe v3 (OmniExpress)";
    else chip = "23andMe (Legacy)";
  } else if (header.includes("AncestryDNA")) {
    format = "AncestryDNA";
    if (header.includes("v3")) chip = "AncestryDNA v3 (GSA)";
    else if (header.includes("v2")) chip = "AncestryDNA v2 (GSA)";
    else if (header.includes("v1")) chip = "AncestryDNA v1 (OmniExpress)";
    else chip = "AncestryDNA";
  } else if (header.includes("MyHeritage")) {
    format = "MyHeritage";
    chip = "MyHeritage DNA (GSA)";
  } else if (header.includes("Family Tree DNA") || header.includes("FTDNA") || header.includes("RESULT") || header.includes("Result")) {
    format = "FTDNA";
    chip = "FTDNA Family Finder";
  } else if (header.includes("Living DNA")) {
    format = "Living DNA";
    chip = "Living DNA (GSA)";
  } else if (header.includes("tellmegen") || header.includes("TellmeGen")) {
    format = "TellmeGen";
    chip = "TellmeGen Raw Data";
  } else if (header.includes("##fileformat=VCF") || header.includes("#CHROM\tPOS\tID\tREF\tALT") || header.includes("#CHROM")) {
    format = "VCF";
    chip = "Variant Call Format (VCF)";
  }

  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;

  const isVcf = format === "VCF";
  const totalLength = text.length;
  let lineStart = 0;
  let matchCount = 0;

  let delim: number | null = null;
  let delimStr = "";
  let columnMapping: ColumnMapping | null = null;

  while (lineStart < totalLength) {
    let lineEnd = text.indexOf('\n', lineStart);
    if (lineEnd === -1) lineEnd = totalLength;

    let lineActualEnd = lineEnd;
    if (lineActualEnd > lineStart && text.charCodeAt(lineActualEnd - 1) === 13) lineActualEnd--;

    const lineLen = lineActualEnd - lineStart;
    lineStart = lineEnd + 1;
    linesTotal++;

    if (lineLen === 0) continue;

    const firstChar = text.charCodeAt(lineActualEnd - lineLen);
    const line = text.substring(lineActualEnd - lineLen, lineActualEnd);

    if (firstChar === 35 /* # */ || (firstChar === 47 /* / */ && text.charCodeAt(lineActualEnd - lineLen + 1) === 47)) {
      linesCommented++;
      // Check if this comment line contains column definitions (e.g. # rsid, chromosome, position, genotype)
      if (delimStr && !columnMapping) {
        columnMapping = detectHeaderColumns(line, delimStr);
      }
      continue;
    }

    if (isVcf) {
      if (linesTotal % 10000 === 0 && onProgress) {
        onProgress(lineStart, totalLength, snpCount);
      }
      const cols = line.split('\t');
      if (cols.length >= 10) {
        const rawChrom = cols[0];
        const chrom = normalizeChromosome(rawChrom);
        const posStr = cols[1];
        const pos = parseInt(posStr, 10);
        const id = cols[2];
        const ref = cols[3].toUpperCase();
        const alt = cols[4].toUpperCase();
        const formatCol = cols[8];
        const sampleCol = cols[9];

        const formatFields = formatCol.split(':');
        const gtIdx = formatFields.indexOf('GT');
        if (gtIdx !== -1) {
          const sampleFields = sampleCol.split(':');
          const gtVal = sampleFields[gtIdx];
          if (gtVal && gtVal !== '.' && gtVal !== './.' && gtVal !== '.|.') {
            const gtParts = gtVal.split(/[\/|]/);
            const altAlleles = alt.split(',');
            const getAllele = (idxStr: string) => {
              if (idxStr === '0') return ref;
              const idx = parseInt(idxStr, 10);
              return (idx >= 1 && idx <= altAlleles.length) ? altAlleles[idx - 1] : '-';
            };
            const a1 = getAllele(gtParts[0]);
            const a2 = getAllele(gtParts[1] || gtParts[0]);
            
            // Normalize multicharacter indels if present in VCF
            let normA1 = a1;
            let normA2 = a2;
            if (a1.length > 1 || a2.length > 1) {
              normA1 = a1.length > ref.length ? 'I' : a1.length < ref.length ? 'D' : a1[0];
              normA2 = a2.length > ref.length ? 'I' : a2.length < ref.length ? 'D' : a2[0];
            }
            const genotype = cleanGenotypeString(normA1 + normA2);

            if (genotype) {
              const markerId = id !== '.' ? id.toLowerCase() : `chr${chrom}_${pos}`.toLowerCase();
              const isYorMT = chrom === 'Y' || chrom === 'MT';
              if (!allowlist || isYorMT || allowlist.has(markerId)) {
                snpCount++;
                snpMap[markerId] = genotype;
                if (!isNaN(pos)) {
                  snpMetaMap[markerId] = { chrom, pos };
                  snpMap[`chr${chrom}_${pos}`.toLowerCase()] = genotype;
                }
                if (chrom === 'X') xMap[markerId] = genotype;
                if (chrom === 'Y') yMap[markerId] = genotype;
                if (chrom === 'MT') {
                  const allele = genotype[0];
                  if (allele !== '-') mtMap[posStr] = allele;
                }
              }
            }
          }
        }
      } else {
        linesMalformed++;
      }
    } else {
      if (delim === null) {
        if (line.indexOf('\t') !== -1) {
          delim = 9;
          delimStr = '\t';
        } else if (line.indexOf(',') !== -1) {
          delim = 44;
          delimStr = ',';
        } else if (line.indexOf(';') !== -1) {
          delim = 59;
          delimStr = ';';
        } else if (line.indexOf(' ') !== -1) {
          delim = 32;
          delimStr = ' ';
        } else {
          linesMalformed++;
          continue;
        }
        // Check if the very first data line is a table header
        columnMapping = detectHeaderColumns(line, delimStr);
        if (columnMapping) {
          continue; // Skip header line
        }
      }

      let parsed: ParsedFields | null = null;
      if (columnMapping && columnMapping.isCustom) {
        parsed = parseAdaptiveLine(line, delimStr, columnMapping);
      } else {
        parsed = fastParseLine(line, delim, delimStr);
      }

      if (parsed) {
        matchCount++;
        if (matchCount % 10000 === 0 && onProgress) {
          onProgress(lineStart, totalLength, snpCount);
        }
        const { markerId, chrom, posStr, pos, genotype } = parsed;
        const isYorMT = chrom === 'Y' || chrom === 'MT';

        if (allowlist && !isYorMT && !allowlist.has(markerId)) continue;

        snpCount++;
        snpMap[markerId] = genotype;
        if (!isNaN(pos)) {
          snpMetaMap[markerId] = { chrom, pos };
          const coordId = `chr${chrom}_${pos}`.toLowerCase();
          if (!snpMap[coordId]) snpMap[coordId] = genotype;
        }
        if (chrom === 'X') xMap[markerId] = genotype;
        if (chrom === 'Y') yMap[markerId] = genotype;
        if (chrom === 'MT') {
          const allele = genotype[0];
          if (allele !== '-') mtMap[posStr] = allele;
        }
      } else {
        linesMalformed++;
      }
    }
  }

  // Refine chip detection based on SNP count if still unknown
  if (chip === "Unknown Chip") {
    if (snpCount > 900000) chip = "High-Density Chip (Omni2.5 or similar)";
    else if (snpCount > 600000) chip = "Standard GSA/OmniExpress Chip";
    else if (snpCount > 300000) chip = "Low-Density Chip";
    else chip = `${format} Raw Data`;
  }

  if (snpCount === 0) {
    throw new GenomicsParseError(
      "The file contains no parseable genetic markers (SNPs). Please verify that the column layout matches our requirements.",
      {
        format,
        chip,
        bytesTotal: text.length,
        linesTotal: text.split(/\r?\n/).length,
        linesCommented,
        linesMalformed: text.split(/\r?\n/).length - linesCommented,
        headerPreview: header.slice(0, 300),
        errorCategory: "No Valid Genetic Markers Found",
        suggestedSolution: "Make sure that the file lists SNPs in the standard layout: rsID, chromosome, physical position, and allele genotype letters (e.g. AA, CT, GG)."
      }
    );
  }

  if (onProgress) {
    onProgress(totalLength, totalLength, snpCount);
  }

  return { snpMap, snpMetaMap, xMap, yMap, mtMap, format, chip, snpCount };
}

export async function parseRawDNAStream(
  file: File | Blob,
  allowlist?: Set<string>,
  onProgress?: (bytesProcessed: number, totalBytes: number, snpsFound: number) => void
) {
  // Check for GZIP (\x1f\x8b) or ZIP (PK\x03\x04) signatures on sample slice
  const sampleSlice = file.slice(0, Math.min(65536, file.size));
  const sampleBuf = new Uint8Array(await sampleSlice.arrayBuffer());

  if ((sampleBuf.length >= 2 && sampleBuf[0] === 0x1f && sampleBuf[1] === 0x8b) || 
      (sampleBuf.length >= 4 && sampleBuf[0] === 0x50 && sampleBuf[1] === 0x4b)) {
    const fullBuf = new Uint8Array(await file.arrayBuffer());
    const decompressed = decompressGenomicBuffer(fullBuf);
    const text = DECODER.decode(decompressed);
    return parseRawDNA(text, allowlist, onProgress);
  }

  const snpMap: Record<string, string> = {};
  const snpMetaMap: Record<string, { chrom: string, pos: number }> = {};
  const xMap: Record<string, string> = {};
  const yMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  let format = "Unknown";
  let chip = "Unknown Chip";
  let snpCount = 0;
  let delim: number | null = null;
  let delimStr = "";
  let columnMapping: ColumnMapping | null = null;

  const totalBytes = file.size;
  let bytesProcessed = 0;

  const firstSlice = file.slice(0, Math.min(50000, file.size));
  const firstChunkText = await firstSlice.text();
  const header = firstChunkText.slice(0, 1000);

  const health = checkFileFormatHealth(firstChunkText);
  if (!health.healthy) {
    throw new GenomicsParseError(health.reason || "Invalid file format", {
      headerPreview: header.slice(0, 300),
      errorCategory: health.category,
      suggestedSolution: health.solution,
      bytesTotal: file.size
    });
  }

  if (header.includes("23andMe")) {
    format = "23andMe";
    if (header.includes("v5")) chip = "23andMe v5 (GSA)";
    else if (header.includes("v4")) chip = "23andMe v4 (OmniExpress)";
    else if (header.includes("v3")) chip = "23andMe v3 (OmniExpress)";
    else chip = "23andMe (Legacy)";
  } else if (header.includes("AncestryDNA")) {
    format = "AncestryDNA";
    if (header.includes("v3")) chip = "AncestryDNA v3 (GSA)";
    else if (header.includes("v2")) chip = "AncestryDNA v2 (GSA)";
    else if (header.includes("v1")) chip = "AncestryDNA v1 (OmniExpress)";
    else chip = "AncestryDNA";
  } else if (header.includes("MyHeritage")) {
    format = "MyHeritage";
    chip = "MyHeritage DNA (GSA)";
  } else if (header.includes("Family Tree DNA") || header.includes("FTDNA") || header.includes("RESULT") || header.includes("Result")) {
    format = "FTDNA";
    chip = "FTDNA Family Finder";
  } else if (header.includes("Living DNA")) {
    format = "Living DNA";
    chip = "Living DNA (GSA)";
  } else if (header.includes("tellmegen") || header.includes("TellmeGen")) {
    format = "TellmeGen";
    chip = "TellmeGen Raw Data";
  } else if (header.includes("##fileformat=VCF") || header.includes("#CHROM\tPOS\tID\tREF\tALT") || header.includes("#CHROM")) {
    format = "VCF";
    chip = "Variant Call Format (VCF)";
  }

  const isVcf = format === "VCF";

  const stream = file.stream();
  const reader = stream.getReader();

  let remainder = new Uint8Array(0);

  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;

  let lastYield = performance.now();
  const YIELD_INTERVAL = 150; // ms

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    bytesProcessed += value.length;

    const now = performance.now();
    if (now - lastYield > YIELD_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, 0));
      lastYield = performance.now();
    }

    const combined = new Uint8Array(remainder.length + value.length);
    combined.set(remainder);
    combined.set(value, remainder.length);

    let pos = 0;
    const length = combined.length;

    // Check BOM in first chunk if needed
    if (linesTotal === 0 && combined.length >= 3 && combined[0] === 0xef && combined[1] === 0xbb && combined[2] === 0xbf) {
      pos = 3;
    }

    while (pos < length) {
      let nl = pos;
      while (nl < length && combined[nl] !== LF) nl++;
      if (nl === length) break; // Incomplete line, keep as remainder

      const lineStart = pos;
      const lineEnd = nl + 1; // Include newline
      pos = lineEnd;

      linesTotal++;
      
      if (lineEnd - lineStart <= 1) continue;

      if (combined[lineStart] === HASH) {
        linesCommented++;
        if (delimStr && !columnMapping) {
          let actEnd = lineEnd - 1;
          if (actEnd > lineStart && combined[actEnd - 1] === CR) actEnd--;
          const commentLine = DECODER.decode(combined.subarray(lineStart, actEnd));
          columnMapping = detectHeaderColumns(commentLine, delimStr);
        }
        continue;
      }

      if (isVcf) {
        let actualLineEnd = lineEnd - 1; // exclude LF
        if (actualLineEnd > lineStart && combined[actualLineEnd - 1] === CR) actualLineEnd--;
        const line = DECODER.decode(combined.subarray(lineStart, actualLineEnd));
        const cols = line.split('\t');
        if (cols.length >= 10) {
          const rawChrom = cols[0];
          const chrom = normalizeChromosome(rawChrom);
          const posStr = cols[1];
          const colPos = parseInt(posStr, 10);
          const id = cols[2];
          const ref = cols[3].toUpperCase();
          const alt = cols[4].toUpperCase();
          const formatCol = cols[8];
          const sampleCol = cols[9];

          const formatFields = formatCol.split(':');
          const gtIdx = formatFields.indexOf('GT');
          if (gtIdx !== -1) {
            const sampleFields = sampleCol.split(':');
            const gtVal = sampleFields[gtIdx];
            if (gtVal && gtVal !== '.' && gtVal !== './.' && gtVal !== '.|.') {
              const gtParts = gtVal.split(/[\/|]/);
              const altAlleles = alt.split(',');
              const getAllele = (idxStr: string) => {
                if (idxStr === '0') return ref;
                const idx = parseInt(idxStr, 10);
                return (idx >= 1 && idx <= altAlleles.length) ? altAlleles[idx - 1] : '-';
              };
              const a1 = getAllele(gtParts[0]);
              const a2 = getAllele(gtParts[1] || gtParts[0]);
              let normA1 = a1;
              let normA2 = a2;
              if (a1.length > 1 || a2.length > 1) {
                normA1 = a1.length > ref.length ? 'I' : a1.length < ref.length ? 'D' : a1[0];
                normA2 = a2.length > ref.length ? 'I' : a2.length < ref.length ? 'D' : a2[0];
              }
              const genotype = cleanGenotypeString(normA1 + normA2);

              if (genotype) {
                const markerId = id !== '.' ? id.toLowerCase() : `chr${chrom}_${colPos}`.toLowerCase();
                const isYorMT = chrom === 'Y' || chrom === 'MT';
                if (!allowlist || isYorMT || allowlist.has(markerId)) {
                  snpCount++;
                  snpMap[markerId] = genotype;
                  if (!isNaN(colPos)) {
                    snpMetaMap[markerId] = { chrom, pos: colPos };
                    snpMap[`chr${chrom}_${colPos}`.toLowerCase()] = genotype;
                  }
                  if (chrom === 'X') xMap[markerId] = genotype;
                  if (chrom === 'Y') yMap[markerId] = genotype;
                  if (chrom === 'MT') {
                    const allele = genotype[0];
                    if (allele !== '-') mtMap[posStr] = allele;
                  }
                }
              }
            }
          }
        } else {
          linesMalformed++;
        }
      } else {
        if (delim === null) {
          let testStart = lineStart;
          let foundTab = false;
          let foundComma = false;
          let foundSemicolon = false;
          let foundSpace = false;
          for (let i = testStart; i < lineEnd; i++) {
            if (combined[i] === TAB) foundTab = true;
            else if (combined[i] === COMMA) foundComma = true;
            else if (combined[i] === SEMICOLON) foundSemicolon = true;
            else if (combined[i] === SPACE) foundSpace = true;
          }
          if (foundTab) { delim = TAB; delimStr = '\t'; }
          else if (foundComma) { delim = COMMA; delimStr = ','; }
          else if (foundSemicolon) { delim = SEMICOLON; delimStr = ';'; }
          else if (foundSpace) { delim = SPACE; delimStr = ' '; }
          else {
            linesMalformed++;
            continue;
          }

          let actEnd = lineEnd - 1;
          if (actEnd > lineStart && combined[actEnd - 1] === CR) actEnd--;
          const headerTestLine = DECODER.decode(combined.subarray(lineStart, actEnd));
          columnMapping = detectHeaderColumns(headerTestLine, delimStr);
          if (columnMapping) {
            continue; // Skip header line
          }
        }

        let parsed: ParsedFields | null = null;
        if (columnMapping && columnMapping.isCustom) {
          let actEnd = lineEnd - 1;
          if (actEnd > lineStart && combined[actEnd - 1] === CR) actEnd--;
          const lineStr = DECODER.decode(combined.subarray(lineStart, actEnd));
          parsed = parseAdaptiveLine(lineStr, delimStr, columnMapping);
        } else {
          parsed = parseLineBytes(combined, lineStart, lineEnd - 1, delim);
        }

        if (parsed) {
          const { markerId, chrom, posStr, pos: colPos, genotype } = parsed;
          const isYorMT = chrom === 'Y' || chrom === 'MT';
          if (!allowlist || isYorMT || allowlist.has(markerId)) {
            snpCount++;
            snpMap[markerId] = genotype;
            if (!isNaN(colPos)) {
              snpMetaMap[markerId] = { chrom, pos: colPos };
              const coordId = `chr${chrom}_${colPos}`.toLowerCase();
              if (!snpMap[coordId]) snpMap[coordId] = genotype;
            }
            if (chrom === 'X') xMap[markerId] = genotype;
            if (chrom === 'Y') yMap[markerId] = genotype;
            if (chrom === 'MT') {
              const allele = genotype[0];
              if (allele !== '-') mtMap[posStr] = allele;
            }
          }
        } else {
          linesMalformed++;
        }
      }
    }

    if (pos < length) {
      remainder = combined.slice(pos);
    } else {
      remainder = new Uint8Array(0);
    }

    if (onProgress) {
      onProgress(bytesProcessed, totalBytes, snpCount);
    }
  }

  // Handle remaining bytes if any
  if (remainder.length > 0 && remainder[0] !== HASH) {
    linesTotal++;
    if (isVcf) {
      // VCF trailing line
    } else if (delim !== null) {
      let parsed: ParsedFields | null = null;
      if (columnMapping && columnMapping.isCustom) {
        const lineStr = DECODER.decode(remainder);
        parsed = parseAdaptiveLine(lineStr, delimStr, columnMapping);
      } else {
        parsed = parseLineBytes(remainder, 0, remainder.length, delim);
      }

      if (parsed) {
        const { markerId, chrom, posStr, pos: colPos, genotype } = parsed;
        const isYorMT = chrom === 'Y' || chrom === 'MT';
        if (!allowlist || isYorMT || allowlist.has(markerId)) {
          snpCount++;
          snpMap[markerId] = genotype;
          if (!isNaN(colPos)) {
            snpMetaMap[markerId] = { chrom, pos: colPos };
            const coordId = `chr${chrom}_${colPos}`.toLowerCase();
            if (!snpMap[coordId]) snpMap[coordId] = genotype;
          }
          if (chrom === 'X') xMap[markerId] = genotype;
          if (chrom === 'Y') yMap[markerId] = genotype;
          if (chrom === 'MT') {
            const allele = genotype[0];
            if (allele !== '-') mtMap[posStr] = allele;
          }
        }
      }
    }
  }

  if (chip === "Unknown Chip") {
    if (snpCount > 900000) chip = "High-Density Chip (Omni2.5 or similar)";
    else if (snpCount > 600000) chip = "Standard GSA/OmniExpress Chip";
    else if (snpCount > 300000) chip = "Low-Density Chip";
    else chip = `${format} Raw Data`;
  }

  if (snpCount === 0) {
    throw new GenomicsParseError(
      "The file contains no parseable genetic markers (SNPs). Please verify that the file represents local genome SNPs.",
      {
        format, chip, bytesTotal: file.size, linesTotal, linesCommented, linesMalformed,
        errorCategory: "Empty Ingestion Spectrum",
        suggestedSolution: "Make sure you downloaded 'all SNPs' or 'raw data text' rather than mitochondrial-only sequences or visual screenshots. The file should contain rsIDs and genotypes."
      }
    );
  }

  if (onProgress) {
    onProgress(file.size, file.size, snpCount);
  }

  return { snpMap, snpMetaMap, xMap, yMap, mtMap, format, chip, snpCount };
}
