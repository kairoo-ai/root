import { generate } from '@/engines/ai/gateway'
import type { Connector, ConnectorResult, ExtractedProfile } from './types'

interface RawExtracted {
  currentRole?: string | null
  currentCompany?: string | null
  yearsExperience?: number | null
  industry?: string | null
  location?: string | null
  skills?: string[]
  certifications?: string[]
  languages?: string[]
  education?: { degree: string; field: string; institution: string; year?: number | null }[]
  linkedinUrl?: string | null
  githubUrl?: string | null
  portfolioUrl?: string | null
  bio?: string | null
}

function countFields(profile: ExtractedProfile): number {
  return Object.entries(profile).filter(([key, value]) => {
    if (key === 'resumeText') return false
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== ''
  }).length
}

async function run(input: string): Promise<ConnectorResult> {
  const systemPrompt =
    'You are extracting structured career profile data from a LinkedIn profile text. Extract all fields you can find. Return ONLY valid JSON matching the schema, no other text.'

  const userPrompt = `Extract career profile data from this LinkedIn profile text:\n\n${input}`

  const extracted: ExtractedProfile = { resumeText: input }

  try {
    const result = await generate({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      tier: 'balanced',
      maxOutputTokens: 2048,
      json: true,
    })

    if (!result.ok) {
      return {
        success: true,
        source: 'linkedin-paste',
        extracted,
        summary: 'LinkedIn profile imported - AI extraction unavailable, raw text stored',
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
        source: 'linkedin-paste',
        extracted,
        summary: 'LinkedIn profile imported - could not parse AI response, raw text stored',
      }
    }

    if (raw.currentRole) extracted.currentRole = raw.currentRole
    if (raw.currentCompany) extracted.currentCompany = raw.currentCompany
    if (typeof raw.yearsExperience === 'number') extracted.yearsExperience = raw.yearsExperience
    if (raw.industry) extracted.industry = raw.industry
    if (raw.location) extracted.location = raw.location
    if (Array.isArray(raw.skills) && raw.skills.length > 0) extracted.skills = raw.skills
    if (Array.isArray(raw.certifications) && raw.certifications.length > 0) extracted.certifications = raw.certifications
    if (Array.isArray(raw.languages) && raw.languages.length > 0) extracted.languages = raw.languages
    if (Array.isArray(raw.education) && raw.education.length > 0) {
      extracted.education = raw.education.map((e) => ({
        degree: e.degree,
        field: e.field,
        institution: e.institution,
        ...(typeof e.year === 'number' ? { year: e.year } : {}),
      }))
    }
    if (raw.linkedinUrl) extracted.linkedinUrl = raw.linkedinUrl
    if (raw.githubUrl) extracted.githubUrl = raw.githubUrl
    if (raw.portfolioUrl) extracted.portfolioUrl = raw.portfolioUrl
    if (raw.bio) extracted.bio = raw.bio

    const fieldCount = countFields(extracted)

    return {
      success: true,
      source: 'linkedin-paste',
      extracted,
      summary: `LinkedIn profile imported - extracted ${fieldCount} fields`,
    }
  } catch (err) {
    return {
      success: true,
      source: 'linkedin-paste',
      extracted,
      summary: 'LinkedIn profile imported - AI extraction failed, raw text stored',
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

export const connector: Connector = {
  id: 'linkedin-paste',
  name: 'LinkedIn Profile',
  description: 'Paste your LinkedIn profile text to extract your career information automatically.',
  website: 'https://linkedin.com',
  category: 'professional',
  inputType: 'paste',
  inputLabel: 'Paste your LinkedIn profile',
  inputPlaceholder:
    'On LinkedIn, click "More" on your profile then "Copy profile to clipboard" and paste here, or manually paste your headline, experience, education, and skills sections',
  isAutoFetch: false,
  run,
}

export default connector
