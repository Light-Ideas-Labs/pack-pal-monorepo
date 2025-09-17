import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as Icons from "lucide-react";
import { Sidebar, TripHeader, Explore, Reservations, Budget, Notes, MapPanel, } from "@/components/trips";
import { trips } from "@/lib/demo";

type PageProps = { params: { id: string } };

export default async function TripPlannerPage({ params }: PageProps) {
  const { id } = await params;                    // <-- await the promise
  const decoded = decodeURIComponent(id);
  const trip = trips.find((t) => t.id === decoded);

  if (!trip) return notFound();

  // Replace with RTKQ hooks


  return (
    <div className="flex h-[calc(100dvh)] flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-brand-300" />
          <span className="font-semibold">PackPal</span>
        </div>

        <Button size="sm" variant="secondary" className="ml-3 rounded-full">
          <Icons.Sparkles className="mr-2 h-4 w-4" />
          AI Assistant
        </Button>

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
      <div className="grid flex-1 grid-cols-1 md:grid-cols-[280px_1fr_45%]">
        <Sidebar />

        <main className="overflow-y-auto p-4 md:p-6">
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

        <aside className="hidden border-l md:block">
          <MapPanel />
        </aside>
      </div>
    </div>
  );
}
