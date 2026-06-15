import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, Users, Zap, Heart, Code2, Megaphone, BarChart3, Pen, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: `Careers - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  description:
    `Join ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} - we're building the AI-powered career platform for the next generation of professionals. Part-time roles, internships, and student contributor positions open.`,
};

const OPEN_ROLES = [
  {
    title: "Frontend Engineer (Part-time)",
    team: "Engineering",
    type: "Part-time / Remote",
    icon: Code2,
    description:
      "Help build the product you'd want to use. We work in Next.js, TypeScript, Tailwind, and Framer Motion. You'll own features end-to-end with direct founder access.",
    requirements: [
      "Solid React + TypeScript fundamentals",
      "Comfortable with Tailwind CSS",
      "Can ship working UI independently",
      "Students and recent grads encouraged",
    ],
  },
  {
    title: "Growth & Community (Part-time)",
    team: "Growth",
    type: "Part-time / Remote",
    icon: Megaphone,
    description:
      `Own our presence on LinkedIn, Twitter/X, and college communities. Help us reach the professionals and students who need ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} most.`,
    requirements: [
      "Strong written communication",
      "Active on professional or student communities",
      "Interest in career development / EdTech",
      "Student or recent grad? Perfect fit.",
    ],
  },
  {
    title: "Content & Career Research (Part-time)",
    team: "Content",
    type: "Part-time / Remote",
    icon: Pen,
    description:
      `Research career paths, write guides, and help populate the knowledge base that makes ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} smarter. Your work directly improves AI outputs for thousands of users.`,
    requirements: [
      "Strong research and writing skills",
      "Curious about careers, skilling, and hiring",
      "Able to work async and self-direct",
      "Students with domain interest welcome",
    ],
  },
  {
    title: "Data & Analytics Intern",
    team: "Data",
    type: "Internship / Remote",
    icon: BarChart3,
    description:
      `Help us understand how people use ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}, surface insights from usage patterns, and inform product decisions. Great role for someone learning analytics or data science.`,
    requirements: [
      "Familiarity with SQL or Python basics",
      "Interest in product analytics",
      "Currently studying CS, Stats, or a related field",
      "Portfolio or project work appreciated",
    ],
  },
  {
    title: "AI / Prompt Engineering Contributor",
    team: "AI",
    type: "Part-time / Remote",
    icon: Zap,
    description:
      `Help tune and improve the AI features that power ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}'s 38+ tools. You'll write, test, and evaluate prompts and contribute to our AI feature registry.`,
    requirements: [
      "Hands-on experience with LLMs (OpenAI, Anthropic, etc.)",
      "Interest in career AI or learning tech",
      "Analytical - can evaluate output quality systematically",
      "Background in AI/ML, engineering, or linguistics",
    ],
  },
  {
    title: "Campus Ambassador",
    team: "Growth",
    type: "Flexible / Your Campus",
    icon: Globe,
    description:
      `Represent ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} at your college or university. Spread the word in placement cells, coding clubs, and student communities. Paid role with performance incentives.`,
    requirements: [
      "Currently enrolled student",
      "Well-connected on campus",
      "Believe in helping peers grow their careers",
      "Any degree, any year",
    ],
  },
];

const PERKS = [
  { icon: Heart, title: "Mission-first", body: "We're building something that actually matters - career tools that help real people land jobs, level up, and grow." },
  { icon: Users, title: "Tiny team, big impact", body: "Small team means your work ships. Every feature you build or idea you raise has a real chance of reaching thousands of users." },
  { icon: Clock, title: "Async-friendly", body: "Part-time and student contributors are first-class. We work around your schedule, not the other way around." },
  { icon: Zap, title: "Learn by doing", body: "Work directly with founders, get real product experience, and build things you can talk about in every future interview." },
];

export default function CareersPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-20 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-500">We&apos;re hiring</p>
        <h1 className="mb-5 text-5xl font-black leading-tight text-foreground sm:text-6xl">
          Build the career platform{" "}
          <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent">
            you wish existed
          </span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} is a small team building an AI-powered career and learning platform for the next generation of professionals. We&apos;re early, ambitious, and looking for people who want to grow alongside us - students, recent grads, and part-timers very welcome.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:careers@kairoo.in"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-teal-400 transition-colors">
            Send your introduction
          </a>
          <Link href="/about"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-teal-500/40 transition-colors">
            Learn about us
          </Link>
        </div>
      </div>

      {/* Perks */}
      <div className="mb-20">
        <h2 className="mb-8 text-2xl font-black text-foreground">Why join now?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PERKS.map(p => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
              <p.icon className="mb-3 h-5 w-5 text-teal-500" />
              <h3 className="mb-1.5 text-sm font-bold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Roles */}
      <div>
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-black text-foreground">Open positions</h2>
          <span className="text-xs font-semibold text-teal-500 bg-teal-500/10 px-2.5 py-1 rounded-full">{OPEN_ROLES.length} open</span>
        </div>
        <div className="space-y-4">
          {OPEN_ROLES.map(role => (
            <div key={role.title} className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-teal-500/30">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                    <role.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{role.title}</h3>
                    <p className="text-xs text-muted-foreground">{role.team}</p>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {role.type}
                </span>
              </div>

              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{role.description}</p>

              <ul className="mb-5 space-y-1.5">
                {role.requirements.map(r => (
                  <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500/60" />
                    {r}
                  </li>
                ))}
              </ul>

              <a href={`mailto:careers@kairoo.in?subject=Application: ${encodeURIComponent(role.title)}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-500 hover:text-teal-400 transition-colors">
                Apply for this role
                <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Catch-all CTA */}
      <div className="mt-16 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-8 text-center">
        <h3 className="mb-2 text-lg font-black text-foreground">Don&apos;t see your role?</h3>
        <p className="mb-5 text-sm text-muted-foreground max-w-md mx-auto">
          We&apos;re open to unconventional profiles. If you care about career development, love building, and want real ownership early - send us a note.
        </p>
        <a href="mailto:careers@kairoo.in?subject=Open Application"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-teal-400 transition-colors">
          Introduce yourself
        </a>
      </div>
    </main>
  );
}
