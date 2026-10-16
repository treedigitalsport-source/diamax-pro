/**
 * 🛡️ DIAMAX PRO — SERVICE WORKER ENGINE v3.5
 * [3TREE DIGITAL SPORT IA CORP. · ADVANCED ZERO TRUST DEFENSE-IN-DEPTH ARCHITECTURE]
 * CAPA 4: ZERO-TRUST OFFLINE ISOLATION & AIR-GAP VAULT
 * 
 * Desarrollado por 3Tree Digital Sport IA Corp. · Lutz, Florida USA.
 * Todos los derechos reservados 2026. CEO Alí Zapata.
 */

const CACHE_NAME = 'diamax-pro-v9.3-photos-gve55-oct2026';
const OFFLINE_URL = 'index.html';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/diamax_diamond_isotipo.svg',
  './assets/diamax_d_isotipo.svg',
  './favicon.svg',
  './assets/players/gve55/johan_olivo.png',
  './assets/players/gve55/pablo_morales.png',
  './assets/players/gve55/raul_lozada.png',
  './assets/players/gve55/jorge_mitchell.png',
  './assets/players/gve55/oswaldo_grillo.png',
  './assets/players/gve55/nestor_vera.png',
  './assets/players/gve55/pedro_moreno.png',
  './assets/players/gve55/juan_perez.png',
  './assets/players/gve55/martin_rojas.png',
  './assets/players/gve55/pedro_chavez.png',
  './assets/players/gve55/luis_silva.png',
  './assets/players/gve55/luis_barrios.png',
  './assets/players/gve55/arquimedes_avancines.png',
  './assets/players/gve55/luis_rodriguez.png'
];

// 1. Instalación del Service Worker e Inmediata Toma de Control
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[3TREE SECURITY] Service Worker v3.2 instalado. Cacheando núcleo...');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[3TREE SECURITY] Algunos assets diferidos:', err);
      });
    })
  );
});

// 2. Activación y Purga Inmediata de Cachés Antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[3TREE SECURITY] Purgando caché obsoleta:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Estrategia Network-First para Documento Principal (Evita Caché Obsoleta)
//    y Cache-First para Assets Estáticos
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Para navegaciones HTML (index.html): NETWORK-FIRST
  if (event.request.mode === 'navigate' || event.request.destination === 'document' || url.pathname.endsWith('index.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => cached || caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // Para el resto de recursos: Cache con Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
