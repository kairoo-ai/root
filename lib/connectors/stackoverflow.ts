import type { Connector, ConnectorResult, ExtractedProfile } from './types'

interface BadgeCounts {
  gold: number
  silver: number
  bronze: number
}

interface StackOverflowUser {
  user_id: number
  display_name: string
  location: string
  reputation: number
  answer_count: number
  badge_counts: BadgeCounts
  link: string
}

interface StackExchangeResponse {
  items: StackOverflowUser[]
}

const source = 'Stack Overflow'
const BASE_SKILLS = ['Stack Overflow', 'Technical Q&A']

const connector: Connector = {
  id: 'stackoverflow',
  name: 'Stack Overflow',
  description: 'Import your Stack Overflow reputation, badges, and activity.',
  website: 'https://stackoverflow.com',
  category: 'developer',
  inputType: 'username',
  inputLabel: 'Stack Overflow Display Name',
  inputPlaceholder: 'e.g. Jon Skeet',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const params = new URLSearchParams({
        inname: username,
        site: 'stackoverflow',
        pagesize: '1',
        order: 'desc',
        sort: 'reputation',
      })

      const res = await fetch(
        `https://api.stackexchange.com/2.3/users?${params.toString()}`,
        { signal: controller.signal }
      )

      clearTimeout(timeout)

      if (!res.ok) {
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: `Stack Exchange API returned ${res.status}`,
        }
      }

      const data = (await res.json()) as StackExchangeResponse

      if (!data.items || data.items.length === 0) {
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: `No Stack Overflow user found matching "${username}"`,
        }
      }

      const user = data.items[0]
      const { gold, silver, bronze } = user.badge_counts

      const extracted: ExtractedProfile = {
        location: user.location || undefined,
        skills: BASE_SKILLS,
        resumeText: `Stack Overflow: ${user.display_name}, reputation ${user.reputation}, badges: ${gold}g ${silver}s ${bronze}b, answer count ${user.answer_count}`,
      }

      const summary = `Stack Overflow: ${user.display_name}, reputation ${user.reputation}, ${gold}g ${silver}s ${bronze}b badges`

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
