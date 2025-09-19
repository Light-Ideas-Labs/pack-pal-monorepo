"use client";

import { useRef } from "react";

import MapProvider from "@/lib/mapbox/provider";
import MapSearch from "@/components/map/map-search";
import MapControls from "@/components/map/map-controls";
import MapStyles from "@/components/map/map-styles";

export default function MapPanel() {
    const mapRef = useRef<HTMLDivElement>(null);



  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map canvas */}
      <div  id="map-container" ref={mapRef} className="absolute inset-0 h-full w-full" />

      {/* Map context + overlays */}
      <MapProvider
        mapContainerRef={mapRef}
        initialViewState={{
          longitude: 36.8219,
          latitude: -1.2921,
          zoom: 10,
        }}
      >
        {/* Search box + result markers + popups */}
        <MapSearch />

        {/* Style tabs (streets/satellite/… ) */}
        <MapStyles />

        {/* +/- zoom buttons */}
        <MapControls />
      </MapProvider>
    </div>
  );
}
