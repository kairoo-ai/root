"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { ramps } from "@/lib/design/tokens/colors";
import ChartCanvas from "@/components/charts/ChartCanvas";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  Accordion,
  AccordionItem,
  AccordionHeading,
  AccordionTrigger,
  AccordionPanel,
  AccordionBody,
  AccordionIndicator,
} from "@/components/ui/Accordion";
import { Tabs } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";
import IconRenderer from "@/components/IconRenderer";
import { Spotlight } from "@/components/motion/Spotlight";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { StatGrid } from "@/components/blocks/StatCounter";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";

/* ----------------------------------------------------------------------------
 * Scroll-reveal — token-clean Motion wrapper that respects reduced motion.
 * -------------------------------------------------------------------------- */
export function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Hero — Spotlight + elaborate Anime.js entrance sequence (token-only).
 * -------------------------------------------------------------------------- */
const HERO_PILLS = [
  { icon: "target", label: "94/100 validated" },
  { icon: "users", label: "3 high-intent ICPs" },
  { icon: "layers", label: "24 features scored" },
  { icon: "rocket", label: "12-month roadmap" },
] as const;

export function StrategyHero() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !rootRef.current) return;
    const root = rootRef.current;
    const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

    animate(q("[data-hero-rise]"), {
      opacity: [0, 1],
      translateY: [28, 0],
      filter: ["blur(8px)", "blur(0px)"],
      delay: stagger(110, { start: 120 }),
      duration: 900,
      ease: "out(3)",
    });
    animate(q("[data-hero-pill]"), {
      opacity: [0, 1],
      scale: [0.85, 1],
      translateY: [12, 0],
      delay: stagger(80, { start: 620 }),
      duration: 700,
      ease: "out(4)",
    });
    animate(q("[data-hero-ring]"), {
      opacity: [0, 1],
      scale: [0.6, 1],
      duration: 1200,
      delay: 200,
      ease: "out(4)",
    });
  }, [reduce]);

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="var(--primary)" />
      <span
        aria-hidden
        data-hero-ring
        className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[34rem] rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />
      <div className="relative">
        <span data-hero-rise className="inline-block opacity-0">
          <Badge variant="info" size="md" className="mb-6 gap-2">
            <IconRenderer name="lightbulb" size={14} />
            Strategic Business Intelligence
          </Badge>
        </span>
        <h1 data-hero-rise className="text-display text-foreground opacity-0">
          SaaS Strategy &amp;{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(110deg, var(--primary), color-mix(in oklab, var(--accent) 80%, var(--primary)))",
            }}
          >
            Validation Framework
          </span>
        </h1>
        <p
          data-hero-rise
          className="mt-4 max-w-2xl text-body-lg text-muted-foreground opacity-0"
        >
          Comprehensive strategic analysis, market validation, and business intelligence for
          Kairoo — your complete guide to building and scaling a successful SaaS platform.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {HERO_PILLS.map((pill) => (
            <span
              key={pill.label}
              data-hero-pill
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-body-sm font-medium text-foreground opacity-0 backdrop-blur-[var(--blur-glass)]"
            >
              <IconRenderer name={pill.icon} size={16} className="text-primary" />
              {pill.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Validation score panel — hero score + animated StatGrid for every metric.
 * -------------------------------------------------------------------------- */
export function ValidationScorePanel() {
  return (
    <CardSpotlight className="rounded-2xl p-8 text-center md:p-10">
      <p className="text-overline text-muted-foreground">Overall Validation Score</p>
      <div className="mt-2 flex items-end justify-center gap-1">
        <StatGrid
          cols={1}
          gap="sm"
          className="w-auto"
          items={[{ value: 94, suffix: "/100", label: "Exceptional market opportunity" }]}
        />
      </div>
      <div
        aria-hidden
        className="mx-auto mt-6 h-px w-2/3"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--primary) 50%, transparent), transparent)",
        }}
      />
      <div className="mt-6">
        <StatGrid
          cols={2}
          gap="md"
          items={SUBSCORES.map((s) => ({
            value: s.value,
            suffix: "%",
            label: s.label,
          }))}
        />
      </div>
    </CardSpotlight>
  );
}

/* ----------------------------------------------------------------------------
 * Validation sub-scores — the four weighted dimensions behind 94/100.
 * -------------------------------------------------------------------------- */
const SUBSCORES = [
  { label: "Problem Urgency", value: 92 },
  { label: "Market Size", value: 96 },
  { label: "Willingness to Pay", value: 88 },
  { label: "Technical Feasibility", value: 98 },
] as const;

export function ValidationSubscores() {
  return (
    <Stack gap={4}>
      {SUBSCORES.map((item, i) => (
        <Reveal key={item.label} delay={i * 0.08}>
          <Card variant="glass" className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-body-sm font-medium text-foreground">
                {item.label}
              </span>
              <span className="text-data-sm tabular-nums text-primary">
                {item.value}%
              </span>
            </div>
            <Progress value={item.value} aria-label={`${item.label}: ${item.value} percent`} />
          </Card>
        </Reveal>
      ))}
    </Stack>
  );
}

/* ----------------------------------------------------------------------------
 * MoSCoW doughnut — token-themed via the OKLCH ramps (no raw hex/rgb).
 * -------------------------------------------------------------------------- */
const MOSCOW_SLICES = [
  { label: "Must Have", pct: 35, color: ramps.error[500] },
  { label: "Should Have", pct: 30, color: ramps.amber[500] },
  { label: "Could Have", pct: 25, color: ramps.gold[500] },
  { label: "Won't Have", pct: 10, color: ramps.neutral[400] },
] as const;

export function MoscowChart() {
  return (
    <ChartCanvas
      type="doughnut"
      ariaLabel="Feature prioritization split: Must Have 35%, Should Have 30%, Could Have 25%, Won't Have 10%"
      className="relative mx-auto h-80 w-full max-w-md"
      data={{
        labels: MOSCOW_SLICES.map((s) => s.label),
        datasets: [
          {
            data: MOSCOW_SLICES.map((s) => s.pct),
            backgroundColor: MOSCOW_SLICES.map((s) => s.color),
            borderColor: ramps.neutral[50],
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      }}
      options={{
        cutout: "62%",
        plugins: {
          legend: { position: "bottom", labels: { usePointStyle: true, padding: 18 } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}% of features`,
            },
          },
        },
      }}
      fallbackContent={
        <ul className="text-body-sm text-muted-foreground">
          {MOSCOW_SLICES.map((s) => (
            <li key={s.label}>
              {s.label}: {s.pct}% of features
            </li>
          ))}
        </ul>
      }
    />
  );
}

/* ----------------------------------------------------------------------------
 * MoSCoW detail — 24 itemized features inside an Accordion.
 * -------------------------------------------------------------------------- */
const MOSCOW_DETAIL = [
  {
    id: "must",
    title: "Must Have (Critical)",
    badge: "error" as const,
    pct: "35%",
    items: [
      "AI-powered career roadmap generation",
      "Core career tools suite (resume, interview, salary)",
      "Basic learning path creation",
      "User authentication and profiles",
      "Payment processing and subscriptions",
      "Mobile-responsive interface",
    ],
  },
  {
    id: "should",
    title: "Should Have (Important)",
    badge: "warning" as const,
    pct: "30%",
    items: [
      "Advanced AI tutoring chatbot",
      "Team analytics dashboard",
      "Progress tracking and analytics",
      "Integration with external platforms",
      "Advanced customization options",
      "Email automation and notifications",
    ],
  },
  {
    id: "could",
    title: "Could Have (Nice to Have)",
    badge: "info" as const,
    pct: "25%",
    items: [
      "AI-powered content creation tools",
      "Virtual reality learning modules",
      "Advanced business intelligence features",
      "White-label solutions",
      "Mobile app (iOS/Android)",
      "Advanced gamification elements",
    ],
  },
  {
    id: "wont",
    title: "Won't Have (Out of Scope)",
    badge: "neutral" as const,
    pct: "10%",
    items: [
      "Direct job placement services",
      "Physical training or certification",
      "Academic degree programs",
      "HR management tools",
      "Recruitment platform features",
      "Enterprise ERP integrations",
    ],
  },
];

export function MoscowDetail() {
  return (
    <Accordion variant="surface" defaultExpandedKeys={["must"]} className="w-full">
      {MOSCOW_DETAIL.map((cat) => (
        <AccordionItem key={cat.id} id={cat.id}>
          <AccordionHeading>
            <AccordionTrigger>
              <span className="flex flex-1 items-center gap-3 text-left">
                <Badge variant={cat.badge}>{cat.pct}</Badge>
                <span className="text-h6 text-foreground">{cat.title}</span>
              </span>
              <AccordionIndicator />
            </AccordionTrigger>
          </AccordionHeading>
          <AccordionPanel>
            <AccordionBody>
              <ul className="grid gap-2 text-body-sm text-muted-foreground sm:grid-cols-2">
                {cat.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="text-primary">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionBody>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/* ----------------------------------------------------------------------------
 * Ideal Customer Profiles — three full personas, surfaced through Tabs.
 * -------------------------------------------------------------------------- */
const ICPS = [
  {
    id: "sarah",
    initials: "SC",
    name: "Sarah Chen",
    title: "The Ambitious Career Switcher",
    demographics: "Marketing Manager → Data Scientist, Age 29, San Francisco, $85K salary",
    painPoints: [
      "Overwhelmed by scattered learning resources",
      "Imposter syndrome about technical skills",
      "Limited time after work hours",
      "Uncertain about career transition timeline",
    ],
    buyingBehavior: [
      "Researches extensively before purchasing",
      "Values structured learning paths",
      "Willing to pay premium for efficiency",
      "Seeks peer community and mentorship",
    ],
    successMetrics:
      "Land $120K+ data science role within 12 months, build portfolio of 5 projects",
  },
  {
    id: "marcus",
    initials: "MR",
    name: "Marcus Rodriguez",
    title: "The Efficiency-Focused Professional",
    demographics: "Senior Software Engineer, Age 34, Austin, $140K salary, Team Lead",
    painPoints: [
      "Staying current with rapidly evolving tech",
      "Balancing learning with management duties",
      "Finding quality content that's not too basic",
      "Justifying learning time to leadership",
    ],
    buyingBehavior: [
      "Quick decision-maker with clear ROI",
      "Values time efficiency above cost savings",
      "Prefers practical, project-based learning",
      "Influences team's tool adoption decisions",
    ],
    successMetrics:
      "Master new framework in 4-6 weeks, lead team transition, earn promotion to Staff Engineer",
  },
  {
    id: "amanda",
    initials: "AP",
    name: "Amanda Park",
    title: "The Strategic L&D Leader",
    demographics:
      "L&D Director, Age 41, Enterprise SaaS Company, $165K salary, Manages 500+ employees",
    painPoints: [
      "Proving ROI of learning investments",
      "Scaling personalized development programs",
      "Outdated LMS with poor engagement",
      "Tracking skill gaps across departments",
    ],
    buyingBehavior: [
      "Requires extensive pilot programs",
      "Focuses on measurable business outcomes",
      "Needs executive stakeholder buy-in",
      "Values vendor partnership and support",
    ],
    successMetrics:
      "80% employee engagement in learning, 25% faster skill acquisition, $2M+ in productivity gains",
  },
] as const;

function PersonaColumn({ heading, items }: { heading: string; items: readonly string[] }) {
  return (
    <div>
      <h4 className="text-overline text-primary">{heading}</h4>
      <ul className="mt-2 space-y-1.5 text-body-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="text-primary">
              —
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function IcpTabs() {
  return (
    <Tabs defaultSelectedKey="sarah" variant="secondary">
      <Tabs.List aria-label="Ideal customer profiles" className="flex-wrap">
        {ICPS.map((icp) => (
          <Tabs.Tab key={icp.id} id={icp.id}>
            {icp.name}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {ICPS.map((icp) => (
        <Tabs.Panel key={icp.id} id={icp.id} className="pt-6">
          <CardContainer containerClassName="py-0!" className="w-full">
            <CardBody className="w-full">
              <CardSpotlight className="w-full rounded-2xl p-6 md:p-8">
                <CardItem translateZ={40} className="w-full!">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <span
                      className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-h5 font-bold text-primary-foreground"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--accent) 70%, var(--primary)))",
                      }}
                    >
                      {icp.initials}
                    </span>
                    <div>
                      <h3 className="text-h4 text-foreground">{icp.name}</h3>
                      <p className="text-body text-primary">{icp.title}</p>
                    </div>
                  </div>
                </CardItem>

                <CardItem translateZ={28} className="mt-6! w-full!">
                  <div className="rounded-xl border border-border bg-muted-surface/50 p-4">
                    <h4 className="text-overline text-primary">Demographics</h4>
                    <p className="mt-1 text-body-sm text-foreground">{icp.demographics}</p>
                  </div>
                </CardItem>

                <CardItem translateZ={20} className="mt-6! w-full!">
                  <Grid cols={2} gap="lg">
                    <PersonaColumn heading="Daily Pain Points" items={icp.painPoints} />
                    <PersonaColumn heading="Buying Behavior" items={icp.buyingBehavior} />
                  </Grid>
                </CardItem>

                <CardItem translateZ={30} className="mt-6! w-full!">
                  <div className="rounded-xl border border-success/30 bg-success/10 p-4">
                    <h4 className="text-overline text-success">Success Metrics</h4>
                    <p className="mt-1 text-body-sm text-foreground">{icp.successMetrics}</p>
                  </div>
                </CardItem>
              </CardSpotlight>
            </CardBody>
          </CardContainer>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

/* ----------------------------------------------------------------------------
 * Core Problem Analysis — urgency + WTP signal meters.
 * -------------------------------------------------------------------------- */
const PROBLEM_BLOCKS = [
  {
    icon: "target",
    heading: "Primary Problem",
    body: "The modern professional faces an overwhelming paradox: infinite learning resources but no clear path to mastery. Career development is fragmented across multiple platforms, creating inefficiency and decision paralysis.",
  },
  {
    icon: "users",
    heading: "Target Audience",
    body: "Knowledge workers, career switchers, and organizations seeking efficient skill development. Primary demographics: 25-45 years old, college-educated, earning $50K-$200K annually.",
  },
] as const;

const SIGNALS = [
  {
    icon: "activity",
    heading: "Urgency Level",
    rating: "CRITICAL",
    tone: "error" as const,
    body: 'Skills become obsolete every 2-5 years. The "learn fast or become irrelevant" reality creates immediate, pressing demand.',
  },
  {
    icon: "dollar-sign",
    heading: "Willingness to Pay",
    rating: "HIGH",
    tone: "success" as const,
    body: "Target users already spend $5K-$15K annually on courses, bootcamps, and coaching. Our integrated solution at $29-$99/month represents 70%+ cost savings.",
  },
] as const;

export function ProblemAnalysis() {
  return (
    <Stack gap={4}>
      {PROBLEM_BLOCKS.map((block, i) => (
        <Reveal key={block.heading} delay={i * 0.08}>
          <Card variant="glass" className="p-5">
            <div className="flex items-start gap-3">
              <IconRenderer name={block.icon} className="mt-0.5 shrink-0 text-primary" size={20} />
              <div>
                <h4 className="text-h6 text-foreground">{block.heading}</h4>
                <p className="mt-1 text-body-sm text-muted-foreground">{block.body}</p>
              </div>
            </div>
          </Card>
        </Reveal>
      ))}
      {SIGNALS.map((sig, i) => (
        <Reveal key={sig.heading} delay={(PROBLEM_BLOCKS.length + i) * 0.08}>
          <Card variant="glass" className="p-5">
            <div className="flex items-start gap-3">
              <IconRenderer name={sig.icon} className="mt-0.5 shrink-0 text-primary" size={20} />
              <div className="w-full">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-h6 text-foreground">{sig.heading}</h4>
                  <Badge variant={sig.tone}>{sig.rating}</Badge>
                </div>
                <p className="mt-1 text-body-sm text-muted-foreground">{sig.body}</p>
              </div>
            </div>
          </Card>
        </Reveal>
      ))}
    </Stack>
  );
}

/* ----------------------------------------------------------------------------
 * Value proposition tones — hover-lift cards with a tooltip on each glyph.
 * -------------------------------------------------------------------------- */
const VALUE_TONES = [
  {
    icon: "lightbulb",
    title: "Action-Oriented Tone",
    hint: "Drives urgency and immediate activation.",
    quote:
      "Stop wasting time on scattered resources. Kairoo delivers personalized career acceleration with AI precision, giving you the competitive edge you need today.",
  },
  {
    icon: "shield-check",
    title: "Trust-Building Tone",
    hint: "Anchors credibility and proof.",
    quote:
      "Trusted by thousands of professionals worldwide, Kairoo provides scientifically-backed learning methods and proven career strategies to ensure your growth investment pays dividends.",
  },
  {
    icon: "heart-pulse",
    title: "Aspirational Tone",
    hint: "Connects to identity and ambition.",
    quote:
      "Unlock your unlimited potential. Kairoo doesn't just teach skills—it transforms lives, turning ambitious dreams into achievable realities through intelligent guidance.",
  },
] as const;

export function ValueToneCards() {
  return (
    <Grid cols={3} gap="lg">
      {VALUE_TONES.map((tone, i) => (
        <Reveal key={tone.title} delay={i * 0.1} className="h-full">
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="h-full"
          >
            <CardSpotlight className="h-full rounded-2xl p-6">
              <Tooltip delay={0}>
                <span
                  className="flex size-12 cursor-help items-center justify-center rounded-xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--accent-subtle), color-mix(in oklab, var(--primary) 16%, transparent))",
                  }}
                >
                  <IconRenderer name={tone.icon} className="text-primary" size={22} />
                </span>
                <Tooltip.Content showArrow placement="top">
                  <Tooltip.Arrow />
                  {tone.hint}
                </Tooltip.Content>
              </Tooltip>
              <h4 className="mt-4 text-h6 text-foreground">{tone.title}</h4>
              <p className="mt-2 text-body-sm text-muted-foreground">
                &ldquo;{tone.quote}&rdquo;
              </p>
            </CardSpotlight>
          </motion.div>
        </Reveal>
      ))}
    </Grid>
  );
}

/* ----------------------------------------------------------------------------
 * Implementation roadmap — animated vertical timeline (Anime.js draw + reveal).
 * -------------------------------------------------------------------------- */
const ROADMAP = [
  {
    phase: "Phase 1",
    icon: "rocket",
    title: "MVP Development",
    time: "Months 1–3",
    desc: "Build core Must-Have features, establish user base, validate market fit.",
  },
  {
    phase: "Phase 2",
    icon: "layers",
    title: "Feature Expansion",
    time: "Months 4–8",
    desc: "Add Should-Have features, enterprise customers, scale operations.",
  },
  {
    phase: "Phase 3",
    icon: "crown",
    title: "Market Leadership",
    time: "Months 9–12",
    desc: "Advanced features, partnerships, international expansion.",
  },
] as const;

export function RoadmapTimeline() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const root = ref.current;
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const line = root.querySelector<HTMLElement>("[data-rm-line]");
          if (line) {
            animate(line, { scaleY: [0, 1], duration: 1100, ease: "out(3)" });
          }
          animate(Array.from(root.querySelectorAll<HTMLElement>("[data-rm-node]")), {
            opacity: [0, 1],
            translateX: [-16, 0],
            scale: [0.9, 1],
            delay: stagger(180, { start: 200 }),
            duration: 700,
            ease: "out(4)",
          });
          animate(Array.from(root.querySelectorAll<HTMLElement>("[data-rm-card]")), {
            opacity: [0, 1],
            translateY: [20, 0],
            delay: stagger(180, { start: 280 }),
            duration: 700,
            ease: "out(3)",
          });
          obs.disconnect();
        });
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <ol ref={ref} className="relative ml-2 space-y-8 pl-10">
      <li aria-hidden className="pointer-events-none absolute inset-0 list-none">
        <span
          data-rm-line
          className="absolute bottom-2 left-[15px] top-2 w-px origin-top"
          style={{
            background:
              "linear-gradient(to bottom, var(--primary), color-mix(in oklab, var(--accent) 70%, var(--primary)))",
          }}
        />
      </li>
      {ROADMAP.map((phase) => (
        <li key={phase.phase} className="relative">
          <span
            aria-hidden
            data-rm-node
            className="absolute -left-10 top-1 flex size-8 items-center justify-center rounded-full border border-border bg-card text-primary shadow-elevation-2"
          >
            <IconRenderer name={phase.icon} size={16} />
          </span>
          <div data-rm-card>
            <Card variant="interactive" className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-data-sm text-primary">{phase.phase}</span>
                <Badge variant="info">{phase.time}</Badge>
              </div>
              <h3 className="mt-3 text-h5 text-foreground">{phase.title}</h3>
              <p className="mt-2 text-body-sm text-muted-foreground">{phase.desc}</p>
            </Card>
          </div>
        </li>
      ))}
    </ol>
  );
}
