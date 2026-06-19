const CACHE_NAME = 'speedpulse-v5';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './speedtest.js',
  './utils.js',
  './history.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url => {
          return fetch(new Request(url, { cache: 'reload' }))
            .then(response => {
              if (!response.ok) {
                throw new Error(`Request for ${url} failed with status ${response.status}`);
              }
              return cache.put(url, response);
            })
            .catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              // Fallback to standard fetch if cache: reload is rejected
              return fetch(url).then(res => cache.put(url, res)).catch(e => console.error(e));
            });
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Only cache UI assets, bypass caching for speedtest API requests
  if (event.request.url.includes('speed.cloudflare.com') || 
      event.request.url.includes('ipapi.co') || 
      event.request.url.includes('httpbin.org') || 
      event.request.url.includes('ip-api.com')) {
      return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  self.clients.claim();
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
