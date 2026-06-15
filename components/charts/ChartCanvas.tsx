"use client";

// Theme-aware wrapper around react-chartjs-2's base <Chart>.
//
// Responsibilities:
//  - Apply token-driven chrome (legend/tick/grid/tooltip colors) from getChartColors()
//    so every chart matches the active light/dark theme without per-chart wiring.
//  - Enforce responsive + maintainAspectRatio:false (charts size to their container).
//  - Disable Chart.js animation when the user prefers reduced motion.
//  - Recompute the palette on theme change (class/attribute flips on <html>) so charts
//    re-theme live when the user toggles dark mode.
//
// Caller options are deep-merged ON TOP of the theme defaults, so anything a chart
// sets explicitly always wins.

import { useEffect, useState } from "react";
import type {
  ChartType,
  ChartData,
  ChartOptions,
  DefaultDataPoint,
} from "chart.js";
import { merge } from "chart.js/helpers";
import { Chart } from "react-chartjs-2";
import { getChartColors, prefersReducedMotion } from "./chart-theme";

export interface ChartCanvasProps<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
> {
  type: TType;
  data: ChartData<TType, TData, TLabel>;
  /** Caller options - deep-merged over the theme defaults (caller wins). */
  options?: ChartOptions<TType>;
  /** Accessible text alternative rendered when the canvas can't be shown. */
  fallbackContent?: React.ReactNode;
  /** Wrapper height. Defaults to a 20rem (h-80) sizing box. */
  className?: string;
  /** Accessible label for the chart region. */
  ariaLabel?: string;
}

/** Theme-default options derived from design tokens, for a given chart type. */
function buildThemeDefaults<TType extends ChartType>(type: TType): ChartOptions<TType> {
  const c = getChartColors();
  const reduce = prefersReducedMotion();

  const axisCommon = {
    grid: { color: c.grid },
    ticks: { color: c.mutedText },
    title: { color: c.text },
    angleLines: { color: c.grid },
    pointLabels: { color: c.text },
  };

  const isRadial = type === "radar" || type === "polarArea";

  const defaults = {
    responsive: true,
    maintainAspectRatio: false,
    // Reduced motion: kill chart animations entirely.
    animation: reduce ? (false as const) : undefined,
    scales: isRadial
      ? {
        // Radar / polar charts use the radial `r` scale.
        r: { ...axisCommon },
      }
      : {
        x: { ...axisCommon },
        y: { ...axisCommon },
      },
    plugins: {
      legend: { labels: { color: c.text } },
      tooltip: {
        backgroundColor: c.tooltipBg,
        titleColor: c.tooltipText,
        bodyColor: c.tooltipText,
        borderColor: c.grid,
        borderWidth: 1,
      },
    },
  };

  return defaults as unknown as ChartOptions<TType>;
}

export default function ChartCanvas<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
>({
  type,
  data,
  options,
  fallbackContent,
  className = "relative h-80 w-full",
  ariaLabel,
}: ChartCanvasProps<TType, TData, TLabel>) {
  // Bump to force a palette recompute when the theme changes.
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    if (typeof MutationObserver === "undefined") return;
    const target = document.documentElement;
    const obs = new MutationObserver(() => setThemeTick((n) => n + 1));
    obs.observe(target, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    return () => obs.disconnect();
  }, []);

  // Merge theme defaults with caller options (caller wins). themeTick in deps
  // ensures CSS-var-derived colors are re-read after a theme flip.
  const merged = (() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    themeTick; // referenced so the memo recomputes on theme change
    const base = buildThemeDefaults<TType>(type);
    return merge({}, [base, options ?? {}]) as ChartOptions<TType>;
  })();

  return (
    <div className={className} role="img" aria-label={ariaLabel}>
      <Chart
        type={type}
        data={data}
        options={merged}
        fallbackContent={fallbackContent}
      />
    </div>
  );
}
