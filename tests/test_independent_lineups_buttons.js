const DIAMAX_CORE = require('../diamax-core-bundle.js');
const { CommandDispatcher } = DIAMAX_CORE;

console.log('---------------------------------------------------------------');
console.log('? DIAMAX PRO — TEST DE AISLAMIENTO DE ALINEACIONES (HOME vs AWAY)');
console.log('---------------------------------------------------------------\n');

const dispatcher = new CommandDispatcher();
let passCount = 0;
let totalTests = 0;

function check(cond, msg) {
  totalTests++;
  if (cond) {
    console.log(`? PASS: ${msg}`);
    passCount++;
  } else {
    console.error(`? FAIL: ${msg}`);
  }
}

// 1. Inning 1 TOP (Away Team Bats)
console.log('--- 1. INNING 1 TOP (Away Team al Bate) ---');
let snap = dispatcher.getCurrentSnapshot();
check(snap.gameState.inning === 1 && snap.gameState.half === 'TOP', 'Inicia en Inn 1 TOP');
check(snap.gameState.awayTeam.lineupState.currentBatterIndex === 0, 'Away batea #1 (away-1)');
check(snap.gameState.homeTeam.lineupState.currentBatterIndex === 0, 'Home en espera en #1 (home-1)');

// Away Batter 1: Hit 1B
dispatcher.dispatch({ type: 'RECORD_HIT', payload: { resultCode: '1B', batterId: 'away-1' } });
snap = dispatcher.getCurrentSnapshot();
check(snap.gameState.awayTeam.lineupState.currentBatterIndex === 1, 'Away avanza a #2 (away-2)');
check(snap.gameState.homeTeam.lineupState.currentBatterIndex === 0, 'Home permanece intacto en #1 (home-1)');

// Away Batter 2: Out GO 6-3
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'GO', batterId: 'away-2' } });
snap = dispatcher.getCurrentSnapshot();
check(snap.gameState.awayTeam.lineupState.currentBatterIndex === 2, 'Away avanza a #3 (away-3)');
check(snap.gameState.outs === 1, '1 Out en pizarra');
check(snap.gameState.homeTeam.lineupState.currentBatterIndex === 0, 'Home sigue en #1');

// Away Batter 3: Out K (2do out)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'K_SWINGING', batterId: 'away-3' } });
snap = dispatcher.getCurrentSnapshot();
check(snap.gameState.awayTeam.lineupState.currentBatterIndex === 3, 'Away avanza a #4 (away-4)');
check(snap.gameState.outs === 2, '2 Outs en pizarra');
check(snap.gameState.homeTeam.lineupState.currentBatterIndex === 0, 'Home sigue en #1');

// Away Batter 4: Out F8 (3er out -> Cambio de Inning)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'FO', batterId: 'away-4' } });
snap = dispatcher.getCurrentSnapshot();
check(snap.gameState.awayTeam.lineupState.currentBatterIndex === 4, 'Away queda esperando en #5 (away-5) para su próximo turno');
check(snap.gameState.outs === 0, 'Outs reseteados a 0 al cambiar de inning');
check(snap.gameState.half === 'BOTTOM', 'Transición exitosa a 1 BOT');
check(snap.gameState.homeTeam.lineupState.currentBatterIndex === 0, 'Home inicia en #1 (home-1) SIN CONTAMINACIÓN');

// 2. Inning 1 BOT (Home Team Bats)
console.log('\n--- 2. INNING 1 BOT (Home Team al Bate) ---');
// Home Batter 1: Hit HR (Jonrón)
dispatcher.dispatch({ type: 'RECORD_HIT', payload: { resultCode: 'HR', batterId: 'home-1' } });
snap = dispatcher.getCurrentSnapshot();
check(snap.gameState.homeTeam.lineupState.currentBatterIndex === 1, 'Home avanza a #2 (home-2)');
check(snap.gameState.awayTeam.lineupState.currentBatterIndex === 4, 'Away permanece congelado en #5');
check(snap.gameState.score.home === 1, 'Marcador Home: 1');

// Home Batter 2: Walk BB
dispatcher.dispatch({ type: 'RECORD_WALK', payload: { resultCode: 'BB', batterId: 'home-2' } });
snap = dispatcher.getCurrentSnapshot();
check(snap.gameState.homeTeam.lineupState.currentBatterIndex === 2, 'Home avanza a #3 (home-3)');
check(snap.gameState.awayTeam.lineupState.currentBatterIndex === 4, 'Away sigue en #5');

// Home Batter 3: Double Play (2 outs)
dispatcher.dispatch({ type: 'RECORD_DOUBLE_PLAY', payload: { resultCode: 'DP_GROUND', batterId: 'home-3' } });
snap = dispatcher.getCurrentSnapshot();
check(snap.gameState.homeTeam.lineupState.currentBatterIndex === 3, 'Home avanza a #4 (home-4)');
check(snap.gameState.outs === 2, '2 Outs en pizarra tras DP');

// Home Batter 4: Out 4-3 (3er out -> Cambio a Inn 2 TOP)
dispatcher.dispatch({ type: 'RECORD_OUT', payload: { resultCode: 'GO', batterId: 'home-4' } });
snap = dispatcher.getCurrentSnapshot();
check(snap.gameState.inning === 2 && snap.gameState.half === 'TOP', 'Transición a Inn 2 TOP');
check(snap.gameState.awayTeam.lineupState.currentBatterIndex === 4, 'Away Team REANUDA EXACTAMENTE en #5 (away-5)');
check(snap.gameState.homeTeam.lineupState.currentBatterIndex === 4, 'Home Team queda esperando en #5 (home-5)');

console.log(`\n?? TOTAL RESULTADOS: ${passCount} / ${totalTests} PRUEBAS DE AISLAMIENTO EXITOSAS (100%)\n`);

if (passCount !== totalTests) process.exit(1);
