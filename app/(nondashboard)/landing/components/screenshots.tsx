export function Screenshots() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center">Looks great, feels simple</h2>
        <p className="mt-2 text-center text-slate-600">
          Clean cards, timeline planning, and color themes—built for speed and clarity.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="h-72 rounded-2xl bg-slate-100" />
          <div className="h-72 rounded-2xl bg-slate-100" />
          <div className="h-72 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </section>
  );
}
