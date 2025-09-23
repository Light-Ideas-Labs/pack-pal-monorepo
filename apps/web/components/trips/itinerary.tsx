"use client";

import * as React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

type Day = { id: string; label: string; date?: string };

export default function Itinerary({
  days,
  dateRangeLabel,
  className,
}: {
  days: Day[];
  dateRangeLabel?: string; // e.g. "9/23 – 9/27"
  className?: string;
}) {
  return (
    <section className={cn("mt-8", className)}>
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Itinerary</h2>
        {dateRangeLabel ? (
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
            <Icons.Calendar className="h-4 w-4" />
            {dateRangeLabel}
          </span>
        ) : null}
      </div>

      <div className="rounded-xl border">
        {days.map((d, idx) => (
          <details
            key={d.id}
            id={`day-${d.id}`}
            className="group border-b last:border-b-0"
            open={idx === 0}
          >
            {/* SUMMARY — collapsed look matches screenshot */}
            <summary className="flex cursor-pointer select-none items-center justify-between gap-3 p-4 sm:p-5 list-none">
              {/* Left: chevron + big date text (always visible) */}
              <div className="flex min-w-0 items-center gap-3">
                <Icons.ChevronRight className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" />
                <div className="min-w-0">
                  <div className="truncate text-xl font-semibold">
                    {formatLongDate(d.date) ?? d.label}
                  </div>

                  {/* Subheading only when open */}
                  <div className="mt-1 hidden text-sm text-muted-foreground group-open:block">
                    Add subheading
                  </div>
                </div>
              </div>

              {/* Right: kebab ONLY when collapsed */}
              <button
                type="button"
                className="rounded-md p-2 hover:bg-muted group-open:hidden"
                aria-label="More"
              >
                <Icons.MoreHorizontal className="h-5 w-5" />
              </button>

              {/* Right: actions ONLY when open */}
              <div className="hidden items-center gap-4 text-sm text-primary group-open:flex">
                <button className="inline-flex items-center gap-1 hover:underline" type="button">
                  <Icons.Sparkles className="h-4 w-4" />
                  Auto-fill day
                </button>
                <button className="inline-flex items-center gap-1 hover:underline" type="button">
                  <Icons.Route className="h-4 w-4" />
                  Optimize route
                </button>
                <button className="rounded-md p-2 hover:bg-muted" type="button" aria-label="More">
                  <Icons.MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </summary>

            {/* Thin divider that shows only when collapsed (to mimic screenshot line) */}
            <div className="mx-4 hidden border-t group-open:hidden sm:mx-5" />

            {/* BODY — only visible when open */}
            <div className="px-4 pb-5 pt-4 sm:px-5 group-open:block hidden">
              <LodgingHint />

              <div className="mt-4 rounded-xl border bg-background p-4">
                <div className="flex items-center gap-3">
                  <Icons.MapPin className="h-5 w-5 text-muted-foreground" />
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Add a place"
                  />
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-muted"
                    title="Notes"
                  >
                    <Icons.StickyNote className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-muted"
                    title="More"
                  >
                    <Icons.ListChecks className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* --- helpers --- */

function LodgingHint() {
  return (
    <div className="rounded-xl border bg-primary/10 p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="text-base font-semibold">Need a place to stay?</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Looks like you don’t have lodging for these dates yet.
          </p>
          <button
            type="button"
            className="mt-3 inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Book hotels
          </button>
        </div>
        <Icons.BedDouble className="mt-1 hidden h-14 w-14 shrink-0 text-primary sm:block" />
      </div>
    </div>
  );
}

function formatLongDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
