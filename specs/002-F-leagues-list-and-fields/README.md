---
id: 002-F-leagues-list-and-fields
type: F
slug: leagues-list-and-fields
status: complete
created: 2026-04-28
updated: 2026-04-28
---

# Spec: Leagues List And Required Fields

- Status: complete
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

1. UI/UX foundation reference: follow `001-NF-design-system-foundation` as the single source of truth for tokens, component primitives, states, spacing, radius, shadow, and motion behavior.
2. Visual direction: extend the `001` dark-first, content-dense catalog language for league browsing surfaces.
3. Mobile-first baseline: start at 375px and scale to larger breakpoints using the same spacing and typography token rhythm defined in `001`.
4. Hero and rails: use a prominent hero section plus horizontal rails with 16:9 league cards, reusing shared primitives and interaction patterns from `001`.
5. League card hierarchy: `strLeague` as primary text with `strSport` and `strLeagueAlternate` as secondary metadata, respecting the typography hierarchy established in `001`.
6. Accessibility baseline: minimum 44x44 touch targets, visible keyboard focus, and readable mobile typography aligned with `001` accessibility defaults.
7. Motion baseline: subtle transitions with `prefers-reduced-motion` support, matching `001` reduced-motion requirements.

## Implementation Plan

1. Create or confirm typed API client support for `all_leagues.php` response shape and error handling.
2. Implement list query flow with loading, success, and failure-safe rendering states.
3. Build a transformed view-model for hero content, main league rail, and sport-grouped rails.
4. Render 16:9 league cards that always show `strLeague`, `strSport`, and `strLeagueAlternate`.
5. Add skeleton loading, non-blocking stale-data error messaging, and retry fallback for empty/error states.
6. Apply mobile-first layout at 375px and extend to larger breakpoints without changing required field visibility.
7. Align spacing, typography, and transitions with shared dark-only design tokens.

## Components Added And Why

1. `src/components/leagues/LeaguesCatalog.vue`
   - Added as the feature container to orchestrate hero, loading/error states, and grouped rails in one catalog surface.
2. `src/components/ui/UITypography.vue`
   - Added to centralize text hierarchy and preserve consistent readable typography in dark mode across hero, rail titles, and card metadata.
3. `src/components/ui/UIScrollbar.vue`
   - Added to provide a custom horizontal scrollbar with dark skin and better rail affordance than native browser defaults.
4. `src/components/ui/UIRailTrack.vue`
   - Added to remove repeated rail markup and create a reusable horizontal track primitive.
   - Extended with `Previous`/`Next` controls to navigate by snapping to full card positions, preventing cropped card stops.
5. `src/composables/useLeaguesQuery.ts`
   - Added to isolate remote data fetching lifecycle (loading/success/error/stale) from UI rendering concerns.
6. `src/composables/useLeagueCatalogViewModel.ts`
   - Added to transform raw API payload into UI-ready hero/main-rail/sport-rail view models with deterministic ordering.
7. `src/api/sportsDb.ts`
   - Added as a typed API boundary for TheSportsDB request/response contracts used by this feature.

## Acceptance Criteria

1. On first load, the UI displays leagues from the API response.
2. Every displayed league includes all three required fields.
3. If data is temporarily unavailable, the UI remains stable and does not crash.
4. The catalog runs in dark-only mode and keeps legibility/contrast across supported viewports.

## Verification Notes

1. Updated `src/components/leagues/LeaguesCatalog.vue` so sport-group rails also render `strLeagueAlternate`, matching the "every displayed league" requirement.
2. Added `src/components/leagues/LeaguesCatalog.test.ts` to verify sport-rail cards render `strLeague`, `strSport`, and `strLeagueAlternate`.
