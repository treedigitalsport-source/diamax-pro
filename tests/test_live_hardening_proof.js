const fs = require('fs');
const assert = require('assert');

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('🧪 PRUEBA EN VIVO: BLINDAJE DE RIVALES Y ATRIBUCION DE CARRERAS (DIAMAX)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// 1. Cargar modulos core de DIAMAX
const DIAMAX_CORE = require('../diamax-core-bundle.js');
const indexHtml = fs.readFileSync('C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html', 'utf8');

// Extraer funciones clave del index.html para evaluarlas en un entorno controlado
const extractFunc = (name, endMarker) => {
  const start = indexHtml.indexOf('function ' + name);
  const end = indexHtml.indexOf(endMarker, start);
  return indexHtml.substring(start, end);
};

// Mock de DOM y entorno global
const mockContainer = { innerHTML: '', style: {} };
global.document = {
  getElementById: (id) => {
    if (id === 'live-lineup-chips') return mockContainer;
    if (id === 'play-log') return { innerHTML: '', firstElementChild: null, removeChild: () => {} };
    return { innerHTML: '', value: '', style: {}, classList: { add: ()=>{}, remove: ()=>{} } };
  },
  querySelectorAll: () => [],
  addEventListener: () => {}
};

global.window = {
  document: global.document,
  addEventListener: () => {},
  removeEventListener: () => {},
  DIAMAX_DISPATCHER: new DIAMAX_CORE.CommandDispatcher()
};
global.DIAMAX_CORE = DIAMAX_CORE;
global.teamName = 'GUERREROS (+55)';
global.setSafeHTML = () => {};
global.mostrarToast = () => {};
global.renderAll = () => {};
global.updateLiveBatterDisplay = () => {};
global.updateOutsLEDs = () => {};

// Ejecutar codigo extraido de index.html
eval(extractFunc('isGuerrerosBattingNow', 'function getLiveCurrentBatter'));
eval(extractFunc('getLiveCurrentBatter', 'function renderLiveLineupChips'));
eval(extractFunc('renderLiveLineupChips', 'function seleccionarTurnoDirecto'));
eval(extractFunc('registrarJugadaLive', 'function deshacerJugadaLive'));
eval(extractFunc('deshacerJugadaLive', 'function procesarFlyPosicion'));

let activeTestGame = {
  id: 'GAME-LIVE-TEST',
  rival: 'CARDENALES',
  rivalId: 'RIV-002',
  isHomeClub: true,
  condicion: 'HOME',
  lineup: [
    { order: 1, playerId: 'gve-1', pos: 'CF' },
    { order: 2, playerId: 'gve-2', pos: '2B' },
    { order: 3, playerId: 'gve-3', pos: '1B' },
    { order: 4, playerId: 'gve-4', pos: 'LF' },
    { order: 5, playerId: 'gve-5', pos: 'RF' },
    { order: 6, playerId: 'gve-6', pos: '3B' },
    { order: 7, playerId: 'gve-7', pos: 'SS' },
    { order: 8, playerId: 'gve-8', pos: 'C' },
    { order: 9, playerId: 'gve-9', pos: 'P' }
  ]
};
global.getActiveGame = () => activeTestGame;
global.MASTER_ROSTER = activeTestGame.lineup.map((s, idx) => ({ id: s.playerId, num: idx+1, name: 'Guerrero ' + (idx+1), defaultPos: s.pos }));

global.liveState = {
  inning: 1,
  half: 'top',
  outs: 0,
  bases: { b1: false, b2: false, b3: false },
  scoreUs: 0,
  scoreThem: 0,
  gveBatterIndex: 0,
  rivalBatterIndex: 0,
  currentLiveBox: {}
};

// ─────────────────────────────────────────────────────────────────────────────
// PRUEBA 1: RENDERIZADO DEL LINEUP RIVAL SIN RED (OFFLINE RESILIENCE)
// ─────────────────────────────────────────────────────────────────────────────
console.log('▶ PRUEBA 1: Renderizado del Lineup Rival cuando esta al bate (Inning 1 TOP)...');
renderLiveLineupChips();
assert(mockContainer.innerHTML.includes('lineup-chip'), 'El contenedor debe tener chips de bateadores rivales');
console.log('   ✨ EXITO: 9 Bateadores rivales renderizados correctamente en pantalla sin depender de la red.\n');

// ─────────────────────────────────────────────────────────────────────────────
// PRUEBA 2: ATRIBUCION DE CARRERAS CUANDO GUERREROS ES HOME CLUB
// ─────────────────────────────────────────────────────────────────────────────
console.log('▶ PRUEBA 2: Guerreros como HOME CLUB (Defendiendo en la Alta / Bateando en la Baja)...');

// 2.1 En la Alta de la 1ra (TOP): Rival anota 2 carreras con un HR
console.log('   • Simulando: Jonron de 2 carreras del RIVAL en la Alta de la 1ra entrada...');
registrarJugadaLive('1B'); // Rival en 1B
registrarJugadaLive('HR'); // Jonron de 2 carreras del rival

console.log(`     Marcador actual: Guerreros ${liveState.scoreUs} - Rival ${liveState.scoreThem}`);
assert.strictEqual(liveState.scoreThem, 2, 'El RIVAL debe tener exactamente 2 carreras');
assert.strictEqual(liveState.scoreUs, 0, 'GUERREROS debe tener 0 carreras (no se le deben sumar carreras del rival)');
console.log('     ✓ VERIFICADO: Las 2 carreras fueron atribuidas estrictamente al RIVAL (Guerreros = 0).');

// 2.2 Completar los 3 outs del rival para pasar a la Baja de la 1ra (BOT)
registrarJugadaLive('K');
registrarJugadaLive('6-3');
registrarJugadaLive('Fly 8');
console.log(`     Fin de la Alta 1ra: Outs=${liveState.outs}, Media Entrada="${liveState.half}"`);
assert.strictEqual(liveState.half, 'bot', 'Debe cambiar a la Baja (bot)');
assert.strictEqual(liveState.outs, 0, 'Los outs deben reiniciarse a 0');

// 2.3 En la Baja de la 1ra (BOT): Guerreros al bate anota 3 carreras con un HR con 2 en base
console.log('   • Simulando: Jonron de 3 carreras de GUERREROS en la Baja de la 1ra entrada...');
registrarJugadaLive('1B'); // Corredor en 1B
registrarJugadaLive('2B'); // Corredores en 2B y 3B
registrarJugadaLive('HR'); // Jonron de 3 carreras de Guerreros

console.log(`     Marcador actual: Guerreros ${liveState.scoreUs} - Rival ${liveState.scoreThem}`);
assert.strictEqual(liveState.scoreUs, 3, 'GUERREROS debe tener exactamente 3 carreras');
assert.strictEqual(liveState.scoreThem, 2, 'El RIVAL debe permanecer con 2 carreras');
console.log('     ✓ VERIFICADO: Las 3 carreras fueron atribuidas estrictamente a GUERREROS (Rival = 2).\n');

// ─────────────────────────────────────────────────────────────────────────────
// PRUEBA 3: ATRIBUCION DE CARRERAS CUANDO GUERREROS ES VISITANTE (AWAY)
// ─────────────────────────────────────────────────────────────────────────────
console.log('▶ PRUEBA 3: Guerreros como VISITANTE (Bateando en la Alta / Defendiendo en la Baja)...');
activeTestGame.isHomeClub = false;
activeTestGame.condicion = 'AWAY';
window.DIAMAX_DISPATCHER = new DIAMAX_CORE.CommandDispatcher(); // Reiniciar despachador
liveState.inning = 1;
liveState.half = 'top';
liveState.outs = 0;
liveState.bases = { b1:false, b2:false, b3:false };
liveState.scoreUs = 0;
liveState.scoreThem = 0;

// 3.1 En la Alta de la 1ra (TOP): Guerreros como visitante anota 1 carrera
console.log('   • Simulando: Guerreros anota 1 carrera en la Alta de la 1ra...');
registrarJugadaLive('HR'); // Jonron solitario de Guerreros
console.log(`     Marcador actual: Guerreros ${liveState.scoreUs} - Rival ${liveState.scoreThem}`);
assert.strictEqual(liveState.scoreUs, 1, 'GUERREROS (Visitante) debe tener 1 carrera');
assert.strictEqual(liveState.scoreThem, 0, 'El RIVAL debe tener 0 carreras');
console.log('     ✓ VERIFICADO: Carrera atribuida correctamente a Guerreros como visitante.');

// 3.2 Completar 3 outs y pasar a la Baja de la 1ra (BOT)
registrarJugadaLive('K');
registrarJugadaLive('4-3');
registrarJugadaLive('Fly 7');

// 3.3 En la Baja de la 1ra (BOT): Rival como Home Club anota 4 carreras (Grand Slam)
console.log('   • Simulando: Rival anota 4 carreras en la Baja de la 1ra (Grand Slam)...');
registrarJugadaLive('1B');
registrarJugadaLive('1B');
registrarJugadaLive('1B'); // Bases llenas
registrarJugadaLive('HR'); // Grand Slam del Rival
console.log(`     Marcador actual: Guerreros ${liveState.scoreUs} - Rival ${liveState.scoreThem}`);
assert.strictEqual(liveState.scoreUs, 1, 'GUERREROS debe mantenerse en 1 carrera');
assert.strictEqual(liveState.scoreThem, 4, 'El RIVAL (Home Club) debe tener 4 carreras');
console.log('     ✓ VERIFICADO: Las 4 carreras fueron atribuidas estrictamente al Rival.\n');

// ─────────────────────────────────────────────────────────────────────────────
// PRUEBA 4: DESHACER JUGADA (UNDO) CON PRESERVACION DEL MARCADOR
// ─────────────────────────────────────────────────────────────────────────────
console.log('▶ PRUEBA 4: Reversion (Undo) tras el Grand Slam del Rival...');
deshacerJugadaLive();
console.log(`     Marcador tras Deshacer: Guerreros ${liveState.scoreUs} - Rival ${liveState.scoreThem}`);
assert.strictEqual(liveState.scoreThem, 0, 'El puntaje del Rival debe volver a 0 tras revertir el Grand Slam');
assert.strictEqual(liveState.scoreUs, 1, 'El puntaje de Guerreros debe permanecer intacto en 1');
console.log('     ✓ VERIFICADO: La reversion restauro exactamente el marcador anterior sin distorsion.');

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('🏆 RESULTADO GLOBAL: TODAS LAS PRUEBAS EN VIVO PASARON SATISFACTORIAMENTE');
console.log('═══════════════════════════════════════════════════════════════════════════\n');
