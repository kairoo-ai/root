import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import IconRenderer from "@/components/IconRenderer";

import {
  InvestorsHero,
  InvestorsTracingWrap,
  NavCards,
  MetricsBand,
  AskCard,
  WhyNowBento,
  ClosingCta,
  Reveal,
  type NavCard,
  type HeroStat,
} from "./InvestorsClient";

export const metadata: Metadata = {
  title: `Investors - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  description:
    `Everything you need to understand ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} as an investment opportunity: a \$2.5M Series A into a \$366B market. Business strategy, market analysis, the full investor deck, and technical architecture.`,
};

/* ------------------------------------------------------------------ */
/* Content (preserved + enriched)                                     */
/* ------------------------------------------------------------------ */

/** Navigation hub - the four original sections, with icons + meta. */
const sections: NavCard[] = [
  {
    href: "/investors/strategy",
    title: "Business Strategy",
    description:
      "Vision, business model, go-to-market, and the path to scale - anchored by a 94/100 validation score.",
    icon: "compass",
    meta: "Validated",
    span: "wide",
  },
  {
    href: "/investors/market",
    title: "Market Analysis",
    description:
      "Market size, segmentation, competitive landscape, and trends across a $366B opportunity.",
    icon: "trending-up",
    meta: "$366B TAM",
  },
  {
    href: "/investors/deck",
    title: "Investor Deck",
    description:
      "The full investor presentation, 12-month forecast, and supporting resources.",
    icon: "presentation",
    meta: "Series A",
  },
  {
    href: "/investors/architecture",
    title: "Technical Architecture",
    description:
      `System design, platform stack, and the engineering approach behind ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}.`,
    icon: "drafting-compass",
    meta: "Cloud-native",
    span: "wide",
  },
];

/** Hero ribbon - headline metrics with animated count-up. */
const heroRibbon: HeroStat[] = [
  { value: 2.5, prefix: "$", suffix: "M", label: "Series A raise" },
  { value: 142, prefix: "$", suffix: "B", label: "Serviceable TAM" },
  { value: 16.3, suffix: "%", label: "Market CAGR" },
  { value: 94, suffix: "/100", label: "Validation score" },
];

/** Hero trust pills. */
const heroPills = [
  { icon: "shield-check", label: "94/100 validation score" },
  { icon: "globe", label: "$366B global market" },
  { icon: "clock", label: "24-month runway" },
];

/** The headline metrics band (every metric animated). */
const metrics: HeroStat[] = [
  { value: 366, prefix: "$", suffix: "B", label: "Global market size" },
  { value: 16.3, suffix: "%", label: "Annual growth (CAGR)" },
  { value: 2.5, prefix: "$", suffix: "M", label: "Capital raise" },
  { value: 24, suffix: " mo", label: "Runway to Series B" },
];

/** The ask - round terms. */
const terms = [
  { icon: "dollar-sign", label: "Raise", value: "$2.5M" },
  { icon: "crown", label: "Equity", value: "15–20%" },
  { icon: "calendar-clock", label: "Runway", value: "24 months" },
  { icon: "flag", label: "Stage", value: "Series A" },
];

/** Allocation of capital. */
const useOfFunds = [
  { icon: "code", label: "Product & Engineering", value: 40, icon2: "" },
  { icon: "megaphone", label: "Go-to-Market", value: 30, icon2: "" },
  { icon: "users", label: "Team & Talent", value: 20, icon2: "" },
  { icon: "shield-half", label: "Operations & Runway", value: 10, icon2: "" },
].map(({ icon, label, value }) => ({ icon, label, value }));

/** Why now - investment thesis highlights. */
const whyNow = [
  {
    title: "A $366B market compounding at 16.3%",
    description:
      "Career development and professional EdTech is large, growing fast, and structurally underserved by today's fragmented tooling.",
    icon: "trending-up",
    span: "2x2" as const,
  },
  {
    title: "Validated demand",
    description: "A 94/100 validation score across problem, market, and willingness to pay.",
    icon: "badge-check",
    span: "2x1" as const,
  },
  {
    title: "Built to scale",
    description: "Cloud-native architecture engineered for compounding usage.",
    icon: "layers",
  },
  {
    title: "Capital-efficient",
    description: "24 months of runway mapped to clear Series B milestones.",
    icon: "gauge",
  },
  {
    title: "Founder-market fit",
    description:
      "A team that has lived the problem and ships fast against a focused, defensible roadmap.",
    icon: "rocket",
    span: "2x1" as const,
  },
];

export default function InvestorsPage() {
  return (
    <>
      <InvestorsHero
        eyebrow="Series A - now raising"
        headline="Invest in the"
        highlight="future of career growth"
        tail={`with ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}.`}
        subhead={`Everything you need to understand ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} as an investment opportunity - a \$2.5M raise into a \$366B market, validated and ready to scale.`}
        pills={heroPills}
        primaryCta={{ href: "/investors/deck", label: "View the deck" }}
        secondaryCta={{ href: "/investors/strategy", label: "Read the strategy" }}
        ribbon={heroRibbon}
      />

      <InvestorsTracingWrap>
        {/* Navigation hub */}
        <Section className="pt-4">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <Badge variant="neutral" className="gap-2 border border-border/70 bg-card/60 text-overline">
                <IconRenderer name="folder-kanban" size={13} className="text-accent" />
                The data room
              </Badge>
              <h2 className="mt-4 text-balance text-h2 text-foreground">
                Explore the full picture
              </h2>
              <p className="mt-3 text-pretty text-body-lg text-muted-foreground">
                Four lenses on the same opportunity. Start anywhere - every path
                leads to the deck.
              </p>
            </div>
          </Reveal>
          <NavCards items={sections} />
        </Section>

        {/* Headline metrics band */}
        <Section className="pt-0">
          <Reveal>
            <div className="mb-8 max-w-2xl">
              <Badge variant="neutral" className="gap-2 border border-border/70 bg-card/60 text-overline">
                <IconRenderer name="bar-chart-3" size={13} className="text-accent" />
                By the numbers
              </Badge>
              <h2 className="mt-4 text-balance text-h2 text-foreground">
                The opportunity, quantified
              </h2>
            </div>
          </Reveal>
          <MetricsBand items={metrics} />
        </Section>

        {/* The ask */}
        <Section className="pt-0">
          <Reveal>
            <div className="mb-8 max-w-2xl">
              <Badge variant="neutral" className="gap-2 border border-border/70 bg-card/60 text-overline">
                <IconRenderer name="dollar-sign" size={13} className="text-accent" />
                The ask
              </Badge>
              <h2 className="mt-4 text-balance text-h2 text-foreground">
                $2.5M to reach the next milestone
              </h2>
              <p className="mt-3 text-pretty text-body-lg text-muted-foreground">
                A focused round with a clear plan for every dollar.
              </p>
            </div>
          </Reveal>
          <AskCard terms={terms} useOfFunds={useOfFunds} />
        </Section>

        {/* Why now */}
        <Section className="pt-0">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <Badge variant="neutral" className="gap-2 border border-border/70 bg-card/60 text-overline">
                <IconRenderer name="zap" size={13} className="text-accent" />
                Why now
              </Badge>
              <h2 className="mt-4 text-balance text-h2 text-foreground">
                The thesis in five points
              </h2>
            </div>
          </Reveal>
          <WhyNowBento items={whyNow} />
        </Section>

        {/* Closing CTA */}
        <Section className="pt-0">
          <Container>
            <ClosingCta
              href="/investors/deck"
              label="View the investor deck"
              secondaryHref="/investors/strategy"
              secondaryLabel="Request a walkthrough"
            />
          </Container>
        </Section>
      </InvestorsTracingWrap>
    </>
  );
}
