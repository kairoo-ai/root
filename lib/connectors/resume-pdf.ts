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
    'You are extracting structured career profile data from a resume. Extract all fields you can find including work history, education, skills, certifications. Return ONLY valid JSON.'

  const userPrompt = `Extract career profile from this resume:\n\n${input}`

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
        source: 'resume-pdf',
        extracted,
        summary: 'Resume imported — AI extraction unavailable, raw text stored',
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
        source: 'resume-pdf',
        extracted,
        summary: 'Resume imported — could not parse AI response, raw text stored',
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
      source: 'resume-pdf',
      extracted,
      summary: 'Resume imported and parsed',
    }
  } catch (err) {
    return {
      success: true,
      source: 'resume-pdf',
      extracted,
      summary: 'Resume imported — AI extraction failed, raw text stored',
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

export const connector: Connector = {
  id: 'resume-pdf',
  name: 'Resume (PDF)',
  description: 'Upload your resume as a PDF to automatically extract your career profile.',
  website: '',
  category: 'resume',
  inputType: 'pdf',
  inputLabel: 'Upload your resume (PDF)',
  inputPlaceholder:
    'Upload a PDF of your resume — we will extract all career information automatically',
  isAutoFetch: false,
  run,
}

export default connector
