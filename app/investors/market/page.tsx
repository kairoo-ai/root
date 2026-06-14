import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
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
/* Competitive pricing comparison — token-themed Table.                */
/* ------------------------------------------------------------------ */

const competitiveRows = [
  {
    id: "coursera",
    platform: "Coursera for Business",
    type: "Direct",
    price: "$92/month per user",
    gap: "No career-specific tools integration",
  },
  {
    id: "linkedin",
    platform: "LinkedIn Learning",
    type: "Direct",
    price: "$29.99/month",
    gap: "Generic paths, no AI personalization",
  },
  {
    id: "pluralsight",
    platform: "Pluralsight",
    type: "Direct",
    price: "$45/month",
    gap: "Limited to technical skills only",
  },
  {
    id: "masterclass",
    platform: "MasterClass",
    type: "Indirect",
    price: "$180/year",
    gap: "Entertainment > practical career skills",
  },
  {
    id: "udemy",
    platform: "Udemy Business",
    type: "Indirect",
    price: "$360/year per user",
    gap: "Quality inconsistency, no career integration",
  },
  {
    id: "skillshare",
    platform: "Skillshare",
    type: "Indirect",
    price: "$168/year",
    gap: "Lacks professional career development tools",
  },
  {
    id: "kairoo",
    platform: "Kairoo",
    type: "Our platform",
    price: "$29/month vs $92+",
    gap: "Integrated ecosystem · 3x faster · 68% cheaper",
  },
];

function CompetitivePricingTable() {
  return (
    <Card variant="default" className="overflow-hidden p-0">
      <Table aria-label="Competitive pricing and positioning comparison">
        <TableContent aria-label="Competitive pricing and positioning comparison">
          <TableHeader>
            <TableColumn id="platform" isRowHeader>
              Platform
            </TableColumn>
            <TableColumn id="type">Category</TableColumn>
            <TableColumn id="price">Price</TableColumn>
            <TableColumn id="gap">Gap vs. Kairoo</TableColumn>
          </TableHeader>
          <TableBody items={competitiveRows}>
            {(row) => (
              <TableRow id={row.id}>
                <TableCell>
                  <span className="font-semibold text-foreground">
                    {row.platform}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.type === "Our platform"
                        ? "info"
                        : row.type === "Direct"
                          ? "error"
                          : "warning"
                    }
                    size="sm"
                  >
                    {row.type}
                  </Badge>
                </TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.gap}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableContent>
      </Table>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* First-90-days financial table.                                      */
/* ------------------------------------------------------------------ */

const ninetyDayRows = [
  {
    id: "m1",
    month: "Month 1 — Foundation & Launch",
    users: "1,250",
    paid: "125",
    mrr: "$3,625",
    cac: "$28",
  },
  {
    id: "m2",
    month: "Month 2 — Optimization & Scale",
    users: "2,800",
    paid: "336",
    mrr: "$9,744",
    cac: "$24",
  },
  {
    id: "m3",
    month: "Month 3 — Growth & Retention",
    users: "4,200",
    paid: "588",
    mrr: "$17,052",
    cac: "$21",
  },
];

function NinetyDayTable() {
  return (
    <Card variant="default" className="overflow-hidden p-0">
      <Table aria-label="First 90 days financial milestones">
        <TableContent aria-label="First 90 days financial milestones">
          <TableHeader>
            <TableColumn id="month" isRowHeader>
              Milestone
            </TableColumn>
            <TableColumn id="users">New Users</TableColumn>
            <TableColumn id="paid">Paid Conversions</TableColumn>
            <TableColumn id="mrr">MRR</TableColumn>
            <TableColumn id="cac">CAC</TableColumn>
          </TableHeader>
          <TableBody items={ninetyDayRows}>
            {(row) => (
              <TableRow id={row.id}>
                <TableCell>
                  <span className="font-medium text-foreground">
                    {row.month}
                  </span>
                </TableCell>
                <TableCell>{row.users}</TableCell>
                <TableCell>{row.paid}</TableCell>
                <TableCell>
                  <span className="font-semibold text-success">{row.mrr}</span>
                </TableCell>
                <TableCell>{row.cac}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableContent>
      </Table>
    </Card>
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
