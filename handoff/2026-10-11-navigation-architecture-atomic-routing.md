# Navigation architecture: atomic module routing (supersedes fix brief)

## Status

This brief SUPERSEDES `handoff/2026-10-11-fix-routing-scout-profile-glossary.md`. Do not implement that brief separately; its two bug fixes are included here as acceptance criteria, fixed by construction.

## Goal

Make module misrouting structurally impossible. Every module gets a dedicated tab identity, and the tab highlight and module content can never desync, because they are set by a single atomic navigation action from a single registry. The module view disconnects only on the user's explicit close/back action, never as a side effect of tab switching.

## Background

Current design keeps two independent pieces of state: `activeTab` (bottom nav, `src/hooks/useTabNavigation.ts`) and `currentApp` (module view, rendered by `src/components/WorkspaceRouter.tsx`). They are set by separate calls (`onNavigateToTab`, `onOpenApp`) scattered across components, and `src/components/AppLayout.tsx` (lines 141-144) clears `currentApp` to `null` as a side effect of any bottom-nav tap. This caused two shipped bugs: the Population Glossary pointing at a nonexistent `'subpopulations'` tab, and Scout Profile's view being wiped by tab interaction.

## Design

### 1. Single module registry

Create one canonical registry (e.g. `src/navigation/moduleRegistry.ts`) listing every module. Each entry REQUIRES:

- `id`: unique module id (string literal union, e.g. `'profile' | 'glossary' | ...`)
- `tab`: a member of `MainTabType` — every module has a dedicated tab, no exceptions
- `subTab`: the subtab value the module lives under (required, not optional)
- `title`, `description`, `icon`, etc. as currently used by the launcher

TypeScript enforces all fields at compile time. The two existing definitions (`src/components/ScoutWorkspace.tsx` MODULES and `src/components/ModuleIndexModal.tsx` entries) are replaced by imports from this registry — one definition per module, in one file, no duplicates.

### 2. Atomic navigation action

Add a single `navigateTo(moduleId)` function (in the same navigation module or a `useModuleNavigation` hook) that, in one call, sets the active tab AND the current app from the registry entry. It must be impossible to set one without the other through this path.

Remove all direct `setActiveTab` / `setCurrentApp` / `onNavigateToTab` / `onOpenApp` calls from feature components. They all go through `navigateTo`. (Internal implementation inside the navigation module may still use the underlying setters; the rule is that no component outside the navigation module touches them.)

### 3. Disconnect only on explicit user action

`currentApp` may return to `null` ONLY through the single designated close/back path (explicit user action: close button, back gesture to launcher). Bottom-nav tab switches must NEVER clear `currentApp` as a side effect. Update `src/components/AppLayout.tsx` `onTabChange` accordingly: switching tabs navigates to the module registered for that tab (or the launcher), it does not null the app state.

### 4. Registry drives the router

`src/components/WorkspaceRouter.tsx` renders from the registry: the `currentApp` id maps to its registered component. Adding a module means adding one registry entry plus its component; there is no second place to wire up.

## Exact steps

1. Create `src/navigation/moduleRegistry.ts` with the full typed registry. Migrate every entry from `ScoutWorkspace.tsx` MODULES and `ModuleIndexModal.tsx` into it. Delete the old duplicate definitions; both components import from the registry.
2. Fix the two known bugs by construction in the registry:
   - Glossary: single entry, `id: 'glossary'`, `tab: 'ancestry'`, `subTab: 'glossary'`. No `'subpopulations'` anywhere.
   - Scout Profile: `id: 'profile'`, dedicated tab (use the existing `'summary'` tab or a new `'profile'` tab added to `MainTabType` — whichever keeps the bottom nav coherent; the tab and app must be 1:1 and set atomically).
3. Implement `navigateTo(moduleId)` and replace all component-level navigation calls with it.
4. Rework `AppLayout.tsx` `onTabChange` so tab switches navigate via the registry instead of clearing app state. Implement the single explicit close/back path that is the only code allowed to set `currentApp` to `null`.
5. Wire `WorkspaceRouter.tsx` to the registry.
6. Guards (all required):
   - `src/navigation/moduleRegistry.test.ts` (or equivalent): iterates the registry and asserts every entry has a valid `tab` (member of `MainTabType`), a non-empty `subTab`, and a component registered in the router. Fails the suite if any module is incompletely wired.
   - Click-through test: for every registry entry, simulate the launcher click and assert the rendered content is that module's component and the tab highlight matches. This is the regression test for the exact bug class just shipped.
   - Optional but preferred: an ESLint rule (or a code comment convention enforced in review) banning raw `setCurrentApp(null)` outside the designated close path.

## Acceptance criteria

1. Clicking Scout Profile (launcher grid AND module index modal) renders `<ProfileSummary>` with the correct bottom-nav highlight. Tapping bottom-nav tabs and returning never blanks the view or shows the wrong module.
2. Clicking Population Glossary (launcher grid AND module index modal) lands on the glossary view inside the ancestry section. No `targetTab: 'subpopulations'` string exists anywhere in the codebase.
3. Every `tab` value in the registry is a member of `MainTabType`; every module has a `subTab`; the router handles every registry id. The registry test proves it.
4. `currentApp` becomes `null` only via the explicit close/back path — verified by code inspection and by the click-through test (tab switches never clear the view).
5. `npm run validate:data`, TypeScript compile, and the full Vitest suite are green, including the two new guard tests.
6. No TODOs, no invented APIs, no synthetic data. Complete implementation only.

## What "done" looks like

- Work done on a task branch named `fix-navigation-architecture`.
- Branch pushed for Orbit verification.
- Nothing merges to main without Jequan's go-ahead plus Orbit's diff verification against this brief.
- Merge goes through a real GitHub PR (open, merge, close) with the PR URL reported. Never a simulated local merge.
