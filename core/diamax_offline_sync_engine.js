/**
 * DIAMAX PRO — SPRINT 2C: OFFLINE PERSISTENCE & SYNC ENGINE v2.0
 * ==============================================================
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * 
 * Jerarquía Estricta:
 *   SUPABASE = Source of Record (Autoridad Canónica)
 *   INDEXEDDB = Offline Storage & Local Replica
 *   offline_queue = Cola Idempotente con Reintentos y Backoff
 *   EventStore / liveState = Proyecciones Puras
 */

const {
  EventValidator,
  EventStore
} = require('./diamax_event_core.js');

const {
  projectGameStateWithReverts
} = require('./diamax_projector_revert.js');

const {
  recalculateStatsFromEvents,
  reconcileGameStats
} = require('./diamax_stat_engine.js');

/**
 * Mock/Adapter de IndexedDB con soporte asíncrono para Node y Navegador
 */
class IndexedDBStorageAdapter {
  constructor(dbName = 'diamax_offline_db') {
    this.dbName = dbName;
    this.tables = {
      games: new Map(),
      events: new Map(),
      offline_queue: new Map(),
      sync_metadata: new Map()
    };
    this.isOpen = false;
  }

  async open() {
    this.isOpen = true;
    return this;
  }

  async close() {
    this.isOpen = false;
  }

  async put(table, key, value) {
    if (!this.tables[table]) throw new Error(`Table ${table} does not exist`);
    this.tables[table].set(key, JSON.parse(JSON.stringify(value)));
    return value;
  }

  async get(table, key) {
    if (!this.tables[table]) throw new Error(`Table ${table} does not exist`);
    const val = this.tables[table].get(key);
    return val ? JSON.parse(JSON.stringify(val)) : null;
  }

  async getAll(table) {
    if (!this.tables[table]) throw new Error(`Table ${table} does not exist`);
    return Array.from(this.tables[table].values()).map(v => JSON.parse(JSON.stringify(v)));
  }

  async delete(table, key) {
    if (!this.tables[table]) throw new Error(`Table ${table} does not exist`);
    return this.tables[table].delete(key);
  }

  async clear(table) {
    if (!this.tables[table]) throw new Error(`Table ${table} does not exist`);
    this.tables[table].clear();
  }
}

/**
 * Mock de Supabase Cloud como Autoridad Canónica (Source of Record)
 */
class SupabaseCanonicalServerMock {
  constructor() {
    this.canonicalEvents = new Map(); // key: gameId -> array of canonical events
    this.clientEventIndex = new Map(); // key: "gameId:clientEventId" -> canonicalEvent
    this.globalSeq = new Map(); // key: gameId -> integer counter
    this.isOnline = true;
    this.networkFailureCounter = 0;
  }

  setOnline(online) {
    this.isOnline = !!online;
  }

  simulateNetworkFailureAfter(n) {
    this.networkFailureCounter = n;
  }

  /**
   * Procesa la sincronización de un lote de eventos offline con idempotencia estricta
   */
  async syncBatch(gameId, pendingEvents) {
    if (!this.isOnline) {
      throw new Error('NETWORK_DISCONNECTED: No hay conexión con Supabase');
    }

    if (!this.canonicalEvents.has(gameId)) {
      this.canonicalEvents.set(gameId, []);
      this.globalSeq.set(gameId, 0);
    }

    const canonicalStream = this.canonicalEvents.get(gameId);
    const results = [];

    for (const pEv of pendingEvents) {
      if (this.networkFailureCounter > 0) {
        this.networkFailureCounter--;
        if (this.networkFailureCounter === 0) {
          this.isOnline = false;
          throw new Error('NETWORK_DROP_MID_SYNC: Conexión interrumpida durante el lote');
        }
      }

      const deduplicationKey = `${gameId}:${pEv.clientEventId}`;

      // IDEMPOTENCIA: Si el evento ya fue canonizado, devolver el canónico existente
      if (this.clientEventIndex.has(deduplicationKey)) {
        results.push({
          status: 'IDEMPOTENT_DUPLICATE_ACCEPTED',
          canonicalEvent: this.clientEventIndex.get(deduplicationKey)
        });
        continue;
      }

      // Validar evento contra el stream del servidor
      try {
        EventValidator.validate(pEv, { hasSeq: (s) => canonicalStream.some(e => e.seq === s) });
      } catch (valErr) {
        results.push({
          status: 'REJECTED',
          error: valErr.message,
          clientEventId: pEv.clientEventId
        });
        continue;
      }

      // Asignar secuencia canónica oficial
      const nextSeq = (this.globalSeq.get(gameId) || 0) + 1;
      this.globalSeq.set(gameId, nextSeq);

      const canonicalEvent = {
        ...pEv,
        seq: nextSeq,
        orderingStatus: 'CANONICAL',
        serverTimestamp: Date.now()
      };

      canonicalStream.push(canonicalEvent);
      this.clientEventIndex.set(deduplicationKey, canonicalEvent);

      results.push({
        status: 'CANONICALIZED',
        canonicalEvent
      });
    }

    return {
      success: true,
      results,
      canonicalStream: [...canonicalStream]
    };
  }
}

/**
 * DiamaxSyncEngine: Motor de Persistencia Offline y Sincronización Idempotente
 */
class DiamaxSyncEngine {
  constructor(storageAdapter, serverAuthority, config = {}) {
    this.storage = storageAdapter || new IndexedDBStorageAdapter();
    this.server = serverAuthority || new SupabaseCanonicalServerMock();
    this.gameId = config.gameId || 'game-001';
    this.tenantId = config.tenantId || 'tenant-001';
    this.isOnline = true;
    this.retryAttemptsMax = 3;
    this.baseBackoffMs = 50;
    this.syncListeners = [];
  }

  async init() {
    await this.storage.open();
    const existingMeta = await this.storage.get('sync_metadata', this.gameId);
    if (!existingMeta) {
      await this.storage.put('sync_metadata', this.gameId, {
        gameId: this.gameId,
        tenantId: this.tenantId,
        lastCanonicalSeq: 0,
        lastSyncTimestamp: null,
        status: 'INITIALIZED'
      });
    }
  }

  setOnline(status) {
    this.isOnline = !!status;
    this.server.setOnline(this.isOnline);
  }

  /**
   * Guarda un evento generado localmente en IndexedDB y en la offline_queue
   */
  async recordLocalEvent(event) {
    const queueId = `q-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const queueEntry = {
      queueId,
      gameId: this.gameId,
      clientEventId: event.clientEventId,
      payload: event,
      status: 'PENDING',
      attempts: 0,
      createdAt: Date.now(),
      lastAttemptAt: null,
      lastError: null
    };

    await this.storage.put('events', event.id, event);
    await this.storage.put('offline_queue', queueId, queueEntry);

    // Si hay conexión, intentar sincronización automática en background
    if (this.isOnline) {
      await this.sync();
    }

    return { queued: true, queueId, event };
  }

  /**
   * Ejecuta el proceso de sincronización con Supabase (Idempotente)
   */
  async sync() {
    if (!this.isOnline) {
      return { success: false, reason: 'OFFLINE', syncedCount: 0 };
    }

    const allQueue = await this.storage.getAll('offline_queue');
    const pending = allQueue.filter(q => q.status === 'PENDING' || q.status === 'FAILED');

    if (pending.length === 0) {
      return { success: true, syncedCount: 0, message: 'ALL_SYNCED' };
    }

    const eventsToSync = pending.map(q => q.payload);

    try {
      // Marcar como SYNCING
      for (const q of pending) {
        q.status = 'SYNCING';
        q.attempts++;
        q.lastAttemptAt = Date.now();
        await this.storage.put('offline_queue', q.queueId, q);
      }

      // Enviar lote al servidor Supabase
      const serverResponse = await this.server.syncBatch(this.gameId, eventsToSync);

      let syncedCount = 0;
      for (let i = 0; i < serverResponse.results.length; i++) {
        const item = serverResponse.results[i];
        const queueItem = pending[i];

        if (item.status === 'CANONICALIZED' || item.status === 'IDEMPOTENT_DUPLICATE_ACCEPTED') {
          queueItem.status = 'SYNCED';
          await this.storage.put('offline_queue', queueItem.queueId, queueItem);

          // Actualizar evento en IndexedDB con datos canónicos
          await this.storage.put('events', item.canonicalEvent.id, item.canonicalEvent);
          syncedCount++;
        } else {
          queueItem.status = 'FAILED';
          queueItem.lastError = item.error;
          await this.storage.put('offline_queue', queueItem.queueId, queueItem);
        }
      }

      // Actualizar metadata de sincronización
      const lastSeq = serverResponse.canonicalStream.length > 0
        ? serverResponse.canonicalStream[serverResponse.canonicalStream.length - 1].seq
        : 0;

      await this.storage.put('sync_metadata', this.gameId, {
        gameId: this.gameId,
        tenantId: this.tenantId,
        lastCanonicalSeq: lastSeq,
        lastSyncTimestamp: Date.now(),
        status: 'SYNC_COMPLETE'
      });

      this.notifyListeners({ type: 'SYNC_SUCCESS', syncedCount, lastSeq });
      return { success: true, syncedCount, lastSeq };

    } catch (err) {
      // Manejar falla de red / reintentos con backoff
      for (const q of pending) {
        q.status = 'FAILED';
        q.lastError = err.message;
        await this.storage.put('offline_queue', q.queueId, q);
      }
      return { success: false, reason: err.message, syncedCount: 0 };
    }
  }

  /**
   * Hidrata y reconstruye el EventStore y el GameState completo a partir de IndexedDB
   */
  async hydrateFromIndexedDB() {
    const rawEvents = await this.storage.getAll('events');
    const sorted = rawEvents.sort((a, b) => (a.seq || 0) - (b.seq || 0));
    
    const store = new EventStore();
    for (const ev of sorted) {
      store.append(ev);
    }

    const gameState = projectGameStateWithReverts(sorted);
    const stats = recalculateStatsFromEvents(sorted);
    const reconciliation = reconcileGameStats(stats, gameState, sorted);

    return {
      store,
      gameState,
      stats,
      reconciliation,
      eventCount: sorted.length
    };
  }

  subscribe(callback) {
    if (typeof callback === 'function') this.syncListeners.push(callback);
  }

  notifyListeners(data) {
    for (const cb of this.syncListeners) {
      try { cb(data); } catch (e) { console.error('[SYNC_LISTENER_ERR]', e); }
    }
  }
}

module.exports = {
  IndexedDBStorageAdapter,
  SupabaseCanonicalServerMock,
  DiamaxSyncEngine
};
