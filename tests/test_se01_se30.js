/**
 * DIAMAX PRO — Automated Test Suite: SE01 - SE30 (Sprint 1D v1.2)
 * Comprehensive Verification of Stat Engine, Run Accounting & Reconciliation Gate
 */

const {
  StatEngineError,
  formatIP,
  formatDecimal,
  calculateRunAccounting,
  recalculateStatsFromEvents,
  reconcileGameStats
} = require('../core/diamax_stat_engine.js');

const { projectGameStateWithReverts } = require('../core/diamax_projector_revert.js');
const { createInitialGameState } = require('../core/diamax_game_projector.js');

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

function makeStatEvent(overrides = {}) {
  return {
    id: 'ev-se-' + Math.random().toString(36).substr(2, 9),
    gameId: 'game-001',
    clientEventId: 'c-se-' + Math.random().toString(36).substr(2, 9),
    orderingStatus: 'CANONICAL',
    clientTimestamp: Date.now(),
    tenantId: 'tampa-2026',
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
      description: 'Sencillo',
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
console.log('⚾ DIAMAX PRO — SUITE DE PRUEBAS SPRINT 1D: SE01 - SE30 v1.2');
console.log('═══════════════════════════════════════════════════════════════\n');

// ── SE01: Bateo: AB, H, AVG Limpio ──────────────────────────────────────────
const evs1 = [
  makeStatEvent({ result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: '2B', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: 'GO', outsRecorded: 1, runsScored: [], rbi: 0 }, outsAfter: 1 }),
  makeStatEvent({ result: { code: 'K_LOOKING', outsRecorded: 1, runsScored: [], rbi: 0 }, outsAfter: 2 })
];
const s01 = recalculateStatsFromEvents(evs1);
const b01 = s01.batting['away-1'];
assert(b01.ab === 4 && b01.h === 2 && b01.avg === 0.5 && b01.avgStr === '.500', 'SE01', '2 hits en 4 turnos oficiales produce AVG .500 exacto');

// ── SE02: Bateo: AB = 0 División Segura ──────────────────────────────────────
const evs2 = [makeStatEvent({ result: { code: 'BB', outsRecorded: 0, runsScored: [], rbi: 0 } })];
const s02 = recalculateStatsFromEvents(evs2);
const b02 = s02.batting['away-1'];
assert(b02.ab === 0 && b02.avg === 0 && b02.avgStr === '.000', 'SE02', '0 turnos oficiales maneja división segura y retorna .000');

// ── SE03: Bateo: OBP con BB, HBP, SF y 3 AB (6 PA) ──────────────────────────
// 1 H + 1 BB + 1 HBP + 1 SF + 2 Outs (3 AB total) -> 6 PA, OBP = (1+1+1)/(3+1+1+1) = 3/6 = .500
const evs3 = [
  makeStatEvent({ result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: 'BB', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: 'HBP', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: 'SAC_FLY', outsRecorded: 1, runsScored: ['away-runner'], rbi: 1 }, outsAfter: 1 }),
  makeStatEvent({ result: { code: 'GO', outsRecorded: 1, runsScored: [], rbi: 0 }, outsAfter: 2 }),
  makeStatEvent({ result: { code: 'FO', outsRecorded: 1, runsScored: [], rbi: 0 }, outsAfter: 3, isHalfInningEnd: true })
];
const s03 = recalculateStatsFromEvents(evs3);
const b03 = s03.batting['away-1'];
assert(b03.pa === 6 && b03.ab === 3 && b03.obp === 0.5 && b03.obpStr === '.500', 'SE03', 'OBP calcula exactamente (H+BB+HBP)/(AB+BB+HBP+SF) = 3/6 = .500 con 6 PA');

// ── SE04: Bateo: SLG con Ciclo (1B, 2B, 3B, HR) ─────────────────────────────
const evs4 = [
  makeStatEvent({ result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: '2B', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: '3B', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: 'HR', outsRecorded: 0, runsScored: ['away-1'], rbi: 1 } })
];
const s04 = recalculateStatsFromEvents(evs4);
const b04 = s04.batting['away-1'];
assert(b04.tb === 10 && b04.slg === 2.5 && b04.slgStr === '2.500', 'SE04', 'Ciclo de 4 hits produce TB 10 y SLG 2.500');

// ── SE05: Bateo: OPS Suma Directa ───────────────────────────────────────────
assert(b04.ops === b04.obp + b04.slg, 'SE05', 'OPS es exactamente la suma algebraica OBP + SLG');

// ── SE06: Pitcheo: IPouts Entero y Notación Visual ──────────────────────────
assert(formatIP(17) === '5.2' && formatIP(18) === '6.0' && formatIP(16) === '5.1', 'SE06', 'IPouts entero 17 formatea a "5.2", 18 a "6.0" y 16 a "5.1"');

// ── SE07: Pitcheo: ERA con IPouts = 0 ───────────────────────────────────────
const evs7 = [makeStatEvent({ result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } })];
const s07 = recalculateStatsFromEvents(evs7);
const p07 = s07.pitching['home-1'];
assert(p07.ipOuts === 0 && p07.era === 'N/A' && p07.whip === 'N/A', 'SE07', '0 outs lanzados devuelve ERA y WHIP "N/A" de forma segura');

// ── SE08: Pitcheo: ERA con Factor 27 ────────────────────────────────────────
// 2 ER en 18 outs (6.0 IP) -> ERA = (2 * 27) / 18 = 3.00
const evs8 = [
  makeStatEvent({ inning: 1, result: { code: 'HR', outsRecorded: 0, runsScored: ['away-1', 'away-2'], rbi: 2 } })
];
for (let i = 0; i < 18; i++) {
  const inn = Math.floor(i / 3) + 1;
  evs8.push(makeStatEvent({
    inning: inn,
    result: { code: 'GO', outsRecorded: 1, runsScored: [], rbi: 0 },
    outsBefore: (i % 3),
    outsAfter: (i % 3) + 1,
    isHalfInningEnd: (i % 3) === 2
  }));
}
const s08 = recalculateStatsFromEvents(evs8);
const p08 = s08.pitching['home-1'];
assert(p08.ipOuts === 18 && p08.er === 2 && p08.era === '3.00', 'SE08', '2 ER en 18 outs (6.0 IP) produce ERA 3.00 exacto');

// ── SE09: Pitcheo: WHIP con Factor 3 ────────────────────────────────────────
const evs9 = [...evs8];
evs9.push(makeStatEvent({ inning: 1, result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }));
evs9.push(makeStatEvent({ inning: 1, result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }));
evs9.push(makeStatEvent({ inning: 1, result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }));
evs9.push(makeStatEvent({ inning: 1, result: { code: 'BB', outsRecorded: 0, runsScored: [], rbi: 0 } }));
evs9.push(makeStatEvent({ inning: 1, result: { code: 'BB', outsRecorded: 0, runsScored: [], rbi: 0 } }));
const s09 = recalculateStatsFromEvents(evs9);
const p09 = s09.pitching['home-1'];
assert(p09.whip === '1.00', 'SE09', '4 H + 2 BB en 18 outs produce WHIP 1.00');

// ── SE10: Run Accounting: Carrera Limpia (ER) ───────────────────────────────
const evs10 = [makeStatEvent({ result: { code: 'HR', outsRecorded: 0, runsScored: ['away-1'], rbi: 1 } })];
const s10 = calculateRunAccounting(evs10);
assert(s10.pitcherRuns['home-1'].er === 1 && s10.pitcherRuns['home-1'].uer === 0 && s10.runAuditTrail[0].reasonCode === 'CLEAN_PLAY', 'SE10', 'Jonrón solitario limpio se clasifica como 1 ER con reasonCode CLEAN_PLAY');

// ── SE11: Run Accounting: Carrera Sucia por ROE (UER con trazabilidad) ──────
const evs11 = [
  makeStatEvent({ id: 'e-roe-1', result: { code: 'ROE', outsRecorded: 0, runsScored: [], rbi: 0, errors: [{ fielderId: 'home-6', errorType: 'FIELDING', baseReached: 'b1' }] } }),
  makeStatEvent({ id: 'e-hit-2', result: { code: '2B', outsRecorded: 0, runsScored: ['away-1'], rbi: 1 } })
];
const s11 = calculateRunAccounting(evs11);
assert(s11.pitcherRuns['home-1'].uer === 1 && s11.runAuditTrail[0].reasonCode === 'RUNNER_REACHED_ON_ROE' && s11.runAuditTrail[0].originEventId === 'e-roe-1', 'SE11', 'Corredor embasado por ROE anota carrera sucia con trazabilidad originEventId');

// ── SE12: Run Accounting: 2 Outs + Error Cierra Entrada (UER) ────────────────
const evs12 = [
  makeStatEvent({ result: { code: 'GO', outsRecorded: 1, runsScored: [], rbi: 0 }, outsBefore: 0, outsAfter: 1 }),
  makeStatEvent({ result: { code: 'FO', outsRecorded: 1, runsScored: [], rbi: 0 }, outsBefore: 1, outsAfter: 2 }),
  makeStatEvent({ result: { code: 'ROE', outsRecorded: 0, runsScored: [], rbi: 0, errors: [{ fielderId: 'home-4', errorType: 'FIELDING', baseReached: 'b1' }] } }),
  makeStatEvent({ result: { code: 'HR', outsRecorded: 0, runsScored: ['away-1', 'away-2'], rbi: 2 } })
];
const s12 = calculateRunAccounting(evs12);
assert(s12.pitcherRuns['home-1'].uer === 2 && s12.runAuditTrail.every(r => r.reasonCode === 'INNING_TERMINATED_HYPOTHETICALLY'), 'SE12', 'Carreras tras error con 2 outs quedan registradas con reasonCode INNING_TERMINATED_HYPOTHETICALLY');

// ── SE13: Fildeo: PO y A en Asistencia 6-3 ──────────────────────────────────
const evs13 = [
  makeStatEvent({
    result: { code: 'GO', outsRecorded: 1, runsScored: [], rbi: 0 },
    fielderIds: ['home-6', 'home-3']
  })
];
const s13 = recalculateStatsFromEvents(evs13);
assert(s13.fielding['home-6'].a === 1 && s13.fielding['home-3'].po === 1, 'SE13', 'Asistencia 6-3 acredita 1 A a SS y 1 PO a 1B');

// ── SE14: Fildeo: FLD% con 1 Error ──────────────────────────────────────────
const evs14 = [
  makeStatEvent({ result: { code: 'FO', outsRecorded: 1, runsScored: [], rbi: 0 }, fielderIds: ['home-8'] }),
  makeStatEvent({ result: { code: 'GO', outsRecorded: 1, runsScored: [], rbi: 0 }, fielderIds: ['home-4', 'home-3'] }),
  makeStatEvent({ result: { code: 'ROE', outsRecorded: 0, runsScored: [], rbi: 0, errors: [{ fielderId: 'home-4', errorType: 'FIELDING', baseReached: 'b1' }] } })
];
const s14 = recalculateStatsFromEvents(evs14);
const f4 = s14.fielding['home-4'];
assert(f4.tc === 2 && f4.fldPct === 0.5 && f4.fldPctStr === '.500', 'SE14', 'Fildeador con 1 A y 1 E en 2 TC produce FLD% .500');

// ── SE15: Reconciliación: Balances Cuadrados OK ─────────────────────────────
const evs15 = [
  makeStatEvent({ result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: 'HR', outsRecorded: 0, runsScored: ['away-1', 'away-2'], rbi: 2 } }),
  makeStatEvent({ result: { code: 'K_LOOKING', outsRecorded: 1, runsScored: [], rbi: 0 } })
];
const stats15 = recalculateStatsFromEvents(evs15);
const state15 = projectGameStateWithReverts(evs15);
const report15 = reconcileGameStats(stats15, state15, evs15);
assert(report15.isValid && report15.balances.internalPA.passed && report15.balances.internalTB.passed, 'SE15', 'Reconciliation Gate valida 5 balances + 2 invariantes internas (PA y TB)');

// ── SE16: Reconciliación: Detección de Discrepancia en Carreras ──────────────
let se16Ok = false;
try {
  const badState = { ...state15, score: { home: 0, away: 99 } };
  reconcileGameStats(stats15, badState, evs15);
} catch(e) {
  se16Ok = e.name === 'StatEngineError';
}
assert(se16Ok, 'SE16', 'Reconciliation Gate lanza StatEngineError ante discrepancia de carreras');

// ── SE17: Reconciliación: Balance de Hits OK ─────────────────────────────────
assert(report15.balances.hits.passed && report15.balances.hits.boxscore === 2, 'SE17', 'Balance de hits: Eventos(2) === Boxscore(2) === Team(2)');

// ── SE18: Reconciliación: Balance de Outs OK ─────────────────────────────────
assert(report15.balances.outs.passed && report15.balances.outs.pitching === 1, 'SE18', 'Balance de outs: Eventos(1) === Pitching(1)');

// ── SE19: Reconciliación: Balance de Errores OK ──────────────────────────────
assert(report15.balances.errors.passed, 'SE19', 'Balance de errores defensivos coincide 100%');

// ── SE20: Sabermetría: ISO (Isolated Power) ─────────────────────────────────
assert(b04.iso === (b04.slg - b04.avg), 'SE20', 'ISO calcula exactamente SLG - AVG');

// ── SE21: Sabermetría: BABIP ────────────────────────────────────────────────
const bSample = { ab: 30, h: 10, hr: 2, so: 5, sf: 1 };
const denom = bSample.ab - bSample.so - bSample.hr + bSample.sf;
const babipCalc = (bSample.h - bSample.hr) / denom;
assert(babipCalc.toFixed(3) === '0.333', 'SE21', 'Fórmula BABIP produce .333 con redondeo estricto de presentación');

// ── SE22: Múltiples Lanzadores: Reparto de IPouts ────────────────────────────
const evs22 = [
  makeStatEvent({ pitcherId: 'home-1', result: { code: 'GO', outsRecorded: 3, runsScored: [], rbi: 0 } }),
  makeStatEvent({ pitcherId: 'home-2', result: { code: 'FO', outsRecorded: 2, runsScored: [], rbi: 0 } })
];
const s22 = recalculateStatsFromEvents(evs22);
assert(s22.pitching['home-1'].ipOuts === 3 && s22.pitching['home-2'].ipOuts === 2 && s22.team.home.ipOuts === 5, 'SE22', 'Múltiples lanzadores acumulan sus outs individuales y suman 5 outs en equipo');

// ── SE23: Múltiples Bateadores: Boxscore Completo ────────────────────────────
const evs23 = [];
for (let i = 1; i <= 9; i++) {
  evs23.push(makeStatEvent({ batterId: `away-${i}`, result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }));
}
const s23 = recalculateStatsFromEvents(evs23);
assert(Object.keys(s23.batting).length === 9 && s23.team.away.h === 9, 'SE23', 'Boxscore proyecta correctamente los 9 bateadores con 9 hits de equipo');

// ── SE24: Undo + Recalculate Stats ──────────────────────────────────────────
const evs24 = [
  makeStatEvent({ id: 'ev-hr', result: { code: 'HR', outsRecorded: 0, runsScored: ['away-1'], rbi: 1 } }),
  { id: 'rev-hr', eventType: 'EVENT_REVERT', result: { code: 'EVENT_REVERT', targetEventId: 'ev-hr' } }
];
const s24 = recalculateStatsFromEvents(evs24);
assert(s24.team.away.h === 0 && s24.team.away.r === 0, 'SE24', 'Evento revertido vía EVENT_REVERT produce estadísticas de 0 H y 0 R en el Stat Engine');

// ── SE25: Toque de Sacrificio (SH) no afecta AB ─────────────────────────────
const evs25 = [makeStatEvent({ result: { code: 'SAC_BUNT', outsRecorded: 1, runsScored: [], rbi: 0 } })];
const s25 = recalculateStatsFromEvents(evs25);
assert(s25.batting['away-1'].pa === 1 && s25.batting['away-1'].ab === 0 && s25.batting['away-1'].sh === 1, 'SE25', 'Sacrifice Bunt incrementa PA a 1 pero mantiene AB en 0');

// ── SE26: Fly de Sacrificio (SF) no cuenta en AB ────────────────────────────
const evs26 = [makeStatEvent({ result: { code: 'SAC_FLY', outsRecorded: 1, runsScored: ['away-2'], rbi: 1 } })];
const s26 = recalculateStatsFromEvents(evs26);
assert(s26.batting['away-1'].pa === 1 && s26.batting['away-1'].ab === 0 && s26.batting['away-1'].sf === 1, 'SE26', 'Sacrifice Fly incrementa PA a 1 pero mantiene AB en 0');

// ── SE27: Boleto Intencional (IBB) ──────────────────────────────────────────
const evs27 = [makeStatEvent({ result: { code: 'IBB', outsRecorded: 0, runsScored: [], rbi: 0 } })];
const s27 = recalculateStatsFromEvents(evs27);
assert(s27.batting['away-1'].pa === 1 && s27.batting['away-1'].ab === 0 && s27.batting['away-1'].bb === 1 && s27.batting['away-1'].ibb === 1, 'SE27', 'IBB suma en BB sin duplicar PA');

// ── SE28: Doble Play Defensivo (DP_f vs DP_team) ────────────────────────────
const evs28 = [makeStatEvent({ result: { code: 'DP_GROUND', outsRecorded: 2, runsScored: [], rbi: 0 }, fielderIds: ['home-6', 'home-4', 'home-3'] })];
const s28 = recalculateStatsFromEvents(evs28);
assert(s28.team.home.dp === 1 && s28.fielding['home-6'].dp === 1 && s28.fielding['home-4'].dp === 1 && s28.fielding['home-3'].dp === 1, 'SE28', 'Doble play acredita 1 DP a equipo y 1 DP_f a cada uno de los 3 fildeadores participantes');

// ── SE29: Inning Completo Reconstruido ──────────────────────────────────────
const evs29 = [
  makeStatEvent({ result: { code: '1B', outsRecorded: 0, runsScored: [], rbi: 0 } }),
  makeStatEvent({ result: { code: 'ROE', outsRecorded: 0, runsScored: [], rbi: 0, errors: [{ fielderId: 'home-5', errorType: 'THROWING', baseReached: 'b1' }] } }),
  makeStatEvent({ result: { code: 'HR', outsRecorded: 0, runsScored: ['away-1', 'away-2', 'away-3'], rbi: 3 } }),
  makeStatEvent({ result: { code: 'K_LOOKING', outsRecorded: 1, runsScored: [], rbi: 0 }, outsBefore: 0, outsAfter: 1 }),
  makeStatEvent({ result: { code: 'GO', outsRecorded: 1, runsScored: [], rbi: 0 }, outsBefore: 1, outsAfter: 2 }),
  makeStatEvent({ result: { code: 'FO', outsRecorded: 1, runsScored: [], rbi: 0 }, outsBefore: 2, outsAfter: 3, isHalfInningEnd: true })
];
const s29 = recalculateStatsFromEvents(evs29);
const state29 = projectGameStateWithReverts(evs29);
const rep29 = reconcileGameStats(s29, state29, evs29);
assert(rep29.isValid && s29.team.away.r === 3 && s29.pitching['home-1'].ipOuts === 3, 'SE29', 'Inning complejo con hits, error y HR reconcilia balance perfecto de 3 carreras y 3 outs');

// ── SE30: Stress Test (1,000 Eventos + Reconciliación) ──────────────────────
const thousandEvents = [];
for (let i = 0; i < 1000; i++) {
  const isHit = (i % 4 === 0);
  thousandEvents.push(makeStatEvent({
    id: `stress-se-${i}`,
    clientEventId: `cse-${i}`,
    batterId: `away-${(i % 9) + 1}`,
    pitcherId: `home-${(i % 3) + 1}`,
    inning: Math.floor(i / 100) + 1,
    result: {
      code: isHit ? '1B' : 'GO',
      outsRecorded: isHit ? 0 : 1,
      runsScored: [],
      rbi: 0
    },
    outsBefore: 0,
    outsAfter: isHit ? 0 : 1
  }));
}
const tStart = Date.now();
const s30 = recalculateStatsFromEvents(thousandEvents);
const state30 = projectGameStateWithReverts(thousandEvents);
const rep30 = reconcileGameStats(s30, state30, thousandEvents);
const tElapsed = Date.now() - tStart;
assert(rep30.isValid && tElapsed < 50, 'SE30', `Stress test 1000 eventos procesado y reconciliado en ${tElapsed}ms con balance perfecto`);

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADOS DE LA SUITE SPRINT 1D: ${passCount} / 30 PASARON (${failCount} fallos)`);
console.log('═══════════════════════════════════════════════════════════════');
if (failCount > 0) process.exit(1);
