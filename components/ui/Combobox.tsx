'use client';

/**
 * Combobox - thin wrapper over HeroUI v3 `ComboBox`.
 *
 * A type-to-filter combobox: a text Input with a filterable Popover ListBox.
 * Re-exports the REAL v3 exports (verified against @heroui/react@3.1.0) under our
 * naming, so the app imports everything from "@/components/ui/Combobox".
 *
 * NOTE: In HeroUI v3, v2's `Autocomplete` was NOT collapsed into `ComboBox` -
 * both components coexist. `ComboBox` (this file) is the text-input + filter
 * variant (built on react-aria-components `ComboBox`); `Autocomplete` is the
 * Select-based variant. We wrap `ComboBox` as requested.
 *
 * Verified v3 exports used (all from "@heroui/react"):
 *   - ComboBox            (compound root: ComboBox.Root/.InputGroup/.Trigger/.Popover)
 *   - ComboBoxRoot, ComboBoxInputGroup, ComboBoxTrigger, ComboBoxPopover, ComboBoxContext
 *   - comboBoxVariants    (style recipe)
 *   - types: ComboBoxProps (= ComboBoxRootProps), ComboBoxInputGroupProps,
 *            ComboBoxTriggerProps, ComboBoxPopoverProps, ComboBoxVariants
 * Companion collection/field parts a ComboBox is composed with (per v3 docs),
 * re-exported here for one-import ergonomics:
 *   - ListBox (with ListBox.Item / ListBox.ItemIndicator), Input, Label
 *
 * Token-only: HeroUI v3 is already themed via our CSS variables in app/globals.css.
 * No colors are hardcoded here.
 */

import {
  ComboBox as HeroComboBox,
  ComboBoxRoot,
  ComboBoxInputGroup,
  ComboBoxTrigger,
  ComboBoxPopover,
  ComboBoxContext,
  comboBoxVariants,
  ListBox,
  Input,
  Label,
} from '@heroui/react';

import type {
  ComboBoxProps,
  ComboBoxInputGroupProps,
  ComboBoxTriggerProps,
  ComboBoxPopoverProps,
  ComboBoxVariants,
} from '@heroui/react';

/* -------------------------------------------------------------------------------------------------
 * Primary export
 * -----------------------------------------------------------------------------------------------*/

/**
 * Compound Combobox. Use the sub-parts to assemble it:
 *
 *   <Combobox className="w-[256px]" defaultItems={items}>
 *     <Label>Favorite Animal</Label>
 *     <Combobox.InputGroup>
 *       <Input placeholder="Search…" />
 *       <Combobox.Trigger />
 *     </Combobox.InputGroup>
 *     <Combobox.Popover>
 *       <ListBox>
 *         <ListBox.Item id="cat" textValue="Cat">
 *           Cat
 *           <ListBox.ItemIndicator />
 *         </ListBox.Item>
 *       </ListBox>
 *     </Combobox.Popover>
 *   </Combobox>
 *
 * The root carries react-aria-components ComboBox props:
 *   items / defaultItems, selectedKey / defaultSelectedKey, onSelectionChange,
 *   inputValue / defaultInputValue, onInputChange, menuTrigger ("focus" | "input" | "manual"),
 *   allowsCustomValue, isDisabled, isRequired, disabledKeys, plus variant ("primary" | "secondary").
 */
export const Combobox = HeroComboBox;

/* Compound sub-parts under our naming (also reachable as Combobox.InputGroup etc.) */
export const ComboboxRoot = ComboBoxRoot;
export const ComboboxInputGroup = ComboBoxInputGroup;
export const ComboboxTrigger = ComboBoxTrigger;
export const ComboboxPopover = ComboBoxPopover;
export const ComboboxContext = ComboBoxContext;

/* Style recipe (token-driven), if a consumer needs the slots directly. */
export const comboboxVariants = comboBoxVariants;

/* Companion parts a Combobox is composed with - re-exported for single-import ergonomics. */
export { ListBox, Input, Label };

/* Types */
export type {
  ComboBoxProps as ComboboxProps,
  ComboBoxInputGroupProps as ComboboxInputGroupProps,
  ComboBoxTriggerProps as ComboboxTriggerProps,
  ComboBoxPopoverProps as ComboboxPopoverProps,
  ComboBoxVariants as ComboboxVariants,
};

export default Combobox;
