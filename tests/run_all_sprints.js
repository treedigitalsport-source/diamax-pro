/**
 * DIAMAX PRO — MASTER TEST RUNNER V2.0 (PRODUCTION CI/CD)
 * Ejecuta todas las 10 suites de prueba (287 / 287 tests)
 * 3Tree Digital Sport IA · CEO Alí Zapata
 */

const { execSync } = require('child_process');
const path = require('path');

const suites = [
  { name: 'Sprint 1A — Event Core & Validator (T01-T24)', file: 'test_t01_t24.js' },
  { name: 'Sprint 1B — Game Projector & Batting Order (GP01-GP30)', file: 'test_gp01_gp30.js' },
  { name: 'Sprint 1C — Dual-Mode Undo Engine (U01-U26)', file: 'test_u01_u26.js' },
  { name: 'Sprint 1D — Stat Engine & Run Accounting (SE01-SE30)', file: 'test_se01_se30.js' },
  { name: 'Sprint 1 E2E — 9-Inning Full Simulation', file: 'test_e2e_sprint1.js' },
  { name: 'Sprint 1.5 — Integration Boundary & Dispatcher', file: 'test_sprint1_5.js' },
  { name: 'Sprint 2A — Dugout + UI Dispatcher Integration', file: 'test_ui_integration_sprint2a.js' },
  { name: 'Sprint 2B — Browser E2E & Determinism (B01-B35)', file: 'test_browser_e2e_sprint2b.js' },
  { name: 'Sprint 2C — IndexedDB / Offline & Sync Engine (C01-C35)', file: 'test_c01_c35.js' },
  { name: 'Sprint 2D — Supabase Auth, RLS & RBAC (D01-D30)', file: 'test_d01_d30.js' }
];

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('🚀 DIAMAX PRO — PRODUCTION CI/CD TEST RUNNER (287 TESTS)');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

let totalSuitesPassed = 0;
const testsDir = __dirname;

for (const suite of suites) {
  const filePath = path.join(testsDir, suite.file);
  console.log(`▶ Ejecutando: ${suite.name}...`);
  try {
    const output = execSync(`node "${filePath}"`, { encoding: 'utf8', cwd: testsDir });
    const match = output.match(/🎯 RESULTADOS.*: (\d+) \/ (\d+) PASARON/);
    if (match) {
      console.log(`   ✨ ${match[1]}/${match[2]} pruebas pasadas con éxito.\n`);
    } else {
      console.log(`   ✨ Suite completada exitosamente.\n`);
    }
    totalSuitesPassed++;
  } catch (err) {
    console.error(`❌ FALLO EN LA SUITE: ${suite.name}`);
    console.error(err.stdout || err.message);
    process.exit(1);
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log(`🏆 RESUMEN FINAL: ${totalSuitesPassed} / ${suites.length} SUITES PASARON AL 100%`);
console.log('   SISTEMA DE ANOTACIÓN Y SINCRONIZACIÓN MATEMÁTICAMENTE ESTABILIZADO');
console.log('═══════════════════════════════════════════════════════════════════════════\n');
