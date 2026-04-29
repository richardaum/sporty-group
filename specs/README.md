# Specs

This directory contains LeanSpec specifications for this project.

## Quick Start

```bash
# Create a new spec
lean-spec create my-feature

# List all specs
lean-spec list

# View the board
lean-spec board

# Validate specs
lean-spec validate
```

## Structure

Each spec lives in a numbered directory with a `README.md` file:

```
├── 001-feature-name/
│   └── README.md
└── 002-another-feature/
    └── README.md
```

## Prefix Legend

- `F`: Functional specification.
- `NF`: Non-functional specification.

Current project sequencing (numeric order):

1. `001-NF-design-system-foundation` (high, M)
2. `002-F-leagues-list-and-fields` (critical, L)
3. `003-F-search-by-league-name` (high, M)
4. `004-F-filter-by-sport` (high, M)
5. `005-F-league-click-badge-lookup` (high, M)
6. `006-NF-runtime-and-delivery` (critical, S)

## F Index

- Goal: define and sequence all F specs by business importance and implementation complexity.
- Source: `docs/pdf-instructions.md`

Breakdown:

1. `002-F-leagues-list-and-fields` - Importance: critical - Size: L
2. `003-F-search-by-league-name` - Importance: high - Size: M
3. `004-F-filter-by-sport` - Importance: high - Size: M
4. `005-F-league-click-badge-lookup` - Importance: high - Size: M

Sequencing rules:

1. Implement specs in listed numeric order.
2. For specs with UI/UX impact, use `/frontend-design` during implementation.
3. For specs with UI/UX impact, treat `001-NF-design-system-foundation` as the mandatory visual and interaction baseline.

## NF Index

- Goal: define and sequence NF specs by execution dependencies.
- Source: `docs/pdf-instructions.md`

Breakdown:

1. `001-NF-design-system-foundation` - Importance: high - Size: M
2. `006-NF-runtime-and-delivery` - Importance: critical - Size: S

Sequencing rules:

1. `001-NF-design-system-foundation` is a prerequisite for UI implementation.
2. Storybook showcase requirements are consolidated into `001-NF-design-system-foundation`.
3. API caching is a cross-cutting acceptance criterion validated within API-consuming `F` specs.
4. Responsive UX is a cross-cutting acceptance criterion validated within UI-related `F` specs.
5. Documentation and transparency are cross-cutting acceptance criteria applied to all delivered specs.
6. Runtime and delivery checks run near final integration.
7. For specs with UI/UX impact, use `/frontend-design` during implementation.
8. Any UI/UX decision in downstream specs must reference and remain consistent with `001-NF-design-system-foundation`.

## Spec Status Values

- `draft` - Being authored or refined
- `planned` - Not yet started
- `in-progress` - Currently being worked on
- `complete` - Finished
- `archived` - No longer relevant

## Execution flow

- Review the spec and make sure you understand the goal and scope.
- Once review, let the developer approve the spec.
- Once approved, start the implementation.
- Include tests and make sure they are passing.
- Update coverage to match current increasing or stable coverage.
- Make sure candidates to be reusable component are extracted to `src/components/ui` and are documented.
- If needed, include stories for components in `src/components/ui`.
- Lint and TSC should pass without errors.
- Resync spec until all items are addressed, over and over.
- Commit only after user acceptance.
- Commits should be atomic and separated by logical changes.

## Learn More

Visit [leanspec.dev](https://leanspec.dev) for documentation.
