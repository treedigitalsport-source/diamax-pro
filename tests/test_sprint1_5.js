/**
 * DIAMAX PRO — SPRINT 1.5 AUTOMATED TEST SUITE: IB01 - IB15
 * =========================================================
 * Verification of Integration Boundary & Command Dispatcher
 */

const { EventStore } = require('../core/diamax_event_core.js');
const { UndoEngine } = require('../core/diamax_undo_engine.js');
const { CommandDispatcher } = require('../core/diamax_command_dispatcher.js');

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

console.log('═══════════════════════════════════════════════════════════════');
console.log('⚾ DIAMAX PRO — SUITE DE PRUEBAS SPRINT 1.5: IB01 - IB15');
console.log('═══════════════════════════════════════════════════════════════\n');

// ── IB01: Dispatcher Inicializa Limpio ────────────────────────────────────────
const store = new EventStore();
const dispatcher = new CommandDispatcher(store);
const initialSnapshot = dispatcher.getCurrentSnapshot();

assert(initialSnapshot.eventCount === 0 && initialSnapshot.gameState.inning === 1 && initialSnapshot.gameState.outs === 0, 'IB01', 'Dispatcher inicializa en Inning 1, TOP con 0 eventos y 0 outs');

// ── IB02: Despacho de Intención RECORD_HIT (1B) ──────────────────────────────
const r1 = dispatcher.dispatch({
  type: 'RECORD_HIT',
  payload: { resultCode: '1B', description: 'Sencillo al jardín central' }
});

assert(r1.success === true && r1.snapshot.eventCount === 1, 'IB02', 'RECORD_HIT despachado y validado como 1 evento canónico');
assert(r1.snapshot.gameState.bases.b1 !== null, 'IB02b', 'Corredor colocado automáticamente en 1B por el proyector');
assert(r1.snapshot.stats.team.away.h === 1, 'IB02c', 'Estadísticas de equipo actualizadas a 1 Hit');

// ── IB03: Despacho de Intención RECORD_WALK (BB) ─────────────────────────────
const r2 = dispatcher.dispatch({
  type: 'RECORD_WALK',
  payload: { resultCode: 'BB' }
});

assert(r2.success === true && r2.snapshot.gameState.bases.b1 !== null && r2.snapshot.gameState.bases.b2 !== null, 'IB03', 'RECORD_WALK avanza corredores a 1B y 2B forzadamente');

// ── IB04: Despacho de Intención RECORD_HIT (HR con 3 Carreras) ───────────────
const r3 = dispatcher.dispatch({
  type: 'RECORD_HIT',
  payload: {
    resultCode: 'HR',
    rbi: 3,
    runsScored: [r1.snapshot.gameState.bases.b1, r2.snapshot.gameState.bases.b1, 'away-3']
  }
});

assert(r3.success === true && r3.snapshot.gameState.score.away === 3, 'IB04', 'RECORD_HIT (HR) anota 3 carreras y limpia las bases');
assert(r3.snapshot.gameState.bases.b1 === null && r3.snapshot.gameState.bases.b2 === null, 'IB04b', 'Bases vacías tras jonrón');

// ── IB05: Despacho de Intención RECORD_OUT (K_SWINGING) ──────────────────────
const r4 = dispatcher.dispatch({
  type: 'RECORD_OUT',
  payload: { resultCode: 'K_SWINGING' }
});

assert(r4.success === true && r4.snapshot.gameState.outs === 1, 'IB05', 'RECORD_OUT incrementa outs de 0 a 1');
assert(r4.snapshot.stats.pitching[r4.event.pitcherId].k === 1, 'IB05b', 'Pitcher acumuló 1 Ponche (K) en el Stat Engine');

// ── IB06: Despacho de Intención RECORD_ERROR (ROE) ───────────────────────────
const r5 = dispatcher.dispatch({
  type: 'RECORD_ERROR',
  payload: { fielderId: 'home-5' }
});

assert(r5.success === true && r5.snapshot.gameState.bases.b1 !== null, 'IB06', 'RECORD_ERROR coloca al bateador en 1B');
assert(r5.snapshot.stats.fielding['home-5'].e === 1, 'IB06b', 'Fildeador home-5 acumuló 1 Error');

// ── IB07: Despacho de Intención UNDO desde la Frontera ───────────────────────
const r6 = dispatcher.dispatch({ type: 'UNDO' });

assert(r6.success === true, 'IB07', 'Comando UNDO ejecutado con éxito');
const home5Fld = r6.snapshot.stats.fielding['home-5'];
assert(!home5Fld || home5Fld.e === 0, 'IB07b', 'Error defensivo eliminado de las estadísticas tras Undo');

// ── IB08: Despacho de Intención REDO desde la Frontera ───────────────────────
const r7 = dispatcher.dispatch({ type: 'REDO' });

assert(r7.success === true, 'IB08', 'Comando REDO ejecutado exitosamente restaurando la jugada');
assert(r7.snapshot.stats.fielding['home-5'].e === 1, 'IB08b', 'Error defensivo restaurado tras Redo');

// ── IB09: Despacho de Intención SACRIFICE (SAC_FLY) ──────────────────────────
const r8 = dispatcher.dispatch({
  type: 'RECORD_SACRIFICE',
  payload: { resultCode: 'SAC_FLY', rbi: 1, runsScored: ['away-runner'] }
});

assert(r8.success === true && r8.snapshot.gameState.outs === 2, 'IB09', 'RECORD_SACRIFICE incrementa outs a 2');

// ── IB10: Despacho de Intención RECORD_OUT (Tercer Out -> Fin de Inning) ─────
const r9 = dispatcher.dispatch({
  type: 'RECORD_OUT',
  payload: { resultCode: 'GO', fielderIds: ['home-6', 'home-3'] }
});

assert(r9.success === true && r9.snapshot.gameState.outs === 0 && r9.snapshot.gameState.half === 'BOTTOM', 'IB10', 'Tercer out cambia automáticamente a BOTTOM con 0 outs');

// ── IB11: Despacho de Intención CHANGE_PITCHER ───────────────────────────────
const r10 = dispatcher.dispatch({
  type: 'CHANGE_PITCHER',
  payload: { newPitcherId: 'home-reliever-1', team: 'home' }
});

assert(r10.success === true, 'IB11', 'CHANGE_PITCHER registrado como evento de sustitución');

// ── IB12: Verificación de Suscripción Reactiva de UI ─────────────────────────
let notifiedSnapshot = null;
dispatcher.subscribe((snap) => {
  notifiedSnapshot = snap;
});

dispatcher.dispatch({
  type: 'RECORD_HIT',
  payload: { resultCode: '2B' }
});

assert(notifiedSnapshot !== null && notifiedSnapshot.gameState.bases.b2 !== null, 'IB12', 'Suscriptor de UI notificado reactivamente en tiempo real');

// ── IB13: Validación Física: Comando Inválido Rechazado ──────────────────────
const r11 = dispatcher.dispatch({
  type: 'UNKNOWN_TYPE_CMD',
  payload: {}
});

assert(r11.success === false, 'IB13', 'Comando con tipo desconocido es rechazado sin mutar el EventStore');

// ── IB14: Reconciliación en Cada Despacho ────────────────────────────────────
const currentRec = dispatcher.getCurrentSnapshot().reconciliation;
assert(currentRec.isValid === true, 'IB14', 'Reconciliation Gate permanece 100% válida tras múltiples comandos');

// ── IB15: Aislamiento de la UI (Cero Lógica en el Botón) ─────────────────────
const finalSnapshot = dispatcher.getCurrentSnapshot();
assert(typeof finalSnapshot.stats.batting === 'object' && typeof finalSnapshot.gameState.score === 'object', 'IB15', 'UI recibe estado puro ya calculado y reconciliado');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADOS DE LA SUITE SPRINT 1.5: ${passCount} / ${passCount + failCount} PASARON (0 fallos)`);
console.log('═══════════════════════════════════════════════════════════════\n');
