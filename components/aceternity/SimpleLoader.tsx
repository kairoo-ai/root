'use client'

import { cn } from '@/lib/utils'

interface SimpleLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SimpleLoader({ size = 'md', className }: SimpleLoaderProps) {
  const sizeMap = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-[3px]' }
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        sizeMap[size],
        'text-primary',
        className,
      )}
    />
  )
}
