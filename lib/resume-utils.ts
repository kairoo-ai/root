import type {
  ResumeSections,
  ContactSection,
  EducationEntry,
  SkillCategory,
} from '@/types/resume'
import type { UserProfile } from '@/data/repositories/profiles.repo'
import { nanoid } from 'nanoid'

export function buildEmptySections(): ResumeSections {
  return {
    contact: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    summary: { text: '' },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  }
}

export function buildSectionsFromProfile(profile: UserProfile): ResumeSections {
  const contact: ContactSection = {
    name: '',
    email: '',
    phone: '',
    location: profile.location ?? '',
    linkedin: profile.linkedinUrl ?? '',
    github: profile.githubUrl ?? '',
    portfolio: profile.portfolioUrl ?? '',
  }

  const education: EducationEntry[] = (profile.education ?? []).map((e) => ({
    id: nanoid(),
    institution: e.institution,
    degree: e.degree,
    field: e.field,
    startDate: '',
    endDate: e.year ? String(e.year) : '',
  }))

  const skills: SkillCategory[] =
    profile.skills && profile.skills.length > 0
      ? [{ category: 'Skills', items: profile.skills }]
      : []

  // If they pasted raw resume text, put it in summary as a starting point
  const summary = {
    text: profile.resumeText ? profile.resumeText.slice(0, 600) : '',
  }

  return {
    contact,
    summary,
    experience: [],
    education,
    skills,
    projects: [],
    certifications: [],
  }
}

// Tokenize a string into lowercase words/phrases
function tokenize(text: string): Set<string> {
  const words = text.toLowerCase().match(/\b[a-z][a-z0-9.+#-]{1,}\b/g) ?? []
  return new Set(words)
}

export interface AtsScoreResult {
  total: number
  dimensions: {
    keywordMatch: number
    impactMetrics: number
    clarity: number
    completeness: number
    formatting: number
  }
  suggestions: string[]
}

export function computeAtsScore(
  sections: ResumeSections,
  jobDescription: string
): AtsScoreResult {
  const ACTION_VERBS = new Set([
    'led', 'built', 'improved', 'increased', 'decreased', 'reduced', 'created',
    'designed', 'developed', 'launched', 'managed', 'owned', 'drove', 'delivered',
    'implemented', 'architected', 'scaled', 'optimized', 'automated', 'deployed',
    'mentored', 'collaborated', 'executed', 'established', 'transformed',
  ])

  // Flatten all bullets
  const allBullets = sections.experience?.flatMap((e) => e.bullets) ?? []

  // keywordMatch: count strong action verbs in bullets, *2, cap 20
  const verbCount = allBullets
    .flatMap((b) => b.toLowerCase().match(/\b[a-z]+\b/g) ?? [])
    .filter((w) => ACTION_VERBS.has(w)).length
  const keywordMatch = Math.min(verbCount * 2, 20)

  // impactMetrics: count numbers/percentages in bullets, *3, cap 20
  const numberCount = allBullets.filter((b) => /\d+/.test(b)).length
  const impactMetrics = Math.min(numberCount * 3, 20)

  // clarity: 20 if summary 50-200 chars, 10 if exists but wrong length, 5 if missing
  const summaryText = sections.summary?.text ?? ''
  const summaryLen = summaryText.trim().length
  let clarity: number
  if (summaryLen >= 50 && summaryLen <= 200) {
    clarity = 20
  } else if (summaryLen > 0) {
    clarity = 10
  } else {
    clarity = 5
  }

  // completeness: work=6.67, education=6.67, skills=6.67, summary=6.67, max 26.68 -> we use 4 * 6.67 = 26.68 -> scale to 20
  const hasWork = (sections.experience?.length ?? 0) > 0
  const hasEdu = (sections.education?.length ?? 0) > 0
  const hasSkills = (sections.skills?.length ?? 0) > 0
  const hasSummary = summaryLen > 0
  const sectionScore = [hasWork, hasEdu, hasSkills, hasSummary].filter(Boolean).length
  const completeness = Math.round((sectionScore / 4) * 20)

  // formatting: 20 if 3+ work exp have 2+ bullets each, else proportional
  const expWith2Bullets = (sections.experience ?? []).filter((e) => e.bullets.length >= 2).length
  let formatting: number
  if (expWith2Bullets >= 3) {
    formatting = 20
  } else {
    formatting = Math.round((expWith2Bullets / 3) * 20)
  }

  const total = keywordMatch + impactMetrics + clarity + completeness + formatting

  // Suggestions based on lowest dimensions
  const scored: Array<{ key: string; score: number; suggestion: string }> = [
    {
      key: 'keywordMatch',
      score: keywordMatch,
      suggestion: 'Start bullet points with strong action verbs like "Led", "Built", or "Increased".',
    },
    {
      key: 'impactMetrics',
      score: impactMetrics,
      suggestion: 'Add quantifiable results to your bullets (e.g., "increased sales by 30%").',
    },
    {
      key: 'clarity',
      score: clarity,
      suggestion: 'Write a concise professional summary between 50 and 200 characters.',
    },
    {
      key: 'completeness',
      score: completeness,
      suggestion: 'Fill in all key sections: work experience, education, skills, and summary.',
    },
    {
      key: 'formatting',
      score: formatting,
      suggestion: 'Add at least 2 bullet points to each of your 3+ work experience entries.',
    },
  ]

  const suggestions = scored
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((s) => s.suggestion)

  return {
    total: Math.min(total, 100),
    dimensions: { keywordMatch, impactMetrics, clarity, completeness, formatting },
    suggestions,
  }
}

// Legacy wrapper - keeps old call-sites working
export function computeAtsScoreLegacy(
  sections: ResumeSections,
  jobDescription: string
): { score: number; found: string[]; missing: string[] } {
  const jdTokens = tokenize(jobDescription)

  const resumeText = [
    sections.summary.text,
    ...sections.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...sections.skills.flatMap((s) => s.items),
    ...sections.projects.flatMap((p) => [
      ...p.bullets,
      ...p.tech,
      p.description,
    ]),
  ].join(' ')
  const resumeTokens = tokenize(resumeText)

  const stopWords = new Set([
    'and', 'the', 'for', 'with', 'that', 'this', 'you', 'are', 'have',
    'will', 'from', 'our', 'your', 'they', 'but', 'not',
  ])
  const keywords = [...jdTokens].filter(
    (t) => t.length >= 3 && !stopWords.has(t)
  )

  const found = keywords.filter((k) => resumeTokens.has(k))
  const missing = keywords.filter((k) => !resumeTokens.has(k)).slice(0, 20)

  const score =
    keywords.length > 0
      ? Math.round((found.length / keywords.length) * 100)
      : 0

  return { score: Math.min(score, 100), found: found.slice(0, 30), missing }
}
