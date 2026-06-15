import Link from "next/link";
import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/Separator";
import { Container } from "@/components/layout/Container";
import { footerNav } from "@/config/navigation";

/**
 * Site footer - token-driven, accessible.
 * Brand column + link columns sourced from `footerNav` (includes legal links),
 * a separator, and a copyright row with the current year.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand column */}
          <div className="md:col-span-4">
            <Logo size={28} href="/" />
            <p className="mt-4 max-w-xs text-body-sm text-muted-foreground">
              The most advanced AI-powered platform for career development,
              learning, and business strategy.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
            {footerNav.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h2 className="text-overline text-muted-foreground">
                  {column.heading}
                </h2>
                <ul className="mt-4 space-y-3">
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        {...(item.external
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                        className="rounded-sm text-body-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <Separator className="my-10" />

        <p className="text-caption text-muted-foreground">
          &copy; {year} {process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}
        </p>
      </Container>
    </footer>
  );
}
