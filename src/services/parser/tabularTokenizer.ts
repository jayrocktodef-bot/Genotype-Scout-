import { ColumnMapping, VariantRecord } from './types';
import { normalizeChromosome } from './vcfTokenizer';
import { DECODER, TAB, LF, CR, SPACE, COMMA, SEMICOLON, QUOTE } from './byteStream';

export const VALID_BASE_CODES = new Set([
  65 /* A */, 67 /* C */, 71 /* G */, 84 /* T */, 68 /* D */, 73 /* I */, 78 /* N */, 45 /* - */
]);

export const isValidAlleleByte = (b: number): boolean =>
  b === 0x41 /* A */ ||
  b === 0x43 /* C */ ||
  b === 0x47 /* G */ ||
  b === 0x54 /* T */ ||
  b === 0x49 /* I */ ||
  b === 0x44 /* D */ ||
  b === 0x4e /* N */ ||
  b === 0x2d /* - */;

export const IUPAC_DEGENERATE_MAP: Record<string, string> = {
  R: 'AG', // Purine (A or G)
  Y: 'CT', // Pyrimidine (C or T)
  S: 'CG', // Strong (C or G)
  W: 'AT', // Weak (A or T)
  K: 'GT', // Keto (G or T)
  M: 'AC'  // Amino (A or C)
};

export const UNCALLED_GENOTYPES = new Set([
  '--', '__', '00', '??', './.', '.|.', '-', '.', '0', '?',
  'NA', 'NN', 'NULL', 'NC', 'NOT_CALLED', 'N', 'N/N', 'NA/NA', 'NONE', 'UNCONFIRMED'
]);

export function cleanGenotypeString(rawGenotype: string): string | null {
  if (!rawGenotype) return null;
  let g = rawGenotype.trim().toUpperCase().replace(/["'\s\/|_]/g, '');
  if (UNCALLED_GENOTYPES.has(g)) {
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

  // IUPAC Degenerate single-letter code conversion
  if (g.length === 1 && IUPAC_DEGENERATE_MAP[g]) {
    g = IUPAC_DEGENERATE_MAP[g];
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

export function isValidGenotype(genotype: string): boolean {
  return cleanGenotypeString(genotype) !== null;
}

/**
 * High-speed byte-level line scanner for standard 4-column (23andMe) and 5-column (Ancestry) tabbed records.
 */
export function parseLineBytes(
  buf: Uint8Array,
  start: number,
  end: number,
  delim: number = TAB
): VariantRecord | null {
  let col = 0;
  let s0 = start, e0 = -1;
  let s1 = -1, e1 = -1;
  let s2 = -1, e2 = -1;
  let s3 = -1, e3 = -1;
  let s4 = -1, e4 = -1;

  for (let i = start; i < end; i++) {
    if (buf[i] === delim) {
      if (col === 0) { e0 = i; s1 = i + 1; }
      else if (col === 1) { e1 = i; s2 = i + 1; }
      else if (col === 2) { e2 = i; s3 = i + 1; }
      else if (col === 3) { e3 = i; s4 = i + 1; }
      col++;
    }
  }

  if (col === 3) {
    e3 = end;
  } else if (col >= 4) {
    if (e3 === -1) e3 = end;
    if (s4 !== -1) {
      e4 = end;
      for (let j = s4; j < end; j++) {
        if (buf[j] === delim) {
          e4 = j;
          break;
        }
      }
    }
  } else {
    return null;
  }

  if (e0 <= s0 || e1 <= s1 || e2 <= s2) return null;

  const markerId = DECODER.decode(buf.subarray(s0, e0)).trim().toLowerCase();
  if (!markerId) return null;

  const chromRaw = DECODER.decode(buf.subarray(s1, e1));
  const chrom = normalizeChromosome(chromRaw);

  let pos = 0;
  for (let i = s2; i < e2; i++) {
    const b = buf[i];
    if (b >= 0x30 && b <= 0x39) {
      pos = pos * 10 + (b - 0x30);
    }
  }
  if (pos <= 0) return null;
  const posStr = String(pos);

  let genotype: string | null = null;

  if (col === 3) {
    const rawGt = DECODER.decode(buf.subarray(s3, e3));
    genotype = cleanGenotypeString(rawGt);
  } else if (s4 !== -1 && e4 > s4) {
    const a1Raw = DECODER.decode(buf.subarray(s3, e3)).trim().toUpperCase();
    const a2Raw = DECODER.decode(buf.subarray(s4, e4)).trim().toUpperCase();

    if (a1Raw === '0' || a1Raw === '.' || a1Raw === '-' || a1Raw === '') {
      if (a2Raw && a2Raw !== '0' && a2Raw !== '.' && a2Raw !== '-') {
        genotype = cleanGenotypeString(a2Raw);
      }
    } else if (a2Raw === '0' || a2Raw === '.' || a2Raw === '-' || a2Raw === '') {
      genotype = cleanGenotypeString(a1Raw);
    } else {
      genotype = cleanGenotypeString(a1Raw + a2Raw);
    }
  }

  if (!genotype) return null;

  return {
    markerId,
    chrom,
    pos,
    posStr,
    genotype
  };
}

const stripQuotes = (s: string): string => {
  if (!s) return '';
  let res = s.trim();
  if (res.startsWith('"') && res.endsWith('"') && res.length >= 2) {
    res = res.substring(1, res.length - 1).trim();
  } else if (res.startsWith("'") && res.endsWith("'") && res.length >= 2) {
    res = res.substring(1, res.length - 1).trim();
  }
  return res;
};

export function parseAdaptiveLine(
  line: string,
  delimStr: string,
  mapping: ColumnMapping
): VariantRecord | null {
  const rawParts = delimStr === ' ' ? line.trim().split(/\s+/) : line.split(delimStr);
  const parts = rawParts.map(stripQuotes);

  const minRequired = Math.max(
    mapping.chromIdx,
    mapping.posIdx,
    mapping.hasSplitAlleles ? Math.max(mapping.allele1Idx, mapping.allele2Idx) : mapping.gtIdx
  );

  if (parts.length <= minRequired) return null;

  const rawMarker = mapping.rsidIdx !== -1 && mapping.rsidIdx < parts.length ? parts[mapping.rsidIdx] : '';
  const chromRaw = parts[mapping.chromIdx] || '';
  const chrom = normalizeChromosome(chromRaw);
  const posStr = parts[mapping.posIdx] || '';
  const pos = parseInt(posStr, 10);
  if (isNaN(pos) || pos <= 0) return null;

  let genotype: string | null = null;
  if (mapping.hasSplitAlleles) {
    const a1 = parts[mapping.allele1Idx] || '';
    const a2 = parts[mapping.allele2Idx] || '';
    if (a1 === '0' || a1 === '.' || a1 === '-' || a1 === '') {
      if (a2 && a2 !== '0' && a2 !== '.' && a2 !== '-') {
        genotype = cleanGenotypeString(a2);
      }
    } else if (a2 === '0' || a2 === '.' || a2 === '-' || a2 === '') {
      genotype = cleanGenotypeString(a1);
    } else {
      genotype = cleanGenotypeString(a1 + a2);
    }
  } else if (mapping.gtIdx !== -1 && mapping.gtIdx < parts.length) {
    genotype = cleanGenotypeString(parts[mapping.gtIdx]);
  }

  if (!genotype) return null;

  let cleanMarker = rawMarker.trim().toLowerCase();
  if (!cleanMarker || cleanMarker === '.' || cleanMarker === '-') {
    cleanMarker = `chr${chrom}_${pos}`.toLowerCase();
  }

  return {
    markerId: cleanMarker,
    chrom,
    pos,
    posStr,
    genotype
  };
}
