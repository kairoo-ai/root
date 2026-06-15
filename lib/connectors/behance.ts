import type { Connector, ConnectorResult } from './types'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

async function fetchBehanceProfile(username: string): Promise<ConnectorResult> {
  const profileUrl = `https://www.behance.net/${username}`

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
        source: 'behance',
        extracted: {},
        summary: '',
        error: `Behance profile "${username}" was not found. Please check your username or paste your portfolio summary manually.`,
      }
    }

    if (!res.ok) {
      return {
        success: false,
        source: 'behance',
        extracted: {},
        summary: '',
        error: `Behance returned HTTP ${res.status}. The profile may be private or restricted. Try pasting your portfolio information manually instead.`,
      }
    }

    html = await res.text()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      source: 'behance',
      extracted: {},
      summary: '',
      error: `Could not reach Behance (${message}). Please paste your portfolio information manually.`,
    }
  }

  // Extract name from og:title
  const nameMatch = html.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
  ) ?? html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const rawName = nameMatch?.[1]?.replace(/\s*[-|].*$/, '').trim() || username

  // Extract occupation / current role from meta description or JSON-LD
  const descMatch = html.match(
    /<meta[^>]+(?:property=["']og:description["']|name=["']description["'])[^>]+content=["']([^"']{5,})["']/i
  )
  const bio = descMatch?.[1]?.trim() || undefined

  // Try to parse occupation from JSON-LD
  const occupationMatch =
    html.match(/"jobTitle"\s*:\s*"([^"]+)"/i) ??
    html.match(/"occupation"\s*:\s*"([^"]+)"/i) ??
    html.match(/data-occupation=["']([^"']+)["']/i)
  const occupation = occupationMatch?.[1]?.trim() || undefined

  // Try to parse location from JSON-LD or meta
  const locationMatch =
    html.match(/"addressLocality"\s*:\s*"([^"]+)"/i) ??
    html.match(/"location"\s*:\s*"([^"]+)"/i) ??
    html.match(/data-location=["']([^"']+)["']/i)
  const location = locationMatch?.[1]?.trim() || undefined

  return {
    success: true,
    source: 'behance',
    extracted: {
      currentRole: occupation,
      location,
      bio,
      portfolioUrl: profileUrl,
      skills: ['UI/UX Design', 'Visual Design', 'Figma', 'Adobe Creative Suite', 'Portfolio'],
      resumeText: `Behance portfolio: ${username}`,
    },
    summary: `Behance profile imported for ${rawName}${occupation ? ` - ${occupation}` : ''}${location ? `, ${location}` : ''}.`,
  }
}

export const connector: Connector = {
  id: 'behance',
  name: 'Behance',
  description: 'Import your Behance design portfolio, occupation, and location.',
  website: 'https://www.behance.net',
  category: 'portfolio',
  inputType: 'username',
  inputLabel: 'Behance username',
  inputPlaceholder: 'your_username',
  isAutoFetch: true,

  async run(input: string): Promise<ConnectorResult> {
    const username = input.trim().replace(/^@/, '')
    if (!username) {
      return {
        success: false,
        source: 'behance',
        extracted: {},
        summary: '',
        error: 'Please provide a valid Behance username.',
      }
    }
    return fetchBehanceProfile(username)
  },
}

export default connector
