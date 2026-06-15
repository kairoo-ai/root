'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseRoadmapOutput } from '@/engines/ai/parsers/roadmap-parser'

const TIMELINE_OPTIONS = [
  { weeks: 4,  label: '4 weeks',  sub: 'Sprint' },
  { weeks: 8,  label: '8 weeks',  sub: 'Short' },
  { weeks: 12, label: '12 weeks', sub: 'Standard' },
  { weeks: 24, label: '24 weeks', sub: 'Deep dive' },
]

const FOCUS_OPTIONS = [
  { id: 'technical',      label: 'Technical skills' },
  { id: 'soft',           label: 'Soft skills' },
  { id: 'portfolio',      label: 'Portfolio projects' },
  { id: 'networking',     label: 'Networking' },
  { id: 'certifications', label: 'Certifications' },
]

const STEPS = ['Goal', 'Timeline', 'Focus areas', 'Review']

interface Props {
  defaultGoal: string
  defaultTargetRole: string
}

export function RoadmapWizard({ defaultGoal, defaultTargetRole }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(defaultGoal)
  const [targetRole, setTargetRole] = useState(defaultTargetRole)
  const [weeks, setWeeks] = useState(12)
  const [focus, setFocus] = useState<string[]>(['technical'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleFocus = (id: string) =>
    setFocus((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])

  const canNext =
    (step === 0 && goal.trim().length > 3) ||
    (step === 1 && weeks > 0) ||
    (step === 2 && focus.length > 0) ||
    step === 3

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureId: 'pathGeneration',
          inputs: {
            skill: goal,
            timeline: `${weeks} weeks`,
            focusAreas: focus.join(', '),
          },
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to generate roadmap' }))
        throw new Error((err as { error: string }).error)
      }

      // Read full streamed response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let raw = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          raw += decoder.decode(value, { stream: true })
        }
      }

      const plan = parseRoadmapOutput(raw, targetRole || goal, weeks)
      const title = targetRole ? `Path to ${targetRole}` : goal.slice(0, 60)

      const saveRes = await fetch('/api/roadmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, goal, planJson: plan }),
      })
      if (!saveRes.ok) throw new Error('Failed to save roadmap')
      const { id } = (await saveRes.json()) as { id: string }
      router.push(`/roadmaps/${id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors',
              i < step ? 'bg-teal-500 text-black' :
              i === step ? 'border-2 border-teal-500 text-teal-400' :
              'border border-border text-muted-foreground/40'
            )}>
              {i < step ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span className={cn('text-xs font-medium', i === step ? 'text-foreground' : 'text-muted-foreground/50')}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.18 }}
        >
          {/* Step 0: Goal */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground">What&apos;s your career goal?</h2>
              <p className="text-sm text-muted-foreground">Be specific — this drives the entire roadmap.</p>
              <input
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                placeholder="e.g. Become a senior machine learning engineer"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                autoFocus
              />
              <input
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                placeholder="Target role (optional, e.g. ML Engineer)"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
          )}

          {/* Step 1: Timeline */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground">How long do you have?</h2>
              <p className="text-sm text-muted-foreground">This sets the pace and depth of your roadmap.</p>
              <div className="grid grid-cols-2 gap-3">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt.weeks}
                    onClick={() => setWeeks(opt.weeks)}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-all cursor-pointer',
                      weeks === opt.weeks
                        ? 'border-teal-500/50 bg-teal-500/10'
                        : 'border-border bg-card hover:border-border/80'
                    )}
                  >
                    <div className="text-base font-bold text-foreground">{opt.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Focus areas */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground">What do you want to focus on?</h2>
              <p className="text-sm text-muted-foreground">Pick everything that matters to you.</p>
              <div className="space-y-2">
                {FOCUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleFocus(opt.id)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-xl border p-3.5 text-sm font-medium transition-all cursor-pointer',
                      focus.includes(opt.id)
                        ? 'border-teal-500/50 bg-teal-500/10 text-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-border/80'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0',
                      focus.includes(opt.id) ? 'bg-teal-500 border-teal-500' : 'border-border'
                    )}>
                      {focus.includes(opt.id) && <Check className="w-2.5 h-2.5 text-black" />}
                    </div>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-foreground">Ready to generate</h2>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal</span>
                  <span className="text-foreground font-medium text-right max-w-[60%]">{goal}</span>
                </div>
                {targetRole && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target role</span>
                    <span className="text-foreground font-medium">{targetRole}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timeline</span>
                  <span className="text-foreground font-medium">{weeks} weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Focus</span>
                  <span className="text-foreground font-medium text-right max-w-[60%]">{focus.join(', ')}</span>
                </div>
              </div>
              {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg p-3">{error}</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : undefined}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext}
            className="flex items-center gap-2 text-xs font-semibold bg-teal-500 text-black px-4 py-2.5 rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Continue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold bg-teal-500 text-black px-5 py-2.5 rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                Generating…
              </span>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" /> Generate roadmap</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
