"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Grid, type GridProps } from "@/components/layout/Grid";

export interface StatCounterProps {
  /** Target value to count up to. */
  value: number;
  /** Descriptive label shown beneath the number. */
  label: string;
  /** Optional text rendered before the number (e.g. "$"). */
  prefix?: string;
  /** Optional text rendered after the number (e.g. "%", "+", "k"). */
  suffix?: string;
  /** Count-up duration in milliseconds. Defaults to 1800ms. */
  durationMs?: number;
  className?: string;
}

/**
 * Count the number of fractional digits in `value` so the animation
 * formats intermediate frames consistently with the final figure.
 */
function decimalsOf(value: number): number {
  if (Number.isInteger(value)) return 0;
  const str = String(value);
  const dot = str.indexOf(".");
  return dot === -1 ? 0 : str.length - dot - 1;
}

/**
 * StatCounter - an accessible, in-view animated number.
 *
 * On first scroll into view the figure counts from 0 to `value` using
 * anime.js v4. When the user prefers reduced motion the final value is
 * rendered immediately with no animation.
 */
export function StatCounter({
  value,
  label,
  prefix,
  suffix,
  durationMs = 1800,
  className,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();

  const decimals = decimalsOf(value);
  const [display, setDisplay] = useState(0);

  const formatter = useRef(
    new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  // Keep the formatter in sync if the decimal precision changes.
  useEffect(() => {
    formatter.current = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }, [decimals]);

  useEffect(() => {
    if (!inView) return;

    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    const state = { val: 0 };
    const animation = animate(state, {
      val: value,
      duration: durationMs,
      ease: "out(3)",
      onUpdate: () => setDisplay(state.val),
      onComplete: () => setDisplay(value),
    });

    return () => {
      animation.cancel();
    };
  }, [inView, prefersReducedMotion, value, durationMs]);

  const formatted = formatter.current.format(display);

  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)}>
      <span className="text-data tabular-nums text-foreground">
        {prefix}
        {/* aria-hidden so screen readers announce the final value once, not each frame */}
        <span aria-hidden>{formatted}</span>
        {suffix}
        <span className="sr-only">
          {prefix}
          {formatter.current.format(value)}
          {suffix}
        </span>
      </span>
      <span className="text-caption text-muted-foreground">{label}</span>
    </div>
  );
}

export interface StatGridProps extends Omit<GridProps, "children"> {
  /** Stat definitions rendered as individual StatCounters. */
  items: StatCounterProps[];
}

/**
 * StatGrid - lays out a set of StatCounters in a responsive Grid.
 * Defaults to a 4-up layout; pass `cols`/`gap` to override.
 */
export function StatGrid({ items, cols = 4, gap, className, ...props }: StatGridProps) {
  return (
    <Grid cols={cols} gap={gap} className={className} {...props}>
      {items.map((item, i) => (
        <StatCounter key={`${item.label}-${i}`} {...item} />
      ))}
    </Grid>
  );
}
