"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { animate, stagger } from "animejs";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatGrid, type StatCounterProps } from "@/components/blocks/StatCounter";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { Spotlight } from "@/components/motion/Spotlight";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";
import IconRenderer from "@/components/IconRenderer";

/* -------------------------------------------------------------------------- */
/* Shared scroll-reveal primitive                                             */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const stackVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* -------------------------------------------------------------------------- */
/* Hero — Spotlight + anime.js entrance sequence                              */
/* -------------------------------------------------------------------------- */

export interface HeroStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export function InvestorsHero({
  eyebrow,
  headline,
  highlight,
  tail,
  subhead,
  pills,
  primaryCta,
  secondaryCta,
  ribbon,
}: {
  eyebrow: string;
  headline: string;
  highlight: string;
  tail: string;
  subhead: string;
  pills: { icon: string; label: string }[];
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  ribbon: { value: number; prefix?: string; suffix?: string; label: string }[];
}) {
  const prefersReduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced || !rootRef.current) return;
    const root = rootRef.current;
    const seq = animate(root.querySelectorAll<HTMLElement>("[data-hero-line]"), {
      opacity: [0, 1],
      translateY: [28, 0],
      filter: ["blur(10px)", "blur(0px)"],
      duration: 900,
      delay: stagger(120),
      ease: "out(3)",
    });
    const pillsAnim = animate(root.querySelectorAll<HTMLElement>("[data-hero-pill]"), {
      opacity: [0, 1],
      scale: [0.85, 1],
      delay: stagger(80, { start: 500 }),
      duration: 600,
      ease: "out(3)",
    });
    return () => {
      seq.cancel();
      pillsAnim.cancel();
    };
  }, [prefersReduced]);

  return (
    <section className="relative overflow-hidden">
      {/* token-only gradient fill for the count-up numbers (no raw color) */}
      <style>{`.ribbon-stat .text-data{background-image:linear-gradient(120deg,var(--primary),color-mix(in oklab,var(--accent) 80%,var(--primary)));}`}</style>
      {/* layered token-only ambient gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 15% 0%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%), radial-gradient(55% 50% at 95% 10%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="var(--primary)" />
      <Spotlight className="-top-10 right-0 hidden md:flex" fill="var(--accent)" />

      <div
        ref={rootRef}
        className="container mx-auto px-6 pb-20 pt-32 md:pb-28 md:pt-40"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div data-hero-line className="flex justify-center">
            <Badge variant="neutral" className="gap-2 border border-border/70 bg-card/60 px-4 py-1.5 text-overline backdrop-blur-glass">
              <IconRenderer name="sparkles" size={14} className="text-accent" />
              {eyebrow}
            </Badge>
          </div>

          <h1
            data-hero-line
            className="mt-6 text-balance text-display text-foreground"
          >
            {headline}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, var(--primary), color-mix(in oklab, var(--accent) 85%, var(--primary)) 55%, color-mix(in oklab, var(--accent) 70%, transparent))",
              }}
            >
              {highlight}
            </span>{" "}
            {tail}
          </h1>

          <p
            data-hero-line
            className="mx-auto mt-6 max-w-2xl text-pretty text-body-lg text-muted-foreground"
          >
            {subhead}
          </p>

          <div
            data-hero-line
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {pills.map((p) => (
              <span
                key={p.label}
                data-hero-pill
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-body-sm text-foreground backdrop-blur-[var(--blur-glass)]"
              >
                <IconRenderer name={p.icon} size={15} className="text-primary" />
                {p.label}
              </span>
            ))}
          </div>

          <div
            data-hero-line
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href={primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-body font-semibold text-primary-foreground shadow-elevation-2 transition-all hover:shadow-elevation-4 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {primaryCta.label}
              <IconRenderer
                name="arrow-right"
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3 text-body font-semibold text-foreground backdrop-blur-[var(--blur-glass)] transition-all hover:bg-accent-subtle hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <IconRenderer name="presentation" size={17} className="text-accent" />
              {secondaryCta.label}
            </Link>
          </div>
        </div>

        {/* headline ribbon of animated metrics */}
        <div data-hero-line className="mx-auto mt-16 max-w-5xl">
          <Card
            variant="glass"
            className="grid grid-cols-2 gap-y-8 divide-border/50 px-6 py-8 sm:grid-cols-4 sm:divide-x"
          >
            {ribbon.map((r) => (
              <div
                key={r.label}
                className="flex flex-col items-center gap-1 px-2 text-center"
              >
                <RibbonStat {...r} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </section>
  );
}

/* A centered, large count-up tuned for the hero ribbon. */
function RibbonStat({
  value,
  prefix,
  suffix,
  label,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="ribbon-stat w-full [&_.text-caption]:text-center [&_.text-data]:bg-clip-text [&_.text-data]:text-h2 [&_.text-data]:text-transparent [&_>div]:items-center">
      <StatGrid
        cols={1}
        className="gap-1!"
        items={[{ value, prefix, suffix, label }]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Navigation cards — CardSpotlight + ThreeDCard tilt                          */
/* -------------------------------------------------------------------------- */

export interface NavCard {
  href: string;
  title: string;
  description: string;
  icon: string;
  meta: string;
  span?: "wide" | "tall" | "regular";
}

export function NavCards({ items }: { items: NavCard[] }) {
  return (
    <motion.div
      variants={stackVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      {items.map((item) => (
        <motion.div
          key={item.href}
          variants={itemVariants}
          className={cn(item.span === "wide" && "md:col-span-2")}
        >
          <Link href={item.href} className="group block h-full focus-visible:outline-none">
            <CardSpotlight
              radius={420}
              className="h-full rounded-2xl border-border/70 p-0 transition-shadow duration-300 group-hover:shadow-elevation-4 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2"
            >
              <div className="flex h-full flex-col gap-5 p-8">
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-elevation-2"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--accent) 80%, var(--primary)))",
                    }}
                  >
                    <IconRenderer name={item.icon} size={22} />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-caption text-muted-foreground">
                    <IconRenderer name="badge-check" size={13} className="text-accent" />
                    {item.meta}
                  </span>
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="text-h4 text-foreground">{item.title}</h3>
                  <p className="mt-2 text-pretty text-body-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary">
                  Explore
                  <IconRenderer
                    name="arrow-right"
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </CardSpotlight>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* The Ask — ThreeDCard tilt feature                                          */
/* -------------------------------------------------------------------------- */

export function AskCard({
  terms,
  useOfFunds,
}: {
  terms: { icon: string; label: string; value: string }[];
  useOfFunds: { label: string; value: number; icon: string }[];
}) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
      <Reveal className="h-full">
        <CardContainer containerClassName="!py-0 h-full" className="h-full w-full">
          <CardBody className="h-full w-full">
            <Card
              variant="glass"
              className="relative h-full overflow-hidden p-8 md:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%)",
                }}
              />
              <CardItem translateZ={40}>
                <Badge variant="neutral" className="gap-2 border border-border/70 bg-card/60 text-overline">
                  <IconRenderer name="dollar-sign" size={13} className="text-accent" />
                  The Round
                </Badge>
              </CardItem>
              <CardItem translateZ={60} className="mt-5 block">
                <p className="text-h2 text-foreground">Series A</p>
                <p className="mt-1 text-body text-muted-foreground">
                  Structured for 24 months of runway to a metrics-driven Series B.
                </p>
              </CardItem>
              <CardItem translateZ={30} className="mt-8 block w-full">
                <dl className="grid grid-cols-2 gap-5">
                  {terms.map((t) => (
                    <div
                      key={t.label}
                      className="rounded-xl border border-border/60 bg-card/50 p-4"
                    >
                      <dt className="flex items-center gap-2 text-caption text-muted-foreground">
                        <IconRenderer name={t.icon} size={14} className="text-primary" />
                        {t.label}
                      </dt>
                      <dd className="mt-1 text-h5 tabular-nums text-foreground">
                        {t.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardItem>
            </Card>
          </CardBody>
        </CardContainer>
      </Reveal>

      <Reveal delay={0.1} className="h-full">
        <Card variant="glass" className="flex h-full flex-col p-8 md:p-10">
          <div className="flex items-center gap-2">
            <IconRenderer name="piggy-bank" size={18} className="text-accent" />
            <h3 className="text-h5 text-foreground">Use of Funds</h3>
          </div>
          <div className="mt-6 flex flex-1 flex-col gap-5">
            {useOfFunds.map((u, i) => (
              <Reveal key={u.label} delay={0.15 + i * 0.08}>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-body-sm font-medium text-foreground">
                      <IconRenderer name={u.icon} size={15} className="text-primary" />
                      {u.label}
                    </span>
                    <span className="text-data-sm tabular-nums text-primary">
                      {u.value}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted-surface">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--accent) 85%, var(--primary)))",
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${u.value}%` }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Card>
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Why now — BentoGrid-style highlights                                       */
/* -------------------------------------------------------------------------- */

export function WhyNowBento({
  items,
}: {
  items: { title: string; description: string; icon: string; span?: "1x1" | "2x1" | "2x2" }[];
}) {
  const spanClass: Record<string, string> = {
    "1x1": "lg:col-span-2",
    "2x1": "lg:col-span-4",
    "2x2": "lg:col-span-4 lg:row-span-2",
  };
  return (
    <div className="grid auto-rows-[minmax(10rem,1fr)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <Reveal
          key={item.title}
          delay={Math.min(i * 0.07, 0.35)}
          className={cn(spanClass[item.span ?? "1x1"])}
        >
          <Card
            variant="glass"
            className="group/bento relative flex h-full flex-col gap-3 overflow-hidden p-6"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-accent-subtle opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            />
            <span className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
              <IconRenderer name={item.icon} size={20} />
            </span>
            <h3 className="relative text-h5 text-balance text-foreground">
              {item.title}
            </h3>
            <p className="relative text-body-sm text-pretty text-muted-foreground">
              {item.description}
            </p>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Animated headline StatGrid wrapper                                         */
/* -------------------------------------------------------------------------- */

export function MetricsBand({ items }: { items: StatCounterProps[] }) {
  return (
    <Reveal>
      <Card variant="glass" className="overflow-hidden p-2">
        <StatGrid
          items={items}
          cols={4}
          className="gap-px [&>div]:items-center [&>div]:rounded-xl [&>div]:bg-card/40 [&>div]:p-6 [&>div]:text-center [&_.text-data]:text-h2"
        />
      </Card>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/* Closing CTA                                                                */
/* -------------------------------------------------------------------------- */

export function ClosingCta({
  href,
  label,
  secondaryHref,
  secondaryLabel,
}: {
  href: string;
  label: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <Reveal>
      <Card
        variant="glass"
        className="relative overflow-hidden p-10 text-center md:p-16"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 120% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 65%), radial-gradient(60% 100% at 50% 100%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
          }}
        />
        <Badge variant="neutral" className="gap-2 border border-border/70 bg-card/60 text-overline">
          <IconRenderer name="handshake" size={13} className="text-accent" />
          Let&rsquo;s talk
        </Badge>
        <h2 className="mx-auto mt-5 max-w-2xl text-balance text-h1 text-foreground">
          Build the future of career growth with us.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-body-lg text-muted-foreground">
          Dive into the full data room or request a live walkthrough with the
          founding team.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={href}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-body font-semibold text-primary-foreground shadow-elevation-2 transition-all hover:shadow-elevation-4 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {label}
            <IconRenderer
              name="arrow-right"
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3 text-body font-semibold text-foreground backdrop-blur-[var(--blur-glass)] transition-all hover:bg-accent-subtle hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <IconRenderer name="mail" size={17} className="text-accent" />
            {secondaryLabel}
          </Link>
        </div>
      </Card>
    </Reveal>
  );
}
