import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { getTodaysFocus } from '@/data/repositories/roadmaps.repo'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import { GlowingEffect, SpotlightNew } from '@/components/aceternity'

export async function TodaysFocusWidget() {
  const { userId } = await auth()
  if (!userId) return null

  const focus = await getTodaysFocus(userId)
  if (!focus) {
    return (
      <div className="rounded-xl border border-dashed border-border p-5 text-center">
        <BookOpen className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No active roadmap step</p>
        <Link href="/roadmaps/new" className="mt-2 inline-block text-xs text-primary hover:underline">
          Start a roadmap →
        </Link>
      </div>
    )
  }

  const { roadmap, phase, step } = focus

  return (
    <GlowingEffect color="var(--primary)">
      <SpotlightNew size={400}>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">Today's Focus</span>
            <span className="text-xs text-muted-foreground">{phase.title}</span>
          </div>
          <h3 className="mt-1 font-semibold text-foreground">{step.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{step.description}</p>
          {step.duration && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {step.duration}
            </div>
          )}
          <Link
            href={`/roadmaps/${roadmap.id}`}
            className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Open roadmap <ArrowRight size={14} />
          </Link>
        </div>
      </SpotlightNew>
    </GlowingEffect>
  )
}
