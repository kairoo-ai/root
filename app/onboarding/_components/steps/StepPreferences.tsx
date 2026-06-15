'use client'
import { useState } from 'react'
import { Wifi, Building2, Home, Hammer, BookOpen, Play, Users, Loader2 } from 'lucide-react'
import { StatefulButton } from '@/components/aceternity'

interface Props {
  data: { workStyle: string; learningStyle: string }
  onNext: (d: { workStyle: string; learningStyle: string }) => void
  onBack: () => void
  saving: boolean
}

const WORK_STYLES = [
  { value: 'remote', label: 'Remote', desc: 'Fully remote, location-independent', icon: Wifi },
  { value: 'hybrid', label: 'Hybrid', desc: 'Mix of office and remote', icon: Home },
  { value: 'onsite', label: 'On-site', desc: 'Office-first environment', icon: Building2 },
]
const LEARN_STYLES = [
  { value: 'hands-on', label: 'Hands-on', desc: 'Learn by doing, projects, practice', icon: Hammer },
  { value: 'reading', label: 'Reading', desc: 'Books, articles, documentation', icon: BookOpen },
  { value: 'visual', label: 'Visual', desc: 'Videos, diagrams, presentations', icon: Play },
  { value: 'social', label: 'Social', desc: 'Courses, mentors, communities', icon: Users },
]

export function StepPreferences({ data, onNext, onBack, saving }: Props) {
  const [workStyle, setWorkStyle] = useState(data.workStyle)
  const [learningStyle, setLearningStyle] = useState(data.learningStyle)

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-foreground">Your preferences</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{process.env.APP_NAME || "Kairoo"} will tailor advice to how you work and learn best.</p>
      </div>
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2">Work style preference</label>
          <div className="space-y-2">
            {WORK_STYLES.map(w => (
              <button key={w.value} onClick={() => setWorkStyle(w.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  workStyle === w.value ? 'border-teal-500/40 bg-teal-500/5 text-foreground' : 'border-border text-muted-foreground hover:border-teal-500/20'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${workStyle === w.value ? 'bg-teal-500/15' : 'bg-muted/30'}`}>
                  <w.icon className={`w-4 h-4 ${workStyle === w.value ? 'text-teal-400' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <div className="text-xs font-semibold">{w.label}</div>
                  <div className="text-[11px] text-muted-foreground">{w.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2">How do you learn best?</label>
          <div className="grid grid-cols-2 gap-2">
            {LEARN_STYLES.map(l => (
              <button key={l.value} onClick={() => setLearningStyle(l.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  learningStyle === l.value ? 'border-teal-500/40 bg-teal-500/5 text-teal-400' : 'border-border text-muted-foreground hover:border-teal-500/20'
                }`}>
                <l.icon className={`w-4 h-4 ${learningStyle === l.value ? 'text-teal-400' : 'text-muted-foreground'}`} />
                <span className="text-[11px] font-semibold">{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button onClick={onBack} className="flex-none text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-border">Back</button>
        <StatefulButton
          onClick={() => onNext({ workStyle, learningStyle })}
          state={saving ? 'loading' : 'idle'}
          size="lg"
          className="flex-1"
          successText="Profile saved!"
        >
          Complete Setup
        </StatefulButton>
      </div>
    </div>
  )
}
