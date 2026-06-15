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
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from "@/components/ui/Tabs";
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
import {
  FollowingPointer,
  GlowingEffect,
  NoiseBackground,
} from "@/components/aceternity";

/* ------------------------------------------------------------------ *
 * Serializable data shapes - every value crossing the server→client   *
 * boundary is a primitive or icon NAME string (never a component ref). *
 * ------------------------------------------------------------------ */

export interface PillarHighlightData {
  icon: string;
  label: string;
}

export interface PillarData {
  id: string;
  title: string;
  /** First word of the title, used in the "Explore X" affordance. */
  short: string;
  description: string;
  href: string;
  icon: string;
  /** Bento footprint classes for the lg grid. */
  span: string;
  highlights: PillarHighlightData[];
  meta: string;
}

export interface StatData {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

/* ------------------------------------------------------------------ *
 * Shared motion variants                                              *
 * ------------------------------------------------------------------ */

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
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
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------ *
 * HERO - Spotlight + Anime.js sequenced headline                      *
 * ------------------------------------------------------------------ */

export function FeaturesHero({
  titleLead,
  titleHighlight,
  titleTail,
  subtitle,
}: {
  titleLead: string;
  titleHighlight: string;
  titleTail: string;
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
  // Re-derive which words belong to the highlighted middle phrase so we can
  // gradient-tint exactly those, while still animating word-by-word.
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
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] mask-[radial-gradient(60%_50%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--border) 80%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <Stack gap={6} align="center" className="mx-auto max-w-3xl text-center">
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
                    ? "bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
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

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <HeroCta href="/features/career" variant="primary">
            Explore career tools
            <IconRenderer name="arrow-right" size={16} />
          </HeroCta>
          <HeroCta href="/pricing" variant="ghost">
            See pricing
          </HeroCta>
        </motion.div>
      </Stack>
    </Section>
  );
}

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
 * PILLARS - Bento layout of CardSpotlight cells, lead pillar is a 3D  *
 * tilt card. Scroll-reveal + stagger.                                 *
 * ------------------------------------------------------------------ */

export function PillarBento({ pillars }: { pillars: PillarData[] }) {
  const reduce = useReducedMotion();
  const [lead, ...rest] = pillars;

  return (
    <Section className="pt-2">
      <FollowingPointer label="Explore">
        <GlowingEffect>
          <motion.div
            variants={reduce ? undefined : staggerParent}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, amount: 0.2 }}
            className="grid auto-rows-[minmax(13rem,1fr)] grid-cols-1 gap-5 lg:grid-cols-3"
          >
            {/* Lead pillar - spans 2 cols / 2 rows with a 3D tilt surface. */}
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
        </GlowingEffect>
      </FollowingPointer>
    </Section>
  );
}

function PillarChips({ highlights }: { highlights: PillarHighlightData[] }) {
  return (
    <ul className="mt-auto flex flex-wrap gap-2" aria-label="Highlights">
      {highlights.map(({ icon, label }) => (
        <li key={label}>
          <Tooltip delay={150}>
            <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-border/60 bg-muted-surface px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:text-foreground">
              <IconRenderer name={icon} size={14} />
              {label}
            </span>
            <Tooltip.Content showArrow placement="top">
              <Tooltip.Arrow />
              {label}
            </Tooltip.Content>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
}

function PillarMeta({
  pillar,
}: {
  pillar: PillarData;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
      Explore {pillar.short}
      <IconRenderer
        name="arrow-right"
        size={16}
        className="transition-transform duration-200 motion-safe:group-hover:translate-x-1"
      />
    </span>
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
        {/* Brand gradient wash - token color-mix only. */}
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
              {pillar.meta}
            </Badge>
          </div>

          <Stack gap={3}>
            <h2 className="text-h2 text-balance text-foreground">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                {pillar.title}
              </span>
            </h2>
            <p className="text-body text-pretty text-muted-foreground">
              {pillar.description}
            </p>
          </Stack>

          <PillarChips highlights={pillar.highlights} />
          <PillarMeta pillar={pillar} />
        </div>
      </Card>
    </CardSpotlight>
  );

  return (
    <Link
      href={pillar.href}
      aria-label={`${pillar.title} - ${pillar.meta}`}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {reduce ? (
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
      )}
    </Link>
  );
}

function PillarCell({ pillar }: { pillar: PillarData }) {
  return (
    <Link
      href={pillar.href}
      aria-label={`${pillar.title} - ${pillar.meta}`}
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <CardSpotlight className="h-full border-0 bg-transparent p-0">
        <Card
          variant="interactive"
          className="relative flex h-full flex-col gap-5 overflow-hidden p-7 shadow-elevation-1 motion-safe:transition-transform motion-safe:group-hover:-translate-y-1"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-accent-subtle opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="relative flex h-full flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <span
                aria-hidden
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent"
              >
                <IconRenderer name={pillar.icon} size={24} />
              </span>
              <Badge variant="neutral" size="md">
                {pillar.meta}
              </Badge>
            </div>
            <Stack gap={2}>
              <h2 className="text-h4 text-balance text-foreground">
                {pillar.title}
              </h2>
              <p className="text-body-sm text-pretty text-muted-foreground">
                {pillar.description}
              </p>
            </Stack>
            <PillarChips highlights={pillar.highlights} />
            <PillarMeta pillar={pillar} />
          </div>
        </Card>
      </CardSpotlight>
    </Link>
  );
}

/* ------------------------------------------------------------------ *
 * STATS - animated counters on a glass band                          *
 * ------------------------------------------------------------------ */

export function FeatureStats({ stats }: { stats: StatData[] }) {
  const reduce = useReducedMotion();
  return (
    <Section className="pt-2">
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
 * BENEFITS - Tabs over the 3 pillars, each panel a mini bento of      *
 * CardSpotlight benefit cells. Adds depth + HeroUI interactivity.     *
 * ------------------------------------------------------------------ */

export interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

export interface BenefitTab {
  id: string;
  label: string;
  items: BenefitItem[];
}

export function BenefitTabs({
  heading,
  description,
  tabs,
}: {
  heading: string;
  description: string;
  tabs: BenefitTab[];
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section className="pt-2">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-h2 text-balance text-foreground">{heading}</h2>
        <p className="text-body-lg mt-4 text-pretty text-muted-foreground">
          {description}
        </p>
      </header>

      <div ref={ref}>
        <Tabs defaultSelectedKey={tabs[0]?.id} variant="primary">
          <TabList
            aria-label="Capabilities by pillar"
            className="mx-auto mb-8 w-fit"
          >
            {tabs.map((t) => (
              <Tab key={t.id} id={t.id}>
                {t.label}
              </Tab>
            ))}
          </TabList>

          {tabs.map((t) => (
            <TabPanel key={t.id} id={t.id}>
              <motion.div
                variants={reduce ? undefined : staggerParent}
                initial={reduce ? false : "hidden"}
                animate={reduce ? undefined : inView ? "show" : "hidden"}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {t.items.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={reduce ? undefined : cardReveal}
                  >
                    <CardSpotlight className="group h-full border-border p-6">
                      <span
                        aria-hidden
                        className="mb-4 inline-flex size-11 items-center justify-center rounded-lg bg-accent-subtle text-accent"
                      >
                        <IconRenderer name={item.icon} size={22} />
                      </span>
                      <h3 className="text-h5 text-balance text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-body-sm mt-2 text-pretty text-muted-foreground">
                        {item.description}
                      </p>
                    </CardSpotlight>
                  </motion.div>
                ))}
              </motion.div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * CLOSING CTA - gradient glass band with motion buttons              *
 * ------------------------------------------------------------------ */

export function FeaturesCta({
  headline,
  body,
}: {
  headline: string;
  body: string;
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
        <NoiseBackground>
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
                <IconRenderer name="layers" size={24} />
              </span>
              <h2 className="text-h2 text-balance text-foreground">
                <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {headline}
                </span>
              </h2>
              <p className="text-body-lg text-pretty text-muted-foreground">
                {body}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <HeroCta href="/features/career" variant="primary">
                  Browse career tools
                  <IconRenderer name="arrow-right" size={16} />
                </HeroCta>
                <HeroCta href="/pricing" variant="ghost">
                  See pricing
                </HeroCta>
              </div>
            </Stack>
          </Card>
        </NoiseBackground>
      </motion.div>
    </Section>
  );
}
