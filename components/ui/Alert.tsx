import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const alert = cva("rounded-lg border p-4", {
  variants: {
    variant: {
      neutral: "bg-muted-surface text-foreground border-border",
      info: "bg-info/10 text-info border-info/20",
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      error: "bg-destructive/10 text-destructive border-destructive/20",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export type AlertProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof alert>;

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="alert" className={cn(alert({ variant }), className)} {...props} />;
}

export type AlertTitleProps = HTMLAttributes<HTMLParagraphElement>;

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return <p className={cn("text-body font-semibold", className)} {...props} />;
}

export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return <p className={cn("text-body-sm text-muted-foreground", className)} {...props} />;
}
