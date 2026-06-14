"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { animate, stagger } from "animejs";

import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Grid } from "@/components/layout/Grid";
import { Stack } from "@/components/layout/Stack";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/Tooltip";

import { Spotlight } from "@/components/motion/Spotlight";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/motion/ThreeDCard";
import { CardSpotlight } from "@/components/blocks/CardSpotlight";
import { StatGrid } from "@/components/blocks/StatCounter";
import { BentoGrid, type BentoItem } from "@/components/blocks/BentoGrid";
import { FAQ } from "@/components/blocks/FAQ";

import IconRenderer from "@/components/IconRenderer";

import { ContactForm } from "./ContactForm";

/* ------------------------------------------------------------------ */
/* Shared reveal helper — reduced-motion safe                          */
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

/* ------------------------------------------------------------------ */
/* Serializable props — icons are passed as NAME strings only          */
/* ------------------------------------------------------------------ */
export interface ContactChannel {
  icon: string;
  badge?: string;
  title: string;
  body: string;
  /** Optional mailto / link target. */
  href?: string;
  /** Visible link/cta label. */
  linkLabel?: string;
  /** Treat the link as an internal route (Link) vs an external href (anchor). */
  internal?: boolean;
}

export interface ContactVisualsProps {
  supportEmail: string;
  investorEmail: string;
  investorsRoute: string;
  pricingRoute: string;
  featuresRoute: string;
  channels: ContactChannel[];
  faq: FAQItem[];
}

/* ================================================================== */
/* HERO — striking split: animated accent + Spotlight | the form       */
/* ================================================================== */
function ContactHero({
  supportEmail,
}: {
  supportEmail: string;
}) {
  const reduce = useReducedMotion();
  const reveal = useReveal();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reduce || !headlineRef.current) return;
    const words =
      headlineRef.current.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;

    words.forEach((w) => {
      w.style.opacity = "0";
      w.style.transform = "translateY(0.5em)";
    });

    const animation = animate(words, {
      opacity: [0, 1],
      translateY: ["0.5em", "0em"],
      filter: ["blur(8px)", "blur(0px)"],
      duration: 900,
      delay: stagger(70, { start: 150 }),
      ease: "out(3)",
    });

    return () => {
      animation.cancel();
      words.forEach((w) => {
        w.style.opacity = "";
        w.style.transform = "";
        w.style.filter = "";
      });
    };
  }, [reduce]);

  const headline = "Talk to us, or book a demo".split(" ");

  return (
    <Section className="relative isolate overflow-hidden pb-0">
      {/* Local Spotlight flair — the page AuroraBackground lives in the layout. */}
      <Spotlight
        className="-top-40 left-0 md:-top-24 md:-left-20"
        fill="var(--primary)"
      />

      <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        {/* LEFT — animated accent / message side */}
        <div className="relative flex flex-col justify-center py-6 lg:py-12">
          <Stack gap={8} align="start">
            <h1
              ref={headlineRef}
              className="text-display text-balance text-foreground"
              aria-label="Talk to us, or book a demo"
            >
              {headline.map((word, i) => {
                const clean = word.replace(/[,]/g, "");
                const isHighlight = clean === "Talk" || clean === "demo";
                return (
                  <span key={`${word}-${i}`} className="inline-block">
                    <span
                      data-word
                      className={cn(
                        "inline-block",
                        isHighlight &&
                          "bg-linear-to-r from-primary to-accent bg-clip-text text-transparent",
                      )}
                    >
                      {word}
                    </span>
                    {i < headline.length - 1 ? " " : null}
                  </span>
                );
              })}
            </h1>

            <motion.p
              {...reveal(0.7)}
              className="max-w-xl text-pretty text-body-lg text-muted-foreground"
            >
              Whether you&apos;re evaluating Kairoo for yourself or rolling it
              out across a team, send a note and we&apos;ll get back to you —
              usually within one business day.
            </motion.p>

            {/* Quick reassurance chips */}
            <motion.ul
              {...reveal(0.78)}
              className="flex flex-wrap gap-2"
              aria-label="What to expect"
            >
              {[
                { icon: "clock", label: "~1 business day reply" },
                { icon: "calendar-clock", label: "Tailored demo" },
                { icon: "shield-check", label: "No spam, ever" },
              ].map(({ icon, label }) => (
                <li key={label}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-body-sm text-muted-foreground backdrop-blur-[var(--blur-glass)]">
                    <span className="text-primary" aria-hidden>
                      <IconRenderer name={icon} size={14} />
                    </span>
                    {label}
                  </span>
                </li>
              ))}
            </motion.ul>

            {/* Animated reach stats */}
            <motion.div {...reveal(0.86)} className="w-full pt-2">
              <StatGrid
                cols={3}
                gap="lg"
                className="max-w-lg text-left"
                items={[
                  { value: 1, suffix: " day", label: "Typical reply time" },
                  { value: 24, suffix: "/7", label: "Support inbox open" },
                  { value: 1000, suffix: "+", label: "Professionals onboard" },
                ]}
              />
            </motion.div>

            {/* Direct email shortcut with Tooltip */}
            <motion.div {...reveal(0.92)}>
              <Tooltip>
                <TooltipTrigger>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="inline-flex items-center gap-2 rounded-sm text-body-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <IconRenderer name="mail" size={16} />
                    Prefer email? {supportEmail}
                  </a>
                </TooltipTrigger>
                <TooltipContent>Opens your mail app</TooltipContent>
              </Tooltip>
            </motion.div>
          </Stack>
        </div>

        {/* RIGHT — the form, lifted on a glowing glass card */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : 0.2 }}
          className="relative isolate flex py-6 lg:py-12"
        >
          {/* Glow halo behind the form card — token color-mix only. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-[2rem] opacity-60 blur-2xl"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--primary) 38%, transparent), color-mix(in oklab, var(--accent) 34%, transparent))",
            }}
          />
          <CardSpotlight className="relative flex w-full flex-col rounded-3xl border-border/60 bg-card/80 p-6 shadow-elevation-4 backdrop-blur-[var(--blur-glass)] sm:p-8">
            <Stack gap={6}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <h2 className="text-h3 text-foreground">
                    Send us a message
                  </h2>
                  <p className="text-body text-muted-foreground">
                    Tell us a little about what you&apos;re trying to do and
                    we&apos;ll point you to the right next step.
                  </p>
                </div>
                <span
                  aria-hidden
                  className="hidden shrink-0 sm:inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevation-2"
                >
                  <IconRenderer name="send" size={22} />
                </span>
              </div>
              <ContactForm />
            </Stack>
          </CardSpotlight>
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/* CHANNELS — 3D tilt cards that lift toward the cursor                 */
/* ================================================================== */
function Channels({
  channels,
}: {
  channels: ContactChannel[];
}) {
  const reveal = useReveal();

  return (
    <Section aria-labelledby="channels-heading">
      <motion.div
        {...reveal(0)}
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <h2
          id="channels-heading"
          className="text-h2 text-balance text-foreground"
        >
          Pick the door that fits{" "}
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            your question
          </span>
        </h2>
        <p className="mt-4 text-body-lg text-muted-foreground">
          The form routes everywhere — but if you already know who you need,
          here&apos;s the fastest path.
        </p>
      </motion.div>

      <Grid cols={3} gap="lg" className="mt-12 items-stretch">
        {channels.map((channel, i) => (
          <motion.div key={channel.title} {...reveal(i * 0.08)} className="h-full">
            <CardContainer
              containerClassName="!py-0 h-full"
              className="h-full w-full"
            >
              <CardBody className="h-full w-full">
                <CardItem as="div" translateZ={40} className="!w-full">
                  <Card
                    variant="interactive"
                    className="flex h-full flex-col p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <CardItem
                        as="span"
                        translateZ={60}
                        aria-hidden
                        className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      >
                        <IconRenderer name={channel.icon} size={20} />
                      </CardItem>
                      {channel.badge ? (
                        <CardItem as="div" translateZ={50}>
                          <Badge>{channel.badge}</Badge>
                        </CardItem>
                      ) : null}
                    </div>

                    <CardItem
                      as="h3"
                      translateZ={40}
                      className="mt-5 text-h5 text-foreground"
                    >
                      {channel.title}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ={20}
                      className="mt-2 flex-1 text-body-sm text-muted-foreground"
                    >
                      {channel.body}
                    </CardItem>

                    {channel.href && channel.linkLabel ? (
                      <CardItem as="div" translateZ={30} className="mt-4">
                        {channel.internal ? (
                          <Link
                            href={channel.href}
                            className="inline-flex items-center gap-1.5 rounded-sm text-body-sm font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            {channel.linkLabel}
                            <IconRenderer name="arrow-right" size={16} />
                          </Link>
                        ) : (
                          <a
                            href={channel.href}
                            className="inline-flex items-center gap-1.5 rounded-sm text-body-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <IconRenderer name="mail" size={16} />
                            {channel.linkLabel}
                          </a>
                        )}
                      </CardItem>
                    ) : null}
                  </Card>
                </CardItem>
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </Grid>
    </Section>
  );
}

/* ================================================================== */
/* WHAT HAPPENS NEXT — BentoGrid timeline of the demo flow             */
/* ================================================================== */
function WhatHappensNext() {
  const items: BentoItem[] = [
    {
      title: "We read every message ourselves",
      description:
        "No bots triaging your note into a void. A real person on the Kairoo team reads what you send and replies — usually within one business day.",
      span: "2x2",
      icon: <IconRenderer name="mail-check" size={20} />,
    },
    {
      title: "We find a time that works",
      description:
        "Mention your team size and goals and we'll propose a slot for a guided walkthrough.",
      span: "2x1",
      icon: <IconRenderer name="calendar-clock" size={20} />,
    },
    {
      title: "Tailored, not canned",
      description: "Your demo is built around what you're actually trying to do.",
      icon: <IconRenderer name="target" size={20} />,
    },
    {
      title: "Start free, no pressure",
      description: "Prefer to explore solo first? The Free plan needs no call.",
      icon: <IconRenderer name="compass" size={20} />,
    },
    {
      title: "Career toolkit, learning paths & team analytics",
      description:
        "We'll walk you through the parts of Kairoo that matter most for your goals and team size — and answer anything in real time.",
      span: "2x1",
      icon: <IconRenderer name="layers" size={20} />,
    },
  ];

  return (
    <BentoGrid
      eyebrow="After you reach out"
      heading="What happens next"
      description="No drawn-out sales gauntlet — just a clear, human path from your first message to seeing Kairoo in action."
      items={items}
    />
  );
}

/* ================================================================== */
/* CLOSING CTA — glowing brand band                                    */
/* ================================================================== */
function GlowingCTA({
  pricingRoute,
  featuresRoute,
}: {
  pricingRoute: string;
  featuresRoute: string;
}) {
  const reduce = useReducedMotion();

  return (
    <Section>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative isolate"
      >
        {/* Glow halo behind the band */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-[2rem] opacity-60 blur-2xl"
          style={{
            background:
              "linear-gradient(120deg, color-mix(in oklab, var(--primary) 50%, transparent), color-mix(in oklab, var(--accent) 45%, transparent))",
          }}
        />
        <div className="relative overflow-hidden rounded-3xl bg-primary bg-linear-to-br from-primary to-accent px-6 py-16 text-center shadow-elevation-4 sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-1/2 -z-10 h-[120%] bg-accent/20 blur-3xl"
          />

          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <span
              aria-hidden
              className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm"
            >
              <IconRenderer name="rocket" size={26} />
            </span>
            <h2 className="text-balance text-h2 text-primary-foreground">
              Ready to see Kairoo in action?
            </h2>
            <p className="text-pretty text-body-lg text-primary-foreground/80">
              Start free in minutes, or send a message above to set up a guided
              demo for your team.
            </p>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href={pricingRoute}>
                  Get started free
                  <IconRenderer name="arrow-right" size={18} />
                </Link>
              </Button>
              <Link
                href={featuresRoute}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-primary-foreground/40 bg-transparent px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2"
              >
                Explore features
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <Container className="mt-10">
        <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-body-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="text-success" aria-hidden>
              <IconRenderer name="credit-card" size={16} />
            </span>
            No credit card to start
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-success" aria-hidden>
              <IconRenderer name="sparkles" size={16} />
            </span>
            Free plan forever
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-success" aria-hidden>
              <IconRenderer name="shield-check" size={16} />
            </span>
            Cancel anytime
          </span>
        </p>
      </Container>
    </Section>
  );
}

/* ================================================================== */
/* Composed export                                                     */
/* ================================================================== */
export default function ContactVisuals({
  supportEmail,
  channels,
  faq,
  pricingRoute,
  featuresRoute,
}: ContactVisualsProps) {
  return (
    <>
      <ContactHero supportEmail={supportEmail} />
      <Channels channels={channels} />
      <WhatHappensNext />
      <FAQ
        eyebrow="FAQ"
        title="Before you reach out"
        subtitle="A few quick answers that might save you a message."
        items={faq}
      />
      <GlowingCTA pricingRoute={pricingRoute} featuresRoute={featuresRoute} />
    </>
  );
}
