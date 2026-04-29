# Sporty Group - Home Assignment (FE)

This repository contains the frontend take-home assignment solution for Sporty Group.
The goal is to deliver a runnable single-page application that consumes TheSportsDB APIs, lists sports leagues, supports filtering/search, and displays season badge data with caching.

It also serves as the delivery package for the recruiting process, including assignment context in `docs/pdf-instructions.md` and a sanitized communication reference in `docs/email-instructions.md`.

**Concise AI and design notes (brief supplement):** [`docs/ai-tools-and-design-notes.md`](docs/ai-tools-and-design-notes.md)

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

## Tools Used

- **Vue 3** for building the user interface with reactive components (despite my familiarity with React, I chose Vue to highlight my skills in the framework used by the company).
- **TypeScript** for static typing and safer, more maintainable code.
- **Vite** as the development server and build tool for fast feedback loops.
- **Vue Router** for declarative client-side routing and navigation between views.
- **TanStack Query (Vue Query)** for server-state fetching, caching, and synchronization.
- **Radix Vue** as the base primitive layer for accessible interactive controls (currently applied to Select).
- **@phosphor-icons/vue** for consistent iconography in reusable UI components and stories.
- **Storybook** for shareable component previews and state documentation.
- **ESLint** for static analysis and consistent code quality in JavaScript/TypeScript and Vue files.
- **Prettier** for automated, consistent code formatting across the project.
- **lint-staged** for running lint/format only on staged files during commits.
- **Husky** for managing Git hooks like `pre-commit`.
- **Cursor** as an AI assistant for development workflows and coding support.
- **Vue `<script setup>` SFCs** for a concise and modern component authoring style.

## Skills Used

- [frontend-design](https://github.com/julianoczkowski/designer-skills/tree/main/frontend-design) - Build distinctive, production-grade frontend interfaces with high design quality and clear aesthetic direction.
- [vue](https://github.com/antfu/skills/tree/main/skills/vue) - Vue 3 Composition API patterns and best practices.
- [vue-best-practices](https://github.com/antfu/skills/tree/main/skills/vue-best-practices) - Guidance on Vue component structure and conventions.
- [vue-testing-best-practices](https://github.com/antfu/skills/tree/main/skills/vue-testing-best-practices) - Robust Vue testing patterns with Vitest and Vue Test Utils.
- [vite](https://github.com/antfu/skills/tree/main/skills/vite) - Vite configuration and build workflow.
- [vue-router-best-practices](https://github.com/antfu/skills/tree/main/skills/vue-router-best-practices) - Vue Router 4 navigation and guard patterns.
- [pnpm](https://github.com/antfu/skills/tree/main/skills/pnpm) - Dependency and workspace management.
- [vueuse-functions](https://github.com/antfu/skills/tree/main/skills/vueuse-functions) - Applying VueUse composables to simplify feature implementation.
- [web-design-guidelines](https://github.com/antfu/skills/tree/main/skills/web-design-guidelines) - UI and accessibility reviews based on web standards.
- [vitest](https://github.com/antfu/skills/tree/main/skills/vitest) - Fast unit testing integrated with the Vite ecosystem.
- [prompt-engineering](https://github.com/NeoLabHQ/context-engineering-kit/tree/master/plugins/customaize-agent/skills/prompt-engineering) - Writing high-quality prompts, hooks, and agent workflows.
- [generate-agents](https://github.com/RayFernando1337/llm-cursor-rules/blob/main/generate-agents.md) - Generating lightweight root and detailed sub-folder AGENTS.md files with JIT indexing.
- [lean-spec](https://github.com/codervisor/lean-spec) - Lightweight, spec-driven planning and execution workflows.

## Design Decisions

- **Netflix-inspired UI/UX:** The visual direction and browsing behavior follow a streaming-style catalog experience to make league discovery feel familiar and fast.
- **Reusable rail track component:** `UIRailTrack` is used as a shared horizontal rail primitive to keep carousel behavior consistent across league groups.
- **Mobile-first approach:** Layout, spacing, and interactions are designed for smaller screens first, then progressively enhanced for tablet and desktop.
- **Mission Control-style search:** Search is exposed through an overlay pattern inspired by Mission Control/command palette workflows for quick keyboard-first access.
- **Sticky sport filter dropdown:** The sport filter remains available in the sticky header so users can refine results without losing browsing context.
- **Season badge navigator:** Badge lookup presents available badges across seasons with `UIItemNavigator`, enabling quick back/forward season comparison.
- **Composable-first behavior isolation:** Interaction and state logic are pushed into focused composables to isolate behaviors, keep components lean, and improve testability.
- **Unit tests with coverage thresholds:** Vitest runs component and composable tests (Vue Test Utils and Testing Library); `pnpm test` validates behavior, and `pnpm test:coverage` reports V8 coverage over `src` with enforced minimums so changes do not silently erode baseline coverage.
- **Visual consistency workflow:** Storybook is included for isolated UI states, and Playwright visual snapshots are used to catch regressions across key user flows.
