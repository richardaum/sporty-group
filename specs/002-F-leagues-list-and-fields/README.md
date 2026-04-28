---
id: 002-F-leagues-list-and-fields
type: F
slug: leagues-list-and-fields
status: draft
created: 2026-04-28
updated: 2026-04-28
---

# Spec: Leagues List And Required Fields

- Status: draft
- Category: F
- Importance: critical
- Size: L
- Source: `docs/pdf-instructions.md`
- Design Skill: `/frontend-design`

## Goal

Render the core leagues catalog from TheSportsDB with all required assignment fields.

## Scope

1. Fetch leagues from `all_leagues.php`.
2. Render league items in a clear list/grid.
3. Show required fields per league:
   - `strLeague`
   - `strSport`
   - `strLeagueAlternate`

## Out of Scope

1. Badge interaction behavior (covered by a separate spec).
2. Search and sport filtering behavior (covered by separate specs).

## UI/UX Direction

1. Aesthetic philosophy: Scandinavian (warm, clean, high legibility).
2. Mobile-first baseline: start at 375px single-column layout before larger breakpoints.
3. League item layout: hierarchy with `strLeague` as primary text and metadata secondary.
4. Interaction clarity: league cards/rows must visibly communicate clickable state.
5. Accessibility baseline: minimum 44x44 touch targets and readable text sizing on mobile.
6. Motion baseline: subtle transitions only; respect reduced-motion preference.

## Implementation Plan

1. Create or confirm typed API client support for `all_leagues.php` response shape and error handling.
2. Implement list query flow with loading, success, and failure-safe rendering states.
3. Build league list/card presentation that surfaces `strLeague`, `strSport`, and `strLeagueAlternate` with clear hierarchy.
4. Apply mobile-first layout at 375px and extend to larger breakpoints without changing required field visibility.
5. Add accessible semantics for interactive league rows/cards (focus behavior, touch target sizing, readable contrast).
6. Validate empty or partial API payload handling so the UI remains stable and non-crashing.
7. Align spacing, typography, and transitions with shared design-system tokens.

## Acceptance Criteria

1. On first load, the UI displays leagues from the API response.
2. Every displayed league includes all three required fields.
3. If data is temporarily unavailable, the UI remains stable and does not crash.
