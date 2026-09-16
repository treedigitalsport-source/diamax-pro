/**
 * DIAMAX PRO — Exhaustive Game Projector (Sprint 1B)
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * Reconstruye el GameState completo exclusivamente a partir del stream de eventos canónicos.
 */

const { EventValidationError, EventValidator } = require('./diamax_event_core.js');

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
  const awayTeam = config.awayTeam || createInitialTeamState('team-away', 'Visitantes', 'away');
  const homeTeam = config.homeTeam || createInitialTeamState('team-home', 'Locales', 'home');

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

module.exports = {
  createInitialTeamState,
  createInitialGameState,
  getActiveOffenseDefense,
  projectGameState
};
