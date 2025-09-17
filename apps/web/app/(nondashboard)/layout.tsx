import Navbar from "@/components/non-dash-nav/navbar";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" bg-background text-foreground min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
