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

async function run(input: string): Promise<ConnectorResult> {
  const systemPrompt =
    'You are extracting structured career profile data from LinkedIn data export CSV files. These files contain: Profile info, work positions, skills, and education. Extract all fields. Return ONLY valid JSON.'

  const userPrompt = `Extract career profile from these LinkedIn export CSV files:\n\n${input}`

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
        source: 'linkedin-zip',
        extracted,
        summary: 'LinkedIn data export imported - AI extraction unavailable, raw text stored',
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
        source: 'linkedin-zip',
        extracted,
        summary: 'LinkedIn data export imported - could not parse AI response, raw text stored',
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

    return {
      success: true,
      source: 'linkedin-zip',
      extracted,
      summary: 'LinkedIn data export imported',
    }
  } catch (err) {
    return {
      success: true,
      source: 'linkedin-zip',
      extracted,
      summary: 'LinkedIn data export imported - AI extraction failed, raw text stored',
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

export const connector: Connector = {
  id: 'linkedin-zip',
  name: 'LinkedIn Data Export',
  description: 'Upload your LinkedIn data export ZIP file to import your full profile and work history.',
  website: 'https://linkedin.com',
  category: 'professional',
  inputType: 'zip',
  inputLabel: 'LinkedIn data export (ZIP)',
  inputPlaceholder:
    'Download your data from LinkedIn Settings then Data Privacy then Get a copy of your data, then upload the ZIP file here',
  isAutoFetch: false,
  run,
}

export default connector
