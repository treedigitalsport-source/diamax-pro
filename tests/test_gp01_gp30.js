/**
 * DIAMAX PRO — Automated Test Suite: GP01 - GP30 (Sprint 1B)
 * Game Projector Verification: Lineups, Batting Order, Pitching, Substitutions, Replay, Stress
 */

const {
  createInitialTeamState,
  createInitialGameState,
  projectGameState
} = require('../core/diamax_game_projector.js');

const {
  EventValidator,
  EventStore
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

function makePAEvent(overrides = {}) {
  return {
    id: 'pa-' + Math.random().toString(36).substr(2, 9),
    gameId: 'game-001',
    clientEventId: 'c-pa-' + Math.random().toString(36).substr(2, 9),
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
console.log('⚾ DIAMAX PRO — SUITE DE PRUEBAS SPRINT 1B: GP01 - GP30');
console.log('═══════════════════════════════════════════════════════════════\n');

// ── GP01: Lineup Inicial ─────────────────────────────────────────────────────
const s0 = createInitialGameState();
assert(s0.awayTeam.lineupState.slots.length === 9 && s0.homeTeam.lineupState.slots.length === 9, 'GP01', 'Lineup inicial contiene 9 slots por equipo');

// ── GP02: Primer Bateador Correcto ───────────────────────────────────────────
assert(s0.awayTeam.lineupState.currentBatterId === 'away-1' && s0.awayTeam.lineupState.currentBatterIndex === 0, 'GP02', 'Primer bateador de Visitantes es away-1 en slot 1');

// ── GP03: Avance del Orden al Bate 1 -> 2 -> 3 ──────────────────────────────
const ev1 = makePAEvent({ batterId: 'away-1' });
const ev2 = makePAEvent({ batterId: 'away-2' });
const s3 = projectGameState([ev1, ev2]);
assert(s3.awayTeam.lineupState.currentBatterIndex === 2 && s3.awayTeam.lineupState.currentBatterId === 'away-3', 'GP03', 'Tras 2 turnos el bateador activo avanza al slot 3 (away-3)');

// ── GP04: Wrap-around del Bateador 9 -> 1 ───────────────────────────────────
const nineEvents = [];
for (let i = 1; i <= 9; i++) {
  nineEvents.push(makePAEvent({ batterId: `away-${i}` }));
}
const s4 = projectGameState(nineEvents);
assert(s4.awayTeam.lineupState.currentBatterIndex === 0 && s4.awayTeam.lineupState.currentBatterId === 'away-1', 'GP04', 'Tras 9 turnos el orden al bate da la vuelta completa al slot 1 (away-1)');

// ── GP05: PA Mantiene Identidad en Lanzamientos ──────────────────────────────
const pitch1 = {
  id: 'p-1',
  gameId: 'game-001',
  clientEventId: 'cp-1',
  orderingStatus: 'PENDING',
  clientTimestamp: Date.now(),
  tenantId: 'tampa-2026',
  inning: 1,
  half: 'TOP',
  outsBefore: 0,
  countBefore: { balls: 0, strikes: 0 },
  basesBefore: { b1: null, b2: null, b3: null },
  eventType: 'PITCH',
  plateAppearanceId: 'pa-special-100',
  pitchDetails: { pitchType: '4-SEAM', isStrike: true, pitchSequenceNumber: 1 },
  basesAfter: { b1: null, b2: null, b3: null },
  outsAfter: 0,
  countAfter: { balls: 0, strikes: 1 },
  isHalfInningEnd: false
};
const s5 = projectGameState([pitch1]);
assert(s5.activePlateAppearanceId === 'pa-special-100' && s5.count.strikes === 1, 'GP05', 'Pitcheo asocia activePlateAppearanceId y actualiza conteo');

// ── GP06: Pitcher Inicial ───────────────────────────────────────────────────
assert(s0.homeTeam.pitchingState.startingPitcherId === 'home-1' && s0.homeTeam.pitchingState.activePitcherId === 'home-1', 'GP06', 'Pitcher abridor inicial es home-1');

// ── GP07: Cambio de Pitcher ─────────────────────────────────────────────────
const subPitcher1 = {
  id: 'sub-p1',
  gameId: 'game-001',
  clientEventId: 'csub-p1',
  orderingStatus: 'PENDING',
  clientTimestamp: Date.now(),
  tenantId: 'tampa-2026',
  inning: 4,
  half: 'TOP',
  outsBefore: 1,
  countBefore: { balls: 0, strikes: 0 },
  basesBefore: { b1: null, b2: null, b3: null },
  eventType: 'SUBSTITUTION',
  result: {
    code: 'SUBSTITUTION',
    description: 'Cambio de Lanzador: entra home-10',
    outsRecorded: 0,
    runsScored: [],
    rbi: 0,
    substitutionDetails: {
      teamId: 'team-home',
      subType: 'PITCHER_CHANGE',
      outPlayerId: 'home-1',
      inPlayerId: 'home-10'
    }
  },
  basesAfter: { b1: null, b2: null, b3: null },
  outsAfter: 1,
  countAfter: { balls: 0, strikes: 0 },
  isHalfInningEnd: false
};
const s7 = projectGameState([subPitcher1]);
assert(s7.homeTeam.pitchingState.activePitcherId === 'home-10' && s7.homeTeam.pitchingState.pitchingChanges.length === 1, 'GP07', 'Cambio de lanzador asigna activePitcherId a home-10 y registra cambio');

// ── GP08: Segundo Cambio de Pitcher ─────────────────────────────────────────
const subPitcher2 = {
  ...subPitcher1,
  id: 'sub-p2',
  clientEventId: 'csub-p2',
  result: {
    ...subPitcher1.result,
    substitutionDetails: {
      teamId: 'team-home',
      subType: 'PITCHER_CHANGE',
      outPlayerId: 'home-10',
      inPlayerId: 'home-11'
    }
  }
};
const s8 = projectGameState([subPitcher1, subPitcher2]);
assert(s8.homeTeam.pitchingState.activePitcherId === 'home-11' && s8.homeTeam.pitchingState.pitchingChanges.length === 2, 'GP08', 'Segundo cambio de pitcher asigna a home-11 y acumula 2 cambios');

// ── GP09: Sustitución de Bateador (Pinch Hitter) ─────────────────────────────
const subBatter = {
  id: 'sub-b1',
  gameId: 'game-001',
  clientEventId: 'csub-b1',
  orderingStatus: 'PENDING',
  clientTimestamp: Date.now(),
  tenantId: 'tampa-2026',
  inning: 5,
  half: 'TOP',
  outsBefore: 0,
  countBefore: { balls: 0, strikes: 0 },
  basesBefore: { b1: null, b2: null, b3: null },
  eventType: 'SUBSTITUTION',
  result: {
    code: 'SUBSTITUTION',
    description: 'Bateador emergente en slot 3: entra away-15',
    outsRecorded: 0,
    runsScored: [],
    rbi: 0,
    substitutionDetails: {
      teamId: 'team-away',
      subType: 'LINEUP_CHANGE',
      lineupOrder: 3,
      outPlayerId: 'away-3',
      inPlayerId: 'away-15',
      inPlayerName: 'Bateador Emergente'
    }
  },
  basesAfter: { b1: null, b2: null, b3: null },
  outsAfter: 0,
  countAfter: { balls: 0, strikes: 0 },
  isHalfInningEnd: false
};
const s9 = projectGameState([subBatter]);
assert(s9.awayTeam.lineupState.slots[2].playerId === 'away-15' && s9.awayTeam.lineupState.slots[2].isSub === true, 'GP09', 'Sustitución de bateador reemplaza away-3 por away-15 en slot 3');

// ── GP10: Sustitución Defensiva ─────────────────────────────────────────────
const subDef = {
  id: 'sub-def1',
  gameId: 'game-001',
  clientEventId: 'csub-def1',
  orderingStatus: 'PENDING',
  clientTimestamp: Date.now(),
  tenantId: 'tampa-2026',
  inning: 6,
  half: 'TOP',
  outsBefore: 0,
  countBefore: { balls: 0, strikes: 0 },
  basesBefore: { b1: null, b2: null, b3: null },
  eventType: 'SUBSTITUTION',
  result: {
    code: 'SUBSTITUTION',
    description: 'Nuevo SS: home-20',
    outsRecorded: 0,
    runsScored: [],
    rbi: 0,
    substitutionDetails: {
      teamId: 'team-home',
      subType: 'DEFENSIVE_REASSIGNMENT',
      inPlayerId: 'home-20',
      newPosition: 'SS'
    }
  },
  basesAfter: { b1: null, b2: null, b3: null },
  outsAfter: 0,
  countAfter: { balls: 0, strikes: 0 },
  isHalfInningEnd: false
};
const s10 = projectGameState([subDef]);
assert(s10.homeTeam.lineupState.defensiveAssignments['SS'] === 'home-20', 'GP10', 'Sustitución defensiva asigna posición SS a home-20');

// ── GP11: Cambio Simultáneo de Posiciones ────────────────────────────────────
const subReassign = {
  ...subDef,
  id: 'sub-def2',
  clientEventId: 'csub-def2',
  result: {
    ...subDef.result,
    substitutionDetails: {
      teamId: 'team-home',
      subType: 'DEFENSIVE_REASSIGNMENT',
      inPlayerId: 'home-4',
      newPosition: '3B'
    }
  }
};
const s11 = projectGameState([subDef, subReassign]);
assert(s11.homeTeam.lineupState.defensiveAssignments['3B'] === 'home-4', 'GP11', 'Reasignación defensiva mueve home-4 a 3B');

// ── GP12: Tercer Out -> Fin de Media Entrada ────────────────────────────────
const out3Event = makePAEvent({
  outsBefore: 2,
  result: { code: 'K_LOOKING', description: 'Ponche out 3', outsRecorded: 1, runsScored: [], rbi: 0 },
  outsAfter: 3,
  isHalfInningEnd: true
});
const s12 = projectGameState([out3Event]);
assert(s12.outs === 0 && s12.half === 'BOTTOM', 'GP12', 'Tercer out en TOP cambia a BOTTOM con outs reseteados a 0');

// ── GP13: Transición TOP -> BOTTOM ──────────────────────────────────────────
assert(s12.inning === 1 && s12.half === 'BOTTOM', 'GP13', 'Transición de TOP a BOTTOM mantiene inning 1');

// ── GP14: Transición BOTTOM -> TOP (Incr Inning) ─────────────────────────────
const out3Bot = makePAEvent({
  half: 'BOTTOM',
  outsBefore: 2,
  result: { code: 'GO', description: 'Groundout out 3', outsRecorded: 1, runsScored: [], rbi: 0 },
  outsAfter: 3,
  isHalfInningEnd: true
});
const s14 = projectGameState([out3Event, out3Bot]);
assert(s14.inning === 2 && s14.half === 'TOP' && s14.outs === 0, 'GP14', 'Fin de BOTTOM 1 avanza a TOP 2 con 0 outs');

// ── GP15: Reset de Bases en Fin de Media Entrada ────────────────────────────
const runnerOn3 = makePAEvent({
  basesBefore: { b1: null, b2: null, b3: 'away-2' },
  outsBefore: 2,
  result: { code: 'FO', description: 'Flyout out 3', outsRecorded: 1, runsScored: [], rbi: 0 },
  outsAfter: 3,
  isHalfInningEnd: true
});
const s15 = projectGameState([runnerOn3]);
assert(s15.bases.b1 === null && s15.bases.b2 === null && s15.bases.b3 === null, 'GP15', 'Fin de inning limpia todas las bases');

// ── GP16: Reset de Count en Fin de Turno ─────────────────────────────────────
const walkEvent = makePAEvent({
  countBefore: { balls: 3, strikes: 2 },
  result: { code: 'BB', description: 'Boleto', outsRecorded: 0, runsScored: [], rbi: 0 },
  countAfter: { balls: 0, strikes: 0 }
});
const s16 = projectGameState([walkEvent]);
assert(s16.count.balls === 0 && s16.count.strikes === 0, 'GP16', 'Conclusión del turno al bate resetea conteo a 0-0');

// ── GP17: Score por Inning Exacto ───────────────────────────────────────────
const runInn1 = makePAEvent({
  result: { code: 'HR', description: 'Jonrón', outsRecorded: 0, runsScored: ['away-1'], rbi: 1 }
});
const runInn2 = makePAEvent({
  inning: 2,
  half: 'TOP',
  result: { code: '2B', description: 'Doblete impulsador', outsRecorded: 0, runsScored: ['away-2'], rbi: 1 }
});
const s17 = projectGameState([runInn1, out3Event, out3Bot, runInn2]);
assert(s17.score.inningsAway[0] === 1 && s17.score.inningsAway[1] === 1 && s17.score.away === 2, 'GP17', 'Score acumula 1 carrera en inning 1 y 1 carrera en inning 2 (Total: 2)');

// ── GP18: Replay Completo Desde Cero ────────────────────────────────────────
const history = [ev1, ev2, out3Event, out3Bot];
const stateReplay = projectGameState(history);
assert(stateReplay.inning === 2 && stateReplay.half === 'TOP' && stateReplay.totalEventsProcessed === 4, 'GP18', 'Replay completo desde cero reconstruye la posición exacta del juego');

// ── GP19: Eliminación de Evento + Replay (Undo) ──────────────────────────────
const historyUndo = [ev1, ev2, runInn1]; // 1B, 1B, HR
const stateBeforeUndo = projectGameState(historyUndo);
historyUndo.pop(); // Remueve HR
const stateAfterUndo = projectGameState(historyUndo);
assert(stateBeforeUndo.score.away === 1 && stateAfterUndo.score.away === 0, 'GP19', 'Eliminar evento y re-proyectar resta la carrera del HR limpiamente');

// ── GP20: Mismo Stream Produce Exactamente Mismo GameState ──────────────────
const s20a = JSON.stringify(projectGameState(history));
const s20b = JSON.stringify(projectGameState(history));
assert(s20a === s20b, 'GP20', 'Mismo stream produce GameState idéntico bit a bit');

// ── GP21: Evento Fuera de Orden Rechazado por Validator ──────────────────────
let gp21Ok = false;
try {
  EventValidator.validate(makePAEvent({ inning: 3, half: 'TOP' }), null, createInitialGameState());
} catch(e) {
  gp21Ok = e.code === 'EVENT_CONTEXT_MISMATCH';
}
assert(gp21Ok, 'GP21', 'Evento con inning fuera de orden es rechazado con EVENT_CONTEXT_MISMATCH');

// ── GP22: Sustitución con Datos Estructurales Corruptos Rechazada ────────────
let gp22Ok = false;
try {
  EventValidator.validate({
    ...subBatter,
    result: { ...subBatter.result, rbi: -5 }
  });
} catch(e) {
  gp22Ok = e.code === 'RBI_STRUCTURAL_VALIDITY';
}
assert(gp22Ok, 'GP22', 'Sustitución con datos estructurales corruptos es rechazada');

// ── GP23: Corredor Duplicado en Bases Rechazado ──────────────────────────────
let gp23Ok = false;
try {
  EventValidator.validate(makePAEvent({ basesBefore: { b1: 'p1', b2: 'p1', b3: null } }));
} catch(e) {
  gp23Ok = e.code === 'CORRUPT_BASE_OCCUPANCY';
}
assert(gp23Ok, 'GP23', 'Dos bases ocupadas por el mismo jugador son rechazadas con CORRUPT_BASE_OCCUPANCY');

// ── GP24: Pitcher sin Identidad de Pitcheo Rechazado ────────────────────────
let gp24Ok = false;
try {
  EventValidator.validate({
    ...pitch1,
    pitchDetails: null
  });
} catch(e) {
  gp24Ok = e.code === 'MISSING_PITCH_DETAILS';
}
assert(gp24Ok, 'GP24', 'Lanzamiento sin detalles es rechazado con MISSING_PITCH_DETAILS');

// ── GP25: Batter Context Mismatch (V15) ──────────────────────────────────────
let gp25Ok = false;
try {
  const badContext = makePAEvent({ outsBefore: 2, outsAfter: 2 });
  EventValidator.validate(badContext, null, createInitialGameState());
} catch(e) {
  gp25Ok = e.code === 'EVENT_CONTEXT_MISMATCH';
}
assert(gp25Ok, 'GP25', 'Contexto con outs previos dispares es rechazado con EVENT_CONTEXT_MISMATCH (V15)');

// ── GP26: PA Asociado a PA Incorrecto Rechazado (V16) ───────────────────────
let gp26Ok = false;
try {
  const activePAState = createInitialGameState();
  activePAState.activePlateAppearanceId = 'pa-active-999';
  EventValidator.validate({
    ...pitch1,
    plateAppearanceId: 'pa-wrong-111'
  }, null, activePAState);
} catch(e) {
  gp26Ok = e.code === 'PLATE_APPEARANCE_CONTEXT_MISMATCH';
}
assert(gp26Ok, 'GP26', 'Pitcheo con PA cruzado es rechazado con PLATE_APPEARANCE_CONTEXT_MISMATCH (V16)');

// ── GP27: Sustitución Retroactiva + Replay ──────────────────────────────────
const streamWithSub = [
  makePAEvent({ batterId: 'away-1' }),
  subBatter, // away-15 entra en slot 3
  makePAEvent({ batterId: 'away-2' }),
  makePAEvent({ batterId: 'away-15' })
];
const s27 = projectGameState(streamWithSub);
assert(s27.awayTeam.lineupState.slots[2].playerId === 'away-15' && s27.awayTeam.lineupState.currentBatterIndex === 3, 'GP27', 'Sustitución en el stream proyecta correctamente el nuevo bateador en slot 3');

// ── GP28: 9 -> 1 Después de Múltiples Innings ────────────────────────────────
const multiInningEvents = [];
// Inning 1 TOP: 3 outs (away-1, away-2, away-3)
for (let i = 1; i <= 3; i++) {
  multiInningEvents.push(makePAEvent({ batterId: `away-${i}`, outsBefore: i-1, outsAfter: i, isHalfInningEnd: i === 3 }));
}
// Inning 1 BOT: 3 outs (home-1, home-2, home-3)
for (let i = 1; i <= 3; i++) {
  multiInningEvents.push(makePAEvent({ half: 'BOTTOM', batterId: `home-${i}`, outsBefore: i-1, outsAfter: i, isHalfInningEnd: i === 3 }));
}
// Inning 2 TOP: 6 bateadores (away-4 .. away-9)
for (let i = 4; i <= 9; i++) {
  multiInningEvents.push(makePAEvent({ inning: 2, batterId: `away-${i}`, outsBefore: 0, outsAfter: 0 }));
}
const s28 = projectGameState(multiInningEvents);
assert(s28.awayTeam.lineupState.currentBatterIndex === 0 && s28.awayTeam.lineupState.currentBatterId === 'away-1', 'GP28', 'Rotación 9->1 funciona fluidamente a través de múltiples innings');

// ── GP29: Pitcher Cambiado y Posteriormente Replay ──────────────────────────
const streamWithPitcher = [pitch1, subPitcher1, pitch1];
const s29 = projectGameState(streamWithPitcher);
assert(s29.homeTeam.pitchingState.activePitcherId === 'home-10' && s29.homeTeam.pitchingState.pitchingChanges.length === 1, 'GP29', 'Replay preserva el lanzador relevista y la cronología del bullpen');

// ── GP30: Stress Test (1000 Eventos -> Estado Final Determinista) ───────────
const thousandEvents = [];
for (let i = 0; i < 1000; i++) {
  thousandEvents.push(makePAEvent({
    id: `stress-${i}`,
    clientEventId: `cstress-${i}`,
    inning: Math.floor(i / 6) + 1,
    half: (Math.floor(i / 3) % 2 === 0) ? 'TOP' : 'BOTTOM',
    outsBefore: 0,
    outsAfter: 0
  }));
}
const tStart = Date.now();
const s30a = projectGameState(thousandEvents);
const s30b = projectGameState(thousandEvents);
const tElapsed = Date.now() - tStart;
assert(JSON.stringify(s30a) === JSON.stringify(s30b) && tElapsed < 100, 'GP30', `Stress test 1000 eventos completado en ${tElapsed}ms con determinismo total`);

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADOS DE LA SUITE SPRINT 1B: ${passCount} / 30 PASARON (${failCount} fallos)`);
console.log('═══════════════════════════════════════════════════════════════');
if (failCount > 0) process.exit(1);
