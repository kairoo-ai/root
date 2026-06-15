import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserSessions, getInterviewStats } from '@/data/repositories/interview.repo'
import { HubClientSection } from './_components/HubClientSection'
import { WeaknessHeatmap } from './_components/WeaknessHeatmap'

export default async function InterviewPrepHub() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [sessions, stats] = await Promise.all([
    getUserSessions(userId, 5),
    getInterviewStats(userId),
  ])

  const inProgress = sessions.find((s) => s.status === 'in_progress')

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-8">
      {/* Interactive hero + company selector + mode grid */}
      <HubClientSection />

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sessions', value: stats.totalSessions, icon: '🗂️' },
          { label: 'Completed', value: stats.completedSessions, icon: '✅' },
          { label: 'Avg Score', value: stats.avgScore !== null ? `${stats.avgScore}/100` : '-', icon: '📈' },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 py-5 backdrop-blur-sm"
          >
            <span className="text-lg">{icon}</span>
            <span className="text-xl font-bold text-white">{value}</span>
            <span className="text-xs text-white/40">{label}</span>
          </div>
        ))}
      </div>

      {/* Weakness patterns analytics */}
      <WeaknessHeatmap />

      {/* Continue in-progress session */}
      {inProgress && (
        <Link
          href={`/tools/interviewPrep/session/${inProgress.id}`}
          className="group flex items-center justify-between rounded-2xl border border-teal-500/30 bg-teal-500/5 px-5 py-4 backdrop-blur-sm transition-all hover:border-teal-500/50 hover:bg-teal-500/10"
        >
          <div>
            <p className="text-sm font-semibold text-white">Continue: {inProgress.title}</p>
            <p className="text-xs text-white/40 mt-0.5">{inProgress.type} · {inProgress.difficulty}</p>
          </div>
          <span className="text-teal-400 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-4 bg-teal-500/50" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">Recent Sessions</h2>
          </div>
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={
                  s.status === 'completed'
                    ? `/tools/interviewPrep/session/${s.id}/results`
                    : `/tools/interviewPrep/session/${s.id}`
                }
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/8"
              >
                <div>
                  <p className="text-sm font-medium text-white">{s.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {s.type} · {s.difficulty} · {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {s.overallScore !== null && (
                    <span className="text-sm font-bold text-teal-400">{s.overallScore}</span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
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
