"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { animate, stagger } from "animejs";
import {
  BarChart3,
  Rocket,
  Zap,
  TrendingUp,
  Download,
  Mail,
  Linkedin,
  CalendarCheck,
  Target,
  Wrench,
  Megaphone,
  Network,
  AlertTriangle,
  Lightbulb,
  Users,
  DollarSign,
  Layers,
  Crown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from "@/components/ui/Tabs";
import {
  Accordion,
  AccordionItem,
  AccordionHeading,
  AccordionTrigger,
  AccordionPanel,
  AccordionBody,
  AccordionIndicator,
} from "@/components/ui/Accordion";
import {
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { StatGrid } from "@/components/blocks/StatCounter";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { CTA } from "@/components/blocks/CTA";
import AuroraBackground from "@/components/motion/AuroraBackground";
import { Spotlight } from "@/components/motion/Spotlight";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";
import ForecastChart from "@/components/ForecastChart";

/* -------------------------------------------------------------------------- */
/* Motion helpers - reduced-motion safe scroll reveal                          */
/* -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Brand gradient text helper - teal -> navy via token color-mix. */
const GRADIENT_TEXT =
  "bg-clip-text text-transparent [background-image:linear-gradient(110deg,var(--primary),color-mix(in_oklab,var(--accent)_85%,var(--primary)),var(--primary))]";

/** Hairline divider with a teal->transparent token wash. */
function GradientRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-px w-full [background-image:linear-gradient(to_right,transparent,color-mix(in_oklab,var(--accent)_45%,transparent),transparent)]",
        className,
      )}
    />
  );
}

/** Shared section heading with eyebrow chip + optional gradient highlight. */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <Stack gap={4} align="center" className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-subtle px-3 py-1 text-overline text-accent">
          <Sparkles aria-hidden className="size-3.5" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-h2 text-foreground">{title}</h2>
      {subtitle ? (
        <p className="text-pretty text-body-lg text-muted-foreground">{subtitle}</p>
      ) : null}
    </Stack>
  );
}

/* -------------------------------------------------------------------------- */
/* Content data                                                                */
/* -------------------------------------------------------------------------- */

const WHY_INVEST = [
  {
    icon: <Rocket className="size-6" />,
    title: "Massive Market Opportunity",
    desc: "$142B+ addressable market with 16.3% CAGR. AI in education projected to reach $43B by 2027.",
  },
  {
    icon: <Zap className="size-6" />,
    title: "Unique Competitive Position",
    desc: "Only platform combining career tools, learning paths, and business intelligence in one AI-powered solution.",
  },
  {
    icon: <TrendingUp className="size-6" />,
    title: "Proven Traction",
    desc: "Strong early metrics with 94/100 market validation score and clear path to $10M+ ARR.",
  },
];

type Slide = {
  num: number;
  id: string;
  title: string;
  icon: ReactNode;
  items: string[];
  highlight?: boolean;
};

const SLIDES: Slide[] = [
  {
    num: 1,
    id: "problem",
    title: "Problem",
    icon: <AlertTriangle className="size-5" />,
    items: [
      "Career development is fragmented and inefficient",
      "Information overload prevents skill mastery",
      "$87B spent annually on ineffective corporate training",
      "87% of executives report critical skill gaps",
    ],
  },
  {
    num: 2,
    id: "solution",
    title: "Solution",
    icon: <Lightbulb className="size-5" />,
    items: [
      "AI-powered integrated platform",
      "32+ career development tools",
      "Personalized learning paths",
      "Business intelligence & analytics",
    ],
  },
  {
    num: 3,
    id: "market",
    title: "Market",
    icon: <Target className="size-5" />,
    items: [
      "$142B Total Addressable Market",
      "$28B Serviceable Addressable Market",
      "16.3% annual growth rate",
      "500M+ knowledge workers globally",
    ],
  },
  {
    num: 4,
    id: "demo",
    title: "Product Demo",
    icon: <Layers className="size-5" />,
    items: [
      "Interactive AI career coaching",
      "Dynamic learning path generation",
      "Real-time skill gap analysis",
      "Team analytics dashboard",
    ],
  },
  {
    num: 5,
    id: "traction",
    title: "Traction",
    icon: <TrendingUp className="size-5" />,
    items: [
      "1,000+ beta users with 85% retention",
      "$30K MRR within 90 days",
      "12.7% freemium conversion rate",
      "5+ enterprise pilot programs",
    ],
  },
  {
    num: 6,
    id: "model",
    title: "Business Model",
    icon: <DollarSign className="size-5" />,
    items: [
      "Freemium + SaaS subscriptions",
      "Individual: $29/month",
      "Enterprise: $89/seat/month",
      "92% gross margins",
    ],
  },
  {
    num: 7,
    id: "competition",
    title: "Competition",
    icon: <Crown className="size-5" />,
    items: [
      "No direct competitors with full integration",
      "68% cost advantage vs alternatives",
      "Superior AI personalization",
      "First-mover advantage in combined market",
    ],
  },
  {
    num: 8,
    id: "team",
    title: "Team",
    icon: <Users className="size-5" />,
    items: [
      "Experienced tech & education leadership",
      "AI/ML engineering expertise",
      "Previous exits and unicorn experience",
      "Strategic advisory board",
    ],
  },
  {
    num: 9,
    id: "financials",
    title: "Financials",
    icon: <BarChart3 className="size-5" />,
    items: [
      "Path to $10M ARR by Year 2",
      "92% gross margins",
      "Break-even at $2.5M ARR",
      "24-month runway with funding",
    ],
  },
  {
    num: 10,
    id: "ask",
    title: "Ask",
    icon: <Rocket className="size-5" />,
    items: [
      "Raising $2.5M Series A",
      "15-20% equity offering",
      "Product development & team expansion",
      "Market expansion & enterprise sales",
    ],
    highlight: true,
  },
];

const FINANCIAL_ROWS = [
  { id: "m3", month: "Month 3", users: "1,049", mrr: "$30.4K", churn: "5.2%" },
  { id: "m6", month: "Month 6", users: "3,247", mrr: "$94.2K", churn: "5.0%" },
  { id: "m9", month: "Month 9", users: "7,891", mrr: "$228.8K", churn: "4.8%" },
  { id: "m12", month: "Month 12", users: "15,234", mrr: "$441.8K", churn: "4.5%" },
];

type Phase = {
  id: string;
  phase: string;
  title: string;
  product: string[];
  team: string[];
  milestone: string;
};

const PHASES: Phase[] = [
  {
    id: "phase-1",
    phase: "Phase 1",
    title: "Foundation & Systems (Days 1–30)",
    product: [
      "Finalize 90-day backlog + success metrics",
      "Design system + component library (light/dark ready)",
      "Set up infra: environments, CI/CD, observability",
    ],
    team: [
      "Expand core squad (AI lead + design partner)",
      "Define rituals & async comms cadence",
      "Line up 5 design partners for beta access",
    ],
    milestone: "Clickable prototype + technical alpha by Day 30",
  },
  {
    id: "phase-2",
    phase: "Phase 2",
    title: "Build & Beta (Days 31–60)",
    product: [
      "Ship AI roadmap generator + learning path studio",
      "Embed analytics + billing + workspace controls",
      "Integrate theme switching + enterprise SSO",
    ],
    team: [
      "Onboard design partners to managed beta",
      "Stand up customer success playbooks + feedback loop",
      "Validate pricing/packaging with finance + product",
    ],
    milestone: "Private beta with NPS tracking + ARR pilots",
  },
  {
    id: "phase-3",
    phase: "Phase 3",
    title: "Scale & Launch (Days 61–90)",
    product: [
      "Hardening: perf, security, compliance (SOC2 lite)",
      "Automated onboarding flows + in-product education",
      "Launch marketing site + PLG motion (waitlist → self-serve)",
    ],
    team: [
      "Product Hunt + partner launches + webinar tour",
      "Stand up 24/7 support rotation + runbooks",
      "Define KPI dashboard for leadership + investors",
    ],
    milestone: "Public GA launch + first $100K ARR in pipeline",
  },
];

const TOOLS = [
  {
    icon: <Wrench className="size-5" />,
    title: "Development Stack",
    items: [
      "Next.js + TypeScript",
      "PostgreSQL + Prisma",
      "OpenAI GPT-4 API",
      "Stripe for payments",
      "Vercel for hosting",
    ],
  },
  {
    icon: <Megaphone className="size-5" />,
    title: "Marketing Tools",
    items: [
      "Mailchimp for email",
      "Buffer for social media",
      "Google Analytics",
      "Hotjar for user research",
      "Webflow for landing pages",
    ],
  },
  {
    icon: <Network className="size-5" />,
    title: "Operational Tools",
    items: [
      "Notion for documentation",
      "Slack for communication",
      "Figma for design",
      "GitHub for code",
      "Zoom for meetings",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Hero - Spotlight + Aurora + anime.js per-word entrance                      */
/* -------------------------------------------------------------------------- */

function DeckHero() {
  const reduce = useReducedMotion();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reduce || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll<HTMLElement>(
      "[data-anim-word]",
    );
    if (!words.length) return;

    words.forEach((w) => (w.style.opacity = "0"));
    const animation = animate(words, {
      opacity: [0, 1],
      translateY: [30, 0],
      rotateZ: [4, 0],
      filter: ["blur(10px)", "blur(0px)"],
      duration: 950,
      delay: stagger(65, { start: 180 }),
      ease: "out(3)",
    });
    return () => {
      animation.cancel();
    };
  }, [reduce]);

  const line1 = ["Investor", "Resources", "&"];

  return (
    <Section className="relative isolate overflow-hidden">
      <AuroraBackground intensity="vivid" className="absolute! inset-0! -z-10!" />
      <Spotlight className="-top-40 left-0 -z-10 md:left-60" fill="var(--primary)" />
      <Spotlight
        className="-top-10 right-0 -z-10 hidden lg:block lg:right-20"
        fill="var(--accent)"
      />

      {/* Floating token glow blobs */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-20 -z-10 size-72 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)",
            }}
            animate={{ y: [0, -24, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-0 -z-10 size-80 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 28%, transparent), transparent 70%)",
            }}
            animate={{ y: [0, 26, 0], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <Stack gap={8} align="center" className="mx-auto max-w-3xl py-12 text-center">
        <Badge variant="info" size="md" className="gap-2">
          <BarChart3 className="size-4" />
          Investment Opportunity • Series A Ready
        </Badge>

        <Stack gap={4} align="center">
          <h1
            ref={headlineRef}
            className="text-balance text-display text-foreground"
          >
            {line1.map((w, i) => (
              <span key={`${w}-${i}`} data-anim-word className="inline-block">
                {w}
                {i < line1.length - 1 ? " " : ""}
              </span>
            ))}{" "}
            <span data-anim-word className={cn("inline-block", GRADIENT_TEXT)}>
              Growth&nbsp;Forecasting
            </span>
          </h1>
          <p className="text-pretty text-body-lg text-muted-foreground">
            Comprehensive investment materials, financial projections, and
            growth strategies for {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} - the future of AI-powered professional
            development. Join us in transforming how the world learns and grows.
          </p>
        </Stack>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <a href="#pitch-deck">
              View Pitch Deck
              <ArrowRight className="size-5" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#tools">
              Download Materials
              <Download className="size-5" />
            </a>
          </Button>
        </div>

        {/* Inline hero stat ribbon */}
        <Reveal delay={0.2} className="w-full">
          <Card variant="glass" className="mx-auto max-w-2xl px-6 py-5">
            <StatGrid
              cols={3}
              gap="md"
              items={[
                { value: 2.5, prefix: "$", suffix: "M", label: "Series A Target" },
                { value: 92, suffix: "%", label: "Gross Margins" },
                { value: 94, suffix: "/100", label: "Validation Score" },
              ]}
            />
          </Card>
        </Reveal>
      </Stack>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export function DeckContent() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      <DeckHero />

      {/* ===================== INVESTMENT OVERVIEW ====================== */}
      <Section id="opportunity" className="relative isolate overflow-hidden pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="The Raise"
            title={
              <>
                Investment Opportunity{" "}
                <span className={GRADIENT_TEXT}>Overview</span>
              </>
            }
            subtitle="A focused Series A to extend runway, ship the platform, and capture a first-mover position in a $142B market."
          />
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <Card
            variant="glass"
            className="relative overflow-hidden p-8 sm:p-10"
          >
            {/* teal -> navy token wash */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(135deg,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_55%,color-mix(in_oklab,var(--accent)_12%,transparent))]"
            />
            <StatGrid
              cols={4}
              items={[
                { value: 2.5, prefix: "$", suffix: "M", label: "Series A Target" },
                { value: 142, prefix: "$", suffix: "B", label: "Market Size (TAM)" },
                { value: 24, suffix: " Mo", label: "Runway Extension" },
                { value: 20, suffix: "%", label: "Equity Offering (15–20%)" },
              ]}
            />
          </Card>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Stack gap={6}>
            <h3 className="text-h3 text-foreground">Why Invest in {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}?</h3>
            <Grid cols={3} gap="lg">
              {WHY_INVEST.map((item, i) => (
                <CardContainer
                  key={item.title}
                  containerClassName="!py-0 h-full"
                  className="h-full w-full"
                >
                  <CardBody className="h-full w-full">
                    <CardSpotlight className="h-full rounded-xl p-6">
                      <Stack gap={4}>
                        <CardItem
                          translateZ={40}
                          as="span"
                          aria-hidden
                          className="inline-flex size-12 items-center justify-center rounded-lg bg-accent-subtle text-accent ring-1 ring-accent/20"
                        >
                          {item.icon}
                        </CardItem>
                        <CardItem translateZ={24} as="h4" className="text-h5 text-foreground">
                          {item.title}
                        </CardItem>
                        <CardItem
                          translateZ={12}
                          as="p"
                          className="text-body-sm text-muted-foreground"
                        >
                          {item.desc}
                        </CardItem>
                        <span
                          aria-hidden
                          className="text-overline text-accent/60"
                        >
                          {`0${i + 1}`}
                        </span>
                      </Stack>
                    </CardSpotlight>
                  </CardBody>
                </CardContainer>
              ))}
            </Grid>
          </Stack>
        </Reveal>
      </Section>

      {/* ======================= 10-SLIDE PITCH ========================= */}
      <Section id="pitch-deck" className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-[120%] -translate-x-1/2 opacity-50 blur-3xl [background-image:radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_70%)]"
        />
        <Reveal>
          <SectionHeading
            eyebrow="The Story"
            title={
              <>
                10-Slide <span className={GRADIENT_TEXT}>Pitch Deck</span> Structure
              </>
            }
            subtitle="Step through the full investor narrative - from the problem we solve to exactly what we're asking for."
          />
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <Tabs defaultSelectedKey="problem" variant="primary">
            <TabList aria-label="Pitch deck slides" className="flex-wrap">
              {SLIDES.map((slide) => (
                <Tab key={slide.id} id={slide.id}>
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden className="text-caption text-muted-foreground">
                      {slide.num.toString().padStart(2, "0")}
                    </span>
                    {slide.title}
                  </span>
                </Tab>
              ))}
            </TabList>

            {SLIDES.map((slide) => (
              <TabPanel key={slide.id} id={slide.id}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <Card
                    variant={slide.highlight ? "elevated" : "glass"}
                    className={cn(
                      "relative mt-6 overflow-hidden p-8",
                      slide.highlight && "border-2 border-primary",
                    )}
                  >
                    {/* ambient slide-number watermark */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-bold leading-none text-foreground/[0.04]"
                    >
                      {slide.num.toString().padStart(2, "0")}
                    </span>

                    <Stack gap={6}>
                      <div className="flex items-center gap-4">
                        <span
                          aria-hidden
                          className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevation-2"
                        >
                          {slide.icon}
                        </span>
                        <div>
                          <p className="text-overline text-accent">
                            Slide {slide.num} of 10
                          </p>
                          <h3 className="text-h3 text-foreground">{slide.title}</h3>
                        </div>
                        {slide.highlight ? (
                          <Badge variant="success" className="ml-auto">
                            The Ask
                          </Badge>
                        ) : null}
                      </div>

                      <GradientRule />

                      <ul className="grid gap-3 sm:grid-cols-2">
                        {slide.items.map((item, i) => (
                          <motion.li
                            key={item}
                            className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/40 p-3"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.4,
                              ease: EASE,
                              delay: 0.08 + i * 0.06,
                            }}
                          >
                            <CheckCircle2
                              aria-hidden
                              className="mt-0.5 size-5 shrink-0 text-accent"
                            />
                            <span className="text-body text-foreground">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </Stack>
                  </Card>
                </motion.div>
              </TabPanel>
            ))}
          </Tabs>
        </Reveal>
      </Section>

      {/* ===================== GROWTH FORECAST ========================== */}
      <Section id="growth-forecast" className="relative isolate overflow-hidden">
        <Reveal>
          <SectionHeading
            eyebrow="The Numbers"
            title={
              <>
                12-Month <span className={GRADIENT_TEXT}>Growth & Revenue</span>{" "}
                Forecast
              </>
            }
            subtitle="Modelled on a $29 average price, 5% monthly churn, and 15% monthly growth."
          />
        </Reveal>

        <Grid cols={2} gap="lg" className="mt-12 lg:items-stretch">
          <Reveal>
            <Card
              variant="glass"
              className="relative h-full overflow-hidden p-6 sm:p-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-50 [background-image:linear-gradient(160deg,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_60%)]"
              />
              <Stack gap={6}>
                <h3 className="text-h4 text-foreground">
                  User Growth & MRR Projection
                </h3>
                <ForecastChart />
                <p className="text-caption text-muted-foreground">
                  Assumptions: $29 avg price, 5% monthly churn, 15% monthly growth.
                </p>
              </Stack>
            </Card>
          </Reveal>

          <Reveal delay={0.08}>
            <Card variant="glass" className="h-full p-6 sm:p-8">
              <Stack gap={6}>
                <h3 className="text-h4 text-foreground">
                  Key Financial Projections
                </h3>

                <Table variant="primary">
                  <TableContent aria-label="Key financial projections by month">
                    <TableHeader>
                      <TableColumn id="month" isRowHeader>
                        Month
                      </TableColumn>
                      <TableColumn id="users">Users</TableColumn>
                      <TableColumn id="mrr">MRR</TableColumn>
                      <TableColumn id="churn">Churn</TableColumn>
                    </TableHeader>
                    <TableBody items={FINANCIAL_ROWS}>
                      {(row) => (
                        <TableRow id={row.id}>
                          <TableCell>
                            <span className="font-semibold text-foreground">
                              {row.month}
                            </span>
                          </TableCell>
                          <TableCell>{row.users}</TableCell>
                          <TableCell>
                            <span className="font-semibold text-success">
                              {row.mrr}
                            </span>
                          </TableCell>
                          <TableCell>{row.churn}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </TableContent>
                </Table>

                <Card variant="default" className="border-success/30 bg-success/10 p-5">
                  <p className="text-overline text-success">Year 1 Totals</p>
                  <Grid cols={2} gap="md" className="mt-3">
                    <StatGrid
                      cols={1}
                      items={[
                        { value: 15.2, suffix: "K", label: "Paid Users" },
                      ]}
                    />
                    <StatGrid
                      cols={1}
                      items={[
                        { value: 441, prefix: "$", suffix: "K", label: "Monthly Revenue" },
                      ]}
                    />
                  </Grid>
                </Card>
              </Stack>
            </Card>
          </Reveal>
        </Grid>
      </Section>

      {/* ===================== 90-DAY MVP PLAN ========================== */}
      <Section id="mvp-plan">
        <Reveal>
          <SectionHeading
            eyebrow="Execution"
            title={
              <>
                90-Day <span className={GRADIENT_TEXT}>MVP Launch</span> Action Plan
              </>
            }
            subtitle="Three disciplined phases - foundation, beta, then scale - each with parallel product and go-to-market workstreams."
          />
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <Grid cols={3} gap="lg" className="lg:items-stretch">
            {PHASES.map((phase, i) => (
              <CardContainer key={phase.id} containerClassName="!py-0 h-full">
                <CardBody className="h-full w-full">
                  <Card
                    variant="interactive"
                    className="relative flex h-full flex-col overflow-hidden p-6"
                  >
                    {/* connector / step index */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-5 top-5 text-[3rem] font-bold leading-none text-accent/10"
                    >
                      {i + 1}
                    </span>
                    <CardItem translateZ={30} as="div">
                      <Badge variant="neutral" className="mb-3">
                        {phase.phase}
                      </Badge>
                      <h3 className="text-h5 text-primary">{phase.title}</h3>
                    </CardItem>

                    <CardItem translateZ={20} as="div" className="mt-5 grow space-y-5">
                      <div>
                        <p className="text-overline text-foreground">
                          Product Workstreams
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {phase.product.map((task) => (
                            <li
                              key={task}
                              className="flex gap-2 text-body-sm text-muted-foreground"
                            >
                              <span aria-hidden className="text-accent">
                                •
                              </span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-overline text-foreground">Team & GTM</p>
                        <ul className="mt-2 space-y-1.5">
                          {phase.team.map((task) => (
                            <li
                              key={task}
                              className="flex gap-2 text-body-sm text-muted-foreground"
                            >
                              <span aria-hidden className="text-accent">
                                •
                              </span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardItem>

                    <CardItem translateZ={40} as="div" className="mt-5">
                      <Card
                        variant="default"
                        className="border-accent/30 bg-accent-subtle p-3"
                      >
                        <p className="text-caption text-foreground">
                          <span className="font-semibold">Milestone:</span>{" "}
                          {phase.milestone}
                        </p>
                      </Card>
                    </CardItem>
                  </Card>
                </CardBody>
              </CardContainer>
            ))}
          </Grid>
        </Reveal>
      </Section>

      {/* ===================== TOOLS & RESOURCES ======================== */}
      <Section id="tools">
        <Reveal>
          <SectionHeading
            eyebrow="The Toolkit"
            title={
              <>
                Required <span className={GRADIENT_TEXT}>Tools & Resources</span>
              </>
            }
            subtitle="The lean, proven stack powering build, growth, and operations from day one."
          />
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <Accordion variant="surface" defaultExpandedKeys={["Development Stack"]}>
            {TOOLS.map((cat) => (
              <AccordionItem key={cat.title} id={cat.title}>
                <AccordionHeading>
                  <AccordionTrigger>
                    <span className="inline-flex items-center gap-3">
                      <span
                        aria-hidden
                        className="inline-flex size-9 items-center justify-center rounded-lg bg-accent-subtle text-accent ring-1 ring-accent/20"
                      >
                        {cat.icon}
                      </span>
                      <span className="text-h5 text-foreground">{cat.title}</span>
                    </span>
                    <AccordionIndicator />
                  </AccordionTrigger>
                </AccordionHeading>
                <AccordionPanel>
                  <AccordionBody>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {cat.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-body-sm text-muted-foreground"
                        >
                          <CheckCircle2 aria-hidden className="size-4 text-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionBody>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Section>

      {/* ========================== CONTACT ============================= */}
      <CTA
        id="contact"
        tone="gradient"
        headline="Ready to Join Our Journey?"
        body="Connect with our team to learn more about investment opportunities, access detailed financial models, or schedule a product demonstration."
        primary={{ label: "Contact Investment Team", href: "mailto:investors@kairoo.com" }}
        secondary={{ label: "Schedule Demo", href: "/contact" }}
      />

      <Section className="pt-0">
        <Reveal>
          <Grid cols={3} gap="lg">
            {[
              {
                icon: <Mail aria-hidden className="size-6 text-accent" />,
                title: "Investment Inquiries",
                href: "mailto:investors@kairoo.com",
                label: "investors@kairoo.com",
              },
              {
                icon: <CalendarCheck aria-hidden className="size-6 text-accent" />,
                title: "Book a Call",
                href: "/contact",
                label: "Schedule time with the team",
              },
              {
                icon: <Linkedin aria-hidden className="size-6 text-accent" />,
                title: "LinkedIn",
                href: "https://linkedin.com/company/kairoo",
                label: "linkedin.com/company/kairoo",
              },
            ].map((c) => (
              <CardSpotlight key={c.title} className="rounded-xl p-6 text-center">
                <Stack gap={2} align="center">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent-subtle ring-1 ring-accent/20">
                    {c.icon}
                  </span>
                  <h4 className="mt-1 text-h5 text-foreground">{c.title}</h4>
                  <Link
                    href={c.href}
                    className="text-body-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {c.label}
                  </Link>
                </Stack>
              </CardSpotlight>
            ))}
          </Grid>
        </Reveal>
      </Section>
    </>
  );
}

export default DeckContent;
