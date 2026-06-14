import { cn } from '@/lib/utils'

interface BentoItem {
  title: string
  description?: string
  header?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

interface BentoGridAceternityProps {
  items: BentoItem[]
  className?: string
}

export function BentoGridAceternity({ items, className }: BentoGridAceternityProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-3', className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className={cn(
            'group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-lg',
            item.className,
          )}
        >
          {item.header && <div className="mb-4">{item.header}</div>}
          <div className="flex items-start gap-3">
            {item.icon && (
              <div className="mt-0.5 shrink-0 text-primary">{item.icon}</div>
            )}
            <div>
              <h3 className="mb-1 font-semibold text-foreground">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
