import { getProfile, type UserProfile } from '@/data/repositories/profiles.repo'
import { findUserById } from '@/data/repositories/users.repo'

/**
 * Builds a rich context string about the user that gets prepended to every AI
 * tool's system prompt. This means tools never need to ask "what is your role?"
 * because the answer is always already there.
 */
export async function buildUserContext(userId: string): Promise<string> {
  const [user, profile] = await Promise.all([
    findUserById(userId).catch(() => null),
    getProfile(userId).catch(() => null),
  ])

  if (!profile && !user) return ''

  // If we have a pre-built summary and profile was recently updated, use it
  if (profile?.contextSummary) {
    return profile.contextSummary
  }

  return buildContextString(user, profile)
}

export function buildContextString(
  user: { name?: string | null; email: string } | null,
  profile: UserProfile | null,
): string {
  const lines: string[] = ['## About This User (auto-injected - use this to personalise your response)']

  if (user?.name) lines.push(`- **Name:** ${user.name}`)

  if (profile?.currentRole || profile?.currentCompany) {
    const role = [profile.currentRole, profile.currentCompany ? `at ${profile.currentCompany}` : ''].filter(Boolean).join(' ')
    lines.push(`- **Current role:** ${role}`)
  }

  if (profile?.yearsExperience != null) {
    lines.push(`- **Experience:** ${profile.yearsExperience} year${profile.yearsExperience !== 1 ? 's' : ''}`)
  }

  if (profile?.industry) lines.push(`- **Industry:** ${profile.industry}`)
  if (profile?.location) lines.push(`- **Location:** ${profile.location}`)

  if (profile?.targetRole) {
    const timeline = profile.targetTimeline ? ` within ${profile.targetTimeline}` : ''
    lines.push(`- **Career target:** ${profile.targetRole}${timeline}`)
  }

  if (profile?.careerGoalShort) lines.push(`- **Goal:** ${profile.careerGoalShort}`)
  if (profile?.careerGoalLong) lines.push(`- **Detailed goal:** ${profile.careerGoalLong}`)

  const skills = profile?.skills ?? []
  if (skills.length > 0) lines.push(`- **Skills:** ${skills.join(', ')}`)

  const certs = profile?.certifications ?? []
  if (certs.length > 0) lines.push(`- **Certifications:** ${certs.join(', ')}`)

  const langs = profile?.languages ?? []
  if (langs.length > 0) lines.push(`- **Languages:** ${langs.join(', ')}`)

  const edu = profile?.education ?? []
  if (edu.length > 0) {
    const eduStr = edu.map(e => `${e.degree} in ${e.field}${e.institution ? ` from ${e.institution}` : ''}${e.year ? ` (${e.year})` : ''}`).join('; ')
    lines.push(`- **Education:** ${eduStr}`)
  }

  if (profile?.workStyle) lines.push(`- **Work style preference:** ${profile.workStyle}`)
  if (profile?.learningStyle) lines.push(`- **Learning style:** ${profile.learningStyle}`)

  if (profile?.resumeText) {
    lines.push(`\n### Resume / CV\n\`\`\`\n${profile.resumeText.slice(0, 3000)}${profile.resumeText.length > 3000 ? '\n... (truncated)' : ''}\n\`\`\``)
  }

  lines.push('\n*Use the above to tailor your response without asking the user to repeat this information.*')

  return lines.join('\n')
}

/**
 * Refreshes the cached context summary in the DB.
 * Call this after profile updates so future calls are fast.
 */
export async function refreshContextSummary(userId: string): Promise<void> {
  const { upsertProfile } = await import('@/data/repositories/profiles.repo')
  const { findUserById } = await import('@/data/repositories/users.repo')
  const { getProfile } = await import('@/data/repositories/profiles.repo')

  const [user, profile] = await Promise.all([
    findUserById(userId).catch(() => null),
    getProfile(userId).catch(() => null),
  ])

  const summary = buildContextString(user, profile)
  await upsertProfile(userId, { contextSummary: summary })
}
