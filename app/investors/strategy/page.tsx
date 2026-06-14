import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatGrid } from "@/components/blocks/StatCounter";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import AuroraBackground from "@/components/motion/AuroraBackground";
import IconRenderer from "@/components/IconRenderer";

import {
  Reveal,
  ValidationSubscores,
  ProblemAnalysis,
  IcpTabs,
  MoscowChart,
  MoscowDetail,
} from "./StrategyClient";

export const metadata: Metadata = {
  title: "SaaS Strategy & Validation Framework — Kairoo Investors",
  description:
    "Comprehensive strategic analysis, market validation, and business intelligence for Kairoo: a 94/100 validation score, core problem analysis, value-proposition suite, three ideal customer profiles, MoSCoW feature prioritization, and the implementation roadmap.",
};

/* Section heading helper — consistent typographic rhythm across the page. */
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

const VALUE_TONES = [
  {
    icon: "lightbulb",
    title: "Action-Oriented Tone",
    quote:
      "Stop wasting time on scattered resources. Kairoo delivers personalized career acceleration with AI precision, giving you the competitive edge you need today.",
  },
  {
    icon: "shield-check",
    title: "Trust-Building Tone",
    quote:
      "Trusted by thousands of professionals worldwide, Kairoo provides scientifically-backed learning methods and proven career strategies to ensure your growth investment pays dividends.",
  },
  {
    icon: "heart-pulse",
    title: "Aspirational Tone",
    quote:
      "Unlock your unlimited potential. Kairoo doesn't just teach skills—it transforms lives, turning ambitious dreams into achievable realities through intelligent guidance.",
  },
];

const ROADMAP = [
  {
    phase: "Phase 1",
    title: "MVP Development",
    time: "Months 1–3",
    desc: "Build core Must-Have features, establish user base, validate market fit.",
  },
  {
    phase: "Phase 2",
    title: "Feature Expansion",
    time: "Months 4–8",
    desc: "Add Should-Have features, enterprise customers, scale operations.",
  },
  {
    phase: "Phase 3",
    title: "Market Leadership",
    time: "Months 9–12",
    desc: "Advanced features, partnerships, international expansion.",
  },
];

export default function BusinessStrategy() {
  return (
    <>
      <AuroraBackground intensity="subtle" />

      {/* ---- Page header ------------------------------------------------- */}
      <Section className="pt-32">
        <Reveal>
          <Badge variant="info" size="md" className="mb-6 gap-2">
            <IconRenderer name="lightbulb" size={14} />
            Strategic Business Intelligence
          </Badge>
        </Reveal>
        <Reveal>
          <h1 className="text-display text-foreground">
            SaaS Strategy &amp;{" "}
            <span className="text-primary">Validation Framework</span>
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
            Comprehensive strategic analysis, market validation, and business intelligence for
            Kairoo — your complete guide to building and scaling a successful SaaS platform.
          </p>
        </Reveal>
      </Section>

      {/* ---- Validation framework --------------------------------------- */}
      <Section id="validation">
        <SectionHeading
          eyebrow="Validation"
          title="SaaS Idea Validation Framework"
          subtitle="A weighted assessment across four core dimensions of market opportunity."
        />
        <Grid cols={2} gap="lg" className="mt-12 items-center">
          <Reveal x={-24} y={0}>
            <CardSpotlight className="rounded-xl p-8 text-center">
              <p className="text-overline text-muted-foreground">Overall Validation Score</p>
              <div className="mt-2 text-display tabular-nums text-primary">94/100</div>
              <p className="mt-2 text-body text-foreground">Exceptional market opportunity</p>
            </CardSpotlight>
            <div className="mt-6">
              <ValidationSubscores />
            </div>
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
        <SectionHeading
          eyebrow="Positioning"
          title="Value Proposition Suite"
        />

        <Reveal className="mt-12">
          <CardSpotlight className="mx-auto max-w-4xl rounded-xl p-8 text-center md:p-10">
            <p className="text-overline text-primary">Primary Value Proposition</p>
            <p className="mt-3 text-h5 font-medium text-foreground">
              &ldquo;Kairoo transforms chaotic career development into strategic growth by
              combining AI-powered learning paths, comprehensive career tools, and business
              intelligence in one integrated platform, helping professionals and organizations
              accelerate skill acquisition and achieve measurable career outcomes.&rdquo;
            </p>
          </CardSpotlight>
        </Reveal>

        <Grid cols={3} gap="lg" className="mt-8">
          {VALUE_TONES.map((tone, i) => (
            <Reveal key={tone.title} delay={i * 0.1}>
              <Card variant="interactive" className="h-full p-6">
                <span className="flex size-11 items-center justify-center rounded-lg bg-accent-subtle">
                  <IconRenderer name={tone.icon} className="text-primary" size={22} />
                </span>
                <h4 className="mt-4 text-h6 text-foreground">{tone.title}</h4>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  &ldquo;{tone.quote}&rdquo;
                </p>
              </Card>
            </Reveal>
          ))}
        </Grid>
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
        <Reveal>
          <CardSpotlight className="rounded-2xl p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-overline text-primary">Execution</p>
              <h2 className="mt-2 text-h2 text-foreground">
                Strategic Implementation Roadmap
              </h2>
            </div>

            <div className="mt-10">
              <StatGrid
                cols={3}
                items={[
                  { value: 3, suffix: " mo", label: "Phase 1 — MVP Development" },
                  { value: 5, suffix: " mo", label: "Phase 2 — Feature Expansion" },
                  { value: 4, suffix: " mo", label: "Phase 3 — Market Leadership" },
                ]}
              />
            </div>

            <Grid cols={3} gap="lg" className="mt-10">
              {ROADMAP.map((phase, i) => (
                <Reveal key={phase.phase} delay={i * 0.1}>
                  <Card variant="default" className="h-full p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-data-sm text-primary">{phase.phase}</span>
                      <Badge variant="info">{phase.time}</Badge>
                    </div>
                    <h3 className="mt-3 text-h5 text-foreground">{phase.title}</h3>
                    <p className="mt-2 text-body-sm text-muted-foreground">{phase.desc}</p>
                  </Card>
                </Reveal>
              ))}
            </Grid>
          </CardSpotlight>
        </Reveal>
      </Section>

      <Container className="pb-24" />
    </>
  );
}
