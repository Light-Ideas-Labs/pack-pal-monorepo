"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as Icons from "lucide-react";
import { Sidebar, TripHeader, Explore, Reservations, Budget, Notes, MapPanel, Itinerary, } from "@/components/trips";
import InviteDialog from "@/components/trips/invite-dialog";
import { useGetTripQuery, useListTripDaysQuery } from "@/lib/api/tripsApi";  // <- RTKQ hook
import { useSelector } from "react-redux";
import { selectAuth } from "@/lib/store/authSlice";

type PageProps = { params: Promise<{ id: string }> };
type DayItem = { id: string; label: string; date?: string; active?: boolean };

export default function TripPlannerPage({ params }: PageProps) {
  const router = useRouter();

  const { id } =  use(params); // <-- await the promise
  const tripId = decodeURIComponent(id);

  // auth state for - current user
  const { user } = useSelector(selectAuth);
  const currentUser = {
    id: user?.id,
    name: user?.userName || user?.email?.split("@")[0] || "You",
    image: user?.avatarUrl,
  }

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const scrollTo = (anchor: string) => {
    const id = anchor.startsWith("#") ? anchor.slice(1) : anchor;
    const el = typeof document !== "undefined" ? document.getElementById(id) : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    } else {
      router.push(`#${id}`); // fallback to routing (will jump, not smooth)
    }
  };

  // fetch trip + days with RTKQ hooks
  const { data, isLoading, isError, refetch } = useGetTripQuery(tripId, { refetchOnFocus: true, refetchOnReconnect: true, });
  const { data: daysRes } = useListTripDaysQuery(tripId);

  const trip = data?.data;

  useEffect(() => {
  if (typeof window !== "undefined" && window.location.hash) {
    scrollTo(window.location.hash);
  }
  // re-run when trip changes so initial scroll still works after data loads
}, [tripId]);

  // ✅ always called (before any early returns)
  const inviteLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    const shareId = (trip as any)?._id ?? tripId;
    return `${window.location.origin}/trips/${encodeURIComponent(
      shareId
    )}?invite=${encodeURIComponent(shareId)}`;
  }, [tripId, trip]);

  // build days for sidebar
  const uiDays: DayItem[] = useMemo(() => {
    const apiDays = (daysRes?.data as any[]) ?? [];
    if (apiDays.length) {
      return apiDays.map((d, i) => {
        const iso = new Date(d.date).toISOString();
        return {
          id: String(d._id ?? d.id ?? i),
          label: new Date(iso)
            .toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" })
            .replace(",", ""),
          date: iso,
          active: false,
        };
      });
    }
    // fallback: synthesize from trip dates
    if (!trip?.startDate || !trip?.endDate) return [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const out: DayItem[] = [];
    for (
      let d = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
      d.getTime() <= Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
      d.setUTCDate(d.getUTCDate() + 1)
    ) {
      const iso = new Date(d).toISOString();
      out.push({
        id: `synth-${iso}`,
        label: new Date(iso)
          .toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" })
          .replace(",", ""),
        date: iso,
        active: false,
      });
    }
    return out;
  }, [daysRes?.data, trip?.startDate, trip?.endDate]);

  
  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="animate-pulse text-sm text-muted-foreground">Loading trip…</div>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">Couldn’t load this trip.</p>
        <Button size="sm" onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }


    
  return (
    <div
      className={`grid flex-1 min-h-0 grid-cols-1 ${
        sidebarCollapsed
        ? "md:grid-cols-[72px_minmax(0,1fr)_45%]"   // collapsed rail
        : "md:grid-cols-[280px_minmax(0,1fr)_45%]"  // expanded sidebar
      }`}
      >


        {/* Top bar spans all columns and stays visible */}
        <header className="col-span-full sticky top-0 z-20 flex items-center gap-2 border-b bg-background/80 backdrop-blur px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-brand-300"/>
          <span className="font-semibold">PackPal</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="ghost"><Icons.RotateCcw className="mr-2 h-4 w-4" /> Undo</Button>
          <Button size="sm" variant="ghost"><Icons.RotateCw className="mr-2 h-4 w-4" /> Redo</Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button size="sm" variant="outline"><Icons.Share2 className="mr-2 h-4 w-4" /> Share</Button>
          <Button size="sm" variant="outline"><Icons.Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button size="sm" className="bg-brand-600 hover:bg-brand-700"> Get app</Button>
        </div>
        </header>



      {/* Body */}


      {/* Left rail */}
  <Sidebar
    collapsed={sidebarCollapsed}
    onToggleCollapsed={setSidebarCollapsed}
    days={uiDays}
    overview={[
      { key: "explore", label: "Explore", icon: <Icons.Compass className="h-4 w-4" />, active: true },
      { key: "notes", label: "Notes", icon: <Icons.StickyNote className="h-4 w-4" /> },
      { key: "places", label: "Places to visit", icon: <Icons.MapPin className="h-4 w-4" /> },
      { key: "untitled", label: "Untitled", icon: <Icons.FileIcon className="h-4 w-4" /> },
    ]}
    onSelect={(section, key) => {
    const anchor =
      section === "overview"   ? `overview-${key}` :
      section === "itinerary"  ? `day-${key}` :
      section === "budget"     ? `overview-budget` : `${section}-${key}`; // fallback
      scrollTo(anchor);
    }}
  />

        <main id="main" className="min-h-0 overflow-y-auto p-4 md:p-6">
          <TripHeader
            title={trip.title}
            startDate={trip.startDate}
            endDate={trip.endDate}
            coverColor={trip.coverColor ?? undefined} // TODO: handle missing cover color
            coverUrl={trip.coverUrl ?? undefined} // TODO: handle missing cover/ Add default cover color // fall back to color in the header/card
            currentUser={currentUser}
            // collaborators={trip.collaborators ?? []}
            onInviteClick={() => setInviteOpen(true)} // TODO: implement invite functionality MODAL
          />



          {/* Anchor sections (scroll-mt offsets for sticky header) */}
          <section id="overview-explore" className="scroll-mt-24 md:scroll-mt-32" >
          <Explore />
          </section>

          <section id="overview-reservations" className="scroll-mt-24 md:scroll-mt-32" >
            <Reservations />
          </section>

          <section id="overview-itinerary" className="scroll-mt-24 md:scroll-mt-32" >
          <Itinerary
            days={uiDays}
            dateRangeLabel={
              trip?.startDate && trip?.endDate
                ? new Intl.DateTimeFormat(undefined, { month: "numeric", day: "numeric" })
                    .formatRange(new Date(trip.startDate), new Date(trip.endDate))
                : undefined
            }
          />
          </section>

          <section id="overview-budget" className="scroll-mt-24 md:scroll-mt-32" >
            <Budget amount={0} currency="KES" />
          </section>

          <section id="overview-notes" className="scroll-mt-24 md:scroll-mt-32" >
            <Notes />
          </section>
        </main>

        {/* Right map column */}
        <aside className="min-h-0 border-l md:block overflow-hidden">
          <div className="h-full">
          <MapPanel />
          </div>
        </aside>
      

    {/* Invite dialog stays after grid or anywhere portal’d */}
    <InviteDialog
    open={inviteOpen}
    onOpenChange={setInviteOpen}
    inviteLink={inviteLink}
    defaultPermission="edit"
    collaborators={[
      { id: "1", name: "JR" },
      { id: "2", name: "BM" },
      { id: "3", name: "CM" },
      { id: "4", name: "DM" },
      { id: "5", name: "EM" },
    ]}
    onInviteEmails={async (emailsOrHandles, permission) => {
      // hook to your RTKQ mutation:
      // await setCollaborator / sendInvite mutation here
      console.log("invite:", emailsOrHandles, "perm:", permission);
    }}
    onPrivacyChange={(p) => {
      // optionally persist these per-trip
      console.log("privacy:", p);
    }}
  />
    </div>





 
  );
}


