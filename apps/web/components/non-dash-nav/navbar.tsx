"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/theme/theme-switch";
import { AnnouncementBar } from "./announcement-bar";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-primary" />
          <span className="font-bold">PackPal</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth/sign-in"><Button variant="ghost">Sign In</Button></Link>
          <Link href="/trips/create"><Button className="bg-brand-500 hover:bg-brand-600">Get started</Button></Link>
          {/* Theme switch */}
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
