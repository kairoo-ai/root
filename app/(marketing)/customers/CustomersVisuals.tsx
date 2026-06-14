"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { motion, useReducedMotion } from "motion/react";

import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatGrid, type StatCounterProps } from "@/components/blocks/StatCounter";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { BentoGrid, type BentoItem } from "@/components/blocks/BentoGrid";
import { LogoMarquee, type LogoMarqueeItem } from "@/components/blocks/LogoMarquee";
import { Spotlight } from "@/components/motion/Spotlight";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";
import IconRenderer from "@/components/IconRenderer";
import type { Testimonial as TestimonialType } from "@/types";

/* ------------------------------------------------------------------ */
/* Shared, token-only gradient text (teal -> navy -> bright teal).      */
/* Built from color-mix on brand tokens — never raw hex.                */
/* ------------------------------------------------------------------ */
const GRADIENT_TEXT: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(120deg, var(--accent) 0%, var(--primary) 45%, color-mix(in oklab, var(--accent) 70%, var(--foreground)) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* ================================================================== */
/* HERO — anime.js headline sequence + Spotlight + token aurora        */
/* ================================================================== */
export function CustomersHero({
  titleLead,
  titleHighlight,
  subtitle,
}: {
  titleLead: string;
  titleHighlight: string;
  subtitle: string;
}) {
  const reduce = useReducedMotion();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reduce || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll<HTMLElement>(
      "[data-word]",
    );
    if (!words.length) return;
    words.forEach((w) => {
      w.style.opacity = "0";
    });
    animate(words, {
      opacity: [0, 1],
      translateY: [28, 0],
      filter: ["blur(8px)", "blur(0px)"],
      duration: 850,
      delay: stagger(70, { start: 150 }),
      ease: "out(3)",
    });
  }, [reduce]);

  const lead = titleLead.split(" ");
  const high = titleHighlight.split(" ");

  return (
    <Section className="relative isolate overflow-hidden">
      {/* Aceternity Spotlight sweep, teal accent */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="var(--accent)"
      />
      {/* Token aurora backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(60% 60% at 18% 0%, color-mix(in oklab, var(--primary) 16%, transparent) 0%, transparent 60%)",
            "radial-gradient(50% 50% at 85% 8%, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 55%)",
            "radial-gradient(70% 70% at 50% 120%, color-mix(in oklab, var(--warning) 8%, transparent) 0%, transparent 60%)",
          ].join(", "),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />

      <Stack
        gap={6}
        align="center"
        className="mx-auto max-w-3xl py-10 text-center sm:py-16"
      >
        <h1
          ref={headlineRef}
          className="text-display text-balance text-foreground"
        >
          {lead.map((w, i) => (
            <span key={`l-${i}`} data-word className="mr-[0.25em] inline-block">
              {w}
            </span>
          ))}
          <span style={GRADIENT_TEXT}>
            {high.map((w, i) => (
              <span key={`h-${i}`} data-word className="mr-[0.25em] inline-block">
                {w}
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          className="text-body-lg mx-auto max-w-2xl text-pretty text-muted-foreground"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
        >
          <motion.a
            href="/pricing"
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground shadow-elevation-2 transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Launch Your Journey
            <IconRenderer name="arrow-right" className="size-4" size={16} />
          </motion.a>
          <motion.a
            href="/features"
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-6 text-base font-semibold text-foreground transition-colors hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Explore Features
          </motion.a>
        </motion.div>

        {/* Inline trust ribbon — fills the hero, keeps rhythm tight */}
        <motion.div
          className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-body-sm text-muted-foreground"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          <span className="inline-flex items-center gap-1.5">
            <IconRenderer name="star" className="size-4 text-warning" size={16} />
            4.9/5 average rating
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconRenderer
              name="badge-check"
              className="size-4 text-accent"
              size={16}
            />
            12,000+ careers leveled up
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconRenderer name="globe" className="size-4 text-accent" size={16} />
            Trusted across 40+ countries
          </span>
        </motion.div>
      </Stack>
    </Section>
  );
}

/* ================================================================== */
/* LOGO MARQUEE — trusted-by row                                       */
/* ================================================================== */
export function CustomersLogoMarquee({
  label,
  logos,
}: {
  label: string;
  logos: LogoMarqueeItem[];
}) {
  return (
    <Section className="pt-0">
      <Stack gap={6} align="center">
        <span className="text-overline text-center text-muted-foreground">
          {label}
        </span>
        <div className="relative w-full rounded-2xl border border-border/60 bg-card/60 py-8 backdrop-blur-[var(--blur-glass)]">
          <LogoMarquee items={logos} speed={32} gap={20} />
        </div>
      </Stack>
    </Section>
  );
}

/* ================================================================== */
/* TESTIMONIALS — CardSpotlight + ThreeDCard tilt                      */
/* ================================================================== */
export function CustomersTestimonials({
  heading,
  description,
  items,
}: {
  heading: string;
  description: string;
  items: TestimonialType[];
}) {
  const reduce = useReducedMotion();

  return (
    <Section>
      <Stack gap={3} className="mb-12 max-w-2xl">
        <motion.h2
          className="text-h2 text-foreground"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          {heading}
        </motion.h2>
        <motion.p
          className="text-body text-muted-foreground"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </Stack>

      <Grid cols={3} gap="lg">
        {items.map((t, i) => (
          <motion.div
            key={t.id}
            className="h-full"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: EASE, delay: Math.min(i, 6) * 0.1 }}
          >
            <CardContainer
              containerClassName="h-full py-0"
              className="h-full w-full"
            >
              <CardBody className="h-full w-full">
                <CardSpotlight
                  radius={320}
                  className="flex h-full flex-col gap-6 rounded-xl p-7 sm:p-8"
                >
                  <CardItem translateZ={28} className="w-fit">
                    <span
                      aria-hidden
                      className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent"
                    >
                      <IconRenderer name="quote" className="size-5" size={20} />
                    </span>
                  </CardItem>

                  <CardItem translateZ={20} as="div" className="w-full">
                    <span
                      aria-hidden
                      className="flex gap-0.5 text-warning"
                    >
                      {Array.from({ length: 5 }).map((_, s) => (
                        <IconRenderer
                          key={s}
                          name="star"
                          className="size-4"
                          size={16}
                        />
                      ))}
                    </span>
                  </CardItem>

                  <CardItem translateZ={40} as="blockquote" className="w-full">
                    <p className="text-body-lg text-pretty text-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </CardItem>

                  <CardItem
                    translateZ={24}
                    as="figcaption"
                    className="mt-auto flex w-full items-center gap-3 pt-2"
                  >
                    <Avatar
                      initials={t.name
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((p) => p.charAt(0).toUpperCase())
                        .join("")}
                    />
                    <span className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {t.name}
                      </span>
                      <span className="text-body-sm text-muted-foreground">
                        {t.role}
                        {t.company ? <> &middot; {t.company}</> : null}
                      </span>
                    </span>
                  </CardItem>
                </CardSpotlight>
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </Grid>
    </Section>
  );
}

/* ================================================================== */
/* IMPACT STATS — animated StatGrid inside a glass spotlight panel     */
/* ================================================================== */
export function CustomersImpact({
  heading,
  description,
  metrics,
}: {
  heading: string;
  description: string;
  metrics: (StatCounterProps & { icon: string })[];
}) {
  const reduce = useReducedMotion();

  return (
    <Section>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <Card
          variant="glass"
          className="relative overflow-hidden p-8 sm:p-12"
        >
          {/* token glow accents — teal + amber, no purple */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              background: [
                "radial-gradient(40% 60% at 0% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
                "radial-gradient(40% 60% at 100% 100%, color-mix(in oklab, var(--warning) 10%, transparent), transparent 70%)",
              ].join(", "),
            }}
          />
          <div className="relative">
            <Stack gap={3} className="mb-10 max-w-2xl">
              <h2 className="text-h2 text-foreground">{heading}</h2>
              <p className="text-body text-muted-foreground">{description}</p>
            </Stack>

            {/* Iconized metric tiles wrapping the animated counters */}
            <Grid cols={4} gap="lg">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(i * 0.08, 0.32),
                  }}
                  className="rounded-xl border border-border/60 bg-card/50 p-5"
                >
                  <span
                    aria-hidden
                    className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-accent-subtle text-accent"
                  >
                    <IconRenderer name={m.icon} className="size-5" size={20} />
                  </span>
                  <StatGrid items={[m]} cols={1} gap="md" />
                </motion.div>
              ))}
            </Grid>
          </div>
        </Card>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/* OUTCOME BENTO — why customers win, BentoGrid                        */
/* ================================================================== */
export function CustomersBento({
  heading,
  description,
  items,
  disclaimer,
}: {
  heading: string;
  description: string;
  items: (Omit<BentoItem, "icon"> & { icon: string })[];
  disclaimer?: React.ReactNode;
}) {
  const bentoItems: BentoItem[] = items.map((it) => ({
    title: it.title,
    description: it.description,
    span: it.span,
    icon: <IconRenderer name={it.icon} size={20} />,
  }));

  return (
    <>
      <BentoGrid
        heading={heading}
        description={description}
        items={bentoItems}
      />
      {disclaimer}
    </>
  );
}
