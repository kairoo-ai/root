# Roadmaps Visual Fleet — Implementation Plan
**Date:** 2026-06-15  
**Branch:** `latest`  
**Effort:** ~11 tasks, 16 files to create/modify

---

## Current State

- `app/(app)/roadmaps/page.tsx` — list via `RoadmapsList` (Timeline + CardSpotlight)
- `app/(app)/roadmaps/[id]/page.tsx` — server page, renders `RoadmapDetail`
- `app/(app)/roadmaps/[id]/_components/RoadmapDetail.tsx` — simple step list, reads `planJson.steps[]`
- `app/(app)/roadmaps/new/page.tsx` — already exists (check content before touching)
- `data/schema/index.ts` → `roadmaps` table: `id, userId, title, goal, planJson (jsonb), status`
- `engines/ai/features/registry.ts` → `pathGeneration` feature exists, returns markdown
- `app/api/ai/route.ts` → POST, auth + credits + compose() + stream, records activity log

---

## Task 1 — TypeScript types

**Files:**
- `types/roadmap.ts` — CREATE

```ts
// types/roadmap.ts

export type StepStatus = 'todo' | 'in_progress' | 'done'

export type ResourceType = 'article' | 'video' | 'course' | 'book'

export interface RoadmapResource {
  title: string
  url: string
  type: ResourceType
}

export interface RoadmapStep {
  id: string
  title: string
  description: string
  duration: string       // e.g. "2 weeks"
  status: StepStatus
  resources: RoadmapResource[]
  xpReward: number
  completedAt?: string   // ISO date string
}

export interface RoadmapPhase {
  id: string
  title: string          // e.g. "Foundation", "Core Skills"
  color: string          // Tailwind token e.g. "teal", "blue", "purple", "amber"
  steps: RoadmapStep[]
}

export interface RoadmapPlanJson {
  phases: RoadmapPhase[]
  targetRole: string
  totalWeeks: number
  generatedAt: string    // ISO date string
}

/** Type guard — distinguishes new phase-based planJson from legacy steps[] shape */
export function isPhasedPlan(plan: unknown): plan is RoadmapPlanJson {
  return (
    typeof plan === 'object' &&
    plan !== null &&
    'phases' in plan &&
    Array.isArray((plan as RoadmapPlanJson).phases)
  )
}

/** Flatten all steps from all phases into a single array */
export function flattenSteps(plan: RoadmapPlanJson): RoadmapStep[] {
  return plan.phases.flatMap((p) => p.steps)
}

/** Compute % steps done (0–100) */
export function computeProgress(plan: RoadmapPlanJson): number {
  const all = flattenSteps(plan)
  if (all.length === 0) return 0
  return Math.round((all.filter((s) => s.status === 'done').length / all.length) * 100)
}
```

**Commit message:** `feat(types): RoadmapPlanJson phased-step type definitions`

---

## Task 2 — Roadmap repository

**Files:**
- `data/repositories/roadmaps.repo.ts` — CREATE

```ts
// data/repositories/roadmaps.repo.ts
import { db } from '@/data/client'
import { roadmaps } from '@/data/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import type { RoadmapPlanJson } from '@/types/roadmap'

export type Roadmap = typeof roadmaps.$inferSelect

export async function getRoadmapsForUser(userId: string): Promise<Roadmap[]> {
  return db.select().from(roadmaps).where(eq(roadmaps.userId, userId))
}

export async function getRoadmapById(id: string, userId: string): Promise<Roadmap | null> {
  const [row] = await db
    .select()
    .from(roadmaps)
    .where(and(eq(roadmaps.id, id), eq(roadmaps.userId, userId)))
    .limit(1)
  return row ?? null
}

export async function createRoadmap(
  userId: string,
  title: string,
  goal: string,
  planJson: RoadmapPlanJson,
): Promise<Roadmap> {
  const [row] = await db
    .insert(roadmaps)
    .values({ id: nanoid(), userId, title, goal, planJson, status: 'active' })
    .returning()
  return row
}

export async function updateRoadmapPlan(
  id: string,
  userId: string,
  planJson: RoadmapPlanJson,
): Promise<Roadmap | null> {
  const [row] = await db
    .update(roadmaps)
    .set({ planJson, updatedAt: new Date() })
    .where(and(eq(roadmaps.id, id), eq(roadmaps.userId, userId)))
    .returning()
  return row ?? null
}

export async function patchStepStatus(
  id: string,
  userId: string,
  phaseId: string,
  stepId: string,
  status: 'todo' | 'in_progress' | 'done',
): Promise<Roadmap | null> {
  const roadmap = await getRoadmapById(id, userId)
  if (!roadmap) return null

  const plan = roadmap.planJson as RoadmapPlanJson | null
  if (!plan?.phases) return null

  const updatedPhases = plan.phases.map((phase) => {
    if (phase.id !== phaseId) return phase
    return {
      ...phase,
      steps: phase.steps.map((step) => {
        if (step.id !== stepId) return step
        return {
          ...step,
          status,
          completedAt: status === 'done' ? new Date().toISOString() : undefined,
        }
      }),
    }
  })

  const updatedPlan: RoadmapPlanJson = { ...plan, phases: updatedPhases }
  return updateRoadmapPlan(id, userId, updatedPlan)
}
```

**Commit message:** `feat(data): roadmaps repository with patchStepStatus`

---

## Task 3 — PATCH /api/roadmaps/[id]/step

**Files:**
- `app/api/roadmaps/[id]/step/route.ts` — CREATE

```ts
// app/api/roadmaps/[id]/step/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { patchStepStatus } from '@/data/repositories/roadmaps.repo'

interface PatchBody {
  stepId: string
  phaseId: string
  status: 'todo' | 'in_progress' | 'done'
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const body: PatchBody | null = await req.json().catch(() => null)
  if (!body?.stepId || !body?.phaseId || !body?.status) {
    return NextResponse.json({ error: 'Missing stepId, phaseId, or status' }, { status: 400 })
  }

  const VALID_STATUSES = ['todo', 'in_progress', 'done'] as const
  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
  }

  const updated = await patchStepStatus(id, userId, body.phaseId, body.stepId, body.status)
  if (!updated) return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
```

**Commit message:** `feat(api): PATCH /api/roadmaps/[id]/step — update step status`

---

## Task 4 — AI roadmap parser

**Files:**
- `engines/ai/parsers/roadmap-parser.ts` — CREATE

The `pathGeneration` feature returns markdown. This parser converts that markdown (or a structured JSON string if we update the prompt) into `RoadmapPlanJson`. We update the `pathGeneration` `buildUserPrompt` to request JSON output, then parse it here.

```ts
// engines/ai/parsers/roadmap-parser.ts
import { nanoid } from 'nanoid'
import type { RoadmapPlanJson, RoadmapPhase, RoadmapStep } from '@/types/roadmap'

const PHASE_COLORS = ['teal', 'blue', 'purple', 'amber', 'rose', 'orange']

/**
 * Parse AI-returned JSON string into RoadmapPlanJson.
 * Falls back to a single "General" phase wrapping legacy markdown steps.
 */
export function parseRoadmapOutput(
  rawText: string,
  targetRole: string,
  totalWeeks: number,
): RoadmapPlanJson {
  // Attempt JSON parse — strip markdown fences first
  const stripped = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  try {
    const parsed: unknown = JSON.parse(stripped)
    if (isRawPhasedJson(parsed)) {
      return normalizeParsed(parsed, targetRole, totalWeeks)
    }
  } catch {
    // fall through to markdown fallback
  }

  // Markdown fallback: split on ## headings as phases
  return markdownFallback(rawText, targetRole, totalWeeks)
}

// ---- Internal helpers ----

interface RawStep {
  title: string
  description: string
  duration?: string
  resources?: Array<{ title: string; url: string; type?: string }>
  xpReward?: number
}

interface RawPhase {
  title: string
  steps: RawStep[]
}

interface RawPlan {
  phases: RawPhase[]
}

function isRawPhasedJson(x: unknown): x is RawPlan {
  return typeof x === 'object' && x !== null && 'phases' in x && Array.isArray((x as RawPlan).phases)
}

function normalizeParsed(raw: RawPlan, targetRole: string, totalWeeks: number): RoadmapPlanJson {
  const phases: RoadmapPhase[] = raw.phases.map((p, pi) => ({
    id: nanoid(),
    title: p.title,
    color: PHASE_COLORS[pi % PHASE_COLORS.length],
    steps: (p.steps ?? []).map(normalizeStep),
  }))
  return { phases, targetRole, totalWeeks, generatedAt: new Date().toISOString() }
}

function normalizeStep(s: RawStep): RoadmapStep {
  return {
    id: nanoid(),
    title: s.title ?? 'Untitled step',
    description: s.description ?? '',
    duration: s.duration ?? '1 week',
    status: 'todo',
    resources: (s.resources ?? []).map((r) => ({
      title: r.title ?? '',
      url: r.url ?? '',
      type: (['article', 'video', 'course', 'book'].includes(r.type ?? '') ? r.type : 'article') as RoadmapStep['resources'][number]['type'],
    })),
    xpReward: s.xpReward ?? 50,
  }
}

function markdownFallback(md: string, targetRole: string, totalWeeks: number): RoadmapPlanJson {
  // Split on H2 headings
  const sections = md.split(/^## /m).filter(Boolean)
  const phases: RoadmapPhase[] = sections.map((section, pi) => {
    const lines = section.trim().split('\n')
    const phaseTitle = lines[0].trim()
    // Treat each bullet/numbered line as a step
    const stepLines = lines.slice(1).filter((l) => /^[-*\d]/.test(l.trim()))
    const steps: RoadmapStep[] = stepLines.map((line) => ({
      id: nanoid(),
      title: line.replace(/^[-*\d.)\s]+/, '').trim(),
      description: '',
      duration: '1 week',
      status: 'todo',
      resources: [],
      xpReward: 50,
    }))
    return { id: nanoid(), title: phaseTitle, color: PHASE_COLORS[pi % PHASE_COLORS.length], steps }
  })

  // If no H2 sections found, wrap everything in a single phase
  if (phases.length === 0 || phases.every((p) => p.steps.length === 0)) {
    const steps = md
      .split('\n')
      .filter((l) => /^[-*\d]/.test(l.trim()))
      .map((line) => ({
        id: nanoid(),
        title: line.replace(/^[-*\d.)\s]+/, '').trim(),
        description: '',
        duration: '1 week',
        status: 'todo' as const,
        resources: [],
        xpReward: 50,
      }))
    return {
      phases: [{ id: nanoid(), title: 'Your Path', color: 'teal', steps }],
      targetRole,
      totalWeeks,
      generatedAt: new Date().toISOString(),
    }
  }

  return { phases, targetRole, totalWeeks, generatedAt: new Date().toISOString() }
}
```

Also update `pathGeneration.buildUserPrompt` in `engines/ai/features/registry.ts` to request structured JSON:

**Modify** `engines/ai/features/registry.ts` — find the `pathGeneration` entry (line ~497) and replace `buildUserPrompt`:

```ts
buildUserPrompt: (i) => `You are a curriculum designer creating a structured career learning path.
${line('Skill / Goal', i.skill)}${line('Timeline', i.timeline || '6 months')}${line('Focus areas', i.focusAreas || '')}

Return ONLY a valid JSON object (no markdown, no prose outside the JSON) in this exact shape:
{
  "phases": [
    {
      "title": "Phase name",
      "steps": [
        {
          "title": "Step title",
          "description": "2-3 sentence description of what to do and why",
          "duration": "X weeks",
          "resources": [
            { "title": "Resource name", "url": "https://...", "type": "course|article|video|book" }
          ],
          "xpReward": 50
        }
      ]
    }
  ]
}

Create 3–5 phases with 3–6 steps each. Scale scope to the timeline. Name well-known resources with real URLs.`,
```

**Commit message:** `feat(ai): roadmap-parser + structured JSON prompt for pathGeneration`

---

## Task 5 — Wizard: new roadmap page

**Files:**
- `app/(app)/roadmaps/new/page.tsx` — MODIFY (replace content, check existing first)
- `app/(app)/roadmaps/new/_components/RoadmapWizard.tsx` — CREATE

### `app/(app)/roadmaps/new/page.tsx`

```tsx
// app/(app)/roadmaps/new/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/data/repositories/profiles.repo'
import { RoadmapWizard } from './_components/RoadmapWizard'

export default async function NewRoadmapPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  const profile = await getProfile(userId)
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <RoadmapWizard
        defaultGoal={profile?.careerGoalShort ?? ''}
        defaultTargetRole={profile?.targetRole ?? ''}
      />
    </div>
  )
}
```

### `app/(app)/roadmaps/new/_components/RoadmapWizard.tsx`

```tsx
// app/(app)/roadmaps/new/_components/RoadmapWizard.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react'
import { StatefulButton } from '@/components/aceternity/StatefulButton'
import { cn } from '@/lib/utils'
import { parseRoadmapOutput } from '@/engines/ai/parsers/roadmap-parser'

const TIMELINE_OPTIONS = [
  { weeks: 4,  label: '4 weeks',  sub: 'Sprint' },
  { weeks: 8,  label: '8 weeks',  sub: 'Short' },
  { weeks: 12, label: '12 weeks', sub: 'Standard' },
  { weeks: 24, label: '24 weeks', sub: 'Deep dive' },
]

const FOCUS_OPTIONS = [
  { id: 'technical',     label: 'Technical skills' },
  { id: 'soft',          label: 'Soft skills' },
  { id: 'portfolio',     label: 'Portfolio projects' },
  { id: 'networking',    label: 'Networking' },
  { id: 'certifications',label: 'Certifications' },
]

const STEPS = ['Goal', 'Timeline', 'Focus areas', 'Review']

interface Props {
  defaultGoal: string
  defaultTargetRole: string
}

export function RoadmapWizard({ defaultGoal, defaultTargetRole }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(defaultGoal)
  const [targetRole, setTargetRole] = useState(defaultTargetRole)
  const [weeks, setWeeks] = useState(12)
  const [focus, setFocus] = useState<string[]>(['technical'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleFocus = (id: string) =>
    setFocus((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])

  const canNext =
    (step === 0 && goal.trim().length > 3) ||
    (step === 1 && weeks > 0) ||
    (step === 2 && focus.length > 0) ||
    step === 3

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureId: 'pathGeneration',
          inputs: {
            skill: goal,
            timeline: `${weeks} weeks`,
            focusAreas: focus.join(', '),
          },
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to generate roadmap' }))
        throw new Error(err.error)
      }

      // Read full streamed response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let raw = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          raw += decoder.decode(value, { stream: true })
        }
      }

      const plan = parseRoadmapOutput(raw, targetRole || goal, weeks)
      const title = targetRole ? `Path to ${targetRole}` : goal.slice(0, 60)

      const saveRes = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, goal, planJson: plan }),
      })
      if (!saveRes.ok) throw new Error('Failed to save roadmap')
      const { id } = await saveRes.json()
      router.push(`/roadmaps/${id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors',
              i < step ? 'bg-teal-500 text-black' :
              i === step ? 'border-2 border-teal-500 text-teal-400' :
              'border border-border text-muted-foreground/40'
            )}>
              {i < step ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span className={cn('text-xs font-medium', i === step ? 'text-foreground' : 'text-muted-foreground/50')}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.18 }}
        >
          {/* Step 0: Goal */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground">What's your career goal?</h2>
              <p className="text-sm text-muted-foreground">Be specific — this drives the entire roadmap.</p>
              <input
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                placeholder="e.g. Become a senior machine learning engineer"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                autoFocus
              />
              <input
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                placeholder="Target role (optional, e.g. ML Engineer)"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
          )}

          {/* Step 1: Timeline */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground">How long do you have?</h2>
              <p className="text-sm text-muted-foreground">This sets the pace and depth of your roadmap.</p>
              <div className="grid grid-cols-2 gap-3">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt.weeks}
                    onClick={() => setWeeks(opt.weeks)}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-all cursor-pointer',
                      weeks === opt.weeks
                        ? 'border-teal-500/50 bg-teal-500/10'
                        : 'border-border bg-card hover:border-border/80'
                    )}
                  >
                    <div className="text-base font-bold text-foreground">{opt.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Focus areas */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground">What do you want to focus on?</h2>
              <p className="text-sm text-muted-foreground">Pick everything that matters to you.</p>
              <div className="space-y-2">
                {FOCUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleFocus(opt.id)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-xl border p-3.5 text-sm font-medium transition-all cursor-pointer',
                      focus.includes(opt.id)
                        ? 'border-teal-500/50 bg-teal-500/10 text-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-border/80'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0',
                      focus.includes(opt.id) ? 'bg-teal-500 border-teal-500' : 'border-border'
                    )}>
                      {focus.includes(opt.id) && <Check className="w-2.5 h-2.5 text-black" />}
                    </div>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground">Ready to generate</h2>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal</span>
                  <span className="text-foreground font-medium text-right max-w-[60%]">{goal}</span>
                </div>
                {targetRole && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target role</span>
                    <span className="text-foreground font-medium">{targetRole}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timeline</span>
                  <span className="text-foreground font-medium">{weeks} weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Focus</span>
                  <span className="text-foreground font-medium text-right max-w-[60%]">{focus.join(', ')}</span>
                </div>
              </div>
              {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg p-3">{error}</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : undefined}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext}
            className="flex items-center gap-2 text-xs font-semibold bg-teal-500 text-black px-4 py-2.5 rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Continue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold bg-teal-500 text-black px-5 py-2.5 rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                Generating…
              </span>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" /> Generate roadmap</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
```

**Commit message:** `feat(roadmaps): 4-step generation wizard with goal/timeline/focus/review`

---

## Task 6 — POST /api/roadmaps route (save after generation)

**Files:**
- `app/api/roadmaps/route.ts` — CREATE

```ts
// app/api/roadmaps/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createRoadmap } from '@/data/repositories/roadmaps.repo'
import type { RoadmapPlanJson } from '@/types/roadmap'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const { title, goal, planJson } = body ?? {}

  if (!title || !goal || !planJson) {
    return NextResponse.json({ error: 'Missing title, goal, or planJson' }, { status: 400 })
  }

  const roadmap = await createRoadmap(userId, title, goal, planJson as RoadmapPlanJson)
  return NextResponse.json({ id: roadmap.id })
}
```

**Commit message:** `feat(api): POST /api/roadmaps — create roadmap after wizard generation`

---

## Task 7 — Progress ring component

**Files:**
- `app/(app)/roadmaps/[id]/_components/RoadmapProgress.tsx` — CREATE

```tsx
// app/(app)/roadmaps/[id]/_components/RoadmapProgress.tsx
'use client'
import { motion } from 'framer-motion'

interface Props {
  percent: number  // 0–100
  doneCount: number
  totalCount: number
  totalWeeks: number
  weeksRemaining: number
}

export function RoadmapProgress({ percent, doneCount, totalCount, totalWeeks, weeksRemaining }: Props) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="flex items-center gap-6 rounded-2xl border border-border bg-card p-5">
      {/* SVG ring */}
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
          <motion.circle
            cx="44" cy="44" r={radius}
            fill="none"
            stroke="rgb(20 184 166)"  /* teal-500 */
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-extrabold text-foreground leading-none">{percent}%</span>
          <span className="text-[9px] text-muted-foreground mt-0.5">done</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm flex-1">
        <div>
          <div className="text-xs text-muted-foreground">Steps done</div>
          <div className="font-bold text-foreground">{doneCount} / {totalCount}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Weeks left</div>
          <div className="font-bold text-foreground">{weeksRemaining} / {totalWeeks}</div>
        </div>
      </div>
    </div>
  )
}
```

**Commit message:** `feat(roadmaps): RoadmapProgress ring component`

---

## Task 8 — Phase accordion view

**Files:**
- `app/(app)/roadmaps/[id]/_components/RoadmapPhases.tsx` — CREATE

```tsx
// app/(app)/roadmaps/[id]/_components/RoadmapPhases.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapPhase, RoadmapStep } from '@/types/roadmap'

const COLOR_MAP: Record<string, string> = {
  teal:   'text-teal-400 bg-teal-500/10 border-teal-500/20',
  blue:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  amber:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  rose:   'text-rose-400 bg-rose-500/10 border-rose-500/20',
  orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
}

function StepStatusIcon({ status }: { status: RoadmapStep['status'] }) {
  if (status === 'done') return <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
  if (status === 'in_progress') return <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
  return <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
}

interface Props {
  phases: RoadmapPhase[]
  onStepClick: (phaseId: string, step: RoadmapStep) => void
  onStatusChange: (phaseId: string, stepId: string, status: RoadmapStep['status']) => void
}

export function RoadmapPhases({ phases, onStepClick, onStatusChange }: Props) {
  const [open, setOpen] = useState<string>(phases[0]?.id ?? '')

  return (
    <div className="space-y-2">
      {phases.map((phase) => {
        const done = phase.steps.filter((s) => s.status === 'done').length
        const pct = phase.steps.length ? Math.round((done / phase.steps.length) * 100) : 0
        const colorCls = COLOR_MAP[phase.color] ?? COLOR_MAP.teal
        const isOpen = open === phase.id

        return (
          <div key={phase.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? '' : phase.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
            >
              <div className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', colorCls)}>
                {phase.title}
              </div>
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden mx-2">
                <motion.div
                  className="h-full bg-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{done}/{phase.steps.length}</span>
              <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground/50 transition-transform shrink-0', isOpen && 'rotate-180')} />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                    {phase.steps.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted/30 transition-colors group cursor-pointer"
                        onClick={() => onStepClick(phase.id, step)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const next: RoadmapStep['status'] =
                              step.status === 'todo' ? 'in_progress' :
                              step.status === 'in_progress' ? 'done' : 'todo'
                            onStatusChange(phase.id, step.id, next)
                          }}
                          className="mt-0.5 cursor-pointer"
                        >
                          <StepStatusIcon status={step.status} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={cn('text-sm font-medium text-foreground', step.status === 'done' && 'line-through text-muted-foreground')}>
                            {step.title}
                          </div>
                          <div className="text-[10px] text-teal-400 mt-0.5 font-medium">{step.duration}</div>
                        </div>
                        <span className="text-[10px] text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          +{step.xpReward} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
```

**Commit message:** `feat(roadmaps): RoadmapPhases accordion with per-phase progress bar`

---

## Task 9 — Kanban view

**Files:**
- `app/(app)/roadmaps/[id]/_components/RoadmapKanban.tsx` — CREATE

> Note: uses `@hello-pangea/dnd` for drag-and-drop. Check `package.json` first — if not installed, implement simple click-to-move buttons instead (no new packages rule). The implementation below uses click-to-move to avoid adding packages.

```tsx
// app/(app)/roadmaps/[id]/_components/RoadmapKanban.tsx
'use client'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapPhase, RoadmapStep } from '@/types/roadmap'

type StepStatus = RoadmapStep['status']

const COLUMNS: { id: StepStatus; label: string; color: string }[] = [
  { id: 'todo',        label: 'To Do',       color: 'text-muted-foreground border-border' },
  { id: 'in_progress', label: 'In Progress',  color: 'text-blue-400 border-blue-500/20' },
  { id: 'done',        label: 'Done',         color: 'text-teal-400 border-teal-500/20' },
]

interface FlatStep extends RoadmapStep { phaseId: string; phaseTitle: string }

interface Props {
  phases: RoadmapPhase[]
  onStatusChange: (phaseId: string, stepId: string, status: StepStatus) => void
  onStepClick: (phaseId: string, step: RoadmapStep) => void
}

export function RoadmapKanban({ phases, onStatusChange, onStepClick }: Props) {
  const flat: FlatStep[] = phases.flatMap((p) =>
    p.steps.map((s) => ({ ...s, phaseId: p.id, phaseTitle: p.title }))
  )

  const byStatus = (status: StepStatus) => flat.filter((s) => s.status === status)

  const move = (step: FlatStep, direction: -1 | 1) => {
    const order: StepStatus[] = ['todo', 'in_progress', 'done']
    const idx = order.indexOf(step.status)
    const next = order[idx + direction]
    if (next) onStatusChange(step.phaseId, step.id, next)
  }

  return (
    <div className="grid grid-cols-3 gap-3 min-h-[400px]">
      {COLUMNS.map((col) => (
        <div key={col.id} className="flex flex-col gap-2">
          <div className={cn('text-[11px] font-bold px-2 py-1 rounded-lg border', col.color, 'bg-transparent')}>
            {col.label} <span className="text-muted-foreground/50 font-normal ml-1">{byStatus(col.id).length}</span>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {byStatus(col.id).map((step) => (
              <motion.div
                key={step.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-border bg-card p-3 cursor-pointer group hover:border-border/60 transition-colors"
                onClick={() => onStepClick(step.phaseId, step)}
              >
                <div className="text-[10px] text-muted-foreground/50 mb-1">{step.phaseTitle}</div>
                <div className="text-sm font-medium text-foreground leading-snug">{step.title}</div>
                <div className="text-[10px] text-teal-400 mt-1">{step.duration}</div>
                {/* Move buttons */}
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {step.status !== 'todo' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); move(step, -1) }}
                      className="w-6 h-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                  {step.status !== 'done' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); move(step, 1) }}
                      className="w-6 h-6 rounded-lg border border-border flex items-center justify-center hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                  <span className="text-[9px] text-muted-foreground/40 ml-auto">+{step.xpReward} XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Commit message:** `feat(roadmaps): RoadmapKanban view with click-to-move step status`

---

## Task 10 — Timeline view

**Files:**
- `app/(app)/roadmaps/[id]/_components/RoadmapTimeline.tsx` — CREATE

```tsx
// app/(app)/roadmaps/[id]/_components/RoadmapTimeline.tsx
'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapPhase, RoadmapStep } from '@/types/roadmap'

const PHASE_BORDER: Record<string, string> = {
  teal:   'border-teal-500/30 bg-teal-500/5',
  blue:   'border-blue-500/30 bg-blue-500/5',
  purple: 'border-purple-500/30 bg-purple-500/5',
  amber:  'border-amber-500/30 bg-amber-500/5',
  rose:   'border-rose-500/30 bg-rose-500/5',
  orange: 'border-orange-500/30 bg-orange-500/5',
}

const PHASE_DOT: Record<string, string> = {
  teal:   'bg-teal-500',
  blue:   'bg-blue-500',
  purple: 'bg-purple-500',
  amber:  'bg-amber-500',
  rose:   'bg-rose-500',
  orange: 'bg-orange-500',
}

function StatusDot({ status }: { status: RoadmapStep['status'] }) {
  if (status === 'done') return <CheckCircle2 className="w-5 h-5 text-teal-400" />
  if (status === 'in_progress') return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <div className="absolute w-5 h-5 rounded-full bg-blue-500/20 animate-ping" />
      <div className="w-3 h-3 rounded-full bg-blue-500" />
    </div>
  )
  return <Circle className="w-5 h-5 text-muted-foreground/30" />
}

interface Props {
  phases: RoadmapPhase[]
  onStepClick: (phaseId: string, step: RoadmapStep) => void
}

export function RoadmapTimeline({ phases, onStepClick }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={scrollRef} className="overflow-x-auto pb-4 -mx-6 px-6">
      <div className="flex gap-6 min-w-max">
        {phases.map((phase, pi) => (
          <div key={phase.id} className="flex flex-col gap-1">
            {/* Phase header */}
            <div className={cn('text-[10px] font-bold px-3 py-1 rounded-lg border mb-2 self-start', PHASE_BORDER[phase.color] ?? PHASE_BORDER.teal)}>
              {phase.title}
            </div>
            {/* Steps column */}
            <div className="flex flex-col gap-0">
              {phase.steps.map((step, si) => (
                <div key={step.id} className="flex gap-3 items-start">
                  {/* Connector line + dot */}
                  <div className="flex flex-col items-center pt-1">
                    <StatusDot status={step.status} />
                    {si < phase.steps.length - 1 && (
                      <div className={cn(
                        'w-px flex-1 mt-1 mb-0',
                        step.status === 'done' ? 'bg-teal-500/40' : 'bg-border'
                      )} style={{ minHeight: 28 }} />
                    )}
                  </div>
                  {/* Step card */}
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => onStepClick(phase.id, step)}
                    className={cn(
                      'w-52 rounded-xl border p-3 text-left transition-colors cursor-pointer mb-1',
                      step.status === 'done'
                        ? 'border-teal-500/20 bg-teal-500/5'
                        : step.status === 'in_progress'
                        ? 'border-blue-500/30 bg-blue-500/5'
                        : 'border-border bg-card hover:border-border/70'
                    )}
                  >
                    <div className={cn(
                      'text-xs font-semibold leading-snug',
                      step.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'
                    )}>
                      {step.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground/50 mt-1">{step.duration}</div>
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Commit message:** `feat(roadmaps): RoadmapTimeline horizontal scroll view with phase columns`

---

## Task 11 — Step drawer + AI Coach panel + RoadmapDetail rebuild

**Files:**
- `app/(app)/roadmaps/[id]/_components/StepDrawer.tsx` — CREATE
- `app/(app)/roadmaps/[id]/_components/AICoachPanel.tsx` — CREATE
- `app/(app)/roadmaps/[id]/_components/RoadmapDetail.tsx` — REPLACE ENTIRELY

### `StepDrawer.tsx`

```tsx
// app/(app)/roadmaps/[id]/_components/StepDrawer.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, BookOpen, Video, FileText, Book, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapStep } from '@/types/roadmap'

const RESOURCE_ICONS: Record<RoadmapStep['resources'][number]['type'], React.ElementType> = {
  article: FileText,
  video:   Video,
  course:  BookOpen,
  book:    Book,
}

interface Props {
  step: RoadmapStep | null
  phaseId: string | null
  phaseTitle: string
  onClose: () => void
  onStatusChange: (phaseId: string, stepId: string, status: RoadmapStep['status']) => void
  onAskCoach: (step: RoadmapStep) => void
}

const STATUS_CYCLE: RoadmapStep['status'][] = ['todo', 'in_progress', 'done']

export function StepDrawer({ step, phaseId, phaseTitle, onClose, onStatusChange, onAskCoach }: Props) {
  return (
    <AnimatePresence>
      {step && phaseId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">{phaseTitle}</div>
                <h3 className="text-sm font-bold text-foreground leading-snug">{step.title}</h3>
                <div className="text-[10px] text-teal-400 mt-1 font-medium">{step.duration} · +{step.xpReward} XP</div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer mt-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Status toggle */}
              <div className="flex gap-2">
                {STATUS_CYCLE.map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(phaseId, step.id, s)}
                    className={cn(
                      'flex-1 text-[10px] font-semibold py-1.5 rounded-lg border transition-colors cursor-pointer',
                      step.status === s
                        ? s === 'done' ? 'bg-teal-500/20 border-teal-500/40 text-teal-400'
                          : s === 'in_progress' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                          : 'bg-muted/50 border-border text-foreground'
                        : 'bg-transparent border-border/50 text-muted-foreground/50 hover:border-border'
                    )}
                  >
                    {s === 'todo' ? 'To Do' : s === 'in_progress' ? 'In Progress' : 'Done'}
                  </button>
                ))}
              </div>

              {/* Description */}
              {step.description && (
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">About this step</div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{step.description}</p>
                </div>
              )}

              {/* Resources */}
              {step.resources.length > 0 && (
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Resources</div>
                  <div className="space-y-2">
                    {step.resources.map((r, i) => {
                      const Icon = RESOURCE_ICONS[r.type]
                      return (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-border/70 transition-colors group"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                          <span className="text-xs text-foreground/80 flex-1 line-clamp-1">{r.title}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Ask AI Coach */}
            <div className="p-4 border-t border-border">
              <button
                onClick={() => onAskCoach(step)}
                className="w-full text-xs font-semibold bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl py-2.5 hover:bg-teal-500/20 transition-colors cursor-pointer"
              >
                Ask AI Coach about this step
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### `AICoachPanel.tsx`

```tsx
// app/(app)/roadmaps/[id]/_components/AICoachPanel.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles } from 'lucide-react'
import type { RoadmapStep } from '@/types/roadmap'

interface Message { role: 'user' | 'assistant'; content: string }

interface Props {
  open: boolean
  initialStep?: RoadmapStep | null
  roadmapTitle: string
  onClose: () => void
}

export function AICoachPanel({ open, initialStep, roadmapTitle, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Pre-fill with step context when panel opens with a step
  useEffect(() => {
    if (open && initialStep) {
      setMessages([{
        role: 'assistant',
        content: `I see you're working on **${initialStep.title}** from your "${roadmapTitle}" roadmap. What would you like to know or get help with?`,
      }])
    }
  }, [open, initialStep?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)

    const stepContext = initialStep
      ? `Step: ${initialStep.title}\nDescription: ${initialStep.description}`
      : ''

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureId: 'aiTutor',
          inputs: {
            question: stepContext ? `${stepContext}\n\nUser question: ${text}` : text,
            subject: roadmapTitle,
          },
        }),
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let reply = ''
      setMessages([...next, { role: 'assistant', content: '' }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          reply += decoder.decode(value, { stream: true })
          setMessages([...next, { role: 'assistant', content: reply }])
        }
      }
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Sorry, something went wrong. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-bold text-foreground">AI Coach</span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-teal-500 text-black font-medium'
                    : 'bg-card border border-border text-foreground/80'
                }`}>
                  {m.content || (loading && i === messages.length - 1 ? (
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  ) : null)}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask about this step…"
                className="flex-1 rounded-xl border border-border bg-card px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-teal-500/50 transition-colors"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center hover:bg-teal-400 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### `RoadmapDetail.tsx` — full rebuild

```tsx
// app/(app)/roadmaps/[id]/_components/RoadmapDetail.tsx
'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Map, Calendar, Layers, Kanban, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isPhasedPlan, computeProgress, flattenSteps } from '@/types/roadmap'
import type { RoadmapPlanJson, RoadmapPhase, RoadmapStep } from '@/types/roadmap'
import { RoadmapProgress } from './RoadmapProgress'
import { RoadmapTimeline } from './RoadmapTimeline'
import { RoadmapKanban } from './RoadmapKanban'
import { RoadmapPhases } from './RoadmapPhases'
import { StepDrawer } from './StepDrawer'
import { AICoachPanel } from './AICoachPanel'

interface Roadmap {
  id: string
  title: string
  goal: string
  status: string
  planJson: unknown
  createdAt: Date
}

type ViewMode = 'timeline' | 'kanban' | 'phases'

const VIEW_TABS: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'kanban',   label: 'Kanban',   icon: Kanban },
  { id: 'phases',   label: 'Phases',   icon: Layers },
]

export function RoadmapDetail({ roadmap }: { roadmap: Roadmap }) {
  const router = useRouter()
  const [view, setView] = useState<ViewMode>('timeline')
  const [plan, setPlan] = useState<RoadmapPlanJson | null>(
    isPhasedPlan(roadmap.planJson) ? roadmap.planJson : null
  )
  const [activeStep, setActiveStep] = useState<RoadmapStep | null>(null)
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null)
  const [coachOpen, setCoachOpen] = useState(false)
  const [coachStep, setCoachStep] = useState<RoadmapStep | null>(null)

  const openStep = useCallback((phaseId: string, step: RoadmapStep) => {
    setActivePhaseId(phaseId)
    setActiveStep(step)
  }, [])

  const closeStep = useCallback(() => {
    setActiveStep(null)
    setActivePhaseId(null)
  }, [])

  const handleStatusChange = useCallback(async (phaseId: string, stepId: string, status: RoadmapStep['status']) => {
    // Optimistic update
    setPlan((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        phases: prev.phases.map((p) =>
          p.id !== phaseId ? p : {
            ...p,
            steps: p.steps.map((s) =>
              s.id !== stepId ? s : {
                ...s,
                status,
                completedAt: status === 'done' ? new Date().toISOString() : undefined,
              }
            ),
          }
        ),
      }
    })
    // Sync to server
    await fetch(`/api/roadmaps/${roadmap.id}/step`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phaseId, stepId, status }),
    })
  }, [roadmap.id])

  const openCoach = useCallback((step: RoadmapStep) => {
    setCoachStep(step)
    setCoachOpen(true)
    closeStep()
  }, [closeStep])

  const activePhaseTitle = plan?.phases.find((p) => p.id === activePhaseId)?.title ?? ''
  const progress = plan ? computeProgress(plan) : 0
  const allSteps = plan ? flattenSteps(plan) : []
  const weeksElapsed = plan
    ? Math.round((Date.now() - new Date(plan.generatedAt).getTime()) / (1000 * 60 * 60 * 24 * 7))
    : 0
  const weeksRemaining = Math.max(0, (plan?.totalWeeks ?? 0) - weeksElapsed)

  // Legacy planJson support
  const legacyPlan = !plan ? (roadmap.planJson as { steps?: { title: string; description: string; duration: string }[] } | null) : null

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to roadmaps
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
          <Map className="w-5 h-5 text-teal-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">{roadmap.title}</h1>
            {plan?.targetRole && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400">
                {plan.targetRole}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{roadmap.goal}</p>
          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground/50">
            <Calendar className="w-3 h-3" />
            Created {new Date(roadmap.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Progress ring (phased plans only) */}
      {plan && (
        <div className="mb-5">
          <RoadmapProgress
            percent={progress}
            doneCount={allSteps.filter((s) => s.status === 'done').length}
            totalCount={allSteps.length}
            totalWeeks={plan.totalWeeks}
            weeksRemaining={weeksRemaining}
          />
        </div>
      )}

      {/* View tabs (phased plans only) */}
      {plan && (
        <div className="flex gap-1 mb-5 bg-card border border-border rounded-xl p-1 w-fit">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
                  view === tab.id
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            )
          })}
        </div>
      )}

      {/* View content */}
      {plan ? (
        <motion.div key={view} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
          {view === 'timeline' && <RoadmapTimeline phases={plan.phases} onStepClick={openStep} />}
          {view === 'kanban'   && <RoadmapKanban   phases={plan.phases} onStatusChange={handleStatusChange} onStepClick={openStep} />}
          {view === 'phases'   && <RoadmapPhases   phases={plan.phases} onStepClick={openStep} onStatusChange={handleStatusChange} />}
        </motion.div>
      ) : legacyPlan?.steps ? (
        // Legacy fallback
        <div className="space-y-3">
          {legacyPlan.steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="flex gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xs font-bold text-teal-400 shrink-0">{i + 1}</div>
                {i < (legacyPlan.steps?.length ?? 0) - 1 && <div className="flex-1 w-px bg-border" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="font-semibold text-sm text-foreground">{step.title}</div>
                <div className="text-[11.5px] text-muted-foreground mt-1 leading-relaxed">{step.description}</div>
                {step.duration && <div className="text-[10px] text-teal-400 mt-2 font-medium">{step.duration}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Roadmap content will appear here once generated by the AI tool.
        </div>
      )}

      {/* Step drawer */}
      <StepDrawer
        step={activeStep}
        phaseId={activePhaseId}
        phaseTitle={activePhaseTitle}
        onClose={closeStep}
        onStatusChange={handleStatusChange}
        onAskCoach={openCoach}
      />

      {/* AI Coach panel */}
      <AICoachPanel
        open={coachOpen}
        initialStep={coachStep}
        roadmapTitle={roadmap.title}
        onClose={() => setCoachOpen(false)}
      />
    </div>
  )
}
```

**Commit message:** `feat(roadmaps): full visual fleet — StepDrawer, AICoachPanel, RoadmapDetail rebuild`

---

## Task 12 — Update roadmap list page to use repository

The current `app/(app)/roadmaps/page.tsx` likely fetches roadmaps. Confirm it uses the repository — if not, update to import from `data/repositories/roadmaps.repo`.

**Check:** `app/(app)/roadmaps/page.tsx` — if it does its own DB call without using the repo, replace with `getRoadmapsForUser(userId)`.

---

## File Creation Order (dependency-safe)

1. `types/roadmap.ts`
2. `data/repositories/roadmaps.repo.ts`
3. `app/api/roadmaps/[id]/step/route.ts`
4. `app/api/roadmaps/route.ts`
5. `engines/ai/parsers/roadmap-parser.ts` + registry update
6. `app/(app)/roadmaps/new/_components/RoadmapWizard.tsx`
7. `app/(app)/roadmaps/new/page.tsx`
8. `app/(app)/roadmaps/[id]/_components/RoadmapProgress.tsx`
9. `app/(app)/roadmaps/[id]/_components/RoadmapPhases.tsx`
10. `app/(app)/roadmaps/[id]/_components/RoadmapKanban.tsx`
11. `app/(app)/roadmaps/[id]/_components/RoadmapTimeline.tsx`
12. `app/(app)/roadmaps/[id]/_components/StepDrawer.tsx`
13. `app/(app)/roadmaps/[id]/_components/AICoachPanel.tsx`
14. `app/(app)/roadmaps/[id]/_components/RoadmapDetail.tsx` ← depends on all above

---

## Key Design Decisions

- **No new npm packages** — drag in Kanban uses click-to-move arrows; Framer Motion `layout` handles reorder animation.
- **Optimistic updates** — `handleStatusChange` updates local state immediately, then fires PATCH in background.
- **Legacy compatibility** — `RoadmapDetail` detects old `planJson.steps[]` shape via `isPhasedPlan()` guard and renders the original list as fallback. No data migration needed.
- **Stream parsing** — wizard reads the full stream before calling `parseRoadmapOutput`. The parser tries JSON first, falls back to markdown H2-section splitting.
- **`aiTutor` for coach** — reuses the existing `aiTutor` feature (chat Q&A) with step context injected into the `question` field. No new feature registration needed.
- **`profiles.repo` import** — wizard page imports `getProfile` from `@/data/repositories/profiles.repo` (file exists per memory).
