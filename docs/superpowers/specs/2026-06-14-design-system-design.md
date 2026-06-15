# Kairoo Design System - Design Doc

**Date:** 2026-06-14
**Owner:** Eshank Tyagi (eshank@matters.ai)
**Branch:** `latest`
**Status:** Design - pending user review → implementation plan.

> The canonical, strict, library-agnostic design system for Kairoo. Built now as the
> foundation for an upcoming full app rewrite (new UI/component libraries). Source of truth
> is a typed TS tokens module that emits both CSS variables and JS objects, so every
> consumer - Tailwind v4, shadcn, HeroUI, Aceternity/Animate UI, Motion, Anime.js,
> Chart.js, and future React Native - inherits one system.
>
> Builds on the locked brand (see `2026-06-13-rebrand-and-legal-design.md` §3 and
> `docs/brand/`): name Kairoo, glyph, palette anchors, fonts, voice.

---

## 0. Decisions locked in brainstorming

- **Token source of truth:** typed TS module → generates CSS vars + exports JS objects.
- **Color depth:** full **50–950 OKLCH ramps** per hue + semantic layer + tier tokens.
- **Scope:** full strict system - tokens, semantic mapping, HeroUI theme, all scales,
  `/style` reference page, lint/CI guard banning raw colors, base component primitives.
- **Monospace:** add **Geist Mono** (`--font-mono`).
- **Visual validation:** the `/style` route is the living visual contract (no ephemeral tool).

---

## 1. Architecture & build pipeline

**Source of truth:** `lib/design/tokens/`

```
lib/design/tokens/
  ramp.ts          # OKLCH ramp generator (anchor + lightness/chroma curve → 50..950)
  colors.ts        # primitive ramps + state hues + semantic map (light/dark) + tiers
  typography.ts    # families, type scale (size/line-height/weight/tracking)
  spacing.ts       # spacing scale + semantic layout tokens
  radius.ts        # radii
  shadows.ts       # elevation + surface/glass tokens
  motion.ts        # durations + easings
  zIndex.ts        # layering scale
  breakpoints.ts   # responsive breakpoints
  index.ts         # aggregates → `tokens` object + typed helpers
```

**Generator:** `scripts/build-tokens.mjs` (run via `npm run tokens` and `prebuild`):

- Imports the tokens module, emits a committed **`app/styles/tokens.generated.css`** with
  all primitives + semantic vars under `:root` and `.dark`.
- The file is generated (never hand-edited); a header comment says so.

**CSS consumption:** `app/globals.css` keeps `@import "./styles/tokens.generated.css";`
then maps semantic vars into Tailwind v4 `@theme inline` (`--color-primary: var(--color-primary)`, etc.) so utilities like `bg-primary`, `text-muted-foreground`, `ring-ring`, `bg-teal-500` all resolve.

**JS consumption:** `import { colors, motion, typography } from "@/lib/design/tokens"`
for Motion/Anime/Chart.js and future native targets. No hardcoded values in those call sites.

**Light/dark:** class strategy via `next-themes` (unchanged). Primitives are theme-independent;
the semantic layer flips under `.dark`.

---

## 2. Color system

### 2.1 Primitive ramps (OKLCH, 11 steps: 50,100,200,300,400,500,600,700,800,900,950)

Generated from an anchor + a shared lightness curve, with per-hue chroma. Anchors tie to the
locked brand:

| Ramp      | Role                                     | Anchor (brand)                                | Approx hue (OKLCH H) |
| --------- | ---------------------------------------- | --------------------------------------------- | -------------------- |
| `teal`    | **Primary**                              | `teal-600 = #0D9488`, `teal-400 = #2DD4BF`    | ~184                 |
| `navy`    | Brand anchor / ink / enterprise          | `navy-900 = #0B1F3A`, `navy-950 = #071426`    | ~250                 |
| `amber`   | Warm accent / Free tier                  | `amber-500 = #F59E0B`                         | ~70                  |
| `gold`    | Enterprise-premium accent                | `gold-500 = #CBA34A`                          | ~85                  |
| `neutral` | Slate-cool grays (text/borders/surfaces) | `neutral-50…950`                              | ~250 (very low C)    |
| `success` | Positive state                           | green `~#16A34A`                              | ~150                 |
| `warning` | Caution state                            | orange `~#D97706` (distinct from brand amber) | ~55                  |
| `error`   | Destructive/negative                     | red `~#DC2626`                                | ~27                  |
| `info`    | Informational                            | blue `~#2563EB`                               | ~255                 |

**Lightness curve (baseline, tuned per hue in `ramp.ts`):**
`50:0.97, 100:0.94, 200:0.88, 300:0.80, 400:0.70, 500:0.62, 600:0.55, 700:0.48, 800:0.40, 900:0.32, 950:0.24`.
Chroma rises toward the 500–600 mids and eases at the extremes; neutrals use near-zero chroma.
The generator clamps to sRGB-safe values; exact computed values are validated on `/style`.

### 2.2 Semantic layer (shadcn-compatible names - every component inherits brand)

Each maps to ramp steps and **flips per theme**:

| Token                                            | Light                         | Dark                       |
| ------------------------------------------------ | ----------------------------- | -------------------------- |
| `background`                                     | `#FFFFFF` (neutral-50)        | `navy-950 #071426`         |
| `foreground`                                     | `navy-900`                    | `neutral-50` (mist)        |
| `card` / `card-foreground`                       | white / navy-900              | `navy-900` / neutral-50    |
| `popover` / `-foreground`                        | white / navy-900              | navy-900 / neutral-50      |
| `primary` / `primary-foreground`                 | `teal-600` / white            | `teal-400` / `navy-950`    |
| `secondary` / `-foreground`                      | `neutral-100` / navy-800      | `navy-800` / neutral-100   |
| `muted` / `muted-foreground`                     | `neutral-100` / `neutral-500` | `navy-800` / `neutral-400` |
| `accent` / `-foreground`                         | `teal-50` / `teal-700`        | `navy-800` / `teal-300`    |
| `border`                                         | `neutral-200`                 | `white / 10%`              |
| `input`                                          | `neutral-200`                 | `white / 15%`              |
| `ring`                                           | `teal-500`                    | `teal-400`                 |
| `destructive` / `-foreground`                    | `error-600` / white           | `error-500` / navy-950     |
| `success` / `warning` / `info` (+ `-foreground`) | state-600                     | state-500                  |

**Surface/glass** (formalize existing): `surface-glass`, `surface-shell`, `surface-border`,
`surface-border-strong`, `surface-glow` - per theme.

### 2.3 Tier tokens (the "grows with you" signal)

`tier-free` → amber-500 · `tier-pro` → teal-600 · `tier-enterprise` → navy-900 (+ `gold-500` accent).
Each with a `-bg` (soft) and `-fg` (text) pair for badges.

---

## 3. Typography

**Families:** `--font-sans` DM Sans · `--font-display` Space Grotesk · `--font-data` Mona Sans
(tabular) · `--font-mono` Geist Mono. Loaded via `next/font/google`; weights **400/500/700/800**.

**Type scale** (token → size / line-height / weight / tracking / family):

| Token      | Size                       | LH   | Weight | Tracking           | Family              |
| ---------- | -------------------------- | ---- | ------ | ------------------ | ------------------- |
| `display`  | clamp(2.5rem, 5vw, 3.5rem) | 1.05 | 800    | -0.02em            | display             |
| `h1`       | 2.25rem                    | 1.1  | 800    | -0.02em            | sans                |
| `h2`       | 1.875rem                   | 1.15 | 700    | -0.015em           | sans                |
| `h3`       | 1.5rem                     | 1.2  | 700    | -0.01em            | sans                |
| `h4`       | 1.25rem                    | 1.3  | 700    | 0                  | sans                |
| `h5`       | 1.125rem                   | 1.4  | 500    | 0                  | sans                |
| `body-lg`  | 1.125rem                   | 1.7  | 400    | 0                  | sans                |
| `body`     | 1rem                       | 1.6  | 400    | 0                  | sans                |
| `body-sm`  | 0.875rem                   | 1.55 | 400    | 0                  | sans                |
| `caption`  | 0.75rem                    | 1.4  | 500    | 0                  | sans                |
| `overline` | 0.75rem                    | 1.2  | 700    | 0.08em (uppercase) | sans                |
| `code`     | 0.875rem                   | 1.5  | 400    | 0                  | mono                |
| `data`     | 1rem                       | 1.4  | 500    | 0                  | data (tabular-nums) |

Exposed as `.text-display`, `.text-h1`… utilities (+ existing `.font-display`/`.font-data`,
new `.font-mono`).

---

## 4. Spacing, radius, sizing, breakpoints

- **Spacing:** 4px base - `0,1=4,2=8,3=12,4=16,5=20,6=24,8=32,10=40,12=48,16=64,20=80,24=96,32=128`. Semantic: `--space-gutter`, `--space-section-y` (clamp), `--space-stack` gaps.
- **Radius:** `xs 4 · sm 6 · md 8 · lg 10 (0.625rem base) · xl 14 · 2xl 20 · full 9999`.
- **Containers:** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536` (max content `~1200`).
- **Breakpoints:** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

## 5. Elevation & surfaces

`elevation-0…5` (navy-tinted shadows; soft in light, deeper in dark) + the glass/surface
tokens from §2.2. Blur tokens: `blur-glass` (18px).

## 6. Motion

- **Durations:** `fast 120ms · base 200ms · slow 320ms · slower 500ms`.
- **Easings:** `standard cubic-bezier(0.2,0,0,1) · emphasized cubic-bezier(0.3,0,0,1) · decelerate cubic-bezier(0,0,0,1) · accelerate cubic-bezier(0.3,0,1,1)`.
- Exposed as CSS vars **and** JS (`motion.duration.base`) for Motion/Anime.
- Global `@media (prefers-reduced-motion: reduce)` disables non-essential transitions.

## 7. Z-index layers

`base 0 · raised 10 · dropdown 1000 · sticky 1100 · banner 1150 · overlay 1200 · modal 1300 · popover 1400 · toast 1500 · tooltip 1600`.

---

## 8. Library theming

- **shadcn / Radix:** consumes the §2.2 semantic CSS vars directly (standard names) - works automatically.
- **HeroUI:** `hero.ts` plugin themed from the JS tokens (primary = teal, focus ring = teal, content/background = navy/mist), light + dark.
- **Aceternity / Animate UI:** Tailwind-based - use the same token utilities; any inline colors must reference tokens.
- **Motion / Anime / Chart.js:** import JS tokens (`colors.teal[500]`, `motion.easing.standard`).

## 9. Component primitives (`components/ui/`)

Token-driven, variant-based (CVA), accessible:

- **`Button`** - variants `primary | secondary | ghost | outline | destructive`; sizes `sm | md | lg`; uses semantic tokens only.
- **`Card`** - `default | glass | elevated`.
- **`Badge`** - `neutral | success | warning | error | info`.
- **`TierBadge`** - `free | pro | enterprise` (uses tier tokens).
  (These are the seeds; the rewrite extends the set against the same tokens.)

## 10. Strictness & enforcement

- **`scripts/check-no-raw-colors.mjs`** - fails if any raw `#hex`, `rgb()/rgba()/hsl()`, or
  Tailwind arbitrary `[#…]`/`bg-[rgb…]` appears in `app/**` or `components/**`, **except** an
  allowlist: `app/styles/tokens.generated.css`, `lib/design/tokens/**`, `app/icon.svg`,
  `app/apple-icon.svg`, `public/**`, and a documented **legacy allowlist** (see §12).
- Wired to `npm run lint:colors`, run in CI and (optional) pre-commit.
- **Stylelint** for CSS (`color-no-hex` outside the token files) as a secondary guard.
- ESLint rule flags arbitrary color classes in JSX `className`.

## 11. Living reference - `/style`

`app/style/page.tsx` (noindex) renders, with a light/dark toggle: every ramp (50–950),
semantic swatches, tier badges, the full type scale, spacing/radius/shadow/motion/z-index
demos, and the component primitives. This is the visual contract reviewers approve against.

## 12. Migration of existing code

The current marketing/analysis pages still contain legacy hardcoded values. Since a full
rewrite is imminent:

- New code MUST be token-only (guard enforces).
- Existing legacy files (`app/page.tsx`, `app/business-strategy`, `app/investor-deck`,
  `app/market-analysis`, `app/technical-architecture`, the chart components) go on a
  **documented legacy allowlist** in the color guard, each tagged `// DESIGN-DEBT: migrate in rewrite`.
- The semantic-token wiring (§2.2) means even un-migrated components that use `bg-primary`/
  `border-border` immediately pick up the brand - only raw-hex usages remain as debt.

## 13. Docs

`docs/brand/design-system.md` - principles, architecture diagram, token catalog (auto-listed
from the module), naming conventions, "how to consume" (CSS + JS), do/don't, and the
contribution loop (edit TS → `npm run tokens` → commit generated CSS). Links to `/style`.

---

## File structure summary (create/modify)

**Create:** `lib/design/tokens/*` (10 files), `scripts/build-tokens.mjs`,
`scripts/check-no-raw-colors.mjs`, `app/styles/tokens.generated.css`, `app/style/page.tsx`,
`components/ui/{Button,Card,Badge,TierBadge}.tsx`, `docs/brand/design-system.md`,
`.stylelintrc.json`.
**Modify:** `app/globals.css` (import generated tokens, map `@theme`, type utilities, motion/
reduced-motion), `app/layout.tsx` (add Geist Mono), `hero.ts` (theme from tokens),
`package.json` (`tokens`, `prebuild`, `lint:colors` scripts + stylelint dep).

## Open items (resolve during planning, not blocking)

- Pre-commit hook for `lint:colors`? (or CI-only) - default CI-only + manual script.
- Exact CI provider - the repo's auto-PR workflow can also run `lint:colors` + `build`.

## Decisions log

- 2026-06-14: Architecture locked - TS token source → CSS+JS; full 50–950 OKLCH ramps;
  full strict system; add Geist Mono; `/style` page as visual contract. Lands on `latest`.
