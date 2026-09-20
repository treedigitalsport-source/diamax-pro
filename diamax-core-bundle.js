/**
 * DIAMAX PRO — UNIFIED CORE BUNDLE v2.5
 * =====================================
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DIAMAX_CORE = factory();
    if (typeof window !== 'undefined') {
      window.DIAMAX_DISPATCHER = new root.DIAMAX_CORE.CommandDispatcher();
    }
  }
})(typeof self !== 'undefined' ? self : this, function() {

/**
 * DIAMAX PRO — Event Core Engine v1.1
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * Implementación de Sprint 1A: Canonical Events, Validator V01-V16, EventStore, Replay
 */

class EventValidationError extends Error {
  constructor(code, message, event) {
    super(`[EVENT_VALIDATION_ERROR][${code}]: ${message}`);
    this.name = 'EventValidationError';
    this.code = code;
    this.rejectedEvent = event;
  }
}

class EventValidator {
  /**
   * Valida un CanonicalGameEvent contra el EventStore y el GameState proyectado previo
   * Reglas V01 a V16
   */
  static validate(event, eventStore, previousState = null) {
    if (!event) throw new EventValidationError('NULL_EVENT', 'El evento no puede ser nulo', {});

    // V01: Outs Previos Válidos (0..2)
    if (typeof event.outsBefore !== 'number' || event.outsBefore < 0 || event.outsBefore > 2) {
      throw new EventValidationError('INVALID_OUTS_BEFORE', `outsBefore debe estar en rango 0..2 (recibido: ${event.outsBefore})`, event);
    }

    // V02: Conteo de Bolas Válido (0..3)
    if (!event.countBefore || typeof event.countBefore.balls !== 'number' || event.countBefore.balls < 0 || event.countBefore.balls > 3) {
      throw new EventValidationError('INVALID_BALLS_COUNT', `countBefore.balls debe estar en rango 0..3`, event);
    }

    // V03: Conteo de Strikes Válido (0..2)
    if (typeof event.countBefore.strikes !== 'number' || event.countBefore.strikes < 0 || event.countBefore.strikes > 2) {
      throw new EventValidationError('INVALID_STRIKES_COUNT', `countBefore.strikes debe estar en rango 0..2`, event);
    }

    // V04: Inning Válido (>= 1)
    if (typeof event.inning !== 'number' || event.inning < 1 || !Number.isInteger(event.inning)) {
      throw new EventValidationError('INVALID_INNING', `inning debe ser un entero >= 1 (recibido: ${event.inning})`, event);
    }

    // V05: Detalle de Pitcheo obligatorio si eventType === 'PITCH'
    if (event.eventType === 'PITCH') {
      if (!event.pitchDetails || typeof event.pitchDetails.isStrike !== 'boolean') {
        throw new EventValidationError('MISSING_PITCH_DETAILS', 'Eventos de tipo PITCH requieren pitchDetails con isStrike', event);
      }
    }

    // V06: Jerarquía plateAppearanceId obligatoria en PITCH
    if (event.eventType === 'PITCH' && !event.plateAppearanceId) {
      throw new EventValidationError('MISSING_PLATE_APPEARANCE_ID', 'Eventos de tipo PITCH requieren plateAppearanceId', event);
    }

    // V08: Secuencia canónica no duplicada
    if (eventStore && event.seq !== undefined && eventStore.hasSeq(event.seq)) {
      throw new EventValidationError('DUPLICATE_CANONICAL_SEQ', `El seq ${event.seq} ya existe en el partido`, event);
    }

    // V09: Corredor duplicado en múltiples bases
    if (event.basesBefore) {
      const occupied = [event.basesBefore.b1, event.basesBefore.b2, event.basesBefore.b3].filter(Boolean);
      const unique = new Set(occupied);
      if (occupied.length !== unique.size) {
        throw new EventValidationError('CORRUPT_BASE_OCCUPANCY', 'Un mismo corredor no puede ocupar más de una base simultáneamente', event);
      }
    }

    // V10: Consistencia de outs (no decrecen a menos que termine la media entrada)
    if (typeof event.outsAfter === 'number' && event.outsAfter < event.outsBefore && !event.isHalfInningEnd) {
      throw new EventValidationError('OUTS_DECREMENT_WITHOUT_INNING_CHANGE', 'outsAfter no puede ser menor a outsBefore en la misma media entrada', event);
    }

    // V11: Límite de outs en media entrada (0..3)
    if (typeof event.outsAfter === 'number' && (event.outsAfter < 0 || event.outsAfter > 3)) {
      throw new EventValidationError('INVALID_OUTS_AFTER', `outsAfter debe estar entre 0 y 3 (recibido: ${event.outsAfter})`, event);
    }

    // V12: DP por el suelo requiere corredor en 1B
    if (event.result && event.result.code === 'DP_GROUND') {
      if (!event.basesBefore || !event.basesBefore.b1) {
        throw new EventValidationError('DP_REQUIRES_RUNNER_ON_FIRST', 'DP por el suelo requiere obligatoriamente corredor en 1B', event);
      }
    }

    // V14: Estructura válida de RBI (>= 0)
    if (event.result && typeof event.result.rbi === 'number' && event.result.rbi < 0) {
      throw new EventValidationError('RBI_STRUCTURAL_VALIDITY', 'rbi no puede ser un número negativo', event);
    }

    // V15: Pre-Event State Match (Comprueba coincidencia con el GameState proyectado previo)
    if (previousState) {
      if (event.inning !== previousState.inning || event.half !== previousState.half) {
        throw new EventValidationError('EVENT_CONTEXT_MISMATCH', `Inning/Half del evento (${event.inning} ${event.half}) no coincide con el estado actual (${previousState.inning} ${previousState.half})`, event);
      }
      if (event.outsBefore !== previousState.outs) {
        throw new EventValidationError('EVENT_CONTEXT_MISMATCH', `outsBefore (${event.outsBefore}) no coincide con outs actuales (${previousState.outs})`, event);
      }
      if (event.countBefore.balls !== previousState.count.balls || event.countBefore.strikes !== previousState.count.strikes) {
        throw new EventValidationError('EVENT_CONTEXT_MISMATCH', `countBefore (${event.countBefore.balls}-${event.countBefore.strikes}) no coincide con conteo actual (${previousState.count.balls}-${previousState.count.strikes})`, event);
      }
      if (event.basesBefore.b1 !== previousState.bases.b1 || event.basesBefore.b2 !== previousState.bases.b2 || event.basesBefore.b3 !== previousState.bases.b3) {
        throw new EventValidationError('EVENT_CONTEXT_MISMATCH', 'basesBefore no coincide con la ocupación de bases del estado previo', event);
      }

      // V16: Active PA Mismatch (PITCH debe pertenecer al PA activo si ya fue iniciado)
      if (event.eventType === 'PITCH' && previousState.activePlateAppearanceId && event.plateAppearanceId !== previousState.activePlateAppearanceId) {
        throw new EventValidationError('PLATE_APPEARANCE_CONTEXT_MISMATCH', `El lanzamiento tiene plateAppearanceId (${event.plateAppearanceId}) que difiere del PA activo en curso (${previousState.activePlateAppearanceId})`, event);
      }
    }

    return { valid: true };
  }
}

class EventStore {
  constructor() {
    this.events = [];
    this.clientIndex = new Set();
    this.seqIndex = new Set();
  }

  hasClientEventId(clientEventId) {
    return this.clientIndex.has(clientEventId);
  }

  hasSeq(seq) {
    return this.seqIndex.has(seq);
  }

  append(event, previousState = null) {
    // V07: Idempotencia estricta por clientEventId (No-Op)
    if (this.hasClientEventId(event.clientEventId)) {
      const existing = this.events.find(e => e.clientEventId === event.clientEventId);
      return { success: true, event: existing, isDuplicate: true };
    }

    // Validación formal V01 - V16
    EventValidator.validate(event, this, previousState);

    const frozen = Object.freeze(JSON.parse(JSON.stringify(event)));
    this.events.push(frozen);
    this.clientIndex.add(event.clientEventId);
    if (event.seq !== undefined) this.seqIndex.add(event.seq);

    return { success: true, event: frozen, isDuplicate: false };
  }

  /**
   * Reversión segura de eventos locales en estado PENDING
   */
  removeLastLocalPending() {
    if (this.events.length === 0) return null;
    const last = this.events[this.events.length - 1];
    if (last.orderingStatus === 'CANONICAL') {
      throw new Error('[EVENT_STORE_ERROR]: No se puede remover directamente un evento CANONICAL; requiere evento de corrección.');
    }
    const removed = this.events.pop();
    this.clientIndex.delete(removed.clientEventId);
    if (removed.seq !== undefined) this.seqIndex.delete(removed.seq);
    return removed;
  }

  getAll() {
    return [...this.events];
  }

  clear() {
    this.events = [];
    this.clientIndex.clear();
    this.seqIndex.clear();
  }
}

/**
 * Game Projector determinista puro
 */
function createInitialCleanGameState(gameId = 'game-001', tenantId = 'tenant-tampa-2026') {
  return {
    gameId,
    tenantId,
    status: 'IN_PROGRESS',
    inning: 1,
    half: 'TOP',
    outs: 0,
    count: { balls: 0, strikes: 0 },
    bases: { b1: null, b2: null, b3: null },
    score: { home: 0, away: 0, inningsHome: [0], inningsAway: [0] },
    activePlateAppearanceId: null,
    totalEventsProcessed: 0,
    lastEventId: null
  };
}

function projectGameState(events = [], initialConfig = {}) {
  const state = createInitialCleanGameState(initialConfig.gameId, initialConfig.tenantId);

  for (const event of events) {
    state.totalEventsProcessed++;
    state.lastEventId = event.id;

    if (event.eventType === 'PITCH') {
      state.activePlateAppearanceId = event.plateAppearanceId;
      state.count = { ...event.countAfter };
    } else if (event.eventType === 'PLATE_APPEARANCE' || event.eventType === 'RUNNER_EVENT') {
      state.activePlateAppearanceId = null; // Cierra PA
      state.bases = { ...event.basesAfter };
      state.outs = event.outsAfter >= 3 ? 0 : event.outsAfter;
      state.count = { ...event.countAfter };

      // Contabilidad de carreras
      if (event.result && Array.isArray(event.result.runsScored) && event.result.runsScored.length > 0) {
        const runs = event.result.runsScored.length;
        const currentInnIdx = state.inning - 1;

        if (state.half === 'TOP') {
          state.score.away += runs;
          while (state.score.inningsAway.length <= currentInnIdx) state.score.inningsAway.push(0);
          state.score.inningsAway[currentInnIdx] += runs;
        } else {
          state.score.home += runs;
          while (state.score.inningsHome.length <= currentInnIdx) state.score.inningsHome.push(0);
          state.score.inningsHome[currentInnIdx] += runs;
        }
      }

      // Transición de media entrada automática si hubo 3 outs
      if (event.isHalfInningEnd || event.outsAfter >= 3) {
        state.outs = 0;
        state.bases = { b1: null, b2: null, b3: null };
        state.count = { balls: 0, strikes: 0 };
        if (state.half === 'TOP') {
          state.half = 'BOTTOM';
        } else {
          state.half = 'TOP';
          state.inning++;
          state.score.inningsAway.push(0);
          state.score.inningsHome.push(0);
        }
      }
    }
  }

  return state;
}




/**
 * DIAMAX PRO — Exhaustive Game Projector (Sprint 1B)
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * Reconstruye el GameState completo exclusivamente a partir del stream de eventos canónicos.
 */



/**
 * Crea la configuración de alineación y fildeo inicial por defecto
 */
function createInitialTeamState(teamId, teamName, playerPrefix = 'p') {
  const lineup = [];
  const defensiveAssignments = {};

  const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];

  for (let i = 1; i <= 9; i++) {
    const pId = `${playerPrefix}-${i}`;
    const pName = `${teamName} Jugador ${i}`;
    const pos = positions[i - 1];

    lineup.push({
      order: i,
      playerId: pId,
      name: pName,
      position: pos,
      isSub: false,
      status: 'ACTIVE'
    });

    defensiveAssignments[pos] = pId;
  }

  const startingPitcherId = `${playerPrefix}-1`;

  return {
    id: teamId,
    name: teamName,
    lineupState: {
      slots: lineup,
      currentBatterIndex: 0, // Índice 0..8
      currentBatterId: lineup[0].playerId,
      substitutions: [],
      defensiveAssignments
    },
    pitchingState: {
      startingPitcherId,
      activePitcherId: startingPitcherId,
      pitchers: [startingPitcherId],
      pitchingChanges: []
    }
  };
}

/**
 * Crea el GameState limpio inicial
 */
function createInitialGameState(config = {}) {
  const gameId = config.gameId || 'game-001';
  const tenantId = config.tenantId || 'tenant-tampa-2026';
  const awayTeam = config.awayTeam ? JSON.parse(JSON.stringify(config.awayTeam)) : createInitialTeamState('team-away', 'Visitantes', 'away');
  const homeTeam = config.homeTeam ? JSON.parse(JSON.stringify(config.homeTeam)) : createInitialTeamState('team-home', 'Locales', 'home');

  return {
    gameId,
    tenantId,
    status: 'IN_PROGRESS',
    inning: 1,
    half: 'TOP',
    outs: 0,
    count: { balls: 0, strikes: 0 },
    bases: { b1: null, b2: null, b3: null },
    score: {
      home: 0,
      away: 0,
      inningsHome: [0],
      inningsAway: [0]
    },
    awayTeam,
    homeTeam,
    activePlateAppearanceId: null,
    totalEventsProcessed: 0,
    lastEventId: null,
    lastEventTimestamp: null
  };
}

/**
 * Obtiene el equipo ofensivo y defensivo según la media entrada actual
 */
function getActiveOffenseDefense(state) {
  if (state.half === 'TOP') {
    return { offense: state.awayTeam, defense: state.homeTeam };
  } else {
    return { offense: state.homeTeam, defense: state.awayTeam };
  }
}

/**
 * Proyecta una lista ordenada de eventos sobre un GameState determinista
 */
function projectGameState(events = [], initialConfig = {}) {
  const state = createInitialGameState(initialConfig);

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    state.totalEventsProcessed++;
    state.lastEventId = event.id;
    state.lastEventTimestamp = event.clientTimestamp || event.serverTimestamp || Date.now();

    if (event.inning) state.inning = Number(event.inning);
    if (event.half) {
      const hStr = String(event.half).toUpperCase();
      state.half = (hStr === 'BOT' || hStr === 'BOTTOM') ? 'BOTTOM' : 'TOP';
    }

    const { offense, defense } = getActiveOffenseDefense(state);

    // ── 1. SUSTITUCIONES (Bateador, Lanzador, Posición Defensiva) ─────────────
    if (event.eventType === 'SUBSTITUTION') {
      const sub = event.result && event.result.substitutionDetails;
      if (sub) {
        const targetTeam = sub.teamId === state.homeTeam.id ? state.homeTeam : state.awayTeam;

        // Sustitución de Lanzador
        if (sub.subType === 'PITCHER_CHANGE') {
          targetTeam.pitchingState.pitchingChanges.push({
            fromPitcherId: targetTeam.pitchingState.activePitcherId,
            toPitcherId: sub.inPlayerId,
            inning: state.inning,
            half: state.half,
            eventSeq: event.seq || state.totalEventsProcessed
          });
          targetTeam.pitchingState.activePitcherId = sub.inPlayerId;
          if (!targetTeam.pitchingState.pitchers.includes(sub.inPlayerId)) {
            targetTeam.pitchingState.pitchers.push(sub.inPlayerId);
          }
          targetTeam.lineupState.defensiveAssignments['P'] = sub.inPlayerId;
        }

        // Sustitución en el Orden al Bate (Pinch Hitter / Defensivo)
        if (sub.subType === 'LINEUP_CHANGE') {
          const slot = targetTeam.lineupState.slots.find(s => s.order === sub.lineupOrder || s.playerId === sub.outPlayerId);
          if (slot) {
            targetTeam.lineupState.substitutions.push({
              lineupOrder: slot.order,
              outPlayerId: slot.playerId,
              inPlayerId: sub.inPlayerId,
              inning: state.inning,
              half: state.half
            });
            slot.playerId = sub.inPlayerId;
            slot.name = sub.inPlayerName || `Jugador ${sub.inPlayerId}`;
            slot.isSub = true;
            if (sub.newPosition) slot.position = sub.newPosition;
          }
        }

        // Cambio de Asignación Defensiva (sin salir del juego)
        if (sub.subType === 'DEFENSIVE_REASSIGNMENT') {
          if (sub.newPosition && sub.inPlayerId) {
            targetTeam.lineupState.defensiveAssignments[sub.newPosition] = sub.inPlayerId;
            const slot = targetTeam.lineupState.slots.find(s => s.playerId === sub.inPlayerId);
            if (slot) slot.position = sub.newPosition;
          }
        }
      }
      continue;
    }

    // ── 2. LANZAMIENTO (PITCH) ────────────────────────────────────────────────
    if (event.eventType === 'PITCH') {
      state.activePlateAppearanceId = event.plateAppearanceId;
      state.count = { ...event.countAfter };
      continue;
    }

    // ── 3. DESENLACE DE TURNO AL BATE (PLATE_APPEARANCE) ──────────────────────
    if (event.eventType === 'PLATE_APPEARANCE') {
      state.activePlateAppearanceId = null; // Cierra PA activo
      state.bases = { ...event.basesAfter };
      state.count = { balls: 0, strikes: 0 }; // Resetea conteo
      state.outs = event.outsAfter;

      // Contabilidad de Carreras
      if (event.result && Array.isArray(event.result.runsScored) && event.result.runsScored.length > 0) {
        const runs = event.result.runsScored.length;
        const innIdx = state.inning - 1;

        if (state.half === 'TOP') {
          state.score.away += runs;
          while (state.score.inningsAway.length <= innIdx) state.score.inningsAway.push(0);
          state.score.inningsAway[innIdx] += runs;
        } else {
          state.score.home += runs;
          while (state.score.inningsHome.length <= innIdx) state.score.inningsHome.push(0);
          state.score.inningsHome[innIdx] += runs;
        }
      }

      // Avance estricto del orden al bate (1 -> 2 -> ... -> 9 -> 1)
      const currentTeamOffense = offense;
      const totalSlots = currentTeamOffense.lineupState.slots.length || 9;
      currentTeamOffense.lineupState.currentBatterIndex = (currentTeamOffense.lineupState.currentBatterIndex + 1) % totalSlots;
      currentTeamOffense.lineupState.currentBatterId = currentTeamOffense.lineupState.slots[currentTeamOffense.lineupState.currentBatterIndex].playerId;

      // Transición formal si hubo 3 outs
      if (event.isHalfInningEnd || event.outsAfter >= 3) {
        state.outs = 0;
        state.bases = { b1: null, b2: null, b3: null };
        state.count = { balls: 0, strikes: 0 };

        if (state.half === 'TOP') {
          state.half = 'BOTTOM';
        } else {
          state.half = 'TOP';
          state.inning++;
          state.score.inningsAway.push(0);
          state.score.inningsHome.push(0);
        }
      }
      continue;
    }

    // ── 4. EVENTOS DE CORREDORES / DEFENSIVOS ────────────────────────────────
    if (event.eventType === 'RUNNER_EVENT' || event.eventType === 'DEFENSIVE_EVENT') {
      state.bases = { ...event.basesAfter };
      state.outs = event.outsAfter;

      // Carreras anotadas por wild pitch / passed ball / balk / avance
      if (event.result && Array.isArray(event.result.runsScored) && event.result.runsScored.length > 0) {
        const runs = event.result.runsScored.length;
        const innIdx = state.inning - 1;

        if (state.half === 'TOP') {
          state.score.away += runs;
          while (state.score.inningsAway.length <= innIdx) state.score.inningsAway.push(0);
          state.score.inningsAway[innIdx] += runs;
        } else {
          state.score.home += runs;
          while (state.score.inningsHome.length <= innIdx) state.score.inningsHome.push(0);
          state.score.inningsHome[innIdx] += runs;
        }
      }

      // Transición si la jugada defensiva o caught stealing causó el 3er out
      if (event.isHalfInningEnd || event.outsAfter >= 3) {
        state.outs = 0;
        state.bases = { b1: null, b2: null, b3: null };
        state.count = { balls: 0, strikes: 0 };

        if (state.half === 'TOP') {
          state.half = 'BOTTOM';
        } else {
          state.half = 'TOP';
          state.inning++;
          state.score.inningsAway.push(0);
          state.score.inningsHome.push(0);
        }
      }
      continue;
    }

    // ── 5. TRANSICIÓN FORMAL DE INNING ───────────────────────────────────────
    if (event.eventType === 'INNING_TRANSITION') {
      state.outs = 0;
      state.bases = { b1: null, b2: null, b3: null };
      state.count = { balls: 0, strikes: 0 };
      state.activePlateAppearanceId = null;

      if (state.half === 'TOP') {
        state.half = 'BOTTOM';
      } else {
        state.half = 'TOP';
        state.inning++;
        state.score.inningsAway.push(0);
        state.score.inningsHome.push(0);
      }
    }
  }

  return state;
}




/**
 * DIAMAX PRO — Event Core & Projector Engine v1.2
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * Soporte de EVENT_REVERT Compensatorio para Eventos Canonizados y Undo Offline.
 */




/**
 * Re-proyecta el GameState considerando eventos canónicos activos y eventos de compensación (EVENT_REVERT)
 */
function projectGameStateWithReverts(rawEvents = [], initialConfig = {}) {
  // 1. Identificar eventos anulados por eventos de compensación EVENT_REVERT
  const revertedEventIds = new Set();
  for (const ev of rawEvents) {
    if (ev.eventType === 'EVENT_REVERT' && ev.result && ev.result.targetEventId) {
      revertedEventIds.add(ev.result.targetEventId);
    }
  }

  // 2. Filtrar el stream de ejecución activa (los eventos anulados se omiten en la proyección)
  const activeEvents = rawEvents.filter(ev => !revertedEventIds.has(ev.id) && ev.eventType !== 'EVENT_REVERT');

  const state = createInitialGameState(initialConfig);

  for (let i = 0; i < activeEvents.length; i++) {
    const event = activeEvents[i];
    state.totalEventsProcessed++;
    state.lastEventId = event.id;
    state.lastEventTimestamp = event.clientTimestamp || event.serverTimestamp || Date.now();

    if (event.inning) state.inning = Number(event.inning);
    if (event.half) {
      const hStr = String(event.half).toUpperCase();
      state.half = (hStr === 'BOT' || hStr === 'BOTTOM') ? 'BOTTOM' : 'TOP';
    }

    const { offense, defense } = getActiveOffenseDefense(state);

    // ── 1. SUSTITUCIONES ──────────────────────────────────────────────────────
    if (event.eventType === 'SUBSTITUTION') {
      const sub = event.result && event.result.substitutionDetails;
      if (sub) {
        const targetTeam = sub.teamId === state.homeTeam.id ? state.homeTeam : state.awayTeam;

        if (sub.subType === 'PITCHER_CHANGE') {
          targetTeam.pitchingState.pitchingChanges.push({
            fromPitcherId: targetTeam.pitchingState.activePitcherId,
            toPitcherId: sub.inPlayerId,
            inning: state.inning,
            half: state.half,
            eventSeq: event.seq || state.totalEventsProcessed
          });
          targetTeam.pitchingState.activePitcherId = sub.inPlayerId;
          if (!targetTeam.pitchingState.pitchers.includes(sub.inPlayerId)) {
            targetTeam.pitchingState.pitchers.push(sub.inPlayerId);
          }
          targetTeam.lineupState.defensiveAssignments['P'] = sub.inPlayerId;
        }

        if (sub.subType === 'LINEUP_CHANGE') {
          const slot = targetTeam.lineupState.slots.find(s => s.order === sub.lineupOrder || s.playerId === sub.outPlayerId);
          if (slot) {
            targetTeam.lineupState.substitutions.push({
              lineupOrder: slot.order,
              outPlayerId: slot.playerId,
              inPlayerId: sub.inPlayerId,
              inning: state.inning,
              half: state.half
            });
            slot.playerId = sub.inPlayerId;
            slot.name = sub.inPlayerName || `Jugador ${sub.inPlayerId}`;
            slot.isSub = true;
            if (sub.newPosition) slot.position = sub.newPosition;
          }
        }

        if (sub.subType === 'DEFENSIVE_REASSIGNMENT') {
          if (sub.newPosition && sub.inPlayerId) {
            targetTeam.lineupState.defensiveAssignments[sub.newPosition] = sub.inPlayerId;
            const slot = targetTeam.lineupState.slots.find(s => s.playerId === sub.inPlayerId);
            if (slot) slot.position = sub.newPosition;
          }
        }
      }
      continue;
    }

    // ── 2. LANZAMIENTO (PITCH) ────────────────────────────────────────────────
    if (event.eventType === 'PITCH') {
      state.activePlateAppearanceId = event.plateAppearanceId;
      state.count = { ...event.countAfter };
      continue;
    }

    // ── 3. DESENLACE DE TURNO AL BATE (PLATE_APPEARANCE) ──────────────────────
    if (event.eventType === 'PLATE_APPEARANCE') {
      state.activePlateAppearanceId = null;
      state.bases = { ...event.basesAfter };
      state.count = { balls: 0, strikes: 0 };
      state.outs = event.outsAfter;

      if (event.result && Array.isArray(event.result.runsScored) && event.result.runsScored.length > 0) {
        const runs = event.result.runsScored.length;
        const innIdx = state.inning - 1;

        if (state.half === 'TOP') {
          state.score.away += runs;
          while (state.score.inningsAway.length <= innIdx) state.score.inningsAway.push(0);
          state.score.inningsAway[innIdx] += runs;
        } else {
          state.score.home += runs;
          while (state.score.inningsHome.length <= innIdx) state.score.inningsHome.push(0);
          state.score.inningsHome[innIdx] += runs;
        }
      }

      const currentTeamOffense = offense;
      const totalSlots = currentTeamOffense.lineupState.slots.length || 9;
      currentTeamOffense.lineupState.currentBatterIndex = (currentTeamOffense.lineupState.currentBatterIndex + 1) % totalSlots;
      currentTeamOffense.lineupState.currentBatterId = currentTeamOffense.lineupState.slots[currentTeamOffense.lineupState.currentBatterIndex].playerId;

      if (event.isHalfInningEnd || event.outsAfter >= 3) {
        state.outs = 0;
        state.bases = { b1: null, b2: null, b3: null };
        state.count = { balls: 0, strikes: 0 };

        if (state.half === 'TOP') {
          state.half = 'BOTTOM';
        } else {
          state.half = 'TOP';
          state.inning++;
          state.score.inningsAway.push(0);
          state.score.inningsHome.push(0);
        }
      }
      continue;
    }

    // ── 4. EVENTOS DE CORREDORES / DEFENSIVOS ────────────────────────────────
    if (event.eventType === 'RUNNER_EVENT' || event.eventType === 'DEFENSIVE_EVENT') {
      state.bases = { ...event.basesAfter };
      state.outs = event.outsAfter;

      if (event.result && Array.isArray(event.result.runsScored) && event.result.runsScored.length > 0) {
        const runs = event.result.runsScored.length;
        const innIdx = state.inning - 1;

        if (state.half === 'TOP') {
          state.score.away += runs;
          while (state.score.inningsAway.length <= innIdx) state.score.inningsAway.push(0);
          state.score.inningsAway[innIdx] += runs;
        } else {
          state.score.home += runs;
          while (state.score.inningsHome.length <= innIdx) state.score.inningsHome.push(0);
          state.score.inningsHome[innIdx] += runs;
        }
      }

      if (event.isHalfInningEnd || event.outsAfter >= 3) {
        state.outs = 0;
        state.bases = { b1: null, b2: null, b3: null };
        state.count = { balls: 0, strikes: 0 };

        if (state.half === 'TOP') {
          state.half = 'BOTTOM';
        } else {
          state.half = 'TOP';
          state.inning++;
          state.score.inningsAway.push(0);
          state.score.inningsHome.push(0);
        }
      }
      continue;
    }

    // ── 5. TRANSICIÓN DE ENTRADA ─────────────────────────────────────────────
    if (event.eventType === 'INNING_TRANSITION') {
      state.outs = 0;
      state.bases = { b1: null, b2: null, b3: null };
      state.count = { balls: 0, strikes: 0 };
      state.activePlateAppearanceId = null;

      if (state.half === 'TOP') {
        state.half = 'BOTTOM';
      } else {
        state.half = 'TOP';
        state.inning++;
        state.score.inningsAway.push(0);
        state.score.inningsHome.push(0);
      }
    }
  }

  return state;
}




/**
 * DIAMAX PRO — Dual-Mode Undo Engine v1.2
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * Manejo formal de PENDING_LOCAL (discard) y CANONICAL_REVERT (compensating event)
 */




class UndoEngine {
  constructor(eventStore, initialConfig = {}) {
    this.eventStore = eventStore;
    this.redoStack = [];
    this.initialConfig = initialConfig;
  }

  /**
   * Ejecuta UNDO diferenciando PENDING de CANONICAL
   */
  undo() {
    const allEvents = this.eventStore.getAll();
    if (allEvents.length === 0) {
      return {
        success: false,
        undoMode: null,
        revertedEvent: null,
        newState: projectGameStateWithReverts([], this.initialConfig),
        remainingEventsCount: 0,
        canUndoAgain: false,
        canRedo: this.redoStack.length > 0
      };
    }

    const lastEvent = allEvents[allEvents.length - 1];

    // MODO 1: PENDING_LOCAL -> Remueve de memoria/cola local de forma segura
    if (lastEvent.orderingStatus === 'PENDING') {
      const removed = this.eventStore.removeLastLocalPending();
      if (removed) {
        this.redoStack.push({ mode: 'PENDING_LOCAL', event: removed });
      }

      const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
      return {
        success: true,
        undoMode: 'PENDING_LOCAL',
        revertedEvent: removed,
        newState,
        remainingEventsCount: this.eventStore.getAll().length,
        canUndoAgain: this.eventStore.getAll().length > 0,
        canRedo: true
      };
    }

    // MODO 2: CANONICAL_REVERT -> Nunca elimina el evento; emite un evento canónico compensatorio
    if (lastEvent.orderingStatus === 'CANONICAL') {
      const revertEvent = {
        id: 'rev-' + Math.random().toString(36).substr(2, 9),
        gameId: lastEvent.gameId,
        clientEventId: 'c-rev-' + Math.random().toString(36).substr(2, 9),
        seq: (lastEvent.seq || allEvents.length) + 1,
        orderingStatus: 'CANONICAL',
        clientTimestamp: Date.now(),
        tenantId: lastEvent.tenantId,
        inning: lastEvent.inning,
        half: lastEvent.half,
        outsBefore: lastEvent.outsBefore,
        countBefore: { ...lastEvent.countBefore },
        basesBefore: { ...lastEvent.basesBefore },
        eventType: 'EVENT_REVERT',
        result: {
          code: 'EVENT_REVERT',
          description: `Compensación/Reversión de Evento Canónico ${lastEvent.id}`,
          targetEventId: lastEvent.id,
          outsRecorded: 0,
          runsScored: [],
          rbi: 0
        },
        basesAfter: { ...lastEvent.basesBefore },
        outsAfter: lastEvent.outsBefore,
        countAfter: { ...lastEvent.countBefore },
        isHalfInningEnd: false
      };

      // Guarda el evento compensatorio en el EventStore (conservando la historia intacta)
      this.eventStore.append(revertEvent);
      this.redoStack.push({ mode: 'CANONICAL_REVERT', targetEvent: lastEvent, revertEventId: revertEvent.id });

      const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
      return {
        success: true,
        undoMode: 'CANONICAL_REVERT',
        revertedEvent: lastEvent,
        revertEvent,
        newState,
        remainingEventsCount: this.eventStore.getAll().length,
        canUndoAgain: true,
        canRedo: true
      };
    }
  }

  /**
   * Ejecuta REDO
   */
  redo() {
    if (this.redoStack.length === 0) {
      return {
        success: false,
        reappliedEvent: null,
        newState: projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig),
        remainingEventsCount: this.eventStore.getAll().length,
        canUndo: this.eventStore.getAll().length > 0,
        canRedoAgain: false
      };
    }

    const item = this.redoStack.pop();

    if (item.mode === 'PENDING_LOCAL') {
      // Reinserta el evento pendiente
      this.eventStore.append(item.event);
      const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
      return {
        success: true,
        reappliedEvent: item.event,
        newState,
        remainingEventsCount: this.eventStore.getAll().length,
        canUndo: true,
        canRedoAgain: this.redoStack.length > 0
      };
    }

    if (item.mode === 'CANONICAL_REVERT') {
      // Para un evento canónico, emite una nueva acción reactivada con nuevo clientEventId
      const newAction = {
        ...item.targetEvent,
        id: 'reactivate-' + Math.random().toString(36).substr(2, 9),
        clientEventId: 'c-reactivate-' + Math.random().toString(36).substr(2, 9),
        seq: this.eventStore.getAll().length + 1,
        clientTimestamp: Date.now()
      };
      this.eventStore.append(newAction);
      const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
      return {
        success: true,
        reappliedEvent: newAction,
        newState,
        remainingEventsCount: this.eventStore.getAll().length,
        canUndo: true,
        canRedoAgain: this.redoStack.length > 0
      };
    }
  }

  getHistory() {
    return this.eventStore.getAll();
  }
}




/**
 * DIAMAX PRO — Stat Engine & Run Accounting v1.2
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * Implementación de Sprint 1D: Única Fuente de Verdad Matemática y Reconciliación Contable.
 */

class StatEngineError extends Error {
  constructor(message, report = {}) {
    super(`[STAT_ENGINE_ERROR]: ${message}`);
    this.name = 'StatEngineError';
    this.report = report;
  }
}

/**
 * Formatea outs lanzados (IPouts) a notación visual béisbol (ej. 17 -> "5.2")
 */
function formatIP(ipOuts = 0) {
  const fullInnings = Math.floor(ipOuts / 3);
  const remainderOuts = ipOuts % 3;
  return `${fullInnings}.${remainderOuts}`;
}

/**
 * Formatea decimales de bateo (.300, .450, 1.000)
 */
function formatDecimal(val, decimals = 3) {
  if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
    return decimals === 3 ? '.000' : '0.00';
  }
  if (decimals === 3) {
    if (val === 0) return '.000';
    if (val >= 1) return val.toFixed(3);
    return val.toFixed(3).replace(/^0/, '');
  }
  return val.toFixed(decimals);
}

/**
 * Algoritmo de Run Accounting: analiza cada media entrada y genera la trazabilidad auditable de carreras
 */
function calculateRunAccounting(events = []) {
  const halfInnings = {};
  for (const ev of events) {
    const key = `${ev.inning}-${ev.half}`;
    if (!halfInnings[key]) halfInnings[key] = [];
    halfInnings[key].push(ev);
  }

  const runAuditTrail = []; // Array de RunAuditRecord
  const runClassification = {}; // eventId -> { earnedRuns: number, unearnedRuns: number }
  const pitcherRuns = {}; // pitcherId -> { er: number, uer: number, totalR: number }

  for (const [halfKey, halfEvents] of Object.entries(halfInnings)) {
    let hypotheticalOuts = 0;
    let actualOuts = 0;
    const runnersReachedOnError = new Map(); // runnerId -> originEventId

    for (const ev of halfEvents) {
      const pId = ev.pitcherId || 'unknown-pitcher';
      if (!pitcherRuns[pId]) pitcherRuns[pId] = { er: 0, uer: 0, totalR: 0 };

      const res = ev.result || {};
      const runsScored = Array.isArray(res.runsScored) ? res.runsScored : [];
      let evEr = 0;
      let evUer = 0;

      const hadError = (Array.isArray(res.errors) && res.errors.length > 0) || (res.code === 'ROE');
      const outsInPlay = (typeof res.outsRecorded === 'number') ? res.outsRecorded : 0;

      if (res.code === 'ROE' && ev.batterId) {
        runnersReachedOnError.set(ev.batterId, ev.id);
      }

      const inningShouldBeOver = hypotheticalOuts >= 3;

      for (const runnerId of runsScored) {
        pitcherRuns[pId].totalR++;
        let earnedStatus = 'EARNED';
        let reasonCode = 'CLEAN_PLAY';
        let originEventId = null;

        if (inningShouldBeOver) {
          earnedStatus = 'UNEARNED';
          reasonCode = 'INNING_TERMINATED_HYPOTHETICALLY';
        } else if (runnersReachedOnError.has(runnerId)) {
          earnedStatus = 'UNEARNED';
          reasonCode = 'RUNNER_REACHED_ON_ROE';
          originEventId = runnersReachedOnError.get(runnerId);
        } else if (res.code === 'ROE' || res.code === 'PB') {
          earnedStatus = 'UNEARNED';
          reasonCode = res.code === 'ROE' ? 'RUN_SCORED_ON_ERROR' : 'PASSED_BALL';
        }

        if (earnedStatus === 'EARNED') {
          evEr++;
          pitcherRuns[pId].er++;
        } else {
          evUer++;
          pitcherRuns[pId].uer++;
        }

        runAuditTrail.push({
          runId: `run-${halfKey}-${runAuditTrail.length + 1}`,
          halfKey,
          scorerId: runnerId,
          pitcherId: pId,
          originEventId: originEventId || ev.id,
          scoringEventId: ev.id,
          earnedStatus,
          reasonCode
        });
      }

      actualOuts += outsInPlay;
      hypotheticalOuts += outsInPlay + (hadError ? 1 : 0);

      runClassification[ev.id] = { earnedRuns: evEr, unearnedRuns: evUer };
    }
  }

  return { runAuditTrail, runClassification, pitcherRuns };
}

/**
 * Recalcula de manera determinista todas las estadísticas del partido a partir de los eventos
 */
function recalculateStatsFromEvents(rawEvents = [], initialConfig = {}) {
  // Filtrar eventos anulados por EVENT_REVERT
  const revertedEventIds = new Set();
  for (const ev of rawEvents) {
    if (ev.eventType === 'EVENT_REVERT' && ev.result && ev.result.targetEventId) {
      revertedEventIds.add(ev.result.targetEventId);
    }
  }
  const events = rawEvents.filter(ev => !revertedEventIds.has(ev.id) && ev.eventType !== 'EVENT_REVERT');

  const { runAuditTrail, runClassification, pitcherRuns } = calculateRunAccounting(events);

  const batting = {};
  const pitching = {};
  const fielding = {};
  const team = {
    home: { pa: 0, ab: 0, h: 0, tb: 0, r: 0, rbi: 0, bb: 0, so: 0, hr: 0, er: 0, errors: 0, ipOuts: 0, dp: 0 },
    away: { pa: 0, ab: 0, h: 0, tb: 0, r: 0, rbi: 0, bb: 0, so: 0, hr: 0, er: 0, errors: 0, ipOuts: 0, dp: 0 }
  };

  function getBatting(pId, name = '') {
    if (!batting[pId]) {
      batting[pId] = {
        playerId: pId, name: name || pId,
        pa: 0, ab: 0, h: 0, h1: 0, h2: 0, h3: 0, hr: 0,
        r: 0, rbi: 0, bb: 0, ibb: 0, hbp: 0, so: 0,
        sf: 0, sh: 0, tb: 0, avg: 0, obp: 0, slg: 0, ops: 0,
        iso: 0, babip: 0, avgStr: '.000', obpStr: '.000', slgStr: '.000', opsStr: '.000'
      };
    }
    return batting[pId];
  }

  function getPitching(pId, name = '') {
    if (!pitching[pId]) {
      pitching[pId] = {
        playerId: pId, name: name || pId,
        ipOuts: 0, ipVisual: '0.0', bf: 0, h: 0, r: 0, er: 0, uer: 0,
        bb: 0, ibb: 0, k: 0, hr: 0, wp: 0, bk: 0, pitches: 0, strikes: 0, balls: 0,
        era: 'N/A', whip: 'N/A', k9: 'N/A', bb9: 'N/A', kbbRatio: 'N/A'
      };
    }
    return pitching[pId];
  }

  function getFielding(pId) {
    if (!fielding[pId]) {
      fielding[pId] = { playerId: pId, po: 0, a: 0, e: 0, dp: 0, tc: 0, fldPct: 1.0, fldPctStr: '1.000' };
    }
    return fielding[pId];
  }

  for (const ev of events) {
    const isTop = ev.half === 'TOP';
    const battingTeamKey = isTop ? 'away' : 'home';
    const pitchingTeamKey = isTop ? 'home' : 'away';

    const bId = ev.batterId;
    const pId = ev.pitcherId;

    if (ev.eventType === 'PITCH' && pId) {
      const pStats = getPitching(pId);
      pStats.pitches++;
      if (ev.pitchDetails && ev.pitchDetails.isStrike) {
        pStats.strikes++;
      } else {
        pStats.balls++;
      }
    }

    if (ev.eventType === 'PLATE_APPEARANCE') {
      const res = ev.result || {};
      const code = res.code;

      if (bId) {
        const b = getBatting(bId);
        b.pa++;
        team[battingTeamKey].pa++;

        if (code === '1B') { b.ab++; b.h++; b.h1++; b.tb += 1; team[battingTeamKey].ab++; team[battingTeamKey].h++; team[battingTeamKey].tb += 1; }
        else if (code === '2B') { b.ab++; b.h++; b.h2++; b.tb += 2; team[battingTeamKey].ab++; team[battingTeamKey].h++; team[battingTeamKey].tb += 2; }
        else if (code === '3B') { b.ab++; b.h++; b.h3++; b.tb += 3; team[battingTeamKey].ab++; team[battingTeamKey].h++; team[battingTeamKey].tb += 3; }
        else if (code === 'HR' || code === 'HR_INSIDE_PARK') { b.ab++; b.h++; b.hr++; b.tb += 4; team[battingTeamKey].ab++; team[battingTeamKey].h++; team[battingTeamKey].hr++; team[battingTeamKey].tb += 4; }
        else if (code === 'BB') { b.bb++; team[battingTeamKey].bb++; }
        else if (code === 'IBB') { b.bb++; b.ibb++; team[battingTeamKey].bb++; }
        else if (code === 'HBP') { b.hbp++; }
        else if (code === 'SAC_FLY') { b.sf++; }
        else if (code === 'SAC_BUNT') { b.sh++; }
        else if (code === 'K_SWINGING' || code === 'K_LOOKING') { b.ab++; b.so++; team[battingTeamKey].ab++; team[battingTeamKey].so++; }
        else if (code === 'GO' || code === 'FO' || code === 'PO' || code === 'LO' || code === 'DP_GROUND' || code === 'DP_AIR' || code === 'TP' || code === 'ROE' || code === 'FC') {
          b.ab++;
          team[battingTeamKey].ab++;
        }

        if (typeof res.rbi === 'number' && res.rbi > 0) {
          b.rbi += res.rbi;
          team[battingTeamKey].rbi += res.rbi;
        }
      }

      if (pId) {
        const p = getPitching(pId);
        p.bf++;
        const outsRecorded = res.outsRecorded || 0;
        p.ipOuts += outsRecorded;
        team[pitchingTeamKey].ipOuts += outsRecorded;

        if (code === '1B' || code === '2B' || code === '3B' || code === 'HR' || code === 'HR_INSIDE_PARK') {
          p.h++;
        }
        if (code === 'HR' || code === 'HR_INSIDE_PARK') p.hr++;
        if (code === 'BB' || code === 'IBB') p.bb++;
        if (code === 'IBB') p.ibb++;
        if (code === 'K_SWINGING' || code === 'K_LOOKING') p.k++;

        const erInfo = runClassification[ev.id] || { earnedRuns: 0, unearnedRuns: 0 };
        p.er += erInfo.earnedRuns;
        p.uer += erInfo.unearnedRuns;
        p.r += (erInfo.earnedRuns + erInfo.unearnedRuns);
        team[pitchingTeamKey].er += erInfo.earnedRuns;
      }

      if (Array.isArray(res.runsScored)) {
        for (const runnerId of res.runsScored) {
          const runner = getBatting(runnerId);
          runner.r++;
          team[battingTeamKey].r++;
        }
      }

      // Fildeo y Double Plays
      if (code === 'DP_GROUND' || code === 'DP_AIR') {
        team[pitchingTeamKey].dp++; // Team DP = 1
        if (Array.isArray(ev.fielderIds)) {
          for (const fId of ev.fielderIds) {
            getFielding(fId).dp++; // DP_f = 1 para cada fildeador participante
          }
        }
      }

      if (Array.isArray(ev.fielderIds)) {
        if ((code === 'GO' || code === 'SAC_BUNT') && ev.fielderIds.length >= 2) {
          getFielding(ev.fielderIds[0]).a++;
          getFielding(ev.fielderIds[1]).po++;
        } else if ((code === 'FO' || code === 'PO' || code === 'LO' || code === 'SAC_FLY') && ev.fielderIds.length >= 1) {
          getFielding(ev.fielderIds[0]).po++;
        } else if (code === 'K_SWINGING' || code === 'K_LOOKING') {
          if (ev.catcherId) getFielding(ev.catcherId).po++;
        }
      }

      if (Array.isArray(res.errors)) {
        for (const err of res.errors) {
          getFielding(err.fielderId).e++;
          team[pitchingTeamKey].errors++;
        }
      }
    }

    if (ev.eventType === 'RUNNER_EVENT') {
      const res = ev.result || {};
      if (res.code === 'CS' && pId) {
        const p = getPitching(pId);
        p.ipOuts += (res.outsRecorded || 1);
        team[pitchingTeamKey].ipOuts += (res.outsRecorded || 1);
      }
      if (Array.isArray(res.runsScored)) {
        for (const runnerId of res.runsScored) {
          getBatting(runnerId).r++;
          team[battingTeamKey].r++;
        }
      }
    }
  }

  for (const b of Object.values(batting)) {
    b.avg = b.ab > 0 ? (b.h / b.ab) : 0;
    const obpDenom = b.ab + b.bb + b.hbp + b.sf;
    b.obp = obpDenom > 0 ? ((b.h + b.bb + b.hbp) / obpDenom) : 0;
    b.slg = b.ab > 0 ? (b.tb / b.ab) : 0;
    b.ops = b.obp + b.slg;
    b.iso = b.slg - b.avg;

    const babipDenom = b.ab - b.so - b.hr + b.sf;
    b.babip = babipDenom > 0 ? ((b.h - b.hr) / babipDenom) : 0;

    b.avgStr = formatDecimal(b.avg, 3);
    b.obpStr = formatDecimal(b.obp, 3);
    b.slgStr = formatDecimal(b.slg, 3);
    b.opsStr = formatDecimal(b.ops, 3);
  }

  for (const p of Object.values(pitching)) {
    p.ipVisual = formatIP(p.ipOuts);
    if (p.ipOuts > 0) {
      const eraNum = (p.er * 27) / p.ipOuts;
      const whipNum = ((p.bb + p.h) * 3) / p.ipOuts;
      const k9Num = (p.k * 27) / p.ipOuts;
      const bb9Num = (p.bb * 27) / p.ipOuts;

      p.era = eraNum.toFixed(2);
      p.whip = whipNum.toFixed(2);
      p.k9 = k9Num.toFixed(2);
      p.bb9 = bb9Num.toFixed(2);
      p.kbbRatio = p.bb > 0 ? (p.k / p.bb).toFixed(2) : 'N/A';
    } else {
      p.era = 'N/A';
      p.whip = 'N/A';
      p.k9 = 'N/A';
      p.bb9 = 'N/A';
      p.kbbRatio = 'N/A';
    }
  }

  for (const f of Object.values(fielding)) {
    f.tc = f.po + f.a + f.e;
    f.fldPct = f.tc > 0 ? ((f.po + f.a) / f.tc) : 1.0;
    f.fldPctStr = formatDecimal(f.fldPct, 3);
  }

  return { batting, pitching, fielding, team, runAuditTrail, totalEvents: events.length };
}

/**
 * Reconciliation Gate: Verifica los 5 balances públicos + 2 invariantes internas (PA y TB)
 */
function reconcileGameStats(stats, gameState, rawEvents = []) {
  const errors = [];

  // Filtrar eventos anulados por EVENT_REVERT
  const revertedEventIds = new Set();
  for (const ev of rawEvents) {
    if (ev.eventType === 'EVENT_REVERT' && ev.result && ev.result.targetEventId) {
      revertedEventIds.add(ev.result.targetEventId);
    }
  }
  const events = rawEvents.filter(ev => !revertedEventIds.has(ev.id) && ev.eventType !== 'EVENT_REVERT');

  // 1. Balance de Carreras
  const totalRunsEvents = events.reduce((sum, ev) => sum + ((ev.result && Array.isArray(ev.result.runsScored)) ? ev.result.runsScored.length : 0), 0);
  const totalRunsBoxscore = Object.values(stats.batting).reduce((sum, b) => sum + b.r, 0);
  const totalRunsScoreboard = (gameState.score.home || 0) + (gameState.score.away || 0);

  const runsPassed = totalRunsEvents === totalRunsBoxscore && totalRunsBoxscore === totalRunsScoreboard;
  if (!runsPassed) {
    errors.push(`Discrepancia en carreras: Eventos(${totalRunsEvents}) vs Boxscore(${totalRunsBoxscore}) vs Scoreboard(${totalRunsScoreboard})`);
  }

  // 2. Balance de Hits
  const totalHitsEvents = events.filter(ev => ev.result && ['1B', '2B', '3B', 'HR', 'HR_INSIDE_PARK'].includes(ev.result.code)).length;
  const totalHitsBoxscore = Object.values(stats.batting).reduce((sum, b) => sum + b.h, 0);
  const totalHitsTeam = stats.team.home.h + stats.team.away.h;

  const hitsPassed = totalHitsEvents === totalHitsBoxscore && totalHitsBoxscore === totalHitsTeam;
  if (!hitsPassed) {
    errors.push(`Discrepancia en hits: Eventos(${totalHitsEvents}) vs Boxscore(${totalHitsBoxscore}) vs Team(${totalHitsTeam})`);
  }

  // 3. Balance de RBI
  const totalRbiEvents = events.reduce((sum, ev) => sum + ((ev.result && typeof ev.result.rbi === 'number') ? ev.result.rbi : 0), 0);
  const totalRbiBoxscore = Object.values(stats.batting).reduce((sum, b) => sum + b.rbi, 0);
  const totalRbiTeam = stats.team.home.rbi + stats.team.away.rbi;

  const rbiPassed = totalRbiEvents === totalRbiBoxscore && totalRbiBoxscore === totalRbiTeam;
  if (!rbiPassed) {
    errors.push(`Discrepancia en RBI: Eventos(${totalRbiEvents}) vs Boxscore(${totalRbiBoxscore}) vs Team(${totalRbiTeam})`);
  }

  // 4. Balance de Outs
  const totalOutsEvents = events.reduce((sum, ev) => sum + ((ev.result && typeof ev.result.outsRecorded === 'number') ? ev.result.outsRecorded : 0), 0);
  const totalOutsPitching = Object.values(stats.pitching).reduce((sum, p) => sum + p.ipOuts, 0);

  const outsPassed = totalOutsEvents === totalOutsPitching;
  if (!outsPassed) {
    errors.push(`Discrepancia en outs: Eventos(${totalOutsEvents}) vs PitchingTotals(${totalOutsPitching})`);
  }

  // 5. Balance de Errores
  const totalErrorsEvents = events.reduce((sum, ev) => sum + ((ev.result && Array.isArray(ev.result.errors)) ? ev.result.errors.length : 0), 0);
  const totalErrorsFielding = Object.values(stats.fielding).reduce((sum, f) => sum + f.e, 0);

  const errorsPassed = totalErrorsEvents === totalErrorsFielding;
  if (!errorsPassed) {
    errors.push(`Discrepancia en errores: Eventos(${totalErrorsEvents}) vs FieldingTotals(${totalErrorsFielding})`);
  }

  // ── Invariante Interna A: Plate Appearances (PA) ───────────────────────────
  const totalPAEvents = events.filter(ev => ev.eventType === 'PLATE_APPEARANCE').length;
  const totalPABoxscore = Object.values(stats.batting).reduce((sum, b) => sum + b.pa, 0);
  const totalPATeam = stats.team.home.pa + stats.team.away.pa;
  const paPassed = totalPAEvents === totalPABoxscore && totalPABoxscore === totalPATeam;
  if (!paPassed) {
    errors.push(`Invariante Interna PA violada: Eventos(${totalPAEvents}) vs Boxscore(${totalPABoxscore}) vs Team(${totalPATeam})`);
  }

  // ── Invariante Interna B: Total Bases (TB) ─────────────────────────────────
  const totalTBBoxscore = Object.values(stats.batting).reduce((sum, b) => sum + b.tb, 0);
  const totalTBTeam = stats.team.home.tb + stats.team.away.tb;
  const tbPassed = totalTBBoxscore === totalTBTeam;
  if (!tbPassed) {
    errors.push(`Invariante Interna TB violada: Boxscore(${totalTBBoxscore}) vs Team(${totalTBTeam})`);
  }

  const report = {
    isValid: errors.length === 0,
    balances: {
      runs: { playLog: totalRunsEvents, boxscore: totalRunsBoxscore, team: totalRunsScoreboard, passed: runsPassed },
      hits: { playLog: totalHitsEvents, boxscore: totalHitsBoxscore, team: totalHitsTeam, passed: hitsPassed },
      rbi: { playLog: totalRbiEvents, boxscore: totalRbiBoxscore, team: totalRbiTeam, passed: rbiPassed },
      outs: { playLog: totalOutsEvents, pitching: totalOutsPitching, passed: outsPassed },
      errors: { playLog: totalErrorsEvents, fielding: totalErrorsFielding, team: totalErrorsFielding, passed: errorsPassed },
      internalPA: { passed: paPassed },
      internalTB: { passed: tbPassed }
    },
    errors
  };

  if (!report.isValid) {
    throw new StatEngineError(`Compuerta de Reconciliación Fallida: ${errors.join(' | ')}`, report);
  }

  return report;
}




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

    // Permitir alineación contextual de inning y media entrada desde el payload
    const effectiveInning = (command.payload && command.payload.inning !== undefined) ? Number(command.payload.inning) : state.inning;
    let effectiveHalf = state.half;
    if (command.payload && command.payload.half !== undefined) {
      const hStr = String(command.payload.half).toUpperCase();
      effectiveHalf = (hStr === 'BOT' || hStr === 'BOTTOM') ? 'BOTTOM' : 'TOP';
    }
    const isTop = effectiveHalf === 'TOP';

    // Determinar bateador y pitcher activos
    const offensiveTeam = isTop ? state.awayTeam : state.homeTeam;
    const defensiveTeam = isTop ? state.homeTeam : state.awayTeam;

    const currentBatterId = offensiveTeam && offensiveTeam.lineupState ? offensiveTeam.lineupState.currentBatterId : (isTop ? 'away-1' : 'home-1');
    const currentPitcherId = defensiveTeam && defensiveTeam.pitchingState ? defensiveTeam.pitchingState.activePitcherId : (isTop ? 'home-1' : 'away-1');

    let batterId = (command.payload && command.payload.batter && command.payload.batter.id) || (command.payload && command.payload.batterId) || currentBatterId;
    
    // Si el batterId provisto ya está ocupando una base, seleccionar el siguiente bateador del orden
    if (state.bases.b1 === batterId || state.bases.b2 === batterId || state.bases.b3 === batterId) {
      if (offensiveTeam && offensiveTeam.lineupState && offensiveTeam.lineupState.slots) {
        const availableSlot = offensiveTeam.lineupState.slots.find(s => s.playerId !== state.bases.b1 && s.playerId !== state.bases.b2 && s.playerId !== state.bases.b3);
        if (availableSlot) batterId = availableSlot.playerId;
        else batterId = `batter-${Date.now() % 1000}`;
      } else {
        batterId = `batter-${(this.eventStore.getAll().length + 1)}`;
      }
    }

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
      inning: effectiveInning,
      half: effectiveHalf,
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
        let runsScored = command.payload.runsScored;
        if (!runsScored) {
          if (code === 'HR') {
            runsScored = [state.bases.b3, state.bases.b2, state.bases.b1, batterId].filter(Boolean);
          } else if (code === '3B') {
            runsScored = [state.bases.b3, state.bases.b2, state.bases.b1].filter(Boolean);
          } else if (code === '2B') {
            runsScored = [state.bases.b3, state.bases.b2].filter(Boolean);
          } else if (code === '1B') {
            runsScored = state.bases.b3 ? [state.bases.b3] : [];
          } else {
            runsScored = [];
          }
        }
        const rbi = typeof command.payload.rbi === 'number' ? command.payload.rbi : runsScored.length;

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




  return {
    EventValidationError,
    EventValidator,
    EventStore,
    createInitialGameState,
    getActiveOffenseDefense,
    projectGameState,
    projectGameStateWithReverts,
    formatIP,
    formatDecimal,
    calculateRunAccounting,
    recalculateStatsFromEvents,
    reconcileGameStats,
    UndoEngine,
    CommandDispatcher
  };
});
