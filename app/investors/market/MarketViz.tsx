"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { animate, stagger } from "animejs";
import {
  Globe,
  Target,
  Crosshair,
  Zap,
  Circle,
  Crown,
  TrendingUp,
  Rocket,
  Users,
  Megaphone,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import {
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { Spotlight } from "@/components/motion/Spotlight";
import { CardContainer, CardBody, CardItem } from "@/components/motion/ThreeDCard";
import { BentoGrid, type BentoItem } from "@/components/blocks/BentoGrid";
import { StatCounter, StatGrid } from "@/components/blocks/StatCounter";
import CompetitiveChart from "@/components/CompetitiveChart";
import GrowthChart from "@/components/GrowthChart";

/* ------------------------------------------------------------------ */
/* Shared gradients (token-only via color-mix) - teal → navy washes.   */
/* ------------------------------------------------------------------ */

const tealNavyWash =
  "linear-gradient(135deg, color-mix(in oklab, var(--primary) 14%, transparent), color-mix(in oklab, var(--accent) 16%, transparent))";
const tealNavyBorder =
  "linear-gradient(135deg, color-mix(in oklab, var(--primary) 45%, transparent), color-mix(in oklab, var(--accent) 45%, transparent))";

/* ------------------------------------------------------------------ */
/* Scroll reveal - single source, reduced-motion aware.                */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const MotionTag = as === "li" ? motion.li : motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered container for grids of cards. */
export function RevealStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1 },
    },
  };
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* HERO - Spotlight + anime.js entrance sequence + headline stats.     */
/* ------------------------------------------------------------------ */

const heroStats = [
  { value: 366, prefix: "$", suffix: "B", label: "Global EdTech market" },
  { value: 16.3, suffix: "%", label: "CAGR through 2030" },
  { value: 840, prefix: "$", suffix: "M", label: "Serviceable obtainable" },
  { value: 68, suffix: "%", label: "Cheaper than incumbents" },
];

export function MarketHero({
  eyebrow,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !rootRef.current) return;
    const targets = rootRef.current.querySelectorAll<HTMLElement>(
      "[data-hero-seq]",
    );
    if (!targets.length) return;
    const animation = animate(targets, {
      opacity: [0, 1],
      translateY: [28, 0],
      filter: ["blur(8px)", "blur(0px)"],
      delay: stagger(120, { start: 120 }),
      duration: 900,
      ease: "out(3)",
    });
    return () => {
      animation.cancel();
    };
  }, [reduce]);

  return (
    <section className="relative isolate overflow-hidden py-[var(--layout-section-y)]">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
      {/* token-only aurora backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(55% 55% at 15% 0%, color-mix(in oklab, var(--primary) 16%, transparent) 0%, transparent 60%)",
            "radial-gradient(45% 45% at 88% 8%, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 55%)",
            "radial-gradient(70% 60% at 50% 130%, color-mix(in oklab, var(--primary) 10%, transparent) 0%, transparent 60%)",
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

      <div className="mx-auto max-w-5xl px-6">
        <div ref={rootRef} className="mx-auto max-w-3xl text-center">
          <span
            data-hero-seq
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-overline text-primary backdrop-blur-[var(--blur-glass)]"
          >
            <Sparkles className="size-3.5" aria-hidden />
            {eyebrow}
          </span>

          <h1
            data-hero-seq
            className="mt-6 text-balance text-display text-foreground"
          >
            Market Analysis &{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, var(--primary), color-mix(in oklab, var(--primary) 40%, var(--accent)))",
              }}
            >
              Go-to-Market Strategy
            </span>
          </h1>

          <p
            data-hero-seq
            className="mx-auto mt-5 max-w-2xl text-pretty text-body-lg text-muted-foreground"
          >
            Comprehensive market research, competitive intelligence, and
            strategic go-to-market planning for {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}&rsquo;s entry into the
            $366B global education-technology market.
          </p>

          <div
            data-hero-seq
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <a
              href={primaryCta.href}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {primaryCta.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <a
              href={secondaryCta.href}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-6 text-base font-semibold text-foreground transition-colors hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {secondaryCta.label}
            </a>
          </div>
        </div>

        {/* Headline stat band - glass, animated counters */}
        <div
          data-hero-seq={reduce ? undefined : true}
          className="mt-14 rounded-2xl border border-border/60 bg-card/60 p-1 backdrop-blur-[var(--blur-glass)]"
          style={{ backgroundImage: tealNavyWash }}
        >
          <StatGrid
            cols={4}
            gap="md"
            className="rounded-xl bg-card/70 p-6 text-center backdrop-blur-[var(--blur-glass)] [&>div]:items-center"
            items={heroStats}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading - eyebrow + title + subtitle, gradient eyebrow.     */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 text-overline text-primary">
          <span
            aria-hidden
            className="h-px w-8"
            style={{ backgroundImage: tealNavyBorder }}
          />
          {eyebrow}
          <span
            aria-hidden
            className="h-px w-8"
            style={{ backgroundImage: tealNavyBorder }}
          />
        </p>
        <h2 className="mt-3 text-balance text-h1 text-foreground">{title}</h2>
        {subtitle ? (
          <p className="mt-4 text-pretty text-body-lg text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Market sizing - 3D headline card + animated sub-segment counters.   */
/* ------------------------------------------------------------------ */

const subSegments = [
  { value: 87, prefix: "$", suffix: "B", label: "Corporate Learning" },
  { value: 12, prefix: "$", suffix: "B", label: "Career Services" },
  { value: 43, prefix: "$", suffix: "B", label: "AI in Education" },
  { value: 24, prefix: "$", suffix: "B", label: "Professional Development" },
];

export function MarketSizePanel() {
  const reduce = useReducedMotion();
  return (
    <Stack gap={6}>
      <CardContainer
        containerClassName="!py-0"
        className="w-full"
      >
        <CardBody className="w-full">
          <CardSpotlight
            className="rounded-2xl p-10 text-center"
            style={reduce ? undefined : { backgroundImage: tealNavyWash }}
          >
            <CardItem translateZ={reduce ? 0 : 40} className="mx-auto">
              <Badge variant="info" size="md" className="mx-auto mb-4">
                Global EdTech Market
              </Badge>
            </CardItem>
            <CardItem translateZ={reduce ? 0 : 60} className="mx-auto">
              <StatCounter
                value={366}
                prefix="$"
                suffix="B"
                label=""
                className="items-center [&>span:first-child]:text-display [&>span:last-child]:hidden"
              />
            </CardItem>
            <CardItem translateZ={reduce ? 0 : 30} className="mx-auto">
              <p className="mt-2 text-body-lg text-muted-foreground">
                Total global education-technology spend
              </p>
              <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-body font-semibold text-primary">
                <TrendingUp className="size-4" aria-hidden /> Growing at 16.3%
                CAGR
              </p>
            </CardItem>
          </CardSpotlight>
        </CardBody>
      </CardContainer>

      <Grid cols={2} gap="md">
        {subSegments.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <Card
              variant="interactive"
              className="group h-full p-6 text-center"
            >
              <div className="text-h2 tabular-nums text-foreground">
                <StatCounter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  label={s.label}
                  className="items-center"
                />
              </div>
            </Card>
          </Reveal>
        ))}
      </Grid>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/* TAM / SAM / SOM funnel + growth drivers.                            */
/* ------------------------------------------------------------------ */

const tam = [
  {
    icon: Globe,
    title: "Total Addressable Market",
    value: "$142B",
    pct: 100,
    desc: "Combined EdTech, Career Development, and AI-powered learning market.",
  },
  {
    icon: Target,
    title: "Serviceable Addressable Market (SAM)",
    value: "$28B",
    pct: 56,
    desc: "AI-powered professional development platforms in English-speaking markets.",
  },
  {
    icon: Crosshair,
    title: "Serviceable Obtainable Market (SOM)",
    value: "$840M",
    pct: 24,
    desc: "Realistic 3% market capture over 5 years with an aggressive growth strategy.",
  },
];

const drivers = [
  "Remote work acceleration (+300% since 2020)",
  "Skills gap crisis (87% of executives report gaps)",
  "AI adoption in education (+45% annually)",
  "Career mobility increase (+28% job changes)",
];

export function TamPanel() {
  return (
    <Card variant="glass" className="h-full p-8">
      <h3 className="text-h4 text-foreground">Target Addressable Market (TAM)</h3>
      <p className="mt-1 text-body-sm text-muted-foreground">
        From the full opportunity down to what {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} can realistically capture.
      </p>
      <Stack gap={5} className="mt-6">
        {tam.map((t, i) => {
          const Icon = t.icon;
          return (
            <Reveal key={t.title} delay={i * 0.08}>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="flex items-center gap-2 text-overline text-primary">
                    <Icon className="size-4" aria-hidden />
                    {t.title}
                  </h4>
                  <span className="text-h3 tabular-nums text-foreground">
                    {t.value}
                  </span>
                </div>
                {/* funnel bar - teal→navy fill, token only */}
                <div className="h-2.5 overflow-hidden rounded-full bg-muted-surface">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundImage: tealNavyBorder }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${t.pct}%` }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
                  />
                </div>
                <p className="text-pretty text-body-sm text-muted-foreground">
                  {t.desc}
                </p>
              </div>
            </Reveal>
          );
        })}

        <div className="rounded-xl border border-success/30 bg-success/10 p-5">
          <h4 className="flex items-center gap-2 text-body font-semibold text-success">
            <TrendingUp className="size-4" aria-hidden />
            Market Growth Drivers
          </h4>
          <ul className="mt-2 space-y-1.5 text-body-sm text-muted-foreground">
            {drivers.map((d) => (
              <li key={d} className="flex gap-2">
                <span aria-hidden className="text-success">
                  •
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </Stack>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Competitive intelligence - three categories, ThreeDCard advantage.  */
/* ------------------------------------------------------------------ */

type CompetitorCard = {
  icon: typeof Zap;
  title: string;
  tone: "error" | "warning" | "info";
  isAdvantage?: boolean;
  rows: { name: string; detail: string; note: string }[];
};

const competitorCards: CompetitorCard[] = [
  {
    icon: Zap,
    title: "Direct Competitors",
    tone: "error",
    rows: [
      {
        name: "Coursera for Business",
        detail: "$92/month per user",
        note: "No career-specific tools integration",
      },
      {
        name: "LinkedIn Learning",
        detail: "$29.99/month",
        note: "Generic paths, no AI personalization",
      },
      {
        name: "Pluralsight",
        detail: "$45/month",
        note: "Limited to technical skills only",
      },
    ],
  },
  {
    icon: Circle,
    title: "Indirect Competitors",
    tone: "warning",
    rows: [
      {
        name: "MasterClass",
        detail: "$180/year",
        note: "Entertainment > practical career skills",
      },
      {
        name: "Udemy Business",
        detail: "$360/year per user",
        note: "Quality inconsistency, no career integration",
      },
      {
        name: "Skillshare",
        detail: "$168/year",
        note: "Lacks professional career development tools",
      },
    ],
  },
  {
    icon: Crown,
    title: `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} Advantage`,
    tone: "info",
    isAdvantage: true,
    rows: [
      {
        name: "Integrated Ecosystem",
        detail: "Learning + Career + Business tools",
        note: "70% time savings vs multiple tools",
      },
      {
        name: "AI-Powered Personalization",
        detail: "Adaptive learning paths",
        note: "3x faster skill acquisition",
      },
      {
        name: "Competitive Pricing",
        detail: "$29/month vs $92+",
        note: "68% cost reduction for same value",
      },
    ],
  },
];

const toneText: Record<CompetitorCard["tone"], string> = {
  error: "text-destructive",
  warning: "text-warning",
  info: "text-info",
};
const toneChip: Record<CompetitorCard["tone"], string> = {
  error: "bg-destructive/10",
  warning: "bg-warning/10",
  info: "bg-info/10",
};

function CompetitorCardInner({ cat }: { cat: CompetitorCard }) {
  const Icon = cat.icon;
  return (
    <Card
      variant={cat.isAdvantage ? "elevated" : "default"}
      className={cn(
        "h-full p-6",
        cat.isAdvantage && "ring-2 ring-primary",
      )}
      style={
        cat.isAdvantage ? { backgroundImage: tealNavyWash } : undefined
      }
    >
      <span
        aria-hidden
        className={cn(
          "mx-auto flex size-12 items-center justify-center rounded-xl",
          toneChip[cat.tone],
        )}
      >
        <Icon className={cn("size-6", toneText[cat.tone])} />
      </span>
      <h3 className={cn("mt-3 text-center text-h5", toneText[cat.tone])}>
        {cat.title}
      </h3>
      <Stack gap={3} className="mt-4">
        {cat.rows.map((r) => (
          <div
            key={r.name}
            className={cn("rounded-lg p-3", toneChip[cat.tone])}
          >
            <h4 className="text-body-sm font-semibold text-foreground">
              {r.name}
            </h4>
            <p className="text-caption text-muted-foreground">{r.detail}</p>
            <p
              className={cn(
                "mt-1 text-caption",
                cat.isAdvantage ? "text-info" : "text-muted-foreground",
              )}
            >
              <span className="font-semibold">
                {cat.isAdvantage ? "Advantage:" : "Weakness:"}
              </span>{" "}
              {r.note}
            </p>
          </div>
        ))}
      </Stack>
    </Card>
  );
}

export function CompetitorCards() {
  const reduce = useReducedMotion();
  return (
    <RevealStagger>
      <Grid cols={3} gap="lg">
        {competitorCards.map((cat) => (
          <RevealItem key={cat.title}>
            {cat.isAdvantage && !reduce ? (
              <CardContainer containerClassName="!py-0" className="h-full w-full">
                <CardBody className="h-full w-full">
                  <CardItem translateZ={40} className="!w-full">
                    <CompetitorCardInner cat={cat} />
                  </CardItem>
                </CardBody>
              </CardContainer>
            ) : (
              <CompetitorCardInner cat={cat} />
            )}
          </RevealItem>
        ))}
      </Grid>
    </RevealStagger>
  );
}

/* ------------------------------------------------------------------ */
/* Chart cards - glass panels, gradient frame.                         */
/* ------------------------------------------------------------------ */

function GlassChartFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl p-px"
      style={{ backgroundImage: tealNavyBorder }}
    >
      {children}
    </div>
  );
}

export function PositioningChartCard() {
  return (
    <GlassChartFrame>
      <Card variant="glass" className="rounded-[calc(1rem-1px)] p-8">
        <h3 className="text-h4 text-foreground">
          Competitive Positioning Matrix
        </h3>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Feature Completeness × Price Level
        </p>
        <div className="mt-6">
          <CompetitiveChart />
        </div>
        <p className="mt-4 text-body-sm text-muted-foreground">
          Positioned as a high-value, moderate-cost solution with superior AI
          integration and a comprehensive feature set.
        </p>
      </Card>
    </GlassChartFrame>
  );
}

const trajectoryStats = [
  { value: 8250, label: "Total Users", className: "text-primary" },
  { value: 1049, label: "Paid Users", className: "text-info" },
  { value: 30.4, prefix: "$", suffix: "K", label: "Monthly Revenue", className: "text-success" },
  { value: 12.7, suffix: "%", label: "Conversion Rate", className: "text-accent" },
];

export function TrajectoryChartCard() {
  return (
    <GlassChartFrame>
      <Card variant="glass" className="rounded-[calc(1rem-1px)] p-8">
        <h3 className="text-h4 text-foreground">90-Day Growth Trajectory</h3>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Twelve weeks from launch to 8,250 users and $30K+ in monthly revenue.
        </p>
        <div className="mt-6">
          <GrowthChart
            labels={[
              "Week 1",
              "Week 2",
              "Week 3",
              "Week 4",
              "Week 5",
              "Week 6",
              "Week 7",
              "Week 8",
              "Week 9",
              "Week 10",
              "Week 11",
              "Week 12",
            ]}
            totalUsers={[
              300, 650, 1000, 1250, 1800, 2400, 2800, 3500, 4200, 5000, 6200,
              8250,
            ]}
            paidUsers={[30, 78, 120, 125, 216, 288, 336, 420, 588, 650, 806, 1049]}
          />
        </div>
        <Grid cols={4} gap="md" className="mt-8">
          {trajectoryStats.map((s) => (
            <StatCounter
              key={s.label}
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              label={s.label}
              className={cn("items-center text-center [&>span:first-child]:text-h3", s.className)}
            />
          ))}
        </Grid>
      </Card>
    </GlassChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* GTM - Bento grid of demand engines + formats/tactics.               */
/* ------------------------------------------------------------------ */

const channels = [
  {
    iconName: "megaphone",
    title: "Content Marketing Engine",
    items: [
      "AI-generated career guides and industry reports",
      "Weekly newsletter with 50K+ subscribers target",
      "SEO-optimized blog targeting career keywords",
      "Podcast appearances on career development shows",
    ],
    expected: "40% of new users",
  },
  {
    iconName: "users",
    title: "Strategic Partnerships",
    items: [
      "Integration with major HR platforms (BambooHR, Workday)",
      "Partnerships with coding bootcamps and universities",
      "Affiliate program with career coaches and consultants",
      "Corporate pilot programs with Fortune 500 companies",
    ],
    expected: "35% of new users",
  },
  {
    iconName: "rocket",
    title: "Community-Driven Growth",
    items: [
      "Private Slack/Discord community for power users",
      "User-generated success stories and case studies",
      "Referral program with meaningful incentives",
      "LinkedIn thought leadership campaign",
    ],
    expected: "25% of new users",
  },
];

const channelIcon: Record<string, typeof Megaphone> = {
  megaphone: Megaphone,
  users: Users,
  rocket: Rocket,
};

export function ChannelsPanel() {
  return (
    <Card variant="glass" className="h-full p-8">
      <h3 className="text-h4 text-foreground">Primary Launch Channels</h3>
      <p className="mt-1 text-body-sm text-muted-foreground">
        Three demand engines, each with its expected share of new users.
      </p>
      <Stack gap={5} className="mt-6">
        {channels.map((c, i) => {
          const Icon = channelIcon[c.iconName];
          return (
            <Reveal key={c.title} delay={i * 0.08}>
              <div
                className="rounded-xl border-l-2 border-primary bg-muted-surface/30 p-4 pl-5 transition-colors hover:bg-accent-subtle"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="flex items-center gap-2 text-h6 text-foreground">
                    <Icon className="size-4 text-primary" aria-hidden />
                    {c.title}
                  </h4>
                  <Badge variant="info" size="sm">
                    {c.expected}
                  </Badge>
                </div>
                <ul className="mt-2 space-y-1 text-body-sm text-muted-foreground">
                  {c.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span aria-hidden className="text-primary">
                        •
                      </span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </Stack>
    </Card>
  );
}

const formats: BentoItem[] = [
  {
    title: "Interactive Career Assessments",
    description: "Free tools that capture leads while providing value. Conversion: 15-25%.",
    span: "2x1",
  },
  {
    title: "Industry Salary Reports",
    description: "AI-generated market intelligence. Viral potential: high.",
  },
  {
    title: "Video Course Previews",
    description: "Short-form education on TikTok/YouTube. Reach: 1M+ monthly views.",
  },
];

const tactics: BentoItem[] = [
  {
    title: "Product Hunt Launch",
    description: "Target #1 Product of the Day. Expected: 5K signups in 24 hours.",
    span: "2x1",
  },
  {
    title: "Beta Program",
    description: "100 power users get lifetime discounts. Expected: 85% retention.",
  },
  {
    title: "Freemium Model",
    description: "Core free forever, premium for advanced tools. Conversion: 8-12%.",
  },
];

export function FormatsAndTacticsPanel() {
  return (
    <Stack gap={8}>
      <div>
        <h3 className="text-h4 text-primary">High-Impact Content Formats</h3>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Formats engineered for compounding, low-cost acquisition.
        </p>
        <BentoGrid asSection={false} items={formats} className="mt-5" />
      </div>
      <div>
        <h3 className="text-h4 text-accent">Early User Acquisition Tactics</h3>
        <p className="mt-1 text-body-sm text-muted-foreground">
          The launch-week playbook for a fast, credible start.
        </p>
        <BentoGrid asSection={false} items={tactics} className="mt-5" />
      </div>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/* First-90-days monthly milestone cards - animated metric counters.   */
/* ------------------------------------------------------------------ */

type MonthMetric = {
  key: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  highlight?: boolean;
};

const months: {
  month: string;
  title: string;
  popular?: boolean;
  metrics: MonthMetric[];
}[] = [
    {
      month: "Month 1",
      title: "Foundation & Launch",
      metrics: [
        { key: "users", label: "New Users", value: 1250 },
        { key: "paid", label: "Paid Conversions", value: 125 },
        { key: "mrr", label: "MRR", value: 3625, prefix: "$", highlight: true },
        { key: "cac", label: "CAC", value: 28, prefix: "$" },
      ],
    },
    {
      month: "Month 2",
      title: "Optimization & Scale",
      popular: true,
      metrics: [
        { key: "users", label: "New Users", value: 2800 },
        { key: "paid", label: "Paid Conversions", value: 336 },
        { key: "mrr", label: "MRR", value: 9744, prefix: "$", highlight: true },
        { key: "cac", label: "CAC", value: 24, prefix: "$" },
      ],
    },
    {
      month: "Month 3",
      title: "Growth & Retention",
      metrics: [
        { key: "users", label: "New Users", value: 4200 },
        { key: "paid", label: "Paid Conversions", value: 588 },
        { key: "mrr", label: "MRR", value: 17052, prefix: "$", highlight: true },
        { key: "cac", label: "CAC", value: 21, prefix: "$" },
      ],
    },
  ];

export function MonthCards() {
  return (
    <RevealStagger>
      <Grid cols={3} gap="lg">
        {months.map((m) => (
          <RevealItem key={m.month}>
            <Card
              variant={m.popular ? "elevated" : "interactive"}
              className={cn("h-full p-8", m.popular && "ring-2 ring-primary")}
              style={m.popular ? { backgroundImage: tealNavyWash } : undefined}
            >
              <div className="flex items-center justify-between">
                <div className="text-h3 text-primary">{m.month}</div>
                {m.popular ? (
                  <Badge variant="info" size="sm">
                    Inflection
                  </Badge>
                ) : null}
              </div>
              <h3 className="mt-1 text-h6 text-foreground">{m.title}</h3>
              <Stack gap={3} className="mt-5">
                {m.metrics.map((metric) => (
                  <div
                    key={metric.key}
                    className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                  >
                    <span className="text-body-sm text-muted-foreground">
                      {metric.label}
                    </span>
                    <StatCounter
                      value={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      label=""
                      className={cn(
                        "[&>span:first-child]:text-body-sm [&>span:first-child]:font-bold [&>span:last-child]:hidden",
                        metric.highlight
                          ? "[&>span:first-child]:text-success"
                          : "[&>span:first-child]:text-foreground",
                      )}
                    />
                  </div>
                ))}
              </Stack>
            </Card>
          </RevealItem>
        ))}
      </Grid>
    </RevealStagger>
  );
}

/* ------------------------------------------------------------------ */
/* Competitive pricing comparison - token-themed Table + tooltips.     */
/* The render-prop on TableBody must live in client scope.             */
/* ------------------------------------------------------------------ */

const competitiveRows = [
  {
    id: "coursera",
    platform: "Coursera for Business",
    type: "Direct",
    price: "$92/month per user",
    gap: "No career-specific tools integration",
  },
  {
    id: "linkedin",
    platform: "LinkedIn Learning",
    type: "Direct",
    price: "$29.99/month",
    gap: "Generic paths, no AI personalization",
  },
  {
    id: "pluralsight",
    platform: "Pluralsight",
    type: "Direct",
    price: "$45/month",
    gap: "Limited to technical skills only",
  },
  {
    id: "masterclass",
    platform: "MasterClass",
    type: "Indirect",
    price: "$180/year",
    gap: "Entertainment > practical career skills",
  },
  {
    id: "udemy",
    platform: "Udemy Business",
    type: "Indirect",
    price: "$360/year per user",
    gap: "Quality inconsistency, no career integration",
  },
  {
    id: "skillshare",
    platform: "Skillshare",
    type: "Indirect",
    price: "$168/year",
    gap: "Lacks professional career development tools",
  },
  {
    id: "kairoo",
    platform: `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
    type: "Our platform",
    price: "$29/month vs $92+",
    gap: "Integrated ecosystem · 3x faster · 68% cheaper",
  },
];

export function CompetitivePricingTable() {
  return (
    <div className="rounded-2xl p-px" style={{ backgroundImage: tealNavyBorder }}>
      <Card
        variant="glass"
        className="overflow-hidden rounded-[calc(1rem-1px)] p-0"
      >
        <Table aria-label="Competitive pricing and positioning comparison">
          <TableContent aria-label="Competitive pricing and positioning comparison">
            <TableHeader>
              <TableColumn id="platform" isRowHeader>
                Platform
              </TableColumn>
              <TableColumn id="type">Category</TableColumn>
              <TableColumn id="price">Price</TableColumn>
              <TableColumn id="gap">Gap vs. {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}</TableColumn>
            </TableHeader>
            <TableBody items={competitiveRows}>
              {(row) => (
                <TableRow
                  id={row.id}
                  className={cn(
                    row.type === "Our platform" && "bg-primary/5",
                  )}
                >
                  <TableCell>
                    <span
                      className={cn(
                        "font-semibold",
                        row.type === "Our platform"
                          ? "text-primary"
                          : "text-foreground",
                      )}
                    >
                      {row.platform}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.type === "Our platform"
                          ? "info"
                          : row.type === "Direct"
                            ? "error"
                            : "warning"
                      }
                      size="sm"
                    >
                      {row.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.gap}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableContent>
        </Table>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* First-90-days financial table.                                      */
/* ------------------------------------------------------------------ */

const ninetyDayRows = [
  {
    id: "m1",
    month: "Month 1 - Foundation & Launch",
    users: "1,250",
    paid: "125",
    mrr: "$3,625",
    cac: "$28",
  },
  {
    id: "m2",
    month: "Month 2 - Optimization & Scale",
    users: "2,800",
    paid: "336",
    mrr: "$9,744",
    cac: "$24",
  },
  {
    id: "m3",
    month: "Month 3 - Growth & Retention",
    users: "4,200",
    paid: "588",
    mrr: "$17,052",
    cac: "$21",
  },
];

export function NinetyDayTable() {
  return (
    <div className="rounded-2xl p-px" style={{ backgroundImage: tealNavyBorder }}>
      <Card
        variant="glass"
        className="overflow-hidden rounded-[calc(1rem-1px)] p-0"
      >
        <Table aria-label="First 90 days financial milestones">
          <TableContent aria-label="First 90 days financial milestones">
            <TableHeader>
              <TableColumn id="month" isRowHeader>
                Milestone
              </TableColumn>
              <TableColumn id="users">New Users</TableColumn>
              <TableColumn id="paid">Paid Conversions</TableColumn>
              <TableColumn id="mrr">MRR</TableColumn>
              <TableColumn id="cac">CAC</TableColumn>
            </TableHeader>
            <TableBody items={ninetyDayRows}>
              {(row) => (
                <TableRow id={row.id}>
                  <TableCell>
                    <span className="font-medium text-foreground">
                      {row.month}
                    </span>
                  </TableCell>
                  <TableCell>{row.users}</TableCell>
                  <TableCell>{row.paid}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-success">{row.mrr}</span>
                  </TableCell>
                  <TableCell>{row.cac}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableContent>
        </Table>
      </Card>
    </div>
  );
}
