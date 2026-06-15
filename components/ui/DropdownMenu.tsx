"use client";

/**
 * DropdownMenu - thin wrapper over HeroUI v3 (@heroui/react).
 *
 * In HeroUI v3 the "menu that drops down from a trigger" pattern is the
 * `Dropdown` compound component (trigger + popover + menu, built on
 * react-aria-components). It is fully accessible (focus management, typeahead,
 * dismiss-on-outside, ARIA wiring, keyboard selection) and already themed via
 * our CSS-variable tokens in app/globals.css. We re-export the REAL v3 exports
 * under our naming rather than reimplementing anything - this file is token-only
 * and hardcodes no colors.
 *
 * We expose it under both names:
 *   - `DropdownMenu` (our app's name) === HeroUI's `Dropdown` compound.
 *   - `Dropdown` (the v3 name) for parity with the docs.
 *
 * Compound usage (matches v3 docs):
 *   <DropdownMenu>
 *     <Button variant="secondary">Actions</Button>
 *     <DropdownMenu.Popover>
 *       <DropdownMenu.Menu onAction={(key) => console.log(key)}>
 *         <DropdownMenu.Item id="new" textValue="New file">
 *           <Label>New file</Label>
 *         </DropdownMenu.Item>
 *         <DropdownMenu.Item id="del" textValue="Delete" variant="danger">
 *           <Label>Delete</Label>
 *         </DropdownMenu.Item>
 *       </DropdownMenu.Menu>
 *     </DropdownMenu.Popover>
 *   </DropdownMenu>
 *
 * Item props:  `id` (Key) + `textValue` (string, for typeahead) + `variant`.
 * Menu props:  `selectionMode` | `selectedKeys` | `onSelectionChange` |
 *              `onAction` | `disabledKeys`.
 *
 * Flat sub-parts are also exported (DropdownMenuTrigger, DropdownMenuItem, ...)
 * for those who prefer flat imports over dot-notation.
 *
 * NOTE: If you need a *standalone* menu (no trigger/popover - e.g. inside your
 * own surface), use the re-exported `Menu` primitive and its parts below
 * (Menu.Item / Menu.Section / Menu.ItemIndicator).
 */

import {
  // Dropdown (trigger + popover + menu) - our DropdownMenu maps to this.
  Dropdown as HeroDropdown,
  DropdownRoot,
  DropdownTrigger,
  DropdownPopover,
  DropdownMenu as HeroDropdownMenu,
  DropdownSection,
  DropdownItem,
  DropdownItemIndicator,
  DropdownSubmenuTrigger,
  DropdownSubmenuIndicator,
  dropdownVariants,
  // Standalone Menu primitive (no trigger/popover).
  Menu,
  MenuRoot,
  MenuItem,
  MenuSection,
  menuVariants,
  menuItemVariants,
  menuSectionVariants,
} from "@heroui/react";

import type {
  DropdownProps,
  DropdownRootProps,
  DropdownTriggerProps,
  DropdownPopoverProps,
  DropdownMenuProps,
  DropdownSectionProps,
  DropdownItemProps,
  DropdownItemIndicatorProps,
  DropdownSubmenuTriggerProps,
  DropdownSubmenuIndicatorProps,
  DropdownVariants,
  MenuProps,
  MenuRootProps,
  MenuItemProps,
  MenuSectionProps,
  MenuVariants,
  MenuItemVariants,
  MenuSectionVariants,
} from "@heroui/react";

/**
 * DropdownMenu - primary compound component (our app name for v3 `Dropdown`).
 * Exposes .Root / .Trigger / .Popover / .Menu / .Section / .Item /
 * .ItemIndicator / .SubmenuTrigger / .SubmenuIndicator.
 */
export const DropdownMenu = HeroDropdown;

// v3-name alias, for parity with the official docs.
export const Dropdown = HeroDropdown;

// Named sub-parts under our DropdownMenu* naming (flat imports).
export {
  DropdownRoot as DropdownMenuRoot,
  DropdownTrigger as DropdownMenuTrigger,
  DropdownPopover as DropdownMenuPopover,
  HeroDropdownMenu as DropdownMenuMenu,
  DropdownSection as DropdownMenuSection,
  DropdownItem as DropdownMenuItem,
  DropdownItemIndicator as DropdownMenuItemIndicator,
  DropdownSubmenuTrigger as DropdownMenuSubmenuTrigger,
  DropdownSubmenuIndicator as DropdownMenuSubmenuIndicator,
};

// Also re-export the raw v3 sub-part names verbatim (no rename) for direct use.
export {
  DropdownRoot,
  DropdownTrigger,
  DropdownPopover,
  HeroDropdownMenu as DropdownMenuPrimitive,
  DropdownSection,
  DropdownItem,
  DropdownItemIndicator,
  DropdownSubmenuTrigger,
  DropdownSubmenuIndicator,
  dropdownVariants,
};

// Standalone Menu primitive (use when you don't want a trigger/popover).
export {
  Menu,
  MenuRoot,
  MenuItem,
  MenuSection,
  menuVariants,
  menuItemVariants,
  menuSectionVariants,
};

export type {
  DropdownProps,
  DropdownRootProps,
  // App-name alias for the root props (props for the whole DropdownMenu compound).
  DropdownRootProps as DropdownMenuRootProps,
  DropdownTriggerProps,
  DropdownPopoverProps,
  DropdownMenuProps,
  DropdownSectionProps,
  DropdownItemProps,
  DropdownItemIndicatorProps,
  DropdownSubmenuTriggerProps,
  DropdownSubmenuIndicatorProps,
  DropdownVariants,
  MenuProps,
  MenuRootProps,
  MenuItemProps,
  MenuSectionProps,
  MenuVariants,
  MenuItemVariants,
  MenuSectionVariants,
};

export default DropdownMenu;
