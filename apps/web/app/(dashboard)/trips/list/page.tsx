import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trips/trip-card";

// demo data – replace with RTK Query
import { trips } from "@/lib/demo";

export default function TripsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recently viewed and upcoming</h1>

        <Link href="/trips/create">
          <Button className="rounded-full bg-brand-500 hover:bg-brand-600">
            + Plan new trip
          </Button>
        </Link>
      </div>

      {/* (optional) “Recently viewed” filter button can go here */}

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((t) => (
          <TripCard
            key={t.id}
            trip={{
              id: t.id,
              title: t.title,
              startDate: t.startDate,
              endDate: t.endDate,
              city: t.city,
              coverUrl: t.coverUrl ?? undefined, // if you have it
              color: t.color ?? "lavender", // fallback color
              placesCount: t.placesCount,
            }}
          />
        ))}
      </div>
    </div>
  );
}
