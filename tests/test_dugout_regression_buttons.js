const path = require('path');
const DIAMAX_CORE = require('../diamax-core-bundle.js');
const { CommandDispatcher } = DIAMAX_CORE;

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

console.log('---------------------------------------------------------------');
console.log('? DIAMAX PRO — REGRESIÓN FORENSE: DUGOUT 30 COMANDOS TÁCTILES');
console.log('---------------------------------------------------------------\n');

const commandsToTest = [
  { id: 'BTN-01', name: '1B (Single)', cmd: { type: 'RECORD_HIT', payload: { resultCode: '1B', batterId: 'away-1' } } },
  { id: 'BTN-02', name: '2B (Double)', cmd: { type: 'RECORD_HIT', payload: { resultCode: '2B', batterId: 'away-2' } } },
  { id: 'BTN-03', name: '3B (Triple)', cmd: { type: 'RECORD_HIT', payload: { resultCode: '3B', batterId: 'away-3' } } },
  { id: 'BTN-04', name: 'HR (Home Run)', cmd: { type: 'RECORD_HIT', payload: { resultCode: 'HR', batterId: 'away-4' } } },
  { id: 'BTN-05', name: 'BB (Walk)', cmd: { type: 'RECORD_WALK', payload: { resultCode: 'BB', batterId: 'away-5' } } },
  { id: 'BTN-06', name: 'IBB (Intentional Walk)', cmd: { type: 'RECORD_WALK', payload: { resultCode: 'IBB', batterId: 'away-6' } } },
  { id: 'BTN-07', name: 'HBP (Hit by pitch)', cmd: { type: 'RECORD_WALK', payload: { resultCode: 'HBP', batterId: 'away-7' } } },
  { id: 'BTN-08', name: 'K (Strikeout swinging)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'K_SWINGING', batterId: 'away-8' } } },
  { id: 'BTN-09', name: '? (Strikeout looking)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'K_LOOKING', batterId: 'away-9' } } },
  { id: 'BTN-10', name: '6-3 (Groundout SS)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'GO', fielderIds: ['SS', '1B'], batterId: 'away-1' } } },
  { id: 'BTN-11', name: '4-3 (Groundout 2B)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'GO', fielderIds: ['2B', '1B'], batterId: 'away-2' } } },
  { id: 'BTN-12', name: '5-3 (Groundout 3B)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'GO', fielderIds: ['3B', '1B'], batterId: 'away-3' } } },
  { id: 'BTN-13', name: '1-3 (Groundout P)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'GO', fielderIds: ['P', '1B'], batterId: 'away-4' } } },
  { id: 'BTN-14', name: '3-1 (Groundout 1B)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'GO', fielderIds: ['1B', 'P'], batterId: 'away-5' } } },
  { id: 'BTN-15', name: 'F7 (Flyout LF)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'FO', fielderIds: ['LF'], batterId: 'away-6' } } },
  { id: 'BTN-16', name: 'F8 (Flyout CF)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'FO', fielderIds: ['CF'], batterId: 'away-7' } } },
  { id: 'BTN-17', name: 'F9 (Flyout RF)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'FO', fielderIds: ['RF'], batterId: 'away-8' } } },
  { id: 'BTN-18', name: '6-4-3 DP (Double Play)', requiresRunner: true, cmd: { type: 'RECORD_DOUBLE_PLAY', payload: { resultCode: 'DP_GROUND', batterId: 'away-9' } } },
  { id: 'BTN-19', name: 'SF (Sacrifice Fly)', cmd: { type: 'RECORD_SACRIFICE', payload: { resultCode: 'SAC_FLY', batterId: 'away-1' } } },
  { id: 'BTN-20', name: 'SH (Sacrifice Bunt)', cmd: { type: 'RECORD_SACRIFICE', payload: { resultCode: 'SAC_BUNT', batterId: 'away-2' } } },
  { id: 'BTN-21', name: 'ROE (Reached on Error)', cmd: { type: 'RECORD_ERROR', payload: { batterId: 'away-3' } } },
  { id: 'BTN-22', name: 'FC (Fielder Choice)', cmd: { type: 'RECORD_OUT', payload: { resultCode: 'FC', batterId: 'away-4' } } },
  { id: 'BTN-23', name: 'SB (Stolen Base)', requiresRunner: true, cmd: { type: 'RECORD_RUNNER_EVENT', payload: { action: 'SB' } } },
  { id: 'BTN-24', name: 'CS (Caught Stealing)', requiresRunner: true, cmd: { type: 'RECORD_RUNNER_EVENT', payload: { action: 'CS' } } },
  { id: 'BTN-25', name: 'WP (Wild Pitch)', requiresRunner: true, cmd: { type: 'RECORD_RUNNER_EVENT', payload: { action: 'WP' } } },
  { id: 'BTN-26', name: 'PB (Passed Ball)', requiresRunner: true, cmd: { type: 'RECORD_RUNNER_EVENT', payload: { action: 'PB' } } },
  { id: 'BTN-27', name: 'BK (Balk)', requiresRunner: true, cmd: { type: 'RECORD_RUNNER_EVENT', payload: { action: 'BK' } } },
  { id: 'BTN-28', name: 'Pitch Strike (Count/Pitcher Track)', cmd: { type: 'RECORD_PITCH', payload: { isStrike: true, pitchType: '4-SEAM' } } },
  { id: 'BTN-29', name: 'Pitch Ball (Count/Pitcher Track)', cmd: { type: 'RECORD_PITCH', payload: { isStrike: false, pitchType: 'CHANGEUP' } } }
];

commandsToTest.forEach(testCase => {
  const d = new CommandDispatcher();
  if (testCase.requiresRunner) {
    d.dispatch({ type: 'RECORD_HIT', payload: { resultCode: '1B', batterId: 'away-1' } });
  }
  const res = d.dispatch(testCase.cmd);
  const isValid = res.success && res.snapshot && res.snapshot.gameState && res.snapshot.reconciliation;
  assert(isValid, testCase.id, `Comando ${testCase.name} ejecuta el flujo canónico completo.`);
});

console.log(`\n?? RESULTADOS REGRESIÓN BOTONES: ${passCount} / ${commandsToTest.length} PASARON (100%)\n`);

if (failCount > 0) process.exit(1);
