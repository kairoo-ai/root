import type { Metadata } from "next";

import {
  AboutHero,
  MissionStatement,
  PillarBento,
  MilestoneStats,
  MilestonesTimeline,
  ValueGrid,
  TeamSection,
  AboutCta,
  type PillarData,
  type ValueData,
  type StatData,
  type TeamData,
} from "./AboutVisuals";

const aboutTitle = `About ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} - The right moment to grow`;
const aboutDesc =
  `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} turns chaotic career development into strategic growth - combining AI-powered learning paths, a complete career toolkit, and business intelligence in one integrated platform.`;

export const metadata: Metadata = {
  title: aboutTitle,
  description: aboutDesc,
  alternates: { canonical: "/about" },
  openGraph: { title: aboutTitle, description: aboutDesc, url: "/about" },
  twitter: { card: "summary_large_image", title: aboutTitle, description: aboutDesc },
};

/**
 * What makes Kairoo different - the three real product pillars, framed as
 * positioning (not fabricated metrics). Sourced from CONTENT-MAP §A Platform
 * Overview / §C primary value proposition (public-safe parts).
 *
 * Icons cross the server→client boundary as NAME strings only (resolved via
 * IconRenderer) so no component reference is passed into the client visuals.
 */
const PILLARS: PillarData[] = [
  {
    id: "career",
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    icon: "compass",
    tag: "The core",
    title: "A complete career toolkit",
    description:
      "Dynamic roadmaps, an interview coach, salary-negotiation prep, performance-review help, and a deep catalogue of AI-powered tools - so every stage of your career has a clear next step.",
  },
  {
    id: "learning",
    span: "lg:col-span-2 lg:row-span-1",
    icon: "graduation-cap",
    tag: "Learning",
    title: "Intelligent learning paths",
    description:
      "Personalized curricula, an AI tutor, progress tracking, and project-based practice that adapt as your goals and skills change.",
  },
  {
    id: "intelligence",
    span: "lg:col-span-2 lg:row-span-1",
    icon: "bar-chart-3",
    tag: "Intelligence",
    title: "Strategic business intelligence",
    description:
      "Market research, persona development, go-to-market planning, and team analytics that connect individual growth to organizational outcomes.",
  },
  {
    id: "integrated",
    span: "sm:col-span-2 lg:col-span-4 lg:row-span-1",
    icon: "sparkles",
    tag: "One platform",
    title: "One integrated platform",
    description:
      "Career tools, learning, and intelligence share a single surface - no scattered tabs, no lost context. Growth becomes a strategy, not a scramble.",
  },
];

/**
 * Company values - rendered through the animated ValueGrid (string icon names
 * resolved by IconRenderer). These are principles, not claims.
 */
const VALUES: ValueData[] = [
  {
    id: "timing",
    icon: "compass",
    title: "Timing over hustle",
    description:
      "Growth isn't only about effort - it's about acting at the right moment. We help people recognize and seize that moment with confidence.",
  },
  {
    id: "outcomes",
    icon: "target",
    title: "Measurable outcomes",
    description:
      "Every roadmap, lesson, and tool is tied to a tangible result. Progress you can see beats activity you can't.",
  },
  {
    id: "guidance",
    icon: "lightbulb",
    title: "Guidance, not noise",
    description:
      "AI should clarify the path, not add to the overwhelm. We turn scattered resources into one clear, personalized route forward.",
  },
  {
    id: "trust",
    icon: "shield-check",
    title: "Built to be trusted",
    description:
      "We design with privacy and accountability in mind, and frame our compliance honestly - building toward the standards our users and their teams rely on.",
  },
  {
    id: "people",
    icon: "users",
    title: "People first",
    description:
      "Behind every roadmap is a person making a real decision about their future. We keep that human at the center of every feature we ship.",
  },
  {
    id: "momentum",
    icon: "trending-up",
    title: "Compounding momentum",
    description:
      "Small, well-sequenced steps compound. We optimize for sustainable progress that builds on itself over months, not motivational spikes.",
  },
];

/**
 * Milestone stats - positioning facts about the platform's shape (three
 * connected pillars, one unified surface), not fabricated traction metrics.
 */
const STATS: StatData[] = [
  { value: 3, label: "Connected product pillars" },
  { value: 1, label: "Unified platform surface" },
  { value: 100, suffix: "%", label: "AI-guided next steps" },
  { value: 0, label: "Scattered tabs to juggle" },
];

const TEAM: TeamData[] = [
  {
    icon: "target",
    title: "Product & design",
    body: "Shaping a single, focused surface where growth feels obvious instead of overwhelming.",
  },
  {
    icon: "sparkles",
    title: "AI & engineering",
    body: "Building the AI engine behind every roadmap, tutor, and tool - reliable, fast, and useful.",
  },
  {
    icon: "heart-pulse",
    title: "Learning & success",
    body: "Translating real career and learning outcomes into the guidance the product delivers.",
  },
];

const MISSION_PARAGRAPHS = [
  "Careers used to follow a straight line. Today, the skills that define a role can shift in just a few years, and the resources meant to help - courses, coaches, communities, tools - are scattered across a dozen tabs. The result is a lot of effort spent on the wrong things at the wrong time.",
  `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} exists to fix that. We bring AI-powered learning paths, a full career toolkit, and business intelligence together in one place, so people and the teams they belong to can stop guessing and start moving with intent. Instead of asking “what should I learn next?” and hoping, you get a clear, personalized route from where you are to where you want to be - and the tools to walk it.`,
  "The name says it plainly: there is a right moment to grow. Our job is to help you find it, and then to make the next step obvious.",
];

export default function AboutPage() {
  return (
    <>
      <AboutHero
        titleLead="The right"
        titleHighlight="moment"
        titleTail="to grow"
        subtitle={`${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} turns chaotic career development into strategic growth - combining AI-powered learning paths, a complete career toolkit, and business intelligence in one integrated platform that helps professionals and teams accelerate skill acquisition and reach measurable outcomes.`}
        primaryCta={{ label: "Explore the platform", href: "/features" }}
        secondaryCta={{ label: "See pricing", href: "/sign-up" }}
      />

      <MissionStatement
        heading="Make career growth a strategy, not a scramble"
        paragraphs={MISSION_PARAGRAPHS}
      />

      <PillarBento
        heading="Three capabilities, one platform"
        description="The product is organized around three connected pillars. Each is useful on its own - together they turn growth into a continuous, guided loop."
        pillars={PILLARS}
      />

      <MilestoneStats
        heading="How the platform adds up"
        description="Not vanity metrics - the structural facts that make growth feel guided instead of chaotic."
        stats={STATS}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-h2 text-foreground mb-2">Our journey</h2>
        <MilestonesTimeline />
      </section>

      <ValueGrid
        heading="What we value"
        description="The principles that shape every decision we make - from the roadmap we build to the way we talk about it."
        values={VALUES}
      />

      <TeamSection
        heading="Builders, learners, and career-changers"
        description={`${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} is built by a small, focused team that has lived the problem we’re solving - navigating career pivots, skill gaps, and the overwhelm of doing it alone. Detailed team profiles are on the way.`}
        members={TEAM}
        note={`We keep our story honest. As ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} grows, we’ll introduce the people behind it here - with real names, roles, and the work they’ve shipped.`}
      />

      <AboutCta
        headline="There's a right moment to grow. Make it now."
        body={`Start with a personalized roadmap, or talk to us about rolling ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} out across your team.`}
        primary={{ label: "Get started", href: "/sign-up" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
