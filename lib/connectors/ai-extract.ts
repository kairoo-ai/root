import type { ExtractedProfile } from './types'
import { generate as gatewayGenerate } from '@/engines/ai/gateway'

const EXTRACT_SYSTEM = `You are extracting structured career profile data from text a user has provided.
Extract every field you can find. Return ONLY valid JSON — no markdown, no explanation, just the JSON object.
Schema:
{
  "currentRole": "string or null",
  "currentCompany": "string or null",
  "yearsExperience": "number or null",
  "industry": "string or null",
  "location": "string or null",
  "skills": ["array of strings"],
  "certifications": ["array of strings"],
  "languages": ["array of strings"],
  "education": [{ "degree": "string", "field": "string", "institution": "string", "year": "number or null" }],
  "linkedinUrl": "string or null",
  "githubUrl": "string or null",
  "portfolioUrl": "string or null",
  "bio": "string or null"
}`

export async function aiExtractProfile(
  sourceLabel: string,
  text: string,
): Promise<{ extracted: ExtractedProfile; error?: string }> {
  const userPrompt = `Extract career profile data from this ${sourceLabel}:\n\n${text.slice(0, 12000)}`

  const result = await gatewayGenerate({
    messages: [
      { role: 'system', content: EXTRACT_SYSTEM },
      { role: 'user', content: userPrompt },
    ],
    tier: 'fast',
    maxOutputTokens: 1024,
  })

  if (!result.ok) {
    return { extracted: { resumeText: text }, error: 'AI extraction failed' }
  }

  try {
    const raw = result.value.text.trim()
    // Strip any markdown code fences if present
    const json = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const parsed = JSON.parse(json) as ExtractedProfile
    return { extracted: { ...parsed, resumeText: text } }
  } catch {
    return { extracted: { resumeText: text }, error: 'Could not parse AI response' }
  }
}
