import type { Connector, ConnectorResult, ExtractedProfile } from './types'

interface DevToUser {
  id: number
  username: string
  name: string
  summary: string | null
  twitter_username: string | null
  github_username: string | null
  articles_count: number
  comments_count: number
  profile_image: string
}

const source = 'Dev.to'

const connector: Connector = {
  id: 'devto',
  name: 'Dev.to',
  description: 'Import your Dev.to profile, article count, and writing summary.',
  website: 'https://dev.to',
  category: 'portfolio',
  inputType: 'username',
  inputLabel: 'Dev.to Username',
  inputPlaceholder: 'e.g. thepracticaldev',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const res = await fetch(
        `https://dev.to/api/users/by_username/${encodeURIComponent(username)}`,
        { signal: controller.signal }
      )

      clearTimeout(timeout)

      if (!res.ok) {
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: `Dev.to API returned ${res.status} for username "${username}"`,
        }
      }

      const user = (await res.json()) as DevToUser

      const skills: string[] =
        user.articles_count > 0 ? ['Technical Writing', 'Developer Advocacy'] : []

      const resumeParts = [
        `Dev.to: ${user.name} - ${user.articles_count} articles, ${user.comments_count} comments.`,
        user.summary ? `Summary: ${user.summary}` : '',
      ]

      const extracted: ExtractedProfile = {
        bio: user.summary ?? undefined,
        githubUrl: user.github_username
          ? `https://github.com/${user.github_username}`
          : undefined,
        skills: skills.length > 0 ? skills : undefined,
        resumeText: resumeParts.filter(Boolean).join(' '),
      }

      const summary = `Dev.to: ${user.name} - ${user.articles_count} articles, ${user.comments_count} comments`

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
