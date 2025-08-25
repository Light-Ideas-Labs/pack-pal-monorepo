"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Interval = "monthly" | "yearly";

const PRICING: Record<Interval, { pro: string; sub: string; badge?: string }> = {
  monthly: { pro: "US$3.99", sub: "Billed Monthly" },
  yearly:  { pro: "US$17.99", sub: "Billed Yearly", badge: "Save 62%" },
};

const FEATURES = [
  { label: "Trips", free: "Up to 3", pro: "Unlimited", teams: "Unlimited (workspace)" },
  { label: "Documents storage", free: "50 MB", pro: "10 GB", teams: "100 GB pooled" },
  { label: "Maps & saved places", free: "10 per trip", pro: "Unlimited", teams: "Unlimited" },
  { label: "Files per trip", free: "5", pro: "Unlimited", teams: "Unlimited" },
  { label: "Packing lists", free: "2 templates", pro: "Unlimited + reusable", teams: "Unlimited + org templates" },
  { label: "Sharing & roles", free: "1 viewer", pro: "Up to 5 editors/viewers", teams: "Unlimited seats, Admin/Editor/Viewer" },
  { label: "Offline", free: "Recent items cached", pro: "Full offline + background sync", teams: "Full offline + background sync" },
  { label: "Export", free: <Minus className="h-4 w-4 opacity-40" />, pro: "PDF / CSV / ICS", teams: "PDF / CSV / ICS" },
  { label: "Backups", free: <Minus className="h-4 w-4 opacity-40" />, pro: "Cloud backup & restore", teams: "Cloud backup & restore" },
  { label: "Themes", free: "2", pro: "12 color themes", teams: "12 color themes + org defaults" },
  { label: "Reminders & widgets (Android)", free: "Basic", pro: "Smart packing + travel-day widgets", teams: "Smart packing + travel-day widgets" },
  { label: "Admin & analytics", free: <Minus className="h-4 w-4 opacity-40" />, pro: <Minus className="h-4 w-4 opacity-40" />, teams: "Workspace analytics & audit log" },
  { label: "Support", free: "Community / email", pro: "Priority email", teams: "Priority + onboarding" },
];

export default function PricingPage() {
  const [interval, setInterval] = useState<Interval>("yearly");
  const active = PRICING[interval];

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold">Pricing</h1>
      <p className="mt-2 text-muted-foreground">Start free. Upgrade to Pro for unlimited power, or talk to us about Teams.</p>

      {/* Toggle */}
      <div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-card p-1">
        {(["monthly", "yearly"] as Interval[]).map((k) => (
          <button
            key={k}
            onClick={() => setInterval(k)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${interval === k ? "bg-brand-500 text-white" : "text-foreground/70 hover:bg-muted"}`}
            aria-pressed={interval === k}
          >
            {k === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Free */}
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-2 text-muted-foreground">Up to 3 trips, light storage.</p>
          <p className="mt-4 text-3xl font-extrabold">US$0</p>
          <div className="mt-6">
            <Link href="/signup"><Button variant="outline" className="w-full">Get started</Button></Link>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {FEATURES.slice(0, 7).map((f) => (
              <li key={`free-${f.label}`} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-brand-600" />
                <span><span className="font-medium">{f.label}:</span> {f.free}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="relative rounded-2xl border-2 border-brand-500 bg-gradient-to-b from-brand-50 to-white p-6 shadow-sm">
          {active.badge && (
            <span className="absolute right-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
              {active.badge}
            </span>
          )}
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-2 text-muted-foreground">Unlimited trips, powerful extras.</p>
          <p className="mt-4 text-3xl font-extrabold">
            {active.pro}<span className="text-base font-normal"> {interval === "monthly" ? "/mo" : "/yr"}</span>
          </p>
          <p className="text-xs text-muted-foreground">{active.sub}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button className="w-full bg-brand-500 hover:bg-brand-600">Start 7-day free trial</Button>
            <Button className="w-full" variant="ghost">Restore purchases</Button>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {FEATURES.map((f) => (
              <li key={`pro-${f.label}`} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-brand-600" />
                <span><span className="font-medium">{f.label}:</span> {f.pro}</span>
              </li>
            ))}
          </ul>
        </div>

{/* Friends & Teams (Workspaces) */}
<div className="rounded-2xl border bg-card p-6">
  <h3 className="text-xl font-semibold">Friends & Teams (Workspaces)</h3>
  <p className="mt-2 text-muted-foreground">
    Shared workspaces for friends, families, and teams — roles, shared templates & admin tools.
  </p>

  <p className="mt-4 text-3xl font-extrabold">Custom</p>
  <p className="text-xs text-muted-foreground">Volume pricing available</p>

  <div className="mt-6 flex flex-col gap-2">
    <Link href="/contact"><button className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-white hover:bg-brand-600">Contact sales</button></Link>
    <Link href="/signup"><button className="w-full rounded-xl border px-4 py-2.5">Start a workspace</button></Link>
  </div>

  <ul className="mt-6 space-y-3 text-sm">
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Trips:</b> Unlimited (workspace)</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Documents storage:</b> 100 GB pooled</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Maps & saved places:</b> Unlimited</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Files per trip:</b> Unlimited</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Packing lists:</b> Unlimited + org templates</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Sharing & roles:</b> Unlimited seats, Admin/Editor/Viewer</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Offline:</b> Full offline + background sync</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Export:</b> PDF / CSV / ICS</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Backups:</b> Cloud backup & restore</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Themes:</b> 12 color themes + org defaults</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Reminders & widgets (Android):</b> Smart packing + travel-day widgets</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Admin & analytics:</b> Workspace analytics & audit log</span></li>
    <li className="flex gap-2"><span className="mt-0.5 h-4 w-4 rounded-full bg-brand-600"></span><span><b>Support:</b> Priority + onboarding</span></li>
  </ul>
</div>

      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted-foreground">
        Prices shown in USD for reference. Google Play may display and charge in your local currency.
        Free trial renews automatically unless cancelled before it ends. Manage or cancel in Google Play.
      </p>
    </main>
  );
}
