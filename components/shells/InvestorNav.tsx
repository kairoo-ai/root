'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerDialog,
  DrawerHeader,
  DrawerHeading,
} from '@/components/ui/Drawer';
import { Container } from '@/components/layout/Container';
import { investorNav, type NavItem } from '@/config/navigation';

/**
 * InvestorNav - a separate, quieter top nav for the gated `/investors` section.
 *
 * Deliberately calmer than the public nav: always solid-ish (bg-card/80 +
 * backdrop-blur), no scroll-triggered state changes. Token-only, reduced-motion
 * safe (only color transitions), and fully keyboard operable.
 */
export default function InvestorNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Overview shares its base path with sub-routes, so it must match exactly;
  // every other link uses prefix matching to stay active on nested pages.
  const isActive = (item: NavItem) => {
    const base = '/investors';
    if (item.href === base) {
      return pathname === base;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const linkClasses = (active: boolean) =>
    cn(
      'rounded-md px-2 py-1 text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'hover:bg-accent-subtle',
      active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    );

  return (
    <nav
      aria-label="Investor"
      className="fixed inset-x-0 top-0 z-[var(--z-sticky)] border-b border-border bg-card/80 backdrop-blur"
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Brand + section label */}
        <div className="flex items-center gap-3">
          <Logo size={28} href="/investors" />
          <span className="hidden text-overline text-muted-foreground sm:inline">
            Investors
          </span>
        </div>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {investorNav.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={linkClasses(active)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to site
          </Link>

          <ThemeToggle />

          {/* Mobile trigger */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Open investor menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            className="h-9 w-9 px-0 md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </Container>

      {/* Mobile drawer */}
      <Drawer isOpen={open} onOpenChange={setOpen}>
        <DrawerBackdrop variant="blur" isDismissable>
          <DrawerContent placement="right">
            <DrawerDialog>
              <DrawerHeader>
                <DrawerHeading className="flex items-center gap-3">
                  <Logo size={24} href="/investors" />
                  <span className="text-overline text-muted-foreground">
                    Investors
                  </span>
                </DrawerHeading>
              </DrawerHeader>
              <DrawerBody>
                <ul className="flex flex-col gap-1">
                  {investorNav.map((item) => {
                    const active = isActive(item);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? 'page' : undefined}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            'hover:bg-accent-subtle',
                            active
                              ? 'bg-accent-subtle text-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <Separator className="my-4" />

                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to site
                </Link>
              </DrawerBody>
            </DrawerDialog>
          </DrawerContent>
        </DrawerBackdrop>
      </Drawer>
    </nav>
  );
}
