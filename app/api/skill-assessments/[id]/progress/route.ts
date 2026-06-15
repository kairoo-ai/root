import { auth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { markResourceComplete } from '@/data/repositories/skillAssessments.repo'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { skillName, resourceTitle, completed } = await req.json() as {
    skillName: string; resourceTitle: string; completed: boolean
  }
  const result = await markResourceComplete(id, userId, skillName, resourceTitle, completed)
  return NextResponse.json({ success: !!result })
}
