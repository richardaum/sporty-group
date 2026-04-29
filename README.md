# Sporty Group - Home Assignment (FE)

This repository contains the frontend take-home assignment solution for Sporty Group.
The goal is to deliver a runnable single-page application that consumes TheSportsDB APIs, lists sports leagues, supports filtering/search, and displays season badge data with caching.

It also serves as the delivery package for the recruiting process, including assignment context in `docs/pdf-instructions.md` and a sanitized communication reference in `docs/email-instructions.md`.

For **concise AI, tooling, skills, and design rationale**—as requested in those briefs—see **[`docs/ai-tools-and-design-notes.md`](docs/ai-tools-and-design-notes.md)** (starts with a **TL;DR**).

## Reviewer Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173` to run the SPA locally.

## Validation Commands

```bash
pnpm test
pnpm test:coverage
pnpm lint
pnpm build
pnpm test:e2e:visual
```
