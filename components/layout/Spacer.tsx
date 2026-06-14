import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const spacer = cva("w-full shrink-0", {
  variants: {
    size: {
      xs: "h-2",
      sm: "h-4",
      md: "h-8",
      lg: "h-12",
      xl: "h-16",
      "2xl": "h-24",
    },
  },
  defaultVariants: { size: "md" },
});

export type SpacerProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof spacer>;

export function Spacer({ className, size, ...props }: SpacerProps) {
  return <div aria-hidden="true" className={cn(spacer({ size }), className)} {...props} />;
}
