import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { Container } from "./Container";

const section = cva("py-[var(--layout-section-y)]");

export type SectionProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof section> & {
    /** Skip the inner Container and render children edge-to-edge. */
    bleed?: boolean;
  };

export function Section({ className, bleed = false, children, ...props }: SectionProps) {
  return (
    <section className={cn(section(), className)} {...props}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
