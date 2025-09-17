const VERSION = 'packpal-v1';
const APP_SHELL = [
  '/',                 // or '/trips' if that's your start page
  '/offline',
  '/trips',
  '/packing',
  '/explore',
  '/destinations',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/favicon.ico',
];

// Static asset patterns (Next.js)
const STATIC_PATTERNS = [
  /^\/_next\/static\//,     // JS/CSS chunks
  /^\/_next\/image\?/,      // Next Image optimizer
  /^\/fonts?\//,            // optional custom fonts folder
];

// Cache names
const CACHES = {
  APP: `${VERSION}-app`,
  RUNTIME: `${VERSION}-runtime`,
  IMAGES: `${VERSION}-images`,
  API: `${VERSION}-api`,
};

// Utility: network timeout race for HTML
const networkWithFallbackToCache = async (event, cacheName) => {
  const cache = await caches.open(cacheName);
  try {
    const preloaded = await event.preloadResponse;
    const response = preloaded || await fetch(event.request);
    if (response && response.ok) {
      cache.put(event.request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(event.request);
    return cached || caches.match('/offline');
  }
};

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHES.APP);
      await cache.addAll(APP_SHELL);
      // Activate new SW immediately on install
      await self.skipWaiting();
    })()
  );
});

// Activate: clean old caches & enable nav preload
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k.startsWith('packpal-') && !k.startsWith(VERSION) ? caches.delete(k) : null))
      );
      if ('navigationPreload' in self.registration) {
        try { await self.registration.navigationPreload.enable(); } catch {}
      }
      await self.clients.claim();
    })()
  );
});

// Fetch strategy:
// - HTML navigations: Network-first, fallback to cache -> /offline
// - Static assets (_next/static, images, fonts): Cache-first
// - Same-origin GET /api/*: Stale-while-revalidate (avoid caching POST/PUT/etc)
// - Other same-origin GET: Cache-first for images & common static file types; otherwise passthrough
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Ignore non-GET
  if (request.method !== 'GET') return;

  // HTML navigations
  if (request.mode === 'navigate') {
    event.respondWith(networkWithFallbackToCache(event, CACHES.APP));
    return;
  }

  // Static assets by path patterns
  if (STATIC_PATTERNS.some((rx) => rx.test(url.pathname))) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHES.RUNTIME);
        const cached = await cache.match(request);
        if (cached) return cached;
        const resp = await fetch(request);
        if (resp && resp.ok) cache.put(request, resp.clone());
        return resp;
      })()
    );
    return;
  }

  // Images (cache-first)
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHES.IMAGES);
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const resp = await fetch(request, { cache: 'no-cache' });
          if (resp && resp.ok) cache.put(request, resp.clone());
          return resp;
        } catch {
          // fallback icon if desired
          return caches.match('/icons/icon-192.png');
        }
      })()
    );
    return;
  }

  // API GETs: stale-while-revalidate (e.g., /api/trips, /api/packing)
  if (url.pathname.startsWith('/api/') && request.method === 'GET') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHES.API);
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((resp) => {
            // Respect private/no-store if set by server
            const cc = resp.headers.get('Cache-Control') || '';
            const isPrivate = /no-store|private/.test(cc);
            if (resp.ok && !isPrivate) cache.put(request, resp.clone());
            return resp;
          })
          .catch(() => null);

        return cached || (await fetchPromise) || new Response(null, { status: 503 });
      })()
    );
    return;
  }

  // Fallback: try cache then network
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHES.RUNTIME);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const resp = await fetch(request);
        // cache common static types only
        if (resp && resp.ok && /\.(js|css|woff2?|ttf|eot|json)$/i.test(url.pathname)) {
          cache.put(request, resp.clone());
        }
        return resp;
      } catch {
        // Offline fallback for navigations handled earlier
        return new Response(null, { status: 504 });
      }
    })()
  );
});

// Background Sync: retry queued trip/packing mutations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync:trip-actions') {
    event.waitUntil(handleQueuedActions());
  }
});

async function handleQueuedActions() {
  // Implement IndexedDB queue processing here (e.g., idb-keyval)
  // Example: replay PATCH /api/trips/:id or POST /api/packing/check
  // This is a placeholder hook.
  return;
}

// Push Notifications (trip reminders, packing nudges)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = (() => {
    try { return event.data.json(); } catch { return { title: 'PackPal', body: event.data.text() }; }
  })();

  const options = {
    body: data.body || 'Trip update from PackPal.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/trips',
      ts: Date.now(),
    },
    actions: [
      { action: 'open', title: 'Open', icon: '/icons/icon-192.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/icons/icon-192.png' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title || 'PackPal', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || '/trips';
  if (event.action === 'dismiss') return;
  event.waitUntil(clients.openWindow(targetUrl));
});

// Allow page to force-activate an updated SW
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
