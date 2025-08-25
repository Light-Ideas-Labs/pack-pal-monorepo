"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-brand-300" />
          <span className="font-bold">PackPal</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login"><Button variant="ghost">Log in</Button></Link>
          <Link href="/signup"><Button className="bg-brand-500 hover:bg-brand-600">Get started</Button></Link>
        </div>
      </div>
    </header>
  );
}
