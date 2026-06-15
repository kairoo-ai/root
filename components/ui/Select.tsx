'use client';

/**
 * Select - thin wrapper around HeroUI v3's real Select (a single/multi-select
 * listbox in a popover), plus the ListBox family it composes with.
 *
 * Source of truth: https://heroui.com/docs/react/components/select
 * Verified against installed @heroui/react v3.1.0
 *   (dist/components/{select,list-box,list-box-item,list-box-section}).
 *
 * HeroUI ships COMPOUND components: each export is callable (it IS the Root)
 * AND carries attached sub-parts.
 *
 *   Select  → Select.Root | Select.Trigger | Select.Value | Select.Indicator | Select.Popover
 *   ListBox → ListBox.Root | ListBox.Item | ListBox.ItemIndicator | ListBox.Section
 *             (ListBox.Item is itself compound: ListBox.Item.Root | ListBox.Item.Indicator)
 *
 * The options live in a `ListBox`; each option is a `ListBox.Item` and MUST
 * carry a stable `id` (its key) and a `textValue` (used for typeahead +
 * accessible name when children aren't plain text).
 *
 * We re-export BOTH styles so callers can pick whichever reads best:
 *
 *   // compound (recommended) - Label comes from "@/components/ui/Label"
 *   import { Select, ListBox } from "@/components/ui/Select";
 *   import { Label } from "@/components/ui/Label";
 *
 *   <Select className="w-64" placeholder="Select one">
 *     <Label>State</Label>
 *     <Select.Trigger>
 *       <Select.Value />
 *       <Select.Indicator />
 *     </Select.Trigger>
 *     <Select.Popover>
 *       <ListBox>
 *         <ListBox.Item id="florida" textValue="Florida">
 *           Florida
 *           <ListBox.ItemIndicator />
 *         </ListBox.Item>
 *       </ListBox>
 *     </Select.Popover>
 *   </Select>
 *
 *   // flat parts
 *   import { SelectTrigger, ListBoxItem } from "@/components/ui/Select";
 *
 * Key props (v3):
 *   - placeholder: string                                  → on Select
 *   - selectionMode: "single" | "multiple" (default single) → on Select
 *   - value / onChange (controlled), or rely on form `name` → on Select
 *   - items: Iterable<T> (for render-prop / dynamic options) → on Select
 *   - variant: "primary" | "secondary"                      → on Select
 *   - fullWidth, isDisabled, isRequired, isInvalid, name     → on Select
 *   - isOpen / onOpenChange (controlled open), disabledKeys  → on Select
 *   - id (key) + textValue (REQUIRED)                        → on ListBox.Item
 *   - placement                                              → on Select.Popover
 *
 * NOTE: `Label` is intentionally NOT re-exported here - the app already ships a
 * dedicated `@/components/ui/Label`. Import it from there to avoid a duplicate
 * symbol in the components/ui barrel.
 *
 * Token-only: colors/surfaces/focus come from HeroUI's themed CSS variables
 * wired in app/globals.css. No hardcoded colors here.
 */

export {
  // Compound defaults - each is callable AND has its sub-parts attached.
  Select, // .Root .Trigger .Value .Indicator .Popover
  ListBox, // .Root .Item .ItemIndicator .Section
  ListBoxItem, // .Root .Indicator
  ListBoxSection,

  // Flat named primitives (same components, attached on the compounds above).
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIndicator,
  SelectPopover,
  ListBoxRoot,
  ListBoxItemRoot,
  ListBoxItemIndicator,
  ListBoxSectionRoot,

  // Style recipes, in case a caller needs to compose tokens.
  selectVariants,
  listboxVariants,
  listboxItemVariants,
  listboxSectionVariants,
} from '@heroui/react';

export type {
  SelectProps, // alias of SelectRootProps
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectIndicatorProps,
  SelectPopoverProps,
  SelectVariants,
  ListBoxProps, // alias of ListBoxRootProps
  ListBoxRootProps,
  ListBoxVariants,
  ListBoxItemProps, // alias of ListBoxItemRootProps
  ListBoxItemRootProps,
  ListBoxItemIndicatorProps,
  ListBoxItemVariants,
  ListBoxSectionProps, // alias of ListBoxSectionRootProps
  ListBoxSectionRootProps,
  ListBoxSectionVariants,
} from '@heroui/react';

// Default export mirrors the compound for `import Select from "@/components/ui/Select"`.
export { Select as default } from '@heroui/react';
