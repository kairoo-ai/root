"use client";

/**
 * Dialog - thin wrapper over HeroUI v3 `Modal` (compound component).
 *
 * This is a re-export layer so the app imports dialogs from
 * "@/components/ui/Dialog" under our naming, while the real behavior,
 * accessibility, focus-trapping, and theming come straight from HeroUI v3.
 * HeroUI is already themed via our CSS variables in app/globals.css, so this
 * file is intentionally token-only and adds NO colors.
 *
 * HeroUI v3 source of truth (verified against the installed package):
 *   node_modules/@heroui/react/dist/components/modal/{index,modal}.d.ts
 *   node_modules/@heroui/react/dist/hooks/use-overlay-state.d.ts
 *
 * The v3 `Modal` is a compound component. Its sub-parts are reachable both as
 * attached members (`Dialog.Backdrop`, `Dialog.Container`, ...) and as the
 * explicit named exports below.
 *
 * Compound structure (HeroUI naming -> our naming):
 *   Modal              -> Dialog              (root, also as Dialog.Root)
 *   Modal.Trigger      -> Dialog.Trigger      / DialogTrigger
 *   Modal.Backdrop     -> Dialog.Backdrop     / DialogBackdrop   (variant: opaque|blur|transparent)
 *   Modal.Container    -> Dialog.Container    / DialogContainer  (placement, scroll, size)
 *   Modal.Dialog       -> Dialog.Content      / DialogContent    (the content surface)
 *   Modal.Header       -> Dialog.Header       / DialogHeader
 *   Modal.Icon         -> Dialog.Icon         / DialogIcon
 *   Modal.Heading      -> Dialog.Heading      / DialogHeading (alias DialogTitle)
 *   Modal.Body         -> Dialog.Body         / DialogBody
 *   Modal.Footer       -> Dialog.Footer       / DialogFooter
 *   Modal.CloseTrigger -> Dialog.CloseTrigger / DialogCloseTrigger
 *
 * Open/close state hook: `useOverlayState` (re-exported, plus `useDialogState`
 * alias). Pass its return to `<Dialog state={...}>` for controlled dialogs.
 *
 * Basic usage:
 *   import { Dialog } from "@/components/ui/Dialog";
 *   <Dialog>
 *     <Button>Open</Button>
 *     <Dialog.Backdrop>
 *       <Dialog.Container>
 *         <Dialog.Content>
 *           <Dialog.CloseTrigger />
 *           <Dialog.Header><Dialog.Heading>Title</Dialog.Heading></Dialog.Header>
 *           <Dialog.Body>Content</Dialog.Body>
 *           <Dialog.Footer><Button slot="close">Close</Button></Dialog.Footer>
 *         </Dialog.Content>
 *       </Dialog.Container>
 *     </Dialog.Backdrop>
 *   </Dialog>
 */

import {
  Modal as HeroModal,
  ModalRoot as HeroModalRoot,
  ModalTrigger as HeroModalTrigger,
  ModalBackdrop as HeroModalBackdrop,
  ModalContainer as HeroModalContainer,
  ModalDialog as HeroModalDialog,
  ModalHeader as HeroModalHeader,
  ModalIcon as HeroModalIcon,
  ModalHeading as HeroModalHeading,
  ModalBody as HeroModalBody,
  ModalFooter as HeroModalFooter,
  ModalCloseTrigger as HeroModalCloseTrigger,
  useOverlayState,
} from "@heroui/react";

import type {
  ModalRootProps,
  ModalTriggerProps,
  ModalBackdropProps,
  ModalContainerProps,
  ModalDialogProps,
  ModalHeaderProps,
  ModalIconProps,
  ModalHeadingProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseTriggerProps,
} from "@heroui/react";

/* ----------------------------------------------------------------------------
 * Compound root: `Dialog` is the HeroUI compound `Modal` re-exported as-is.
 * It already carries .Root/.Trigger/.Backdrop/.Container/.Dialog/.Header/
 * .Icon/.Heading/.Body/.Footer/.CloseTrigger as attached members.
 * -------------------------------------------------------------------------- */
export const Dialog = HeroModal;

/* Explicit named sub-parts (handy for destructured imports). */
export const DialogRoot = HeroModalRoot;
export const DialogTrigger = HeroModalTrigger;
export const DialogBackdrop = HeroModalBackdrop;
export const DialogContainer = HeroModalContainer;
/** HeroUI's `Modal.Dialog` is the content surface; exposed as DialogContent. */
export const DialogContent = HeroModalDialog;
export const DialogHeader = HeroModalHeader;
export const DialogIcon = HeroModalIcon;
export const DialogHeading = HeroModalHeading;
/** Semantic alias for the heading element. */
export const DialogTitle = HeroModalHeading;
export const DialogBody = HeroModalBody;
export const DialogFooter = HeroModalFooter;
export const DialogCloseTrigger = HeroModalCloseTrigger;

/* ----------------------------------------------------------------------------
 * State hook for controlled dialogs (open/close/toggle).
 * Re-exported under both the original name and a Dialog-flavored alias.
 * -------------------------------------------------------------------------- */
export { useOverlayState };
export const useDialogState = useOverlayState;
export type {
  UseOverlayStateProps as UseDialogStateProps,
  UseOverlayStateReturn as UseDialogStateReturn,
} from "@heroui/react";

/* ----------------------------------------------------------------------------
 * Prop types under our naming (re-exported, not redefined).
 * -------------------------------------------------------------------------- */
export type {
  ModalRootProps as DialogProps,
  ModalRootProps as DialogRootProps,
  ModalTriggerProps as DialogTriggerProps,
  ModalBackdropProps as DialogBackdropProps,
  ModalContainerProps as DialogContainerProps,
  ModalDialogProps as DialogContentProps,
  ModalHeaderProps as DialogHeaderProps,
  ModalIconProps as DialogIconProps,
  ModalHeadingProps as DialogHeadingProps,
  ModalHeadingProps as DialogTitleProps,
  ModalBodyProps as DialogBodyProps,
  ModalFooterProps as DialogFooterProps,
  ModalCloseTriggerProps as DialogCloseTriggerProps,
};

/* ----------------------------------------------------------------------------
 * Escape hatch: also expose the original HeroUI `Modal` name + native types,
 * so callers that prefer the upstream vocabulary can use it via our barrel.
 * -------------------------------------------------------------------------- */
export { HeroModal as Modal };
export type {
  ModalRootProps,
  ModalTriggerProps,
  ModalBackdropProps,
  ModalContainerProps,
  ModalDialogProps,
  ModalHeaderProps,
  ModalIconProps,
  ModalHeadingProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseTriggerProps,
};
