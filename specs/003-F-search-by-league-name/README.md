---
id: 003-F-search-by-league-name
type: F
slug: search-by-league-name
status: draft
created: 2026-04-28
updated: 2026-04-28
---

# Spec: Search By League Name

- Status: draft
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

## Out of Scope

1. Sport-type filtering logic (covered by a separate spec).
2. Server-side search endpoints.

## UI/UX Direction

1. Aesthetic philosophy: Scandinavian with emphasis on calm input ergonomics.
2. Search field must remain prominent and easy to discover above results.
3. Mobile-first behavior: input remains full-width and comfortably tappable at 375px.
4. Feedback pattern: filtering updates should feel immediate and visually stable.
5. Accessibility baseline: visible focus state, readable placeholder/copy, and adequate contrast.
6. Motion baseline: no distracting animations during typing or result updates.

## Implementation Plan

1. Add search input state management in the leagues listing view/composable with controlled text value.
2. Implement deterministic client-side filtering by `strLeague` using normalized comparison (case-insensitive).
3. Connect filtered output to the same list renderer used by the base leagues list spec.
4. Ensure immediate updates during typing without breaking loading or empty-state behavior.
5. Keep search clear/reset behavior explicit and restore full result set on empty input.
6. Preserve mobile-first usability and accessibility (focus-visible, label/placeholder clarity, touch sizing).
7. Verify compatibility with sport filter state composition (combined filtering pipeline).

## Acceptance Criteria

1. Typing text filters visible leagues by `strLeague`.
2. Clearing the input restores all leagues.
3. Search behavior is deterministic and does not break list rendering.
