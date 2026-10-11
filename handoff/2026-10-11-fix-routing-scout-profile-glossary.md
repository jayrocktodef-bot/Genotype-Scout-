# Fix routing: Scout Profile and Population Glossary

## Goal

Clicking "Scout Profile" and "Population Glossary" from the module launcher must route the user to the correct module every time. Right now both misroute.

## Bug 1 — Population Glossary: duplicate conflicting definitions (confirmed)

Two definitions exist for the same feature and they disagree:

- `src/components/ScoutWorkspace.tsx` (lines 81-91): `id: 'glossary'`, `targetTab: 'ancestry'`, no `targetSubTab`.
- `src/components/ModuleIndexModal.tsx` (lines 138-146): `id: 'subpopulations'`, `name: 'Subpopulations Glossary'`, `targetTab: 'subpopulations'`.

`'subpopulations'` is not a member of the `MainTabType` union in `src/hooks/useTabNavigation.ts`, so clicking the modal entry calls `setActiveTab('subpopulations')` (invalid state) and `setCurrentApp('subpopulations')`, which matches nothing in `WorkspaceRouter` (it only checks `currentApp === 'glossary'`). Result: blank or wrong content.

Secondary issue: the ScoutWorkspace definition is missing `targetSubTab`. Every other ancestry module sets one (`oracle`, `painter`, `native_roots`, `scout`). Without it, `onNavigateToTab('ancestry', undefined)` in `src/App.tsx` (line 101) skips the subtab update (`if (tab === 'ancestry' && subTab)` fails), leaving the ancestry subtab stale.

### Fix

1. Unify on ONE definition. In `src/components/ModuleIndexModal.tsx`, change the entry's `id` from `'subpopulations'` to `'glossary'` and `targetTab` from `'subpopulations'` to `'ancestry'`, and add `targetSubTab: 'glossary'`.
2. In `src/components/ScoutWorkspace.tsx`, add `targetSubTab: 'glossary'` to the existing `id: 'glossary'` entry.
3. Verify the ancestry subtab switcher in `src/App.tsx` handles the `'glossary'` subtab value (add the case if it does not exist).

## Bug 2 — Scout Profile: tab/app state desync (confirmed)

Definition: `src/components/ScoutWorkspace.tsx` (lines 58-68): `id: 'profile'`, `targetTab: 'summary'`, no `targetSubTab`.

Click flow (`src/components/ScoutWorkspace.tsx`, lines 959-969):
1. `onNavigateToTab('summary', undefined)` -> `setActiveTab('summary')`
2. `onOpenApp('profile')` -> `setCurrentApp('profile')`
3. `WorkspaceRouter` (`src/components/WorkspaceRouter.tsx`, line 97) renders `<ProfileSummary>` when `currentApp === 'profile'`

The problem: the bottom navigation's `onTabChange` in `src/components/AppLayout.tsx` (lines 141-144) calls `setActiveTab(tab)` AND `setCurrentApp(null)`. So the module sets `targetTab: 'summary'` to highlight the bottom nav, but the visible content depends on `currentApp === 'profile'`. The two states are managed independently — any tab interaction wipes `setCurrentApp(null)` and the profile view disappears, showing the wrong module or the launcher grid.

### Fix

Pick one and do it cleanly:

- Option A (preferred): remove `targetTab: 'summary'` from the profile entry and let `currentApp` drive the view entirely. Do NOT clear `currentApp` when the user is already on the profile module.
- Option B: keep `targetTab: 'summary'` but make the `'summary'` tab and the `'profile'` app unable to desync (e.g., `onTabChange` to `'summary'` sets `currentApp` to `'profile'` instead of `null`).

Whichever option is chosen, the bottom-nav highlight must stay correct when the profile view is open.

## General audit

Audit every `MODULES` entry in both `ScoutWorkspace.tsx` and `ModuleIndexModal.tsx` for missing `targetSubTab` values where the tab pattern expects one (same class of bug as the glossary entry). Fix any others found.

## Acceptance criteria

1. From a fresh app load, clicking Scout Profile in the launcher renders `<ProfileSummary>` and the bottom-nav highlight stays on the correct tab. Tapping the bottom nav and returning keeps the profile view intact (no blank/wrong content).
2. Clicking Population Glossary (from BOTH the launcher grid and the module index modal) lands on the glossary view inside the ancestry section. There is exactly one glossary definition in the codebase after the fix (no remaining `targetTab: 'subpopulations'`).
3. `targetTab` values used anywhere are all members of `MainTabType` in `src/hooks/useTabNavigation.ts`.
4. `npm run validate:data`, TypeScript compile, and the Vitest suite are green.
5. No TODOs, no invented APIs, no synthetic data. Complete implementation or surgical diff only.

## What "done" looks like

- Work done on a task branch named `fix-routing-profile-glossary`.
- Branch pushed for Orbit verification.
- Nothing merges to main without Jequan's go-ahead plus Orbit's diff verification against this brief.
- Merge goes through a real GitHub PR (open, merge, close) with the PR URL reported. Never a simulated local merge.
