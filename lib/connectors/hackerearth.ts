import type { Connector, ConnectorResult } from './types'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

async function fetchHackerEarthProfile(username: string): Promise<ConnectorResult> {
  const url = `https://www.hackerearth.com/@${username}/`

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
        source: 'hackerearth',
        extracted: {},
        summary: '',
        error: `HackerEarth profile "@${username}" was not found. Please check your username and try again, or paste your profile summary manually.`,
      }
    }

    if (!res.ok) {
      return {
        success: false,
        source: 'hackerearth',
        extracted: {},
        summary: '',
        error: `HackerEarth returned HTTP ${res.status}. The profile may be private or restricted. Try pasting your profile information manually instead.`,
      }
    }

    html = await res.text()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      source: 'hackerearth',
      extracted: {},
      summary: '',
      error: `Could not reach HackerEarth (${message}). Please paste your profile information manually.`,
    }
  }

  // Extract name from og:title
  const nameFromOg = html.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
  )
  const nameFromTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const rawName =
    nameFromOg?.[1]?.trim() ||
    nameFromTitle?.[1]?.replace(/\s*[-|].*$/, '').trim() ||
    username

  // Extract bio / description
  const descMatch = html.match(
    /<meta[^>]+(?:property=["']og:description["']|name=["']description["'])[^>]+content=["']([^"']{5,})["']/i
  )
  const bio = descMatch?.[1]?.trim() || undefined

  // Extract location from meta or structured markup
  const locationMatch = html.match(/["']location["']\s*:\s*["']([^"']+)["']/i)
  const location = locationMatch?.[1]?.trim() || undefined

  return {
    success: true,
    source: 'hackerearth',
    extracted: {
      bio,
      location,
      skills: ['HackerEarth', 'Problem Solving', 'Algorithms'],
      resumeText: `HackerEarth: ${username}`,
    },
    summary: `HackerEarth profile imported for ${rawName}${location ? ` (${location})` : ''}.`,
  }
}

export const connector: Connector = {
  id: 'hackerearth',
  name: 'HackerEarth',
  description: 'Import your HackerEarth competitive programming and hackathon profile.',
  website: 'https://www.hackerearth.com',
  category: 'developer',
  inputType: 'username',
  inputLabel: 'HackerEarth username',
  inputPlaceholder: 'your_username',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim().replace(/^@/, '')
    if (!username) {
      return {
        success: false,
        source: 'hackerearth',
        extracted: {},
        summary: '',
        error: 'Please provide a valid HackerEarth username.',
      }
    }
    return fetchHackerEarthProfile(username)
  },
}

export default connector
