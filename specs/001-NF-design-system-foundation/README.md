---
id: 001-NF-design-system-foundation
type: NF
slug: design-system-foundation
status: in-progress
created: 2026-04-28
updated: 2026-04-28
---

# Spec: Design System Foundation

- Status: in-progress
- Category: NF
- Importance: high
- Size: L
- Source: `docs/pdf-instructions.md`
- Design Skill: `/frontend-design`

## Goal

Establish a minimal design system foundation to ensure visual consistency, accessibility, and scalable UI implementation.

## Design Decisions

1. Base component library: `Radix Vue` primitives (`https://www.radix-vue.com/`) as the accessibility and behavior foundation.
2. Brand typography: `Outfit` as the primary font family across UI surfaces and controls.
3. Primary color direction: red palette aligned with Sporty Group's SportyBet brand language.
4. Radius direction: subtle corners only; avoid strongly rounded pills and exaggerated curvature.
5. Spacing direction: condensed vertical/horizontal rhythm to support dense information display.
6. Shadow direction: avoid elevation-heavy shadows; prefer contrast, border, and color hierarchy.
7. Storybook is the source of truth for shareable component preview and state validation.
8. Iconography baseline uses `@phosphor-icons/vue` for consistent, lightweight icon usage.

## Scope

1. Define core design tokens (color, typography, spacing, radius, shadow).
2. Define foundational component styles for input, select, button, and card surfaces.
3. Define interactive states (hover, focus-visible, active, disabled, error).
4. Define light/dark theming via CSS variables.
5. Support reduced-motion preferences for transition behavior.
6. Anchor base patterns in Radix Vue primitives while keeping visual styling system-owned.
7. Define condensed spacing scale and subtle radius scale as first-class tokens.
8. Keep shadows minimal or none for primary surfaces and controls.
9. Configure Storybook for Vue + Vite and document reusable components with representative states.
10. Use Phosphor icons in shareable component examples where iconography is needed.

## Out of Scope

1. Publishing Storybook externally in this phase.
2. Brand illustration/iconography system.
3. Complex animation language beyond assignment needs.
4. Component tokens. We will use only first and second level tokens.

## Implementation Plan

1. Audit current UI styles and map repeated values into a first and second level token structure.
2. Define light and dark theme variables for color, typography, spacing, radius, and shadow in shared style entry points.
3. Refactor core shared controls (`input`, `select`, `button`, `card`) to consume only tokenized values and Radix Vue primitives.
4. Add interactive state styles (`hover`, `focus-visible`, `active`, `disabled`, `error`) with accessible contrast and subtle motion.
5. Apply `prefers-reduced-motion` fallbacks to transitions used by shared components.
6. Install and wire `@phosphor-icons/vue` into shared examples and at least one reusable component surface.
7. Configure Storybook (Vue + Vite), then add stories for core primitives with representative states in light and dark mode.
8. Validate token and component consistency across league list, search, filter, and badge flows before closing the spec.

## Acceptance Criteria

1. Shared tokens are centralized and reused across league list, search, filter, and badge UI.
2. Base controls have consistent spacing, typography, radius, and focus behavior.
3. Dark mode values are defined without naive color inversion.
4. Motion is reduced or disabled under `prefers-reduced-motion`.
5. Visual changes remain coherent across mobile and desktop breakpoints.
6. Typography token stack uses `Outfit` as default UI font in both light and dark themes.
7. Primary semantic tokens are based on a red brand scale mapped to actionable components.
8. Radius tokens cap at subtle values, with no highly rounded component variants in defaults.
9. Spacing tokens provide a condensed baseline that is consistently applied in forms and lists.
10. Shadow tokens are absent or near-zero by default, except when required for accessibility contrast.
11. Storybook starts locally and includes stories for core shared primitives (`input`, `select`, `button`, `card`).
12. Storybook stories consume the same token system as application styles.
13. Phosphor icon library is installed and used in at least one shared component showcase.
