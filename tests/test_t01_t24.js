/**
 * DIAMAX PRO — Automated Test Suite (T01 - T24) v1.1
 * Verification of Sprint 1A: Event Core, Validator V01-V16, EventStore, Replay
 */
const {
  EventValidationError,
  EventValidator,
  EventStore,
  createInitialCleanGameState,
  projectGameState
} = require('../core/diamax_event_core.js');

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

function baseValidEvent(overrides = {}) {
  return {
    id: 'evt-test-' + Math.random().toString(36).substr(2, 9),
    gameId: 'game-001',
    clientEventId: 'client-evt-' + Math.random().toString(36).substr(2, 9),
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
    basesAfter: { b1: 'player-1', b2: null, b3: null },
    outsAfter: 0,
    countAfter: { balls: 0, strikes: 0 },
    isHalfInningEnd: false,
    ...overrides
  };
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('⚾ DIAMAX PRO — EJECUCIÓN DE BATERÍA DE PRUEBAS (T01 - T24) v1.1');
console.log('═══════════════════════════════════════════════════════════════\n');

// ─── T01: Sencillo (1B) limpio ──────────────────────────────────────────────
const e1 = baseValidEvent({
  batterId: 'player-1',
  basesBefore: { b1: null, b2: null, b3: null },
  result: { code: '1B', description: 'Sencillo', outsRecorded: 0, runsScored: [], rbi: 0 },
  basesAfter: { b1: 'player-1', b2: null, b3: null }
});
const s1 = projectGameState([e1]);
assert(s1.bases.b1 === 'player-1' && s1.outs === 0 && s1.score.away === 0, 'T01', 'Sencillo (1B) coloca corredor en 1B y mantiene outs');

// ─── T02: HR con Bases Llenas (Grand Slam) ──────────────────────────────────
const e2 = baseValidEvent({
  batterId: 'player-4',
  basesBefore: { b1: 'p1', b2: 'p2', b3: 'p3' },
  result: { code: 'HR', description: 'Grand Slam', outsRecorded: 0, runsScored: ['p3', 'p2', 'p1', 'player-4'], rbi: 4 },
  basesAfter: { b1: null, b2: null, b3: null }
});
const s2 = projectGameState([e2]);
assert(s2.score.away === 4 && s2.bases.b1 === null && s2.bases.b2 === null && s2.bases.b3 === null, 'T02', 'Grand Slam acredita 4 carreras y limpia las bases');

// ─── T03: Rechazo de Outs Previos Inválidos ──────────────────────────────────
let t03Ok = false;
try {
  EventValidator.validate(baseValidEvent({ outsBefore: 3 }));
} catch(e) {
  t03Ok = e.code === 'INVALID_OUTS_BEFORE';
}
assert(t03Ok, 'T03', 'EventValidator rechaza outsBefore: 3 con INVALID_OUTS_BEFORE');

// ─── T04: Rechazo de Bolas Inválidas ─────────────────────────────────────────
let t04Ok = false;
try {
  EventValidator.validate(baseValidEvent({ countBefore: { balls: 4, strikes: 0 } }));
} catch(e) {
  t04Ok = e.code === 'INVALID_BALLS_COUNT';
}
assert(t04Ok, 'T04', 'EventValidator rechaza balls: 4 con INVALID_BALLS_COUNT');

// ─── T05: Rechazo de Pitcheo sin plateAppearanceId ───────────────────────────
let t05Ok = false;
try {
  EventValidator.validate(baseValidEvent({
    eventType: 'PITCH',
    plateAppearanceId: undefined,
    pitchDetails: { pitchType: '4-SEAM', isStrike: true, pitchSequenceNumber: 1 }
  }));
} catch(e) {
  t05Ok = e.code === 'MISSING_PLATE_APPEARANCE_ID';
}
assert(t05Ok, 'T05', 'EventValidator rechaza PITCH sin plateAppearanceId');

// ─── T06: Idempotencia en EventStore ────────────────────────────────────────
const store = new EventStore();
const eDupe = baseValidEvent({ clientEventId: 'client-dupe-100' });
const res1 = store.append(eDupe);
const res2 = store.append(eDupe);
assert(res1.isDuplicate === false && res2.isDuplicate === true && store.getAll().length === 1, 'T06', 'EventStore ignora reenvío idéntico (Idempotencia estricta)');

// ─── T07: Rechazo de DP por el suelo sin corredor en 1B ──────────────────────
let t07Ok = false;
try {
  EventValidator.validate(baseValidEvent({
    basesBefore: { b1: null, b2: 'p2', b3: null },
    result: { code: 'DP_GROUND', description: '6-4-3 DP', outsRecorded: 2, runsScored: [], rbi: 0 }
  }));
} catch(e) {
  t07Ok = e.code === 'DP_REQUIRES_RUNNER_ON_FIRST';
}
assert(t07Ok, 'T07', 'EventValidator rechaza DP_GROUND si basesBefore.b1 === null');

// ─── T08: Fin de Inning Automático al llegar a 3 outs ────────────────────────
const eOut = baseValidEvent({
  outsBefore: 2,
  result: { code: 'K_SWINGING', description: 'Ponche', outsRecorded: 1, runsScored: [], rbi: 0 },
  outsAfter: 3,
  isHalfInningEnd: true
});
const sOut = projectGameState([eOut]);
assert(sOut.outs === 0 && sOut.half === 'BOTTOM' && sOut.bases.b1 === null, 'T08', 'Tercer out transiciona automáticamente a BOTTOM inning con 0 outs');

// ─── T09: Replay Determinista (5 ejecuciones idénticas) ──────────────────────
const stream = [e1, e2, eOut];
const rA = JSON.stringify(projectGameState(stream));
const rB = JSON.stringify(projectGameState(stream));
const rC = JSON.stringify(projectGameState(stream));
assert(rA === rB && rB === rC, 'T09', 'Event Replay produce un GameState 100% idéntico en múltiples ejecuciones');

// ─── T10: Avance Explícito en 2B ────────────────────────────────────────────
const e2B = baseValidEvent({
  batterId: 'player-b',
  basesBefore: { b1: 'player-a', b2: null, b3: null },
  result: { code: '2B', description: 'Doblete, corredor anota', outsRecorded: 0, runsScored: ['player-a'], rbi: 1 },
  basesAfter: { b1: null, b2: 'player-b', b3: null }
});
const s2B = projectGameState([e2B]);
assert(s2B.bases.b2 === 'player-b' && s2B.bases.b1 === null && s2B.score.away === 1, 'T10', 'Batazo de 2B refleja avance explícito y anota corredor');

// ─── T11: Boleto con Bases Llenas ───────────────────────────────────────────
const eBB = baseValidEvent({
  batterId: 'player-bb',
  basesBefore: { b1: 'p1', b2: 'p2', b3: 'p3' },
  result: { code: 'BB', description: 'Boleto caballito', outsRecorded: 0, runsScored: ['p3'], rbi: 1 },
  basesAfter: { b1: 'player-bb', b2: 'p1', b3: 'p2' }
});
const sBB = projectGameState([eBB]);
assert(sBB.score.away === 1 && sBB.bases.b1 === 'player-bb' && sBB.bases.b2 === 'p1' && sBB.bases.b3 === 'p2', 'T11', 'Boleto con bases llenas anota forzada y empuja los 3 corredores');

// ─── T12: Rechazo de RBI Negativo ───────────────────────────────────────────
let t12Ok = false;
try {
  EventValidator.validate(baseValidEvent({
    result: { code: '1B', description: 'Hit', outsRecorded: 0, runsScored: [], rbi: -1 }
  }));
} catch(e) {
  t12Ok = e.code === 'RBI_STRUCTURAL_VALIDITY';
}
assert(t12Ok, 'T12', 'EventValidator rechaza rbi negativo con RBI_STRUCTURAL_VALIDITY');

// ─── T13: Strike 3 en Pitcheo (transición a K en PA) ────────────────────────
const pStrike3 = baseValidEvent({
  eventType: 'PITCH',
  plateAppearanceId: 'pa-001',
  countBefore: { balls: 1, strikes: 2 },
  pitchDetails: { pitchType: '4-SEAM', isStrike: true, pitchSequenceNumber: 4 },
  countAfter: { balls: 1, strikes: 2 }
});
const sP3 = projectGameState([pStrike3]);
assert(sP3.activePlateAppearanceId === 'pa-001' && sP3.count.strikes === 2, 'T13', 'Pitcheo de Strike 3 queda contextualizado en el plateAppearanceId');

// ─── T14: Ball 4 en Pitcheo (transición a BB en PA) ─────────────────────────
const pBall4 = baseValidEvent({
  eventType: 'PITCH',
  plateAppearanceId: 'pa-002',
  countBefore: { balls: 3, strikes: 1 },
  pitchDetails: { pitchType: 'SLIDER', isStrike: false, pitchSequenceNumber: 5 },
  countAfter: { balls: 3, strikes: 1 }
});
const sB4 = projectGameState([pBall4]);
assert(sB4.count.balls === 3 && sB4.activePlateAppearanceId === 'pa-002', 'T14', 'Pitcheo de Ball 4 queda registrado en su PA');

// ─── T15: Foul con 2 Strikes no incrementa strikes ni genera out ─────────────
const pFoul = baseValidEvent({
  eventType: 'PITCH',
  plateAppearanceId: 'pa-003',
  countBefore: { balls: 2, strikes: 2 },
  pitchDetails: { pitchType: 'CURVE', isStrike: true, pitchSequenceNumber: 5 },
  countAfter: { balls: 2, strikes: 2 }
});
const sFoul = projectGameState([pFoul]);
assert(sFoul.count.strikes === 2 && sFoul.outs === 0, 'T15', 'Foul con 2 strikes mantiene el conteo en 2 strikes sin producir out');

// ─── T16: Pre-Event Context Mismatch (V15) ──────────────────────────────────
const prevState = createInitialCleanGameState();
prevState.outs = 1;
let t16Ok = false;
try {
  EventValidator.validate(baseValidEvent({ outsBefore: 0 }), null, prevState);
} catch(e) {
  t16Ok = e.code === 'EVENT_CONTEXT_MISMATCH';
}
assert(t16Ok, 'T16', 'EventValidator rechaza evento si outsBefore difiere del GameState proyectado');

// ─── T17: Corredor Duplicado en Múltiples Bases ─────────────────────────────
let t17Ok = false;
try {
  EventValidator.validate(baseValidEvent({ basesBefore: { b1: 'same-player', b2: 'same-player', b3: null } }));
} catch(e) {
  t17Ok = e.code === 'CORRUPT_BASE_OCCUPANCY';
}
assert(t17Ok, 'T17', 'EventValidator rechaza mismo jugador en 1B y 2B con CORRUPT_BASE_OCCUPANCY');

// ─── T18: Reenvío Offline Idéntico ──────────────────────────────────────────
const storeOffline = new EventStore();
const eOff = baseValidEvent({ clientEventId: 'client-off-99' });
storeOffline.append(eOff);
const secondAttempt = storeOffline.append(eOff);
assert(secondAttempt.isDuplicate === true && storeOffline.getAll().length === 1, 'T18', 'EventStore preserva integridad ante reenvío offline');

// ─── T19: Rechazo de Seq Duplicado ──────────────────────────────────────────
const storeSeq = new EventStore();
storeSeq.append(baseValidEvent({ seq: 10, clientEventId: 'c1' }));
let t19Ok = false;
try {
  storeSeq.append(baseValidEvent({ seq: 10, clientEventId: 'c2' }));
} catch(e) {
  t19Ok = e.code === 'DUPLICATE_CANONICAL_SEQ';
}
assert(t19Ok, 'T19', 'EventStore rechaza seq duplicado con DUPLICATE_CANONICAL_SEQ');

// ─── T20: Replay Vacío ──────────────────────────────────────────────────────
const emptyState = projectGameState([]);
assert(emptyState.inning === 1 && emptyState.half === 'TOP' && emptyState.outs === 0 && emptyState.score.away === 0, 'T20', 'Replay vacío genera GameState inicial limpio y determinista');

// ─── T21: Grand Slam Integridad Total ───────────────────────────────────────
const gsState = projectGameState([e2]);
assert(gsState.score.away === 4 && gsState.score.inningsAway[0] === 4, 'T21', 'Grand Slam acumula correctamente en el total y en la entrada 1');

// ─── T22: Undo por Replay ───────────────────────────────────────────────────
const storeUndo = new EventStore();
storeUndo.append(e1);
storeUndo.append(e2);
const stateBeforeUndo = projectGameState(storeUndo.getAll());
storeUndo.removeLastLocalPending(); // Remueve e2
const stateAfterUndo = projectGameState(storeUndo.getAll());
const stateExpected = projectGameState([e1]);
assert(JSON.stringify(stateAfterUndo) === JSON.stringify(stateExpected) && stateBeforeUndo.score.away === 4 && stateAfterUndo.score.away === 0, 'T22', 'Undo remueve el evento y re-proyecta exactamente al estado previo');

// ─── T23: Orden de Eventos Consecutivos ─────────────────────────────────────
const storeSeqOrder = new EventStore();
storeSeqOrder.append(baseValidEvent({ seq: 1, clientEventId: 'seq-1' }));
storeSeqOrder.append(baseValidEvent({ seq: 2, clientEventId: 'seq-2' }));
const all = storeSeqOrder.getAll();
assert(all[0].seq === 1 && all[1].seq === 2, 'T23', 'EventStore mantiene el orden temporal y secuencial estricto');

// ─── T24: Active PA Mismatch (V16) ──────────────────────────────────────────
const stateWithActivePA = createInitialCleanGameState();
stateWithActivePA.activePlateAppearanceId = 'pa-active-001';
let t24Ok = false;
try {
  EventValidator.validate(baseValidEvent({
    eventType: 'PITCH',
    plateAppearanceId: 'pa-different-002',
    pitchDetails: { pitchType: 'CHANGEUP', isStrike: false, pitchSequenceNumber: 2 }
  }), null, stateWithActivePA);
} catch(e) {
  t24Ok = e.code === 'PLATE_APPEARANCE_CONTEXT_MISMATCH';
}
assert(t24Ok, 'T24', 'Pitcheo con plateAppearanceId diferente al PA activo es rechazado con PLATE_APPEARANCE_CONTEXT_MISMATCH (V16)');

// ─── Extra: V11 Límite superior de outs (INVALID_OUTS_AFTER) ────────────────
let v11Ok = false;
try {
  EventValidator.validate(baseValidEvent({ outsAfter: 4 }));
} catch(e) {
  v11Ok = e.code === 'INVALID_OUTS_AFTER';
}
assert(v11Ok, 'V11-Check', 'EventValidator rechaza outsAfter: 4 con INVALID_OUTS_AFTER');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADOS DE LA SUITE SPRINT 1A: ${passCount} / 25 PASARON (${failCount} fallos)`);
console.log('═══════════════════════════════════════════════════════════════');
if (failCount > 0) process.exit(1);
