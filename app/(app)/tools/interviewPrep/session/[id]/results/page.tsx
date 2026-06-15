import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionWithExchanges } from '@/data/repositories/interview.repo'
import { SessionScoreCard } from '../../../_components/SessionScoreCard'
import type { SessionAssessment } from '@/types/interview'

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params
  const session = await getSessionWithExchanges(id, userId)
  if (!session) notFound()
  if (session.status !== 'completed') redirect(`/tools/interviewPrep/session/${id}`)

  const assessment: SessionAssessment = {
    overallScore: session.overallScore ?? 0,
    strengths: session.strengths,
    improvements: session.improvements,
    topActions: [],  // stored in improvements[3+] or reparsed from activityLog
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{session.title}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {session.type} · {session.difficulty} · {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link
          href="/tools/interviewPrep"
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
        >
          ← Back
        </Link>
      </div>

      <SessionScoreCard assessment={assessment} />

      {/* Per-question breakdown */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">Question Breakdown</h2>
        <div className="flex flex-col gap-3">
          {session.exchanges.map((ex, i) => (
            <div
              key={ex.id}
              className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Q{i + 1}: {ex.questionText}
                </p>
                {ex.starScore !== null && (
                  <span className="shrink-0 text-sm font-bold text-[var(--color-primary)]">
                    {ex.starScore}/100
                  </span>
                )}
              </div>
              {ex.userAnswer && (
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-3">{ex.userAnswer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          href={`/tools/interviewPrep/setup?type=${session.type}&role=${encodeURIComponent(session.targetRole)}&prefillDifficulty=${session.difficulty}`}
          className="flex-1 rounded-xl bg-[var(--color-primary)] py-3 text-center text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          Practice Again
        </Link>
        <Link
          href="/tools/interviewPrep"
          className="flex-1 rounded-xl border border-[var(--color-border)] py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
        >
          All Sessions
        </Link>
      </div>
    </div>
  )
}
