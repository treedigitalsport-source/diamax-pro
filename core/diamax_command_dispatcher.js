/**
 * DIAMAX PRO — SPRINT 1.5: INTEGRATION BOUNDARY (COMMAND DISPATCHER)
 * =================================================================
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * 
 * Propósito:
 * Frontera arquitectónica estricta entre la UI (Dugout / Botones) y el Núcleo de Eventos.
 * La UI solo emite intenciones (Commands); el Dispatcher inspecciona el GameState actual,
 * construye el evento canónico exacto, lo valida físicamente, lo almacena, proyecta el nuevo
 * estado, recalcula sabermetría y verifica la reconciliación matemática.
 * 
 * Flujo:
 * Dugout UI Button (Intent) -> dispatchCommand() -> EventValidator -> EventStore ->
 * Projector -> Run Accounting -> Stat Engine -> Reconciliation Gate -> UI Consumer
 */

const {
  EventValidator,
  EventStore
} = require('./diamax_event_core.js');

const {
  createInitialGameState,
  buildSampleLineup
} = require('./diamax_game_projector.js');

const {
  projectGameStateWithReverts
} = require('./diamax_projector_revert.js');

const {
  UndoEngine
} = require('./diamax_undo_engine.js');

const {
  formatIP,
  formatDecimal,
  calculateRunAccounting,
  recalculateStatsFromEvents,
  reconcileGameStats
} = require('./diamax_stat_engine.js');

class CommandDispatcher {
  /**
   * @param {EventStore} eventStore 
   * @param {UndoEngine} undoEngine 
   * @param {Object} initialConfig 
   */
  constructor(eventStore, undoEngine = null, initialConfig = {}) {
    this.eventStore = eventStore || new EventStore();
    this.initialConfig = initialConfig;
    this.undoEngine = undoEngine || new UndoEngine(this.eventStore, initialConfig);
    this.listeners = [];
  }

  /**
   * Suscribe un renderizador o vista a las actualizaciones de estado
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  /**
   * Notifica a todos los suscriptores con el snapshot actual
   */
  notify(snapshot) {
    for (const listener of this.listeners) {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('[COMMAND_DISPATCHER_LISTENER_ERROR]:', err);
      }
    }
  }

  /**
   * Obtiene el estado consolidado actual (GameState, Stats, Reconciliación)
   */
  getCurrentSnapshot() {
    const rawEvents = this.eventStore.getAll();
    const gameState = projectGameStateWithReverts(rawEvents, this.initialConfig);
    const stats = recalculateStatsFromEvents(rawEvents, this.initialConfig);
    const reconciliation = reconcileGameStats(stats, gameState, rawEvents);

    return {
      gameState,
      stats,
      reconciliation,
      eventCount: rawEvents.length,
      rawEvents
    };
  }

  /**
   * Despacha un comando de UI hacia el núcleo canónico
   * @param {Object} command { type, payload, tenantId, clientEventId }
   * @returns {Object} Result snapshot
   */
  dispatch(command) {
    if (!command || !command.type) {
      return { success: false, error: 'INVALID_COMMAND_FORMAT', snapshot: this.getCurrentSnapshot() };
    }

    // Comandos de reversión / Undo / Redo
    if (command.type === 'UNDO') {
      const undoRes = this.undoEngine.undo();
      const snapshot = this.getCurrentSnapshot();
      this.notify(snapshot);
      return { success: undoRes.success, undoMode: undoRes.undoMode, snapshot, error: null };
    }

    if (command.type === 'REDO') {
      const redoRes = this.undoEngine.redo();
      const snapshot = this.getCurrentSnapshot();
      this.notify(snapshot);
      return { success: redoRes.success, snapshot, error: null };
    }

    // Obtener estado actual previo al comando
    const currentSnapshot = this.getCurrentSnapshot();
    const state = currentSnapshot.gameState;
    const isTop = state.half === 'TOP';

    // Determinar bateador y pitcher activos
    const offensiveTeam = isTop ? state.awayTeam : state.homeTeam;
    const defensiveTeam = isTop ? state.homeTeam : state.awayTeam;

    const currentBatterId = offensiveTeam && offensiveTeam.lineupState ? offensiveTeam.lineupState.currentBatterId : (isTop ? 'away-1' : 'home-1');
    const currentPitcherId = defensiveTeam && defensiveTeam.pitchingState ? defensiveTeam.pitchingState.activePitcherId : (isTop ? 'home-1' : 'away-1');

    const batterId = (command.payload && command.payload.batter && command.payload.batter.id) || (command.payload && command.payload.batterId) || currentBatterId;
    const pitcherId = (command.payload && command.payload.pitcher && command.payload.pitcher.id) || (command.payload && command.payload.pitcherId) || currentPitcherId;
    const tenantId = command.tenantId || this.initialConfig.tenantId || 'default-tenant';
    const gameId = command.gameId || this.initialConfig.gameId || 'default-game';

    const clientSeq = this.eventStore.getAll().length + 1;
    const clientEventId = command.clientEventId || `cmd-${Date.now()}-${clientSeq}`;

    // Construir la base del evento canónico a partir del GameState
    const canonicalEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      gameId,
      clientEventId,
      seq: clientSeq,
      orderingStatus: command.orderingStatus || 'CANONICAL',
      clientTimestamp: Date.now(),
      tenantId,
      inning: state.inning,
      half: state.half,
      outsBefore: state.outs,
      countBefore: { ...state.count },
      basesBefore: { ...state.bases },
      batterId,
      pitcherId,
      eventType: 'PLATE_APPEARANCE',
      result: {
        code: '',
        description: '',
        outsRecorded: 0,
        runsScored: [],
        rbi: 0,
        errors: []
      },
      fielderIds: (command.payload && command.payload.fielderIds) || [],
      basesAfter: { ...state.bases },
      outsAfter: state.outs,
      countAfter: { balls: 0, strikes: 0 },
      isHalfInningEnd: false
    };

    // Interpretar el comando de UI y poblar la semántica del evento
    switch (command.type) {
      case 'RECORD_PITCH': {
        canonicalEvent.eventType = 'PITCH';
        const isStrike = !!command.payload.isStrike;
        canonicalEvent.pitchDetails = {
          pitchType: command.payload.pitchType || '4-SEAM',
          velocity: command.payload.velocity || 0,
          isStrike,
          result: command.payload.pitchResult || (isStrike ? 'CALLED_STRIKE' : 'BALL')
        };
        canonicalEvent.plateAppearanceId = state.activePlateAppearanceId || `pa-${state.inning}-${state.half}-${batterId}`;
        
        let bAfter = state.count.balls + (isStrike ? 0 : 1);
        let sAfter = state.count.strikes + (isStrike ? 1 : 0);
        canonicalEvent.countAfter = { balls: bAfter, strikes: sAfter };
        break;
      }

      case 'RECORD_HIT': {
        const code = command.payload.resultCode || command.payload.hitType || '1B'; // 1B, 2B, 3B, HR
        const rbi = typeof command.payload.rbi === 'number' ? command.payload.rbi : (code === 'HR' ? 1 : 0);
        const runsScored = command.payload.runsScored || (code === 'HR' ? [batterId] : []);

        canonicalEvent.result = {
          code,
          description: command.payload.description || `Hit (${code})`,
          outsRecorded: 0,
          runsScored,
          rbi,
          errors: []
        };

        // Proyección física de bases tras el hit
        if (code === '1B') {
          canonicalEvent.basesAfter = { b1: batterId, b2: state.bases.b1, b3: state.bases.b2 };
        } else if (code === '2B') {
          canonicalEvent.basesAfter = { b1: null, b2: batterId, b3: state.bases.b1 };
        } else if (code === '3B') {
          canonicalEvent.basesAfter = { b1: null, b2: null, b3: batterId };
        } else if (code === 'HR') {
          canonicalEvent.basesAfter = { b1: null, b2: null, b3: null };
        }
        break;
      }

      case 'RECORD_OUT': {
        const code = command.payload.resultCode || command.payload.outType || 'GO'; // K_SWINGING, K_LOOKING, GO, FO, PO, LO
        canonicalEvent.result = {
          code,
          description: command.payload.description || `Out (${code})`,
          outsRecorded: 1,
          runsScored: command.payload.runsScored || [],
          rbi: command.payload.rbi || 0,
          errors: []
        };
        canonicalEvent.outsAfter = state.outs + 1;
        canonicalEvent.isHalfInningEnd = canonicalEvent.outsAfter >= 3;
        break;
      }

      case 'RECORD_WALK': {
        const code = command.payload.resultCode || command.payload.walkType || 'BB'; // BB, IBB, HBP
        canonicalEvent.result = {
          code,
          description: command.payload.description || `Base por bolas (${code})`,
          outsRecorded: 0,
          runsScored: command.payload.runsScored || [],
          rbi: command.payload.rbi || 0,
          errors: []
        };
        // Avance forzado de corredores
        canonicalEvent.basesAfter = {
          b1: batterId,
          b2: state.bases.b1 ? state.bases.b1 : state.bases.b2,
          b3: (state.bases.b1 && state.bases.b2) ? state.bases.b2 : state.bases.b3
        };
        break;
      }

      case 'RECORD_SACRIFICE': {
        const code = command.payload.resultCode || command.payload.sacType || 'SAC_FLY'; // SAC_FLY, SAC_BUNT
        const runsScored = command.payload.runsScored || [];
        const rbi = command.payload.rbi || (runsScored.length > 0 ? runsScored.length : 0);

        canonicalEvent.result = {
          code,
          description: command.payload.description || `Sacrificio (${code})`,
          outsRecorded: 1,
          runsScored,
          rbi,
          errors: []
        };
        canonicalEvent.outsAfter = state.outs + 1;
        canonicalEvent.isHalfInningEnd = canonicalEvent.outsAfter >= 3;
        if (code === 'SAC_BUNT' && command.payload.basesAfter) {
          canonicalEvent.basesAfter = command.payload.basesAfter;
        } else if (code === 'SAC_FLY') {
          canonicalEvent.basesAfter = { ...state.bases, b3: null };
        }
        break;
      }

      case 'RECORD_ERROR': {
        const errors = command.payload.errors || [{ fielderId: command.payload.fielderId || 'home-5', errorType: 'FIELDING', baseReached: 'b1' }];
        canonicalEvent.result = {
          code: 'ROE',
          description: 'Llegó a base por error defensivo',
          outsRecorded: 0,
          runsScored: command.payload.runsScored || [],
          rbi: 0,
          errors
        };
        canonicalEvent.basesAfter = { ...state.bases, b1: batterId };
        break;
      }

      case 'RECORD_DOUBLE_PLAY': {
        const code = command.payload.resultCode || 'DP_GROUND';
        canonicalEvent.result = {
          code,
          description: 'Doble Play',
          outsRecorded: 2,
          runsScored: command.payload.runsScored || [],
          rbi: 0,
          errors: []
        };
        canonicalEvent.outsAfter = state.outs + 2;
        canonicalEvent.isHalfInningEnd = canonicalEvent.outsAfter >= 3;
        canonicalEvent.basesAfter = { b1: null, b2: null, b3: state.bases.b3 };
        break;
      }

      case 'RECORD_RUNNER_EVENT': {
        const action = command.payload.action || command.payload.resultCode || 'SB'; // SB, CS, WP, PB
        canonicalEvent.eventType = 'RUNNER_EVENT';
        let newBases = { ...state.bases };
        let outsRecorded = 0;
        let runsScored = [];

        if (action === 'SB') {
          if (newBases.b2 && !newBases.b3) {
            newBases.b3 = newBases.b2;
            newBases.b2 = null;
          } else if (newBases.b1 && !newBases.b2) {
            newBases.b2 = newBases.b1;
            newBases.b1 = null;
          }
        } else if (action === 'WP' || action === 'PB' || action === 'BK') {
          if (newBases.b3) {
            runsScored.push(newBases.b3);
            newBases.b3 = null;
          }
          if (newBases.b2) {
            newBases.b3 = newBases.b2;
            newBases.b2 = null;
          }
          if (newBases.b1) {
            newBases.b2 = newBases.b1;
            newBases.b1 = null;
          }
        } else if (action === 'CS') {
          outsRecorded = 1;
          if (newBases.b2) newBases.b2 = null;
          else if (newBases.b1) newBases.b1 = null;
          else if (newBases.b3) newBases.b3 = null;
        }

        canonicalEvent.result = {
          code: action,
          description: command.payload.description || `Jugada de Corredor (${action})`,
          outsRecorded,
          runsScored,
          rbi: 0,
          errors: []
        };
        canonicalEvent.basesAfter = newBases;
        canonicalEvent.outsAfter = state.outs + outsRecorded;
        canonicalEvent.isHalfInningEnd = canonicalEvent.outsAfter >= 3;
        break;
      }

      case 'CHANGE_PITCHER': {
        canonicalEvent.eventType = 'SUBSTITUTION';
        canonicalEvent.substitution = {
          type: 'PITCHER_CHANGE',
          team: command.payload.team || (isTop ? 'home' : 'away'),
          outgoingPlayerId: pitcherId,
          incomingPlayerId: command.payload.newPitcherId
        };
        canonicalEvent.result = { code: 'PITCHER_CHANGE', outsRecorded: 0, runsScored: [], rbi: 0 };
        break;
      }

      default:
        return { success: false, error: `UNKNOWN_COMMAND_TYPE: ${command.type}`, snapshot: currentSnapshot };
    }

    // Validar el evento canónico antes de mutar el EventStore
    try {
      EventValidator.validate(canonicalEvent, this.eventStore, state);
    } catch (valErr) {
      return {
        success: false,
        error: valErr.message,
        code: valErr.code,
        rejectedEvent: canonicalEvent,
        snapshot: currentSnapshot
      };
    }

    // Anexar al EventStore
    this.eventStore.append(canonicalEvent);

    // Re-proyectar y verificar la reconciliación
    const newSnapshot = this.getCurrentSnapshot();
    this.notify(newSnapshot);

    return {
      success: true,
      event: canonicalEvent,
      snapshot: newSnapshot,
      error: null
    };
  }
}

module.exports = {
  CommandDispatcher
};
