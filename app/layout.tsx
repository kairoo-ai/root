import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Mona_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from "./providers";
import { clerkAppearance } from "@/lib/clerk-appearance";
// import RebrandBanner from "@/components/RebrandBanner";
import CookieConsent from "@/components/CookieConsent";
import { SchemaOrg } from "@/components/SchemaOrg";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});

const monaSans = Mona_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mona-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Kairoo";

export const metadata: Metadata = {
  title: `${appName} - The right moment to grow`,
  description:
    `${appName} is AI career development that grows with you - coaching, learning paths, and team analytics for individuals, professionals, and enterprises.`,
  metadataBase: new URL("https://kairoo.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: appName,
    title: `${appName} - The right moment to grow`,
    description:
      `${appName} merges 32+ AI-powered career tools, intelligent learning paths, and strategic business intelligence into one platform.`,
    url: "https://kairoo.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${appName} - The right moment to grow`,
    description:
      `${appName} merges 32+ AI-powered career tools, intelligent learning paths, and strategic business intelligence into one platform.`,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  other: {
    "theme-color": "#0B1F3A",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body
          className={`${dmSans.variable} ${spaceGrotesk.variable} ${monaSans.variable} ${geistMono.variable} antialiased transition-colors duration-500`}
          suppressHydrationWarning
        >
          <SchemaOrg />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[var(--z-tooltip)] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
          >
            Skip to main content
          </a>
          <Providers>
            {/* <RebrandBanner /> */}
            <div id="main-content" className="relative z-10 flex min-h-screen flex-col">{children}</div>
            <CookieConsent />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
