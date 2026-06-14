import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type ProseProps = HTMLAttributes<HTMLDivElement>;

export function Prose({ className, ...props }: ProseProps) {
  return (
    <div
      className={cn("prose dark:prose-invert max-w-none", className)}
      {...props}
    />
  );
}
