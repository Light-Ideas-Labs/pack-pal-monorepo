export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold">Profile</h3>
          <p className="mt-1 text-sm text-muted-foreground">Name, email, and preferences.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold">Notifications</h3>
          <p className="mt-1 text-sm text-muted-foreground">Trip reminders, packing nudges, flight day alerts.</p>
        </div>
      </div>
    </div>
  );
}
