import { VcfColumnLayout, VariantRecord } from './types';
import { cleanGenotypeString } from './tabularTokenizer';
import { DECODER } from './byteStream';

export function normalizeChromosome(chromRaw: string): string {
  let chrom = chromRaw.trim().toUpperCase();
  if (chrom.startsWith('CHR')) chrom = chrom.slice(3);
  if (chrom === '23' || chrom === 'X' || chrom === 'XY') return 'X';
  if (chrom === '24' || chrom === 'Y') return 'Y';
  if (chrom === '25' || chrom === 'PAR' || chrom === 'PAR1') return 'X';
  if (chrom === '26' || chrom === 'M' || chrom === 'MT' || chrom === 'MITO' || chrom === 'MITOCHONDRIAL') return 'MT';
  if (chrom === '0' || chrom === 'UN' || chrom === 'UNKNOWN') return 'UN';
  return chrom;
}

export function isPARRegion(chrom: string, pos: number): boolean {
  if (chrom !== 'X' && chrom !== 'Y') return false;
  return (
    (pos >= 10000 && pos <= 2781500) ||
    (pos >= 154930000 && pos <= 156031000)
  );
}

export interface DecodedVcfGenotype {
  genotype: string;
  isPhased: boolean;
  allele1: string;
  allele2: string;
  phaseSet?: string;
}

export function decodeVcfGenotype(
  ref: string,
  alt: string,
  gtVal: string,
  psVal?: string
): DecodedVcfGenotype | null {
  if (!gtVal || gtVal === '.' || gtVal === './.' || gtVal === '.|.') return null;
  const isPhased = gtVal.includes('|');
  let gtParts = gtVal.split(/[\/|]/);
  if (gtParts.length === 1 && gtVal.length === 2 && /^[ACGT]{2}$/i.test(gtVal)) {
    gtParts = [gtVal[0], gtVal[1]];
  }
  const altAlleles = alt.split(',');

  const isGvcfPlaceholder = (a: string) =>
    a === '<NON_REF>' || a === '<*>' || a === '<M>' || /^<NON_REF(:\w+)?>$/i.test(a);
  const allGvcfPlaceholder = altAlleles.every(a => isGvcfPlaceholder(a));
  if (allGvcfPlaceholder) return null;

  const getAllele = (idxStr: string) => {
    if (idxStr === '0') return ref;
    if (idxStr === '.') return null;
    const idx = parseInt(idxStr, 10);
    if (isNaN(idx)) {
      const cleanUpper = idxStr.trim().toUpperCase();
      if (/^[ACGTDI\-]+$/i.test(cleanUpper)) {
        return cleanUpper;
      }
      return null;
    }
    if (idx < 1 || idx > altAlleles.length) return null;
    const a = altAlleles[idx - 1];
    if (isGvcfPlaceholder(a)) return null;
    return a;
  };

  const isHemizygous = gtParts.length === 1;
  const a1 = getAllele(gtParts[0]);
  const a2 = isHemizygous ? null : getAllele(gtParts[1]);

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
  const normA2 = isHemizygous || a2 === null ? '' : normalizeAllele(a2);
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

export interface VcfLineResult {
  record?: VariantRecord;
  isNoCall?: boolean;
  isHomRef?: boolean;
  isSymbolicAlt?: boolean;
}

export function parseVcfLine(
  lineStr: string,
  layout: VcfColumnLayout
): VcfLineResult {
  const cols = lineStr.split('\t');
  const minCols = Math.max(layout.sampleIdx + 1, 8);
  if (cols.length < minCols) {
    return {};
  }

  const rawChrom = cols[layout.chromIdx] ?? '';
  const chrom = normalizeChromosome(rawChrom);
  const posStr = cols[layout.posIdx] ?? '';
  const colPos = parseInt(posStr, 10);
  if (isNaN(colPos)) return {};

  const id = cols[layout.idIdx] ?? '.';
  const ref = (cols[layout.refIdx] ?? '').toUpperCase();
  const alt = (cols[layout.altIdx] ?? '').toUpperCase();
  const formatCol = cols[layout.formatIdx] ?? '';
  const sampleCol = cols[layout.sampleIdx] ?? '';

  if (!formatCol || !sampleCol) {
    return {};
  }

  const formatFields = formatCol.split(':');
  const gtIdx = formatFields.indexOf('GT');
  const psIdx = formatFields.indexOf('PS');

  if (gtIdx === -1) return {};

  const sampleFields = sampleCol.split(':');
  const gtVal = sampleFields[gtIdx] ?? '';
  const psVal = psIdx !== -1 ? sampleFields[psIdx] : undefined;

  if (!gtVal || gtVal === '.' || gtVal === './.' || gtVal === '.|.') {
    return { isNoCall: true };
  }

  const isGvcfAlt = (a: string) =>
    a === '<NON_REF>' || a === '<*>' || a === '<M>' || /^<NON_REF(:\w+)?>$/i.test(a);
  const isSymbolic = alt.split(',').every(a => isGvcfAlt(a));

  if (gtVal === '0/0' || gtVal === '0|0' || gtVal === '0') {
    return { isHomRef: true, isSymbolicAlt: isSymbolic };
  }

  if (isSymbolic) {
    return { isSymbolicAlt: true };
  }

  const decoded = decodeVcfGenotype(ref, alt, gtVal, psVal);
  if (!decoded) {
    return { isNoCall: true };
  }

  const markerId = id !== '.' ? id.toLowerCase() : `chr${chrom}_${colPos}`.toLowerCase();

  return {
    record: {
      markerId,
      chrom,
      pos: colPos,
      posStr,
      genotype: decoded.genotype,
      isPhased: decoded.isPhased,
      allele1: decoded.allele1,
      allele2: decoded.allele2,
      phaseSet: decoded.phaseSet
    }
  };
}
