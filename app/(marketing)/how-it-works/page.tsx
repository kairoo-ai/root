import type { Metadata } from "next";
import Link from "next/link";
import {
  SatelliteDish,
  Brain,
  Workflow,
  Sparkles,
  ShieldCheck,
  GitBranch,
  Repeat,
  FileText,
  Plug,
  UserCheck,
  Gauge,
  ArrowRight,
} from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { PageHeader, type PageHeaderProps } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/blocks/Hero";
import { BentoGrid, type BentoItem } from "@/components/blocks/BentoGrid";
import { FAQ } from "@/components/blocks/FAQ";
import { CTA } from "@/components/blocks/CTA";

export const metadata: Metadata = {
  title: "How It Works — Sense, Think, Act | Kairoo",
  description:
    "See how Kairoo turns your goals into momentum: a Sense → Think → Act loop powered by Next.js and a Gemini-backed AI gateway, with you in control at every step.",
};

/* -------------------------------------------------------------------------- */
/*  Data — public-safe. Reflects the REAL stack (Next.js + engines/ai Gemini   */
/*  gateway). Deeper architecture is linked, not claimed, on this page.         */
/* -------------------------------------------------------------------------- */

type Step = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  icon: typeof SatelliteDish;
  points: string[];
};

const STEPS: Step[] = [
  {
    id: "sense",
    index: "01",
    title: "Sense",
    tagline: "We start with your context",
    description:
      "Every tool begins by reading where you actually are — your goal, your role, your inputs. You paste a resume, describe a target role, or outline a team's skills, and Kairoo structures that into clean context the model can reason over.",
    icon: SatelliteDish,
    points: [
      "Typed inputs per tool — no blank-page guesswork",
      "Inputs stay scoped to the task you're running",
      "Works from what you have: text, goals, or a rough draft",
    ],
  },
  {
    id: "think",
    index: "02",
    title: "Think",
    tagline: "Our AI gateway does the reasoning",
    description:
      "Your context flows through the Kairoo AI engine — a server-side gateway built on Google's Gemini models. Each feature carries its own purpose-built prompt, so the model reasons against a clear objective instead of an open chat.",
    icon: Brain,
    points: [
      "Gemini-backed reasoning via the engines/ai gateway",
      "A dedicated, tuned prompt for every feature",
      "Runs on the server — your inputs never drive a raw chat box",
    ],
  },
  {
    id: "act",
    index: "03",
    title: "Act",
    tagline: "You get something you can use",
    description:
      "The result comes back as a concrete artifact — a roadmap, a negotiation script, a tailored learning path, a review draft. Keep it, refine it, or feed it into the next tool. The output is the starting point, not the finish line.",
    icon: Workflow,
    points: [
      "Structured, usable outputs — not just an answer",
      "Iterate: refine inputs and re-run in seconds",
      "Chain tools together as your goals evolve",
    ],
  },
];

// The "see who's involved" loop — framed honestly as how the product behaves,
// not as aspirational infrastructure (that lives on /investors/architecture).
const LOOP_ITEMS: BentoItem[] = [
  {
    title: "One coherent flow",
    description:
      "Sense, Think, and Act aren't separate products — they're one loop you move through, with each output ready to become the next tool's input.",
    icon: <Repeat aria-hidden />,
    span: "2x2",
  },
  {
    title: "Purpose-built prompts",
    description:
      "Every feature ships with its own prompt and inputs, so the AI reasons toward a real outcome — not a generic reply.",
    icon: <FileText aria-hidden />,
    span: "2x1",
  },
  {
    title: "You stay in control",
    description: "Nothing ships on your behalf. You review, edit, and decide what to keep.",
    icon: <UserCheck aria-hidden />,
  },
  {
    title: "Modern, fast foundation",
    description: "Built on Next.js with a server-side AI gateway — responsive in the browser, reasoning on the backend.",
    icon: <Gauge aria-hidden />,
  },
  {
    title: "Designed to extend",
    description:
      "A single feature registry powers the catalog, so the toolkit grows without re-architecting how Sense → Think → Act works.",
    icon: <GitBranch aria-hidden />,
    span: "2x1",
  },
];

const STACK_FACTS = [
  {
    title: "Next.js application layer",
    description:
      "The experience you interact with — pages, forms, and results — is a modern Next.js app, server-rendered for speed and reliability.",
    icon: Plug,
  },
  {
    title: "engines/ai gateway",
    description:
      "A single server-side gateway brokers every AI request through Google's Gemini models, keeping prompts, inputs, and behavior consistent across tools.",
    icon: Brain,
  },
  {
    title: "Privacy-minded by design",
    description:
      "Reasoning happens server-side and is scoped to the task you run. We frame our compliance posture as compliance-ready — building toward recognized standards, not over-claiming certification.",
    icon: ShieldCheck,
  },
];

const FAQ_ITEMS = [
  {
    id: "models",
    question: "What AI actually powers Kairoo?",
    answer:
      "Kairoo's reasoning runs through a server-side AI gateway built on Google's Gemini models. The app itself is built with Next.js. Each feature uses a purpose-built prompt rather than an open chat, so results stay focused on the task you're running.",
  },
  {
    id: "tools",
    question: "How many tools can I run through this loop?",
    answer:
      "The same Sense → Think → Act loop powers every feature in the Kairoo catalog — 35 AI tools are ready to use today across career and learning, with 3 more on the way. New tools plug into the same flow.",
  },
  {
    id: "control",
    question: "Does the AI take actions on its own?",
    answer:
      "No. Kairoo produces drafts and artifacts for you to review, edit, and decide on. The 'Act' step gives you something usable — you stay in control of what happens next.",
  },
  {
    id: "data",
    question: "What happens to the information I enter?",
    answer:
      "Inputs are scoped to the specific tool you run and processed server-side to generate your result. We take a privacy-minded, compliance-ready approach to how that data is handled.",
  },
  {
    id: "architecture",
    question: "Where can I see the deeper technical detail?",
    answer:
      "This page is the plain-language version. For the full system blueprint — ingestion, reasoning fabric, scaling, and roadmap — see the technical blueprint linked at the bottom of this page.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function HowItWorksPage() {
  return (
    <>
      <Hero
        eyebrow="How it works"
        title="Sense. Think. Act."
        subtitle="Kairoo turns where you are into your next move through one simple loop — and a Gemini-backed AI engine does the heavy thinking, with you in control at every step."
        primaryCta={{ label: "Explore the tools", href: "/features" }}
        secondaryCta={{ label: "See pricing", href: "/pricing" }}
      />

      {/* The three steps — the core narrative, laid out as a responsive Grid. */}
      <Section aria-labelledby="steps-heading">
        <Stack gap={12}>
          <PageHeader
            size="sm"
            eyebrow="The loop"
            title={(<span id="steps-heading">Three steps, every single tool</span>) as PageHeaderProps["title"]}
            subtitle="From a résumé to a negotiation script to a team's skill matrix — every Kairoo feature follows the same path. Once you know the loop, you know the whole product."
          />

          <Grid cols={3} gap="lg">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.id}
                  variant="interactive"
                  className="flex h-full flex-col gap-5 p-7"
                >
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-12 items-center justify-center rounded-xl bg-accent-subtle text-accent [&_svg]:size-6"
                    >
                      <Icon />
                    </span>
                    <span className="text-data tabular-nums text-muted-foreground/50">
                      {step.index}
                    </span>
                  </div>

                  <Stack gap={2}>
                    <Badge variant="info" size="sm" className="w-fit">
                      {step.tagline}
                    </Badge>
                    <h3 className="text-h3 text-foreground">{step.title}</h3>
                    <p className="text-body-sm text-muted-foreground">{step.description}</p>
                  </Stack>

                  <ul className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                    {step.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-body-sm text-foreground"
                      >
                        <ArrowRight
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-accent"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </Grid>
        </Stack>
      </Section>

      {/* The loop, expanded — Bento layout describing how the product behaves. */}
      <BentoGrid
        eyebrow="One loop, many tools"
        heading="Why the same flow works for everything"
        description="The loop is deliberately simple so the toolkit can grow without getting more complicated to use."
        items={LOOP_ITEMS}
      />

      {/* The real stack — honest, public-safe; deeper detail is linked, not claimed. */}
      <Section aria-labelledby="stack-heading" className="bg-muted-surface">
        <Stack gap={12}>
          <PageHeader
            size="sm"
            eyebrow="Under the hood"
            title={(<span id="stack-heading">The real stack behind the loop</span>) as PageHeaderProps["title"]}
            subtitle="No mystery. Kairoo runs on a modern web foundation with a single AI gateway — here's the honest version."
          />

          <Grid cols={3} gap="lg">
            {STACK_FACTS.map((fact) => {
              const Icon = fact.icon;
              return (
                <Card key={fact.title} className="flex h-full flex-col gap-4 p-6">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-11 items-center justify-center rounded-lg bg-accent-subtle text-accent [&_svg]:size-5"
                  >
                    <Icon />
                  </span>
                  <h3 className="text-h5 text-foreground">{fact.title}</h3>
                  <p className="text-body-sm text-muted-foreground">{fact.description}</p>
                </Card>
              );
            })}
          </Grid>

          {/* Link to the deeper blueprint rather than re-claiming infra here. */}
          <Card variant="elevated" className="flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent [&_svg]:size-5"
              >
                <Sparkles />
              </span>
              <Stack gap={1}>
                <h3 className="text-h5 text-foreground">Want the full engineering picture?</h3>
                <p className="text-body-sm text-muted-foreground">
                  Signal ingestion, the reasoning fabric, the action layer, scaling and roadmap —
                  the complete system blueprint lives with our technical deep-dive.
                </p>
              </Stack>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/investors/architecture">
                See technical blueprint
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </Card>
        </Stack>
      </Section>

      <FAQ
        eyebrow="Questions"
        title="How the loop works in practice"
        items={FAQ_ITEMS}
      />

      <CTA
        headline="Run your first loop"
        body="Pick a goal, give Kairoo the context, and get something you can use in minutes."
        primary={{ label: "Browse the toolkit", href: "/features" }}
        secondary={{ label: "Compare plans", href: "/pricing" }}
      />
    </>
  );
}
