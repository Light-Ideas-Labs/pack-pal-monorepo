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
  coverColor: TripColor;
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

function daysUntil(d: Date) {
  const ms = d.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function TripCard({ trip }: { trip: CardTrip }) {
  const href = `/trips/${encodeURIComponent(trip.id)}`;
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const dateRange = `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
  const until = daysUntil(start);

  return (
    <Link href={href} className="group block focus:outline-none">
      <article className="overflow-hidden rounded-2xl border bg-card shadow-sm transition group-hover:shadow-md focus-visible:ring-2">
        {/* Cover */}
        <div className="relative h-40 w-full" style={{ backgroundColor: trip.coverUrl ? undefined : COLOR_BG[trip.coverColor] }}>
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
          <div className="absolute left-2 top-2 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs shadow ring-1 ring-border">
              <MapPin className="h-3 w-3" />
              {trip.destination ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs shadow ring-1 ring-border">
              <Map className="h-3 w-3" />
              {trip.placesCount ?? 0}
            </span>
          </div>

        {/* “In X days” badge (only if future) */}
        {until > 0 && (
          <span className="absolute left-2 top-2 translate-y-10 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
            In {until} {until === 1 ? "day" : "days"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="text-xs text-muted-foreground">{dateRange}</div>
        <h3 className="mt-1 text-lg font-semibold">{trip.title}</h3>
        {trip.destination && <p className="text-sm text-muted-foreground">{trip.destination}</p>}
        {trip.placesCount !== undefined && (
          <p className="mt-2 text-sm text-muted-foreground">
            {trip.placesCount} {trip.placesCount === 1 ? "place" : "places"} saved
          </p>
        )}
      </div>
      </article>
    </Link>
  );
}
