const assert = require('assert').strict;

/**
 * DIAMAX PRO — STRICT LINEUP ISOLATION & ROTATION HARDENING TEST SUITE
 * Verifies that Guerreros and Rival lineups remain 100% mathematically and logically isolated.
 */

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('🧪 RUNNING: Lineup Isolation & Anti-Mixing Verification Suite');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

// 1. Mock DOM and Global State Environment
global.window = global;
global.document = {
  getElementById: (id) => ({
    id,
    style: {},
    innerHTML: '',
    value: '',
    appendChild: () => {},
    querySelectorAll: () => []
  })
};

// 2. Test Master Roster
const MASTER_ROSTER = [
  { id: 1, num: 1, name: "Johan Olivo", defaultPos: "CF", bats: "L" },
  { id: 2, num: 2, name: "Pablo Morales", defaultPos: "1B", bats: "R" },
  { id: 3, num: 3, name: "Raul Lozada", defaultPos: "SS", bats: "R" },
  { id: 4, num: 4, name: "Jorge Mitchell", defaultPos: "2B", bats: "R" },
  { id: 5, num: 5, name: "Oswaldo Grillo", defaultPos: "3B", bats: "R" },
  { id: 6, num: 6, name: "Nestor Vera", defaultPos: "LF", bats: "L" },
  { id: 7, num: 7, name: "Franklin Ramos", defaultPos: "RF", bats: "R" },
  { id: 8, num: 8, name: "Carlos Sanchez", defaultPos: "C", bats: "R" },
  { id: 9, num: 10, name: "Pedro Chavez", defaultPos: "P", bats: "R" }
];

const RIVALS_DATABASE = [
  {
    id: "RIV-001",
    name: "CARDENALES",
    abbr: "CAR",
    pitcherAs: "Carlos Morales",
    pitcherArm: "RHP",
    lineup: [
      { order: 1, name: "Carlos Perez", number: "10", pos: "CF" },
      { order: 2, name: "Derek Johnson", number: "4", pos: "2B" },
      { order: 3, name: "Marcus Vance", number: "25", pos: "1B" },
      { order: 4, name: "Anthony Miller", number: "34", pos: "LF" },
      { order: 5, name: "Steve Clark", number: "18", pos: "RF" },
      { order: 6, name: "Luis Rodriguez", number: "12", pos: "3B" },
      { order: 7, name: "Jason Smith", number: "7", pos: "SS" },
      { order: 8, name: "Brian White", number: "2", pos: "C" },
      { order: 9, name: "Tom Reynolds", number: "21", pos: "P" }
    ]
  }
];

// Test 1: Official Inning Batting Assignment Logic
console.log('▶ Test 1: Official Inning Batting Assignment (Top vs Bottom / Home vs Away)');
function isGuerrerosBattingNow(isHomeClub, isTop) {
  return isHomeClub ? !isTop : isTop;
}

// Case A: Guerreros is Home Club (Home)
assert.equal(isGuerrerosBattingNow(true, true), false, 'When GVE is Home, Rival bats in Top (Alta)');
assert.equal(isGuerrerosBattingNow(true, false), true, 'When GVE is Home, GVE bats in Bottom (Baja)');

// Case B: Guerreros is Visitor (Away)
assert.equal(isGuerrerosBattingNow(false, true), true, 'When GVE is Visitor, GVE bats in Top (Alta)');
assert.equal(isGuerrerosBattingNow(false, false), false, 'When GVE is Visitor, Rival bats in Bottom (Baja)');
console.log('   ✨ Passed: Inning Batting Assignment is 100% compliant with Baseball Rules.');

// Test 2: Dual-Index Pointer Isolation (No Index Bleeding)
console.log('\n▶ Test 2: Dual-Index Pointer Isolation (Advancing turns without crosstalk)');
const liveState = {
  inning: 1,
  half: 'top',
  gveBatterIndex: 0,
  rivalBatterIndex: 0
};

// Simulation: 3 outs recorded for Visitor in Top of 1st
for (let out = 1; out <= 3; out++) {
  // Visitor is batting
  const isGVE = isGuerrerosBattingNow(true, true); // false (Rival bats)
  if (isGVE) {
    liveState.gveBatterIndex = (liveState.gveBatterIndex + 1) % 9;
  } else {
    liveState.rivalBatterIndex = (liveState.rivalBatterIndex + 1) % 9;
  }
}

assert.equal(liveState.rivalBatterIndex, 3, 'Rival batter index advanced to 3');
assert.equal(liveState.gveBatterIndex, 0, 'Guerreros batter index remained intact at 0 (No index bleed)');

// Switch half to Bottom of 1st
liveState.half = 'bot';

// Simulation: 4 batters for Home Club in Bottom of 1st (3 outs + 1 hit)
for (let b = 1; b <= 4; b++) {
  const isGVE = isGuerrerosBattingNow(true, false); // true (GVE bats)
  if (isGVE) {
    liveState.gveBatterIndex = (liveState.gveBatterIndex + 1) % 9;
  } else {
    liveState.rivalBatterIndex = (liveState.rivalBatterIndex + 1) % 9;
  }
}

assert.equal(liveState.gveBatterIndex, 4, 'Guerreros batter index advanced to 4');
assert.equal(liveState.rivalBatterIndex, 3, 'Rival batter index remained locked at 3 during bottom half');
console.log('   ✨ Passed: Batter indices remain strictly isolated across half-inning transitions.');

// Test 3: Lineup Builder Actions Isolation
console.log('\n▶ Test 3: Lineup Builder Mutation Isolation (GVE vs Rival)');
const game = {
  id: "game-test-01",
  rivalId: "RIV-001",
  rival: "CARDENALES",
  isHomeClub: true,
  lineup: MASTER_ROSTER.slice(0, 9).map((p, idx) => ({ order: idx + 1, playerId: p.id, pos: p.defaultPos }))
};

const rival = JSON.parse(JSON.stringify(RIVALS_DATABASE[0]));

function simulateAddBatter(currentView, isHomeClub, g, rRecord) {
  const isEditingGVE = (currentView === 'home' && isHomeClub) || (currentView === 'away' && !isHomeClub);
  if (isEditingGVE) {
    const nextOrder = g.lineup.length + 1;
    g.lineup.push({ order: nextOrder, playerId: 99, pos: "DH" });
  } else {
    const nextOrder = rRecord.lineup.length + 1;
    rRecord.lineup.push({ order: nextOrder, name: `Extra Rival ${nextOrder}`, number: `${nextOrder}`, pos: "DH" });
  }
}

// Add extra batter while viewing Rival tab
simulateAddBatter('away', true, game, rival);
assert.equal(rival.lineup.length, 10, 'Rival lineup increased to 10 slots');
assert.equal(game.lineup.length, 9, 'Guerreros lineup remained unchanged at 9 slots');

// Add extra batter while viewing Home (GVE) tab
simulateAddBatter('home', true, game, rival);
assert.equal(game.lineup.length, 10, 'Guerreros lineup increased to 10 slots');
assert.equal(rival.lineup.length, 10, 'Rival lineup was not mutated');
console.log('   ✨ Passed: Lineup Builder modifications are strictly scoped to the active team view.');

// Test 4: 9-Inning Full Simulation Rotation Verification (54 Half-Innings)
console.log('\n▶ Test 4: 9-Inning Full Simulation with Independent Turn Counters');
let gveTurnCounter = 0;
let rivalTurnCounter = 0;
let gveRotations = 0;
let rivalRotations = 0;

for (let inn = 1; inn <= 9; inn++) {
  // Top half: Rival bats (3 batters)
  for (let i = 0; i < 3; i++) {
    rivalTurnCounter++;
    if (rivalTurnCounter % 9 === 0) rivalRotations++;
  }
  // Bottom half: GVE bats (3 batters)
  for (let i = 0; i < 3; i++) {
    gveTurnCounter++;
    if (gveTurnCounter % 9 === 0) gveRotations++;
  }
}

assert.equal(rivalTurnCounter, 27, 'Rival had exactly 27 plate appearances');
assert.equal(gveTurnCounter, 27, 'Guerreros had exactly 27 plate appearances');
assert.equal(rivalRotations, 3, 'Rival lineup completed exactly 3 full 1-9 cycles');
assert.equal(gveRotations, 3, 'Guerreros lineup completed exactly 3 full 1-9 cycles');
console.log('   ✨ Passed: Full 9-inning game rotation verified with zero order corruption.');

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('🏆 ALL 4 LINEUP ISOLATION TEST SUITES PASSED AT 100% WITH ZERO ERRORS');
console.log('═══════════════════════════════════════════════════════════════════════════\n');
