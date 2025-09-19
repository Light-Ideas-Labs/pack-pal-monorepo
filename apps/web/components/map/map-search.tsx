"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Loader2, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { useMap } from "@/context/map-context";
import { cn } from "@/lib/utils";
import {
  iconMap,
  type LocationFeature,
  type LocationSuggestion,
} from "@/lib/mapbox/utils";
import { LocationMarker } from "../location-marker";
import { LocationPopup } from "../location-popup";

const NAIROBI = { lon: 36.8219, lat: -1.2921 }; // Mapbox uses lon,lat

export default function MapSearch() {
  const { map } = useMap();

  const [query, setQuery] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState<LocationFeature | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<LocationFeature[]>(
    []
  );

  // client-generated token for the Search Box API
  const [sessionToken, setSessionToken] = useState<string>(() =>
    crypto.randomUUID()
  );

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchLocations = async () => {
      setIsSearching(true);
      setIsOpen(true);

      try {
        const url =
          `https://api.mapbox.com/search/searchbox/v1/suggest` +
          `?q=${encodeURIComponent(debouncedQuery)}` +
          `&access_token=${process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN}` +
          `&session_token=${sessionToken}` +
          `&country=KE` +
          `&proximity=${NAIROBI.lon},${NAIROBI.lat}` +
          `&limit=5`;

        const res = await fetch(url);
        const data = await res.json();
        setResults(data?.suggestions ?? []);
      } catch (err) {
        console.error("Geocoding error:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchLocations();
  }, [debouncedQuery, sessionToken]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setDisplayValue(value);
  };

  const handleSelect = async (suggestion: LocationSuggestion) => {
    try {
      setIsSearching(true);

      const url =
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}` +
        `?access_token=${process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN}` +
        `&session_token=${sessionToken}`;

      const res = await fetch(url);
      const data = await res.json();
      const featuresData: LocationFeature[] | undefined = data?.features;

      if (map && featuresData?.length) {
        const [lon, lat] = featuresData[0].geometry.coordinates;

        map.flyTo({
          center: [lon, lat],
          zoom: 14,
          speed: 4,
          duration: 1000,
          essential: true,
        });

        setDisplayValue(suggestion.name);
        setSelectedLocations(featuresData);
        setSelectedLocation(featuresData[0]);
        setResults([]);
        setIsOpen(false);

        // rotate session token for next search session
        setSessionToken(crypto.randomUUID());
      }
    } catch (err) {
      console.error("Retrieve error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setDisplayValue("");
    setResults([]);
    setIsOpen(false);
    setSelectedLocation(null);
    setSelectedLocations([]);
    setSessionToken(crypto.randomUUID()); // new session
  };

  return (
    <>
      <section className="absolute top-4 left-1/2 z-10 w-[90vw] -translate-x-1/2 rounded-lg shadow-lg sm:left-4 sm:w-[350px] sm:translate-x-0">
        <Command className="rounded-lg">
          <div
            className={cn(
              "flex w-full items-center justify-between gap-1 px-3",
              isOpen && "border-b"
            )}
          >
            <CommandInput
              placeholder="Search locations…"
              value={displayValue}
              onValueChange={handleInputChange}
              className="flex-1"
            />
            {displayValue && !isSearching && (
              <X
                className="size-4 cursor-pointer shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                onClick={clearSearch}
              />
            )}
            {isSearching && (
              <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
            )}
          </div>

          {isOpen && (
            <CommandList className="max-h-60 overflow-y-auto">
              {!query.trim() || isSearching ? null : results.length === 0 ? (
                <CommandEmpty className="py-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-sm font-medium">No locations found</p>
                    <p className="text-xs text-muted-foreground">
                      Try a different search term
                    </p>
                  </div>
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {results.map((location) => (
                    <CommandItem
                      key={location.mapbox_id}
                      onSelect={() => handleSelect(location)}
                      value={`${location.name} ${location.place_formatted} ${location.mapbox_id}`}
                      className="flex cursor-pointer items-center rounded-md px-2 py-3 hover:bg-accent"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="rounded-full bg-primary/10 p-1.5">
                          {(() => {
                            const key = location.maki?.toLowerCase() ?? "";
                            const Icon = iconMap[key];
                            return Icon ? (
                              <Icon className="h-4 w-4 text-primary" />
                            ) : (
                              <MapPin className="h-4 w-4 text-primary" />
                            );
                          })()}
                        </div>
                        <div className="flex flex-col">
                          <span className="max-w-[270px] truncate text-sm font-medium">
                            {location.name}
                          </span>
                          <span className="max-w-[270px] truncate text-xs text-muted-foreground">
                            {location.place_formatted}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          )}
        </Command>
      </section>

      {selectedLocations.map((location) => (
        <LocationMarker
          key={location.properties.mapbox_id}
          location={location}
          onHover={(data) => setSelectedLocation(data)}
        />
      ))}

      {selectedLocation && (
        <LocationPopup
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </>
  );
}
