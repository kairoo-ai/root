// Token-driven, theme-aware palette for Chart.js.
//
// Two sources of truth:
//  1. Brand SERIES colors come from the JS OKLCH ramps (lib/design/tokens/colors)
//     so a chart's data lines/points always match the design system. Chart.js v4
//     accepts oklch() strings (incl. an alpha channel: `oklch(L C H / a)`).
//  2. CHROME colors (text, grid, tooltip surface) are read live from the CSS custom
//     properties on :root at call time, so charts adapt to light/dark automatically.
//
// SSR-safe: getComputedStyle is only touched in the browser; every reader has a
// token-derived fallback so the module never emits a raw hex/rgb value.

import { ramps } from "@/lib/design/tokens/colors";

/** Append an alpha channel to an oklch() string: oklch(L C H) -> oklch(L C H / a). */
const withAlpha = (oklch: string, alpha: number): string =>
  oklch.replace(/\)\s*$/, ` / ${alpha})`);

/**
 * Read a CSS custom property off the document root and wrap it as oklch().
 * Our generated tokens store the *components* (e.g. "0.27 0.035 255"), so we
 * reconstruct the full color function. Falls back to a token ramp value during
 * SSR or if the variable is missing/empty.
 */
const readVar = (name: string, fallback: string): string => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return fallback;
  }
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) return fallback;
  // Already a full color function (oklch(...), etc.) — use as-is.
  if (raw.includes("(")) return raw;
  // Bare components from our token pipeline — wrap into oklch().
  return `oklch(${raw})`;
};

export interface ChartColors {
  /** Ordered brand series colors (solid, for borders/points). */
  series: string[];
  /** Translucent fill variants, index-aligned with `series`. */
  seriesFill: string[];
  /** Primary axis/label/legend text color (theme-adaptive). */
  text: string;
  /** Secondary text (tick labels) color (theme-adaptive). */
  mutedText: string;
  /** Grid + angle line color (theme-adaptive, low-emphasis). */
  grid: string;
  /** Tooltip background surface (theme-adaptive). */
  tooltipBg: string;
  /** Tooltip text color (theme-adaptive). */
  tooltipText: string;
}

/**
 * Build the active chart palette. Call this inside the component (client side)
 * so the CSS-var reads reflect the currently-applied theme.
 */
export function getChartColors(): ChartColors {
  // Brand series — straight from the OKLCH ramps (design-system source of truth).
  const series = [
    ramps.teal[500],
    ramps.navy[600],
    ramps.amber[500],
    ramps.info[500],
    ramps.success[500],
    ramps.gold[500],
  ];
  const seriesFill = series.map((c) => withAlpha(c, 0.18));

  // Chrome — read from theme tokens at call time, with ramp-based fallbacks.
  const text = readVar("--foreground", ramps.navy[900]);
  const mutedText = readVar("--muted-foreground", ramps.neutral[500]);
  const card = readVar("--card", ramps.neutral[50]);
  // Grid lines = the border token, softened so they recede behind the data.
  const grid = withAlpha(readVar("--border", ramps.neutral[200]), 0.45);

  return {
    series,
    seriesFill,
    text,
    mutedText,
    grid,
    tooltipBg: card,
    tooltipText: text,
  };
}

/** True when the user has requested reduced motion (SSR-safe). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
