import type { Connector, ConnectorResult, ExtractedProfile } from './types'

interface GitHubUser {
  login: string
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  html_url: string
  public_repos: number
  followers: number
}

interface GitHubRepo {
  language: string | null
  fork: boolean
}

const source = 'GitHub'

const connector: Connector = {
  id: 'github',
  name: 'GitHub',
  description: 'Import your public GitHub profile, repositories, and top languages.',
  website: 'https://github.com',
  category: 'developer',
  inputType: 'username',
  inputLabel: 'GitHub Username',
  inputPlaceholder: 'e.g. torvalds',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
          signal: controller.signal,
          headers: { Accept: 'application/vnd.github+json' },
        }),
        fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=50&sort=updated`,
          {
            signal: controller.signal,
            headers: { Accept: 'application/vnd.github+json' },
          }
        ),
      ])

      clearTimeout(timeout)

      if (!userRes.ok) {
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: `GitHub API returned ${userRes.status} for user "${username}"`,
        }
      }

      const user = (await userRes.json()) as GitHubUser
      const repos: GitHubRepo[] = reposRes.ok ? ((await reposRes.json()) as GitHubRepo[]) : []

      // Count languages across non-fork repos
      const langCount: Record<string, number> = {}
      for (const repo of repos) {
        if (!repo.fork && repo.language) {
          langCount[repo.language] = (langCount[repo.language] ?? 0) + 1
        }
      }
      const topLanguages = Object.entries(langCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang]) => lang)

      const extracted: ExtractedProfile = {
        bio: user.bio ?? undefined,
        currentCompany: user.company?.replace(/^@/, '') || undefined,
        location: user.location ?? undefined,
        portfolioUrl: user.blog || undefined,
        githubUrl: user.html_url,
        skills: topLanguages.length > 0 ? topLanguages : undefined,
        resumeText: [
          `GitHub profile: ${username} — ${user.public_repos} public repos, followers: ${user.followers}.`,
          topLanguages.length > 0 ? `Top languages: ${topLanguages.join(', ')}.` : '',
        ]
          .filter(Boolean)
          .join(' '),
      }

      const summary = `GitHub: ${user.public_repos} repos, languages: ${topLanguages.join(', ') || 'none detected'}`

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
