// Service Worker for Disney Solitaire - Performance & Caching Optimization
const CACHE_NAME = 'disney-solitaire-v2';
const STATIC_CACHE = 'disney-solitaire-static-v2';
const IMAGE_CACHE = 'disney-solitaire-images-v2';
const API_CACHE = 'disney-solitaire-api-v2';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/imgs/badges/phdaily.svg',
  '/imgs/disney/og-image.jpg',
  '/imgs/disney/twitter-card.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v2');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old v1 caches
            if (cacheName.includes('v1') ||
                (cacheName !== STATIC_CACHE &&
                 cacheName !== IMAGE_CACHE &&
                 cacheName !== API_CACHE)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external API calls
  if (request.method !== 'GET' ||
      (url.origin !== self.location.origin && !url.href.includes('disneysolitaire'))) {
    return;
  }

  event.respondWith(handleRequest(request));
});

// Main request handler with optimized caching strategies
async function handleRequest(request) {
  const url = new URL(request.url);

  try {
    // Strategy 1: Cache First for static assets and images
    if (isStaticAsset(url.pathname) || isImage(url.pathname)) {
      const cacheName = isImage(url.pathname) ? IMAGE_CACHE : STATIC_CACHE;
      return await cacheFirst(request, cacheName);
    }

    // Strategy 2: Network First for API calls
    if (isAPIRequest(url.pathname)) {
      return await networkFirst(request, API_CACHE);
    }

    // Strategy 3: Stale While Revalidate for HTML pages
    if (isHTMLPage(url.pathname)) {
      return await staleWhileRevalidate(request, CACHE_NAME);
    }

    // Default: Network request
    return await fetch(request);

  } catch (error) {
    console.error('[SW] Request handling failed:', error);

    // Fallback for HTML pages
    if (isHTMLPage(url.pathname)) {
      return await caches.match('/') ||
        new Response('Offline - Please check your connection', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/html' }
        });
    }

    throw error;
  }
}

// Caching strategy implementations
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log('[SW] Cache hit:', request.url);
    return cachedResponse;
  }

  try {
    console.log('[SW] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Don't cache large files or error responses
      const contentType = networkResponse.headers.get('content-type') || '';
      if (contentType.includes('text/') || contentType.includes('application/') ||
          isImage(request.url)) {
        cache.put(request, networkResponse.clone());
      }
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Network request failed:', error);
    throw error;
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    console.log('[SW] Network first for:', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('[SW] Returning cached response due to network failure');
      return cachedResponse;
    }

    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Always try to fetch fresh content
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
        console.log('[SW] Updated cache for:', request.url);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.error('[SW] Fresh fetch failed:', error);
      return null;
    });

  // Return cached version immediately if available
  if (cachedResponse) {
    console.log('[SW] Serving from cache while revalidating:', request.url);
    return cachedResponse;
  }

  // Wait for network if no cache available
  return fetchPromise;
}

// Helper functions to categorize requests
function isStaticAsset(pathname) {
  return /\.(js|css|woff2?|ttf|eot|svg|json)$/i.test(pathname) ||
         pathname.includes('/_next/static/') ||
         pathname.includes('/fonts/') ||
         pathname.includes('/imgs/badges/') ||
         pathname.includes('/manifest.json');
}

function isImage(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif|ico)$/i.test(pathname) ||
         pathname.includes('/imgs/');
}

function isAPIRequest(pathname) {
  return pathname.startsWith('/api/') ||
         pathname.startsWith('/_next/api/');
}

function isHTMLPage(pathname) {
  return pathname.endsWith('/') ||
         pathname.endsWith('.html') ||
         !pathname.includes('.') ||
         pathname.includes('/[locale]/');
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any offline actions when back online
    console.log('[SW] Processing background sync');

    // Clear old caches and update critical resources
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_ASSETS.filter(url => url !== '/'));

    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
    console.log('[SW] Performance metrics received:', event.data.metrics);
    // Could send to analytics here
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('[SW] Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Enhanced service worker v2 loaded successfully');