import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

const input = cva(
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 text-body-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      invalid: {
        true: "border-destructive focus-visible:ring-0 focus-visible:ring-offset-0",
        false: "",
      },
    },
    defaultVariants: { invalid: false },
  },
);

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof input> & { invalid?: boolean };

export function Input({ className, invalid, ...props }: InputProps) {
  return <input className={cn(input({ invalid }), className)} {...props} />;
}
