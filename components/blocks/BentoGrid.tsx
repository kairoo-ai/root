"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/layout/Section";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * A single highlight cell in the BentoGrid.
 * `span` controls how much of the asymmetric grid this cell occupies on
 * larger viewports; on small screens every cell collapses to a single column.
 */
export interface BentoItem {
  /** Stable key + visible heading. */
  title: string;
  /** Supporting copy shown beneath the title. */
  description: string;
  /** Optional leading visual (icon, glyph, or any node). */
  icon?: ReactNode;
  /** Footprint on the lg grid. Defaults to a 1x1 cell. */
  span?: "1x1" | "2x1" | "1x2" | "2x2";
  /** Optional id; falls back to `title` when omitted. */
  id?: string;
}

export interface BentoGridProps {
  /** Optional eyebrow shown above the heading. */
  eyebrow?: string;
  /** Optional section heading. */
  heading?: string;
  /** Optional section sub-copy. */
  description?: string;
  /** Highlight cells. */
  items?: BentoItem[];
  /** Render inside a <Section> wrapper (default) or bare grid. */
  asSection?: boolean;
  className?: string;
}

/** Map each span footprint to its lg col/row classes. */
const spanClass: Record<NonNullable<BentoItem["span"]>, string> = {
  "1x1": "lg:col-span-2 lg:row-span-1",
  "2x1": "lg:col-span-4 lg:row-span-1",
  "1x2": "lg:col-span-2 lg:row-span-2",
  "2x2": "lg:col-span-4 lg:row-span-2",
};

const DEFAULT_ITEMS: BentoItem[] = [
  {
    title: "Unified care timeline",
    description:
      "Every signal, note, and result on one chronological surface — no tab-hopping, no lost context.",
    span: "2x2",
  },
  {
    title: "Adaptive routing",
    description: "Work reaches the right hands automatically, the moment it's ready.",
    span: "2x1",
  },
  {
    title: "Audit by default",
    description: "Immutable history on every action, exportable in a click.",
  },
  {
    title: "Real-time presence",
    description: "See who's looking, editing, and acting — live.",
  },
  {
    title: "Composable workflows",
    description:
      "Assemble pathways from typed building blocks and ship changes without an engineering ticket.",
    span: "2x1",
  },
];

export function BentoGrid({
  eyebrow,
  heading,
  description,
  items = DEFAULT_ITEMS,
  asSection = true,
  className,
}: BentoGridProps) {
  const prefersReduced = useReducedMotion();

  const grid = (
    <div className={cn(!asSection && className)}>
      {(heading || description) && (
        <header className="mx-auto mb-10 max-w-2xl text-center">
          {heading && (
            <h2 className="text-h2 text-balance text-foreground">{heading}</h2>
          )}
          {description && (
            <p className="text-body-lg mt-4 text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </header>
      )}

      <div
        className={cn(
          "grid auto-rows-[minmax(11rem,1fr)] grid-cols-1 gap-4",
          "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {items.map((item, index) => {
          const span = spanClass[item.span ?? "1x1"];

          const content = (
            <Card
              variant="default"
              className={cn(
                "group/bento relative flex h-full flex-col gap-4 overflow-hidden p-6",
                "shadow-elevation-1 transition-shadow duration-300 ease-out",
                "hover:shadow-elevation-4 focus-within:shadow-elevation-4",
                "motion-safe:transition-[box-shadow,transform] motion-safe:hover:-translate-y-1",
              )}
            >
              {/* subtle accent wash that intensifies on hover */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 bg-accent-subtle opacity-0",
                  "transition-opacity duration-300 group-hover/bento:opacity-100",
                )}
              />

              <div className="relative flex h-full flex-col gap-3">
                {item.icon && (
                  <span
                    aria-hidden
                    className={cn(
                      "inline-flex size-11 shrink-0 items-center justify-center rounded-lg",
                      "bg-accent-subtle text-accent [&_svg]:size-5",
                    )}
                  >
                    {item.icon}
                  </span>
                )}

                <h3 className="text-h5 text-balance text-foreground">
                  {item.title}
                </h3>
                <p className="text-body-sm text-pretty text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Card>
          );

          if (prefersReduced) {
            return (
              <div key={item.id ?? item.title} className={cn(span)}>
                {content}
              </div>
            );
          }

          return (
            <motion.div
              key={item.id ?? item.title}
              className={cn(span)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: Math.min(index * 0.06, 0.3),
              }}
            >
              {content}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  if (!asSection) return grid;

  return <Section className={className}>{grid}</Section>;
}

export default BentoGrid;
