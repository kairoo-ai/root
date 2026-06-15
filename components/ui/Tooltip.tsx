'use client';

/**
 * Tooltip - thin wrapper over HeroUI v3 (@heroui/react) Tooltip.
 *
 * Verified against @heroui/react@3.1.0
 *   node_modules/@heroui/react/dist/components/tooltip/index.d.ts
 *
 * HeroUI's `Tooltip` is a compound component (built on react-aria-components'
 * TooltipTrigger). The FIRST child is the trigger element; `Tooltip.Content`
 * is rendered as a sibling. Example:
 *
 *   import { Tooltip } from '@/components/ui/Tooltip';
 *   import { Button } from '@/components/ui/Button';
 *
 *   <Tooltip delay={0}>
 *     <Button>Hover me</Button>
 *     <Tooltip.Content showArrow placement="top">
 *       <Tooltip.Arrow />
 *       Helpful text
 *     </Tooltip.Content>
 *   </Tooltip>
 *
 * Token-only: colors/spacing come from HeroUI's theme variables (aliased to our
 * design tokens in app/globals.css). No hardcoded colors here.
 */

import { Tooltip as HeroTooltip } from '@heroui/react';
import type {
  TooltipProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
  TooltipVariants,
} from '@heroui/react';

// Re-export the compound component under our naming. Sub-parts are accessed as
// Tooltip.Trigger / Tooltip.Content / Tooltip.Arrow (and Tooltip.Root).
export const Tooltip = HeroTooltip;

// Convenience aliases for the compound sub-parts so they can also be imported
// directly when destructuring reads cleaner.
export const TooltipRoot = HeroTooltip.Root;
export const TooltipTrigger = HeroTooltip.Trigger;
export const TooltipContent = HeroTooltip.Content;
export const TooltipArrow = HeroTooltip.Arrow;

export type {
  TooltipProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
  TooltipVariants,
};

export default Tooltip;
