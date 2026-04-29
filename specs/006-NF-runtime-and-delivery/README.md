---
id: 006-NF-runtime-and-delivery
type: NF
slug: runtime-and-delivery
status: complete
created: 2026-04-28
updated: 2026-04-29
---

# Spec: Runtime And Delivery

- Status: complete
- Category: NF
- Importance: critical
- Size: S
- Source: `docs/pdf-instructions.md`

## Goal

Ensure reviewers can run the project successfully from a public repository submission.

## Scope

1. Keep the solution as a single-page application.
2. Use an accepted framework (Vue, React, or Angular).
3. Deliver in a public GitHub repository with runnable setup.

## Out of Scope

1. Private deployment pipelines.
2. Production-grade hosting requirements.

## UI/UX Alignment Constraint

1. Any UI-affecting fix or polish applied during runtime/delivery hardening must keep `001-NF-design-system-foundation` as the mandatory design baseline.
2. Delivery validation should reject ad-hoc visual changes that bypass shared tokens, primitives, accessibility states, or motion rules defined in `001`.

## Implementation Plan

1. Verify project scripts and dependencies so `install`, `dev`, `build`, and `preview` flows work from a fresh clone.
2. Confirm SPA routing/runtime behavior remains correct for required assignment features.
3. Ensure repository documentation includes concise setup and run instructions for reviewers.
4. Run lint/type-check/build validation and resolve blockers that prevent local execution.
5. Validate public repository readiness (no secrets, reproducible setup, clear framework disclosure).
6. Perform final smoke test of key user flows before marking delivery complete.
7. Add Playwright visual snapshot tests per feature (`leagues-catalog`, `league-badge-lookup`, `leagues-search-overlay`, `ui-rail-track`).
8. Selecting a league row in Mission Control league search closes the search overlay and opens the league badge lookup dialog (`LeaguesSearchOverlay` → `LeaguesCatalog.onSearchResultSelect`).

## Acceptance Criteria

1. Reviewer can clone the repository and start the app locally.
2. The app launches as an SPA and exposes required assignment behaviors.
3. The selected framework is one of the accepted options.
4. Choosing a visible search result exits search mode and surfaces the badge lookup modal for that league.

## Delivery Validation Log

1. Runtime scripts validated from project root: `pnpm test`, `pnpm test:coverage`, `pnpm lint`, `pnpm exec vue-tsc -b`, `pnpm build`, `pnpm test:e2e:visual`.
2. Reviewer setup instructions are documented in `README.md` under `Reviewer Setup`.
3. Visual snapshot coverage is split by feature: `tests/e2e/leagues-catalog.visual.spec.ts` (catalog home), `tests/e2e/league-badge-lookup.visual.spec.ts` (badge dialog from rail), `tests/e2e/leagues-search-overlay.visual.spec.ts` (search overlay→badge dialog), `tests/e2e/ui-rail-track.visual.spec.ts` (rail alternate badges).
4. Playwright config and command added to repository (`playwright.config.ts`, `pnpm test:e2e:visual`).
5. Search overlay row selection wired to badge lookup overlay close-open flow (implemented in catalog + overlay components).
6. Vitest coverage thresholds kept in sync with current metrics (`pnpm test:coverage` with configured `autoUpdate` thresholds).
7. Shared UI primitives under `src/components/ui` use Storybook stories (`*.stories.ts`) where a standalone preview adds value (per `specs/README.md` execution flow).
8. **Execution flow snapshot (manual):** reviewed goal/scope → tests green → coverage thresholds aligned → ESLint/TSC/build/E2E visual → spec resync (see `specs/README.md` “Execution flow”).
