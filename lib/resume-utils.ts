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

export function computeAtsScore(
  sections: ResumeSections,
  jobDescription: string
): { score: number; found: string[]; missing: string[] } {
  const jdTokens = tokenize(jobDescription)

  // Flatten all resume text
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

  // Filter JD tokens to "meaningful" keywords (length >= 3, not stop words)
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
