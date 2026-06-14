import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/data/client'
import { roadmaps } from '@/data/schema'
import { eq, and } from 'drizzle-orm'
import { RoadmapDetail } from './_components/RoadmapDetail'

interface Props { params: Promise<{ id: string }> }

export default async function RoadmapDetailPage({ params }: Props) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  const { id } = await params
  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .where(and(eq(roadmaps.id, id), eq(roadmaps.userId, userId)))
    .limit(1)
  if (!roadmap) notFound()
  return <RoadmapDetail roadmap={roadmap} />
}
