# AGENTS Guide: `docs/`

## Package Identity

- `docs/` stores assignment instructions, delivery context, and supporting written material.
- Content is Markdown-first and intended for human readers, not runtime execution.
- Keep docs aligned with the current implementation and command reality.

## Setup & Run

- No package-specific install needed; run from root with `pnpm install`.
- Preview docs quickly in editor markdown preview.
- Validate command references by running from root:
  - Dev: `pnpm dev`
  - Build: `pnpm build`
  - Preview: `pnpm preview`
- Link/content checks (manual): `rg -n "http|https|pnpm|npm|yarn" docs README.md`

## Patterns & Conventions

- Follow repository-wide standards from `CONVENTIONS.md` before docs-specific rules.
- Keep docs concise and action-oriented; prefer short sections and bullet lists.
- Use fenced code blocks for commands; keep them copy-paste ready.
- When citing API endpoints, include purpose and expected context.
- Ensure statements about project behavior match current files and scripts.

- ✅ DO: Keep assignment requirements in dedicated docs (`docs/pdf-instructions.md`).
- ✅ DO: Keep communication/recruiter context separate (`docs/email-instructions.md`).
- ✅ DO: Reference real project scripts from `package.json`.
- ✅ DO: Use explicit paths like `src/App.vue` when telling users what to edit.

- ❌ DON'T: Duplicate the same long instruction blocks across multiple docs.
- ❌ DON'T: Introduce secrets/tokens in copied email or API examples.
- ❌ DON'T: Document commands that do not exist in `package.json` without clearly labeling them as future work.
- ❌ DON'T: Move implementation notes into docs when they belong in code comments near the source.

## Touch Points / Key Files

- Core assignment requirements: `docs/pdf-instructions.md`
- Recruiter/submit flow context: `docs/email-instructions.md`
- Project overview and stack notes: `README.md`
- Source-of-truth scripts and tooling: `package.json`

## JIT Index Hints

- Find API references in docs: `rg -n "api|endpoint|thesportsdb|badge|league" docs README.md`
- Find command snippets: `rg -n "pnpm |npm |yarn " docs README.md`
- Find deliverable requirements: `rg -n "submit|delivery|runnable|repo" docs`
- Find timeline constraints: `rg -n "90 minutes|5 working days" docs`
- List markdown docs: `rg --files docs | rg "\\.md$"`

## Common Gotchas

- `docs/email-instructions.md` should stay sanitized; avoid exposing private submission channels.
- Assignment docs can drift from code quickly; re-check after changing scripts or architecture.
- Avoid mixing private process notes with repo-facing delivery docs.

## Pre-PR Checks

- `rg -n "TODO|TBD|placeholder|lorem" docs README.md && pnpm build`
