import type { Connector } from './types'

// Connectors are imported dynamically to avoid bundling server-only code on the client.
// The registry holds metadata only - actual connector instances are loaded server-side.

import { connector as github } from './github'
import { connector as gitlab } from './gitlab'
import { connector as leetcode } from './leetcode'
import { connector as codeforces } from './codeforces'
import { connector as stackoverflow } from './stackoverflow'
import { connector as devto } from './devto'
import { connector as hackerrank } from './hackerrank'
import { connector as codechef } from './codechef'
import { connector as hackerearth } from './hackerearth'
import { connector as kaggle } from './kaggle'
import { connector as behance } from './behance'
import { connector as dribbble } from './dribbble'
import { connector as wellfound } from './wellfound'
import { connector as naukri } from './naukri'
import { connector as linkedinPaste } from './linkedin-paste'
import { connector as linkedinZip } from './linkedin-zip'
import { connector as resumePdf } from './resume-pdf'
import { connector as learningPaste } from './learning-paste'

export const connectors: Connector[] = [
  // Resume - always first
  resumePdf,
  linkedinPaste,
  linkedinZip,
  // Developer platforms
  github,
  gitlab,
  leetcode,
  codeforces,
  codechef,
  hackerrank,
  hackerearth,
  stackoverflow,
  devto,
  kaggle,
  // Portfolio
  behance,
  dribbble,
  wellfound,
  // Professional
  naukri,
  // Learning
  learningPaste,
]

export function getConnector(id: string): Connector | undefined {
  return connectors.find(c => c.id === id)
}

// Client-safe metadata only - no run() function
export type ConnectorInfo = Omit<Connector, 'run'>

export const connectorList: ConnectorInfo[] = connectors.map(({ run: _run, ...meta }) => meta)
