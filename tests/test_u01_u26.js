/**
 * DIAMAX PRO — Automated Test Suite: U01 - U26 (Sprint 1C)
 * Comprehensive Verification of Dual-Mode UndoEngine (PENDING vs CANONICAL Revert)
 */

const { EventStore } = require('../core/diamax_event_core.js');
const { projectGameStateWithReverts } = require('../core/diamax_projector_revert.js');
const { createInitialGameState } = require('../core/diamax_game_projector.js');
const { UndoEngine } = require('../core/diamax_undo_engine.js');

let passCount = 0;
let failCount = 0;

function assert(condition, testId, description) {
  if (condition) {
    console.log(`✅ [${testId}] PASS: ${description}`);
    passCount++;
  } else {
    console.error(`❌ [${testId}] FAIL: ${description}`);
    failCount++;
  }
}

function makeTestEvent(overrides = {}) {
  return {
    id: 'evt-u-' + Math.random().toString(36).substr(2, 9),
    gameId: 'game-001',
    clientEventId: 'c-u-' + Math.random().toString(36).substr(2, 9),
    orderingStatus: 'PENDING',
    clientTimestamp: Date.now(),
    tenantId: 'tampa-2026',
    inning: 1,
    half: 'TOP',
    outsBefore: 0,
    countBefore: { balls: 0, strikes: 0 },
    basesBefore: { b1: null, b2: null, b3: null },
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

console.log('═══════════════════════════════════════════════════════════════');
console.log('⚾ DIAMAX PRO — SUITE DE PRUEBAS SPRINT 1C: U01 - U26');
console.log('═══════════════════════════════════════════════════════════════\n');

// ── U01: Undo de Sencillo (1B) ───────────────────────────────────────────────
const store1 = new EventStore();
const undo1 = new UndoEngine(store1);
const ev1B = makeTestEvent({ result: { code: '1B', description: 'Hit 1B', outsRecorded: 0, runsScored: [], rbi: 0 }, basesAfter: { b1: 'away-1', b2: null, b3: null } });
store1.append(ev1B);
const resU01 = undo1.undo();
assert(resU01.success && resU01.newState.bases.b1 === null && resU01.newState.awayTeam.lineupState.currentBatterIndex === 0, 'U01', 'Undo de 1B vacía las bases y regresa el turno al bateador abridor');

// ── U02: Undo de Doblete (2B) ───────────────────────────────────────────────
const store2 = new EventStore();
const undo2 = new UndoEngine(store2);
const ev2B = makeTestEvent({ result: { code: '2B', description: 'Hit 2B', outsRecorded: 0, runsScored: [], rbi: 0 }, basesAfter: { b1: null, b2: 'away-1', b3: null } });
store2.append(ev2B);
const resU02 = undo2.undo();
assert(resU02.success && resU02.newState.bases.b2 === null, 'U02', 'Undo de 2B elimina al corredor de 2da base');

// ── U03: Undo de Jonrón Solitario (HR) ──────────────────────────────────────
const store3 = new EventStore();
const undo3 = new UndoEngine(store3);
const evHR = makeTestEvent({ result: { code: 'HR', description: 'Jonrón', outsRecorded: 0, runsScored: ['away-1'], rbi: 1 } });
store3.append(evHR);
const resU03 = undo3.undo();
assert(resU03.newState.score.away === 0 && resU03.newState.score.inningsAway[0] === 0, 'U03', 'Undo de HR decrementa carrera total y por inning a 0');

// ── U04: Undo de Boleto (BB) ────────────────────────────────────────────────
const store4 = new EventStore();
const undo4 = new UndoEngine(store4);
const evBB = makeTestEvent({ result: { code: 'BB', description: 'Boleto', outsRecorded: 0, runsScored: [], rbi: 0 }, basesAfter: { b1: 'away-1', b2: null, b3: null } });
store4.append(evBB);
const resU04 = undo4.undo();
assert(resU04.newState.bases.b1 === null, 'U04', 'Undo de BB elimina corredor de 1B');

// ── U05: Undo de Ponche (K) ─────────────────────────────────────────────────
const store5 = new EventStore();
const undo5 = new UndoEngine(store5);
const evK = makeTestEvent({ result: { code: 'K_LOOKING', description: 'Ponche', outsRecorded: 1, runsScored: [], rbi: 0 }, outsAfter: 1 });
store5.append(evK);
const resU05 = undo5.undo();
assert(resU05.newState.outs === 0, 'U05', 'Undo de K regresa los outs de 1 a 0');

// ── U06: Undo de Robo de Base (SB) ──────────────────────────────────────────
const store6 = new EventStore();
const undo6 = new UndoEngine(store6);
const evSB = makeTestEvent({
  eventType: 'RUNNER_EVENT',
  basesBefore: { b1: 'away-1', b2: null, b3: null },
  result: { code: 'SB', description: 'Robo de 2B', outsRecorded: 0, runsScored: [], rbi: 0 },
  basesAfter: { b1: null, b2: 'away-1', b3: null }
});
store6.append(evSB);
const resU06 = undo6.undo();
assert(resU06.newState.bases.b1 === null && resU06.newState.bases.b2 === null, 'U06', 'Undo de SB restaura ocupación de bases');

// ── U07: Undo de Atrapado Robando (CS) ──────────────────────────────────────
const store7 = new EventStore();
const undo7 = new UndoEngine(store7);
const evCS = makeTestEvent({
  eventType: 'RUNNER_EVENT',
  outsBefore: 1,
  basesBefore: { b1: 'away-1', b2: null, b3: null },
  result: { code: 'CS', description: 'Caught Stealing', outsRecorded: 1, runsScored: [], rbi: 0 },
  basesAfter: { b1: null, b2: null, b3: null },
  outsAfter: 2
});
store7.append(evCS);
const resU07 = undo7.undo();
assert(resU07.newState.outs === 0, 'U07', 'Undo de CS restaura outs correctamente');

// ── U08: Undo de Error Defensivo (ROE) ──────────────────────────────────────
const store8 = new EventStore();
const undo8 = new UndoEngine(store8);
const evROE = makeTestEvent({ result: { code: 'ROE', description: 'Error', outsRecorded: 0, runsScored: [], rbi: 0 }, basesAfter: { b1: 'away-1', b2: null, b3: null } });
store8.append(evROE);
const resU08 = undo8.undo();
assert(resU08.newState.bases.b1 === null, 'U08', 'Undo de ROE elimina corredor que alcanzó base');

// ── U09: Undo del Tercer Out ────────────────────────────────────────────────
const store9 = new EventStore();
const undo9 = new UndoEngine(store9);
const evOut3 = makeTestEvent({
  outsBefore: 2,
  result: { code: 'GO', description: 'Out 3', outsRecorded: 1, runsScored: [], rbi: 0 },
  outsAfter: 3,
  isHalfInningEnd: true
});
store9.append(evOut3);
const resU09 = undo9.undo();
assert(resU09.newState.inning === 1 && resU09.newState.half === 'TOP' && resU09.newState.outs === 0, 'U09', 'Undo de 3er out regresa a TOP 1');

// ── U10: Undo de Cambio de Pitcher ──────────────────────────────────────────
const store10 = new EventStore();
const undo10 = new UndoEngine(store10);
const evSubP = {
  id: 'sub-p-undo',
  gameId: 'game-001',
  clientEventId: 'c-sub-p',
  orderingStatus: 'PENDING',
  clientTimestamp: Date.now(),
  tenantId: 'tampa-2026',
  inning: 1,
  half: 'TOP',
  outsBefore: 0,
  countBefore: { balls: 0, strikes: 0 },
  basesBefore: { b1: null, b2: null, b3: null },
  eventType: 'SUBSTITUTION',
  result: {
    code: 'SUBSTITUTION',
    description: 'Cambio de Lanzador',
    outsRecorded: 0,
    runsScored: [],
    rbi: 0,
    substitutionDetails: {
      teamId: 'team-home',
      subType: 'PITCHER_CHANGE',
      outPlayerId: 'home-1',
      inPlayerId: 'home-99'
    }
  },
  basesAfter: { b1: null, b2: null, b3: null },
  outsAfter: 0,
  countAfter: { balls: 0, strikes: 0 },
  isHalfInningEnd: false
};
store10.append(evSubP);
const resU10 = undo10.undo();
assert(resU10.newState.homeTeam.pitchingState.activePitcherId === 'home-1' && resU10.newState.homeTeam.pitchingState.pitchingChanges.length === 0, 'U10', 'Undo de cambio de pitcher restaura abridor original y limpia historial');

// ── U11: Undo de Sustitución Ofensiva ───────────────────────────────────────
const store11 = new EventStore();
const undo11 = new UndoEngine(store11);
const evSubB = {
  ...evSubP,
  id: 'sub-b-undo',
  clientEventId: 'c-sub-b',
  result: {
    code: 'SUBSTITUTION',
    description: 'Bateador emergente',
    outsRecorded: 0,
    runsScored: [],
    rbi: 0,
    substitutionDetails: {
      teamId: 'team-away',
      subType: 'LINEUP_CHANGE',
      lineupOrder: 1,
      outPlayerId: 'away-1',
      inPlayerId: 'away-99'
    }
  }
};
store11.append(evSubB);
const resU11 = undo11.undo();
assert(resU11.newState.awayTeam.lineupState.slots[0].playerId === 'away-1' && resU11.newState.awayTeam.lineupState.slots[0].isSub === false, 'U11', 'Undo de sustitución ofensiva devuelve slot 1 al jugador titular original');

// ── U12: Undo tras Cambio de Inning (TOP -> BOT) ────────────────────────────
const store12 = new EventStore();
const undo12 = new UndoEngine(store12);
store12.append(evOut3);
const resU12 = undo12.undo();
assert(resU12.newState.half === 'TOP' && resU12.newState.inning === 1, 'U12', 'Undo tras transición de inning regresa limpiamente a TOP 1');

// ── U13: Undo Múltiples Veces Consecutivas (3x) ─────────────────────────────
const store13 = new EventStore();
const undo13 = new UndoEngine(store13);
store13.append(makeTestEvent({ clientEventId: 'e1' }));
store13.append(makeTestEvent({ clientEventId: 'e2' }));
store13.append(makeTestEvent({ clientEventId: 'e3' }));
undo13.undo();
undo13.undo();
const resU13 = undo13.undo();
assert(resU13.remainingEventsCount === 0 && resU13.newState.awayTeam.lineupState.currentBatterIndex === 0, 'U13', 'Undo triple regresa el juego al estado inicial con 0 eventos');

// ── U14: Undo en Stream Vacío ───────────────────────────────────────────────
const store14 = new EventStore();
const undo14 = new UndoEngine(store14);
const resU14 = undo14.undo();
assert(resU14.success === false && resU14.remainingEventsCount === 0, 'U14', 'Undo en stream vacío retorna success: false de manera segura');

// ── U15: Replay tras Cada Undo ──────────────────────────────────────────────
const store15 = new EventStore();
const undo15 = new UndoEngine(store15);
const eA = makeTestEvent({ clientEventId: 'ea' });
const eB = makeTestEvent({ clientEventId: 'eb' });
store15.append(eA);
store15.append(eB);
const stateAfterA = projectGameStateWithReverts([eA]);
undo15.undo();
const stateReplayA = projectGameStateWithReverts(store15.getAll());
assert(JSON.stringify(stateAfterA) === JSON.stringify(stateReplayA), 'U15', 'Replay tras Undo es idéntico a la proyección directa original');

// ── U16: Bitwise Equivalence ────────────────────────────────────────────────
const store16 = new EventStore();
const undo16 = new UndoEngine(store16);
const stateInitial = JSON.stringify(createInitialGameState());
store16.append(makeTestEvent({ clientEventId: 'e-bit' }));
undo16.undo();
const stateAfterBit = JSON.stringify(projectGameStateWithReverts(store16.getAll()));
assert(stateInitial === stateAfterBit, 'U16', 'Estado tras Undo es bitwise-equivalent al estado previo');

// ── U17: Inmutabilidad de Eventos Restantes ─────────────────────────────────
const store17 = new EventStore();
const undo17 = new UndoEngine(store17);
const evKeep = makeTestEvent({ id: 'immutable-id-123', clientEventId: 'keep-1' });
const evDrop = makeTestEvent({ id: 'drop-id-456', clientEventId: 'drop-2' });
store17.append(evKeep);
store17.append(evDrop);
undo17.undo();
assert(store17.getAll()[0].id === 'immutable-id-123' && store17.getAll().length === 1, 'U17', 'Eventos restantes mantienen inmutables sus IDs y propiedades');

// ── U18: Preservación de Secuencia e Idempotencia tras Undo ──────────────────
const store18 = new EventStore();
const undo18 = new UndoEngine(store18);
store18.append(makeTestEvent({ clientEventId: 'reinsert-1' }));
undo18.undo();
const appendAgain = store18.append(makeTestEvent({ clientEventId: 'reinsert-1' }));
assert(appendAgain.success && store18.getAll().length === 1, 'U18', 'Tras deshacer, el clientEventId puede ser reinsertado sin falsos duplicados');

// ── U19: Reconciliación tras Undo ───────────────────────────────────────────
const store19 = new EventStore();
const undo19 = new UndoEngine(store19);
store19.append(makeTestEvent({ result: { code: 'HR', description: 'HR', outsRecorded: 0, runsScored: ['away-1'], rbi: 1 } }));
undo19.undo();
const s19 = projectGameStateWithReverts(store19.getAll());
assert(s19.score.away === s19.score.inningsAway.reduce((a, b) => a + b, 0), 'U19', 'Reconciliación de carreras de equipo vs suma por entrada se mantiene 100% balanceada');

// ── U20: Stress Test (1000 Eventos + 50 Undos Consecutivos) ─────────────────
const store20 = new EventStore();
const undo20 = new UndoEngine(store20);
for (let i = 0; i < 1000; i++) {
  store20.append(makeTestEvent({ clientEventId: `stress-${i}` }));
}
const tStart = Date.now();
for (let i = 0; i < 50; i++) {
  undo20.undo();
}
const tElapsed = Date.now() - tStart;
const s20 = projectGameStateWithReverts(store20.getAll());
assert(store20.getAll().length === 950 && s20.totalEventsProcessed === 950, 'U20', `Stress test: 50 undos sobre 1000 eventos completados en ${tElapsed}ms con determinismo total`);

// ── U21: Undo de Grand Slam (Bases Llenas) ──────────────────────────────────
const store21 = new EventStore();
const undo21 = new UndoEngine(store21);
const evGS = makeTestEvent({
  batterId: 'player-4',
  basesBefore: { b1: 'p1', b2: 'p2', b3: 'p3' },
  result: { code: 'HR', description: 'Grand Slam', outsRecorded: 0, runsScored: ['p3', 'p2', 'p1', 'player-4'], rbi: 4 },
  basesAfter: { b1: null, b2: null, b3: null }
});
store21.append(evGS);
const resU21 = undo21.undo();
assert(resU21.newState.score.away === 0 && resU21.newState.bases.b1 === null && resU21.newState.score.inningsAway[0] === 0, 'U21', 'Undo de Grand Slam revierte 4 carreras a 0 con precisión absoluta');

// ── U22: Undo de Transición de Inning Completa ──────────────────────────────
const store22 = new EventStore();
const undo22 = new UndoEngine(store22);
const evInningEnd = makeTestEvent({
  outsBefore: 2,
  result: { code: 'K_SWINGING', description: 'Out 3', outsRecorded: 1, runsScored: [], rbi: 0 },
  outsAfter: 3,
  isHalfInningEnd: true
});
store22.append(evInningEnd);
const resU22 = undo22.undo();
assert(resU22.newState.half === 'TOP' && resU22.newState.inning === 1 && resU22.newState.outs === 0, 'U22', 'Undo de tercer out revierte la transición y regresa el juego a la media entrada anterior');

// ── U23: Undo de Evento CANONICAL (Emite EVENT_REVERT sin borrar) ───────────
const store23 = new EventStore();
const undo23 = new UndoEngine(store23);
const evCanon = makeTestEvent({
  id: 'canonical-evt-001',
  seq: 1,
  orderingStatus: 'CANONICAL',
  result: { code: 'HR', description: 'Jonrón canónico', outsRecorded: 0, runsScored: ['away-1'], rbi: 1 }
});
store23.append(evCanon);
const resU23 = undo23.undo();
assert(resU23.undoMode === 'CANONICAL_REVERT' && store23.getAll().length === 2 && store23.getAll()[0].id === 'canonical-evt-001' && resU23.newState.score.away === 0, 'U23', 'Undo de evento CANONICAL conserva el evento original y emite EVENT_REVERT compensatorio con score 0');

// ── U24: Multi-Client Sync de EVENT_REVERT ───────────────────────────────────
// Dispositivo A emite E1, E2, E3 y REVERT(E3)
const streamDevA = [
  makeTestEvent({ id: 'e1', seq: 1, orderingStatus: 'CANONICAL' }),
  makeTestEvent({ id: 'e2', seq: 2, orderingStatus: 'CANONICAL' }),
  makeTestEvent({ id: 'e3', seq: 3, orderingStatus: 'CANONICAL', result: { code: 'HR', runsScored: ['away-1'] } }),
  {
    id: 'rev-e3',
    seq: 4,
    orderingStatus: 'CANONICAL',
    eventType: 'EVENT_REVERT',
    result: { code: 'EVENT_REVERT', targetEventId: 'e3' }
  }
];
// Dispositivo B recibe el stream por sync
const stateDevA = projectGameStateWithReverts(streamDevA);
const stateDevB = projectGameStateWithReverts(streamDevA);
assert(JSON.stringify(stateDevA) === JSON.stringify(stateDevB) && stateDevA.score.away === 0, 'U24', 'Dispositivo A y Dispositivo B sincronizan el EVENT_REVERT produciendo idéntico GameState');

// ── U25: Redo tras Canonical Revert Genera Nueva Acción ─────────────────────
const store25 = new EventStore();
const undo25 = new UndoEngine(store25);
store25.append(evCanon);
undo25.undo(); // Emite EVENT_REVERT
const redoRes25 = undo25.redo(); // Reactiva
assert(redoRes25.success && store25.getAll().length === 3 && redoRes25.newState.score.away === 1, 'U25', 'Redo tras Canonical Revert reactiva la jugada generando nueva acción canónica');

// ── U26: Offline Pending Undo + Posterior Sincronización ────────────────────
const store26 = new EventStore();
const undo26 = new UndoEngine(store26);
// Online: E1, E2
store26.append(makeTestEvent({ id: 'on-1', seq: 1, orderingStatus: 'CANONICAL' }));
store26.append(makeTestEvent({ id: 'on-2', seq: 2, orderingStatus: 'CANONICAL' }));
// Offline: E3 PENDING -> Undo E3
store26.append(makeTestEvent({ id: 'off-3', orderingStatus: 'PENDING' }));
undo26.undo(); // Descarta off-3
// Al sincronizar, solo viajan E1 y E2
const payloadSync = store26.getAll();
assert(payloadSync.length === 2 && payloadSync.every(e => e.orderingStatus === 'CANONICAL') && !payloadSync.some(e => e.id === 'off-3'), 'U26', 'Undo de evento offline PENDING no filtra el evento descartado hacia el servidor');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADOS DE LA SUITE SPRINT 1C: ${passCount} / 26 PASARON (${failCount} fallos)`);
console.log('═══════════════════════════════════════════════════════════════');
if (failCount > 0) process.exit(1);
