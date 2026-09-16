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

module.exports = {
  EventValidationError,
  EventValidator,
  EventStore,
  createInitialCleanGameState,
  projectGameState
};
