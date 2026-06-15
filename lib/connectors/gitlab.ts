import type { Connector, ConnectorResult, ExtractedProfile } from './types'

interface GitLabUser {
  id: number
  username: string
  organization: string | null
  location: string | null
  website_url: string | null
  linkedin: string | null
  projects_count: number
}

interface GitLabProject {
  id: number
}

const source = 'GitLab'

const connector: Connector = {
  id: 'gitlab',
  name: 'GitLab',
  description: 'Import your public GitLab profile and project data.',
  website: 'https://gitlab.com',
  category: 'developer',
  inputType: 'username',
  inputLabel: 'GitLab Username',
  inputPlaceholder: 'e.g. gitlab-org',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const searchRes = await fetch(
        `https://gitlab.com/api/v4/users?username=${encodeURIComponent(username)}&per_page=1`,
        { signal: controller.signal }
      )

      if (!searchRes.ok) {
        clearTimeout(timeout)
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: `GitLab API returned ${searchRes.status} searching for "${username}"`,
        }
      }

      const users = (await searchRes.json()) as GitLabUser[]

      if (users.length === 0) {
        clearTimeout(timeout)
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: `No GitLab user found with username "${username}"`,
        }
      }

      const user = users[0]

      const projectsRes = await fetch(
        `https://gitlab.com/api/v4/users/${user.id}/projects?per_page=30&order_by=last_activity_at`,
        { signal: controller.signal }
      )

      clearTimeout(timeout)

      const projects: GitLabProject[] = projectsRes.ok
        ? ((await projectsRes.json()) as GitLabProject[])
        : []

      const extracted: ExtractedProfile = {
        currentCompany: user.organization || undefined,
        location: user.location || undefined,
        portfolioUrl: user.website_url || undefined,
        linkedinUrl: user.linkedin ? `https://linkedin.com/in/${user.linkedin}` : undefined,
        resumeText: `GitLab: ${username} — ${user.projects_count ?? projects.length} projects`,
      }

      const summary = `GitLab: ${user.projects_count ?? projects.length} projects`

      return { success: true, source, extracted, summary }
    } catch (err) {
      clearTimeout(timeout)
      const message = err instanceof Error ? err.message : 'Unknown error'
      return { success: false, source, extracted: {}, summary: '', error: message }
    }
  },
}

export default connector
export { connector }
