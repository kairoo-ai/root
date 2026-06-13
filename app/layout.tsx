import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Mona_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingThemeToggle from "@/components/FloatingThemeToggle";

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

export const metadata: Metadata = {
  title: "AstraPath AI - Your AI-Powered Career & Learning Command Center",
  description: "Stop wasting time on scattered career resources. AstraPath AI merges advanced career development tools with intelligent learning systems and strategic business insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${monaSans.variable} antialiased transition-colors duration-500`}
        suppressHydrationWarning
      >
        <Providers>
          <AnimatedBackground />
          <FloatingThemeToggle />
          <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
