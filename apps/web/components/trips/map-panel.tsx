"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";

export default function MapPanel() {
  return (
    <div className="relative h-full w-full">
      {/* Replace background with your real map component */}
      <div className="absolute inset-0 bg-[url('/images/map-placeholder.png')] bg-cover bg-center opacity-90" />

      {/* Add-place callout */}
      <div className="pointer-events-auto absolute left-1/2 top-16 w-[360px] -translate-x-1/2 rounded-xl border bg-background p-3 shadow-xl">
        <div className="text-sm font-medium">Add some places</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Try typing <span className="font-medium">Naivasha</span> on the left—or search here.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1">
            Add a place
          </Button>
          <Button size="sm" variant="secondary" className="flex-1">
            Best restaurants in Naivasha
          </Button>
        </div>
      </div>

      {/* Map controls (dummy) */}
      <div className="absolute right-3 top-3 space-y-2">
        <Button size="icon" variant="secondary">
          <Icons.ZoomIn />
        </Button>
        <Button size="icon" variant="secondary">
          <Icons.ZoomOut />
        </Button>
        <Button size="icon" variant="secondary">
          <Icons.LocateFixed />
        </Button>
      </div>
    </div>
  );
}
