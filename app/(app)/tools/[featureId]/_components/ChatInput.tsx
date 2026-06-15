'use client'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Square } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onStop?: () => void
  isStreaming: boolean
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isStreaming,
  disabled,
  placeholder = 'Ask a follow-up…',
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (!isStreaming && value.trim() && !disabled) onSubmit()
    }
  }

  return (
    <div className="px-4 py-4 border-t border-border bg-card/80 backdrop-blur-sm">
      <div className="flex gap-3 items-end max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled || isStreaming}
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-teal-500/50 resize-none transition-colors leading-relaxed disabled:opacity-50 pr-12"
            style={{ minHeight: 48, maxHeight: 180 }}
          />
          <kbd className="absolute right-3 bottom-3 text-[9px] text-muted-foreground/40 font-mono hidden sm:block">
            ⌘↵
          </kbd>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={isStreaming ? onStop : onSubmit}
          disabled={!isStreaming && (!value.trim() || disabled)}
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isStreaming
              ? 'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25'
              : value.trim() && !disabled
              ? 'bg-teal-500 text-black hover:bg-teal-400'
              : 'bg-teal-500/20 text-teal-400/40 cursor-not-allowed'
          }`}
        >
          {isStreaming ? <Square className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        </motion.button>
      </div>

      <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
        Kairoo AI · Cmd+Enter to send
      </p>
    </div>
  )
}
