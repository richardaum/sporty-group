# AGENTS Guide (Root)

## Project Snapshot

- Single-project frontend app (no workspace packages).
- Stack: Vue 3 + TypeScript + Vite + Vue Router + TanStack Query.
- Runtime code lives in `src/`; human-facing docs live in `docs/`.
- Agent skills and references live in `.agents/`.
- Nearest `AGENTS.md` to the edited file is authoritative.

## Root Setup Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build app (includes type-check): `pnpm build`
- Preview built app: `pnpm preview`
- Type-check only: `pnpm exec vue-tsc -b`
- Lint: `pnpm lint`
- Format check: `pnpm format:check`

## Universal Conventions

- Apply global standards from `CONVENTIONS.md`.
- Use Vue 3 Composition API with `<script setup lang="ts">`.
- Keep root guidance minimal; put area-specific detail in sub-folder guides.
- Keep commands and docs aligned with actual scripts in `package.json`.
- Prefer focused, reviewable changes with explicit verification notes.

## Security & Secrets

- Never commit credentials, API keys, tokens, or private links.
- Keep local secrets only in untracked env files such as `.env.local`.
- Sanitize docs and screenshots before committing.

## JIT Index

- Repo-wide conventions: `CONVENTIONS.md`
- App code conventions: `src/AGENTS.md`
- Documentation conventions: `docs/AGENTS.md`
- Skill content conventions: `.agents/AGENTS.md`
- Root config touch points: `package.json`, `vite.config.ts`, `eslint.config.ts`, `tsconfig*.json`

## Quick Discovery Commands

- List all local guides: `rg --files . | rg "AGENTS\\.md$"`
- Find Vue structure and state patterns: `rg -n "<script setup|ref\\(|computed\\(|watch\\(" src`
- Find routing/query usage: `rg -n "createRouter|useQuery|QueryClient" src`
- Find assignment/API references: `rg -n "thesportsdb|all_leagues|badge" docs README.md`
- Find command references in docs: `rg -n "pnpm |npm |yarn " README.md docs`

## Definition of Done

- `pnpm build` passes at repository root.
- `pnpm lint` passes for changed files/scope.
- Updated area follows its nearest `AGENTS.md`.
- No secrets or private delivery information are introduced.
