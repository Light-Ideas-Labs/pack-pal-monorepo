"use client";

import { use, useState } from "react"; 
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as Icons from "lucide-react";
import { Sidebar, TripHeader, Explore, Reservations, Budget, Notes, MapPanel, } from "@/components/trips";
import { useGetTripQuery } from "@/lib/api/tripsApi";  // <- RTKQ hook

type PageProps = { params: Promise<{ id: string }> };

export default function TripPlannerPage({ params }: PageProps) {
  const { id } =  use(params); // <-- await the promise
  const tripId = decodeURIComponent(id);

  const [showSidebar, setShowSidebar] = useState(true);

  // Replace with RTKQ hooks
  const { data, isLoading, isError, refetch } = useGetTripQuery(tripId, { refetchOnFocus: true, refetchOnReconnect: true, });

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="animate-pulse text-sm text-muted-foreground">Loading trip…</div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">Couldn’t load this trip.</p>
        <Button size="sm" onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  const trip = data.data;

  return (
    <div className="flex h-dvh flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-brand-300" />
          <span className="font-semibold">PackPal</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="ghost">
            <Icons.RotateCcw className="mr-2 h-4 w-4" /> Undo
          </Button>
          <Button size="sm" variant="ghost">
            <Icons.RotateCw className="mr-2 h-4 w-4" /> Redo
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button size="sm" variant="outline">
            <Icons.Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button size="sm" variant="outline">
            <Icons.Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="bg-brand-600 hover:bg-brand-700">
            Get app
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className={`grid flex-1 min-h-0 grid-cols-1 ${showSidebar ? "md:grid-cols-[280px_1fr_45%]" : "md:grid-cols-[1fr_45%]"}`}>
        {showSidebar && <Sidebar onHide={() => setShowSidebar(false)} />}

        <main className="min-h-0 overflow-y-auto p-4 md:p-6">
          <TripHeader
            title={trip.title}
            startDate={trip.startDate}
            endDate={trip.endDate}
            coverUrl={trip.coverUrl ?? undefined} // TODO: handle missing cover/ Add default cover color // fall back to color in the header/card
            collaborators={[{ id: "1", name: "AM" }]} // TODO: demo stub, replace late
          />

          <Explore />

          <Reservations />

          <Budget amount={0} currency="KES" />

          <Notes />
        </main>

        <aside className="relative min-h-0 border-l md:block">
          <MapPanel />
        </aside>
      </div>
    </div>
  );
}
