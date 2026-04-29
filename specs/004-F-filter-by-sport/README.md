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

1. UI/UX foundation reference: follow `001-NF-design-system-foundation` as the authoritative baseline for tokens, components, interaction states, spacing, radius, and motion.
2. Aesthetic extension: filter UI should inherit the same dark-first, condensed, content-focused visual language established in `001`.
3. Dropdown control should follow the same visual rhythm as the search input, reusing shared select/input patterns from `001`.
4. Mobile-first behavior: filter control remains easy to operate with touch using sizing and spacing scales from `001`.
5. State clarity: selected sport is always explicit and easy to reset, preserving state affordance patterns defined in `001`.
6. Accessibility baseline: keyboard navigation and visible focus styles are required, aligned with `001` accessibility defaults.
7. Motion baseline: state changes should prioritize clarity over animation and honor `prefers-reduced-motion` per `001`.

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
