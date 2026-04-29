# Sporty Group - Home Assignment (FE)

## Demo

<video controls playsinline muted width="100%" src="https://github.com/richardaum/sporty-group/raw/main/demo.mov">
  <a href="https://github.com/richardaum/sporty-group/raw/main/demo.mov">Download demo (QuickTime .mov)</a>
</video>

_Screen recording of the assignment app in the dev environment. If the player does not load in your browser, use the download link above._

---

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
