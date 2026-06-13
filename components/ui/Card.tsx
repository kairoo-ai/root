import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const card = cva("rounded-xl border", {
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground",
      glass: "border-border/60 bg-card/60 backdrop-blur-[18px]",
      elevated: "border-border bg-card text-card-foreground shadow-elevation-3",
    },
  },
  defaultVariants: { variant: "default" },
});

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof card>;
export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(card({ variant }), className)} {...props} />;
}
