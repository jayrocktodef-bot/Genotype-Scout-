/**
 * Phase 1: build the enriched Y-DNA phylotree dataset.
 *
 * Joins the repo's ISOGG branch list (branchName + definingSNPs + rsids) with
 * allele-direction + coordinate data from ybrowse.org (the ISOGG/YBrowse Y-SNP
 * database) to produce src/data/y_phylotree.json — every defining SNP gets its
 * ancestral/derived alleles and GRCh38 position, plus parent links.
 *
 * Usage:
 *   npm run build:yphylo                 # downloads ybrowse (~442MB) and builds the full dataset
 *   YBROWSE_CSV=/path/snps.csv npm run build:yphylo   # use a local CSV instead of downloading
 *
 * NOTE: the full ybrowse CSV is ~442MB; run this locally or in CI, NOT in a
 * memory/time-constrained sandbox. It is a manual sync step (like the other
 * scripts/sync-*.ts), not part of the production build.
 */
import * as fs from 'fs';
import * as readline from 'readline';
import * as https from 'https';
import {
  ybrowseRowToRecord, buildSnpIndex, parentHaplogroup,
  YSnpRecord, YSnpIndex, YPhylotreeBranch, YPhylotreeDataset,
} from '../src/utils/yPhylotree';

const YBROWSE_URL = 'http://ybrowse.org/gbrowse2/gff/snps_hg38.csv';
const OUT_TREE = 'src/data/y_phylotree.json';
const OUT_INDEX = 'src/data/y_snp_index.json';

function parseCsvLine(line: string): string[] {
  // ybrowse rows are simple fully-quoted CSV with no embedded quotes.
  return line.split(',').map((f) => f.replace(/^"|"$/g, ''));
}

async function lineStream(): Promise<readline.Interface> {
  const local = process.env.YBROWSE_CSV;
  if (local) {
    console.log(`[yphylo] reading local CSV: ${local}`);
    return readline.createInterface({ input: fs.createReadStream(local), crlfDelay: Infinity });
  }
  console.log(`[yphylo] streaming ybrowse: ${YBROWSE_URL} (~442MB)`);
  const res = await new Promise<NodeJS.ReadableStream>((resolve, reject) => {
    https.get(YBROWSE_URL, (r) => (r.statusCode === 200 ? resolve(r) : reject(new Error('HTTP ' + r.statusCode)))).on('error', reject);
  });
  return readline.createInterface({ input: res, crlfDelay: Infinity });
}

async function buildSnpRecords(): Promise<YSnpRecord[]> {
  const records: YSnpRecord[] = [];
  const rl = await lineStream();
  let first = true;
  for await (const line of rl) {
    if (first) { first = false; continue; } // header
    if (!line) continue;
    const rec = ybrowseRowToRecord(parseCsvLine(line));
    if (rec) records.push(rec);
  }
  return records;
}

interface IsoggBranchIn { branchName: string; definingSNPs: string[]; rsids: string[]; }

function buildTree(isogg: IsoggBranchIn[], index: YSnpIndex): YPhylotreeDataset {
  const branches: YPhylotreeBranch[] = [];
  let resolved = 0;
  for (const b of isogg) {
    if (!b.branchName || b.branchName === 'Subgroup Name') continue;
    const definingSNPs: YSnpRecord[] = [];
    const unresolvedSNPs: string[] = [];
    for (const snp of b.definingSNPs || []) {
      const key = String(snp).toUpperCase().replace(/^\[MAYBE\s+|\]$/g, '').trim();
      const rec = index[key];
      if (rec) definingSNPs.push(rec);
      else unresolvedSNPs.push(snp);
    }
    if (definingSNPs.length > 0) resolved++;
    branches.push({
      branchName: b.branchName,
      parent: parentHaplogroup(b.branchName),
      definingSNPs,
      unresolvedSNPs,
      rsids: b.rsids || [],
    });
  }
  return {
    version: '1.0.0',
    source: 'ISOGG branch list (repo) joined with ybrowse.org Y-SNP allele/coordinate data',
    generatedAt: new Date().toISOString(),
    snpCount: Object.keys(index).length,
    branchCount: branches.length,
    resolvedBranchCount: resolved,
    branches,
  };
}

async function main() {
  const records = await buildSnpRecords();
  const index = buildSnpIndex(records);
  console.log(`[yphylo] indexed ${Object.keys(index).length} biallelic Y-SNPs`);
  fs.writeFileSync(OUT_INDEX, JSON.stringify(index));

  const masterYdna = JSON.parse(fs.readFileSync('src/data/master_ydna.json', 'utf8'));
  const tree = buildTree(masterYdna.isoggTree as IsoggBranchIn[], index);
  fs.writeFileSync(OUT_TREE, JSON.stringify(tree));
  console.log(`[yphylo] wrote ${OUT_TREE}: ${tree.branchCount} branches, ${tree.resolvedBranchCount} allele-resolved (${Math.round(100*tree.resolvedBranchCount/tree.branchCount)}%)`);
}

main().catch((e) => { console.error('[yphylo] FAILED:', e); process.exit(1); });
