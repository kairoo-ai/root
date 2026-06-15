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
  // Attempt JSON parse - strip markdown fences first
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
