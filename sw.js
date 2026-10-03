// Trip Barabar — Offline-First Service Worker
const CACHE_NAME = 'trip-barabar-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './logos/kool-jet.png',
  './logos/kool-wayfinder.png',
  './logos/kool-pin.png',
  './logos/kool-aviators.png',
  './logos/kool-globe.png',
  './logos/icon-suitcase.svg',
  './logos/kool-jet.svg',
  './logos/kool-wayfinder.svg',
  './logos/kool-pin.svg',
  './logos/kool-aviators.svg',
  './logos/kool-globe.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Pre-cache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Stale-while-revalidate for local assets, network-first for external APIs
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // CRITICAL: NEVER cache API sync routes! Always pass straight to the network!
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // If same origin asset, serve from cache first, fallback to network
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {/* ignore offline error */});
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
  } else {
    // External resources (CDN scripts/fonts)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
