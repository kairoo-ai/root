import type { ExtractedProfile } from './types'
import type { UserProfileUpdate } from '@/data/repositories/profiles.repo'

/**
 * Merges extracted connector data into existing profile fields.
 * Existing non-empty values are preserved - imports only fill gaps or append to arrays.
 */
export function mergeIntoProfile(
  existing: UserProfileUpdate,
  extracted: ExtractedProfile,
): UserProfileUpdate {
  const merged: UserProfileUpdate = { ...existing }

  if (!merged.currentRole && extracted.currentRole) merged.currentRole = extracted.currentRole
  if (!merged.currentCompany && extracted.currentCompany) merged.currentCompany = extracted.currentCompany
  if (!merged.yearsExperience && extracted.yearsExperience != null) merged.yearsExperience = extracted.yearsExperience
  if (!merged.industry && extracted.industry) merged.industry = extracted.industry
  if (!merged.location && extracted.location) merged.location = extracted.location
  if (!merged.linkedinUrl && extracted.linkedinUrl) merged.linkedinUrl = extracted.linkedinUrl
  if (!merged.githubUrl && extracted.githubUrl) merged.githubUrl = extracted.githubUrl
  if (!merged.portfolioUrl && extracted.portfolioUrl) merged.portfolioUrl = extracted.portfolioUrl

  // Merge arrays - deduplicate
  if (extracted.skills?.length) {
    const existing_skills = merged.skills ?? []
    merged.skills = [...new Set([...existing_skills, ...extracted.skills])]
  }
  if (extracted.certifications?.length) {
    const existing_certs = merged.certifications ?? []
    merged.certifications = [...new Set([...existing_certs, ...extracted.certifications])]
  }
  if (extracted.languages?.length) {
    const existing_langs = merged.languages ?? []
    merged.languages = [...new Set([...existing_langs, ...extracted.languages])]
  }
  if (extracted.education?.length) {
    const existing_edu = merged.education ?? []
    merged.education = [...existing_edu, ...extracted.education]
  }

  // Append bio/resume as supplementary context
  if (extracted.bio) {
    merged.resumeText = [merged.resumeText, `[Bio from import]\n${extracted.bio}`]
      .filter(Boolean).join('\n\n')
  }
  if (extracted.resumeText) {
    merged.resumeText = [merged.resumeText, extracted.resumeText]
      .filter(Boolean).join('\n\n')
  }

  return merged
}
