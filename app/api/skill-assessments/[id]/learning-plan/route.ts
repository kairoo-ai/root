import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getSkillAssessmentById,
  updateSkillAssessmentLearningPlan,
} from '@/data/repositories/skillAssessments.repo'
import type { LearningPlanItem } from '@/data/schema'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const assessment = await getSkillAssessmentById(id, userId)
  if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const topGaps = assessment.gaps
    .filter(g => g.priority === 'critical' || g.priority === 'important')
    .slice(0, 6)

  const prompt = `You are a learning plan architect. Create a concrete 4-8 week learning plan for these skill gaps:
${JSON.stringify(topGaps, null, 2)}

Context: transitioning from ${assessment.currentRole} to ${assessment.targetRole}.

Return ONLY valid JSON (no markdown, no explanation) as an array:
[
  {
    "skill": string,
    "weeks": number (1-4),
    "resources": [
      { "title": string, "url": string, "type": "course"|"book"|"article"|"video"|"practice" }
    ]
  }
]
Include 2-4 real, specific resources per skill. Use real URLs (Coursera, YouTube, docs, etc.).`

  const aiRes = await fetch(`${req.nextUrl.origin}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ featureId: 'learningPlanGenerator', inputs: { _raw: prompt } }),
  })

  if (!aiRes.ok) return NextResponse.json({ error: 'AI call failed' }, { status: 500 })

  const reader = aiRes.body?.getReader()
  const decoder = new TextDecoder()
  let raw = ''
  if (reader) {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      raw += decoder.decode(value, { stream: true })
    }
  }

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const learningPlan = JSON.parse(cleaned) as LearningPlanItem[]

  const updated = await updateSkillAssessmentLearningPlan(id, userId, learningPlan)
  return NextResponse.json(updated)
}
