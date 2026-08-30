const CACHE_NAME = 'ubs-toolkit-v1';
const ASSETS_TO_CACHE = [
  './KALKULATOR_TEKNIK.html',
  './SPEK_TEKNIS_GENERATOR_1.html',
  './SIMULASI_PARAM_OPEN_CLOSE_PK.html',
  './manifest-kalkulator.json',
  './manifest-spek.json',
  './manifest-simulasi.json',
  './icons/kalkulator-192.png',
  './icons/kalkulator-512.png',
  './icons/spek-192.png',
  './icons/spek-512.png',
  './icons/simulasi-192.png',
  './icons/simulasi-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
