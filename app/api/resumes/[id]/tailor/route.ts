import { auth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { getResume, updateResume } from '@/data/repositories/resumes.repo'
import { generate } from '@/engines/ai/gateway'
import { buildUserContext } from '@/engines/user-context'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { jobDescription, targetRole, targetCompany } = (await req.json()) as {
    jobDescription: string
    targetRole?: string
    targetCompany?: string
  }

  const resume = await getResume(userId, id)
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const userContext = await buildUserContext(userId)
  const sectionsJson = JSON.stringify(resume.sections, null, 2)

  const prompt = `You are an expert resume writer. Tailor this resume specifically for the job description below.

CURRENT RESUME SECTIONS (JSON):
${sectionsJson}

TARGET ROLE: ${targetRole ?? resume.targetRole ?? 'Not specified'}
TARGET COMPANY: ${targetCompany ?? resume.targetCompany ?? 'Not specified'}

JOB DESCRIPTION:
${jobDescription}

USER CONTEXT:
${userContext}

Rewrite the resume sections to:
1. Mirror language and keywords from the job description
2. Quantify all bullet points with metrics where possible
3. Emphasize experience most relevant to this role
4. Rewrite the summary to directly address this job
5. Add missing keywords from JD that the candidate can honestly claim

Return ONLY a valid JSON object with the same ResumeSections structure. No explanation, no markdown, just the JSON.`

  const result = await generate({
    messages: [{ role: 'user', content: prompt }],
    tier: 'balanced',
    maxOutputTokens: 3000,
  })

  if (!result.ok) {
    return NextResponse.json({ error: 'AI generation failed' }, { status: 502 })
  }

  const text = result.value.text

  let tailoredSections
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    tailoredSections = JSON.parse(jsonMatch[0])
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
  }

  await updateResume(userId, id, {
    sections: tailoredSections,
    jobDescription,
    targetRole: targetRole ?? resume.targetRole ?? '',
    targetCompany: targetCompany ?? resume.targetCompany ?? '',
  })

  return NextResponse.json({ sections: tailoredSections })
}
