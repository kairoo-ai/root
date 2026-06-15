'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { connectorList } from '@/lib/connectors/registry'
import type { ConnectorCategory } from '@/lib/connectors/types'
import ConnectorCard, { type ConnectorStatus } from './ConnectorCard'

const CATEGORY_ORDER: ConnectorCategory[] = [
  'resume',
  'professional',
  'developer',
  'portfolio',
  'learning',
]

const CATEGORY_LABELS: Record<ConnectorCategory, string> = {
  resume: 'Resume & CV',
  professional: 'Professional Networks',
  developer: 'Developer Platforms',
  portfolio: 'Portfolio & Writing',
  learning: 'Learning & Certificates',
}

type StatusMap = Record<string, ConnectorStatus>

export default function ConnectionsPageClient() {
  const [statuses, setStatuses] = useState<StatusMap>(() =>
    Object.fromEntries(connectorList.map(c => [c.id, { status: 'idle', message: '' }]))
  )

  const setStatus = (id: string, next: ConnectorStatus) => {
    setStatuses(prev => ({ ...prev, [id]: next }))
  }

  const handleImport = async (id: string, input: string, file?: File) => {
    const connector = connectorList.find(c => c.id === id)
    if (!connector) return

    setStatus(id, { status: 'loading', message: '' })

    try {
      const isFileInput = connector.inputType === 'pdf' || connector.inputType === 'zip'

      let res: Response

      if (isFileInput && file) {
        const form = new FormData()
        form.append('source', id)
        form.append('file', file)
        res = await fetch('/api/connectors/upload', { method: 'POST', body: form })
      } else {
        res = await fetch(`/api/connectors/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input }),
        })
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' })) as { error?: string }
        setStatus(id, { status: 'error', message: err.error ?? 'Something went wrong.' })
        return
      }

      const data = await res.json() as { summary?: string; error?: string }

      if (data.error) {
        setStatus(id, { status: 'error', message: data.error })
      } else {
        setStatus(id, { status: 'success', message: data.summary ?? 'Import complete.' })
      }
    } catch {
      setStatus(id, { status: 'error', message: 'Network error. Please try again.' })
    }
  }

  const grouped = CATEGORY_ORDER.reduce<Record<ConnectorCategory, typeof connectorList>>(
    (acc, cat) => {
      acc[cat] = connectorList.filter(c => c.category === cat)
      return acc
    },
    { resume: [], professional: [], developer: [], portfolio: [], learning: [] }
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Page header */}
      <div>
        <h1 className="text-lg font-bold text-foreground">Connections</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Import your career data from external platforms. Each import enriches your AI context.
        </p>
      </div>

      {/* Category sections */}
      {CATEGORY_ORDER.map(cat => {
        const items = grouped[cat]
        if (!items.length) return null

        return (
          <section key={cat} className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(connector => (
                <ConnectorCard
                  key={connector.id}
                  connector={connector}
                  onImport={handleImport}
                  status={statuses[connector.id] ?? { status: 'idle', message: '' }}
                />
              ))}
            </div>
          </section>
        )
      })}
    </motion.div>
  )
}
