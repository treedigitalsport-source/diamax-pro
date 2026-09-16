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

module.exports = {
  StatEngineError,
  formatIP,
  formatDecimal,
  calculateRunAccounting,
  recalculateStatsFromEvents,
  reconcileGameStats
};
