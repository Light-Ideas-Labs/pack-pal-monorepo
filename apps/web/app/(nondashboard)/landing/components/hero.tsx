import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand-50 p-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Plan trips, <span className="text-brand-600">Pack smart</span>, Travel happier.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Create smart itineraries, map routes, store documents, and never forget your packing list.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/trips/create">
            <Button size="lg" className="bg-brand-500 hover:bg-brand-600">Get started</Button>
          </Link>
          <Link href="/features"><Button size="lg" variant="outline">See features</Button></Link>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold">Trips Overview</p>
          <p className="mt-2 text-sm text-slate-600">Beautiful cards for each trip with dates & colors.</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold">Timeline Itinerary</p>
          <p className="mt-2 text-sm text-slate-600">Day-by-day schedule with precise times.</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold">Documents & Packing</p>
          <p className="mt-2 text-sm text-slate-600">Store PDFs, tickets; check off items as you pack.</p>
        </div>
      </div>
    </section>
  );
}
