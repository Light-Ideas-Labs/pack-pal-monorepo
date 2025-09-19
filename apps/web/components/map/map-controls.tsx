"use client";

import React from "react";
import { PlusIcon, MinusIcon } from "lucide-react";
import { useMap } from "@/context/map-context";
import { Button } from "../ui/button";

export default function MapControls() {
  const { map } = useMap();

    const zoomIn = () => map?.zoomIn();
    const zoomOut = () => map?.zoomOut();  

  return (
    <aside className="absolute right-4 top-16 z-20 bg-background/90 backdrop-blur p-1.5 rounded-lg shadow-lg flex flex-col gap-1">
        <Button variant="ghost" size="icon" onClick={zoomIn}>
          <PlusIcon className="h-5 w-5" />
          <span className="sr-only">Zoom in</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={zoomOut}>
          <MinusIcon className="h-5 w-5" />
          <span className="sr-only">Zoom out</span>
        </Button>
    </aside>
  );
}
