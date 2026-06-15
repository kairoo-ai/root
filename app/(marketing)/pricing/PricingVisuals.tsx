"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { animate, stagger } from "animejs";

import { cn } from "@/lib/utils";
import type { Tier } from "@/types";
import type { FAQItem } from "@/types";

import { LampEffect, GlowingEffect, BackgroundRipple, SpotlightNew } from "@/components/aceternity";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TierBadge } from "@/components/ui/TierBadge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";

import { Spotlight } from "@/components/motion/Spotlight";
import { CardContainer, CardBody, CardItem } from "@/components/motion/ThreeDCard";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { StatCounter, StatGrid } from "@/components/blocks/StatCounter";
import { BentoGrid, type BentoItem } from "@/components/blocks/BentoGrid";
import { FAQ } from "@/components/blocks/FAQ";

import IconRenderer from "@/components/IconRenderer";

/* ------------------------------------------------------------------ */
/* Shared reveal helper - reduced-motion safe                          */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1] as const;

function useReveal() {
  const reduce = useReducedMotion();
  return (delay = 0) =>
    reduce
      ? {}
      : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: EASE, delay },
      };
}

/* ------------------------------------------------------------------ */
/* Props - all data is serializable (icons passed as NAME strings)     */
/* ------------------------------------------------------------------ */
export interface PricingObjection {
  icon: string;
  title: string;
  body: string;
}

export interface PricingVisualsProps {
  tiers: Tier[];
  objections: readonly PricingObjection[];
  faq: FAQItem[];
}

/** Per-tier presentation metadata, keyed off the tier key (kept client-side). */
const tierMeta: Record<
  Tier["key"],
  { icon: string; tagline: string; foot: string }
> = {
  free: {
    icon: "compass",
    tagline: "Explore your direction",
    foot: "No credit card required",
  },
  pro: {
    icon: "rocket",
    tagline: "Move faster, every day",
    foot: "Free trial included",
  },
  enterprise: {
    icon: "building",
    tagline: "Roll out across your team",
    foot: "Custom rollout & onboarding",
  },
};

/* ================================================================== */
/* HERO - Spotlight + anime.js word reveal + animated trust stats      */
/* ================================================================== */
function PricingHero() {
  const reduce = useReducedMotion();
  const reveal = useReveal();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reduce || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;

    // Start hidden, then run an elaborate staggered rise-in sequence.
    words.forEach((w) => {
      w.style.opacity = "0";
      w.style.transform = "translateY(0.5em)";
    });

    const animation = animate(words, {
      opacity: [0, 1],
      translateY: ["0.5em", "0em"],
      filter: ["blur(8px)", "blur(0px)"],
      duration: 900,
      delay: stagger(70, { start: 150 }),
      ease: "out(3)",
    });

    return () => {
      animation.cancel();
      words.forEach((w) => {
        w.style.opacity = "";
        w.style.transform = "";
        w.style.filter = "";
      });
    };
  }, [reduce]);

  const headline = "Pricing that grows with your career".split(" ");

  return (
    <Section className="relative isolate overflow-hidden pb-0">
      {/* Local Spotlight flair - the page AuroraBackground lives in the layout. */}
      <Spotlight className="-top-40 left-0 md:-top-24 md:left-52" fill="var(--primary)" />

      <Stack gap={8} align="center" className="mx-auto max-w-4xl py-10 text-center sm:py-16">
        <LampEffect className="py-8 w-full">
          <h1
            ref={headlineRef}
            className="text-display text-balance text-foreground"
            aria-label="Pricing that grows with your career"
          >
            {headline.map((word, i) => {
              const isHighlight = word === "grows" || word === "career";
              return (
                <span
                  key={`${word}-${i}`}
                  data-word
                  className={cn(
                    "mr-[0.25em] inline-block",
                    isHighlight &&
                    "bg-linear-to-r from-primary to-accent bg-clip-text text-transparent",
                  )}
                >
                  {word}
                </span>
              );
            })}
          </h1>
        </LampEffect>

        <motion.p
          {...reveal(0.7)}
          className="max-w-2xl text-pretty text-body-lg text-muted-foreground"
        >
          Start free with your AI career copilot. Upgrade to Pro when you&apos;re ready to
          move faster, or talk to us about rolling {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} out across your team.
        </motion.p>

        <motion.div {...reveal(0.78)} className="flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/sign-up">
              Get started free
              <IconRenderer name="arrow-right" size={18} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#plans">Compare plans</Link>
          </Button>
        </motion.div>

        {/* Animated trust stats - every metric counts up on view. */}
        <motion.div {...reveal(0.86)} className="w-full pt-4">
          <StatGrid
            cols={3}
            gap="lg"
            className="mx-auto max-w-2xl text-center [&>*]:items-center"
            items={[
              { value: 0, prefix: "$", label: "To start on Explorer" },
              { value: 5, suffix: " min", label: "To your first check-in" },
              { value: 1000, suffix: "+", label: "Professionals onboard" },
            ]}
          />
        </motion.div>
      </Stack>
    </Section>
  );
}

/* ================================================================== */
/* PRICING CARDS - premium glass, popular tier glows (CardSpotlight)   */
/* ================================================================== */
function AnimatedPrice({ price }: { price: Tier["priceMonthly"] }) {
  if (price === "custom") {
    return (
      <span className="text-display text-foreground">
        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          Custom
        </span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-baseline gap-1">
      <StatCounter
        value={price}
        label=""
        prefix="$"
        className="gap-0 [&>span:first-child]:text-display [&>span:last-child]:hidden"
      />
      <span className="text-body-sm text-muted-foreground">/mo</span>
    </span>
  );
}

function PricingPlans({ tiers }: { tiers: Tier[] }) {
  const reduce = useReducedMotion();
  const popularKey =
    tiers.find((t) => t.popular)?.key ??
    (tiers.some((t) => t.key === "pro") ? "pro" : undefined);

  return (
    <Section id="plans" aria-labelledby="pricing-heading" className="scroll-mt-24">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <h2 id="pricing-heading" className="mt-3 text-h1 text-balance text-foreground">
          Choose the plan that fits{" "}
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            where you&apos;re headed
          </span>
        </h2>
        <p className="mt-4 text-body-lg text-muted-foreground">
          Every plan includes your AI career copilot. No credit card required to start on
          Explorer.
        </p>
      </motion.div>

      <Grid cols={3} gap="lg" className="mt-14 items-stretch">
        {tiers.map((tier, i) => {
          const isPopular = tier.key === popularKey;
          const meta = tierMeta[tier.key];

          const inner = (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-xl",
                    isPopular
                      ? "bg-primary text-primary-foreground shadow-elevation-2"
                      : "bg-accent-subtle text-accent",
                  )}
                >
                  <IconRenderer name={meta.icon} size={20} />
                </span>
                <TierBadge tier={tier.key} />
              </div>

              <h3 className="mt-5 text-h4 text-foreground">{tier.name}</h3>
              <p className="mt-1 text-body-sm text-muted-foreground">{meta.tagline}</p>

              <div className="mt-5 min-h-14">
                <AnimatedPrice price={tier.priceMonthly} />
              </div>

              <ul role="list" className="mt-6 flex flex-1 flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
                        isPopular ? "bg-primary/15 text-primary" : "bg-success/10 text-success",
                      )}
                    >
                      <IconRenderer name="check" size={13} />
                    </span>
                    <span className="text-body-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={isPopular ? "primary" : "outline"}
                size="lg"
                className="mt-8 w-full"
              >
                <Link href={tier.key === "enterprise" ? "/contact" : "/sign-up"}>{tier.ctaLabel}</Link>
              </Button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-caption text-muted-foreground">
                <IconRenderer name="shield-check" size={13} />
                {meta.foot}
              </p>
            </div>
          );

          return (
            <motion.div
              key={tier.key}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : i * 0.1 }}
              whileHover={reduce ? undefined : { y: -6 }}
              className={cn("h-full", isPopular && "md:-translate-y-2")}
            >
              {isPopular ? (
                <GlowingEffect className="relative h-full rounded-2xl" color="var(--primary)">
                  <div className="relative h-full">
                    {/* Glow halo behind the popular tier - token color-mix only. */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-1 rounded-[1.4rem] opacity-70 blur-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in oklab, var(--primary) 45%, transparent), color-mix(in oklab, var(--accent) 40%, transparent))",
                      }}
                    />
                    <SpotlightNew className="relative h-full rounded-2xl">
                      <CardSpotlight className="relative flex h-full flex-col rounded-2xl border-primary/40 bg-card/80 p-6 shadow-elevation-4 ring-2 ring-primary backdrop-blur-[var(--blur-glass)]">
                        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-overline text-primary-foreground shadow-elevation-2">
                          <IconRenderer name="crown" size={12} />
                          Most popular
                        </span>
                        {inner}
                      </CardSpotlight>
                    </SpotlightNew>
                  </div>
                </GlowingEffect>
              ) : (
                <Card
                  variant="glass"
                  className="flex h-full flex-col p-6 transition-shadow duration-300 hover:shadow-elevation-3"
                >
                  {inner}
                </Card>
              )}
            </motion.div>
          );
        })}
      </Grid>
    </Section>
  );
}

/* ================================================================== */
/* OBJECTIONS - 3D tilt cards that lift toward the cursor              */
/* ================================================================== */
function Objections({
  objections,
}: {
  objections: readonly PricingObjection[];
}) {
  const reveal = useReveal();

  return (
    <Section aria-labelledby="why-kairoo-heading">
      <motion.div
        {...reveal(0)}
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <h2 id="why-kairoo-heading" className="text-h2 text-balance text-foreground">
          Built to remove the guesswork
        </h2>
        <p className="mt-4 text-body-lg text-muted-foreground">
          Three reasons people feel comfortable starting with {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} today.
        </p>
      </motion.div>

      <Grid cols={3} gap="lg" className="mt-12 items-stretch">
        {objections.map(({ icon, title, body }, i) => (
          <motion.div key={title} {...reveal(i * 0.08)} className="h-full">
            <CardContainer containerClassName="!py-0 h-full" className="h-full w-full">
              <CardBody className="h-full w-full">
                <CardItem
                  as="div"
                  translateZ={40}
                  className="!w-full"
                >
                  <Card
                    variant="interactive"
                    className="flex h-full flex-col p-6"
                  >
                    <CardItem
                      as="span"
                      translateZ={60}
                      aria-hidden
                      className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    >
                      <IconRenderer name={icon} size={20} />
                    </CardItem>
                    <CardItem as="h3" translateZ={40} className="mt-5 text-h5 text-foreground">
                      {title}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ={20}
                      className="mt-3 text-body-sm text-muted-foreground"
                    >
                      {body}
                    </CardItem>
                  </Card>
                </CardItem>
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </Grid>

      {/* Trust line - compliance framed honestly as "compliance-ready" */}
      <motion.div {...reveal(0.1)} className="mx-auto mt-12 max-w-3xl">
        <Alert
          variant="info"
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0 text-info" aria-hidden>
              <IconRenderer name="lock" size={20} />
            </span>
            <div>
              <AlertTitle className="text-info">Privacy and security by design</AlertTitle>
              <AlertDescription>
                Data encrypted in transit and never sold. Our practices are designed to be SOC 2
                and GDPR compliance-ready.
              </AlertDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            <Badge variant="info">SOC 2 compliance-ready</Badge>
            <Badge variant="info">GDPR compliance-ready</Badge>
          </div>
        </Alert>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/* WHAT EVERY PLAN INCLUDES - BentoGrid showcase                       */
/* ================================================================== */
function IncludedBento() {
  const items: BentoItem[] = [
    {
      title: "Your AI career copilot, on every plan",
      description:
        `From the free Explorer tier up, ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} maps an actionable path from your goals - no plan locks you out of the core experience.`,
      span: "2x2",
      icon: <IconRenderer name="compass" size={20} />,
    },
    {
      title: "Daily AI coaching",
      description: "Pro turns weekly nudges into daily, momentum-keeping check-ins.",
      span: "2x1",
      icon: <IconRenderer name="zap" size={20} />,
    },
    {
      title: "Skill-gap analysis",
      description: "See exactly what stands between you and the next role.",
      icon: <IconRenderer name="target" size={20} />,
    },
    {
      title: "Unlimited paths",
      description: "Run as many career bets in parallel as you like on Pro.",
      icon: <IconRenderer name="infinity" size={20} />,
    },
    {
      title: "Team dashboards, SSO & a success manager",
      description:
        "Enterprise adds org-wide visibility, single sign-on, audit logs, and a dedicated partner to drive your rollout.",
      span: "2x1",
      icon: <IconRenderer name="layout-dashboard" size={20} />,
    },
  ];

  return (
    <BentoGrid
      eyebrow="What's inside"
      heading="Everything you unlock as you grow"
      description="Start with the essentials on Explorer, then layer on speed, depth, and team-wide reach as your ambitions scale."
      items={items}
    />
  );
}

/* ================================================================== */
/* CLOSING CTA - glowing brand band                                    */
/* ================================================================== */
function GlowingCTA() {
  const reduce = useReducedMotion();

  return (
    <Section>
      <BackgroundRipple className="py-0">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative isolate"
        >
          {/* Glow halo behind the band */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-[2rem] opacity-60 blur-2xl"
            style={{
              background:
                "linear-gradient(120deg, color-mix(in oklab, var(--primary) 50%, transparent), color-mix(in oklab, var(--accent) 45%, transparent))",
            }}
          />
          <div className="relative overflow-hidden rounded-3xl bg-primary bg-linear-to-br from-primary to-accent px-6 py-16 text-center shadow-elevation-4 sm:px-12 sm:py-20">
            {/* soft accent highlight */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-1/2 -z-10 h-[120%] bg-accent/20 blur-3xl"
            />

            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
              <span
                aria-hidden
                className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm"
              >
                <IconRenderer name="rocket" size={26} />
              </span>
              <h2 className="text-balance text-h2 text-primary-foreground">
                Start free. Upgrade when it pays off.
              </h2>
              <p className="text-pretty text-body-lg text-primary-foreground/80">
                Spin up your AI career copilot in minutes - no credit card, no risk. See where
                {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} can take you.
              </p>
              <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/sign-up"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 text-base font-semibold text-primary transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2"
                >
                  Get started free
                  <IconRenderer name="arrow-right" size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-primary-foreground/40 bg-transparent px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2"
                >
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </BackgroundRipple>

      {/* Reassurance footer line */}
      <Container className="mt-10">
        <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-body-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="text-success" aria-hidden>
              <IconRenderer name="credit-card" size={16} />
            </span>
            No credit card to start
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-success" aria-hidden>
              <IconRenderer name="sparkles" size={16} />
            </span>
            Free plan forever
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-success" aria-hidden>
              <IconRenderer name="shield-check" size={16} />
            </span>
            Cancel anytime
          </span>
        </p>
      </Container>
    </Section>
  );
}

/* ================================================================== */
/* Composed export                                                     */
/* ================================================================== */
export default function PricingVisuals({ tiers, objections, faq }: PricingVisualsProps) {
  return (
    <>
      <PricingHero />
      <PricingPlans tiers={tiers} />
      <Objections objections={objections} />
      <IncludedBento />
      <FAQ
        eyebrow="Questions"
        title="Pricing FAQ"
        subtitle="Everything you need to know before you choose a plan. Still unsure? Reach out and we'll help."
        items={faq}
      />
      <GlowingCTA />
    </>
  );
}
