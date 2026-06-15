import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getProfile, upsertProfile } from '@/data/repositories/profiles.repo'
import { mergeIntoProfile } from '@/lib/connectors/merge'
import { getConnector } from '@/lib/connectors/registry'
import { logActivity } from '@/data/repositories/activityLog.repo'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ source: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { source } = await params
  const connector = getConnector(source)
  if (!connector) return NextResponse.json({ error: `Unknown connector: ${source}` }, { status: 404 })

  const body = await req.json().catch(() => null)
  const input: string = body?.input ?? ''
  if (!input.trim()) return NextResponse.json({ error: 'No input provided' }, { status: 400 })

  const connResult = await connector.run(input).catch(e => ({
    success: false as const,
    source,
    extracted: {},
    summary: '',
    error: e instanceof Error ? e.message : 'Connector failed',
  }))

  if (!connResult.success) {
    return NextResponse.json({ error: connResult.error ?? 'Import failed' }, { status: 422 })
  }

  // Merge into existing profile
  const existing = await getProfile(userId).catch(() => null)
  const merged = mergeIntoProfile(existing ?? {}, connResult.extracted)
  await upsertProfile(userId, merged)

  // Log the import as activity
  await logActivity(userId, 'import', `Imported from ${connector.name}`, source).catch(() => null)

  return NextResponse.json({ success: true, summary: connResult.summary, extracted: connResult.extracted })
}
