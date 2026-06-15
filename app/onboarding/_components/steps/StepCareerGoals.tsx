'use client'
import { useState } from 'react'
import { Target } from 'lucide-react'
import { Combobox } from '../Combobox'
import { JOB_TITLES } from '@/lib/data/static/job-titles'
import { cn } from '@/lib/utils'

const TIMELINES = ['3 months', '6 months', '1 year', '18 months', '2 years', '3+ years']

// Smart transition suggestions keyed by partial current role match
const SUGGESTIONS: Record<string, string[]> = {
  'software engineer': ['Senior Software Engineer', 'Staff Engineer', 'Engineering Manager', 'Principal Engineer', 'Solutions Architect'],
  'frontend': ['Senior Frontend Engineer', 'Staff Engineer', 'Engineering Manager', 'Product Engineer'],
  'backend': ['Senior Backend Engineer', 'Staff Engineer', 'Engineering Manager', 'Solutions Architect'],
  'data analyst': ['Senior Data Analyst', 'Data Scientist', 'Analytics Manager', 'Head of Analytics'],
  'data scientist': ['Senior Data Scientist', 'ML Engineer', 'Research Scientist', 'Head of Data'],
  'product manager': ['Senior Product Manager', 'Group Product Manager', 'Head of Product', 'VP Product'],
  'designer': ['Senior Designer', 'Lead Designer', 'Head of Design', 'Creative Director'],
  'consultant': ['Senior Consultant', 'Manager', 'Senior Manager', 'Director'],
  'analyst': ['Senior Analyst', 'Associate', 'Manager', 'Lead Analyst'],
  'marketing': ['Senior Marketing Manager', 'Head of Marketing', 'VP Marketing', 'CMO'],
  'sales': ['Senior Account Executive', 'Sales Manager', 'VP Sales', 'Head of Business Development'],
  'student': ['Software Engineer', 'Product Manager', 'Data Analyst', 'Business Analyst', 'UX Designer'],
  'fresher': ['Software Engineer', 'Associate Software Engineer', 'Junior Developer', 'Graduate Trainee'],
}

function getSuggestions(currentRole: string): string[] {
  if (!currentRole) return []
  const lower = currentRole.toLowerCase()
  for (const [key, vals] of Object.entries(SUGGESTIONS)) {
    if (lower.includes(key)) return vals
  }
  return []
}

interface FormData {
  targetRole: string
  targetTimeline: string
  careerGoalShort: string
  careerGoalLong: string
}

interface Props {
  data: FormData
  currentRole?: string
  onNext: (d: FormData) => void
  onBack: () => void
}

export function StepCareerGoals({ data, currentRole = '', onNext, onBack }: Props) {
  const [form, setForm] = useState<FormData>(data)
  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }))
  const suggestions = getSuggestions(currentRole)

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-foreground">Where do you want to go?</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Every tool will use this to give goal-aligned advice.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Target className="w-3 h-3" /> Target role
          </label>
          {suggestions.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] text-muted-foreground/60 mb-1.5">Suggested based on your background</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map(s => (
                  <button key={s} type="button" onClick={() => set('targetRole', s)}
                    className={cn('text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer', form.targetRole === s
                      ? 'bg-teal-500/15 border-teal-500/50 text-teal-400'
                      : 'border-border text-muted-foreground hover:border-teal-500/30')}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Combobox
            value={form.targetRole}
            onChange={v => set('targetRole', v)}
            options={JOB_TITLES}
            placeholder="Search all roles or type a custom one..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2">Timeline</label>
          <div className="flex flex-wrap gap-2">
            {TIMELINES.map(t => (
              <button key={t} type="button" onClick={() => set('targetTimeline', t)}
                className={cn('text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer', form.targetTimeline === t
                  ? 'bg-teal-500/15 border-teal-500/50 text-teal-400'
                  : 'border-border text-muted-foreground hover:border-teal-500/30')}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            One-sentence goal <span className="font-normal text-muted-foreground/50">(shown on your dashboard)</span>
          </label>
          <input value={form.careerGoalShort} onChange={e => set('careerGoalShort', e.target.value)}
            placeholder="e.g. Transition from engineering to PM at a Series B startup within 12 months"
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Detailed goal <span className="font-normal text-muted-foreground/50">(optional — more context = better AI output)</span>
          </label>
          <textarea value={form.careerGoalLong} onChange={e => set('careerGoalLong', e.target.value)}
            placeholder="Describe what success looks like, why you want this change, constraints, motivations..."
            rows={3}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 resize-none transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button type="button" onClick={onBack} className="flex-none text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-border">Back</button>
        <button type="button" onClick={() => onNext(form)} className="flex-1 bg-teal-500 text-black font-bold py-2.5 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer text-sm">Next: Background</button>
      </div>
    </div>
  )
}
