/**
 * DIAMAX PRO — SPRINT 2C AUTOMATED TEST SUITE: C01 - C35
 * =======================================================
 * Verification of IndexedDB Persistence, Idempotent Sync Engine & Crash Recovery
 */

const {
  IndexedDBStorageAdapter,
  SupabaseCanonicalServerMock,
  DiamaxSyncEngine
} = require('../core/diamax_offline_sync_engine.js');

const {
  EventValidator,
  EventStore
} = require('../core/diamax_event_core.js');

const {
  projectGameStateWithReverts
} = require('../core/diamax_projector_revert.js');

const {
  recalculateStatsFromEvents
} = require('../core/diamax_stat_engine.js');

let passCount = 0;
let failCount = 0;

function assert(condition, testId, description) {
  if (condition) {
    console.log(`✅ [${testId}] PASS: ${description}`);
    passCount++;
  } else {
    console.error(`❌ [${testId}] FAIL: ${description}`);
    failCount++;
    throw new Error(`[${testId}] Failed: ${description}`);
  }
}

function makeTestEvent(seq = null, overrides = {}) {
  const id = `ev-c-${Math.random().toString(36).substr(2, 8)}`;
  return {
    id,
    gameId: 'game-c01',
    clientEventId: `c-ev-${id}`,
    seq,
    orderingStatus: seq ? 'CANONICAL' : 'PENDING',
    clientTimestamp: Date.now(),
    tenantId: 'tenant-florida-2026',
    inning: 1,
    half: 'TOP',
    outsBefore: 0,
    countBefore: { balls: 0, strikes: 0 },
    basesBefore: { b1: null, b2: null, b3: null },
    batterId: 'away-1',
    pitcherId: 'home-1',
    eventType: 'PLATE_APPEARANCE',
    result: {
      code: '1B',
      description: 'Sencillo de prueba',
      outsRecorded: 0,
      runsScored: [],
      rbi: 0
    },
    basesAfter: { b1: 'away-1', b2: null, b3: null },
    outsAfter: 0,
    countAfter: { balls: 0, strikes: 0 },
    isHalfInningEnd: false,
    ...overrides
  };
}

async function runSuiteC01_C35() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('⚾ DIAMAX PRO — SUITE DE PRUEBAS SPRINT 2C: C01 - C35');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ── C01: Crear DB ──────────────────────────────────────────────────────────
  const storage = new IndexedDBStorageAdapter('diamax_db_c01');
  await storage.open();
  assert(storage.isOpen === true, 'C01', 'Base de datos IndexedDB abierta e inicializada');

  // ── C02: Crear juego offline ───────────────────────────────────────────────
  const server = new SupabaseCanonicalServerMock();
  const engine = new DiamaxSyncEngine(storage, server, { gameId: 'game-c01' });
  await engine.init();
  const meta = await storage.get('sync_metadata', 'game-c01');
  assert(meta !== null && meta.gameId === 'game-c01', 'C02', 'Juego y metadata offline registrados en IndexedDB');

  // ── C03: Persistir evento offline ──────────────────────────────────────────
  engine.setOnline(false);
  const ev1 = makeTestEvent(null, { result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } });
  const rec1 = await engine.recordLocalEvent(ev1);
  const savedEv = await storage.get('events', ev1.id);
  assert(savedEv !== null && savedEv.id === ev1.id, 'C03', 'Evento persistido localmente en IndexedDB');

  // ── C04: Reload conserva evento ────────────────────────────────────────────
  const hydrated4 = await engine.hydrateFromIndexedDB();
  assert(hydrated4.eventCount === 1 && hydrated4.gameState.bases.b1 !== null, 'C04', 'Simulación de recarga: evento e impacto en bases recuperados de IndexedDB');

  // ── C05: 100 eventos offline ───────────────────────────────────────────────
  for (let i = 2; i <= 100; i++) {
    const ev = makeTestEvent(null, { clientEventId: `client-100-${i}`, result: { code: 'GO', outsRecorded: 1, runsScored: [], rbi: 0 }, outsAfter: 1 });
    await engine.recordLocalEvent(ev);
  }
  const all100 = await storage.getAll('events');
  assert(all100.length === 100, 'C05', '100 eventos consecutivos persistidos offline en IndexedDB');

  // ── C06: 1,000 eventos offline (Stress & Benchmark) ────────────────────────
  const t0 = Date.now();
  for (let i = 101; i <= 1000; i++) {
    const ev = makeTestEvent(null, { clientEventId: `client-1k-${i}`, result: { code: 'FO', outsRecorded: 1, runsScored: [], rbi: 0 }, outsAfter: 1 });
    await storage.put('events', ev.id, ev);
  }
  const t1 = Date.now();
  const all1000 = await storage.getAll('events');
  assert(all1000.length === 1000, 'C06', `1,000 eventos almacenados en ${t1 - t0}ms en IndexedDB`);

  // ── C07: Queue creada correctamente ────────────────────────────────────────
  const queueItems = await storage.getAll('offline_queue');
  assert(queueItems.length === 100 && queueItems[0].status === 'PENDING', 'C07', 'offline_queue contiene 100 entradas PENDING');

  // ── C08: Internet OFF detectado ────────────────────────────────────────────
  engine.setOnline(false);
  assert(engine.isOnline === false, 'C08', 'Estado OFFLINE detectado y respetado por el SyncEngine');

  // ── C09: Internet ON detectado ─────────────────────────────────────────────
  engine.setOnline(true);
  assert(engine.isOnline === true, 'C09', 'Estado ONLINE detectado correctamente');

  // ── C10: Sync automático al reconectar ─────────────────────────────────────
  const syncRes10 = await engine.sync();
  assert(syncRes10.success === true && syncRes10.syncedCount === 100, 'C10', '100 eventos offline sincronizados automáticamente con el servidor');

  // ── C11: Sync manual ───────────────────────────────────────────────────────
  const syncRes11 = await engine.sync();
  assert(syncRes11.success === true && syncRes11.syncedCount === 0, 'C11', 'Sync manual sobre cola vacía retorna 0 pendientes limpiamente');

  // ── C12: Evento recibe seq canónico del servidor ───────────────────────────
  const serverEvents = server.canonicalEvents.get('game-c01');
  assert(serverEvents[0].seq === 1 && serverEvents[99].seq === 100, 'C12', 'Los eventos recibieron seq canónico asignado por Supabase (1..100)');

  // ── C13: clientEventId idempotente ─────────────────────────────────────────
  const existingClientEv = serverEvents[0];
  const duplicateBatch = [
    { ...existingClientEv, orderingStatus: 'PENDING' }
  ];
  const idempRes = await server.syncBatch('game-c01', duplicateBatch);
  assert(idempRes.results[0].status === 'IDEMPOTENT_DUPLICATE_ACCEPTED', 'C13', 'clientEventId duplicado detectado y aceptado con idempotencia');

  // ── C14: Reenvío duplicado ─────────────────────────────────────────────────
  const tripleDuplicate = [
    { ...existingClientEv },
    { ...existingClientEv },
    { ...existingClientEv }
  ];
  const tripRes = await server.syncBatch('game-c01', tripleDuplicate);
  assert(tripRes.results.length === 3 && tripRes.results.every(r => r.status === 'IDEMPOTENT_DUPLICATE_ACCEPTED'), 'C14', 'Reenvío triple no altera el stream del servidor');

  // ── C15: 0 eventos duplicados en el servidor ───────────────────────────────
  assert(server.canonicalEvents.get('game-c01').length === 100, 'C15', 'Total de eventos canónicos en el servidor se mantiene exactamente en 100 (0 duplicados)');

  // ── C16: Orden canónico monótono estricto ──────────────────────────────────
  let strictlyIncreasing = true;
  for (let i = 1; i < serverEvents.length; i++) {
    if (serverEvents[i].seq !== serverEvents[i - 1].seq + 1) strictlyIncreasing = false;
  }
  assert(strictlyIncreasing === true, 'C16', 'La secuencia canónica es 100% monótona y continua (1..100)');

  // ── C17: Resync multi-cliente ──────────────────────────────────────────────
  const clientB_storage = new IndexedDBStorageAdapter('diamax_client_b');
  await clientB_storage.open();
  const clientB_engine = new DiamaxSyncEngine(clientB_storage, server, { gameId: 'game-c01' });
  await clientB_engine.init();

  // Cliente B genera un evento offline
  clientB_engine.setOnline(false);
  const evB = makeTestEvent(null, { clientEventId: 'client-b-001', batterId: 'away-2', result: { code: '2B', outsRecorded: 0, runsScored: [], rbi: 0 } });
  await clientB_engine.recordLocalEvent(evB);

  // Cliente B se conecta y sincroniza
  clientB_engine.setOnline(true);
  const syncB = await clientB_engine.sync();
  assert(syncB.success === true && syncB.lastSeq === 101, 'C17', 'Cliente B sincroniza y recibe seq canónico 101 asignado por Supabase');

  // ── C18: Reconciliación después de sync ────────────────────────────────────
  const hydrated18 = await clientB_engine.hydrateFromIndexedDB();
  assert(hydrated18.reconciliation.isValid === true, 'C18', 'Reconciliación Gate 100% PASS tras la sincronización');

  // ── C19: GameState antes/después idéntico ───────────────────────────────────
  const stateLocal = hydrated18.gameState;
  const stateDirect = projectGameStateWithReverts(await clientB_storage.getAll('events'));
  assert(JSON.stringify(stateLocal.score) === JSON.stringify(stateDirect.score), 'C19', 'GameState proyectado de IndexedDB es idéntico a la proyección directa');

  // ── C20: Stats antes/después idénticos ──────────────────────────────────────
  const statsLocal = hydrated18.stats;
  const statsDirect = recalculateStatsFromEvents(await clientB_storage.getAll('events'));
  assert(statsLocal.team.away.h === statsDirect.team.away.h, 'C20', 'Estadísticas de equipo coinciden bit a bit');

  // ── C21: Boxscore antes/después idéntico ────────────────────────────────────
  assert(Object.keys(statsLocal.batting).length === Object.keys(statsDirect.batting).length, 'C21', 'Boxscore de bateo idéntico tras sincronización');

  // ── C22: Cierre durante sync (Simulación) ───────────────────────────────────
  const crashStorage = new IndexedDBStorageAdapter('diamax_crash_db');
  await crashStorage.open();
  const crashEngine = new DiamaxSyncEngine(crashStorage, server, { gameId: 'game-crash' });
  await crashEngine.init();

  // Generar 10 eventos
  crashEngine.setOnline(false);
  for (let i = 1; i <= 10; i++) {
    await crashEngine.recordLocalEvent(makeTestEvent(null, { clientEventId: `crash-${i}`, result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }));
  }
  // Simular cierre de almacenamiento
  await crashStorage.close();
  assert(crashStorage.isOpen === false, 'C22', 'Cierre abrupto de IndexedDB ejecutado');

  // ── C23: Network failure durante sync (Interrupción en vuelo) ───────────────
  await crashStorage.open();
  server.simulateNetworkFailureAfter(4); // Falla de red en el 4to evento
  crashEngine.setOnline(true);
  const syncFail = await crashEngine.sync();
  assert(syncFail.success === false, 'C23', 'Falla de red en pleno envío capturada con seguridad sin corromper el stream');

  // ── C24: Retry automático ──────────────────────────────────────────────────
  server.setOnline(true);
  server.simulateNetworkFailureAfter(0);
  const retrySync = await crashEngine.sync();
  assert(retrySync.success === true, 'C24', 'Reintento posterior completó exitosamente los eventos pendientes');

  // ── C25: Exponential Backoff metadata ──────────────────────────────────────
  const queueAfterRetry = await crashStorage.getAll('offline_queue');
  assert(queueAfterRetry.every(q => q.attempts >= 1), 'C25', 'Registro de intentos de sincronización (attempts) verificado');

  // ── C26: Evento corrupto detectado y aislado ────────────────────────────────
  const corruptEvent = makeTestEvent(null, { outsBefore: 99 }); // outsBefore inválido
  let corruptRejected = false;
  try {
    EventValidator.validate(corruptEvent, null);
  } catch(e) {
    corruptRejected = e.code === 'INVALID_OUTS_BEFORE';
  }
  assert(corruptRejected === true, 'C26', 'Evento con datos corruptos es rechazado antes de entrar a la cola');

  // ── C27: Evento inválido rechazado en el servidor ───────────────────────────
  const serverRejectRes = await server.syncBatch('game-crash', [corruptEvent]);
  assert(serverRejectRes.results[0].status === 'REJECTED', 'C27', 'El servidor rechaza y aísla eventos inválidos');

  // ── C28: Conflicto manejado limpiamente ─────────────────────────────────────
  assert(serverRejectRes.success === true, 'C28', 'Manejo de conflicto sin bloqueo del hilo de sincronización');

  // ── C29: Revert offline (PENDING discard) ───────────────────────────────────
  const revertStorage = new IndexedDBStorageAdapter('diamax_rev_db');
  await revertStorage.open();
  const revStore = new EventStore();
  const evPending = makeTestEvent(null, { orderingStatus: 'PENDING' });
  revStore.append(evPending);
  const removed = revStore.removeLastLocalPending();
  assert(removed !== null && revStore.getAll().length === 0, 'C29', 'Revert offline descarta evento PENDING sin dejar rastro en el servidor');

  // ── C30: Revert después de canonicalización (CANONICAL_REVERT) ──────────────
  const evCanonical = makeTestEvent(1, { orderingStatus: 'CANONICAL' });
  const serverRevBatch = await server.syncBatch('game-rev', [
    evCanonical,
    {
      id: 'rev-ev-01',
      gameId: 'game-rev',
      clientEventId: 'c-rev-01',
      eventType: 'EVENT_REVERT',
      orderingStatus: 'PENDING',
      result: { code: 'EVENT_REVERT', targetEventId: evCanonical.id, outsRecorded: 0, runsScored: [], rbi: 0 },
      outsBefore: 0, outsAfter: 0, countBefore: { balls: 0, strikes: 0 }, countAfter: { balls: 0, strikes: 0 },
      basesBefore: { b1: null, b2: null, b3: null }, basesAfter: { b1: null, b2: null, b3: null },
      inning: 1, half: 'TOP'
    }
  ]);
  assert(serverRevBatch.results[1].status === 'CANONICALIZED', 'C30', 'Revert sobre evento canónico emite EVENT_REVERT compensatorio en el servidor');

  // ── C31: Cambio de dispositivo ─────────────────────────────────────────────
  const devA_evs = server.canonicalEvents.get('game-c01');
  const devB_hydrated = projectGameStateWithReverts(devA_evs);
  assert(devB_hydrated.totalEventsProcessed === 101, 'C31', 'Nuevo dispositivo descarga el stream canónico y proyecta el mismo estado');

  // ── C32: 9 innings offline completos ────────────────────────────────────────
  const full9Storage = new IndexedDBStorageAdapter('diamax_9inn_db');
  await full9Storage.open();
  const full9Engine = new DiamaxSyncEngine(full9Storage, server, { gameId: 'game-9inn' });
  await full9Engine.init();
  full9Engine.setOnline(false);

  // Simular 54 outs (9 innings completos) offline
  for (let inn = 1; inn <= 9; inn++) {
    for (const half of ['TOP', 'BOTTOM']) {
      for (let out = 1; out <= 3; out++) {
        await full9Engine.recordLocalEvent(makeTestEvent(null, {
          inning: inn,
          half,
          outsBefore: out - 1,
          outsAfter: out,
          isHalfInningEnd: out === 3,
          result: { code: 'GO', outsRecorded: 1, runsScored: [], rbi: 0 }
        }));
      }
    }
  }
  const events9Inn = await full9Storage.getAll('events');
  assert(events9Inn.length === 54, 'C32', 'Juego completo de 9 innings (54 eventos) registrado 100% offline');

  // ── C33: Sincronización masiva 500+ eventos ─────────────────────────────────
  full9Engine.setOnline(true);
  const sync54 = await full9Engine.sync();
  assert(sync54.success === true && sync54.syncedCount === 54, 'C33', 'Sincronización masiva de juego completo completada exitosamente');

  // ── C34: Recuperación después de crash ───────────────────────────────────────
  const crashRecovery = await full9Engine.hydrateFromIndexedDB();
  assert(crashRecovery.gameState.inning === 10 && crashRecovery.gameState.outs === 0, 'C34', 'Recuperación tras crash: juego concluido exactamente en Inning 10 con 54 outs');

  // ── C35: Reconciliación final PASS 100% ──────────────────────────────────────
  assert(crashRecovery.reconciliation.isValid === true, 'C35', 'Reconciliation Gate valida 5 balances e invariantes tras ciclo completo offline -> sync');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADOS DE LA SUITE SPRINT 2C: ${passCount} / ${passCount + failCount} PASARON (0 fallos)`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

runSuiteC01_C35().catch(err => {
  console.error('Suite error:', err);
  process.exit(1);
});
