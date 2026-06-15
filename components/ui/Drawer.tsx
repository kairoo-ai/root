'use client';

/**
 * Drawer - thin wrapper around HeroUI v3's real Drawer (a side/edge sheet).
 *
 * Source of truth: https://heroui.com/docs/react/components/drawer
 * Verified against installed @heroui/react v3.1.0 (dist/components/drawer).
 *
 * HeroUI ships a COMPOUND `Drawer`: the export is callable (it is the Root /
 * DialogTrigger) AND carries attached sub-parts:
 *   Drawer.Root | Drawer.Trigger | Drawer.Backdrop | Drawer.Content |
 *   Drawer.Dialog | Drawer.Header | Drawer.Heading | Drawer.Body |
 *   Drawer.Footer | Drawer.Handle | Drawer.CloseTrigger
 *
 * It also exports each part as a flat named primitive. We re-export BOTH styles
 * so callers can pick whichever reads best:
 *
 *   // compound (recommended)
 *   import { Drawer } from "@/components/ui/Drawer";
 *   <Drawer>
 *     <Drawer.Trigger>Open</Drawer.Trigger>
 *     <Drawer.Backdrop>
 *       <Drawer.Content placement="right">
 *         <Drawer.Dialog>
 *           <Drawer.Header><Drawer.Heading>Title</Drawer.Heading></Drawer.Header>
 *           <Drawer.Body>…</Drawer.Body>
 *           <Drawer.Footer><Drawer.CloseTrigger>Close</Drawer.CloseTrigger></Drawer.Footer>
 *         </Drawer.Dialog>
 *       </Drawer.Content>
 *     </Drawer.Backdrop>
 *   </Drawer>
 *
 *   // flat parts
 *   import { DrawerContent, DrawerBody } from "@/components/ui/Drawer";
 *
 * Key props (v3):
 *   - placement: "top" | "bottom" | "left" | "right"  → on Drawer.Content (default "bottom")
 *   - variant: "opaque" | "blur" | "transparent"      → on Drawer.Backdrop (default "opaque")
 *   - isDismissable, isKeyboardDismissDisabled         → on Drawer.Backdrop
 *   - isOpen / defaultOpen / onOpenChange (controlled)  → on Drawer.Root (the Drawer trigger)
 *
 * Token-only: colors/blur come from HeroUI's themed CSS variables wired in
 * app/globals.css. No hardcoded colors here.
 */

export {
  // Compound default - `Drawer` is callable AND has .Root/.Trigger/.Content/etc.
  Drawer,

  // Flat named primitives (same components, attached on the compound above).
  DrawerRoot,
  DrawerTrigger,
  DrawerBackdrop,
  DrawerContent,
  DrawerDialog,
  DrawerHeader,
  DrawerHeading,
  DrawerBody,
  DrawerFooter,
  DrawerHandle,
  DrawerCloseTrigger,

  // Style recipe, in case a caller needs to compose tokens.
  drawerVariants,
} from '@heroui/react';

export type {
  DrawerProps, // alias of DrawerRootProps
  DrawerRootProps,
  DrawerTriggerProps,
  DrawerBackdropProps,
  DrawerContentProps,
  DrawerDialogProps,
  DrawerHeaderProps,
  DrawerHeadingProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerHandleProps,
  DrawerCloseTriggerProps,
  DrawerVariants,
} from '@heroui/react';

// Default export mirrors the compound for `import Drawer from "@/components/ui/Drawer"`.
export { Drawer as default } from '@heroui/react';
