
import Navbar from "@/components/non-dash-nav/navbar";
import Footer from "@/components/footer/index";
import Landing from "@/app/(nondashboard)/landing/page";
import ScrollToTop from "@/components/scroll-to-top";


export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Landing />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
