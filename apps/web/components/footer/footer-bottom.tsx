import Link from "next/link";

export default function FooterBottom() {
  const year = new Date().getFullYear();

  return (
    <div className="bg-gray-1 py-5 xl:py-7.5 border-gray-3">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        {/* Legal row */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t pt-6 text-center sm:mt-0 sm:flex-row sm:justify-between">
          <div className="text-sm text-slate-600">
            © {year} PackPal • Built by Light Ideas
          </div>
          <ul className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
