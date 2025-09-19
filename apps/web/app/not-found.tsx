// app/not-found.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Compass, MapPin, Plane, Undo2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const QUIPS = [
  "Looks like this route needs a visa. 🛂",
  "We lost the pin… but found your sense of adventure!",
  "Detour! The scenic route is always better. 🌄",
  "This page took a gap year. Try another destination. 🎒",
];

export default function NotFound() {
  const pathname = usePathname();

  // Deterministic pick to avoid hydration mismatch
  const quip = useMemo(() => {
    const hash = [...(pathname || "/")].reduce((a, c) => a + c.charCodeAt(0), 0);
    return QUIPS[hash % QUIPS.length];
  }, [pathname]);

  return (
    <main className="relative min-h-[80vh] overflow-hidden">
      {/* soft brand blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br blur-2xl" />
      </div>

      <section className="mx-auto grid max-w-3xl place-items-center px-6 py-20 text-center">
        <Badge className="mb-4 inline-flex items-center gap-2 bg-gradient-to-r text-white shadow">
          <Sparkles className="h-3.5 w-3.5" />
          PackPal
        </Badge>

        <Card className="w-full rounded-2xl">
          <CardContent className="p-8 md:p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md">
              <Compass className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              404 — Wrong turn! 🧭
            </h1>
            <p className="mt-2 text-muted-foreground">{quip}</p>

            {/* Actions */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Button asChild variant="outline" className="justify-center">
                <Link href="/" className="group">
                  <Undo2 className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  Go home
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-center">
                <Link href="/trips">
                  <MapPin className="mr-2 h-4 w-4" />
                  My trips
                </Link>
              </Button>

              <Button
                asChild
                className="justify-center bg-gradient-to-r text-white shadow hover:brightness-110"
              >
                <Link href="/trips/create">
                  <Plane className="mr-2 h-4 w-4" />
                  Plan a trip
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Think this link is broken?{" "}
              <a
                href="mailto:support@packpal.travel?subject=Broken%20link%20report"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Tell our crew
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
