# CLAUDE.md

Guidelines and commands for the Kairoo project.

## Project Overview

- **Project Name:** Kairoo (formerly AstraPath AI)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, Framer Motion
- **Chart Wrapper:** `ChartCanvas` (theme-aware wrapper for Chart.js)

## Critical Design & UI/UX Rules

- **Never create AI-SLOP designs/UI/UX**: Always build clean, premium, and meaningful interfaces. Avoid generic/placeholder styles, plain primary colors, or over-cluttered dashboard layouts.
- **No Unnecessary Overline Labels**: Remove and avoid all generic or redundant overline labels and badges (e.g., `<p className="text-overline text-primary">Plans</p>`) above section headings throughout the application.

## Common Development Commands

- **Run Dev Server:** `npm run dev` (starts on port 1254)
- **Create Production Build:** `npm run build`
- **Start Production Server:** `npm run start`
- **Kill Dev Server Port:** `npm run kill`
- **TypeScript Verification:** `npx tsc --noEmit`

## Code Style & Implementation Guidelines

- **Component Organization:** Store reusable components under `components/` and page-specific subcomponents in their respective page route folders.
- **Strict Typing:** Always annotate types, props, and function signatures. Avoid using `any`.
- **CSS Transitions:** Ensure dismissible items or banners (like `RebrandBanner`) transition in/out smoothly and soothingly. Keep components mounted and hide using class transitions rather than unmounting instantly when animating.
