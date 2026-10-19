export type BattingHand = 'L' | 'R' | 'S';
export type ThrowingHand = 'L' | 'R';

export interface Player {
  id: number;
  num: number;
  name: string;
  defaultPos: string;
  bats: BattingHand;
  throws: ThrowingHand;
  obp: number;
  slg: number;
  avg: number;
  iso?: number;
  woba?: number;
  ops?: number;
  photo: string;
  era?: number;
  fip?: number;
  pa?: number;
  ab?: number;
  h?: number;
  doubles?: number;
  triples?: number;
  hr?: number;
  bb?: number;
  so?: number;
  r?: number;
  rbi?: number;
}

export interface LineupSlot {
  order: number;
  player: Player;
  pos: string;
}

export type BattedBallResult = '1B' | '2B' | '3B' | 'HR' | 'GO' | 'FO' | 'LO' | 'PO' | 'E';

export interface BattedBall {
  id: string;
  batterId: number;
  batterName: string;
  pitcherId: number;
  pitcherName: string;
  x: number; // 0-100% SVG coordinates
  y: number; // 0-100% SVG coordinates
  distanceFt: number;
  exitVeloMph: number;
  launchAngleDeg: number;
  result: BattedBallResult;
  quadrant: number; // 1-9 strike zone quadrant
  inning: number;
  outs: number;
  timestamp: number;
}

export type FatigueLevel = 'optimal' | 'caution' | 'critical';

export interface PitcherFatigue {
  pitcherId: number;
  pitcherName: string;
  pitchCount: number;
  balls: number;
  strikes: number;
  status: FatigueLevel;
  maxLimit: number; // 75 pitches in +55
  warningTriggered: boolean;
}

export interface SimulationResult {
  expectedRuns: number; // xR
  scoringInningsPct: number; // % innings with >= 1 run
  explosiveRalliesPct: number; // % innings with >= 3 runs
  runsDistribution: number[]; // frequency histogram for 0 to 12+ runs
  iterations: number;
  inningsSimulated: number;
}

export interface BaseRunners {
  first: Player | null;
  second: Player | null;
  third: Player | null;
}

export type DefensiveShift = 'standard' | 'right_shift' | 'infield_in' | 'deep_defense';

export interface FielderCoordinate {
  pos: string;
  label: string;
  player?: Player;
  x: number; // percentage in SVG (0-100)
  y: number; // percentage in SVG (0-100)
}

export interface GameStateSnapshot {
  scoreHome: number;
  scoreAway: number;
  currentInning: number;
  isTopInning: boolean;
  outs: number;
  balls: number;
  strikes: number;
  runners: BaseRunners;
  currentBatterIndex: number;
  pitchCount: number;
}

export interface GameState {
  gameId: string;
  date: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  isHomeClub: boolean;
  scoreHome: number;
  scoreAway: number;
  currentInning: number;
  isTopInning: boolean;
  outs: number;
  balls: number;
  strikes: number;
  runners: BaseRunners;
  currentBatterIndex: number; // 0 to 8 in lineup
  currentPitcher: Player;
  pitchCount: number;
  battedBalls: BattedBall[];
  lineup: LineupSlot[];
  bench: Player[];
  defensiveShift: DefensiveShift;
  history: GameStateSnapshot[];
}

export type PlayAction =
  | 'BALL'
  | 'CALLED_STRIKE'
  | 'SWINGING_STRIKE'
  | 'FOUL'
  | 'SINGLE'
  | 'DOUBLE'
  | 'TRIPLE'
  | 'HOME_RUN'
  | 'WALK'
  | 'HIT_BY_PITCH'
  | 'GROUND_OUT'
  | 'FLY_OUT'
  | 'LINE_OUT'
  | 'POP_OUT'
  | 'STRIKEOUT_SWINGING'
  | 'STRIKEOUT_LOOKING'
  | 'DOUBLE_PLAY'
  | 'TRIPLE_PLAY'
  | 'STOLEN_BASE'
  | 'CAUGHT_STEALING'
  | 'WILD_PITCH'
  | 'PASSED_BALL'
  | 'ERROR'
  | 'SACRIFICE_FLY'
  | 'SACRIFICE_BUNT'
  | 'BALK'
  | 'FIELDERS_CHOICE';
