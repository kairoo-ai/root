# Kairoo — Design System Map (start here)

The single index of where the **entire** design system, theme, and brand live. If you're
looking for "where does X come from / how do I change it," this is the map.

---

## TL;DR
- **Source of truth for all design tokens:** [`lib/design/tokens/`](../lib/design/tokens/) (typed TS).
- **To change any color / type / spacing / radius / shadow / motion / z-index:** edit the
  relevant file in `lib/design/tokens/`, then run **`npm run tokens`** (regenerates the CSS),
  and commit the regenerated `app/styles/tokens.generated.css`.
- **Never** hardcode colors in `app/` or `components/` — the guard (`npm run lint:colors`) blocks it.
- **See it all rendered:** the **`/style`** route (ramps, semantic swatches, type scale, primitives).

---

## Where everything lives

| Concept | Location | Notes |
|---|---|---|
| **Token source of truth** | [`lib/design/tokens/`](../lib/design/tokens/) | `colors.ts` (OKLCH ramps + semantic map + tiers), `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`, `motion.ts`, `zIndex.ts`, `breakpoints.ts`, `index.ts` (aggregate `tokens`) |
| **Token generator** | [`scripts/build-tokens.ts`](../scripts/build-tokens.ts) | Run via `npm run tokens` (and `prebuild`). Emits the CSS below. |
| **Generated CSS (do not edit)** | [`app/styles/tokens.generated.css`](../app/styles/tokens.generated.css) | `@theme` primitives + `:root`/`.dark` semantic vars + `.text-*` utilities |
| **Theme wiring** | [`app/globals.css`](../app/globals.css) | Imports the generated CSS; maps semantic vars in `@theme inline`; keeps surface/glass tokens, base layer, reduced-motion |
| **Fonts** | [`app/layout.tsx`](../app/layout.tsx) | DM Sans, Space Grotesk, Mona Sans, Geist Mono via `next/font/google` → `--font-*` |
| **HeroUI theme** | [`app/hero.ts`](../app/hero.ts) | Themes HeroUI primary/focus/background to brand (hex anchors); loaded via `@plugin` in globals |
| **Component primitives** | [`components/ui/`](../components/ui/) | `Button`, `Card`, `Badge`, `TierBadge` (token-only, CVA) |
| **Logo / brand components** | [`components/Logo.tsx`](../components/Logo.tsx), [`RebrandBanner.tsx`](../components/RebrandBanner.tsx), [`RichText.tsx`](../components/RichText.tsx) | Glyph/wordmark, rebrand notice, branded markdown renderer |
| **Live reference page** | [`app/style/page.tsx`](../app/style/page.tsx) → route `/style` | Visual contract: ramps, semantics, type, primitives (noindex) |
| **Strictness guard** | [`scripts/check-no-raw-colors.mjs`](../scripts/check-no-raw-colors.mjs) | `npm run lint:colors`; bans raw hex/rgb/arbitrary color classes; has a legacy allowlist |
| **CI gate** | [`.github/workflows/auto-pr-latest.yml`](../.github/workflows/auto-pr-latest.yml) | `verify` job runs guard + build on push/PR; `auto-pr` job opens latest→main PRs |
| **Brand assets (SVGs)** | [`docs/brand/`](brand/) | `kairoo-glyph.svg`, `-dark.svg`, `-mono.svg`, `kairoo-favicon-16.svg`; favicon/app-icon at `app/icon.svg`, `app/apple-icon.svg` |
| **Full DS documentation** | [`docs/brand/design-system.md`](brand/design-system.md) | Architecture, usage (CSS + JS), naming, token catalog, contribution loop |
| **Brand reference** | [`docs/brand/README.md`](brand/README.md) | Name, glyph, palette, tiers, themes, exploration archive |

---

## How to change X (recipes)

- **A brand/ramp color** → edit `lib/design/tokens/colors.ts` → `npm run tokens` → commit generated CSS.
- **What `primary` (buttons/links/rings) points to** → `semantic` map in `colors.ts` (e.g. `primary: { light: "teal.600", dark: "teal.400" }`).
- **A font / type size** → `lib/design/tokens/typography.ts` (+ load new families in `app/layout.tsx`).
- **Spacing / radius / shadow / motion / z-index** → the matching file in `lib/design/tokens/`.
- **Use a token in a component** → CSS: `bg-primary`, `text-h1`, `shadow-elevation-3`, `bg-tier-pro/15`. JS: `import { tokens } from "@/lib/design/tokens"`.
- **Add a UI library** → it inherits the brand automatically if it reads the standard semantic CSS vars (shadcn) or is themed from tokens (HeroUI in `app/hero.ts`).

## Commands
```bash
npm run tokens        # regenerate app/styles/tokens.generated.css from TS source
npm run lint:colors   # enforce: no raw colors in app/ or components/
npm run build         # prebuild regenerates tokens, then builds
```

## Design intent & history (specs / plans)
- Design system spec: [`docs/superpowers/specs/2026-06-14-design-system-design.md`](superpowers/specs/2026-06-14-design-system-design.md)
- Design system plan: [`docs/superpowers/plans/2026-06-14-design-system.md`](superpowers/plans/2026-06-14-design-system.md)
- Rebrand + brand identity spec: [`docs/superpowers/specs/2026-06-13-rebrand-and-legal-design.md`](superpowers/specs/2026-06-13-rebrand-and-legal-design.md)

## Status
- **Design system + theme:** ✅ built on `latest` (tokens, generator, semantic wiring, fonts, HeroUI, primitives, `/style`, guard, CI, docs).
- **Legal pages:** 📝 planned (config-driven) — [`docs/superpowers/plans/2026-06-14-legal-pages.md`](superpowers/plans/2026-06-14-legal-pages.md).
