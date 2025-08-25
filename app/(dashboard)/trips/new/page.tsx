"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewTripPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-bold">Create a new trip</h1>
      <p className="mt-2 text-muted-foreground">Name, dates, and a color theme. (Wire to your backend when ready.)</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/dashboard"); // Replace with real create call
        }}
      >
        <div>
          <label className="text-sm font-medium">Trip name</label>
          <input className="mt-1 w-full rounded-xl border bg-background px-3 py-2" placeholder="Rome, Italy" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start date</label>
            <input type="date" className="mt-1 w-full rounded-xl border bg-background px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm font-medium">End date</label>
            <input type="date" className="mt-1 w-full rounded-xl border bg-background px-3 py-2" required />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Color</label>
          <div className="mt-2 flex gap-2">
            {["peach","lavender","mint","sun","ocean","grape"].map(c => (
              <button key={c} type="button" className="h-8 w-8 rounded-full border" style={{ background: c === "peach" ? "var(--brand-100)" : c === "lavender" ? "var(--brand-200)" : "" }} />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
          <Button className="bg-brand-500 hover:bg-brand-600">Create trip</Button>
        </div>
      </form>
    </div>
  );
}
