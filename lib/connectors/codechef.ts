import type { Connector, ConnectorResult } from './types'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

async function fetchCodeChefProfile(username: string): Promise<ConnectorResult> {
  const url = `https://www.codechef.com/users/${username}`

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

    if (!res.ok) {
      return {
        success: false,
        source: 'codechef',
        extracted: {},
        summary: '',
        error: `CodeChef returned HTTP ${res.status}. The profile may not exist or may be private. Try pasting your profile summary manually instead.`,
      }
    }

    html = await res.text()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      source: 'codechef',
      extracted: {},
      summary: '',
      error: `Could not reach CodeChef (${message}). Please paste your profile information manually.`,
    }
  }

  // Extract current rating
  const currentRatingMatch = html.match(/["']rating["']\s*:\s*(\d+)/i)
    ?? html.match(/Rating[^<]*<[^>]+>\s*(\d{3,4})/i)
  const currentRating = currentRatingMatch?.[1] ? parseInt(currentRatingMatch[1], 10) : undefined

  // Extract max rating
  const maxRatingMatch = html.match(/(?:highest|max)[^<]{0,30}rating[^<]*<[^>]+>\s*(\d{3,4})/i)
    ?? html.match(/["']max_rating["']\s*:\s*(\d+)/i)
  const maxRating = maxRatingMatch?.[1] ? parseInt(maxRatingMatch[1], 10) : undefined

  // Extract stars (e.g. "5 Star" or data-user-rating="5")
  const starsMatch =
    html.match(/data-user-rating=["'](\d+)["']/i) ??
    html.match(/(\d)\s*[Ss]tar/)
  const stars = starsMatch?.[1] ? parseInt(starsMatch[1], 10) : undefined

  // Extract name from og:title or title
  const nameFromOg = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
  const nameFromTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const rawName =
    nameFromOg?.[1]?.trim() ||
    nameFromTitle?.[1]?.replace(/\s*[-|].*$/, '').trim() ||
    username

  const ratingParts: string[] = []
  if (currentRating !== undefined) ratingParts.push(`current rating ${currentRating}`)
  if (maxRating !== undefined) ratingParts.push(`max rating ${maxRating}`)
  if (stars !== undefined) ratingParts.push(`${stars}-star`)

  const summaryDetail = ratingParts.length > 0 ? ` — ${ratingParts.join(', ')}` : ''

  const bio = ratingParts.length > 0
    ? `CodeChef competitive programmer${stars !== undefined ? `, ${stars}-star coder` : ''}${currentRating !== undefined ? `, rating ${currentRating}` : ''}.`
    : undefined

  return {
    success: true,
    source: 'codechef',
    extracted: {
      bio,
      skills: ['CodeChef', 'Competitive Programming', 'C++', 'Data Structures'],
      resumeText: `CodeChef: ${username}`,
    },
    summary: `CodeChef profile imported for ${rawName}${summaryDetail}.`,
  }
}

export const connector: Connector = {
  id: 'codechef',
  name: 'CodeChef',
  description: 'Import your CodeChef competitive programming profile and ratings.',
  website: 'https://www.codechef.com',
  category: 'developer',
  inputType: 'username',
  inputLabel: 'CodeChef username',
  inputPlaceholder: 'your_username',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim().replace(/^@/, '')
    if (!username) {
      return {
        success: false,
        source: 'codechef',
        extracted: {},
        summary: '',
        error: 'Please provide a valid CodeChef username.',
      }
    }
    return fetchCodeChefProfile(username)
  },
}

export default connector
