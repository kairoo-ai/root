import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { LabelHTMLAttributes } from "react";

const label = cva("text-body-sm font-medium text-foreground");

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof label> & { required?: boolean };

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label className={cn(label(), className)} {...props}>
      {children}
      {required ? <span className="text-destructive"> *</span> : null}
    </label>
  );
}
