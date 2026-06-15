import { features as featureRegistry } from "@/engines/ai/features/registry";
import {
  FeaturesHero,
  PillarBento,
  FeatureStats,
  BenefitTabs,
  FeaturesCta,
  type PillarData,
  type StatData,
  type BenefitTab,
} from "./FeaturesVisuals";
import { FullToolCatalog, WorkflowSection, PersonalizationSection } from "./FeaturesExtended";

export const metadata = {
  title: `Features - 38 AI tools for your career | ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  description:
    `Every tool ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} ships: career roadmaps, interview coaching, salary negotiation, learning paths, and 30+ more - all personalized to your role, goals, and background.`,
};

const totalFeatures = featureRegistry.length;
const readyFeatures = featureRegistry.filter((f) => f.status === "ready").length;
const comingSoonFeatures = featureRegistry.filter((f) => f.status === "coming-soon").length;
const careerFeatures = featureRegistry.filter((f) => f.category === "career").length;
const learningFeatures = featureRegistry.filter((f) => f.category === "learning").length;

const pillars: PillarData[] = [
  {
    id: "career",
    title: "Career Development Suite",
    short: "Career",
    description:
      "Turn ambiguous goals into sequenced plans and execute with AI co-pilots for every high-stakes career moment - roadmaps, interviews, salary negotiations, performance reviews, and 20+ more tools.",
    href: "/features/career",
    icon: "briefcase",
    span: "lg:col-span-2 lg:row-span-2",
    highlights: [
      { icon: "map", label: "Dynamic Roadmaps" },
      { icon: "mic", label: "Interview Coach" },
      { icon: "trending-up", label: "Salary Coach" },
      { icon: "award", label: "Review Assistant" },
    ],
    meta: `${careerFeatures} career tools`,
  },
  {
    id: "learning",
    title: "Intelligent Learning Paths",
    short: "Learning",
    description:
      "Personalized curricula that adapt as you grow - AI-curated paths, an always-on tutor, project-based practice, and progress tracking that keeps momentum honest.",
    href: "/features/learning",
    icon: "graduation-cap",
    span: "lg:col-span-1 lg:row-span-1",
    highlights: [
      { icon: "book-open", label: "AI Path Generation" },
      { icon: "bot", label: "AI Tutor" },
      { icon: "folder-kanban", label: "Project Learning" },
      { icon: "refresh-cw", label: "Dynamic Adaptation" },
    ],
    meta: `${learningFeatures} learning features`,
  },
  {
    id: "teams",
    title: "Strategic Business Intelligence",
    short: "Teams",
    description:
      "Bring the same intelligence to teams - skill gap analytics, goal alignment, predictive insights, and a Team Skill Matrix so leaders can see capability at a glance.",
    href: "/features/teams",
    icon: "bar-chart-3",
    span: "lg:col-span-1 lg:row-span-1",
    highlights: [
      { icon: "line-chart", label: "Real-time insights" },
      { icon: "activity", label: "Predictive analytics" },
      { icon: "target", label: "Goal alignment" },
      { icon: "users", label: "Team Skill Matrix" },
    ],
    meta: "Enterprise-grade analytics",
  },
];

const stats: StatData[] = [
  { value: totalFeatures, label: "AI features in the platform" },
  { value: readyFeatures, label: "Live and ready to use" },
  { value: comingSoonFeatures, label: "Coming soon" },
  { value: 3, label: "Product pillars" },
];

const benefitTabs: BenefitTab[] = [
  {
    id: "career",
    label: "Career",
    items: [
      { icon: "map", title: "Dynamic Roadmaps", description: `Turn a vague goal into a week-by-week plan. ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} sequences milestones, skills, and resources based on your current role and target.` },
      { icon: "mic", title: "Interview Coach", description: "Practice with an AI co-pilot that gives structured, role-specific feedback - STAR answers, follow-up questions, and red flags." },
      { icon: "trending-up", title: "Salary Coach", description: "Walk into compensation conversations prepared. Get market ranges, negotiation scripts, and talking points tailored to your role and location." },
      { icon: "compass", title: "Career Simulator", description: "Model a pivot from your current role to a target role - gap analysis, required skills, estimated timeline, and first steps." },
      { icon: "target", title: "Job Matcher", description: "Paste a job description and your resume. Get a match score, gaps to close, and tailored edits to maximize relevance for that specific role." },
      { icon: "award", title: "Review Assistant", description: "Draft powerful self-reviews, peer reviews, or manager reviews backed by real impact framing - not filler." },
      { icon: "user-square", title: "Bio Generator", description: "Create LinkedIn summaries, Twitter bios, or conference intros tuned to your platform and the impression you want to leave." },
      { icon: "calendar-check", title: "90-Day Planner", description: "Strategic onboarding plan for a new role - what to learn, who to meet, what to ship, and how to build trust fast." },
      { icon: "flag", title: "Goal Refiner", description: "Transform vague ambitions into SMART goals with clear metrics, timelines, and action plans." },
      { icon: "users", title: "Skill Scenarios", description: "Practice workplace conversations - asking for a raise, pushing back on scope, navigating conflict - with role-play coaching." },
    ],
  },
  {
    id: "productivity",
    label: "Productivity",
    items: [
      { icon: "file-text", title: "Document Suite", description: "Generate cover letters, proposals, project briefs, status reports, and business memos - structured for your audience in seconds." },
      { icon: "mail-plus", title: "Email Assistant", description: "Draft professional emails for any situation - follow-ups, tough conversations, introductions - at the right tone." },
      { icon: "clipboard-list", title: "Meeting Prep", description: "Walk into any meeting with a structured agenda, key questions, and clarity on what you're trying to achieve." },
      { icon: "pen-square", title: "Post Writer", description: "Write thought leadership posts for LinkedIn, Twitter/X, or your blog - with your angle and voice, not a generic template." },
      { icon: "lightbulb", title: "Idea Validator", description: "Run a SWOT analysis on any business or product idea before you invest time building it." },
      { icon: "file-text", title: "Contract Reviewer", description: "Understand key clauses, risks, and negotiating points in contracts - plain English, no legalese." },
      { icon: "clipboard-list", title: "Retro Helper", description: "Generate structured retrospectives for sprints, projects, or quarters - what shipped, what broke, what to change." },
      { icon: "dollar-sign", title: "Budget Proposer", description: "Build a business case for any training or investment - ROI framing, cost justification, approval-ready language." },
      { icon: "message-circle", title: "Pitch Refiner", description: "Sharpen your pitch for any audience - investors, hiring managers, clients - clear structure and persuasive framing." },
      { icon: "brain", title: "Decision Copilot", description: "Work through high-stakes decisions with structured pros/cons, second-order effects, and a recommended path." },
    ],
  },
  {
    id: "learning",
    label: "Learning",
    items: [
      { icon: "book-open", title: "AI Path Generation", description: "Generate a personalized curriculum from any skill goal - sequenced into achievable, trackable steps with named resources." },
      { icon: "bot", title: "AI Tutor", description: "Ask anything, at any level. An always-on tutor that knows your path and meets you where you are." },
      { icon: "folder-kanban", title: "Project Learning", description: "Get portfolio-ready project ideas matched to your stack and learning stage - learn by building, not just watching." },
      { icon: "trending-up", title: "Trends Analyzer", description: "Stay ahead in your industry - emerging skills, tool shifts, and role evolution you need to plan around." },
      { icon: "code", title: "Project Generator", description: "Given your skills and level, generate specific project specs - not just ideas, but what to build and why it signals growth." },
      { icon: "dollar-sign", title: "Side Hustle Strategist", description: "Given your skills and available hours, get a realistic side income plan - platforms, positioning, and first steps." },
    ],
  },
  {
    id: "workplace",
    label: "Workplace",
    items: [
      { icon: "network", title: "Networking Strategist", description: "Build a targeted networking plan for your goal and industry - who to reach, how to reach them, and what to say." },
      { icon: "heart", title: "Burnout Coach", description: "Diagnose signs of burnout and get a practical recovery and boundary-setting plan before it escalates." },
      { icon: "activity", title: "Health Check", description: "Periodic career health audit - are you growing, stagnating, or drifting? Get an honest read and a corrective plan." },
      { icon: "mic", title: "Speaking Coach", description: "Prepare for any presentation - talking points, structure, opener, closer, and handling nerves." },
      { icon: "alert-triangle", title: "Conflict Mediator", description: "Navigate workplace conflict with structured frameworks - understand both sides, de-escalate, and find common ground." },
      { icon: "users", title: "Stakeholder Mapper", description: "Map who has influence over your project - priorities, concerns, and how to communicate with each stakeholder type." },
      { icon: "book", title: "Jargon Buster", description: "Demystify industry jargon, acronyms, and domain terminology - with context for how it's actually used in practice." },
      { icon: "layout-panel-left", title: "Mockup Feedback", description: "Describe your design or product mockup and get structured UX, clarity, and user-flow feedback." },
    ],
  },
];

// Real workflows - sequences of tools for specific goals
export const WORKFLOWS = [
  {
    id: "job-search",
    title: "Land your next role",
    persona: "You're actively job searching",
    steps: [
      { tool: "Career Simulator", action: "Map the gap from your current role to the target", icon: "compass" },
      { tool: "Dynamic Roadmap", action: "Build a 90-day job search strategy", icon: "map" },
      { tool: "Resume Section", action: "Rewrite each section for the target role and company", icon: "file-text" },
      { tool: "Job Matcher", action: "Score your fit for specific JDs and close the gaps", icon: "target" },
      { tool: "Interview Coach", action: "Prep for every round with role-specific practice", icon: "mic" },
      { tool: "Salary Coach", action: "Walk into offer conversations with market data and scripts", icon: "trending-up" },
    ],
    color: "teal",
  },
  {
    id: "promotion",
    title: "Get promoted",
    persona: "You're ready to level up internally",
    steps: [
      { tool: "Health Check", action: "Get an honest read on your growth trajectory", icon: "activity" },
      { tool: "Goal Refiner", action: "Define exactly what promotion looks like and what it requires", icon: "flag" },
      { tool: "Review Assistant", action: "Build a compelling self-review backed by real impact", icon: "award" },
      { tool: "Skill Scenarios", action: "Practice the raise / promotion conversation with your manager", icon: "users" },
      { tool: "Networking Strategist", action: "Map internal sponsors and visibility opportunities", icon: "network" },
      { tool: "90-Day Planner", action: "Plan the first 90 days in your new scope", icon: "calendar-check" },
    ],
    color: "indigo",
  },
  {
    id: "career-switch",
    title: "Switch careers",
    persona: "You want to move into a new field",
    steps: [
      { tool: "Career Simulator", action: "Understand the full gap and realistic timeline", icon: "compass" },
      { tool: "Trends Analyzer", action: "Validate the field is growing and where demand is", icon: "trending-up" },
      { tool: "AI Path Generation", action: "Build a learning curriculum for the new domain", icon: "book-open" },
      { tool: "Project Generator", action: "Build portfolio projects that prove the switch", icon: "code" },
      { tool: "Bio Generator", action: "Reframe your story to fit the new field", icon: "user-square" },
      { tool: "Interview Coach", action: "Prep for the 'why are you switching?' questions", icon: "mic" },
    ],
    color: "violet",
  },
];

export default function FeaturesHubPage() {
  return (
    <>
      <FeaturesHero
        titleLead="38 AI tools."
        titleHighlight="One platform."
        titleTail="Built around you."
        subtitle={`${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} unifies career development, learning, and productivity into one AI command center - and every tool is personalized to your role, goals, and background from the moment you start.`}
      />

      <PillarBento pillars={pillars} />

      <FeatureStats stats={stats} />

      {/* Real workflows - concrete tool chains for real goals */}
      <WorkflowSection workflows={WORKFLOWS} />

      {/* Personalization messaging */}
      <PersonalizationSection />

      {/* Full tool tabs - all 38 tools across 4 categories */}
      <BenefitTabs
        heading="Every tool, every category"
        description="38 AI tools shipping today across career, productivity, learning, and workplace. Each one is purpose-built - not a generic chat."
        tabs={benefitTabs}
      />

      {/* Full searchable catalog */}
      <FullToolCatalog tools={featureRegistry.map(({ buildUserPrompt, ...rest }) => rest) as never} />

      <FeaturesCta
        headline="Your goals deserve better than generic AI"
        body={`${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} knows your role, your target, your background. Every tool starts where you are.`}
      />
    </>
  );
}
