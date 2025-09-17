// lib/pwa/sw-registration.ts
type NavigatorStandalone = Navigator & { standalone?: boolean };

const isBrowser = () => typeof window !== 'undefined';

export const registerServiceWorker = async () => {
  if (!isBrowser()) return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });

    console.log('SW registered: ', registration);

    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            console.log(
              'New content is available and will be used when all tabs are closed.'
            );
            // Optional prompt — keep it browser-guarded
            if (isBrowser() && confirm('New content is available! Refresh now?')) {
              window.location.reload();
            }
          } else {
            console.log('Content is cached for offline use.');
          }
        }
      });
    });
  } catch (error) {
    console.log('SW registration failed: ', error);
  }
};

export const unregisterServiceWorker = async () => {
  if (!isBrowser()) return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    console.log('SW unregistered');
  } catch (error) {
    console.log('SW unregistration failed: ', error);
  }
};

/** Safe PWA check for both iOS & others, SSR-proof */
export const isPWA = (): boolean => {
  if (!isBrowser()) return false;
  const mm = typeof window.matchMedia === 'function'
    ? window.matchMedia('(display-mode: standalone)')
    : ({} as MediaQueryList);
  const iosStandalone =
    'standalone' in window.navigator &&
    (window.navigator as NavigatorStandalone).standalone === true;

  return !!(mm.matches || iosStandalone);
};

/** Safe prompt helper (no-ops on server) */
export const promptInstallPWA = () => {
  if (!isBrowser()) {
    return { handleInstall: async () => {}, canInstall: false };
  }

  let deferredPrompt: BeforeInstallPromptEvent | null = null;

  const onBIP = (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log('PWA install prompt available');
  };

  window.addEventListener('beforeinstallprompt', onBIP);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
  };

  // expose a live getter so callers can check availability
  const canInstallGetter = () => !!deferredPrompt;

  return { handleInstall, get canInstall() { return canInstallGetter(); } };
};

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}
