import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  createSkillAssessment,
  getSkillAssessments,
} from '@/data/repositories/skillAssessments.repo'
import type { SkillEntry, TargetSkillEntry, SkillGap } from '@/data/schema'

async function computeGapsViaAI(
  currentRole: string,
  targetRole: string,
  currentSkills: SkillEntry[],
  baseUrl: string,
): Promise<{ targetSkills: TargetSkillEntry[]; gaps: SkillGap[] }> {
  const prompt = `You are a career intelligence engine. Given:
- Current Role: ${currentRole}
- Target Role: ${targetRole}
- Current Skills (self-rated 0-5): ${JSON.stringify(currentSkills)}

Return ONLY valid JSON (no markdown, no explanation) with this exact shape:
{
  "targetSkills": [
    { "name": string, "requiredLevel": number (0-5), "category": string, "marketDemand": "high"|"medium"|"low" }
  ],
  "gaps": [
    { "skill": string, "category": string, "currentLevel": number, "requiredLevel": number, "delta": number, "priority": "critical"|"important"|"nice", "marketDemand": "high"|"medium"|"low" }
  ]
}
Include 8-12 target skills. Only include gaps where delta > 0. Sort gaps by priority then delta desc.`

  const res = await fetch(`${baseUrl}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ featureId: 'skillGapAnalyzer', inputs: { _raw: prompt } }),
  })

  if (!res.ok) throw new Error('AI call failed')

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

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  return JSON.parse(cleaned) as { targetSkills: TargetSkillEntry[]; gaps: SkillGap[] }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as {
    currentRole: string
    targetRole: string
    currentSkills: SkillEntry[]
  }

  if (!body.currentRole || !body.targetRole || !Array.isArray(body.currentSkills)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const baseUrl = req.nextUrl.origin

  try {
    const { targetSkills, gaps } = await computeGapsViaAI(
      body.currentRole,
      body.targetRole,
      body.currentSkills,
      baseUrl,
    )

    const assessment = await createSkillAssessment({
      userId,
      currentRole: body.currentRole,
      targetRole: body.targetRole,
      currentSkills: body.currentSkills,
      targetSkills,
      gaps,
      learningPlan: [],
    })

    return NextResponse.json(assessment, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create assessment'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const assessments = await getSkillAssessments(userId)
  return NextResponse.json(assessments)
}
