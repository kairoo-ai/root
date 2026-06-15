"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Search, CheckCircle, Sparkles, User, Target, Zap, Brain } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import IconRenderer from "@/components/IconRenderer";
import type { FeatureDef } from "@/engines/ai/features/registry";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ================================================================== */
/* WORKFLOW SECTION — concrete tool chains for real goals              */
/* ================================================================== */

interface WorkflowStep {
  tool: string;
  action: string;
  icon: string;
}

interface Workflow {
  id: string;
  title: string;
  persona: string;
  steps: WorkflowStep[];
  color: string;
}

const COLOR_MAP: Record<string, string> = {
  teal:   "bg-teal-500/10 border-teal-500/30 text-teal-400",
  indigo: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  violet: "bg-violet-500/10 border-violet-500/30 text-violet-400",
};

const CONNECTOR_COLOR: Record<string, string> = {
  teal:   "bg-teal-500/40",
  indigo: "bg-indigo-500/40",
  violet: "bg-violet-500/40",
};

const STEP_DOT: Record<string, string> = {
  teal:   "bg-teal-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
};

export function WorkflowSection({ workflows }: { workflows: Workflow[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const wf = workflows[active];

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
          Real workflows, not just tools
        </motion.h2>
        <motion.p
          className="max-w-2xl text-muted-foreground"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        >
          Each tool is useful alone — but the real power is how they chain together for your specific goal. Here are three complete workflows.
        </motion.p>
      </div>

      {/* Workflow selector tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {workflows.map((w, i) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-semibold transition-all cursor-pointer",
              active === i
                ? cn(COLOR_MAP[w.color], "shadow-sm")
                : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground",
            )}
          >
            {w.title}
          </button>
        ))}
      </div>

      {/* Active workflow */}
      <motion.div
        key={wf.id}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          {wf.persona}
        </p>

        <div className="flex flex-col gap-0">
          {wf.steps.map((step, idx) => (
            <div key={step.tool} className="flex items-start gap-4">
              {/* Step dot + connector */}
              <div className="flex flex-col items-center">
                <div className={cn("mt-0.5 h-3 w-3 shrink-0 rounded-full", STEP_DOT[wf.color])} />
                {idx < wf.steps.length - 1 && (
                  <div className={cn("my-1 w-0.5 flex-1 min-h-[2rem]", CONNECTOR_COLOR[wf.color])} />
                )}
              </div>

              {/* Content */}
              <div className="pb-5">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold border", COLOR_MAP[wf.color])}>
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-foreground">{step.tool}</span>
                </div>
                <p className="text-sm text-muted-foreground pl-8">{step.action}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 border-t border-border pt-5">
          <Link
            href="/sign-up"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all",
              COLOR_MAP[wf.color],
            )}
          >
            Start this workflow
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </Section>
  );
}

/* ================================================================== */
/* PERSONALIZATION SECTION                                             */
/* ================================================================== */

const PERSONALIZATION_POINTS = [
  {
    icon: User,
    title: "Your profile, always in context",
    body: "Kairoo reads your current role, target role, years of experience, skills, and location from your profile — so every tool starts with your actual situation, not a blank slate.",
  },
  {
    icon: Target,
    title: "Goal-aligned outputs",
    body: "Set a target role or career goal once and every roadmap, interview session, and learning path is automatically calibrated to close the gap between where you are and where you're going.",
  },
  {
    icon: Brain,
    title: "Role and industry awareness",
    body: "Each tool knows whether you're a software engineer in Bangalore or a marketing manager in Mumbai — outputs are specific to your domain, not generic advice that fits nobody perfectly.",
  },
  {
    icon: Zap,
    title: "Pre-filled, not empty",
    body: "Import your LinkedIn, resume, or GitHub once and Kairoo pre-fills inputs across tools. No repetitive copy-pasting. Your context travels with you across the entire platform.",
  },
];

export function PersonalizationSection() {
  const reduce = useReducedMotion();
  return (
    <Section>
      <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-500/5 via-card to-card p-8 sm:p-10">
        <div className="mb-8 flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-500">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-foreground">Built around you, not everyone</h2>
            <p className="mt-1.5 text-muted-foreground max-w-2xl">
              Generic AI gives the same answer to everyone. Kairoo personalizes every output to your role, goals, background, and context — collected once during onboarding, used everywhere.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PERSONALIZATION_POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              className="rounded-xl border border-border bg-card/60 p-5"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
            >
              <p.icon className="mb-3 h-5 w-5 text-teal-500" />
              <h3 className="mb-1.5 text-sm font-bold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {[
            "Current role & company",
            "Target role",
            "Years of experience",
            "Skills & certifications",
            "Location",
            "Career goals",
            "Education background",
            "Imported resume",
          ].map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1 text-xs font-semibold text-teal-500">
              <CheckCircle className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================== */
/* FULL TOOL CATALOG — searchable grid of all tools                    */
/* ================================================================== */

const CATEGORY_LABELS: Record<string, string> = {
  career: "Career",
  learning: "Learning",
};

const STATUS_COLORS = {
  ready: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  "coming-soon": "bg-muted/40 text-muted-foreground border-border",
};

export function FullToolCatalog({ tools }: { tools: FeatureDef[] }) {
  const [query, setQuery] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const reduce = useReducedMotion();

  const filtered = tools.filter((t) => {
    const matchQuery =
      !query ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase());
    const matchCat = filterCat === "all" || t.category === filterCat;
    return matchQuery && matchCat;
  });

  return (
    <Section>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-black text-foreground">The complete catalog</h2>
        <p className="text-muted-foreground">Every tool — search, filter, and find what you need.</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {["all", "career", "learning"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(cat)}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer capitalize",
                filterCat === cat
                  ? "bg-teal-500/10 border-teal-500/30 text-teal-500"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {cat === "all" ? `All (${tools.length})` : `${CATEGORY_LABELS[cat]} (${tools.filter(t => t.category === cat).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">No tools match your search.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => (
            <motion.div
              key={tool.id}
              className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-teal-500/30"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3), ease: EASE }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground group-hover:bg-teal-500/10 group-hover:text-teal-500 transition-colors">
                  <IconRenderer name={tool.icon} size={16} />
                </span>
                <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold", STATUS_COLORS[tool.status])}>
                  {tool.status === "ready" ? "Live" : "Soon"}
                </span>
              </div>
              <h3 className="mb-1 text-sm font-bold text-foreground">{tool.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
              {tool.status === "ready" && (
                <Link
                  href="/tools"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-500 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Open tool <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}
