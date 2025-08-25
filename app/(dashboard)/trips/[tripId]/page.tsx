// app/(dashboard)/trips/[tripId]/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { trips, itinerary, packing, docs } from "@/lib/demo";
import { Button } from "@/components/ui/button";
import { Plus, Check, MapPin, File, Upload } from "lucide-react";

type TabKey = "itinerary" | "documents" | "packing" | "map";

export default function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const trip = useMemo(() => trips.find(t => t.id === tripId), [tripId]);
  const [tab, setTab] = useState<TabKey>("itinerary");

  if (!trip) return <div className="text-muted-foreground">Trip not found.</div>;

  const its = itinerary.filter(i => i.tripId === trip.id);
  const pack = packing.filter(p => p.tripId === trip.id);
  const dd = docs.filter(d => d.tripId === trip.id);

  return (
    <div>
      {/* Header */}
      <div className="rounded-3xl bg-[var(--gradient-card-lavender)] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-medium text-foreground/80">
              {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
            </div>
            <h1 className="text-3xl font-bold">{trip.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Share</Button>
            <Button className="bg-brand-500 hover:bg-brand-600"><Plus className="mr-2 h-4 w-4"/> Add</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { k: "itinerary", label: "Itinerary" },
            { k: "documents", label: "Documents" },
            { k: "packing", label: "Packing" },
            { k: "map", label: "Map" },
          ].map(x => (
            <button
              key={x.k}
              onClick={() => setTab(x.k as TabKey)}
              className={`rounded-full px-3 py-1 text-sm
                ${tab === x.k ? "bg-card text-foreground ring-1 ring-border" : "bg-card/60 text-foreground/70 hover:bg-card"}`}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panels */}
      <div className="mt-6">
        {tab === "itinerary" && <ItineraryPanel items={its} />}
        {tab === "documents" && <DocumentsPanel items={dd} />}
        {tab === "packing" && <PackingPanel items={pack} />}
        {tab === "map" && <MapPanel city={trip.city ?? "Your trip"} />}
      </div>
    </div>
  );
}

/** --- Panels --- **/

function ItineraryPanel({ items }: { items: { id: string; time: string; title: string; note?: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map(i => (
        <div key={i.id} className="flex items-start gap-4 rounded-2xl border bg-card p-4">
          <div className="mt-0.5 text-sm font-semibold text-foreground/80 w-16">{i.time}</div>
          <div>
            <div className="font-medium">{i.title}</div>
            {i.note && <div className="text-sm text-muted-foreground">{i.note}</div>}
          </div>
        </div>
      ))}
      <Button variant="outline" className="mt-2"><Plus className="mr-2 h-4 w-4"/> Add activity</Button>
    </div>
  );
}

function DocumentsPanel({ items }: { items: { id: string; name: string; type: string; sizeKB: number }[] }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map(d => (
          <div key={d.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-brand-600" />
              <div className="font-medium">{d.name}</div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{d.type.toUpperCase()} • {Math.round(d.sizeKB)} KB</div>
            <div className="mt-3 h-32 rounded-xl bg-muted" />
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-4"><Upload className="mr-2 h-4 w-4"/> Upload document</Button>
    </>
  );
}

function PackingPanel({ items }: { items: { id: string; text: string; done: boolean }[] }) {
  return (
    <div className="space-y-2">
      {items.map(p => (
        <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-xl border bg-card p-3">
          <input type="checkbox" defaultChecked={p.done} className="h-4 w-4 accent-brand-600" />
          <span className={`text-sm ${p.done ? "line-through text-muted-foreground" : ""}`}>{p.text}</span>
        </label>
      ))}
      <Button variant="outline" className="mt-2"><Plus className="mr-2 h-4 w-4"/> Add item</Button>
    </div>
  );
}

function MapPanel({ city }: { city: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-brand-600" />
        <div className="font-medium">Map preview</div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Saved places and route preview for {city}.</p>
      <div className="mt-3 h-72 rounded-xl bg-[url('https://tile.openstreetmap.org/5/17/17.png')] bg-cover bg-center" />
      {/* Replace with a real Mapbox/Google map when you wire providers */}
    </div>
  );
}
