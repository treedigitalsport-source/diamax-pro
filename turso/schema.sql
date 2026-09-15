-- ============================================================
-- DIAMAX PRO — TURSO (libSQL) SCHEMA OFFLINE
-- Una base de datos por liga/tenant
-- ============================================================

CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    game_date TEXT NOT NULL,
    status TEXT DEFAULT 'SCHEDULED',
    innings_us TEXT DEFAULT '[]',
    innings_them TEXT DEFAULT '[]',
    total_us INTEGER DEFAULT 0,
    total_them INTEGER DEFAULT 0,
    total_innings INTEGER DEFAULT 9,
    current_inning INTEGER DEFAULT 1,
    synced INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS innings (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    inning_number INTEGER NOT NULL,
    top_bottom TEXT NOT NULL DEFAULT 'TOP',
    outs_count INTEGER DEFAULT 0,
    runs_us INTEGER DEFAULT 0,
    runs_them INTEGER DEFAULT 0,
    synced INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS at_bats (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    inning_id TEXT REFERENCES innings(id),
    batter_name TEXT,
    pitcher_name TEXT,
    result TEXT,
    balls INTEGER DEFAULT 0,
    strikes INTEGER DEFAULT 0,
    rbi INTEGER DEFAULT 0,
    synced INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pitches (
    id TEXT PRIMARY KEY,
    at_bat_id TEXT REFERENCES at_bats(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    pitch_type TEXT,
    velocity REAL,
    is_strike INTEGER DEFAULT 0,
    result TEXT,
    sequence_num INTEGER NOT NULL,
    zone INTEGER,
    synced INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inning_runs (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    inning_number INTEGER NOT NULL,
    runs_us INTEGER DEFAULT 0,
    runs_them INTEGER DEFAULT 0,
    synced INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sync_log (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL,
    synced_at TEXT,
    error TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Índices para performance offline
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date);
CREATE INDEX IF NOT EXISTS idx_innings_game_id ON innings(game_id);
CREATE INDEX IF NOT EXISTS idx_at_bats_game_id ON at_bats(game_id);
CREATE INDEX IF NOT EXISTS idx_pitches_at_bat_id ON pitches(at_bat_id);
CREATE INDEX IF NOT EXISTS idx_unsynced ON pitches(synced) WHERE synced = 0;