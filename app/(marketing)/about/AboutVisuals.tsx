"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { animate, stagger } from "animejs";

import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { Spotlight } from "@/components/motion/Spotlight";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";
import { StatCounter } from "@/components/blocks/StatCounter";
import IconRenderer from "@/components/IconRenderer";
import { Timeline } from "@/components/aceternity";
import type { TimelineItem } from "@/components/aceternity";

/* ------------------------------------------------------------------ *
 * Serializable data shapes - every value crossing the server→client   *
 * boundary is a primitive or icon NAME string (never a component ref). *
 * ------------------------------------------------------------------ */

export interface PillarData {
  id: string;
  icon: string;
  title: string;
  description: string;
  /** Bento footprint classes for the lg grid. */
  span: string;
  /** Small accent tag shown on the cell. */
  tag: string;
}

export interface ValueData {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface StatData {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface TeamData {
  icon: string;
  title: string;
  body: string;
}

/* ------------------------------------------------------------------ *
 * Shared motion variants                                              *
 * ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

/* ------------------------------------------------------------------ *
 * Shared CTA affordance                                               *
 * ------------------------------------------------------------------ */

function HeroCta({
  href,
  children,
  variant,
}: {
  href: string;
  children: React.ReactNode;
  variant: "primary" | "ghost";
}) {
  const base =
    "group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground shadow-elevation-2 hover:bg-primary/90"
      : "border border-border bg-card/60 text-foreground hover:bg-muted-surface";
  return (
    <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Link href={href} className={`${base} ${styles}`}>
        {children}
      </Link>
    </motion.span>
  );
}

/* ------------------------------------------------------------------ *
 * HERO - Spotlight + Anime.js sequenced gradient mission headline     *
 * ------------------------------------------------------------------ */

export function AboutHero({
  titleLead,
  titleHighlight,
  titleTail,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  titleLead: string;
  titleHighlight: string;
  titleTail: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}) {
  const reduce = useReducedMotion();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reduce || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll<HTMLElement>(
      "[data-word]",
    );
    if (!words.length) return;

    animate(words, {
      opacity: [0, 1],
      translateY: [24, 0],
      filter: ["blur(8px)", "blur(0px)"],
      duration: 760,
      delay: stagger(70, { start: 180 }),
      ease: "out(3)",
    });
  }, [reduce]);

  const words = `${titleLead} ${titleHighlight} ${titleTail}`.trim().split(" ");
  const highlightSet = new Set(
    titleHighlight.split(" ").map((w) => w.toLowerCase()),
  );

  return (
    <Section className="relative isolate overflow-hidden pb-10">
      {/* Spotlight + token aurora backdrop (color-mix on brand tokens only). */}
      <Spotlight
        className="-top-40 left-0 md:-top-32 md:left-32"
        fill="color-mix(in oklab, var(--accent) 70%, var(--primary))"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(60% 60% at 18% 0%, color-mix(in oklab, var(--primary) 14%, transparent) 0%, transparent 60%)",
            "radial-gradient(48% 52% at 88% 6%, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 55%)",
            "radial-gradient(40% 40% at 50% 120%, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 60%)",
          ].join(", "),
        }}
      />
      {/* Subtle dotted grid for depth - token border color, low opacity. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--border) 80%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <Stack gap={6} align="center" className="mx-auto max-w-3xl text-center">
        <Stack gap={3} align="center">
          <h1
            ref={headlineRef}
            className="text-display text-balance text-foreground"
          >
            {words.map((word, i) => {
              const isHi = highlightSet.has(word.toLowerCase());
              return (
                <span
                  key={`${word}-${i}`}
                  data-word
                  className={
                    isHi
                      ? "bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] bg-clip-text text-transparent"
                      : undefined
                  }
                  style={reduce ? undefined : { display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </span>
              );
            })}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-body-lg mx-auto max-w-2xl text-pretty text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        </Stack>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <HeroCta href={primaryCta.href} variant="primary">
            {primaryCta.label}
            <IconRenderer name="arrow-right" size={16} />
          </HeroCta>
          <HeroCta href={secondaryCta.href} variant="ghost">
            {secondaryCta.label}
          </HeroCta>
        </motion.div>
      </Stack>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * MISSION - gradient statement on a 3D tilt glass card, with the      *
 * narrative prose alongside. Scroll-reveal.                           *
 * ------------------------------------------------------------------ */

export function MissionStatement({
  heading,
  paragraphs,
}: {
  heading: string;
  /** Plain-text paragraphs; the lead paragraph supports a highlighted word run is handled by caller. */
  paragraphs: string[];
}) {
  const reduce = useReducedMotion();

  const card = (
    <CardSpotlight className="h-full border-0 bg-transparent p-0">
      <Card
        variant="glass"
        className="group relative flex h-full flex-col justify-center gap-5 overflow-hidden p-8 shadow-elevation-3 sm:p-10"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(120% 90% at 0% 0%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 55%), radial-gradient(120% 90% at 100% 100%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 60%)",
          }}
        />
        <div className="relative flex flex-col gap-5">
          <span
            aria-hidden
            className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent shadow-elevation-1"
          >
            <IconRenderer name="target" size={28} />
          </span>
          <h2 className="text-h2 text-balance text-foreground">
            <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] bg-clip-text text-transparent">
              {heading}
            </span>
          </h2>
        </div>
      </Card>
    </CardSpotlight>
  );

  return (
    <Section className="pt-2">
      <motion.div
        variants={reduce ? undefined : staggerParent}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-5"
      >
        <motion.div
          variants={reduce ? undefined : cardReveal}
          className="lg:col-span-2"
        >
          {reduce ? (
            card
          ) : (
            <CardContainer
              containerClassName="block h-full p-0"
              className="h-full w-full"
            >
              <CardBody className="h-full w-full">
                <CardItem translateZ={36} className="h-full w-full">
                  {card}
                </CardItem>
              </CardBody>
            </CardContainer>
          )}
        </motion.div>

        <motion.div
          variants={reduce ? undefined : cardReveal}
          className="lg:col-span-3"
        >
          <Card
            variant="default"
            className="flex h-full flex-col justify-center gap-5 p-8 shadow-elevation-1 sm:p-10"
          >
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-body-lg text-pretty text-foreground"
                    : "text-body text-pretty text-muted-foreground"
                }
              >
                {p}
              </p>
            ))}
          </Card>
        </motion.div>
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * PILLARS - Bento of CardSpotlight cells; lead cell is a 3D tilt.     *
 * ------------------------------------------------------------------ */

export function PillarBento({
  heading,
  description,
  pillars,
}: {
  heading: string;
  description: string;
  pillars: PillarData[];
}) {
  const reduce = useReducedMotion();
  const [lead, ...rest] = pillars;

  return (
    <Section className="pt-2">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-h2 text-balance text-foreground">{heading}</h2>
        <p className="text-body-lg mt-4 text-pretty text-muted-foreground">
          {description}
        </p>
      </header>

      <motion.div
        variants={reduce ? undefined : staggerParent}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
        className="grid auto-rows-[minmax(12rem,1fr)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div
          variants={reduce ? undefined : cardReveal}
          className={lead.span}
        >
          <LeadPillarCard pillar={lead} />
        </motion.div>

        {rest.map((pillar) => (
          <motion.div
            key={pillar.id}
            variants={reduce ? undefined : cardReveal}
            className={pillar.span}
          >
            <PillarCell pillar={pillar} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

function LeadPillarCard({ pillar }: { pillar: PillarData }) {
  const reduce = useReducedMotion();

  const inner = (
    <CardSpotlight className="h-full border-0 bg-transparent p-0">
      <Card
        variant="glass"
        className="group relative flex h-full flex-col gap-6 overflow-hidden p-8 shadow-elevation-2"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(120% 90% at 0% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 55%), radial-gradient(120% 90% at 100% 100%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%)",
          }}
        />
        <div className="relative flex h-full flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <span
              aria-hidden
              className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent shadow-elevation-1"
            >
              <IconRenderer name={pillar.icon} size={28} />
            </span>
            <Badge variant="info" size="md">
              {pillar.tag}
            </Badge>
          </div>
          <Stack gap={3}>
            <h3 className="text-h3 text-balance text-foreground">
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                {pillar.title}
              </span>
            </h3>
            <p className="text-body text-pretty text-muted-foreground">
              {pillar.description}
            </p>
          </Stack>
        </div>
      </Card>
    </CardSpotlight>
  );

  return reduce ? (
    inner
  ) : (
    <CardContainer
      containerClassName="block h-full p-0"
      className="h-full w-full"
    >
      <CardBody className="h-full w-full">
        <CardItem translateZ={40} className="h-full w-full">
          {inner}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

function PillarCell({ pillar }: { pillar: PillarData }) {
  return (
    <CardSpotlight className="group h-full border-0 bg-transparent p-0">
      <Card
        variant="interactive"
        className="relative flex h-full flex-col gap-4 overflow-hidden p-7 shadow-elevation-1"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-accent-subtle opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="relative flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <span
              aria-hidden
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent"
            >
              <IconRenderer name={pillar.icon} size={24} />
            </span>
            <Badge variant="neutral" size="sm">
              {pillar.tag}
            </Badge>
          </div>
          <Stack gap={2}>
            <h3 className="text-h4 text-balance text-foreground">
              {pillar.title}
            </h3>
            <p className="text-body-sm text-pretty text-muted-foreground">
              {pillar.description}
            </p>
          </Stack>
        </div>
      </Card>
    </CardSpotlight>
  );
}

/* ------------------------------------------------------------------ *
 * MILESTONES / STATS - animated counters on a gradient glass band     *
 * ------------------------------------------------------------------ */

export function MilestoneStats({
  heading,
  description,
  stats,
}: {
  heading: string;
  description: string;
  stats: StatData[];
}) {
  const reduce = useReducedMotion();
  return (
    <Section className="pt-2">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-h2 text-balance text-foreground">{heading}</h2>
        <p className="text-body-lg mt-4 text-pretty text-muted-foreground">
          {description}
        </p>
      </header>

      <motion.div
        variants={reduce ? undefined : sectionReveal}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.4 }}
      >
        <Card
          variant="glass"
          className="relative overflow-hidden p-8 shadow-elevation-3 sm:p-10"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, color-mix(in oklab, var(--primary) 8%, transparent), transparent 45%), linear-gradient(290deg, color-mix(in oklab, var(--accent) 10%, transparent), transparent 50%)",
            }}
          />
          <div className="relative grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <StatCounter
                key={s.label}
                value={s.value}
                label={s.label}
                prefix={s.prefix}
                suffix={s.suffix}
                className="items-center"
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * VALUES - bento of CardSpotlight cells with tooltips. Stagger.       *
 * ------------------------------------------------------------------ */

export function ValueGrid({
  heading,
  description,
  values,
}: {
  heading: string;
  description: string;
  values: ValueData[];
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <Section className="pt-2">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-h2 text-balance text-foreground">{heading}</h2>
        <p className="text-body-lg mt-4 text-pretty text-muted-foreground">
          {description}
        </p>
      </header>

      <motion.div
        ref={ref}
        variants={reduce ? undefined : staggerParent}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : inView ? "show" : "hidden"}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {values.map((value) => (
          <motion.div key={value.id} variants={reduce ? undefined : cardReveal}>
            <CardSpotlight className="group h-full border-border p-6">
              <Tooltip delay={150}>
                <span
                  aria-hidden
                  className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-accent-subtle text-accent transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5"
                >
                  <IconRenderer name={value.icon} size={22} />
                </span>
                <Tooltip.Content showArrow placement="top">
                  <Tooltip.Arrow />
                  {value.title}
                </Tooltip.Content>
              </Tooltip>
              <h3 className="text-h5 text-balance text-foreground">
                {value.title}
              </h3>
              <p className="text-body-sm mt-2 text-pretty text-muted-foreground">
                {value.description}
              </p>
            </CardSpotlight>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * TEAM - staggered glass cards + honest note callout.                 *
 * ------------------------------------------------------------------ */

export function TeamSection({
  heading,
  description,
  members,
  note,
}: {
  heading: string;
  description: string;
  members: TeamData[];
  note: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section className="pt-2">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="text-h2 text-balance text-foreground">{heading}</h2>
        <p className="text-body-lg mt-4 text-pretty text-muted-foreground">
          {description}
        </p>
      </header>

      <motion.div
        ref={ref}
        variants={reduce ? undefined : staggerParent}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : inView ? "show" : "hidden"}
        className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3"
      >
        {members.map((member) => (
          <motion.div
            key={member.title}
            variants={reduce ? undefined : cardReveal}
          >
            <CardSpotlight className="group h-full border-0 bg-transparent p-0">
              <Card
                variant="glass"
                className="relative flex h-full flex-col gap-4 overflow-hidden p-6 shadow-elevation-1"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-accent-subtle opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="relative flex h-full flex-col gap-4">
                  <span
                    aria-hidden
                    className="inline-flex size-11 items-center justify-center rounded-lg bg-accent-subtle text-accent"
                  >
                    <IconRenderer name={member.icon} size={22} />
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-h5 text-foreground">{member.title}</h3>
                    <Badge variant="neutral" size="sm">
                      Hiring
                    </Badge>
                  </div>
                  <p className="text-body-sm text-pretty text-muted-foreground">
                    {member.body}
                  </p>
                </div>
              </Card>
            </CardSpotlight>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={reduce ? undefined : sectionReveal}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.6 }}
        className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-3 rounded-xl border border-border bg-muted-surface p-4 text-left"
      >
        <span aria-hidden className="mt-0.5 shrink-0 text-accent">
          <IconRenderer name="shield-check" size={20} />
        </span>
        <p className="text-body-sm text-muted-foreground">{note}</p>
      </motion.div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * CLOSING CTA - gradient glass band with motion buttons              *
 * ------------------------------------------------------------------ */

export function AboutCta({
  headline,
  body,
  primary,
  secondary,
}: {
  headline: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}) {
  const reduce = useReducedMotion();
  return (
    <Section className="pt-2 pb-20">
      <motion.div
        variants={reduce ? undefined : sectionReveal}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.4 }}
      >
        <Card
          variant="glass"
          className="relative isolate overflow-hidden p-10 text-center shadow-elevation-4 sm:p-14"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(70% 120% at 50% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%), radial-gradient(60% 100% at 50% 100%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 60%)",
            }}
          />
          <Stack gap={5} align="center" className="mx-auto max-w-2xl">
            <span
              aria-hidden
              className="inline-flex size-12 items-center justify-center rounded-xl bg-accent-subtle text-accent shadow-elevation-1"
            >
              <IconRenderer name="rocket" size={24} />
            </span>
            <h2 className="text-h2 text-balance text-foreground">
              <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] bg-clip-text text-transparent">
                {headline}
              </span>
            </h2>
            <p className="text-body-lg text-pretty text-muted-foreground">
              {body}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <HeroCta href={primary.href} variant="primary">
                {primary.label}
                <IconRenderer name="arrow-right" size={16} />
              </HeroCta>
              <HeroCta href={secondary.href} variant="ghost">
                {secondary.label}
              </HeroCta>
            </div>
          </Stack>
        </Card>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/* MILESTONES TIMELINE - aceternity Timeline                           */
/* ================================================================== */
export function MilestonesTimeline() {
  const milestones: TimelineItem[] = [
    { title: 'Founded', date: '2023', content: <p className="text-muted-foreground">AstraPath AI founded with a mission to democratize career intelligence.</p> },
    { title: `Rebranded to ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`, date: '2024', content: <p className="text-muted-foreground">Refined focus, new brand, same mission.</p> },
    { title: 'AI Engine v2', date: '2025', content: <p className="text-muted-foreground">38-tool AI career engine launched with personalized roadmaps.</p> },
  ]
  return <Timeline items={milestones} className="mt-12" />
}
