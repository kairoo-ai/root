# Kairoo Brand Application Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the app from "AstraPath AI" to **Kairoo** — apply the locked color system, themes, typography, and glyph across the codebase, add a rebrand-announcement banner, and rename every user-facing and internal "AstraPath" reference.

**Architecture:** Next.js 16 App Router. Theming is CSS-variable based in `app/globals.css` (`:root` + `.dark`, plus a `@theme inline` map) with `next-themes` (class strategy, dark default). Fonts load via `next/font`. We add Kairoo brand tokens alongside the existing neutral tokens, retune the gradient/background accents to the brand palette, swap the font stack, introduce a reusable `Logo` component built from the locked glyph SVG, and mount a dismissible rebrand banner in the root layout.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4 (`@theme inline`), next-themes, HeroUI, `next/font` (DM Sans + Space Grotesk via Google; Mona Sans via local font), lucide-react.

**Source of truth for brand values:** [`../specs/2026-06-13-rebrand-and-legal-design.md`](../specs/2026-06-13-rebrand-and-legal-design.md) and the asset backups in [`../../brand/`](../../brand/).

**Testing note:** This project has **no unit-test runner configured** and the work is almost entirely visual/branding. Verification per task is therefore: (a) `npx tsc --noEmit` passes, (b) `npm run build` succeeds, and (c) a visual check in the dev server (`npm run dev`, port 1254). Where a behavior is logic (banner dismissal persistence), we verify it explicitly in the browser. Frequent commits after each task.

---

## File Structure

**Create:**
- `app/fonts/` — local Mona Sans variable font files (woff2) + `index.ts` font bindings
- `components/Logo.tsx` — Kairoo glyph + wordmark, theme-aware, size-configurable
- `components/RebrandBanner.tsx` — dismissible "AstraPath AI is now Kairoo" banner
- `public/brand/kairoo-glyph.svg`, `kairoo-glyph-dark.svg`, `kairoo-mark.svg` — runtime SVGs (copied from `docs/brand/`)
- `app/icon.svg` — favicon (Next.js file-based metadata icon)
- `app/apple-icon.svg` — Apple touch icon

**Modify:**
- `app/globals.css` — add brand tokens, retune `gradient-text`, body backgrounds, font var
- `app/layout.tsx` — fonts, metadata (title/description), mount `RebrandBanner`
- `app/providers.tsx` — `storageKey` rename
- `components/Navigation.tsx` — use `Logo`
- `components/Footer.tsx` — use `Logo`, copyright text
- `package.json` — `name` field
- Copy/text files: `app/page.tsx`, `app/business-strategy/page.tsx`, `app/investor-deck/page.tsx`, `app/market-analysis/page.tsx`, `app/technical-architecture/page.tsx`, `components/CompetitiveChart.tsx`, `README.md`, `GEMINI.md`

---

## Task 1: Add Kairoo brand color tokens to globals.css

**Files:**
- Modify: `app/globals.css` (the `:root` block ~line 312, `.dark` block ~line 353, and `@theme inline` ~line 8)

- [ ] **Step 1: Add brand tokens to `:root`**

In `app/globals.css`, inside the `:root { ... }` block, add these lines just before the closing `}` (after `--surface-glow`):

```css
  /* Kairoo brand palette */
  --brand-navy: #0B1F3A;
  --brand-teal: #0D9488;
  --brand-teal-bright: #2DD4BF;
  --brand-amber: #F59E0B;
  --brand-gold: #CBA34A;
  --brand-mist: #F8FAFC;
  /* Semantic (light) */
  --brand-ink: var(--brand-navy);
  --brand-primary: var(--brand-teal);
  --tier-free: var(--brand-amber);
  --tier-pro: var(--brand-teal);
  --tier-enterprise: var(--brand-navy);
```

- [ ] **Step 2: Add dark overrides to `.dark`**

Inside the `.dark { ... }` block, before its closing `}` (after `--surface-glow`), add:

```css
  /* Kairoo brand (dark) */
  --brand-ink: var(--brand-mist);
  --brand-primary: var(--brand-teal-bright);
```

- [ ] **Step 3: Expose brand tokens to Tailwind via `@theme inline`**

Inside the `@theme inline { ... }` block, before its closing `}` (after `--radius-xl`), add:

```css
  --color-brand-navy: var(--brand-navy);
  --color-brand-teal: var(--brand-teal);
  --color-brand-teal-bright: var(--brand-teal-bright);
  --color-brand-amber: var(--brand-amber);
  --color-brand-gold: var(--brand-gold);
  --color-brand-primary: var(--brand-primary);
  --color-brand-ink: var(--brand-ink);
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: build succeeds (CSS-only change; Tailwind now recognizes `bg-brand-teal`, `text-brand-ink`, etc.).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat(brand): add Kairoo color tokens to theme"
```

---

## Task 2: Retune gradient + backgrounds to the brand palette

**Files:**
- Modify: `app/globals.css` (`.gradient-text` ~line 105; `.aurora-bg` ~line 50; `body` background ~line 400; `.dark body` ~line 408)

- [ ] **Step 1: Rebrand `.gradient-text`**

Replace the existing `.gradient-text` rule:

```css
.gradient-text {
  background: linear-gradient(135deg, #7c79c6, #ff3d7f, #00f5d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

with the brand gradient (navy → teal → amber):

```css
.gradient-text {
  background: linear-gradient(135deg, #0B1F3A, #0D9488, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.dark .gradient-text {
  background: linear-gradient(135deg, #2DD4BF, #0D9488, #FBBF24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

- [ ] **Step 2: Retune `.aurora-bg` accent colors**

Replace the `background-image` inside `.aurora-bg` with brand-tinted glows:

```css
  background-image: 
    radial-gradient(ellipse at 20% 20%, rgba(13, 148, 136, 0.18), transparent 50%),
    radial-gradient(ellipse at 80% 40%, rgba(245, 158, 11, 0.12), transparent 50%),
    radial-gradient(ellipse at 40% 80%, rgba(11, 31, 58, 0.18), transparent 50%);
```

- [ ] **Step 3: Retune light `body` background**

Replace the `body { background: ... }` radial/linear gradient (the multi-line `radial-gradient(...)... linear-gradient(135deg, #fef8ff, #edf5ff);`) with:

```css
  background: radial-gradient(circle at 12% 18%, rgba(13, 148, 136, 0.10), transparent 45%),
    radial-gradient(circle at 80% 0%, rgba(147, 197, 253, 0.35), transparent 50%),
    linear-gradient(135deg, #FFFFFF, #F8FAFC);
```

- [ ] **Step 4: Retune `.dark body` background (navy-derived, not black)**

Replace the `.dark body { background: ... }` rule's `background`:

```css
  background: radial-gradient(circle at 10% 20%, rgba(13, 148, 136, 0.22), transparent 45%),
    radial-gradient(circle at 80% 0%, rgba(45, 212, 191, 0.14), transparent 40%),
    linear-gradient(135deg, #071426, #0B1F3A);
```

- [ ] **Step 5: Verify visually**

Run: `npm run dev` (port 1254). Open `http://localhost:1254`. Toggle light/dark with the floating toggle.
Expected: gradients/headings now read navy/teal/amber; dark background is deep navy (not pure black); no purple/pink remnants in the hero gradient text.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "feat(brand): retune gradients and backgrounds to Kairoo palette"
```

---

## Task 3: Swap the font stack (DM Sans + Space Grotesk)

**Files:**
- Modify: `app/layout.tsx:1-40`, `app/globals.css` (`--font-sans` ~line 11; `body`/`.gradient`-adjacent `font-family` ~lines 46 & 405)

- [ ] **Step 1: Replace the font imports/instances in `layout.tsx`**

Replace:

```tsx
import { Inter } from "next/font/google";
...
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
```

with:

```tsx
import { DM_Sans, Space_Grotesk } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});
```

- [ ] **Step 2: Update the `<body>` className to apply both font variables**

Replace `className={`${inter.variable} antialiased transition-colors duration-500`}` with:

```tsx
        className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased transition-colors duration-500`}
```

- [ ] **Step 3: Point CSS font vars at DM Sans**

In `app/globals.css`, change `--font-sans: var(--font-inter);` (in `@theme inline`) to:

```css
  --font-sans: var(--font-dm-sans);
  --font-display: var(--font-space-grotesk);
```

Then change BOTH `font-family: 'Inter', sans-serif;` occurrences (the `body` rules at ~line 46 and ~line 405) to:

```css
  font-family: var(--font-dm-sans), system-ui, sans-serif;
```

- [ ] **Step 4: Add a display-font utility**

Append to `app/globals.css`:

```css
.font-display {
  font-family: var(--font-space-grotesk), var(--font-dm-sans), sans-serif;
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run build` (expect success), then `npm run dev` and confirm body text now renders in DM Sans (rounded geometric), no Inter reference remains.

Run: `grep -rn "Inter\|font-inter" app/ components/` → Expected: no matches.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat(brand): swap font stack to DM Sans + Space Grotesk"
```

---

## Task 4: Set up Mona Sans (data/enterprise surfaces) as a local font

**Files:**
- Create: `app/fonts/MonaSans.woff2`, `app/fonts/index.ts`
- Modify: `app/layout.tsx` (apply variable), `app/globals.css` (utility)

> Mona Sans is not on Google Fonts. We bind it now (variable-ready) but only apply it via a `.font-data` utility on data surfaces; it does NOT change default body text. Per spec §3.3, load it only where used.

- [ ] **Step 1: Download the Mona Sans variable font**

Run:

```bash
mkdir -p app/fonts && curl -L -o app/fonts/MonaSans.woff2 \
  https://github.com/github/mona-sans/raw/main/fonts/webfonts/MonaSans%5Bslnt%2Cwght%5D.woff2
```

Expected: a `MonaSans.woff2` file (~ hundreds of KB) in `app/fonts/`. Verify: `ls -la app/fonts/MonaSans.woff2`.

- [ ] **Step 2: Create the font binding**

Create `app/fonts/index.ts`:

```ts
import localFont from "next/font/local";

export const monaSans = localFont({
  src: "./MonaSans.woff2",
  variable: "--font-mona-sans",
  display: "swap",
  weight: "400 700",
});
```

- [ ] **Step 3: Apply the variable on `<body>`**

In `app/layout.tsx`, import and add `monaSans.variable` to the body className:

```tsx
import { monaSans } from "./fonts";
```

and update the className to:

```tsx
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${monaSans.variable} antialiased transition-colors duration-500`}
```

- [ ] **Step 4: Add the `.font-data` utility**

Append to `app/globals.css`:

```css
.font-data {
  font-family: var(--font-mona-sans), var(--font-dm-sans), sans-serif;
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: success. (Visual application happens when data surfaces are built; here we only confirm the font loads without error.)

- [ ] **Step 6: Commit**

```bash
git add app/fonts app/layout.tsx app/globals.css
git commit -m "feat(brand): add Mona Sans local font for data surfaces"
```

---

## Task 5: Copy brand SVGs into `public/` and add favicon/app icons

**Files:**
- Create: `public/brand/kairoo-glyph.svg`, `public/brand/kairoo-glyph-dark.svg`, `app/icon.svg`, `app/apple-icon.svg`

- [ ] **Step 1: Copy the runtime SVGs from the committed backups**

Run:

```bash
mkdir -p public/brand
cp docs/brand/kairoo-glyph.svg public/brand/kairoo-glyph.svg
cp docs/brand/kairoo-glyph-dark.svg public/brand/kairoo-glyph-dark.svg
```

Verify: `ls public/brand/`.

- [ ] **Step 2: Create `app/icon.svg` (favicon — simplified, thick stroke)**

Create `app/icon.svg`:

```svg
<svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="92" height="92" rx="20" fill="#0B1F3A"/>
  <path d="M16.1016 71.2999C28.3682 68.2332 39.8682 59.0332 50.6016 43.6999C61.3349 28.3666 69.7682 19.9332 75.9016 18.3999" stroke="#F8FAFC" stroke-width="9.5" stroke-linecap="round"/>
  <path d="M32.0476 21C32.0476 39.55 30.9762 39.2 39 42" stroke="#F8FAFC" stroke-width="9.5" stroke-linecap="round"/>
  <circle cx="75.9016" cy="18.4" r="10.5" fill="#2DD4BF"/>
</svg>
```

- [ ] **Step 3: Create `app/apple-icon.svg`**

Create `app/apple-icon.svg` with identical content to `app/icon.svg` (Next.js serves it as the Apple touch icon; same artwork, rounded navy tile).

- [ ] **Step 4: Verify**

Run: `npm run build` then `npm run dev`. Open `http://localhost:1254` — the browser tab should show the navy Kairoo favicon. Open `http://localhost:1254/icon.svg` to confirm it serves.

- [ ] **Step 5: Commit**

```bash
git add public/brand app/icon.svg app/apple-icon.svg
git commit -m "feat(brand): add Kairoo favicon, app icon, and runtime glyph SVGs"
```

---

## Task 6: Build the reusable `Logo` component

**Files:**
- Create: `components/Logo.tsx`

- [ ] **Step 1: Create the component**

Create `components/Logo.tsx`:

```tsx
import Link from "next/link";

type LogoProps = {
  /** glyph height in px (wordmark scales relative to it) */
  size?: number;
  /** show the "Kairoo" wordmark next to the glyph */
  showWordmark?: boolean;
  /** href to wrap the logo in; omit to render unlinked */
  href?: string;
  className?: string;
};

/**
 * Kairoo logo — locked "B3" glyph (arc + curved stem + two teal dots).
 * Theme-aware via currentColor for the strokes; dots use the teal brand token.
 * Light: navy stroke + teal dots. Dark: white stroke + bright-teal dots.
 */
export default function Logo({
  size = 32,
  showWordmark = true,
  href = "/",
  className = "",
}: LogoProps) {
  const glyph = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 92 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-brand-ink"
      >
        <path
          d="M16.1016 71.2999C28.3682 68.2332 39.8682 59.0332 50.6016 43.6999C61.3349 28.3666 69.7682 19.9332 75.9016 18.3999"
          stroke="currentColor"
          strokeWidth="8.05"
          strokeLinecap="round"
        />
        <path
          d="M32.0476 21C32.0476 39.55 30.9762 39.2 39 42"
          stroke="currentColor"
          strokeWidth="8.05"
          strokeLinecap="round"
        />
        <circle cx="58" cy="51" r="5" className="fill-brand-primary" />
        <circle cx="75.9016" cy="18.4" r="9.2" className="fill-brand-primary" />
      </svg>
      {showWordmark && (
        <span
          className="font-bold tracking-tight text-brand-ink"
          style={{ fontSize: size * 0.72 }}
        >
          Kairoo
        </span>
      )}
      <span className="sr-only">Kairoo</span>
    </span>
  );

  return href ? (
    <Link href={href} aria-label="Kairoo home">
      {glyph}
    </Link>
  ) : (
    glyph
  );
}
```

- [ ] **Step 2: Add the `fill-brand-primary` helper (Tailwind v4 arbitrary fill)**

Tailwind v4 maps `fill-brand-primary` from the `--color-brand-primary` token added in Task 1, so no extra config is needed. Confirm by building.

Run: `npx tsc --noEmit && npm run build`
Expected: success, no type errors.

- [ ] **Step 3: Visually smoke-test the component**

Temporarily render `<Logo />` at the top of `app/page.tsx` (inside the first returned element), run `npm run dev`, confirm the glyph + "Kairoo" wordmark appear and recolor correctly in light/dark, then remove the temporary insertion.

- [ ] **Step 4: Commit**

```bash
git add components/Logo.tsx
git commit -m "feat(brand): add reusable Kairoo Logo component"
```

---

## Task 7: Use `Logo` in Navigation and Footer

**Files:**
- Modify: `components/Navigation.tsx:44`, `components/Footer.tsx:9` and `:76`

- [ ] **Step 1: Replace the Navigation brand text with `Logo`**

In `components/Navigation.tsx`, add at the top with the other imports:

```tsx
import Logo from "@/components/Logo";
```

Replace the element containing `AstraPath AI` (line ~44) — the existing brand link/text — with:

```tsx
<Logo size={32} href="/" />
```

(If the existing markup wraps the text in its own `<Link href="/">…AstraPath AI…</Link>`, replace that whole link with the single `<Logo>` above, since `Logo` renders its own link.)

- [ ] **Step 2: Replace the Footer wordmark with `Logo`**

In `components/Footer.tsx`, add the import:

```tsx
import Logo from "@/components/Logo";
```

Replace:

```tsx
<h3 className="text-2xl font-bold gradient-text mb-4">AstraPath AI</h3>
```

with:

```tsx
<div className="mb-4"><Logo size={28} href="/" /></div>
```

- [ ] **Step 3: Update the Footer copyright line**

Replace line ~76:

```tsx
<p>&copy; 2025 AstraPath AI. All rights reserved. Made with ❤️ for the future of work.</p>
```

with:

```tsx
<p>&copy; 2026 Kairoo. All rights reserved. Made with ❤️ for the future of work.</p>
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run build` (success), then `npm run dev` — nav and footer now show the Kairoo glyph + wordmark in both themes.

- [ ] **Step 5: Commit**

```bash
git add components/Navigation.tsx components/Footer.tsx
git commit -m "feat(brand): use Kairoo Logo in nav and footer"
```

---

## Task 8: Build the dismissible rebrand announcement banner

**Files:**
- Create: `components/RebrandBanner.tsx`
- Modify: `app/layout.tsx` (mount it)

- [ ] **Step 1: Create the banner component**

Create `components/RebrandBanner.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DISMISS_KEY = "kairoo-rebrand-banner-dismissed";

/**
 * Dismissible "AstraPath AI is now Kairoo" announcement.
 * Persists dismissal in localStorage so returning users aren't nagged.
 * Renders nothing until mounted (avoids hydration mismatch) and nothing once dismissed.
 */
export default function RebrandBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) !== "1") {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="relative z-50 bg-brand-navy text-brand-mist">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-sm">
        <span>
          <strong>AstraPath AI is now Kairoo.</strong> Same mission — the right moment to grow.
        </span>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount it at the top of the layout**

In `app/layout.tsx`, import it:

```tsx
import RebrandBanner from "@/components/RebrandBanner";
```

Inside `<Providers>`, render it as the first child (above `AnimatedBackground`):

```tsx
        <Providers>
          <RebrandBanner />
          <AnimatedBackground />
          <FloatingThemeToggle />
          <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
        </Providers>
```

- [ ] **Step 3: Verify behavior in the browser**

Run: `npm run dev`. Open `http://localhost:1254`.
Expected: navy banner reads "AstraPath AI is now Kairoo." Click the X → banner disappears. Reload the page → banner stays gone (localStorage). In devtools, run `localStorage.removeItem('kairoo-rebrand-banner-dismissed')` and reload → banner returns.

- [ ] **Step 4: Commit**

```bash
git add components/RebrandBanner.tsx app/layout.tsx
git commit -m "feat(brand): add dismissible AstraPath->Kairoo rebrand banner"
```

---

## Task 9: Rename metadata, package name, and theme storage key

**Files:**
- Modify: `app/layout.tsx:14-15`, `package.json:2`, `app/providers.tsx:12`

- [ ] **Step 1: Update site metadata**

In `app/layout.tsx`, replace the `metadata` object's title/description:

```tsx
export const metadata: Metadata = {
  title: "Kairoo — The right moment to grow",
  description:
    "Kairoo is AI career development that grows with you — coaching, learning paths, and team analytics for individuals, professionals, and enterprises.",
};
```

- [ ] **Step 2: Update `package.json` name**

In `package.json`, change `"name": "astrapath-ai",` to:

```json
  "name": "kairoo",
```

- [ ] **Step 3: Update the theme storage key**

In `app/providers.tsx`, change `storageKey="astrapath-theme"` to:

```tsx
      storageKey="kairoo-theme"
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run build` (success). `npm run dev` → browser tab title reads "Kairoo — The right moment to grow".

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx package.json app/providers.tsx
git commit -m "chore(brand): rename metadata, package name, theme storage key to Kairoo"
```

---

## Task 10: Replace remaining "AstraPath" copy across pages

**Files:**
- Modify: `app/page.tsx` (lines 70, 118, 328, 336, 347, 358, 597, 661), `app/business-strategy/page.tsx` (81, 217, 226-228), `app/investor-deck/page.tsx` (31, 86, 414, 416), `app/market-analysis/page.tsx` (32, 173), `app/technical-architecture/page.tsx` (194, 909, 931-932), `components/CompetitiveChart.tsx` (37)

> Mechanical copy rename. Do it per file, read the line in context, and replace the brand string. Use the mapping below. Do NOT blind-`sed` the whole repo (it would touch `docs/`, the spec, and this plan).

- [ ] **Step 1: Replace user-facing display strings**

Apply these replacements (string → string), in the listed files:
- `"AstraPath AI"` → `"Kairoo"`
- `"AstraPath's AI"` → `"Kairoo's AI"`
- `"AstraPath AI v2.0"` → `"Kairoo v2.0"` (`technical-architecture/page.tsx:194`)
- Infra identifiers in `technical-architecture/page.tsx`: `astrapath-api-hpa` → `kairoo-api-hpa`; `aws_eks_cluster "astrapath"` → `"kairoo"`; `name = "astrapath-cluster"` → `"kairoo-cluster"`
- `CompetitiveChart.tsx:37` dataset label `'AstraPath AI'` → `'Kairoo'`

- [ ] **Step 2: Update investor-deck contact emails/handles**

In `app/investor-deck/page.tsx`:
- `investors@astrapath.ai` → `investors@kairoo.com`
- `linkedin.com/company/astrapath-ai` → `linkedin.com/company/kairoo`

> Note: domain/handle are placeholders pending the §4.3 entity decision; flagged in the spec. Use `kairoo.com` as the working domain.

- [ ] **Step 3: Verify no stray references remain in app/components**

Run:

```bash
grep -rn "AstraPath\|astrapath\|Astra" app/ components/
```

Expected: **no matches**.

- [ ] **Step 4: Verify build + visual**

Run: `npx tsc --noEmit && npm run build` (success). `npm run dev` → spot-check home, business-strategy, investor-deck, market-analysis pages read "Kairoo".

- [ ] **Step 5: Commit**

```bash
git add app/ components/CompetitiveChart.tsx
git commit -m "chore(brand): replace AstraPath copy with Kairoo across pages"
```

---

## Task 11: Update repo docs (README, GEMINI.md)

**Files:**
- Modify: `README.md`, `GEMINI.md`

- [ ] **Step 1: Rename in README.md**

Replace the title and intro references to "AstraPath AI" with "Kairoo". Specifically the H1 `# AstraPath AI - Next.js Application` → `# Kairoo — Next.js Application`, and the body sentence referencing "AstraPath AI" → "Kairoo". Update the `cd "AstraPath AI"` example to `cd kairoo` only if the directory is renamed (leave as-is otherwise; note it's the display name change).

- [ ] **Step 2: Rename in GEMINI.md**

Replace "AstraPath AI" occurrences with "Kairoo".

- [ ] **Step 3: Verify**

Run: `grep -rn "AstraPath" README.md GEMINI.md`
Expected: no matches (or only intentional historical mentions, e.g. "formerly AstraPath AI" if you choose to keep one).

- [ ] **Step 4: Commit**

```bash
git add README.md GEMINI.md
git commit -m "docs(brand): rename AstraPath to Kairoo in README and GEMINI"
```

---

## Task 11.5: Replace generic `prose` AI-output styling with a branded `RichText` component

**Why:** The AI response in `FeatureModal` is rendered with the generic `@tailwindcss/typography` `prose prose-invert …` classes (off-brand, "Medium article" look). Replace it with a brand-styled markdown renderer. Also fixes a leftover old-brand gradient on the generate button.

**Files:**
- Create: `components/RichText.tsx`
- Modify: `components/FeatureModal.tsx:93` (button gradient) and `:105-110` (prose block)

- [ ] **Step 1: Create the branded markdown renderer**

Create `components/RichText.tsx`:

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Kairoo-branded markdown renderer. Replaces the generic Tailwind `prose`
 * classes with on-brand element styling that works in light AND dark.
 * Reuse anywhere we render markdown (AI output, legal pages).
 */
export default function RichText({ children }: { children: string }) {
  return (
    <div className="font-sans text-[15px] leading-relaxed text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p: ComponentPropsWithoutRef<"h1">) => (
            <h1 className="mt-6 mb-3 text-2xl font-extrabold tracking-tight text-brand-ink" {...p} />
          ),
          h2: (p: ComponentPropsWithoutRef<"h2">) => (
            <h2 className="mt-6 mb-3 text-xl font-bold tracking-tight text-brand-ink" {...p} />
          ),
          h3: (p: ComponentPropsWithoutRef<"h3">) => (
            <h3 className="mt-5 mb-2 text-lg font-bold text-brand-ink" {...p} />
          ),
          p: (p: ComponentPropsWithoutRef<"p">) => <p className="my-3" {...p} />,
          a: (p: ComponentPropsWithoutRef<"a">) => (
            <a className="text-brand-teal underline decoration-brand-teal/40 underline-offset-2 hover:decoration-brand-teal" {...p} />
          ),
          ul: (p: ComponentPropsWithoutRef<"ul">) => (
            <ul className="my-3 ml-5 list-disc marker:text-brand-teal" {...p} />
          ),
          ol: (p: ComponentPropsWithoutRef<"ol">) => (
            <ol className="my-3 ml-5 list-decimal marker:text-brand-teal" {...p} />
          ),
          li: (p: ComponentPropsWithoutRef<"li">) => <li className="my-1" {...p} />,
          blockquote: (p: ComponentPropsWithoutRef<"blockquote">) => (
            <blockquote className="my-4 border-l-2 border-brand-teal pl-4 italic text-muted-foreground" {...p} />
          ),
          strong: (p: ComponentPropsWithoutRef<"strong">) => (
            <strong className="font-semibold text-brand-ink" {...p} />
          ),
          code: (p: ComponentPropsWithoutRef<"code">) => (
            <code className="rounded bg-brand-teal/10 px-1.5 py-0.5 text-[0.9em] text-brand-teal" {...p} />
          ),
          pre: (p: ComponentPropsWithoutRef<"pre">) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-brand-navy p-4 text-brand-mist" {...p} />
          ),
          hr: (p: ComponentPropsWithoutRef<"hr">) => (
            <hr className="my-6 border-brand-teal/20" {...p} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 2: Use it in `FeatureModal` (replace the `prose` block)**

In `components/FeatureModal.tsx`, add the import:

```tsx
import RichText from "@/components/RichText";
```

Remove the now-unused `ReactMarkdown` and `remarkGfm` imports **only if** they are no longer referenced elsewhere in the file. Replace the result block (lines ~105–110):

```tsx
      {result && (
        <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-white/10 min-h-[150px]">
          <div className="prose prose-invert max-w-none prose-lg prose-p:my-4 prose-headings:my-6 prose-ul:my-4 prose-li:my-2 prose-blockquote:my-4 prose-strong:text-white">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
          </div>
        </div>
      )}
```

with:

```tsx
      {result && (
        <div className="mt-8 p-6 rounded-lg border border-brand-teal/15 bg-card/60 min-h-[150px]">
          <RichText>{result}</RichText>
        </div>
      )}
```

- [ ] **Step 3: Rebrand the leftover gradient button (line ~93)**

Replace `bg-linear-to-r from-[#7c79c6] to-[#00f5d4]` in the generate button's className with:

```
bg-linear-to-r from-brand-navy to-brand-teal
```

(Keep the rest of that className unchanged.)

- [ ] **Step 4: Verify**

Run: `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit && npm run build` → success.
Run: `grep -rn "prose\|7c79c6\|00f5d4" components/FeatureModal.tsx` → Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add components/RichText.tsx components/FeatureModal.tsx
git commit -m "feat(brand): replace generic prose with branded RichText renderer"
```

---

## Task 12: Final full-app verification

**Files:** none (verification only)

- [ ] **Step 1: Clean typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed with no errors.

- [ ] **Step 2: Repo-wide reference check (excluding history/docs)**

Run:

```bash
grep -rln "AstraPath\|astrapath" . | grep -vE "node_modules|package-lock|old-project|/.git/|.next/|docs/"
```

Expected: no matches outside `docs/` (the spec/plan intentionally reference the old name).

- [ ] **Step 3: Visual pass in dev**

Run: `npm run dev`. Walk through `/`, `/business-strategy`, `/investor-deck`, `/market-analysis`, `/technical-architecture` in both light and dark:
- Logo (glyph + wordmark) in nav + footer, recolors per theme.
- Brand gradient headings (navy/teal/amber), deep-navy dark background.
- Rebrand banner shows, dismisses, and stays dismissed.
- Favicon is the navy Kairoo tile.
- DM Sans is the body font throughout.

- [ ] **Step 4: Final commit (if any tweaks made during verification)**

```bash
git add -A
git commit -m "chore(brand): final Kairoo rebrand verification pass"
```

---

## Self-Review Notes (coverage vs spec)

- §2 Name + §2.6 banner → Tasks 8, 9, 10 (rename + banner). ✅
- §3.1 color tokens → Task 1; §3.2 themes / dark = navy → Tasks 1, 2. ✅
- §3.3 typography (DM Sans / Space Grotesk / Mona Sans / Satoshi standby) → Tasks 3, 4. (Satoshi intentionally not bundled — standby only, per spec.) ✅
- §3.4 glyph + favicon/app-icon/lockup → Tasks 5, 6, 7. ✅
- §3.6 tagline → used in metadata (Task 9) and banner (Task 8). ✅
- **Out of scope here (separate Plan B):** §4 legal pages, and observability/GA (owner-handled). Tier-accent UI usage (Free/Pro/Enterprise badges) lands when those surfaces/pricing are built — tokens are ready (Task 1).
