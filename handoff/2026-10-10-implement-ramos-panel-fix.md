# IMPLEMENT: Ramos Africa Panel Synthetic Marker Purge

**Date:** 2026-10-10
**Branch:** Create from main: fix-ramos-panel
**Status:** Approved by Jequan — implement now
**Trigger:** Cross-panel audit found 318 synthetic rsIDs (37.6%) in the Ramos Africa panel.

---

## Problem (CRITICAL): 318 fabricated markers in ramos panel

File: `src/data/raw_aims/forensic_panels.json` (key: `ramos`)
Current: 846 rsIDs, of which 318 are synthetic.

### Synthetic blocks to remove:

1. **rs200000 – rs200009** (10 markers)
   Round-number block, cannot occur naturally.

2. **rs700000 – rs700009** (10 markers)
   Round-number block, cannot occur naturally.

3. **rs2000010 – rs2000099** (90 markers)
   90 consecutive rs numbers. Real AIM panels select for informativeness,
   not genomic proximity. This is fabricated.

4. **rs7000010 – rs7000097** (88 markers)
   88 consecutive rs numbers. Same as above.

5. **rs11103331 – rs11103448** (118 markers)
   118 consecutive rs numbers. Most damning.

6. **rs10456207-afr, rs10456206-afr** (2 markers)
   Hyphenated `-afr` suffixes matching the Round 7 contamination pattern
   (which used `_afr` underscores). Remove both.

**Total to remove:** 318 rsIDs
**Remaining:** 528 rsIDs

---

## Additional verification needed

The audit also found 18 sequential runs (155 rsIDs) in normal dbSNP ranges:
- rs10456231–rs10456269 (39 consecutive)
- rs10456323–rs10456344 (22 consecutive)
- rs10456195–rs10456207 (13 consecutive)
- rs28358280–rs28358292 (13 consecutive)
- rs10456300–rs10456309 (10 consecutive)
- Plus 13 smaller runs of 3–7

These *could* be legitimate dense AIM regions. Verify each against dbSNP.
If any fail dbSNP lookup, remove them too.

---

## Process

- Branch from main: fix-ramos-panel
- Remove the 318 confirmed synthetic rsIDs from the `ramos` array
- Verify the 155 sequential-run rsIDs against dbSNP; remove failures
- Confirm the remaining markers exist in the master AIMs DB
- Run: `npm run validate:data` (must exit 0)
- Run: `npx vitest run` (must show 0 failures)
- Push, do NOT open a PR or merge
- Report back for Orbit verification

**Do NOT:**
- Add replacement markers (panel will be smaller, that's fine)
- Modify kidd55, seldin128, or euroforgen (they are clean)

Model: Gemini 3.1 Pro Low.
