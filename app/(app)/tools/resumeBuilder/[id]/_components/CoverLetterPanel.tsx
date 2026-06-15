'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, RefreshCw, FileText, Check } from 'lucide-react'
import { StatefulButton, ShimmerLoader } from '@/components/aceternity'
import { cn } from '@/lib/utils'

interface CoverLetterPanelProps {
  resumeId: string
  className?: string
}

const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'enthusiastic', label: 'Enthusiastic' },
  { id: 'concise', label: 'Concise' },
  { id: 'creative', label: 'Creative' },
] as const

export function CoverLetterPanel({ resumeId, className }: CoverLetterPanelProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [tone, setTone] = useState<string>('professional')
  const [copied, setCopied] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const generate = async () => {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setContent('')
    try {
      const res = await fetch(`/api/resumes/${resumeId}/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tone }),
        signal: abortRef.current.signal,
      })
      if (!res.ok || !res.body) throw new Error('Failed')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setContent((prev) => prev + decoder.decode(value))
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError')
        setContent('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-white">Cover Letter</h3>
        </div>
        {content && (
          <div className="flex items-center gap-1">
            <button
              onClick={copy}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-white/50 hover:bg-white/5 hover:text-white/80 transition-colors"
            >
              {copied ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={12} />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={generate}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-white/50 hover:bg-white/5 hover:text-white/80 transition-colors"
            >
              <RefreshCw size={12} />
              Regenerate
            </button>
          </div>
        )}
      </div>

      {/* Tone selector */}
      <div className="flex flex-wrap gap-1.5">
        {TONES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTone(t.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              tone === t.id
                ? 'border-violet-500/60 bg-violet-600/20 text-violet-300'
                : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Generate button - only shown before first generation */}
      {!content && !loading && (
        <StatefulButton onClick={generate} className="w-full">
          Generate Cover Letter
        </StatefulButton>
      )}

      {/* Shimmer while loading with no content yet */}
      {loading && !content && <ShimmerLoader lines={8} className="rounded-xl" />}

      {/* Generated content */}
      <AnimatePresence>
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/80 whitespace-pre-wrap"
          >
            {content}
            {loading && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-violet-400 align-middle" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
