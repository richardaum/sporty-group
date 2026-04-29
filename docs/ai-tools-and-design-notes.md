# AI tools & design notes (assignment supplement)

Concise supplement requested in the home-assignment brief. Setup, scripts, and full tooling context remain in [`README.md`](../README.md) at repository root.

## AI assistance

**Cursor** (and embedded coding agents) supported day-to-day work: scaffolding components and composables, test and config wiring, refactoring for clarity, lint/type fixes, and documentation. Choices (stack, UX patterns, file layout) stayed with the assignee; generated output was reviewed, adjusted, and covered by tests where appropriate.

## Design decisions

- **Catalog / browsing UX:** Streaming-style rails and grouping to make scanning many leagues fast and familiar on small and large viewports.
- **Search:** Command-palette / overlay pattern (including keyboard shortcut) instead of an always-visible field, to reduce chrome while keeping name search central.
- **Sport filter:** Sticky header dropdown so filters stay reachable while scrolling rails.
- **Badge lookup:** Modal flow with TanStack Query–cached season/badge data; navigator when multiple seasons exist.
- **Quality:** Component tests plus optional Playwright visual checks for regressions on key flows; Storybook for isolated UI review.
