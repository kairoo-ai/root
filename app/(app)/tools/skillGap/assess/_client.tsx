'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Zap, Minus } from 'lucide-react'
import { LampEffect, TypewriterEffect } from '@/components/aceternity'
import type { SkillEntry } from '@/data/schema'

interface Props {
  prefillCurrentRole: string
  prefillTargetRole: string
  prefillSkills: string[]
}

const SKILL_CATEGORIES = [
  { category: 'Technical', suggestions: ['Python', 'SQL', 'Cloud (AWS/GCP/Azure)', 'System Design', 'APIs / Backend', 'Frontend / React', 'Data Analysis', 'DevOps / CI-CD'] },
  { category: 'Leadership', suggestions: ['Project Management', 'Team Leadership', 'Stakeholder Management', 'Hiring / Interviews', 'OKR Setting'] },
  { category: 'Communication', suggestions: ['Written Communication', 'Presentations', 'Negotiation', 'Public Speaking'] },
  { category: 'Domain', suggestions: ['Product Strategy', 'Market Research', 'Financial Modeling', 'UX / Design Thinking', 'Legal / Compliance'] },
]

function LevelSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-4">{value}</span>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 accent-teal-500 cursor-pointer"
      />
      <span className="text-[10px] text-muted-foreground w-4 text-right">5</span>
    </div>
  )
}

export function AssessPageClient({ prefillCurrentRole, prefillTargetRole, prefillSkills }: Props) {
  const router = useRouter()
  const [currentRole, setCurrentRole] = useState(prefillCurrentRole)
  const [targetRole, setTargetRole] = useState(prefillTargetRole)
  const [skills, setSkills] = useState<SkillEntry[]>(() =>
    prefillSkills.slice(0, 8).map(name => ({ name, level: 2, category: 'Technical' }))
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addSkill = (name: string, category: string) => {
    if (skills.find(s => s.name === name)) return
    setSkills(prev => [...prev, { name, level: 2, category }])
  }

  const removeSkill = (name: string) => {
    setSkills(prev => prev.filter(s => s.name !== name))
  }

  const updateLevel = (name: string, level: number) => {
    setSkills(prev => prev.map(s => s.name === name ? { ...s, level } : s))
  }

  const canSubmit = currentRole.trim() && targetRole.trim() && skills.length >= 3

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/skill-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRole, targetRole, currentSkills: skills }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed' })) as { error: string }
        throw new Error(err.error)
      }
      const data = await res.json() as { id: string }
      router.push(`/tools/skillGap?id=${data.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <LampEffect className="mb-8 -mx-6 px-6 pt-4 pb-2 rounded-2xl">
        <TypewriterEffect
          words={[
            { text: 'Find' },
            { text: 'your' },
            { text: 'skill' },
            { text: 'gaps' },
            { text: 'and' },
            { text: 'close' },
            { text: 'them' },
            { text: 'fast', className: 'text-teal-400' },
          ]}
          className="text-2xl font-bold justify-center"
        />
        <p className="text-sm text-muted-foreground mt-2 text-center">Rate your current skills and define your target role - AI will map the gap.</p>
      </LampEffect>

      <div className="space-y-6">
        {/* Roles */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground">Roles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Current Role <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Target Role <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Engineering Manager"
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Skill rating */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Your Current Skills</h2>
            <p className="text-[11px] text-muted-foreground">Minimum 3 skills</p>
          </div>

          {/* Category suggestion pills */}
          <div className="space-y-3">
            {SKILL_CATEGORIES.map(cat => (
              <div key={cat.category}>
                <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">{cat.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.suggestions.map(s => {
                    const added = skills.some(sk => sk.name === s)
                    return (
                      <button
                        key={s}
                        onClick={() => added ? removeSkill(s) : addSkill(s, cat.category)}
                        className={`text-[11px] font-medium border rounded-full px-2.5 py-0.5 cursor-pointer transition-all ${added
                            ? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
                            : 'bg-background border-border text-muted-foreground hover:border-teal-500/30 hover:text-foreground'
                          }`}
                      >
                        {added ? '✓ ' : '+ '}{s}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Skill sliders */}
          <AnimatePresence>
            {skills.length > 0 && (
              <motion.div className="space-y-3 pt-2 border-t border-border">
                <p className="text-[11px] font-semibold text-muted-foreground pt-1">Rate your level (0 = beginner, 5 = expert)</p>
                {skills.map(skill => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-36 shrink-0">
                      <p className="text-xs font-medium text-foreground truncate">{skill.name}</p>
                      <p className="text-[10px] text-muted-foreground">{skill.category}</p>
                    </div>
                    <div className="flex-1">
                      <LevelSlider value={skill.level} onChange={v => updateLevel(skill.name, v)} />
                    </div>
                    <button
                      onClick={() => removeSkill(skill.name)}
                      className="shrink-0 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all cursor-pointer ${canSubmit && !loading
              ? 'bg-teal-500 text-black hover:bg-teal-400'
              : 'bg-teal-500/20 text-teal-400/50 cursor-not-allowed'
            }`}
        >
          <Zap className="w-4 h-4" />
          {loading ? 'Analysing with AI…' : 'Analyse My Skill Gap'}
        </button>
      </div>
    </div>
  )
}
