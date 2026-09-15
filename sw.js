/**
 * 🛡️ DIAMAX PRO — SERVICE WORKER ENGINE v3.2
 * [3TREE DIGITAL SPORT IA · MILITARY-GRADE DEFENSE-IN-DEPTH ARCHITECTURE]
 * CAPA 4: ZERO-TRUST OFFLINE ISOLATION & AIR-GAP VAULT
 * 
 * Desarrollado por 3Tree Digital Sport IA · Lutz, Florida USA.
 * Todos los derechos reservados 2026. CEO Alí Zapata.
 */

const CACHE_NAME = 'diamax-pro-v5.1-stadium-base-icon';
const OFFLINE_URL = 'index.html';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './Baseball_bat_striking_ball_1080p_20260913144643.mp4'
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
