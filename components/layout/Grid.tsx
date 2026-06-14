import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const grid = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-3",
      4: "grid-cols-2 md:grid-cols-4",
    },
    gap: { sm: "gap-4", md: "gap-6", lg: "gap-8" },
  },
  defaultVariants: { cols: 1, gap: "md" },
});

export type GridProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof grid>;

export function Grid({ className, cols, gap, ...props }: GridProps) {
  return <div className={cn(grid({ cols, gap }), className)} {...props} />;
}
