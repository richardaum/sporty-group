---
id: 004-F-filter-by-sport
type: F
slug: filter-by-sport
status: in-progress
created: 2026-04-28
updated: 2026-04-29
---

# Spec: Filter By Sport

- Status: in-progress
- Category: F
- Importance: high
- Size: M
- Source: `docs/pdf-instructions.md`
- Design Skill: `/frontend-design`

## Goal

Allow users to filter leagues by sport type with a dropdown control.

## Scope

1. Provide a sport-type dropdown populated from available league data.
2. Filter list results by selected `strSport`.

## Out of Scope

1. Multi-select sport filtering.
2. Server-side filtering endpoints.
3. Search query composition behavior (owned by `003-F-search-by-league-name`).

## UI/UX Direction

1. UI/UX foundation reference: follow `001-NF-design-system-foundation` as the authoritative baseline for tokens, components, interaction states, spacing, radius, and motion.
2. Aesthetic extension: filter UI should inherit the same dark-first, condensed, content-focused visual language established in `001`.
3. Dropdown control should follow the same visual rhythm as the search input, reusing shared select/input patterns from `001`.
4. Mobile-first behavior: filter control remains easy to operate with touch using sizing and spacing scales from `001`.
5. State clarity: selected sport is always explicit and easy to reset, preserving state affordance patterns defined in `001`.
6. Accessibility baseline: keyboard navigation and visible focus styles are required, aligned with `001` accessibility defaults.
7. Motion baseline: state changes should prioritize clarity over animation and honor `prefers-reduced-motion` per `001`.

## Implementation Plan

1. [done] Derive unique sport options from available league data and expose them as select control options.
2. [done] Add selected-sport state with a default `all sports` option for explicit reset behavior.
3. [done] Implement deterministic filtering by `strSport` and apply it to the shared leagues list renderer.
4. [done] Ensure select control supports keyboard navigation, visible focus, and mobile touch ergonomics.
5. [done] Keep layout and spacing aligned with the existing catalog controls at mobile and desktop sizes.
6. [done] Validate no-result and reset flows to avoid inconsistent UI states.
7. [done] Hide hero while a sport filter is active.
8. [done] Restrict options to the explicit sports set (`Soccer`, `Basketball`, `Motorsport`) instead of dynamic API-derived options.
9. [done] Allow configuring select dropdown opening direction (`top` or `bottom`).
10. [done] Verify and harden dropdown surface/background token for header placement across themes.
11. [todo] Design and implement a more distinctive empty-state layout for active sport filtering.

## Acceptance Criteria

1. Selecting a sport reduces the visible list to matching leagues.
2. Resetting selection restores all sports.
3. Automated tests cover sport filtering behavior (including normalization with `trim` and case-insensitive match), header dropdown behavior, hero visibility when filtered, and empty/error states.
4. Test suite coverage is updated to include the new `004` behavior, with no regression in existing coverage gates.
5. After implementation, this spec is resynced to the delivered state (status, implementation plan progress, and any missing items clearly documented).
6. Allow select without label. This Sport filter dropdown should not have a label.
7. Sports: Soccer, Basketball, Motorsport.
8. Make sure select dropdown has proper background color, considering where it is placed in the UI.
9. Allow setting select dropdown opening direction to top or bottom.
10. Provide a more polished, intentional empty-state layout for active sport filtering.

## Acceptance Mapping (Current)

1. [done] Selecting a sport reduces the visible list to matching leagues.
2. [done] Resetting selection restores all sports.
3. [done] Automated tests cover filtering normalization (`trim` + case-insensitive), header dropdown rendering, hero hidden behavior when filtered, and empty/error states.
4. [done] Coverage updated and validated with `pnpm vitest run --coverage` without regression against current gates.
5. [done] Spec resync completed (status, implementation progress, and missing items documented).
6. [done] Select rendered in header without visible label.
7. [done] Constrain sport options to exactly `Soccer`, `Basketball`, and `Motorsport`.
8. [done] Confirm/lock dropdown background behavior for header context in all target themes/states.
9. [done] Add configurable dropdown opening direction (`top`/`bottom`) in `UISelect` and wire usage.
10. [todo] Be creative for the empty state layout UI.

## Implementation Notes (Current State)

1. Header sport filter is implemented in `src/components/leagues/LeaguesCatalog.vue` using `UISelect`.
2. Filtering pipeline is implemented in `src/composables/useLeaguesCatalogDataViewModel.ts` with normalized matching (`trim` + case-insensitive).
3. Hero is hidden while filter is active (`selectedSport !== all`).
4. Empty and error flows are covered in `src/components/leagues/LeaguesCatalog.test.ts`.
5. View model behavior is covered in `src/composables/useLeagueCatalogViewModel.test.ts`.
6. Supported sport filter options are now fixed to `Soccer`, `Basketball`, and `Motorsport`.
7. `UISelect` now supports `dropdownDirection` (`top` or `bottom`) and `context` (`default` or `header`) for placement/styling control.
