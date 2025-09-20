"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Map } from "lucide-react";


type TripColor = "peach" | "lavender" | "mint" | "sun" | "ocean" | "grape";

type CardTrip = {
  id: string;
  title: string;
  destination?: string;
  startDate: string;
  endDate: string;
  coverUrl?: string | null;
  coverColor: TripColor | string;
  placesCount?: number;
};

const COLOR_BG: Record<TripColor, string> = {
  peach:    "#FFD7C2",
  lavender: "#E7D7FF",
  mint:     "#CFF8E5",
  sun:      "#FFE79B",
  ocean:    "#BFE5FF",
  grape:    "#D9C2FF",
};

function isTripColor(c: string): c is TripColor {
  return typeof c === "string" && ["peach", "lavender", "mint", "sun", "ocean", "grape"].includes(c);
}

// helpers (do not mutate the incoming date)
function dayDiffUTC(a: Date, b: Date) {
  const A = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const B = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.ceil((A - B) / 86400000);
}

function computeBadge(startISO: string, endISO?: string) {
  const today = new Date();
  const start = new Date(startISO); 
  const end = endISO ? new Date(endISO) : undefined; 

  const untilStart = dayDiffUTC(start, today);       // >0 future, 0 today, <0 past
  const untilEnd   = end ? dayDiffUTC(end, today) : undefined // >0 ongoing, 0 ends today, <0 ended

  if (untilStart > 0) {
    // future trip
    return { text: `In ${untilStart} ${untilStart === 1 ? "day" : "days"}`, cls: "bg-rose-500" };
  }
  
  if (untilStart === 0) {
    // starts today
    return { text: "Today", cls: "bg-emerald-600" };
  } 
  
  if (end && untilEnd! >= 0) {
    // ongoing or already started
    return { text: `Ends in ${untilEnd} ${untilEnd === 1 ? "day" : "days"}`, cls: "bg-blue-600" };
  }

  // past trip or finished
  const ago  = -untilStart;
  return { text: `${ago} ${ago === 1 ? "day" : "days"} ago`, cls: "bg-muted-foreground text-foreground" };
}


export function TripCard({ trip }: { trip: CardTrip }) {
  const href = `/trips/${encodeURIComponent(trip.id)}`;

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const dateRange = `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
  const dateRangeBadge = computeBadge(trip.startDate, trip.endDate);

  const bgColor = trip.coverUrl ? undefined : isTripColor(trip.coverColor) ? COLOR_BG[trip.coverColor] : trip.coverColor || COLOR_BG.peach;

  return (
    <Link href={href} className="group block focus:outline-none">
      <article className="overflow-hidden rounded-2xl border bg-card shadow-sm transition group-hover:shadow-md focus-visible:ring-2">
        {/* Cover */}
        <div className="relative h-40 w-full" style={{ backgroundColor: bgColor }}>
          {trip.coverUrl && (
          <Image
            src={trip.coverUrl}
            alt={trip.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={false}
          />
        )}

        {/* icon pills */}
{/* Overlay row: left pills + right badge */}
<div className="absolute inset-x-2 top-2 z-10 flex items-start justify-between">
  {/* left pills (wrap if tight) */}
  <div className="flex min-w-0 flex-wrap gap-2">
    <span className="inline-flex max-w-[14rem] items-center gap-1 truncate rounded-full bg-background/90 px-2 py-1 text-xs shadow ring-1 ring-border">
      <MapPin className="h-3 w-3" />
      {trip.destination ?? "—"}
    </span>

    <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs shadow ring-1 ring-border">
      <Map className="h-3 w-3" />
      {trip.placesCount === 0 ? "place" : "places"} saved
    </span>
  </div>

        {/* “In X days” badge (only if future) */}
  {/* right badge */}
  {dateRangeBadge && (
    <span
      className={`self-start inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white shadow-sm ${dateRangeBadge.cls}`}
    >
      {dateRangeBadge.text}
    </span>
  )}
</div>
</div>

      {/* Body */}
      <div className="p-4">
        <div className="text-xs text-white">{dateRange}</div>
        <h3 className="mt-1 text-lg font-semibold">{trip.title}</h3>
        {trip.destination && <p className="text-sm text-muted-foreground">{trip.destination}</p>}
      </div>
      </article>
    </Link>
  );
}
