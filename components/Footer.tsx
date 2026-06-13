import Link from 'next/link';
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-24 md:mt-32 border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <div className="mb-4"><Logo size={28} href="/" /></div>
            <p className="text-muted-foreground">
              The most advanced AI-powered platform for career development, learning, and business strategy.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/investors/strategy" className="hover:text-primary">
                  Business Strategy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/investors/market" className="hover:text-primary">
                  Market Analysis
                </Link>
              </li>
              <li>
                <Link href="/investors/deck" className="hover:text-primary">
                  Investor Resources
                </Link>
              </li>
              <li>
                <Link href="/investors/architecture" className="hover:text-primary">
                  Tech Architecture
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/#about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#careers" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="text-muted-foreground hover:text-foreground transition-colors">
                  Acceptable Use
                </Link>
              </li>
              <li>
                <Link href="/ai-disclosure" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Disclosure
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2026 Kairoo. All rights reserved. Made with ❤️ for the future of work.</p>
        </div>
      </div>
    </footer>
  );
}

