// app/(dashboard)/page.tsx
import Link from "next/link";
import { trips } from "@/lib/demo";
import { Button } from "@/components/ui/button";

const colorToClass: Record<string, string> = {
  peach: "bg-[var(--gradient-card-peach)]",
  lavender: "bg-[var(--gradient-card-lavender)]",
  mint: "bg-gradient-to-br from-emerald-100 to-emerald-200",
  sun: "bg-gradient-to-br from-amber-100 to-amber-200",
  ocean: "bg-gradient-to-br from-sky-100 to-indigo-100",
  grape: "bg-gradient-to-br from-violet-100 to-violet-200",
};

export default function DashboardHome() {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your trips</h1>
          <p className="text-muted-foreground">Beautiful cards for each trip with dates & colors.</p>
        </div>
        <Link href="/dashboard/trips/new">
          <Button className="bg-brand-500 hover:bg-brand-600">Create new trip</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard/trips/${t.id}`}
            className={`group rounded-3xl p-5 shadow-sm ring-1 ring-border transition hover:shadow-md ${colorToClass[t.color] ?? "bg-card"}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-foreground/80">
                {new Date(t.startDate).toLocaleDateString()} – {new Date(t.endDate).toLocaleDateString()}
              </div>
              <span className="rounded-full bg-card/60 px-2 py-0.5 text-xs">Open</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold">{t.title}</h3>
            <div className="mt-4 h-28 rounded-2xl bg-card/60"></div>
          </Link>
        ))}
      </div>

      {/* Quick tiles like the hero blocks in your landing */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold">Timeline Itinerary</p>
          <p className="mt-1 text-sm text-muted-foreground">Day-by-day schedule with precise times.</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold">Documents & Packing</p>
          <p className="mt-1 text-sm text-muted-foreground">Store PDFs, tickets; check off items as you pack.</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold">Map your route</p>
          <p className="mt-1 text-sm text-muted-foreground">Saved places and simple route preview.</p>
        </div>
      </div>
    </div>
  );
}
