import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const kbd = cva(
  "inline-flex items-center rounded-sm border border-border bg-muted-surface px-1.5 text-caption font-medium text-muted-foreground",
);

export type KbdProps = HTMLAttributes<HTMLElement> & VariantProps<typeof kbd>;

export function Kbd({ className, ...props }: KbdProps) {
  return <kbd className={cn(kbd(), className)} {...props} />;
}
