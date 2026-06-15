"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";
import { Stack } from "@/components/layout/Stack";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { StatCounter } from "@/components/blocks/StatCounter";
import IconRenderer from "@/components/IconRenderer";

/**
 * A single career tool, projected from the AI feature registry. Kept to the
 * minimal display shape so this component never depends on prompt-builder
 * internals - only what the catalog card needs to render. `theme` is a
 * coarse grouping derived server-side, used purely for the filter Tabs.
 */
export interface CareerToolCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  ready: boolean;
  theme: string;
}

export interface ThemeTab {
  /** Stable key used by the Tabs control. */
  id: string;
  /** Human label. */
  label: string;
  /** How many tools fall under this theme (`all` = total). */
  count: number;
}

export interface CareerToolGridProps {
  tools: CareerToolCard[];
  themes: ThemeTab[];
  eyebrow?: string;
  heading: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Token-only, reduced-motion-safe catalog with theme filter Tabs, animated
 * counts, CardSpotlight cursor-glow per tool, and a staggered scroll reveal.
 * When the user prefers reduced motion the grid renders in its final state.
 */
export function CareerToolGrid({
  tools,
  themes,
  eyebrow,
  heading,
}: CareerToolGridProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const animate = !reduceMotion;

  const [activeTheme, setActiveTheme] = useState<string>("all");

  const visible = useMemo(
    () =>
      activeTheme === "all"
        ? tools
        : tools.filter((t) => t.theme === activeTheme),
    [tools, activeTheme],
  );

  return (
    <div ref={ref}>
      <header className="mx-auto mb-8 max-w-2xl text-center">
        <h2 className="text-h2 text-balance text-foreground">{heading}</h2>
        <p className="mt-3 text-body-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {visible.length}
          </span>{" "}
          of {tools.length} tools
        </p>
      </header>

      {/* Theme filter - HeroUI v3 Tabs, token-themed. */}
      <div className="mb-10 flex justify-center">
        <Tabs
          aria-label="Filter career tools by theme"
          selectedKey={activeTheme}
          onSelectionChange={(key) => setActiveTheme(String(key))}
        >
          <Tabs.List aria-label="Tool themes" className="flex-wrap">
            {themes.map((t) => (
              <Tabs.Tab key={t.id} id={t.id}>
                <span className="inline-flex items-center gap-2">
                  {t.label}
                  <span className="rounded-full bg-accent-subtle px-1.5 py-0.5 text-[0.625rem] font-bold tabular-nums text-accent">
                    {t.count}
                  </span>
                </span>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((tool, index) => (
          <motion.div
            key={tool.id}
            layout={animate ? true : undefined}
            initial={animate ? { opacity: 0, y: 24 } : false}
            animate={
              animate
                ? inView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 24 }
                : undefined
            }
            transition={
              animate
                ? {
                  duration: 0.45,
                  ease: EASE,
                  delay: Math.min(index * 0.035, 0.4),
                }
                : undefined
            }
            whileHover={animate ? { y: -4 } : undefined}
          >
            <CardSpotlight
              className={cn(
                "group/tool h-full rounded-2xl p-6",
                "transition-shadow duration-300 hover:shadow-elevation-3",
              )}
            >
              <Stack gap={4} className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-xl",
                      "bg-accent-subtle text-accent",
                      "transition-transform duration-300 group-hover/tool:scale-110",
                    )}
                  >
                    <IconRenderer name={tool.icon} size={22} />
                  </span>
                  {tool.ready ? (
                    <Tooltip delay={0}>
                      <span className="inline-flex">
                        <Badge variant="success" size="sm" className="gap-1">
                          <span className="inline-flex size-1.5 rounded-full bg-success" />
                          Ready
                        </Badge>
                      </span>
                      <Tooltip.Content showArrow placement="top">
                        Available to use today
                      </Tooltip.Content>
                    </Tooltip>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Coming soon
                    </Badge>
                  )}
                </div>
                <Stack gap={2}>
                  <h3 className="text-h4 text-foreground">{tool.name}</h3>
                  <p className="text-body-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </Stack>
              </Stack>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * StatBand - a compact animated metric row reused below the catalog. Each
 * figure counts up on scroll into view via StatCounter (anime.js).
 */
export function CareerStatBand({
  items,
}: {
  items: { value: number; label: string; suffix?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((s) => (
        <div
          key={s.label}
          className={cn(
            "rounded-2xl border border-border/60 bg-card/70 p-6 text-center",
            "backdrop-blur-[var(--blur-glass)]",
          )}
        >
          <StatCounter
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            className="items-center text-center"
          />
        </div>
      ))}
    </div>
  );
}

export default CareerToolGrid;
