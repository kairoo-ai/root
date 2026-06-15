# Kairoo — Complete Platform Reference

> "The right moment to grow" — AI-Powered Career & Learning Command Center

---

## What Is Kairoo?

Kairoo (formerly AstraPath AI) is a unified, AI-powered platform for individual career growth and team skill development. The core idea: you set your profile once — current role, target role, experience, skills, location — and every tool on the platform uses that context to give you personalized, actionable output instead of generic advice.

It combines 38+ purpose-built AI tools across career coaching, learning, resume building, and interview prep, with enterprise-level team analytics for organizations. The AI is powered by Google Gemini, accessed through a custom server-side gateway, and the platform runs on Next.js with a Neon PostgreSQL database.

---

## Who Is It For?

| Segment | Use Case |
|---|---|
| **Job Seekers** | Resume optimization, interview prep, salary negotiation, job matching |
| **Mid-Career Professionals** | Promotion planning, skill gap analysis, performance reviews, goal setting |
| **Career Switchers** | Pivot feasibility analysis, transferable skill mapping, rebranding |
| **Learners** | AI-generated learning paths, concept explanations, practice quizzes |
| **Teams & Enterprises** | Skill matrix dashboards, team gap analysis, goal alignment, SSO |

---

## How It Works (End-to-End Flow)

1. **Land** — User arrives at the public marketing site (`/`)
2. **Sign Up** — Clerk-powered auth at `/sign-up` (email + password)
3. **Onboard** — `/onboarding` collects: current role, target role, years of experience, skills, location, learning style. Option to import from LinkedIn, GitHub, resume, or 16+ platforms
4. **Dashboard** — After onboarding, user lands at `/dashboard` with personalized stats, quick-launch tools, activity feed, weekly goals, and XP progress
5. **Run Tools** — Browse `/tools`, select any of 38+ tools; inputs are pre-filled from profile context; AI runs and returns a structured, role-specific response
6. **Build Artifacts** — Create roadmaps, resumes, assessments; all saved to the user's account in PostgreSQL
7. **Track Progress** — XP system, streaks, achievement badges, skill progress over time
8. **Grow** — Iterate: each tool output feeds into the next (e.g., Career Simulator → Roadmap → Resume → Interview Coach → Salary Coach)

---

## The Three Pillars

### 1. Career Development Suite (24 Tools)
AI coaching for every stage of career growth — planning, communication, negotiation, workplace challenges, and wellbeing.

### 2. Intelligent Learning Paths
AI-generated curricula with real resources, project milestones, XP rewards, and an always-on AI tutor.

### 3. Strategic Business Intelligence *(Enterprise)*
Team skill matrices, predictive readiness analytics, goal alignment dashboards, and competitive benchmarking.

---

## Complete Feature & Tool Reference

### Career Planning & Strategy

| Tool | What It Does | Key Inputs | Key Outputs |
|---|---|---|---|
| **Dynamic Roadmaps** | Step-by-step career plan with phases, courses, certifications, and projects | Career goal, current background, timeframe (6–24 months) | 3–5 phases with weekly breakdowns, resources (Coursera/YouTube/books), portfolio projects, communities |
| **Career Simulator** | Pivot feasibility: transferable skills, gaps, timeline, risks | Current role → Target role | Gap analysis ranked by importance, 3 first steps, risk mitigation, realistic timeline |
| **90-Day Planner** | Strategic onboarding plan for new roles | Role, company context, goals | Week-by-week plan with relationship targets, quick wins, 30/60/90 milestones |
| **Goal Refiner** | Converts vague ambitions into SMART goals | Raw goal statement | SMART goal, measurable milestones, first action step |
| **Job Matcher** | Resume vs. job description fit analysis | Resume content + job description | Match score, skill gaps, suggested edits, application positioning |
| **Stakeholder Mapper** | Project influence mapping and engagement strategies | Project or initiative description | Stakeholder grid, influence levels, engagement scripts |

### Communication & Content

| Tool | What It Does | Key Inputs | Key Outputs |
|---|---|---|---|
| **Document Suite** | Cover letters, proposals, briefs, reports, memos | Document type + context | Professionally structured document draft |
| **Bio Generator** | LinkedIn summaries, Twitter bios, conference intros | Role, experience, tone | Multiple bio variants for different contexts |
| **Email Assistant** | Professional emails for any situation | Situation, tone (formal/friendly/direct/apologetic) | Ready-to-send email with subject line |
| **Post Writer** | Thought leadership content | Platform (LinkedIn/Twitter/Blog), topic | Structured post with hook, body, CTA |
| **Speaking Coach** | Presentation prep | Talk topic, audience, duration | Structure, opener/closer, Q&A prep, key soundbites |

### Negotiation & Decision-Making

| Tool | What It Does | Key Inputs | Key Outputs |
|---|---|---|---|
| **Salary Coach** | Market rates and negotiation strategy | Job title, years of experience, location | Market range, negotiation scripts, beyond-base negotiables, walk-away number |
| **Contract Reviewer** | Plain-English contract analysis | Contract text or description | Key terms, risk flags, questions to ask before signing |
| **Interview Coach** | STAR-structured interview answers | Role + interview question | STAR answer, key points, likely follow-ups, common pitfalls |
| **Review Assistant** | Performance review writing | Review type (self/peer/manager), context | Impact-framed review draft with quantified achievements |
| **Pitch Refiner** | Elevator pitches for investors, recruiters, clients | Pitch context and current draft | Refined pitch with hook, body, ask |
| **Decision Co-Pilot** | Structured decision support | Decision options and constraints | Pros/cons table, questions to resolve, trade-off framework |
| **Conflict Mediator** | Workplace disagreement navigation | Conflict description and parties involved | Balanced reframing, resolution paths, communication scripts |

### Workplace & Wellbeing

| Tool | What It Does | Key Inputs | Key Outputs |
|---|---|---|---|
| **Networking Strategist** | Targeted relationship-building plans | Current network gaps, goals | Target list, first-message templates, follow-up cadence |
| **Burnout Coach** | Recovery guidance | Burnout symptoms, contributing factors | Validation, contributing factor analysis, recovery steps, boundary scripts |
| **Career Health Check** | Vitality assessment | Current role satisfaction, growth, compensation, market position | Health score across 4 dimensions, recommended actions |
| **Skill Scenarios** | Workplace conversation practice | Scenario type (raise request, pushback, conflict) | Conversation script, likely responses, rebuttal prep |
| **Jargon Buster** | Plain-language industry term explanations | Term or concept | Definition, analogy, usage in context |
| **Meeting Prep** | Structured meeting prep | Meeting context and objectives | Agenda, key questions, decision points, prep checklist |

### Trends & Growth

| Tool | What It Does |
|---|---|
| **Trends Analyzer** | Emerging field trends, rising skills, concrete moves to stay ahead |
| **Project Generator** | Portfolio project ideas matched to skill level and career goals |
| **Side-Hustle Ideas** | Income stream suggestions with time-to-first-income and platform guidance |
| **Budget Proposer** | Business case for training investments with ROI framing |
| **Idea Validator** | SWOT analysis with cheapest validation path and go/refine/rethink verdict |
| **Retro Helper** | Sprint retrospectives with format suggestions and action items |
| **Design Feedback** | UX/hierarchy/accessibility critique on design descriptions |

---

## Learning Suite

### AI Learning Paths
User provides: skill goal, current level, available time per week, and target timeline (3 months to 2 years). The AI generates a structured JSON curriculum with:
- 3–5 phases, each with a title, duration in weeks, and learning steps
- Real resources per step: Coursera/Udemy courses, YouTube channels, books, official docs, practice platforms
- XP rewards for milestone completion
- Concrete project deliverables per phase

### AI Tutor (Concept Explainer)
An always-on Q&A assistant that explains any concept at the right level of depth. Takes a topic and experience level, returns a structured explanation with analogies, examples, and suggested follow-up questions to deepen understanding.

### Practice Quizzes
Generates topic-specific quizzes with multiple-choice and short-answer formats. Adapts difficulty to skill level. Provides explanations for correct and incorrect answers.

### Study Plans
Structured study sessions with time-boxed learning blocks, review cadence, spaced repetition schedules, and milestone checkpoints.

### Project-Based Learning
Hands-on projects that teach skills through building. Each project includes: objective, prerequisites, milestone breakdown, tech stack, and what you'll be able to show in a portfolio.

---

## Resume Builder

Full resume management system within the platform:

- **Resume list** — all user resumes with template badges and ATS scores
- **Create modes** — from scratch or auto-populated from onboarding profile data
- **Inline editor** — edit any section directly
- **Resume Section Optimizer** — powered by the AI engine; takes target role + job description and rewrites individual sections for ATS alignment
- **ATS Score** — calculated score with color coding: green (70+), amber (40–69), red (<40)
- **5-dimension ATS breakdown** — visual bar chart showing score across keyword match, formatting, skills alignment, experience depth, and role fit

---

## Interview Prep Suite

A dedicated hub at `/tools/interviewPrep` separate from the generic tool runner:

- **Stats dashboard** — total sessions, completed sessions, average score, weakness heatmap
- **Question bank** — browsable library of real interview questions by role/category
- **Session setup** — configure role, difficulty level, question types
- **Live session** — interactive Q&A with real-time scoring and feedback
- **Session results** — per-answer feedback, improvement suggestions, overall performance analytics
- **History** — all past sessions with scores and timestamps

---

## Skill Gap Analysis

- **Assessment flow** — user rates their skill level across domain competencies
- **Gap visualization** — heatmap of weak areas vs. role requirements
- **Learning plan generation** — automatically creates a targeted learning path for identified gaps
- **Progress tracking** — re-assess over time to measure skill development

---

## Career Roadmaps

- Create roadmaps from scratch or via AI generation
- Each roadmap has: title, phases, milestones, resource lists, project deliverables
- **Contribution heatmap** — GitHub-style activity visualization showing engagement over time
- Progress tracking per phase and milestone
- XP rewards for completing milestones

---

## XP & Progress System

Kairoo gamifies growth to drive consistent engagement:

- Every tool run, milestone completion, and session awards XP
- Users level up through XP thresholds
- **Streaks** — daily engagement streaks with visual counters
- **Achievements** — badge system for specific accomplishments (first roadmap, 10 tool runs, etc.)
- **Progress page** — `/progress` shows level, XP bar, streak history, achievement gallery
- **Weekly goals** — configurable targets shown on the dashboard

---

## Dashboard

The authenticated home at `/` (within the app route group):

| Widget | Description |
|---|---|
| **Welcome Banner** | Personalized greeting with user name, current level, and streak |
| **Stats Grid** | XP earned, tools run, roadmaps active, skills assessed |
| **Quick Launch** | 6 most-used tools for one-click access |
| **Activity Feed** | Recent tool runs and milestones with timestamps |
| **Usage Widget** | Monthly credit usage vs. limit with category breakdown |
| **Weekly Goals** | Progress bars for user-defined weekly targets |
| **Today's Focus** | AI-suggested daily action based on profile and recent activity |

---

## Team & Enterprise Features

Available on Enterprise tier:

- **Team Skill Matrix** — aggregate view of skills across all team members
- **Gap Analytics** — which skills are missing across the org
- **Predictive Readiness** — AI assessment of team readiness for upcoming roles/projects
- **Goal Alignment** — track how individual goals map to team and company objectives
- **Competitive Benchmarking** — team capabilities vs. industry standards
- **Admin Dashboard** — user management, usage reports, audit logs
- **SSO** — Single sign-on via Clerk for enterprise identity providers
- **Dedicated Success Manager** — white-glove onboarding and ongoing support

---

## Public Marketing Site

### Pages

| Route | Purpose |
|---|---|
| `/` | Hero, three pillars, featured tools, real workflow journeys, social proof, pricing teaser, CTA |
| `/features` | Full 38-tool catalog with category tabs, workflow chains, personalization explainer |
| `/features/career` | Career tool deep-dive with bento grid and tool filters |
| `/features/learning` | Learning suite deep-dive |
| `/features/teams` | Enterprise analytics and team capabilities |
| `/pricing` | 3-tier pricing table, objection handling, detailed FAQ |
| `/how-it-works` | 4-step flow (Profile → Pick → Run → Grow) with persona walkthroughs |
| `/customers` | Social proof and testimonials |
| `/about` | Company story and mission |
| `/investors` | Investor hub with deck, market research, strategy, architecture |
| `/security` | Security practices and compliance roadmap |

### Three Real Workflow Journeys (shown on homepage)
1. **Job Search:** Career Simulator → Roadmap → Resume Builder → Job Matcher → Interview Coach → Salary Coach
2. **Get Promoted:** Career Health Check → Goal Refiner → Review Assistant → Skill Scenarios → Networking Strategist → 90-Day Planner
3. **Switch Careers:** Career Simulator → Trends Analyzer → AI Learning Path → Project Generator → Bio Generator → Interview Coach

---

## Pricing

| Tier | Price | Highlights |
|---|---|---|
| **Explorer (Free)** | $0 forever | 1 active path, weekly AI checks, community access, no card required |
| **Pro** | $19/month | Unlimited paths, daily coaching, skill gap analysis, priority support, free trial included |
| **Enterprise** | Custom | Everything in Pro + team dashboards, SSO, audit logs, dedicated success manager |

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router, server components, streaming)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Framer Motion 12** + **Anime.js 4** — animations
- **HeroUI React 3.1** — base component library
- **Aceternity UI** — 37 premium custom components (glassmorphism, spotlight effects, gooey inputs)
- **Chart.js 4.5** + **react-chartjs-2** — data visualization
- **Lucide React** — icon library

### Backend & Database
- **Next.js API Routes** — all server endpoints under `/api/`
- **Clerk 7.5** — authentication, session management, MFA, SSO
- **Neon Serverless PostgreSQL** — managed relational database
- **Drizzle ORM 0.45** — type-safe SQL with schema migrations
- **Svix 1.95** — webhook management

### AI
- **Google Gemini** — core LLM powering all 38+ tools
- **@google/genai 1.30** — official Gemini SDK
- **Custom AI Gateway** (`engines/ai/`) — server-side abstraction layer with 38 feature registry, prompt management, and response formatting

### Payments & Utilities
- **Razorpay 2.9** — payment processing
- **Zustand 5** — client-side state management
- **Zod 4.4** — schema validation
- **React Markdown 10** + **Remark GFM** — markdown rendering
- **Nanoid 5** — unique ID generation
- **Next Themes 0.4** — light/dark mode

---

## Architecture Overview

```
app/
├── (marketing)/          # Public site — /, /features, /pricing, /how-it-works, etc.
├── (auth)/               # Sign-in, sign-up, verify (Clerk)
├── (app)/                # Authenticated app — dashboard, tools, roadmaps, progress, settings
│   ├── tools/
│   │   ├── [featureId]/  # Generic AI tool runner (38 tools)
│   │   ├── interviewPrep/
│   │   ├── resumeBuilder/
│   │   └── skillGap/
│   ├── roadmaps/
│   ├── progress/
│   └── settings/
├── api/
│   └── ai/route.ts       # AI gateway endpoint
│
engines/
└── ai/                   # Feature registry, prompts, response formatters (single source of truth)

components/
├── ui/                   # Base components (Button, Input, Card, Modal, etc.)
├── aceternity/           # Premium animated components
├── layout/               # AppShell, SideNav, Header, Footer
├── shells/               # Complex page shells
├── blocks/               # Reusable page sections (BentoGrid, CTA, Pricing, FAQ)
├── charts/               # Chart wrappers with theme awareness
└── motion/               # Framer Motion animation wrappers
```

The AI engine is the single source of truth for all feature definitions. `lib/ai-tools.ts` and the API route are thin shims that call into `engines/ai/`. This means adding a new tool requires only a registry entry — the entire UI, routing, and API plumbing is already generic.

---

## Compliance & Privacy

- Authentication and session tokens managed entirely by Clerk
- AI reasoning happens server-side, scoped to the specific task
- AI Disclosure page (`/ai-disclosure`) honestly states that Gemini powers all tools
- Data Processing Agreement available at `/dpa`
- Acceptable Use Policy at `/acceptable-use`
- Sub-processors listed at `/sub-processors`
- Building toward SOC 2 Type II and GDPR compliance

---

## Key Design Principles

- **Profile-once, personalized everywhere** — onboarding context flows into every tool, eliminating generic outputs
- **No AI slop** — every tool has a purpose-built prompt, not a generic "ask AI anything" box
- **Clean, premium UI** — glassmorphism design language, smooth Framer Motion transitions, dark/light theme
- **Workflow chains over isolated tools** — tools are designed to connect (simulator output feeds roadmap, roadmap feeds resume, etc.)
- **Honest about AI** — dedicated disclosure page, no invented numbers, Gemini usage is transparent
- **XP-driven engagement** — gamification creates habitual daily use, not one-off sessions

---

*Kairoo — the right moment to grow.*
