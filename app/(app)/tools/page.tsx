'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Filter } from 'lucide-react'
import { features } from '@/engines/ai/features/registry'
import { CardSpotlight } from '@/components/aceternity/CardSpotlight'
import { GooeyInput } from '@/components/aceternity'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  career: { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
  learning: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
}

export default function ToolsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | 'career' | 'learning'>('all')

  const filtered = useMemo(() => features.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || f.category === category
    return matchSearch && matchCat
  }), [search, category])

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Hero */}
      <div className="mb-8 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm px-6 py-8">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-2">AI Toolkit ✦</p>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
          Your{' '}
          <span className="bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            AI-powered
          </span>{' '}
          career suite
        </h1>
        <p className="text-sm text-white/60 max-w-lg">38 intelligent tools for career growth, interview mastery, resume excellence, and continuous learning.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <GooeyInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tools or describe your goal…"
          containerClassName="flex-1 min-w-0 max-w-sm"
        />
        <div className="flex gap-2">
          {(['all', 'career', 'learning'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'text-xs font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer capitalize',
                category === cat
                  ? 'bg-teal-500/15 text-teal-400 border-teal-500/30'
                  : 'border-white/15 text-white/50 hover:text-white/80 hover:bg-white/6'
              )}
            >
              {cat === 'all' ? `All (${features.length})` : cat === 'career' ? `Career (${features.filter(f => f.category === 'career').length})` : `Learning (${features.filter(f => f.category === 'learning').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((tool, i) => {
            const colors = CATEGORY_COLORS[tool.category]
            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
              >
                <CardSpotlight
                  className={cn(
                    'group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 cursor-pointer transition-all hover:bg-white/8 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] will-change-transform hover:shadow-lg h-full flex flex-col',
                    tool.status === 'coming-soon' ? 'opacity-60' : ''
                  )}
                  onClick={() => tool.status === 'ready' && router.push(`/tools/${tool.id}`)}
                >
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-base', colors.bg)}>
                    {tool.icon}
                  </div>
                  <div className="font-semibold text-sm text-white mb-1">{tool.name}</div>
                  <div className="text-[11.5px] text-white/55 leading-relaxed flex-1">{tool.description}</div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', colors.text, colors.bg, colors.border)}>
                      {tool.category}
                    </span>
                    {tool.status === 'coming-soon' ? (
                      <span className="text-[10px] text-muted-foreground border border-border px-2 py-0.5 rounded-full">Soon</span>
                    ) : (
                      <span className="text-[10px] text-emerald-400">● Ready</span>
                    )}
                  </div>
                </CardSpotlight>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Filter className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No tools match your search.</p>
        </div>
      )}
    </div>
  )
}
