import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const stack = cva("flex", {
  variants: {
    direction: { col: "flex-col", row: "flex-row" },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
  },
  defaultVariants: { direction: "col", gap: 4 },
});

export type StackProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof stack>;

export function Stack({ className, direction, gap, align, justify, ...props }: StackProps) {
  return <div className={cn(stack({ direction, gap, align, justify }), className)} {...props} />;
}

export function HStack({ direction: _direction, ...props }: StackProps) {
  return <Stack direction="row" {...props} />;
}
