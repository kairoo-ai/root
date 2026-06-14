import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment, type HTMLAttributes } from "react";

const breadcrumb = cva(
  "flex items-center gap-2 text-body-sm text-muted-foreground",
);

export type BreadcrumbItem = { label: string; href?: string };

export type BreadcrumbProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof breadcrumb> & {
    items: BreadcrumbItem[];
  };

export function Breadcrumb({ className, items, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" {...props}>
      <ol className={cn(breadcrumb(), className)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className="inline-flex items-center">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="text-foreground"
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                />
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
