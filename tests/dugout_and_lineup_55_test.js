/**
 * 🧪 DIAMAX PRO — TEST SUITE: DUGOUT HOT SUBSTITUTIONS & LINEUP +55
 * 3Tree Digital Sport IA Corp. — Lic. Alí José Zapata Mendoza
 */

const fs = require('fs');
const assert = require('assert');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('⚾ TEST: DUGOUT HOT SUBSTITUTIONS, PRESETS +55 & GOOGLE SHEETS SYNC');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// 1. Cargar index.html y verificar markup esencial
const html = fs.readFileSync('index.html', 'utf8');

console.log('▶ [TEST 1] Verificando elementos de UI en index.html...');
assert(html.includes('id="modal-hot-dugout-sub"'), 'Falta #modal-hot-dugout-sub');
assert(html.includes('id="modal-sheets-sync"'), 'Falta #modal-sheets-sync');
assert(html.includes('abrirModalHotDugoutSub'), 'Falta llamada abrirModalHotDugoutSub');
assert(html.includes('btn-hot-sub-scoreboard'), 'Falta botón de sustitución rápida en el tablero');
assert(html.includes('cargarPresetLineup55'), 'Falta función cargarPresetLineup55');
assert(html.includes('exportarBoxscoreGoogleSheets'), 'Falta exportarBoxscoreGoogleSheets');
assert(html.includes('hot-sub-tab-btn'), 'Falta clase CSS hot-sub-tab-btn');
console.log('   ✨ [PASS] Todos los 7 componentes e IDs de markup verificados.\n');

// 2. Mock de entorno de navegador para probar la lógica de scripts/dugout_and_lineup_code.js
console.log('▶ [TEST 2] Evaluando lógica de Hot Substitutions (+55)...');

// Simular entorno global DOM y estado del juego
global.document = {
  getElementById: (id) => {
    return {
      id: id,
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      },
      innerHTML: '',
      innerText: '',
      value: '',
      prepend: () => {},
      removeChild: () => {},
      querySelectorAll: () => []
    };
  },
  createElement: (tag) => {
    return {
      tagName: tag,
      className: '',
      style: {},
      innerHTML: ''
    };
  }
};
global.window = global;
global.alert = (msg) => { /* mock */ };
global.mostrarToast = (msg) => { /* mock */ };
global.setSafeHTML = (id, str) => { /* mock */ };
global.saveGamesToStorage = () => {};
global.simularSincronizacionCloud = () => {};
global.guardarJuegoEnFirestore = () => {};
global.initSecurityPortal = () => {};
global.updateLiveBatterDisplay = () => {};
global.actualizarPitcherUI = () => {};
global.renderAll = () => {};
global.renderLineupBuilder = () => {};

global.MASTER_ROSTER = [
  { id:1, num:1, name:"Johan Olivo", defaultPos:"CF", bats:"L", throws:"R", obp:0.380, slg:0.450 },
  { id:2, num:2, name:"Pablo Morales", defaultPos:"1B", bats:"R", throws:"R", obp:0.340, slg:0.510 },
  { id:3, num:3, name:"Raul Lozada", defaultPos:"SS", bats:"R", throws:"R", obp:0.360, slg:0.410 },
  { id:4, num:4, name:"Jorge Mitchell", defaultPos:"2B", bats:"R", throws:"R", obp:0.320, slg:0.390 },
  { id:5, num:5, name:"Oswaldo Grillo", defaultPos:"3B", bats:"R", throws:"R", obp:0.330, slg:0.420 },
  { id:6, num:6, name:"Nestor Vera", defaultPos:"LF", bats:"L", throws:"R", obp:0.390, slg:0.520 },
  { id:7, num:7, name:"Pedro Moreno", defaultPos:"RF", bats:"L", throws:"R", obp:0.370, slg:0.480 },
  { id:8, num:8, name:"Juan Perez", defaultPos:"C", bats:"R", throws:"R", obp:0.310, slg:0.360 },
  { id:9, num:9, name:"Martin Rojas", defaultPos:"DH", bats:"R", throws:"R", obp:0.350, slg:0.460 },
  { id:10, num:10, name:"Pedro Chavez", defaultPos:"P", bats:"R", throws:"R", era:3.20 },
  { id:11, num:11, name:"Luis Silva", defaultPos:"OF", bats:"R", throws:"R", obp:0.345 },
  { id:12, num:12, name:"Luis Barrios", defaultPos:"IF", bats:"R", throws:"R", obp:0.330 },
  { id:13, num:13, name:"Paul Segarra", defaultPos:"OF", bats:"L", throws:"R", obp:0.350 },
  { id:14, num:14, name:"Julio Machado", defaultPos:"P", bats:"R", throws:"R", era:3.10 },
  { id:15, num:15, name:"Arquimedes Avancines", defaultPos:"IF", bats:"R", throws:"R", obp:0.360 },
  { id:16, num:16, name:"Rafael Briceño", defaultPos:"P", bats:"R", throws:"R", era:2.90 }
];

global.DEFAULT_PHOTO = "test.jpg";
global.POS_NUM = { P:1, C:2, "1B":3, "2B":4, "3B":5, SS:6, LF:7, CF:8, RF:9, DH:10 };

let mockGame = {
  id: "test-game-1",
  isHomeClub: true,
  condicion: "HOME",
  rival: "Orlando Dodgers",
  rivalId: "RIV-001",
  lineup: global.MASTER_ROSTER.slice(0, 9).map((p, idx) => ({ order: idx + 1, playerId: p.id, pos: p.defaultPos }))
};
global.getActiveGame = () => mockGame;

global.activePitcherStats = {
  id: 10,
  name: "Pedro Chavez",
  throws: "R",
  num: 10,
  totalPitches: 28,
  strikes: 19,
  balls: 9,
  maxLimit: 75
};

global.liveState = {
  inning: 1,
  half: 'bot',
  outs: 1,
  scoreUs: 2,
  scoreThem: 0,
  bases: { b1: false, b2: false, b3: false },
  batterIndex: 2,
  gveBatterIndex: 2
};

global.isGuerrerosBattingNow = () => true;

// Cargar el módulo
require('../scripts/dugout_and_lineup_code.js');

// Probar inicialización y estado
assert(global.hotSubState, 'hotSubState no existe');
assert.strictEqual(global.hotSubState.tab, 'PH');
console.log('   ✨ [PASS] hotSubState inicializado correctamente.');

// Probar abrirModalHotDugoutSub
global.abrirModalHotDugoutSub('PH');
assert.strictEqual(global.hotSubState.team, 'gve', 'Equipo debe ser GVE cuando GVE batea');
assert.strictEqual(global.hotSubState.tab, 'PH');
assert.strictEqual(global.hotSubState.selectedSlot, 2, 'Debe preseleccionar turno #3 (index 2)');
console.log('   ✨ [PASS] abrirModalHotDugoutSub preselecciona slot activo y equipo al bate.');

// Probar Sustitución Bateador Emergente (PH)
// Reemplazar slot 2 (Raul Lozada) por banca id: 11 (Luis Silva)
global.hotSubState.selectedBenchId = 11;
global.ejecutarSustitucionEnCaliente();
assert.strictEqual(mockGame.lineup[2].playerId, 11, 'Slot 2 no fue sustituido por id 11');
console.log('   ✨ [PASS] Sustitución Bateador Emergente (PH) ejecutada con éxito en lineup.');

// Probar Sustitución Corredor Emergente (PR)
global.hotSubState.tab = 'PR';
global.hotSubState.selectedBase = 2;
global.hotSubState.selectedBenchId = 13; // Paul Segarra
global.ejecutarSustitucionEnCaliente();
assert.strictEqual(global.liveState.bases.b2, true, 'Base 2 debe estar ocupada tras PR');
console.log('   ✨ [PASS] Sustitución Corredor Emergente (PR) ubicó corredor en 2da base.');

// Probar Cambio de Lanzador (P)
global.hotSubState.tab = 'P';
global.hotSubState.team = 'gve';
global.hotSubState.selectedRelieverId = 14; // Julio Machado
global.ejecutarSustitucionEnCaliente();
assert.strictEqual(global.activePitcherStats.id, 14, 'El lanzador activo debe ser Julio Machado (#14)');
assert.strictEqual(global.activePitcherStats.totalPitches, 0, 'El conteo de pitcheo debe reiniciarse');
console.log('   ✨ [PASS] Cambio de Lanzador (P) montó a #14 Julio Machado con conteo reiniciado.');

// 3. Probar Presets de Alineación (+55)
console.log('\n▶ [TEST 3] Evaluando Presets de Alineación (+55)...');
global.cargarPresetLineup55('clasico');
assert.strictEqual(mockGame.lineup[0].playerId, 1, 'Preset clásico 1º debe ser Johan Olivo');
assert.strictEqual(mockGame.lineup[1].playerId, 2, 'Preset clásico 2º debe ser Pablo Morales');

global.cargarPresetLineup55('ofensivo');
assert.strictEqual(mockGame.lineup[1].playerId, 6, 'Preset ofensivo 2º debe ser Nestor Vera (.520 SLG)');
assert.strictEqual(mockGame.lineup[2].playerId, 2, 'Preset ofensivo 3º debe ser Pablo Morales (.510 SLG)');

global.cargarPresetLineup55('sabermetrico');
assert.strictEqual(mockGame.lineup[0].playerId, 1, 'Preset sabermetrico vs RHP debe tener Olivo de 1ro');
assert.strictEqual(mockGame.lineup[1].playerId, 6, 'Preset sabermetrico vs RHP debe tener Vera de 2do');
console.log('   ✨ [PASS] Todos los 3 presets (+55 Clásico, Ofensivo, Sabermétrico IA) verificados.');

// 4. Probar Google Sheets TSV Generator
console.log('\n▶ [TEST 4] Evaluando Generador de Formato Tabular Google Sheets...');
const tsv = global.generarTSVBoxscoreGoogleSheets();
assert(tsv.includes('TABLA DE BATEO OFICIAL'), 'Falta sección de bateo en TSV');
assert(tsv.includes('TABLA DE PITCHEO'), 'Falta sección de pitcheo en TSV');
assert(tsv.includes('LINE SCORE'), 'Falta line score en TSV');
assert(tsv.includes('\t'), 'Debe contener tabuladores reglamentarios de Google Sheets');
console.log('   ✨ [PASS] Boxscore TSV para Google Sheets generado con estructura perfecta.');

console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log('🏆 TODAS LAS 12 PRUEBAS DE DUGOUT Y LINEUPS +55 PASARON EXITOSAMENTE');
console.log('═══════════════════════════════════════════════════════════════════════');
