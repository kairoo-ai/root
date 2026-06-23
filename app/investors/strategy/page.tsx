import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BentoGrid } from "@/components/blocks/BentoGrid";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import AuroraBackground from "@/components/motion/AuroraBackground";
import IconRenderer from "@/components/IconRenderer";

import {
  Reveal,
  StrategyHero,
  ValidationScorePanel,
  ProblemAnalysis,
  ValueToneCards,
  IcpTabs,
  MoscowChart,
  MoscowDetail,
  RoadmapTimeline,
} from "./StrategyClient";

const strategyTitle = `SaaS Strategy & Validation Framework - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} Investors`;
const strategyDesc =
  `Comprehensive strategic analysis, market validation, and business intelligence for ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}: a 94/100 validation score, core problem analysis, value-proposition suite, three ideal customer profiles, MoSCoW feature prioritization, and the implementation roadmap.`;

export const metadata: Metadata = {
  title: strategyTitle,
  description: strategyDesc,
  alternates: { canonical: "/investors/strategy" },
  openGraph: { title: strategyTitle, description: strategyDesc, url: "/investors/strategy" },
  twitter: { card: "summary_large_image", title: strategyTitle, description: strategyDesc },
};

/* Section heading helper - consistent typographic rhythm across the page. */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-overline text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-h2 text-foreground">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-body-lg text-muted-foreground">{subtitle}</p>
      ) : null}
    </Reveal>
  );
}

/* Roadmap impact tiles - Bento highlights backing the timeline. */
const ROADMAP_BENTO = [
  {
    title: "MVP in 3 months",
    description:
      "Ship the Must-Have core - AI roadmaps, career tools, auth, and billing - and validate fit fast.",
    icon: <IconRenderer name="rocket" />,
    span: "2x1" as const,
  },
  {
    title: "Enterprise-ready by month 8",
    description:
      "Team analytics, integrations, and automation unlock the L&D buyer and scale revenue.",
    icon: <IconRenderer name="building" />,
  },
  {
    title: "Category leadership",
    description: "Partnerships and international expansion by month 12.",
    icon: <IconRenderer name="crown" />,
  },
  {
    title: "70%+ cost advantage",
    description:
      "Replaces $5K–$15K/yr of fragmented spend at $29–$99/mo - a durable wedge.",
    icon: <IconRenderer name="dollar-sign" />,
    span: "2x1" as const,
  },
];

export default function BusinessStrategy() {
  return (
    <>
      <AuroraBackground intensity="subtle" />

      {/* ---- Hero (Spotlight + Anime.js sequence) ----------------------- */}
      <Section className="pt-32">
        <StrategyHero />
      </Section>

      {/* ---- Validation framework --------------------------------------- */}
      <Section id="validation">
        <SectionHeading
          eyebrow="Validation"
          title="SaaS Idea Validation Framework"
          subtitle="A weighted assessment across four core dimensions of market opportunity."
        />
        <Grid cols={2} gap="lg" className="mt-12 items-start">
          <Reveal x={-24} y={0}>
            <ValidationScorePanel />
          </Reveal>

          <Reveal x={24} y={0}>
            <Card variant="elevated" className="p-6 md:p-8">
              <h3 className="text-h4 text-foreground">Core Problem Analysis</h3>
              <div className="mt-5">
                <ProblemAnalysis />
              </div>
            </Card>
          </Reveal>
        </Grid>
      </Section>

      {/* ---- Value proposition suite ------------------------------------ */}
      <Section id="value-props">
        <SectionHeading eyebrow="Positioning" title="Value Proposition Suite" />

        <Reveal className="mt-12">
          <CardSpotlight className="mx-auto max-w-4xl rounded-2xl p-8 text-center md:p-10">
            <p className="text-overline text-primary">Primary Value Proposition</p>
            <p className="mt-3 text-h5 font-medium text-foreground">
              &ldquo;{process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} transforms chaotic career development into strategic growth by
              combining AI-powered learning paths, comprehensive career tools, and business
              intelligence in one integrated platform, helping professionals and organizations
              accelerate skill acquisition and achieve measurable career outcomes.&rdquo;
            </p>
          </CardSpotlight>
        </Reveal>

        <div className="mt-8">
          <ValueToneCards />
        </div>
      </Section>

      {/* ---- Ideal customer profiles ------------------------------------ */}
      <Section id="icps">
        <SectionHeading
          eyebrow="Audience"
          title="Ideal Customer Profiles"
          subtitle="Three high-intent personas spanning the career-switcher, the efficiency-driven professional, and the enterprise L&D leader."
        />
        <Reveal className="mt-12">
          <IcpTabs />
        </Reveal>
      </Section>

      {/* ---- MoSCoW prioritization -------------------------------------- */}
      <Section id="moscow">
        <SectionHeading
          eyebrow="Prioritization"
          title="Feature Prioritization Framework (MoSCoW)"
          subtitle="24 candidate features sorted into Must / Should / Could / Won't, weighted by share of the roadmap."
        />
        <Grid cols={2} gap="lg" className="mt-12 items-start">
          <Reveal x={-24} y={0}>
            <Card variant="glass" className="p-6 md:p-8">
              <MoscowChart />
            </Card>
          </Reveal>
          <Reveal x={24} y={0}>
            <MoscowDetail />
          </Reveal>
        </Grid>
      </Section>

      {/* ---- Implementation roadmap ------------------------------------- */}
      <Section id="next-steps">
        <SectionHeading
          eyebrow="Execution"
          title="Strategic Implementation Roadmap"
          subtitle="A staged 12-month path from validated MVP to category leadership."
        />

        <Grid cols={2} gap="lg" className="mt-12 items-start">
          <Reveal x={-24} y={0}>
            <Card variant="glass" className="p-6 md:p-8">
              <RoadmapTimeline />
            </Card>
          </Reveal>
          <Reveal x={24} y={0}>
            <BentoGrid asSection={false} items={ROADMAP_BENTO} />
          </Reveal>
        </Grid>

        <Reveal className="mt-12">
          <CardSpotlight className="rounded-2xl p-8 text-center md:p-10">
            <Badge variant="info" size="md" className="mb-4 gap-2">
              <IconRenderer name="badge-check" size={14} />
              Validated &amp; investable
            </Badge>
            <h3 className="mx-auto max-w-2xl text-h3 text-foreground">
              A 94/100 opportunity with a clear path to execution.
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-body-lg text-muted-foreground">
              Strong urgency, a large market, demonstrated willingness to pay, and high technical
              feasibility - sequenced into a disciplined, phase-gated roadmap.
            </p>
          </CardSpotlight>
        </Reveal>
      </Section>

      <Container className="pb-24" />
    </>
  );
}
