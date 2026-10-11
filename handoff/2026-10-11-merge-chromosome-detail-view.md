# MERGE: chromosome-detail-view → main

**Date:** 2026-10-11
**Status:** Approved by Jequan — merge now

---

Merge branch `chromosome-detail-view` into `main`.

Single commit: `89781296`
"feat(ui): implement full-screen chromosome detail view and overview centromere pinch"

**Files:**
- New: `src/components/ChromosomeDetailView.tsx` (full-screen modal, 726 lines)
- New: `src/constants/chromosomeMetadata.ts` (centromere positions)
- Modified: `src/components/ChromosomePainter.tsx` (tap-to-expand wiring)
- Modified: `src/components/ChromosomePainterView.tsx` (state management)

**Validate after merge:**
- `npx tsc --noEmit` must exit 0
- `npx vitest run` must show 0 failures

Delete the branch after merging. Report the merge SHA.

**Do NOT open a PR.** Merge via local git as usual.
