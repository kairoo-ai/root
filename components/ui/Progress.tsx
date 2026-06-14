import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  value: number;
  max?: number;
};

export function Progress({ className, value, max = 100, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted-surface", className)}
      {...props}
    >
      <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
