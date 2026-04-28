# AGENTS Guide (Root)

## Project Snapshot

- Repository type: single-project frontend app (not a monorepo/workspace).
- Primary stack: Vue 3 + TypeScript + Vite 8 + `vue-tsc`.
- Main product code lives in `src/`; support docs live in `docs/`.
- AI skill content and references live in `.agents/`.
- Subdirectories have their own `AGENTS.md`; nearest file to edited code wins.

## Root Setup Commands

- Install dependencies: `pnpm install`
- Start local dev server: `pnpm dev`
- Build production bundle + type-check: `pnpm build`
- Preview production build: `pnpm preview`
- Type-check only (no dedicated script): `pnpm exec vue-tsc -b`
- Test all (not configured yet): `pnpm test`
- List scripts: `pnpm run`

## Universal Conventions

- Follow repository-wide conventions in `CONVENTIONS.md`.
- Prefer Vue SFCs with `<script setup lang="ts">` for new UI code.
- Keep TypeScript diagnostics clean (`noUnusedLocals` and `noUnusedParameters` are enabled).
- Keep imports relative unless an alias is explicitly introduced in config.
- Keep root guidance concise; add package-specific detail in sub-folder `AGENTS.md`.
- Use focused PRs with clear scope and runnable commands in PR notes.
- Before PR, run build + type-check from root and verify app boots locally.

## Security & Secrets

- Never commit API keys, tokens, or credentials to git.
- Keep local secrets in untracked env files such as `.env.local` or `*.local`.
- Avoid embedding personal or sensitive data in docs, examples, or screenshots.
- Review `docs/` content before publishing to ensure no private URLs/tokens leak.

## JIT Index (what to open, not what to paste)

### Package Structure

- Repository-wide coding conventions: `CONVENTIONS.md`
- App source: `src/` -> [see src/AGENTS.md](src/AGENTS.md)
- Documentation and assignment context: `docs/` -> [see docs/AGENTS.md](docs/AGENTS.md)
- AI skills and reference corpus: `.agents/` -> [see .agents/AGENTS.md](.agents/AGENTS.md)
- Static web assets: `public/` (icons/static files served as-is)
- Root config: `package.json`, `vite.config.ts`, `tsconfig*.json`

### Quick Find Commands

- Find Vue components: `rg -n "<script setup|defineProps|defineEmits" src`
- Find reactive state usage: `rg -n "ref\\(|computed\\(|watch\\(" src`
- Find app entry and mount: `rg -n "createApp\\(|mount\\(" src`
- Find static asset references: `rg -n "assets/|/icons\\.svg" src public`
- Find TypeScript compiler options: `rg -n "noUnused|strict|compilerOptions" tsconfig*.json`
- Find assignment/API references: `rg -n "thesportsdb|all_leagues|badge" docs README.md`
- Find AGENTS files: `rg -n "^#|^##" --glob "**/AGENTS.md" .`

## Definition of Done

- `pnpm build` succeeds from repo root.
- App runs locally with `pnpm dev` and primary flows still render.
- Changed area follows nearest `AGENTS.md` guidance.
- No secrets or private data introduced in committed files.
- PR/commit notes include what changed, why, and how it was verified.
