'use client';

/**
 * Toast - thin wrapper over HeroUI v3 (@heroui/react) Toast.
 *
 * Verified against @heroui/react@3.1.0
 *   node_modules/@heroui/react/dist/components/toast/index.d.ts
 *   node_modules/@heroui/react/dist/components/toast/toast.d.ts
 *   node_modules/@heroui/react/dist/components/toast/toast-queue.d.ts
 *
 * HeroUI's toast is an IMPERATIVE system: you call the `toast(...)` function to
 * enqueue a toast, and a provider renders the toast region. There is NO hook
 * (no `useToast`) - `toast` is a plain function with variant methods attached.
 *
 * ── Provider (mount ONCE, at the app root - NOT mounted here) ────────────────
 *   This wrapper intentionally does NOT mount the provider globally. Add it to
 *   your root layout/provider tree exactly once, e.g.:
 *
 *     // app/layout.tsx (or a client providers file)
 *     import { ToastProvider } from '@/components/ui/Toast';
 *     ...
 *     <body>
 *       {children}
 *       <ToastProvider placement="bottom-right" />
 *     </body>
 *
 *   `ToastProvider` is the same value as `Toast.Provider`.
 *
 * ── Triggering toasts (from anywhere, client-side) ───────────────────────────
 *   import { toast } from '@/components/ui/Toast';
 *
 *   toast('Saved');                                 // default
 *   toast.success('Profile updated');
 *   toast.danger('Something went wrong');           // NOTE: `danger`, not `error`
 *   toast.info('Heads up');
 *   toast.warning('Careful');
 *   toast('Deleted', { description: 'Item removed', timeout: 6000 });
 *   toast.promise(saveAsync(), {
 *     loading: 'Saving…', success: 'Saved', error: (e) => e.message,
 *   });
 *   toast.close(key); toast.clear(); toast.pauseAll(); toast.resumeAll();
 *
 * ── Custom rendering (rare) ──────────────────────────────────────────────────
 *   The compound sub-parts (Toast.Content / Title / Description / Indicator /
 *   ActionButton / CloseButton) are re-exported below for fully custom toast
 *   layouts. Most apps only need `toast(...)` + a mounted `<ToastProvider />`.
 *
 * Token-only: colors/spacing come from HeroUI's theme variables (aliased to our
 * design tokens in app/globals.css). No hardcoded colors here.
 */

import { Toast as HeroToast, toast, toastQueue, ToastQueue } from '@heroui/react';
// The toast barrel declaration-merges `Toast` as BOTH a value (the component)
// and a type (a namespace-like object carrying `ActionProps`, etc.). The value
// re-export below (`export const Toast = HeroToast`) only forwards the value
// side, so we import the TYPE side separately to recover `Toast.ActionProps`.
import type { Toast as HeroToastType } from '@heroui/react';
import type {
  ToastProps,
  ToastProviderProps,
  ToastContentProps,
  ToastDescriptionProps,
  ToastIndicatorProps,
  ToastTitleProps,
  ToastCloseButtonProps,
  ToastVariants,
  ToastQueueOptions,
  ToastContentValue,
} from '@heroui/react';

// Re-export the compound component under our naming. Sub-parts are accessed as
// Toast.Provider / Toast.Content / Toast.Title / Toast.Description /
// Toast.Indicator / Toast.ActionButton / Toast.CloseButton (and Toast.Queue).
export const Toast = HeroToast;

// The imperative API + queue primitives.
export { toast, toastQueue, ToastQueue };

// Convenience aliases for the compound sub-parts so they can also be imported
// directly when destructuring reads cleaner.
export const ToastProvider = HeroToast.Provider;
export const ToastContent = HeroToast.Content;
export const ToastTitle = HeroToast.Title;
export const ToastDescription = HeroToast.Description;
export const ToastIndicator = HeroToast.Indicator;
export const ToastActionButton = HeroToast.ActionButton;
export const ToastCloseButton = HeroToast.CloseButton;

export type {
  ToastProps,
  ToastProviderProps,
  ToastContentProps,
  ToastDescriptionProps,
  ToastIndicatorProps,
  ToastTitleProps,
  ToastCloseButtonProps,
  ToastVariants,
  ToastQueueOptions,
  ToastContentValue,
};

// `ToastActionButtonProps` is not re-exported as a standalone type by the v3
// barrel; surface it via the compound namespace type instead. (Indexed access
// off the type-side `Toast` import - `Toast.ActionProps` dotted syntax fails
// because our local `Toast` const is value-only.)
export type ToastActionButtonProps = HeroToastType['ActionProps'];

// Options accepted by the imperative `toast(...)` calls (description, variant,
// timeout, actionProps, indicator, isLoading, onClose). The barrel does not
// re-export `HeroUIToastOptions` by name, so derive it from the function's
// signature to stay in lockstep with the installed version.
export type ToastOptions = NonNullable<Parameters<typeof toast>[1]>;

export default Toast;
