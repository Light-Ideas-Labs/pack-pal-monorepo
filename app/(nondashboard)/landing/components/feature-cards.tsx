import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Map, Files, ListChecks, Share2 } from "lucide-react";

const items = [
  { icon: Map, title: "Map Your Route", desc: "Search locations and plot your day on an interactive map." },
  { icon: Files, title: "Store Documents", desc: "Keep tickets, visas and bookings in one place." },
  { icon: ListChecks, title: "Packing Lists", desc: "Never forget—custom lists per trip with quick check-off." },
  { icon: Share2, title: "Share & Collaborate", desc: "Invite friends to view or co-edit your itinerary." }
];

export function FeatureCards() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center">Everything for stress‑free travel</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-slate-200">
              <CardHeader className="flex flex-row items-center gap-3">
                <span className="rounded-md bg-brand-100 p-2"><Icon className="h-5 w-5 text-brand-600" /></span>
                <p className="font-semibold">{title}</p>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">{desc}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
