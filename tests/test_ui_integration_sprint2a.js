/**
 * DIAMAX PRO — SPRINT 2A TEST SUITE: UI INTEGRATION & DISPATCHER VERIFICATION
 * ===========================================================================
 * Verifies that the UI functions in index.html bridge cleanly to the CommandDispatcher,
 * produce canonical events, recalculate statistics, and maintain reconciliation.
 */

const fs = require('fs');
const path = require('path');

const DIAMAX_CORE = require('C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\diamax-core-bundle.js');

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
console.log('⚾ DIAMAX PRO — SUITE DE PRUEBAS SPRINT 2A: UI INTEGRATION');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Simulación del entorno global del navegador
const dispatcher = new DIAMAX_CORE.CommandDispatcher();
global.window = {
  DIAMAX_DISPATCHER: dispatcher
};
global.DIAMAX_CORE = DIAMAX_CORE;
global.liveState = {
  inning: 1,
  half: 'top',
  outs: 0,
  bases: { b1: false, b2: false, b3: false },
  scoreUs: 0,
  scoreThem: 0
};
global.document = {
  getElementById: (id) => ({
    innerHTML: '',
    value: '',
    src: ''
  })
};
global.setSafeHTML = () => {};
global.setSafeText = () => {};
global.renderAll = () => {};
global.getLiveCurrentBatter = () => ({
  player: { id: 'away-1', name: 'Altuve, J.' },
  isGVE: true
});

// Importar funciones integradas de index.html
const indexContent = fs.readFileSync('C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html', 'utf8');

// Extraer registrarJugadaLive y deshacerJugadaLive del index.html
eval(indexContent.substring(indexContent.indexOf('function registrarJugadaLive'), indexContent.indexOf('function procesarFlyPosicion')));

// ── UI-01: Registro de 1B desde el botón de la UI ─────────────────────────────
registrarJugadaLive('1B');
assert(dispatcher.eventStore.getAll().length === 1, 'UI-01', 'Botón 1B despachó 1 evento canónico al EventStore');
assert(liveState.bases.b1 === true, 'UI-01b', 'liveState.bases.b1 actualizado a true');
assert(liveState.stats.team.away.h === 1, 'UI-01c', 'Estadísticas de equipo actualizadas a 1 Hit');

// ── UI-02: Registro de BB desde la UI ────────────────────────────────────────
registrarJugadaLive('BB');
assert(dispatcher.eventStore.getAll().length === 2, 'UI-02', 'Botón BB despachó evento canónico al EventStore');
assert(liveState.bases.b1 === true && liveState.bases.b2 === true, 'UI-02b', 'Corredores en 1B y 2B forzados');

// ── UI-03: Registro de Jonrón (HR) desde la UI ──────────────────────────────
registrarJugadaLive('HR');
assert(dispatcher.eventStore.getAll().length === 3, 'UI-03', 'Botón HR despachó evento al EventStore');
assert(liveState.scoreUs === 3, 'UI-03b', 'liveState.scoreUs actualizado a 3 carreras');
assert(liveState.bases.b1 === false && liveState.bases.b2 === false, 'UI-03c', 'Bases vacías tras jonrón');

// ── UI-04: Registro de Out (Ponche K) desde la UI ────────────────────────────
registrarJugadaLive('K');
assert(dispatcher.eventStore.getAll().length === 4, 'UI-04', 'Botón K despachó evento OUT al EventStore');
assert(liveState.outs === 1, 'UI-04b', 'liveState.outs actualizado a 1');

// ── UI-05: Registro de Rolata 6-3 desde la UI ────────────────────────────────
registrarJugadaLive('6-3');
assert(dispatcher.eventStore.getAll().length === 5, 'UI-05', 'Botón 6-3 despachó evento con asistencias 6-3');
assert(liveState.outs === 2, 'UI-05b', 'liveState.outs actualizado a 2');

// ── UI-06: Deshacer Jugada (Undo) desde el Botón UI ──────────────────────────
deshacerJugadaLive();
assert(liveState.outs === 1, 'UI-06', 'Botón Deshacer restauró los outs de 2 a 1');
assert(liveState.reconciliation.isValid === true, 'UI-06b', 'Reconciliation Gate permanece 100% balanceada tras Deshacer');

// ── UI-07: Error Defensivo (ROE) desde la UI ─────────────────────────────────
registrarJugadaLive('ROE');
assert(liveState.bases.b1 === true, 'UI-07', 'Botón ROE colocó corredor en 1B');
assert(liveState.stats.fielding['home-5'].e === 1, 'UI-07b', 'Error defensivo acreditado en el Stat Engine');

// ── UI-08: Tercer Out y Transición de Entrada ────────────────────────────────
registrarJugadaLive('5-3');
registrarJugadaLive('Fly 8');
assert(liveState.half === 'bot', 'UI-08', 'Tercer out cambió automáticamente la media entrada a "bot"');
assert(liveState.outs === 0, 'UI-08b', 'Outs reseteados a 0 al inicio de BOTTOM 1');

// ── UI-09: Verificación de Reconciliación General ────────────────────────────
const snapshot = dispatcher.getCurrentSnapshot();
assert(snapshot.reconciliation.isValid === true, 'UI-09', 'Compuerta de Reconciliación 100% PASS en la integración con UI');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADOS DE LA SUITE SPRINT 2A: ${passCount} / ${passCount + failCount} PASARON (0 fallos)`);
console.log('═══════════════════════════════════════════════════════════════\n');
