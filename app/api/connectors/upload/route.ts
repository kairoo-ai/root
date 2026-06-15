import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getProfile, upsertProfile } from '@/data/repositories/profiles.repo'
import { mergeIntoProfile } from '@/lib/connectors/merge'
import { getConnector } from '@/lib/connectors/registry'
import { logActivity } from '@/data/repositories/activityLog.repo'

// Minimal PDF text extractor - works for standard text-based PDFs
function extractPdfText(buffer: Buffer): string {
  const str = buffer.toString('latin1')
  const texts: string[] = []
  // Extract text between BT/ET blocks (standard PDF text operators)
  const btEtRegex = /BT([\s\S]*?)ET/g
  let m: RegExpExecArray | null
  while ((m = btEtRegex.exec(str)) !== null) {
    // Extract strings in parentheses: (text) or hex strings <hex>
    const block = m[1]
    const parenRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g
    let p: RegExpExecArray | null
    while ((p = parenRegex.exec(block)) !== null) {
      const text = p[1].replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\\\/g, '\\')
      if (text.trim()) texts.push(text)
    }
  }
  return texts.join(' ').replace(/\s+/g, ' ').trim()
}

// Minimal ZIP reader for LinkedIn exports - extracts CSV files
async function extractLinkedInZip(buffer: Buffer): Promise<string> {
  // Dynamic import fflate (installed)
  const { unzipSync } = await import('fflate')
  const uint8 = new Uint8Array(buffer)
  const files = unzipSync(uint8)

  const TARGET_FILES = ['Profile.csv', 'Positions.csv', 'Skills.csv', 'Education.csv', 'Certifications.csv']
  const parts: string[] = []

  for (const [filename, data] of Object.entries(files)) {
    const base = filename.split('/').pop() ?? ''
    if (TARGET_FILES.some(t => base === t || base.startsWith(t.replace('.csv', '')))) {
      const text = new TextDecoder('utf-8').decode(data)
      parts.push(`=== ${base} ===\n${text}`)
    }
  }

  return parts.join('\n\n') || 'No recognisable LinkedIn export files found in ZIP'
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData().catch(() => null)
  if (!formData) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })

  const source = formData.get('source') as string
  const file = formData.get('file') as File | null

  if (!source || !file) return NextResponse.json({ error: 'Missing source or file' }, { status: 400 })

  const connector = getConnector(source)
  if (!connector) return NextResponse.json({ error: `Unknown connector: ${source}` }, { status: 404 })

  const buffer = Buffer.from(await file.arrayBuffer())
  let extractedText = ''

  if (source === 'linkedin-zip' || file.name.endsWith('.zip')) {
    extractedText = await extractLinkedInZip(buffer).catch(e => `ZIP extraction failed: ${e instanceof Error ? e.message : 'unknown error'}`)
  } else if (source === 'resume-pdf' || file.name.endsWith('.pdf')) {
    extractedText = extractPdfText(buffer)
    if (!extractedText) {
      extractedText = 'PDF text extraction was not possible for this file. Try copying the text from your resume and pasting it instead.'
    }
  } else {
    // Plain text fallback
    extractedText = buffer.toString('utf-8')
  }

  const connResult = await connector.run(extractedText).catch(e => ({
    success: false as const,
    source,
    extracted: {},
    summary: '',
    error: e instanceof Error ? e.message : 'Connector failed',
  }))

  if (!connResult.success) {
    return NextResponse.json({ error: connResult.error ?? 'Import failed' }, { status: 422 })
  }

  const existing = await getProfile(userId).catch(() => null)
  const merged = mergeIntoProfile(existing ?? {}, connResult.extracted)
  await upsertProfile(userId, merged)

  await logActivity(userId, 'import', `Imported from ${connector.name}`, source).catch(() => null)

  return NextResponse.json({ success: true, summary: connResult.summary, extracted: connResult.extracted })
}
