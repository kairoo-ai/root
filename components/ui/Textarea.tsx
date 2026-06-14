import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

const textarea = cva(
  "flex min-h-24 w-full resize-y rounded-lg border bg-background px-3 py-2 text-body text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      invalid: {
        true: "border-destructive focus-visible:ring-destructive",
        false: "border-input focus-visible:ring-ring",
      },
    },
    defaultVariants: { invalid: false },
  },
);

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  Omit<VariantProps<typeof textarea>, "invalid"> & { invalid?: boolean };

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(textarea({ invalid }), className)}
      {...props}
    />
  );
}
