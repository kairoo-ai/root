"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { animate, stagger } from "animejs";

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spotlight } from "@/components/motion/Spotlight";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { BentoGrid, type BentoItem } from "@/components/blocks/BentoGrid";
import { StatCounter } from "@/components/blocks/StatCounter";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";
import IconRenderer from "@/components/IconRenderer";

const EASE = [0.22, 1, 0.36, 1] as const;

export interface HeroStat {
  value: number;
  label: string;
  suffix?: string;
}

export interface CareerHeroProps {
  eyebrow?: string;
  title: string;
  highlight: string;
  subtitle: string;
  stats: HeroStat[];
  pricingHref: string;
  contactHref: string;
  /** A handful of tool icon names to orbit the hero showcase card. */
  spotlightIcons: { icon: string; name: string }[];
}

/* ================================================================== */
/* HERO — Spotlight + anime.js word reveal + 3D tilt showcase card     */
/* ================================================================== */
export function CareerHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  stats,
  pricingHref,
  contactHref,
  spotlightIcons,
}: CareerHeroProps) {
  const reduce = useReducedMotion();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Elaborate anime.js word-by-word reveal of the headline.
  useEffect(() => {
    if (reduce || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll<HTMLElement>(
      "[data-word]",
    );
    if (!words.length) return;

    const animation = animate(words, {
      opacity: [0, 1],
      translateY: [28, 0],
      filter: ["blur(8px)", "blur(0px)"],
      duration: 760,
      delay: stagger(70),
      ease: "out(3)",
    });

    return () => {
      animation.cancel();
    };
  }, [reduce]);

  const titleWords = title.split(" ");
  const highlightWords = highlight.split(" ");

  return (
    <Section className="relative isolate overflow-hidden">
      {/* Layered teal + navy spotlights for depth — token-driven fills. */}
      <Spotlight
        className="-top-40 left-0 md:-top-24 md:left-52"
        fill="var(--primary)"
      />
      <Spotlight
        className="-top-20 right-0 md:right-40 md:-top-10"
        fill="var(--accent)"
      />

      {/* Soft top aurora glow built from tokens via color-mix. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-72 opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ---- Left: copy ---- */}
        <Stack gap={8} className="max-w-2xl">
          <h1
            ref={headlineRef}
            className="text-display text-balance text-foreground"
          >
            {titleWords.map((w, i) => (
              <span
                key={`t-${i}`}
                data-word
                className="mr-[0.25em] inline-block will-change-transform"
                style={reduce ? undefined : { opacity: 0 }}
              >
                {w}
              </span>
            ))}{" "}
            <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {highlightWords.map((w, i) => (
                <span
                  key={`h-${i}`}
                  data-word
                  className="mr-[0.25em] inline-block will-change-transform"
                  style={reduce ? undefined : { opacity: 0 }}
                >
                  {w}
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
            className="text-pretty text-body-lg text-muted-foreground"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
              <Button asChild size="lg">
                <Link href={pricingHref}>
                  See pricing
                  <IconRenderer name="arrow-right" size={18} />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
              <Button asChild size="lg" variant="outline">
                <Link href={contactHref}>Talk to us</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Inline animated stat band — glass strip. */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.62 }}
            className={cn(
              "mt-2 flex flex-wrap gap-x-8 gap-y-4 rounded-2xl border border-border/60 bg-card/70 p-5",
              "backdrop-blur-[var(--blur-glass)]",
            )}
          >
            {stats.map((s) => (
              <StatCounter
                key={s.label}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
              />
            ))}
          </motion.div>
        </Stack>

        {/* ---- Right: 3D tilt showcase card with orbiting tool glyphs ---- */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="hidden lg:block"
        >
          <CardContainer containerClassName="py-0" className="w-full">
            <CardBody className="relative h-[26rem] w-full">
              <CardItem
                translateZ={20}
                className="absolute inset-0 overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-elevation-4 backdrop-blur-[var(--blur-glass)]"
              >
                {/* teal→navy token wash */}
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(140deg, color-mix(in oklab, var(--primary) 16%, transparent), transparent 55%, color-mix(in oklab, var(--accent) 14%, transparent))",
                  }}
                />
              </CardItem>

              <CardItem
                translateZ={60}
                className="absolute left-7 top-7 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 backdrop-blur-[var(--blur-glass)]"
              >
                <span className="inline-flex size-2 rounded-full bg-accent" />
                <span className="text-caption font-semibold text-foreground">
                  Live toolkit
                </span>
              </CardItem>

              <CardItem
                translateZ={90}
                className="absolute left-7 top-1/2 -translate-y-1/2"
              >
                <span className="text-overline text-accent">AI-guided</span>
                <p className="mt-1 max-w-[14rem] text-h3 text-balance text-foreground">
                  From ambiguous goal to sequenced plan
                </p>
              </CardItem>

              {/* Orbiting tool glyphs at varied depths. */}
              {spotlightIcons.slice(0, 4).map((g, i) => {
                const pos = [
                  "right-8 top-10",
                  "right-12 top-1/3",
                  "right-6 bottom-1/3",
                  "right-16 bottom-10",
                ][i];
                return (
                  <CardItem
                    key={g.name}
                    translateZ={70 + i * 22}
                    className={cn("absolute", pos)}
                  >
                    <span
                      className={cn(
                        "inline-flex size-12 items-center justify-center rounded-2xl",
                        "border border-border/60 bg-accent-subtle text-accent shadow-elevation-2",
                      )}
                      title={g.name}
                    >
                      <IconRenderer name={g.icon} size={22} />
                    </span>
                  </CardItem>
                );
              })}
            </CardBody>
          </CardContainer>
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/* WHY — BentoGrid of benefit cells (icons passed as name strings)     */
/* ================================================================== */
export interface CareerBentoProps {
  eyebrow?: string;
  heading: string;
  description: string;
  items: {
    title: string;
    description: string;
    icon: string;
    span?: BentoItem["span"];
  }[];
}

export function CareerBento({
  eyebrow,
  heading,
  description,
  items,
}: CareerBentoProps) {
  const bentoItems: BentoItem[] = items.map((it) => ({
    title: it.title,
    description: it.description,
    span: it.span,
    icon: <IconRenderer name={it.icon} size={20} />,
  }));

  return (
    <BentoGrid
      eyebrow={eyebrow}
      heading={heading}
      description={description}
      items={bentoItems}
    />
  );
}

/* ================================================================== */
/* HOW — three-step CardSpotlight strip                                */
/* ================================================================== */
export interface CareerStepsProps {
  eyebrow?: string;
  heading: string;
  steps: { icon: string; title: string; description: string }[];
}

export function CareerSteps({ eyebrow, heading, steps }: CareerStepsProps) {
  const reduce = useReducedMotion();

  return (
    <Section>
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-h2 text-balance text-foreground">{heading}</h2>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
          >
            <CardSpotlight className="h-full rounded-2xl p-7">
              <Stack gap={4}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                    <IconRenderer name={step.icon} size={22} />
                  </span>
                  <span className="text-data tabular-nums text-muted-foreground/70">
                    0{i + 1}
                  </span>
                </div>
                <Stack gap={2}>
                  <h3 className="text-h4 text-foreground">{step.title}</h3>
                  <p className="text-body-sm text-muted-foreground">
                    {step.description}
                  </p>
                </Stack>
              </Stack>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
