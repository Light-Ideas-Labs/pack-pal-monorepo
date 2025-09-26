// app/(planner)/trips/[id]/explore/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, MapPin, Utensils, BedDouble, Search,
  CalendarDays, Users, Building2, Trees, Sparkles, Sandwich
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPanel } from "@/components/trips"; // <- same map you use elsewhere

/** Small rounded chips (What to do / Where to eat / Where to stay) */
function Chip({
  icon, children, onClick, selected = false, className,
}: {
  icon: React.ReactNode; children: React.ReactNode; onClick?: () => void;
  selected?: boolean; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm",
        selected
          ? "bg-primary/10 text-primary border border-primary/20"
          : "bg-muted text-foreground/80 hover:bg-muted/80",
        className
      )}
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {children}
    </button>
  );
}

/** Gray “category” pills with a subtle divider between groups */
function CategoryPill({
  icon, label, className,
}: { icon: React.ReactNode; label: string; className?: string }) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm hover:bg-muted/60",
        className
      )}
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4 text-muted-foreground">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

/** Small field with an icon prefix */
function Field({
  icon, placeholder, value, onChange, className,
}: {
  icon: React.ReactNode; placeholder?: string; value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>; className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 rounded-md border bg-card px-2 py-2", className)}>
      <span className="[&>svg]:h-4 [&>svg]:w-4 text-muted-foreground">{icon}</span>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-6 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
      />
    </div>
  );
}

function LeftContent() {
  const [chip, setChip] = React.useState<"todo" | "eat" | "stay">("todo");
  const router = useRouter();

  return (
    <div className="min-w-0">
      {/* Top bar row: back + page search */}
      {/* STICKY TOP ROW */}
      <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
        <div className="flex h-14 items-center gap-3 px-4 md:px-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-base font-semibold">Explore</div>

          <div className="ml-auto relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Naivasha"
              className="h-9 pl-8 pr-3"
              defaultValue="Naivasha"
            />
          </div>
        </div>
      </div>
      {/* BODY BELOW THE STICKY BAR */}
      <div className="space-y-6 p-4 md:p-6">
        {/* Title + short subtitle */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Naivasha</h1>
          <p className="text-sm text-muted-foreground max-w-[52ch]">
            13-km freshwater shallow lake with boating & fringed by papyrus & forests with ample birdlife.
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Chip icon={<Sparkles />} selected={chip === "todo"} onClick={() => setChip("todo")}>
              What to do
            </Chip>
            <Chip icon={<Utensils />} selected={chip === "eat"} onClick={() => setChip("eat")}>
              Where to eat
            </Chip>
            <Chip icon={<BedDouble />} selected={chip === "stay"} onClick={() => setChip("stay")}>
              Where to stay
            </Chip>
          </div>
        </header>

        {/* Categories */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              See all
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:max-w-xl">
            <CategoryPill icon={<Sandwich />} label="Restaurants" />
            <CategoryPill icon={<MapPin />} label="Attractions" />
            <CategoryPill icon={<Users />} label="Family restaurants" />
            <CategoryPill icon={<Trees />} label="Parks and gardens" />
          </div>
        </section>

        {/* Lodging search strip */}
        <section className="rounded-lg border bg-muted/30 p-3 sm:p-4">
          <h3 className="mb-3 text-base font-semibold">Need a place to stay?</h3>

          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(130px,1fr)_auto]">
            <Field icon={<MapPin />} placeholder="Where" value="Naivasha" />
            <Field icon={<CalendarDays />} placeholder="Dates" value="9/26 — 9/27" />
            <Field icon={<Users />} placeholder="Travelers" value="2" />
            <Button className="h-10 px-5">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </section>

        {/* Featured guides */}
        <section className="space-y-3">
          <h3 className="text-base font-semibold">Featured guides</h3>

          <div className="grid max-w-xl grid-cols-[120px_1fr] gap-3 rounded-xl border bg-card p-3">
            <div className="relative h-[90px] w-[120px] overflow-hidden rounded-lg">
              <Image
                alt="Guide"
                fill
                unoptimized
                src="https://images.unsplash.com/photo-1604908176997-4316511b78a6?q=80&w=640&auto=format&fit=crop"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="text-sm font-medium">5-Day Naivasha Itinerary</div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                Most popular travel itinerary
              </p>

              <div className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                Pack Pal
              </div>
            </div>
          </div>
        </section>

        {/* Multi-city stops */}
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Multi-city stops</h3>
          <div className="rounded-xl border bg-muted/20 p-6 text-sm text-muted-foreground">
            Coming soon — suggested routes that include Naivasha.
          </div>
        </section>

        <div className="h-6" />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    // 40/60 split; let the **page** scroll (no inner overflow), so the scrollbar stays on the far right
    <div className="grid min-h-svh md:grid-cols-[40%_60%]">
      {/* LEFT: content (natural height; page scrolls) */}
      <section className="min-w-0">
        <LeftContent />
      </section>

      {/* RIGHT: sticky full-height map */}
      <aside className="hidden md:block border-l">
        <div className="sticky top-0 h-[100svh]">
          <MapPanel />
        </div>
      </aside>
    </div>
  );
}
