import Link from "next/link";
import { trips } from "@/lib/demo";
import { Button } from "@/components/ui/button";

export default function TripsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trips</h1>
        <Link href="/dashboard/trips/new">
          <Button className="bg-brand-500 hover:bg-brand-600">New trip</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((t) => (
          <Link key={t.id} href={`/dashboard/trips/${t.id}`} className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md">
            <div className="text-xs text-muted-foreground">
              {new Date(t.startDate).toLocaleDateString()} – {new Date(t.endDate).toLocaleDateString()}
            </div>
            <h3 className="mt-1 text-lg font-semibold">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.city}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
