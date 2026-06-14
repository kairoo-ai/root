import InvestorNav from "@/components/shells/InvestorNav";
import Footer from "@/components/shells/Footer";

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InvestorNav />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
