"use client";

/**
 * Popover - thin wrapper over HeroUI v3 (@heroui/react).
 *
 * HeroUI v3 ships Popover as a compound component built on react-aria-components,
 * so it is fully accessible (focus management, dismiss-on-outside, ARIA wiring)
 * and already themed via our CSS-variable tokens in app/globals.css. We re-export
 * the REAL v3 exports under our naming rather than reimplementing anything.
 *
 * Usage (compound, matches v3 docs):
 *   <Popover>
 *     <Popover.Trigger><Button>Open</Button></Popover.Trigger>
 *     <Popover.Content>
 *       <Popover.Dialog>...</Popover.Dialog>
 *     </Popover.Content>
 *   </Popover>
 *
 * Or use the named parts: <PopoverTrigger>, <PopoverContent>, etc.
 */

import {
  Popover as HeroPopover,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverDialog,
  PopoverArrow,
  PopoverHeading,
  popoverVariants,
} from "@heroui/react";

import type {
  PopoverProps,
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverDialogProps,
  PopoverArrowProps,
  PopoverHeadingProps,
  PopoverVariants,
} from "@heroui/react";

// Root compound component (Popover.Trigger / .Content / .Dialog / .Arrow / .Heading)
export const Popover = HeroPopover;

// Named sub-parts (use these if you prefer flat imports over dot-notation)
export {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverDialog,
  PopoverArrow,
  PopoverHeading,
  popoverVariants,
};

export type {
  PopoverProps,
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverDialogProps,
  PopoverArrowProps,
  PopoverHeadingProps,
  PopoverVariants,
};

export default Popover;
