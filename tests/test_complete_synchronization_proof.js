/**
 * DIAMAX PRO — COMPLETE SYNCHRONIZATION & ROTATION PROOF
 * =======================================================
 * Tests strict coordination between:
 * 1. Home Club vs Visitante roles.
 * 2. Top (Alta ▲) and Bottom (Baja ▼) half transitions.
 * 3. Batter turn advancement (rotations for both teams).
 * 4. Run attribution (Home score vs Away score).
 */

const fs = require('fs');
const path = require('path');
const DIAMAX_CORE = require('../diamax-core-bundle.js');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('🧪 PRUEBA MAESTRA: SINCRONIZACIÓN HOME/AWAY, ALTA/BAJA Y ROTACIONES');
console.log('═══════════════════════════════════════════════════════════════════════\n');

function createTestEnvironment(isHomeClub = true) {
  const dispatcher = new DIAMAX_CORE.CommandDispatcher();
  
  const gveRoster = [
    { id: 'gve-1', num: '1', name: 'Johan Olivo', defaultPos: 'CF' },
    { id: 'gve-2', num: '2', name: 'Pablo Morales', defaultPos: '2B' },
    { id: 'gve-3', num: '3', name: 'Altuve Jose', defaultPos: 'SS' },
    { id: 'gve-4', num: '4', name: 'Leandro Chavez', defaultPos: '1B' },
    { id: 'gve-5', num: '5', name: 'Carlos Delgado', defaultPos: 'LF' },
    { id: 'gve-6', num: '6', name: 'Pedro Chavez', defaultPos: 'P' },
    { id: 'gve-7', num: '7', name: 'Miguel Cabrera', defaultPos: 'DH' },
    { id: 'gve-8', num: '8', name: 'Salvador Perez', defaultPos: 'C' },
    { id: 'gve-9', num: '9', name: 'Ronald Acuna', defaultPos: 'RF' }
  ];

  const rivalRoster = [
    { order: 1, name: 'Carlos Perez', number: '10', pos: 'CF' },
    { order: 2, name: 'Derek Johnson', number: '4', pos: '2B' },
    { order: 3, name: 'Marcus Vance', number: '25', pos: '1B' },
    { order: 4, name: 'Anthony Miller', number: '34', pos: 'LF' },
    { order: 5, name: 'Steve Clark', number: '18', pos: 'RF' },
    { order: 6, name: 'Luis Rodriguez', number: '12', pos: '3B' },
    { order: 7, name: 'Jason Smith', number: '7', pos: 'SS' },
    { order: 8, name: 'Brian White', number: '2', pos: 'C' },
    { order: 9, name: 'Tom Reynolds', number: '21', pos: 'P' }
  ];

  const env = {
    teamName: 'GUERREROS DE VENEZUELA +55',
    activeGame: {
      id: 'GAME-TEST',
      rival: 'DAYTONA BEACH',
      rivalId: 'RIV-001',
      isHomeClub: isHomeClub,
      condicion: isHomeClub ? 'HOME' : 'AWAY',
      lineup: gveRoster.map((p, idx) => ({ order: idx + 1, playerId: p.id, pos: p.defaultPos }))
    },
    liveState: {
      inning: 1,
      half: 'top',
      outs: 0,
      scoreUs: 0,
      scoreThem: 0,
      bases: { b1: false, b2: false, b3: false },
      batterIndex: 0,
      gveBatterIndex: 0,
      rivalBatterIndex: 0,
      currentLiveBox: {}
    },
    MASTER_ROSTER: gveRoster,
    RIVALS_DATABASE: [{ id: 'RIV-001', name: 'DAYTONA BEACH', lineup: rivalRoster }],
    dispatcher
  };

  global.window = { DIAMAX_DISPATCHER: dispatcher };
  global.DIAMAX_CORE = DIAMAX_CORE;
  global.liveState = env.liveState;
  global.getActiveGame = () => env.activeGame;
  global.MASTER_ROSTER = env.MASTER_ROSTER;
  global.RIVALS_DATABASE = env.RIVALS_DATABASE;
  global.teamName = env.teamName;
  global.setSafeHTML = () => {};
  global.setSafeText = () => {};
  global.renderAll = () => {};
  global.updateLiveBatterDisplay = () => {};
  global.renderLiveLineupChips = () => {};
  global.document = { getElementById: () => ({ innerHTML: '', value: '', style: {} }) };

  const indexContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  eval(indexContent.substring(indexContent.indexOf('function isGuerrerosBattingNow'), indexContent.indexOf('function sumarCarreraInning')));
  eval(indexContent.substring(indexContent.indexOf('function registrarJugadaLive'), indexContent.indexOf('function procesarFlyPosicion')));

  global.isGuerrerosBattingNow = isGuerrerosBattingNow;
  global.getLiveCurrentBatter = getLiveCurrentBatter;
  global.registrarJugadaLive = registrarJugadaLive;

  return env;
}

// ── TEST SCENARIO 1: GUERREROS ES HOME CLUB ─────────────────────────────────
console.log('▶ ESCENARIO 1: GUERREROS ES HOME CLUB (Defiende en Alta ▲ / Batea en Baja ▼)\n');
const env1 = createTestEnvironment(true);

// Inning 1 Alta: Batea Rival (Daytona Beach)
let cur = getLiveCurrentBatter();
console.log(` • Inning 1 ALTA (▲) Inicio:`);
console.log(`   - Equipo al Bate: ${cur.team} (isGVE = ${cur.isGVE})`);
console.log(`   - Bateador Activo: ${cur.player.name} (Orden #${cur.order})`);
if (cur.isGVE !== false || cur.order !== 1) throw new Error('Fallo: En la Alta 1ra siendo Home Club debe batear el Rival (orden 1)');

// Jugada 1: Rival conecta Single (1B)
registrarJugadaLive('1B');
cur = getLiveCurrentBatter();
console.log(` • Tras Single (1B) del Rival:`);
console.log(`   - Nuevo Bateador en Turno: ${cur.player.name} (Orden #${cur.order})`);
console.log(`   - Marcador: Guerreros ${liveState.scoreUs} - Rival ${liveState.scoreThem}`);
if (cur.order !== 2) throw new Error('Fallo: La rotación del rival debió avanzar al orden 2 tras el hit');

// Jugada 2: Rival conecta Doble (2B), corredores avanzan a 2B y 3B
registrarJugadaLive('2B');
cur = getLiveCurrentBatter();
console.log(` • Tras Doble (2B) del Rival:`);
console.log(`   - Nuevo Bateador en Turno: ${cur.player.name} (Orden #${cur.order})`);
console.log(`   - Bases ocupadas: 2B y 3B | Marcador: Guerreros ${liveState.scoreUs} - Rival ${liveState.scoreThem}`);
if (cur.order !== 3) throw new Error('Fallo: La rotación debió avanzar al orden 3 tras el doble');

// Jugada 3: Rival conecta Hit (1B) impulsando al corredor de 3B
registrarJugadaLive('1B');
cur = getLiveCurrentBatter();
console.log(` • Tras Sencillo (1B) impulsador del Rival:`);
console.log(`   - Nuevo Bateador en Turno: ${cur.player.name} (Orden #${cur.order})`);
console.log(`   - Marcador: Guerreros ${liveState.scoreUs} - Rival ${liveState.scoreThem}`);
if (cur.order !== 4) throw new Error('Fallo: La rotación debió avanzar al orden 4');
if (liveState.scoreThem !== 1 || liveState.scoreUs !== 0) throw new Error('Fallo: La carrera debió ser acreditada al Rival');

// 3 Outs del Rival para cambiar de entrada (Out 1, Out 2, Out 3)
registrarJugadaLive('K'); // Out 1 (Bateador 4 se poncha)
registrarJugadaLive('6-3'); // Out 2 (Bateador 5 roletea)
registrarJugadaLive('Fly 8'); // Out 3 (Bateador 6 eleva al CF)

console.log(` • Tras 3 Outs del Rival:`);
console.log(`   - Media Entrada actual: ${liveState.half.toUpperCase()} ${liveState.half === 'bot' ? '▼' : '▲'}`);
console.log(`   - Outs actuales: ${liveState.outs}`);
cur = getLiveCurrentBatter();
console.log(`   - Equipo al Bate ahora: ${cur.team} (isGVE = ${cur.isGVE})`);
console.log(`   - Bateador Activo de Guerreros: ${cur.player.name} (Orden #${cur.order})`);
if (liveState.half !== 'bot' || liveState.outs !== 0) throw new Error('Fallo: Tras 3 outs debe cambiar automáticamente a la BAJA con 0 outs');
if (cur.isGVE !== true || cur.order !== 1) throw new Error('Fallo: En la Baja 1ra debe iniciar Guerreros con su primer bateador');

// Inning 1 Baja: Batea Guerreros de Venezuela
// Guerreros conecta Jonrón de 2 carreras (1B + HR)
registrarJugadaLive('1B'); // Guerreros bateador 1 llega a 1B
cur = getLiveCurrentBatter();
if (cur.order !== 2) throw new Error('Fallo: Guerreros debe avanzar al bateador 2 tras 1B');

registrarJugadaLive('HR'); // Guerreros bateador 2 da HR (2 carreras)
console.log(` • Tras Jonrón de Guerreros en la Baja 1ra:`);
console.log(`   - Marcador: Guerreros ${liveState.scoreUs} - Rival ${liveState.scoreThem}`);
if (liveState.scoreUs !== 2 || liveState.scoreThem !== 1) throw new Error('Fallo: Las 2 carreras de HR en la baja deben ser de Guerreros');

// Guerreros hace 3 outs para terminar el 1er Inning
registrarJugadaLive('K');
registrarJugadaLive('4-3');
registrarJugadaLive('5-3');

console.log(` • Tras 3er Out de Guerreros (Fin Inning 1):`);
console.log(`   - Nuevo Inning: Inning ${liveState.inning} ${liveState.half === 'top' ? 'ALTA ▲' : 'BAJA ▼'}`);
cur = getLiveCurrentBatter();
console.log(`   - Bateador que abre Inning 2 Alta (Rival): ${cur.player.name} (Orden #${cur.order})`);
if (liveState.inning !== 2 || liveState.half !== 'top') throw new Error('Fallo: Debe avanzar a Inning 2 ALTA');
if (cur.order !== 7) throw new Error(`Fallo: El rival consumió 6 turnos en el 1ro, debe continuar con el bateador 7 (recibido: ${cur.order})`);

console.log('\n✨ ESCENARIO 1 VERIFICADO AL 100%: Transiciones y rotaciones perfectas.');

// ── TEST SCENARIO 2: GUERREROS ES VISITANTE ─────────────────────────────────
console.log('\n▶ ESCENARIO 2: GUERREROS ES VISITANTE (Batea en Alta ▲ / Defiende en Baja ▼)\n');
const env2 = createTestEnvironment(false);

// Inning 1 Alta: Batea Guerreros
cur = getLiveCurrentBatter();
console.log(` • Inning 1 ALTA (▲) siendo Visitante:`);
console.log(`   - Equipo al Bate: ${cur.team} (isGVE = ${cur.isGVE})`);
console.log(`   - Primer Bateador: ${cur.player.name} (Orden #${cur.order})`);
if (cur.isGVE !== true || cur.order !== 1) throw new Error('Fallo: Siendo Visitante, Guerreros debe batear en la Alta');

// Guerreros conecta 2B y HR
registrarJugadaLive('2B');
cur = getLiveCurrentBatter();
if (cur.order !== 2) throw new Error('Fallo: Rotación de Guerreros debe avanzar a orden 2');

registrarJugadaLive('HR'); // 2 carreras para Guerreros
if (liveState.scoreUs !== 2 || liveState.scoreThem !== 0) throw new Error('Fallo: Carreras de la alta deben sumarse a Guerreros como Visitante');

console.log('\n✨ ESCENARIO 2 VERIFICADO AL 100%: Guerreros como visitante suma carreras en la Alta y rota orden correctamente.');

console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log('🏆 RESULTADO FINAL: TODAS LAS PRUEBAS DE SINCRONIZACIÓN PASARON AL 100%');
console.log('═══════════════════════════════════════════════════════════════════════\n');
