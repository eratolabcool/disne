const CACHE_NAME = 'disney-solitaire-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/logo.jpg',
  '/imgs/maxresdefault.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
