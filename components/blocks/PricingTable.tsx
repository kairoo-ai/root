"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { tiers as defaultTiers } from "@/config/tiers";
import type { Tier } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TierBadge } from "@/components/ui/TierBadge";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";

export interface PricingTableProps {
  /** Pricing tiers to render. Defaults to the app-wide config. */
  tiers?: Tier[];
  /** Optional eyebrow above the heading. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
  /** Supporting copy under the heading. */
  description?: string;
}

/** Resolve which tier is highlighted: an explicit `popular` flag wins; otherwise fall back to "pro". */
function resolvePopularKey(tiers: Tier[]): Tier["key"] | undefined {
  const flagged = tiers.find((t) => t.popular);
  if (flagged) return flagged.key;
  return tiers.some((t) => t.key === "pro") ? "pro" : undefined;
}

/** Render a tier's price. Numbers show as `$N` with a `/mo` suffix; "custom" shows as a label. */
function PriceDisplay({ price }: { price: Tier["priceMonthly"] }) {
  if (price === "custom") {
    return <span className="text-display text-foreground">Custom</span>;
  }
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="text-display text-foreground">${price}</span>
      <span className="text-body-sm text-muted-foreground">/mo</span>
    </span>
  );
}

export function PricingTable({
  tiers = defaultTiers,
  eyebrow = "Pricing",
  title = "Plans that grow with your career",
  description = "Start free and upgrade when you're ready. Every plan includes your AI career copilot.",
}: PricingTableProps) {
  const reduceMotion = useReducedMotion();
  const popularKey = resolvePopularKey(tiers);

  return (
    <Section aria-labelledby="pricing-heading">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        {eyebrow ? <p className="text-overline text-primary">{eyebrow}</p> : null}
        <h2 id="pricing-heading" className="mt-3 text-h1 text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-body-lg text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <Grid cols={3} gap="lg" className="mt-12 items-start">
        {tiers.map((tier, i) => {
          const isPopular = tier.key === popularKey;

          return (
            <motion.div
              key={tier.key}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: reduceMotion ? 0 : i * 0.08 }}
              className={cn("h-full", isPopular && "md:scale-[1.03]")}
            >
              <Card
                variant={isPopular ? "elevated" : "default"}
                className={cn(
                  "relative flex h-full flex-col p-6",
                  isPopular && "border-primary/40 ring-2 ring-primary shadow-elevation-4",
                )}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-primary px-3 py-1 text-overline text-primary-foreground">
                    Most popular
                  </span>
                )}

                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-h4 text-foreground">{tier.name}</h3>
                  <TierBadge tier={tier.key} />
                </div>

                <div className="mt-5 min-h-14">
                  <PriceDisplay price={tier.priceMonthly} />
                </div>

                <ul role="list" className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10"
                      >
                        <Check className="size-3.5 text-success" strokeWidth={2.5} />
                      </span>
                      <span className="text-body-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isPopular ? "primary" : "outline"}
                  size="lg"
                  className="mt-8 w-full"
                >
                  {tier.ctaLabel}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </Grid>
    </Section>
  );
}
