import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded-md bg-brand-300" />
            <span className="font-bold">PackPal</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Plan trips, Pack smart, Travel happier.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Product</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/docs">Docs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="https://thelightideas.co.ke/" target="_blank">Light Ideas</a></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
          </ul>
        </div>
        <div className="text-sm text-slate-600">
          © {new Date().getFullYear()} PackPal.
        </div>
      </div>
    </footer>
  );
}
