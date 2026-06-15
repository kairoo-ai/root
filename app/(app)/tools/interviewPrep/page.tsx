import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserSessions, getInterviewStats } from '@/data/repositories/interview.repo'
import { HubClientSection } from './_components/HubClientSection'

export default async function InterviewPrepHub() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [sessions, stats] = await Promise.all([
    getUserSessions(userId, 5),
    getInterviewStats(userId),
  ])

  const inProgress = sessions.find((s) => s.status === 'in_progress')

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
      {/* Interactive hero + company selector + mode grid */}
      <HubClientSection />

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sessions', value: stats.totalSessions },
          { label: 'Completed', value: stats.completedSessions },
          { label: 'Avg Score', value: stats.avgScore !== null ? `${stats.avgScore}/100` : '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)] py-4"
          >
            <span className="text-xl font-bold text-[var(--color-text-primary)]">{value}</span>
            <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
          </div>
        ))}
      </div>

      {/* Continue in-progress session */}
      {inProgress && (
        <Link
          href={`/tools/interviewPrep/session/${inProgress.id}`}
          className="flex items-center justify-between rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-5 py-4 transition-colors hover:bg-[var(--color-primary)]/10"
        >
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Continue: {inProgress.title}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{inProgress.type} · {inProgress.difficulty}</p>
          </div>
          <span className="text-[var(--color-primary)]">→</span>
        </Link>
      )}

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">Recent Sessions</h2>
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={
                  s.status === 'completed'
                    ? `/tools/interviewPrep/session/${s.id}/results`
                    : `/tools/interviewPrep/session/${s.id}`
                }
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{s.title}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {s.type} · {s.difficulty} · {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {s.overallScore !== null && (
                    <span className="text-sm font-bold text-[var(--color-primary)]">{s.overallScore}</span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {s.status === 'completed' ? 'Done' : 'In progress'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
