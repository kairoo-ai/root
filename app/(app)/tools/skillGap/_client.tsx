'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, RefreshCw, Clock, Target, Zap, LayoutDashboard, GitBranch } from 'lucide-react'
import { SkillRadarChart } from './_components/SkillRadarChart'
import { PriorityMatrix } from './_components/PriorityMatrix'
import { SkillGapCard } from './_components/SkillGapCard'
import { LearningPlanTimeline } from './_components/LearningPlanTimeline'
import { SalaryImpactCard } from './_components/SalaryImpactCard'
import { SkillTreeGraph } from './_components/SkillTreeGraph'
import type { SkillAssessment } from '@/data/repositories/skillAssessments.repo'

interface Props {
  assessments: SkillAssessment[]
  active: SkillAssessment | null
  learningStyle?: string | null
}

export function SkillGapDashboardClient({ assessments, active: initialActive, learningStyle }: Props) {
  const router = useRouter()
  const [active, setActive] = useState(initialActive)
  const [view, setView] = useState<'dashboard' | 'skill-tree'>('dashboard')
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [planError, setPlanError] = useState('')

  const generatePlan = async () => {
    if (!active) return
    setGeneratingPlan(true)
    setPlanError('')
    try {
      const res = await fetch(`/api/skill-assessments/${active.id}/learning-plan`, {
        method: 'POST',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed' })) as { error: string }
        throw new Error(err.error)
      }
      const updated = await res.json() as SkillAssessment
      setActive(updated)
    } catch (err: unknown) {
      setPlanError(err instanceof Error ? err.message : 'Failed to generate plan')
    } finally {
      setGeneratingPlan(false)
    }
  }

  if (!active) return null

  const criticalGaps = active.gaps.filter(g => g.priority === 'critical')
  const totalWeeks = active.learningPlan.reduce((sum, p) => sum + p.weeks, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Skill Gap Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-foreground font-semibold">{active.currentRole}</span>
            {' → '}
            <span className="text-teal-400 font-semibold">{active.targetRole}</span>
          </p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center gap-0.5 bg-muted/30 border border-border rounded-xl p-0.5">
            {([
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'skill-tree', label: 'Skill Tree', icon: GitBranch },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${view === id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
          {assessments.length > 1 && (
            <select
              aria-label="Switch assessment"
              onChange={e => {
                const found = assessments.find(a => a.id === e.target.value)
                if (found) setActive(found)
                router.push(`/tools/skillGap?id=${e.target.value}`, { scroll: false })
              }}
              value={active.id}
              className="text-xs bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-teal-500/50 cursor-pointer"
            >
              {assessments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.targetRole} · {new Date(a.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => router.push('/tools/skillGap/assess')}
            className="flex items-center gap-1.5 text-xs font-semibold bg-teal-500 text-black hover:bg-teal-400 transition-colors px-3 py-2 rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Assessment
          </button>
        </div>
      </div>

      {/* Skill Tree view */}
      {view === 'skill-tree' && (
        <SkillTreeGraph gaps={active.gaps} />
      )}

      {/* Dashboard view */}
      {view === 'dashboard' && <>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Target, label: 'Critical Gaps', value: criticalGaps.length, color: 'text-red-400' },
            { icon: RefreshCw, label: 'Total Gaps', value: active.gaps.length, color: 'text-amber-400' },
            { icon: Clock, label: 'Est. Weeks', value: totalWeeks > 0 ? `${totalWeeks}w` : '-', color: 'text-teal-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-muted/30 flex items-center justify-center">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-extrabold text-foreground">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Radar + Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-5 items-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold text-foreground mb-4">Skills Radar</h2>
            <SkillRadarChart
              currentSkills={active.currentSkills}
              targetSkills={active.targetSkills}
              size={280}
            />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold text-foreground mb-4">Priority Matrix</h2>
            <PriorityMatrix gaps={active.gaps} />
          </div>
        </div>

        {/* Salary Impact */}
        <SalaryImpactCard gaps={active.gaps} />

        {/* Gap cards */}
        {active.gaps.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground">All Skill Gaps</h2>
              {active.learningPlan.length === 0 && (
                <button
                  type="button"
                  onClick={generatePlan}
                  disabled={generatingPlan}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 border border-teal-500/20 hover:border-teal-500/40 bg-teal-500/[0.08] rounded-xl px-3 py-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {generatingPlan ? 'Generating…' : 'Generate Learning Plan'}
                </button>
              )}
            </div>
            {planError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-4">
                {planError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.gaps.map((gap, i) => (
                <SkillGapCard
                  key={gap.skill}
                  gap={gap}
                  plan={active.learningPlan.find(p => p.skill === gap.skill)}
                  index={i}
                  learningStyle={learningStyle}
                  assessmentId={active.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Learning timeline */}
        {active.learningPlan.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold text-foreground mb-4">Learning Plan Timeline</h2>
            <LearningPlanTimeline plan={active.learningPlan} />
          </div>
        )}

      </> /* end dashboard view */}
    </div>
  )
}
