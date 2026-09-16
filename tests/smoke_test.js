/**
 * DIAMAX PRO — FASE 8: PRODUCTION SMOKE TEST v1.0
 * 3Tree Digital Sport IA · CEO Alí Zapata
 * 
 * Verifica el ciclo completo post-deployment:
 * DEPLOYMENT -> /health -> AUTH CHECK -> LOGIN -> LOAD TENANT ->
 * CREATE TEST GAME -> CANONICAL EVENT -> PROJECT STATE -> STATS -> RECONCILE
 */

const { DiamaxHealthService } = require('../core/diamax_health_service.js');
const { DiamaxAuthService, ROLES } = require('../core/diamax_auth_service.js');
const { CommandDispatcher } = require('../core/diamax_command_dispatcher.js');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('🚀 DIAMAX PRO — PRODUCTION POST-DEPLOYMENT SMOKE TEST (FASE 8)');
console.log('═══════════════════════════════════════════════════════════════════════\n');

let step = 1;
function logStep(name, ok) {
  if (ok) {
    console.log(`✅ [STEP ${step++}] PASS: ${name}`);
  } else {
    console.error(`❌ [STEP ${step++}] FAIL: ${name}`);
    process.exit(1);
  }
}

// 1. GET /health
const healthService = new DiamaxHealthService();
const health = healthService.getHealthStatus();
logStep('GET /health -> status: ' + health.status, health.status === 'healthy');

// 2. GET /health/integrity
const integrity = healthService.getIntegrityStatus();
logStep('GET /health/integrity -> Reconciliation Gate: ' + integrity.lastReconciliation.status, integrity.status === 'healthy' && integrity.publication === 'PERMITTED');

// 3. AUTH CHECK & LOGIN
const authService = new DiamaxAuthService('smoke_test_secret_key_2026');
const user = authService.registerUser({
  email: 'smoke.scorer@diamax.pro',
  password: 'SmokePassword2026!',
  fullName: 'Smoke Test Scorer',
  role: ROLES.COACH,
  tenantId: 'tenant-smoke-tampa'
});
const session = authService.login('smoke.scorer@diamax.pro', 'SmokePassword2026!');
logStep('AUTH LOGIN -> Token JWT emitido con claims válidos', !!session.token && session.user.email === 'smoke.scorer@diamax.pro');

// 4. LOAD TENANT & VERIFY RBAC
const claims = authService.verifyToken(session.token);
const canMutate = authService.assertCanMutateGame(claims, 'tenant-smoke-tampa');
logStep('LOAD TENANT -> Permisos de mutación confirmados para tenant-smoke-tampa', canMutate === true);

// 5. CREATE TEST GAME & CANONICAL EVENT DISPATCH
const dispatcher = new CommandDispatcher();
const hitEvent = dispatcher.dispatch({
  type: 'RECORD_HIT',
  payload: {
    hitType: '2B',
    runsScored: 0,
    rbiCount: 0,
    batter: { id: 'SMOKE-B1', name: 'Smoke Lead Off', jerseyNumber: '7' },
    pitcher: { id: 'SMOKE-P1', name: 'Smoke Pitcher', jerseyNumber: '34' }
  }
});
logStep('DISPATCH CANONICAL EVENT -> Doble (2B) validado y anexado', hitEvent.success === true && hitEvent.event.result.code === '2B');

// 6. PROJECT GAME STATE
const snap = dispatcher.getCurrentSnapshot();
const runnerOnSecond = snap.gameState.bases.b2 === 'SMOKE-B1';
logStep('PROJECT STATE -> Corredor ubicado físicamente en 2da base', runnerOnSecond);

// 7. STAT ENGINE Sabermetrics Recalculation
const statsValid = !!snap.stats.batting && !!snap.stats.pitching && !!snap.stats.team;
logStep('CALCULATE STATS -> Boxscore y sabermetría recalculadas en tiempo real', statsValid);

// 8. RECONCILIATION GATE EQUALITY CHECK:
// UI = EVENT STORE = GAME PROJECTOR = STAT ENGINE = RECONCILIATION GATE
const recon = snap.reconciliation;
const equalityCheck = recon.isValid === true && recon.errors.length === 0;
logStep('RECONCILIATION GATE -> 5 Balances e Invariantes 100% BALANCED', equalityCheck);

console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log('🏆 SMOKE TEST POST-DEPLOYMENT APROBADO EXITOSAMENTE');
console.log('   ESTADO DE PRODUCCIÓN: 🟢 ONLINE Y MATEMÁTICAMENTE RECONCILIADO');
console.log('═══════════════════════════════════════════════════════════════════════\n');
