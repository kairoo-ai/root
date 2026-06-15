'use client'

import { useState, useTransition } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import {
  Save, Loader2, Briefcase, Target, Sparkles, Link2,
  FileText, CheckCircle2, AlertCircle,
} from 'lucide-react'
import type { UserProfile } from '@/data/repositories/profiles.repo'
import { saveProfile } from '../actions'

interface ProfileFormProps {
  profile: UserProfile | null
}

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
  'Design', 'Consulting', 'E-commerce', 'Media', 'Government', 'Other',
]
const TIMELINES = ['3 months', '6 months', '12 months', '18 months', '2+ years']
const WORK_STYLES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
]
const LEARNING_STYLES = [
  { value: 'visual', label: 'Visual' },
  { value: 'reading', label: 'Reading' },
  { value: 'hands-on', label: 'Hands-on' },
]
const COMMON_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL',
  'Product Management', 'Data Analysis', 'Leadership', 'Communication',
  'Project Management', 'Machine Learning', 'Design Thinking', 'Agile/Scrum',
]

const inputClass =
  'w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 transition-colors'
const selectClass =
  'w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-teal-500/50 cursor-pointer transition-colors'
const textareaClass =
  'w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 resize-none transition-colors'

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{children}</label>
}

function SectionHeading({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
      <Icon className="w-4 h-4 text-teal-400" />
      <h2 className="text-sm font-bold text-foreground">{label}</h2>
    </div>
  )
}

function PillToggle({
  value, current, onToggle, label,
}: { value: string; current: string | null | undefined; onToggle: (v: string) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(value)}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${current === value
          ? 'bg-teal-500 border-teal-500 text-black'
          : 'bg-background border-border text-muted-foreground hover:border-teal-500/50 hover:text-foreground'
        }`}
    >
      {label}
    </button>
  )
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { user } = useUser()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [customSkill, setCustomSkill] = useState('')

  const [form, setForm] = useState({
    currentRole: profile?.currentRole ?? '',
    currentCompany: profile?.currentCompany ?? '',
    yearsExperience: profile?.yearsExperience ?? ('' as number | ''),
    industry: profile?.industry ?? '',
    location: profile?.location ?? '',
    targetRole: profile?.targetRole ?? '',
    targetTimeline: profile?.targetTimeline ?? '',
    careerGoalShort: profile?.careerGoalShort ?? '',
    careerGoalLong: profile?.careerGoalLong ?? '',
    skills: (profile?.skills as string[] | undefined) ?? [],
    workStyle: profile?.workStyle ?? '',
    learningStyle: profile?.learningStyle ?? '',
    linkedinUrl: profile?.linkedinUrl ?? '',
    githubUrl: profile?.githubUrl ?? '',
    portfolioUrl: profile?.portfolioUrl ?? '',
    resumeText: profile?.resumeText ?? '',
  })

  function patch(updates: Partial<typeof form>) {
    setForm(prev => ({ ...prev, ...updates }))
    setStatus('idle')
  }

  function toggleSkill(skill: string) {
    const skills = form.skills
    patch({ skills: skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill] })
  }

  function addCustomSkill() {
    const trimmed = customSkill.trim()
    if (trimmed && !form.skills.includes(trimmed)) {
      patch({ skills: [...form.skills, trimmed] })
    }
    setCustomSkill('')
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveProfile({
        ...form,
        yearsExperience: form.yearsExperience === '' ? undefined : Number(form.yearsExperience),
        skills: form.skills,
      })
      if (result.ok) {
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setErrorMsg(result.error ?? 'Unknown error')
      }
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-2xl">

      {/* Identity card (read-only Clerk data) */}
      <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-teal-500 flex items-center justify-center text-xl font-bold text-white shrink-0">
          {user?.firstName?.[0] ?? user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ?? 'K'}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-foreground truncate">{user?.fullName ?? `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} User`}</div>
          <div className="text-sm text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</div>
          <div className="text-xs text-teal-400 mt-0.5">Name & email managed by Clerk</div>
        </div>
      </div>

      {/* Current situation */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <SectionHeading icon={Briefcase} label="Where you are now" />
        <div className="space-y-4">
          <div>
            <Label>Current role / title</Label>
            <input className={inputClass} placeholder="e.g. Software Engineer" value={form.currentRole} onChange={e => patch({ currentRole: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Company</Label>
              <input className={inputClass} placeholder="e.g. Acme Corp" value={form.currentCompany} onChange={e => patch({ currentCompany: e.target.value })} />
            </div>
            <div>
              <Label>Years of experience</Label>
              <input
                type="number" min={0} max={50}
                className={inputClass} placeholder="3"
                value={form.yearsExperience}
                onChange={e => patch({ yearsExperience: e.target.value === '' ? '' : parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Industry</Label>
              <select className={selectClass} value={form.industry} onChange={e => patch({ industry: e.target.value })}>
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <Label>Location</Label>
              <input className={inputClass} placeholder="City, Country" value={form.location} onChange={e => patch({ location: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Target */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <SectionHeading icon={Target} label="Where you're going" />
        <div className="space-y-4">
          <div>
            <Label>Target role</Label>
            <input className={inputClass} placeholder="e.g. Senior Product Manager, CTO" value={form.targetRole} onChange={e => patch({ targetRole: e.target.value })} />
          </div>
          <div>
            <Label>Target timeline</Label>
            <div className="flex gap-2 flex-wrap">
              {TIMELINES.map(t => (
                <PillToggle key={t} value={t} current={form.targetTimeline} onToggle={v => patch({ targetTimeline: v })} label={t} />
              ))}
            </div>
          </div>
          <div>
            <Label>Career goal - one sentence</Label>
            <input className={inputClass} placeholder="e.g. Become a Senior PM at a Series B startup within 12 months" value={form.careerGoalShort} onChange={e => patch({ careerGoalShort: e.target.value })} />
          </div>
          <div>
            <Label>Career goal - full description (optional)</Label>
            <textarea className={textareaClass} rows={4} placeholder="Describe your long-term career vision, motivations, and what success looks like for you…" value={form.careerGoalLong} onChange={e => patch({ careerGoalLong: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preferred work style</Label>
              <div className="flex gap-2">
                {WORK_STYLES.map(ws => (
                  <PillToggle key={ws.value} value={ws.value} current={form.workStyle} onToggle={v => patch({ workStyle: v })} label={ws.label} />
                ))}
              </div>
            </div>
            <div>
              <Label>Learning style</Label>
              <div className="flex gap-2">
                {LEARNING_STYLES.map(ls => (
                  <PillToggle key={ls.value} value={ls.value} current={form.learningStyle} onToggle={v => patch({ learningStyle: v })} label={ls.label} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <SectionHeading icon={Sparkles} label="Skills" />
        <div className="space-y-4">
          <div>
            <Label>Your key skills</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {COMMON_SKILLS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${form.skills.includes(skill)
                      ? 'bg-teal-500 border-teal-500 text-black'
                      : 'bg-background border-border text-muted-foreground hover:border-teal-500/50 hover:text-foreground'
                    }`}
                >
                  {skill}
                </button>
              ))}
              {form.skills.filter(s => !COMMON_SKILLS.includes(s)).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-teal-500 border-teal-500 text-black cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Add a custom skill</Label>
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Type a skill and press Enter"
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill() } }}
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 rounded-xl bg-teal-500 text-black text-xs font-bold hover:bg-teal-400 transition-colors cursor-pointer shrink-0"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <SectionHeading icon={Link2} label="Links" />
        <div className="space-y-4">
          <div>
            <Label>LinkedIn URL</Label>
            <input className={inputClass} placeholder="https://linkedin.com/in/yourname" value={form.linkedinUrl} onChange={e => patch({ linkedinUrl: e.target.value })} />
          </div>
          <div>
            <Label>GitHub URL</Label>
            <input className={inputClass} placeholder="https://github.com/yourhandle" value={form.githubUrl} onChange={e => patch({ githubUrl: e.target.value })} />
          </div>
          <div>
            <Label>Portfolio / personal site</Label>
            <input className={inputClass} placeholder="https://yoursite.com" value={form.portfolioUrl} onChange={e => patch({ portfolioUrl: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <SectionHeading icon={FileText} label="Resume (optional)" />
        <div>
          <Label>Paste your resume text</Label>
          <textarea
            className={textareaClass}
            rows={8}
            placeholder={`Paste your resume here. ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} uses this to give you more personalised guidance and skill gap analysis.`}
            value={form.resumeText}
            onChange={e => patch({ resumeText: e.target.value })}
          />
        </div>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-4">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            {status === 'saved' && (
              <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully
              </span>
            )}
            {status === 'error' && (
              <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 bg-teal-500 text-black px-5 py-2 rounded-xl text-xs font-bold hover:bg-teal-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {isPending ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
