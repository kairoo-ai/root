import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "@/components/ui/slot";
import { Spinner } from "@/components/ui/Spinner";

const button = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-teal-700",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted-surface",
        outline: "border border-border bg-transparent text-foreground hover:bg-accent-subtle",
        ghost: "bg-transparent text-foreground hover:bg-accent-subtle",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    /**
     * Render via Slot, merging props onto the single child element instead of a
     * <button>. Lets the Button wrap e.g. a next/link <a> or a HeroUI overlay
     * trigger while keeping all token styling. Loading state is unavailable when
     * asChild is true (the child controls its own content).
     */
    asChild?: boolean;
    /** Show a Spinner, set aria-busy, and disable interaction. */
    isLoading?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, isLoading = false, disabled, children, ...props },
  ref,
) {
  const classes = cn(button({ variant, size }), className);

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  const spinnerSize = size === "lg" ? "md" : "sm";

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? true : undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="absolute inset-0 inline-flex items-center justify-center">
            <Spinner size={spinnerSize} />
          </span>
          <span className="contents opacity-0">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});
