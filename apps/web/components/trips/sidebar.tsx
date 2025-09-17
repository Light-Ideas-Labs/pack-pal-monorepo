"use client";

import * as React from "react";

type SidebarProps = {
  overview?: { label: string; active?: boolean }[];
  days?: { id: string; label: string; active?: boolean }[];
  onSelect?: (section: "overview" | "itinerary" | "budget", key: string) => void;
};

export default function Sidebar({
  overview = [
    { label: "Explore", active: true },
    { label: "Notes" },
    { label: "Places to visit" },
    { label: "Untitled" },
  ],
  days = [],
  onSelect,
}: SidebarProps) {
  return (
    <aside className="hidden border-r p-3 md:block">
      <nav className="space-y-3">
        <Section label="Overview">
          {overview.map((o) => (
            <NavItem
              key={o.label}
              label={o.label}
              active={o.active}
              onClick={() => onSelect?.("overview", o.label)}
            />
          ))}
        </Section>

        <Section label="Itinerary">
          {days.length
            ? days.map((d) => (
                <NavItem
                  key={d.id}
                  label={d.label}
                  active={d.active}
                  onClick={() => onSelect?.("itinerary", d.id)}
                />
              ))
            : ["Fri 9/26", "Sat 9/27", "Sun 9/28", "Mon 9/29"].map((d) => (
                <NavItem key={d} label={d} onClick={() => onSelect?.("itinerary", d)} />
              ))}
        </Section>

        <Section label="Budget">
          <NavItem label="View" onClick={() => onSelect?.("budget", "view")} />
        </Section>

        <button className="mt-3 text-sm text-muted-foreground hover:underline">
          Hide sidebar
        </button>
      </nav>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="px-2 text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
        active ? "bg-muted font-medium" : "hover:bg-muted/70"
      }`}
    >
      {label}
    </button>
  );
}
