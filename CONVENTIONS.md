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

## Quality Gates

- Lint before commit (`pnpm lint`).
- Type-check with TypeScript compiler (`pnpm exec tsc --noEmit` or project-equivalent `vue-tsc`).
- Format with Prettier (`pnpm format`).
- Build and type-check before merge (`pnpm build`).
- When adding/changing core stack items, update `README.md` in the same change.
