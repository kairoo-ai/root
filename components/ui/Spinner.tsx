import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { HTMLAttributes } from "react";

const spinner = cva("animate-spin", {
  variants: {
    size: { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" },
  },
  defaultVariants: { size: "md" },
});

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof spinner> & {
    "aria-label"?: string;
  };

export function Spinner({
  className,
  size,
  "aria-label": ariaLabel = "Loading",
  ...props
}: SpinnerProps) {
  return (
    <span role="status" aria-label={ariaLabel} className={cn("inline-flex", className)} {...props}>
      <Loader2 className={cn(spinner({ size }))} aria-hidden="true" />
    </span>
  );
}
