import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const separator = cva("bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px self-stretch",
    },
  },
  defaultVariants: { orientation: "horizontal" },
});

export type SeparatorProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof separator>;

export function Separator({ className, orientation = "horizontal", ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation ?? "horizontal"}
      className={cn(separator({ orientation }), className)}
      {...props}
    />
  );
}
