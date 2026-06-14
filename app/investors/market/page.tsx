import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { CTA } from "@/components/blocks/CTA";
import {
  Reveal,
  MarketHero,
  SectionHeading,
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

/* ------------------------------------------------------------------ */
/* Page (server component).                                            */
/* Interactive / animated / render-prop sections live in MarketViz.   */
/* ------------------------------------------------------------------ */

export default function MarketAnalysisPage() {
  return (
    <>
      <MarketHero
        eyebrow="Market Intelligence & Competitive Analysis"
        primaryCta={{ label: "View competitive matrix", href: "#competitors" }}
        secondaryCta={{ label: "See the 90-day plan", href: "#growth" }}
      />

      {/* ---------------------------------------------------------- */}
      {/* Market size & opportunity                                  */}
      {/* ---------------------------------------------------------- */}
      <Section id="market-size">
        <Stack gap={10}>
          <SectionHeading
            eyebrow="Opportunity"
            title="Market Size & Opportunity Analysis"
            subtitle="A $366B market growing at 16.3% CAGR — concentrated in the segments Kairoo is built to serve."
          />
          <Grid cols={2} gap="lg" className="items-start">
            <MarketSizePanel />
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
        <Stack gap={10}>
          <SectionHeading
            eyebrow="Competitive Intelligence"
            title="Competitive Intelligence Matrix"
            subtitle="Direct and indirect players leave a clear opening: an integrated, AI-personalized platform at a fraction of the price."
          />
          <CompetitorCards />
          <Grid cols={2} gap="lg" className="items-stretch">
            <Reveal>
              <CompetitivePricingTable />
            </Reveal>
            <Reveal delay={0.1}>
              <PositioningChartCard />
            </Reveal>
          </Grid>
        </Stack>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* Go-to-market strategy                                      */}
      {/* ---------------------------------------------------------- */}
      <Section id="gtm">
        <Stack gap={10}>
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
        <Stack gap={10}>
          <SectionHeading
            eyebrow="Execution"
            title="First 90 Days Growth Targets"
            subtitle="Month-over-month milestones from launch to $17K MRR — and a 12-week trajectory toward 8,250 users."
          />
          <MonthCards />
          <Grid cols={2} gap="lg" className="items-stretch">
            <Reveal>
              <NinetyDayTable />
            </Reveal>
            <Reveal delay={0.1}>
              <TrajectoryChartCard />
            </Reveal>
          </Grid>
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
