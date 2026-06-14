'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Zap, Copy, Check, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { FeatureDef } from '@/engines/ai/features/registry'
import { cn } from '@/lib/utils'

interface Props { feature: FeatureDef }

export function ToolPageClient({ feature }: Props) {
  const router = useRouter()
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const run = async () => {
    setError('')
    setOutput('')
    setLoading(true)
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId: feature.id, inputs }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error ?? 'Request failed')
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No stream')

      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        full += chunk
        setOutput(full)
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canRun = feature.inputs.filter(i => i.required).every(i => inputs[i.id]?.trim())

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-5 cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to tools
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xl shrink-0">
          {feature.icon}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">{feature.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{feature.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
        {/* Input form */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground">Your Inputs</h2>
          {feature.inputs.map(field => (
            <div key={field.id}>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                {field.label}{field.required && <span className="text-teal-400 ml-0.5">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  value={inputs[field.id] ?? ''}
                  onChange={e => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                  rows={4}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 resize-none transition-colors"
                />
              ) : field.type === 'select' ? (
                <select
                  value={inputs[field.id] ?? ''}
                  onChange={e => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-teal-500/50 cursor-pointer transition-colors"
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={inputs[field.id] ?? ''}
                  onChange={e => setInputs(prev => ({ ...prev, [field.id]: e.target.value }))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 transition-colors"
                />
              )}
            </div>
          ))}

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
              {error}
            </div>
          )}

          <button
            onClick={run}
            disabled={!canRun || loading || feature.status === 'coming-soon'}
            className={cn(
              'w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-all cursor-pointer',
              canRun && !loading && feature.status !== 'coming-soon'
                ? 'bg-teal-500 text-black hover:bg-teal-400'
                : 'bg-teal-500/20 text-teal-400/50 cursor-not-allowed'
            )}
          >
            <Zap className="w-4 h-4" />
            {loading ? 'Generating...' : feature.status === 'coming-soon' ? 'Coming Soon' : 'Generate'}
          </button>
        </div>

        {/* Output */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Output</h2>
            {output && (
              <div className="flex gap-2">
                <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1 cursor-pointer transition-colors">
                  {copied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={() => { setOutput(''); setInputs({}) }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1 cursor-pointer transition-colors">
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!output && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-48 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-teal-400/60" />
                </div>
                <p className="text-sm text-muted-foreground">Fill in your inputs and click Generate</p>
              </motion.div>
            )}
            {loading && !output && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-teal-400" animate={{ y: [-4, 0, -4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Generating with AI...</p>
              </motion.div>
            )}
            {output && (
              <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert prose-sm max-w-none overflow-y-auto max-h-[480px] text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {output}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
