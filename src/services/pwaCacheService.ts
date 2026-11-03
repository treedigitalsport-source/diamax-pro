/**
 * 🛡️ DIAMAX PRO — PWA CACHE SERVICE v10.0
 * Manages Service Worker lifecycle, offline storage and cache health
 */

export class PwaCacheService {
  private static instance: PwaCacheService;
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleConnectionChange(true));
      window.addEventListener('offline', () => this.handleConnectionChange(false));
    }
  }

  public static getInstance(): PwaCacheService {
    if (!PwaCacheService.instance) {
      PwaCacheService.instance = new PwaCacheService();
    }
    return PwaCacheService.instance;
  }

  public async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        console.log('[DIAMAX PWA] Service Worker registrado exitosamente:', reg.scope);
        return reg;
      } catch (err) {
        console.warn('[DIAMAX PWA] Error al registrar Service Worker:', err);
        return null;
      }
    }
    return null;
  }

  public async clearStaleCaches(): Promise<void> {
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys();
      for (const k of keys) {
        if (!k.includes('diamax-dugout-pwa-v10.0')) {
          await caches.delete(k);
          console.log('[DIAMAX PWA] Caché obsoleta eliminada:', k);
        }
      }
    }
  }

  public getConnectionStatus(): boolean {
    return this.isOnline;
  }

  private handleConnectionChange(online: boolean) {
    this.isOnline = online;
    console.log(`[DIAMAX PWA] Estado de red: ${online ? 'ONLINE' : 'OFFLINE (Air-Gap Dugout Ready)'}`);
    const badge = document.getElementById('conn-status-badge');
    if (badge) {
      badge.innerText = online ? 'ONLINE' : 'OFFLINE DUGOUT';
      badge.style.color = online ? '#10B981' : '#F59E0B';
    }
  }
}
