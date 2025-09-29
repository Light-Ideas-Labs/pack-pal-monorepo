'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { registerServiceWorker, isPWA } from '@/lib/pwa/sw-registration';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

type InstallOutcome = 'accepted' | 'dismissed';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: InstallOutcome; platform: string }>;
  prompt(): Promise<void>;
}

type TriggerConfig = {
  /** Show after N seconds on page */
  timeSeconds?: number;
  /** Show after user scrolls this percent of page height (0-100) */
  scrollPercent?: number;
  /** Show when a custom event fires (e.g., dispatch new CustomEvent('trip:created')) */
  onTripCreate?: boolean;
  /** Back-compat if you reuse from ecom code */
  onAddToCart?: boolean;
};

type RouteRule = string | RegExp;

type PWAInstallerProps = {
  brandName?: string;
  title?: string;
  subtitle?: string;
  routes?: RouteRule[];                 // where to show
  triggers?: TriggerConfig;             // when to show
  dismissForDays?: number;              // don't bug users again for N days
  /** Extra CSS classes for the container */
  className?: string;
  /** Analytics hooks */
  onShown?: () => void;
  onInstallClicked?: () => void;
  onDismissed?: () => void;
  onInstalled?: () => void;
};

const isIOS = () =>
  typeof window !== 'undefined' && /iphone|ipad|ipod/i.test(window.navigator.userAgent);

const isStandalone = () =>
  // iOS Safari exposes non-standard `navigator.standalone`
  (typeof window !== "undefined" && (window.navigator as NavigatorWithStandalone).standalone === true) ||
  // Other browsers
  (typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(display-mode: standalone)").matches);

function pathMatches(pathname: string, rules?: RouteRule[]) {
  if (!rules || rules.length === 0) return true;
  return rules.some((r) => (typeof r === 'string' ? pathname.startsWith(r) : r.test(pathname)));
}

function millisDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.getTime();
}

export function PWAInstaller({
  brandName = 'PackPal',
  title,
  subtitle,
  routes = [/^\/(trips|packing|explore|destinations)/],
  triggers = { timeSeconds: 10, scrollPercent: 35, onTripCreate: true },
  dismissForDays = 14,
  className,
  onShown,
  onInstallClicked,
  onDismissed,
  onInstalled,
}: PWAInstallerProps) {
  const pathname = usePathname() ?? '/';
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosTip, setIosTip] = useState(false);
  const shownRef = useRef(false);
  const storageKey = useMemo(() => `pwa-install-dismissed:${brandName}`, [brandName]);

  // Register SW once
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Early exits
  const alreadyInstalled = isPWA() || isStandalone();
  const routeOK = pathMatches(pathname, routes);

  // Respect cooldown
  useEffect(() => {
    if (alreadyInstalled) return;

    const until = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (until && Date.now() < Number(until)) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setShow(false);
      setDeferredPrompt(null);
      onInstalled?.();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyInstalled, storageKey]);

  // Trigger logic
  useEffect(() => {
    if (alreadyInstalled || !routeOK || shownRef.current) return;

    const showBanner = () => {
      if (shownRef.current) return;

      // iOS can't prompt; show tip instead
      if (isIOS() && !isStandalone()) {
        setIosTip(true);
        setShow(true);
        shownRef.current = true;
        onShown?.();
        return;
      }

      if (isInstallable || deferredPrompt) {
        setShow(true);
        shownRef.current = true;
        onShown?.();
      }
    };

    const timers: number[] = [];
    const cleanupFns: Array<() => void> = [];

    // time trigger
    if (triggers.timeSeconds && triggers.timeSeconds > 0) {
      const t = window.setTimeout(showBanner, triggers.timeSeconds * 1000);
      timers.push(t);
    }

    // scroll trigger
    if (triggers.scrollPercent && triggers.scrollPercent > 0) {
      const target = Math.min(100, Math.max(1, triggers.scrollPercent));
      const onScroll = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = total > 0 ? (window.scrollY / total) * 100 : 0;
        if (scrolled >= target) {
          showBanner();
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanupFns.push(() => window.removeEventListener('scroll', onScroll));
    }

    // trip created trigger
    if (triggers.onTripCreate) {
      const onTripCreate = () => showBanner();
      window.addEventListener('trip:created', onTripCreate as EventListener);
      cleanupFns.push(() => window.removeEventListener('trip:created', onTripCreate as EventListener));
    }

    // (optional) back-compat ecom trigger
    if (triggers.onAddToCart) {
      const onCartAdd = () => showBanner();
      window.addEventListener('cart:add', onCartAdd as EventListener);
      cleanupFns.push(() => window.removeEventListener('cart:add', onCartAdd as EventListener));
    }

    return () => {
      timers.forEach(clearTimeout);
      cleanupFns.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeOK, isInstallable, deferredPrompt, alreadyInstalled, triggers]);

  const handleInstall = async () => {
    onInstallClicked?.();

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      if (outcome === 'dismissed') {
        dismiss();
      } else {
        setShow(false);
      }
      return;
    }

    // iOS: no programmatic prompt—keep tip visible
    if (isIOS()) return;
  };

  const dismiss = () => {
    setShow(false);
    setIosTip(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(millisDaysFromNow(dismissForDays)));
    }
    onDismissed?.();
  };

  if (!routeOK || !show) return null;

  return (
    <div
      role="dialog"
      aria-label="Install app prompt"
      className={clsx(
        'fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 rounded-2xl shadow-2xl p-4 md:left-auto md:right-4 md:max-w-sm',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
            {/* Download/phone icon */}
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 16v-8m0 0l-3 3m3-3l3 3M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2h-3l-2-2H11L9 6H6a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            {title ?? `Install ${brandName}`}
          </h3>
          <p className="text-xs mt-1 text-muted-foreground">
            {iosTip
              ? 'Add to Home Screen to plan offline and access trips faster.'
              : subtitle ?? 'Plan trips, pack smarter, and use PackPal offline.'}
          </p>

          {/* iOS inline tip */}
          {iosTip && (
            <div className="mt-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-2 text-[11px] leading-snug text-muted-foreground">
              <p className="font-medium mb-1">iOS Safari</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Tap the <span aria-label="Share">Share</span> icon in Safari.</li>
                <li>Choose <strong>Add to Home Screen</strong>.</li>
                <li>Open <strong>{brandName}</strong> from your Home Screen.</li>
              </ol>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <Button size="sm" className="text-xs" onClick={handleInstall}>
              {iosTip ? 'Show Steps' : 'Install'}
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={dismiss}>
              Not now
            </Button>
          </div>
        </div>

        <button
          aria-label="Close"
          onClick={dismiss}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
