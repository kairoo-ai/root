import type { Metadata } from "next";
import { Repeat, FileText, GitBranch, UserCheck, Gauge } from "lucide-react";

import { BentoGrid, type BentoItem } from "@/components/blocks/BentoGrid";
import { FAQ } from "@/components/blocks/FAQ";
import { CTA } from "@/components/blocks/CTA";
import type { StatCounterProps } from "@/components/blocks/StatCounter";
import { features as featureRegistry } from "@/engines/ai/features/registry";

import {
  HowItWorksHero,
  HowItWorksStats,
  StepsTimeline,
  StackShowcase,
  type StepVM,
  type StackFactVM,
} from "./HowItWorksVisuals";
import { PersonaWorkflows, PersonalizationFlow } from "./HowItWorksExtended";

const howTitle = `How It Works - Real workflows, real outcomes | ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`;
const howDesc =
  `See exactly how ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} works: your profile drives every tool, real workflow chains for job search, promotion, and career switches - powered by a Gemini-backed AI engine.`;

export const metadata: Metadata = {
  title: howTitle,
  description: howDesc,
  alternates: { canonical: "/how-it-works" },
  openGraph: { title: howTitle, description: howDesc, url: "/how-it-works" },
  twitter: { card: "summary_large_image", title: howTitle, description: howDesc },
};

const readyCount = featureRegistry.filter((f) => f.status === "ready").length;

const STEPS: StepVM[] = [
  {
    id: "profile",
    index: "01",
    title: "Set your context once",
    tagline: "Your profile powers everything",
    description:
      `Tell ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} where you are and where you want to go - current role, target role, skills, experience, location. Import from LinkedIn, GitHub, or your resume. This context flows into every tool automatically so nothing starts from scratch.`,
    icon: "user-check",
    points: [
      "One-time onboarding: role, goals, background, skills",
      "Import from 18 platforms: LinkedIn, GitHub, Resume PDF, and more",
      "Profile data pre-fills tool inputs across the entire platform",
    ],
  },
  {
    id: "pick",
    index: "02",
    title: "Pick the tool for your goal",
    tagline: "38+ purpose-built AI tools",
    description:
      `Browse ${readyCount} live tools organized by goal - job search, promotion, learning, productivity, and workplace. Each tool is a focused AI co-pilot for one specific task, not a generic chat. Pick what you need right now.`,
    icon: "layout-dashboard",
    points: [
      "Organized by workflow - not a random feature list",
      "Every tool has structured inputs, not a blank chat box",
      "Chain tools together as your goal evolves",
    ],
  },
  {
    id: "run",
    index: "03",
    title: "Run it - get something real",
    tagline: "Outputs you can actually use",
    description:
      `Your context meets the tool's purpose-built prompt in ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}'s Gemini-backed AI engine. The result is a concrete artifact - a roadmap, a negotiation script, a tailored cover letter, a learning path. Not a generic reply. Something you can act on.`,
    icon: "zap",
    points: [
      "Structured, usable output - not just prose",
      "Refine in seconds: tweak inputs and re-run",
      "Keep, copy, or feed the output into the next tool",
    ],
  },
  {
    id: "iterate",
    index: "04",
    title: "Grow - tools adapt with you",
    tagline: "The platform evolves as your goals change",
    description:
      "As you complete goals, get promoted, or switch tracks, update your profile and every tool recalibrates. Your 90-day plan becomes a 6-month roadmap. Your interview prep shifts to the new role. Progress is tracked and momentum compounds.",
    icon: "refresh-cw",
    points: [
      "Activity log tracks every run and milestone",
      "XP and streak system keeps momentum visible",
      "Weekly goals adapt to where you are in your journey",
    ],
  },
];

const STATS: StatCounterProps[] = [
  { value: readyCount, suffix: "+", label: "AI tools live today" },
  { value: 18, label: "Import connectors" },
  { value: 4, label: "Steps in the workflow" },
  { value: 100, suffix: "%", label: "Personalized to you" },
];

const LOOP_ITEMS: BentoItem[] = [
  {
    title: "Your profile is the foundation",
    description:
      "Every tool reads your role, target, skills, and goals automatically - no repetitive copy-pasting, no blank-slate inputs. The whole platform knows who you are.",
    icon: <UserCheck aria-hidden />,
    span: "2x2",
  },
  {
    title: "Purpose-built, not a chat box",
    description:
      "Every feature ships with its own structured prompt and input schema - so the AI reasons toward a real outcome instead of a vague answer.",
    icon: <FileText aria-hidden />,
    span: "2x1",
  },
  {
    title: "Chain tools like a workflow",
    description: "Career Simulator → Roadmap → Interview Coach → Salary Coach. Use one output as the next tool's input.",
    icon: <Repeat aria-hidden />,
  },
  {
    title: "Modern, fast, server-side",
    description: "Built on Next.js. AI runs server-side through the Gemini gateway - your inputs never go through a raw chat API.",
    icon: <Gauge aria-hidden />,
  },
  {
    title: "Grows with you",
    description:
      "Tools recalibrate as your profile updates. A new job, a promotion, a career switch - update once and the whole platform adapts.",
    icon: <GitBranch aria-hidden />,
    span: "2x1",
  },
];

const STACK_FACTS: StackFactVM[] = [
  {
    title: "Next.js application layer",
    description:
      "Server-rendered pages, streaming AI responses, and a real-time dashboard - built on Next.js 15 with the App Router.",
    icon: "plug",
  },
  {
    title: "engines/ai gateway",
    description:
      "A single server-side AI gateway brokers every request through Google's Gemini models. Each of the 38+ tools carries its own purpose-built prompt - not an open chat.",
    icon: "brain",
  },
  {
    title: "Drizzle + Neon PostgreSQL",
    description:
      "Your profile, activity log, goals, and progress data live in a Neon PostgreSQL database - queried through Drizzle ORM with type-safe schemas.",
    icon: "database",
  },
  {
    title: "Privacy-minded by design",
    description:
      "Reasoning happens server-side and is scoped to the task you run. We are building toward recognized compliance standards.",
    icon: "shield-check",
  },
];

const FAQ_ITEMS = [
  {
    id: "personalization",
    question: `How does ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} personalize outputs to me?`,
    answer:
      `During onboarding you tell ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} your current role, target role, years of experience, skills, location, and career goals. You can also import your profile from LinkedIn, GitHub, or a resume PDF. This context is automatically attached to every tool you run - so a roadmap built for a junior software engineer in Bangalore targeting a senior PM role looks completely different from one built for a marketing manager in Mumbai targeting a founder track.`,
  },
  {
    id: "models",
    question: `What AI powers ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}?`,
    answer:
      `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}'s reasoning runs through a server-side AI gateway built on Google's Gemini models. Each feature uses a purpose-built prompt rather than a generic chat interface - results stay focused on the specific task you're running.`,
  },
  {
    id: "import",
    question: "What can I import to skip manual setup?",
    answer:
      "You can import from 18 platforms: LinkedIn (profile paste or data ZIP export), GitHub, GitLab, LeetCode, Codeforces, CodeChef, HackerRank, HackerEarth, StackOverflow, Dev.to, Kaggle, Behance, Dribbble, Wellfound, Naukri, resume PDF, and certificates. All imports are free - no paid APIs.",
  },
  {
    id: "tools",
    question: "How many tools are available?",
    answer:
      `${readyCount} tools are live today across career development, productivity, learning, and workplace skills. The same Sense → Profile → Pick → Run → Iterate loop powers every one. New tools plug into the same flow without changing how the product works.`,
  },
  {
    id: "control",
    question: `Does ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} act on my behalf automatically?`,
    answer:
      "No. Every tool produces an artifact - a roadmap, a script, a cover letter, a learning path - for you to review, edit, and decide what to do with. You stay in control of what happens next.",
  },
  {
    id: "data",
    question: "What happens to the information I enter?",
    answer:
      "Your profile and tool inputs are processed server-side through our AI gateway to generate your result. We take a privacy-minded approach and are building toward recognized compliance standards.",
  },
];

import { FaqJsonLd } from "@/components/SchemaOrg";

export default function HowItWorksPage() {
  return (
    <>
      <FaqJsonLd
        entries={FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      <HowItWorksHero
        eyebrow="How it works"
        words={["Profile.", "Pick.", "Run.", "Grow."]}
        subtitle={`${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} personalizes every tool to your role, goals, and background - set your context once and 38+ AI tools start working specifically for you.`}
        primaryCta={{ label: "Explore the tools", href: "/features" }}
        secondaryCta={{ label: "Start free", href: "/sign-up" }}
      />

      <HowItWorksStats stats={STATS} />

      {/* The 4-step flow */}
      <StepsTimeline
        heading="Four steps, every workflow"
        subtitle={`From onboarding to a concrete outcome - every ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} tool follows the same path. Set your context once and the whole platform works for you.`}
        steps={STEPS}
      />

      {/* Real persona workflows */}
      <PersonaWorkflows />

      {/* How personalization actually flows */}
      <PersonalizationFlow />

      {/* Why the flow works for everything */}
      <BentoGrid
        heading="Why one flow works for everything"
        description="Profile-first design means every tool inherits your context. The toolkit grows without getting more complicated to use."
        items={LOOP_ITEMS}
      />

      {/* Honest tech stack */}
      <StackShowcase
        heading="The real stack behind the platform"
        subtitle={`No mystery. Here's exactly what ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} runs on.`}
        facts={STACK_FACTS}
        blueprint={{
          heading: "Want the full engineering picture?",
          body: "Signal ingestion, the reasoning fabric, the action layer, scaling and roadmap - the complete system blueprint lives with our technical deep-dive.",
          cta: { label: "See technical blueprint", href: "/investors/architecture" },
        }}
      />

      <FAQ title="How it works in practice" items={FAQ_ITEMS} />

      <CTA
        headline={`Start with your goals - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} does the rest`}
        body="Set up your profile in 5 minutes and get your first AI-personalized roadmap immediately."
        primary={{ label: "Get started free", href: "/sign-up" }}
        secondary={{ label: "Browse all tools", href: "/features" }}
      />
    </>
  );
}
