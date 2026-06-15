'use client'
import { useState, useRef, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComboboxProps {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  className?: string
  maxSuggestions?: number
}

export function Combobox({ value, onChange, options, placeholder, className, maxSuggestions = 8 }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filtered = value.length > 0
    ? options.filter(o => o.toLowerCase().includes(value.toLowerCase())).slice(0, maxSuggestions)
    : options.slice(0, maxSuggestions)

  const select = useCallback((opt: string) => {
    onChange(opt)
    setOpen(false)
  }, [onChange])

  const onFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current)
    setOpen(true)
  }

  const onBlur = () => {
    blurTimer.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true) }}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full bg-background border border-border rounded-xl px-3 pr-8 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-teal-500/50 transition-colors"
        />
        <ChevronDown className={cn('absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40 transition-transform pointer-events-none', open && 'rotate-180')} />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-border bg-card shadow-lg max-h-52 overflow-y-auto">
          {filtered.map(opt => (
            <button
              key={opt}
              type="button"
              onMouseDown={() => select(opt)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors hover:bg-teal-500/5 hover:text-teal-400',
                opt === value ? 'text-teal-400 bg-teal-500/5' : 'text-foreground'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
