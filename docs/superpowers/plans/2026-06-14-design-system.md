# Kairoo Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Kairoo's canonical, strict, library-agnostic design system - a typed TS token source of truth that generates CSS variables + JS objects, wires the semantic layer so every component inherits the brand, and ships scales, HeroUI theming, base primitives, a `/style` reference page, docs, and a raw-color lint guard.

**Architecture:** `lib/design/tokens/*.ts` is the source of truth. A generator (`scripts/build-tokens.ts`, run via `tsx`) emits `app/styles/tokens.generated.css` containing a Tailwind v4 `@theme` block (primitive ramps + fonts/radius/shadow/motion as utilities) plus `:root`/`.dark` semantic runtime vars. `app/globals.css` imports the generated CSS and maps semantics into `@theme inline` (the existing shadcn-on-v4 pattern). JS consumers import the TS modules directly.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, next-themes, HeroUI, `next/font/google`, `tsx` (token generator), `class-variance-authority` + `clsx`/`tailwind-merge` (already deps), lucide-react.

**Source of truth for values:** `docs/superpowers/specs/2026-06-14-design-system-design.md`.

**ENVIRONMENT:** `node`/`npm`/`npx`/`tsx` are NOT on the default shell PATH - prefix every command with `export PATH="/opt/homebrew/bin:$PATH"`. Verify with `npx tsc --noEmit` and `npm run build`. **Never run `npm run dev`** (blocks). Branch: `latest` (do all work here; do not create new branches).

**Testing note:** No unit-test runner configured. Per-task verification = the token generator runs, `tsc --noEmit` passes, `npm run build` succeeds, the color guard passes, and (where relevant) the `/style` page renders. Commit after each task.

---

## File Structure

**Create:**

- `lib/design/tokens/colors.ts` - primitive OKLCH ramps, state hues, tier colors, semantic light/dark maps
- `lib/design/tokens/typography.ts` - families + type scale
- `lib/design/tokens/spacing.ts`, `radius.ts`, `shadows.ts`, `motion.ts`, `zIndex.ts`, `breakpoints.ts`
- `lib/design/tokens/index.ts` - aggregate `tokens` + types
- `scripts/build-tokens.ts` - generator → writes `app/styles/tokens.generated.css`
- `scripts/check-no-raw-colors.mjs` - raw-color guard
- `app/styles/tokens.generated.css` - generated (committed)
- `app/style/page.tsx` - `/style` reference page
- `components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx`, `TierBadge.tsx`
- `lib/utils.ts` - `cn()` helper (if not already present)
- `docs/brand/design-system.md` - documentation
- `.stylelintrc.json`

**Modify:**

- `app/globals.css` - import generated tokens, extend `@theme inline` semantic mapping, type utilities, motion + reduced-motion
- `app/layout.tsx` - add Geist Mono (`--font-mono`)
- `hero.ts` - HeroUI theme from tokens
- `package.json` - `tokens`, `prebuild`, `lint:colors` scripts; `tsx` + stylelint devDeps
- `.github/workflows/auto-pr-latest.yml` - run `lint:colors` + build as a gate (Task 13)

---

## Task 1: Color tokens module

**Files:** Create `lib/design/tokens/colors.ts`

- [ ] **Step 1: Write the color module**

Create `lib/design/tokens/colors.ts`:

```ts
// Kairoo color primitives - OKLCH ramps. Source of truth (do not hardcode colors elsewhere).
// Values are oklch() strings consumed verbatim by CSS (Tailwind v4) and JS (Chart.js/Motion).

export type Ramp = Record<
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950",
  string
>;

const ramp = (l: number[], c: number[], h: number): Ramp => {
  const steps = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "950",
  ] as const;
  const out = {} as Ramp;
  steps.forEach((s, i) => {
    out[s] = `oklch(${l[i]} ${c[i]} ${h})`;
  });
  return out;
};

// l/c arrays are indexed 50..950
export const teal = ramp(
  [0.97, 0.94, 0.88, 0.8, 0.74, 0.66, 0.58, 0.5, 0.42, 0.35, 0.27],
  [0.02, 0.04, 0.06, 0.09, 0.11, 0.115, 0.1, 0.085, 0.07, 0.055, 0.04],
  185,
);

export const navy = ramp(
  [0.97, 0.93, 0.86, 0.76, 0.64, 0.52, 0.42, 0.34, 0.28, 0.23, 0.18],
  [0.01, 0.02, 0.035, 0.05, 0.065, 0.07, 0.07, 0.06, 0.05, 0.04, 0.035],
  255,
);

export const amber = ramp(
  [0.97, 0.94, 0.9, 0.85, 0.81, 0.77, 0.68, 0.57, 0.47, 0.4, 0.3],
  [0.03, 0.06, 0.1, 0.13, 0.155, 0.16, 0.15, 0.13, 0.1, 0.08, 0.06],
  72,
);

export const gold = ramp(
  [0.97, 0.94, 0.89, 0.84, 0.79, 0.74, 0.66, 0.56, 0.46, 0.38, 0.29],
  [0.02, 0.04, 0.06, 0.08, 0.09, 0.1, 0.095, 0.08, 0.065, 0.05, 0.04],
  90,
);

export const neutral = ramp(
  [0.985, 0.967, 0.922, 0.87, 0.708, 0.556, 0.46, 0.37, 0.27, 0.205, 0.145],
  [0.002, 0.004, 0.006, 0.008, 0.012, 0.014, 0.014, 0.012, 0.01, 0.008, 0.006],
  255,
);

export const success = ramp(
  [0.97, 0.94, 0.88, 0.8, 0.72, 0.65, 0.56, 0.47, 0.39, 0.33, 0.26],
  [0.03, 0.06, 0.1, 0.14, 0.16, 0.17, 0.15, 0.12, 0.1, 0.08, 0.06],
  150,
);

export const warning = ramp(
  [0.97, 0.94, 0.89, 0.83, 0.78, 0.72, 0.62, 0.52, 0.43, 0.36, 0.28],
  [0.03, 0.06, 0.1, 0.13, 0.15, 0.16, 0.15, 0.13, 0.1, 0.08, 0.06],
  55,
);

export const error = ramp(
  [0.97, 0.94, 0.89, 0.82, 0.74, 0.64, 0.55, 0.47, 0.4, 0.34, 0.27],
  [0.02, 0.05, 0.09, 0.13, 0.17, 0.2, 0.19, 0.16, 0.13, 0.1, 0.08],
  27,
);

export const info = ramp(
  [0.97, 0.94, 0.88, 0.8, 0.7, 0.6, 0.52, 0.45, 0.38, 0.32, 0.25],
  [0.02, 0.05, 0.09, 0.13, 0.16, 0.18, 0.17, 0.15, 0.12, 0.1, 0.08],
  260,
);

export const ramps = {
  teal,
  navy,
  amber,
  gold,
  neutral,
  success,
  warning,
  info,
} as const;
export type RampName = keyof typeof ramps;

// Semantic tokens. Each value references a ramp step (string key "navy.900" form resolved by the generator).
// `light` and `dark` are the per-theme assignments.
export type SemanticMap = Record<string, { light: string; dark: string }>;

export const semantic: SemanticMap = {
  background: { light: "neutral.50", dark: "navy.950" },
  foreground: { light: "navy.900", dark: "neutral.50" },
  card: { light: "neutral.50", dark: "navy.900" },
  "card-foreground": { light: "navy.900", dark: "neutral.50" },
  popover: { light: "neutral.50", dark: "navy.900" },
  "popover-foreground": { light: "navy.900", dark: "neutral.50" },
  primary: { light: "teal.600", dark: "teal.400" },
  "primary-foreground": { light: "neutral.50", dark: "navy.950" },
  secondary: { light: "neutral.100", dark: "navy.800" },
  "secondary-foreground": { light: "navy.800", dark: "neutral.100" },
  muted: { light: "neutral.100", dark: "navy.800" },
  "muted-foreground": { light: "neutral.500", dark: "neutral.400" },
  accent: { light: "teal.50", dark: "navy.800" },
  "accent-foreground": { light: "teal.700", dark: "teal.300" },
  destructive: { light: "error.600", dark: "error.500" },
  "destructive-foreground": { light: "neutral.50", dark: "navy.950" },
  success: { light: "success.600", dark: "success.500" },
  warning: { light: "warning.600", dark: "warning.500" },
  info: { light: "info.600", dark: "info.500" },
  border: { light: "neutral.200", dark: "navy.800" },
  input: { light: "neutral.200", dark: "navy.800" },
  ring: { light: "teal.500", dark: "teal.400" },
  // Tier accents
  "tier-free": { light: "amber.500", dark: "amber.400" },
  "tier-pro": { light: "teal.600", dark: "teal.400" },
  "tier-enterprise": { light: "navy.900", dark: "navy.300" },
  "tier-enterprise-accent": { light: "gold.500", dark: "gold.400" },
};

export const colors = { ramps, semantic };
```

- [ ] **Step 2: Typecheck**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit`
Expected: no errors (module is standalone, not yet imported).

- [ ] **Step 3: Commit**

```bash
git add lib/design/tokens/colors.ts
git commit -m "feat(ds): color token primitives (OKLCH ramps + semantic map + tiers)"
```

---

## Task 2: Scale token modules (typography, spacing, radius, shadows, motion, z-index, breakpoints)

**Files:** Create the seven modules under `lib/design/tokens/`.

- [ ] **Step 1: typography.ts**

```ts
export const fontFamily = {
  sans: "var(--font-dm-sans), system-ui, sans-serif",
  display: "var(--font-space-grotesk), var(--font-dm-sans), sans-serif",
  data: "var(--font-mona-sans), var(--font-dm-sans), sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, monospace",
} as const;

export type TypeStyle = {
  size: string;
  line: string;
  weight: number;
  tracking: string;
  family: keyof typeof fontFamily;
};

export const typeScale: Record<string, TypeStyle> = {
  display: {
    size: "clamp(2.5rem, 5vw, 3.5rem)",
    line: "1.05",
    weight: 800,
    tracking: "-0.02em",
    family: "display",
  },
  h1: {
    size: "2.25rem",
    line: "1.1",
    weight: 800,
    tracking: "-0.02em",
    family: "sans",
  },
  h2: {
    size: "1.875rem",
    line: "1.15",
    weight: 700,
    tracking: "-0.015em",
    family: "sans",
  },
  h3: {
    size: "1.5rem",
    line: "1.2",
    weight: 700,
    tracking: "-0.01em",
    family: "sans",
  },
  h4: {
    size: "1.25rem",
    line: "1.3",
    weight: 700,
    tracking: "0",
    family: "sans",
  },
  h5: {
    size: "1.125rem",
    line: "1.4",
    weight: 500,
    tracking: "0",
    family: "sans",
  },
  "body-lg": {
    size: "1.125rem",
    line: "1.7",
    weight: 400,
    tracking: "0",
    family: "sans",
  },
  body: {
    size: "1rem",
    line: "1.6",
    weight: 400,
    tracking: "0",
    family: "sans",
  },
  "body-sm": {
    size: "0.875rem",
    line: "1.55",
    weight: 400,
    tracking: "0",
    family: "sans",
  },
  caption: {
    size: "0.75rem",
    line: "1.4",
    weight: 500,
    tracking: "0",
    family: "sans",
  },
  overline: {
    size: "0.75rem",
    line: "1.2",
    weight: 700,
    tracking: "0.08em",
    family: "sans",
  },
  code: {
    size: "0.875rem",
    line: "1.5",
    weight: 400,
    tracking: "0",
    family: "mono",
  },
  data: {
    size: "1rem",
    line: "1.4",
    weight: 500,
    tracking: "0",
    family: "data",
  },
};

export const typography = { fontFamily, typeScale };
```

- [ ] **Step 2: spacing.ts**

```ts
export const space: Record<string, string> = {
  "0": "0",
  "1": "0.25rem",
  "2": "0.5rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "32": "8rem",
};
export const layout = {
  gutter: "1.5rem",
  "section-y": "clamp(3rem, 8vw, 6rem)",
  stack: "1rem",
  "content-max": "75rem", // 1200px
} as const;
export const spacing = { space, layout };
```

- [ ] **Step 3: radius.ts**

```ts
export const radius: Record<string, string> = {
  xs: "0.25rem",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.625rem",
  xl: "0.875rem",
  "2xl": "1.25rem",
  full: "9999px",
};
```

- [ ] **Step 4: shadows.ts**

```ts
// Navy-tinted elevation. Soft in light; the .dark overrides live in the generator.
export const shadow: Record<string, string> = {
  "0": "none",
  "1": "0 1px 2px 0 oklch(0.23 0.04 255 / 0.08)",
  "2": "0 2px 8px -1px oklch(0.23 0.04 255 / 0.10)",
  "3": "0 8px 20px -4px oklch(0.23 0.04 255 / 0.12)",
  "4": "0 16px 40px -8px oklch(0.23 0.04 255 / 0.16)",
  "5": "0 30px 80px -12px oklch(0.23 0.04 255 / 0.22)",
};
export const blur = { glass: "18px" } as const;
export const shadows = { shadow, blur };
```

- [ ] **Step 5: motion.ts**

```ts
export const duration = {
  fast: "120ms",
  base: "200ms",
  slow: "320ms",
  slower: "500ms",
} as const;
export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.3, 0, 0, 1)",
  decelerate: "cubic-bezier(0, 0, 0, 1)",
  accelerate: "cubic-bezier(0.3, 0, 1, 1)",
} as const;
export const motion = { duration, easing };
```

- [ ] **Step 6: zIndex.ts**

```ts
export const zIndex: Record<string, number> = {
  base: 0,
  raised: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1150,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
};
```

- [ ] **Step 7: breakpoints.ts**

```ts
export const breakpoints: Record<string, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};
```

- [ ] **Step 8: Typecheck + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit` → no errors.

```bash
git add lib/design/tokens/
git commit -m "feat(ds): scale tokens (type, spacing, radius, shadow, motion, z-index, breakpoints)"
```

---

## Task 3: Aggregate token index

**Files:** Create `lib/design/tokens/index.ts`

- [ ] **Step 1: Write the aggregate**

```ts
export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./radius";
export * from "./shadows";
export * from "./motion";
export * from "./zIndex";
export * from "./breakpoints";

import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { motion } from "./motion";
import { zIndex } from "./zIndex";
import { breakpoints } from "./breakpoints";

export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  motion,
  zIndex,
  breakpoints,
};
export type Tokens = typeof tokens;
```

- [ ] **Step 2: Typecheck + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit` → no errors.

```bash
git add lib/design/tokens/index.ts
git commit -m "feat(ds): aggregate token index + Tokens type"
```

---

## Task 4: Token generator → `tokens.generated.css`

**Files:** Create `scripts/build-tokens.ts`, `app/styles/tokens.generated.css`; modify `package.json`.

- [ ] **Step 1: Install tsx (TS runner for the generator)**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npm i -D tsx`

- [ ] **Step 2: Write the generator**

Create `scripts/build-tokens.ts`:

```ts
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { ramps, semantic } from "../lib/design/tokens/colors";
import { typeScale, fontFamily } from "../lib/design/tokens/typography";
import { space, layout } from "../lib/design/tokens/spacing";
import { radius } from "../lib/design/tokens/radius";
import { shadow, blur } from "../lib/design/tokens/shadows";
import { duration, easing } from "../lib/design/tokens/motion";
import { zIndex } from "../lib/design/tokens/zIndex";

const ref = (path: string) => {
  // "teal.600" -> var(--color-teal-600)
  const [ramp, step] = path.split(".");
  return `var(--color-${ramp}-${step})`;
};

const lines: string[] = [];
lines.push(
  "/* GENERATED by scripts/build-tokens.ts - do not edit. Run `npm run tokens`. */",
);

// @theme: primitive ramps (-> bg-teal-500 etc.) + fonts + radius + shadow + motion + z-index
lines.push("@theme {");
for (const [name, r] of Object.entries(ramps)) {
  for (const [step, val] of Object.entries(r))
    lines.push(`  --color-${name}-${step}: ${val};`);
}
lines.push(`  --font-sans: ${fontFamily.sans};`);
lines.push(`  --font-display: ${fontFamily.display};`);
lines.push(`  --font-data: ${fontFamily.data};`);
lines.push(`  --font-mono: ${fontFamily.mono};`);
for (const [k, v] of Object.entries(radius))
  lines.push(`  --radius-${k}: ${v};`);
for (const [k, v] of Object.entries(shadow))
  lines.push(`  --shadow-elevation-${k}: ${v};`);
for (const [k, v] of Object.entries(duration))
  lines.push(`  --duration-${k}: ${v};`);
for (const [k, v] of Object.entries(easing)) lines.push(`  --ease-${k}: ${v};`);
for (const [k, v] of Object.entries(zIndex)) lines.push(`  --z-${k}: ${v};`);
for (const [k, v] of Object.entries(space))
  lines.push(`  --spacing-${k}: ${v};`);
for (const [k, v] of Object.entries(layout))
  lines.push(`  --layout-${k}: ${v};`);
lines.push(`  --blur-glass: ${blur.glass};`);
lines.push("}");

// Semantic runtime vars (flip per theme).
lines.push(":root {");
for (const [name, pair] of Object.entries(semantic))
  lines.push(`  --${name}: ${ref(pair.light)};`);
lines.push("}");
lines.push(".dark {");
for (const [name, pair] of Object.entries(semantic))
  lines.push(`  --${name}: ${ref(pair.dark)};`);
lines.push("}");

// Type-scale utilities.
for (const [name, t] of Object.entries(typeScale)) {
  lines.push(`.text-${name} {`);
  lines.push(
    `  font-size: ${t.size}; line-height: ${t.line}; font-weight: ${t.weight}; letter-spacing: ${t.tracking}; font-family: var(--font-${t.family});`,
  );
  if (name === "overline") lines.push("  text-transform: uppercase;");
  lines.push("}");
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../app/styles/tokens.generated.css");
writeFileSync(out, lines.join("\n") + "\n");
console.log(`Wrote ${out} (${lines.length} lines).`);
```

- [ ] **Step 3: Add npm scripts**

In `package.json` `"scripts"`, add:

```json
    "tokens": "tsx scripts/build-tokens.ts",
    "prebuild": "tsx scripts/build-tokens.ts",
```

- [ ] **Step 4: Generate the CSS**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npm run tokens`
Expected: prints "Wrote .../app/styles/tokens.generated.css", file exists with `@theme {`, `:root {`, `.dark {`, and `.text-*` rules.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-tokens.ts package.json package-lock.json app/styles/tokens.generated.css
git commit -m "feat(ds): token generator emits tokens.generated.css from TS source"
```

---

## Task 5: Wire generated tokens into globals.css

**Files:** Modify `app/globals.css`.

> Replace the ad-hoc brand tokens + hand-written `:root`/`.dark` semantic blocks added during the rebrand with the generated system, keeping the existing surface/glass tokens and base layer. The generated file owns ramps + semantic vars + type utilities.

- [ ] **Step 1: Import the generated tokens**

At the very top of `app/globals.css`, immediately after `@import "tailwindcss";` and the other `@import`s, add:

```css
@import "./styles/tokens.generated.css";
```

- [ ] **Step 2: Map semantic vars into Tailwind in the existing `@theme inline` block**

The existing `@theme inline { ... }` maps `--color-primary: var(--primary)` etc. Ensure these semantic mappings exist (add any missing) so the new tokens generate utilities. The block must include, at minimum:

```css
--color-background: var(--background);
--color-foreground: var(--foreground);
--color-card: var(--card);
--color-card-foreground: var(--card-foreground);
--color-popover: var(--popover);
--color-popover-foreground: var(--popover-foreground);
--color-primary: var(--primary);
--color-primary-foreground: var(--primary-foreground);
--color-secondary: var(--secondary);
--color-secondary-foreground: var(--secondary-foreground);
--color-muted: var(--muted);
--color-muted-foreground: var(--muted-foreground);
--color-accent: var(--accent);
--color-accent-foreground: var(--accent-foreground);
--color-destructive: var(--destructive);
--color-destructive-foreground: var(--destructive-foreground);
--color-success: var(--success);
--color-warning: var(--warning);
--color-info: var(--info);
--color-border: var(--border);
--color-input: var(--input);
--color-ring: var(--ring);
--color-tier-free: var(--tier-free);
--color-tier-pro: var(--tier-pro);
--color-tier-enterprise: var(--tier-enterprise);
--color-tier-enterprise-accent: var(--tier-enterprise-accent);
```

- [ ] **Step 3: Remove the superseded rebrand-era brand tokens**

Delete the rebrand-era `--brand-navy/--brand-teal/--brand-teal-bright/--brand-amber/--brand-gold/--brand-mist/--brand-ink/--brand-primary/--tier-*` declarations from `:root` and `.dark`, AND their `--color-brand-*` mappings in `@theme inline`. Replace any usage by keeping backwards-compatible aliases in the `@theme inline` block so existing classes keep working:

```css
--color-brand-navy: var(--color-navy-900);
--color-brand-teal: var(--color-teal-600);
--color-brand-teal-bright: var(--color-teal-400);
--color-brand-amber: var(--color-amber-500);
--color-brand-gold: var(--color-gold-500);
--color-brand-primary: var(--primary);
--color-brand-ink: var(--foreground);
```

(These aliases keep `bg-brand-teal`, `text-brand-ink`, etc. - used by `Logo`, `RebrandBanner`, `RichText`, charts - working against the new ramps.)

- [ ] **Step 4: Replace the `--font-*` defs and keep base layer**

Ensure `--font-sans`/`--font-display`/`--font-data`/`--font-mono` now come from the generated `@theme` (remove duplicate hand-written ones in the existing `@theme inline`). Keep the existing `@layer base`, `body`, surface/glass, and component CSS.

- [ ] **Step 5: Add motion reduced-motion guard at end of file**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 6: Verify build + theme**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npm run build`
Expected: success. Then confirm utilities resolve: `grep -n "color-primary\|color-teal-500" app/styles/tokens.generated.css` shows the tokens.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css
git commit -m "feat(ds): wire generated tokens into globals; semantic primary=teal; reduced-motion"
```

---

## Task 6: Add Geist Mono font

**Files:** Modify `app/layout.tsx`.

- [ ] **Step 1: Import + instantiate**

Add `Geist_Mono` to the `next/font/google` import and create:

```tsx
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
});
```

- [ ] **Step 2: Apply on body**

Add `${geistMono.variable}` to the `<body>` className alongside the other font variables.

- [ ] **Step 3: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success.

```bash
git add app/layout.tsx
git commit -m "feat(ds): load Geist Mono for code/data surfaces"
```

---

## Task 7: Theme HeroUI from tokens

**Files:** Modify `hero.ts`.

> `hero.ts` is currently empty/default. Theme HeroUI's primary/focus/background to the brand so HeroUI components match. Use static hex-free oklch via CSS var references where HeroUI allows; HeroUI's theme expects color values - use the same oklch ramp values.

- [ ] **Step 1: Write the HeroUI theme**

Replace `hero.ts` contents with:

```ts
import { heroui } from "@heroui/react";
import { teal, navy, neutral } from "./lib/design/tokens/colors";

export default heroui({
  themes: {
    light: {
      colors: {
        background: neutral["50"],
        foreground: navy["900"],
        primary: { DEFAULT: teal["600"], foreground: neutral["50"] },
        focus: teal["500"],
      },
    },
    dark: {
      colors: {
        background: navy["950"],
        foreground: neutral["50"],
        primary: { DEFAULT: teal["400"], foreground: navy["950"] },
        focus: teal["400"],
      },
    },
  },
});
```

> If the relative import path `./lib/design/tokens/colors` fails to resolve from `hero.ts` (it's at repo root), use the correct relative path `./lib/design/tokens/colors` (root-level `hero.ts` → `lib/...`). Verify with the build.

- [ ] **Step 2: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success.

```bash
git add hero.ts
git commit -m "feat(ds): theme HeroUI primary/focus/background from brand tokens"
```

---

## Task 8: `cn()` helper + `Button` primitive

**Files:** Create `lib/utils.ts` (if absent) and `components/ui/Button.tsx`.

- [ ] **Step 1: Ensure `cn()` exists**

Check: `ls lib/utils.ts`. If absent, create `lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Write the Button**

Create `components/ui/Button.tsx`:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-teal-700",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-accent",
        ghost: "bg-transparent text-foreground hover:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(button({ variant, size }), className)} {...props} />
  );
}
```

- [ ] **Step 3: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success.

```bash
git add lib/utils.ts components/ui/Button.tsx
git commit -m "feat(ds): Button primitive + cn() helper"
```

---

## Task 9: `Card`, `Badge`, `TierBadge` primitives

**Files:** Create `components/ui/Card.tsx`, `Badge.tsx`, `TierBadge.tsx`.

- [ ] **Step 1: Card.tsx**

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const card = cva("rounded-xl border", {
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground",
      glass: "border-border/60 bg-card/60 backdrop-blur-[18px]",
      elevated: "border-border bg-card text-card-foreground shadow-elevation-3",
    },
  },
  defaultVariants: { variant: "default" },
});

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof card>;
export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(card({ variant }), className)} {...props} />;
}
```

- [ ] **Step 2: Badge.tsx**

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const badge = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        error: "bg-destructive/15 text-destructive",
        info: "bg-info/15 text-info",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badge>;
export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}
```

- [ ] **Step 3: TierBadge.tsx**

```tsx
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const tierStyles: Record<"free" | "pro" | "enterprise", string> = {
  free: "bg-tier-free/15 text-tier-free",
  pro: "bg-tier-pro/15 text-tier-pro",
  enterprise: "bg-tier-enterprise text-tier-enterprise-accent",
};
const tierLabel = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
} as const;

export type TierBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tier: "free" | "pro" | "enterprise";
};
export function TierBadge({ tier, className, ...props }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
        tierStyles[tier],
        className,
      )}
      {...props}
    >
      {tierLabel[tier]}
    </span>
  );
}
```

- [ ] **Step 4: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success.

```bash
git add components/ui/Card.tsx components/ui/Badge.tsx components/ui/TierBadge.tsx
git commit -m "feat(ds): Card, Badge, TierBadge primitives"
```

---

## Task 10: Raw-color guard + legacy allowlist

**Files:** Create `scripts/check-no-raw-colors.mjs`; modify `package.json`.

- [ ] **Step 1: Write the guard**

Create `scripts/check-no-raw-colors.mjs`:

```js
// Fails if raw colors appear in app/ or components/ outside the allowlist.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components"];
const EXfiles = new Set([
  "app/styles/tokens.generated.css",
  "app/icon.svg",
  "app/apple-icon.svg",
]);
// Legacy files awaiting rewrite - tagged DESIGN-DEBT. Allowed to keep raw colors for now.
const LEGACY = new Set([
  "app/page.tsx",
  "app/business-strategy/page.tsx",
  "app/investor-deck/page.tsx",
  "app/market-analysis/page.tsx",
  "app/technical-architecture/page.tsx",
  "components/CompetitiveChart.tsx",
  "components/ForecastChart.tsx",
  "components/TeamSkillChart.tsx",
  "components/GrowthChart.tsx",
  "components/AnimatedBackground.tsx",
]);
const RAW =
  /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b(?:bg|text|border|from|via|to|fill|stroke|ring|shadow)-\[#/;
const exts = new Set([".ts", ".tsx", ".css"]);

const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (exts.has(extname(p))) files.push(p);
  }
};
ROOTS.forEach((r) => walk(r));

const offenders = [];
for (const f of files) {
  const rel = f.replaceAll("\\", "/");
  if (EXfiles.has(rel) || LEGACY.has(rel)) continue;
  const txt = readFileSync(f, "utf8");
  txt.split("\n").forEach((line, i) => {
    if (RAW.test(line))
      offenders.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`);
  });
}

if (offenders.length) {
  console.error(
    "Raw colors found (use design tokens instead):\n" + offenders.join("\n"),
  );
  process.exit(1);
}
console.log(
  `Color guard passed (${files.length} files scanned, ${LEGACY.size} legacy files allowlisted).`,
);
```

- [ ] **Step 2: Add the script**

In `package.json` `"scripts"`, add: `"lint:colors": "node scripts/check-no-raw-colors.mjs"`.

- [ ] **Step 3: Run it**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npm run lint:colors`
Expected: passes (new DS files are token-only; legacy files allowlisted). If it flags a NON-legacy file, fix that file to use tokens, then re-run.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-no-raw-colors.mjs package.json
git commit -m "feat(ds): raw-color guard with documented legacy allowlist"
```

---

## Task 11: `/style` reference page

**Files:** Create `app/style/page.tsx`.

- [ ] **Step 1: Write the page**

Create `app/style/page.tsx`:

```tsx
import type { Metadata } from "next";
import { ramps } from "@/lib/design/tokens/colors";
import { typeScale } from "@/lib/design/tokens/typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierBadge } from "@/components/ui/TierBadge";

export const metadata: Metadata = {
  title: "Kairoo - Style reference",
  robots: { index: false },
};

const STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

export default function StylePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-12">
      <h1 className="text-h1 text-foreground">Kairoo Design System</h1>

      <section className="space-y-4">
        <h2 className="text-h3 text-foreground">Color ramps</h2>
        {Object.entries(ramps).map(([name, r]) => (
          <div key={name}>
            <div className="text-caption text-muted-foreground mb-1">
              {name}
            </div>
            <div className="flex gap-1">
              {STEPS.map((s) => (
                <div key={s} className="flex-1">
                  <div className="h-10 rounded" style={{ background: r[s] }} />
                  <div className="text-[10px] text-muted-foreground text-center mt-1">
                    {s}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-h3 text-foreground">Semantic</h2>
        <div className="flex flex-wrap gap-3">
          {[
            "bg-primary text-primary-foreground",
            "bg-secondary text-secondary-foreground",
            "bg-muted text-muted-foreground",
            "bg-accent text-accent-foreground",
            "bg-destructive text-destructive-foreground",
          ].map((c) => (
            <div key={c} className={`rounded-lg px-4 py-3 text-sm ${c}`}>
              {c.split(" ")[0]}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-h3 text-foreground">Type scale</h2>
        {Object.keys(typeScale).map((t) => (
          <div key={t} className={`text-${t} text-foreground`}>
            {t} - The right moment to grow
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-h3 text-foreground">Primitives</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <TierBadge tier="free" />
          <TierBadge tier="pro" />
          <TierBadge tier="enterprise" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-foreground">Default</div>
          </Card>
          <Card variant="glass" className="p-4">
            <div className="text-foreground">Glass</div>
          </Card>
          <Card variant="elevated" className="p-4">
            <div className="text-foreground">Elevated</div>
          </Card>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify + commit**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success; confirm `/style` is in the build route list.

```bash
git add app/style/page.tsx
git commit -m "feat(ds): /style living reference page"
```

---

## Task 12: Documentation

**Files:** Create `docs/brand/design-system.md`.

- [ ] **Step 1: Write the doc**

Create `docs/brand/design-system.md` with these sections (real content, not placeholders): overview & principles; architecture (TS source → generator → CSS+JS); how to consume in CSS (`bg-primary`, `text-h1`, `shadow-elevation-3`) and in JS (`import { tokens } from "@/lib/design/tokens"`); naming conventions (ramps `--color-{hue}-{step}`, semantic `--{token}`); the contribution loop (edit `lib/design/tokens/*` → `npm run tokens` → commit `app/styles/tokens.generated.css`); the strict rule (no raw colors - guard + legacy allowlist + how to remove a file from the allowlist after migration); link to `/style`. Include a token catalog table mirroring the spec.

- [ ] **Step 2: Commit**

```bash
git add docs/brand/design-system.md
git commit -m "docs(ds): design system architecture + usage + contribution guide"
```

---

## Task 13: CI gate + final verification

**Files:** Modify `.github/workflows/auto-pr-latest.yml`; final checks.

- [ ] **Step 1: Add a verification job to the workflow**

In `.github/workflows/auto-pr-latest.yml`, add a `verify` job that runs on `push` to `latest` and on `pull_request` to `main` (add these triggers to `on:`), running Node 20+, `npm ci`, `npm run lint:colors`, and `npm run build`. Keep the existing scheduled `auto-pr` job. Example job:

```yaml
verify:
  if: github.event_name != 'schedule'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: "20" }
    - run: npm ci
    - run: npm run lint:colors
    - run: npm run build
```

And extend `on:` with:

```yaml
push:
  branches: [latest]
pull_request:
  branches: [main]
```

- [ ] **Step 2: Full local verification**

Run:

```bash
export PATH="/opt/homebrew/bin:$PATH"
npm run tokens && npx tsc --noEmit && npm run lint:colors && npm run build
```

Expected: all succeed. Confirm `git status` is clean except the regenerated `tokens.generated.css` (commit if changed).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/auto-pr-latest.yml app/styles/tokens.generated.css
git commit -m "ci(ds): gate latest/PRs on color guard + build"
```

---

## Self-Review Notes (coverage vs spec)

- §1 architecture / TS→CSS+JS pipeline → Tasks 1–5. ✅
- §2 full OKLCH ramps + semantic + tiers → Task 1; generated → Tasks 4–5. ✅
- §3 typography + Geist Mono → Tasks 2, 4, 5, 6. ✅
- §4 spacing/radius/sizing/breakpoints → Tasks 2, 4. ✅
- §5 elevation/surfaces → Tasks 2, 4 (+ existing glass kept in globals). ✅
- §6 motion + reduced-motion → Tasks 2, 4, 5. ✅
- §7 z-index → Tasks 2, 4. ✅
- §8 library theming (shadcn via semantic vars; HeroUI) → Tasks 5, 7. ✅
- §9 primitives → Tasks 8, 9. ✅
- §10 strict guard → Task 10; CI → Task 13. ✅
- §11 `/style` → Task 11. ✅
- §12 legacy allowlist → Task 10. ✅
- §13 docs → Task 12. ✅
