import type { Connector, ConnectorResult } from './types'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

async function fetchDribbbleProfile(username: string): Promise<ConnectorResult> {
  const profileUrl = `https://dribbble.com/${username}`

  let html: string
  try {
    const res = await fetch(profileUrl, {
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
        source: 'dribbble',
        extracted: {},
        summary: '',
        error: `Dribbble profile "${username}" was not found. Please check your username or paste your profile summary manually.`,
      }
    }

    if (!res.ok) {
      return {
        success: false,
        source: 'dribbble',
        extracted: {},
        summary: '',
        error: `Dribbble returned HTTP ${res.status}. The profile may not be accessible. Try pasting your profile information manually instead.`,
      }
    }

    html = await res.text()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      source: 'dribbble',
      extracted: {},
      summary: '',
      error: `Could not reach Dribbble (${message}). Please paste your profile information manually.`,
    }
  }

  // Extract name from og:title (Dribbble uses "Name - Dribbble" format)
  const ogTitleMatch = html.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
  )
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const rawName =
    ogTitleMatch?.[1]?.replace(/\s*[-|].*$/, '').trim() ||
    titleMatch?.[1]?.replace(/\s*[-|].*$/, '').trim() ||
    username

  // Extract bio from og:description
  const descMatch = html.match(
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{5,})["']/i
  ) ?? html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{5,})["']/i
  )
  const bio = descMatch?.[1]?.trim() || undefined

  // Extract location from og: or structured data
  const locationMatch =
    html.match(/<meta[^>]+property=["']og:locality["'][^>]+content=["']([^"']+)["']/i) ??
    html.match(/"addressLocality"\s*:\s*"([^"]+)"/i) ??
    html.match(/data-location=["']([^"']+)["']/i)
  const location = locationMatch?.[1]?.trim() || undefined

  return {
    success: true,
    source: 'dribbble',
    extracted: {
      bio,
      location,
      portfolioUrl: profileUrl,
      skills: ['UI Design', 'Visual Design', 'Prototyping', 'Motion Design'],
      resumeText: `Dribbble: ${username}`,
    },
    summary: `Dribbble profile imported for ${rawName}${location ? ` (${location})` : ''}.`,
  }
}

export const connector: Connector = {
  id: 'dribbble',
  name: 'Dribbble',
  description: 'Import your Dribbble design profile, bio, and location.',
  website: 'https://dribbble.com',
  category: 'portfolio',
  inputType: 'username',
  inputLabel: 'Dribbble username',
  inputPlaceholder: 'your_username',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim().replace(/^@/, '')
    if (!username) {
      return {
        success: false,
        source: 'dribbble',
        extracted: {},
        summary: '',
        error: 'Please provide a valid Dribbble username.',
      }
    }
    return fetchDribbbleProfile(username)
  },
}

export default connector
