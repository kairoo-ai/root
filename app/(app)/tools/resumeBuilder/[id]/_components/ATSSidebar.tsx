'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, ChevronRight, Lightbulb } from 'lucide-react'
import type { ResumeSections } from '@/types/resume'
import { GlowingEffect } from '@/components/aceternity/GlowingEffect'

interface AtsResult {
  total: number
  dimensions: {
    keywordMatch: number
    impactMetrics: number
    clarity: number
    completeness: number
    formatting: number
  }
  suggestions: string[]
}

interface Props {
  resumeId: string
  initialScore: number | null
  jobDescription: string
  sections: ResumeSections | null
  onScoreUpdate: (score: number) => void
}

const DIMENSION_LABELS: { key: keyof AtsResult['dimensions']; label: string }[] = [
  { key: 'keywordMatch', label: 'Keyword Match' },
  { key: 'impactMetrics', label: 'Impact Metrics' },
  { key: 'clarity', label: 'Clarity' },
  { key: 'completeness', label: 'Completeness' },
  { key: 'formatting', label: 'Formatting' },
]

function dimensionColor(score: number) {
  if (score >= 15) return { bar: 'bg-emerald-500', text: 'text-emerald-400' }
  if (score >= 10) return { bar: 'bg-amber-500', text: 'text-amber-400' }
  return { bar: 'bg-red-500', text: 'text-red-400' }
}

function scoreRingColor(score: number): string {
  if (score >= 70) return '#10b981' // emerald-500
  if (score >= 40) return '#f59e0b' // amber-500
  return '#ef4444' // red-500
}

interface ScoreRingProps {
  score: number
}

function ScoreRing({ score }: ScoreRingProps) {
  const radius = 40
  const stroke = 6
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = scoreRingColor(score)
  const textColor =
    score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        {/* Track */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold tabular-nums ${textColor}`}>{score}</span>
        <span className="text-[10px] text-white/40 leading-none">/100</span>
      </div>
    </div>
  )
}

export default function ATSSidebar({
  resumeId,
  initialScore,
  jobDescription: initialJD,
  sections,
  onScoreUpdate,
}: Props) {
  const [jd, setJd] = useState(initialJD)
  const [result, setResult] = useState<AtsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showJdInput, setShowJdInput] = useState(!initialJD)

  const analyze = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}/ats-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd }),
      })
      if (res.ok) {
        const data = (await res.json()) as AtsResult
        setResult(data)
        onScoreUpdate(data.total)
      }
    } finally {
      setLoading(false)
    }
  }

  const displayScore = result?.total ?? initialScore ?? 0

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      {/* Score card with GlowingEffect */}
      <GlowingEffect
        className="rounded-2xl border border-white/10 bg-white/5"
        color="oklch(0.6 0.2 280)"
        size={180}
        blur={60}
      >
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-white">ATS Score</span>
          </div>

          {/* Circular progress ring */}
          <ScoreRing score={displayScore} />

          {/* JD toggle */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowJdInput(!showJdInput)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${showJdInput ? 'rotate-90' : ''}`}
              />
              {jd ? 'Edit job description' : 'Paste job description'}
            </button>

            {showJdInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2"
              >
                <textarea
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none"
                  value={jd}
                  placeholder="Paste the full job description here…"
                  onChange={(e) => setJd(e.target.value)}
                />
                <button
                  type="button"
                  onClick={analyze}
                  disabled={loading || !jd.trim()}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white transition-colors"
                >
                  {loading ? 'Analyzing…' : 'Analyze'}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </GlowingEffect>

      {/* 5-dimension breakdown */}
      {result && (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <span className="text-xs text-white/50 uppercase tracking-wider">Score Breakdown</span>
          {DIMENSION_LABELS.map(({ key, label }) => {
            const score = result.dimensions[key]
            const { bar, text } = dimensionColor(score)
            return (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70">{label}</span>
                  <span className={`text-xs font-semibold tabular-nums ${text}`}>
                    {score}<span className="text-white/30">/20</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / 20) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${bar}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Suggestions */}
      {result && result.suggestions.length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <span className="text-xs text-white/50 uppercase tracking-wider">Suggestions</span>
          {result.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-white/60 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
