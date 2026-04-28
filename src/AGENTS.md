# AGENTS Guide: `src/`

## Package Identity

- `src/` contains the Vue single-page application code and global styles.
- Framework: Vue 3 SFCs with TypeScript, built and served via Vite.
- This folder should hold app logic; keep non-app instructions in `docs/`.

## Setup & Run

- Install (from root): `pnpm install`
- Dev server (HMR): `pnpm dev`
- Production build + type-check: `pnpm build`
- Type-check only: `pnpm exec vue-tsc -b`
- Preview built app: `pnpm preview`
- Lint app code: `pnpm lint`

## Patterns & Conventions

- Follow repository-wide standards from `CONVENTIONS.md` before package-specific rules.
- File organization:
  - App entry: `src/main.ts`
  - Root component shell: `src/App.vue`
  - Feature/UI components: `src/components/*.vue`
  - Static imports used by components: `src/assets/*`
  - Global styles and design tokens: `src/style.css`
- Use Vue Composition API with `<script setup lang="ts">`.
- Keep components focused; move reusable UI into `src/components/`.
- Prefer explicit, accessible markup for interactive elements.
- Keep component-specific styles inside each component `<style>` block.
- Reference global tokens from `src/style.css` inside component styles (spacing, colors, radius, shadows, typography).

- ✅ DO: Mount app via a thin bootstrap in `src/main.ts`.
- ✅ DO: Keep root composition simple, as shown in `src/App.vue`.
- ✅ DO: Define component-local reactive state using `ref`, as in `src/components/HelloWorld.vue`.
- ✅ DO: Keep shared visual tokens in CSS variables in `src/style.css`.
- ✅ DO: Keep component styling colocated in the component `<style>` block and consume shared tokens via `var(--token-name)`.
- ✅ DO: Import assets directly in components (`import heroImg from '../assets/hero.png'`) as in `src/components/HelloWorld.vue`.

- ❌ DON'T: Put business logic directly in `src/main.ts`; keep it as bootstrap-only.
- ❌ DON'T: Use Options API patterns in new components when existing code uses `<script setup lang="ts">`.
- ❌ DON'T: Hardcode duplicate color values in many selectors; extend variables in `src/style.css` instead.
- ❌ DON'T: Place component-only selectors in `src/style.css`; keep them in the owning `.vue` file.
- ❌ DON'T: Keep template/demo copy in production features (current starter copy in `src/components/HelloWorld.vue` is placeholder content).

## Touch Points / Key Files

- App bootstrap: `src/main.ts`
- Root layout composition: `src/App.vue`
- Example component structure: `src/components/HelloWorld.vue`
- Global styling + CSS variables: `src/style.css`
- Bundler integration for Vue SFCs: `vite.config.ts`
- TS app scope config: `tsconfig.app.json`

## JIT Index Hints

- Find Vue SFC entry points: `rg -n "<script setup" src`
- Find component imports/usage: `rg -n "import .*\\.vue|<HelloWorld" src`
- Find reactive primitives: `rg -n "ref\\(|computed\\(|watch\\(" src`
- Find event handlers: `rg -n "@click|@input|@change" src`
- Find CSS vars and where used: `rg -n -- "--[a-z0-9-]+|var\\(--" src/style.css src/components`
- Find static assets references: `rg -n "assets/|\\.svg|\\.png" src`

## Common Gotchas

- `pnpm build` already runs type-checking (`vue-tsc -b`) before bundling.
- `target="_blank"` links should include `rel="noopener noreferrer"` when you add or modify external links.
- If you add new env-driven behavior, keep client-safe vars prefixed with `VITE_`.
- Keep `src/style.css` readable; nested selectors are used heavily and can become hard to maintain.

## Pre-PR Checks

- `pnpm lint`
- `pnpm exec vue-tsc -b`
- `pnpm build`
