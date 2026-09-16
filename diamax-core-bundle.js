/**
 * DIAMAX PRO — UNIFIED EVENT CORE & COMMAND DISPATCHER v2.0
 * =========================================================
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * Architecture: Event Sourcing + CQRS
 * 
 * Exposes:
 *  - window.DIAMAX_CORE
 *  - window.DIAMAX_DISPATCHER
 *  - window.registrarJugadaLive(action)
 *  - window.deshacerJugadaLive()
 *  - window.rehacerJugadaLive()
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

  // 1. EVENT VALIDATOR & ERRORS
  class EventValidationError extends Error {
    constructor(code, message, event) {
      super(`[EVENT_VALIDATION_ERROR][${code}]: ${message}`);
      this.name = 'EventValidationError';
      this.code = code;
      this.rejectedEvent = event;
    }
  }

  class EventValidator {
    static validate(event, eventStore, previousState = null) {
      if (!event) throw new EventValidationError('NULL_EVENT', 'El evento no puede ser nulo', {});

      if (typeof event.outsBefore !== 'number' || event.outsBefore < 0 || event.outsBefore > 2) {
        throw new EventValidationError('INVALID_OUTS_BEFORE', `outsBefore debe estar en rango 0..2 (recibido: ${event.outsBefore})`, event);
      }

      if (!event.countBefore || typeof event.countBefore.balls !== 'number' || event.countBefore.balls < 0 || event.countBefore.balls > 3) {
        throw new EventValidationError('INVALID_BALLS_COUNT', 'countBefore.balls debe estar en rango 0..3', event);
      }

      if (typeof event.countBefore.strikes !== 'number' || event.countBefore.strikes < 0 || event.countBefore.strikes > 2) {
        throw new EventValidationError('INVALID_STRIKES_COUNT', 'countBefore.strikes debe estar en rango 0..2', event);
      }

      if (typeof event.inning !== 'number' || event.inning < 1 || !Number.isInteger(event.inning)) {
        throw new EventValidationError('INVALID_INNING', `inning debe ser un entero >= 1 (recibido: ${event.inning})`, event);
      }

      if (event.eventType === 'PITCH') {
        if (!event.pitchDetails || typeof event.pitchDetails.isStrike !== 'boolean') {
          throw new EventValidationError('MISSING_PITCH_DETAILS', 'Eventos de tipo PITCH requieren pitchDetails con isStrike', event);
        }
        if (!event.plateAppearanceId) {
          throw new EventValidationError('MISSING_PLATE_APPEARANCE_ID', 'Eventos de tipo PITCH requieren plateAppearanceId', event);
        }
      }

      if (eventStore && event.seq !== undefined && typeof eventStore.hasSeq === 'function' && eventStore.hasSeq(event.seq)) {
        throw new EventValidationError('DUPLICATE_CANONICAL_SEQ', `El seq ${event.seq} ya existe en el partido`, event);
      }

      if (event.result && (event.result.code === 'DP_GROUND' || event.result.code === '6-4-3_DP' || event.result.code === '4-6-3_DP')) {
        const hasRunnerOnFirst = event.basesBefore && !!event.basesBefore.b1;
        if (!hasRunnerOnFirst) {
          throw new EventValidationError('DP_REQUIRES_RUNNER_ON_FIRST', 'DP por el suelo requiere obligatoriamente corredor en 1B', event);
        }
      }

      if (typeof event.outsAfter !== 'number' || event.outsAfter < 0 || event.outsAfter > 3) {
        throw new EventValidationError('INVALID_OUTS_AFTER', `outsAfter debe estar en el rango 0..3 (recibido: ${event.outsAfter})`, event);
      }

      return { valid: true };
    }
  }

  // 2. EVENT STORE
  class EventStore {
    constructor() {
      this.events = [];
      this.seqIndex = new Set();
      this.clientEventIndex = new Set();
    }

    append(event) {
      this.events.push(event);
      if (event.seq !== undefined) this.seqIndex.add(event.seq);
      if (event.clientEventId) this.clientEventIndex.add(event.clientEventId);
      return event;
    }

    getAll() {
      return [...this.events];
    }

    hasSeq(seq) {
      return this.seqIndex.has(seq);
    }

    removeLastLocalPending() {
      if (this.events.length === 0) return null;
      const last = this.events[this.events.length - 1];
      if (last.orderingStatus === 'PENDING') {
        const removed = this.events.pop();
        if (removed.seq !== undefined) this.seqIndex.delete(removed.seq);
        if (removed.clientEventId) this.clientEventIndex.delete(removed.clientEventId);
        return removed;
      }
      return null;
    }
  }

  // 3. GAME PROJECTOR & STATE REPLAY
  function createInitialTeamState(teamId, teamName, playerPrefix = 'p') {
    const lineup = [];
    const defensiveAssignments = {};
    const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];

    for (let i = 1; i <= 9; i++) {
      const pId = `${playerPrefix}-${i}`;
      const pName = `${teamName} Jugador ${i}`;
      const pos = positions[i - 1];
      lineup.push({ order: i, playerId: pId, name: pName, position: pos, isSub: false, status: 'ACTIVE' });
      defensiveAssignments[pos] = pId;
    }

    const startingPitcherId = `${playerPrefix}-1`;
    return {
      id: teamId,
      name: teamName,
      lineupState: { slots: lineup, currentBatterIndex: 0, currentBatterId: lineup[0].playerId, substitutions: [], defensiveAssignments },
      pitchingState: { startingPitcherId, activePitcherId: startingPitcherId, pitchers: [startingPitcherId], pitchingChanges: [] }
    };
  }

  function createInitialGameState(config = {}) {
    return {
      gameId: config.gameId || 'game-001',
      tenantId: config.tenantId || 'tenant-001',
      status: 'IN_PROGRESS',
      inning: 1,
      half: 'TOP',
      outs: 0,
      count: { balls: 0, strikes: 0 },
      bases: { b1: null, b2: null, b3: null },
      score: { home: 0, away: 0, inningsHome: [0], inningsAway: [0] },
      awayTeam: config.awayTeam || createInitialTeamState('team-away', 'Guerreros (Visitante)', 'away'),
      homeTeam: config.homeTeam || createInitialTeamState('team-home', 'Rival (Local)', 'home'),
      activePlateAppearanceId: null,
      totalEventsProcessed: 0,
      lastEventId: null
    };
  }

  function projectGameStateWithReverts(rawEvents = [], initialConfig = {}) {
    const state = createInitialGameState(initialConfig);

    const revertedEventIds = new Set();
    for (const ev of rawEvents) {
      if (ev.eventType === 'EVENT_REVERT' && ev.result && ev.result.targetEventId) {
        revertedEventIds.add(ev.result.targetEventId);
      }
    }

    const events = rawEvents.filter(ev => !revertedEventIds.has(ev.id) && ev.eventType !== 'EVENT_REVERT');

    for (const event of events) {
      state.totalEventsProcessed++;
      state.lastEventId = event.id;

      const isTop = event.half === 'TOP';
      const offensiveTeam = isTop ? state.awayTeam : state.homeTeam;
      const defensiveTeam = isTop ? state.homeTeam : state.awayTeam;

      if (event.eventType === 'SUBSTITUTION' && event.substitution) {
        if (event.substitution.type === 'PITCHER_CHANGE') {
          defensiveTeam.pitchingState.activePitcherId = event.substitution.incomingPlayerId;
          if (!defensiveTeam.pitchingState.pitchers.includes(event.substitution.incomingPlayerId)) {
            defensiveTeam.pitchingState.pitchers.push(event.substitution.incomingPlayerId);
          }
        }
        continue;
      }

      if (event.eventType === 'PITCH') {
        state.activePlateAppearanceId = event.plateAppearanceId;
        state.count = { ...event.countAfter };
        continue;
      }

      if (event.eventType === 'PLATE_APPEARANCE' || event.eventType === 'RUNNER_EVENT') {
        state.activePlateAppearanceId = null;
        state.bases = { ...event.basesAfter };
        state.outs = event.outsAfter >= 3 ? 0 : event.outsAfter;
        state.count = { balls: 0, strikes: 0 };

        // Carreras
        if (event.result && Array.isArray(event.result.runsScored) && event.result.runsScored.length > 0) {
          const runs = event.result.runsScored.length;
          const curInnIdx = state.inning - 1;
          if (isTop) {
            state.score.away += runs;
            while (state.score.inningsAway.length <= curInnIdx) state.score.inningsAway.push(0);
            state.score.inningsAway[curInnIdx] += runs;
          } else {
            state.score.home += runs;
            while (state.score.inningsHome.length <= curInnIdx) state.score.inningsHome.push(0);
            state.score.inningsHome[curInnIdx] += runs;
          }
        }

        // Rotación de bateo 9 -> 1
        if (event.eventType === 'PLATE_APPEARANCE' && event.result.code !== 'SB' && event.result.code !== 'CS' && event.result.code !== 'WP') {
          const slotsCount = offensiveTeam.lineupState.slots.length || 9;
          offensiveTeam.lineupState.currentBatterIndex = (offensiveTeam.lineupState.currentBatterIndex + 1) % slotsCount;
          const nextSlot = offensiveTeam.lineupState.slots[offensiveTeam.lineupState.currentBatterIndex];
          offensiveTeam.lineupState.currentBatterId = nextSlot ? nextSlot.playerId : null;
        }

        // Transición de media entrada (3 outs)
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

  // 4. STAT ENGINE & RUN ACCOUNTING (ER vs UER)
  class StatEngineError extends Error {
    constructor(message, report = null) {
      super(`[STAT_ENGINE_ERROR]: ${message}`);
      this.name = 'StatEngineError';
      this.report = report;
    }
  }

  function formatIP(ipOuts) {
    if (typeof ipOuts !== 'number' || ipOuts < 0) return '0.0';
    const fullInnings = Math.floor(ipOuts / 3);
    const remainderOuts = ipOuts % 3;
    return `${fullInnings}.${remainderOuts}`;
  }

  function formatDecimal(val, decimals = 3) {
    if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return decimals === 3 ? '.000' : '0.00';
    if (decimals === 3) {
      if (val >= 1) return val.toFixed(3);
      return (val.toFixed(3)).replace(/^0\./, '.');
    }
    return val.toFixed(decimals);
  }

  function calculateRunAccounting(events = []) {
    const runAuditTrail = [];
    const runClassification = {};
    const pitcherRuns = {};

    const inningsMap = new Map();
    for (const ev of events) {
      const key = `${ev.inning}-${ev.half}`;
      if (!inningsMap.has(key)) inningsMap.set(key, []);
      inningsMap.get(key).push(ev);
    }

    for (const [halfKey, halfEvents] of inningsMap.entries()) {
      let actualOuts = 0;
      let hypotheticalOuts = 0;
      const runnersReachedOnError = new Map();

      for (const ev of halfEvents) {
        const pId = ev.pitcherId || 'unknown-pitcher';
        if (!pitcherRuns[pId]) pitcherRuns[pId] = { er: 0, uer: 0, r: 0 };

        const res = ev.result || {};
        const outsInPlay = typeof res.outsRecorded === 'number' ? res.outsRecorded : 0;
        const runsInPlay = Array.isArray(res.runsScored) ? res.runsScored : [];
        const hadError = (Array.isArray(res.errors) && res.errors.length > 0) || res.code === 'ROE';

        if (hadError && ev.batterId) {
          runnersReachedOnError.set(ev.batterId, ev.id);
        }

        const inningShouldBeOver = hypotheticalOuts >= 3;
        let evEr = 0;
        let evUer = 0;

        for (const runnerId of runsInPlay) {
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

          pitcherRuns[pId].r++;
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

  function recalculateStatsFromEvents(rawEvents = [], initialConfig = {}) {
    const revertedEventIds = new Set();
    for (const ev of rawEvents) {
      if (ev.eventType === 'EVENT_REVERT' && ev.result && ev.result.targetEventId) {
        revertedEventIds.add(ev.result.targetEventId);
      }
    }
    const events = rawEvents.filter(ev => !revertedEventIds.has(ev.id) && ev.eventType !== 'EVENT_REVERT');
    const { runAuditTrail, runClassification } = calculateRunAccounting(events);

    const batting = {};
    const pitching = {};
    const fielding = {};
    const team = {
      home: { pa: 0, ab: 0, h: 0, tb: 0, r: 0, rbi: 0, bb: 0, so: 0, hr: 0, er: 0, errors: 0, ipOuts: 0, dp: 0 },
      away: { pa: 0, ab: 0, h: 0, tb: 0, r: 0, rbi: 0, bb: 0, so: 0, hr: 0, er: 0, errors: 0, ipOuts: 0, dp: 0 }
    };

    function getBatting(pId) {
      if (!batting[pId]) {
        batting[pId] = {
          playerId: pId, pa: 0, ab: 0, h: 0, h1: 0, h2: 0, h3: 0, hr: 0,
          r: 0, rbi: 0, bb: 0, ibb: 0, hbp: 0, so: 0, sf: 0, sh: 0, tb: 0,
          avg: 0, obp: 0, slg: 0, ops: 0, iso: 0, avgStr: '.000', obpStr: '.000', slgStr: '.000', opsStr: '.000'
        };
      }
      return batting[pId];
    }

    function getPitching(pId) {
      if (!pitching[pId]) {
        pitching[pId] = {
          playerId: pId, ipOuts: 0, ipVisual: '0.0', bf: 0, h: 0, r: 0, er: 0, uer: 0,
          bb: 0, ibb: 0, k: 0, hr: 0, era: 'N/A', whip: 'N/A'
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
          else if (code === 'HR') { b.ab++; b.h++; b.hr++; b.tb += 4; team[battingTeamKey].ab++; team[battingTeamKey].h++; team[battingTeamKey].hr++; team[battingTeamKey].tb += 4; }
          else if (code === 'BB') { b.bb++; team[battingTeamKey].bb++; }
          else if (code === 'IBB') { b.bb++; b.ibb++; team[battingTeamKey].bb++; }
          else if (code === 'HBP') { b.hbp++; }
          else if (code === 'SAC_FLY') { b.sf++; }
          else if (code === 'SAC_BUNT') { b.sh++; }
          else if (code === 'K' || code === 'K_SWINGING' || code === 'K_LOOKING') { b.ab++; b.so++; team[battingTeamKey].ab++; team[battingTeamKey].so++; }
          else if (code === 'GO' || code === 'FO' || code === 'PO' || code === 'LO' || code === 'DP_GROUND' || code === 'ROE') {
            b.ab++;
            team[battingTeamKey].ab++;
          }

          if (typeof res.rbi === 'number') {
            b.rbi += res.rbi;
            team[battingTeamKey].rbi += res.rbi;
          }
        }

        if (pId) {
          const p = getPitching(pId);
          p.bf++;
          const outsRecorded = typeof res.outsRecorded === 'number' ? res.outsRecorded : 0;
          p.ipOuts += outsRecorded;
          team[pitchingTeamKey].ipOuts += outsRecorded;

          if (['1B', '2B', '3B', 'HR'].includes(code)) p.h++;
          if (code === 'HR') p.hr++;
          if (code === 'BB' || code === 'IBB') p.bb++;
          if (code === 'K' || code === 'K_SWINGING' || code === 'K_LOOKING') p.k++;

          const erInfo = runClassification[ev.id] || { earnedRuns: 0, unearnedRuns: 0 };
          p.er += erInfo.earnedRuns;
          p.uer += erInfo.unearnedRuns;
          p.r += (erInfo.earnedRuns + erInfo.unearnedRuns);
          team[pitchingTeamKey].er += erInfo.earnedRuns;
        }

        if (Array.isArray(res.runsScored)) {
          for (const runnerId of res.runsScored) {
            getBatting(runnerId).r++;
            team[battingTeamKey].r++;
          }
        }

        if (code === 'DP_GROUND' || code === 'DP_AIR') {
          team[pitchingTeamKey].dp++;
        }

        if (Array.isArray(ev.fielderIds)) {
          if ((code === 'GO' || code === 'SAC_BUNT') && ev.fielderIds.length >= 2) {
            getFielding(ev.fielderIds[0]).a++;
            getFielding(ev.fielderIds[1]).po++;
          } else if ((code === 'FO' || code === 'PO' || code === 'LO' || code === 'SAC_FLY') && ev.fielderIds.length >= 1) {
            getFielding(ev.fielderIds[0]).po++;
          }
        }

        if (Array.isArray(res.errors)) {
          for (const err of res.errors) {
            getFielding(err.fielderId).e++;
            team[pitchingTeamKey].errors++;
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
      b.avgStr = formatDecimal(b.avg, 3);
      b.obpStr = formatDecimal(b.obp, 3);
      b.slgStr = formatDecimal(b.slg, 3);
      b.opsStr = formatDecimal(b.ops, 3);
    }

    for (const p of Object.values(pitching)) {
      p.ipVisual = formatIP(p.ipOuts);
      if (p.ipOuts > 0) {
        p.era = ((p.er * 27) / p.ipOuts).toFixed(2);
        p.whip = (((p.bb + p.h) * 3) / p.ipOuts).toFixed(2);
      } else {
        p.era = 'N/A';
        p.whip = 'N/A';
      }
    }

    for (const f of Object.values(fielding)) {
      f.tc = f.po + f.a + f.e;
      f.fldPct = f.tc > 0 ? ((f.po + f.a) / f.tc) : 1.0;
      f.fldPctStr = formatDecimal(f.fldPct, 3);
    }

    return { batting, pitching, fielding, team, runAuditTrail, totalEvents: events.length };
  }

  function reconcileGameStats(stats, gameState, rawEvents = []) {
    const errors = [];

    const revertedEventIds = new Set();
    for (const ev of rawEvents) {
      if (ev.eventType === 'EVENT_REVERT' && ev.result && ev.result.targetEventId) {
        revertedEventIds.add(ev.result.targetEventId);
      }
    }
    const events = rawEvents.filter(ev => !revertedEventIds.has(ev.id) && ev.eventType !== 'EVENT_REVERT');

    const totalRunsEvents = events.reduce((sum, ev) => sum + ((ev.result && Array.isArray(ev.result.runsScored)) ? ev.result.runsScored.length : 0), 0);
    const totalRunsBoxscore = Object.values(stats.batting).reduce((sum, b) => sum + b.r, 0);
    const totalRunsScoreboard = (gameState.score.home || 0) + (gameState.score.away || 0);
    const runsPassed = totalRunsEvents === totalRunsBoxscore && totalRunsBoxscore === totalRunsScoreboard;
    if (!runsPassed) errors.push(`Discrepancia en carreras: Eventos(${totalRunsEvents}) vs Boxscore(${totalRunsBoxscore}) vs Scoreboard(${totalRunsScoreboard})`);

    const totalHitsEvents = events.filter(ev => ev.result && ['1B', '2B', '3B', 'HR'].includes(ev.result.code)).length;
    const totalHitsBoxscore = Object.values(stats.batting).reduce((sum, b) => sum + b.h, 0);
    const totalHitsTeam = stats.team.home.h + stats.team.away.h;
    const hitsPassed = totalHitsEvents === totalHitsBoxscore && totalHitsBoxscore === totalHitsTeam;
    if (!hitsPassed) errors.push(`Discrepancia en hits: Eventos(${totalHitsEvents}) vs Boxscore(${totalHitsBoxscore}) vs Team(${totalHitsTeam})`);

    const totalOutsEvents = events.reduce((sum, ev) => sum + ((ev.result && typeof ev.result.outsRecorded === 'number') ? ev.result.outsRecorded : 0), 0);
    const totalOutsPitching = Object.values(stats.pitching).reduce((sum, p) => sum + p.ipOuts, 0);
    const outsPassed = totalOutsEvents === totalOutsPitching;
    if (!outsPassed) errors.push(`Discrepancia en outs: Eventos(${totalOutsEvents}) vs PitchingTotals(${totalOutsPitching})`);

    const totalErrorsEvents = events.reduce((sum, ev) => sum + ((ev.result && Array.isArray(ev.result.errors)) ? ev.result.errors.length : 0), 0);
    const totalErrorsFielding = Object.values(stats.fielding).reduce((sum, f) => sum + f.e, 0);
    const errorsPassed = totalErrorsEvents === totalErrorsFielding;
    if (!errorsPassed) errors.push(`Discrepancia en errores: Eventos(${totalErrorsEvents}) vs FieldingTotals(${totalErrorsFielding})`);

    const totalPAEvents = events.filter(ev => ev.eventType === 'PLATE_APPEARANCE').length;
    const totalPABoxscore = Object.values(stats.batting).reduce((sum, b) => sum + b.pa, 0);
    const totalPATeam = stats.team.home.pa + stats.team.away.pa;
    const paPassed = totalPAEvents === totalPABoxscore && totalPABoxscore === totalPATeam;
    if (!paPassed) errors.push(`Invariante Interna PA violada: Eventos(${totalPAEvents}) vs Boxscore(${totalPABoxscore}) vs Team(${totalPATeam})`);

    const totalTBBoxscore = Object.values(stats.batting).reduce((sum, b) => sum + b.tb, 0);
    const totalTBTeam = stats.team.home.tb + stats.team.away.tb;
    const tbPassed = totalTBBoxscore === totalTBTeam;
    if (!tbPassed) errors.push(`Invariante Interna TB violada: Boxscore(${totalTBBoxscore}) vs Team(${totalTBTeam})`);

    return {
      isValid: errors.length === 0,
      balances: {
        runs: { playLog: totalRunsEvents, boxscore: totalRunsBoxscore, team: totalRunsScoreboard, passed: runsPassed },
        hits: { playLog: totalHitsEvents, boxscore: totalHitsBoxscore, team: totalHitsTeam, passed: hitsPassed },
        outs: { playLog: totalOutsEvents, pitching: totalOutsPitching, passed: outsPassed },
        errors: { playLog: totalErrorsEvents, fielding: totalErrorsFielding, team: totalErrorsFielding, passed: errorsPassed },
        internalPA: { passed: paPassed },
        internalTB: { passed: tbPassed }
      },
      errors
    };
  }

  // 5. UNDO ENGINE
  class UndoEngine {
    constructor(eventStore, initialConfig = {}) {
      this.eventStore = eventStore;
      this.redoStack = [];
      this.initialConfig = initialConfig;
    }

    undo() {
      const allEvents = this.eventStore.getAll();
      if (allEvents.length === 0) {
        return { success: false, undoMode: null, newState: projectGameStateWithReverts([], this.initialConfig) };
      }

      const lastEvent = allEvents[allEvents.length - 1];

      if (lastEvent.orderingStatus === 'PENDING') {
        const removed = this.eventStore.removeLastLocalPending();
        if (removed) this.redoStack.push({ mode: 'PENDING_LOCAL', event: removed });
        const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
        return { success: true, undoMode: 'PENDING_LOCAL', revertedEvent: removed, newState };
      }

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
          result: { code: 'EVENT_REVERT', description: `Reversión de ${lastEvent.id}`, targetEventId: lastEvent.id, outsRecorded: 0, runsScored: [], rbi: 0 },
          basesAfter: { ...lastEvent.basesBefore },
          outsAfter: lastEvent.outsBefore,
          countAfter: { ...lastEvent.countBefore },
          isHalfInningEnd: false
        };

        this.eventStore.append(revertEvent);
        this.redoStack.push({ mode: 'CANONICAL_REVERT', targetEvent: lastEvent, revertEventId: revertEvent.id });
        const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
        return { success: true, undoMode: 'CANONICAL_REVERT', revertedEvent: lastEvent, revertEvent, newState };
      }

      return { success: false };
    }

    redo() {
      if (this.redoStack.length === 0) return { success: false };
      const item = this.redoStack.pop();
      if (item.mode === 'PENDING_LOCAL' && item.event) {
        this.eventStore.append(item.event);
        const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
        return { success: true, newState };
      }
      return { success: false };
    }
  }

  // 6. COMMAND DISPATCHER (UI BOUNDARY)
  class CommandDispatcher {
    constructor(eventStore, undoEngine = null, initialConfig = {}) {
      this.eventStore = eventStore || new EventStore();
      this.initialConfig = initialConfig;
      this.undoEngine = undoEngine || new UndoEngine(this.eventStore, initialConfig);
      this.listeners = [];
    }

    subscribe(callback) {
      if (typeof callback === 'function') this.listeners.push(callback);
    }

    notify(snapshot) {
      for (const cb of this.listeners) {
        try { cb(snapshot); } catch (e) { console.error('[DISPATCHER_LISTENER_ERR]', e); }
      }
    }

    getCurrentSnapshot() {
      const rawEvents = this.eventStore.getAll();
      const gameState = projectGameStateWithReverts(rawEvents, this.initialConfig);
      const stats = recalculateStatsFromEvents(rawEvents, this.initialConfig);
      const reconciliation = reconcileGameStats(stats, gameState, rawEvents);
      return { gameState, stats, reconciliation, eventCount: rawEvents.length, rawEvents };
    }

    dispatch(command) {
      if (!command || !command.type) {
        return { success: false, error: 'INVALID_COMMAND', snapshot: this.getCurrentSnapshot() };
      }

      if (command.type === 'UNDO') {
        const res = this.undoEngine.undo();
        const snap = this.getCurrentSnapshot();
        this.notify(snap);
        return { success: res.success, undoMode: res.undoMode, snapshot: snap };
      }

      if (command.type === 'REDO') {
        const res = this.undoEngine.redo();
        const snap = this.getCurrentSnapshot();
        this.notify(snap);
        return { success: res.success, snapshot: snap };
      }

      const snapBefore = this.getCurrentSnapshot();
      const state = snapBefore.gameState;
      const isTop = state.half === 'TOP';
      const offensiveTeam = isTop ? state.awayTeam : state.homeTeam;
      const defensiveTeam = isTop ? state.homeTeam : state.awayTeam;

      const currentBatterId = offensiveTeam && offensiveTeam.lineupState ? offensiveTeam.lineupState.currentBatterId : (isTop ? 'away-1' : 'home-1');
      const currentPitcherId = defensiveTeam && defensiveTeam.pitchingState ? defensiveTeam.pitchingState.activePitcherId : (isTop ? 'home-1' : 'away-1');

      const batterId = (command.payload && command.payload.batterId) || currentBatterId;
      const pitcherId = (command.payload && command.payload.pitcherId) || currentPitcherId;

      const canonicalEvent = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        gameId: command.gameId || this.initialConfig.gameId || 'game-001',
        clientEventId: command.clientEventId || `c-${Date.now()}`,
        seq: this.eventStore.getAll().length + 1,
        orderingStatus: command.orderingStatus || 'CANONICAL',
        clientTimestamp: Date.now(),
        tenantId: command.tenantId || this.initialConfig.tenantId || 'tenant-001',
        inning: state.inning,
        half: state.half,
        outsBefore: state.outs,
        countBefore: { ...state.count },
        basesBefore: { ...state.bases },
        batterId,
        pitcherId,
        eventType: 'PLATE_APPEARANCE',
        result: { code: '', description: '', outsRecorded: 0, runsScored: [], rbi: 0, errors: [] },
        fielderIds: (command.payload && command.payload.fielderIds) || [],
        basesAfter: { ...state.bases },
        outsAfter: state.outs,
        countAfter: { balls: 0, strikes: 0 },
        isHalfInningEnd: false
      };

      switch (command.type) {
        case 'RECORD_HIT': {
          const code = command.payload.resultCode || '1B';
          let runs = [];

          if (code === '1B') {
            if (state.bases.b3) runs.push(state.bases.b3);
            canonicalEvent.basesAfter = { b1: batterId, b2: state.bases.b1, b3: state.bases.b2 };
          } else if (code === '2B') {
            if (state.bases.b3) runs.push(state.bases.b3);
            if (state.bases.b2) runs.push(state.bases.b2);
            canonicalEvent.basesAfter = { b1: null, b2: batterId, b3: state.bases.b1 };
          } else if (code === '3B') {
            if (state.bases.b3) runs.push(state.bases.b3);
            if (state.bases.b2) runs.push(state.bases.b2);
            if (state.bases.b1) runs.push(state.bases.b1);
            canonicalEvent.basesAfter = { b1: null, b2: null, b3: batterId };
          } else if (code === 'HR') {
            if (state.bases.b3) runs.push(state.bases.b3);
            if (state.bases.b2) runs.push(state.bases.b2);
            if (state.bases.b1) runs.push(state.bases.b1);
            runs.push(batterId);
            canonicalEvent.basesAfter = { b1: null, b2: null, b3: null };
          }

          if (command.payload.runsScored) runs = command.payload.runsScored;
          const rbi = typeof command.payload.rbi === 'number' ? command.payload.rbi : runs.length;

          canonicalEvent.result = { code, description: command.payload.description || `Hit (${code})`, outsRecorded: 0, runsScored: runs, rbi, errors: [] };
          break;
        }

        case 'RECORD_OUT': {
          const code = command.payload.resultCode || 'GO';
          canonicalEvent.result = { code, description: command.payload.description || `Out (${code})`, outsRecorded: 1, runsScored: [], rbi: 0, errors: [] };
          canonicalEvent.outsAfter = state.outs + 1;
          canonicalEvent.isHalfInningEnd = canonicalEvent.outsAfter >= 3;
          break;
        }

        case 'RECORD_WALK': {
          const code = command.payload.resultCode || 'BB';
          let runs = [];
          if (state.bases.b1 && state.bases.b2 && state.bases.b3) runs.push(state.bases.b3);
          const rbi = runs.length;

          canonicalEvent.basesAfter = {
            b1: batterId,
            b2: state.bases.b1 ? state.bases.b1 : state.bases.b2,
            b3: (state.bases.b1 && state.bases.b2) ? state.bases.b2 : state.bases.b3
          };

          canonicalEvent.result = { code, description: `Boleto (${code})`, outsRecorded: 0, runsScored: runs, rbi, errors: [] };
          break;
        }

        case 'RECORD_SACRIFICE': {
          const code = command.payload.resultCode || 'SAC_FLY';
          let runs = [];
          if (code === 'SAC_FLY' && state.bases.b3 && state.outs < 2) {
            runs.push(state.bases.b3);
            canonicalEvent.basesAfter = { ...state.bases, b3: null };
          }
          canonicalEvent.result = { code, description: `Sacrificio (${code})`, outsRecorded: 1, runsScored: runs, rbi: runs.length, errors: [] };
          canonicalEvent.outsAfter = state.outs + 1;
          canonicalEvent.isHalfInningEnd = canonicalEvent.outsAfter >= 3;
          break;
        }

        case 'RECORD_DOUBLE_PLAY': {
          const code = command.payload.resultCode || 'DP_GROUND';
          canonicalEvent.result = { code, description: 'Doble Play', outsRecorded: 2, runsScored: [], rbi: 0, errors: [] };
          canonicalEvent.outsAfter = state.outs + 2;
          canonicalEvent.isHalfInningEnd = canonicalEvent.outsAfter >= 3;
          canonicalEvent.basesAfter = { b1: null, b2: null, b3: state.bases.b3 };
          break;
        }

        case 'RECORD_ERROR': {
          const errors = command.payload.errors || [{ fielderId: command.payload.fielderId || 'home-5', errorType: 'FIELDING', baseReached: 'b1' }];
          canonicalEvent.result = { code: 'ROE', description: 'Error Defensivo', outsRecorded: 0, runsScored: [], rbi: 0, errors };
          canonicalEvent.basesAfter = { ...state.bases, b1: batterId };
          break;
        }

        default:
          return { success: false, error: `UNKNOWN_COMMAND: ${command.type}`, snapshot: snapBefore };
      }

      try {
        EventValidator.validate(canonicalEvent, this.eventStore, state);
      } catch (err) {
        return { success: false, error: err.message, code: err.code, snapshot: snapBefore };
      }

      this.eventStore.append(canonicalEvent);
      const newSnap = this.getCurrentSnapshot();
      this.notify(newSnap);
      return { success: true, event: canonicalEvent, snapshot: newSnap };
    }
  }

  return {
    EventValidationError,
    EventValidator,
    EventStore,
    createInitialGameState,
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
