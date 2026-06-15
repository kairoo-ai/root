'use client';

/**
 * Checkbox - thin wrapper around HeroUI v3 (@heroui/react v3.1.0).
 *
 * HeroUI's Checkbox is a compound component. The root is callable and also
 * exposes dot-notation sub-parts:
 *   <Checkbox>            -> Checkbox.Root
 *     <Checkbox.Control>  -> the box
 *       <Checkbox.Indicator />  -> the checkmark
 *     </Checkbox.Control>
 *     <Checkbox.Content>  -> label / description slot
 *       <Label>...</Label>
 *     </Checkbox.Content>
 *   </Checkbox>
 *
 * Theming is fully token-driven via app/globals.css (HeroUI --accent/--focus/etc).
 * Do NOT hardcode colors here.
 *
 * Key props (root): isSelected, defaultSelected, isIndeterminate, isDisabled,
 * isInvalid, value, name, onChange, and variant ("primary" | "secondary").
 *
 * Verified exports against the installed package (v3.1.0):
 *   Checkbox (compound: .Root/.Control/.Indicator/.Content),
 *   CheckboxRoot, CheckboxControl, CheckboxIndicator, CheckboxContent,
 *   CheckboxGroup.
 *
 * NOTE: `CheckboxGroupContext` exists in the package source
 * (components/checkbox-group/checkbox-group.d.ts) but is intentionally NOT
 * re-exported by the `@heroui/react` barrel (its checkbox-group/index.d.ts only
 * surfaces CheckboxGroup + CheckboxGroupProps + variants). It is therefore not
 * importable from "@heroui/react" and is omitted here.
 */

export {
  // Compound root (callable + .Root/.Control/.Indicator/.Content)
  Checkbox,
  // Standalone named sub-parts (same components, non-dot access)
  CheckboxRoot,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxContent,
  // Group (its internal context is not exported by the package barrel)
  CheckboxGroup,
} from '@heroui/react';

export type {
  CheckboxProps,
  CheckboxRootProps,
  CheckboxControlProps,
  CheckboxIndicatorProps,
  CheckboxContentProps,
  CheckboxGroupProps,
} from '@heroui/react';
