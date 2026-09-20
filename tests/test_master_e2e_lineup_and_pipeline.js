const DIAMAX_CORE = require('../diamax-core-bundle.js');
const { CommandDispatcher } = DIAMAX_CORE;

console.log('---------------------------------------------------------------------------');
console.log('? DIAMAX PRO — CERTIFICACIÓN FORENSE E2E: SECUENCIA MULTI-INNING Y UI');
console.log('---------------------------------------------------------------------------\n');

// Configuración inicial del partido: Away = Rival, Home = Guerreros (+55)
const initialConfig = {
  gameId: 'game-cert-2026',
  tenantId: 'tenant-valencia-tampa',
  awayTeam: DIAMAX_CORE.createInitialGameState().awayTeam, // Rival
  homeTeam: DIAMAX_CORE.createInitialGameState().homeTeam  // Guerreros (+55)
};

const dispatcher = new CommandDispatcher(null, null, initialConfig);
let passCount = 0;
let failCount = 0;

function assert(condition, testId, description) {
  if (condition) {
    console.log(`? [${testId}] PASS: ${description}`);
    passCount++;
  } else {
    console.error(`? [${testId}] FAIL: ${description}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// FASE 1: INNING 1 TOP (RIVAL AL BATE)
// -----------------------------------------------------------------------------
console.log('? FASE 1: INNING 1 TOP (Rival al Bate vs Pitcher Guerreros)');

// Rival #1 -> Rolata OUT 6-3 (Out 1)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'GO', batterId: 'away-1', fielderIds: ['SS', '1B'], description: 'Rolata 6-3' } });
let snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.inning === 1 && snap.gameState.half === 'TOP', 'E2E-01', 'Inning 1 TOP activo');
assert(snap.gameState.outs === 1, 'E2E-02', '1 Out registrado en pizarra');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 1, 'E2E-03', 'Rival avanzó al bateador #2 (away-2)');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 0, 'E2E-04', 'Defensa Guerreros congelada en bateador #1');

// Rival #2 -> Sencillo 1B
dispatcher.dispatch({ type: 'RECORD_HIT', payload: { resultCode: '1B', batterId: 'away-2', description: 'Hit 1B al CF' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.bases.b1 === 'away-2', 'E2E-05', 'Corredor Rival en 1B');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 2, 'E2E-06', 'Rival avanzó al bateador #3 (away-3)');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 0, 'E2E-07', 'Guerreros sigue congelado en #1');

// Rival #3 -> Ponche K (Out 2)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'K_SWINGING', batterId: 'away-3', description: 'Ponche tirándole K' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.outs === 2, 'E2E-08', '2 Outs registrados');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 3, 'E2E-09', 'Rival avanzó al bateador #4 (away-4)');

// Rival #4 -> Flyout F8 (Out 3 -> CAMBIO FORMAL DE MEDIA ENTRADA)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'FO', batterId: 'away-4', fielderIds: ['CF'], description: 'Fly al CF' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.inning === 1 && snap.gameState.half === 'BOTTOM', 'E2E-10', 'Transición formal a 1 BOT tras 3 outs');
assert(snap.gameState.outs === 0, 'E2E-11', 'Outs reseteados a 0 al cambiar de media entrada');
assert(snap.gameState.bases.b1 === null && snap.gameState.bases.b2 === null && snap.gameState.bases.b3 === null, 'E2E-12', 'Bases limpias');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 4, 'E2E-13', 'Rival queda pausado esperando en #5 (away-5)');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 0, 'E2E-14', 'Guerreros abre 1 BOT en #1 (home-1) SIN CONTAMINACIÓN');

// -----------------------------------------------------------------------------
// FASE 2: INNING 1 BOT (GUERREROS AL BATE)
// -----------------------------------------------------------------------------
console.log('\n? FASE 2: INNING 1 BOT (Guerreros al Bate vs Pitcher Rival)');

// Guerreros #1 -> Sencillo 1B
dispatcher.dispatch({ type: 'RECORD_HIT', payload: { resultCode: '1B', batterId: 'home-1', description: 'Hit 1B de Guerreros #1' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.bases.b1 === 'home-1', 'E2E-15', 'Guerreros #1 en 1B');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 1, 'E2E-16', 'Guerreros avanza a #2 (home-2)');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 4, 'E2E-17', 'Rival sigue congelado en #5');

// Guerreros #2 -> Ponche K (Out 1)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'K_LOOKING', batterId: 'home-2', description: 'Ponche parado ?' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.outs === 1, 'E2E-18', '1 Out para Guerreros');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 2, 'E2E-19', 'Guerreros avanza a #3 (home-3)');

// Guerreros #3 -> Jonrón HR (+2 Carreras: anota home-1 y home-3)
dispatcher.dispatch({ type: 'RECORD_HIT', payload: { resultCode: 'HR', batterId: 'home-3', description: 'Jonrón de 2 carreras' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.score.home === 2, 'E2E-20', 'Marcador Guerreros: 2 Carreras');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 3, 'E2E-21', 'Guerreros avanza a #4 (home-4)');
assert(snap.stats.batting['home-3'].hr === 1, 'E2E-22', 'Boxscore: 1 HR para Guerreros #3');
assert(snap.stats.batting['home-3'].rbi === 2, 'E2E-23', 'Boxscore: 2 RBI para Guerreros #3');

// Guerreros #4 -> Rolata OUT 6-3 (Out 2)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'GO', batterId: 'home-4', fielderIds: ['SS', '1B'], description: 'Rolata 6-3' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.outs === 2, 'E2E-24', '2 Outs en 1 BOT');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 4, 'E2E-25', 'Guerreros avanza a #5 (home-5)');

// Guerreros #5 -> Elevado F8 OUT (Out 3 -> CAMBIO FORMAL A INN 2 TOP)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'FO', batterId: 'home-5', fielderIds: ['CF'], description: 'Fly al CF' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.inning === 2 && snap.gameState.half === 'TOP', 'E2E-26', 'Transición formal a Inn 2 TOP tras 3er Out');
assert(snap.gameState.outs === 0, 'E2E-27', 'Outs reseteados a 0 para el Inning 2');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 4, 'E2E-28', 'Rival REANUDA EXACTAMENTE en #5 (away-5)');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 5, 'E2E-29', 'Guerreros queda pausado esperando en #6 (home-6)');

// -----------------------------------------------------------------------------
// FASE 3: INNING 2 TOP (RIVAL REANUDA EN #5)
// -----------------------------------------------------------------------------
console.log('\n? FASE 3: INNING 2 TOP (Rival Reanuda en #5)');

// Rival #5 -> Doble 2B
dispatcher.dispatch({ type: 'RECORD_HIT', payload: { resultCode: '2B', batterId: 'away-5', description: 'Doblete de Rival #5' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.bases.b2 === 'away-5', 'E2E-30', 'Rival #5 en 2B');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 5, 'E2E-31', 'Rival avanzó a #6 (away-6)');

// Rival #6 -> Rolata 5-3 OUT (Out 1)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'GO', batterId: 'away-6', fielderIds: ['3B', '1B'], description: 'Rolata 5-3' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.outs === 1, 'E2E-32', '1 Out en 2 TOP');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 6, 'E2E-33', 'Rival avanzó a #7 (away-7)');

// Rival #7 -> Elevado F7 OUT (Out 2)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'FO', batterId: 'away-7', fielderIds: ['LF'], description: 'Flyout F7' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.outs === 2, 'E2E-34', '2 Outs en 2 TOP');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 7, 'E2E-35', 'Rival avanzó a #8 (away-8)');

// Rival #8 -> Ponche K (Out 3 -> CAMBIO A INN 2 BOT)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'K_SWINGING', batterId: 'away-8', description: 'Ponche K' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.inning === 2 && snap.gameState.half === 'BOTTOM', 'E2E-36', 'Transición formal a Inn 2 BOT tras 3 outs');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 8, 'E2E-37', 'Rival queda pausado esperando en #9 (away-9)');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 5, 'E2E-38', 'Guerreros REANUDA EXACTAMENTE en #6 (home-6)');

// -----------------------------------------------------------------------------
// FASE 4: INNING 2 BOT (GUERREROS REANUDA EN #6)
// -----------------------------------------------------------------------------
console.log('\n? FASE 4: INNING 2 BOT (Guerreros Reanuda en #6)');

// Guerreros #6 -> Boleto BB
dispatcher.dispatch({ type: 'RECORD_WALK', payload: { resultCode: 'BB', batterId: 'home-6', description: 'Boleto BB' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.bases.b1 === 'home-6', 'E2E-39', 'Guerreros #6 en 1B');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 6, 'E2E-40', 'Guerreros avanzó a #7 (home-7)');

// Guerreros #7 -> Sencillo 1B
dispatcher.dispatch({ type: 'RECORD_HIT', payload: { resultCode: '1B', batterId: 'home-7', description: 'Hit 1B' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.bases.b1 === 'home-7' && snap.gameState.bases.b2 === 'home-6', 'E2E-41', 'Corredores Guerreros en 1B y 2B');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 7, 'E2E-42', 'Guerreros avanzó a #8 (home-8)');

// Guerreros #8 -> Flyout F9 OUT (Out 1)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'FO', batterId: 'home-8', fielderIds: ['RF'], description: 'Flyout F9' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.outs === 1, 'E2E-43', '1 Out en 2 BOT');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 8, 'E2E-44', 'Guerreros avanzó a #9 (home-9)');

// Guerreros #9 -> Doble Play 6-4-3 DP (Outs 2 y 3 -> CAMBIO A INN 3 TOP)
dispatcher.dispatch({ type: 'RECORD_DOUBLE_PLAY', payload: { resultCode: 'DP_GROUND', batterId: 'home-9', fielderIds: ['SS', '2B', '1B'], description: 'Doble Play 6-4-3' } });
snap = dispatcher.getCurrentSnapshot();
assert(snap.gameState.inning === 3 && snap.gameState.half === 'TOP', 'E2E-45', 'Transición formal a Inn 3 TOP tras Doble Play');
assert(snap.gameState.homeTeam.lineupState.currentBatterIndex === 0, 'E2E-46', 'Guerreros completó la vuelta completa (1..9) y espera en #1 (home-1)');
assert(snap.gameState.awayTeam.lineupState.currentBatterIndex === 8, 'E2E-47', 'Rival REANUDA EXACTAMENTE en #9 (away-9)');

// -----------------------------------------------------------------------------
// FASE 5: AUDITORÍA DE LOS 4 PILARES Y RECONCILIACIÓN MATEMÁTICA
// -----------------------------------------------------------------------------
console.log('\n? FASE 5: AUDITORÍA SIMULTÁNEA DE LOS 4 PILARES');

// 1. Pilar Motor
assert(snap.gameState.score.away === 0 && snap.gameState.score.home === 2, 'PILAR-1', 'Marcador Motor: 0 Rival vs 2 Guerreros');
assert(snap.eventCount === 17, 'PILAR-2', 'Total de 17 Eventos Canónicos inmutables en el Event Store');

// 2. Pilar Boxscore
const gveBox = snap.stats.batting;
assert(gveBox['home-1'].h1 === 1 && gveBox['home-1'].r === 1, 'PILAR-3', 'Boxscore Home-1: 1 H, 1 R');
assert(gveBox['home-3'].hr === 1 && gveBox['home-3'].rbi === 2, 'PILAR-4', 'Boxscore Home-3: 1 HR, 2 RBI');
assert(gveBox['home-6'].bb === 1, 'PILAR-5', 'Boxscore Home-6: 1 BB');

// 3. Pilar Reconciliación
assert(snap.reconciliation && snap.reconciliation.isValid === true, 'PILAR-6', 'Gate de Reconciliación Matemática: BALANCED (100%)');
assert(snap.reconciliation && snap.reconciliation.errors.length === 0, 'PILAR-7', '0 Discrepancias entre Eventos, Boxscore y Scoreboard');

console.log(`\n?? RESULTADOS MASTER E2E: ${passCount} / ${passCount + failCount} ASIGNACIONES Y VALIDACIONES AL 100%\n`);

if (failCount > 0) process.exit(1);
