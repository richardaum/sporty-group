---
id: 005-F-league-click-badge-lookup
type: F
slug: league-click-badge-lookup
status: draft
created: 2026-04-28
updated: 2026-04-28
---

# Spec: League Click Badge Lookup

- Status: draft
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

1. Aesthetic philosophy: Scandinavian with clear selection and result feedback.
2. Clicked/selected league state must be visually distinct from unselected items.
3. Badge display should appear in a predictable location to avoid layout confusion.
4. Mobile-first behavior: badge area should stack naturally below list content on narrow screens.
5. Accessibility baseline: selected state and badge availability must not rely on color alone.
6. Motion baseline: use subtle reveal for badge updates; honor reduced-motion settings.

## Implementation Plan

1. Add selected league state management to the list interaction layer (click and keyboard activation support).
2. Trigger `search_all_seasons.php?badge=1&id=<id>` when a league is selected and track request lifecycle state.
3. Parse and validate badge payload, choosing a primary badge image to render in a dedicated preview area.
4. Implement fallback UI for missing badges or failed requests without disrupting list interaction.
5. Apply clear selected-state styling and non-color cues to meet accessibility requirements.
6. Keep badge panel placement predictable across mobile and desktop breakpoints.
7. Verify that badge fetches remain scoped to the actively selected league and update deterministically on re-selection.

## Acceptance Criteria

1. Clicking a league issues a badge API request with that league ID.
2. After a successful response, at least one badge image is shown.
3. If no badge exists, fallback UI handles the state without breaking the page.
