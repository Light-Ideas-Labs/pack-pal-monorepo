export const metadata = {
  title: "Offline • PackPal",
};

export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">You’re offline</h1>
      <p className="mt-2 text-slate-600">
        PackPal needs a connection for some features. We’ll reload
        automatically when you’re back online.
      </p>
    </main>
  );
}
