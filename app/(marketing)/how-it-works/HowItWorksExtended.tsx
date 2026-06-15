"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, User, Briefcase, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import IconRenderer from "@/components/IconRenderer";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ================================================================== */
/* PERSONA WORKFLOWS - concrete examples for 3 user types             */
/* ================================================================== */

interface WorkflowStep {
  tool: string;
  icon: string;
  what: string;   // what the tool does in this context
  output: string; // what comes out
}

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  goal: string;
  steps: WorkflowStep[];
}

const PERSONAS: Persona[] = [
  {
    id: "job-seeker",
    name: "The job seeker",
    description: "Actively searching, 3+ years experience, targeting a step-up role",
    icon: Briefcase,
    color: "teal",
    accentBg: "bg-teal-500/10",
    accentBorder: "border-teal-500/30",
    accentText: "text-teal-500",
    goal: "Land a senior product role in 3 months",
    steps: [
      { tool: "Career Simulator", icon: "compass", what: "Maps the skill gap from current role to Senior PM", output: "Gap analysis: 4 missing skills, 2 experiences to build" },
      { tool: "Dynamic Roadmap", icon: "map", what: "Builds a 3-month job search strategy", output: "Week-by-week plan: skills, projects, applications, networking" },
      { tool: "Resume Section", icon: "file-text", what: "Rewrites each resume section for the target role and company", output: "Tailored resume with impact metrics and keyword alignment" },
      { tool: "Job Matcher", icon: "target", what: "Scores fit for specific job descriptions and identifies gaps", output: "Match %, gaps to close, edits to make before applying" },
      { tool: "Interview Coach", icon: "mic", what: "Preps for PM-specific rounds - product design, metrics, strategy", output: "STAR answers, follow-up questions, red flags to avoid" },
      { tool: "Salary Coach", icon: "trending-up", what: "Provides market range and negotiation script for the offer stage", output: "Comp range, talking points, counter-offer strategy" },
    ],
  },
  {
    id: "career-switcher",
    name: "The career switcher",
    description: "5 years in marketing, wants to move into product management",
    icon: GraduationCap,
    color: "violet",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/30",
    accentText: "text-violet-500",
    goal: "Break into product management from marketing in 6 months",
    steps: [
      { tool: "Career Simulator", icon: "compass", what: "Identifies the full gap from marketing to PM, accounting for transferable skills", output: "Transferable skills mapped, 5 gaps to close, realistic 6-month timeline" },
      { tool: "Trends Analyzer", icon: "trending-up", what: "Validates PM demand in the target industry and location", output: "Market outlook, in-demand PM skills, where to apply first" },
      { tool: "AI Path Generation", icon: "book-open", what: "Builds a learning curriculum from marketing background to PM-ready", output: "Sequenced curriculum: courses, books, frameworks, certifications" },
      { tool: "Project Generator", icon: "code", what: "Generates portfolio project ideas that prove PM thinking", output: "3 project specs: user research, product teardown, feature brief" },
      { tool: "Bio Generator", icon: "user-square", what: "Reframes the marketing story as a PM narrative for LinkedIn and interviews", output: "LinkedIn summary and interview bio - not a marketing background, a PM origin story" },
      { tool: "Interview Coach", icon: "mic", what: "Addresses the 'why are you switching?' and 'what's your PM experience?' questions head-on", output: "Transition story, answers to common objections, compensating-experience framing" },
    ],
  },
  {
    id: "team-lead",
    name: "The team lead",
    description: "Engineering manager running a 6-person team at a Series A startup",
    icon: Users,
    color: "indigo",
    accentBg: "bg-indigo-500/10",
    accentBorder: "border-indigo-500/30",
    accentText: "text-indigo-500",
    goal: "Run better 1:1s, develop the team, and prep for VP Engineering",
    steps: [
      { tool: "Health Check", icon: "activity", what: "Audits current leadership growth trajectory and identifies blind spots", output: "Growth areas, skill gaps for VP track, immediate wins" },
      { tool: "90-Day Planner", icon: "calendar-check", what: "Builds a strategic plan for the next quarter as a manager", output: "Weekly focus areas, team goals, milestones, OKR alignment" },
      { tool: "Review Assistant", icon: "award", what: "Writes structured performance reviews for each direct report", output: "Personalized reviews with impact framing, growth areas, next steps" },
      { tool: "Meeting Prep", icon: "clipboard-list", what: "Generates agendas and key questions for 1:1s, team syncs, and skip-levels", output: "Focused agendas that drive outcomes, not status updates" },
      { tool: "Stakeholder Mapper", icon: "network", what: "Maps executive stakeholders - what they care about and how to influence them", output: "Stakeholder map with communication strategy per person" },
      { tool: "Goal Refiner", icon: "flag", what: "Turns the VP Engineering ambition into a concrete 12-month SMART goal with milestones", output: "SMART goal, success metrics, quarterly checkpoints, skill targets" },
    ],
  },
];

export function PersonaWorkflows() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const persona = PERSONAS[active];

  return (
    <Section>
      <div className="mb-10">
        <motion.h2
          className="mb-3 text-3xl font-black text-foreground"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          See it working for someone like you
        </motion.h2>
        <motion.p
          className="max-w-2xl text-muted-foreground"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          Three complete walkthroughs - each one a real sequence of {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} tools chained for a specific goal.
        </motion.p>
      </div>

      {/* Persona selector */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {PERSONAS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all cursor-pointer",
              active === i
                ? cn(p.accentBg, p.accentBorder, "shadow-sm")
                : "border-border hover:border-border/70",
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              <p.icon className={cn("h-4 w-4", active === i ? p.accentText : "text-muted-foreground")} />
              <span className={cn("text-sm font-bold", active === i ? p.accentText : "text-foreground")}>
                {p.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{p.description}</p>
          </button>
        ))}
      </div>

      {/* Active persona workflow */}
      <motion.div
        key={persona.id}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        {/* Header */}
        <div className={cn("border-b border-border p-6", persona.accentBg)}>
          <div className="flex items-center gap-3 mb-2">
            <persona.icon className={cn("h-5 w-5", persona.accentText)} />
            <span className="text-sm font-bold text-foreground">{persona.name}</span>
          </div>
          <p className={cn("text-sm font-semibold", persona.accentText)}>
            Goal: {persona.goal}
          </p>
        </div>

        {/* Steps */}
        <div className="divide-y divide-border">
          {persona.steps.map((step, idx) => (
            <div key={step.tool} className="flex gap-4 p-5">
              <div className="flex shrink-0 flex-col items-center gap-1">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold border", persona.accentBg, persona.accentBorder, persona.accentText)}>
                  {idx + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <IconRenderer name={step.icon} size={14} className={persona.accentText} />
                  <span className="text-sm font-bold text-foreground">{step.tool}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{step.what}</p>
                <div className={cn("inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs", persona.accentBg, persona.accentBorder)}>
                  <ArrowRight className={cn("h-3 w-3 shrink-0", persona.accentText)} />
                  <span className="text-foreground/80">{step.output}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-5">
          <Link
            href="/sign-up"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all",
              persona.accentBg, persona.accentBorder, persona.accentText,
            )}
          >
            Start this workflow free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/* HOW PERSONALIZATION FLOWS - visual diagram                         */
/* ================================================================== */

const PROFILE_FIELDS = [
  { label: "Current role", example: "Software Engineer, 3 yrs" },
  { label: "Target role", example: "Senior Product Manager" },
  { label: "Location", example: "Bangalore, India" },
  { label: "Skills", example: "React, Python, SQL, Agile" },
  { label: "Education", example: "B.Tech Computer Science" },
  { label: "Career goal", example: "PM at a funded startup in 6 months" },
];

const TOOLS_AFFECTED = [
  { name: "Dynamic Roadmap", note: "Sequences milestones to Senior PM, not a generic path" },
  { name: "Salary Coach", note: "Uses Bangalore market data and 3-year experience baseline" },
  { name: "Interview Coach", note: "Prepares PM-specific rounds with engineering background framing" },
  { name: "Bio Generator", note: "Writes an engineer-to-PM narrative for LinkedIn" },
  { name: "AI Path Generation", note: "Builds a curriculum from SWE skills toward PM thinking" },
  { name: "Career Simulator", note: "Identifies exact gap from SWE → Senior PM in your market" },
];

export function PersonalizationFlow() {
  const reduce = useReducedMotion();

  return (
    <Section>
      <div className="mb-8">
        <motion.h2
          className="mb-3 text-3xl font-black text-foreground"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          How personalization actually works
        </motion.h2>
        <p className="max-w-2xl text-muted-foreground">
          Set your profile once - every tool across the platform uses it automatically. Here's a concrete example.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left - Profile inputs */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-teal-500" />
            <span className="text-sm font-bold text-foreground">Your {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} profile</span>
            <span className="ml-auto rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-500">Set once</span>
          </div>
          <div className="space-y-2.5">
            {PROFILE_FIELDS.map((f) => (
              <div key={f.label} className="flex items-start gap-3 rounded-lg border border-border bg-background/50 px-3 py-2">
                <span className="shrink-0 text-xs font-semibold text-muted-foreground w-24">{f.label}</span>
                <span className="text-xs text-foreground">{f.example}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - How tools use it */}
        <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <IconRenderer name="zap" size={16} className="text-teal-500" />
            <span className="text-sm font-bold text-foreground">Every tool reads this automatically</span>
          </div>
          <div className="space-y-2.5">
            {TOOLS_AFFECTED.map((t) => (
              <div key={t.name} className="rounded-lg border border-teal-500/20 bg-card p-3">
                <div className="mb-1 text-xs font-bold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        No copy-pasting. No blank inputs. Every tool starts where you actually are.
      </p>
    </Section>
  );
}
