import PublicNav from "@/components/shells/PublicNav";
import Footer from "@/components/shells/Footer";
import AuroraBackground from "@/components/motion/AuroraBackground";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuroraBackground className="pointer-events-none" />
      <PublicNav />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
