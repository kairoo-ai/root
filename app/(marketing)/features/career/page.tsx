import type { Metadata } from "next";

import { CTA } from "@/components/blocks/CTA";
import { Section } from "@/components/layout/Section";
import { features } from "@/engines/ai/features/registry";
import { routes } from "@/config/routes";

import {
  CareerToolGrid,
  CareerStatBand,
  type CareerToolCard,
  type ThemeTab,
} from "./CareerToolGrid";
import {
  CareerHero,
  CareerBento,
  CareerSteps,
} from "./CareerVisuals";

export const metadata: Metadata = {
  title: `Career & Coaching Tools - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  description:
    `The full ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} career toolkit: AI tools for roadmaps, interviews, salary negotiation, performance reviews, networking, and more - the real, single-source catalog from our AI engine.`,
};

/**
 * Career tools catalog. The registry in `engines/ai/features/registry.ts` is the
 * single source of truth for what the AI engine can do - this page renders the
 * `career` category directly from it, so the catalog can never drift from the
 * product. Honest-public: counts are derived from the registry (no invented
 * numbers), and any tool that is not `ready` is labeled "Coming soon".
 */
const careerTools = features.filter((f) => f.category === "career");

/**
 * Coarse, display-only theme grouping derived from each tool's id. Used purely
 * to power the filter Tabs - it adds no product claims and never changes the
 * underlying registry data.
 */
const THEME_LABELS: Record<string, string> = {
  plan: "Plan & Strategize",
  communicate: "Communicate",
  negotiate: "Negotiate & Decide",
  grow: "Grow & Learn",
  wellbeing: "Wellbeing & Balance",
};

function themeOf(id: string): keyof typeof THEME_LABELS {
  const plan = [
    "dynamicRoadmaps",
    "careerSimulator",
    "planner90Day",
    "goalRefiner",
    "meetingPrep",
    "stakeholderMapper",
    "jobMatcher",
    "retroHelper",
  ];
  const communicate = [
    "documentSuite",
    "bioGenerator",
    "emailAssistant",
    "postWriter",
    "pitchRefiner",
    "speakingCoach",
    "reviewAssistant",
  ];
  const negotiate = [
    "salaryCoach",
    "contractReviewer",
    "decisionCopilot",
    "conflictMediator",
    "ideaValidator",
    "budgetProposer",
  ];
  const wellbeing = ["burnoutCoach", "healthCheck", "skillScenarios"];

  if (plan.includes(id)) return "plan";
  if (communicate.includes(id)) return "communicate";
  if (negotiate.includes(id)) return "negotiate";
  if (wellbeing.includes(id)) return "wellbeing";
  return "grow"; // everything else: learning/skills/exploration tools
}

const cards: CareerToolCard[] = careerTools.map((f) => {
  const key = themeOf(f.id);
  return {
    id: f.id,
    name: f.name,
    description: f.description,
    icon: f.icon,
    ready: f.status === "ready",
    theme: THEME_LABELS[key],
  };
});

const readyCount = cards.filter((c) => c.ready).length;
const comingSoonCount = cards.length - readyCount;

// Tabs with live counts - "All" plus each theme that actually has tools.
const themeTabs: ThemeTab[] = [
  { id: "all", label: "All tools", count: cards.length },
  ...Object.entries(THEME_LABELS)
    .map(([, label]) => ({
      id: label,
      label,
      count: cards.filter((c) => c.theme === label).length,
    }))
    .filter((t) => t.count > 0),
];

const heroStats = [
  { value: cards.length, label: "Career & coaching tools" },
  { value: readyCount, label: "Ready to use today" },
  { value: themeTabs.length - 1, label: "Focus areas" },
];

const bandStats = [
  { value: cards.length, label: "AI tools in the catalog" },
  { value: readyCount, label: "Live and ready now" },
  { value: themeTabs.length - 1, label: "Career focus areas" },
];

// A few real tool glyphs to populate the hero showcase card.
const spotlightIcons = [
  { icon: "map", name: "Dynamic Roadmaps" },
  { icon: "mic", name: "Interview Coach" },
  { icon: "trending-up", name: "Salary Coach" },
  { icon: "compass", name: "Career Simulator" },
];

const bentoItems = [
  {
    title: "One catalog, every career move",
    description:
      "Roadmaps, interview prep, salary negotiation, performance reviews, networking and more - drawn from a single source of truth so nothing ever drifts from the product.",
    icon: "layers",
    span: "2x2" as const,
  },
  {
    title: "Goals become sequenced action",
    description:
      "Each tool turns an ambiguous ambition into concrete, ordered steps you can act on today.",
    icon: "route",
    span: "2x1" as const,
  },
  {
    title: "Coaching on demand",
    description: "Practice, feedback, and strategy whenever you need it.",
    icon: "sparkles",
  },
  {
    title: "Honest by design",
    description: "Every count here is derived from the live engine - no invented numbers.",
    icon: "shield-check",
  },
  {
    title: "Built for momentum",
    description:
      "Start with one tool, add the rest as your goals evolve - the toolkit grows with your career.",
    icon: "rocket",
    span: "2x1" as const,
  },
];

const steps = [
  {
    icon: "target",
    title: "Pick your goal",
    description:
      "Choose the tool that matches the move you're making - a roadmap, an interview, a raise, a review.",
  },
  {
    icon: "wand",
    title: "Add your context",
    description:
      "Drop in your role, background, and what you're aiming for. The AI tailors everything to you.",
  },
  {
    icon: "rocket",
    title: "Get a concrete plan",
    description:
      "Receive sequenced, actionable output you can use immediately - then move to the next tool.",
  },
];

export default function CareerFeaturesPage() {
  const subtitle =
    comingSoonCount > 0
      ? `${cards.length} AI tools that turn ambiguous career goals into concrete, sequenced action - from roadmaps and interview prep to salary negotiation and performance reviews. ${readyCount} are ready to use today.`
      : `${cards.length} AI tools that turn ambiguous career goals into concrete, sequenced action - from roadmaps and interview prep to salary negotiation and performance reviews.`;

  return (
    <>
      <CareerHero
        title="Your complete"
        highlight="career toolkit"
        subtitle={subtitle}
        stats={heroStats}
        pricingHref={routes.pricing}
        contactHref={routes.contact}
        spotlightIcons={spotlightIcons}
      />

      <CareerBento
        heading="A toolkit that turns intent into action"
        description="Everything you need to move your career forward, drawn from one honest, live catalog."
        items={bentoItems}
      />

      <CareerSteps
        heading="Three steps from goal to plan"
        steps={steps}
      />

      <Section className="pt-0">
        <CareerToolGrid
          tools={cards}
          themes={themeTabs}
          heading="Every career & coaching tool"
        />
      </Section>

      <Section className="pt-0">
        {/* Honest stat band - every figure is derived from the live registry. */}
        <CareerStatBand items={bandStats} />
      </Section>

      <CTA
        headline="Put the whole toolkit to work"
        body="Every tool here is one prompt away from a tailored plan. Start free and add the ones you need."
        primary={{ label: "See pricing", href: routes.pricing }}
        secondary={{ label: "Talk to us", href: routes.contact }}
      />
    </>
  );
}
