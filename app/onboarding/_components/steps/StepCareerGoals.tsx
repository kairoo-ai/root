'use client'

import { useState, useRef } from 'react'
import { JOB_TITLES } from '@/lib/data/static/job-titles'
import type { WizardData } from '../OnboardingWizard'

const TIMELINES = ['3 months', '6 months', '1 year', '2 years', '3+ years']

const ROLE_SUGGESTIONS: Record<string, string[]> = {
  'Software Engineer': ['Senior Software Engineer', 'Engineering Manager', 'Staff Engineer', 'Tech Lead'],
  'Frontend Developer': ['Senior Frontend Developer', 'Full Stack Developer', 'UI Engineer', 'Frontend Architect'],
  'Backend Developer': ['Senior Backend Developer', 'Full Stack Developer', 'Software Architect', 'Staff Engineer'],
  'Data Analyst': ['Senior Data Analyst', 'Data Scientist', 'Analytics Engineer', 'Business Intelligence Engineer'],
  'Product Manager': ['Senior Product Manager', 'Director of Product', 'VP of Product', 'Chief Product Officer'],
  'Designer': ['Senior Designer', 'Lead Designer', 'UX Director', 'Product Design Lead'],
  'Marketing Manager': ['Senior Marketing Manager', 'Director of Marketing', 'VP of Marketing', 'CMO'],
  'DevOps Engineer': ['Senior DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer', 'Engineering Manager'],
}

function getSuggestions(currentRole: string): string[] {
  if (!currentRole) return []
  const key = Object.keys(ROLE_SUGGESTIONS).find(k =>
    currentRole.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(currentRole.toLowerCase())
  )
  return key ? ROLE_SUGGESTIONS[key] : []
}

interface ComboboxProps {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  id: string
}

function Combobox({ value, onChange, options, placeholder, id }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [inputVal, setInputVal] = useState(value)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filtered = inputVal.trim()
    ? options.filter(o => o.toLowerCase().includes(inputVal.toLowerCase())).slice(0, 8)
    : []

  const handleInput = (v: string) => {
    setInputVal(v)
    onChange(v)
  }

  const handleSelect = (v: string) => {
    setInputVal(v)
    onChange(v)
    setOpen(false)
  }

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setOpen(false), 150)
  }

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current)
    if (inputVal.trim()) setOpen(true)
  }

  return (
    <div className="relative" id={id}>
      <input
        value={inputVal}
        onChange={e => { handleInput(e.target.value); setOpen(true) }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {filtered.map(opt => (
            <div
              key={opt}
              onMouseDown={() => handleSelect(opt)}
              className="px-3 py-2 hover:bg-zinc-700 cursor-pointer text-sm text-zinc-200"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  data: WizardData
  onNext: (d: Partial<WizardData>) => void
  onBack: () => void
}

export function StepCareerGoals({ data, onNext, onBack }: Props) {
  const [targetRole, setTargetRole] = useState(data.targetRole)
  const [targetTimeline, setTargetTimeline] = useState(data.targetTimeline)
  const [careerGoalShort, setCareerGoalShort] = useState(data.careerGoalShort)
  const [careerGoalLong, setCareerGoalLong] = useState(data.careerGoalLong)
  const [targetSalary, setTargetSalary] = useState(data.targetSalary)

  const suggestions = getSuggestions(data.currentRole)

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-white">Where do you want to go?</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Every tool will use this to give goal-aligned advice.</p>
      </div>

      <div className="space-y-4">
        {/* Target role */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Target role</label>
          <Combobox
            id="targetRole"
            value={targetRole}
            onChange={setTargetRole}
            options={JOB_TITLES}
            placeholder="Search or type a target role..."
          />
          {suggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] text-zinc-500 mb-1.5">Common next steps for your background</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => setTargetRole(s)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                      targetRole === s
                        ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2">Timeline</label>
          <div className="flex flex-wrap gap-2">
            {TIMELINES.map(t => (
              <button
                key={t}
                onClick={() => setTargetTimeline(t)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                  targetTimeline === t
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* One-sentence goal */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            One-sentence goal{' '}
            <span className="text-zinc-500 font-normal">(shown on dashboard)</span>
          </label>
          <input
            value={careerGoalShort}
            onChange={e => setCareerGoalShort(e.target.value)}
            placeholder="e.g. Transition from engineering to PM at a Series B startup"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
          />
        </div>

        {/* Detailed goal */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            Detailed goal{' '}
            <span className="text-zinc-500 font-normal">(optional — more context = better AI)</span>
          </label>
          <textarea
            value={careerGoalLong}
            onChange={e => setCareerGoalLong(e.target.value)}
            placeholder="Tell {process.env.APP_NAME || "Kairoo"} more about what success looks like for you, why you want this change, and any constraints..."
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none"
          />
        </div>

        {/* Target salary */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
            Target salary{' '}
            <span className="text-zinc-500 font-normal">(optional)</span>
          </label>
          <input
            value={targetSalary}
            onChange={e => setTargetSalary(e.target.value)}
            placeholder="e.g. 30 LPA, $120k, £80k"
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-none text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-zinc-700"
        >
          Back
        </button>
        <button
          onClick={() => onNext({ targetRole, targetTimeline, careerGoalShort, careerGoalLong, targetSalary })}
          className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-medium py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
        >
          Next: Your Background
        </button>
      </div>
    </div>
  )
}
