"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ExploreItem = {
  title: string;
  subtitle: string;
  source: string;
  img?: string;
};

export default function Explore({
  items = [
    {
      title: "Best restaurants in Naivasha",
      subtitle: "Most often-seen on the web",
      source: "PackPal",
      img: "/images/food.jpg",
    },
    {
      title: "5-Day Naivasha Itinerary",
      subtitle: "Most popular travel itinerary",
      source: "PackPal",
      img: "/images/itinerary.jpg",
    },
    {
      title: "Search hotels with transparent pricing",
      subtitle: "No commission-based sorting",
      source: "PackPal",
      img: "/images/hotel.jpg",
    },
  ],
  onBrowseAll,
}: {
  items?: ExploreItem[];
  onBrowseAll?: () => void;
}) {
  return (
    <>
      <div className="mb-3 mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Explore</h2>
        <Button variant="secondary" onClick={onBrowseAll}>
          Browse all
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title} className="overflow-hidden">
            <div
              className="h-32 w-full bg-muted bg-cover bg-center"
              style={{ backgroundImage: `url(${it.img})` }}
            />
            <CardContent className="space-y-1 p-3">
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-muted-foreground">{it.subtitle}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="h-4 w-4 rounded-md bg-brand-300" />
                {it.source}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
