# Kairoo - Architecture Map (reserved skeleton)

The canonical structure the whole product grows into. Sibling to [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md)
(which owns tokens/theme). This doc owns **folders, layers, and import boundaries.**

> **Status:** reserved skeleton. Folders are created with a `README.md` (purpose) and, where they're
> an import surface, an `index.ts` barrel + compilable typed stubs. **No speculative logic** - every
> reservation maps to a known roadmap need (auth gate, tiers, AI cost caps, billing). YAGNI holds.

`@/*` maps to the repo root (tsconfig), so every top-level dir imports as `@/config`, `@/engines/ai`, etc.

---

## Layered dependency rule (one-way, downward)

```
app/ (routes: UI + API)
  └─► components/         (presentational layers, also downward-only - see below)
  └─► server/             (request-scoped glue: auth gate, ratelimit, action wiring)  [server-only]
        └─► services/     (per-user use-case orchestration + policy: entitlements, metering)
              ├─► engines/ (pure domain capability - no user/auth/db)
              └─► data/    (persistence I/O - the only layer touching a DB)
  config/ content/ types/ constants/   (declarative data + shapes - imported by anyone, import nothing)
  lib/                    (leaf utilities - utils, errors, result, logger, observability, stores)
```

Top calls down; nothing imports `app/`. `lib/`, `config/`, `content/`, `types/` are leaves.

---

## Top-level map

| Dir           | Responsibility                                                                                                                                                                          | Status         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `app/`        | Next App Router routes + API. Route groups per surface (see below).                                                                                                                     | exists         |
| `components/` | Presentational layers: `ui` → `motion`/`brand`/`charts`/`layout` → `blocks` → `shells`. One-way downward; one barrel per layer; feature-private UI colocates in `app/.../_components/`. | partial        |
| `lib/`        | Leaf logic utilities: `design/tokens`✓, `legal`✓, `utils.ts`✓, + `errors/`, `result/`, `logger/`, `observability/`, `stores/`.                                                          | partial        |
| `engines/`    | **Pure** domain capability (stateless, no user/auth/db): `ai/` (Gemini orchestration - model routing, prompt registry, feature defs), `career/`, `learning/`.                           | reserve        |
| `services/`   | **Per-user** orchestration + policy: `ai/` (entitlement→meter→engine→record), `auth/`, `billing/`, `entitlements/`, `usage/`, `notifications/`. The only place AI cost-caps live.       | reserve        |
| `server/`     | Request-scoped, `server-only` glue: `context.ts`, `auth/` (session, guards: `requireUser`/`requireTier`/investor gate), `ratelimit/`, `actions/` (typed Server Action factory).         | reserve        |
| `data/`       | Only layer touching a DB: `repositories/` (typed interfaces + stubs), `schema/`, `client.ts` (placeholder). ORM chosen later.                                                           | reserve        |
| `config/`     | Declarative product config: `site`, `routes`, `navigation`, `flags`, `tiers`, `pricing`, `seo`, `env`. UI never hardcodes hrefs/labels or reads `process.env`.                          | reserve        |
| `content/`    | Static marketing/investor data (typed `.ts`): `marketing/`, `testimonials`, `investors/`. (Legal content stays in `lib/legal/`.)                                                        | reserve        |
| `types/`      | Cross-cutting shared types only (colocate the rest): `content`, `tiers`, `seo`, `analytics`.                                                                                            | reserve        |
| `constants/`  | Engineering invariants not covered by tokens/config (starts ~empty).                                                                                                                    | reserve        |
| `hooks/`      | Global cross-surface hooks (`use-*`); feature hooks colocate in `app/.../_hooks/`.                                                                                                      | reserve        |
| `tests/`      | `e2e/` (Playwright, later) + `setup/`. Unit/component tests colocate (`*.test.tsx`). Vitest+RTL.                                                                                        | reserve (docs) |
| `scripts/`    | `build-tokens.ts`✓, `check-no-raw-colors.mjs`✓ (+ catalog README).                                                                                                                      | exists         |
| `public/`     | `brand/`✓ + `images/`, `icons/`, `fonts/`.                                                                                                                                              | partial        |
| `app/styles/` | `tokens.generated.css`✓ + `keyframes.css`, `utilities.css` (token-referencing only).                                                                                                    | partial        |

---

## `app/` route surfaces (single shared root layout)

One root `app/layout.tsx` (owns `<html>/<body>`, fonts, `<Providers>`); each surface gets a **nested**
layout/shell (no `<html>`), preserving SPA navigation:

| Surface                              | Path               | Shell                  | URL                |
| ------------------------------------ | ------------------ | ---------------------- | ------------------ |
| Marketing (public, conversion-first) | `app/(marketing)/` | `MarketingShell`       | `/`, `/pricing`, … |
| Investors (own nav, gate later)      | `app/investors/`   | `InvestorShell`        | `/investors/*`     |
| Authenticated product (future)       | `app/(app)/`       | `AppShell` (sidebar)   | `/dashboard`, …    |
| Auth flows                           | `app/(auth)/`      | `AuthShell` (centered) | `/sign-in`, …      |
| Legal                                | `app/legal/`       | `LegalShell`           | `/legal/*`         |
| API                                  | `app/api/`         | -                      | route handlers     |

Conventions: `loading.tsx`/`error.tsx` per shell root; `not-found.tsx`/`template.tsx` in `(app)` only;
metadata files (`sitemap.ts`✓, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`) at app root; route-private
code in `_components/`/`_lib/` (underscore = excluded from routing). A component promotes to global
`components/` only when a **second** surface imports it.

> Route-group scaffolding + page relocation are executed in the foundation plan's Phase 2 (they touch
> routing/redirects), not the safe skeleton pass.

---

## Key conventions

- **Config-as-code:** `export const x = {...} as const; export type X = typeof x`. Mirrors `lib/design/tokens`.
- **One barrel per layer/domain** (`index.ts`); no global mega-barrel; feature `_components/` get none.
- **Tokens are the only source of color/type/space values.** `styles/` may compose tokens (`var(--…)`),
  never literals (color guard enforces). Never add `tailwind.config.*` (Tailwind v4 CSS-first).
- **Secrets** only via `config/env` inside `server`/`services`/`engines` (`import 'server-only'`); never client.
- **Server Actions vs Route Handlers:** Actions for own-UI mutations; Route Handlers for external/webhook/
  streaming. Both are thin transports → validate (zod, later) → `server/` gate → `services/` → `Result`.
- **engine vs service:** engine = pure capability (`aiEngine.generate(featureId, inputs)`, no user);
  service = policy-bearing per-user orchestration (`aiService.run({user, featureId, inputs})` enforces
  tier caps + metering). AI cost control is isolated in `services/ai` + `services/usage`.

---

## Migration seams (later, documented now)

`app/api/ai/route.ts` + `lib/ai-tools.ts` → `engines/ai/*` (with a re-export shim so nothing breaks) →
wrapped by `services/ai` once tiers/usage exist. Scattered investor/legal pages → `app/investors/*` /
`app/legal/*`. `app/hero.ts` → `content/marketing/hero.ts`. Analytics → `lib/observability` no-op seam,
consent-gated, flipped on when GA lands.

---

## Reference

- Design system: [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md)
- Foundation spec/plan: [`superpowers/specs/2026-06-14-ui-foundation-and-shells-design.md`](superpowers/specs/2026-06-14-ui-foundation-and-shells-design.md) · [`superpowers/plans/2026-06-14-ui-foundation-and-shells.md`](superpowers/plans/2026-06-14-ui-foundation-and-shells.md)
