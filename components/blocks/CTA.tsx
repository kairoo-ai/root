"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";

/** A single call-to-action link rendered as a button. */
export interface CTAAction {
  label: string;
  href: string;
}

/**
 * Link styled to match our Button primitive (size lg). The Button primitive
 * renders a <button> and has no asChild/Slot, so for navigation we apply the
 * same token-only classes to an anchor to keep markup valid and accessible.
 */
const ctaButton = cva(
  "inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      emphasis: {
        // High-contrast: light foreground chip on the brand backdrop.
        primary: "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
        // Subdued outline that still reads on the brand backdrop.
        secondary:
          "border border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10",
      },
    },
    defaultVariants: { emphasis: "primary" },
  },
);

const ctaSurface = cva(
  "relative isolate overflow-hidden rounded-3xl px-6 py-16 text-center shadow-elevation-3 sm:px-12 sm:py-20",
  {
    variants: {
      /**
       * Backdrop treatment. `solid` is a flat brand fill; `gradient` layers a
       * token-only brand gradient (primary -> accent) for extra depth.
       */
      tone: {
        solid: "bg-primary",
        gradient: "bg-primary bg-linear-to-br from-primary to-accent",
      },
    },
    defaultVariants: { tone: "gradient" },
  },
);

export interface CTAProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    VariantProps<typeof ctaSurface> {
  /** Primary headline — rendered at text-h2. */
  headline: string;
  /** Optional supporting line beneath the headline. */
  body?: string;
  /** Required primary action. */
  primary: CTAAction;
  /** Optional secondary action, rendered as a subdued button. */
  secondary?: CTAAction;
}

/**
 * CTA — a centered conversion band with a token brand backdrop.
 *
 * Data-driven: pass `headline`, optional `body`, and `primary` / `secondary`
 * actions. Foreground copy uses `text-primary-foreground` for guaranteed
 * contrast on `bg-primary`. Reveal animation respects reduced-motion.
 */
export function CTA({
  headline,
  body,
  primary,
  secondary,
  tone,
  className,
  ...props
}: CTAProps) {
  const prefersReducedMotion = useReducedMotion();

  const reveal = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <Section className={className} {...props}>
      <motion.div className={cn(ctaSurface({ tone }))} {...reveal}>
        {/* Decorative soft highlight — token-driven, non-essential, hidden from AT. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-1/2 -z-10 h-[120%] bg-accent/20 blur-3xl"
        />

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <h2 className="text-balance text-h2 text-primary-foreground">{headline}</h2>

          {body ? (
            <p className="text-pretty text-body-lg text-primary-foreground/80">{body}</p>
          ) : null}

          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href={primary.href} className={cn(ctaButton({ emphasis: "primary" }))}>
              {primary.label}
            </Link>

            {secondary ? (
              <Link
                href={secondary.href}
                className={cn(ctaButton({ emphasis: "secondary" }))}
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

export default CTA;
