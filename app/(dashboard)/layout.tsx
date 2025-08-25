"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, LayoutGrid, Luggage, Map, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/trips", label: "Trips", icon: Luggage },
  { href: "/dashboard/docs", label: "Documents", icon: FileText },
  { href: "/dashboard/maps", label: "Maps", icon: Map },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background/60">
      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded-md bg-brand-300" />
            <span className="font-bold">PackPal</span>
          </Link>
          <Link href="/dashboard/trips/new">
            <Button className="gap-2 bg-brand-500 hover:bg-brand-600">
              <Plus className="h-4 w-4" /> New trip
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r bg-card lg:block">
          <div className="flex items-center gap-2 px-5 py-4">
            <span className="inline-block h-7 w-7 rounded-md bg-brand-300" />
            <span className="font-bold">PackPal</span>
          </div>
          <nav className="mt-2 space-y-1 px-2">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition
                    ${active ? "bg-brand-50 text-foreground" : "text-foreground/70 hover:bg-muted"}`}
                >
                  <Icon className="h-4 w-4 text-brand-600" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="px-4 py-4">
            <Link href="/dashboard/trips/new">
              <Button className="w-full gap-2 bg-brand-500 hover:bg-brand-600">
                <Plus className="h-4 w-4" />
                New trip
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
