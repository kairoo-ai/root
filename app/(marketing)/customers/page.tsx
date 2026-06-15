import type { Metadata } from "next";
import { Award } from "lucide-react";

import { CTA } from "@/components/blocks/CTA";

import { testimonials } from "@/content/testimonials";
import {
  CustomersHero,
  CustomersLogoMarquee,
  CustomersTestimonials,
  CustomersImpact,
  CustomersBento,
} from "./CustomersVisuals";

export const metadata: Metadata = {
  title: `Customers - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  description:
    `See how professionals and organizations transform their careers with ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}: real success stories and the measurable impact on skill acquisition, salary, and team productivity.`,
};

/**
 * Impact metrics - existing marketing claims preserved from the original
 * homepage (CONTENT-MAP §A "Impact metrics"). StatCounter takes a numeric
 * `value` with optional `prefix`/`suffix`, so each headline figure is split
 * accordingly (e.g. "$50K+" -> prefix "$", value 50, suffix "K+"). An `icon`
 * NAME string is passed across the server→client boundary (rendered via
 * IconRenderer) - never a lucide component reference.
 */
const impactMetrics = [
  {
    value: 75,
    suffix: "%",
    label: "Faster Skill Acquisition",
    icon: "gauge",
  },
  {
    value: 50,
    prefix: "$",
    suffix: "K+",
    label: "Average Salary Increase",
    icon: "dollar-sign",
  },
  {
    value: 6,
    suffix: " mo",
    label: "Average Career Transition Time",
    icon: "clock",
  },
  {
    value: 95,
    suffix: "%",
    label: "User Satisfaction Rate",
    icon: "star",
  },
];

/** Trusted-by wordmarks - real early-access teams using Kairoo. */
const logos = [
  { name: "Explorin" },
  { name: "Go2x" },
  { name: "Matters.AI" },
  { name: "Quantacus" },
  { name: "Shivalik College of Engineering" },
];

/** Why customers win - outcome highlights for the BentoGrid. */
const outcomeHighlights = [
  {
    title: "Personalized learning paths",
    description:
      "AI maps the shortest route from where you are to where you want to be - no generic curriculum, no wasted hours.",
    icon: "route",
    span: "2x2" as const,
  },
  {
    title: "AI coaching on demand",
    description:
      "Interview prep, salary negotiation, and growth strategy - guidance the moment you need it.",
    icon: "message-circle",
    span: "2x1" as const,
  },
  {
    title: "Measurable ROI",
    description: "Skill-gap analytics that prove development impact.",
    icon: "bar-chart-3",
  },
  {
    title: "Team-wide insight",
    description: "Dashboards that surface skill gaps across the org.",
    icon: "users",
  },
  {
    title: "Built for momentum",
    description:
      `Promotions, career switches, and enterprise productivity gains - outcomes customers report after going all-in with ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}.`,
    icon: "rocket",
    span: "2x1" as const,
  },
];

export default function CustomersPage() {
  return (
    <>
      <CustomersHero
        titleLead="Trusted by professionals and teams who are"
        titleHighlight="leveling up"
        subtitle={`See how individuals and organizations are transforming their careers and skill development with ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} - from career switches and promotions to enterprise-wide productivity gains.`}
      />

      <CustomersLogoMarquee
        label="Powering careers at teams of every size"
        logos={logos}
      />

      <CustomersTestimonials
        heading="Success stories from across the industry"
        description={`Real outcomes from professionals who used ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}'s AI-powered learning paths, coaching, and analytics to move their careers forward.`}
        items={testimonials}
      />

      <CustomersImpact
        heading="Measurable impact across industries"
        description="The outcomes our customers report - faster upskilling, stronger compensation, quicker transitions, and high satisfaction."
        metrics={impactMetrics}
      />

      <CustomersBento
        heading="The system behind every success story"
        description="The same engine - personalized paths, AI coaching, and analytics - powers every outcome above."
        items={outcomeHighlights}
        disclaimer={
          <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-5 text-body-sm text-muted-foreground">
              <span
                aria-hidden
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent"
              >
                <Award className="size-4" />
              </span>
              <p>
                Outcomes vary by individual goals, effort, and starting point. The
                figures above reflect reported customer results.
              </p>
            </div>
          </div>
        }
      />

      <CTA
        headline="Write your own success story"
        body="Start building your AI-powered career and learning command center today."
        primary={{ label: "Launch Your Journey", href: "/sign-up" }}
        secondary={{ label: "Explore Features", href: "/features" }}
      />
    </>
  );
}
