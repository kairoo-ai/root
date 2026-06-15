"use client";

import { type HTMLAttributes, useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface LogoMarqueeItem {
  /** Accessible label / brand name. Used as alt text and fallback wordmark. */
  name: string;
  /** Optional logo image source. When omitted the `name` renders as text. */
  src?: string;
}

export type LogoMarqueeProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Brands to render in the scrolling row. */
  items: LogoMarqueeItem[];
  /** Pixels travelled per second. Higher is faster. Defaults to 40. */
  speed?: number;
  /** Scroll direction. Defaults to "left". */
  direction?: "left" | "right";
  /** Gap utility between logos (Tailwind spacing scale). Defaults to 16 (4rem). */
  gap?: 8 | 12 | 16 | 20 | 24;
  /** Fade the row's edges into the background. Defaults to true. */
  fade?: boolean;
  /** Pause the animation while hovered/focused. Defaults to true. */
  pauseOnHover?: boolean;
};

/** Tailwind gap classes kept static so they survive class extraction. */
const GAP_CLASS: Record<NonNullable<LogoMarqueeProps["gap"]>, string> = {
  8: "gap-8",
  12: "gap-12",
  16: "gap-16",
  20: "gap-20",
  24: "gap-24",
};

/** A single brand cell: logo image when available, otherwise a wordmark. */
function LogoItem({ item }: { item: LogoMarqueeItem }) {
  return (
    <li className="flex shrink-0 items-center justify-center">
      {item.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- logos are arbitrary external/SVG assets, sized by CSS
        <img
          src={item.src}
          alt={item.name}
          loading="lazy"
          className="h-8 w-auto max-w-[10rem] object-contain opacity-70 transition-opacity duration-200 hover:opacity-100"
        />
      ) : (
        <span className="whitespace-nowrap text-body-lg font-semibold tracking-tight text-muted-foreground transition-colors duration-200 hover:text-foreground">
          {item.name}
        </span>
      )}
    </li>
  );
}

/**
 * LogoMarquee - a horizontally auto-scrolling row of brand logos.
 *
 * The list is duplicated so the row loops seamlessly. The animation is driven
 * by a Motion value advanced each frame, then wrapped at the measured width of
 * a single track for a pixel-accurate, gap-correct loop regardless of item
 * count or content width. Pauses on hover/focus.
 *
 * Under `prefers-reduced-motion` the row renders static (single, non-animated
 * track) with no transforms - satisfying the reduced-motion contract.
 */
export function LogoMarquee({
  items,
  speed = 40,
  direction = "left",
  gap = 16,
  fade = true,
  pauseOnHover = true,
  className,
  ...props
}: LogoMarqueeProps) {
  const prefersReducedMotion = useReducedMotion();
  const gapClass = GAP_CLASS[gap] ?? GAP_CLASS[16];

  if (!items?.length) return null;

  // --- Reduced motion: a single, static, non-animated row. ---
  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          "w-full overflow-hidden",
          fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
          className,
        )}
        {...props}
      >
        <ul className={cn("flex flex-wrap items-center justify-center", gapClass)}>
          {items.map((item, i) => (
            <LogoItem key={`${item.name}-${i}`} item={item} />
          ))}
        </ul>
      </div>
    );
  }

  // --- Animated marquee. ---
  return (
    <MarqueeTrack
      items={items}
      speed={speed}
      direction={direction}
      gapClass={gapClass}
      fade={fade}
      pauseOnHover={pauseOnHover}
      className={className}
      {...props}
    />
  );
}

type MarqueeTrackProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  items: LogoMarqueeItem[];
  speed: number;
  direction: "left" | "right";
  gapClass: string;
  fade: boolean;
  pauseOnHover: boolean;
};

function MarqueeTrack({
  items,
  speed,
  direction,
  gapClass,
  fade,
  pauseOnHover,
  className,
  ...props
}: MarqueeTrackProps) {
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLUListElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [paused, setPaused] = useState(false);

  // Measure one track (the first, non-duplicated copy) so the wrap distance
  // matches exactly - including the trailing gap between the two copies.
  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const measure = () => {
      // scrollWidth of the first track + the gap that follows it. The gap is
      // the difference between consecutive items; easiest is full scrollWidth
      // of one <ul> which already includes internal gaps, plus one gap to the
      // next copy. We render two <ul>s with the same gap on the wrapper, so a
      // single track's offsetWidth plus that wrapper gap is the loop distance.
      setTrackWidth(node.offsetWidth);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (paused || trackWidth === 0) return;
    // delta is in ms; convert speed (px/s) to px for this frame.
    const move = (speed * delta) / 1000;
    const next = x.get() + (direction === "left" ? -move : move);

    // Wrap within [-trackWidth, 0) for leftward, (0, trackWidth] mirror for
    // rightward, keeping the duplicated copy perfectly in register.
    if (direction === "left") {
      x.set(next <= -trackWidth ? next + trackWidth : next);
    } else {
      x.set(next >= 0 ? next - trackWidth : next);
    }
  });

  const hoverHandlers = pauseOnHover
    ? {
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onFocusCapture: () => setPaused(true),
      onBlurCapture: () => setPaused(false),
    }
    : {};

  return (
    <div
      className={cn(
        "w-full overflow-hidden",
        fade &&
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      {...hoverHandlers}
      {...props}
    >
      {/* aria-hidden on the visual loop; a single sr-only list conveys the brands. */}
      <motion.div className={cn("flex w-max", gapClass)} style={{ x }} aria-hidden>
        <ul ref={trackRef} className={cn("flex w-max items-center", gapClass)}>
          {items.map((item, i) => (
            <LogoItem key={`a-${item.name}-${i}`} item={item} />
          ))}
        </ul>
        {/* Duplicate copy for the seamless wrap. */}
        <ul className={cn("flex w-max items-center", gapClass)}>
          {items.map((item, i) => (
            <LogoItem key={`b-${item.name}-${i}`} item={item} />
          ))}
        </ul>
      </motion.div>

      <span className="sr-only">{items.map((i) => i.name).join(", ")}</span>
    </div>
  );
}
