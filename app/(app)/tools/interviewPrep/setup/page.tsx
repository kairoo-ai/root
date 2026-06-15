'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { SessionModeCard } from '../_components/SessionModeCard'
import { PersonaSelector } from '../_components/PersonaSelector'
import type { InterviewType, Difficulty, CreateSessionRequest } from '@/types/interview'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const QUESTION_COUNTS = [5, 10, 15] as const

export default function SetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [type, setType] = useState<InterviewType>(
    (searchParams.get('type') as InterviewType) ?? 'behavioral',
  )
  const [targetRole, setTargetRole] = useState(searchParams.get('role') ?? '')
  const [targetCompany, setTargetCompany] = useState(searchParams.get('company') ?? '')
  const [personaId, setPersonaId] = useState('supportive')
  const [difficulty, setDifficulty] = useState<Difficulty>(
    (searchParams.get('prefillDifficulty') as Difficulty) ?? 'medium',
  )
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const title = [targetRole, type.replace('_', ' ')].filter(Boolean).join(' - ')

  async function handleStart() {
    if (!targetRole.trim()) {
      setError('Target role is required')
      return
    }
    setLoading(true)
    setError(null)

    const body: CreateSessionRequest = {
      title: title || 'Mock Interview',
      type,
      targetRole: targetRole.trim(),
      targetCompany: targetCompany.trim() || undefined,
      personaId: personaId || undefined,
      difficulty,
      questionCount,
    }

    const res = await fetch('/api/interview/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Failed to create session')
      setLoading(false)
      return
    }

    const { session } = await res.json()
    router.push(`/tools/interviewPrep/session/${session.id}`)
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">New Interview Session</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Configure your mock interview.</p>
      </div>

      {/* Type */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold text-[var(--color-text-primary)]">Interview Type</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['behavioral', 'technical', 'system_design', 'case_study'] as InterviewType[]).map((t) => (
            <SessionModeCard key={t} type={t} selected={type === t} onClick={() => setType(t)} />
          ))}
        </div>
      </fieldset>

      {/* Role */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">Target Role *</label>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Senior Software Engineer"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      {/* Company */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">Target Company (optional)</label>
        <input
          type="text"
          value={targetCompany}
          onChange={(e) => setTargetCompany(e.target.value)}
          placeholder="e.g. Google, Meta, Stripe…"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      {/* Persona */}
      <PersonaSelector value={personaId} onChange={setPersonaId} />

      {/* Difficulty */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-[var(--color-text-primary)]">Difficulty</legend>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={[
                'flex-1 rounded-xl border py-2 text-sm font-medium capitalize transition-colors',
                difficulty === d
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50',
              ].join(' ')}
            >
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Question count */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-[var(--color-text-primary)]">Questions</legend>
        <div className="flex gap-2">
          {QUESTION_COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={[
                'flex-1 rounded-xl border py-2 text-sm font-medium transition-colors',
                questionCount === n
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50',
              ].join(' ')}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <button
        onClick={handleStart}
        disabled={loading}
        className={[
          'rounded-xl py-3 text-sm font-semibold transition-colors',
          loading
            ? 'cursor-not-allowed bg-[var(--color-surface-2)] text-[var(--color-text-tertiary)]'
            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
        ].join(' ')}
      >
        {loading ? 'Creating session…' : 'Start Interview →'}
      </button>
    </div>
  )
}
