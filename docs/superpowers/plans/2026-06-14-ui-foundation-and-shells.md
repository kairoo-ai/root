# UI Foundation & Shells - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a scalable, best-in-class UI foundation - HeroUI v3.1.0 wired into the Kairoo token system, a layered accessible component library, and two app shells (public + investor) on a future-proof route architecture - without rewriting page content.

**Architecture:** Token-driven (everything reads `lib/design/tokens` → generated CSS; no raw colors). HeroUI v3 owns complex interactive widgets (themed via additive CSS-variable aliases); own CVA primitives own styled basics; Aceternity/Animate-UI/Anime/Motion supply flair. Route groups give each surface its own layout/shell. Light + dark first-class, maximal motion but `prefers-reduced-motion` safe.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19.2, Tailwind v4 (CSS-first), TypeScript strict, HeroUI v3.1.0 (`@heroui/styles` + `@heroui/react`), Motion (`motion/react`), Anime.js v4, next-themes, CVA + tailwind-merge, Chart.js.

**Spec:** `docs/superpowers/specs/2026-06-14-ui-foundation-and-shells-design.md`

---

## Conventions

- **Branch:** all work on `latest` (trunk). Commit frequently with conventional messages.
- **Verification gates** (the "tests" for this UI work - run after each task that touches them):
  - `npm run lint:colors` → must print `Color guard passed (...)`.
  - `npx tsc --noEmit` → exit 0.
  - `npm run build` → succeeds (also regenerates tokens via `prebuild`).
  - **Visual contract:** the component renders on `/style` in **light and dark**, all variants/states.
- **No raw colors, ever.** Use semantic utilities (`bg-primary`, `text-foreground`), type-scale (`text-h2`), spacing/radius/shadow/motion/z tokens. Goal: every component built here passes the guard **without** being in the legacy allowlist.
- **Token edits flow from source:** edit `lib/design/tokens/*`, run `npm run tokens`, commit the regenerated `app/styles/tokens.generated.css`. Never hand-edit generated CSS.

### Component Build Recipe (applied to every component in Phases 4–7)

Each component task repeats this loop (this is the DRY definition; component tasks list only what's _specific_):

- [ ] **R1 - Author the component** at its exact path using only tokens. If sourced from HeroUI v3 / Aceternity / Animate UI, adapt it: replace any raw colors/hex/`bg-gradient-*` with token utilities; map brand to `bg-primary`/`text-primary`; ensure `'use client'` only if it uses hooks/interactivity. For Aceternity components, paste the component's Tailwind-v4 `@theme`/`@keyframes` snippet into `app/globals.css` (token-colored).
- [ ] **R2 - Accessibility:** keyboard operable, correct ARIA/roles, visible focus via `focus-visible:ring-2 focus-visible:ring-ring`, respects `prefers-reduced-motion` (motion-heavy pieces gate animation).
- [ ] **R3 - Add to `/style`:** render the component with every variant/size/state in both a light and dark preview block.
- [ ] **R4 - Verify:** `npm run lint:colors` (no new allowlist entries), `npx tsc --noEmit`, and confirm it renders on `/style` in light + dark.
- [ ] **R5 - Commit:** `git commit -m "feat(ui): <Component> primitive (token-only, a11y)"`.

---

## Phase 1 - Theming foundation (token reconciliation + HeroUI v3 wiring)

This is the critical, non-parallelizable base. Do it first, in order.

### Task 1: Additive token reconciliation (free `--accent`/`--muted` for HeroUI)

**Files:**

- Modify: `lib/design/tokens/colors.ts` (the `semantic` map, lines 59-86)
- Regenerate: `app/styles/tokens.generated.css` (via `npm run tokens`)

- [ ] **Step 1: Edit the semantic map.** In `lib/design/tokens/colors.ts`, change `accent`/`accent-foreground` and `muted` to the brand/muted-text values, and add `accent-subtle*` + `muted-surface` carrying the OLD values:

```ts
  // brand-as-accent (HeroUI v3 reads --accent as brand)
  accent:                { light: "teal.600",    dark: "teal.400" },
  "accent-foreground":   { light: "neutral.50",  dark: "navy.950" },
  // NEW: the old pale accent tint, preserved under a distinct name
  "accent-subtle":            { light: "teal.50",  dark: "navy.800" },
  "accent-subtle-foreground": { light: "teal.700", dark: "teal.300" },
  // muted now = muted TEXT (HeroUI v3 reads --muted as muted text)
  muted:                 { light: "neutral.500", dark: "neutral.400" },
  "muted-foreground":    { light: "neutral.500", dark: "neutral.400" },
  // NEW: the old muted SURFACE, preserved under a distinct name
  "muted-surface":       { light: "neutral.100", dark: "navy.800" },
```

(Leave all other entries unchanged.)

- [ ] **Step 2: Regenerate + verify diff.** Run `npm run tokens`. Expected: `Wrote .../tokens.generated.css`. Confirm `:root`/`.dark` now contain `--accent: var(--color-teal-600/400)`, `--accent-subtle`, `--muted: var(--color-neutral-500/400)`, `--muted-surface`.
- [ ] **Step 3: Commit.** `git add lib/design/tokens/colors.ts app/styles/tokens.generated.css && git commit -m "feat(ds): reconcile accent/muted tokens for HeroUI v3 (additive: +accent-subtle, +muted-surface)"`

### Task 2: Bridge new tokens to utilities + migrate the 6 colliding usages

**Files:**

- Modify: `app/globals.css` (`@theme inline` block)
- Modify: `components/ui/Button.tsx`, `components/ui/Badge.tsx`, `components/CookieConsent.tsx`, `app/style/page.tsx`

- [ ] **Step 1: Add bridge entries** in `app/globals.css` `@theme inline` (next to the existing `--color-accent`/`--color-muted` lines):

```css
--color-accent-subtle: var(--accent-subtle);
--color-accent-subtle-foreground: var(--accent-subtle-foreground);
--color-muted-surface: var(--muted-surface);
```

- [ ] **Step 2: Migrate usages** so existing visuals are unchanged (tint/surface stay tint/surface):
  - `components/ui/Button.tsx`: `outline`/`ghost` variants `hover:bg-accent` → `hover:bg-accent-subtle`; `secondary` `hover:bg-muted` → `hover:bg-muted-surface`.
  - `components/ui/Badge.tsx`: neutral `bg-muted` → `bg-muted-surface`.
  - `components/CookieConsent.tsx:35`: `bg-accent` → `bg-accent-subtle`.
  - `app/style/page.tsx:38`: keep showing `accent` (now brand) AND add an `accent-subtle`/`muted-surface` swatch.
- [ ] **Step 3: Verify.** `npm run lint:colors` (pass) · `npx tsc --noEmit` (0). Visually confirm `/style` accent-subtle swatch = old pale teal; buttons unchanged.
- [ ] **Step 4: Commit.** `git commit -am "refactor(ui): point tint/surface usages at accent-subtle/muted-surface (no visual change)"`

### Task 3: Install HeroUI v3.1.0, remove v2 wiring

**Files:** `package.json`, delete `app/hero.ts`, modify `app/globals.css`, `app/providers.tsx`

- [ ] **Step 1: Packages.** `npm uninstall @heroui/react framer-motion && npm install @heroui/styles@^3.1.0 @heroui/react@^3.1.0` (use `--legacy-peer-deps` only if npm errors on React 19). Note: `motion` stays (our own animations); `framer-motion` (the redundant alias) goes.
- [ ] **Step 2: Delete** `app/hero.ts`.
- [ ] **Step 3: globals.css imports.** Replace the top import block:

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "./styles/tokens.generated.css";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
```

(Remove `@plugin './hero.ts';` and `@source '...@heroui/theme...';`. Order: tailwind → heroui styles → our tokens → tw-animate.)

- [ ] **Step 4: HeroUI alias layer.** Add after the `@theme inline` block in `app/globals.css`:

```css
@layer base {
  :root,
  .dark {
    --focus: var(--ring);
    --danger: var(--destructive);
    --danger-foreground: var(--destructive-foreground);
    --surface: var(--card);
    --surface-foreground: var(--card-foreground);
    --overlay: var(--popover);
    --overlay-foreground: var(--popover-foreground);
    --default: var(--secondary);
    --default-foreground: var(--secondary-foreground);
    --field-background: var(--input);
    --field-foreground: var(--foreground);
    --field-placeholder: var(--muted-foreground);
    --field-border: var(--border);
    --separator: var(--border);
    --link: var(--primary);
  }
}
```

- [ ] **Step 5: Providers.** Edit `app/providers.tsx` - remove `HeroUIProvider` import + wrapper; keep `NextThemesProvider` (`attribute="class"`, `storageKey="kairoo-theme"`):

```tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="kairoo-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 6: Verify.** `npm run build` succeeds; `npx tsc --noEmit` 0; `npm run lint:colors` pass. App boots in light + dark.
- [ ] **Step 7: Commit.** `git commit -am "feat(ds): migrate HeroUI v2→v3.1.0 (CSS-styles, no provider/plugin; token aliases)"`

### Task 4: HeroUI v3 smoke test (prove the wiring end-to-end)

**Files:** `components/ui/HButton.tsx` (temporary wrapper), `app/style/page.tsx`

- [ ] **Step 1:** Add a HeroUI v3 `Button` (import from `@heroui/react`, `variant="primary"`, `onPress`) to a new "HeroUI v3" section on `/style`.
- [ ] **Step 2: Verify** it renders with **Kairoo teal** (proving `--accent` alias works) and adapts in dark mode. If pale/wrong, fix the alias before proceeding (do not build more HeroUI components on a broken base).
- [ ] **Step 3: Commit.** `git commit -am "test(ds): HeroUI v3 smoke on /style - confirms brand inheritance"`

---

## Phase 2 - App architecture skeleton (route groups + shells + redirects)

### Task 5: Create route groups and move surfaces

**Files:** create `app/(marketing)/layout.tsx`, `app/(marketing)/page.tsx`; create `app/investors/layout.tsx` + subroutes; create `app/(app)/layout.tsx` (reserved); modify `next.config.ts`; relocate pages.

- [ ] **Step 1:** Create `app/(marketing)/` group; move `app/page.tsx` → `app/(marketing)/page.tsx` (home stays at `/`). Add `app/(marketing)/layout.tsx` rendering `<PublicShell>{children}</PublicShell>` (PublicShell stub for now: renders children + a placeholder nav/footer slot).
- [ ] **Step 2:** Create `app/investors/layout.tsx` rendering `<InvestorShell>`. Move pages: `business-strategy`→`investors/strategy`, `market-analysis`→`investors/market`, `investor-deck`→`investors/deck`, `technical-architecture`→`investors/architecture`. Add `app/investors/page.tsx` (investor overview stub). Content stays as-is (still allowlisted) - only location + shell change.
- [ ] **Step 3:** Add `app/(app)/layout.tsx` - reserved authenticated-product shell skeleton (renders children with a `TODO: app shell` comment; no pages).
- [ ] **Step 4: Redirects** in `next.config.ts`:

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/business-strategy",
        destination: "/investors/strategy",
        permanent: true,
      },
      {
        source: "/market-analysis",
        destination: "/investors/market",
        permanent: true,
      },
      {
        source: "/investor-deck",
        destination: "/investors/deck",
        permanent: true,
      },
      {
        source: "/technical-architecture",
        destination: "/investors/architecture",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
```

- [ ] **Step 5:** Update `components/Navigation.tsx` (and Footer) links to the new `/investors/*` paths (full nav rebuild comes in Phase 7; just fix hrefs now so nothing 404s).
- [ ] **Step 6: Verify.** `npm run build` (all routes compile); manually hit `/`, `/investors`, `/investors/deck`, and an old path (redirects). `npm run lint:colors` pass.
- [ ] **Step 7: Commit.** `git commit -am "feat(arch): route groups (marketing/investors/app) + investor relocation + 301 redirects"`

---

## Phase 3 - L1 primitives (parallelizable; each via the Component Build Recipe)

Path: `components/ui/<Name>.tsx`. Source per the spec's split. Each is one task = the Recipe (R1–R5) plus the specifics below.

- [ ] **Button** (own, exists) - finalize variants `primary|secondary|outline|ghost|destructive|link`, sizes `sm|md|lg|icon`, `isLoading` (spinner), `asChild` support. States: hover/active/focus/disabled/loading.
- [ ] **Card** (own, exists) - variants `default|glass|elevated`; ensure glass uses `--blur-glass` + `bg-card/N`.
- [ ] **Badge** (own, exists) - `neutral|success|warning|error|info`; **TierBadge** (exists) `free|pro|enterprise`.
- [ ] **Input** (own) - token field colors (`--input`/`--border`/`--ring`), sizes, invalid state, leading/trailing slot.
- [ ] **Textarea** (own) - same field treatment, auto-grow optional.
- [ ] **Label** (own) - pairs with Input; `htmlFor`, required marker.
- [ ] **Select** (HeroUI v3 compound: `Select`/`Label`/`Select.Trigger`/`Select.Popover`/`ListBox`) - items via `id`/`textValue`.
- [ ] **Combobox** (HeroUI v3 `ComboBox`) - async-friendly.
- [ ] **Checkbox**, **Radio/RadioGroup**, **Switch** (HeroUI v3) - token colors, focus rings.
- [ ] **Dialog** (HeroUI v3 `Modal` compound) - **replaces custom `Modal.tsx`**; focus trap, ESC, backdrop, `z-modal`. Then delete `components/Modal.tsx` and migrate `FeatureModal.tsx` onto it.
- [ ] **Drawer** (HeroUI v3 modal variant / Aceternity) - side sheet for mobile nav.
- [ ] **DropdownMenu** (HeroUI v3 `Menu`) - items `id`/`textValue`.
- [ ] **Tabs** (HeroUI v3) - `z`/ARIA tablist.
- [ ] **Tooltip**, **Popover** (HeroUI v3) - `z-tooltip`/`z-popover`.
- [ ] **Accordion** (HeroUI v3) - for FAQ.
- [ ] **Table** (HeroUI v3 compound) - sortable-ready; used by investor deck financials later.
- [ ] **Toast/Toaster** (HeroUI v3 or Sonner-style own) - `z-toast`.
- [ ] **Alert** (own) - `info|success|warning|error` using status tokens.
- [ ] **Avatar**, **Separator**, **Skeleton**, **Spinner**, **Progress**, **Kbd**, **Breadcrumb**, **Pagination** (own, token-only).
- [ ] **3d-pin rebuild** - rewrite `components/ui/3d-pin.tsx` token-only + keyboard-accessible; remove from color-guard allowlist.

After the batch: **remove rebuilt files from the legacy allowlist** in `scripts/check-no-raw-colors.mjs` (3d-pin, and later charts/footer/modal). Commit: `chore(ds): drop rebuilt components from color-guard allowlist`.

---

## Phase 4 - L2 layout primitives (parallelizable; Recipe)

Path: `components/layout/<Name>.tsx`.

- [ ] **Container** - max-width via `--layout-content-max`, responsive gutters (`--layout-gutter`).
- [ ] **Section** - vertical rhythm via `--layout-section-y`; optional `id`, heading slot.
- [ ] **Grid** / **Stack** / **Spacer** - token spacing props.
- [ ] **PageHeader** - eyebrow (`text-overline`) + `text-display`/`text-h1` + subtitle (`text-body-lg text-muted-foreground`).
- [ ] **Prose** - wraps `RichText`/markdown with `@tailwindcss/typography` themed to tokens (light + dark).

---

## Phase 5 - L3 blocks + L4 charts (parallelizable; Recipe)

**Blocks** - Path: `components/blocks/<Name>.tsx` (Aceternity/Animate-UI flair, re-skinned to tokens; Motion for reveal):

- [ ] **Hero** (Aceternity Aurora/Spotlight bg in brand teal/navy + `PageHeader` + CTA `Button`s).
- [ ] **FeatureGrid** / **BentoGrid** (Aceternity bento) - token cards.
- [ ] **PricingTable** - uses `TierBadge`, `Card`, tier tokens.
- [ ] **StatCounter** (Animate UI Counting Number) - `font-data` tabular figures.
- [ ] **Testimonial**, **CTA**, **FAQ** (uses `Accordion`), **LogoMarquee** (Animate UI / Aceternity marquee).

**Charts** - Path: `components/charts/`:

- [ ] **ChartCanvas** - shared Chart.js wrapper reading colors from `tokens` (`import { colors } from "@/lib/design/tokens"`) + `getComputedStyle` for live theme; light/dark aware; honors reduced-motion.
- [ ] Migrate `CompetitiveChart`, `ForecastChart`, `TeamSkillChart`, `GrowthChart` onto `ChartCanvas` (token colors). Remove all four from the color-guard allowlist.

---

## Phase 6 - Shell composition (uses the primitives)

Path: `components/shells/`.

- [ ] **PublicNav** - `Logo`, primary links, `ThemeToggle`, CTA `Button`s; scrolled state (`useScrolled` hook in `hooks/`); mobile `Drawer` nav. Token colors only (replaces the legacy `Navigation.tsx` grays/cyans).
- [ ] **InvestorNav** - separate nav (deck · market · strategy · architecture · contact); visually distinct, quieter; structured so an auth gate can wrap `app/investors` later.
- [ ] **Footer** - rebuild token-only (replaces `text-gray-*`/`hover:text-cyan-400`); legal links section. Remove from allowlist.
- [ ] **AuroraBackground** (`components/motion/`) - CSS-driven, token colors, `prefers-reduced-motion` off; replaces `AnimatedBackground` hardcoded blobs (remove from allowlist) or re-skins it.
- [ ] **ThemeToggle** / **FloatingThemeToggle** - keyboard-accessible; token colors.
- [ ] Wire `PublicShell` = PublicNav + AuroraBackground + Footer; `InvestorShell` = InvestorNav + investor footer. Mount in the respective route-group layouts.

---

## Phase 7 - Final gates, allowlist, /style catalog

- [ ] **Step 1:** Expand `/style` into a full catalog: every L1/L2/L3 component, all variants/states, in side-by-side light + dark frames. This is the visual contract.
- [ ] **Step 2:** Shrink `scripts/check-no-raw-colors.mjs` allowlist to only files NOT yet rewritten (the legacy page _content_: `app/(marketing)/page.tsx` + the 4 investor pages until their content rewrite). All rebuilt components/charts/shells removed from the list.
- [ ] **Step 3: Full verification.** `npm run lint:colors` (pass) · `npx tsc --noEmit` (0) · `npm run build` (succeeds). Manually verify `/`, `/investors`, `/investors/*`, `/style` in light + dark + with `prefers-reduced-motion`.
- [ ] **Step 4: Update `docs/DESIGN-SYSTEM.md`** - document new tokens (`accent-subtle`, `muted-surface`), HeroUI v3 wiring, the component-library layers, and shells.
- [ ] **Step 5: Commit + let auto-PR carry to main.** `git commit -am "feat(ui): foundation + shells complete (component library, HeroUI v3, route groups)"`

---

## Self-Review

**Spec coverage:** §2 architecture → Phase 2/5 (route groups, shells). §3 HeroUI v3 + token reconciliation → Phase 1 (Tasks 1-4). §4 component library (layers, sourcing, DoD) → Conventions Recipe + Phases 3-5. §5 shells → Phase 6. §6 verification gates → Conventions + Phase 7. §9 decisions (investor URLs+redirects, reserved `(app)`, additive tokens, HeroUI-for-complex) → Tasks 1-2, 5. ✅ All sections covered.

**Placeholder scan:** Phase 1-2 carry exact code/commands. Phases 3-6 are intentionally catalog-style driving the shared Component Build Recipe (DRY) - each item names its source, variants, states, a11y, and path; the recipe defines build+verify+commit. This is the deliberate altitude for a ~40-component library executed via parallel orchestration, not unspecified work.

**Type/name consistency:** `cn` from `@/lib/utils` (exists). Token names match `colors.ts` (`accent-subtle`, `muted-surface`, `muted-foreground`). HeroUI v3 names (`--accent`, `--focus`, `--danger`, `--surface`, `--overlay`, `--default`, `--field-*`, `--separator`, `--link`) match Task 3's alias block. Component import surface is always `@/components/{ui,layout,blocks,shells,motion}`.

---

## Execution Handoff

Per the approved direction (heavy parallel orchestration, Claude MAX), execution runs as a **parallel Workflow**: Phase 1-2 sequentially (critical base), then Phases 3-5 fan out (one agent per component via the Recipe) each **adversarially verified** for DS-adherence/a11y/light-dark before acceptance, then Phase 6-7. **Checkpoint with the user after Phase 6** (foundation + shells complete) before any page-content rewrites.
