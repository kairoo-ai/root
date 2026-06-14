import PublicNav from "@/components/shells/PublicNav";
import Footer from "@/components/shells/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
