'use client'

import { useState } from 'react'
import { motion, Reorder } from 'framer-motion'
import { Wand2, Plus, Trash2, GripVertical, Sparkles, Loader2, Undo2 } from 'lucide-react'

interface Props {
  bullets: string[]
  onChange: (bullets: string[]) => void
  onAIGenerate: () => Promise<void>
  isStreaming: boolean
  role?: string
  company?: string
  jobDescription?: string
}

export default function BulletEditor({ bullets, onChange, onAIGenerate, isStreaming, role = '', company = '', jobDescription }: Props) {
  const [improvingIndex, setImprovingIndex] = useState<number | null>(null)
  const [undoStack, setUndoStack] = useState<Record<number, { prev: string; timer: ReturnType<typeof setTimeout> }>>({})

  const set = (i: number, v: string) => onChange(bullets.map((b, idx) => (idx === i ? v : b)))
  const remove = (i: number) => onChange(bullets.filter((_, idx) => idx !== i))
  const add = () => onChange([...bullets, ''])

  const improveBullet = async (i: number) => {
    if (improvingIndex !== null) return
    const original = bullets[i]
    setImprovingIndex(i)
    try {
      const res = await fetch('/api/resumes/improve-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: original, role, company, jobDescription }),
      })
      if (res.ok) {
        const data = (await res.json()) as { bullet: string }
        // Clear any existing undo timer for this index
        if (undoStack[i]) clearTimeout(undoStack[i].timer)
        const timer = setTimeout(() => {
          setUndoStack((prev) => {
            const next = { ...prev }
            delete next[i]
            return next
          })
        }, 5000)
        setUndoStack((prev) => ({ ...prev, [i]: { prev: original, timer } }))
        set(i, data.bullet)
      }
    } finally {
      setImprovingIndex(null)
    }
  }

  const undoBullet = (i: number) => {
    const entry = undoStack[i]
    if (!entry) return
    clearTimeout(entry.timer)
    set(i, entry.prev)
    setUndoStack((prev) => {
      const next = { ...prev }
      delete next[i]
      return next
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/50 uppercase tracking-wider">Bullets</span>
        <button
          onClick={onAIGenerate}
          disabled={isStreaming}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 transition-colors disabled:opacity-50"
        >
          <Wand2 className="w-3 h-3" />
          {isStreaming ? 'Generating…' : 'AI Improve All'}
        </button>
      </div>

      <Reorder.Group axis="y" values={bullets} onReorder={onChange} className="flex flex-col gap-1.5">
        {bullets.map((bullet, i) => (
          <Reorder.Item key={bullet + i} value={bullet} className="flex items-center gap-2">
            <motion.div
              className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 transition-colors"
              whileDrag={{ scale: 1.02 }}
            >
              <GripVertical className="w-3.5 h-3.5" />
            </motion.div>
            <input
              type="text"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              value={bullet}
              placeholder="Reduced page load time by 35% through…"
              onChange={(e) => set(i, e.target.value)}
            />
            {undoStack[i] ? (
              <button
                onClick={() => undoBullet(i)}
                className="flex items-center gap-0.5 text-xs px-1.5 py-1 rounded text-amber-400 hover:text-amber-300 transition-colors"
                title="Undo improvement"
              >
                <Undo2 className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={() => improveBullet(i)}
                disabled={improvingIndex !== null}
                className="text-white/30 hover:text-violet-400 transition-colors disabled:opacity-40"
                title="AI improve this bullet"
              >
                {improvingIndex === i ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </button>
            )}
            <button onClick={() => remove(i)} className="text-white/30 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <button
        onClick={add}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-dashed border-white/20 hover:border-violet-400/40 text-white/40 hover:text-white/60 transition-colors"
      >
        <Plus className="w-3 h-3" /> Add Bullet
      </button>
    </div>
  )
}
