"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";


import { MapContext } from "@/context/map-context";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN!;

type MapComponentProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  children?: React.ReactNode;
};

export default function MapProvider({mapContainerRef, initialViewState, children}: MapComponentProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const m = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      attributionControl: false,
      logoPosition: "bottom-right",
    });

    mapRef.current = m;
    setMap(m); // Set live instance of the map state when the map is initialized - this will trigger a re-render

    m.on("load", () => {
      setLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialViewState, mapContainerRef]);

  return (
    <div className="z-[1000]">
      <MapContext.Provider value={{ map: mapRef.current! }}>
        {children}
      </MapContext.Provider>
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <div className="text-lg font-medium">Loading map...</div>
        </div>
      )}
    </div>
  );
}