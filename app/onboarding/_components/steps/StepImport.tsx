'use client'

import { useState, useRef } from 'react'
import { FileText, Linkedin, Github, GraduationCap, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react'
import type { WizardData } from '../OnboardingWizard'

interface Props {
  data: WizardData
  onChange: (d: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

type CardId = 'resume' | 'linkedin' | 'github' | 'certificates'

interface CardConfig {
  id: CardId
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const CARDS: CardConfig[] = [
  { id: 'resume', label: 'Resume PDF', description: 'Upload your resume PDF', icon: FileText },
  { id: 'linkedin', label: 'LinkedIn Text', description: 'Paste your LinkedIn profile text', icon: Linkedin },
  { id: 'github', label: 'GitHub', description: 'Enter your GitHub username', icon: Github },
  { id: 'certificates', label: 'Certificates', description: 'Paste your certifications', icon: GraduationCap },
]

export function StepImport({ onNext, onBack }: Props) {
  const [expanded, setExpanded] = useState<Set<CardId>>(new Set())
  const [imported, setImported] = useState<Set<CardId>>(new Set())
  const [loading, setLoading] = useState<Set<CardId>>(new Set())
  const [errors, setErrors] = useState<Record<CardId, string>>({} as Record<CardId, string>)
  const [textValues, setTextValues] = useState<Record<CardId, string>>({
    resume: '', linkedin: '', github: '', certificates: '',
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const toggleExpand = (id: CardId) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const setLoading_ = (id: CardId, val: boolean) => {
    setLoading(prev => {
      const next = new Set(prev)
      if (val) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const setError = (id: CardId, msg: string) => {
    setErrors(prev => ({ ...prev, [id]: msg }))
  }

  const markImported = (id: CardId) => {
    setImported(prev => new Set(prev).add(id))
    setErrors(prev => ({ ...prev, [id]: '' }))
  }

  const handleImport = async (id: CardId) => {
    setError(id, '')
    if (id === 'resume') {
      fileRef.current?.click()
      return
    }

    const content = textValues[id]
    if (!content.trim()) {
      setError(id, 'Please enter some content first.')
      return
    }

    setLoading_(id, true)
    try {
      const res = await fetch('/api/connectors/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: id, content }),
      })
      if (!res.ok) throw new Error('Import failed. Please try again.')
      markImported(id)
    } catch (err) {
      setError(id, err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading_(id, false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading_('resume', true)
    setError('resume', '')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/connectors/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed. Please try again.')
      markImported('resume')
    } catch (err) {
      setError('resume', err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading_('resume', false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="p-7">
      <div className="mb-5">
        <h2 className="text-lg font-black text-white">Import your career history</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Skip filling things manually - import from any platform to auto-fill the next steps.
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-2 gap-3 mb-6">
        {CARDS.map(card => {
          const isExpanded = expanded.has(card.id)
          const isImported = imported.has(card.id)
          const isLoading = loading.has(card.id)
          const error = errors[card.id]
          const Icon = card.icon

          return (
            <div
              key={card.id}
              className={`rounded-xl border transition-all ${isImported
                  ? 'border-teal-500/50 bg-teal-500/5'
                  : isExpanded
                    ? 'border-zinc-600 bg-zinc-800/80'
                    : 'border-zinc-700/50 bg-zinc-800/50'
                }`}
            >
              <button
                onClick={() => toggleExpand(card.id)}
                className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isImported ? 'bg-teal-500/20' : 'bg-zinc-700/50'
                    }`}>
                    {isImported ? (
                      <Check className="w-4 h-4 text-teal-400" />
                    ) : (
                      <Icon className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${isImported ? 'text-teal-400' : 'text-white'}`}>
                      {card.label}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{card.description}</div>
                  </div>
                </div>
                {isImported ? (
                  <span className="text-[10px] text-teal-400 font-semibold shrink-0">Imported</span>
                ) : isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                )}
              </button>

              {isExpanded && !isImported && (
                <div className="px-3.5 pb-3.5 space-y-2">
                  {card.id === 'resume' ? (
                    <button
                      onClick={() => handleImport(card.id)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-70 text-black text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                      {isLoading ? 'Uploading...' : 'Choose PDF file'}
                    </button>
                  ) : card.id === 'github' ? (
                    <input
                      value={textValues[card.id]}
                      onChange={e => setTextValues(prev => ({ ...prev, [card.id]: e.target.value }))}
                      placeholder="username"
                      className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
                    />
                  ) : (
                    <textarea
                      value={textValues[card.id]}
                      onChange={e => setTextValues(prev => ({ ...prev, [card.id]: e.target.value }))}
                      placeholder={card.id === 'linkedin' ? 'Paste LinkedIn profile text...' : 'Paste certifications...'}
                      rows={3}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none"
                    />
                  )}

                  {card.id !== 'resume' && (
                    <button
                      onClick={() => handleImport(card.id)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-70 text-black text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {isLoading ? 'Importing...' : 'Import'}
                    </button>
                  )}

                  {error && <p className="text-[11px] text-red-400">{error}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex-none text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer px-4 py-2.5 rounded-xl border border-zinc-700"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-medium py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
        >
          Continue
        </button>
      </div>
      <p className="text-[11px] text-zinc-500 text-center mt-2">Import is optional - you can fill details manually in the next steps.</p>
    </div>
  )
}
