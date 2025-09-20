"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trips/trip-card";
import { useListTripsQuery } from "@/lib/api/tripsApi";
import { Loader2 } from "lucide-react";




export default function TripsPage() {
  // who's the user?
  // const authed = useAppSelector(selectIsAuthed);


  /**
   * If your backend scopes by Access-Token (most common),
   * you don’t need to pass an owner filter. Just call with no args.
   * If you DO want to pass an owner id, see the API tweak below.
   */
  const { data, isLoading, isError, refetch } = useListTripsQuery({ page: 1, limit: 30 },     { refetchOnFocus: true, refetchOnReconnect: true });


if (isLoading) {
  return (
    <div className="container py-12">
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your trips…
        </div>
      </div>
    </div>
  );
}


    if (isError) {
    return (
      <div className="container py-8">
        <p className="text-sm text-destructive">Couldn’t load your trips.</p>
        <Button size="sm" className="mt-3" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const trips = data?.data?.data ?? [];





  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recently viewed and upcoming</h1>

        <Link href="/trips/create">
          <Button className="rounded-full bg-brand-500 hover:bg-brand-600">
            + Plan new trip
          </Button>
        </Link>
      </div>

      {/* (optional) “Recently viewed” filter button can go here */}
      {trips.length === 0 ? (
        <div className="mt-8 rounded-md border p-6 text-center text-sm text-muted-foreground">
          You don’t have any trips yet.
          <div className="mt-4">
            <Link href="/trips/create">
              <Button className="rounded-full">Create your first trip</Button>
            </Link>
          </div>
        </div>
      ) : (

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((t) => (
          <TripCard
            key={t._id}
            trip={{
              id: t._id,
              title: t.title,
              startDate: t.startDate,
              endDate: t.endDate,
              destination: t.destination,
              coverUrl: t.coverUrl ?? undefined, // if you have it
              coverColor: t.coverColor ?? "peach", // fallback color
              placesCount: t.placesCount,
            }}
          />
        ))}
      </div>
      )}
    </div>
  );
}
