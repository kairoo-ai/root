"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { animate, stagger } from "animejs";

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierBadge } from "@/components/ui/TierBadge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";
import { Spotlight } from "@/components/motion/Spotlight";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { StatGrid } from "@/components/blocks/StatCounter";
import { TestimonialGrid } from "@/components/blocks/Testimonial";
import { CTA } from "@/components/blocks/CTA";
import IconRenderer from "@/components/IconRenderer";
import type { Feature, Testimonial } from "@/types";

/* ------------------------------------------------------------------ */
/* Shared reveal helper — reduced-motion safe                          */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1] as const;

function useReveal() {
  const reduce = useReducedMotion();
  return (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.6, ease: EASE, delay },
        };
}

/* Shared section-heading block with eyebrow + gradient-able title */
function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  className?: string;
}) {
  const reveal = useReveal();
  return (
    <Stack
      gap={3}
      align="center"
      className={cn("mx-auto mb-12 max-w-2xl text-center", className)}
    >
      <motion.span
        {...reveal(0)}
        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-overline text-accent backdrop-blur-glass"
      >
        <span className="inline-block size-1.5 animate-pulse rounded-full bg-accent" />
        {eyebrow}
      </motion.span>
      <motion.h2 {...reveal(0.06)} className="text-h1 text-balance text-foreground">
        {title}{" "}
        {highlight ? (
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            {highlight}
          </span>
        ) : null}
      </motion.h2>
      {description ? (
        <motion.p
          {...reveal(0.12)}
          className="text-body-lg text-pretty text-muted-foreground"
        >
          {description}
        </motion.p>
      ) : null}
    </Stack>
  );
}

/* ================================================================== */
/* HERO — Spotlight + Anime.js animated headline + gradient highlight  */
/* ================================================================== */
export function HomeHero() {
  const reduce = useReducedMotion();
  const reveal = useReveal();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Anime.js: elaborate per-word entrance for the hero headline.
  useEffect(() => {
    if (reduce || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll<HTMLElement>(
      "[data-anim-word]",
    );
    if (!words.length) return;

    words.forEach((w) => (w.style.opacity = "0"));
    const animation = animate(words, {
      opacity: [0, 1],
      translateY: [28, 0],
      rotateZ: [4, 0],
      filter: ["blur(8px)", "blur(0px)"],
      duration: 900,
      delay: stagger(70, { start: 150 }),
      ease: "out(3)",
    });
    return () => {
      animation.cancel();
    };
  }, [reduce]);

  const line1 = ["Your", "AI-Powered", "Career", "&", "Learning"];

  return (
    <Section className="relative isolate overflow-hidden">
      {/* Layered token-driven spotlights for depth */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="var(--primary)"
      />
      <Spotlight
        className="-top-10 right-0 hidden md:right-20 lg:block"
        fill="var(--accent)"
      />

      {/* Soft floating glow blobs (token color-mix, reduced-motion safe) */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-24 -z-1 size-72 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)",
            }}
            animate={{ y: [0, -24, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-0 -z-1 size-80 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 28%, transparent), transparent 70%)",
            }}
            animate={{ y: [0, 26, 0], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <Stack
        gap={8}
        align="center"
        className="relative mx-auto max-w-4xl py-14 text-center sm:py-20"
      >
        <motion.div {...reveal(0)}>
          <Badge variant="info" size="md" className="gap-2">
            <IconRenderer name="sparkles" size={14} />
            Powered by Advanced AI &middot; Gemini Integration
          </Badge>
        </motion.div>

        <h1
          ref={headlineRef}
          className="text-display text-balance text-foreground"
        >
          {line1.map((w) => (
            <span
              key={w}
              data-anim-word
              className="mr-[0.25em] inline-block will-change-transform"
            >
              {w}
            </span>
          ))}
          <span className="block">
            <span
              data-anim-word
              className="inline-block bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent will-change-transform"
            >
              Command Center
            </span>
          </span>
        </h1>

        <motion.p
          {...reveal(0.16)}
          className="max-w-2xl text-pretty text-body-lg text-muted-foreground"
        >
          Stop wasting time on scattered career resources. Kairoo merges
          advanced career development tools with intelligent learning systems
          and strategic business insights — from personalized AI roadmaps to
          enterprise team analytics, everything you need to accelerate
          professional growth in one place.
        </motion.p>

        <motion.div
          {...reveal(0.24)}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
          >
            <Button asChild size="lg" className="group gap-2">
              <Link href="/pricing">
                Launch your journey
                <IconRenderer
                  name="arrow-right"
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
          >
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/how-it-works">
                <IconRenderer name="play" size={16} />
                See how it works
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Real, defensible social proof */}
        <motion.div
          {...reveal(0.32)}
          className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6"
        >
          <div className="flex -space-x-2" aria-hidden>
            {["SC", "MR", "AP", "+"].map((initials) => (
              <span
                key={initials}
                className="inline-flex size-8 items-center justify-center rounded-full border-2 border-background bg-accent-subtle text-caption font-bold text-accent"
              >
                {initials}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="flex text-accent" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <IconRenderer key={i} name="star" size={16} />
              ))}
            </span>
            <span className="text-body-sm text-muted-foreground">
              4.9/5 from 1,000+ professionals already using Kairoo
            </span>
          </div>
        </motion.div>

        {/* Quick top-line proof bar — adds hero density */}
        <motion.div
          {...reveal(0.4)}
          className="mt-2 w-full max-w-2xl rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-glass"
        >
          <StatGrid
            cols={3}
            items={[
              { value: 32, suffix: "+", label: "AI tools" },
              { value: 1000, suffix: "+", label: "Professionals" },
              { value: 4.9, suffix: "/5", label: "Rating" },
            ]}
          />
        </motion.div>
      </Stack>
    </Section>
  );
}

/* ================================================================== */
/* THREE PILLARS — asymmetric bento of CardSpotlight cells              */
/* ================================================================== */
type Pillar = {
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
  span: string;
  metric: { value: number; suffix?: string; prefix?: string; label: string };
};

const PILLARS: Pillar[] = [
  {
    icon: "briefcase",
    title: "Career Development Suite",
    description:
      "32+ AI-powered tools for every aspect of your professional journey.",
    bullets: [
      "Dynamic Career Roadmaps",
      "AI Interview Coach",
      "Salary Negotiation Assistant",
      "Performance Review Helper",
      "+28 more tools",
    ],
    href: "/features/career",
    cta: "Explore career tools",
    span: "lg:col-span-3 lg:row-span-2",
    metric: { value: 32, suffix: "+", label: "career tools" },
  },
  {
    icon: "graduation-cap",
    title: "Intelligent Learning Paths",
    description: "AI-curated learning journeys from the best web resources.",
    bullets: [
      "Personalized Curricula",
      "AI Tutor Chatbot",
      "Progress Tracking",
      "Project-Based Learning",
      "Dynamic Adaptation",
    ],
    href: "/features/learning",
    cta: "Explore learning paths",
    span: "lg:col-span-3",
    metric: { value: 75, suffix: "%", label: "faster mastery" },
  },
  {
    icon: "bar-chart-3",
    title: "Strategic Business Intelligence",
    description: "Comprehensive market analysis and competitive insights.",
    bullets: [
      "Market Research Tools",
      "User Persona Development",
      "GTM Strategy Planning",
      "Growth Forecasting",
      "Enterprise Analytics",
    ],
    href: "/features/teams",
    cta: "Explore team analytics",
    span: "lg:col-span-3",
    metric: { value: 300, suffix: "%", label: "team productivity" },
  },
];

export function HomePillars() {
  const reveal = useReveal();

  return (
    <Section className="relative">
      <SectionHeading
        eyebrow="One platform, three pillars"
        title="Everything you need to plan, learn, and"
        highlight="lead"
        description="Every tool is powered by advanced AI, providing personalized, contextual, and intelligent assistance for your unique needs."
      />

      {/* Asymmetric bento: first pillar is the hero cell */}
      <div className="grid grid-cols-1 gap-4 lg:auto-rows-[minmax(11rem,1fr)] lg:grid-cols-6">
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            {...reveal(i * 0.08)}
            className={cn("h-full", pillar.span)}
          >
            <CardSpotlight className="group/p flex h-full flex-col gap-5 rounded-2xl p-8">
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden
                  className="inline-flex size-12 items-center justify-center rounded-xl bg-accent-subtle text-accent transition-transform duration-300 group-hover/p:rotate-3 group-hover/p:scale-110"
                >
                  <IconRenderer name={pillar.icon} size={26} />
                </span>
                <Badge variant="info" size="sm" className="gap-1">
                  <IconRenderer name="zap" size={12} />
                  AI-native
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-h4 text-foreground">{pillar.title}</h3>
                <p className="text-body-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </div>

              <ul
                className={cn(
                  "grid gap-2 text-body-sm text-muted-foreground",
                  i === 0 && "sm:grid-cols-2",
                )}
              >
                {pillar.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <IconRenderer
                      name="check-circle"
                      size={16}
                      className="shrink-0 text-accent"
                    />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/60 pt-4">
                <StatGrid
                  cols={1}
                  items={[
                    {
                      value: pillar.metric.value,
                      suffix: pillar.metric.suffix,
                      prefix: pillar.metric.prefix,
                      label: pillar.metric.label,
                    },
                  ]}
                />
                <Link
                  href={pillar.href}
                  className="group/cta inline-flex items-center gap-1 whitespace-nowrap text-body-sm font-semibold text-primary hover:underline"
                >
                  {pillar.cta}
                  <IconRenderer
                    name="arrow-right"
                    size={16}
                    className="transition-transform duration-200 group-hover/cta:translate-x-1"
                  />
                </Link>
              </div>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================== */
/* FEATURED TOOLS — ThreeDCard flagship + CardSpotlight feature grid    */
/* ================================================================== */
const FEATURED_TOOLS: Feature[] = [
  {
    id: "dynamicRoadmaps",
    icon: "map",
    title: "Dynamic Roadmaps",
    description: "Turn an ambiguous goal into a clear, sequenced career route.",
  },
  {
    id: "interviewCoach",
    icon: "mic",
    title: "Interview Coach",
    description: "Practice real questions and get sharp, structured feedback.",
  },
  {
    id: "salaryCoach",
    icon: "trending-up",
    title: "Salary Coach",
    description: "Benchmark your worth and negotiate with confidence.",
  },
  {
    id: "documentSuite",
    icon: "file-text",
    title: "Document Suite",
    description: "Draft cover letters, proposals, and briefs in seconds.",
  },
  {
    id: "careerSimulator",
    icon: "compass",
    title: "Career Simulator",
    description: "Model a switch from your current role to your target one.",
  },
  {
    id: "projectGenerator",
    icon: "code",
    title: "Project Generator",
    description: "Get portfolio-ready project ideas matched to your stack.",
  },
];

export function HomeFeaturedTools() {
  const reveal = useReveal();
  const reduce = useReducedMotion();

  return (
    <Section className="relative">
      <SectionHeading
        eyebrow="A taste of the toolkit"
        title="Six of 32+ tools, each"
        highlight="ready when you are"
        description="Six of 32+ AI tools spanning career, learning, and strategy. Each one is personalized, contextual, and ready the moment you are."
      />

      {/* Flagship tilt card spotlighting the lead tool */}
      <div className="mb-6">
        <CardContainer containerClassName="py-0">
          <CardBody className="group/3d relative h-auto w-full rounded-3xl border border-border bg-card p-8 shadow-elevation-3 sm:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-60"
              style={{
                background:
                  "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 60%)",
              }}
            />
            <div className="relative grid items-center gap-8 sm:grid-cols-2">
              <div className="space-y-5">
                <CardItem translateZ={40}>
                  <Badge variant="success" size="sm" className="gap-1">
                    <IconRenderer name="star" size={12} />
                    Most loved tool
                  </Badge>
                </CardItem>
                <CardItem
                  as="h3"
                  translateZ={60}
                  className="text-h2 text-balance text-foreground"
                >
                  Dynamic Career{" "}
                  <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    Roadmaps
                  </span>
                </CardItem>
                <CardItem
                  as="p"
                  translateZ={40}
                  className="max-w-md text-body text-muted-foreground"
                >
                  Turn an ambiguous goal into a clear, sequenced career route —
                  AI maps the milestones, skills, and resources, then adapts as
                  you progress.
                </CardItem>
                <CardItem translateZ={50}>
                  <motion.div
                    whileHover={reduce ? undefined : { scale: 1.04 }}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    className="inline-block"
                  >
                    <Button asChild className="group gap-2">
                      <Link href="/features/career">
                        Try the roadmap builder
                        <IconRenderer
                          name="arrow-right"
                          size={16}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </Button>
                  </motion.div>
                </CardItem>
              </div>

              <CardItem
                translateZ={80}
                className="w-full rounded-2xl border border-border/60 bg-background/60 p-6 backdrop-blur-glass"
              >
                <ul className="space-y-4">
                  {[
                    { icon: "target", label: "Define the destination" },
                    { icon: "git-branch", label: "Map skill milestones" },
                    { icon: "refresh-cw", label: "Adapt as you grow" },
                    { icon: "badge-check", label: "Land the role" },
                  ].map((step, idx) => (
                    <li key={step.label} className="flex items-center gap-3">
                      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent-subtle text-accent">
                        <IconRenderer name={step.icon} size={18} />
                      </span>
                      <span className="text-body-sm font-medium text-foreground">
                        {step.label}
                      </span>
                      {idx < 3 ? (
                        <span className="ml-auto text-muted-foreground">
                          <IconRenderer name="chevron-down" size={16} />
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>

      <Grid cols={3} gap="lg">
        {FEATURED_TOOLS.map((tool, i) => (
          <motion.div
            key={tool.id}
            {...reveal(i * 0.06)}
            whileHover={reduce ? undefined : { y: -6 }}
            className="h-full"
          >
            <CardSpotlight className="group/f flex h-full flex-col gap-4 rounded-2xl p-7">
              <span
                aria-hidden
                className="inline-flex size-12 items-center justify-center rounded-xl bg-accent-subtle text-accent transition-transform duration-300 group-hover/f:-rotate-6 group-hover/f:scale-110"
              >
                <IconRenderer name={tool.icon ?? "sparkles"} size={24} />
              </span>
              <div className="space-y-2">
                <h3 className="text-h5 text-foreground">{tool.title}</h3>
                <p className="text-body-sm text-pretty text-muted-foreground">
                  {tool.description}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-body-sm font-semibold text-primary opacity-0 transition-opacity duration-200 group-hover/f:opacity-100">
                Open tool
                <IconRenderer name="arrow-right" size={14} />
              </span>
            </CardSpotlight>
          </motion.div>
        ))}
      </Grid>

      <div className="mt-10 flex justify-center">
        <motion.div
          whileHover={reduce ? undefined : { scale: 1.04 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
        >
          <Button asChild variant="secondary" size="lg" className="group gap-2">
            <Link href="/features/career">
              Browse all 32+ tools
              <IconRenderer
                name="arrow-right"
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/* HOW IT FITS — HeroUI Tabs interactive showcase (adds density)        */
/* ================================================================== */
const WORKFLOW_TABS: {
  id: string;
  label: string;
  icon: string;
  headline: string;
  body: string;
  points: string[];
}[] = [
  {
    id: "plan",
    label: "Plan",
    icon: "compass",
    headline: "Chart the route before you run",
    body: "Set a goal and let Kairoo sequence the milestones, skills, and resources into a roadmap you can actually follow.",
    points: [
      "Goal-to-roadmap in seconds",
      "Skill-gap detection",
      "Milestone tracking",
    ],
  },
  {
    id: "learn",
    label: "Learn",
    icon: "graduation-cap",
    headline: "Master skills, not just watch videos",
    body: "AI-curated curricula pull the best of the web and adapt to your pace with project-based checkpoints.",
    points: [
      "Personalized curricula",
      "AI tutor on demand",
      "Project-based proof",
    ],
  },
  {
    id: "lead",
    label: "Lead",
    icon: "bar-chart-3",
    headline: "Turn insight into a strategy",
    body: "Market research, persona development, and growth forecasting give teams the intelligence to lead with confidence.",
    points: [
      "Market research tools",
      "GTM strategy planning",
      "Enterprise analytics",
    ],
  },
];

export function HomeWorkflow() {
  const reveal = useReveal();

  return (
    <Section className="relative">
      <SectionHeading
        eyebrow="How it all fits"
        title="One continuous flow from goal to"
        highlight="growth"
        description="Plan, learn, and lead inside a single system — switch contexts without losing momentum."
      />

      <motion.div {...reveal(0.1)}>
        <Card variant="glass" className="overflow-hidden p-6 sm:p-8">
          <Tabs defaultSelectedKey="plan" variant="primary">
            <Tabs.List aria-label="Kairoo workflow stages" className="mb-8">
              {WORKFLOW_TABS.map((t) => (
                <Tabs.Tab key={t.id} id={t.id}>
                  <span className="inline-flex items-center gap-2">
                    <IconRenderer name={t.icon} size={16} />
                    {t.label}
                  </span>
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {WORKFLOW_TABS.map((t) => (
              <Tabs.Panel key={t.id} id={t.id}>
                <div className="grid items-center gap-8 sm:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-h3 text-balance text-foreground">
                      {t.headline}
                    </h3>
                    <p className="text-body text-muted-foreground">{t.body}</p>
                    <ul className="space-y-2">
                      {t.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-center gap-2 text-body-sm text-foreground"
                        >
                          <IconRenderer
                            name="check-circle"
                            size={16}
                            className="text-accent"
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative flex items-center justify-center rounded-2xl border border-border/60 bg-background/50 p-10">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          "radial-gradient(70% 70% at 50% 30%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
                      }}
                    />
                    <span className="relative inline-flex size-24 items-center justify-center rounded-full bg-accent-subtle text-accent">
                      <IconRenderer name={t.icon} size={44} />
                    </span>
                  </div>
                </div>
              </Tabs.Panel>
            ))}
          </Tabs>
        </Card>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/* SOCIAL PROOF — testimonials + glowing animated impact metrics        */
/* ================================================================== */
const TESTIMONIALS: Testimonial[] = [
  {
    id: "sarah",
    quote:
      "I went from marketing to data science in just 8 months using Kairoo. The personalized learning path saved me thousands of hours of research. I landed a $125K role at Google!",
    name: "Sarah Chen",
    role: "Data Scientist",
    company: "Google",
  },
  {
    id: "marcus",
    quote:
      "Kairoo's AI coaching helped me navigate my promotion to Staff Engineer. The interview prep and salary negotiation tools were game-changers. Got a 40% raise!",
    name: "Marcus Rodriguez",
    role: "Staff Engineer",
    company: "Stripe",
  },
  {
    id: "amanda",
    quote:
      "Our team's productivity increased 300% after implementing Kairoo. The analytics dashboard gives us incredible insights into skill gaps and development ROI.",
    name: "Amanda Park",
    role: "L&D Director",
    company: "Salesforce",
  },
];

const IMPACT_STATS = [
  { value: 75, suffix: "%", label: "Faster skill acquisition", icon: "gauge" },
  {
    value: 50,
    prefix: "$",
    suffix: "K+",
    label: "Average salary increase",
    icon: "trending-up",
  },
  { value: 6, suffix: " mo", label: "Average career transition", icon: "clock" },
  { value: 95, suffix: "%", label: "User satisfaction rate", icon: "star" },
];

export function HomeSocialProof() {
  const reveal = useReveal();

  return (
    <Section>
      <TestimonialGrid
        withSection={false}
        eyebrow="Real success stories"
        heading="Careers transformed with Kairoo"
        description="See how professionals and organizations are accelerating their growth."
        items={TESTIMONIALS}
        variant="glass"
        cols={3}
      />

      <motion.div {...reveal(0.1)} className="mt-12">
        <Card
          variant="elevated"
          className="relative overflow-hidden p-8 sm:p-10"
        >
          {/* token gradient wash for a glowing band */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 120% at 50% 0%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 60%)",
            }}
          />
          <h3 className="relative mb-8 text-center text-h4 text-foreground">
            Measurable impact across industries
          </h3>
          <div className="relative grid grid-cols-2 gap-6 lg:grid-cols-4">
            {IMPACT_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...reveal(i * 0.08)}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-5 text-center backdrop-blur-glass"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                  <IconRenderer name={stat.icon} size={22} />
                </span>
                <StatGrid
                  cols={1}
                  items={[
                    {
                      value: stat.value,
                      prefix: stat.prefix,
                      suffix: stat.suffix,
                      label: stat.label,
                      className: "items-center text-center",
                    },
                  ]}
                />
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="ghost" className="group gap-2">
          <Link href="/customers">
            Read more customer stories
            <IconRenderer
              name="arrow-right"
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </div>
    </Section>
  );
}

/* ================================================================== */
/* PRICING TEASER — glass tiers w/ hover lift + Tooltip                 */
/* ================================================================== */
type TeaserTier = {
  tier: "free" | "pro" | "enterprise";
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  popular?: boolean;
};

const TEASER_TIERS: TeaserTier[] = [
  {
    tier: "free",
    name: "Explorer",
    price: "$0",
    period: "forever",
    desc: "For curious learners starting their journey.",
    features: ["5 AI career tools", "1 learning path", "Basic progress tracking"],
  },
  {
    tier: "pro",
    name: "Professional",
    price: "$19",
    period: "/mo",
    desc: "For ambitious professionals.",
    features: [
      "All 32+ AI career tools",
      "Unlimited learning paths",
      "Advanced analytics",
      "Priority support",
    ],
    popular: true,
  },
  {
    tier: "enterprise",
    name: "Enterprise",
    price: "Custom",
    desc: "For forward-thinking organizations.",
    features: [
      "Everything in Professional",
      "Team analytics dashboard",
      "Custom integrations",
      "Dedicated success manager",
    ],
  },
];

export function HomePricingTeaser() {
  const reveal = useReveal();
  const reduce = useReducedMotion();

  return (
    <Section className="relative">
      <SectionHeading
        eyebrow="Pricing"
        title="Choose your growth"
        highlight="plan"
        description="Start free and scale with your success. No credit card required for Explorer."
      />

      <Grid cols={3} gap="lg">
        {TEASER_TIERS.map((plan, i) => (
          <motion.div
            key={plan.name}
            {...reveal(i * 0.08)}
            whileHover={reduce ? undefined : { y: -6 }}
            className="h-full"
          >
            <Card
              variant={plan.popular ? "elevated" : "glass"}
              className={cn(
                "relative flex h-full flex-col gap-6 overflow-hidden p-8",
                plan.popular && "ring-2 ring-primary",
              )}
            >
              {plan.popular && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(100% 60% at 50% 0%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%)",
                  }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <TierBadge tier={plan.tier} />
                {plan.popular ? (
                  <Badge variant="success" size="sm" className="gap-1">
                    <IconRenderer name="sparkles" size={12} />
                    Most popular
                  </Badge>
                ) : null}
              </div>

              <div className="relative space-y-1">
                <h3 className="text-h4 text-foreground">{plan.name}</h3>
                <p className="text-body-sm text-muted-foreground">{plan.desc}</p>
              </div>

              <p className="relative flex items-baseline gap-1">
                <span className="text-data bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span className="text-body-sm text-muted-foreground">
                    {plan.period}
                  </span>
                ) : null}
              </p>

              <ul className="relative space-y-3 text-body-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <IconRenderer
                      name="check-circle"
                      size={16}
                      className="shrink-0 text-accent"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Tooltip delay={0}>
                <motion.div
                  whileHover={reduce ? undefined : { scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  className="relative mt-auto"
                >
                  <Button
                    asChild
                    variant={plan.popular ? "primary" : "secondary"}
                    className="w-full"
                  >
                    <Link href="/pricing">
                      {plan.price === "Custom"
                        ? "Contact sales"
                        : plan.price === "$0"
                          ? "Get started"
                          : "Start free trial"}
                    </Link>
                  </Button>
                </motion.div>
                <Tooltip.Content showArrow placement="top">
                  <Tooltip.Arrow />
                  {plan.price === "Custom"
                    ? "Talk to our team about volume pricing"
                    : "No credit card required to begin"}
                </Tooltip.Content>
              </Tooltip>
            </Card>
          </motion.div>
        ))}
      </Grid>

      <p className="mt-8 flex items-center justify-center gap-2 text-center text-caption text-muted-foreground">
        <IconRenderer name="shield-check" size={14} className="text-accent" />
        Your data is secure and encrypted &middot; SOC 2 Type II compliant
        &middot; GDPR ready.
      </p>
    </Section>
  );
}

/* ================================================================== */
/* CLOSING CTA — bold glowing band                                      */
/* ================================================================== */
export function HomeClosingCTA() {
  const reduce = useReducedMotion();
  return (
    <Section className="relative isolate overflow-hidden">
      <Spotlight
        className="-top-20 left-1/2 -translate-x-1/2"
        fill="var(--accent)"
      />
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-1 size-96 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary) 26%, transparent), transparent 70%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="relative">
        <CTA
          tone="gradient"
          headline="Ready to transform your professional journey?"
          body="Join thousands of professionals and organizations already accelerating their growth with Kairoo. 14-day free trial, set up in under 5 minutes, with 24/7 AI plus human support."
          primary={{ label: "Start free trial", href: "/pricing" }}
          secondary={{ label: "Schedule a demo", href: "/contact" }}
        />
      </div>
    </Section>
  );
}
