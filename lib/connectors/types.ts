export type ConnectorCategory = 'developer' | 'professional' | 'portfolio' | 'learning' | 'resume'
export type ConnectorInputType = 'username' | 'url' | 'paste' | 'pdf' | 'zip'

export interface ConnectorMeta {
  id: string
  name: string
  description: string
  website: string
  category: ConnectorCategory
  inputType: ConnectorInputType
  inputLabel: string
  inputPlaceholder: string
  /** Whether this connector calls an external API (username/url) vs needs user to provide content (paste/pdf/zip) */
  isAutoFetch: boolean
}

export interface ExtractedProfile {
  currentRole?: string
  currentCompany?: string
  yearsExperience?: number
  industry?: string
  location?: string
  skills?: string[]
  certifications?: string[]
  languages?: string[]
  education?: { degree: string; field: string; institution: string; year?: number }[]
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  bio?: string
  resumeText?: string
  // Platform-specific enrichment stored in resumeText as supplementary context
}

export interface ConnectorResult {
  success: boolean
  source: string
  extracted: ExtractedProfile
  /** Human-readable summary of what was imported — shown in the UI */
  summary: string
  error?: string
}

export interface Connector extends ConnectorMeta {
  /** input is username, URL, pasted text, or base64-encoded file depending on inputType */
  run(input: string): Promise<ConnectorResult>
}
