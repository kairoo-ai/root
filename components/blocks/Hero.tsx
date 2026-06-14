"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { PageHeader, type PageHeaderProps } from "@/components/layout/PageHeader";

type HeroCta = {
  label: string;
  href: string;
};

export type HeroProps = {
  /** Small label rendered above the title. */
  eyebrow?: ReactNode;
  /** Main headline. */
  title: ReactNode;
  /** Supporting copy below the headline. */
  subtitle?: ReactNode;
  /** Primary action — rendered as a filled (primary) link button. */
  primaryCta?: HeroCta;
  /** Secondary action — rendered as an outline link button. */
  secondaryCta?: HeroCta;
  /** Content alignment. */
  align?: "center" | "left";
  /** Extra classes for the outer Section. */
  className?: string;
};

/**
 * Shared CTA link styling. Mirrors the Button primitive's token classes so a
 * link (`<a href>`) reads as a button while staying token-only and accessible.
 * Button itself renders a `<button>` and has no `asChild`, so we replicate
 * here rather than nesting interactive elements.
 */
const ctaBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const ctaPrimary = "bg-primary text-primary-foreground hover:bg-teal-700";

const ctaOutline = "border border-border bg-transparent text-foreground hover:bg-accent-subtle";

// Reveal tokens — single source for the staggered entrance.
const EASE = [0.22, 1, 0.36, 1] as const;
const hidden = { opacity: 0, y: 24 };
const shown = { opacity: 1, y: 0 };

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  align = "center",
  className,
}: HeroProps) {
  const reduceMotion = useReducedMotion();
  const isCenter = align === "center";
  const hasCtas = Boolean(primaryCta || secondaryCta);

  // PageHeaderProps intersects HTMLAttributes (global `title?: string`) with
  // `title: ReactNode`, which TS collapses to `string & ReactNode`. We accept a
  // full ReactNode title, so build the props once and narrow only `title` here.
  const headerProps: PageHeaderProps = {
    eyebrow,
    subtitle,
    title: title as PageHeaderProps["title"],
    className: cn(isCenter && "items-center [&_p]:mx-auto [&_p]:max-w-2xl"),
  };

  // When reduced motion is requested, render statically (no transforms).
  const reveal = (index: number) =>
    reduceMotion
      ? {}
      : {
          initial: hidden,
          whileInView: shown,
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.6, ease: EASE, delay: index * 0.08 },
        };

  return (
    <Section
      className={cn("relative isolate overflow-hidden", className)}
    >
      {/* Token-driven aurora backdrop. Uses CSS vars + color-mix only — no raw color values. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(60% 60% at 18% 0%, color-mix(in oklab, var(--primary) 14%, transparent) 0%, transparent 60%)",
            "radial-gradient(50% 50% at 85% 10%, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 55%)",
            "radial-gradient(70% 70% at 50% 120%, color-mix(in oklab, var(--primary) 10%, transparent) 0%, transparent 60%)",
          ].join(", "),
        }}
      />
      {/* Soft fade so the backdrop dissolves into the page background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />

      <Stack
        gap={8}
        align={isCenter ? "center" : "start"}
        className={cn(
          "py-8 sm:py-12",
          isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left",
        )}
      >
        <motion.div {...reveal(0)} className="w-full">
          <PageHeader {...headerProps} />
        </motion.div>

        {hasCtas ? (
          <motion.div
            {...reveal(1)}
            className={cn(
              "flex flex-col gap-3 sm:flex-row sm:items-center",
              isCenter && "sm:justify-center",
            )}
          >
            {primaryCta ? (
              <a href={primaryCta.href} className={cn(ctaBase, ctaPrimary)}>
                {primaryCta.label}
              </a>
            ) : null}
            {secondaryCta ? (
              <a href={secondaryCta.href} className={cn(ctaBase, ctaOutline)}>
                {secondaryCta.label}
              </a>
            ) : null}
          </motion.div>
        ) : null}
      </Stack>
    </Section>
  );
}

export default Hero;
