import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const container = cva("mx-auto w-full max-w-[var(--layout-content-max)] px-6 lg:px-8");

export type ContainerProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof container>;

export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn(container(), className)} {...props} />;
}
