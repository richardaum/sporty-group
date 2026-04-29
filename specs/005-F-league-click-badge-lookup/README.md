---
id: 005-F-league-click-badge-lookup
type: F
slug: league-click-badge-lookup
status: complete
created: 2026-04-28
updated: 2026-04-29
---

# Spec: League Click Badge Lookup

- Status: complete
- Category: F
- Importance: high
- Size: M
- Source: `docs/pdf-instructions.md`
- Design Skill: `/frontend-design`

## Goal

Enable league interaction that triggers season-badge retrieval and displays a badge image.

## Scope

1. Make league entities interactive via click/select action.
2. On interaction, call `search_all_seasons.php?badge=1&id=<id>`.
3. Render a returned season badge image in the UI.

## Out of Scope

1. Advanced badge galleries for all seasons.
2. Historical season comparison UX.

## UI/UX Direction

1. UI/UX foundation reference: follow `001-NF-design-system-foundation` as the canonical baseline for tokens, component primitives, interaction states, spacing, radius, and motion.
2. Aesthetic extension: badge lookup flow should inherit the same dark-first, content-dense visual language established in `001`.
3. Clicked/selected league state must be visually distinct from unselected items using shared state treatment patterns from `001`.
4. Badge display should appear in a predictable location to avoid layout confusion while keeping panel/card treatments consistent with `001` primitives.
5. Mobile-first behavior: badge area should stack naturally below list content on narrow screens using responsive spacing/layout principles from `001`.
6. Accessibility baseline: selected state and badge availability must not rely on color alone, aligned with `001` accessibility defaults.
7. Motion baseline: use subtle reveal for badge updates and honor `prefers-reduced-motion` requirements defined in `001`.

## Implementation Plan

1. Add selected league state management to the list interaction layer (click and keyboard activation support).
2. Trigger `search_all_seasons.php?badge=1&id=<id>` when a league is selected and track request lifecycle state.
3. Parse and validate badge payload, choosing a primary badge image to render in a dedicated preview area.
4. Implement fallback UI for missing badges or failed requests without disrupting list interaction.
5. Apply clear selected-state styling and non-color cues to meet accessibility requirements.
6. Keep badge panel placement predictable across mobile and desktop breakpoints.
7. Verify that badge fetches remain scoped to the actively selected league and update deterministically on re-selection.
8. Badge lookup should be implemented as a reusable component in `src/components/ui/UIBadgeLookup.vue`.
9. Use a dialog to display the badge lookup results.
10. Adjust `UIRailTrack` accessibility so keyboard arrow navigation works correctly.
11. Ensure `Tab` does not cycle through the rail track; it should focus only the first interactive item.
12. Adjust the `LeagueCard` alternate to display small tags (right below the title, wrap) from the string which is separated by `,`.
13. Create a fetch client (similar to axios) where we can do `apiClient.get(...)`, also configure some strategic delay to showcase all loading states.

## In Progress

- [x] Extract shared empty-state UI into a dedicated `src/components/ui/empty-states/` folder.
- [x] Add a single variant switcher component to resolve empty-state copy/actions by variant.
- [x] Convert `LeaguesSearchOverlay` empty state into a `UIEmptyState` variant.
- [x] Continue badge lookup interaction implementation for selected league flow.
- [x] Create reusable `UIDialog` primitive with Radix Vue semantics and close interactions.
- [x] Create reusable `UIBadgeLookup` component to render idle/loading/error/empty/success badge states.
- [x] Wire league-card selection to badge lookup lifecycle through `useLeagueBadgeLookup`.
- [x] Render lookup result inside dialog flow from the leagues catalog.
- [x] Add Storybook coverage for dialog and badge lookup components.
- [x] Add unit tests for `UIDialog` and `UIBadgeLookup`.
- [x] Improve badge preview visual hierarchy (stronger panel treatment, better image prominence, centered content).
- [x] Make dialog sizing configurable via props (`desktopWidth`, `mobileWidth`) with defaults `80%` (desktop) and `100%` (mobile).
- [x] Tune badge image presentation in modal: remove border, center image, and increase visual height usage (~70% of panel space).
- [x] Introduce `apiClient.get(...)` abstraction with configurable delay to make loading states observable.
- [x] Remove temporary debug instrumentation and hardcoded alternate-tag data from league/badge UI before completion.
- [x] Restore green tests for league alternate-tag rendering and `UISquareBadge` size behavior.

## Execution Flow Check (2026-04-29)

1. Reviewed spec goal/scope and validated current implementation coverage against listed plan items.
2. Verification run executed with:
   - `pnpm test`
   - `pnpm test:coverage`
   - `pnpm lint`
   - `pnpm exec vue-tsc -b`
3. Verification result:
   - `pnpm test` passed (`19` test files, `67` tests).
   - `pnpm test:coverage` passed and produced overall coverage: statements `86.68%`, branches `75.52%`, functions `90.03%`, lines `85.99%`.
   - `pnpm lint` passed.
   - `pnpm exec vue-tsc -b` passed.
4. Next pass required:
   - Await developer/user acceptance, then mark spec status as `complete`.

## Implementation Notes (What Was Built)

1. **Interaction flow**
   - League cards are now selectable and emit a clear selected state.
   - Selecting a league triggers season badge lookup with `search_all_seasons.php?badge=1&id=<id>`.

2. **State handling**
   - Lookup lifecycle is handled with explicit states: idle, loading, error, empty result, and success.
   - UI communicates each state in the same dialog surface without breaking navigation.

3. **UI architecture**
   - Added `src/components/ui/UIDialog.vue` as a reusable dialog primitive.
   - Added `src/components/ui/UIBadgeLookup.vue` as a reusable badge preview surface.
   - Added `src/composables/useLeagueBadgeLookup.ts` to keep network/state logic outside presentational components.

4. **Visual updates**
   - Dialog now supports responsive width via props for easier reuse in other flows.
   - Badge preview was strengthened visually to feel less flat and give the crest more emphasis.
   - Latest styling centers the badge and increases occupied vertical area for stronger focus.

5. **Quality checks**
   - Unit tests were added/updated for dialog and badge lookup behavior.
   - Stories were added/updated to support visual QA in Storybook.

6. **Rail interaction naming clarity**
   - The rail wheel handler composable was renamed from `useRailWheelMomentum` to `useRailHorizontalWheelScroll`.
   - The new name better reflects the primary behavior (mapping wheel input to horizontal rail scrolling), with momentum smoothing treated as an implementation detail.

## Acceptance Criteria

1. Clicking a league issues a badge API request with that league ID.
2. After a successful response, at least one badge image is shown.
3. If no badge exists, fallback UI handles the state without breaking the page.
