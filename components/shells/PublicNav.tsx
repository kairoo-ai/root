'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth, UserButton } from '@clerk/nextjs';

import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Drawer } from '@/components/ui/Drawer';
import { Container } from '@/components/layout/Container';
import { primaryNav, type NavItem } from '@/config/navigation';
import { FloatingNavbar } from '@/components/aceternity';
import RebrandBanner from '../RebrandBanner';

/**
 * Button-shaped CTA link classes. Our Button renders a real <button>, so for
 * navigation CTAs we style the Next <Link> directly with the same token recipe
 * (mirrors Button's primary/outline variants + sizes).
 */
const ctaBase =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
const ctaSize = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm' } as const;
const ctaVariant = {
  primary: 'bg-primary text-primary-foreground hover:bg-teal-700',
  outline: 'border border-border bg-transparent text-foreground hover:bg-accent-subtle',
} as const;

/** True when the given nav href matches the current path (exact or as a section root). */
function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * PublicNav - fixed marketing top nav.
 * Transparent at the top of the page; gains a blurred card surface + bottom
 * border once the user scrolls past 50px. Desktop shows the primary links and
 * CTA cluster; mobile collapses links + CTAs into a keyboard-accessible Drawer.
 */
export default function PublicNav() {
  const isActive = useIsActive();
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-(--z-sticky) w-full transition-colors duration-200',
          scrolled
            ? 'border-b border-border bg-card/80 backdrop-blur'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <Container>
          <nav
            aria-label="Primary"
            className="flex h-16 items-center justify-between gap-4"
          >
            <Logo size={32} href="/" />

            {/* Desktop links */}
            <ul className="hidden items-center gap-6 md:flex">
              {primaryNav.map((item: NavItem) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'text-body-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
                        active ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Desktop CTA cluster */}
            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle />
              {isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(ctaBase, ctaSize.sm, ctaVariant.outline)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <UserButton />
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className={cn(ctaBase, ctaSize.sm, ctaVariant.outline)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/sign-up"
                    className={cn(ctaBase, ctaSize.sm, ctaVariant.primary)}
                  >
                    Get started free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile cluster */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <Drawer isOpen={open} onOpenChange={setOpen}>
                <Drawer.Trigger
                  aria-label="Open menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Drawer.Trigger>
                <Drawer.Backdrop variant="blur" isDismissable>
                  <Drawer.Content placement="right" className="bg-card text-foreground">
                    <Drawer.Dialog>
                      <Drawer.Header className="flex items-center justify-between border-b border-border">
                        <Drawer.Heading className="text-body-lg font-semibold text-foreground">
                          Menu
                        </Drawer.Heading>
                        <Drawer.CloseTrigger
                          aria-label="Close menu"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <X className="h-5 w-5" aria-hidden="true" />
                        </Drawer.CloseTrigger>
                      </Drawer.Header>
                      <Drawer.Body>
                        <ul className="flex flex-col gap-1 py-2">
                          {primaryNav.map((item: NavItem) => {
                            const active = isActive(item.href);
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setOpen(false)}
                                  aria-current={active ? 'page' : undefined}
                                  className={cn(
                                    'block rounded-md px-3 py-2 text-body font-medium transition-colors hover:bg-accent-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                    active
                                      ? 'bg-accent-subtle text-foreground'
                                      : 'text-muted-foreground',
                                  )}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </Drawer.Body>
                      <Drawer.Footer className="flex flex-col gap-2 border-t border-border">
                        {isSignedIn ? (
                          <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className={cn(ctaBase, ctaSize.md, ctaVariant.primary, 'w-full')}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Go to Dashboard
                          </Link>
                        ) : (
                          <>
                            <Link
                              href="/sign-in"
                              onClick={() => setOpen(false)}
                              className={cn(ctaBase, ctaSize.md, ctaVariant.outline, 'w-full')}
                            >
                              Log in
                            </Link>
                            <Link
                              href="/sign-up"
                              onClick={() => setOpen(false)}
                              className={cn(ctaBase, ctaSize.md, ctaVariant.primary, 'w-full')}
                            >
                              Get started free
                            </Link>
                          </>
                        )}
                      </Drawer.Footer>
                    </Drawer.Dialog>
                  </Drawer.Content>
                </Drawer.Backdrop>
              </Drawer>
            </div>
          </nav>
        </Container>
        <RebrandBanner forceHide={scrolled} />
      </header>

      <FloatingNavbar
        items={[
          ...primaryNav,
          {
            label: isSignedIn ? 'Dashboard' : 'Log in',
            href: isSignedIn ? '/dashboard' : '/sign-in',
          },
          ...(!isSignedIn
            ? [{ label: 'Get started', href: '/sign-up' }]
            : []),
        ]}
      />
    </>
  );
}
