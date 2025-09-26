"use client";

import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { useEffect, useRef } from "react";

import { useMap } from "@/context/map-context";
import { LocationFeature } from "@/lib/mapbox/utils";

type Props = {
  longitude: number;
  latitude: number;
  data: LocationFeature;

  onHover?: ({ isHovered, position, marker, data, }: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;

  onClick?: ({ position, marker, data, }: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  
  children?: React.ReactNode;
} & MarkerOptions;

export default function Marker({children, latitude, longitude, data, onHover, onClick, ...props }: Props) {
  const { map } = useMap();
  const markerElRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);


  const handleHover = (isHovered: boolean) => {
    if (onHover && markerRef.current) {
      onHover({
        isHovered,
        position: { longitude, latitude },
        marker: markerRef.current,
        data,
      });
    }
  };

  const handleClick = () => {
    if (onClick && markerRef.current) {
      onClick({
        position: { longitude, latitude },
        marker: markerRef.current,
        data,
      });
    }
  };

  useEffect(() => {
    const el = markerElRef.current;
    if (!map || !el) return;

    const handleMouseEnter = () => handleHover(true);
    const handleMouseLeave = () => handleHover(false);

    // Add event listeners
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("click", handleClick);

    // Marker options
    const options = {
      element: el,
      ...props,
    };

    markerRef.current = new mapboxgl.Marker(options)
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      // Cleanup on unmount
      if (markerRef.current) markerRef.current.remove();
      if (el) {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.removeEventListener("click", handleClick);
      }
    };
  }, [map, longitude, latitude, props]);

  return (
    <div>
      <div ref={markerElRef}>{children}</div>
    </div>
  );
}