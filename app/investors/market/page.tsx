import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { Hero } from "@/components/blocks/Hero";
import { CTA } from "@/components/blocks/CTA";
import {
  Reveal,
  MarketSizePanel,
  TamPanel,
  CompetitorCards,
  PositioningChartCard,
  ChannelsPanel,
  FormatsAndTacticsPanel,
  MonthCards,
  TrajectoryChartCard,
  CompetitivePricingTable,
  NinetyDayTable,
} from "./MarketViz";

export const metadata: Metadata = {
  title: "Market Analysis & Go-to-Market — Kairoo Investors",
  description:
    "Market research, competitive intelligence, and go-to-market strategy for Kairoo's entry into the $366B global EdTech market — TAM/SAM/SOM, competitive matrix, GTM channels, and a 90-day growth plan.",
};

/* Section header helper — keeps the typographic rhythm consistent. */
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
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-overline text-primary">{eyebrow}</p>
        <h2 className="mt-2 text-balance text-h1 text-foreground">{title}</h2>
        {subtitle ? (
          <p className="mt-4 text-pretty text-body-lg text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Page.                                                               */
/* ------------------------------------------------------------------ */

export default function MarketAnalysisPage() {
  return (
    <>
      <Hero
        eyebrow="Market Intelligence & Competitive Analysis"
        title={
          <>
            Market Analysis &{" "}
            <span className="text-primary">Go-to-Market Strategy</span>
          </>
        }
        subtitle="Comprehensive market research, competitive intelligence, and strategic go-to-market planning for Kairoo's entry into the $366B global education-technology market."
        primaryCta={{ label: "View competitive matrix", href: "#competitors" }}
        secondaryCta={{ label: "See the 90-day plan", href: "#growth" }}
      />

      {/* ---------------------------------------------------------- */}
      {/* Market size & opportunity                                  */}
      {/* ---------------------------------------------------------- */}
      <Section id="market-size">
        <Stack gap={12}>
          <SectionHeading
            eyebrow="Opportunity"
            title="Market Size & Opportunity Analysis"
            subtitle="A $366B market growing at 16.3% CAGR — concentrated in the segments Kairoo is built to serve."
          />
          <Grid cols={2} gap="lg" className="items-start">
            <Reveal>
              <MarketSizePanel />
            </Reveal>
            <Reveal delay={0.1}>
              <TamPanel />
            </Reveal>
          </Grid>
        </Stack>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* Competitive intelligence                                   */}
      {/* ---------------------------------------------------------- */}
      <Section id="competitors" className="bg-muted-surface/30">
        <Stack gap={12}>
          <SectionHeading
            eyebrow="Competitive Intelligence"
            title="Competitive Intelligence Matrix"
            subtitle="Direct and indirect players leave a clear opening: an integrated, AI-personalized platform at a fraction of the price."
          />
          <CompetitorCards />
          <Reveal>
            <CompetitivePricingTable />
          </Reveal>
          <Reveal>
            <PositioningChartCard />
          </Reveal>
        </Stack>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* Go-to-market strategy                                      */}
      {/* ---------------------------------------------------------- */}
      <Section id="gtm">
        <Stack gap={12}>
          <SectionHeading
            eyebrow="Distribution"
            title="Go-to-Market Strategy Framework"
            subtitle="Three demand engines, high-impact content formats, and a launch-tactics playbook engineered for compounding acquisition."
          />
          <Grid cols={2} gap="lg" className="items-start">
            <Reveal>
              <ChannelsPanel />
            </Reveal>
            <Reveal delay={0.1}>
              <FormatsAndTacticsPanel />
            </Reveal>
          </Grid>
        </Stack>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* First 90 days growth                                       */}
      {/* ---------------------------------------------------------- */}
      <Section id="growth" className="bg-muted-surface/30">
        <Stack gap={12}>
          <SectionHeading
            eyebrow="Execution"
            title="First 90 Days Growth Targets"
            subtitle="Month-over-month milestones from launch to $17K MRR — and a 12-week trajectory toward 8,250 users."
          />
          <MonthCards />
          <Reveal>
            <NinetyDayTable />
          </Reveal>
          <Reveal>
            <TrajectoryChartCard />
          </Reveal>
        </Stack>
      </Section>

      <CTA
        tone="gradient"
        headline="The market is timed for Kairoo"
        body="$366B in motion, a 16.3% CAGR, and a competitive set wide open for an integrated, AI-native platform."
        primary={{ label: "Review the investor deck", href: "/investors/deck" }}
        secondary={{ label: "Read the strategy", href: "/investors/strategy" }}
      />
    </>
  );
}
