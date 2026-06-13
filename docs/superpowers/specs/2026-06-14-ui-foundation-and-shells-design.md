# UI Foundation & Shells — Design Spec

**Date:** 2026-06-14
**Status:** Proposed (awaiting approval)
**Branch:** `latest` (trunk; auto-PR → `main`)
**Builds on:** the merged Kairoo design system (`docs/DESIGN-SYSTEM.md`, `lib/design/tokens/`)

> This is **Phase 1 — Foundation + Shells**. It deliberately stops *before* rewriting page
> content. Its job is to make the base so solid that the whole product (every future
> route/subroute/page) can be built on it cleanly. Page-content rewrites and the investor
> page redesigns are explicit follow-ups gated behind a review checkpoint.

---

## 1. Context & goals

The design system (tokens → generated CSS, `Button/Card/Badge/TierBadge`, `/style`, color guard,
CI) is built and merged. Brand (Kairoo, fonts, `Logo`, `RebrandBanner`) is done. What does **not**
yet exist is the actual product-grade UI/UX layer: a deep, accessible, best-of-breed component
library; a scalable folder/route architecture; and the two application shells. Today there are a
handful of bloated legacy pages dumped at flat routes.

**Goals**
1. Establish a **scalable, future-proof architecture** (folder conventions, route groups, layout
   system) that the full product grows into without restructuring again.
2. Migrate to **HeroUI v3.1.0** and wire it into the Kairoo token system with **zero visual
   compromise** (additive token reconciliation).
3. Build a **layered, best-of-breed component library** — every primitive accessible, token-only,
   light+dark, maximal-motion-but-reduced-motion-safe, and shown on `/style`.
4. Stand up the **two shells**: a conversion-first **public** shell and a separate **investor**
   shell (own nav; open now, gated later).
5. Keep the **color guard green** and shrink its legacy allowlist for every component we touch.

**Non-goals (this phase):** rewriting page *content* (home, investor pages), legal page content
(separate plan exists), auth/gating, analytics/observability. The authenticated product shell is
*architecturally reserved* but not built.

---

## 2. Target architecture — folders & routing

Route groups give each surface its own layout/shell without leaking URL segments.

```
app/
  layout.tsx              # root: <html><body>, fonts, <Providers>, global background slot, RebrandBanner
  providers.tsx           # next-themes ONLY (HeroUIProvider removed in v3)
  globals.css             # tailwind + heroui styles + token bridge + heroui alias layer
  styles/tokens.generated.css   # generated (unchanged source of truth)

  (marketing)/            # PUBLIC, conversion-first — own shell, no URL prefix (home stays "/")
    layout.tsx            # PublicShell: PublicNav + Footer + marketing background
    page.tsx              # home
    # future: features/, pricing/, about/, contact/, blog/  (skeleton only later)

  investors/              # INVESTOR shell — real "/investors" segment, separate nav, open now / gate later
    layout.tsx            # InvestorShell: InvestorNav + investor footer
    page.tsx              # investor overview/landing
    deck/page.tsx         # ← was /investor-deck
    market/page.tsx       # ← was /market-analysis
    strategy/page.tsx     # ← was /business-strategy
    architecture/page.tsx # ← was /technical-architecture

  legal/                  # legal pages (content per separate plan); uses LegalLayout
  style/page.tsx          # living component gallery (noindex) — expanded into full catalog
  api/                    # unchanged

  (app)/                  # RESERVED for the future authenticated product (own shell). Not built now.
```

```
components/
  ui/         # L1 primitives — token-only, accessible. Own primitives + thin HeroUI v3 wrappers.
  layout/     # L2 layout primitives — Container, Section, Grid, Stack, Spacer, PageHeader, Prose
  blocks/     # L3 composed marketing blocks — Hero, FeatureGrid, Bento, PricingTable, StatCounter,
              #     Testimonial, CTA, FAQ, LogoMarquee
  charts/     # L4 themeable Chart.js wrappers (read tokens; light/dark aware)
  shells/     # PublicNav, InvestorNav, Footer, MobileNav, ThemeToggle (+ FloatingThemeToggle)
  brand/      # Logo, RebrandBanner (relocated here)
  motion/     # Reveal, Stagger, Marquee, AuroraBackground — wrap Motion/Anime/Aceternity, RM-safe
lib/
  design/tokens/   # source of truth (unchanged)
  utils/           # cn() + formatters (from lib/utils.ts)
  legal/           # exists
hooks/             # usePrefersReducedMotion, useScrollProgress, useMediaQuery, useScrolled, ...
```

**Routing notes**
- Old flat URLs (`/business-strategy`, `/market-analysis`, `/investor-deck`,
  `/technical-architecture`) get **permanent redirects** (`next.config.ts`) to their new
  `/investors/*` homes so nothing breaks.
- Moving the four investor pages into `investors/*` is **shell** work; their *content* keeps its
  current (allowlisted) markup until the rewrite phase — they just render under the new shell.

---

## 3. HeroUI v3.1.0 migration + token reconciliation

**Verified facts (official v3 docs + npm, June 2026):** v3.1.0 is `latest`; peers `react >=19`,
`tailwindcss >=4` (satisfied). Two packages: `@heroui/styles` + `@heroui/react`. **No
`HeroUIProvider`, no `hero.ts` plugin, no `@source` glob.** Theming is pure CSS variables; v3 reads
the `.dark` class (next-themes `attribute="class"` stays). v3 dropped framer-motion (native CSS
animations).

**globals.css changes**
- Remove: `@plugin './hero.ts';` and `@source '...@heroui/theme/...';`. Delete `app/hero.ts`.
- Add (order-sensitive): `@import "tailwindcss";` then `@import "@heroui/styles";` (before the token
  bridge). Keep the existing `@import "./styles/tokens.generated.css"`, `tw-animate-css`,
  `@custom-variant dark`, and the `@theme inline` semantic bridge.

**providers.tsx** — remove `<HeroUIProvider>`; keep `<NextThemesProvider attribute="class" …>`.
Interactive HeroUI components live in `'use client'` leaves.

**Token reconciliation (additive, zero visual compromise).** HeroUI v3 reads a fixed set of
variable names. Most have no Kairoo name clash → **pure aliases** added in a `@layer base` block:

```css
:root, .dark {
  --focus: var(--ring);
  --danger: var(--destructive);        --danger-foreground: var(--destructive-foreground);
  --surface: var(--card);              --surface-foreground: var(--card-foreground);
  --overlay: var(--popover);           --overlay-foreground: var(--popover-foreground);
  --default: var(--secondary);         --default-foreground: var(--secondary-foreground);
  --field-background: var(--input);    --field-foreground: var(--foreground);
  --field-placeholder: var(--muted-foreground); --field-border: var(--border);
  --separator: var(--border);
  --link: var(--primary);
  /* --background, --foreground, --success, --warning, --radius share names → no-op */
}
```

Two names genuinely collide (HeroUI assigns them a different *meaning* than Kairoo). A single CSS
variable can't hold two values at one scope, so we resolve **additively** — keep Kairoo's exact
values under a new name, free the standard name for HeroUI:

| Name | HeroUI v3 meaning | Kairoo current meaning | Resolution |
|---|---|---|---|
| `--accent` | brand color | pale tint (teal-50/navy-800) | tint → **new** `--accent-subtle` (+ `bg-accent-subtle`); `--accent` becomes `var(--primary)` |
| `--muted` | muted *text* | muted *surface* (neutral-100/navy-800) | surface → **new** `--muted-surface` (+ `bg-muted-surface`); `--muted` becomes `var(--muted-foreground)` |

This is generated from the token source: add `accent-subtle` and `muted-surface` to the semantic
map in `lib/design/tokens/colors.ts`, point semantic `accent`→brand and `muted`→muted-foreground,
`npm run tokens`, commit the regenerated CSS. **Collision surface is 6 class usages across 4 files**
(`components/ui/Button.tsx`, `components/ui/Badge.tsx`, `components/CookieConsent.tsx`,
`app/style/page.tsx`) — all components we upgrade this phase, so the migration cost is absorbed and
**no rendered color changes**. `text-muted-foreground` (used widely) is unaffected.

`DESIGN-SYSTEM.md` and `/style` are updated to document the new tokens.

---

## 4. Component library — architecture, sourcing, inventory

**Layers** (import direction is one-way: blocks→layout→ui→tokens):
- **L1 `ui/`** — primitives. Token-only, CVA variants, full a11y, RSC-friendly.
- **L2 `layout/`** — structural primitives encoding spacing/rhythm tokens.
- **L3 `blocks/`** — composed marketing sections (flair lives here).
- **L4 `charts/`** — themeable data-viz.

**Best-of-breed sourcing policy** — pick the best source *per component*, then conform 100% to
tokens and a11y. Stable import surface: the app always imports from `@/components/ui|layout|blocks`
(wrappers), so the underlying source is swappable.

| Need | Primary source | Notes |
|---|---|---|
| Complex interactive (Modal/Dialog, Select, Combobox, Dropdown/Menu, Tabs, Tooltip, Popover, Switch, Checkbox, Radio, Accordion, Table, DatePicker) | **HeroUI v3** | React-Aria a11y; themed via §3 aliases; thin wrapper in `ui/` |
| Styled primitives (Button, Badge, Card, Input, Textarea, Label, Separator, Skeleton, Spinner, Progress, Avatar, Kbd, Alert, Breadcrumb, Pagination) | **own (CVA + tokens)** or HeroUI — best per case | own where styling *is* the point |
| Hero/background flair (Aurora, Spotlight, Beams, Bento, 3D card, Hero Highlight, animated text) | **Aceternity** | re-skinned to tokens; v4 keyframes pasted into globals |
| Counters / micro-interactions / carousels | **Animate UI** | exact Motion match |
| Scroll-reveal / layout / presence | **Motion** (`motion/react`) | consolidate: drop `framer-motion` dupe |
| Complex timelines / SVG | **Anime.js v4** | `createScope` + `revert()` cleanup |
| Ambient looping backgrounds | **CSS** | off-main-thread, reduced-motion gated |

**Definition of Done (every component):** no raw colors (passes guard *without* allowlist); uses
semantic tokens + type scale + spacing/radius/shadow/motion/z-index tokens; works in light **and**
dark; maximal motion where apt but `prefers-reduced-motion` safe; full keyboard + ARIA + visible
focus (`--ring`); TS strict; `'use client'` only where required; **rendered on `/style`** with all
variants/states.

**Build/replace this phase**
- *Keep & harden:* `Button, Card, Badge, TierBadge` (reconcile tokens; add states/sizes as needed).
- *New L1:* `Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Label, Dialog (replaces
  custom `Modal.tsx`), Drawer, DropdownMenu, Tabs, Tooltip, Popover, Accordion, Toast/Toaster,
  Table, Alert, Avatar, Separator, Skeleton, Spinner, Progress, Breadcrumb, Pagination`.
- *New L2:* `Container, Section, Grid, Stack, Spacer, PageHeader, Prose`.
- *New L3 (seed set):* `Hero, FeatureGrid, BentoGrid, PricingTable, StatCounter, Testimonial, CTA,
  FAQ, LogoMarquee`.
- *L4:* one themeable Chart.js wrapper (`ChartCanvas` reading `tokens`) → migrate the 4 charts off
  hardcoded colors.
- *Retire/rebuild:* custom `Modal.tsx` (→ Dialog), `3d-pin.tsx` (token + a11y rebuild),
  `FloatingThemeToggle` (keyboard-accessible).

---

## 5. Shells

- **Root layout** — `<html>`/`<body className="bg-background text-foreground">`, fonts, `<Providers>`,
  a global animated-background slot, `RebrandBanner`. `suppressHydrationWarning` on `<html>`.
- **PublicShell** (`(marketing)/layout.tsx`) — `PublicNav` (Logo, primary nav, theme toggle, CTAs),
  marketing background, `Footer`. Conversion-first; sticky/scrolled states; mobile drawer nav.
- **InvestorShell** (`investors/layout.tsx`) — separate `InvestorNav` (deck · market · strategy ·
  architecture · contact), quieter/credible background, investor footer. Open now; structured so a
  single gate (auth middleware) can wrap it later with no refactor.
- **Motion/background system** — `components/motion/AuroraBackground` (CSS-driven, token colors,
  reduced-motion off); `Reveal`/`Stagger` wrappers over Motion for scroll-in; consolidate to the
  `motion` package (remove direct `framer-motion`).

---

## 6. Verification & quality gates

- `npm run lint:colors` green; **legacy allowlist shrinks** for every component rebuilt this phase
  (charts, footer, nav, 3d-pin, modal). Pages stay allowlisted until their rewrite phase.
- `npm run build` green (Turbopack; `prebuild` regenerates tokens), `tsc --noEmit` clean.
- `/style` renders every primitive/block in **light and dark**, all variants/states — the visual
  contract reviewers sign off against.
- Per-component **adversarial DS-adherence + a11y check** (fonts, semantic colors, tokens, keyboard,
  contrast, reduced-motion, light/dark) — run via the parallel orchestration below.

---

## 7. Orchestration plan (parallel build)

Given the green light for heavy parallelism: build the library as a **workflow pipeline** — one
agent constructs each component, the next stage **adversarially verifies** it against the DoD
(tokens/a11y/light-dark/reduced-motion), looping until clean; independent components run
concurrently (worktree isolation only if file writes would conflict). Token reconciliation + HeroUI
wiring + shells land first (they unblock everything), then primitives fan out, then layout, then
blocks, then charts. A final pass runs the full gates (guard, build, tsc, `/style` in both themes).

---

## 8. Risks & mitigations

- **HeroUI v2→v3 breaking rewrite** (compound components, `useDisclosure`→`useOverlayState`,
  `onClick`→`onPress`, `primary`→`accent`) → migrate behind `ui/` wrappers; pull each component's v3
  doc before building it; `/style` catches regressions.
- **Token reconciliation touching merged DS** → additive, 6 usages/4 files, generated from source,
  zero visual change; documented in `DESIGN-SYSTEM.md` + `/style`.
- **Two modal systems / motion dupe** → consolidate (Dialog; `motion` only).
- **Scope creep** → page-content rewrites explicitly deferred to the checkpoint.

---

## 9. Open questions (please confirm at review)

1. **Investor URLs:** `/investors` + `/investors/{deck,market,strategy,architecture}`, with 301
   redirects from the old flat paths — good? (Or keep old paths too?)
2. **Reserve `app/(app)/`** authenticated-product shell as an empty skeleton now, or leave entirely
   for later?
3. **Token reconciliation** (`--accent`→brand + new `--accent-subtle`; `--muted`→muted-foreground +
   new `--muted-surface`) — approved to apply to the generated design system?
4. **HeroUI v3 vs own primitives split** in §4 — comfortable letting HeroUI own the complex
   interactive widgets while we own the styled primitives, or prefer own-everything (more control,
   more build)?
