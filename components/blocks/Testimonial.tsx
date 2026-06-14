"use client";

import { type HTMLAttributes } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Grid, type GridProps } from "@/components/layout/Grid";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import type { Testimonial as TestimonialType } from "@/types";

/** Derive up to two uppercase initials from a person's name. */
function initialsFromName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export type TestimonialProps = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
  /** The testimonial content (quote, name, role, optional company). */
  testimonial: TestimonialType;
  /** Optional avatar image; falls back to derived initials. */
  avatarSrc?: string;
  /** Card surface variant. */
  variant?: "default" | "glass" | "elevated";
  /** Stagger delay (seconds) when used inside an animated grid. */
  index?: number;
  /** Disable the entrance reveal (e.g. when a parent orchestrates motion). */
  animate?: boolean;
};

/**
 * A single quote card: testimonial text, attribution avatar, name, role and
 * optional company. Motion reveal is reduced-motion safe.
 */
export function Testimonial({
  testimonial,
  avatarSrc,
  variant = "default",
  index = 0,
  animate = true,
  className,
  ...props
}: TestimonialProps) {
  const prefersReducedMotion = useReducedMotion();
  const { quote, name, role, company } = testimonial;

  const reveal =
    animate && !prefersReducedMotion
      ? {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 } as const,
          transition: { duration: 0.5, delay: Math.min(index, 8) * 0.08 },
        }
      : {};

  return (
    // `props` is typed for a DOM <div>; motion.div redefines a few animation
    // event handlers (e.g. onAnimationStart), so we forward as motion props.
    <motion.div
      {...reveal}
      className={cn("h-full", className)}
      {...(props as HTMLMotionProps<"div">)}
    >
      <Card
        variant={variant}
        className="flex h-full flex-col gap-6 p-6 sm:p-8"
      >
        <blockquote className="text-body-lg text-foreground">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <figcaption className="mt-auto flex items-center gap-3">
          <Avatar
            src={avatarSrc}
            alt={avatarSrc ? name : undefined}
            initials={initialsFromName(name)}
          />
          <span className="flex flex-col">
            <span className="font-semibold text-foreground">{name}</span>
            <span className="text-body-sm text-muted-foreground">
              {role}
              {company ? (
                <>
                  {" "}
                  &middot; {company}
                </>
              ) : null}
            </span>
          </span>
        </figcaption>
      </Card>
    </motion.div>
  );
}

export type TestimonialGridProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  /** Testimonials to render. */
  items: TestimonialType[];
  /** Optional small label above the heading. */
  eyebrow?: string;
  /** Optional section heading. */
  heading?: string;
  /** Optional supporting copy under the heading. */
  description?: string;
  /** Map of testimonial id -> avatar image URL. */
  avatars?: Record<string, string>;
  /** Card surface variant applied to every item. */
  variant?: TestimonialProps["variant"];
  /** Number of columns at the lg breakpoint. */
  cols?: GridProps["cols"];
  /** Gap between cards. */
  gap?: GridProps["gap"];
  /** Wrap the grid in a <Section> (default true). Set false to embed bare. */
  withSection?: boolean;
};

/**
 * Responsive grid of {@link Testimonial} cards with an optional header.
 * Fully data-driven: pass `items` (typed `Testimonial[]`) and, optionally,
 * heading copy and a map of avatar images keyed by testimonial id.
 */
export function TestimonialGrid({
  items,
  eyebrow,
  heading,
  description,
  avatars,
  variant = "default",
  cols = 3,
  gap = "lg",
  withSection = true,
  className,
  ...props
}: TestimonialGridProps) {
  const prefersReducedMotion = useReducedMotion();

  const header =
    eyebrow || heading || description ? (
      <Stack gap={3} className="mb-12 max-w-2xl">
        {eyebrow ? (
          <motion.span
            className="text-overline text-accent"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 12 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.6 },
                  transition: { duration: 0.4 },
                })}
          >
            {eyebrow}
          </motion.span>
        ) : null}
        {heading ? (
          <motion.h2
            className="text-h2 text-foreground"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.6 },
                  transition: { duration: 0.45, delay: 0.05 },
                })}
          >
            {heading}
          </motion.h2>
        ) : null}
        {description ? (
          <motion.p
            className="text-body text-muted-foreground"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.6 },
                  transition: { duration: 0.45, delay: 0.1 },
                })}
          >
            {description}
          </motion.p>
        ) : null}
      </Stack>
    ) : null;

  const grid = (
    <Grid cols={cols} gap={gap}>
      {items.map((item, i) => (
        <Testimonial
          key={item.id}
          testimonial={item}
          avatarSrc={avatars?.[item.id]}
          variant={variant}
          index={i}
        />
      ))}
    </Grid>
  );

  if (!withSection) {
    return (
      <div className={className} {...props}>
        {header}
        {grid}
      </div>
    );
  }

  return (
    <Section className={className} {...props}>
      {header}
      {grid}
    </Section>
  );
}
