# Round 7 handoff — 5 oversized files (for Antigravity, repo-local execution)

**Branch:** `round7-frequency-fixes` (created from main 2026-10-04). All work lands here; merge to main when done.
**Scripts on the branch:** `round7/` — `compare_all.py`, `fix_all.py`, `fetch_all.py` (validated; see below).

**Why you:** these 5 files exceed the 1MB API read limit, so Orbit could not download them:
- `src/data/aims/global.json` (12,294 markers)
- `src/data/aims/central_asian.json` (3,674)
- `src/data/aims/native_american.json` (3,502)
- `src/data/aims/east_asian.json` (1,662)
- `src/data/master_aims_normalized.json` (17,214)

**Reference data (do NOT re-pull what's already fetched):**
Orbit already pulled Ensembl `pops=1` for 5,289 variants (all 7 smaller panels' union rsIDs).
Download the snapshot (33MB, public Ensembl/1000G/gnomAD reference data, expires 2026-10-06):
https://muse.ai/files/1384743961386034/1086313557182856/x6plwla9yeh9lur8buqtbn9b/ensembl_ref_snapshot.json
Save as `round7/ensembl_ref_snapshot.json`.

**Steps:**
1. `git checkout round7-frequency-fixes`
2. `mkdir -p round7/panels && cp src/data/aims/{global,central_asian,east_asian,native_american}.json src/data/master_aims_normalized.json round7/panels/` — note: rename master to `panels/master.json` for the scripts, then map back on write.
3. Extract the union rsID list from the 5 files; diff against the snapshot's variant keys.
4. Pull Ensembl `variation/human?pops=1` per missing variant — **do NOT use batched POST** (times out); use parallel per-variant GETs (8–12 concurrent, `curl --max-time 60`, 3 retries). ~20k variants ≈ 1.5–2.5h at 12 parallel. Resume from per-rsID raw files. (`fetch_all.py` implements this; adapt paths.)
5. Merge new pulls into the snapshot (key by `(variant["name"] or queried_id).lower()`; keep queried-id fallback).
6. `cd round7 && python3 compare_all.py global central_asian east_asian native_american master` then `python3 fix_all.py <same>` (scripts expect `panels/{name}.json`).
7. Copy `{name}.fixed.json` back over `src/data/aims/{name}.json` (and master to its path).
8. **Regenerate the 7 smaller panels too** (`african african_american european middle_eastern north_african oceanian south_asian`) by running the same two scripts — deterministic; Orbit's local run produced: 5,439 → 4,839 total, 600 purged, 34 re-keyed, 2,110 corrected, 241 demoted, 27 contradictions fixed. Your local run must match these counts; if not, stop and compare.
9. Run `npm run validate:data`, `vitest run`, `tsc --noEmit`.
10. Commit per panel/file with keep/fix/demote/purge counts. Push branch. Open PR to main — do NOT merge until Orbit verifies the diffs.

**Rules the scripts enforce** (do not weaken):
- Panel ALT = `alleles[0]`, forward strand; reference = 1000G Phase 3 super-populations (AFR/EAS/EUR/SAS) + gnomAD Middle East (MENA). **Panel AMR is panel-defined unadmixed — never compare against 1000G/gnomAD admixed AMR.**
- Flag: |delta| > 0.25 (SEVERE if > 0.5); exclusivity-contradiction; inversion (with margin).
- Purge only if max divergence across corrected checkable vector < 0.15 (marker is not an AIM).
- Re-key merged IDs to current accessions (discovered from snapshot `name` field); check for key collisions.
- Ethnic labels: demote to continental unless the named group maps to a 1000G population AND |f(group) − f(continent)| ≥ 0.25. Fix trait/description contradictions.
- Never invent frequencies: no reference data → keep panel vector, mark unverifiable.

**Cross-file checks after all panels are fixed:**
- Re-keyed rsIDs must be consistent across panels + master (same old → same new everywhere).
- If `master_aims_normalized.json` is generated from panels, regenerate it from the fixed panels instead of fixing independently; if independent, fix with the same pipeline.
- Purged rsIDs: confirm absent from all files.

**Known non-issues:**
- `subFrequencies`/`deepFrequencies` were NOT re-derived (nothing in `src/engines` reads them; engine scores on top-level `frequencies` only). Decide separately whether to re-derive or drop.
- `frequencySource` field added to corrected entries (additive; schema-compatible).
