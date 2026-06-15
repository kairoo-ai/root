# Kairoo Design System

**Owner:** Eshank Tyagi  
**Branch:** `latest`  
**Last updated:** 2026-06-14

---

## 1. Overview & Principles

The Kairoo Design System is the **single, canonical, library-agnostic** source of truth for all visual decisions in the product. Every color swatch, spacing value, font size, animation duration, and shadow lives here first - and nowhere else.

**Brand identity:** Kairoo (meaning "the right moment") uses **teal** as the primary action color, **navy ink** as the dark anchor and enterprise tier color, and **amber warmth** as the free-tier and accent signal. The system is not a theme layer on top of an existing library - it is a typed TypeScript module that emits both CSS custom properties (consumed by Tailwind v4, shadcn, HeroUI, Aceternity, Animate UI) and JavaScript objects (consumed by Chart.js, Motion, Anime.js, and future React Native targets).

**Core principles:**

- **One source, all consumers.** Edit tokens in TypeScript; every surface inherits the change automatically.
- **No raw values outside token files.** Raw `#hex`, `rgb()`, `hsl()`, or arbitrary Tailwind color classes (`bg-[#fff]`) in `app/` or `components/` are a build error.
- **Semantic over primitive.** Components reference `bg-primary` or `text-muted-foreground`, never `bg-teal-600`. Primitive ramp utilities (`bg-teal-500`) are permitted only in the token infrastructure and the `/style` reference page.
- **Strict but practical.** Legacy pages on the DESIGN-DEBT allowlist may temporarily retain raw colors while awaiting a full rewrite. New code is always strictly token-only.
- **Visual contract.** The `/style` route is the living reference - reviewers approve against it, not against a design tool export.

---

## 2. Architecture

### Source of truth: `lib/design/tokens/`

```
lib/design/tokens/
  colors.ts       # OKLCH primitive ramps (50–950) + semantic light/dark map + tier tokens
  typography.ts   # font families + full type scale (size / LH / weight / tracking / family)
  spacing.ts      # 4px-base spacing scale + semantic layout tokens (gutter, section-y, stack)
  radius.ts       # border-radius scale (xs → full)
  shadows.ts      # elevation-0…5 navy-tinted shadows + glass blur
  motion.ts       # durations (fast/base/slow/slower) + easings (standard/emphasized/…)
  zIndex.ts       # layering scale (base → tooltip)
  breakpoints.ts  # responsive breakpoints (sm → 2xl)
  index.ts        # aggregates everything into `tokens` object + re-exports named values
```

All values are typed TypeScript constants - no magic strings, no runtime lookups.

### Token generator: `scripts/build-tokens.ts`

Run via:

```bash
npm run tokens        # explicit run
npm run build         # triggers automatically via "prebuild" hook
```

The generator reads all token modules and emits **`app/styles/tokens.generated.css`** - a committed CSS file containing:

1. A Tailwind v4 `@theme` block with all **primitive ramp custom properties** (`--color-teal-50` through `--color-neutral-950`), font families (`--font-sans`, `--font-display`, `--font-data`, `--font-mono`), radius, shadow/elevation, motion, and z-index.
2. **`:root`** and **`.dark`** blocks that define semantic CSS variables (`--primary`, `--foreground`, `--muted-foreground`, etc.) mapped to the appropriate ramp step for each theme.
3. **`.text-{role}`** type-scale utility classes (`.text-display`, `.text-h1`, `.text-body`, etc.) with all typographic properties.

> **Never hand-edit `app/styles/tokens.generated.css`.** The file header says so, and the generator will overwrite it on every build.

### CSS wiring: `app/globals.css`

```css
@import "tailwindcss";
@import "./styles/tokens.generated.css"; /* primitives + semantic vars + type utilities */

@theme inline {
  /* semantic → Tailwind utility bridge */
  --color-primary: var(--primary);
  --color-muted-foreground: var(--muted-foreground);
  /* ... all semantic tokens ... */
}
```

The `@theme inline` block maps the runtime CSS vars into Tailwind's utility namespace, so `bg-primary`, `text-muted-foreground`, `ring-ring`, `shadow-elevation-3`, etc. all resolve correctly - including in dark mode.

### JS consumption: `lib/design/tokens/index.ts`

```ts
import { tokens, motion } from "@/lib/design/tokens";
// tokens.colors.ramps.teal["500"]   → "oklch(0.66 0.115 185)"
// motion.easing.standard            → "cubic-bezier(0.2, 0, 0, 1)"
// tokens.shadows.shadow["3"]        → "0 8px 20px -4px oklch(…)"
```

This is the path for Chart.js datasets, Motion/Anime.js keyframe parameters, and any future React Native StyleSheet consumers.

---

## 3. Consuming Tokens in CSS / Tailwind

### Semantic utilities (preferred for all components)

```tsx
// background + text
<div className="bg-primary text-primary-foreground" />
<div className="bg-muted text-muted-foreground" />
<div className="bg-card text-card-foreground" />
<div className="bg-destructive text-destructive-foreground" />

// borders + focus
<div className="border border-border" />
<input className="ring-ring focus-visible:ring-2" />

// type scale
<h1 className="text-h1 text-foreground" />
<p className="text-body text-muted-foreground" />
<span className="text-caption text-muted-foreground" />

// elevation
<div className="shadow-elevation-3" />

// tier badges
<span className="bg-tier-free/15 text-tier-free" />
<span className="bg-tier-pro/15 text-tier-pro" />
<span className="bg-tier-enterprise text-tier-enterprise-accent" />
```

### Primitive ramp utilities (allowed in token infrastructure and `/style` only)

```tsx
<div className="bg-teal-500" />
<div className="text-navy-900" />
<div className="bg-amber-400" />
```

Do **not** use these in application components. Use `bg-primary`, `text-foreground`, etc. instead.

---

## 4. Consuming Tokens in JavaScript

Import directly from the tokens index for any non-CSS consumer:

```ts
import { tokens, motion, typeScale, ramps } from "@/lib/design/tokens";

// Chart.js dataset colors
const chartColors = [ramps.teal["500"], ramps.amber["500"], ramps.navy["400"]];

// Motion / Framer Motion spring configs
const transition = {
  duration: parseFloat(motion.duration.slow) / 1000,
  ease: motion.easing.standard,
};

// Anime.js keyframe
anime({
  targets: ".el",
  easing: motion.easing.emphasized,
  duration: parseInt(motion.duration.base),
  color: ramps.teal["400"],
});

// Inline style (rare, avoid - prefer Tailwind utilities)
const style = { color: tokens.colors.ramps.teal["600"] };
```

---

## 5. Naming Conventions

### Primitive CSS variables (generated, never use in components)

```
--color-{ramp}-{step}
```

Examples: `--color-teal-500`, `--color-navy-900`, `--color-amber-50`, `--color-neutral-200`.

Steps run from `50` (lightest) to `950` (darkest) in 11 increments: `50 100 200 300 400 500 600 700 800 900 950`.

### Semantic runtime variables (use via Tailwind utilities)

```
--{token-name}
```

These are defined in `:root` and overridden in `.dark`. Examples:

- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--muted`, `--muted-foreground`
- `--border`, `--ring`
- `--tier-free`, `--tier-pro`, `--tier-enterprise`, `--tier-enterprise-accent`

Access via the Tailwind bridge: `bg-primary` resolves to `var(--primary)` which resolves to the correct ramp step for the active theme.

### Type scale utilities

```
.text-{role}
```

Examples: `.text-display`, `.text-h1`, `.text-h2`, `.text-h3`, `.text-h4`, `.text-h5`, `.text-body-lg`, `.text-body`, `.text-body-sm`, `.text-caption`, `.text-overline`, `.text-code`, `.text-data`.

Each utility sets `font-size`, `line-height`, `font-weight`, `letter-spacing`, and `font-family` together.

---

## 6. Token Catalog

### 6.1 Color ramps (OKLCH, 11 steps each)

| Ramp      | Role                            | Brand anchor                               |
| --------- | ------------------------------- | ------------------------------------------ |
| `teal`    | Primary action, Pro tier        | `teal-600 ≈ #0D9488`, `teal-400 ≈ #2DD4BF` |
| `navy`    | Dark anchor, ink, enterprise    | `navy-900 ≈ #0B1F3A`, `navy-950 ≈ #071426` |
| `amber`   | Warm accent, Free tier          | `amber-500 ≈ #F59E0B`                      |
| `gold`    | Enterprise-premium accent       | `gold-500 ≈ #CBA34A`                       |
| `neutral` | Grays - text, borders, surfaces | `neutral-50 ≈ #FAFAFA`                     |
| `success` | Positive / confirmed state      | `success-600 ≈ #16A34A`                    |
| `warning` | Caution state                   | `warning-600 ≈ #D97706`                    |
| `error`   | Destructive / negative          | `error-600 ≈ #DC2626`                      |
| `info`    | Informational                   | `info-600 ≈ #2563EB`                       |

All ramps use OKLCH for perceptually-uniform lightness curves. Raw values are defined in `lib/design/tokens/colors.ts`.

### 6.2 Semantic tokens (light / dark mapping)

| Token                                    | Light                         | Dark                       |
| ---------------------------------------- | ----------------------------- | -------------------------- |
| `background`                             | `neutral-50`                  | `navy-950`                 |
| `foreground`                             | `navy-900`                    | `neutral-50`               |
| `card` / `card-foreground`               | `neutral-50` / `navy-900`     | `navy-900` / `neutral-50`  |
| `popover` / `popover-foreground`         | `neutral-50` / `navy-900`     | `navy-900` / `neutral-50`  |
| `primary` / `primary-foreground`         | `teal-600` / `neutral-50`     | `teal-400` / `navy-950`    |
| `secondary` / `secondary-foreground`     | `neutral-100` / `navy-800`    | `navy-800` / `neutral-100` |
| `muted` / `muted-foreground`             | `neutral-100` / `neutral-500` | `navy-800` / `neutral-400` |
| `accent` / `accent-foreground`           | `teal-50` / `teal-700`        | `navy-800` / `teal-300`    |
| `destructive` / `destructive-foreground` | `error-600` / `neutral-50`    | `error-500` / `navy-950`   |
| `success`                                | `success-600`                 | `success-500`              |
| `warning`                                | `warning-600`                 | `warning-500`              |
| `info`                                   | `info-600`                    | `info-500`                 |
| `border`                                 | `neutral-200`                 | `navy-800`                 |
| `input`                                  | `neutral-200`                 | `navy-800`                 |
| `ring`                                   | `teal-500`                    | `teal-400`                 |

### 6.3 Tier tokens

| Token                    | Light       | Dark        | Usage                                            |
| ------------------------ | ----------- | ----------- | ------------------------------------------------ |
| `tier-free`              | `amber-500` | `amber-400` | `bg-tier-free/15 text-tier-free`                 |
| `tier-pro`               | `teal-600`  | `teal-400`  | `bg-tier-pro/15 text-tier-pro`                   |
| `tier-enterprise`        | `navy-900`  | `navy-300`  | `bg-tier-enterprise text-tier-enterprise-accent` |
| `tier-enterprise-accent` | `gold-500`  | `gold-400`  | accent text on enterprise backgrounds            |

### 6.4 Type scale

| Utility         | Size                       | Line-height | Weight | Tracking | Family                         |
| --------------- | -------------------------- | ----------- | ------ | -------- | ------------------------------ |
| `text-display`  | clamp(2.5rem, 5vw, 3.5rem) | 1.05        | 800    | -0.02em  | display (Space Grotesk)        |
| `text-h1`       | 2.25rem                    | 1.1         | 800    | -0.02em  | sans (DM Sans)                 |
| `text-h2`       | 1.875rem                   | 1.15        | 700    | -0.015em | sans                           |
| `text-h3`       | 1.5rem                     | 1.2         | 700    | -0.01em  | sans                           |
| `text-h4`       | 1.25rem                    | 1.3         | 700    | 0        | sans                           |
| `text-h5`       | 1.125rem                   | 1.4         | 500    | 0        | sans                           |
| `text-body-lg`  | 1.125rem                   | 1.7         | 400    | 0        | sans                           |
| `text-body`     | 1rem                       | 1.6         | 400    | 0        | sans                           |
| `text-body-sm`  | 0.875rem                   | 1.55        | 400    | 0        | sans                           |
| `text-caption`  | 0.75rem                    | 1.4         | 500    | 0        | sans                           |
| `text-overline` | 0.75rem                    | 1.2         | 700    | 0.08em   | sans                           |
| `text-code`     | 0.875rem                   | 1.5         | 400    | 0        | mono (Geist Mono)              |
| `text-data`     | 1rem                       | 1.4         | 500    | 0        | data (Mona Sans, tabular-nums) |

### 6.5 Spacing

4px base. Scale: `0 · 1=0.25rem · 2=0.5rem · 3=0.75rem · 4=1rem · 5=1.25rem · 6=1.5rem · 8=2rem · 10=2.5rem · 12=3rem · 16=4rem · 20=5rem · 24=6rem · 32=8rem`.

Semantic layout tokens: `--space-gutter: 1.5rem` · `--space-section-y: clamp(3rem, 8vw, 6rem)` · `--space-stack: 1rem` · `--space-content-max: 75rem`.

### 6.6 Radius

| Token         | Value                             |
| ------------- | --------------------------------- |
| `radius-xs`   | 0.25rem (4px)                     |
| `radius-sm`   | 0.375rem (6px)                    |
| `radius-md`   | 0.5rem (8px)                      |
| `radius-lg`   | 0.625rem (10px) - base `--radius` |
| `radius-xl`   | 0.875rem (14px)                   |
| `radius-2xl`  | 1.25rem (20px)                    |
| `radius-full` | 9999px                            |

### 6.7 Shadow / Elevation

| Token                | Value                                           |
| -------------------- | ----------------------------------------------- |
| `shadow-elevation-0` | none                                            |
| `shadow-elevation-1` | `0 1px 2px 0 oklch(0.23 0.04 255 / 0.08)`       |
| `shadow-elevation-2` | `0 2px 8px -1px oklch(0.23 0.04 255 / 0.10)`    |
| `shadow-elevation-3` | `0 8px 20px -4px oklch(0.23 0.04 255 / 0.12)`   |
| `shadow-elevation-4` | `0 16px 40px -8px oklch(0.23 0.04 255 / 0.16)`  |
| `shadow-elevation-5` | `0 30px 80px -12px oklch(0.23 0.04 255 / 0.22)` |
| `blur-glass`         | 18px                                            |

All shadows use navy-tinted OKLCH - they darken naturally in dark mode without inversion hacks.

### 6.8 Motion

**Durations:**

| Token             | Value |
| ----------------- | ----- |
| `duration-fast`   | 120ms |
| `duration-base`   | 200ms |
| `duration-slow`   | 320ms |
| `duration-slower` | 500ms |

**Easings:**

| Token               | Curve                        |
| ------------------- | ---------------------------- |
| `easing-standard`   | `cubic-bezier(0.2, 0, 0, 1)` |
| `easing-emphasized` | `cubic-bezier(0.3, 0, 0, 1)` |
| `easing-decelerate` | `cubic-bezier(0, 0, 0, 1)`   |
| `easing-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` |

A global `@media (prefers-reduced-motion: reduce)` block in `app/globals.css` collapses all animation durations to `0.01ms` for accessibility.

### 6.9 Z-index layers

| Token        | Value |
| ------------ | ----- |
| `z-base`     | 0     |
| `z-raised`   | 10    |
| `z-dropdown` | 1000  |
| `z-sticky`   | 1100  |
| `z-banner`   | 1150  |
| `z-overlay`  | 1200  |
| `z-modal`    | 1300  |
| `z-popover`  | 1400  |
| `z-toast`    | 1500  |
| `z-tooltip`  | 1600  |

---

## 7. Contribution Loop

All token changes follow this exact loop - no exceptions:

1. **Edit source** in `lib/design/tokens/*.ts`. This is the only place you edit.
2. **Regenerate CSS:**
   ```bash
   npm run tokens
   ```
   This overwrites `app/styles/tokens.generated.css`. Review the diff - it should only contain the values you changed.
3. **Stage and commit both files together:**
   ```bash
   git add lib/design/tokens/colors.ts app/styles/tokens.generated.css
   git commit -m "feat(tokens): ..."
   ```
   The generated CSS must always be committed alongside its source. Never commit one without the other.
4. **Verify the build:**
   ```bash
   npm run build
   npm run lint:colors
   ```
   Both must pass. The `prebuild` hook runs the token generator automatically before `npm run build`, so if you forget step 2, the build still regenerates the file - but you'll see the diff unstaged.

> Do **not** hand-edit `app/styles/tokens.generated.css`. The file starts with a comment warning of this. The generator will overwrite your change on the next build.

---

## 8. Strict Rule & Enforcement

### The rule

No raw `#hex`, `rgb()`, `rgba()`, `hsl()`, `hsla()`, or arbitrary Tailwind color classes (`bg-[#fff]`, `text-[rgba(...)]`) are permitted in `app/` or `components/` - except in explicitly allowlisted files.

### Enforcement

```bash
npm run lint:colors
```

This runs `scripts/check-no-raw-colors.mjs`, which:

- Walks all `.ts`, `.tsx`, `.css` files under `app/` and `components/`
- Skips files in the **EXfiles** set (token infrastructure: `tokens.generated.css`, `globals.css`, `hero.ts`, SVGs)
- Skips files in the **LEGACY** set (documented design debt, see below)
- Reports every matching line with file path + line number
- Exits `1` if any offenders are found

The script is run automatically in CI. It is also available as a local pre-commit check.

### Legacy allowlist

Files in the `LEGACY` set inside `check-no-raw-colors.mjs` have been explicitly accepted as design debt pending a full rewrite. Each is tagged `// DESIGN-DEBT` in the script comment. Current list:

| File                                  | Reason                                                 |
| ------------------------------------- | ------------------------------------------------------ |
| `app/page.tsx`                        | Legacy marketing page, full rewrite pending            |
| `app/business-strategy/page.tsx`      | Legacy analysis page, full rewrite pending             |
| `app/investor-deck/page.tsx`          | Legacy analysis page, full rewrite pending             |
| `app/market-analysis/page.tsx`        | Legacy analysis page, full rewrite pending             |
| `app/technical-architecture/page.tsx` | Legacy analysis page, full rewrite pending             |
| `components/CompetitiveChart.tsx`     | Legacy Chart.js component, rewrite pending             |
| `components/ForecastChart.tsx`        | Legacy Chart.js component, rewrite pending             |
| `components/TeamSkillChart.tsx`       | Legacy Chart.js component, rewrite pending             |
| `components/GrowthChart.tsx`          | Legacy Chart.js component, rewrite pending             |
| `components/AnimatedBackground.tsx`   | Legacy animation component, rewrite pending            |
| `components/ui/3d-pin.tsx`            | Third-party Aceternity UI primitive, migration pending |

### Adding a file to the legacy list

Only add a file to `LEGACY` if it is a legacy page or component that **will be fully rewritten** to use tokens. Do not add new design-system files (`components/ui/*`, `app/style`) - if the guard flags one of those, fix it to use tokens instead.

### Removing a file from the legacy list

When a file is migrated to tokens:

1. Remove its entry from the `LEGACY` set in `scripts/check-no-raw-colors.mjs`
2. Run `npm run lint:colors` to confirm it passes clean
3. Commit the migration and the updated script together

---

## 9. Reference

**Living style reference:** [`/style`](/style) - renders every color ramp (50–950), semantic swatches, the full type scale, and all component primitives (Button, Card, Badge, TierBadge) in the active theme. This page is `noindex` and is the visual contract used for design reviews.

**Design spec:** `docs/superpowers/specs/2026-06-14-design-system-design.md` - full architecture decisions, rationale, and open items.

**Brand assets:** `docs/brand/` - Kairoo glyph SVGs, favicon, color explorations.
