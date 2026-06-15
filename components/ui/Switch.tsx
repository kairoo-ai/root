'use client';

/**
 * Switch - thin wrapper around HeroUI v3's real Switch.
 *
 * Source of truth: https://heroui.com/docs/react/components/switch
 * Verified against installed @heroui/react v3.1.0
 *   (dist/components/switch/{index,switch}.d.ts + .js,
 *    dist/components/switch-group/index.d.ts,
 *    @heroui/styles switch.styles.d.ts).
 *
 * v3 replaces v2's `useSwitch` hook with a real COMPOUND `Switch`: the export is
 * callable (it is the Root) AND carries attached sub-parts:
 *   Switch.Root | Switch.Control | Switch.Thumb | Switch.Icon | Switch.Content
 *
 * Internally `Switch.Root` wraps react-aria-components' Switch, so it is a true
 * accessible toggle (`role="switch"`, keyboard + form support) out of the box.
 *
 * It also exports each part as a flat named primitive. We re-export BOTH styles
 * so callers can pick whichever reads best:
 *
 *   // simplest - Root renders its own control/thumb when given no children
 *   import { Switch } from "@/components/ui/Switch";
 *   <Switch defaultSelected aria-label="Enable notifications" />
 *
 *   // labelled
 *   <Switch defaultSelected>Enable notifications</Switch>
 *
 *   // compound (full control over markup)
 *   <Switch defaultSelected>
 *     <Switch.Control>
 *       <Switch.Thumb>
 *         <Switch.Icon>{/* optional icon *\/}</Switch.Icon>
 *       </Switch.Thumb>
 *     </Switch.Control>
 *     <Switch.Content>Enable notifications</Switch.Content>
 *   </Switch>
 *
 *   // flat parts
 *   import { SwitchControl, SwitchThumb } from "@/components/ui/Switch";
 *
 * Compound part ↔ flat name map (same components):
 *   Switch.Root    === SwitchRoot
 *   Switch.Control === SwitchControl   (the track)
 *   Switch.Thumb   === SwitchThumb     (the sliding knob)
 *   Switch.Icon    === SwitchIcon      (optional icon inside the thumb)
 *   Switch.Content === SwitchContent   (label / description slot)
 *
 * Key props (v3 - these come from react-aria-components' Switch + SwitchVariants):
 *   - size: "sm" | "md" | "lg"                      → on Switch (the only style variant)
 *   - isSelected / defaultSelected                  → on Switch (controlled vs uncontrolled)
 *   - onChange: (isSelected: boolean) => void       → on Switch
 *   - isDisabled                                     → on Switch
 *   - name / value                                   → on Switch (for form submission)
 *   - aria-label                                     → on Switch when there is no visible label
 * NOTE: v3 Switch has NO `color`, `thumbIcon`, `startContent`, or `endContent`
 * props (those were v2). Use `Switch.Icon` inside the thumb for an icon, and
 * `Switch.Content` for label text.
 *
 * SwitchGroup (compound: SwitchGroup.Root === SwitchGroupRoot) groups multiple
 * switches; `orientation: "horizontal" | "vertical"` controls layout.
 *
 * Token-only: colors come from HeroUI's themed CSS variables wired in
 * app/globals.css (our tokens alias --accent/--focus/--default/etc.). No
 * hardcoded colors here.
 */

export {
  // Compound default - `Switch` is callable AND has .Root/.Control/.Thumb/.Icon/.Content.
  Switch,

  // Flat named primitives (same components, attached on the compound above).
  SwitchRoot,
  SwitchControl,
  SwitchThumb,
  SwitchIcon,
  SwitchContent,

  // Grouping container (compound: SwitchGroup.Root).
  SwitchGroup,
  SwitchGroupRoot,

  // Style recipes, in case a caller needs to compose tokens.
  switchVariants,
  switchGroupVariants,
} from '@heroui/react';

export type {
  SwitchProps, // alias of SwitchRootProps
  SwitchRootProps,
  SwitchControlProps,
  SwitchThumbProps,
  SwitchIconProps,
  SwitchContentProps,
  SwitchGroupProps, // alias of SwitchGroupRootProps
  SwitchGroupRootProps,
  SwitchVariants,
  SwitchGroupVariants,
} from '@heroui/react';

// Default export mirrors the compound for `import Switch from "@/components/ui/Switch"`.
export { Switch as default } from '@heroui/react';
