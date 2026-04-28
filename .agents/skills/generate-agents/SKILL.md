# Generate Hierarchical AGENTS.md

Source: https://github.com/RayFernando1337/llm-cursor-rules/blob/main/generate-agents.md

## Purpose

Analyze a repository and produce a lightweight root `AGENTS.md` plus detailed sub-folder `AGENTS.md` files that follow nearest-wins hierarchy and JIT indexing principles.

## Core Principles

1. Root `AGENTS.md` stays lightweight and links to sub-files.
2. Nearest-wins hierarchy: the closest `AGENTS.md` to edited files is authoritative.
3. JIT indexing: provide paths/globs/commands, not pasted encyclopedic docs.
4. Token efficiency: concise, actionable guidance.
5. Sub-folder `AGENTS.md` files contain concrete local patterns and examples.

## Workflow

### Phase 1: Repository Analysis

Produce a structured map before writing files:

1. Repository type (monorepo, multi-package, single project).
2. Primary stack (languages, frameworks, key tools).
3. Major directories/packages that need dedicated `AGENTS.md`.
4. Build system (pnpm/npm/yarn workspaces, Turborepo, etc.).
5. Testing setup and test locations.
6. Key patterns to document:
   - Organization patterns
   - Naming/styling conventions
   - Critical reference files
   - Anti-patterns to avoid

### Phase 2: Root AGENTS.md

Generate a lightweight root file (~100-200 lines) with:

1. Project snapshot (3-5 lines)
2. Root setup commands (install/build/typecheck/test)
3. Universal conventions
4. Security and secrets guidance
5. JIT index directory map
6. Definition of done

### Phase 3: Sub-Folder AGENTS.md Files

For each major directory, generate a detailed file with:

1. Package identity
2. Setup and run commands
3. Patterns and conventions (most important; include concrete examples)
4. Touch points / key files
5. JIT index hints
6. Common gotchas
7. Pre-PR checks

### Phase 4: Special Considerations

Add focused sections when applicable:

- Design system / UI package
- Database / data layer
- API / backend services
- Testing packages

## Output Format

Return content in this order:

1. Analysis summary
2. Root `AGENTS.md`
3. Each sub-folder `AGENTS.md` with its target file path

Use:

```text
---
File: `AGENTS.md` (root)
---
[full content]

---
File: `path/to/AGENTS.md`
---
[full content]
```

## Quality Checklist

- Root `AGENTS.md` under 200 lines
- Root links to all sub-AGENTS files
- Sub-files include concrete examples with real paths
- Commands are copy-paste ready
- No duplication between root and sub-files
- JIT hints use real codebase search patterns
- Every do/don't uses real examples where possible
- Pre-PR checks are concise and executable
