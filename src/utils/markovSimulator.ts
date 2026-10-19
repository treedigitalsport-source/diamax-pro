import { Player, SimulationResult } from '../types/baseball';

// Base runner bitmasks: 0 (empty), 1 (1B), 2 (2B), 4 (3B)
// 8 runner states: 0 to 7
// Combined with 3 out states (0, 1, 2) = 24 base/out states
export const BASE_STATES = [
  'EMPTY',      // 0: ---
  '1B',         // 1: 1--
  '2B',         // 2: -2-
  '1B_2B',      // 3: 12-
  '3B',         // 4: --3
  '1B_3B',      // 5: 1-3
  '2B_3B',      // 6: -23
  'LOADED'      // 7: 123
] as const;

export interface BatterProbabilities {
  single: number;
  double: number;
  triple: number;
  homeRun: number;
  walk: number;
  strikeout: number;
  groundFlyOut: number;
}

/**
 * Derives empirical plate appearance outcome probabilities from AVG, OBP, and SLG.
 */
export function calculateBatterProbabilities(player: Player): BatterProbabilities {
  const avg = Math.max(0.100, Math.min(0.450, player.avg || 0.270));
  const obp = Math.max(avg + 0.020, Math.min(0.550, player.obp || 0.340));
  const slg = Math.max(avg, Math.min(0.750, player.slg || 0.420));
  const iso = Math.max(0.020, slg - avg);

  // Walk rate: BB ≈ OBP - AVG
  const walk = Math.max(0.040, obp - avg);

  // Extrabasis estimates from ISO
  const homeRun = Math.max(0.010, Math.min(0.090, iso * 0.25));
  const triple = Math.max(0.002, Math.min(0.025, iso * 0.05));
  const double = Math.max(0.025, Math.min(0.120, iso * 0.45));

  // Singles: 1B = AVG - (2B + 3B + HR)
  const single = Math.max(0.060, avg - (double + triple + homeRun));

  // Outs: 1 - OBP
  const outRate = Math.max(0.400, 1.0 - (single + double + triple + homeRun + walk));
  const strikeout = outRate * 0.32;
  const groundFlyOut = outRate * 0.68;

  // Normalize
  const total = single + double + triple + homeRun + walk + strikeout + groundFlyOut;
  return {
    single: single / total,
    double: double / total,
    triple: triple / total,
    homeRun: homeRun / total,
    walk: walk / total,
    strikeout: strikeout / total,
    groundFlyOut: groundFlyOut / total
  };
}

export type AtBatOutcome = '1B' | '2B' | '3B' | 'HR' | 'BB' | 'K' | 'OUT';

/**
 * Draws a random at-bat outcome based on the batter's probability distribution.
 */
export function sampleAtBat(probs: BatterProbabilities, rand: number = Math.random()): AtBatOutcome {
  let cumulative = 0;

  cumulative += probs.walk;
  if (rand < cumulative) return 'BB';

  cumulative += probs.single;
  if (rand < cumulative) return '1B';

  cumulative += probs.double;
  if (rand < cumulative) return '2B';

  cumulative += probs.triple;
  if (rand < cumulative) return '3B';

  cumulative += probs.homeRun;
  if (rand < cumulative) return 'HR';

  cumulative += probs.strikeout;
  if (rand < cumulative) return 'K';

  return 'OUT';
}

interface InningState {
  outs: number;
  b1: boolean;
  b2: boolean;
  b3: boolean;
}

/**
 * Transitions the base/out state upon an outcome and returns runs scored on the play.
 */
function advanceRunners(state: InningState, outcome: AtBatOutcome): number {
  let runs = 0;

  switch (outcome) {
    case 'BB': {
      if (state.b1 && state.b2 && state.b3) {
        runs += 1;
      } else if (state.b1 && state.b2) {
        state.b3 = true;
      } else if (state.b1) {
        state.b2 = true;
      }
      state.b1 = true;
      break;
    }
    case '1B': {
      if (state.b3) runs += 1;
      if (state.b2) runs += 1;
      state.b3 = state.b1; // runner on 1B moves to 2B or 3B
      state.b2 = false;
      state.b1 = true;
      break;
    }
    case '2B': {
      if (state.b3) runs += 1;
      if (state.b2) runs += 1;
      if (state.b1) {
        // runner from 1B goes to 3B (approx 45% score in modern stats, set to 3B)
        state.b3 = true;
      } else {
        state.b3 = false;
      }
      state.b2 = true;
      state.b1 = false;
      break;
    }
    case '3B': {
      if (state.b3) runs += 1;
      if (state.b2) runs += 1;
      if (state.b1) runs += 1;
      state.b3 = true;
      state.b2 = false;
      state.b1 = false;
      break;
    }
    case 'HR': {
      runs += 1; // batter
      if (state.b1) runs += 1;
      if (state.b2) runs += 1;
      if (state.b3) runs += 1;
      state.b1 = false;
      state.b2 = false;
      state.b3 = false;
      break;
    }
    case 'K':
    case 'OUT': {
      // Sacrifice fly rule: if < 2 outs and runner on 3B, 28% chance of sac fly scoring run on flyout
      if (outcome === 'OUT' && state.outs < 2 && state.b3 && Math.random() < 0.28) {
        runs += 1;
        state.b3 = false;
      }
      state.outs += 1;
      break;
    }
  }

  return runs;
}

/**
 * Monte Carlo Markov Chain simulation of a 9-inning game for a specific 9-player lineup.
 * N = 10,000 games simulated by default.
 */
export function simulateLineup(lineup: Player[], iterations: number = 10000): SimulationResult {
  if (lineup.length === 0) {
    return {
      expectedRuns: 0,
      scoringInningsPct: 0,
      explosiveRalliesPct: 0,
      runsDistribution: new Array(13).fill(0),
      iterations: 0,
      inningsSimulated: 0
    };
  }

  // Ensure exactly 9 batters by repeating or slicing
  const batters: Player[] = [];
  for (let i = 0; i < 9; i++) {
    batters.push(lineup[i % lineup.length]);
  }

  const probs = batters.map(b => calculateBatterProbabilities(b));

  let totalRuns = 0;
  let scoringInningsCount = 0;
  let explosiveInningsCount = 0;
  const runsDistribution = new Array(13).fill(0);
  const totalInnings = iterations * 9;

  let currentBatterIdx = 0;

  for (let game = 0; game < iterations; game++) {
    let gameRuns = 0;

    for (let inn = 0; inn < 9; inn++) {
      const state: InningState = { outs: 0, b1: false, b2: false, b3: false };
      let inningRuns = 0;

      while (state.outs < 3) {
        const batterProbs = probs[currentBatterIdx];
        const outcome = sampleAtBat(batterProbs);
        const runsOnPlay = advanceRunners(state, outcome);
        inningRuns += runsOnPlay;
        currentBatterIdx = (currentBatterIdx + 1) % 9;
      }

      gameRuns += inningRuns;

      if (inningRuns > 0) scoringInningsCount++;
      if (inningRuns >= 3) explosiveInningsCount++;
    }

    totalRuns += gameRuns;
    const bucket = Math.min(12, gameRuns);
    runsDistribution[bucket]++;
  }

  // Convert distribution to percentages
  const runsDistributionPct = runsDistribution.map(count => Number(((count / iterations) * 100).toFixed(1)));

  return {
    expectedRuns: Number((totalRuns / iterations).toFixed(2)),
    scoringInningsPct: Number(((scoringInningsCount / totalInnings) * 100).toFixed(1)),
    explosiveRalliesPct: Number(((explosiveInningsCount / totalInnings) * 100).toFixed(1)),
    runsDistribution: runsDistributionPct,
    iterations,
    inningsSimulated: totalInnings
  };
}

/**
 * Sabermetric Lineup Optimization Algorithm based on "The Book" (Tango, Lichtman, Dolphin).
 * Construct an optimal 1-9 batting order to maximize expected run production.
 */
export function getOptimalLineup(players: Player[]): Player[] {
  if (players.length < 9) return [...players];

  const pool = [...players];

  // Helper metric calculators
  const getOBP = (p: Player) => p.obp || 0.330;
  const getSLG = (p: Player) => p.slg || 0.400;
  const getAVG = (p: Player) => p.avg || 0.270;
  const getISO = (p: Player) => (p.iso !== undefined ? p.iso : Math.max(0, getSLG(p) - getAVG(p)));
  const getWOBA = (p: Player) => (p.woba !== undefined ? p.woba : getOBP(p) * 0.7 + getSLG(p) * 0.45);

  const result: Player[] = new Array(9);
  const selectedIds = new Set<number>();

  const pickBest = (comparator: (a: Player, b: Player) => number): Player => {
    const candidates = pool.filter(p => !selectedIds.has(p.id));
    candidates.sort(comparator);
    const chosen = candidates[0];
    selectedIds.add(chosen.id);
    return chosen;
  };

  // #2: The Team's Best Overall Hitter (Highest wOBA / OPS).
  // "The Book": #2 comes to plate more than #3, #4 or #5 with runners on base and fewer outs.
  result[1] = pickBest((a, b) => getWOBA(b) - getWOBA(a));

  // #4: Clean-up (Highest ISO & Slugging)
  // Maximizes runs on extrabases with runners placed by #1 and #2.
  result[3] = pickBest((a, b) => getISO(b) - getISO(a));

  // #1: Lead-off (Highest remaining OBP + speed/contact)
  // Generates early traffic without clogging bases.
  result[0] = pickBest((a, b) => getOBP(b) - getOBP(a));

  // #5: Secondary Power / High SLG
  result[4] = pickBest((a, b) => getSLG(b) - getSLG(a));

  // #3: Pure Contact Hitter (Solid AVG, avoids double plays)
  result[2] = pickBest((a, b) => getAVG(b) - getAVG(a));

  // #6 through #9: Descending offensive capability (wOBA)
  result[5] = pickBest((a, b) => getWOBA(b) - getWOBA(a));
  result[6] = pickBest((a, b) => getWOBA(b) - getWOBA(a));
  result[7] = pickBest((a, b) => getWOBA(b) - getWOBA(a));
  result[8] = pickBest((a, b) => getWOBA(b) - getWOBA(a));

  return result;
}
