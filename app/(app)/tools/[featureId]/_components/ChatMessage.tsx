'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Bookmark, FileText } from 'lucide-react'
import { MarkdownRenderer } from './MarkdownRenderer'
import type { ChatMessage as ChatMessageType } from '@/data/schema'

interface Props {
  message: ChatMessageType
  isStreaming?: boolean
  streamingContent?: string
  index: number
}

export function ChatMessage({ message, isStreaming, streamingContent, index }: Props) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const content = isStreaming ? (streamingContent ?? '') : message.content

  const copy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar - assistant only */}
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center shrink-0 mt-1">
          <span className="text-xs">✦</span>
        </div>
      )}

      <div className={`flex flex-col gap-1.5 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${isUser
              ? 'bg-teal-500/15 border border-teal-500/25 text-foreground'
              : 'bg-card border border-border'
            }`}
        >
          {isUser ? (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <>
              <MarkdownRenderer content={content} />
              {isStreaming && (
                <motion.span
                  className="inline-block w-1.5 h-3.5 bg-teal-400 rounded-sm ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                />
              )}
            </>
          )}
        </div>

        {/* Action row - assistant messages only, after streaming */}
        {!isUser && !isStreaming && content && (
          <div className="flex gap-1">
            <button
              onClick={copy}
              title="Copy"
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-lg px-2 py-1 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              title="Save to roadmap"
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-lg px-2 py-1 transition-all cursor-pointer"
              onClick={() => {/* TODO: integrate with roadmap POST */ }}
            >
              <Bookmark className="w-3 h-3" />
              Save
            </button>
            <button
              title="Export as text"
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-lg px-2 py-1 transition-all cursor-pointer"
              onClick={() => {
                const blob = new Blob([content], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'kairoo-response.txt'
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              <FileText className="w-3 h-3" />
              Export
            </button>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-[10px] text-muted-foreground/50 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Avatar - user only */}
      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-muted/40 border border-border flex items-center justify-center shrink-0 mt-1">
          <span className="text-xs">U</span>
        </div>
      )}
    </motion.div>
  )
}
