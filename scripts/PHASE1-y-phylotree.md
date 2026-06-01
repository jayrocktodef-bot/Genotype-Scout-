# Phase 1 — Y-DNA phylotree dataset

**Goal:** give the haplogroup engine real per-SNP allele direction (ancestral vs
derived) + coordinates so it can call Y haplogroups correctly. Previously the
engine had no derived-allele data for Y-SNPs (the SNP reference is a trait/AIM
panel), so it leaned on allele-blind presence matching.

## Source
[ybrowse.org](http://ybrowse.org/gbrowse2/gff/) — the ISOGG/YBrowse Y-SNP
database. We use `snps_hg38.csv` (~442MB), columns include `Name, allele_anc,
allele_der, ISOGG_haplogroup, mutation, start (GRCh38 pos)`. Topology
(parent links) comes from the repo's existing ISOGG branch list
(`src/data/master_ydna.json` → `isoggTree`); ybrowse supplies the allele data.

## Build
```bash
npm run build:yphylo                       # downloads ybrowse (~442MB), writes:
                                           #   src/data/y_snp_index.json   (Name -> {anc,der,pos,...})
                                           #   src/data/y_phylotree.json   (ISOGG branches + resolved SNPs + parent)
YBROWSE_CSV=/path/snps_hg38.csv npm run build:yphylo   # use a local copy (skip the 442MB download)
```
Run this **locally or in CI** — the 442MB download is too large for the
memory/time-limited agent sandbox. It is a manual sync step (like
`scripts/sync-*.ts`), NOT part of the production build.

## Committed proof artifacts
- `src/data/y_snp_index.sample.json` — 43 backbone Y-SNPs pulled live from
  ybrowse (real ancestral/derived/positions).
- `src/data/y_phylotree.sample.json` — those SNPs joined to the repo ISOGG
  branch list, resolving 25 real branches with correct allele directions and
  parent links. Demonstrates the full pipeline end-to-end.

## Schema / helpers
`src/utils/yPhylotree.ts` — `YSnpRecord`, `YPhylotreeBranch`, `YPhylotreeDataset`
types plus pure helpers (`parentHaplogroup`, `ybrowseRowToRecord`,
`buildSnpIndex`) covered by `src/utils/yPhylotree.test.ts`.

## Next (Phase 2)
Wire the existing `YDnaPredictor` to consume `y_phylotree.json`: walk root→tip,
confirm a node only when its defining SNPs are derived, reject branches whose
defining SNPs are ancestral, require >=2 confirming derived SNPs for deep
terminals, and report coverage/confidence.
