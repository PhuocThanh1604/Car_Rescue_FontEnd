// The version of the cache, change this to update the cache
const CACHE_VERSION = 'v1';
const CACHE_NAME = `my-site-cache-${CACHE_VERSION}`;
const urlsToCache = [
  '/',
  '/index.html',
  // Add other URLs you want to cache
];

// Install a service worker
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update a service worker
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Add push notifications handling, if needed
// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Push event received:', data);
  const options = {
    body: data.body,
    icon: 'icons/icon-192x192.png', // Path to your icon
    badge: 'icons/icon-192x192.png'
  };

  event.waitUntil(
    // eslint-disable-next-line no-restricted-globals
    self.registration.showNotification(data.title, options)
  );
});
