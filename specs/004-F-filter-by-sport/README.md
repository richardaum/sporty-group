---
id: 004-F-filter-by-sport
type: F
slug: filter-by-sport
status: draft
created: 2026-04-28
updated: 2026-04-28
---

# Spec: Filter By Sport

- Status: draft
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
3. Support compatibility with active search filtering.

## Out of Scope

1. Multi-select sport filtering.
2. Server-side filtering endpoints.

## UI/UX Direction

1. Aesthetic philosophy: Scandinavian aligned with list/search controls.
2. Dropdown control should follow the same visual rhythm as the search input.
3. Mobile-first behavior: filter control remains easy to operate with touch.
4. State clarity: selected sport is always explicit and easy to reset.
5. Accessibility baseline: keyboard navigation and visible focus styles are required.
6. Motion baseline: state changes should prioritize clarity over animation.

## Implementation Plan

1. Derive unique sport options from available league data and expose them as select control options.
2. Add selected-sport state with a default `all sports` option for explicit reset behavior.
3. Implement deterministic filtering by `strSport` and apply it to the shared leagues list renderer.
4. Compose sport filtering with active text search so combined results remain predictable.
5. Ensure select control supports keyboard navigation, visible focus, and mobile touch ergonomics.
6. Keep layout and spacing aligned with the existing search/list control group at mobile and desktop sizes.
7. Validate no-result and reset flows to avoid inconsistent UI states.

## Acceptance Criteria

1. Selecting a sport reduces the visible list to matching leagues.
2. Resetting selection restores all sports.
3. Sport filtering and text search can be combined without inconsistent results.
