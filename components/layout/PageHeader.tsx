import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

const title = cva("", {
  variants: {
    size: {
      sm: "text-h1",
      md: "text-display",
    },
  },
  defaultVariants: { size: "md" },
});

export type PageHeaderProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof title> & {
    eyebrow?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
  };

export function PageHeader({ className, size, eyebrow, title: titleProp, subtitle, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {eyebrow ? <p className="text-overline text-primary">{eyebrow}</p> : null}
      <h1 className={title({ size })}>{titleProp}</h1>
      {subtitle ? <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
