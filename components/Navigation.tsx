'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@heroui/react';
import Logo from "@/components/Logo";

const navLinks = [
  { href: '/#features', label: 'Features', match: '/' },
  { href: '/#pricing', label: 'Pricing', match: '/' },
  { href: '/business-strategy', label: 'Business Strategy' },
  { href: '/market-analysis', label: 'Market Analysis' },
  { href: '/investor-deck', label: 'Investor Resources' },
  { href: '/technical-architecture', label: 'Tech Architecture' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string, match?: string) => {
    if (match && pathname === match) {
      return true;
    }
    return pathname === path;
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'nav-scrolled shadow-lg shadow-black/10' : ''
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Logo size={32} href="/" />
        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition ${
                isActive(link.href.replace('/#', '/'), link.match)
                  ? 'text-cyan-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            as={Link}
            href="/#pricing"
            color="secondary"
            radius="full"
            className="hidden bg-linear-to-r from-[#7c79c6] via-[#9f7aea] to-[#00f5d4] text-sm font-semibold text-white md:inline-flex"
          >
            Get Started
          </Button>
          <Button
            as={Link}
            href="/investor-deck"
            variant="bordered"
            radius="full"
            className="border-white/30 text-sm font-semibold text-white"
          >
            Book Demo
          </Button>
        </div>
      </div>
    </nav>
  );
}

