"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { animate, stagger } from "animejs";

import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Grid } from "@/components/layout/Grid";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Accordion,
  AccordionItem,
  AccordionHeading,
  AccordionTrigger,
  AccordionPanel,
  AccordionBody,
  AccordionIndicator,
} from "@/components/ui/Accordion";
import { Spotlight } from "@/components/motion/Spotlight";
import { CardContainer, CardBody, CardItem } from "@/components/motion/ThreeDCard";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { BentoGrid, type BentoItem } from "@/components/blocks/BentoGrid";
import { StatGrid } from "@/components/blocks/StatCounter";
import IconRenderer from "@/components/IconRenderer";

/* ------------------------------------------------------------------ */
/* Serializable data shapes (passed in from the RSC page)             */
/* ------------------------------------------------------------------ */
export interface ToolCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ComingSoonCard {
  id: string;
  icon: string;
  name: string;
  description: string;
}

interface LearningVisualsProps {
  ready: ToolCard[];
  comingSoon: ComingSoonCard[];
}

/* ------------------------------------------------------------------ */
/* Shared reveal helper - reduced-motion safe                          */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1] as const;

function useReveal() {
  const reduce = useReducedMotion();
  return (delay = 0) =>
    reduce
      ? {}
      : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: EASE, delay },
      };
}

/* ================================================================== */
/* HERO - Spotlight + anime.js staggered headline + StatGrid          */
/* ================================================================== */
const HERO_STATS = [
  { value: 3, suffix: " tools", label: "Live learning engines" },
  { value: 24, suffix: "/7", label: "AI tutor availability" },
  { value: 75, suffix: "%", label: "Faster skill acquisition" },
  { value: 100, suffix: "%", label: "Tailored to your level" },
];

function LearningHero() {
  const reduce = useReducedMotion();
  const reveal = useReveal();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Elaborate anime.js entrance: split the headline into word spans and
  // stagger them in. Reduced-motion safe (we bail before animating).
  useEffect(() => {
    if (reduce) return;
    const el = headlineRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;

    animate(words, {
      opacity: [0, 1],
      translateY: [28, 0],
      filter: ["blur(8px)", "blur(0px)"],
      duration: 900,
      delay: stagger(70),
      ease: "out(3)",
    });
  }, [reduce]);

  const headline = "Learn any skill with a path that adapts to you";
  const words = headline.split(" ");
  // Words to lift into the teal->accent gradient highlight.
  const highlightIdx = new Set([words.length - 3, words.length - 2, words.length - 1]);

  return (
    <Section className="relative isolate overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:-top-24 md:left-52"
        fill="var(--primary)"
      />
      <Spotlight
        className="-top-20 right-0 md:-top-10 md:left-[60%]"
        fill="var(--accent)"
      />

      <Stack
        gap={8}
        align="center"
        className="mx-auto max-w-4xl py-12 text-center sm:py-16"
      >
        <motion.div {...reveal(0)}>
          <Badge variant="info" size="md" className="gap-2">
            <IconRenderer name="sparkles" size={14} />
            Intelligent Learning Paths
          </Badge>
        </motion.div>

        <h1
          ref={headlineRef}
          className="text-display text-balance text-foreground"
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              data-word
              className={cn(
                "inline-block",
                reduce ? "" : "will-change-transform",
                highlightIdx.has(i) &&
                "bg-linear-to-r from-primary to-accent bg-clip-text text-transparent",
              )}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <motion.p
          {...reveal(0.16)}
          className="max-w-2xl text-pretty text-body-lg text-muted-foreground"
        >
          Tell {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} what you want to master and the AI builds the curriculum,
          tutors you through it, and turns theory into portfolio-ready projects -
          scaled to your timeline and level.
        </motion.p>

        <motion.div
          {...reveal(0.24)}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg">
            <Link href="/sign-up">Get started free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/features">Explore all features</Link>
          </Button>
        </motion.div>

        <motion.div {...reveal(0.32)} className="w-full">
          <Card variant="glass" className="p-6 sm:p-8">
            <StatGrid cols={4} items={HERO_STATS} />
          </Card>
        </motion.div>
      </Stack>
    </Section>
  );
}

/* ================================================================== */
/* AVAILABLE NOW - ThreeDCard tilt + CardSpotlight glow per tool       */
/* ================================================================== */
function AvailableNow({ ready }: { ready: ToolCard[] }) {
  const reveal = useReveal();

  return (
    <Section className="pt-0">
      <Stack gap={3} align="center" className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-h1 text-balance text-foreground">
          Three AI learning tools you can use today
        </h2>
        <p className="text-body-lg text-pretty text-muted-foreground">
          Each one generates a tailored, actionable plan from a couple of inputs -
          no setup, no fluff, ready the moment you are.
        </p>
      </Stack>

      <Grid cols={3} gap="lg">
        {ready.map((tool, i) => (
          <motion.div key={tool.id} {...reveal(i * 0.1)} className="h-full">
            <CardContainer containerClassName="!py-0 h-full" className="h-full w-full">
              <CardBody className="h-full w-full">
                <CardSpotlight className="flex h-full flex-col gap-5 rounded-2xl p-8">
                  <CardItem translateZ={50}>
                    <span
                      aria-hidden
                      className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent shadow-elevation-1"
                    >
                      <IconRenderer name={tool.icon} size={28} />
                    </span>
                  </CardItem>

                  <CardItem translateZ={40} as="div" className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-h4 text-foreground">{tool.title}</h3>
                      <Badge variant="success" size="sm">
                        Live
                      </Badge>
                    </div>
                    <p className="text-body-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </CardItem>

                  <CardItem
                    translateZ={30}
                    as={Link}
                    href="/sign-up"
                    className="mt-auto inline-flex items-center gap-1 text-body-sm font-semibold text-primary hover:underline"
                  >
                    Try it free
                    <IconRenderer name="arrow-right" size={16} />
                  </CardItem>
                </CardSpotlight>
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </Grid>
    </Section>
  );
}

/* ================================================================== */
/* HOW IT WORKS - BentoGrid of the learning loop                       */
/* ================================================================== */
const BENTO_ITEMS: BentoItem[] = [
  {
    id: "curriculum",
    title: "A curriculum built around your goal",
    description:
      `Name a skill and a timeline - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} sequences a week-by-week path from the best-known resources, scaled to where you are now.`,
    icon: <IconRenderer name="route" size={22} />,
    span: "2x2",
  },
  {
    id: "tutor",
    title: "A tutor that never sleeps",
    description:
      "Stuck on a concept? Get a clear, level-appropriate explanation with an example and a self-check - 24/7.",
    icon: <IconRenderer name="message-circle" size={22} />,
    span: "2x1",
  },
  {
    id: "projects",
    title: "Theory becomes portfolio",
    description:
      "Every phase ships a hands-on, milestone-driven project you can show.",
    icon: <IconRenderer name="wrench" size={22} />,
  },
  {
    id: "checkpoints",
    title: "Checkpoints that prove progress",
    description: "Measurable milestones keep effort honest and momentum visible.",
    icon: <IconRenderer name="check-circle" size={22} />,
  },
  {
    id: "level",
    title: "Pitched to your level - beginner to advanced",
    description:
      "The same engine scales ambition up or down so the path never feels too shallow or too steep.",
    icon: <IconRenderer name="layers" size={22} />,
    span: "2x1",
  },
];

function HowItWorks() {
  return (
    <BentoGrid
      eyebrow="The learning loop"
      heading="Plan, learn, build - on one adaptive surface"
      description={`${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} closes the gap between a goal and the work that gets you there: a sequenced path, an always-on tutor, and projects that turn knowledge into proof.`}
      items={BENTO_ITEMS}
      className="pt-0"
    />
  );
}

/* ================================================================== */
/* ROADMAP - CardSpotlight glass cards + animated coming-soon badge    */
/* ================================================================== */
function Roadmap({ comingSoon }: { comingSoon: ComingSoonCard[] }) {
  const reveal = useReveal();

  if (!comingSoon.length) return null;

  return (
    <Section className="pt-0">
      <Stack gap={3} align="center" className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-h2 text-balance text-foreground">
          The next wave of learning intelligence
        </h2>
        <p className="text-body-lg text-pretty text-muted-foreground">
          Visual progress analytics, paths that evolve as you grow, and team-level
          insights for organizations.
        </p>
      </Stack>

      <Grid cols={3} gap="lg">
        {comingSoon.map((f, i) => (
          <motion.div key={f.id} {...reveal(i * 0.1)} className="h-full">
            <CardSpotlight className="h-full rounded-2xl border-dashed p-8">
              <Stack gap={5}>
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden
                    className="inline-flex size-12 items-center justify-center rounded-xl bg-muted-surface text-muted-foreground"
                  >
                    <IconRenderer name={f.icon} size={24} />
                  </span>
                  <Badge variant="info" size="sm" className="gap-1.5">
                    <motion.span
                      aria-hidden
                      className="inline-block size-1.5 rounded-full bg-info"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    Coming soon
                  </Badge>
                </div>
                <Stack gap={2}>
                  <h3 className="text-h4 text-foreground">{f.name}</h3>
                  <p className="text-body-sm text-muted-foreground">
                    {f.description}
                  </p>
                </Stack>
              </Stack>
            </CardSpotlight>
          </motion.div>
        ))}
      </Grid>
    </Section>
  );
}

/* ================================================================== */
/* FAQ - HeroUI Accordion for interactivity                            */
/* ================================================================== */
const FAQS = [
  {
    id: "how",
    q: `How does ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} build my learning path?`,
    a: "Tell it the skill you want to master and your timeline. The AI sequences a week-by-week (or month-by-month) curriculum from well-known resources, adds a hands-on project per phase, and sets checkpoints so you can measure progress.",
  },
  {
    id: "level",
    q: "Does it adapt to my experience level?",
    a: "Yes. Every learning tool scales scope and depth to your stated level - from complete beginner to advanced - so the path never feels too shallow or too steep.",
  },
  {
    id: "tutor",
    q: "Can I ask questions while I learn?",
    a: "The AI Tutor answers any question with a clear explanation, a worked example, and a suggested follow-up - available whenever you need it.",
  },
  {
    id: "projects",
    q: "Will I have something to show at the end?",
    a: "Project-Based Learning turns each phase into a milestone-driven build, so you finish with portfolio-ready work, not just notes.",
  },
];

function LearningFAQ() {
  const reveal = useReveal();

  return (
    <Section className="pt-0">
      <Stack gap={3} align="center" className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-h2 text-balance text-foreground">
          Everything you need to start learning
        </h2>
      </Stack>

      <motion.div {...reveal(0.05)} className="mx-auto max-w-2xl">
        <Card variant="glass" className="p-2 sm:p-4">
          <Accordion variant="surface" defaultExpandedKeys={["how"]}>
            {FAQS.map((item) => (
              <AccordionItem key={item.id} id={item.id}>
                <AccordionHeading>
                  <AccordionTrigger className="text-left text-body font-semibold text-foreground">
                    <span className="flex-1">{item.q}</span>
                    <AccordionIndicator />
                  </AccordionTrigger>
                </AccordionHeading>
                <AccordionPanel>
                  <AccordionBody className="text-body-sm text-muted-foreground">
                    {item.a}
                  </AccordionBody>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/* PUBLIC - full elevated stack                                        */
/* ================================================================== */
export function LearningVisuals({ ready, comingSoon }: LearningVisualsProps) {
  return (
    <>
      <LearningHero />
      <AvailableNow ready={ready} />
      <HowItWorks />
      <Roadmap comingSoon={comingSoon} />
      <LearningFAQ />
    </>
  );
}

export default LearningVisuals;
