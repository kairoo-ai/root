"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import CompetitiveChart from "@/components/CompetitiveChart";
import GrowthChart from "@/components/GrowthChart";

/* ------------------------------------------------------------------ */
/* Scroll reveal — single source, reduced-motion aware.                */
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
/* Market sizing — headline figure + sub-segments.                     */
/* ------------------------------------------------------------------ */

const subSegments = [
  { value: "$87B", label: "Corporate Learning" },
  { value: "$12B", label: "Career Services" },
  { value: "$43B", label: "AI in Education" },
  { value: "$24B", label: "Professional Development" },
];

export function MarketSizePanel() {
  return (
    <Stack gap={6}>
      <CardSpotlight className="rounded-2xl p-10 text-center">
        <Badge variant="info" size="md" className="mx-auto mb-4">
          Global EdTech Market
        </Badge>
        <div className="text-display tabular-nums text-foreground">$366B</div>
        <p className="mt-2 text-body-lg text-muted-foreground">
          Total global education-technology spend
        </p>
        <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-body font-semibold text-primary">
          <TrendingUp className="size-4" aria-hidden /> Growing at 16.3% CAGR
        </p>
      </CardSpotlight>

      <Grid cols={2} gap="md">
        {subSegments.map((s) => (
          <Card key={s.label} variant="interactive" className="p-6 text-center">
            <div className="text-h2 tabular-nums text-foreground">{s.value}</div>
            <p className="mt-1 text-body-sm text-muted-foreground">{s.label}</p>
          </Card>
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
    desc: "Combined EdTech, Career Development, and AI-powered learning market.",
  },
  {
    icon: Target,
    title: "Serviceable Addressable Market (SAM)",
    value: "$28B",
    desc: "AI-powered professional development platforms in English-speaking markets.",
  },
  {
    icon: Crosshair,
    title: "Serviceable Obtainable Market (SOM)",
    value: "$840M",
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
    <Card variant="elevated" className="p-8">
      <h3 className="text-h4 text-foreground">Target Addressable Market (TAM)</h3>
      <Stack gap={6} className="mt-6">
        {tam.map((t, i) => {
          const Icon = t.icon;
          return (
            <Reveal key={t.title} delay={i * 0.08}>
              <div className="flex flex-col gap-1">
                <h4 className="flex items-center gap-2 text-overline text-primary">
                  <Icon className="size-4" aria-hidden />
                  {t.title}
                </h4>
                <p className="text-pretty text-body text-muted-foreground">
                  <span className="text-h3 tabular-nums text-foreground">
                    {t.value}
                  </span>{" "}
                  — {t.desc}
                </p>
              </div>
            </Reveal>
          );
        })}

        <div className="rounded-xl border border-success/30 bg-success/10 p-5">
          <h4 className="text-body font-semibold text-success">
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
/* Competitive intelligence — three categories of cards.               */
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
    title: "Kairoo Advantage",
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

export function CompetitorCards() {
  return (
    <RevealStagger>
      <Grid cols={3} gap="lg">
        {competitorCards.map((cat) => {
          const Icon = cat.icon;
          return (
            <RevealItem key={cat.title}>
              <Card
                variant={cat.isAdvantage ? "elevated" : "default"}
                className={cn(
                  "h-full p-6",
                  cat.isAdvantage && "ring-2 ring-primary",
                )}
              >
                <Icon
                  className={cn("mx-auto size-8", toneText[cat.tone])}
                  aria-hidden
                />
                <h3
                  className={cn(
                    "mt-3 text-center text-h5",
                    toneText[cat.tone],
                  )}
                >
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
                      <p className="text-caption text-muted-foreground">
                        {r.detail}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-caption",
                          cat.isAdvantage
                            ? "text-info"
                            : "text-muted-foreground",
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
            </RevealItem>
          );
        })}
      </Grid>
    </RevealStagger>
  );
}

/* ------------------------------------------------------------------ */
/* Chart cards.                                                        */
/* ------------------------------------------------------------------ */

export function PositioningChartCard() {
  return (
    <Card variant="glass" className="p-8">
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
  );
}

const trajectoryStats = [
  { value: "8,250", label: "Total Users", className: "text-primary" },
  { value: "1,049", label: "Paid Users", className: "text-info" },
  { value: "$30.4K", label: "Monthly Revenue", className: "text-success" },
  { value: "12.7%", label: "Conversion Rate", className: "text-accent" },
];

export function TrajectoryChartCard() {
  return (
    <Card variant="glass" className="p-8">
      <h3 className="text-h4 text-foreground">90-Day Growth Trajectory</h3>
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
          <div key={s.label} className="text-center">
            <div className={cn("text-h3 tabular-nums", s.className)}>
              {s.value}
            </div>
            <p className="text-caption text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </Grid>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* GTM channels + formats + tactics.                                   */
/* ------------------------------------------------------------------ */

const channels = [
  {
    icon: Megaphone,
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
    icon: Users,
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
    icon: Rocket,
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

export function ChannelsPanel() {
  return (
    <Card variant="elevated" className="h-full p-8">
      <h3 className="text-h4 text-foreground">Primary Launch Channels</h3>
      <Stack gap={6} className="mt-6">
        {channels.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="border-l-2 border-primary pl-5">
                <h4 className="flex items-center gap-2 text-h6 text-foreground">
                  <Icon className="size-4 text-primary" aria-hidden />
                  {c.title}
                </h4>
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
                <Badge variant="info" size="sm" className="mt-3">
                  Expected: {c.expected}
                </Badge>
              </div>
            </Reveal>
          );
        })}
      </Stack>
    </Card>
  );
}

const formats = [
  {
    title: "Interactive Career Assessments",
    desc: "Free tools that capture leads while providing value.",
    metric: "Conversion: 15-25%",
  },
  {
    title: "Industry Salary Reports",
    desc: "AI-generated market intelligence reports.",
    metric: "Viral potential: High",
  },
  {
    title: "Video Course Previews",
    desc: "Short-form educational content on TikTok/YouTube.",
    metric: "Reach: 1M+ monthly views",
  },
];

const tactics = [
  {
    title: "Product Hunt Launch",
    desc: "Target #1 Product of the Day with a coordinated campaign.",
    metric: "Expected: 5K signups in 24 hours",
  },
  {
    title: "Beta Program",
    desc: "100 power users get lifetime discounts for feedback.",
    metric: "Expected: 85% retention rate",
  },
  {
    title: "Freemium Model",
    desc: "Core features free forever, premium for advanced tools.",
    metric: "Conversion: 8-12% to paid",
  },
];

function MetricList({
  heading,
  accent,
  items,
}: {
  heading: string;
  accent: string;
  items: { title: string; desc: string; metric: string }[];
}) {
  return (
    <Card variant="elevated" className="p-8">
      <h3 className={cn("text-h4", accent)}>{heading}</h3>
      <Stack gap={3} className="mt-6">
        {items.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-border bg-muted-surface/40 p-4"
          >
            <h4 className="text-body-sm font-semibold text-foreground">
              {f.title}
            </h4>
            <p className="text-caption text-muted-foreground">{f.desc}</p>
            <p className={cn("mt-1 text-caption font-medium", accent)}>
              {f.metric}
            </p>
          </div>
        ))}
      </Stack>
    </Card>
  );
}

export function FormatsAndTacticsPanel() {
  return (
    <Stack gap={8}>
      <MetricList
        heading="High-Impact Content Formats"
        accent="text-primary"
        items={formats}
      />
      <MetricList
        heading="Early User Acquisition Tactics"
        accent="text-accent"
        items={tactics}
      />
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/* First-90-days monthly milestone cards.                              */
/* ------------------------------------------------------------------ */

const months = [
  {
    month: "Month 1",
    title: "Foundation & Launch",
    metrics: { users: "1,250", paid: "125", mrr: "$3,625", cac: "$28" },
  },
  {
    month: "Month 2",
    title: "Optimization & Scale",
    metrics: { users: "2,800", paid: "336", mrr: "$9,744", cac: "$24" },
    popular: true,
  },
  {
    month: "Month 3",
    title: "Growth & Retention",
    metrics: { users: "4,200", paid: "588", mrr: "$17,052", cac: "$21" },
  },
];

const metricLabel: Record<string, string> = {
  users: "New Users",
  paid: "Paid Conversions",
  mrr: "MRR",
  cac: "CAC",
};

export function MonthCards() {
  return (
    <RevealStagger>
      <Grid cols={3} gap="lg">
        {months.map((m) => (
          <RevealItem key={m.month}>
            <Card
              variant={m.popular ? "elevated" : "interactive"}
              className={cn(
                "h-full p-8",
                m.popular && "ring-2 ring-primary",
              )}
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
                {Object.entries(m.metrics).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                  >
                    <span className="text-body-sm text-muted-foreground">
                      {metricLabel[k]}
                    </span>
                    <span
                      className={cn(
                        "text-body-sm font-bold tabular-nums",
                        k === "mrr" ? "text-success" : "text-foreground",
                      )}
                    >
                      {v}
                    </span>
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
