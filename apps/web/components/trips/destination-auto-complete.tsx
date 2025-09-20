// components/trips/DestinationAutocomplete.tsx
"use client";

import { Command as CommandRoot, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

type Suggestion = { mapbox_id: string; name: string; place_formatted?: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  country?: string;
  invalid?: boolean;
  className?: string;
};

const DEFAULT_COUNTRY = "KE";

export default function DestinationAutocomplete({
  value,
  onChange,
  placeholder = "Search a destination…",
  country = DEFAULT_COUNTRY,
  invalid,
  className,
}: Props) {
  const [display, setDisplay] = useState(value ?? "");
  const [query, setQuery] = useState(value ?? "");
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Suggestion[]>([]);
  const debounced = useDebounce(query, 300);
  const sessionToken = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    setDisplay(value ?? "");
    setQuery(value ?? "");
  }, [value]);

  useEffect(() => {
    const q = debounced.trim();
    if (!q) { setResults([]); setOpen(false); return; }
    (async () => {
      setIsSearching(true); setOpen(true);
      try {
        const url =
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(q)}` +
          `&access_token=${process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN}` +
          `&session_token=${sessionToken}` +
          (country ? `&country=${country}` : "") +
          `&limit=8`;
        const res = await fetch(url);
        const data = await res.json();
        setResults(data?.suggestions ?? []);
      } finally {
        setIsSearching(false);
      }
    })();
  }, [debounced, sessionToken, country]);

  const selectSuggestion = (s: Suggestion) => {
    const text = s.name;
    setDisplay(text);
    onChange(text);
    setOpen(false);
  };

  const clear = () => {
    setDisplay(""); setQuery(""); setResults([]); setOpen(false); onChange("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <CommandRoot
        className={cn(
          // make it look like <Input>
          "w-full rounded-md border bg-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          invalid && "border-destructive focus-within:ring-destructive"
        )}
      >
        {/* Input row — identical rhythm to shadcn <Input> */}
        <div className="relative flex h-10 items-center gap-2 px-3">
          <Search className="h-4 w-4 opacity-50" />
          <CommandPrimitive.Input
            placeholder={placeholder}
            value={display}
            onValueChange={(v) => { setDisplay(v); setQuery(v); onChange(v); }}
            className="h-10 w-full border-0 bg-transparent p-0 text-sm outline-none ring-0 placeholder:text-muted-foreground"
          />
          {display && !isSearching && (
            <button type="button" onClick={clear} className="absolute right-3 inline-flex h-4 w-4 items-center justify-center">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          {isSearching && <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-primary" />}
        </div>

        {open && (
          <CommandList className="max-h-64 overflow-y-auto">
            {!display.trim() ? null : results.length === 0 ? (
              <CommandEmpty className="py-4 text-center text-sm">No places found</CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((r) => (
                  <CommandItem
                    key={r.mapbox_id}
                    onSelect={() => selectSuggestion(r)}
                    value={`${r.name} ${r.place_formatted ?? ""} ${r.mapbox_id}`}
                    className="flex cursor-pointer items-center gap-2 px-2 py-3"
                  >
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{r.name}</div>
                      {r.place_formatted && (
                        <div className="truncate text-xs text-muted-foreground">{r.place_formatted}</div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </CommandRoot>
    </div>
  );
}
