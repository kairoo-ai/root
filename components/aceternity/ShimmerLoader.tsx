'use client'

import { cn } from '@/lib/utils'

interface ShimmerLoaderProps {
  className?: string
  lines?: number
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

export function ShimmerLoader({ className, lines = 1, rounded = 'md' }: ShimmerLoaderProps) {
  const radiusMap = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' }
  return (
    <div className={cn('space-y-2', className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'relative overflow-hidden bg-muted',
            radiusMap[rounded],
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
            'h-4',
          )}
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </div>
  )
}
