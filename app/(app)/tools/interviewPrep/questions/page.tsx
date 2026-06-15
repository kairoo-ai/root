'use client'

import { useState } from 'react'
import { bankQuestions } from '@/data/content/interviewQuestions'
import { QuestionBankCard } from '../_components/QuestionBankCard'

const ALL_CATEGORIES = Array.from(new Set(bankQuestions.map((q) => q.category))).sort()

export default function QuestionBankPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filtered = bankQuestions.filter((q) => {
    if (typeFilter !== 'all' && q.type !== typeFilter) return false
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false
    return true
  })

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Question Bank</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Browse {bankQuestions.length} curated questions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All Types" value="all" current={typeFilter} onChange={setTypeFilter} />
        {(['behavioral', 'technical', 'situational'] as const).map((t) => (
          <FilterChip key={t} label={t} value={t} current={typeFilter} onChange={setTypeFilter} />
        ))}
        <span className="w-px self-stretch bg-[var(--color-border)]" />
        <FilterChip label="All Levels" value="all" current={difficultyFilter} onChange={setDifficultyFilter} />
        {(['easy', 'medium', 'hard'] as const).map((d) => (
          <FilterChip key={d} label={d} value={d} current={difficultyFilter} onChange={setDifficultyFilter} />
        ))}
        <span className="w-px self-stretch bg-[var(--color-border)]" />
        <FilterChip label="All Categories" value="all" current={categoryFilter} onChange={setCategoryFilter} />
        {ALL_CATEGORIES.map((c) => (
          <FilterChip key={c} label={c} value={c} current={categoryFilter} onChange={setCategoryFilter} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((q) => (
          <QuestionBankCard key={q.id} question={q} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[var(--color-text-tertiary)]">No questions match your filters.</p>
      )}
    </div>
  )
}

function FilterChip({
  label,
  value,
  current,
  onChange,
}: {
  label: string
  value: string
  current: string
  onChange: (v: string) => void
}) {
  const active = current === value
  return (
    <button
      onClick={() => onChange(value)}
      className={[
        'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
        active
          ? 'bg-[var(--color-primary)] text-white'
          : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
