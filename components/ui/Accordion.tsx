"use client";

/**
 * Accordion - thin wrapper over HeroUI v3 (@heroui/react, v3.1.0).
 *
 * Re-exports the REAL v3 compound component verbatim. HeroUI's `Accordion` is a
 * callable root with attached sub-parts (`.Item`, `.Heading`, `.Trigger`,
 * `.Panel`, `.Body`, `.Indicator`). We surface both the compound form and the
 * flat named sub-parts so callers can pick either style:
 *
 *   import { Accordion } from "@/components/ui/Accordion";
 *   <Accordion>
 *     <Accordion.Item id="a">
 *       <Accordion.Heading>
 *         <Accordion.Trigger>
 *           Question <Accordion.Indicator />
 *         </Accordion.Trigger>
 *       </Accordion.Heading>
 *       <Accordion.Panel>
 *         <Accordion.Body>Answer</Accordion.Body>
 *       </Accordion.Panel>
 *     </Accordion.Item>
 *   </Accordion>
 *
 *   // or flat:
 *   import { AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
 *
 * Theming: HeroUI v3 reads our CSS variables (wired in app/globals.css), so the
 * default + surface variants already render on-brand. No colors are set here.
 *
 * Selection / state props live on the root (from react-aria DisclosureGroup):
 *   allowsMultipleExpanded, defaultExpandedKeys, expandedKeys, onExpandedChange,
 *   isDisabled. Plus HeroUI: variant ("default" | "surface"), hideSeparator.
 * Per-item: id (Key), isDisabled, defaultExpanded, isExpanded, onExpandedChange.
 */

import { Accordion as HeroAccordion } from "@heroui/react";

// Flat named sub-parts (real v3 exports) - convenient for direct imports.
export {
  AccordionRoot,
  AccordionItem,
  AccordionHeading,
  AccordionTrigger,
  AccordionPanel,
  AccordionIndicator,
  AccordionBody,
} from "@heroui/react";

// Prop types (real v3 exports). `AccordionProps` is HeroUI's alias for the root.
export type {
  AccordionProps,
  AccordionRootProps,
  AccordionItemProps,
  AccordionHeadingProps,
  AccordionTriggerProps,
  AccordionPanelProps,
  AccordionIndicatorProps,
  AccordionBodyProps,
} from "@heroui/react";

/**
 * The compound Accordion, re-exported under our naming. Use `Accordion.Item`,
 * `Accordion.Trigger`, etc. Identical to the v3 component - no logic added.
 */
export const Accordion = HeroAccordion;

export default Accordion;
