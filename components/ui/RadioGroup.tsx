'use client';

/**
 * RadioGroup - thin wrapper around HeroUI v3's RadioGroup + Radio.
 *
 * Re-exports the REAL v3 exports under our naming so the app can import from
 * "@/components/ui/RadioGroup". Token-only (no hardcoded colors); HeroUI is
 * already themed via CSS variables in app/globals.css.
 *
 * v3 compound API:
 *   <RadioGroup label=… (use Label child) value/defaultValue, onChange={(v)=>…}, orientation, variant>
 *     <Radio value="a">A</Radio>            // simple usage (Radio renders its own control/content)
 *     <Radio value="b">                      // or compose with sub-parts:
 *       <Radio.Control><Radio.Indicator /></Radio.Control>
 *       <Radio.Content>B</Radio.Content>
 *     </Radio>
 *   </RadioGroup>
 *
 * Docs: https://heroui.com/docs/react/components/radio-group
 */

import {
  RadioGroup as HeroRadioGroup,
  Radio as HeroRadio,
  // explicit primitive roots (sub-parts come off the compound Radio.* below)
  RadioGroupRoot,
  RadioRoot,
} from '@heroui/react';

export type {
  RadioGroupProps,
  RadioGroupRootProps,
  RadioGroupVariants,
  RadioProps,
  RadioRootProps,
  RadioControlProps,
  RadioIndicatorProps,
  RadioContentProps,
} from '@heroui/react';

/**
 * RadioGroup - the container. Compound: `RadioGroup.Root`.
 * Key props: value, defaultValue, onChange (value: string) => void, name,
 * orientation ('horizontal' | 'vertical'), isDisabled, isRequired, isReadOnly,
 * isInvalid, variant ('primary' | 'secondary').
 */
export const RadioGroup = HeroRadioGroup;

/**
 * Radio - an individual option. Compound: `Radio.Root`, `Radio.Control`,
 * `Radio.Indicator`, `Radio.Content`. Key props: value, isDisabled, name.
 */
export const Radio = HeroRadio;

// Named sub-parts, for callers who prefer flat imports over the compound dot-API.
export const RadioGroupRootPart = RadioGroupRoot;
export const RadioRootPart = RadioRoot;
export const RadioControl = HeroRadio.Control;
export const RadioIndicator = HeroRadio.Indicator;
export const RadioContent = HeroRadio.Content;

export default RadioGroup;
