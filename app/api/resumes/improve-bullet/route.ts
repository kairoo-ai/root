import { auth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { generate } from '@/engines/ai/gateway'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bullet, role, company, jobDescription } = (await req.json()) as {
    bullet: string
    role: string
    company: string
    jobDescription?: string
  }

  const prompt = `Rewrite this resume bullet point to be more impactful.

CURRENT BULLET: ${bullet}
ROLE: ${role} at ${company}
${jobDescription ? `TARGET JD: ${jobDescription}` : ''}

Rules:
- Start with a strong action verb
- Include a quantified metric if possible (add one if missing, make it realistic)
- Be specific and concrete
- Max 20 words
- No "Responsible for" or passive voice

Return ONLY the rewritten bullet. No quotes, no explanation.`

  const result = await generate({
    messages: [{ role: 'user', content: prompt }],
    tier: 'fast',
    maxOutputTokens: 100,
  })

  if (!result.ok) {
    return NextResponse.json({ error: 'AI generation failed' }, { status: 502 })
  }

  return NextResponse.json({ bullet: result.value.text.trim().replace(/^["']|["']$/g, '') })
}
