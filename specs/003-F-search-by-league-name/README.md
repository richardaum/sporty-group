---
id: 003-F-search-by-league-name
type: F
slug: search-by-league-name
status: in-progress
created: 2026-04-28
updated: 2026-04-28
---

# Spec: Search By League Name

- Status: in-progress
- Category: F
- Importance: high
- Size: M
- Source: `docs/pdf-instructions.md`
- Design Skill: `/frontend-design`

## Goal

Allow users to quickly narrow league results by league name using a search input.

## Scope

1. Add a search bar for free-text input.
2. Filter the currently available leagues by name match.
3. Keep filtering behavior responsive during typing.
4. Provide a dedicated control to open a Mission Control-inspired search mode.
5. Support keyboard shortcut to open the Mission Control-inspired search mode.

## Out of Scope

1. Sport-type filtering logic (covered by a separate spec).
2. Server-side search endpoints.

## UI/UX Direction

1. UI/UX foundation reference: follow `001-NF-design-system-foundation` as the canonical direction for tokens, component primitives, interaction states, spacing, radius, and motion.
2. Aesthetic extension: implement search UI as an extension of the `001` dark-first, dense, content-prioritized visual language with a macOS Mission Control-inspired central composition.
3. Search mode entry points: provide a visible button to open the Mission Control-inspired search mode and a keyboard shortcut to open the same mode.
4. Mission Control-inspired mode is presented as a floating layer with overlay, visually separated from the base page while keeping context awareness.
5. Search field must remain visually central, prominent, and easy to discover above results while using shared input patterns from `001`.
6. Mobile-first is mandatory: interaction, layout, spacing, and touch targets are designed for small screens first, then progressively enhanced for larger breakpoints.
7. Feedback pattern: search results update immediately inside the Mission Control-inspired mode while preserving visual stability.
8. Debounce behavior: apply a short debounce to query updates to avoid unnecessary recomputation while maintaining immediate perceived feedback.
9. Accessibility baseline: visible focus state, readable placeholder/copy, and adequate contrast aligned with `001` accessibility requirements.
10. Motion baseline: no distracting animations during typing or result updates; honor `prefers-reduced-motion` as defined in `001`.
11. Entry/leave transitions for opening and closing the Mission Control-inspired mode must be visually smooth, subtle, and brief.

## Implementation Plan

1. [done] Add search input state management in a dedicated composable with controlled text value (`useLeagueSearch`).
2. [done] Add Mission Control-inspired search mode state (`open/close`) with a visible open button and keyboard shortcut handler (`Cmd/Ctrl+K`).
3. [done] Implement deterministic client-side filtering by `strLeague` using normalized comparison (case-insensitive).
4. [done] Apply debounce to search query updates with a short delay that preserves immediate perceived response.
5. [done] Connect filtered output to catalog-backed league items inside the Mission Control-inspired overlay mode.
6. [done] Ensure immediate updates during typing while preserving empty-state behavior in overlay results.
7. [done] Keep search clear/reset behavior explicit and restore full result set on empty input or overlay close.
8. [done] Preserve mobile-first usability and accessibility baseline (focus-visible states, touch-sized controls, readable labels/placeholders).
9. [done] Verify compatibility with sport filter state composition (combined filtering pipeline with `004-F-filter-by-sport`).
10. [done] Implement subtle entry/leave visual effects for Mission Control-inspired mode open/close, with reduced-motion fallback.

## Implementation Notes (Current State)

1. Search behavior is implemented in `src/composables/useLeagueSearch.ts` with a 120ms debounce and active-only filtering.
2. Mission Control-inspired mode is implemented in `src/components/leagues/LeaguesSearchOverlay.vue` with backdrop, focus handoff, clear action, and scrollable results.
3. Entry points are wired in `src/components/leagues/LeaguesCatalog.vue` via a dedicated trigger button and global keyboard shortcut.
4. Automated coverage exists in `src/composables/useLeagueSearch.test.ts`; additional component-level assertions remain part of final integration hardening.
5. Shared data view-model now exposes sport-filtered `visibleLeagueItems` so search applies on top of the selected sport subset.

## Acceptance Criteria

1. Typing text filters visible leagues by `strLeague`.
2. Clearing the input restores all leagues.
3. A dedicated button opens the Mission Control-inspired search mode.
4. A keyboard shortcut opens the same Mission Control-inspired search mode.
5. Search results update immediately inside the Mission Control-inspired mode during typing.
6. Debounce is applied to query updates without degrading immediate perceived feedback.
7. Search behavior is deterministic and does not break list rendering.
8. Mobile-first behavior is preserved for search entry, interaction, and results rendering.
9. Opening and closing the Mission Control-inspired mode uses smooth, subtle entry/leave visual transitions.
10. Mission Control-inspired mode opens as a floating overlay layer above the base page content.

## Acceptance Mapping (Current)

1. [done] Typing text filters visible leagues by `strLeague`.
2. [done] Clearing the input restores all leagues.
3. [done] A dedicated button opens the Mission Control-inspired search mode.
4. [done] A keyboard shortcut opens the same Mission Control-inspired search mode.
5. [done] Search results update immediately inside the Mission Control-inspired mode during typing.
6. [done] Debounce is applied to query updates without degrading immediate perceived feedback.
7. [done] Search behavior is deterministic and does not break list rendering.
8. [done] Mobile-first behavior is preserved for search entry, interaction, and results rendering.
9. [done] Opening and closing the Mission Control-inspired mode uses smooth, subtle entry/leave visual transitions.
10. [done] Mission Control-inspired mode opens as a floating overlay layer above the base page content.
11. [done] Search pipeline is compatible with sport-filtered source data from `004` state composition.

## Side Fixing

1. [done] Fixed small-screen rail card rendering where content was clipped or visually distorted in league cards.
2. [done] Updated `UIRailTrack` responsive card-width strategy with mobile breakpoints to prevent overly narrow cards on small viewports.
3. [done] Kept rail behavior stable while preserving readable image/text proportions and avoiding content cut-off.
4. [done] Adopted absolute import convention (`@/`) in `src/`, updated project alias configuration, and migrated relative internal imports to the new standard.
