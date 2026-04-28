# AGENTS Guide: `.agents/`

## Package Identity
- `.agents/` stores AI skill definitions and reference materials used by coding agents.
- This is operational guidance content, not application runtime code.
- Changes here affect how agents plan, implement, and review work in this repo.

## Setup & Run
- No standalone install; dependencies are managed at repository root.
- Validate markdown integrity by opening updated files in the editor preview.
- Check references and links quickly:
  - `rg -n "^#|^##|^---" .agents/skills`
  - `rg -n "https?://" .agents/skills`
- Validate lock context after skill changes: `rg -n "skills|skill" skills-lock.json README.md`

## Patterns & Conventions
- Keep each skill focused on one domain (Vue, Vite, testing, prompts, etc.).
- Put canonical instructions in `SKILL.md`; keep deep examples in `references/`.
- Prefer stable, explicit file names in references (feature-oriented naming).
- Keep guidance imperative and testable (what to do, where, and how to verify).

- ✅ DO: Use `SKILL.md` as package entrypoint, e.g. `.agents/skills/vue/SKILL.md`.
- ✅ DO: Keep supporting examples in `.agents/skills/<skill>/references/*.md`.
- ✅ DO: Keep synchronization metadata files (`SYNC.md`, `GENERATION.md`) intact where present.
- ✅ DO: Keep tool-specific details grounded in real commands used by this repo.

- ❌ DON'T: Mix unrelated guidance domains into one skill file.
- ❌ DON'T: Remove or rename reference docs without updating cross-links in `SKILL.md`.
- ❌ DON'T: Add project-runtime assumptions here that contradict `package.json` scripts.
- ❌ DON'T: Treat `.agents/` as app code; avoid importing from this folder in `src/`.

## Touch Points / Key Files
- Skills inventory lock: `skills-lock.json`
- Vue implementation guidance: `.agents/skills/vue/SKILL.md`
- Vue best-practices guidance: `.agents/skills/vue-best-practices/SKILL.md`
- Vite workflow guidance: `.agents/skills/vite/SKILL.md`
- Testing guidance: `.agents/skills/vitest/SKILL.md`
- Prompt quality guidance: `.agents/skills/prompt-engineering/SKILL.md`

## JIT Index Hints
- List skill entry files: `rg --files .agents/skills | rg "SKILL\\.md$"`
- Find where a pattern is documented: `rg -n "Composition API|script setup|Vitest|Vite|pnpm" .agents/skills`
- Find sync/generated metadata: `rg --files .agents/skills | rg "SYNC\\.md$|GENERATION\\.md$"`
- Find broken or missing links candidates: `rg -n "\\]\\(.*\\)" .agents/skills`
- Find duplicate guidance by phrase: `rg -n "ALWAYS|NEVER|Best Practices" .agents/skills`

## Common Gotchas
- Some skills mirror external upstream docs; edits may need lock/sync follow-up.
- Large reference corpora can bloat tokens; keep top-level `SKILL.md` concise.
- If you add new commands, ensure they are valid in this repo (mostly `pnpm`).

## Pre-PR Checks
- `rg -n "TODO|TBD|placeholder" .agents/skills && pnpm build`
