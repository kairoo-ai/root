import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/data/client'
import { roadmaps } from '@/data/schema'
import { eq, desc } from 'drizzle-orm'
import { RoadmapsList } from './_components/RoadmapsList'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function RoadmapsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const userRoadmaps = await db
    .select()
    .from(roadmaps)
    .where(eq(roadmaps.userId, userId))
    .orderBy(desc(roadmaps.createdAt))
    .catch(() => [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Career Roadmaps</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your AI-generated career plans.</p>
        </div>
        <Link
          href="/roadmaps/new"
          className="flex items-center gap-2 text-xs font-semibold bg-teal-500 text-black px-4 py-2.5 rounded-xl hover:bg-teal-400 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Roadmap
        </Link>
      </div>
      <RoadmapsList roadmaps={userRoadmaps} />
    </div>
  )
}
