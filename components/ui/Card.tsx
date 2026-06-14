import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const card = cva("rounded-xl border", {
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground",
      glass: "border-border/60 bg-card/70 backdrop-blur-[var(--blur-glass)]",
      elevated: "border-border bg-card text-card-foreground shadow-elevation-3",
      interactive:
        "border-border bg-card text-card-foreground transition-all duration-200 hover:shadow-elevation-3 hover:-translate-y-0.5",
    },
  },
  defaultVariants: { variant: "default" },
});

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof card>;
export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(card({ variant }), className)} {...props} />;
}
