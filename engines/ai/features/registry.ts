// AI feature registry — the single source of truth for what the AI engine can do.
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
  /** Model tier to use when calling the gateway. All current features use 'fast'. */
  tier: ModelTier;
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
    tier: 'fast',
    inputs: [
      { id: 'goal', label: 'Career goal', type: 'text', placeholder: 'e.g. Become a Senior Data Scientist', required: true },
      { id: 'background', label: 'Current background (optional)', type: 'textarea', placeholder: 'Your current role, skills, and experience' },
    ],
    buildUserPrompt: (i) => `You are an experienced career coach. Build a concrete 12-month roadmap.
${line('Goal', i.goal)}${line('Current background', i.background)}
Return markdown with:
1. **Phase 1 — Foundation (Months 1-3):** core skills, resources, first milestone
2. **Phase 2 — Specialization (Months 4-8):** advanced skills, 2-3 projects, milestones
3. **Phase 3 — Application (Months 9-12):** portfolio, networking, job search steps
For every phase give specific, actionable steps with named resources and a measurable milestone. Tailor difficulty to the stated background when given.`,
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
    tier: 'fast',
    inputs: [
      { id: 'role', label: 'Role', type: 'text', placeholder: 'Role you are interviewing for', required: true },
      { id: 'question', label: 'Interview question', type: 'text', placeholder: 'e.g. Tell me about a time you led a project' },
    ],
    buildUserPrompt: (i) => `You are an expert interview coach.
${line('Role', i.role)}${line('Question', i.question || 'Tell me about yourself')}
Return markdown with:
1. **Answer structure** (use STAR where the question is behavioral)
2. **A strong sample answer** tailored to the role
3. **Key points to emphasize**
4. **Common pitfalls to avoid**
5. **Likely follow-up questions**`,
  },
  {
    id: 'salaryCoach', name: 'Salary Coach', icon: 'trending-up', color: 'yellow-400',
    description: 'Analyze market value and negotiate better compensation',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'role', label: 'Job title', type: 'text', placeholder: 'e.g. Backend Engineer', required: true },
      { id: 'experience', label: 'Years of experience', type: 'number', placeholder: 'e.g. 5' },
      { id: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Bangalore, India' },
    ],
    buildUserPrompt: (i) => `You are a compensation and negotiation advisor.
${line('Role', i.role)}${line('Experience (years)', i.experience)}${line('Location', i.location)}
Return markdown with:
1. **Market rate** — a reasoned range for this role/experience/location (state assumptions; you are not quoting live data)
2. **Negotiation strategy**
3. **Key talking points** to justify a higher offer
4. **Beyond base pay** — benefits and perks to negotiate
5. **When to walk away**`,
  },
  {
    id: 'careerSimulator', name: 'Career Simulator', icon: 'compass', color: 'lime-400',
    description: 'Simulate career pivots and identify skill gaps',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'currentRole', label: 'Current role', type: 'text', placeholder: 'e.g. QA Engineer', required: true },
      { id: 'targetRole', label: 'Target role', type: 'text', placeholder: 'e.g. Product Manager', required: true },
    ],
    buildUserPrompt: (i) => `You are a career-transition strategist. Simulate a pivot.
${line('From', i.currentRole)}${line('To', i.targetRole)}
Return markdown with:
1. **Transferable strengths** from the current role
2. **Skill gaps** to close, ranked by importance
3. **A realistic transition timeline** with phases
4. **First 3 concrete actions** to start this week
5. **Risks** and how to de-risk the move`,
  },
  {
    id: 'projectGenerator', name: 'Project Generator', icon: 'code', color: 'green-400',
    description: 'Get portfolio project ideas based on your skills',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'skills', label: 'Your skills / stack', type: 'text', placeholder: 'e.g. React, Python, SQL', required: true },
      { id: 'level', label: 'Level', type: 'select', placeholder: 'Experience level', options: ['Beginner', 'Intermediate', 'Advanced'] },
    ],
    buildUserPrompt: (i) => `You are a senior engineer mentoring someone's portfolio.
${line('Skills/stack', i.skills)}${line('Level', i.level)}
Suggest 3 portfolio projects. For each, return markdown with: **title**, a one-line pitch, why it impresses employers, the core features to build, and the specific skills it demonstrates. Scale ambition to the stated level.`,
  },
  {
    id: 'trendsAnalyzer', name: 'Trends Analyzer', icon: 'briefcase', color: 'emerald-400',
    description: 'Stay ahead with industry trend analysis',
    category: 'career', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'industry', label: 'Industry or field', type: 'text', placeholder: 'e.g. fintech, frontend development', required: true },
    ],
    buildUserPrompt: (i) => `You are an industry analyst.
${line('Industry/field', i.industry)}
Return markdown with: **5 current trends shaping this field**, why each matters, the **skills rising in demand** because of them, and **2-3 concrete moves** a professional should make now to stay ahead. Note that your knowledge has a training cutoff and may miss the very latest developments.`,
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
Return markdown with three sections — **First 30 days (learn)**, **Days 31-60 (contribute)**, **Days 61-90 (own)** — each with goals, key relationships to build, and a measurable success signal.`,
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
    tier: 'fast',
    inputs: [
      { id: 'topic', label: 'What do you want to learn', type: 'text', placeholder: 'e.g. how does OAuth work', required: true },
      { id: 'level', label: 'Your level', type: 'select', placeholder: 'Level', options: ['Complete beginner', 'Some knowledge', 'Advanced'] },
    ],
    buildUserPrompt: (i) => `You are a patient expert tutor.
${line('Topic', i.topic)}${line('Learner level', i.level)}
Explain it in markdown with: a **clear core explanation** pitched to the level, a **real-world analogy or example**, **common misconceptions**, a **quick self-check question**, and **what to learn next**.`,
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

  // ---- Learning features ----
  {
    id: 'pathGeneration', name: 'AI Path Generation', icon: 'route', color: 'blue-400',
    description: 'Curated learning paths from web resources',
    category: 'learning', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'skill', label: 'Skill to master', type: 'text', placeholder: 'e.g. machine learning', required: true },
      { id: 'timeline', label: 'Timeline', type: 'select', placeholder: 'How long do you have', options: ['3 months', '6 months', '1 year', '2 years'] },
    ],
    buildUserPrompt: (i) => `You are a curriculum designer.
${line('Skill', i.skill)}${line('Timeline', i.timeline || '6 months')}
Return a learning path in markdown with: a **week-by-week (or month-by-month) curriculum** scaled to the timeline, **recommended resource types** (courses, books, docs — name well-known ones where you can), a **hands-on project per phase**, and **checkpoints to measure progress**.`,
  },
  {
    id: 'aiTutor', name: 'AI Tutor Chatbot', icon: 'message-circle', color: 'green-400',
    description: '24/7 contextual learning assistance',
    category: 'learning', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'question', label: 'Your question', type: 'textarea', placeholder: 'Ask anything you want explained', required: true },
      { id: 'subject', label: 'Subject (optional)', type: 'text', placeholder: 'e.g. statistics, JavaScript' },
    ],
    buildUserPrompt: (i) => `You are a friendly, knowledgeable tutor answering a single question (this is one-shot Q&A, not an ongoing chat).
${line('Question', i.question)}${line('Subject', i.subject)}
Answer clearly in markdown: directly address the question, give an example, and suggest a good follow-up question the learner could ask next.`,
  },
  {
    id: 'projectLearning', name: 'Project-Based Learning', icon: 'wrench', color: 'purple-400',
    description: 'Hands-on portfolio building',
    category: 'learning', status: 'ready',
    tier: 'fast',
    inputs: [
      { id: 'skill', label: 'Skill to learn by building', type: 'text', placeholder: 'e.g. REST APIs', required: true },
      { id: 'level', label: 'Level', type: 'select', placeholder: 'Level', options: ['Beginner', 'Intermediate', 'Advanced'] },
    ],
    buildUserPrompt: (i) => `You are a hands-on coding/skills mentor who teaches by building.
${line('Skill', i.skill)}${line('Level', i.level)}
Design one project that teaches this skill. Return markdown with: the **project description**, a **milestone-by-milestone build plan** where each milestone teaches a specific concept, **what you'll learn at each step**, and **stretch goals**. Scale scope to the level.`,
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
];

/** id -> feature lookup map (derived; keeps the documented `featureRegistry` export). */
export const featureRegistry: Record<string, FeatureDef> = Object.fromEntries(
  features.map((f) => [f.id, f]),
);

export function getFeature(id: string): FeatureDef | undefined {
  return featureRegistry[id];
}
