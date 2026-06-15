import type { Connector, ConnectorResult, ExtractedProfile } from './types'

interface CodeforcesUser {
  handle: string
  organization: string
  city: string
  country: string
  rating: number
  maxRating: number
  rank: string
  maxRank: string
}

interface CodeforcesApiResponse {
  status: string
  result?: CodeforcesUser[]
  comment?: string
}

const source = 'Codeforces'

const DERIVED_SKILLS = [
  'Competitive Programming',
  'C++',
  'Algorithm Design',
  'Data Structures',
]

const connector: Connector = {
  id: 'codeforces',
  name: 'Codeforces',
  description: 'Import your Codeforces competitive programming profile and rating.',
  website: 'https://codeforces.com',
  category: 'developer',
  inputType: 'username',
  inputLabel: 'Codeforces Handle',
  inputPlaceholder: 'e.g. tourist',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const handle = input.trim()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const res = await fetch(
        `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
        { signal: controller.signal }
      )

      clearTimeout(timeout)

      if (!res.ok) {
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: `Codeforces API returned ${res.status}`,
        }
      }

      const data = (await res.json()) as CodeforcesApiResponse

      if (data.status !== 'OK' || !data.result || data.result.length === 0) {
        return {
          success: false,
          source,
          extracted: {},
          summary: '',
          error: data.comment ?? `No Codeforces user found for handle "${handle}"`,
        }
      }

      const user = data.result[0]

      const location = [user.city, user.country].filter(Boolean).join(', ') || undefined

      const extracted: ExtractedProfile = {
        currentCompany: user.organization || undefined,
        location,
        skills: DERIVED_SKILLS,
        resumeText: `Codeforces: handle ${user.handle}, rating ${user.rating ?? 'unrated'}, maxRating ${user.maxRating ?? 'unrated'}, rank ${user.rank ?? 'unrated'}`,
      }

      const summary = `Codeforces: ${user.handle}, rating ${user.rating ?? 'unrated'}, rank ${user.rank ?? 'unrated'}`

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
