"use client";

import { use, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as Icons from "lucide-react";
import { Sidebar, TripHeader, Explore, Reservations, Budget, Notes, MapPanel, Itinerary, } from "@/components/trips";
import InviteDialog from "@/components/trips/invite-dialog";
import { useGetTripQuery, useListTripDaysQuery } from "@/lib/api/tripsApi"; // <- RTKQ hook
import { useSelector } from "react-redux";
import type { CSSProperties } from "react";
import { selectAuth } from "@/lib/store/authSlice";
import { ApiEnvelope, TripDay } from "@/types";

type PageProps = { params: Promise<{ id: string }> };
type DayItem = { id: string; label: string; date?: string; active?: boolean };
type OverviewKey = 'explore' | 'reservations' | 'itinerary' | 'budget' | 'notes';
type WithId = { _id?: string };

export default function TripPlannerPage({ params }: PageProps) {
  const router = useRouter();

  const { id } = use(params); // <-- await the promise
  const tripId = decodeURIComponent(id);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [activeOverview, setActiveOverview] = useState<OverviewKey>('explore');
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const topbarStyle: CSSProperties & Record<'--topbar-h', string> = { ['--topbar-h']: '56px' };

  // auth state for - current user
  const { user } = useSelector(selectAuth);
  const currentUser = {
    id: user?.id,
    name: user?.userName || user?.email?.split("@")[0] || "You",
    image: user?.avatarUrl,
  };

  const scrollTo = useCallback(
    (anchor: string) => {
      const id = anchor.startsWith("#") ? anchor.slice(1) : anchor;
      const el =
        typeof document !== "undefined" ? document.getElementById(id) : null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      } else {
        router.push(`#${id}`); // fallback to routing (will jump, not smooth)
      }
    },
    [router]
  );

  // fetch trip + days with RTKQ hooks
  const { data, isLoading, isError, refetch } = useGetTripQuery(tripId, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const { data: daysRes } = useListTripDaysQuery(tripId);

  const trip = data?.data;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      scrollTo(window.location.hash);
    }
    // re-run when trip changes so initial scroll still works after data loads
  }, [tripId, scrollTo, trip]);

  // ✅ always called (before any early returns)
  const inviteLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    const shareId = (trip as WithId)?._id ?? tripId;
    return `${window.location.origin}/trips/${encodeURIComponent(
      shareId
    )}?invite=${encodeURIComponent(shareId)}`;
  }, [tripId, trip]);

  // build days for sidebar
  const uiDays: DayItem[] = useMemo(() => {
    const apiDays: TripDay[] =
      (daysRes as ApiEnvelope<TripDay[]> | undefined)?.data ?? [];
    if (apiDays.length) {
      return apiDays.map((d, i) => {
        const iso = new Date(d.date).toISOString();
        return {
          id: String(d._id ?? d._id ?? i),
          label: new Date(iso)
            .toLocaleDateString(undefined, {
              weekday: "short",
              month: "numeric",
              day: "numeric",
            })
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
      let d = new Date(
        Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
      );
      d.getTime() <= Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
      d.setUTCDate(d.getUTCDate() + 1)
    ) {
      const iso = new Date(d).toISOString();
      out.push({
        id: `synth-${iso}`,
        label: new Date(iso)
          .toLocaleDateString(undefined, {
            weekday: "short",
            month: "numeric",
            day: "numeric",
          })
          .replace(",", ""),
        date: iso,
        active: false,
      });
    }
    return out;
  }, [daysRes, trip?.startDate, trip?.endDate]);
  
  const sectionIds = useMemo(() => ([
    'overview-explore',
    'overview-reservations',
    'overview-itinerary',
    'overview-budget',
    'overview-notes',
    ...uiDays.map(d => `day-${d.id}`),
  ]), [uiDays]);
  
  useEffect(() => {
    const rootMarginTop = '-56px';   // same as --topbar-h so sticky header doesn’t hide triggers
    const observer = new IntersectionObserver((entries) => {
    // pick the first section that is intersecting near the top
    const visibleTop = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

    if (!visibleTop?.target?.id) return;
    const id = visibleTop.target.id;

    if (id.startsWith('overview-')) {
      const key = id.replace('overview-', '') as typeof activeOverview;
      setActiveOverview(key);
      setActiveDayId(null);
    } else if (id.startsWith('day-')) {
      setActiveOverview('itinerary');
      setActiveDayId(id.replace('day-', ''));
    }
  }, { root: null, threshold: 0.01, rootMargin: `${rootMarginTop} 0px -60% 0px` });

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, [sectionIds]);

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="animate-pulse text-sm text-muted-foreground">
          Loading trip…
        </div>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">
          Couldn’t load this trip.
        </p>
        <Button size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
  
  <div className={`grid min-h-dvh ${sidebarCollapsed ? "md:grid-cols-[42%_58%]" : "md:grid-cols-[50%_50%]"}`}>
    {/* LEFT HALF: header + (sidebar | body) */}
    <section className="grid grid-rows-[auto,1fr] min-w-0" style={topbarStyle}>
      {/* Header Topbar lives ONLY on the left half */}
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b bg-background/80 backdrop-blur px-4 h-[var(--topbar-h)]">
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
      </header>

      {/* Left content row: sidebar + main content */}
    <div
      className={`min-w-0 grid ${
        sidebarCollapsed
          ? "grid-cols-[56px_minmax(0,1fr)]"
          : "grid-cols-[240px_minmax(0,1fr)]"
      }`}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={setSidebarCollapsed}
        days={uiDays.map(d => ({ ...d, active: d.id === activeDayId }))}
        overview={[
          { key: "explore", label: "Explore", icon: <Icons.Compass className="h-4 w-4" />, active: activeOverview === 'explore' },
          { key: "notes", label: "Notes", icon: <Icons.StickyNote className="h-4 w-4" />,  active: activeOverview === 'notes'},
          { key: "places", label: "Places to visit", icon: <Icons.MapPin className="h-4 w-4" />, },
          { key: "untitled", label: "Untitled", icon: <Icons.FileIcon className="h-4 w-4" />, },
        ]}
        onSelect={(section, key) => {
          const anchor =
            section === "overview" ? `overview-${key}` : 
            section === "itinerary" ? `day-${key}` : 
            section === "budget" ? `overview-budget` : `${section}-${key}`; // fallback
          scrollTo(anchor);
        }}
      />

     {/* Main: still the only scroll container */}
     <div className="relative min-w-0">
      {/* center divider — stays pinned to the boundary */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-px bg-border/80" />
      {/* inset scrollbar by padding; still fills available width */}
      <main id="main" className="min-w-0 p-4 md:p-6">
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
        <section id="overview-explore" className="scroll-mt-24 md:scroll-mt-32">
          <Explore
            onBrowseAll={() => router.push(`/trips/${encodeURIComponent(tripId)}/explore`)}
          />
        </section>

        <section id="overview-reservations" className="scroll-mt-24 md:scroll-mt-32">
          <Reservations />
        </section>

        <section id="overview-itinerary" className="scroll-mt-24 md:scroll-mt-32">
          <Itinerary
            days={uiDays}
            dateRangeLabel={
              trip?.startDate && trip?.endDate
                ? new Intl.DateTimeFormat(undefined, {
                    month: "numeric",
                    day: "numeric",
                  }).formatRange(
                    new Date(trip.startDate),
                    new Date(trip.endDate)
                  )
                : undefined
            }
          />
        </section>

        <section id="overview-budget" className="scroll-mt-24 md:scroll-mt-32">
          <Budget amount={0} currency="KES" />
        </section>

        <section id="overview-notes" className="scroll-mt-24 md:scroll-mt-32">
          <Notes />
        </section>
      </main>
      </div>
      </div>
      </section>

      {/* RIGHT HALF: map from very top to bottom (no header here) */}
      <aside className="hidden md:block sticky top-0 h-dvh border-l overflow-hidden">
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
          // Todo: integrate RTKQ mutation:
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
