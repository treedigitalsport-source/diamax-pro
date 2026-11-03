/**
 * 🛡️ DIAMAX PRO — PWA DUGOUT ENGINE & SERVICE WORKER v10.0
 * [3TREE DIGITAL SPORT IA CORP. · HIGH AVAILABILITY DUGOUT CACHE]
 * 
 * Estrategia de Caché: 'Stale-While-Revalidate' de Grado Workbox
 * Permite apertura en <150ms incluso con el dispositivo en 'Modo Avión' en el terreno de juego.
 * 
 * Desarrollado por 3Tree Digital Sport IA Corp. · Lutz, Florida USA.
 * Todos los derechos reservados 2026. Fundador & CEO Alí Zapata.
 */

const CACHE_NAME = 'diamax-dugout-pwa-v10.0-oct2026';
const OFFLINE_URL = 'index.html';

const CRITICAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './workers/monteCarloWorker.js',
  './assets/diamax_diamond_isotipo.svg',
  './assets/diamax_d_isotipo.svg',
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

// 1. INSTALACIÓN: Pre-cacheo atómico de recursos críticos del Dugout
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[DIAMAX PWA] Pre-cacheando App Shell y Roster Oficial en Cache Storage...');
      return cache.addAll(CRITICAL_ASSETS).catch(err => {
        console.warn('[DIAMAX PWA] Precaución al pre-cachear algunos assets:', err);
      });
    })
  );
});

// 2. ACTIVACIÓN: Purga de cachés antiguas y reclamo inmediato de clientes
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[DIAMAX PWA] Purgando caché obsoleta:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH: Stale-While-Revalidate para Recursos y Network-First con Fallback <150ms para HTML
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Excluir llamadas de Firebase Firestore y Analytics del cache SW
  if (url.origin.includes('firestore.googleapis.com') || 
      url.origin.includes('identitytoolkit.googleapis.com') ||
      url.pathname.includes('/google.firestore.')) {
    return;
  }

  // A) NAVEGACIÓN HTML (App Shell): Network-First con Fallback Instantáneo (<150ms)
  if (event.request.mode === 'navigate' || 
      event.request.destination === 'document' || 
      url.pathname.endsWith('index.html') || 
      url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => cached || caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // B) RECURSOS ESTÁTICOS, TRABAJADORES, IMÁGENES Y TIPOGRAFÍAS: Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        // Si existe en caché, retorna inmediatamente en <150ms mientras actualiza en background
        return cachedResponse || fetchPromise;
      });
    })
  );
});
