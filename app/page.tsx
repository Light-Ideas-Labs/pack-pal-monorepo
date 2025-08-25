
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Landing from "@/app/(nondashboard)/landing/page";
import ScrollToTop from "@/components/ScrollToTop";


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
