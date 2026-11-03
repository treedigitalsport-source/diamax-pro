export type HalfInning = "TOP" | "BOTTOM"; // Alta o Baja del Inning
export type MatchStatus = "SCHEDULED" | "LIVE" | "FINAL" | "SUSPENDED";

export interface RunnerBases {
  first: string | null;   // ID del corredor en 1B
  second: string | null;  // ID del corredor en 2B
  third: string | null;   // ID del corredor en 3B
}

export interface InningScore {
  inning: number;
  awayRuns: number;
  homeRuns: number;
}

export interface MatchState {
  id: string;
  tournamentId?: string;
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    logo?: string;
    runs: number;
    hits: number;
    errors: number;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    logo?: string;
    runs: number;
    hits: number;
    errors: number;
  };
  status: MatchStatus;
  currentInning: number;
  halfInning: HalfInning;
  balls: number;
  strikes: number;
  outs: number;
  runners: RunnerBases;
  lineScore: InningScore[];
  currentPitcherId?: string;
  currentBatterId?: string;
  updatedAt: number;
}

export interface PlayRecord {
  id?: string;
  matchId: string;
  inning: number;
  halfInning: HalfInning;
  description: string;
  result: "STRIKE" | "BALL" | "OUT" | "HIT_1B" | "HIT_2B" | "HIT_3B" | "HR" | "WALK" | "ERROR";
  runsScored: number;
  timestamp: number;
}
