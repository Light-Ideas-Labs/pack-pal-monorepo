import Link from "next/link";
import FooterAbout from "./footer-about";
import AccountLinks from "./account-links";
import QuickLinks from "./quick-links";
import FooterBottom from "./footer-bottom";
import { AppStoreIcon, GooglePlayIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-gray-3">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        {/* sections */}
        <div className="pt-17.5 xl:pt-22.5 pb-10 xl:pb-20">
          <div className="grid grid-cols-1 gap-10 text-center sm:text-left sm:grid-cols-2 lg:grid-cols-4 place-items-center sm:place-items-start">
            <FooterAbout />
            <AccountLinks />
            <QuickLinks />

            {/* Download App */}
            <div className="w-full sm:w-auto">
              <h2 className="mb-7.5 text-xl font-semibold text-dark lg:text-right">Download App</h2>
              <p className="mb-4 text-custom-sm lg:text-right">
                Get started in seconds – it&apos;s fast, free, and easy!
              </p>
              <ul className="flex flex-col gap-3 items-center lg:items-end">
                <li>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow-md ring-1 ring-black/10 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                  >
                    <AppStoreIcon className="h-7 w-7 text-white" />
                    <div className="text-left leading-tight">
                      <span className="block text-[11px] text-white/80">Download on the</span>
                      <p className="text-sm font-semibold">App Store</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-4 py-2.5 text-white shadow-md ring-1 ring-indigo-900/20 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
                  >
                    <GooglePlayIcon className="h-7 w-7 text-white" />
                    <div className="text-left leading-tight">
                      <span className="block text-[11px] text-white/85">Get it on</span>
                      <p className="text-sm font-semibold">Google Play</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FooterBottom />
    </footer>
  );
}
