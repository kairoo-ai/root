# Aceternity UI Full Integration - Design Spec

**Date:** 2026-06-15  
**Status:** Approved  
**Scope:** All 26 listed components + 6 bonus, integrated across marketing site, app shell, auth, and onboarding in one push.

---

## Overview

Install and integrate 32 Aceternity UI components (copy-paste model) throughout the entire Kairoo/AstraPath AI product - marketing site, authenticated app, auth pages, and onboarding wizard. Every component is fine-tuned to the OKLCH design token system. Zero new npm dependencies required beyond what already exists (framer-motion v12 is already installed).

---

## Component Library Architecture

All components live in `components/aceternity/` and are re-exported from `components/aceternity/index.ts`.

### Files to create

```
components/aceternity/
  ├── GooeyInput.tsx
  ├── CanvasText.tsx
  ├── NoiseBackground.tsx
  ├── TextHoverEffect.tsx
  ├── AppleCardsCarousel.tsx
  ├── BackgroundRipple.tsx
  ├── CardSpotlight.tsx          ← already exists, keep as-is
  ├── Cover.tsx
  ├── DraggableCard.tsx
  ├── ShimmerLoader.tsx
  ├── SVGLoader.tsx
  ├── SimpleLoader.tsx
  ├── StatefulButton.tsx
  ├── NavbarWithChildren.tsx
  ├── StickyBanner.tsx
  ├── GeminiEffect.tsx
  ├── Marquee3D.tsx
  ├── TracingBeam.tsx
  ├── BentoGridAceternity.tsx
  ├── GlowingEffect.tsx
  ├── GridDotBackground.tsx
  ├── Sidebar.tsx
  ├── SpotlightNew.tsx
  ├── FollowingPointer.tsx
  ├── TailwindButtons.tsx
  ├── Timeline.tsx
  ├── LampEffect.tsx             ← bonus
  ├── InfiniteMovingCards.tsx    ← bonus
  ├── AnimatedTooltip.tsx        ← bonus
  ├── TypewriterEffect.tsx       ← bonus
  ├── FloatingNavbar.tsx         ← bonus
  ├── BackgroundBoxes.tsx        ← bonus
  └── index.ts
```

### Token bridge

Add to `app/globals.css` (`:root` block, 4 lines only):

```css
--aceternity-glow: var(--primary);
--aceternity-beam: var(--accent);
--aceternity-noise-opacity: 0.035;
--aceternity-spotlight-color: color-mix(
  in oklch,
  var(--primary) 15%,
  transparent
);
```

All other Aceternity CSS variable references (`--background`, `--foreground`, `--primary`, `--border`, `--card`) already exist in the design token system - no further aliases needed.

---

## Marketing Site Placements

### Home (app/(marketing)/page.tsx + HomeSections.tsx)

- **GeminiEffect** - full-bleed hero section background, replaces AnimatedBackground
- **SpotlightNew** - focused on hero headline H1
- **CanvasText** - renders the large hero display text
- **StickyBanner** - replaces `<RebrandBanner>` component
- **3D Marquee** - partner/social proof logo strip section
- **Cover** - wraps hero card/panel overlay
- **GridDotBackground** - second section (below fold) background fill
- **FloatingNavbar** - scroll-aware variant of PublicNav (bonus)

### Features page (app/(marketing)/features/)

- **BentoGridAceternity** - replaces existing BentoGrid block for feature overview
- **GlowingEffect** - animated glow border on each bento card
- **CardSpotlight** - feature highlight cards (already wired, expand usage)
- **FollowingPointer** - wraps feature card hover zones
- **TextHoverEffect** - applied to feature section headings
- **NoiseBackground** - dark feature section background texture

### How It Works page (app/(marketing)/how-it-works/)

- **TracingBeam** - wraps the entire page scroll container
- **AppleCardsCarousel** - step showcase (replaces current grid)
- **Timeline** - numbered step sequence
- **BackgroundRipple** - CTA section background

### Pricing page (app/(marketing)/pricing/)

- **LampEffect** - pricing hero dramatic overhead lighting (bonus)
- **GlowingEffect** - Pro and Enterprise card borders
- **BackgroundRipple** - beneath pricing hero heading
- **SpotlightNew** - on the recommended plan card
- **TailwindButtons** - all pricing CTA buttons

### About page (app/(marketing)/about/)

- **Timeline** - company milestones / founding story
- **CardSpotlight** - team/stat highlight cards
- **AnimatedTooltip** - team member hover cards (bonus)

### Customers page (app/(marketing)/customers/)

- **AppleCardsCarousel** - customer story showcase
- **InfiniteMovingCards** - customer testimonials ticker (bonus)
- **3D Marquee** - customer logo wall

### Global Marketing Nav

- **NavbarWithChildren** - replaces PublicNav shell (customized to Kairoo radii/colors/glass)
- **TextHoverEffect** - nav link items hover animation
- **TailwindButtons** - nav CTA buttons (Log in, Get started free)

---

## App Shell Placements

### Navigation (components/shells/AppShell.tsx + new sidebar)

- **Sidebar** - replaces current app sidebar navigation, themed to sidebar-\* CSS tokens
- **NavbarWithChildren** - top app bar with breadcrumbs + UserButton slot
- **SVGLoader** - applied to Kairoo Logo SVG for global page transition loading state

### Dashboard (app/(app)/dashboard/)

- **DraggableCard** - wraps dashboard widget cards for reorder UX
- **ShimmerLoader** - skeleton state on StatsGrid and ActivityFeed cards
- **GlowingEffect** - key metric card borders (usage, credits, streaks)
- **StatefulButton** - all async action buttons (QuickLaunch items)
- **GridDotBackground** - subtle behind WelcomeBanner section

### Tools / AI Input (app/(app)/tools/)

- **GooeyInput** - AI prompt search bar (main input)
- **StatefulButton** - submit/generate action button
- **SimpleLoader** - inline AI response streaming indicator
- **ShimmerLoader** - result card skeleton states

### Roadmaps page (app/(app)/roadmaps/)

- **TracingBeam** - wraps roadmap timeline scroll
- **Timeline** - roadmap milestone sequence
- **CardSpotlight** - roadmap phase cards

### Progress page (app/(app)/progress/)

- **ShimmerLoader** - loading skeleton
- **GlowingEffect** - milestone achieved card glow
- **StatefulButton** - mark-complete buttons

### System-wide App (all app pages)

- **TailwindButtons** - unified button system replacing current Button variants
- **ShimmerLoader** - replaces all `<Skeleton>` usages app-wide
- **StatefulButton** - every async form submit button
- **SimpleLoader** - replaces `<Spinner>` component
- **AnimatedTooltip** - replaces `<Tooltip>` in app UI (bonus)

---

## Auth + Onboarding Placements

### Auth pages (app/(auth)/sign-in, sign-up)

- **SpotlightNew** - behind sign-in/sign-up Clerk form panels
- **BackgroundRipple** - ambient page background
- **ShimmerLoader** - Clerk form loading state overlay

### Onboarding Wizard (app/onboarding/)

- **TypewriterEffect** - step heading text animation (bonus)
- **Timeline** - step progress indicator sidebar
- **StatefulButton** - Continue/Next step buttons
- **GooeyInput** - free-text input steps (goals, bio, etc.)

### Investors page (app/investors/)

- **BackgroundBoxes** - hero section dramatic background (bonus)
- **TracingBeam** - long-form content scroll wrapper
- **GlowingEffect** - metric/traction stat cards

---

## Implementation Rules

1. **All components strictly typed** - no `any`, full prop interfaces
2. **Theme-aware by default** - use CSS custom properties (`var(--primary)` etc.), never hardcoded colors
3. **Reduced motion safe** - wrap animations in `useReducedMotion()` from framer-motion
4. **`'use client'` only where needed** - server components stay server components; Aceternity wrappers are client islands
5. **Existing content preserved** - no marketing page copy deleted; only layout/visual wrappers changed
6. **CLAUDE.md no-slop rule** - no eyebrow badges, no generic overline labels added alongside these components

---

## Out of Scope

- Changing copy, data, or business logic
- Modifying Clerk auth configuration
- Database or API route changes
- The `/style` catalog page (update separately if desired)
