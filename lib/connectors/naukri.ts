import type { Connector, ConnectorResult } from './types'

// Common Indian cities for location heuristic
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
  'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Noida', 'Gurugram',
  'Gurgaon', 'Chandigarh', 'Coimbatore', 'Kochi', 'Trivandrum', 'Mysore', 'Mysuru',
  'Bhubaneswar', 'Dehradun', 'Guwahati', 'Jamshedpur', 'Raipur', 'Amritsar',
]

function extractCurrentRole(text: string): string | undefined {
  // Try labeled patterns first
  const labeled = text.match(
    /(?:Current(?:\s+Role)?|Designation|Title)\s*[:\-]\s*([^\n\r,]{3,60})/i
  )
  if (labeled) return labeled[1].trim()

  // Fall back to the first non-empty line
  const firstLine = text.split(/\r?\n/).find((l) => l.trim().length > 3)
  return firstLine?.trim()
}

function extractCurrentCompany(text: string): string | undefined {
  const match = text.match(
    /(?:Company|Working at|Current Employer|Employer|Organization)\s*[:\-]\s*([^\n\r,]{2,60})/i
  )
  return match?.[1].trim()
}

function extractLocation(text: string): string | undefined {
  for (const city of INDIAN_CITIES) {
    // Match whole-word city mentions
    const regex = new RegExp(`\\b${city}\\b`, 'i')
    if (regex.test(text)) return city
  }
  // Generic labeled pattern as fallback
  const labeled = text.match(/(?:Location|City|Based in)\s*[:\-]\s*([^\n\r,]{2,40})/i)
  return labeled?.[1].trim()
}

function extractSkills(text: string): string[] {
  // Look for a "Skills:" section first
  const skillsSection = text.match(
    /Skills?\s*[:\-]\s*([\s\S]{5,300}?)(?:\n{2,}|$)/i
  )
  if (skillsSection) {
    const raw = skillsSection[1]
    const items = raw
      .split(/[,\n|\/•]/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2 && s.length <= 50 && !/^\d+$/.test(s))
    if (items.length > 0) return items.slice(0, 30)
  }

  return []
}

export const connector: Connector = {
  id: 'naukri',
  name: 'Naukri',
  description: 'Paste your Naukri profile summary to import your role, company, and skills.',
  website: 'https://www.naukri.com',
  category: 'resume',
  inputType: 'paste',
  inputLabel: 'Paste your Naukri profile summary',
  inputPlaceholder:
    'Copy your Naukri profile headline, experience, and skills and paste here...',
  isAutoFetch: false,

  async run(input: string): Promise<ConnectorResult> {
    const text = input.trim()

    if (!text || text.length < 10) {
      return {
        success: false,
        source: 'naukri',
        extracted: {},
        summary: '',
        error:
          'The pasted text is too short. Please copy your Naukri profile headline, experience, and skills section and paste the full text.',
      }
    }

    const currentRole = extractCurrentRole(text)
    const currentCompany = extractCurrentCompany(text)
    const location = extractLocation(text)
    const skills = extractSkills(text)

    const extractedParts: string[] = []
    if (currentRole) extractedParts.push(`role: ${currentRole}`)
    if (currentCompany) extractedParts.push(`company: ${currentCompany}`)
    if (location) extractedParts.push(`location: ${location}`)
    if (skills.length > 0) extractedParts.push(`${skills.length} skill(s)`)

    return {
      success: true,
      source: 'naukri',
      extracted: {
        currentRole,
        currentCompany,
        location,
        skills: skills.length > 0 ? skills : undefined,
        resumeText: text,
      },
      summary:
        extractedParts.length > 0
          ? `Naukri profile imported - extracted ${extractedParts.join(', ')} from pasted text.`
          : 'Naukri profile imported - raw text stored. No structured data could be extracted automatically.',
    }
  },
}

export default connector
