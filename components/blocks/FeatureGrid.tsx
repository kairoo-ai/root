"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";
import IconRenderer from "@/components/IconRenderer";
import type { Feature } from "@/types";

export interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Feature cells to render. Defaults to a small example set. */
  items?: Feature[];
  /** Number of columns at the medium+ breakpoint. */
  columns?: 2 | 3 | 4;
  /** Optional section heading rendered above the grid. */
  heading?: React.ReactNode;
  /** Optional supporting copy rendered beneath the heading. */
  description?: React.ReactNode;
}

/** Small, self-contained example so the block renders meaningfully with no props. */
const DEFAULT_ITEMS: Feature[] = [
  {
    id: "navigate",
    icon: "compass",
    title: "Chart the path",
    description: "Turn ambiguous goals into a clear, sequenced route from where you are to where you want to be.",
  },
  {
    id: "build",
    icon: "code",
    title: "Build with intent",
    description: "Ship work that compounds - every milestone is scoped, measurable, and tied to outcomes.",
  },
  {
    id: "grow",
    icon: "trending-up",
    title: "Track momentum",
    description: "See progress as it happens with signals that keep effort aligned to what actually moves the needle.",
  },
];

export function FeatureGrid({
  items = DEFAULT_ITEMS,
  columns = 3,
  heading,
  description,
  className,
  ...props
}: FeatureGridProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Reduced-motion safe: never animate transforms; render in final state.
  const animate = !reduceMotion;

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {(heading || description) && (
        <Stack gap={3} className="mb-12 max-w-2xl">
          {heading ? <h2 className="text-h2 text-foreground">{heading}</h2> : null}
          {description ? (
            <p className="text-body-lg text-muted-foreground">{description}</p>
          ) : null}
        </Stack>
      )}

      <Grid cols={columns} gap="lg">
        {items.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={animate ? { opacity: 0, y: 24 } : false}
            animate={animate ? (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }) : undefined}
            transition={
              animate
                ? { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }
                : undefined
            }
          >
            <Card className="h-full p-6">
              <Stack gap={4}>
                {feature.icon ? (
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-subtle text-accent"
                  >
                    <IconRenderer name={feature.icon} size={22} />
                  </span>
                ) : null}
                <Stack gap={2}>
                  <h3 className="text-h4 text-foreground">{feature.title}</h3>
                  <p className="text-body-sm text-muted-foreground">{feature.description}</p>
                </Stack>
              </Stack>
            </Card>
          </motion.div>
        ))}
      </Grid>
    </div>
  );
}

export default FeatureGrid;
