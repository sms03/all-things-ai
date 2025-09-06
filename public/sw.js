const CACHE_NAME = 'all-things-ai-v1';
// Only cache stable, existing assets. Vite will hash build assets, so rely on runtime caching.
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_URLS);
      } catch (e) {
        // Ignore individual failures (e.g., during deploy) to avoid install abort
        console.warn('[SW] Precaching failed', e);
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Navigation requests: network first, fallback to cached index (SPA behavior offline)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/'))
    );
    return;
  }
  // Other requests: cache-first, then network fallback
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      // Runtime cache GET requests (ignore opaque & non-200)
      if (req.method === 'GET' && resp.status === 200 && resp.type === 'basic') {
        const respClone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, respClone));
      }
      return resp;
    }).catch(() => cached))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
    )).then(() => self.clients.claim())
  );
});
