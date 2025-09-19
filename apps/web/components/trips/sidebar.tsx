"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronDown,
  ChevronRight,
  Compass,
  StickyNote,
  MapPin,
  File as FileIcon,
  CalendarDays,
  Wallet,
  ChevronLeftCircleIcon,
} from "lucide-react";

type SidebarProps = {
  overview?: { label: string; icon?: React.ReactNode; active?: boolean }[];
  days?: { id: string; label: string; active?: boolean }[];
  onSelect?: (section: "overview" | "itinerary" | "budget", key: string) => void;
  onHide?: () => void; // <- tell parent to hide
};

export default function Sidebar({
  overview = [
    { label: "Explore", icon: <Compass className="h-4 w-4" />, active: true },
    { label: "Notes", icon: <StickyNote className="h-4 w-4" /> },
    { label: "Places to visit", icon: <MapPin className="h-4 w-4" /> },
    { label: "Untitled", icon: <FileIcon className="h-4 w-4" /> },
  ],
  days = [],
  onSelect,
  onHide,
}: SidebarProps) {
  const [open, setOpen] = React.useState({
    overview: true,
    itinerary: true,
    budget: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((s) => ({ ...s, [key]: !s[key] }));

  return (
    <aside className="hidden h-full border-r p-3 md:block">
      {/* AI Assistant pill */}
      <Button
        size="sm"
        className="mb-3 w-full justify-start gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow"
      >
        <Sparkles className="h-4 w-4" />
        AI Assistant
      </Button>

      <nav className="space-y-4">
        <Collapsible
          label="Overview"
          open={open.overview}
          onToggle={() => toggle("overview")}
        >
          <div className="mt-1 space-y-1">
            {overview.map((o) => (
              <NavItem
                key={o.label}
                icon={o.icon}
                label={o.label}
                active={o.active}
                onClick={() => onSelect?.("overview", o.label)}
              />
            ))}
          </div>
        </Collapsible>

        <Collapsible
          label="Itinerary"
          open={open.itinerary}
          onToggle={() => toggle("itinerary")}
        >
          <div className="mt-1 space-y-1">
            {(days.length
              ? days
              : [
                  { id: "d1", label: "Fri 9/26" },
                  { id: "d2", label: "Sat 9/27" },
                  { id: "d3", label: "Sun 9/28" },
                  { id: "d4", label: "Mon 9/29" },
                ]
            ).map((d) => (
              <NavItem
                key={d.id ?? d.label}
                icon={<CalendarDays className="h-4 w-4" />}
                label={d.label}
                active={d.active}
                onClick={() => onSelect?.("itinerary", d.id ?? d.label)}
              />
            ))}
          </div>
        </Collapsible>

        <Collapsible
          label="Budget"
          open={open.budget}
          onToggle={() => toggle("budget")}
        >
          <div className="mt-1 space-y-1">
            <NavItem
              icon={<Wallet className="h-4 w-4" />}
              label="View"
              onClick={() => onSelect?.("budget", "view")}
            />
          </div>
        </Collapsible>

        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start gap-2 text-muted-foreground"
          onClick={onHide}
        >
          <ChevronLeftCircleIcon className="h-4 w-4" />
          Hide sidebar
        </Button>
      </nav>
    </aside>
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
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold text-foreground"
        onClick={onToggle}
      >
        <span className="uppercase text-xs tracking-wide text-muted-foreground">
          {label}
        </span>
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
