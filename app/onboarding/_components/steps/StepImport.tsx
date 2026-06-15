'use client'
import { useState } from 'react'
import { FileText, Github, Linkedin, GraduationCap, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImportCard {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  inputType: 'file-pdf' | 'file-zip' | 'paste' | 'username'
  placeholder: string
  accept?: string
}

const QUICK_IMPORTS: ImportCard[] = [
  { id: 'resume-pdf', title: 'Resume', subtitle: 'Upload your resume PDF', icon: FileText, inputType: 'file-pdf', placeholder: '', accept: '.pdf' },
  { id: 'linkedin-paste', title: 'LinkedIn', subtitle: 'Paste your LinkedIn profile text', icon: Linkedin, inputType: 'paste', placeholder: 'On LinkedIn, click More on your profile → Copy profile to clipboard, then paste here...' },
  { id: 'github', title: 'GitHub', subtitle: 'Enter your GitHub username', icon: Github, inputType: 'username', placeholder: 'e.g. torvalds' },
  { id: 'learning-paste', title: 'Certificates', subtitle: 'Paste your certifications and courses', icon: GraduationCap, inputType: 'paste', placeholder: 'e.g. AWS Solutions Architect (2024), Google Data Analytics Certificate, Coursera ML Specialisation...' },
]

type CardStatus = { status: 'idle' | 'loading' | 'done' | 'error'; message?: string }

interface Props {
  onNext: () => void
  onBack: () => void
}

export function StepImport({ onNext, onBack }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, File>>({})
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({})

  const setStatus = (id: string, s: CardStatus) => setStatuses(p => ({ ...p, [id]: s }))

  const runImport = async (card: ImportCard) => {
    setStatus(card.id, { status: 'loading' })
    try {
      let res: Response
      if (card.inputType === 'file-pdf' || card.inputType === 'file-zip') {
        const file = files[card.id]
        if (!file) { setStatus(card.id, { status: 'error', message: 'Please select a file first' }); return }
        const fd = new FormData()
        fd.append('source', card.id)
        fd.append('file', file)
        res = await fetch('/api/connectors/upload', { method: 'POST', body: fd })
      } else {
        const input = inputs[card.id]?.trim()
        if (!input) { setStatus(card.id, { status: 'error', message: 'Please enter a value first' }); return }
        res = await fetch(`/api/connectors/${card.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input }),
        })
      }
      const data = await res.json() as { success?: boolean; summary?: string; error?: string }
      if (!res.ok || !data.success) {
        setStatus(card.id, { status: 'error', message: data.error ?? 'Import failed' })
      } else {
        setStatus(card.id, { status: 'done', message: data.summary ?? 'Imported successfully' })
        setExpanded(null)
      }
    } catch {
      setStatus(card.id, { status: 'error', message: 'Network error — please try again' })
    }
  }

  const doneCount = Object.values(statuses).filter(s => s.status === 'done').length

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-foreground">Import your career history</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Skip filling things in manually — import from any platform to auto-fill the next steps. All optional.
        </p>
      </div>

      <div className="space-y-2.5">
        {QUICK_IMPORTS.map(card => {
          const st = statuses[card.id]
          const isExpanded = expanded === card.id
          const isDone = st?.status === 'done'

          return (
            <div key={card.id} className={cn('rounded-xl border transition-colors', isDone ? 'border-teal-500/30 bg-teal-500/5' : 'border-border bg-card')}>
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : card.id)}
                className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer text-left"
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', isDone ? 'bg-teal-500/20' : 'bg-muted/30')}>
                  {isDone
                    ? <CheckCircle className="w-4 h-4 text-teal-400" />
                    : <card.icon className="w-4 h-4 text-muted-foreground" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{card.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {isDone ? (st.message ?? 'Imported') : card.subtitle}
                  </div>
                </div>
                {isDone
                  ? <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full shrink-0">Done</span>
                  : isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                }
              </button>

              {isExpanded && !isDone && (
                <div className="px-4 pb-4 space-y-2.5">
                  {(card.inputType === 'file-pdf' || card.inputType === 'file-zip') ? (
                    <label className={cn(
                      'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors',
                      files[card.id] ? 'border-teal-500/40 bg-teal-500/5' : 'border-border hover:border-teal-500/30'
                    )}>
                      <card.icon className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {files[card.id] ? files[card.id].name : `Click to select ${card.accept} file`}
                      </span>
                      <input
                        type="file"
                        accept={card.accept}
                        className="sr-only"
                        onChange={e => { const f = e.target.files?.[0]; if (f) setFiles(p => ({ ...p, [card.id]: f })) }}
                      />
                    </label>
                  ) : card.inputType === 'paste' ? (
                    <textarea
                      value={inputs[card.id] ?? ''}
                      onChange={e => setInputs(p => ({ ...p, [card.id]: e.target.value }))}
                      placeholder={card.placeholder}
                      rows={4}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 resize-none transition-colors"
                    />
                  ) : (
                    <input
                      value={inputs[card.id] ?? ''}
                      onChange={e => setInputs(p => ({ ...p, [card.id]: e.target.value }))}
                      placeholder={card.placeholder}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors"
                    />
                  )}
                  {st?.status === 'error' && (
                    <p className="text-xs text-red-400">{st.message}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => runImport(card)}
                    disabled={st?.status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 bg-teal-500 text-black font-bold py-2 rounded-xl hover:bg-teal-400 transition-colors text-sm disabled:opacity-70 cursor-pointer"
                  >
                    {st?.status === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Importing...</> : `Import from ${card.title}`}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {doneCount > 0 && (
        <p className="text-xs text-teal-400 mt-3 text-center">
          {doneCount} source{doneCount > 1 ? 's' : ''} imported — your profile is pre-filled for the next steps.
        </p>
      )}

      <div className="flex items-center gap-3 mt-5">
        <button type="button" onClick={onBack} className="flex-none text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-border">Back</button>
        <button type="button" onClick={onNext} className="flex-1 bg-teal-500 text-black font-bold py-2.5 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer text-sm">
          {doneCount > 0 ? 'Continue with imported data' : 'Skip — fill in manually'}
        </button>
      </div>
    </div>
  )
}
