"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TierBadge } from "@/components/ui/TierBadge";
import { Button } from "@/components/ui/Button";
import { Spotlight } from "@/components/motion/Spotlight";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { StatGrid } from "@/components/blocks/StatCounter";
import { TestimonialGrid } from "@/components/blocks/Testimonial";
import { FeatureGrid } from "@/components/blocks/FeatureGrid";
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

/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
export function HomeHero() {
  const reduce = useReducedMotion();
  const reveal = useReveal();

  return (
    <Section className="relative isolate overflow-hidden">
      {/* Local spotlight flair (the page-level AuroraBackground lives in the
          marketing layout). Token-driven fill, reduced-motion safe. */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="var(--primary)"
      />

      <Stack
        gap={8}
        align="center"
        className="mx-auto max-w-4xl py-10 text-center sm:py-16"
      >
        <motion.div {...reveal(0)}>
          <Badge variant="info" size="md" className="gap-2">
            <IconRenderer name="lightbulb" size={14} />
            Powered by Advanced AI &middot; Gemini Integration
          </Badge>
        </motion.div>

        <motion.h1
          {...reveal(0.08)}
          className="text-display text-balance text-foreground"
        >
          Your AI-Powered Career &amp; Learning{" "}
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Command Center
          </span>
        </motion.h1>

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
          <Button asChild size="lg">
            <Link href="/pricing">Launch your journey</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/how-it-works">See how it works</Link>
          </Button>
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
                <IconRenderer key={i} name="award" size={16} />
              ))}
            </span>
            <span className="text-body-sm text-muted-foreground">
              4.9/5 from 1,000+ professionals already using Kairoo
            </span>
          </div>
        </motion.div>
      </Stack>
    </Section>
  );
}

/* ================================================================== */
/* THREE PILLARS                                                       */
/* ================================================================== */
type Pillar = {
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
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
  },
];

export function HomePillars() {
  const reveal = useReveal();

  return (
    <Section>
      <Stack gap={3} align="center" className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-overline text-accent">One platform, three pillars</p>
        <h2 className="text-h1 text-balance text-foreground">
          Everything you need to plan, learn, and lead
        </h2>
        <p className="text-body-lg text-pretty text-muted-foreground">
          Every tool is powered by advanced AI, providing personalized,
          contextual, and intelligent assistance for your unique needs.
        </p>
      </Stack>

      <Grid cols={3} gap="lg">
        {PILLARS.map((pillar, i) => (
          <motion.div key={pillar.title} {...reveal(i * 0.08)} className="h-full">
            <CardSpotlight className="flex h-full flex-col gap-5 rounded-2xl p-8">
              <span
                aria-hidden
                className="inline-flex size-12 items-center justify-center rounded-xl bg-accent-subtle text-accent"
              >
                <IconRenderer name={pillar.icon} size={26} />
              </span>
              <div className="space-y-2">
                <h3 className="text-h4 text-foreground">{pillar.title}</h3>
                <p className="text-body-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
              <ul className="space-y-2 text-body-sm text-muted-foreground">
                {pillar.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <IconRenderer
                      name="shield-check"
                      size={16}
                      className="text-accent"
                    />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={pillar.href}
                className="mt-auto inline-flex items-center gap-1 text-body-sm font-semibold text-primary hover:underline"
              >
                {pillar.cta}
                <IconRenderer name="route" size={16} />
              </Link>
            </CardSpotlight>
          </motion.div>
        ))}
      </Grid>
    </Section>
  );
}

/* ================================================================== */
/* FEATURED TOOLS STRIP                                                */
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
  return (
    <Section>
      <FeatureGrid
        columns={3}
        items={FEATURED_TOOLS}
        heading="A taste of the toolkit"
        description="Six of 32+ AI tools spanning career, learning, and strategy. Each one is personalized, contextual, and ready the moment you are."
      />
      <div className="mt-10 flex justify-center">
        <Button asChild variant="secondary" size="lg">
          <Link href="/features/career">Browse all 32+ tools</Link>
        </Button>
      </div>
    </Section>
  );
}

/* ================================================================== */
/* SOCIAL PROOF — testimonials + impact metrics                        */
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
  { value: 75, suffix: "%", label: "Faster skill acquisition" },
  { value: 50, prefix: "$", suffix: "K+", label: "Average salary increase" },
  { value: 6, suffix: " mo", label: "Average career transition" },
  { value: 95, suffix: "%", label: "User satisfaction rate" },
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
        <Card variant="elevated" className="p-8 sm:p-10">
          <h3 className="mb-8 text-center text-h4 text-foreground">
            Measurable impact across industries
          </h3>
          <StatGrid cols={4} items={IMPACT_STATS} />
        </Card>
      </motion.div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="ghost">
          <Link href="/customers">Read more customer stories</Link>
        </Button>
      </div>
    </Section>
  );
}

/* ================================================================== */
/* PRICING TEASER                                                      */
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

  return (
    <Section>
      <Stack gap={3} align="center" className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-overline text-accent">Pricing</p>
        <h2 className="text-h1 text-balance text-foreground">
          Choose your growth plan
        </h2>
        <p className="text-body-lg text-pretty text-muted-foreground">
          Start free and scale with your success. No credit card required for
          Explorer.
        </p>
      </Stack>

      <Grid cols={3} gap="lg">
        {TEASER_TIERS.map((plan, i) => (
          <motion.div key={plan.name} {...reveal(i * 0.08)} className="h-full">
            <Card
              variant={plan.popular ? "elevated" : "default"}
              className={cn(
                "flex h-full flex-col gap-6 p-8",
                plan.popular && "ring-2 ring-primary",
              )}
            >
              <div className="flex items-center justify-between">
                <TierBadge tier={plan.tier} />
                {plan.popular ? (
                  <Badge variant="success" size="sm">
                    Most popular
                  </Badge>
                ) : null}
              </div>

              <div className="space-y-1">
                <h3 className="text-h4 text-foreground">{plan.name}</h3>
                <p className="text-body-sm text-muted-foreground">{plan.desc}</p>
              </div>

              <p className="flex items-baseline gap-1">
                <span className="text-data text-foreground">{plan.price}</span>
                {plan.period ? (
                  <span className="text-body-sm text-muted-foreground">
                    {plan.period}
                  </span>
                ) : null}
              </p>

              <ul className="space-y-3 text-body-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <IconRenderer
                      name="shield-check"
                      size={16}
                      className="text-accent"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.popular ? "primary" : "secondary"}
                className="mt-auto w-full"
              >
                <Link href="/pricing">
                  {plan.price === "Custom"
                    ? "Contact sales"
                    : plan.price === "$0"
                      ? "Get started"
                      : "Start free trial"}
                </Link>
              </Button>
            </Card>
          </motion.div>
        ))}
      </Grid>

      <p className="mt-8 text-center text-caption text-muted-foreground">
        Your data is secure and encrypted &middot; SOC 2 Type II compliant
        &middot; GDPR ready.
      </p>
    </Section>
  );
}

/* ================================================================== */
/* CLOSING CTA                                                         */
/* ================================================================== */
export function HomeClosingCTA() {
  return (
    <CTA
      tone="gradient"
      headline="Ready to transform your professional journey?"
      body="Join thousands of professionals and organizations already accelerating their growth with Kairoo. 14-day free trial, set up in under 5 minutes, with 24/7 AI plus human support."
      primary={{ label: "Start free trial", href: "/pricing" }}
      secondary={{ label: "Schedule a demo", href: "/contact" }}
    />
  );
}
