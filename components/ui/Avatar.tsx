import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const avatar = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted-surface text-muted-foreground text-caption font-semibold",
  {
    variants: {
      size: { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" },
    },
    defaultVariants: { size: "md" },
  },
);

export type AvatarProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof avatar> & {
    src?: string;
    alt?: string;
    initials?: string;
  };

export function Avatar({ className, size, src, alt, initials, ...props }: AvatarProps) {
  return (
    <span className={cn(avatar({ size }), className)} {...props}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden={!alt}>{initials}</span>
      )}
    </span>
  );
}
