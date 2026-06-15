# Kairoo - Complete Platform Reference

```
╔═══════════════════════════════════════════════════════════════╗
║         K A I R O O  -  The Right Moment to Grow             ║
║         AI-Powered Career & Learning Command Center           ║
╚═══════════════════════════════════════════════════════════════╝
```

> **Formerly:** AstraPath AI  
> **Tagline:** "The right moment to grow"  
> **Position:** Unified AI platform for individual career acceleration and team skill intelligence

---

## Table of Contents

1. [What Is Kairoo?](#1-what-is-kairoo)
2. [Who Is It For?](#2-who-is-it-for)
3. [How It Works - End-to-End Flow](#3-how-it-works--end-to-end-flow)
4. [The Three Pillars](#4-the-three-pillars)
5. [All 39 Tools - Complete Reference](#5-all-39-tools--complete-reference)
6. [Platform Features (Beyond Tools)](#6-platform-features-beyond-tools)
7. [Profile Connectors & Imports](#7-profile-connectors--imports)
8. [Dashboard](#8-dashboard)
9. [Resume Builder](#9-resume-builder)
10. [Interview Prep Suite](#10-interview-prep-suite)
11. [Skill Gap Analysis](#11-skill-gap-analysis)
12. [Career Roadmaps](#12-career-roadmaps)
13. [XP & Progress System](#13-xp--progress-system)
14. [Team & Enterprise Features](#14-team--enterprise-features)
15. [Public Marketing Site](#15-public-marketing-site)
16. [All Routes & Pages](#16-all-routes--pages)
17. [Tech Stack - Full Reference](#17-tech-stack--full-reference)
18. [AI Engine Architecture](#18-ai-engine-architecture)
19. [Codebase Structure](#19-codebase-structure)
20. [Pricing](#20-pricing)
21. [Compliance & Privacy](#21-compliance--privacy)
22. [Design Principles](#22-design-principles)

---

## 1. What Is Kairoo?

Kairoo is a unified, AI-powered platform for career growth and skill development. The core idea is **profile-once, personalized everywhere**: you set your current role, target role, experience level, skills, and location during onboarding - and every one of the 39 AI tools on the platform uses that context to give you tailored, specific output instead of generic advice.

It is not a chatbot. Each tool has a **purpose-built prompt** engineered for that specific task, with structured inputs and structured outputs. The AI runs server-side, and the platform supports multiple LLM providers with tiered fallback routing.

The platform covers three domains:

- **Career Development** - coaching, planning, communication, negotiation, workplace wellbeing
- **Intelligent Learning** - AI-generated curricula, tutoring, project-based learning, practice quizzes
- **Team Intelligence** - skill matrices, gap analytics, goal alignment, predictive readiness _(Enterprise)_

---

## 2. Who Is It For?

```
┌─────────────────────┬───────────────────────────────────────────────────────┐
│ Segment             │ Primary Use Cases                                     │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Job Seekers         │ Resume optimization, interview prep, salary           │
│                     │ negotiation, job-description matching                 │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Mid-Career Profs    │ Promotion planning, performance reviews, skill gap    │
│                     │ analysis, goal setting, stakeholder mapping           │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Career Switchers    │ Pivot feasibility analysis, transferable skill        │
│                     │ mapping, rebranding, AI learning paths                │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Learners            │ AI-generated curricula, concept explainer, practice   │
│                     │ quizzes, project-based learning                       │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Teams / Enterprise  │ Skill matrices, team gap analysis, goal alignment,   │
│                     │ SSO, audit logs, dedicated success manager            │
└─────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 3. How It Works - End-to-End Flow

```
  1. LAND            2. SIGN UP          3. ONBOARD
  ─────────          ──────────          ──────────
  Public site   →   Clerk auth      →   Set profile:
  (marketing)       /sign-up            • Current role
                                        • Target role
                                        • Years of experience
                                        • Skills
                                        • Location
                                        • Learning style
                                        • Import from 18 platforms ↓

  4. DASHBOARD       5. RUN TOOLS        6. BUILD ARTIFACTS
  ─────────────      ────────────        ──────────────────
  Personalized  →   38 career +    →    Roadmaps, resumes,
  stats, XP,        1 learning          assessments - saved
  quick-launch,     tool runner         to your account
  activity feed     (pre-filled
                    from profile)

  7. TRACK PROGRESS  8. GROW
  ─────────────────  ──────
  XP, streaks,  →   Chain tools together:
  achievements,     Simulator → Roadmap →
  skill progress    Resume → Interview → Salary
```

### Three Real Workflow Chains

**Job Search**
`Career Simulator` → `Dynamic Roadmaps` → `Resume Builder` → `Job Matcher` → `Interview Coach` → `Salary Coach`

**Get Promoted**
`Career Health Check` → `Goal Refiner` → `Review Assistant` → `Skill Scenarios` → `Networking Strategist` → `90-Day Planner`

**Switch Careers**
`Career Simulator` → `Trends Analyzer` → `AI Path Generation` → `Project Generator` → `Bio Generator` → `Interview Coach`

---

## 4. The Three Pillars

### Pillar 1 - Career Development Suite

24 purpose-built AI tools covering planning, communication, negotiation, workplace wellbeing, and growth strategy. Every output is personalized to the user's role, experience, and goals.

### Pillar 2 - Intelligent Learning Paths

AI-generated curricula with real named resources (not generic placeholders), XP milestones, project deliverables, and an always-on AI tutor. Paths adapt to skill level and available time.

### Pillar 3 - Strategic Team Intelligence _(Enterprise)_

Aggregate skill gap visibility, predictive team readiness, goal alignment dashboards, and competitive benchmarking across the organization.

---

## 5. All 39 Tools - Complete Reference

### Category: Career (33 tools)

#### Planning & Strategy

| Tool                   | ID                  | Status   | Model Tier | What It Does                                        | Inputs                                         | Outputs                                                                                                                           |
| ---------------------- | ------------------- | -------- | ---------- | --------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Dynamic Roadmaps**   | `dynamicRoadmaps`   | ✅ Ready | `deep`     | Step-by-step career plan with real named resources  | Goal, background, timeframe                    | 3–5 phases with courses, YouTube channels, books, tools, certifications, portfolio projects, communities, monthly quick-ref table |
| **Career Simulator**   | `careerSimulator`   | ✅ Ready | `balanced` | Pivot feasibility: transferable skills, gaps, risks | Current role, target role, years of experience | Gap analysis ranked by importance, 3 first steps, timeline, risk mitigation                                                       |
| **90-Day Planner**     | `planner90Day`      | ✅ Ready | `balanced` | Strategic onboarding plan for new roles             | New role, focus priorities                     | Week-by-week plan with relationship targets, quick wins, 30/60/90 milestones                                                      |
| **Goal Refiner**       | `goalRefiner`       | ✅ Ready | `fast`     | Convert vague ambitions into SMART goals            | Raw goal statement                             | SMART goal, measurable milestones, first action step                                                                              |
| **Job Matcher**        | `jobMatcher`        | ✅ Ready | `balanced` | Resume vs. JD fit analysis                          | Resume/experience, job description             | Match score, skill gaps, suggested edits, positioning                                                                             |
| **Stakeholder Mapper** | `stakeholderMapper` | ✅ Ready | `balanced` | Project influence mapping                           | Project/initiative description                 | Stakeholder grid, influence levels, engagement scripts                                                                            |

#### Communication & Content

| Tool                | ID               | Status   | Model Tier | What It Does                                                                                     |
| ------------------- | ---------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------ |
| **Document Suite**  | `documentSuite`  | ✅ Ready | `balanced` | Cover letters, proposals, briefs, reports, memos, recommendation letters, status reports         |
| **Bio Generator**   | `bioGenerator`   | ✅ Ready | `fast`     | LinkedIn summaries, Twitter/X bios, personal website, conference intros - multiple tone variants |
| **Email Assistant** | `emailAssistant` | ✅ Ready | `fast`     | Professional emails for any situation: professional, friendly, direct, apologetic                |
| **Post Writer**     | `postWriter`     | ✅ Ready | `fast`     | Thought leadership posts for LinkedIn, Twitter/X, Blog - with hook, body, CTA                    |
| **Speaking Coach**  | `speakingCoach`  | ✅ Ready | `balanced` | Presentation structure, opener/closer, Q&A prep, key soundbites                                  |

#### Negotiation & Decision-Making

| Tool                  | ID                 | Status   | Model Tier | What It Does                                                                                    |
| --------------------- | ------------------ | -------- | ---------- | ----------------------------------------------------------------------------------------------- |
| **Salary Coach**      | `salaryCoach`      | ✅ Ready | `balanced` | Market rate range, negotiation scripts, beyond-base negotiables, walk-away number               |
| **Contract Reviewer** | `contractReviewer` | ✅ Ready | `balanced` | Plain-English analysis: key terms, risk flags, questions to ask before signing                  |
| **Interview Coach**   | `interviewCoach`   | ✅ Ready | `balanced` | STAR answer structure, sample answer, key points, likely follow-ups, common pitfalls            |
| **Review Assistant**  | `reviewAssistant`  | ✅ Ready | `fast`     | Performance review writing: self, peer, or manager - impact-framed with quantified achievements |
| **Pitch Refiner**     | `pitchRefiner`     | ✅ Ready | `balanced` | Elevator pitches for investors, recruiters, clients - with hook, body, ask                      |
| **Decision Co-Pilot** | `decisionCopilot`  | ✅ Ready | `balanced` | Structured decision support: pros/cons table, questions to resolve, trade-off framework         |
| **Conflict Mediator** | `conflictMediator` | ✅ Ready | `balanced` | Workplace disagreement navigation: reframing, resolution paths, communication scripts           |

#### Workplace & Wellbeing

| Tool                      | ID                     | Status   | Model Tier | What It Does                                                                            |
| ------------------------- | ---------------------- | -------- | ---------- | --------------------------------------------------------------------------------------- |
| **Networking Strategist** | `networkingStrategist` | ✅ Ready | `balanced` | Targeted relationship-building plans, first-message templates, follow-up cadence        |
| **Burnout Coach**         | `burnoutCoach`         | ✅ Ready | `balanced` | Validation, contributing factor analysis, recovery steps, boundary-setting scripts      |
| **Career Health Check**   | `healthCheck`          | ✅ Ready | `balanced` | Vitality score across 4 dimensions: growth, compensation, satisfaction, market position |
| **Skill Scenarios**       | `skillScenarios`       | ✅ Ready | `balanced` | Workplace conversation practice: raise requests, pushback handling, conflict            |
| **Jargon Buster**         | `jargonBuster`         | ✅ Ready | `fast`     | Plain-language definitions with analogies and usage-in-context                          |
| **Meeting Prep**          | `meetingPrep`          | ✅ Ready | `fast`     | Agenda, key questions, decision points, prep checklist                                  |

#### Growth & Strategy

| Tool                         | ID                 | Status   | Model Tier | What It Does                                                                            |
| ---------------------------- | ------------------ | -------- | ---------- | --------------------------------------------------------------------------------------- |
| **Trends Analyzer**          | `trendsAnalyzer`   | ✅ Ready | `balanced` | Emerging field trends, rising skills, concrete moves to stay ahead                      |
| **Project Generator**        | `projectGenerator` | ✅ Ready | `balanced` | Portfolio project ideas matched to skill level and career goals                         |
| **Side-Hustle Ideas**        | `sideHustle`       | ✅ Ready | `balanced` | Income stream suggestions, time-to-first-income estimates, platform guidance            |
| **Budget Proposer**          | `budgetProposer`   | ✅ Ready | `balanced` | Business case for training investments with ROI framing                                 |
| **Idea Validator**           | `ideaValidator`    | ✅ Ready | `balanced` | SWOT analysis, cheapest validation path, go/refine/rethink verdict                      |
| **Retro Helper**             | `retroHelper`      | ✅ Ready | `fast`     | Sprint retrospectives with format suggestions and action items                          |
| **Design Feedback**          | `mockupFeedback`   | ✅ Ready | `balanced` | UX/hierarchy/accessibility critique on design descriptions                              |
| **Resume Section Optimizer** | `resumeSection`    | ✅ Ready | `balanced` | AI rewrite of individual resume sections for ATS alignment using target role + JD       |
| **Learning Tutor**           | `learningTutor`    | ✅ Ready | `balanced` | Concept explanations at the right depth with analogies, examples, follow-up suggestions |

---

### Category: Learning (6 tools)

| Tool                       | ID                    | Status         | Model Tier | What It Does                                                                                            |
| -------------------------- | --------------------- | -------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| **AI Path Generation**     | `pathGeneration`      | ✅ Ready       | `deep`     | JSON-structured learning curricula with phases, steps, real resources, XP rewards, project deliverables |
| **AI Tutor Chatbot**       | `aiTutor`             | ✅ Ready       | `balanced` | Always-on Q&A with structured explanations, analogies, and suggested follow-ups                         |
| **Project-Based Learning** | `projectLearning`     | ✅ Ready       | `balanced` | Hands-on projects with milestone breakdowns, stack guidance, portfolio positioning                      |
| **Progress Tracking**      | `progressTracking`    | 🔜 Coming Soon | -          | Visual learning journey analytics and milestone history                                                 |
| **Dynamic Adaptation**     | `dynamicAdaptation`   | 🔜 Coming Soon | -          | Paths that evolve automatically with learner progress                                                   |
| **Enterprise Analytics**   | `enterpriseAnalytics` | 🔜 Coming Soon | -          | Team learning insights and skill gap dashboards                                                         |

---

### Model Tier Reference

```
┌──────────────┬─────────────────────────────────────────────────────────────┐
│ Tier         │ Primary Model + Fallbacks                                   │
├──────────────┼─────────────────────────────────────────────────────────────┤
│ fast         │ gemini-2.5-flash-lite → llama-3.1-8b (Groq) →             │
│              │ llama3.1-8b (Cerebras) → llama-3.1-8b (OpenRouter)         │
├──────────────┼─────────────────────────────────────────────────────────────┤
│ balanced     │ gemini-2.5-flash → llama-3.3-70b (Groq) →                 │
│              │ llama-4-scout (Groq) → llama-3.3-70b (Cerebras) →         │
│              │ llama-3.3-70b (NVIDIA)                                      │
├──────────────┼─────────────────────────────────────────────────────────────┤
│ deep         │ gemini-2.5-pro → groq/compound → llama-4-scout (Groq) →   │
│              │ gpt-oss-120b (Cerebras) → gpt-oss:120b (Ollama) →         │
│              │ deepseek-r1 (OpenRouter) → qwen3-32b (last resort)         │
└──────────────┴─────────────────────────────────────────────────────────────┘
```

> `dynamicRoadmaps` and `pathGeneration` use the `deep` tier with `maxOutputTokens: 6000` because they need long, structured outputs with real resource tables.

---

## 6. Platform Features (Beyond Tools)

### Personalization Engine

Every tool is pre-filled with inputs derived from the user's onboarding profile. A backend engineer won't get generic software advice - they get output calibrated to their stack, experience, and target role.

### Observability & Analytics

- `lib/observability/` - server-side analytics tracking (consent-gated)
- `lib/logger/` - structured logging
- Tool runs are logged with timestamps, feature ID, and output category
- Dashboard aggregates usage by category (career/learning) and time period

### Error Handling

- `lib/errors/` - typed error system
- `lib/result/` - Result type for safe error propagation without throws
- AI gateway has per-provider try/catch with automatic fallthrough to next provider

### State Management

- Zustand stores in `lib/stores/` - client-side state for tool sessions, UI state
- No Redux; lightweight per-feature stores

---

## 7. Profile Connectors & Imports

During onboarding (and via `/settings/connections`), users can import their professional history from 18 platforms. Each connector is a server-side module that fetches or parses data and normalizes it into Kairoo's profile schema.

```
┌─────────────────────────────────────────────────────────────────┐
│  Resume & Professional                                          │
│  ─────────────────────                                          │
│  📄 Resume PDF         Parses PDF, extracts structured data     │
│  💼 LinkedIn (paste)   Paste profile text, AI extracts fields   │
│  💼 LinkedIn (ZIP)     Official data export, full parse         │
│  🏢 Naukri             India's largest job platform             │
│  🚀 Wellfound          Startup job profiles (AngelList)         │
│                                                                 │
│  Developer Platforms                                            │
│  ───────────────────                                            │
│  🐙 GitHub             Repos, languages, contribution graph     │
│  🦊 GitLab             Projects, commits, activity              │
│  ⚡ LeetCode           Problems solved, contest rating          │
│  🔢 Codeforces         Rating, contest history, problems        │
│  👨‍🍳 CodeChef           Rating and competitive stats            │
│  🎯 HackerRank         Certifications, skills, badges           │
│  🌍 HackerEarth        Challenges, hackathon wins               │
│  📊 Kaggle             Datasets, notebooks, competitions        │
│  💬 Stack Overflow     Reputation, top tags, answers           │
│  📝 Dev.to             Published articles and topics            │
│                                                                 │
│  Portfolio                                                      │
│  ─────────                                                      │
│  🎨 Behance            Design projects and collections          │
│  💎 Dribbble           Design shots and portfolio               │
│                                                                 │
│  Learning                                                       │
│  ────────                                                       │
│  📚 Learning Paste     Paste course history, AI extracts skills │
└─────────────────────────────────────────────────────────────────┘
```

Connector data flows through `lib/connectors/merge.ts` which deduplicates and reconciles data from multiple sources into a single normalized profile.

---

## 8. Dashboard

The authenticated home at `/dashboard`. Every widget is driven by real API data from the user's account.

```
┌──────────────────────────────────────────────────────────────┐
│  Welcome Banner                                              │
│  "Good morning, Eshank · Level 12 · 🔥 7-day streak"        │
├──────────┬───────────┬───────────┬───────────────────────────┤
│  XP      │  Tools    │  Roadmaps │  Skills Assessed          │
│  2,450   │  34 runs  │  3 active │  12 competencies          │
├──────────┴───────────┴───────────┴───────────────────────────┤
│  Quick Launch (6 most-used tools)                            │
│  [Interview Coach] [Salary Coach] [Goal Refiner] ...         │
├──────────────────────────────┬───────────────────────────────┤
│  Activity Feed               │  Monthly Usage Widget         │
│  Today                       │  Career: ████████ 18          │
│  • Ran Salary Coach (2h ago) │  Learning: ████ 8             │
│  • Milestone: Phase 2 ✓      │  Productivity: ██ 4           │
│  Yesterday                   │  30 / 50 credits used         │
│  • Ran Interview Coach       │                               │
├──────────────────────────────┼───────────────────────────────┤
│  Weekly Goals                │  Today's Focus                │
│  Tools run: 3/5 ████░░       │  AI suggests your next        │
│  Streak: 7/7 ███████         │  action based on profile +    │
│  Path progress: 2/3 ████░    │  recent activity              │
└──────────────────────────────┴───────────────────────────────┘
```

> Demo mode activates for `demo@mreshank.com` - pre-populated data for product demos without real account activity.

---

## 9. Resume Builder

Full resume management system at `/tools/resumeBuilder`.

**Resume List View**

- All user resumes with template badge, ATS score chip, last-modified date
- Hover actions: edit, duplicate, delete
- ATS score color: `emerald` (70+) / `amber` (40–69) / `red` (<40)
- Create new: from scratch or auto-populated from profile data

**Resume Editor** (`/tools/resumeBuilder/[id]`)

- Inline section editing
- Section-by-section structure (Summary, Experience, Education, Skills, Projects)

**ATS Score Breakdown**
5-dimension visual bar chart:

1. Keyword Match
2. Formatting & Readability
3. Skills Alignment
4. Experience Depth
5. Role Fit

**Resume Section Optimizer** (tool `resumeSection`)

- Input: target role + job description + current section text
- Output: rewritten section with ATS-optimized language, active verbs, quantified impact

---

## 10. Interview Prep Suite

A dedicated multi-page hub at `/tools/interviewPrep`, separate from the generic tool runner.

```
  Hub (/tools/interviewPrep)
  ├── Stats: Total sessions · Completed · Avg score
  ├── Weakness Heatmap: skills with lowest scores across sessions
  ├── In-progress sessions list
  └── Quick links: Question Bank · New Session · History

  Question Bank (/tools/interviewPrep/questions)
  └── Browsable library by role, category, difficulty

  Session Setup (/tools/interviewPrep/setup)
  └── Configure: role, difficulty, question types, duration

  Live Session (/tools/interviewPrep/session/[id])
  └── Interactive Q&A with real-time scoring

  Results (/tools/interviewPrep/session/[id]/results)
  └── Per-answer feedback, improvement suggestions, overall analytics
```

---

## 11. Skill Gap Analysis

At `/tools/skillGap`:

- **Assessment** (`/tools/skillGap/assess`) - user rates skill level across domain competencies
- **Gap Dashboard** - heatmap of weak areas vs. target role requirements
- **Learning Plan Generation** - auto-creates a targeted AI learning path for identified gaps
- **Progress Tracking** - re-assess over time to measure development velocity

---

## 12. Career Roadmaps

At `/roadmaps`:

- User's roadmap list with **GitHub-style contribution heatmap** showing engagement over time
- Create via AI generation (`/roadmaps/new`) or manually
- Each roadmap: phases → milestones → resources → project deliverables
- Progress tracked per phase and milestone with XP rewards on completion
- Individual roadmap view (`/roadmaps/[id]`) with full phase breakdown

---

## 13. XP & Progress System

Gamification layer to drive consistent daily engagement.

```
  XP Sources
  ──────────
  • Tool run completed           → +10 XP
  • Roadmap milestone completed  → +50 XP
  • Interview session completed  → +25 XP
  • Skill assessment done        → +30 XP
  • Daily streak maintained      → bonus multiplier

  Progression
  ───────────
  • XP accumulates toward level thresholds
  • Levels unlock visual badges and dashboard flair
  • Streak counter shows consecutive daily active days
  • Achievements: first roadmap, 10 tool runs, 30-day streak, etc.

  Visibility
  ──────────
  • /progress - level, XP bar, streak history, achievement gallery
  • Dashboard header - current level + streak at a glance
  • XP burst animation on milestone completion (lib/xp-burst.ts)
```

---

## 14. Team & Enterprise Features

Available on Enterprise tier. Powered by aggregate data across team member accounts.

| Feature                       | Description                                                    |
| ----------------------------- | -------------------------------------------------------------- |
| **Team Skill Matrix**         | Aggregate view of skill levels across all team members         |
| **Gap Analytics**             | Which skills are missing or underdeveloped across the org      |
| **Predictive Readiness**      | AI assessment of team readiness for upcoming roles or projects |
| **Goal Alignment**            | Map individual goals to team and company objectives            |
| **Competitive Benchmarking**  | Team capabilities vs. industry standards                       |
| **Admin Dashboard**           | User management, usage reports, seat allocation                |
| **Audit Logs**                | Full activity log for compliance and oversight                 |
| **SSO**                       | Single sign-on via Clerk for enterprise identity providers     |
| **Dedicated Success Manager** | White-glove onboarding and ongoing support                     |

---

## 15. Public Marketing Site

### Page Inventory

| Route                     | Purpose                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `/`                       | Hero, three pillars, featured tools, workflow journeys, social proof, pricing teaser, CTA |
| `/features`               | Full 39-tool catalog, category tabs, workflow chains, personalization explainer, stats    |
| `/features/career`        | Career tools deep-dive with bento grid and tool filters                                   |
| `/features/learning`      | Learning suite deep-dive                                                                  |
| `/features/teams`         | Enterprise analytics and team capabilities                                                |
| `/pricing`                | 3-tier table, objection handling, detailed FAQ                                            |
| `/how-it-works`           | 4-step flow (Profile → Pick → Run → Grow) with persona walkthroughs                       |
| `/customers`              | Social proof and testimonials                                                             |
| `/about`                  | Company story and mission                                                                 |
| `/contact`                | Contact form                                                                              |
| `/careers`                | Recruitment page                                                                          |
| `/security`               | Security practices and compliance roadmap                                                 |
| `/investors`              | Investor hub                                                                              |
| `/investors/deck`         | Investor pitch deck                                                                       |
| `/investors/market`       | Market research and GTM strategy                                                          |
| `/investors/strategy`     | Business strategy and ICPs                                                                |
| `/investors/architecture` | Technical blueprint and system design                                                     |

---

## 16. All Routes & Pages

```
app/
├── (marketing)/                   Public site
│   ├── page.tsx                   Homepage
│   ├── features/
│   │   ├── page.tsx               Features hub
│   │   ├── career/page.tsx
│   │   ├── learning/page.tsx
│   │   └── teams/page.tsx
│   ├── pricing/page.tsx
│   ├── how-it-works/page.tsx
│   ├── customers/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── careers/page.tsx
│   └── security/page.tsx
│
├── (auth)/                        Authentication (Clerk)
│   ├── sign-in/[[...sign-in]]/
│   ├── sign-up/[[...sign-up]]/
│   └── verify/
│
├── (app)/                         Authenticated app
│   ├── dashboard/page.tsx
│   ├── tools/
│   │   ├── page.tsx               Tool browser (38 tools grid)
│   │   ├── [featureId]/page.tsx   Generic tool runner
│   │   ├── interviewPrep/
│   │   │   ├── page.tsx           Hub
│   │   │   ├── questions/
│   │   │   ├── setup/
│   │   │   └── session/[id]/
│   │   │       ├── page.tsx       Live session
│   │   │       └── results/
│   │   ├── resumeBuilder/
│   │   │   ├── page.tsx           Resume list
│   │   │   └── [id]/page.tsx      Resume editor
│   │   └── skillGap/
│   │       ├── page.tsx           Gap dashboard
│   │       └── assess/page.tsx    Assessment questionnaire
│   ├── roadmaps/
│   │   ├── page.tsx               Roadmap list
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── progress/page.tsx
│   └── settings/
│       ├── page.tsx               Hub
│       ├── profile/
│       ├── security/
│       ├── connections/
│       ├── notifications/
│       └── billing/
│
├── onboarding/page.tsx            First-time setup
├── investors/                     Investor pages
├── style/page.tsx                 Design system catalog
│
└── Legal (root-level)
    ├── privacy/
    ├── terms/
    ├── dpa/
    ├── acceptable-use/
    ├── cookies/
    ├── ai-disclosure/
    └── sub-processors/
```

---

## 17. Tech Stack - Full Reference

### Frontend

```
┌─────────────────────────────────────────────────────────────────┐
│  Core Framework                                                 │
├─────────────────────┬───────────────────────────────────────────┤
│  Next.js 16.2.9     │  App Router, server components, streaming │
│  React 19.2.7       │  Latest hooks, concurrent rendering       │
│  TypeScript 5       │  Strict types, no `any` policy           │
├─────────────────────┼───────────────────────────────────────────┤
│  Styling                                                        │
├─────────────────────┬───────────────────────────────────────────┤
│  Tailwind CSS 4     │  Utility-first, PostCSS plugin           │
│  @tailwindcss/typography 0.5  │  Prose styling for AI outputs  │
│  tailwind-merge 3.4 │  Safe class merging                       │
│  tw-animate-css 1.4 │  CSS animation utilities                  │
│  clsx 2.1.1         │  Conditional class names                  │
│  CVA 0.7.1          │  Component style variant system          │
├─────────────────────┼───────────────────────────────────────────┤
│  Animation                                                      │
├─────────────────────┬───────────────────────────────────────────┤
│  framer-motion 12.23│  Page transitions, component animations   │
│  motion 12.40       │  Animation primitives                     │
│  animejs 4.2.2      │  AnimatedBackground, particle effects     │
├─────────────────────┼───────────────────────────────────────────┤
│  UI Libraries                                                   │
├─────────────────────┬───────────────────────────────────────────┤
│  HeroUI React 3.1.0 │  Base component library (React 19 ready) │
│  HeroUI Styles 3.1  │  Theme tokens, CSS variables             │
│  Aceternity UI      │  37 premium custom components:           │
│                     │  CardSpotlight, GooeyInput, LampEffect,  │
│                     │  GlowingEffect, InfiniteMovingCards, etc  │
├─────────────────────┼───────────────────────────────────────────┤
│  Data Visualization                                             │
├─────────────────────┬───────────────────────────────────────────┤
│  Chart.js 4.5.1     │  Base charting engine                    │
│  react-chartjs-2 5.3│  React wrapper                           │
│  ChartCanvas        │  Internal theme-aware wrapper            │
│  (custom component) │  CompetitiveChart, ForecastChart,        │
│                     │  GrowthChart, TeamSkillChart              │
├─────────────────────┼───────────────────────────────────────────┤
│  Icons & Assets                                                 │
├─────────────────────┬───────────────────────────────────────────┤
│  lucide-react 0.554 │  554+ consistent icons                   │
├─────────────────────┼───────────────────────────────────────────┤
│  Content Rendering                                              │
├─────────────────────┬───────────────────────────────────────────┤
│  react-markdown 10.1│  Markdown rendering for AI outputs       │
│  remark-gfm 4.0.1   │  GitHub Flavored Markdown (tables, etc)  │
├─────────────────────┼───────────────────────────────────────────┤
│  Other Frontend                                                 │
├─────────────────────┬───────────────────────────────────────────┤
│  next-themes 0.4.6  │  Light/dark mode with no flash           │
│  cmdk 1.1.1         │  Command palette component               │
│  zustand 5.0.8      │  Lightweight client state management     │
└─────────────────────┴───────────────────────────────────────────┘
```

### Backend & Database

```
┌─────────────────────────────────────────────────────────────────┐
│  Runtime & API                                                  │
├─────────────────────┬───────────────────────────────────────────┤
│  Next.js API Routes │  All /api/* endpoints, server actions     │
│  Node.js 20.9.0+    │  Runtime                                 │
├─────────────────────┼───────────────────────────────────────────┤
│  Authentication                                                 │
├─────────────────────┬───────────────────────────────────────────┤
│  Clerk 7.5.2        │  Auth, session tokens, MFA, SSO,         │
│  @clerk/nextjs      │  user management, webhooks               │
├─────────────────────┼───────────────────────────────────────────┤
│  Database                                                       │
├─────────────────────┬───────────────────────────────────────────┤
│  Neon Serverless PG │  Managed serverless PostgreSQL            │
│  @neondatabase/      │  HTTP driver, connection pooling         │
│  serverless 1.1.0   │                                          │
│  Drizzle ORM 0.45.2 │  Type-safe SQL query builder             │
│  Drizzle Kit 0.31.10│  Migrations, schema management,          │
│                     │  Drizzle Studio (visual DB browser)       │
├─────────────────────┼───────────────────────────────────────────┤
│  Payments                                                       │
├─────────────────────┬───────────────────────────────────────────┤
│  Razorpay 2.9.6     │  Payment processing (India-first)        │
├─────────────────────┼───────────────────────────────────────────┤
│  Webhooks                                                       │
├─────────────────────┬───────────────────────────────────────────┤
│  Svix 1.95.2        │  Webhook management for integrations     │
├─────────────────────┼───────────────────────────────────────────┤
│  Utilities                                                      │
├─────────────────────┬───────────────────────────────────────────┤
│  zod 4.4.3          │  TypeScript-first schema validation       │
│  nanoid 5.1.11      │  Unique ID generation                    │
│  fflate 0.8.3       │  File compression (resume PDF parsing)   │
└─────────────────────┴───────────────────────────────────────────┘
```

### AI & LLM Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│  Primary Provider                                               │
├─────────────────────┬───────────────────────────────────────────┤
│  Google Gemini      │  Core LLM for all 39 tools               │
│  @google/genai 1.30 │  Official Gemini SDK                     │
│  Models used:       │  gemini-2.5-flash-lite (fast tier)       │
│                     │  gemini-2.5-flash (balanced tier)        │
│                     │  gemini-2.5-pro (deep tier)              │
├─────────────────────┼───────────────────────────────────────────┤
│  OpenAI-Compatible Fallback Providers                           │
├─────────────────────┬───────────────────────────────────────────┤
│  Groq               │  llama-3.1-8b, llama-3.3-70b,           │
│                     │  llama-4-scout, qwen3-32b, compound      │
│  Cerebras           │  llama3.1-8b, llama-3.3-70b,            │
│                     │  gpt-oss-120b                            │
│  NVIDIA NIM         │  llama-3.3-70b-instruct                 │
│  OpenRouter         │  llama-3.1-8b (free), deepseek-r1 (free)│
│  Ollama             │  gpt-oss:120b-cloud                      │
│  HuggingFace        │  Router endpoint                         │
│  Clod               │  Custom endpoint                         │
│  AINative           │  Custom endpoint                         │
│  Runway             │  Custom endpoint                         │
├─────────────────────┼───────────────────────────────────────────┤
│  Engine Layer (engines/ai/)                                     │
├─────────────────────┬───────────────────────────────────────────┤
│  gateway.ts         │  Provider routing, fallthrough on error  │
│  generate.ts        │  Core generation loop                    │
│  client.ts          │  Provider client initialization          │
│  models.ts          │  Tier definitions + provider configs     │
│  features/registry  │  Single source of truth for all 39 tools │
│  prompts/           │  base.ts, compose.ts, interview.ts,      │
│                     │  registry.ts - prompt system             │
│  providers/         │  gemini.ts, openai-compat.ts - adapters  │
│  guardrails/output  │  Output safety/quality guardrails        │
│  parsers/           │  roadmap-parser.ts - structured parsers  │
│  evals/             │  cases.ts, run.ts - evaluation harness   │
│  retrieval/         │  noop.ts + types - RAG seam (future)    │
└─────────────────────┴───────────────────────────────────────────┘
```

### Dev Tools & Scripts

```
┌─────────────────────────────────────────────────────────────────┐
│  Build & Type Checking                                          │
├─────────────────────┬───────────────────────────────────────────┤
│  tsx 4.22.4         │  TypeScript script runner (no compile)   │
│  typescript 5       │  Type checking (npx tsc --noEmit)        │
├─────────────────────┼───────────────────────────────────────────┤
│  Scripts (npm run)                                              │
├─────────────────────┬───────────────────────────────────────────┤
│  dev                │  next dev -p 1254                        │
│  build              │  next build (runs tokens script first)   │
│  start              │  next start -p 1254                      │
│  kill               │  Kill process on port 1254               │
│  tokens             │  tsx scripts/build-tokens.ts             │
│  lint:colors        │  Check no raw color values in CSS        │
│  evals              │  tsx engines/ai/evals/run.ts             │
│  db:push            │  drizzle-kit push                        │
│  db:generate        │  drizzle-kit generate                    │
│  db:studio          │  drizzle-kit studio (visual DB browser)  │
└─────────────────────┴───────────────────────────────────────────┘
```

---

## 18. AI Engine Architecture

The AI engine (`engines/ai/`) is the authoritative layer for everything AI-related. The API route and `lib/ai-tools.ts` are thin shims.

```
  User fills tool form
         ↓
  /api/ai/route.ts
  (validates request, gets user context, calls engine)
         ↓
  engines/ai/gateway.ts
  (selects provider by tier, routes to primary, falls back on error)
         ↓
  engines/ai/providers/
  ├── gemini.ts          (Google Gemini SDK)
  └── openai-compat.ts   (Groq, Cerebras, NVIDIA, OpenRouter, etc.)
         ↓
  engines/ai/generate.ts
  (builds final prompt via compose(), calls provider, returns response)
         ↓
  engines/ai/prompts/
  ├── base.ts            (system prompt with user profile context)
  ├── compose.ts         (merges base + feature systemAddendum)
  └── registry.ts        (feature-level prompt overrides)
         ↓
  engines/ai/guardrails/output.ts
  (post-generation safety and quality checks)
         ↓
  engines/ai/parsers/
  └── roadmap-parser.ts  (structured JSON extraction for roadmap/path features)
         ↓
  Formatted response → client
```

### Feature Registry Design

Each entry in `features/registry.ts` is fully self-contained:

- `id`, `name`, `icon`, `color`, `description` - display metadata
- `category` - `career` | `learning`
- `status` - `ready` | `coming-soon`
- `tier` - `fast` | `balanced` | `deep`
- `maxOutputTokens` - optional override (default 2048; roadmaps use 6000)
- `systemAddendum` - optional extra system instructions
- `inputs[]` - declarative field definitions (type, label, placeholder, options)
- `buildUserPrompt(inputs)` - the actual prompt builder, collocated with fields so they never drift

The registry is **client-safe** (no secrets, no network calls), so both the API route and the marketing UI import it directly.

### Eval Harness

`engines/ai/evals/` contains a test runner (`run.ts`) and test cases (`cases.ts`) for validating AI output quality. Run via `npm run evals`.

---

## 19. Codebase Structure

```
/
├── app/                           Next.js App Router routes
│   ├── (marketing)/               Public site
│   ├── (auth)/                    Clerk auth pages
│   ├── (app)/                     Authenticated app
│   ├── investors/                 Investor hub (ungrouped)
│   ├── onboarding/
│   ├── style/                     Design system catalog
│   └── [legal pages]/
│
├── components/
│   ├── ui/                        34 base components (Button, Input, Card, Modal, etc.)
│   ├── aceternity/                37 premium animated components
│   ├── layout/                    13 layout components (AppShell, SideNav, Header, Footer)
│   ├── shells/                    9 complex page shells
│   ├── blocks/                    14 reusable page sections (BentoGrid, CTA, FAQ, Pricing)
│   ├── charts/                    6 chart wrappers (CompetitiveChart, ForecastChart, etc.)
│   ├── motion/                    7 Framer Motion animation wrappers
│   ├── legal/                     3 legal page components
│   └── brand/                     4 brand/logo components
│
├── engines/
│   ├── ai/                        AI engine (gateway, providers, features, prompts, evals)
│   ├── career/                    Career domain logic
│   ├── learning/                  Learning domain logic
│   └── user-context/              User context extraction for AI personalization
│
├── lib/
│   ├── connectors/                18 platform import connectors
│   ├── data/static/               Static data: job titles, skills, locations, industries, education
│   ├── design/tokens/             Design token system (colors, spacing, typography, motion, etc.)
│   ├── errors/                    Typed error system
│   ├── legal/                     Legal content (privacy, terms, DPA, etc.)
│   ├── logger/                    Structured logging
│   ├── observability/             Analytics, consent management
│   ├── result/                    Result type for safe error handling
│   ├── stores/                    Zustand client state
│   ├── ai-tools.ts                Shim re-exporting engines/ai (migration seam)
│   ├── clerk-appearance.ts        Clerk UI theme config
│   ├── learning-style.ts          Learning style definitions
│   ├── resume-utils.ts            Resume parsing/formatting utilities
│   ├── utils.ts                   Shared utilities (cn, etc.)
│   └── xp-burst.ts                XP animation trigger
│
├── scripts/
│   ├── build-tokens.ts            Generates CSS custom properties from design tokens
│   └── check-no-raw-colors.mjs   Linting: no hardcoded color values
│
└── public/                        Static assets
```

### Design Token System

`lib/design/tokens/` is the single source of truth for all visual constants. The `build-tokens.ts` script converts them to CSS custom properties before every build.

```
tokens/
├── colors.ts      Semantic color scale (primary, surface, text, border, etc.)
├── spacing.ts     Spacing scale
├── typography.ts  Font families, sizes, weights, line heights
├── motion.ts      Easing curves, durations for animations
├── radius.ts      Border radius scale
├── shadows.ts     Box shadow levels
├── breakpoints.ts Responsive breakpoints
├── zIndex.ts      Z-index scale
└── index.ts       Barrel export
```

---

## 20. Pricing

```
┌──────────────────┬─────────────────────┬────────────────────────┐
│  Explorer        │  Pro                │  Enterprise            │
│  FREE            │  $19 / month        │  Custom                │
├──────────────────┼─────────────────────┼────────────────────────┤
│  1 active path   │  Unlimited paths    │  Everything in Pro     │
│  Weekly AI checks│  Daily coaching     │  Team dashboards       │
│  Community access│  Skill gap analysis │  Skill matrix          │
│  No card needed  │  Priority support   │  SSO                   │
│                  │  Free trial incl.   │  Audit logs            │
│                  │                     │  Dedicated CSM         │
└──────────────────┴─────────────────────┴────────────────────────┘
```

---

## 21. Compliance & Privacy

| Area                  | Implementation                                                        |
| --------------------- | --------------------------------------------------------------------- |
| **Authentication**    | Clerk manages all auth, session tokens, MFA                           |
| **Payments**          | Razorpay (PCI DSS compliant)                                          |
| **Webhooks**          | Svix with signature verification                                      |
| **AI transparency**   | `/ai-disclosure` page - honest statement that Gemini powers all tools |
| **Data minimization** | AI reasoning scoped to specific task; no cross-task data leakage      |
| **Analytics consent** | `lib/observability/consent.ts` - no tracking without consent          |
| **Legal pages**       | Privacy Policy, Terms, DPA, Acceptable Use, Cookies, Sub-Processors   |
| **Roadmap**           | Building toward SOC 2 Type II and GDPR                                |

---

## 22. Design Principles

**1. Profile-once, personalized everywhere**
Onboarding context flows into every tool. A backend engineer gets output calibrated to their stack; a designer gets design-specific advice. No generic outputs.

**2. Purpose-built prompts, not a chat interface**
Each tool has a carefully engineered prompt with structured inputs and structured outputs. The system is not a general-purpose chatbot - it is 39 specialized assistants.

**3. No AI slop, no overline labels**
Clean, premium UI. No generic badges above headings. No filler content. Every element earns its place.

**4. Workflow chains, not isolated tools**
Tools are designed to connect. The output of one feeds the next. The platform guides users through end-to-end journeys, not one-off queries.

**5. Tier-appropriate intelligence**
Simple outputs (bios, emails, jargon) use the `fast` tier. Complex analysis uses `balanced`. Deep structured documents (roadmaps, learning paths) use `deep` with extended token budgets.

**6. Graceful fallback, always**
If the primary LLM provider fails, the gateway falls through to the next provider automatically. The user never sees a broken tool.

**7. Honest about AI**
`/ai-disclosure` states plainly that Gemini powers the platform. No "proprietary AI" mystique - just transparency.

---

_Kairoo - the right moment to grow._

_Last updated: June 2026_
