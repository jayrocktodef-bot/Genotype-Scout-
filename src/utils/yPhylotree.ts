/**
 * Y-DNA phylotree helpers (Phase 1).
 *
 * The engine previously had no ancestral/derived allele data for Y-SNPs, so it
 * could not reliably call derived vs ancestral. This module models the enriched
 * SNP records (allele direction + coordinates) sourced from ybrowse.org (the
 * ISOGG/YBrowse Y-SNP database) and provides pure helpers for building the tree.
 */

export interface YSnpRecord {
  name: string;            // SNP name, e.g. "M269"
  rsid?: string;           // dbSNP id when available (chip-testable proxy)
  posHg38?: number;        // GRCh38 chrY position
  posHg19?: number;        // GRCh37 chrY position
  ancestral: string;       // ancestral allele (e.g. "T")
  derived: string;         // derived/mutation allele (e.g. "C")
  isoggHaplogroup?: string;// ISOGG longhand, e.g. "R1b1a1a2"
  mutation?: string;       // human-readable, e.g. "T to C"
}

export type YSnpIndex = Record<string, YSnpRecord>; // keyed by uppercased SNP name

export interface YPhylotreeBranch {
  branchName: string;
  parent: string | null;
  definingSNPs: YSnpRecord[];   // resolved (allele-aware) defining SNPs
  unresolvedSNPs: string[];     // defining SNP names with no allele data yet
  rsids: string[];
}

export interface YPhylotreeDataset {
  version: string;
  source: string;
  generatedAt: string;
  snpCount: number;
  branchCount: number;
  resolvedBranchCount: number;  // branches with >=1 allele-resolved defining SNP
  branches: YPhylotreeBranch[];
}

/**
 * Derive the parent ISOGG longhand haplogroup name by stripping the last
 * alternating letter/number token. e.g. "R1b1a1a2" -> "R1b1a1a" -> "R1b1a1".
 * Returns null for a single top-level letter (e.g. "R").
 */
export function parentHaplogroup(name: string): string | null {
  if (!name) return null;
  const clean = name.replace(/[~*]+$/, '').trim();
  // Tokens: a leading uppercase letter group, then alternating digit / lowercase runs.
  const tokens = clean.match(/^[A-Z]+|[0-9]+|[a-z]+/g);
  if (!tokens || tokens.length <= 1) return null;
  return tokens.slice(0, -1).join('');
}

/** Parse one ybrowse CSV record (array of fields) into a YSnpRecord, or null if invalid. */
export function ybrowseRowToRecord(fields: string[]): YSnpRecord | null {
  // Columns: seqid,source,type,start,end,score,strand,phase,Name,ID,allele_anc,allele_der,YCC_haplogroup,ISOGG_haplogroup,mutation,...
  if (fields.length < 15) return null;
  const name = (fields[8] || '').trim();
  const anc = (fields[10] || '').trim();
  const der = (fields[11] || '').trim();
  if (!name || !anc || !der) return null;
  // Skip indels for the SNP index (Phase 1 handles biallelic SNPs).
  if (anc.length !== 1 || der.length !== 1) return null;
  const startNum = parseInt(fields[3], 10);
  const isogg = (fields[13] || '').trim();
  const rec: YSnpRecord = {
    name,
    ancestral: anc.toUpperCase(),
    derived: der.toUpperCase(),
    mutation: (fields[14] || '').trim() || undefined,
    isoggHaplogroup: isogg && isogg !== 'not listed' && isogg !== 'unknown' ? isogg : undefined,
  };
  if (!Number.isNaN(startNum)) rec.posHg38 = startNum;
  return rec;
}

/** Build a Name->record index from ybrowse records (first occurrence wins). */
export function buildSnpIndex(records: YSnpRecord[]): YSnpIndex {
  const idx: YSnpIndex = {};
  for (const r of records) {
    const key = r.name.toUpperCase();
    if (!idx[key]) idx[key] = r;
  }
  return idx;
}
