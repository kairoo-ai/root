import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Mona_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingThemeToggle from "@/components/FloatingThemeToggle";
import RebrandBanner from "@/components/RebrandBanner";
import CookieConsent from "@/components/CookieConsent";

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

export const metadata: Metadata = {
  title: "Kairoo — The right moment to grow",
  description:
    "Kairoo is AI career development that grows with you — coaching, learning paths, and team analytics for individuals, professionals, and enterprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${monaSans.variable} ${geistMono.variable} antialiased transition-colors duration-500`}
        suppressHydrationWarning
      >
        <Providers>
          <RebrandBanner />
          <AnimatedBackground />
          <FloatingThemeToggle />
          <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
