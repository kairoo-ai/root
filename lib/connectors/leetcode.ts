import type { Connector, ConnectorResult, ExtractedProfile } from './types'

interface AcSubmission {
  difficulty: string
  count: number
}

interface LeetCodeProfile {
  realName: string
  aboutMe: string
  company: string
  jobTitle: string
  countryName: string
  skillTags: string[]
  reputation: number
}

interface LeetCodeMatchedUser {
  username: string
  profile: LeetCodeProfile
  submitStats: {
    acSubmissionNum: AcSubmission[]
  }
}

interface LeetCodeGraphQLResponse {
  data?: {
    matchedUser?: LeetCodeMatchedUser | null
  }
  errors?: { message: string }[]
}

const source = 'LeetCode'

const ALWAYS_ADD_SKILLS = ['LeetCode', 'Data Structures', 'Algorithms', 'Problem Solving']

const GRAPHQL_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        aboutMe
        company
        jobTitle
        countryName
        skillTags
        reputation
      }
      submitStats {
        acSubmissionNum { difficulty count }
      }
    }
  }
`

const connector: Connector = {
  id: 'leetcode',
  name: 'LeetCode',
  description: 'Import your LeetCode problem-solving stats, skills, and profile.',
  website: 'https://leetcode.com',
  category: 'developer',
  inputType: 'username',
  inputLabel: 'LeetCode Username',
  inputPlaceholder: 'e.g. neal_wu',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { username } }),
      })

      clearTimeout(timeout)

      if (!res.ok) {
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: `LeetCode GraphQL endpoint returned ${res.status}`,
        }
      }

      const json = (await res.json()) as LeetCodeGraphQLResponse

      if (json.errors && json.errors.length > 0) {
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: json.errors[0].message,
        }
      }

      const user = json.data?.matchedUser

      if (!user) {
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: `No LeetCode user found for username "${username}"`,
        }
      }

      const { profile, submitStats } = user

      const solvedMap: Record<string, number> = {}
      for (const entry of submitStats.acSubmissionNum) {
        solvedMap[entry.difficulty] = entry.count
      }

      const easy = solvedMap['Easy'] ?? 0
      const medium = solvedMap['Medium'] ?? 0
      const hard = solvedMap['Hard'] ?? 0

      const profileSkills: string[] = Array.isArray(profile.skillTags) ? profile.skillTags : []
      const skills = [...new Set([...ALWAYS_ADD_SKILLS, ...profileSkills])]

      const extracted: ExtractedProfile = {
        currentCompany: profile.company || undefined,
        location: profile.countryName || undefined,
        currentRole: profile.jobTitle || undefined,
        skills,
        resumeText: `LeetCode: ${username}, solved: Easy ${easy} / Medium ${medium} / Hard ${hard}`,
      }

      const summary = `LeetCode: ${username}, solved Easy ${easy} / Medium ${medium} / Hard ${hard}`

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
