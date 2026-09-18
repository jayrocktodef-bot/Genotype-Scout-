import { gunzipSync, unzipSync } from 'fflate';
import {
  GenomicsError,
  GenomicsErrorCode,
  callGenomicsError,
  serializeGenomicsError,
  formatDiagnosticTelemetry,
  type GenomicsDiagnosticDetails,
  type GenomicsSubsystem,
  type SerializedGenomicsError
} from './errorCaller';

export {
  GenomicsError,
  GenomicsErrorCode,
  callGenomicsError,
  serializeGenomicsError,
  formatDiagnosticTelemetry,
  type GenomicsDiagnosticDetails,
  type GenomicsSubsystem,
  type SerializedGenomicsError
};

// ── Module-level constants (allocated once) ──────────────────────────
const VALID_BASE_CODES = new Set([
  65/*A*/, 67/*C*/, 71/*G*/, 84/*T*/, 68/*D*/, 73/*I*/, 78/*N*/, 45/*-*/
]);

// Byte-level valid allele set (mirrors VALID_BASE_CODES above, used in parseLineBytes hot path)
const isValidAlleleByte = (b: number): boolean =>
  b === 0x41/*A*/ || b === 0x43/*C*/ || b === 0x47/*G*/ || b === 0x54/*T*/ ||
  b === 0x49/*I*/ || b === 0x44/*D*/ || b === 0x4E/*N*/ || b === 0x2D/*-*/;

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
// Security threshold limits to prevent decompression bomb Denial-of-Service (DoS) and tab OOM crashes
const MAX_DECOMPRESSED_BYTES = 500 * 1024 * 1024; // 500 MB ceiling
const MAX_DECOMPRESSION_DEPTH = 3;

function decompressGzipBuffer(buf: Uint8Array): Uint8Array {
  // Check if BGZF (Block GZIP Format, used by all standard .vcf.gz)
  const isBgzf = buf.length >= 18 && (buf[3] & 4) !== 0 && buf[12] === 0x42 && buf[13] === 0x43;
  if (isBgzf) {
    let offset = 0;
    const chunks: Uint8Array[] = [];
    let totalSize = 0;
    while (offset < buf.length) {
      if (buf[offset] !== 0x1f || buf[offset + 1] !== 0x8b) break;
      const bsize = (buf[offset + 16] | (buf[offset + 17] << 8)) + 1;
      if (bsize <= 0 || offset + bsize > buf.length) break;
      const block = buf.subarray(offset, offset + bsize);
      const decomp = gunzipSync(block);
      if (decomp.length > 0) {
        chunks.push(decomp);
        totalSize += decomp.length;
        if (totalSize > MAX_DECOMPRESSED_BYTES) {
          throw new GenomicsError(`Decompressed BGZF dataset exceeds safety threshold (500 MB).`, {
            errorCode: GenomicsErrorCode.ERR_ZIP_DECOMPRESS_BOMB,
            subsystem: 'ZIP_DECOMPRESSION',
            suggestedSolution: 'Your uncompressed dataset is larger than 500MB. Please upload an individual chromosome or standard consumer genotype export.'
          });
        }
      }
      offset += bsize;
    }
    const merged = new Uint8Array(totalSize);
    let cur = 0;
    for (const c of chunks) {
      merged.set(c, cur);
      cur += c.length;
    }
    return merged;
  } else {
    const result = gunzipSync(buf);
    if (result.byteLength > MAX_DECOMPRESSED_BYTES) {
      throw new GenomicsError(`Decompressed file exceeds safety threshold (500 MB).`, {
        errorCode: GenomicsErrorCode.ERR_ZIP_DECOMPRESS_BOMB,
        subsystem: 'ZIP_DECOMPRESSION',
        suggestedSolution: 'Your uncompressed dataset is larger than 500MB. Please upload an individual chromosome or standard consumer genotype export.'
      });
    }
    return result;
  }
}

function extractBestFileFromZip(buf: Uint8Array): Uint8Array {
  const unzipped = unzipSync(buf);
  let totalExtractedSize = 0;
  for (const k of Object.keys(unzipped)) {
    totalExtractedSize += unzipped[k]?.byteLength || 0;
  }
  if (totalExtractedSize > MAX_DECOMPRESSED_BYTES) {
    throw new GenomicsError(`ZIP archive extracted payload exceeds safety threshold (500 MB).`, {
      errorCode: GenomicsErrorCode.ERR_ZIP_DECOMPRESS_BOMB,
      subsystem: 'ZIP_DECOMPRESSION',
      suggestedSolution: 'Your ZIP bundle extracted payload exceeds 500MB. Extract the ZIP on your device and upload only the primary raw text file.'
    });
  }

  const fileKeys = Object.keys(unzipped).filter(k => {
    const lower = k.toLowerCase();
    return !lower.startsWith('__macosx/') &&
           !lower.includes('.ds_store') &&
           !lower.includes('..') &&
           !lower.endsWith('/') &&
           !lower.endsWith('.pdf') &&
           !lower.endsWith('.html') &&
           !lower.endsWith('.png') &&
           !lower.endsWith('.jpg') &&
           !lower.endsWith('.jpeg') &&
           !lower.endsWith('.gif') &&
           !lower.endsWith('.xml') &&
           !lower.endsWith('.json') &&
           !lower.endsWith('.md');
  });

  if (fileKeys.length === 0) {
    return buf;
  }

  fileKeys.sort((a, b) => {
    const score = (key: string) => {
      const l = key.toLowerCase();
      let s = 0;
      if (l.includes('readme') || l.includes('disclaimer') || l.includes('license') || l.includes('notice') || l.includes('terms') || l.includes('release_notes')) {
        s -= 500;
      }
      if (l.endsWith('.vcf') || l.endsWith('.vcf.gz') || l.endsWith('.vcf.zip')) s += 100;
      if (l.endsWith('.txt') || l.endsWith('.txt.gz') || l.endsWith('.txt.zip')) s += 90;
      if (l.endsWith('.csv') || l.endsWith('.csv.gz') || l.endsWith('.csv.zip')) s += 80;
      if (l.endsWith('.tsv') || l.endsWith('.tsv.gz') || l.endsWith('.tsv.zip')) s += 70;
      if (l.endsWith('.dat')) s += 60;
      if (l.endsWith('.gz') || l.endsWith('.zip')) s += 40;
      if (l.includes('genome') || l.includes('dna') || l.includes('ancestry') || l.includes('23andme') || l.includes('myheritage') || l.includes('ftdna') || l.includes('livingdna')) s += 30;
      const sz = unzipped[key]?.byteLength || 0;
      if (sz > 100000) s += 50;
      if (sz > 1000000) s += 50;
      return s;
    };
    return score(b) - score(a);
  });

  return unzipped[fileKeys[0]];
}

export function decompressGenomicBuffer(buf: Uint8Array): Uint8Array {
  if (!buf || buf.length < 4) return buf;

  let result = buf;
  let depth = 0;

  // Recursively decompress up to MAX_DECOMPRESSION_DEPTH passes to handle double compression
  // e.g. .vcf.gz inside .zip (MyHeritage WGS), .gz inside .gz, .zip inside .zip, .zip inside .gz
  while (depth < MAX_DECOMPRESSION_DEPTH && result && result.length >= 4) {
    // 1. Check for GZIP magic bytes (\x1f\x8b)
    if (result[0] === 0x1f && result[1] === 0x8b) {
      try {
        const decompressed = decompressGzipBuffer(result);
        result = decompressed;
        depth++;
      } catch (e) {
        if (e instanceof GenomicsError) throw e;
        console.warn("fflate gunzipSync warning:", e);
        break;
      }
    }
    // 2. Check for ZIP magic bytes (PK\x03\x04, PK\x05\x06, PK\x07\x08)
    else if (result[0] === 0x50 && result[1] === 0x4b && (result[2] === 0x03 || result[2] === 0x05 || result[2] === 0x07)) {
      try {
        const extracted = extractBestFileFromZip(result);
        if (extracted === result) break;
        result = extracted;
        depth++;
      } catch (e) {
        if (e instanceof GenomicsError) throw e;
        console.warn("fflate unzipSync warning:", e);
        break;
      }
    } else {
      break;
    }
  }

  // 3. Strip UTF-8 BOM (\xef\xbb\xbf)
  if (result.length >= 3 && result[0] === 0xef && result[1] === 0xbb && result[2] === 0xbf) {
    result = result.subarray(3);
  }

  return result;
}

/**
/**
 * Standardize chromosome identifier across all commercial formats.
 * Maps AncestryDNA chr23->X, chr24->Y, chr25->X (PAR), chr26->MT.
 * Also handles European/WGS prefixes (chr1..chr22, chrX, chrY, chrM, chrMT, chrPAR1, chrPAR2).
 */
export function normalizeChromosome(chromRaw: string): string {
  let chrom = chromRaw.trim().toUpperCase();
  if (chrom.startsWith('CHR')) chrom = chrom.slice(3);
  if (chrom === '23' || chrom === 'X' || chrom === 'XY') return 'X';
  if (chrom === '24' || chrom === 'Y') return 'Y';
  // AncestryDNA uses '25' for the Pseudoautosomal Region (PAR) on X; map to X
  // Note: 'PAR1' is safe to map to X. 'PAR2' technically exists on both X and Y,
  // but commercial kits always report PAR2 variants under the X coordinate system.
  if (chrom === '25' || chrom === 'PAR' || chrom === 'PAR1') return 'X';
  if (chrom === '26' || chrom === 'M' || chrom === 'MT' || chrom === 'MITO' || chrom === 'MITOCHONDRIAL') return 'MT';
  if (chrom === '0' || chrom === 'UN' || chrom === 'UNKNOWN') return 'UN';
  return chrom;
}

/**
 * Validate and clean genotype string.
 * Handles split alleles, slashes, indels (I/D, +/-, <INS>/<DEL>), and alphabetical sorting.
 */
export function isValidGenotype(genotype: string): boolean {
  if (!genotype) return false;
  const g = genotype.trim().toUpperCase().replace(/["'\s\/|_]/g, '');
  if (g === '--' || g === '__' || g === '00' || g === '??' || g === './.' || g === '.|.' || g === '-' || g === '.' || g === '0' || g === 'NA' || g === 'NN' || g === 'NULL' || g === 'NC' || g === 'NOT_CALLED') {
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
  if (g === '--' || g === '__' || g === '00' || g === '??' || g === './.' || g === '.|.' || g === '-' || g === '.' || g === '0' || g === 'NA' || g === 'NN' || g === 'NULL' || g === 'NC' || g === 'NOT_CALLED') {
    return null;
  }
  // Convert '+' and '-' indel notations or symbolic indels to I / D
  if (g === '++') g = 'II';
  else if (g === '+-') g = 'ID';
  else if (g === '-+') g = 'ID';
  else if (g === '+') g = 'I';
  else if (g === '<DEL>' || g.includes('DEL')) g = 'D';
  else if (g === '<INS>' || g.includes('INS')) g = 'I';

  // Ancestry-specific "0" / "-" cleaning for hemizygous alleles (e.g. 'A0' -> 'A', '0A' -> 'A', 'A-' -> 'A')
  if (g.length === 2) {
    if (g.includes('0')) {
      g = g.replace(/0/g, '');
    } else if (g[0] === '-' && (g[1] === 'A' || g[1] === 'C' || g[1] === 'G' || g[1] === 'T' || g[1] === 'I' || g[1] === 'D')) {
      g = g[1];
    } else if (g[1] === '-' && (g[0] === 'A' || g[0] === 'C' || g[0] === 'G' || g[0] === 'T' || g[0] === 'I' || g[0] === 'D')) {
      g = g[0];
    }
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

export interface ParsedDnaData {
  format: string;
  chip: string;
  build: 'GRCh37' | 'GRCh38' | 'UNKNOWN';
  totalSnps: number;
  yDnaSnps: number;
  yDnaCalledSnps: number;
  mtDnaSnps: number;
  inferredBiologicalSex: 'MALE' | 'FEMALE' | 'UNKNOWN';
  snpMap: Record<string, string>;
  snpMetaMap: Record<string, { chrom: string, pos: number }>;
  xMap: Record<string, string>;
  yMap: Record<string, string>;
  mtMap: Record<string, string>;
  snpCount: number;
  rawSnpsCount?: number;
  snpByRsid: Record<string, string>; // rsid (lowercase) -> genotype
  snpByPosition: Record<string, string>; // "chr:pos" -> genotype

  // --- Phased Haplotypes and Parental Lineage Differentiation ---
  isPhased: boolean;
  phasedCount?: number;
  phasingMethod: 'VCF_PHASED' | 'STATISTICAL_MICROPHASED' | 'TRIO' | 'UNPHASED';
  haplotype1Map?: Record<string, string>; // Strand A / Haplotype 1 allele per rsid
  haplotype2Map?: Record<string, string>; // Strand B / Haplotype 2 allele per rsid
  phaseSets?: Record<string, string>;     // rsid -> PS (Phase Set ID)
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

const CANDIDATE_DELIMS = ['\t', ',', ';', ' '];

export function isBoilerplateOrComment(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  const first = trimmed.charCodeAt(0);
  if (first === HASH /* # */ || trimmed.startsWith('//') || trimmed.startsWith('/*')) return true;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('[data]') || lower.startsWith('[header]') || lower.startsWith('[manifest]') || lower.startsWith('[snps]')) return true;
  if (
    lower.includes('disclaimer') ||
    lower.includes('terms of service') ||
    lower.includes('export date') ||
    lower.includes('copyright') ||
    lower.startsWith('version:') ||
    lower.startsWith('date:') ||
    lower.startsWith('build:')
  ) {
    if (!lower.includes('rs') && !lower.includes('chr') && !lower.includes('position')) {
      return true;
    }
  }
  return false;
}

export function sniffDelimiter(sampleLines: string[]): { delim: number; delimStr: string } {
  const dataLines = sampleLines.filter(l => !isBoilerplateOrComment(l) && l.trim().length > 0).slice(0, 64);
  if (dataLines.length === 0) {
    return { delim: TAB, delimStr: '\t' };
  }

  let bestDelim = '\t';
  let bestScore = -1;

  for (const d of CANDIDATE_DELIMS) {
    const countFreq: Record<number, number> = {};
    let matchedLines = 0;

    for (const line of dataLines) {
      const count = d === ' ' ? line.trim().split(/ +/).length : line.split(d).length;
      if (count >= 3) {
        matchedLines++;
        countFreq[count] = (countFreq[count] || 0) + 1;
      }
    }

    if (matchedLines === 0) continue;

    let modeCount = 0;
    let modeFreq = 0;
    for (const [cntStr, freq] of Object.entries(countFreq)) {
      const cnt = Number(cntStr);
      if (freq > modeFreq) {
        modeFreq = freq;
        modeCount = cnt;
      }
    }

    const consistency = modeFreq / dataLines.length;
    const baseWeight = d === '\t' ? 1.2 : d === ',' ? 1.1 : d === ';' ? 1.05 : 0.9;
    const score = consistency * Math.log2(1 + modeCount) * baseWeight;

    if (score > bestScore) {
      bestScore = score;
      bestDelim = d;
    }
  }

  return { delim: bestDelim.charCodeAt(0), delimStr: bestDelim };
}

/**
 * Adaptive column detector for headers across all commercial vendors.
 * Detects standard formats as well as TellmeGen, 24Genetics, WeGene, CircleDNA,
 * Spanish/Russian/European vendor formats (e.g. Cromosoma, Posición, Genotipo, Marcador).
 */
export function detectHeaderColumns(headerLine: string, delim: string): ColumnMapping | null {
  const stripped = headerLine.replace(/^#+/, '').replace(/"/g, '').trim();
  const rawTokens = (delim === ' ' ? stripped.split(/\s+/) : stripped.split(delim)).map((t, i) => {
    let tok = t.trim().toLowerCase();
    // Strip UTF-8 BOM (\xEF\xBB\xBF) that UK/EU locales sometimes prepend to the first column name.
    // This fixes AncestryDNA UK exports where '\xEF\xBB\xBFrsid' fails all alias checks.
    if (i === 0 && tok.charCodeAt(0) === 0xFEFF) tok = tok.slice(1);
    if (i === 0 && tok.startsWith('\xef\xbb\xbf')) tok = tok.slice(3);
    return tok;
  });
  if (rawTokens.length < 3) return null;

  let rsidIdx = -1;
  let chromIdx = -1;
  let posIdx = -1;
  let gtIdx = -1;
  let allele1Idx = -1;
  let allele2Idx = -1;

  for (let i = 0; i < rawTokens.length; i++) {
    const rawT = rawTokens[i];
    const t = rawT.replace(/[_-]/g, '');

    // RSID / Marker aliases
    if (
      t === 'rsid' || t === 'rs' || t === 'marker' || t === 'snp' || t === 'id' || t === 'name' ||
      t === 'marcador' || t === 'idmarcador' || t === 'probesetid' || t === 'dbsnprsid' ||
      t === 'probeset' || t === 'probeid' || t === 'markerid' || t === 'snpname' ||
      t === 'markername' || t === 'variantid' || t === 'variant' || t === 'idvariante' ||
      t === 'snpid' || rawT === 'probe set id' || rawT === 'dbsnp rs id' || rawT === 'snp id'
    ) {
      if (rsidIdx === -1) rsidIdx = i;
    }
    // Chromosome aliases
    else if (
      t === 'chromosome' || t === 'chrom' || t === 'chr' || t === 'cromosoma' ||
      t === 'chromosomename' || t === 'chrname' || t === 'chrid' || t === 'seqid' || t === 'contig'
    ) {
      if (chromIdx === -1) chromIdx = i;
    }
    // Position aliases
    else if (
      t === 'position' || t === 'pos' || t === 'posición' || t === 'posicion' ||
      t === 'physicalposition' || t === 'coordinate' || t === 'physpos' ||
      t === 'location' || t === 'chrpos' || t === 'coordenada' || t === 'b37pos' ||
      t === 'b38pos' || t === 'start' || t === 'posbp' || rawT === 'physical position'
    ) {
      if (posIdx === -1) posIdx = i;
    }
    // Genotype (packed) aliases
    else if (
      t === 'genotype' || t === 'result' || t === 'call' || t === 'gt' ||
      t === 'genotipo' || t === 'resultado' || t === 'genotypecall' || t === 'alleles' ||
      t === 'genotyperesult' || t === 'callresult'
    ) {
      if (gtIdx === -1) gtIdx = i;
    }
    // Allele 1 (split) aliases
    else if (
      t === 'allele1' || t === 'allele1top' || t === 'a1' || t === 'alelo1' || t === 'allelea' ||
      rawT === 'allele 1' || rawT === 'allele1 - top' || rawT === 'allele 1 - top' ||
      rawT === 'alelo 1' || rawT === 'allele a' || rawT === 'allele_1' || rawT === 'alelo_1'
    ) {
      if (allele1Idx === -1) allele1Idx = i;
    }
    // Allele 2 (split) aliases
    else if (
      t === 'allele2' || t === 'allele2top' || t === 'a2' || t === 'alelo2' || t === 'alleleb' ||
      rawT === 'allele 2' || rawT === 'allele2 - top' || rawT === 'allele 2 - top' ||
      rawT === 'alelo 2' || rawT === 'allele b' || rawT === 'allele_2' || rawT === 'alelo_2'
    ) {
      if (allele2Idx === -1) allele2Idx = i;
    }
  }

  const hasSplit = allele1Idx !== -1 && allele2Idx !== -1;
  const isCustom = rsidIdx !== 0 || chromIdx !== 1 || posIdx !== 2 || (hasSplit ? (allele1Idx !== 3 || allele2Idx !== 4) : (gtIdx !== 3 && gtIdx !== -1));

  if (chromIdx !== -1 && posIdx !== -1 && (gtIdx !== -1 || hasSplit || rsidIdx !== -1)) {
    return {
      rsidIdx: rsidIdx !== -1 ? rsidIdx : (chromIdx !== 0 && posIdx !== 0 ? 0 : -1),
      chromIdx,
      posIdx,
      gtIdx: gtIdx !== -1 ? gtIdx : (hasSplit ? -1 : 3),
      allele1Idx: allele1Idx !== -1 ? allele1Idx : (hasSplit ? 3 : -1),
      allele2Idx: allele2Idx !== -1 ? allele2Idx : (hasSplit ? 4 : -1),
      hasSplitAlleles: hasSplit,
      isCustom
    };
  }

  return null;
}

/**
 * Statistical Multi-Row Content Voting for Headerless / Unknown Column Tables.
 * Inspects the first 30-50 data rows to infer column roles by content patterns.
 */
export function inferColumnMappingFromContent(sampleLines: string[], delim: string): ColumnMapping | null {
  const dataLines = sampleLines.filter(l => !isBoilerplateOrComment(l) && l.trim().length > 0).slice(0, 50);
  if (dataLines.length === 0) return null;

  const numColsSample = delim === ' ' ? dataLines[0].trim().split(/ +/).length : dataLines[0].split(delim).length;
  if (numColsSample < 3) return null;

  const rsidScores: number[] = new Array(numColsSample).fill(0);
  const chromScores: number[] = new Array(numColsSample).fill(0);
  const posScores: number[] = new Array(numColsSample).fill(0);
  const splitAlleleScores: number[] = new Array(numColsSample).fill(0);
  const packedGtScores: number[] = new Array(numColsSample).fill(0);

  const RSID_REGEX = /^rs\d+$/i;
  const PROBE_REGEX = /^[a-zA-Z0-9_\-\.]{3,30}$/;
  const CHROM_REGEX = /^(?:chr)?(?:[1-9]|1[0-9]|2[0-6]|x|y|m|mt|par|par1|par2|xy|un)$/i;

  let validRowCount = 0;

  for (const line of dataLines) {
    const rawTokens = (delim === ' ' ? line.trim().split(/ +/) : line.split(delim)).map(t => {
      let res = t.trim();
      if (res.startsWith('"') && res.endsWith('"') && res.length >= 2) res = res.substring(1, res.length - 1).trim();
      return res;
    });

    if (rawTokens.length < numColsSample) continue;
    validRowCount++;

    for (let c = 0; c < numColsSample; c++) {
      const val = rawTokens[c];
      const valUpper = val.toUpperCase();

      if (RSID_REGEX.test(val)) {
        rsidScores[c] += 3;
      } else if (PROBE_REGEX.test(val) && !CHROM_REGEX.test(val) && isNaN(Number(val)) && !isValidGenotype(val)) {
        rsidScores[c] += 1;
      }

      if (CHROM_REGEX.test(val)) {
        chromScores[c] += 3;
      }

      const num = Number(val);
      if (!isNaN(num) && Number.isInteger(num) && num >= 1 && num <= 300000000 && !VALID_BASE_CODES.has(val.charCodeAt(0))) {
        if (num > 26) {
          posScores[c] += 3; // Positions are characteristically > 26
        } else {
          posScores[c] += 1;
        }
      }

      if (val.length === 1 && (isValidAlleleByte(valUpper.charCodeAt(0)) || val === '0' || val === '.' || val === '-')) {
        splitAlleleScores[c] += 1;
      }

      if (isValidGenotype(val) || val === '--' || val === '00' || val === './.' || val === '.|.' || val.includes('/') || val.includes('|')) {
        packedGtScores[c] += 3;
      }
    }
  }

  if (validRowCount === 0) return null;

  // 1. Identify Chromosome column
  let chromIdx = -1;
  let maxChromScore = 0;
  for (let c = 0; c < numColsSample; c++) {
    if (chromScores[c] > maxChromScore) {
      maxChromScore = chromScores[c];
      chromIdx = c;
    }
  }

  // 2. Identify Position column (excluding chromIdx)
  let posIdx = -1;
  let maxPosScore = 0;
  for (let c = 0; c < numColsSample; c++) {
    if (c === chromIdx) continue;
    if (posScores[c] > maxPosScore) {
      maxPosScore = posScores[c];
      posIdx = c;
    }
  }

  // Standard positional fallback if ambiguous
  if (chromIdx === -1 && numColsSample >= 4) chromIdx = 1;
  if (posIdx === -1 && numColsSample >= 4) posIdx = 2;

  if (chromIdx === -1 || posIdx === -1) return null;

  // 3. Alleles / Genotype
  let allele1Idx = -1;
  let allele2Idx = -1;
  let gtIdx = -1;

  const splitCandidateCols: number[] = [];
  for (let c = 0; c < numColsSample; c++) {
    if (c === posIdx || c === chromIdx) continue;
    if (splitAlleleScores[c] / validRowCount >= 0.4) {
      splitCandidateCols.push(c);
    }
  }

  if (splitCandidateCols.length >= 2) {
    allele1Idx = splitCandidateCols[0];
    allele2Idx = splitCandidateCols[1];
  } else {
    let maxGtScore = 0;
    for (let c = 0; c < numColsSample; c++) {
      if (c === posIdx || c === chromIdx) continue;
      if (packedGtScores[c] > maxGtScore) {
        maxGtScore = packedGtScores[c];
        gtIdx = c;
      }
    }
    if (gtIdx === -1 && numColsSample >= 4) {
      gtIdx = (chromIdx !== 3 && posIdx !== 3) ? 3 : (numColsSample - 1);
    }
  }

  const hasSplit = allele1Idx !== -1 && allele2Idx !== -1;
  if (!hasSplit && gtIdx === -1) return null;

  // 4. RSID column
  let rsidIdx = -1;
  let maxRsidScore = 0;
  for (let c = 0; c < numColsSample; c++) {
    if (c === posIdx || c === chromIdx || c === gtIdx || c === allele1Idx || c === allele2Idx) continue;
    if (rsidScores[c] > maxRsidScore) {
      maxRsidScore = rsidScores[c];
      rsidIdx = c;
    }
  }
  if (rsidIdx === -1) {
    for (let c = 0; c < numColsSample; c++) {
      if (c !== posIdx && c !== chromIdx && c !== gtIdx && c !== allele1Idx && c !== allele2Idx) {
        rsidIdx = c;
        break;
      }
    }
  }

  const isCustom = rsidIdx !== 0 || chromIdx !== 1 || posIdx !== 2 || (hasSplit ? (allele1Idx !== 3 || allele2Idx !== 4) : (gtIdx !== 3));

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

/**
 * VCF column layout resolved from the #CHROM header line.
 * Stored once per parse and reused for every data row.
 */
export interface VcfColumnLayout {
  chromIdx: number;
  posIdx: number;
  idIdx: number;
  refIdx: number;
  altIdx: number;
  filterIdx: number;
  formatIdx: number;
  sampleIdx: number; // index of first SAMPLE column (FORMAT + 1)
  isGvcf: boolean;   // gVCF signals detected in meta-info lines
}

/** Parse the VCF #CHROM line to get dynamic column positions. */
export function parseVcfColumnLayout(sampleLines: string[]): VcfColumnLayout {
  // Default safe positions matching VCF 4.x spec
  let chromIdx = 0, posIdx = 1, idIdx = 2, refIdx = 3, altIdx = 4, filterIdx = 6, formatIdx = 8, sampleIdx = 9;
  let isGvcf = false;

  for (const line of sampleLines) {
    const trimmed = line.trim();
    // Detect gVCF signals in meta-info
    if (trimmed.startsWith('##ALT=<ID=NON_REF') || trimmed.startsWith('##INFO=<ID=END,') || trimmed.startsWith('##ALT=<ID=*')) {
      isGvcf = true;
    }
    // Parse column header dynamically
    if (trimmed.startsWith('#CHROM') || trimmed.startsWith('#chrom')) {
      const cols = trimmed.replace(/^#/, '').toUpperCase().split('\t');
      const findIdx = (name: string) => { const i = cols.indexOf(name); return i === -1 ? -1 : i; };
      const ci = findIdx('CHROM');   if (ci !== -1) chromIdx = ci;
      const pi = findIdx('POS');     if (pi !== -1) posIdx = pi;
      const ii = findIdx('ID');      if (ii !== -1) idIdx = ii;
      const ri = findIdx('REF');     if (ri !== -1) refIdx = ri;
      const ai = findIdx('ALT');     if (ai !== -1) altIdx = ai;
      const fi = findIdx('FILTER');  if (fi !== -1) filterIdx = fi;
      const fmi = findIdx('FORMAT'); if (fmi !== -1) { formatIdx = fmi; sampleIdx = fmi + 1; }
      break;
    }
  }

  return { chromIdx, posIdx, idIdx, refIdx, altIdx, filterIdx, formatIdx, sampleIdx, isGvcf };
}

export interface ParsePlan {
  delim: number;
  delimStr: string;
  mapping: ColumnMapping;
  isVcf: boolean;
  headerLineIndex: number;
  isStandard23andMe: boolean;
  isStandardAncestry: boolean;
  vcfLayout?: VcfColumnLayout;
}

export function sniffAndBuildParsePlan(sampleLines: string[]): ParsePlan {
  // 1. Check if VCF
  const isVcf = sampleLines.some(l => {
    const low = l.toLowerCase();
    return low.includes('##fileformat=vcf') || low.includes('#chrom\tpos\tid');
  });

  if (isVcf) {
    const vcfLayout = parseVcfColumnLayout(sampleLines);
    return {
      delim: TAB,
      delimStr: '\t',
      mapping: {
        rsidIdx: vcfLayout.idIdx,
        chromIdx: vcfLayout.chromIdx,
        posIdx: vcfLayout.posIdx,
        gtIdx: vcfLayout.sampleIdx,
        allele1Idx: -1,
        allele2Idx: -1,
        hasSplitAlleles: false,
        isCustom: true
      },
      isVcf: true,
      headerLineIndex: -1,
      isStandard23andMe: false,
      isStandardAncestry: false,
      vcfLayout
    };
  }

  // 2. Sniff delimiter
  const { delim, delimStr } = sniffDelimiter(sampleLines);

  // 3. Search for explicit header line
  let mapping: ColumnMapping | null = null;
  let headerLineIndex = -1;

  for (let i = 0; i < Math.min(sampleLines.length, 500); i++) {
    const line = sampleLines[i];
    if (!line.trim()) continue;
    const detected = detectHeaderColumns(line, delimStr);
    if (detected) {
      mapping = detected;
      headerLineIndex = i;
      break;
    }
  }

  // 4. Fallback: statistical content voting over sample rows
  if (!mapping) {
    mapping = inferColumnMappingFromContent(sampleLines, delimStr);
  }

  // 5. Fallback 2: Check for standard 4-column or 5-column formats without headers
  if (!mapping) {
    const dataLines = sampleLines.filter(l => !isBoilerplateOrComment(l) && l.trim().length > 0).slice(0, 10);
    if (dataLines.length > 0) {
      const parts = delimStr === ' ' ? dataLines[0].trim().split(/ +/) : dataLines[0].split(delimStr);
      if (parts.length === 4) {
        mapping = {
          rsidIdx: 0,
          chromIdx: 1,
          posIdx: 2,
          gtIdx: 3,
          allele1Idx: -1,
          allele2Idx: -1,
          hasSplitAlleles: false,
          isCustom: false
        };
      } else if (parts.length >= 5) {
        mapping = {
          rsidIdx: 0,
          chromIdx: 1,
          posIdx: 2,
          gtIdx: -1,
          allele1Idx: 3,
          allele2Idx: 4,
          hasSplitAlleles: true,
          isCustom: false
        };
      }
    }
  }

  // 6. If still no mapping, throw structured error
  if (!mapping) {
    throw new GenomicsParseError(
      "ERR-4025FGD1 (ERR_PARSE_UNKNOWN_COLUMNS): Unable to determine genomic column layout. Missing standard chromosome, position, or genotype fields.",
      {
        errorCode: GenomicsErrorCode.ERR_PARSE_UNKNOWN_COLUMNS,
        legacyCode: 'ERR-4025FGD1',
        errorCategory: 'Unrecognized Column Structure',
        subsystem: 'COLUMN_DETECTION',
        suggestedSolution: 'Ensure your raw data file is an unedited export from 23andMe, AncestryDNA, MyHeritage, FamilyTreeDNA, or standard VCF/TSV.',
        headerPreview: sampleLines.slice(0, 10).join('\n').slice(0, 300)
      }
    );
  }

  const isStandard23andMe = delim === TAB && !mapping.hasSplitAlleles && mapping.rsidIdx === 0 && mapping.chromIdx === 1 && mapping.posIdx === 2 && mapping.gtIdx === 3;
  const isStandardAncestry = delim === TAB && mapping.hasSplitAlleles && mapping.rsidIdx === 0 && mapping.chromIdx === 1 && mapping.posIdx === 2 && mapping.allele1Idx === 3 && mapping.allele2Idx === 4;

  return {
    delim,
    delimStr,
    mapping,
    isVcf: false,
    headerLineIndex,
    isStandard23andMe,
    isStandardAncestry
  };
}

function parseAdaptiveLine(line: string, delimStr: string, mapping: ColumnMapping): ParsedFields | null {
  const parts = delimStr === ' ' ? line.trim().split(/\s+/) : line.split(delimStr);
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
    } else if (a2 && a2 !== '0' && a2 !== '-') {
      rawGenotype = a2;
    }
  } else if (mapping.gtIdx >= 0 && mapping.gtIdx < parts.length) {
    rawGenotype = stripQ(parts[mapping.gtIdx]);
  }

  const genotype = cleanGenotypeString(rawGenotype);
  if (!genotype) return null;

  const chrom = normalizeChromosome(rawChrom);
  let rawMarker = (mapping.rsidIdx >= 0 && mapping.rsidIdx < parts.length) ? stripQ(parts[mapping.rsidIdx]).toLowerCase() : '';
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
      if (!isValidAlleleByte(b)) {
        valid = false;
      } else {
        genotype = String.fromCharCode(b);
      }
    }
  }

  if (valid && hasSecondAllele) {
    const b2 = upper(allele2Byte);
    if (b2 !== 0x30) {
      if (!isValidAlleleByte(b2)) {
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
  const pos = parseInt(field2, 10);
  if (isNaN(pos)) return null;

  let rawMarkerId = field0.toLowerCase();
  if (!rawMarkerId || rawMarkerId === '.' || rawMarkerId === '-') {
    rawMarkerId = `chr${chrom}_${field2}`.toLowerCase();
  }

  return {
    markerId: rawMarkerId,
    chrom,
    posStr: field2,
    pos,
    genotype
  };
}

export type GenomicsParseErrorDetails = GenomicsDiagnosticDetails;

export class GenomicsParseError extends GenomicsError {
  constructor(message: string, details: Partial<GenomicsDiagnosticDetails> & { errorCode?: string; errorCategory?: string }) {
    super(message, {
      subsystem: details.subsystem || 'STREAM_PARSER',
      errorCode: details.errorCode || GenomicsErrorCode.ERR_PARSE_UNKNOWN_COLUMNS,
      legacyCode: details.legacyCode || 'ERR-4025FGD1',
      ...details
    });
    this.name = "GenomicsParseError";
  }
}

export function checkFileFormatHealth(text: string): { 
  healthy: boolean; 
  reason?: string; 
  category?: string; 
  solution?: string;
  code?: GenomicsErrorCode;
} {
  if (!text || text.trim().length === 0) {
    return {
      healthy: false,
      code: GenomicsErrorCode.ERR_FILE_EMPTY,
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
      code: GenomicsErrorCode.ERR_FILE_PDF_DOCUMENT,
      category: "PDF Binary Document",
      reason: "The file is an Adobe PDF format report, not raw DNA text data.",
      solution: "Please upload the original raw data text download from your provider. Visual reports or PDFs cannot be processed by bioinformatics tools."
    };
  }

  // 2. Check for HTML
  if (header.trim().toLowerCase().startsWith("<!doctype html") || header.includes("<html") || header.includes("<head") || header.includes("schema.org")) {
    return {
      healthy: false,
      code: GenomicsErrorCode.ERR_FILE_HTML_WEBPAGE,
      category: "HTML Webpage Page",
      reason: "The file is an HTML webpage, not raw DNA text data.",
      solution: "It looks like you may have saved the vendor dashboard page using 'Save Page As'. Go back to your DNA provider, navigate to 'Settings / Download Raw Data', and request the real data download."
    };
  }

  // 3. Check for Excel or formats
  if (header.includes("workbook") || header.includes("<workbook") || header.includes("xmlns:o=\"urn:schemas-microsoft-com:office")) {
    return {
      healthy: false,
      code: GenomicsErrorCode.ERR_FILE_EXCEL_SPREADSHEET,
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
      code: GenomicsErrorCode.ERR_FILE_BINARY_SEQUENCE,
      category: "Non-Text Binary Format (BAM/CRAM/BCF)",
      reason: "The file contains non-text binary characters. Our browser-side consumer engine expects processed 23andMe standard text representation.",
      solution: "Please convert your BAM or FastQ sequence alignment data into 23andMe or AncestryDNA tab-delimited SNP format before analysis."
    };
  }

  return { healthy: true };
}

export function isPARRegion(chrom: string, pos: number): boolean {
  if (chrom !== 'X' && chrom !== '23' && chrom !== '25' && chrom !== 'PAR') return false;
  // PAR1: GRCh38 10,001-2,781,479 | GRCh37 60,001-2,699,520
  if (pos >= 10001 && pos <= 2781479) return true;
  // PAR2: GRCh38 155,701,383-156,030,895 | GRCh37 154,931,044-155,260,560
  if (pos >= 154931044 && pos <= 156030895) return true;
  return false;
}

export function detectVendorAndChip(headerText: string): { format: string; chip: string; build: 'GRCh37' | 'GRCh38' | 'UNKNOWN' } {
  const h = headerText.toLowerCase();
  let format = "Unknown";
  let chip = "Unknown Chip";
  let build: 'GRCh37' | 'GRCh38' | 'UNKNOWN' = 'GRCh37';

  if (h.includes("grch38") || h.includes("hg38") || h.includes("build 38")) {
    build = 'GRCh38';
  } else if (h.includes("grch37") || h.includes("hg19") || h.includes("build 37") || h.includes("ncbi36") || h.includes("hg18")) {
    build = 'GRCh37';
  }

  if (h.includes("23andme")) {
    format = "23andMe";
    if (h.includes("v5")) chip = "23andMe v5 (GSA)";
    else if (h.includes("v4")) chip = "23andMe v4 (OmniExpress)";
    else if (h.includes("v3")) chip = "23andMe v3 (OmniExpress)";
    else if (h.includes("v2")) chip = "23andMe v2 (Illumina)";
    else chip = "23andMe (Legacy)";
  } else if (h.includes("ancestrydna") || h.includes("ancestry")) {
    format = "AncestryDNA";
    if (h.includes("v3") || h.includes("version: v3") || h.includes("version: 3")) chip = "AncestryDNA v3 (GSA)";
    else if (h.includes("v2") || h.includes("version: v2") || h.includes("version: 2")) chip = "AncestryDNA v2 (GSA)";
    else if (h.includes("v1") || h.includes("version: v1") || h.includes("version: 1")) chip = "AncestryDNA v1 (OmniExpress)";
    else chip = "AncestryDNA";
  } else if (h.includes("myheritage")) {
    format = "MyHeritage";
    // MyHeritage offers both microarray (GSA) and WGS (VCF). Distinguish by VCF signals.
    if (h.includes("##fileformat=vcf") || h.includes("#chrom") || h.includes("##source=myheritage")) {
      chip = "MyHeritage WGS (VCF)";
    } else {
      chip = "MyHeritage DNA (GSA)";
    }
  } else if (h.includes("family tree dna") || h.includes("ftdna") || (h.includes("rsid") && h.includes("result") && !h.includes("myheritage"))) {
    format = "FTDNA";
    chip = "FTDNA Family Finder";
  } else if (h.includes("living dna") || h.includes("livingdna")) {
    format = "Living DNA";
    chip = "Living DNA (GSA)";
  } else if (h.includes("tellmegen")) {
    format = "TellmeGen";
    chip = "TellmeGen Raw Data";
  } else if (h.includes("24genetics")) {
    format = "24Genetics";
    chip = "24Genetics Raw Data";
  } else if (h.includes("wegene")) {
    format = "WeGene";
    chip = "WeGene Affymetrix/GSA";
  } else if (h.includes("dante labs") || h.includes("dantelabs")) {
    format = "Dante Labs";
    chip = "Dante Labs Whole Genome";
  } else if (h.includes("nebula")) {
    format = "Nebula Genomics";
    chip = "Nebula Genomics WGS";
  } else if (h.includes("geno 2.0") || h.includes("genographic")) {
    format = "Geno 2.0";
    chip = "National Geographic Geno 2.0";
  } else if (h.includes("genes for good") || h.includes("genesforgood")) {
    format = "Genes for Good";
    chip = "Genes for Good Affymetrix/Illumina";
  } else if (h.includes("circledna")) {
    format = "CircleDNA";
    chip = "CircleDNA Whole Exome";
  } else if (h.includes("##fileformat=vcf") || h.includes("#chrom\tpos\tid\tref\talt") || h.includes("#chrom")) {
    format = "VCF";
    chip = "Variant Call Format (VCF)";
  }

  return { format, chip, build };
}

export function inferBiologicalSex(
  yCount: number,
  xHetCount: number,
  xTotalCount: number
): 'MALE' | 'FEMALE' | 'UNKNOWN' {
  if (yCount >= 15) return 'MALE';
  if (xTotalCount >= 50) {
    const xHetRate = xHetCount / xTotalCount;
    // Female X heterozygosity is typically 20-30% on non-PAR X.
    // Use 0.08 as conservative lower bound to handle low-density chips (fewer X AIMs).
    if (xHetRate > 0.08 && yCount <= 5) return 'FEMALE';
    if (xHetRate < 0.03 && yCount >= 10) return 'MALE';
  }
  if (yCount >= 10) return 'MALE';
  if (yCount <= 2 && xTotalCount > 20) return 'FEMALE';
  return 'UNKNOWN';
}

export interface VcfDecodedResult {
  genotype: string;
  isPhased: boolean;
  allele1: string;
  allele2: string;
  phaseSet?: string;
}

export function decodeVcfGenotype(ref: string, alt: string, gtVal: string, psVal?: string): VcfDecodedResult | null {
  if (!gtVal || gtVal === '.' || gtVal === './.' || gtVal === '.|.') return null;
  const isPhased = gtVal.includes('|');
  const gtParts = gtVal.split(/[\/|]/);
  const altAlleles = alt.split(',');

  // gVCF guard: skip rows whose ALT is a gVCF reference-block placeholder.
  // <NON_REF>, <*>, and <M> are gVCF-only signals with no variant call.
  // Structural variant ALTs like <DEL>, <INS>, <DUP>, <INV> carry real biological
  // meaning and must be passed through to normalizeAllele, so they are NOT skipped here.
  const isGvcfPlaceholder = (a: string) =>
    a === '<NON_REF>' || a === '<*>' || a === '<M>' ||
    /^<NON_REF(:\w+)?>$/i.test(a);
  const allGvcfPlaceholder = altAlleles.every(a => isGvcfPlaceholder(a));
  if (allGvcfPlaceholder) return null;

  // Classify any angle-bracket ALT as symbolic for per-allele routing
  const isSymbolicAlt = (a: string) => a.startsWith('<') && a.endsWith('>');

  const getAllele = (idxStr: string) => {
    if (idxStr === '0') return ref;
    if (idxStr === '.') return null; // Missing allele in multi-sample VCF — skip
    const idx = parseInt(idxStr, 10);
    if (isNaN(idx) || idx < 1 || idx > altAlleles.length) return null;
    const a = altAlleles[idx - 1];
    // gVCF placeholder mixed with real ALTs: skip only this specific allele slot
    if (isGvcfPlaceholder(a)) return null;
    return a;
  };
  const isHemizygous = gtParts.length === 1;
  const a1 = getAllele(gtParts[0]);
  const a2 = isHemizygous ? null : getAllele(gtParts[1] || gtParts[0]);

  // If either allele is missing/symbolic (null), skip this variant
  if (a1 === null) return null;

  const normalizeAllele = (a: string) => {
    if (!a || a === '-') return '-';
    if (a === '<DEL>' || a.includes('DEL')) return 'D';
    if (a === '<INS>' || a.includes('INS')) return 'I';
    if (a.length > 1) {
      return a.length > ref.length ? 'I' : a.length < ref.length ? 'D' : a[0];
    }
    return a;
  };

  const normA1 = normalizeAllele(a1);
  const normA2 = (isHemizygous || a2 === null) ? '' : normalizeAllele(a2);
  const cleanedGt = cleanGenotypeString(normA1 + normA2);
  if (!cleanedGt) return null;

  return {
    genotype: cleanedGt,
    isPhased,
    allele1: normA1,
    allele2: normA2 ?? '',
    phaseSet: psVal
  };
}


export function parseRawDNA(
  rawText: string, 
  allowlist?: Set<string>,
  onProgress?: (bytesProcessed: number, totalBytes: number, snpsFound: number) => void
): ParsedDnaData {
  let text = rawText;
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  const snpMap: Record<string, string> = {};
  const snpMetaMap: Record<string, { chrom: string, pos: number }> = {};
  const xMap: Record<string, string> = {};
  const yMap: Record<string, string> = {};
  const mtMap: Record<string, string> = {};
  const haplotype1Map: Record<string, string> = {};
  const haplotype2Map: Record<string, string> = {};
  const phaseSets: Record<string, string> = {};
  let phasedCount = 0;
  let snpCount = 0;
  let yDnaCalledSnps = 0;
  let xHetCount = 0;
  let xTotalCount = 0;
  
  const header = text.slice(0, 1500);
  
  const health = checkFileFormatHealth(text);
  if (!health.healthy) {
    throw new GenomicsParseError(health.reason || "Invalid file format", {
      errorCode: health.code || GenomicsErrorCode.ERR_FILE_EMPTY,
      legacyCode: 'ERR-4025FGD1',
      headerPreview: header.slice(0, 300),
      errorCategory: health.category || 'Invalid File Format',
      subsystem: 'HEALTH_VALIDATION',
      suggestedSolution: health.solution,
      bytesTotal: text.length
    });
  }

  const detectedInfo = detectVendorAndChip(header);
  let format = detectedInfo.format;
  let chip = detectedInfo.chip;
  let build = detectedInfo.build;

  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;
  let matchCount = 0;

  // Sniff delimiter, header columns and build execution plan
  const sampleLines = text.slice(0, 50000).split(/\r?\n/);
  const plan = sniffAndBuildParsePlan(sampleLines);

  const isVcf = plan.isVcf || format === "VCF" || format === "Dante Labs" || format === "Nebula Genomics" || header.toLowerCase().includes("##fileformat=vcf") || header.includes("#CHROM");
  // Resolve VCF column layout — use plan's parsed layout or re-derive
  const vcfLayout: VcfColumnLayout = plan.vcfLayout ?? parseVcfColumnLayout(sampleLines);
  const totalLength = text.length;
  let lineStart = 0;
  // gVCF-specific skip counters for structured zero-SNP diagnostics
  let vcfSkippedSymbolicAlt = 0;
  let vcfSkippedNoCall = 0;
  let vcfSkippedHomRef = 0;

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

    if (firstChar === 35 /* # */ || (firstChar === 47 /* / */ && text.charCodeAt(lineActualEnd - lineLen + 1) === 47) || isBoilerplateOrComment(line)) {
      linesCommented++;
      continue;
    }

    if (linesTotal === plan.headerLineIndex + 1) {
      continue;
    }

    if (isVcf) {
      if (linesTotal % 10000 === 0 && onProgress) {
        onProgress(lineStart, totalLength, snpCount);
      }
      const cols = line.split('\t');
      const minCols = Math.max(vcfLayout.sampleIdx + 1, 8);
      if (cols.length >= minCols) {
        const rawChrom = cols[vcfLayout.chromIdx] ?? '';
        const chrom = normalizeChromosome(rawChrom);
        const posStr = cols[vcfLayout.posIdx] ?? '';
        const pos = parseInt(posStr, 10);
        const id = cols[vcfLayout.idIdx] ?? '.';
        const ref = (cols[vcfLayout.refIdx] ?? '').toUpperCase();
        const alt = (cols[vcfLayout.altIdx] ?? '').toUpperCase();
        const formatCol = cols[vcfLayout.formatIdx] ?? '';
        const sampleCol = cols[vcfLayout.sampleIdx] ?? '';

        if (formatCol && sampleCol) {
          const formatFields = formatCol.split(':');
          const gtIdx = formatFields.indexOf('GT');
          const psIdx = formatFields.indexOf('PS');
          if (gtIdx !== -1) {
            const sampleFields = sampleCol.split(':');
            const gtVal = sampleFields[gtIdx] ?? '';
            const psVal = psIdx !== -1 ? sampleFields[psIdx] : undefined;
            // Track no-call genotypes for diagnostics
            if (!gtVal || gtVal === '.' || gtVal === './.' || gtVal === '.|.') {
              vcfSkippedNoCall++;
            } else if (gtVal === '0/0' || gtVal === '0|0' || gtVal === '0') {
              vcfSkippedHomRef++;
            } else {
              const decoded = decodeVcfGenotype(ref, alt, gtVal, psVal);
              // Track gVCF reference-block rows (NON_REF/placeholder ALTs) separately from malformed rows
              const isGvcfAlt = (a: string) => a === '<NON_REF>' || a === '<*>' || a === '<M>' || /^<NON_REF(:\w+)?>$/i.test(a);
              if (!decoded && alt.split(',').every(a => isGvcfAlt(a))) {
                vcfSkippedSymbolicAlt++;
              } else if (decoded) {
                const { genotype, isPhased: variantPhased, allele1, allele2, phaseSet } = decoded;
                const markerId = id !== '.' ? id.toLowerCase() : `chr${chrom}_${pos}`.toLowerCase();
                const coordId = !isNaN(pos) ? `chr${chrom}_${pos}`.toLowerCase() : '';
                const isYorMT = chrom === 'Y' || chrom === 'MT';
                if (!allowlist || isYorMT || allowlist.has(markerId) || (coordId && allowlist.has(coordId))) {
                  snpCount++;
                  snpMap[markerId] = genotype;
                  if (variantPhased) {
                    phasedCount++;
                    haplotype1Map[markerId] = allele1;
                    haplotype2Map[markerId] = allele2;
                    if (phaseSet) phaseSets[markerId] = phaseSet;
                  }
                  if (!isNaN(pos)) {
                    snpMetaMap[markerId] = { chrom, pos };
                    const coordId = `chr${chrom}_${pos}`.toLowerCase();
                    snpMap[coordId] = genotype;
                    if (variantPhased) {
                      haplotype1Map[coordId] = allele1;
                      haplotype2Map[coordId] = allele2;
                    }
                  }
                  if (chrom === 'X') {
                    xMap[markerId] = genotype;
                    xTotalCount++;
                    if (genotype.length === 2 && genotype[0] !== genotype[1] && !isPARRegion('X', pos)) {
                      xHetCount++;
                    }
                  }
                  if (chrom === 'Y') {
                    yMap[markerId] = genotype;
                    yDnaCalledSnps++;
                  }
                  if (chrom === 'MT') {
                    const allele = (genotype.length === 2 && genotype[0] === genotype[1]) ? genotype[0] : genotype;
                    if (allele && allele[0] !== '-') mtMap[posStr] = allele;
                  }
                }
              }
            }
          }
        }
      } else {
        linesMalformed++;
      }
    } else {
      let parsed: ParsedFields | null = null;
      if (plan.isStandard23andMe || plan.isStandardAncestry) {
        parsed = fastParseLine(line, plan.delim, plan.delimStr);
        if (!parsed && plan.mapping.isCustom) {
          parsed = parseAdaptiveLine(line, plan.delimStr, plan.mapping);
        }
      } else {
        parsed = parseAdaptiveLine(line, plan.delimStr, plan.mapping);
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
        if (chrom === 'X') {
          xMap[markerId] = genotype;
          xTotalCount++;
          if (genotype.length === 2 && genotype[0] !== genotype[1] && !isPARRegion('X', pos)) {
            xHetCount++;
          }
        }
        if (chrom === 'Y') {
          yMap[markerId] = genotype;
          yDnaCalledSnps++;
        }
        if (chrom === 'MT') {
          const allele = (genotype.length === 2 && genotype[0] === genotype[1]) ? genotype[0] : genotype;
          if (allele && allele[0] !== '-') mtMap[posStr] = allele;
        }
      } else {
        linesMalformed++;
      }
    }
  }

  // Refine chip detection based on total raw SNP count if still unknown
  if (chip === "Unknown Chip") {
    const effectiveSnpCount = matchCount || snpCount;
    if (effectiveSnpCount > 900000) chip = "High-Density Chip (Omni2.5 or similar)";
    else if (effectiveSnpCount > 600000) chip = "Standard GSA/OmniExpress Chip";
    else if (effectiveSnpCount > 300000) chip = "Low-Density Chip";
    else chip = `${format} Raw Data`;
  }

  if (snpCount === 0) {
    // Compose a structured reason string for diagnostic purposes
    let zeroSnpReason = 'unknown';
    let zeroSnpSuggestion = 'Make sure that the file lists SNPs with standard columns (rsID, chromosome, physical position, and allele genotype letters).';
    if (isVcf && vcfSkippedSymbolicAlt > 0 && vcfSkippedHomRef > 0) {
      zeroSnpReason = `gvcf_nonref (${vcfSkippedSymbolicAlt.toLocaleString()} symbolic ALT rows, ${vcfSkippedHomRef.toLocaleString()} hom-ref rows)`;
      zeroSnpSuggestion = 'This appears to be a gVCF (genomic VCF) file with reference-block records. GenomicScout processes variant-only VCFs. Please export a variant-filtered VCF from your provider, or contact support.';
    } else if (isVcf && vcfSkippedSymbolicAlt > 0) {
      zeroSnpReason = `symbolic_alt_only (${vcfSkippedSymbolicAlt.toLocaleString()} rows skipped)`;
      zeroSnpSuggestion = 'The VCF file contains only symbolic ALT alleles (<NON_REF>, <*>, etc.) typical of gVCF files. Please re-export your data as a variant-only VCF.';
    } else if (isVcf && vcfSkippedNoCall > 50) {
      zeroSnpReason = `all_no_call (${vcfSkippedNoCall.toLocaleString()} ./. records)`;
      zeroSnpSuggestion = 'All genotype records are no-call (./.). This VCF may be malformed or empty. Please re-export your data from your provider.';
    } else if (linesMalformed > linesTotal * 0.5 && linesTotal > 10) {
      zeroSnpReason = 'column_mismatch';
      zeroSnpSuggestion = 'More than 50% of lines could not be parsed. The delimiter or column order may be non-standard. If you are using a UK or EU locale, try opening the file in a text editor and verifying it is tab-separated.';
    }
    throw new GenomicsParseError(
      `ERR-4025FGD1 (ERR_PARSE_ZERO_SNPS): The file contains no parseable genetic markers. Reason: ${zeroSnpReason}.`,
      {
        errorCode: GenomicsErrorCode.ERR_PARSE_ZERO_SNPS,
        legacyCode: 'ERR-4025FGD1',
        format,
        chip,
        bytesTotal: text.length,
        linesTotal,
        linesCommented,
        linesMalformed,
        errorCategory: "No Valid Genetic Markers Found (ERR-4025FGD1)",
        suggestedSolution: zeroSnpSuggestion,
        context: isVcf ? {
          vcfSkippedSymbolicAlt,
          vcfSkippedNoCall,
          vcfSkippedHomRef,
          vcfLayout: { ...vcfLayout }
        } : undefined
      }
    );
  }

  if (onProgress) {
    onProgress(totalLength, totalLength, snpCount);
  }

  const inferredBiologicalSex = inferBiologicalSex(yDnaCalledSnps, xHetCount, xTotalCount);

  const isPhased = phasedCount > 0 && phasedCount >= Math.min(5, snpCount * 0.1);
  const phasingMethod = isPhased ? 'VCF_PHASED' : 'UNPHASED';

  return {
    format,
    chip,
    build,
    snpCount,
    rawSnpsCount: matchCount,
    totalSnps: matchCount || snpCount,
    yDnaSnps: Object.keys(yMap).length,
    yDnaCalledSnps,
    mtDnaSnps: Object.keys(mtMap).length,
    inferredBiologicalSex,
    snpMap,
    snpMetaMap,
    xMap,
    yMap,
    mtMap,
    snpByRsid: snpMap,
    snpByPosition: Object.fromEntries(
      Object.entries(snpMetaMap).map(([rs, m]) => [`${m.chrom}:${m.pos}`, snpMap[rs]])
    ),
    isPhased,
    phasedCount,
    phasingMethod,
    haplotype1Map: Object.keys(haplotype1Map).length > 0 ? haplotype1Map : undefined,
    haplotype2Map: Object.keys(haplotype2Map).length > 0 ? haplotype2Map : undefined,
    phaseSets: Object.keys(phaseSets).length > 0 ? phaseSets : undefined
  };
}

export async function parseRawDNAStream(
  file: File | Blob,
  allowlist?: Set<string>,
  onProgress?: (bytesProcessed: number, totalBytes: number, snpsFound: number) => void
) {
  // Check for GZIP (\x1f\x8b) or ZIP (PK\x03\x04) signatures on sample slice
  const sampleSlice = file.slice(0, Math.min(65536, file.size));
  const sampleBuf = new Uint8Array(await sampleSlice.arrayBuffer());

  const isGzip = sampleBuf.length >= 2 && sampleBuf[0] === 0x1f && sampleBuf[1] === 0x8b;
  const isZip = sampleBuf.length >= 4 && sampleBuf[0] === 0x50 && sampleBuf[1] === 0x4b;

  if (isZip || (isGzip && typeof DecompressionStream === 'undefined')) {
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
  const haplotype1Map: Record<string, string> = {};
  const haplotype2Map: Record<string, string> = {};
  const phaseSets: Record<string, string> = {};
  let phasedCount = 0;
  let snpCount = 0;
  let yDnaCalledSnps = 0;
  let xHetCount = 0;
  let xTotalCount = 0;

  const totalBytes = file.size;
  let bytesProcessed = 0;

  const stream = isGzip ? file.stream().pipeThrough(new DecompressionStream('gzip')) : file.stream();
  const reader = stream.getReader();

  let firstChunkText = '';
  let initialBuffer = new Uint8Array(0);

  if (isGzip) {
    // Read first ~64KB of decompressed text for health check and plan detection
    while (firstChunkText.length < 65536) {
      const { done, value } = await reader.read();
      if (done) break;
      const combined = new Uint8Array(initialBuffer.length + value.length);
      combined.set(initialBuffer);
      combined.set(value, initialBuffer.length);
      initialBuffer = combined;
      firstChunkText = DECODER.decode(initialBuffer, { stream: true });
    }

    // Detect double compression (e.g. .vcf.gz.gz or .zip.gz) where inner bytes are still compressed
    const isInnerCompressed = initialBuffer.length >= 2 && (
      (initialBuffer[0] === 0x1f && initialBuffer[1] === 0x8b) ||
      (initialBuffer.length >= 4 && initialBuffer[0] === 0x50 && initialBuffer[1] === 0x4b)
    );
    if (isInnerCompressed) {
      const chunks: Uint8Array[] = [initialBuffer];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value && value.length > 0) chunks.push(value);
      }
      const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
      const fullDecomp = new Uint8Array(totalLen);
      let offset = 0;
      for (const c of chunks) {
        fullDecomp.set(c, offset);
        offset += c.length;
      }
      const finalDecomp = decompressGenomicBuffer(fullDecomp);
      const text = DECODER.decode(finalDecomp);
      return parseRawDNA(text, allowlist, onProgress);
    }
  } else {
    const firstSlice = file.slice(0, Math.min(65536, file.size));
    firstChunkText = await firstSlice.text();
  }

  const header = firstChunkText.slice(0, 1500);

  const health = checkFileFormatHealth(firstChunkText);
  if (!health.healthy) {
    throw new GenomicsParseError(health.reason || "Invalid file format", {
      errorCode: health.code || GenomicsErrorCode.ERR_FILE_EMPTY,
      legacyCode: 'ERR-4025FGD1',
      headerPreview: header.slice(0, 300),
      errorCategory: health.category || 'Invalid File Format',
      subsystem: 'HEALTH_VALIDATION',
      suggestedSolution: health.solution,
      bytesTotal: file.size
    });
  }

  const detectedInfo = detectVendorAndChip(header);
  let format = detectedInfo.format;
  let chip = detectedInfo.chip;
  let build = detectedInfo.build;

  const sampleLines = firstChunkText.split(/\r?\n/);
  const plan = sniffAndBuildParsePlan(sampleLines);
  const isVcf = plan.isVcf || format === "VCF" || format === "Dante Labs" || format === "Nebula Genomics" || header.toLowerCase().includes("##fileformat=vcf") || header.includes("#CHROM");
  // Resolve dynamic VCF column layout
  const vcfLayout: VcfColumnLayout = plan.vcfLayout ?? parseVcfColumnLayout(sampleLines);

  let remainder = new Uint8Array(0);

  let linesTotal = 0;
  let linesCommented = 0;
  let linesMalformed = 0;
  // gVCF-specific skip counters for structured zero-SNP diagnostics
  let vcfSkippedSymbolicAlt = 0;
  let vcfSkippedNoCall = 0;
  let vcfSkippedHomRef = 0;

  let lastYield = performance.now();
  const YIELD_INTERVAL = 150; // ms

  while (true) {
    let chunk: Uint8Array | undefined;
    let isStreamDone = false;

    if (initialBuffer.length > 0) {
      chunk = initialBuffer;
      initialBuffer = new Uint8Array(0);
    } else {
      const { done, value } = await reader.read();
      if (done && remainder.length === 0) break;
      isStreamDone = done;
      chunk = value;
    }

    if (chunk) {
      bytesProcessed += chunk.length;
    }

    const now = performance.now();
    if (now - lastYield > YIELD_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, 0));
      lastYield = performance.now();
    }

    const chunkLen = chunk ? chunk.length : 0;
    const combined = new Uint8Array(remainder.length + chunkLen);
    combined.set(remainder);
    if (chunk) combined.set(chunk, remainder.length);

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

      if (combined[lineStart] === HASH || combined[lineStart] === 0x2F /* / */) {
        linesCommented++;
        continue;
      }

      if (linesTotal === plan.headerLineIndex + 1) {
        continue; // Skip table header line
      }

      if (isVcf) {
        let actualLineEnd = lineEnd - 1; // exclude LF
        if (actualLineEnd > lineStart && combined[actualLineEnd - 1] === CR) actualLineEnd--;
        const line = DECODER.decode(combined.subarray(lineStart, actualLineEnd));
        const cols = line.split('\t');
        const minCols = Math.max(vcfLayout.sampleIdx + 1, 8);
        if (cols.length >= minCols) {
          const rawChrom = cols[vcfLayout.chromIdx] ?? '';
          const chrom = normalizeChromosome(rawChrom);
          const posStr = cols[vcfLayout.posIdx] ?? '';
          const colPos = parseInt(posStr, 10);
          const id = cols[vcfLayout.idIdx] ?? '.';
          const ref = (cols[vcfLayout.refIdx] ?? '').toUpperCase();
          const alt = (cols[vcfLayout.altIdx] ?? '').toUpperCase();
          const formatCol = cols[vcfLayout.formatIdx] ?? '';
          const sampleCol = cols[vcfLayout.sampleIdx] ?? '';

          if (formatCol && sampleCol) {
            const formatFields = formatCol.split(':');
            const gtIdx = formatFields.indexOf('GT');
            const psIdx = formatFields.indexOf('PS');
            if (gtIdx !== -1) {
              const sampleFields = sampleCol.split(':');
              const gtVal = sampleFields[gtIdx] ?? '';
              const psVal = psIdx !== -1 ? sampleFields[psIdx] : undefined;
              // Track no-call genotypes for diagnostics
              if (!gtVal || gtVal === '.' || gtVal === './.' || gtVal === '.|.') {
                vcfSkippedNoCall++;
              } else if (gtVal === '0/0' || gtVal === '0|0' || gtVal === '0') {
                vcfSkippedHomRef++;
              } else {
                const decoded = decodeVcfGenotype(ref, alt, gtVal, psVal);
                const isGvcfAlt = (a: string) => a === '<NON_REF>' || a === '<*>' || a === '<M>' || /^<NON_REF(:\w+)?>$/i.test(a);
                if (!decoded && alt.split(',').every(a => isGvcfAlt(a))) {
                  vcfSkippedSymbolicAlt++;
                } else if (decoded) {
                  const { genotype, isPhased: variantPhased, allele1, allele2, phaseSet } = decoded;
                  const markerId = id !== '.' ? id.toLowerCase() : `chr${chrom}_${colPos}`.toLowerCase();
                  const coordId = !isNaN(colPos) ? `chr${chrom}_${colPos}`.toLowerCase() : '';
                  const isYorMT = chrom === 'Y' || chrom === 'MT';
                  if (!allowlist || isYorMT || allowlist.has(markerId) || (coordId && allowlist.has(coordId))) {
                    snpCount++;
                    snpMap[markerId] = genotype;
                    if (variantPhased) {
                      phasedCount++;
                      haplotype1Map[markerId] = allele1;
                      haplotype2Map[markerId] = allele2;
                      if (phaseSet) phaseSets[markerId] = phaseSet;
                    }
                    if (!isNaN(colPos)) {
                      snpMetaMap[markerId] = { chrom, pos: colPos };
                      const coordId = `chr${chrom}_${colPos}`.toLowerCase();
                      snpMap[coordId] = genotype;
                      if (variantPhased) {
                        haplotype1Map[coordId] = allele1;
                        haplotype2Map[coordId] = allele2;
                      }
                    }
                    if (chrom === 'X') {
                      xMap[markerId] = genotype;
                      xTotalCount++;
                      if (genotype.length === 2 && genotype[0] !== genotype[1] && !isPARRegion('X', colPos)) {
                        xHetCount++;
                      }
                    }
                    if (chrom === 'Y') {
                      yMap[markerId] = genotype;
                      yDnaCalledSnps++;
                    }
                    if (chrom === 'MT') {
                      const allele = (genotype.length === 2 && genotype[0] === genotype[1]) ? genotype[0] : genotype;
                      if (allele && allele[0] !== '-') mtMap[posStr] = allele;
                    }
                  }
                }
              }
            }
          }
        } else {
          linesMalformed++;
        }
      } else {
        let parsed: ParsedFields | null = null;
        if ((plan.isStandard23andMe || plan.isStandardAncestry) && plan.delim === TAB) {
          parsed = parseLineBytes(combined, lineStart, lineEnd - 1, TAB);
          if (!parsed) {
            let actEnd = lineEnd - 1;
            if (actEnd > lineStart && combined[actEnd - 1] === CR) actEnd--;
            const lineStr = DECODER.decode(combined.subarray(lineStart, actEnd));
            if (!isBoilerplateOrComment(lineStr)) {
              parsed = parseAdaptiveLine(lineStr, plan.delimStr, plan.mapping);
            }
          }
        } else {
          let actEnd = lineEnd - 1;
          if (actEnd > lineStart && combined[actEnd - 1] === CR) actEnd--;
          const lineStr = DECODER.decode(combined.subarray(lineStart, actEnd));
          if (!isBoilerplateOrComment(lineStr)) {
            parsed = parseAdaptiveLine(lineStr, plan.delimStr, plan.mapping);
          }
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
            if (chrom === 'X') {
              xMap[markerId] = genotype;
              xTotalCount++;
              if (genotype.length === 2 && genotype[0] !== genotype[1] && !isPARRegion('X', colPos)) {
                xHetCount++;
              }
            }
            if (chrom === 'Y') {
              yMap[markerId] = genotype;
              yDnaCalledSnps++;
            }
            if (chrom === 'MT') {
              const allele = (genotype.length === 2 && genotype[0] === genotype[1]) ? genotype[0] : genotype;
              if (allele && allele[0] !== '-') mtMap[posStr] = allele;
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

    if (isStreamDone) break;
  }

  // Handle remaining bytes if any
  if (remainder.length > 0 && remainder[0] !== HASH) {
    linesTotal++;
    if (!isVcf) {
      let parsed: ParsedFields | null = null;
      if ((plan.isStandard23andMe || plan.isStandardAncestry) && plan.delim === TAB) {
        parsed = parseLineBytes(remainder, 0, remainder.length, TAB);
      }
      if (!parsed) {
        const lineStr = DECODER.decode(remainder);
        if (!isBoilerplateOrComment(lineStr)) {
          parsed = parseAdaptiveLine(lineStr, plan.delimStr, plan.mapping);
        }
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
          if (chrom === 'X') {
            xMap[markerId] = genotype;
            xTotalCount++;
            if (genotype.length === 2 && genotype[0] !== genotype[1] && !isPARRegion('X', colPos)) {
              xHetCount++;
            }
          }
          if (chrom === 'Y') {
            yMap[markerId] = genotype;
            yDnaCalledSnps++;
          }
          if (chrom === 'MT') {
            const allele = (genotype.length === 2 && genotype[0] === genotype[1]) ? genotype[0] : genotype;
            if (allele && allele[0] !== '-') mtMap[posStr] = allele;
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
    let zeroSnpReason = 'unknown';
    let zeroSnpSuggestion = 'Make sure you downloaded \'all SNPs\' or \'raw data text\' rather than mitochondrial-only sequences or visual screenshots. The file should contain rsIDs and genotypes.';
    if (isVcf && vcfSkippedSymbolicAlt > 0 && vcfSkippedHomRef > 0) {
      zeroSnpReason = `gvcf_nonref (${vcfSkippedSymbolicAlt.toLocaleString()} symbolic ALT rows, ${vcfSkippedHomRef.toLocaleString()} hom-ref rows)`;
      zeroSnpSuggestion = 'This appears to be a gVCF (genomic VCF) file with reference-block records. GenomicScout processes variant-only VCFs. Please export a variant-filtered VCF from your provider, or contact support.';
    } else if (isVcf && vcfSkippedSymbolicAlt > 0) {
      zeroSnpReason = `symbolic_alt_only (${vcfSkippedSymbolicAlt.toLocaleString()} rows skipped)`;
      zeroSnpSuggestion = 'The VCF file contains only symbolic ALT alleles (<NON_REF>, <*>, etc.) typical of gVCF files. Please re-export your data as a variant-only VCF.';
    } else if (isVcf && vcfSkippedNoCall > 50) {
      zeroSnpReason = `all_no_call (${vcfSkippedNoCall.toLocaleString()} ./. records)`;
      zeroSnpSuggestion = 'All genotype records are no-call (./.). This VCF may be malformed or empty. Please re-export your data from your provider.';
    } else if (linesMalformed > linesTotal * 0.5 && linesTotal > 10) {
      zeroSnpReason = 'column_mismatch';
      zeroSnpSuggestion = 'More than 50% of lines could not be parsed. The delimiter or column order may be non-standard. If you are using a UK or EU locale, try opening the file in a text editor and verifying it is tab-separated.';
    }
    throw new GenomicsParseError(
      `ERR-4025FGD1 (ERR_PARSE_ZERO_SNPS): The file contains no parseable genetic markers. Reason: ${zeroSnpReason}.`,
      {
        errorCode: GenomicsErrorCode.ERR_PARSE_ZERO_SNPS,
        legacyCode: 'ERR-4025FGD1',
        format, chip, bytesTotal: file.size, linesTotal, linesCommented, linesMalformed,
        errorCategory: "Empty Ingestion Spectrum (ERR-4025FGD1)",
        subsystem: 'STREAM_PARSER',
        suggestedSolution: zeroSnpSuggestion,
        context: isVcf ? { vcfSkippedSymbolicAlt, vcfSkippedNoCall, vcfSkippedHomRef, vcfLayout: { ...vcfLayout } } : undefined
      }
    );
  }

  if (onProgress) {
    onProgress(file.size, file.size, snpCount);
  }

  const inferredBiologicalSex = inferBiologicalSex(yDnaCalledSnps, xHetCount, xTotalCount);

  const isPhased = phasedCount > 0 && phasedCount >= Math.min(5, snpCount * 0.1);
  const phasingMethod = isPhased ? 'VCF_PHASED' : 'UNPHASED';

  return {
    format,
    chip,
    build,
    snpCount,
    rawSnpsCount: snpCount,
    totalSnps: snpCount,
    yDnaSnps: Object.keys(yMap).length,
    yDnaCalledSnps,
    mtDnaSnps: Object.keys(mtMap).length,
    inferredBiologicalSex,
    snpMap,
    snpMetaMap,
    xMap,
    yMap,
    mtMap,
    snpByRsid: snpMap,
    snpByPosition: Object.fromEntries(
      Object.entries(snpMetaMap).map(([rs, m]) => [`${m.chrom}:${m.pos}`, snpMap[rs]])
    ),
    isPhased,
    phasedCount,
    phasingMethod,
    haplotype1Map: Object.keys(haplotype1Map).length > 0 ? haplotype1Map : undefined,
    haplotype2Map: Object.keys(haplotype2Map).length > 0 ? haplotype2Map : undefined,
    phaseSets: Object.keys(phaseSets).length > 0 ? phaseSets : undefined
  };
}

/**
 * Micro-phases an unphased commercial DNA dataset into Strand A (Haplotype 1)
 * and Strand B (Haplotype 2) using AIM allele frequencies and reference priors.
 */
export function microPhaseDataset(
  parsed: ParsedDnaData,
  aimsDatabase: Record<string, any> = {}
): ParsedDnaData & { confidence: number } {
  const haplotype1Map: Record<string, string> = {};
  const haplotype2Map: Record<string, string> = {};
  let totalHetero = 0;
  let anchoredHetero = 0;

  for (const [rsid, geno] of Object.entries(parsed.snpMap)) {
    if (!geno || geno.length < 2) {
      haplotype1Map[rsid] = geno || '-';
      haplotype2Map[rsid] = geno || '-';
      continue;
    }

    const a1 = geno[0];
    const a2 = geno[1];

    if (a1 === a2) {
      haplotype1Map[rsid] = a1;
      haplotype2Map[rsid] = a2;
    } else {
      totalHetero++;
      const lower = rsid.toLowerCase();
      const aim = aimsDatabase[lower] || aimsDatabase[rsid];
      const effAllele = aim?.alleles?.[0]?.toUpperCase();
      const freqs = aim?.frequencies || {};
      const vals = Object.values(freqs).filter((v): v is number => typeof v === 'number');
      const avgFreq = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0.5;

      if (effAllele && (a1.toUpperCase() === effAllele || a2.toUpperCase() === effAllele)) {
        anchoredHetero++;
        if (a1.toUpperCase() === effAllele) {
          if (avgFreq >= 0.5) {
            haplotype1Map[rsid] = a1;
            haplotype2Map[rsid] = a2;
          } else {
            haplotype1Map[rsid] = a2;
            haplotype2Map[rsid] = a1;
          }
        } else {
          if (avgFreq >= 0.5) {
            haplotype1Map[rsid] = a2;
            haplotype2Map[rsid] = a1;
          } else {
            haplotype1Map[rsid] = a1;
            haplotype2Map[rsid] = a2;
          }
        }
      } else {
        // Unanchored het locus: maintain consistent order
        haplotype1Map[rsid] = a1;
        haplotype2Map[rsid] = a2;
      }
    }
  }

  const confidence = totalHetero === 0 ? 1.0 : Number((anchoredHetero / totalHetero).toFixed(2));
  return {
    ...parsed,
    isPhased: true,
    phasedCount: Object.keys(haplotype1Map).length,
    phasingMethod: 'STATISTICAL_MICROPHASED',
    haplotype1Map,
    haplotype2Map,
    confidence
  };
}
