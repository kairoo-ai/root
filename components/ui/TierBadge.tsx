import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const tierStyles: Record<"free" | "pro" | "enterprise", string> = {
  free: "bg-tier-free/15 text-tier-free",
  pro: "bg-tier-pro/15 text-tier-pro",
  enterprise: "bg-tier-enterprise text-tier-enterprise-accent",
};
const tierLabel = { free: "Free", pro: "Pro", enterprise: "Enterprise" } as const;

export type TierBadgeProps = HTMLAttributes<HTMLSpanElement> & { tier: "free" | "pro" | "enterprise" };
export function TierBadge({ tier, className, ...props }: TierBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold", tierStyles[tier], className)}
      {...props}
    >
      {tierLabel[tier]}
    </span>
  );
}
