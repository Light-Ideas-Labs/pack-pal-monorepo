"use client";

import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { useEffect, useRef, useCallback } from "react";

import { useMap } from "@/context/map-context";
import { LocationFeature } from "@/lib/mapbox/utils";

type Props = {
  longitude: number;
  latitude: number;
  data: LocationFeature;
  onHover?: (args: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  onClick?: (args: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  children?: React.ReactNode;
} & MarkerOptions;

export default function Marker({
  children,
  latitude,
  longitude,
  data,
  onHover,
  onClick,
  ...props
}: Props) {
  const { map } = useMap();
  const markerElRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const handleHover = useCallback(
    (isHovered: boolean) => {
      if (onHover && markerRef.current) {
        onHover({
          isHovered,
          position: { longitude, latitude },
          marker: markerRef.current,
          data,
        });
      }
    },
    [onHover, longitude, latitude, data]
  );

  const handleClick = useCallback(() => {
    if (onClick && markerRef.current) {
      onClick({
        position: { longitude, latitude },
        marker: markerRef.current,
        data,
      });
    }
  }, [onClick, longitude, latitude, data]);

  useEffect(() => {
    const el = markerElRef.current;
    if (!map || !el) return;

    const handleMouseEnter = () => handleHover(true);
    const handleMouseLeave = () => handleHover(false);

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("click", handleClick);

    markerRef.current = new mapboxgl.Marker({ element: el, ...props })
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("click", handleClick);
    };
  }, [map, longitude, latitude, props, handleHover, handleClick]);

  return (
    <div>
      <div ref={markerElRef}>{children}</div>
    </div>
  );
}
