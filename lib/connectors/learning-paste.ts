import { generate } from '@/engines/ai/gateway'
import type { Connector, ConnectorResult, ExtractedProfile } from './types'

interface RawExtracted {
  certifications?: string[]
  skills?: string[]
}

async function run(input: string): Promise<ConnectorResult> {
  const systemPrompt =
    'You are extracting certifications and completed courses from a list the user has pasted. Extract course names as certifications, extract any mentioned skills. Return ONLY valid JSON with fields: certifications (array of strings), skills (array of strings).'

  const userPrompt = `Extract certifications and skills from:\n\n${input}`

  const extracted: ExtractedProfile = { resumeText: input }

  try {
    const result = await generate({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      tier: 'fast',
      maxOutputTokens: 1024,
      json: true,
    })

    if (!result.ok) {
      return {
        success: true,
        source: 'learning-paste',
        extracted,
        summary: 'Certificates imported — AI extraction unavailable, raw text stored',
        error: result.error.message,
      }
    }

    let raw: RawExtracted = {}
    try {
      const text = result.value.text.trim()
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      raw = jsonMatch ? (JSON.parse(jsonMatch[0]) as RawExtracted) : {}
    } catch {
      return {
        success: true,
        source: 'learning-paste',
        extracted,
        summary: 'Certificates imported — could not parse AI response, raw text stored',
      }
    }

    if (Array.isArray(raw.certifications) && raw.certifications.length > 0) {
      extracted.certifications = raw.certifications
    }
    if (Array.isArray(raw.skills) && raw.skills.length > 0) {
      extracted.skills = raw.skills
    }

    const certCount = extracted.certifications?.length ?? 0

    return {
      success: true,
      source: 'learning-paste',
      extracted,
      summary: `Certificates imported — ${certCount} certification${certCount === 1 ? '' : 's'} extracted`,
    }
  } catch (err) {
    return {
      success: true,
      source: 'learning-paste',
      extracted,
      summary: 'Certificates imported — AI extraction failed, raw text stored',
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

export const connector: Connector = {
  id: 'learning-paste',
  name: 'Certificates & Courses',
  description: 'Paste a list of your certificates and completed courses to add them to your profile.',
  website: '',
  category: 'learning',
  inputType: 'paste',
  inputLabel: 'Paste your certificates and courses',
  inputPlaceholder:
    'Paste a list of your Coursera, Udemy, edX, LinkedIn Learning, or any other certificates and completed courses...',
  isAutoFetch: false,
  run,
}

export default connector
