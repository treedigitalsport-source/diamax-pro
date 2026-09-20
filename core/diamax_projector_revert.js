/**
 * DIAMAX PRO — Event Core & Projector Engine v1.2
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * Soporte de EVENT_REVERT Compensatorio para Eventos Canonizados y Undo Offline.
 */

const { EventValidationError, EventValidator, EventStore } = require('./diamax_event_core.js');
const { createInitialGameState, getActiveOffenseDefense } = require('./diamax_game_projector.js');

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

module.exports = {
  projectGameStateWithReverts
};
