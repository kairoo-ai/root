import type { Metadata } from "next";

import { CTA } from "@/components/blocks/CTA";
import type { Feature } from "@/types";

import {
  TeamsHero,
  AnalyticsPillars,
  SkillMatrix,
  CapabilitiesBento,
  TeamsStatBand,
  type PillarCard,
} from "./TeamsVisuals";

export const metadata: Metadata = {
  title: `Team & Enterprise Analytics - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  description:
    "Enterprise-grade team analytics for skill tracking, development planning, and performance. Real-time team insights, predictive analytics, and goal alignment - visualized in the Team Skill Matrix.",
};

/**
 * The three pillars of Kairoo's enterprise team analytics. Relocated verbatim
 * (rephrased, no facts dropped) from the home "Enterprise-Grade Team
 * Analytics" section. Icon names resolve through IconRenderer's map.
 */
const ANALYTICS_PILLARS: PillarCard[] = [
  {
    id: "real-time-insights",
    icon: "users",
    title: "Real-Time Team Insights",
    description:
      "Monitor skill development across your entire organization as it happens, so you always know where your team stands.",
  },
  {
    id: "predictive-analytics",
    icon: "trending-up",
    title: "Predictive Analytics",
    description:
      "Forecast skill gaps and plan strategic development initiatives before they become bottlenecks.",
  },
  {
    id: "goal-alignment",
    icon: "target",
    title: "Goal Alignment",
    description:
      "Connect individual development with business objectives so growth ladders up to outcomes that matter.",
  },
];

// Keep the Feature type referenced so the registry shape stays in sync.
const _pillarsAsFeatures: Feature[] = ANALYTICS_PILLARS;
void _pillarsAsFeatures;

const SKILL_MATRIX_BULLETS = [
  { icon: "gauge", text: "Compare against an industry benchmark on every axis." },
  { icon: "line-chart", text: "Surface skill gaps to prioritize development planning." },
  { icon: "target", text: "Tie individual growth to organization-wide objectives." },
];

export default function TeamsFeaturePage() {
  return (
    <>
      <TeamsHero
        title="Enterprise-Grade Team Analytics"
        subtitle="Transform your organization with AI-powered team skill tracking, development planning, and performance analytics - built for the way real teams grow."
      />

      <AnalyticsPillars items={ANALYTICS_PILLARS} />

      <SkillMatrix bullets={SKILL_MATRIX_BULLETS} />

      <CapabilitiesBento />

      <TeamsStatBand />

      <CTA
        headline="Bring analytics to your whole team"
        body={`Give every leader real-time visibility into skill development, gaps, and goal alignment - powered by the same AI engine behind ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}'s individual tools.`}
        primary={{ label: "Explore Enterprise", href: "/pricing" }}
        secondary={{ label: "See all features", href: "/features" }}
      />
    </>
  );
}
