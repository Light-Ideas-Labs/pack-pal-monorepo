import Navbar from "@/components/non-dash-nav/navbar";
import Footer from "@/components/footer";

export default function DashboardLayout({children}: {children: React.ReactNode}) {

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Top nav for all dashboard pages */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Global footer */}
      <Footer />
    </div>
  );
}
