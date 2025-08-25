import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section className="my-16 rounded-3xl bg-gradient-to-r from-brand-300 to-brand-400 p-10 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="text-2xl font-bold">Ready to travel happier?</h3>
        <p className="mt-2 opacity-90">Start your next trip with PackPal—free to try, no card required.</p>
        <div className="mt-6">
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-primary-foreground font-semibold shadow-sm hover:bg-primary/90">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
