import { cn } from '@/lib/utils'

interface NoiseBackgroundProps {
  children?: React.ReactNode
  className?: string
  opacity?: number
}

export function NoiseBackground({ children, className, opacity }: NoiseBackgroundProps) {
  return (
    <div className={cn('relative isolate', className)}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        style={{ opacity: opacity ?? 0.035 }}
      >
        <filter id="noise-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
