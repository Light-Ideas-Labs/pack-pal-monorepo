"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronRight, ChevronLeftCircle, ChevronRightCircle, Compass, StickyNote, MapPin, File as FileIcon, CalendarDays, Wallet  } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

type OverviewItem = { label: string; icon: React.ReactNode; active?: boolean; key: string };
type DayItem = { id: string; label: string; active?: boolean; date?: string };

function monthAbbrev(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short" }).toUpperCase();
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function longDay(iso: string) {
  const d = new Date(iso);
  const wd = d.toLocaleString(undefined, { weekday: "short" }); // Sat
  const mo = d.toLocaleString(undefined, { month: "short" });   // Sep
  const day = ordinal(d.getDate());                              // 27th
  return `${wd}, ${mo} ${day}`;
}

// fallback parser for labels like "Fri 9/26"
function labelToISO(label: string) {
  const m = label.match(/\b(\d{1,2})\/(\d{1,2})\b/);
  if (!m) return undefined;
  const now = new Date();
  const y = now.getFullYear();
  const iso = new Date(y, Number(m[1]) - 1, Number(m[2]));
  return iso.toISOString();
}




export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  overview = [
    { key: "explore", label: "Explore", icon: <Compass className="h-4 w-4" />, active: true },
    { key: "notes", label: "Notes", icon: <StickyNote className="h-4 w-4" /> },
    { key: "places", label: "Places to visit", icon: <MapPin className="h-4 w-4" /> },
    { key: "untitled", label: "Untitled", icon: <FileIcon className="h-4 w-4" /> },
  ],
  days = [],
  onSelect,
}: {
  collapsed?: boolean;
  onToggleCollapsed: (val: boolean) => void;
  overview?: OverviewItem[];
  days?: DayItem[];
  onSelect?: (section: "overview" | "itinerary" | "budget", id: string) => void;
}) {
  const [open, setOpen] = React.useState({ overview: true, itinerary: true, budget: true });
  const toggle = (key: keyof typeof open) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  // ---- COLLAPSED RAIL -------------------------------------------------------
if (collapsed) {
  return (
    <TooltipProvider delayDuration={200}>
      <aside className="hidden h-full min-h-0 w-[72px] border-r p-2 md:flex md:flex-col md:items-center md:justify-between overflow-hidden">
        {/* Top (expand, AI, overview) */}
        <div className="w-full flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1"
            onClick={() => onToggleCollapsed(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronRightCircle className="h-5 w-5" />
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="mt-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow"
                aria-label="AI Assistant"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>AI Assistant</TooltipContent>
          </Tooltip>

          <div className="mt-2 flex flex-col items-center gap-3">
            {overview.map((o) => (
              <Tooltip key={o.key}>
                <TooltipTrigger asChild>
                  <Button
                    variant={o.active ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-full"
                    aria-label={o.label}
                    onClick={() => onSelect?.("overview", o.key)}
                  >
                    <span className="[&>svg]:h-4 [&>svg]:w-4">{o.icon}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{o.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Dates list (only scrollable region) */}
          <div className="mt-4 flex-1 min-h-0 overflow-y-auto w-full">
            <div className="flex flex-col items-center gap-4 pb-2">
              <div className="rounded-full bg-muted p-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>

              {(days.length ? days : [{ id: "placeholder", label: "No dates" }])
                .slice(0, 12)
                .map((d) => {
                  const dateISO = d.date ?? labelToISO(d.label);
                  const dt = dateISO ? new Date(dateISO) : undefined;
                  const month = dt ? dt.toLocaleString(undefined, { month: "short" }).toUpperCase() : "—";
                  const dayNum = dt ? dt.getDate() : "—";
                  return (
                    <Tooltip key={d.id}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center leading-none">
                          <div className="text-[10px] font-semibold tracking-wide text-muted-foreground">{month}</div>
                          <div className="text-xl font-semibold text-primary">{dayNum}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{dt ? longDay(dt.toISOString()) : d.label}</TooltipContent>
                    </Tooltip>
                  );
                })}
              {days.length > 12 && <div className="text-xs text-muted-foreground">…</div>}
            </div>
          </div>
        </div>

        {/* Bottom (Budget pinned) */}
        <div className="mt-auto mb-2 flex flex-col items-center sticky bottom-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                aria-label="Budget"
                onClick={() => onSelect?.("budget", "view")}
              >
                <Wallet className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Budget</TooltipContent>
          </Tooltip>
          <div className="mt-1 text-xs text-muted-foreground">View</div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

  // ---- EXPANDED SIDEBAR -----------------------------------------------------
  return (
    <TooltipProvider delayDuration={200}>
      <aside className="hidden h-full w-[280px] border-r p-3 md:block">
        {/* expand → collapse chevron */}
        <div className="mb-2 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronLeftCircle className="h-5 w-5" />
          </Button>
        </div>

        {/* AI Assistant pill */}
        <Button
          size="sm"
          className="mb-3 w-full justify-start gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow"
        >
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>

        <nav className="space-y-4">
          <Collapsible label="Overview" open={open.overview} onToggle={() => toggle("overview")}>
            <div className="mt-1 space-y-1">
              {overview.map((o) => (
                <NavItem
                  key={o.key}
                  icon={o.icon}
                  label={o.label}
                  active={o.active}
                  onClick={() => onSelect?.("overview", o.key)}
                />
              ))}
            </div>
          </Collapsible>

          <Collapsible label="Itinerary" open={open.itinerary} onToggle={() => toggle("itinerary")}>
            <div className="mt-1 space-y-1">
              {(days.length
                ? days
                : [{ id: "placeholder", label: "Add days by updating trip", active: false }]
              ).map((d) => (
                <NavItem
                  key={d.id}
                  icon={<CalendarDays className="h-4 w-4" />}
                  label={d.label}
                  active={d.active}
                  onClick={() => onSelect?.("itinerary", d.id)}
                />
              ))}
            </div>
          </Collapsible>

          <Collapsible label="Budget" open={open.budget} onToggle={() => toggle("budget")}>
            <div className="mt-1 space-y-1">
              <NavItem
                icon={<Wallet className="h-4 w-4" />}
                label="View"
                onClick={() => onSelect?.("budget", "view")}
              />
            </div>
          </Collapsible>
        </nav>
      </aside>
    </TooltipProvider>
  );
}

function Collapsible({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold"
        onClick={onToggle}
      >
        <span className="uppercase text-xs tracking-wide text-muted-foreground">{label}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && children}
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
        active ? "bg-muted font-medium" : "hover:bg-muted/70"
      }`}
    >
      {icon && <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      <span>{label}</span>
    </Button>
  );
}


