import * as React from "react";
import { cn } from "@/lib/utils";

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Minimal Slot: merges its own props + ref onto its single React child.
 * - className is composed via cn (child className wins on conflicts last).
 * - event handlers are chained (slot handler runs, then child handler).
 * - style objects are merged.
 * - refs are composed so both Slot consumers and the child get the node.
 * No external dependencies.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, className, style, ...slotProps },
  forwardedRef,
) {
  if (!React.isValidElement(children)) {
    if (React.Children.count(children) > 1) {
      throw new Error("Slot expects a single React element child.");
    }
    return null;
  }

  const child = children as React.ReactElement<Record<string, unknown>>;
  const childProps = child.props;

  const mergedProps: Record<string, unknown> = {
    ...slotProps,
    ...childProps,
  };

  // Chain event handlers (props starting with "on" + uppercase char).
  for (const key of Object.keys(slotProps)) {
    const isHandler = /^on[A-Z]/.test(key);
    const slotHandler = (slotProps as Record<string, unknown>)[key];
    const childHandler = (childProps as Record<string, unknown>)[key];
    if (isHandler && typeof slotHandler === "function") {
      if (typeof childHandler === "function") {
        mergedProps[key] = (...args: unknown[]) => {
          (slotHandler as (...a: unknown[]) => unknown)(...args);
          return (childHandler as (...a: unknown[]) => unknown)(...args);
        };
      } else {
        mergedProps[key] = slotHandler;
      }
    }
  }

  // Compose className and merge style.
  mergedProps.className = cn(className, childProps.className as string | undefined);
  mergedProps.style = {
    ...(style as React.CSSProperties | undefined),
    ...(childProps.style as React.CSSProperties | undefined),
  };

  mergedProps.ref = composeRefs(forwardedRef, (child as { ref?: React.Ref<unknown> }).ref);

  return React.cloneElement(child, mergedProps);
});

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}
