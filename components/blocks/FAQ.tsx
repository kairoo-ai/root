"use client";

/**
 * FAQ - data-driven Q/A block built on our Accordion primitive (HeroUI v3).
 *
 * Renders a list of {@link FAQItem}s as an accessible, single-open accordion.
 * Optionally wraps itself in a <Section> with a <PageHeader> (eyebrow / title /
 * subtitle). Token-only styling; reduced-motion safe (reveal transforms are
 * dropped when the user prefers reduced motion).
 *
 *   import { FAQ } from "@/components/blocks/FAQ";
 *   <FAQ items={faqItems} />
 *
 *   // headerless (embed inside an existing Section):
 *   <FAQ items={faqItems} section={false} />
 */

import { motion, useReducedMotion } from "motion/react";
import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/layout/Section";
import { PageHeader, type PageHeaderProps } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types";
import type { ReactNode } from "react";

export type FAQProps = {
  /** Question / answer pairs to render. */
  items: FAQItem[];
  /** Optional eyebrow above the heading. */
  eyebrow?: ReactNode;
  /** Section heading. Defaults to "Frequently asked questions". */
  title?: ReactNode;
  /** Optional supporting copy under the heading. */
  subtitle?: ReactNode;
  /**
   * Allow more than one item open at a time. Defaults to false (single-open).
   */
  allowMultiple?: boolean;
  /** Item id(s) expanded on first render. */
  defaultExpandedKeys?: string[];
  /** Wrap output in a <Section>. Defaults to true. */
  section?: boolean;
  /** Render the <PageHeader>. Defaults to true. */
  showHeader?: boolean;
  className?: string;
};

const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
} as const;

export function FAQ({
  items,
  eyebrow,
  title = "Frequently asked questions",
  subtitle,
  allowMultiple = false,
  defaultExpandedKeys,
  section = true,
  showHeader = true,
  className,
}: FAQProps) {
  const reduceMotion = useReducedMotion();

  if (items.length === 0) return null;

  const reveal = reduceMotion ? {} : REVEAL;

  const content = (
    <div className={cn("flex flex-col gap-10", className)}>
      {showHeader ? (
        <motion.div {...reveal}>
          {/* PageHeaderProps intersects HTMLAttributes (global `title?: string`)
              with `title: ReactNode`, which TS collapses to `string & ReactNode`.
              We accept a full ReactNode title, so narrow only `title` here. */}
          <PageHeader
            size="sm"
            eyebrow={eyebrow}
            title={title as PageHeaderProps["title"]}
            subtitle={subtitle}
          />
        </motion.div>
      ) : null}

      <motion.div {...reveal} className="mx-auto w-full max-w-3xl">
        <Accordion
          variant="surface"
          allowsMultipleExpanded={allowMultiple}
          defaultExpandedKeys={defaultExpandedKeys}
          className="w-full"
        >
          {items.map((item) => (
            <Accordion.Item key={item.id} id={item.id}>
              <Accordion.Heading>
                <Accordion.Trigger className="text-h5 text-foreground">
                  {item.question}
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body className="text-body text-muted-foreground">
                  {item.answer}
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );

  return section ? <Section>{content}</Section> : content;
}

export default FAQ;
