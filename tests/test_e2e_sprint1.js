/**
 * DIAMAX PRO — SPRINT 1 E2E INTEGRATION TEST
 * ==========================================
 * Full 9-Inning Game Simulation combining:
 *  - Sprint 1A: Event Core & Validator
 *  - Sprint 1B: Game Projector & Lineup State
 *  - Sprint 1C: Dual-Mode Undo Engine
 *  - Sprint 1D: Stat Engine, Run Accounting & Reconciliation Gate
 */

const {
  EventValidator,
  EventStore
} = require('../core/diamax_event_core.js');

const {
  createInitialGameState,
  projectGameState
} = require('../core/diamax_game_projector.js');

const {
  projectGameStateWithReverts
} = require('../core/diamax_projector_revert.js');

const {
  UndoEngine
} = require('../core/diamax_undo_engine.js');

const {
  formatIP,
  formatDecimal,
  calculateRunAccounting,
  recalculateStatsFromEvents,
  reconcileGameStats
} = require('../core/diamax_stat_engine.js');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testId, description) {
  totalTests++;
  if (condition) {
    console.log(`✅ [${testId}] PASS: ${description}`);
    passedTests++;
  } else {
    console.error(`❌ [${testId}] FAIL: ${description}`);
    throw new Error(`[${testId}] Failed: ${description}`);
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('⚾ DIAMAX PRO — SPRINT 1 E2E: SIMULACIÓN COMPLETA 9 INNINGS');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Setup Teams and Initial State
const gameId = 'game-e2e-001';
const tenantId = 'tenant-florida-001';

const awayPitcher1 = 'v-pit-1'; // Cole, G.
const awayPitcher2 = 'v-pit-2'; // Diaz, E. (Reliever)
const homePitcher1 = 'h-pit-1'; // Yamamoto, Y.
const homePitcher2 = 'h-pit-2'; // Treinen, B. (Reliever)

const store = new EventStore();
const undoEngine = new UndoEngine(store);

let globalSeq = 0;

function createPlayEvent(config = {}) {
  globalSeq++;
  const ev = {
    id: `ev-e2e-${globalSeq}`,
    gameId,
    clientEventId: `client-e2e-${globalSeq}`,
    orderingStatus: 'CANONICAL',
    clientTimestamp: Date.now() + globalSeq * 1000,
    tenantId,
    seq: globalSeq,
    inning: config.inning || 1,
    half: config.half || 'TOP',
    outsBefore: config.outsBefore !== undefined ? config.outsBefore : 0,
    countBefore: config.countBefore || { balls: 0, strikes: 0 },
    basesBefore: config.basesBefore || { b1: null, b2: null, b3: null },
    batterId: config.batterId || 'away-1',
    pitcherId: config.pitcherId || homePitcher1,
    eventType: config.eventType || 'PLATE_APPEARANCE',
    result: {
      code: config.code || '1B',
      description: config.description || 'Jugada de prueba',
      outsRecorded: config.outsRecorded !== undefined ? config.outsRecorded : 0,
      runsScored: config.runsScored || [],
      rbi: config.rbi !== undefined ? config.rbi : 0,
      errors: config.errors || []
    },
    fielderIds: config.fielderIds || [],
    basesAfter: config.basesAfter || { b1: null, b2: null, b3: null },
    outsAfter: config.outsAfter !== undefined ? config.outsAfter : 0,
    countAfter: { balls: 0, strikes: 0 },
    isHalfInningEnd: config.isHalfInningEnd || false
  };

  // Validar con EventValidator
  EventValidator.validate(ev, store);
  store.append(ev);
  return ev;
}

// -------------------------------------------------------------
// 9-INNING PLAY-BY-PLAY STREAM
// -------------------------------------------------------------

// --- INNING 1 ---
// TOP 1 (Away batting vs Yamamoto)
// 1. Altuve: 1B
createPlayEvent({ inning: 1, half: 'TOP', outsBefore: 0, outsAfter: 0, batterId: 'away-1', pitcherId: homePitcher1, code: '1B', basesBefore: { b1: null, b2: null, b3: null }, basesAfter: { b1: 'away-1', b2: null, b3: null } });
// 2. Soto: BB
createPlayEvent({ inning: 1, half: 'TOP', outsBefore: 0, outsAfter: 0, batterId: 'away-2', pitcherId: homePitcher1, code: 'BB', basesBefore: { b1: 'away-1', b2: null, b3: null }, basesAfter: { b1: 'away-2', b2: 'away-1', b3: null } });
// 3. Judge: HR (3-Run Home Run) -> Altuve, Soto, Judge score
createPlayEvent({ inning: 1, half: 'TOP', outsBefore: 0, outsAfter: 0, batterId: 'away-3', pitcherId: homePitcher1, code: 'HR', rbi: 3, runsScored: ['away-1', 'away-2', 'away-3'], basesBefore: { b1: 'away-2', b2: 'away-1', b3: null }, basesAfter: { b1: null, b2: null, b3: null } });
// 4. Acuna: K (1 out)
createPlayEvent({ inning: 1, half: 'TOP', outsBefore: 0, outsAfter: 1, batterId: 'away-4', pitcherId: homePitcher1, code: 'K_SWINGING', outsRecorded: 1 });
// 5. Guerrero: 6-3 Groundout (2 outs)
createPlayEvent({ inning: 1, half: 'TOP', outsBefore: 1, outsAfter: 2, batterId: 'away-5', pitcherId: homePitcher1, code: 'GO', outsRecorded: 1, fielderIds: ['home-6', 'home-3'] });
// 6. Devers: K (3 outs)
createPlayEvent({ inning: 1, half: 'TOP', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'away-6', pitcherId: homePitcher1, code: 'K_LOOKING', outsRecorded: 1 });

// BOT 1 (Home batting vs Cole)
// 1. Betts: 2B
createPlayEvent({ inning: 1, half: 'BOTTOM', outsBefore: 0, outsAfter: 0, batterId: 'home-1', pitcherId: awayPitcher1, code: '2B', basesBefore: { b1: null, b2: null, b3: null }, basesAfter: { b1: null, b2: 'home-1', b3: null } });
// 2. Ohtani: 1B (RBI Single, Betts scores)
createPlayEvent({ inning: 1, half: 'BOTTOM', outsBefore: 0, outsAfter: 0, batterId: 'home-2', pitcherId: awayPitcher1, code: '1B', rbi: 1, runsScored: ['home-1'], basesBefore: { b1: null, b2: 'home-1', b3: null }, basesAfter: { b1: 'home-2', b2: null, b3: null } });
// 3. Freeman: 4-6-3 Ground Double Play (2 outs)
createPlayEvent({ inning: 1, half: 'BOTTOM', outsBefore: 0, outsAfter: 2, batterId: 'home-3', pitcherId: awayPitcher1, code: 'DP_GROUND', outsRecorded: 2, fielderIds: ['away-4', 'away-6', 'away-3'], basesBefore: { b1: 'home-2', b2: null, b3: null }, basesAfter: { b1: null, b2: null, b3: null } });
// 4. Hernandez: K (3 outs)
createPlayEvent({ inning: 1, half: 'BOTTOM', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'home-4', pitcherId: awayPitcher1, code: 'K_SWINGING', outsRecorded: 1 });

// --- INNING 2 ---
// TOP 2 (Away: Correa, Perez, Arraez)
createPlayEvent({ inning: 2, half: 'TOP', outsBefore: 0, outsAfter: 1, batterId: 'away-7', pitcherId: homePitcher1, code: 'GO', outsRecorded: 1, fielderIds: ['home-4', 'home-3'] });
createPlayEvent({ inning: 2, half: 'TOP', outsBefore: 1, outsAfter: 2, batterId: 'away-8', pitcherId: homePitcher1, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 2, half: 'TOP', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'away-9', pitcherId: homePitcher1, code: 'FO', outsRecorded: 1, fielderIds: ['home-8'] });

// BOT 2 (Home: Muncy, Smith, Edman)
createPlayEvent({ inning: 2, half: 'BOTTOM', outsBefore: 0, outsAfter: 1, batterId: 'home-5', pitcherId: awayPitcher1, code: 'K_LOOKING', outsRecorded: 1 });
createPlayEvent({ inning: 2, half: 'BOTTOM', outsBefore: 1, outsAfter: 2, batterId: 'home-6', pitcherId: awayPitcher1, code: 'GO', outsRecorded: 1, fielderIds: ['away-5', 'away-3'] });
createPlayEvent({ inning: 2, half: 'BOTTOM', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'home-7', pitcherId: awayPitcher1, code: 'K_SWINGING', outsRecorded: 1 });

// --- INNING 3 ---
// TOP 3 (Away: 9->1 wrap Altuve 2B, Soto SH, Judge SF)
createPlayEvent({ inning: 3, half: 'TOP', outsBefore: 0, outsAfter: 0, batterId: 'away-1', pitcherId: homePitcher1, code: '2B', basesBefore: { b1: null, b2: null, b3: null }, basesAfter: { b1: null, b2: 'away-1', b3: null } });
createPlayEvent({ inning: 3, half: 'TOP', outsBefore: 0, outsAfter: 1, batterId: 'away-2', pitcherId: homePitcher1, code: 'SAC_BUNT', outsRecorded: 1, fielderIds: ['home-5', 'home-3'], basesBefore: { b1: null, b2: 'away-1', b3: null }, basesAfter: { b1: null, b2: null, b3: 'away-1' } });
createPlayEvent({ inning: 3, half: 'TOP', outsBefore: 1, outsAfter: 2, batterId: 'away-3', pitcherId: homePitcher1, code: 'SAC_FLY', rbi: 1, runsScored: ['away-1'], outsRecorded: 1, fielderIds: ['home-8'], basesBefore: { b1: null, b2: null, b3: 'away-1' }, basesAfter: { b1: null, b2: null, b3: null } });
createPlayEvent({ inning: 3, half: 'TOP', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'away-4', pitcherId: homePitcher1, code: 'K_SWINGING', outsRecorded: 1 });

// BOT 3 (Home: Lux, Pages, Betts)
createPlayEvent({ inning: 3, half: 'BOTTOM', outsBefore: 0, outsAfter: 1, batterId: 'home-8', pitcherId: awayPitcher1, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 3, half: 'BOTTOM', outsBefore: 1, outsAfter: 2, batterId: 'home-9', pitcherId: awayPitcher1, code: 'GO', outsRecorded: 1, fielderIds: ['away-4', 'away-3'] });
createPlayEvent({ inning: 3, half: 'BOTTOM', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'home-1', pitcherId: awayPitcher1, code: 'K_LOOKING', outsRecorded: 1 });

// --- INNING 4 (Unearned Run Demonstration) ---
// TOP 4 (Away: Guerrero, Devers, Correa, Perez, Arraez)
createPlayEvent({ inning: 4, half: 'TOP', outsBefore: 0, outsAfter: 1, batterId: 'away-5', pitcherId: homePitcher1, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 4, half: 'TOP', outsBefore: 1, outsAfter: 2, batterId: 'away-6', pitcherId: homePitcher1, code: 'FO', outsRecorded: 1, fielderIds: ['home-9'] });
// 2 outs: Correa reaches on Error by 3B Muncy (ROE)
createPlayEvent({ inning: 4, half: 'TOP', outsBefore: 2, outsAfter: 2, batterId: 'away-7', pitcherId: homePitcher1, code: 'ROE', outsRecorded: 0, errors: [{ fielderId: 'home-5', errorType: 'FIELDING', baseReached: 'b1' }], basesBefore: { b1: null, b2: null, b3: null }, basesAfter: { b1: 'away-7', b2: null, b3: null } });
// Perez hits 2-Run HR -> Correa and Perez score (Both UNEARNED because reached/occurred after 2 outs + error)
createPlayEvent({ inning: 4, half: 'TOP', outsBefore: 2, outsAfter: 2, batterId: 'away-8', pitcherId: homePitcher1, code: 'HR', rbi: 2, runsScored: ['away-7', 'away-8'], basesBefore: { b1: 'away-7', b2: null, b3: null }, basesAfter: { b1: null, b2: null, b3: null } });
createPlayEvent({ inning: 4, half: 'TOP', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'away-9', pitcherId: homePitcher1, code: 'K_SWINGING', outsRecorded: 1 });

// BOT 4 (Home: Ohtani HR, Freeman, Hernandez, Muncy)
createPlayEvent({ inning: 4, half: 'BOTTOM', outsBefore: 0, outsAfter: 0, batterId: 'home-2', pitcherId: awayPitcher1, code: 'HR', rbi: 1, runsScored: ['home-2'], basesBefore: { b1: null, b2: null, b3: null }, basesAfter: { b1: null, b2: null, b3: null } });
createPlayEvent({ inning: 4, half: 'BOTTOM', outsBefore: 0, outsAfter: 1, batterId: 'home-3', pitcherId: awayPitcher1, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 4, half: 'BOTTOM', outsBefore: 1, outsAfter: 2, batterId: 'home-4', pitcherId: awayPitcher1, code: 'K_LOOKING', outsRecorded: 1 });
createPlayEvent({ inning: 4, half: 'BOTTOM', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'home-5', pitcherId: awayPitcher1, code: 'GO', outsRecorded: 1, fielderIds: ['away-3', 'away-1'] });

// --- INNING 5 ---
// TOP 5 (Away: Altuve, Soto, Judge)
createPlayEvent({ inning: 5, half: 'TOP', outsBefore: 0, outsAfter: 1, batterId: 'away-1', pitcherId: homePitcher1, code: 'GO', outsRecorded: 1, fielderIds: ['home-6', 'home-3'] });
createPlayEvent({ inning: 5, half: 'TOP', outsBefore: 1, outsAfter: 2, batterId: 'away-2', pitcherId: homePitcher1, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 5, half: 'TOP', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'away-3', pitcherId: homePitcher1, code: 'K_LOOKING', outsRecorded: 1 });

// BOT 5 (Home: Smith, Edman, Lux)
createPlayEvent({ inning: 5, half: 'BOTTOM', outsBefore: 0, outsAfter: 1, batterId: 'home-6', pitcherId: awayPitcher1, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 5, half: 'BOTTOM', outsBefore: 1, outsAfter: 2, batterId: 'home-7', pitcherId: awayPitcher1, code: 'FO', outsRecorded: 1, fielderIds: ['away-7'] });
createPlayEvent({ inning: 5, half: 'BOTTOM', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'home-8', pitcherId: awayPitcher1, code: 'K_SWINGING', outsRecorded: 1 });

// --- INNING 6 (Bullpen changes: Treinen replaces Yamamoto; Diaz replaces Cole) ---
// TOP 6 (Away vs Treinen)
createPlayEvent({ inning: 6, half: 'TOP', outsBefore: 0, outsAfter: 1, batterId: 'away-4', pitcherId: homePitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 6, half: 'TOP', outsBefore: 1, outsAfter: 2, batterId: 'away-5', pitcherId: homePitcher2, code: 'GO', outsRecorded: 1, fielderIds: ['home-5', 'home-3'] });
createPlayEvent({ inning: 6, half: 'TOP', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'away-6', pitcherId: homePitcher2, code: 'K_LOOKING', outsRecorded: 1 });

// BOT 6 (Home vs Diaz)
createPlayEvent({ inning: 6, half: 'BOTTOM', outsBefore: 0, outsAfter: 1, batterId: 'home-9', pitcherId: awayPitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 6, half: 'BOTTOM', outsBefore: 1, outsAfter: 2, batterId: 'home-1', pitcherId: awayPitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 6, half: 'BOTTOM', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'home-2', pitcherId: awayPitcher2, code: 'K_LOOKING', outsRecorded: 1 });

// --- INNING 7 ---
// TOP 7
createPlayEvent({ inning: 7, half: 'TOP', outsBefore: 0, outsAfter: 1, batterId: 'away-7', pitcherId: homePitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 7, half: 'TOP', outsBefore: 1, outsAfter: 2, batterId: 'away-8', pitcherId: homePitcher2, code: 'K_LOOKING', outsRecorded: 1 });
createPlayEvent({ inning: 7, half: 'TOP', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'away-9', pitcherId: homePitcher2, code: 'K_SWINGING', outsRecorded: 1 });

// BOT 7
createPlayEvent({ inning: 7, half: 'BOTTOM', outsBefore: 0, outsAfter: 1, batterId: 'home-3', pitcherId: awayPitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 7, half: 'BOTTOM', outsBefore: 1, outsAfter: 2, batterId: 'home-4', pitcherId: awayPitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 7, half: 'BOTTOM', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'home-5', pitcherId: awayPitcher2, code: 'K_LOOKING', outsRecorded: 1 });

// --- INNING 8 ---
// TOP 8
createPlayEvent({ inning: 8, half: 'TOP', outsBefore: 0, outsAfter: 1, batterId: 'away-1', pitcherId: homePitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 8, half: 'TOP', outsBefore: 1, outsAfter: 2, batterId: 'away-2', pitcherId: homePitcher2, code: 'K_LOOKING', outsRecorded: 1 });
createPlayEvent({ inning: 8, half: 'TOP', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'away-3', pitcherId: homePitcher2, code: 'K_SWINGING', outsRecorded: 1 });

// BOT 8
createPlayEvent({ inning: 8, half: 'BOTTOM', outsBefore: 0, outsAfter: 1, batterId: 'home-6', pitcherId: awayPitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 8, half: 'BOTTOM', outsBefore: 1, outsAfter: 2, batterId: 'home-7', pitcherId: awayPitcher2, code: 'K_LOOKING', outsRecorded: 1 });
createPlayEvent({ inning: 8, half: 'BOTTOM', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'home-8', pitcherId: awayPitcher2, code: 'K_SWINGING', outsRecorded: 1 });

// --- INNING 9 ---
// TOP 9
createPlayEvent({ inning: 9, half: 'TOP', outsBefore: 0, outsAfter: 1, batterId: 'away-4', pitcherId: homePitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 9, half: 'TOP', outsBefore: 1, outsAfter: 2, batterId: 'away-5', pitcherId: homePitcher2, code: 'GO', outsRecorded: 1, fielderIds: ['home-5', 'home-3'] });
createPlayEvent({ inning: 9, half: 'TOP', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'away-6', pitcherId: homePitcher2, code: 'K_LOOKING', outsRecorded: 1 });

// BOT 9
createPlayEvent({ inning: 9, half: 'BOTTOM', outsBefore: 0, outsAfter: 1, batterId: 'home-9', pitcherId: awayPitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 9, half: 'BOTTOM', outsBefore: 1, outsAfter: 2, batterId: 'home-1', pitcherId: awayPitcher2, code: 'K_SWINGING', outsRecorded: 1 });
createPlayEvent({ inning: 9, half: 'BOTTOM', outsBefore: 2, outsAfter: 3, isHalfInningEnd: true, batterId: 'home-2', pitcherId: awayPitcher2, code: 'K_LOOKING', outsRecorded: 1 });

console.log(`Total canonical events generated: ${store.events.length}\n`);

// -------------------------------------------------------------
// VERIFICATION OF E2E SIMULATION
// -------------------------------------------------------------

// [E2E-01] Valid events stream
assert(store.events.length === 62, 'E2E-01', 'Se generaron y validaron exactamente 62 eventos canónicos');

// [E2E-02] Run Accounting (ER vs UER)
const accounting = calculateRunAccounting(store.events);
const totalRunsScored = accounting.runAuditTrail.length;
const earnedRunsCount = accounting.runAuditTrail.filter(r => r.earnedStatus === 'EARNED').length;
const unearnedRunsCount = accounting.runAuditTrail.filter(r => r.earnedStatus === 'UNEARNED').length;

assert(totalRunsScored === 8, 'E2E-02', 'Total de carreras anotadas en el juego === 8 (Visitor 6, Home 2)');
assert(earnedRunsCount === 6, 'E2E-02b', 'Total de carreras limpias (ER) === 6');
assert(unearnedRunsCount === 2, 'E2E-02c', 'Total de carreras sucias (UER) === 2 (tras error con 2 outs en Inning 4)');

// [E2E-03] Pitching IPouts: 27 outs para cada equipo (9.0 IP)
const stats = recalculateStatsFromEvents(store.events);
const vTeamIpOuts = stats.pitching[awayPitcher1].ipOuts + stats.pitching[awayPitcher2].ipOuts;
const hTeamIpOuts = stats.pitching[homePitcher1].ipOuts + stats.pitching[homePitcher2].ipOuts;

assert(vTeamIpOuts === 27, 'E2E-03', `Pitching visitante retiró 27 outs (9.0 IP). Actual: ${vTeamIpOuts}`);
assert(hTeamIpOuts === 27, 'E2E-03b', `Pitching local retiró 27 outs (9.0 IP). Actual: ${hTeamIpOuts}`);

// [E2E-04] Pitcher individual IP & ERA
// Cole: 15 outs (5.0 IP), 2 ER, ERA 3.60
const cole = stats.pitching[awayPitcher1];
assert(cole.ipOuts === 15 && cole.ipVisual === '5.0', 'E2E-04', 'Cole lanzó 5.0 IP (15 outs)');
assert(cole.er === 2 && cole.era === '3.60', 'E2E-04b', `Cole permitió 2 ER con ERA 3.60. Actual: ${cole.era}`);

// Diaz: 12 outs (4.0 IP), 0 ER, 12 Ks, ERA 0.00
const diaz = stats.pitching[awayPitcher2];
assert(diaz.ipOuts === 12 && diaz.er === 0 && diaz.era === '0.00', 'E2E-05', 'Diaz lanzó 4.0 IP con 0 ER y ERA 0.00');
assert(diaz.k === 12, 'E2E-05b', 'Diaz ponchó a los 12 bateadores que enfrentó (12 Ks)');

// Yamamoto: 15 outs (5.0 IP), 6 R, 4 ER, 2 UER, ERA 7.20
const yama = stats.pitching[homePitcher1];
assert(yama.ipOuts === 15 && yama.r === 6 && yama.er === 4 && yama.uer === 2, 'E2E-06', 'Yamamoto permitió 6 R (4 ER y 2 UER tras error)');
assert(yama.era === '7.20', 'E2E-06b', `Yamamoto ERA === 7.20 (4*27/15). Actual: ${yama.era}`);

// Treinen: 12 outs (4.0 IP), 0 R, 0 ER, 11 Ks, ERA 0.00
const treinen = stats.pitching[homePitcher2];
assert(treinen.ipOuts === 12 && treinen.r === 0 && treinen.era === '0.00', 'E2E-07', 'Treinen lanzó 4.0 IP con 0 R y ERA 0.00');

// [E2E-08] Batting Statistics Verification
// Judge (away-3): 1 HR, 1 SF, 1 K, 1 Looking K, 4 RBI, 1 R, 1 H, 3 AB, 4 PA
const judge = stats.batting['away-3'];
assert(judge.pa === 4, 'E2E-08', `Judge PA === 4. Actual: ${judge.pa}`);
assert(judge.ab === 3, 'E2E-08b', `Judge AB === 3 (1 SF excluido). Actual: ${judge.ab}`);
assert(judge.h === 1 && judge.hr === 1, 'E2E-08c', 'Judge registró 1 H (HR)');
assert(judge.rbi === 4, 'E2E-08d', `Judge impulsó 4 carreras (3 en HR + 1 en SF). Actual: ${judge.rbi}`);
assert(judge.avgStr === '.333', 'E2E-08e', `Judge AVG === .333 (1/3). Actual: ${judge.avgStr}`);
assert(judge.obpStr === '.250', 'E2E-08f', `Judge OBP === 1/(3+0+0+1) = .250. Actual: ${judge.obpStr}`);
assert(judge.slgStr === '1.333', 'E2E-08g', `Judge SLG === 4/3 = 1.333. Actual: ${judge.slgStr}`);

// Altuve (away-1): 2 H (1B, 2B), 2 R, 4 AB, 4 PA
const altuve = stats.batting['away-1'];
assert(altuve.h === 2 && altuve.r === 2 && altuve.avgStr === '.500', 'E2E-09', 'Altuve bateó de 4-2 (.500) con 2 anotadas');

// Perez (away-8): 1 HR, 2 RBI, 1 R, 3 AB, 3 PA
const perez = stats.batting['away-8'];
assert(perez.hr === 1 && perez.rbi === 2 && perez.r === 1, 'E2E-10', 'Perez conectó 1 HR con 2 RBI');

// [E2E-11] Fielding Metrics
// Muncy (home-5): 1 Error (en ROE de Correa), 3 Asistencias
const muncy = stats.fielding['home-5'];
assert(muncy.e === 1, 'E2E-11', `Muncy cometió 1 error defensivo. Actual: ${muncy.e}`);
assert(muncy.a === 3, 'E2E-11b', `Muncy registró 3 asistencias. Actual: ${muncy.a}`);

// Double Play
assert(stats.team.away.dp === 1, 'E2E-12', 'Equipo visitante ejecutó 1 doble play defensivo (4-6-3)');

// [E2E-13] Reconciliation Gate: 5 Balances + 2 Invariants 100% OK
const state = projectGameStateWithReverts(store.events);
const recReport = reconcileGameStats(stats, state, store.events);

assert(recReport.isValid === true, 'E2E-13', 'Reconciliation Gate valida 5 Balances y 2 Invariantes al 100%');
assert(recReport.balances.runs.passed && recReport.balances.runs.playLog === 8, 'E2E-13b', 'Balance de Carreras (8) cuadrado');
assert(recReport.balances.hits.passed && recReport.balances.hits.playLog === 7, 'E2E-13c', 'Balance de Hits (7) cuadrado');
assert(recReport.balances.outs.passed && recReport.balances.outs.playLog === 54, 'E2E-13d', 'Balance de Outs (54) cuadrado');
assert(recReport.balances.errors.passed && recReport.balances.errors.playLog === 1, 'E2E-13e', 'Balance de Errores (1) cuadrado');

// [E2E-14] Mid-Game Dual-Mode Undo & Replay Consistency
// Simulamos un Undo en el último out (out 27 de Home es CANONICAL -> emite CANONICAL_REVERT)
const lastOutEvent = store.events[store.events.length - 1];
const revertAction = undoEngine.undo();
assert(revertAction.success === true && revertAction.undoMode === 'CANONICAL_REVERT', 'E2E-14', 'Canonical Revert emitido exitosamente sobre el último out');

const postRevertStats = recalculateStatsFromEvents(store.events);
const postRevertState = projectGameStateWithReverts(store.events);

assert(postRevertStats.pitching[awayPitcher2].ipOuts === 11, 'E2E-14b', 'Outs de Diaz reducidos a 11 (3.2 IP)');
assert(postRevertStats.pitching[awayPitcher2].k === 11, 'E2E-14c', 'Ponches de Diaz reducidos a 11');

// [E2E-15] Reconciliación tras Canonical Revert
const postRevertRec = reconcileGameStats(postRevertStats, postRevertState, store.events);
assert(postRevertRec.isValid === true, 'E2E-15', 'Reconciliation Gate valida balance 100% tras revertir la jugada (53 outs totales)');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`🎯 RESULTADOS DE LA SUITE SPRINT 1 E2E: ${passedTests} / ${totalTests} PASARON (0 fallos)`);
console.log('═══════════════════════════════════════════════════════════════\n');
