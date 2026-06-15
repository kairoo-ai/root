import type { Connector, ConnectorResult } from './types'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const TIER_KEYWORDS = ['Grandmaster', 'Master', 'Expert', 'Contributor', 'Novice'] as const
type KaggleTier = (typeof TIER_KEYWORDS)[number]

function extractTier(html: string): KaggleTier | undefined {
  for (const tier of TIER_KEYWORDS) {
    if (html.includes(tier)) return tier
  }
  return undefined
}

async function fetchKaggleProfile(username: string): Promise<ConnectorResult> {
  const url = `https://www.kaggle.com/${username}`

  let html: string
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(10_000),
    })

    if (res.status === 404) {
      return {
        success: false,
        source: 'kaggle',
        extracted: {},
        summary: '',
        error: `Kaggle profile "${username}" was not found. Please check your username and try again.`,
      }
    }

    if (!res.ok) {
      return {
        success: false,
        source: 'kaggle',
        extracted: {},
        summary: '',
        error: `Kaggle returned HTTP ${res.status}. The profile may be private. Try pasting your profile information manually instead.`,
      }
    }

    html = await res.text()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      source: 'kaggle',
      extracted: {},
      summary: '',
      error: `Could not reach Kaggle (${message}). Please paste your profile information manually.`,
    }
  }

  // Extract name from og:title or title
  const nameFromOg = html.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
  )
  const nameFromTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const rawName =
    nameFromOg?.[1]?.trim() ||
    nameFromTitle?.[1]?.replace(/\s*[-|].*$/, '').trim() ||
    username

  // Extract description/bio
  const descMatch = html.match(
    /<meta[^>]+(?:property=["']og:description["']|name=["']description["'])[^>]+content=["']([^"']{5,})["']/i
  )
  const bio = descMatch?.[1]?.trim() || undefined

  // Extract tier
  const tier = extractTier(html)

  // Try to extract competitions entered count from JSON-LD or page data
  const competitionsMatch = html.match(/["']totalCompetitions["']\s*:\s*(\d+)/i)
    ?? html.match(/(\d+)\s+[Cc]ompetitions?\s+[Ee]ntered/)
  const competitionsCount = competitionsMatch?.[1]
    ? parseInt(competitionsMatch[1], 10)
    : undefined

  const summaryParts: string[] = []
  if (tier) summaryParts.push(`tier: ${tier}`)
  if (competitionsCount !== undefined) summaryParts.push(`${competitionsCount} competition(s) entered`)

  const summaryDetail = summaryParts.length > 0 ? ` - ${summaryParts.join(', ')}` : ''

  const bioParts: string[] = []
  if (tier) bioParts.push(`${tier}-tier Kaggle competitor`)
  if (competitionsCount !== undefined) bioParts.push(`${competitionsCount} competitions entered`)
  const computedBio = bioParts.length > 0 ? bioParts.join(', ') + '.' : bio

  return {
    success: true,
    source: 'kaggle',
    extracted: {
      bio: computedBio,
      skills: ['Kaggle', 'Machine Learning', 'Data Science', 'Python'],
      resumeText: `Kaggle: ${username}`,
    },
    summary: `Kaggle profile imported for ${rawName}${summaryDetail}.`,
  }
}

export const connector: Connector = {
  id: 'kaggle',
  name: 'Kaggle',
  description: 'Import your Kaggle data science profile, tier, and competition history.',
  website: 'https://www.kaggle.com',
  category: 'developer',
  inputType: 'username',
  inputLabel: 'Kaggle username',
  inputPlaceholder: 'your_username',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim().replace(/^@/, '')
    if (!username) {
      return {
        success: false,
        source: 'kaggle',
        extracted: {},
        summary: '',
        error: 'Please provide a valid Kaggle username.',
      }
    }
    return fetchKaggleProfile(username)
  },
}

export default connector
