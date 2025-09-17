type Plan = "Free" | "Pro" | "Teams";

const FEATURES = [
  { title: "Trips Overview", desc: "Organize journeys with color-coded cards and dates.", plan: "Free" as Plan },
  { title: "Smart Itinerary", desc: "Day-by-day timeline with precise times and notes.", plan: "Free" as Plan },
  { title: "Maps & Places", desc: "Attach locations and visualize routes.", plan: "Free" as Plan },
  { title: "Documents", desc: "Store tickets, visas and PDFs with quick preview.", plan: "Free" as Plan },
  { title: "Packing Lists", desc: "Reusable templates; smart suggestions on travel day.", plan: "Pro" as Plan },
  { title: "Sharing", desc: "Invite friends with viewer or editor roles.", plan: "Pro" as Plan },
  { title: "Offline-first", desc: "Full offline with background sync when online.", plan: "Pro" as Plan },
  { title: "Export", desc: "Export itinerary to PDF, CSV and calendar (ICS).", plan: "Pro" as Plan },
  { title: "Backups", desc: "Cloud backup & one-tap restore.", plan: "Pro" as Plan },
  { title: "Friends & Teams Workspaces", desc: "Shared templates, role-based access & audit log for friend groups and teams.", plan: "Teams" as Plan },
];

export default function FeaturesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Features</h1>
      <p className="mt-2 text-muted-foreground">Start on Free. Upgrade to Pro or Teams when you need more.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {FEATURES.map((x) => (
          <div key={x.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold">{x.title}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium
                ${x.plan === "Pro"
                  ? "bg-brand-100 text-brand-700"
                  : x.plan === "Teams"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-muted text-foreground/70"}`}
                title={`Included in ${x.plan}`}
              >
                {x.plan}
              </span>
            </div>
            <p className="mt-2 text-muted-foreground">{x.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
