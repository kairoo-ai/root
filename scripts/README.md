# scripts

Build and CI tooling. Reserved skeleton - no business logic yet.

Catalog:

- `build-tokens.ts` -> generates design tokens (emits `app/styles/tokens.generated.css`).
- `check-no-raw-colors.mjs` -> color guard (fails on raw color literals; enforces `var(--...)` token usage).
