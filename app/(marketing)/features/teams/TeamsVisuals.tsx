"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { animate, stagger } from "animejs";
import { motion, useReducedMotion } from "motion/react";

import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BentoGrid, type BentoItem } from "@/components/blocks/BentoGrid";
import { StatGrid } from "@/components/blocks/StatCounter";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { Spotlight } from "@/components/motion/Spotlight";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/Tooltip";
import IconRenderer from "@/components/IconRenderer";
import TeamSkillChart from "@/components/TeamSkillChart";

/* ------------------------------------------------------------------ */
/* Shared scroll-reveal helper (token-clean, reduced-motion safe).     */
/* ------------------------------------------------------------------ */
function useReveal() {
  const reduce = useReducedMotion();
  return (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            delay,
          },
        };
}

/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
export interface TeamsHeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
}

export function TeamsHero({ eyebrow, title, subtitle }: TeamsHeroProps) {
  const reduce = useReducedMotion();
  const reveal = useReveal();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Anime.js elaborate headline sequence — word-by-word rise + blur clear.
  useEffect(() => {
    if (reduce || !headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll<HTMLElement>(
      "[data-word]",
    );
    if (!words.length) return;
    animate(words, {
      opacity: [0, 1],
      translateY: [28, 0],
      filter: ["blur(10px)", "blur(0px)"],
      duration: 900,
      delay: stagger(90),
      ease: "out(3)",
    });
  }, [reduce]);

  const words = title.split(" ");
  // Highlight the final two words with a teal->navy gradient.
  const splitAt = Math.max(0, words.length - 2);

  return (
    <Section className="relative isolate overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:-top-24 md:left-52"
        fill="var(--primary)"
      />
      <Spotlight
        className="-top-20 right-0 rotate-180 md:right-40"
        fill="var(--accent)"
      />

      <Stack
        gap={8}
        align="center"
        className="mx-auto max-w-4xl py-12 text-center sm:py-16"
      >
        <motion.div {...reveal(0)}>
          <Badge variant="info" size="md" className="gap-2">
            <IconRenderer name="radar" size={14} />
            {eyebrow}
          </Badge>
        </motion.div>

        <h1
          ref={headlineRef}
          className="text-display text-balance text-foreground"
        >
          {words.map((word, i) => {
            const isHighlight = i >= splitAt;
            return (
              <span
                key={`${word}-${i}`}
                data-word
                className={
                  isHighlight
                    ? "mr-[0.25em] inline-block bg-linear-to-r from-primary to-accent bg-clip-text text-transparent"
                    : "mr-[0.25em] inline-block"
                }
                style={reduce ? undefined : { opacity: 0 }}
              >
                {word}
              </span>
            );
          })}
        </h1>

        <motion.p
          {...reveal(0.18)}
          className="max-w-2xl text-pretty text-body-lg text-muted-foreground"
        >
          {subtitle}
        </motion.p>

        <motion.div
          {...reveal(0.26)}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg">
            <Link href="/pricing">Explore Enterprise</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/features">See all features</Link>
          </Button>
        </motion.div>

        {/* Live-signal trust row */}
        <motion.div
          {...reveal(0.34)}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-body-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-2 animate-pulse rounded-full bg-accent"
            />
            Real-time skill telemetry
          </span>
          <span className="flex items-center gap-2">
            <IconRenderer name="shield-check" size={16} className="text-accent" />
            Enterprise-grade & auditable
          </span>
          <span className="flex items-center gap-2">
            <IconRenderer name="sparkles" size={16} className="text-accent" />
            Powered by Kairoo AI
          </span>
        </motion.div>
      </Stack>
    </Section>
  );
}

/* ================================================================== */
/* ANALYTICS PILLARS — ThreeDCard tilt + CardSpotlight glow            */
/* ================================================================== */
export interface PillarCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export function AnalyticsPillars({ items }: { items: PillarCard[] }) {
  const reveal = useReveal();

  return (
    <Section className="pt-0">
      <motion.header {...reveal(0)} className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-h2 text-balance text-foreground">
          One engine, total team{" "}
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            visibility
          </span>
        </h2>
        <p className="text-body-lg mt-4 text-pretty text-muted-foreground">
          The same AI that powers individual growth, scaled to every leader and
          every team.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.div key={item.id} {...reveal(0.06 * index)}>
            <CardContainer
              containerClassName="py-0"
              className="h-full w-full"
            >
              <CardBody className="h-full w-full">
                <CardSpotlight className="flex h-full flex-col gap-5 rounded-2xl p-8">
                  <CardItem translateZ={50}>
                    <span
                      aria-hidden
                      className="inline-flex size-12 items-center justify-center rounded-xl bg-accent-subtle text-accent ring-1 ring-border"
                    >
                      <IconRenderer name={item.icon} size={24} />
                    </span>
                  </CardItem>
                  <CardItem translateZ={40} as="h3" className="text-h4 text-foreground">
                    {item.title}
                  </CardItem>
                  <CardItem
                    translateZ={30}
                    as="p"
                    className="text-body-sm text-pretty text-muted-foreground"
                  >
                    {item.description}
                  </CardItem>
                </CardSpotlight>
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================== */
/* SKILL MATRIX — radar chart in a glass / 3D panel                    */
/* ================================================================== */
export interface SkillMatrixProps {
  bullets: { icon: string; text: string }[];
}

export function SkillMatrix({ bullets }: SkillMatrixProps) {
  const reveal = useReveal();

  return (
    <Section className="pt-0">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <motion.div {...reveal(0)}>
          <Stack gap={4}>
            <Badge variant="info" className="w-fit gap-2">
              <IconRenderer name="radar" size={14} />
              Sample team snapshot
            </Badge>
            <h2 className="text-h2 text-foreground">
              Team Skill{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Matrix
              </span>
            </h2>
            <p className="text-body-lg text-muted-foreground">
              See team strengths at a glance. The Skill Matrix maps your
              team&apos;s average proficiency against an industry benchmark
              across six dimensions — AI/ML, leadership, technical skills,
              communication, strategy, and innovation — so you can target
              development where it moves the needle.
            </p>
            <ul className="mt-2 flex flex-col gap-3 text-body-sm text-muted-foreground">
              {bullets.map((b, i) => (
                <motion.li
                  key={b.text}
                  {...reveal(0.08 * (i + 1))}
                  className="flex items-start gap-3"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-subtle text-accent"
                  >
                    <IconRenderer name={b.icon} size={14} />
                  </span>
                  {b.text}
                </motion.li>
              ))}
            </ul>
          </Stack>
        </motion.div>

        <motion.div {...reveal(0.12)}>
          <Card
            variant="glass"
            className="relative overflow-hidden p-6 shadow-elevation-3 sm:p-8"
          >
            {/* token-driven corner glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-60 blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 28%, transparent), transparent)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-16 size-52 rounded-full opacity-50 blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 26%, transparent), transparent)",
              }}
            />
            <div className="relative">
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-md bg-accent-subtle text-accent">
                  <IconRenderer name="radar" size={16} />
                </span>
                <h3 className="text-h4 text-foreground">Team Skill Matrix</h3>
              </div>
              <TeamSkillChart />
              <div className="mt-5 flex items-center justify-center gap-6 text-caption text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block size-2.5 rounded-full bg-accent"
                  />
                  Team average
                </span>
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="inline-block size-2.5 rounded-full bg-primary"
                  />
                  Industry benchmark
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/* CAPABILITIES — BentoGrid                                            */
/* ================================================================== */
const CAPABILITY_ITEMS: BentoItem[] = [
  {
    id: "live-telemetry",
    title: "Live skill telemetry",
    description:
      "Every assessment, course, and milestone streams onto one organizational surface — watch proficiency move in real time, no exports, no lag.",
    icon: <IconRenderer name="activity" />,
    span: "2x2",
  },
  {
    id: "gap-forecasting",
    title: "Predictive gap forecasting",
    description:
      "Model where skill gaps will open next quarter and act before they become bottlenecks.",
    icon: <IconRenderer name="line-chart" />,
    span: "2x1",
  },
  {
    id: "goal-alignment",
    title: "Goal alignment",
    description: "Tie individual growth to business objectives automatically.",
    icon: <IconRenderer name="target" />,
  },
  {
    id: "benchmarking",
    title: "Industry benchmarking",
    description: "Compare against the market on every axis.",
    icon: <IconRenderer name="gauge" />,
  },
  {
    id: "smart-routing",
    title: "Development routing",
    description:
      "Match the right learning path to the right person the moment a gap appears.",
    icon: <IconRenderer name="git-branch" />,
    span: "2x1",
  },
];

export function CapabilitiesBento() {
  return (
    <BentoGrid
      eyebrow="Capabilities"
      heading="Everything a leader needs to grow a team"
      description="A composable analytics surface built for the way real teams develop — visible, predictive, and tied to outcomes."
      items={CAPABILITY_ITEMS}
    />
  );
}

/* ================================================================== */
/* STAT BAND — animated counters                                       */
/* ================================================================== */
export function TeamsStatBand() {
  const reveal = useReveal();

  return (
    <Section className="pt-0">
      <motion.div {...reveal(0)}>
        <Card
          variant="glass"
          className="relative overflow-hidden p-8 shadow-elevation-2 sm:p-12"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-2/3 rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 22%, transparent), transparent)",
            }}
          />
          <div className="relative">
            <header className="mx-auto mb-10 max-w-xl text-center">
              <h2 className="text-h2 text-balance text-foreground">
                Built to scale with{" "}
                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  every team
                </span>
              </h2>
            </header>
            <StatGrid
              cols={4}
              items={[
                { value: 6, label: "Skill dimensions tracked" },
                { value: 100, suffix: "%", label: "Real-time visibility" },
                { value: 32, suffix: "+", label: "AI tools powering growth" },
                { value: 24, suffix: "/7", label: "Always-on telemetry" },
              ]}
            />
          </div>
        </Card>
      </motion.div>

      {/* Tooltip-driven micro-detail row to add HeroUI life */}
      <motion.div
        {...reveal(0.1)}
        className="mt-6 flex flex-wrap items-center justify-center gap-3"
      >
        {[
          { icon: "shield-check", label: "Audit by default", tip: "Immutable history on every action, exportable in a click." },
          { icon: "bell", label: "Drift alerts", tip: "Get notified the moment a team trends below benchmark." },
          { icon: "git-merge", label: "Org rollups", tip: "Aggregate proficiency from individual to department to org." },
        ].map((chip) => (
          <Tooltip key={chip.label}>
            <TooltipTrigger>
              <span className="inline-flex cursor-default items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-body-sm text-foreground backdrop-blur-[var(--blur-glass)] transition-colors hover:bg-accent-subtle">
                <IconRenderer name={chip.icon} size={16} className="text-accent" />
                {chip.label}
              </span>
            </TooltipTrigger>
            <TooltipContent>{chip.tip}</TooltipContent>
          </Tooltip>
        ))}
      </motion.div>
    </Section>
  );
}
