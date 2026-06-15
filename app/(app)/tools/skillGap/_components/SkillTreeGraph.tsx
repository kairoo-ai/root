'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackgroundBoxes } from '@/components/aceternity'
import { cn } from '@/lib/utils'
import type { SkillGap } from '@/types/skill-gap'
import { getSalaryDelta } from '@/data/content/skillResources'

interface SkillNode {
  id: string
  skill: string
  category: string
  level: number
  required: number
  priority: 'critical' | 'important' | 'nice'
  marketDemand: 'high' | 'medium' | 'low'
  x: number
  y: number
}

function arrangeNodes(gaps: SkillGap[]): SkillNode[] {
  const byCategory: Record<string, SkillGap[]> = {}
  gaps.forEach(g => {
    const cat = g.category ?? 'General'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(g)
  })

  const nodes: SkillNode[] = []
  const categories = Object.keys(byCategory)
  const catCount = categories.length
  const centerX = 400
  const centerY = 300
  const radius = 220

  categories.forEach((cat, ci) => {
    const angle = (ci / catCount) * 2 * Math.PI - Math.PI / 2
    const catSkills = byCategory[cat]

    catSkills.forEach((g, si) => {
      const spread = 60
      const offsetAngle =
        angle +
        ((si - (catSkills.length - 1) / 2) * (spread / catSkills.length) * Math.PI) / 180
      const r = 180 + (si % 2) * 40
      nodes.push({
        id: g.skill,
        skill: g.skill,
        category: cat,
        level: g.currentLevel,
        required: g.requiredLevel,
        priority: g.priority,
        marketDemand: g.marketDemand,
        x: centerX + r * Math.cos(offsetAngle),
        y: centerY + r * Math.sin(offsetAngle),
      })
    })
  })

  return nodes
}

const PRIORITY_COLORS: Record<
  'critical' | 'important' | 'nice',
  { node: string; ring: string }
> = {
  critical: { node: '#ef4444', ring: 'ring-red-500/30' },
  important: { node: '#f59e0b', ring: 'ring-amber-500/30' },
  nice: { node: '#6b7280', ring: 'ring-gray-500/20' },
}

interface SkillTreeGraphProps {
  gaps: SkillGap[]
  className?: string
}

export function SkillTreeGraph({ gaps, className }: SkillTreeGraphProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const nodes = useMemo(() => arrangeNodes(gaps), [gaps])
  const selectedNode = nodes.find(n => n.id === selected)

  return (
    <div className={cn('relative', className)}>
      <div className="relative h-[600px] w-full overflow-hidden rounded-2xl border border-border">
        <BackgroundBoxes className="absolute inset-0" rows={12} cols={18} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/60" />

        {/* SVG connections */}
        <svg className="absolute inset-0 h-full w-full" style={{ pointerEvents: 'none' }}>
          {nodes.map(node => (
            <line
              key={node.id}
              x1={`${(node.x / 800) * 100}%`}
              y1={`${(node.y / 600) * 100}%`}
              x2="50%"
              y2="50%"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Center node */}
        <div
          className="absolute"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-xs font-bold text-primary">
            You
          </div>
        </div>

        {/* Skill nodes */}
        {nodes.map((node, i) => {
          const colors = PRIORITY_COLORS[node.priority]
          const progress = node.required > 0 ? node.level / node.required : 0
          const isSelected = selected === node.id

          return (
            <motion.button
              key={node.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{
                left: `${(node.x / 800) * 100}%`,
                top: `${(node.y / 600) * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 25 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              onClick={() => setSelected(selected === node.id ? null : node.id)}
            >
              {/* Ring progress */}
              <div className="relative">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke={colors.node}
                    strokeWidth="3"
                    strokeDasharray={`${progress * 125.6} 125.6`}
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                  />
                </svg>
                <div
                  className={cn(
                    'absolute inset-0 m-2 flex items-center justify-center rounded-full border-2',
                    isSelected ? 'bg-white/20' : 'border-white/20 bg-background/80',
                  )}
                  style={{ borderColor: isSelected ? colors.node : undefined }}
                >
                  <span className="text-[9px] font-bold text-foreground">
                    {node.level}/{node.required}
                  </span>
                </div>
              </div>
              <span className="max-w-[64px] truncate text-center text-[9px] font-medium text-foreground/80">
                {node.skill}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Selected node detail */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold capitalize text-foreground">{selectedNode.skill}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedNode.category} · {selectedNode.priority} priority
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-lg font-bold text-foreground">
                  {selectedNode.level}
                  <span className="text-sm text-muted-foreground">/{selectedNode.required}</span>
                </p>
              </div>
            </div>
            {getSalaryDelta(selectedNode.skill) && (
              <div className="mt-3 flex gap-3">
                <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-center">
                  <p className="text-xs text-muted-foreground">Salary Impact</p>
                  <p className="text-sm font-semibold text-emerald-500">
                    +${(getSalaryDelta(selectedNode.skill)!.usdDelta / 1000).toFixed(0)}k/yr
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 px-3 py-2 text-center">
                  <p className="text-xs text-muted-foreground">Market Demand</p>
                  <p className="text-sm font-semibold text-primary">
                    {getSalaryDelta(selectedNode.skill)!.demandScore}/100
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
