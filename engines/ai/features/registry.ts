// AI feature registry - the single source of truth for what the AI engine can do.
//
// Each feature colocates its display metadata, its input fields, and its prompt
// builder so inputs and prompts can never drift apart. This module is PURE and
// client-safe: it holds no secrets and makes no network calls, so both the API
// route (server) and the marketing UI (client, via the `@/lib/ai-tools` shim)
// import it. Secret-bearing code lives in `./client` and `./generate`.
//
// Canonical home per docs/ARCHITECTURE.md migration seam:
//   app/api/ai/route.ts + lib/ai-tools.ts -> engines/ai/* (lib/ai-tools is now a shim).

import type { ModelTier } from '@/engines/ai/types';

/** A single declarative input field for a feature. */
export interface FeatureInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  placeholder: string;
  options?: string[];
  required?: boolean;
}

/** A declarative AI feature: display metadata + inputs + its prompt builder. */
export interface FeatureDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: 'career' | 'learning';
  /** `coming-soon` features render in the UI but never call the model. */
  status: 'ready' | 'coming-soon';
  inputs: FeatureInput[];
  /** Model tier to use when calling the gateway. */
  tier: ModelTier;
  /** Override the default 2048 output token cap. Use for features that need long responses. */
  maxOutputTokens?: number;
  /** Optional system addendum appended to the base system prompt via compose(). */
  systemAddendum?: string;
  buildUserPrompt: (inputs: Record<string, string>) => string;
}

// Include an optional field in a prompt only when it actually has a value, so no
// `undefined`/empty text leaks into the model input.
const line = (label: string, v?: string): string =>
  v && v.trim() ? `${label}: ${v.trim()}\n` : '';

// A coming-soon feature needs a placeholder builder to satisfy the type; the
// engine never calls it (it returns the honest "not built yet" message instead).
const notBuilt: FeatureDef['buildUserPrompt'] = () => 'This feature is not built yet.';

export const features: FeatureDef[] = [
  {
    id: 'dynamicRoadmaps', name: 'Dynamic Roadmaps', icon: 'map', color: 'red-400',
    description: 'Generate step-by-step strategic plans to achieve your career goals',
    category: 'career', status: 'ready',
    tier: 'deep',
    maxOutputTokens: 6000,
    inputs: [
      { id: 'goal', label: 'Career goal', type: 'text', placeholder: 'e.g. Become a Senior Data Scientist', required: true },
      { id: 'background', label: 'Current background', type: 'textarea', placeholder: 'Your current role, years of experience, skills you already have' },
      { id: 'timeframe', label: 'Timeframe', type: 'select', placeholder: 'How long do you have', options: ['6 months', '12 months', '18 months', '24 months'] },
    ],
    buildUserPrompt: (i) => `You are a senior career strategist building a detailed, personalized roadmap.
${line('Goal', i.goal)}${line('Current background', i.background)}${line('Timeframe', i.timeframe || '12 months')}

CRITICAL REQUIREMENTS - every single phase MUST include:
1. **Named courses with platform**: e.g., "Andrew Ng's Machine Learning Specialization (Coursera, ~3 months)", "CS50P: Python (edX, free)", "The Odin Project Full Stack JavaScript (theodinproject.com, free)"
2. **Named YouTube channels/playlists**: e.g., "StatQuest with Josh Starmer (statistics + ML)", "Traversy Media (web dev)", "3Blue1Brown (math intuition)", "Fireship (quick concepts)", "NetworkChuck (networking/cloud)"
3. **Named books**: e.g., "Hands-On ML with Scikit-Learn & TensorFlow by Aurélien Géron", "Clean Code by Robert C. Martin", "Designing Data-Intensive Applications by Martin Kleppmann"
4. **Specific tools to install and practice with** (with links to official docs)
5. **Certification to pursue this phase**: exact name, issuing body, estimated cost, and URL - e.g., "Google Data Analytics Certificate (Coursera, ~$200 or financial aid)", "AWS Certified Cloud Practitioner (aws.amazon.com/certification, $100)"
6. **A concrete project to build** as the phase milestone - specific enough to put on a portfolio
7. **Communities to join**: e.g., specific subreddits, Discord servers, newsletters

Format each phase exactly like this:

---
## Phase N - [Name] ([Month range])
**Goal this phase:** one sentence

### Topics & Weekly Focus
- Week 1–2: [Specific topic] - [Why it matters]
- Week 3–4: [Specific topic] - [Why it matters]
(continue for all weeks in the phase)

### Courses & Structured Learning
| Resource | Platform | Cost | Time |
|---|---|---|---|
| [Exact course name] | [Platform] | [Free/$X] | [Hours/weeks] |

### YouTube Channels for This Phase
- **[Channel name]**: what to watch and why

### Books (optional but recommended)
- [Title by Author] - [1-line reason]

### Tools to Install & Practice
- [Tool name] - [what to do with it] - [docs.example.com]

### Certification to Pursue
**[Exact certification name]** - [Issuing body] - [Cost] - [Where to register: URL]
Recommended prep: [Specific prep resource]

### Phase Project (Portfolio Milestone)
Build: [Specific project description - what it does, what stack, where to deploy]
This demonstrates: [specific skills]

### Communities & Networking
- [Specific community name and where to find it]

---

End with a **Month-by-month quick-reference table** and **Job search checklist** for the final phase.`,
  },
  {
    id: 'documentSuite', name: 'Document Suite', icon: 'file-text', color: 'orange-400',
    description: 'Create professional documents, proposals, and communications',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'docType', label: 'Document type', type: 'select', placeholder: 'Choose a document', required: true, options: ['Project proposal', 'Cover letter', 'Business memo', 'Project brief', 'Recommendation letter', 'Status report'] },
      { id: 'purpose', label: 'What it needs to say', type: 'textarea', placeholder: 'Key points, context, and goal of the document', required: true },
      { id: 'audience', label: 'Audience (optional)', type: 'text', placeholder: 'e.g. hiring manager, executive team' },
    ],
    buildUserPrompt: (i) => `You are a professional business writer. Write a polished ${i.docType || 'document'}.
${line('Purpose and key points', i.purpose)}${line('Audience', i.audience)}
Return the finished document in markdown, ready to use. Match tone and structure to the document type and audience. Be concise and specific; avoid filler.`,
  },
  {
    id: 'interviewCoach', name: 'Interview Coach', icon: 'mic', color: 'amber-400',
    description: 'Practice interviews with AI feedback and real-time coaching',
    category: 'career', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 3500,
    inputs: [
      { id: 'role', label: 'Role', type: 'text', placeholder: 'Role you are interviewing for', required: true },
      { id: 'company', label: 'Company (optional)', type: 'text', placeholder: 'e.g. Stripe, early-stage startup, FAANG' },
      { id: 'question', label: 'Interview question', type: 'text', placeholder: 'e.g. Tell me about a time you led a project' },
    ],
    buildUserPrompt: (i) => `You are a senior interview coach who has helped candidates land roles at top companies.
${line('Role', i.role)}${line('Company/context', i.company)}${line('Question', i.question || 'Tell me about yourself')}

Return markdown with:

## Question Type & What They're Really Testing
Identify what the interviewer is probing for (not just the surface question). Be specific - e.g., "This is testing conflict resolution + cross-functional communication, NOT just leadership."

## Answer Framework
Use the right structure for the question type (STAR for behavioral, structured opinion for "what do you think about X", breadth-first for "design a system"). Explain the framework briefly.

## Strong Sample Answer
Write a full, realistic answer tailored to the role${i.company ? ` and ${i.company}'s known culture/values` : ''}. Do NOT make it generic. Use specific metrics, technologies, and outcomes. Length: 250–400 words for behavioral, concise for technical.

## What Makes This Answer Strong
3–4 bullet points on what the answer does well.

## What to Avoid
Specific pitfalls that would hurt this answer - not generic "don't be vague" but actual common mistakes on this type of question.

## 3 Likely Follow-Up Questions
Include a coaching note on each: what they're probing with the follow-up and a 1-sentence answer direction.

## Prep Resources
Name 1–2 specific resources for this type of question: e.g., "Grokking the Behavioral Interview (educative.io)", "Alex Xu's System Design Interview book", "Leetcode patterns: neetcode.io/roadmap"`,
  },
  {
    id: 'salaryCoach', name: 'Salary Coach', icon: 'trending-up', color: 'yellow-400',
    description: 'Analyze market value and negotiate better compensation',
    category: 'career', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 3000,
    inputs: [
      { id: 'role', label: 'Job title', type: 'text', placeholder: 'e.g. Backend Engineer', required: true },
      { id: 'experience', label: 'Years of experience', type: 'number', placeholder: 'e.g. 5' },
      { id: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Bangalore, India' },
    ],
    buildUserPrompt: (i) => `You are a compensation and negotiation advisor.
${line('Role', i.role)}${line('Experience (years)', i.experience)}${line('Location', i.location)}
Return markdown with:
1. **Market rate** - a reasoned range for this role/experience/location (state assumptions; you are not quoting live data)
2. **Negotiation strategy**
3. **Key talking points** to justify a higher offer
4. **Beyond base pay** - benefits and perks to negotiate
5. **When to walk away**`,
  },
  {
    id: 'careerSimulator', name: 'Career Simulator', icon: 'compass', color: 'lime-400',
    description: 'Simulate career pivots and identify skill gaps',
    category: 'career', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 4000,
    inputs: [
      { id: 'currentRole', label: 'Current role', type: 'text', placeholder: 'e.g. QA Engineer', required: true },
      { id: 'targetRole', label: 'Target role', type: 'text', placeholder: 'e.g. Product Manager', required: true },
      { id: 'experience', label: 'Years of experience', type: 'number', placeholder: 'e.g. 4' },
    ],
    buildUserPrompt: (i) => `You are a career-transition strategist. Simulate a pivot with deep specificity.
${line('Current role', i.currentRole)}${line('Target role', i.targetRole)}${line('Years of experience', i.experience)}

Return markdown with:

## Transferable Strengths
List 4–6 specific skills from the current role that directly apply, with a sentence on HOW each transfers.

## Skill Gaps - Ranked by Importance
For each gap, name it, explain why it's required in the target role, estimate how long to close it, and name the specific resource to use (course, certification, book). Be concrete - not "learn SQL" but "Complete Mode Analytics SQL Tutorial (mode.com/sql-tutorial, free) - 2 weeks".

## Realistic Transition Timeline
Break into phases. For each phase: what to learn, specific resources, and what milestone signals you're ready to move on. Typical transitions take 3–18 months depending on gap size - be honest.

## First 3 Actions This Week
Ultra-specific - not "research the field" but "Read [specific book/article], sign up for [specific course], message 3 people on LinkedIn with [specific job title] using this template: [template]".

## Salary Reality Check
Typical entry-level vs. senior compensation range in the target role. Be honest if there's likely a pay cut initially.

## Risks and How to De-Risk
Name the 2–3 most common failure modes in this pivot and a specific mitigation for each.`,
  },
  {
    id: 'projectGenerator', name: 'Project Generator', icon: 'code', color: 'green-400',
    description: 'Get portfolio project ideas based on your skills',
    category: 'career', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 4000,
    inputs: [
      { id: 'skills', label: 'Your skills / stack', type: 'text', placeholder: 'e.g. React, Python, SQL', required: true },
      { id: 'level', label: 'Level', type: 'select', placeholder: 'Experience level', options: ['Beginner', 'Intermediate', 'Advanced'] },
      { id: 'goal', label: 'Job target (optional)', type: 'text', placeholder: 'e.g. Frontend dev at a fintech startup' },
    ],
    buildUserPrompt: (i) => `You are a senior engineer mentoring someone's portfolio. Give deeply specific project briefs, not vague ideas.
${line('Skills/stack', i.skills)}${line('Level', i.level)}${line('Job target', i.goal)}

Suggest 3 portfolio projects. For each:

### Project [N]: [Title]
**One-line pitch:** (what it does, in plain English)
**Why employers care:** (what real-world problem it mirrors; which companies build things like this)

**Exact feature list to build (v1):**
1. [Specific feature] - [what technology/pattern it demonstrates]
2. ...

**Stretch features (v2, after getting hired):**
- ...

**Tech stack:**
- Frontend: [specific library/framework + version if relevant]
- Backend: [specific framework]
- Database: [specific DB and why]
- Deployment: [exact platform - Vercel, Railway, Fly.io, AWS Free Tier - with link]
- Auth: [Clerk / NextAuth / etc.]

**Reference repos to study** (real GitHub repos or open-source projects to learn from):
- github.com/[real-repo] - [what to learn from it]

**Skills demonstrated:** [comma-separated list exactly matching job description keywords]

Scale ambition to the stated level. Beginner = realistic for someone with 3 months experience. Advanced = could be a showcase at a senior interview.`,
  },
  {
    id: 'trendsAnalyzer', name: 'Trends Analyzer', icon: 'briefcase', color: 'emerald-400',
    description: 'Stay ahead with industry trend analysis',
    category: 'career', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 3000,
    inputs: [
      { id: 'industry', label: 'Industry or field', type: 'text', placeholder: 'e.g. fintech, frontend development', required: true },
      { id: 'role', label: 'Your role (optional)', type: 'text', placeholder: 'e.g. mid-level backend engineer' },
    ],
    buildUserPrompt: (i) => `You are an industry analyst and career strategist. Note: your training data has a cutoff, so flag any areas where the landscape may have shifted significantly.
${line('Industry/field', i.industry)}${line('Current role', i.role)}

Return markdown with:

## Top 5 Trends Reshaping ${i.industry || 'This Field'}
For each trend:
- **What it is** (plain language)
- **Evidence it's real** (name actual companies, products, or job posting patterns - e.g., "every major bank now has a dedicated AI team", "Vercel's edge runtime adoption grew 3× in 2024")
- **Skills rising in demand because of it** - name the specific technologies, certifications, or capabilities
- **How long before it's table stakes** (already required / 1–2 years / 3–5 years)

## Skills to Add Now (High ROI, Low Learning Curve)
For each: skill name, why it matters right now, and the fastest way to get it (specific course or cert).

## Skills to Add Soon (High Impact, Takes Time)
Same format.

## Skills That Are Declining - Don't Over-Invest
Be direct. Name specific technologies or approaches that are losing market share.

## 3 Concrete Career Moves for Someone in This Field
Ultra-specific - not "network more" but "Join [specific Slack community / conference / newsletter]" or "Get [specific certification] in the next 6 months because [reason]".

## Where to Track This Field Going Forward
Name specific newsletters, blogs, podcasts, and communities: e.g., "The Pragmatic Engineer by Gergely Orosz (substack)", "TLDR Newsletter (tldr.tech)", "Hacker News (news.ycombinator.com)".`,
  },
  {
    id: 'reviewAssistant', name: 'Review Assistant', icon: 'award', color: 'teal-400',
    description: 'Craft powerful performance reviews',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'reviewType', label: 'Review type', type: 'select', placeholder: 'Choose', required: true, options: ['Self-review', 'Peer review', 'Manager review of report'] },
      { id: 'highlights', label: 'Accomplishments / notes', type: 'textarea', placeholder: 'Wins, impact, metrics, areas worked on', required: true },
      { id: 'role', label: 'Role (optional)', type: 'text', placeholder: 'e.g. Software Engineer II' },
    ],
    buildUserPrompt: (i) => `You are an expert at writing performance reviews.
${line('Review type', i.reviewType)}${line('Role', i.role)}${line('Accomplishments and notes', i.highlights)}
Write the review in markdown: an opening summary, specific achievements framed around impact (quantify where possible), growth areas phrased constructively, and goals for next period. Keep it honest and professional, not inflated.`,
  },
  {
    id: 'bioGenerator', name: 'Bio Generator', icon: 'user-square', color: 'cyan-400',
    description: 'Create compelling professional bios and LinkedIn summaries',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'role', label: 'Role / what you do', type: 'text', placeholder: 'e.g. Full-stack developer focused on fintech', required: true },
      { id: 'highlights', label: 'Highlights (optional)', type: 'textarea', placeholder: 'Achievements, skills, interests to include' },
      { id: 'platform', label: 'Platform', type: 'select', placeholder: 'Where it will be used', options: ['LinkedIn', 'Twitter/X', 'Personal website', 'Conference bio'] },
      { id: 'tone', label: 'Tone', type: 'select', placeholder: 'Tone', options: ['Professional', 'Friendly', 'Bold'] },
    ],
    buildUserPrompt: (i) => `You are a personal-branding copywriter. Write a professional bio.
${line('Role / what they do', i.role)}${line('Highlights', i.highlights)}${line('Platform', i.platform)}${line('Tone', i.tone)}
Return 2 variants in markdown (a short and a longer version), sized appropriately for the platform. First person unless a conference bio (third person).`,
  },
  {
    id: 'skillScenarios', name: 'Skill Scenarios', icon: 'users', color: 'sky-400',
    description: 'Practice workplace conversations with AI role-play',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'scenario', label: 'Scenario to practice', type: 'text', placeholder: 'e.g. Asking my manager for a raise', required: true },
      { id: 'role', label: 'Your role (optional)', type: 'text', placeholder: 'e.g. Designer' },
    ],
    buildUserPrompt: (i) => `You are a communication coach running a role-play.
${line('Scenario', i.scenario)}${line('Their role', i.role)}
Return markdown with: a **sample dialogue** showing how the conversation could go well (label speakers), **key phrases** to use, **mistakes to avoid**, and **how to handle pushback**.`,
  },
  {
    id: 'jobMatcher', name: 'Job Matcher', icon: 'target', color: 'blue-400',
    description: 'Analyze resume-job fit and get improvement suggestions',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'resume', label: 'Your resume / experience', type: 'textarea', placeholder: 'Paste your resume or summarize your experience', required: true },
      { id: 'jobDescription', label: 'Job description', type: 'textarea', placeholder: 'Paste the job description', required: true },
    ],
    buildUserPrompt: (i) => `You are a technical recruiter assessing fit.
${line('Candidate resume/experience', i.resume)}
${line('Job description', i.jobDescription)}
Return markdown with: an **overall fit score (0-100)** with one-line justification, **matching strengths**, **gaps or missing keywords**, and **specific resume edits** to better target this role.`,
  },
  {
    id: 'planner90Day', name: '90-Day Planner', icon: 'calendar-check', color: 'indigo-400',
    description: 'Strategic onboarding plans for new roles',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'role', label: 'New role', type: 'text', placeholder: 'e.g. Engineering Manager', required: true },
      { id: 'focus', label: 'Priorities (optional)', type: 'text', placeholder: 'e.g. build trust, ship first feature' },
    ],
    buildUserPrompt: (i) => `You are an onboarding coach. Build a 30-60-90 day plan.
${line('New role', i.role)}${line('Stated priorities', i.focus)}
Return markdown with three sections - **First 30 days (learn)**, **Days 31-60 (contribute)**, **Days 61-90 (own)** - each with goals, key relationships to build, and a measurable success signal.`,
  },
  {
    id: 'emailAssistant', name: 'Email Assistant', icon: 'mail-plus', color: 'violet-400',
    description: 'Draft professional emails for any situation',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'situation', label: 'What is the email about', type: 'textarea', placeholder: 'Context and what you want to achieve', required: true },
      { id: 'tone', label: 'Tone', type: 'select', placeholder: 'Tone', options: ['Professional', 'Friendly', 'Direct', 'Apologetic'] },
      { id: 'recipient', label: 'Recipient (optional)', type: 'text', placeholder: 'e.g. my manager, a client' },
    ],
    buildUserPrompt: (i) => `You are a professional communication assistant. Draft an email.
${line('Situation and goal', i.situation)}${line('Tone', i.tone)}${line('Recipient', i.recipient)}
Return markdown with a **subject line** and the **email body**. Keep it clear and appropriately concise. Offer one optional shorter alternative subject line.`,
  },
  {
    id: 'meetingPrep', name: 'Meeting Prep', icon: 'clipboard-list', color: 'purple-400',
    description: 'Prepare for meetings with AI-generated agendas',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'topic', label: 'Meeting topic / goal', type: 'text', placeholder: 'e.g. Q3 roadmap planning', required: true },
      { id: 'attendees', label: 'Attendees (optional)', type: 'text', placeholder: 'e.g. PM, 2 engineers, designer' },
      { id: 'duration', label: 'Duration (optional)', type: 'text', placeholder: 'e.g. 45 minutes' },
    ],
    buildUserPrompt: (i) => `You are a meeting facilitator.
${line('Topic/goal', i.topic)}${line('Attendees', i.attendees)}${line('Duration', i.duration)}
Return markdown with: a **clear objective**, a **timed agenda**, **key questions to drive**, **decisions to reach**, and a **prep checklist** for the organizer.`,
  },
  {
    id: 'postWriter', name: 'Post Writer', icon: 'pen-square', color: 'fuchsia-400',
    description: 'Create thought leadership content',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. lessons from scaling a team', required: true },
      { id: 'platform', label: 'Platform', type: 'select', placeholder: 'Where it will be posted', options: ['LinkedIn', 'Twitter/X', 'Blog'] },
      { id: 'angle', label: 'Angle / opinion (optional)', type: 'textarea', placeholder: 'Your take or the story you want to tell' },
    ],
    buildUserPrompt: (i) => `You are a thought-leadership ghostwriter.
${line('Topic', i.topic)}${line('Platform', i.platform)}${line('Angle/opinion', i.angle)}
Write a post sized for the platform (a thread for Twitter/X, a structured post for LinkedIn, a short article for Blog). Open with a strong hook, deliver real substance, and end with an engagement prompt. Return markdown.`,
  },
  {
    id: 'goalRefiner', name: 'Goal Refiner', icon: 'flag', color: 'pink-400',
    description: 'Transform vague ambitions into SMART goals',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'goal', label: 'Your goal or ambition', type: 'textarea', placeholder: 'e.g. I want to get better at public speaking', required: true },
    ],
    buildUserPrompt: (i) => `You are a goal-setting coach.
${line('Raw goal', i.goal)}
Rewrite it as a **SMART goal** (Specific, Measurable, Achievable, Relevant, Time-bound) in markdown. Then add: **milestones**, **how to measure progress**, and **the first action to take today**.`,
  },
  {
    id: 'ideaValidator', name: 'Idea Validator', icon: 'lightbulb', color: 'rose-400',
    description: 'Get SWOT analysis for your business ideas',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'idea', label: 'Your idea', type: 'textarea', placeholder: 'Describe the business or product idea', required: true },
    ],
    buildUserPrompt: (i) => `You are a pragmatic startup advisor.
${line('Idea', i.idea)}
Return markdown with: a **SWOT analysis** (Strengths, Weaknesses, Opportunities, Threats), the **biggest risk**, the **cheapest way to validate demand this week**, and an honest **go / refine / rethink** verdict with reasoning.`,
  },
  {
    id: 'learningTutor', name: 'Learning Tutor', icon: 'graduation-cap', color: 'red-500',
    description: 'AI tutor for any skill or concept',
    category: 'career', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 3500,
    inputs: [
      { id: 'topic', label: 'What do you want to learn', type: 'text', placeholder: 'e.g. how does OAuth work', required: true },
      { id: 'level', label: 'Your level', type: 'select', placeholder: 'Level', options: ['Complete beginner', 'Some knowledge', 'Advanced'] },
    ],
    buildUserPrompt: (i) => `You are a world-class tutor who makes complex topics genuinely clear. Pitch this at ${i.level || 'some knowledge'} level.
${line('Topic', i.topic)}

## Core Explanation
Explain the concept from first principles. Be thorough - don't skip the parts that "everyone knows". Use plain English. If it's a technical concept, explain why it exists (what problem it solves) before explaining how it works.

## Real-World Analogy
One analogy that makes it click. Then show the places this concept appears in the real world (name actual products, companies, or systems that use it).

## Step-by-Step Breakdown (if applicable)
If the topic involves a process or sequence (auth flow, compilation, network request, etc.), walk through each step with what happens and why.

## Code Example (if applicable)
A minimal, working example with comments explaining every non-obvious line. Name the language/framework.

## Common Misconceptions
The 2–3 things people most often get wrong about this topic.

## Quick Self-Check
A question the learner should be able to answer now. Then provide the answer below a spoiler heading.

## What to Learn Next (ordered)
3–4 specific next topics, ordered by importance. For each, name the best resource: e.g., "OAuth 2.0 spec (oauth.net/2)", "JWT.io for visual JWT debugging", "Auth0 blog's 'OAuth vs OIDC' article"`,
  },
  {
    id: 'contractReviewer', name: 'Contract Reviewer', icon: 'shield-check', color: 'orange-500',
    description: 'Analyze contracts and job offers',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'contractText', label: 'Contract / offer text', type: 'textarea', placeholder: 'Paste the clauses or offer details', required: true },
      { id: 'concern', label: 'Specific concern (optional)', type: 'text', placeholder: 'e.g. non-compete, equity vesting' },
    ],
    buildUserPrompt: (i) => `You are a contract analyst. You are NOT a lawyer and must say so.
${line('Contract/offer text', i.contractText)}${line('Specific concern', i.concern)}
Return markdown with: **plain-English summary** of key terms, **clauses to watch** (and why), **questions to ask before signing**, and a clear disclaimer that this is not legal advice and a lawyer should review anything significant.`,
  },
  {
    id: 'networkingStrategist', name: 'Networking Strategist', icon: 'network', color: 'amber-500',
    description: 'Strategic relationship building plans',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'goal', label: 'Networking goal', type: 'text', placeholder: 'e.g. break into product management', required: true },
      { id: 'industry', label: 'Industry (optional)', type: 'text', placeholder: 'e.g. SaaS' },
    ],
    buildUserPrompt: (i) => `You are a networking strategist.
${line('Goal', i.goal)}${line('Industry', i.industry)}
Return markdown with: **who to connect with** (roles/profiles), **where to find them**, a **first-message template** that gets replies, a **cadence** for staying in touch, and **how to add value** rather than just asking.`,
  },
  {
    id: 'burnoutCoach', name: 'Burnout Coach', icon: 'heart-pulse', color: 'yellow-500',
    description: 'Manage workplace stress with AI guidance',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'situation', label: "What's going on", type: 'textarea', placeholder: 'Describe what is draining you right now', required: true },
    ],
    buildUserPrompt: (i) => `You are a supportive wellbeing coach. Be warm but practical. You are not a medical professional.
${line('Situation', i.situation)}
Return markdown with: a brief **validation** of how they feel, **likely contributing factors**, **2-3 things to try this week**, **boundaries worth setting**, and a gentle note on **when to seek professional help**.`,
  },
  {
    id: 'budgetProposer', name: 'Budget Proposer', icon: 'piggy-bank', color: 'lime-500',
    description: 'Justify training investments to your company',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'training', label: 'Training / tool to fund', type: 'text', placeholder: 'e.g. AWS certification course', required: true },
      { id: 'cost', label: 'Cost (optional)', type: 'text', placeholder: 'e.g. $1,200' },
      { id: 'benefit', label: 'Expected benefit (optional)', type: 'textarea', placeholder: 'How it helps you and the team' },
    ],
    buildUserPrompt: (i) => `You are helping an employee make a business case to their manager.
${line('Training/tool', i.training)}${line('Cost', i.cost)}${line('Expected benefit', i.benefit)}
Return markdown: a short **proposal** with the ask, the **business justification** (tie to team/company outcomes and ROI), how to **measure the return**, and a **ready-to-send message** to the manager.`,
  },
  {
    id: 'pitchRefiner', name: 'Pitch Refiner', icon: 'megaphone', color: 'green-500',
    description: 'Perfect your elevator pitch',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'pitch', label: 'Your current pitch', type: 'textarea', placeholder: 'Paste your current elevator pitch or describe yourself', required: true },
      { id: 'audience', label: 'Audience (optional)', type: 'text', placeholder: 'e.g. investors, recruiters' },
    ],
    buildUserPrompt: (i) => `You are a pitch coach.
${line('Current pitch', i.pitch)}${line('Audience', i.audience)}
Return markdown with: a **tightened 30-second version**, a **10-second version**, what was **working** and what was **weak** in the original, and **delivery tips**.`,
  },
  {
    id: 'retroHelper', name: 'Retro Helper', icon: 'recycle', color: 'emerald-500',
    description: 'Structure team retrospectives',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'sprintSummary', label: 'What happened this sprint/period', type: 'textarea', placeholder: 'Wins, problems, notable events', required: true },
      { id: 'teamSize', label: 'Team size (optional)', type: 'text', placeholder: 'e.g. 6' },
    ],
    buildUserPrompt: (i) => `You are an agile coach facilitating a retrospective.
${line('What happened', i.sprintSummary)}${line('Team size', i.teamSize)}
Return markdown with: a suggested **retro format**, draft prompts grouped as **What went well / What didn't / What to try**, **likely discussion themes** from the summary, and **2-3 concrete action items** with owners-to-assign.`,
  },
  {
    id: 'healthCheck', name: 'Career Health Check', icon: 'activity', color: 'teal-500',
    description: 'Analyze your career vitality',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'currentRole', label: 'Current role & situation', type: 'text', placeholder: 'e.g. mid-level dev, 3 years, feeling stuck', required: true },
      { id: 'concerns', label: 'Concerns (optional)', type: 'textarea', placeholder: 'What worries you about your career right now' },
    ],
    buildUserPrompt: (i) => `You are a career advisor doing a health check.
${line('Current role and situation', i.currentRole)}${line('Concerns', i.concerns)}
Return markdown with: a **vitality assessment** across growth, compensation, satisfaction, and market position; **green flags and red flags**; and a **prioritized 3-step plan** to improve the weakest area.`,
  },
  {
    id: 'sideHustle', name: 'Side-Hustle Ideas', icon: 'dollar-sign', color: 'cyan-500',
    description: 'Personalized income stream suggestions',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'skills', label: 'Your skills', type: 'text', placeholder: 'e.g. writing, web dev, design', required: true },
      { id: 'hoursPerWeek', label: 'Hours/week available', type: 'number', placeholder: 'e.g. 8' },
      { id: 'incomeGoal', label: 'Income goal (optional)', type: 'text', placeholder: 'e.g. $500/month' },
    ],
    buildUserPrompt: (i) => `You are a side-income strategist.
${line('Skills', i.skills)}${line('Hours available per week', i.hoursPerWeek)}${line('Income goal', i.incomeGoal)}
Suggest 3 realistic side hustles. For each, return markdown with: **what it is**, **time to first income**, **realistic monthly earnings**, **how to get the first client/customer**, and **startup effort/cost**. Be honest about effort vs. payoff.`,
  },
  {
    id: 'speakingCoach', name: 'Speaking Coach', icon: 'presentation', color: 'sky-500',
    description: 'Improve presentation and speaking skills',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'topic', label: 'Talk topic', type: 'text', placeholder: 'e.g. introducing our new API', required: true },
      { id: 'context', label: 'Context', type: 'select', placeholder: 'Setting', options: ['Conference talk', 'Team presentation', 'Pitch', 'Webinar'] },
    ],
    buildUserPrompt: (i) => `You are a public-speaking coach.
${line('Topic', i.topic)}${line('Setting', i.context)}
Return markdown with: a **talk structure** (opening hook, body, close), **a memorable opening line**, **slide/visual suggestions**, **delivery and body-language tips**, and **how to handle Q&A or nerves**.`,
  },
  {
    id: 'conflictMediator', name: 'Conflict Mediator', icon: 'shield-half', color: 'blue-500',
    description: 'Navigate difficult workplace conversations',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'situation', label: 'The conflict', type: 'textarea', placeholder: 'Describe the disagreement and what happened', required: true },
      { id: 'relationship', label: 'Their role', type: 'select', placeholder: 'Who is the other person', options: ['Manager', 'Peer', 'Direct report', 'Client'] },
    ],
    buildUserPrompt: (i) => `You are a workplace-conflict mediator. Stay balanced and avoid taking sides unfairly.
${line('The conflict', i.situation)}${line('Other person', i.relationship)}
Return markdown with: a **neutral reframing** of the conflict, **the likely view from the other side**, **what to say** to open a constructive conversation, **what to avoid**, and a **realistic resolution path**.`,
  },
  {
    id: 'mockupFeedback', name: 'Design Feedback', icon: 'drafting-compass', color: 'indigo-500',
    description: 'Get expert feedback on designs and mockups',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'description', label: 'Describe the design', type: 'textarea', placeholder: 'Describe the layout, flow, and elements (you cannot upload an image here)', required: true },
      { id: 'goal', label: 'Goal of the design (optional)', type: 'text', placeholder: 'e.g. increase signups' },
    ],
    buildUserPrompt: (i) => `You are a senior product designer giving a design critique based on the user's written description (no image is provided).
${line('Design description', i.description)}${line('Goal', i.goal)}
Return markdown with: **what likely works**, **usability and hierarchy concerns**, **accessibility notes**, and **prioritized, specific improvements** tied to the stated goal. Ask for any detail you'd need that's missing.`,
  },
  {
    id: 'jargonBuster', name: 'Jargon Buster', icon: 'book-key', color: 'violet-500',
    description: 'Decode industry terminology',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'term', label: 'Term or phrase', type: 'text', placeholder: 'e.g. "idempotent", "north star metric"', required: true },
      { id: 'industry', label: 'Industry context (optional)', type: 'text', placeholder: 'e.g. software, finance' },
    ],
    buildUserPrompt: (i) => `You are great at explaining jargon simply.
${line('Term', i.term)}${line('Industry context', i.industry)}
Return markdown with: a **plain-language definition**, a **simple analogy**, **how it's used in a real sentence**, and **related terms** worth knowing.`,
  },
  {
    id: 'decisionCopilot', name: 'Decision Co-Pilot', icon: 'waypoints', color: 'purple-500',
    description: 'Navigate tough career choices',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'decision', label: 'The decision', type: 'textarea', placeholder: 'e.g. take a startup offer or stay at my stable job', required: true },
      { id: 'options', label: 'Options & factors (optional)', type: 'textarea', placeholder: 'List the options and what matters to you' },
    ],
    buildUserPrompt: (i) => `You are a decision-making coach. Help the person think, don't just decide for them.
${line('Decision', i.decision)}${line('Options and factors', i.options)}
Return markdown with: the **core trade-off**, a **pros/cons table per option**, the **questions they should answer for themselves**, **what each choice optimizes for**, and a **framework** to make the call.`,
  },
  {
    id: 'stakeholderMapper', name: 'Stakeholder Mapper', icon: 'sitemap', color: 'fuchsia-500',
    description: 'Map project stakeholders and influence',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'project', label: 'Project / initiative', type: 'text', placeholder: 'e.g. migrating billing to a new vendor', required: true },
      { id: 'stakeholders', label: 'Known stakeholders (optional)', type: 'textarea', placeholder: 'List people/teams involved if you know them' },
    ],
    buildUserPrompt: (i) => `You are a project and stakeholder strategist.
${line('Project', i.project)}${line('Known stakeholders', i.stakeholders)}
Return markdown with: a **stakeholder map** categorizing each by **influence vs. interest** (high/low), what each one **cares about**, an **engagement strategy per group**, and **who to win over first**.`,
  },

  {
    id: 'resumeSection',
    name: 'Resume Section Optimizer',
    icon: 'file-text',
    color: 'violet-400',
    description: 'AI-improves a single resume section using your target role and job description',
    category: 'career',
    status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'section', label: 'Section name', type: 'text', placeholder: 'e.g. summary', required: true },
      { id: 'currentContent', label: 'Current content', type: 'textarea', placeholder: 'Paste existing section text or JSON', required: true },
      { id: 'targetRole', label: 'Target role', type: 'text', placeholder: 'e.g. Senior Software Engineer' },
      { id: 'targetCompany', label: 'Target company (optional)', type: 'text', placeholder: 'e.g. Google' },
      { id: 'jobDescription', label: 'Job description (optional)', type: 'textarea', placeholder: 'Paste JD for ATS alignment' },
    ],
    systemAddendum: `You are an expert resume writer and ATS optimization specialist. Always output:
- Tight, metric-driven bullet points (use numbers wherever plausible: "Reduced latency by 40%")
- No filler phrases ("responsible for", "worked on")
- Active voice
- For the summary section: 3-4 sentences, first person omitted, starts with job title or expertise
- Return ONLY the improved content - no preamble, no explanation`,
    buildUserPrompt: (i) =>
      `Improve the "${i.section}" section of my resume.\n` +
      line('Current content', i.currentContent) +
      line('Target role', i.targetRole) +
      line('Target company', i.targetCompany) +
      line('Job description', i.jobDescription) +
      `\nReturn the improved ${i.section} content only.`,
  },

  // ---- Learning features ----
  {
    id: 'pathGeneration', name: 'AI Path Generation', icon: 'route', color: 'blue-400',
    description: 'Curated learning paths from web resources',
    category: 'learning', status: 'ready',
    tier: 'deep',
    maxOutputTokens: 5000,
    inputs: [
      { id: 'skill', label: 'Skill to master', type: 'text', placeholder: 'e.g. machine learning', required: true },
      { id: 'timeline', label: 'Timeline', type: 'select', placeholder: 'How long do you have', options: ['3 months', '6 months', '1 year', '2 years'] },
      { id: 'level', label: 'Current level', type: 'select', placeholder: 'Your starting point', options: ['Complete beginner', 'Some knowledge', 'Intermediate', 'Advanced'] },
    ],
    buildUserPrompt: (i) => `You are a curriculum designer. Create a structured, resource-rich learning path.
${line('Skill / Goal', i.skill)}${line('Timeline', i.timeline || '6 months')}${line('Current level', i.level || 'Complete beginner')}

Return ONLY a valid JSON object (no markdown, no prose outside the JSON) in this exact shape:
{
  "phases": [
    {
      "title": "Phase name",
      "steps": [
        {
          "title": "Step title",
          "description": "2-3 sentence description of exactly what to do, what concept to learn, and why it matters at this stage",
          "duration": "X weeks",
          "resources": [
            { "title": "Exact resource name (e.g. 'CS50P: Introduction to Programming with Python')", "url": "https://actual-real-url.com", "type": "course|video|book|docs|practice" }
          ],
          "xpReward": 50,
          "milestone": "What you can do/build after completing this step"
        }
      ]
    }
  ]
}

RULES for resources - you MUST follow:
- Use ONLY real, well-known resources with accurate URLs. Examples of correct URLs:
  - Coursera courses: https://www.coursera.org/learn/[course-slug]
  - YouTube channels: https://www.youtube.com/@[channel-handle]
  - freeCodeCamp: https://www.freecodecamp.org/learn
  - The Odin Project: https://www.theodinproject.com
  - MDN Web Docs: https://developer.mozilla.org
  - Official docs: https://docs.python.org, https://react.dev, https://docs.aws.amazon.com
  - edX: https://www.edx.org/learn/[topic]
  - fast.ai: https://course.fast.ai
  - Kaggle: https://www.kaggle.com/learn
- Never invent a URL. If unsure of the exact URL, use the platform homepage (e.g. https://www.coursera.org).
- Include 2–4 resources per step (mix: 1 structured course + 1 YouTube + 1 practice/project resource)
- Create 3–5 phases with 3–5 steps each. Scale scope and depth to the timeline and level.`,
  },
  {
    id: 'aiTutor', name: 'AI Tutor Chatbot', icon: 'message-circle', color: 'green-400',
    description: '24/7 contextual learning assistance',
    category: 'learning', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 3000,
    inputs: [
      { id: 'question', label: 'Your question', type: 'textarea', placeholder: 'Ask anything you want explained', required: true },
      { id: 'subject', label: 'Subject (optional)', type: 'text', placeholder: 'e.g. statistics, JavaScript' },
    ],
    buildUserPrompt: (i) => `You are an expert tutor answering a student's specific question. Be thorough, not vague.
${line('Question', i.question)}${line('Subject', i.subject)}

Answer in markdown:

**Direct answer** - get straight to the point, no filler intro.

**Explanation with example** - show a concrete example (code, diagram description, or real-world scenario). If it's a technical topic, include a runnable code snippet.

**The "why it works" part** - explain the underlying reason, not just the mechanics.

**Common confusion** - what do people usually misunderstand about this?

**Where to go deeper:**
Name 1–2 specific resources to continue learning: actual article titles, documentation pages, or YouTube videos - e.g., "JavaScript.info's closures chapter (javascript.info/closure)" or "Fireship's '100 seconds of X' video on YouTube".`,
  },
  {
    id: 'projectLearning', name: 'Project-Based Learning', icon: 'wrench', color: 'purple-400',
    description: 'Hands-on portfolio building',
    category: 'learning', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 4000,
    inputs: [
      { id: 'skill', label: 'Skill to learn by building', type: 'text', placeholder: 'e.g. REST APIs', required: true },
      { id: 'level', label: 'Level', type: 'select', placeholder: 'Level', options: ['Beginner', 'Intermediate', 'Advanced'] },
    ],
    buildUserPrompt: (i) => `You are a hands-on engineering mentor who teaches by building real things. Produce a project brief specific enough to start coding today.
${line('Skill', i.skill)}${line('Level', i.level || 'Beginner')}

## Project: [Name it - make it sound like a real product, not "Todo App v2"]
**What it does:** one paragraph. Write it like a product description.
**Why this project teaches ${i.skill}:** what specific aspects of the skill are unavoidable to build this.
**Estimated time to v1:** X hours/weeks at ${i.level || 'beginner'} level

## Tech Stack
Name every library, framework, and tool. Include exact package names (e.g., \`express\`, \`prisma\`, \`react-query\`). Note which are optional vs. required.

## Milestone-by-Milestone Build Plan
For each milestone:
### Milestone N: [Name]
**What you're building:** specific feature or component
**Concept you're learning:** the core skill mechanic this milestone teaches
**Step-by-step tasks:**
1. [Concrete task - not "set up routing" but "create \`GET /api/posts\` endpoint that reads from a JSON file and returns \`{ posts: [] }\`"]
2. ...
**Stuck? Read:** [specific doc URL or article - e.g., "Express routing guide: expressjs.com/en/guide/routing.html"]

## Testing Your Work
How to verify each milestone works. Name the tool (curl, Postman, browser DevTools, Jest, etc.).

## Where to Deploy When Done
Exact platform and free tier: e.g., "Deploy backend on Railway (railway.app) - free tier, no credit card. Deploy frontend on Vercel (vercel.com) - free for personal projects."

## Stretch Goals (v2 - after the job is done)
3–5 features that push the skill further.

## Similar Real-World Codebases to Study
Name actual open-source repos on GitHub that do something similar.`,
  },
  {
    id: 'progressTracking', name: 'Progress Tracking', icon: 'trending-up', color: 'orange-400',
    description: 'Visual learning journey analytics',
    category: 'learning', status: 'coming-soon',
    tier: 'fast',
    inputs: [],
    buildUserPrompt: notBuilt,
  },
  {
    id: 'dynamicAdaptation', name: 'Dynamic Adaptation', icon: 'refresh-cw', color: 'cyan-400',
    description: 'Paths that evolve with you',
    category: 'learning', status: 'coming-soon',
    tier: 'fast',
    inputs: [],
    buildUserPrompt: notBuilt,
  },
  {
    id: 'enterpriseAnalytics', name: 'Enterprise Analytics', icon: 'bar-chart-3', color: 'red-400',
    description: 'Team learning insights',
    category: 'learning', status: 'coming-soon',
    tier: 'fast',
    inputs: [],
    buildUserPrompt: notBuilt,
  },

  // ---- Missing learning features referenced in sidebar ----
  {
    id: 'studyPlan', name: 'Study Plans', icon: 'book-open', color: 'blue-500',
    description: 'Build a focused, week-by-week study plan for any exam, topic, or skill',
    category: 'learning', status: 'ready',
    tier: 'deep',
    maxOutputTokens: 5000,
    inputs: [
      { id: 'subject', label: 'What you want to study', type: 'text', placeholder: 'e.g. AWS Solutions Architect exam, IELTS, calculus, system design', required: true },
      { id: 'deadline', label: 'Deadline or timeframe', type: 'text', placeholder: 'e.g. 6 weeks, exam on July 20', required: true },
      { id: 'level', label: 'Current level', type: 'select', placeholder: 'Where you are now', options: ['Complete beginner', 'Some basics', 'Intermediate', 'Need a refresh'] },
      { id: 'hoursPerDay', label: 'Hours per day available', type: 'number', placeholder: 'e.g. 2' },
    ],
    buildUserPrompt: (i) => `You are an expert learning strategist building a personalised study plan.
${line('Subject / goal', i.subject)}${line('Deadline / timeframe', i.deadline)}${line('Current level', i.level)}${line('Hours per day', i.hoursPerDay)}

Build a week-by-week study plan in markdown. Be radically specific:

REQUIREMENTS:
- Name the exact resource for each topic (book chapter, course module, YouTube video/playlist, official docs page)
- Include ACTUAL resource names: e.g. "AWS Certified Solutions Architect Study Guide by Ben Piper (Sybex)", "Stephane Maarek's AWS SAA course on Udemy", "TutorialsDojo practice exams (tutorialsdojo.com)", "freeCodeCamp full exam prep on YouTube"
- Give daily/weekly hour breakdown
- Include active recall techniques (not just "read" - specify flashcards, practice tests, spaced repetition with Anki)
- Mark which topics are highest exam/assessment weight
- Include practice test schedule (when to take them and which ones)

Format each week:
## Week N: [Theme]
**Topics:** list each topic
**Daily breakdown (X hrs/day):**
- Day 1–2: [Topic] - [Specific resource: title, platform, URL or where to get it]
- Day 3–4: [Topic] - [Specific resource]
- Day 5–6: Practice / review - [Specific practice resource]
- Day 7: Rest + light review
**Active recall:** [specific technique for this week's content]
**Milestone check:** what you should be able to do/score by end of week

End with:
## Final Week / Exam Sprint
## Recommended Tools
Name specific apps: Anki (ankiweb.net) for flashcards, Quizlet, Notion for notes, etc.`,
  },
  {
    id: 'conceptExplainer', name: 'Concept Explainer', icon: 'lightbulb', color: 'yellow-500',
    description: 'Get any concept explained clearly with examples, analogies, and where to go deeper',
    category: 'learning', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 3500,
    inputs: [
      { id: 'concept', label: 'Concept to explain', type: 'text', placeholder: 'e.g. database indexing, compound interest, TCP/IP handshake', required: true },
      { id: 'background', label: 'Your background (optional)', type: 'text', placeholder: 'e.g. I know basic Python but no CS theory' },
      { id: 'depth', label: 'Depth', type: 'select', placeholder: 'How deep to go', options: ['ELI5 (very simple)', 'Clear overview', 'Technical depth', 'Expert level'] },
    ],
    buildUserPrompt: (i) => `You are a world-class explainer - think Richard Feynman meets a senior engineer. Make this genuinely click.
${line('Concept', i.concept)}${line('Background', i.background)}${line('Depth requested', i.depth || 'Clear overview')}

## The Core Idea (1 paragraph)
Explain from first principles. WHY does this exist - what problem does it solve? Pitch it at the stated background level.

## The Analogy That Makes It Click
One real-world analogy. Then: where does the analogy break down? (Knowing where an analogy fails is part of understanding the concept.)

## How It Actually Works
Step by step. If there's a process/sequence, walk through every step. If it's a formula or model, build it up from components. Include a concrete minimal example.

## Visual or Diagram (described in text)
Describe a diagram or visual that would help - ASCII if possible, or a clear verbal description.

## The Most Common Misconception
What do people usually get wrong when first learning this? Why?

## How It Connects to Other Concepts
What does understanding this unlock? What does it depend on?

## Quick Self-Test
3 questions to verify understanding. Give answers below a "Reveal" heading.

## Where to Go Deeper
2–3 specific resources ordered by effort:
1. [Quick win - specific article/video that explains this in 10 min: title + URL]
2. [Intermediate - specific course chapter, book chapter, or documentation page]
3. [Deep mastery - specific book or full course with author/platform]`,
  },
  {
    id: 'practiceQuizzes', name: 'Practice Quizzes', icon: 'check-square', color: 'green-500',
    description: 'Generate practice questions and quizzes on any topic to test your knowledge',
    category: 'learning', status: 'ready',
    tier: 'balanced',
    maxOutputTokens: 4000,
    inputs: [
      { id: 'topic', label: 'Topic to quiz on', type: 'text', placeholder: 'e.g. React hooks, SQL joins, system design concepts, STAR interview method', required: true },
      { id: 'level', label: 'Difficulty', type: 'select', placeholder: 'Difficulty level', options: ['Beginner', 'Intermediate', 'Advanced', 'Mixed'] },
      { id: 'questionCount', label: 'Number of questions', type: 'select', placeholder: 'How many questions', options: ['5 questions', '10 questions', '15 questions', '20 questions'] },
      { id: 'format', label: 'Question format', type: 'select', placeholder: 'Format', options: ['Multiple choice', 'Short answer', 'True/False', 'Mixed formats'] },
    ],
    buildUserPrompt: (i) => `You are a rigorous examiner creating a high-quality practice quiz.
${line('Topic', i.topic)}${line('Difficulty', i.level || 'Mixed')}${line('Number of questions', i.questionCount || '10 questions')}${line('Format', i.format || 'Mixed formats')}

Generate the quiz in markdown. Follow this structure exactly:

---
# Practice Quiz: ${i.topic || 'Topic'}
**Difficulty:** ${i.level || 'Mixed'} | **Questions:** ${i.questionCount || '10'}
---

For each question:
**Q[N].** [Question text]
${i.format === 'Multiple choice' || i.format === 'Mixed formats' ? `
A) [Option]
B) [Option]
C) [Option]
D) [Option]` : ''}
*(Write your answer before reading further)*

---
After ALL questions, add a section:

## Answer Key & Explanations

**Q[N]. Correct answer: [X]**
**Explanation:** [2–4 sentences explaining WHY this is correct, and why the wrong options are wrong. Reference the underlying concept, not just "because it is".]
**Common mistake:** [What people often confuse here]
**Go deeper:** [One specific resource to read/watch if they got this wrong - name the article/video/docs page]

QUALITY RULES:
- Questions must test genuine understanding, not trivia or rote recall
- Wrong answer choices (distractors) must be plausible - not obviously wrong
- Advanced questions should require synthesis across concepts
- At least 30% of questions should test application ("given this scenario, what happens?") not just definition`,
  },
];

/** id -> feature lookup map (derived; keeps the documented `featureRegistry` export). */
export const featureRegistry: Record<string, FeatureDef> = Object.fromEntries(
  features.map((f) => [f.id, f]),
);

export function getFeature(id: string): FeatureDef | undefined {
  return featureRegistry[id];
}
