# Conventions

## Global Rules

- Prefer configuration files in TypeScript whenever the tool supports it.
- Keep code and docs aligned with real scripts available in `package.json`.
- Prefer `pnpm` commands for dependency management and scripts.
- Keep changes focused and easy to review.
- Keep important dependencies and tools updated in `README.md` under `Tools Used`.
- Keep important skills updated in `README.md` under `Skills Used`.
- Keep all generated code 100% in English (identifiers, comments, strings, and messages).

## TypeScript-First Config

- Use `.ts` for config files when supported (for example: `eslint.config.ts`).
- Use non-TypeScript configs only when the tool cannot load TypeScript config reliably.
- If a non-TypeScript config is required, keep it minimal and document why in comments.

## Vue Code Style

- Use Vue 3 Composition API with `<script setup lang="ts">`.
- Keep root/view components focused on composition; move feature logic to components/composables.
- Prefer explicit, typed props/emits contracts.

## DataViewModel (Vue)

- Use `use<Feature>DataViewModel` as the primary composable pattern for feature state and domain-to-UI mapping.
- Keep `.vue` components focused on rendering, event wiring, and accessibility markup.
- Prefer derived state in DataViewModels (`computed`) and keep side effects localized near the owning DataViewModel.
- Name outputs by intent (`mainRailItems`, `sportRails`, `isSearchOpen`) rather than generic names (`items`, `state`).
- Keep one canonical contract per feature; avoid compatibility aliases after migration.

## Imports

- Prefer absolute imports rooted at `@/` for all internal modules under `src/`.
- Do not use parent-relative imports (`../` or `./`) for internal app modules when an `@/` path is available.
- Keep external package imports unchanged (for example `vue`, `@tanstack/vue-query`).

## Styling Rules

- Component-specific styles must live in the component itself (`<style>` in `.vue` files).
- `src/style.css` is reserved for global styles, design tokens, resets, and shared utility patterns.
- Component styles must reference global tokens from `src/style.css` (for example `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`) instead of hardcoded repeated values.
- When a visual value starts repeating across components, promote it to a token in `src/style.css` and consume it from component `<style>` blocks.
- Do not rely on `:deep(...)` for routine component customization; prefer explicit extension points in the component API (for example props/variants or class hooks) and style those in the owning component.

## Layout Alignment Rules

- Use one horizontal reference container (`width: min(100%, <max-width>)` + `margin: 0 auto`).
- Header and main content must share this same left/right alignment.
- Put viewport breathing space in shell/wrapper padding, not by shifting inner sections.
- Keep component spacing internal (card/body padding), without changing page edge alignment.
- Define shared layout tokens once (for example `--layout-max-width` and `--layout-inline-pad`) and consume the same tokens in both header and main wrappers.
- Do not use breakpoint-specific "magic numbers" to realign header/content after the fact; fix the shared container contract instead.
- If layout alignment depends on DOM measurements, document why static CSS tokens were insufficient and keep the fallback logic minimal.

## Layout Alignment Checklist (PR)

- Header wrapper and main wrapper use the same max-width and inline-padding source.
- Hero/first content section starts on the same left edge as header content.
- Alignment is validated at three ranges: small, medium/intermediate, and large desktop.
- Sticky/scrolled header state must not change horizontal alignment.
- Any intentional offset is documented inline in code and noted in the PR description.

## Alignment Exceptions

- `UIRailTrack` is an indirect-alignment component: inherit outer alignment from parent; control only rail behavior (scroll/gap/card sizing/scrollbar).
- Rails with intentional horizontal overflow may overflow locally, but must keep parent left/right edges aligned.
- Decorative layers (hero overlay, skeleton, gradients) may add internal padding, not outer offset.
- Any intentional alignment break must be documented inline with a short reason.

## Quality Gates

- Lint before commit (`pnpm lint`).
- Type-check with TypeScript compiler (`pnpm exec tsc --noEmit` or project-equivalent `vue-tsc`).
- Format with Prettier (`pnpm format`).
- Build and type-check before merge (`pnpm build`).
- Keep test coverage always increasing: new changes must maintain or improve current coverage (never decrease it).
- When adding/changing core stack items, update `README.md` in the same change.
