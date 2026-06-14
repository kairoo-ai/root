"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const pageButton = cva(
  "inline-flex items-center justify-center h-9 min-w-9 px-3 rounded-md border border-border text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      active: {
        true: "bg-primary text-primary-foreground",
        false: "bg-transparent text-foreground hover:bg-accent-subtle",
      },
    },
    defaultVariants: { active: false },
  },
);

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> &
  VariantProps<typeof pageButton> & {
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };

export function Pagination({
  className,
  page,
  pageCount,
  onPageChange,
  ...props
}: PaginationProps) {
  const pages = Array.from({ length: Math.max(pageCount, 0) }, (_, i) => i + 1);
  const goTo = (next: number) => onPageChange(Math.min(Math.max(next, 1), pageCount));

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <button
        type="button"
        aria-label="Previous page"
        className={cn(pageButton({ active: false }))}
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-label={`Page ${p}`}
          aria-current={p === page ? "page" : undefined}
          className={cn(pageButton({ active: p === page }))}
          onClick={() => goTo(p)}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        className={cn(pageButton({ active: false }))}
        disabled={page >= pageCount}
        onClick={() => goTo(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
