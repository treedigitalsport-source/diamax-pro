/**
 * 🛡️ DIAMAX PRO — SERVICE WORKER ENGINE v2.5
 * [3TREE DIGITAL SPORT IA · MILITARY-GRADE DEFENSE-IN-DEPTH ARCHITECTURE]
 * CAPA 4: ZERO-TRUST OFFLINE ISOLATION & AIR-GAP VAULT
 * 
 * Desarrollado por 3Tree Digital Sport IA · Lutz, Florida USA.
 * Todos los derechos reservados 2026.
 */

const CACHE_NAME = 'diamax-pro-v2.5-mil-spec';
const OFFLINE_URL = 'index.html';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Instalación del Service Worker y Cacheo Inmediato
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[3TREE SECURITY] Service Worker instalado. Cacheando núcleo militar...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activación y Purga de Cachés Antiguas
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

// 3. Estrategia Cache-First con Stale-While-Revalidate para Resiliencia en Dugout
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
