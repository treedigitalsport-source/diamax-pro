export type SubscriptionTier = 'trial' | 'comentarista' | 'manager_pro' | 'master';
export type GameStatus = 'scheduled' | 'live' | 'finished';
export type HalfInning = 'TOP' | 'BOTTOM';

export interface LeagueRecord {
  id: string; // UID de la liga
  name: string; // Nombre de la liga o torneo
  adminId: string; // UID del usuario creador
  plan: SubscriptionTier;
  season: string; // ej. "2025-2026"
  categories: string[]; // ej. ["U12", "Juvenil", "Adulto", "Veteranos"]
  createdAt: number; // timestamp
}

export interface TeamScoreRecord {
  id: string;
  name: string;
  score: number;
  hits: number;
  errors: number;
}

export interface RunnerBasesRecord {
  first: string | null;
  second: string | null;
  third: string | null;
}

export interface GameRecord {
  id: string;
  leagueId: string;
  homeTeam: TeamScoreRecord;
  awayTeam: TeamScoreRecord;
  currentInning: number;
  halfInning: HalfInning;
  outs: number; // 0-2
  count: {
    balls: number;
    strikes: number;
  };
  runners: RunnerBasesRecord;
  status: GameStatus;
  boxScore: Array<{
    id?: string;
    inning: number;
    half: HalfInning;
    description: string;
    action: string;
    batterName?: string;
    pitcherName?: string;
    runsScored: number;
    timestamp: number;
  }>;
  updatedAt: number; // timestamp
}

export interface SimulationRecord {
  id: string;
  gameId: string | null;
  userId: string;
  teamA: {
    name: string;
    winProb: number;
    avgRuns: number;
  };
  teamB: {
    name: string;
    winProb: number;
    avgRuns: number;
  };
  iterations: number; // mínimo 10,000
  distribution: Array<{
    scoreDiff: number;
    frequency: number;
  }>;
  createdAt: number; // timestamp
}

export interface UserRecord {
  uid: string;
  email: string;
  displayName: string;
  subscriptionTier: SubscriptionTier;
  trialEndsAt: number; // timestamp
  whatsappPhone: string; // con código de país ej: "+584121234567"
  createdAt: number; // timestamp
}
