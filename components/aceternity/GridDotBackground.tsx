import { cn } from '@/lib/utils'

interface GridDotBackgroundProps {
  children?: React.ReactNode
  className?: string
  variant?: 'grid' | 'dots'
  color?: string
}

export function GridDotBackground({ children, className, variant = 'dots', color }: GridDotBackgroundProps) {
  const gridStyle = variant === 'dots'
    ? {
        backgroundImage: `radial-gradient(${color ?? 'var(--border)'} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }
    : {
        backgroundImage: `linear-gradient(${color ?? 'var(--border)'} 1px, transparent 1px), linear-gradient(to right, ${color ?? 'var(--border)'} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }

  return (
    <div className={cn('relative', className)} style={gridStyle}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
