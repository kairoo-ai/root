"use client";

/* -------------------------------------------------------------------------- */
/*  How It Works - client visuals                                              */
/*                                                                             */
/*  All interactive / animated sections live here so page.tsx can stay a       */
/*  pure server component with `export const metadata`. Data crosses the RSC   */
/*  boundary as plain serializable values only (strings, numbers, arrays) -    */
/*  icons are passed as NAME strings and rendered via <IconRenderer>, never as */
/*  lucide component references (that previously broke prerender with          */
/*  "Refs cannot be passed to Client Components").                             */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { animate, stagger } from "animejs";

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import IconRenderer from "@/components/IconRenderer";
import { Spotlight } from "@/components/motion/Spotlight";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";
import { StatGrid, type StatCounterProps } from "@/components/blocks/StatCounter";
import { TracingBeam, BackgroundRipple } from "@/components/aceternity";

/* ------------------------------- types ----------------------------------- */

export type StepVM = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  /** icon NAME (IconRenderer key), not a component ref. */
  icon: string;
  points: string[];
};

export type StackFactVM = {
  title: string;
  description: string;
  icon: string;
};

/* ----------------------------- motion config ------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/* =========================================================================== */
/*  HERO - Spotlight + anime.js headline sequence                              */
/* =========================================================================== */

export function HowItWorksHero({
  eyebrow,
  words,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  /** The three loop words, animated in sequence. */
  words: string[];
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}) {
  const reduce = useReducedMotion();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const node = headlineRef.current;
    if (reduce || !node) return;
    const targets = node.querySelectorAll<HTMLElement>("[data-hero-word]");
    if (!targets.length) return;

    // Set the pre-animation state imperatively so SSR markup stays readable.
    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(0.5em) rotateX(-40deg)";
    });

    const animation = animate(targets, {
      opacity: [0, 1],
      translateY: ["0.5em", "0em"],
      rotateX: [-40, 0],
      duration: 900,
      delay: stagger(220, { start: 150 }),
      ease: "out(4)",
    });

    // eslint-disable-next-line consistent-return
    return () => {
      animation.cancel();
    };
  }, [reduce]);

  return (
    <Section className="relative isolate overflow-hidden">
      {/* Aceternity Spotlight sweeping in from the top-left. */}
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />

      {/* Token-driven aurora backdrop (teal -> navy), color-mix only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(60% 60% at 18% 0%, color-mix(in oklab, var(--primary) 16%, transparent) 0%, transparent 60%)",
            "radial-gradient(50% 50% at 85% 8%, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 55%)",
            "radial-gradient(70% 70% at 50% 120%, color-mix(in oklab, var(--primary) 12%, transparent) 0%, transparent 60%)",
          ].join(", "),
        }}
      />
      {/* Fine dotted grid for depth - fades into the background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--foreground) 22%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <Stack gap={8} align="center" className="mx-auto max-w-3xl py-10 text-center sm:py-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Badge variant="info" size="md" className="gap-1.5">
            <IconRenderer name="sparkles" size={13} />
            {eyebrow}
          </Badge>
        </motion.div>

        <h1
          ref={headlineRef}
          className="text-display [perspective:800px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {words.map((w, i) => (
            <span
              key={w}
              data-hero-word
              className={cn(
                "inline-block",
                i < words.length - 1 && "mr-[0.25em]",
                // Highlight the middle word ("Think") with the brand gradient.
                i === 1 && "gradient-text",
              )}
            >
              {w}
              {i < words.length - 1 ? "." : "."}
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
          className="max-w-2xl text-body-lg text-muted-foreground"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.85 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
        >
          <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
            <Button asChild size="lg">
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <IconRenderer name="arrow-right" size={18} />
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
            <Button asChild size="lg" variant="outline">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Stack>
    </Section>
  );
}

/* =========================================================================== */
/*  STATS - animated count-up band                                             */
/* =========================================================================== */

export function HowItWorksStats({ stats }: { stats: StatCounterProps[] }) {
  return (
    <Section className="pt-0">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <Card
          variant="glass"
          className="relative overflow-hidden p-8 sm:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, color-mix(in oklab, var(--primary) 10%, transparent), transparent 45%, color-mix(in oklab, var(--accent) 12%, transparent))",
            }}
          />
          <StatGrid items={stats} cols={4} gap="lg" className="relative" />
        </Card>
      </motion.div>
    </Section>
  );
}

/* =========================================================================== */
/*  STEPS - Sense -> Think -> Act stepped timeline with connecting visuals     */
/* =========================================================================== */

export function StepsTimeline({
  eyebrow,
  heading,
  subtitle,
  steps,
}: {
  eyebrow?: string;
  heading: string;
  subtitle: string;
  steps: StepVM[];
}) {
  const reduce = useReducedMotion();


  return (
    <Section aria-labelledby="steps-heading">
      <TracingBeam>
        <Stack gap={12}>
          <motion.header
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col"
          >
            <h2 id="steps-heading" className="text-h1">
              {heading}
            </h2>
            <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">{subtitle}</p>
          </motion.header>

          <div className="relative">
            {/* Connecting spine - animated teal->amber gradient line behind the cards. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px lg:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in oklab, var(--primary) 60%, transparent) 18%, color-mix(in oklab, var(--accent) 70%, transparent) 50%, color-mix(in oklab, var(--warning) 55%, transparent) 82%, transparent)",
              }}
            />

            <motion.ol
              variants={containerVariants}
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, amount: 0.2 }}
              className={cn(
                "grid grid-cols-1 gap-6 sm:grid-cols-2",
                steps.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
              )}
            >
              {steps.map((step, i) => (
                <motion.li
                  key={step.id}
                  variants={itemVariants}
                  className="relative flex"
                >
                  {/* Node marker on the spine. */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-[3.25rem] z-10 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-4 ring-[color-mix(in_oklab,var(--accent)_25%,transparent)] lg:block"
                  />

                  <CardSpotlight className="flex h-full w-full flex-col gap-5 rounded-xl border-border bg-card p-7">
                    <div className="flex items-center justify-between">
                      <motion.span
                        aria-hidden
                        whileHover={reduce ? undefined : { rotate: -6, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className="inline-flex size-12 items-center justify-center rounded-xl text-accent"
                        style={{
                          background:
                            "color-mix(in oklab, var(--accent) 14%, transparent)",
                          boxShadow:
                            "0 0 0 1px color-mix(in oklab, var(--accent) 28%, transparent)",
                        }}
                      >
                        <IconRenderer name={step.icon} size={24} />
                      </motion.span>
                      <span
                        className="text-data tabular-nums"
                        style={{ color: "color-mix(in oklab, var(--accent) 45%, var(--muted-foreground))" }}
                      >
                        {step.index}
                      </span>
                    </div>

                    {/* <Stack gap={2}>
                    <Badge variant="info" size="sm" className="w-fit">
                      {step.tagline}
                    </Badge>
                    <h3 className="text-h3 text-foreground">{step.title}</h3>
                    <p className="text-body-sm text-muted-foreground">{step.description}</p>
                  </Stack> */}

                    <ul className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-body-sm text-foreground"
                        >
                          <span className="mt-0.5 shrink-0 text-accent">
                            <IconRenderer name="arrow-right" size={16} />
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Mobile connector arrow between stacked cards. */}
                    {i < steps.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute -bottom-5 left-1/2 z-10 -translate-x-1/2 text-accent lg:hidden"
                      >
                        <IconRenderer name="arrow-right" size={18} className="rotate-90" />
                      </span>
                    )}
                  </CardSpotlight>
                </motion.li>
              ))}
            </motion.ol>
          </div>

        </Stack>
      </TracingBeam>
    </Section>
  );
}

/* =========================================================================== */
/*  STACK FACTS - ThreeDCard tilt trio + linked blueprint CTA                  */
/* =========================================================================== */

export function StackShowcase({
  eyebrow,
  heading,
  subtitle,
  facts,
  blueprint,
}: {
  eyebrow?: string;
  heading: string;
  subtitle: string;
  facts: StackFactVM[];
  blueprint: {
    heading: string;
    body: string;
    cta: { label: string; href: string };
  };
}) {
  const reduce = useReducedMotion();

  return (
    <Section aria-labelledby="stack-heading" className="relative overflow-hidden bg-muted-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 60%)",
        }}
      />
      <Stack gap={12}>
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col"
        >
          <h2 id="stack-heading" className="text-h1">
            {heading}
          </h2>
          <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">{subtitle}</p>
        </motion.header>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {facts.map((fact, i) => (
            <motion.div
              key={fact.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
            >
              <CardContainer containerClassName="py-0">
                <CardBody className="group/card relative h-full w-full rounded-xl border border-border bg-card p-7">
                  <CardItem
                    translateZ={50}
                    className="inline-flex size-11 items-center justify-center rounded-lg text-accent"
                    style={{
                      background: "color-mix(in oklab, var(--accent) 14%, transparent)",
                    }}
                  >
                    <IconRenderer name={fact.icon} size={20} />
                  </CardItem>
                  <CardItem
                    as="h3"
                    translateZ={40}
                    className="mt-4 text-h5 text-foreground"
                  >
                    {fact.title}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ={20}
                    className="mt-2 text-body-sm text-muted-foreground"
                  >
                    {fact.description}
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <BackgroundRipple className="py-0 rounded-xl">
            <Card
              variant="elevated"
              className="relative flex flex-col gap-5 overflow-hidden p-7 sm:flex-row sm:items-center sm:justify-between"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(110deg, color-mix(in oklab, var(--primary) 8%, transparent), transparent 55%, color-mix(in oklab, var(--accent) 10%, transparent))",
                }}
              />
              <div className="relative flex items-start gap-4">
                <span
                  aria-hidden
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-accent"
                  style={{ background: "color-mix(in oklab, var(--accent) 14%, transparent)" }}
                >
                  <IconRenderer name="sparkles" size={20} />
                </span>
                <Stack gap={1}>
                  <h3 className="text-h5 text-foreground">{blueprint.heading}</h3>
                  <p className="text-body-sm text-muted-foreground">{blueprint.body}</p>
                </Stack>
              </div>
              <Tooltip delay={0}>
                <Button asChild variant="outline" className="relative shrink-0">
                  <Link href={blueprint.cta.href}>
                    {blueprint.cta.label}
                    <IconRenderer name="arrow-right" size={16} />
                  </Link>
                </Button>
                <Tooltip.Content showArrow placement="top">
                  <Tooltip.Arrow />
                  Ingestion, reasoning fabric, scaling & roadmap
                </Tooltip.Content>
              </Tooltip>
            </Card>
          </BackgroundRipple>
        </motion.div>
      </Stack>
    </Section>
  );
}
