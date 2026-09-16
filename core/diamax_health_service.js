const { EventStore } = require('./diamax_event_core.js');
const { projectGameStateWithReverts } = require('./diamax_projector_revert.js');
const { recalculateStatsFromEvents, reconcileGameStats } = require('./diamax_stat_engine.js');
const { CommandDispatcher } = require('./diamax_command_dispatcher.js');

class DiamaxHealthService {
  constructor(version = '2.4.0', environment = process.env.VITE_APP_ENV || 'production') {
    this.version = version;
    this.environment = environment;
  }

  getHealthStatus() {
    let appStatus = 'ok';
    let eventCoreStatus = 'ok';
    let projectorStatus = 'ok';
    let statEngineStatus = 'ok';
    let reconciliationStatus = 'ok';

    try {
      const store = new EventStore();
      if (!store || typeof store.append !== 'function') eventCoreStatus = 'error';

      const state = projectGameStateWithReverts([], { totalInnings: 9 });
      if (!state || state.inning !== 1 || state.half !== 'TOP') projectorStatus = 'error';

      const stats = recalculateStatsFromEvents([]);
      if (!stats || !stats.team || !stats.team.home || !stats.team.away) statEngineStatus = 'error';

      const recon = reconcileGameStats(stats, state, []);
      if (!recon || recon.isValid !== true) reconciliationStatus = 'error';
    } catch (e) {
      appStatus = 'degraded';
    }

    const allOk = [eventCoreStatus, projectorStatus, statEngineStatus, reconciliationStatus].every(s => s === 'ok');

    return {
      status: allOk ? 'healthy' : 'degraded',
      environment: this.environment,
      version: this.version,
      timestamp: new Date().toISOString(),
      checks: {
        application: appStatus,
        eventCore: eventCoreStatus,
        gameProjector: projectorStatus,
        statEngine: statEngineStatus,
        reconciliation: reconciliationStatus
      }
    };
  }

  getIntegrityStatus() {
    const timestamp = new Date().toISOString();
    try {
      const dispatcher = new CommandDispatcher();
      const resHit = dispatcher.dispatch({
        type: 'RECORD_HIT',
        payload: {
          hitType: 'HR',
          runsScored: 1,
          rbiCount: 1,
          batter: { id: 'B-PROD-TEST', name: 'Health Batter', jerseyNumber: '99' },
          pitcher: { id: 'P-PROD-TEST', name: 'Health Pitcher', jerseyNumber: '00' }
        }
      });

      if (!resHit || !resHit.success) throw new Error('No se pudo despachar el evento.');

      const snap = dispatcher.getCurrentSnapshot();
      const recon = snap.reconciliation;

      const runsOk = recon.balances && recon.balances.runs && recon.balances.runs.passed === true;
      const hitsOk = recon.balances && recon.balances.hits && recon.balances.hits.passed === true;
      const rbiOk = recon.balances && recon.balances.rbi && recon.balances.rbi.passed === true;
      const outsOk = recon.balances && recon.balances.outs && recon.balances.outs.passed === true;
      const errorsOk = recon.balances && recon.balances.errors && recon.balances.errors.passed === true;
      const paOk = recon.balances && recon.balances.internalPA ? recon.balances.internalPA.passed === true : true;
      const tbOk = recon.balances && recon.balances.internalTB ? recon.balances.internalTB.passed === true : true;

      const isBalanced = runsOk && hitsOk && rbiOk && outsOk && errorsOk && paOk && tbOk && recon.isValid;

      return {
        status: isBalanced ? 'healthy' : 'degraded',
        timestamp,
        integrity: {
          eventStore: snap.rawEvents.length === 1,
          gameProjector: snap.gameState.score.away === 1 || snap.gameState.score.home === 1,
          statEngine: snap.stats.batting !== undefined,
          reconciliationGate: isBalanced
        },
        lastReconciliation: {
          status: isBalanced ? 'BALANCED' : 'UNBALANCED',
          runs: runsOk,
          hits: hitsOk,
          rbi: rbiOk,
          outs: outsOk,
          errors: errorsOk,
          invariants: {
            plateAppearances: paOk,
            totalBases: tbOk
          }
        },
        publication: isBalanced ? 'PERMITTED' : 'BLOCKED'
      };
    } catch (err) {
      return {
        status: 'degraded',
        timestamp,
        integrity: { eventStore: false, gameProjector: false, statEngine: false, reconciliationGate: false },
        lastReconciliation: { status: 'ERROR', error: err.message },
        publication: 'BLOCKED'
      };
    }
  }
}

module.exports = { DiamaxHealthService };