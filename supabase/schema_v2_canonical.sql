-- ============================================================
-- DIAMAX PRO — POSTGRESQL / SUPABASE CANONICAL SCHEMA V2.0
-- 3Tree Digital Sport IA · CEO Alí Zapata (Lutz, Florida USA)
-- Arquitectura: Event Sourcing + Source of Record Canónico
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS DE DOMINIO
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('CEO', 'ADMIN_LIGA', 'MANAGER', 'COACH', 'JUGADOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE game_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'SUSPENDED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pitch_type_enum AS ENUM ('4-Seam', 'Slider', 'Changeup', 'Curve', 'Bola', 'Foul', 'Cutter', 'Sinker', 'Splitter');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ordering_status_enum AS ENUM ('PENDING', 'CANONICAL', 'REVERTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. TABLA DE LIGAS (MULTI-TENANT PARENT)
CREATE TABLE IF NOT EXISTS public.leagues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    category_level VARCHAR(100) NOT NULL,
    season_year INT NOT NULL,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_league_tenant UNIQUE (tenant_id, id)
);

-- 2. TABLA DE PERFILES (EXTIENDE auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role user_role DEFAULT 'JUGADOR' NOT NULL,
    team_name VARCHAR(255),
    category VARCHAR(100),
    location VARCHAR(255),
    invite_code VARCHAR(50),
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    is_team_owner BOOLEAN DEFAULT FALSE NOT NULL,
    permissions JSONB DEFAULT '[]'::JSONB NOT NULL,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE EQUIPOS
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    invite_code VARCHAR(50),
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE JUEGOS
CREATE TABLE IF NOT EXISTS public.games (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    home_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    away_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
    game_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status game_status DEFAULT 'SCHEDULED' NOT NULL,
    innings_us INT[] DEFAULT '{}',
    innings_them INT[] DEFAULT '{}',
    total_us INT DEFAULT 0 NOT NULL,
    total_them INT DEFAULT 0 NOT NULL,
    total_innings INT DEFAULT 9 NOT NULL,
    current_inning INT DEFAULT 1 NOT NULL,
    current_half VARCHAR(10) DEFAULT 'TOP' NOT NULL CHECK (current_half IN ('TOP', 'BOTTOM')),
    home_team_name VARCHAR(255) NOT NULL,
    away_team_name VARCHAR(255) NOT NULL,
    lineup_home JSONB DEFAULT '[]'::JSONB NOT NULL,
    lineup_away JSONB DEFAULT '[]'::JSONB NOT NULL,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ
);

-- 5. CANONICAL GAME EVENT STREAM (FUENTE ÚNICA DE VERDAD MATEMÁTICA)
CREATE TABLE IF NOT EXISTS public.canonical_game_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    client_event_id VARCHAR(100) NOT NULL,
    seq BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    schema_version VARCHAR(20) NOT NULL DEFAULT '1.1-FINAL',
    timestamp TIMESTAMPTZ NOT NULL,
    inning INT NOT NULL,
    half VARCHAR(10) NOT NULL CHECK (half IN ('TOP', 'BOTTOM')),
    outs_before INT NOT NULL,
    outs_after INT NOT NULL,
    score_home_after INT NOT NULL,
    score_away_after INT NOT NULL,
    bases_after JSONB NOT NULL,
    runs_scored INT NOT NULL DEFAULT 0,
    rbi_count INT NOT NULL DEFAULT 0,
    batter JSONB NOT NULL,
    pitcher JSONB NOT NULL,
    runners_advanced JSONB DEFAULT '[]'::JSONB,
    earned_run_analysis JSONB DEFAULT '[]'::JSONB,
    reverted_event_id VARCHAR(100),
    ordering_status ordering_status_enum NOT NULL DEFAULT 'CANONICAL',
    raw_payload JSONB NOT NULL,
    tenant_id UUID NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_game_client_event UNIQUE (game_id, client_event_id),
    CONSTRAINT uq_game_seq UNIQUE (game_id, seq)
);

-- 6. SABERMETRICS PROJECTIONS (VISTA MATERIALIZADA/CACHÉ POR JUGADOR)
CREATE TABLE IF NOT EXISTS public.sabermetrics_summary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
    season_year INT NOT NULL,
    pa INT DEFAULT 0 NOT NULL,
    ab INT DEFAULT 0 NOT NULL,
    h INT DEFAULT 0 NOT NULL,
    b1 INT DEFAULT 0 NOT NULL,
    b2 INT DEFAULT 0 NOT NULL,
    b3 INT DEFAULT 0 NOT NULL,
    hr INT DEFAULT 0 NOT NULL,
    r INT DEFAULT 0 NOT NULL,
    rbi INT DEFAULT 0 NOT NULL,
    bb INT DEFAULT 0 NOT NULL,
    so INT DEFAULT 0 NOT NULL,
    hbp INT DEFAULT 0 NOT NULL,
    sf INT DEFAULT 0 NOT NULL,
    sh INT DEFAULT 0 NOT NULL,
    sb INT DEFAULT 0 NOT NULL,
    cs INT DEFAULT 0 NOT NULL,
    avg NUMERIC(5,3) DEFAULT 0.000 NOT NULL,
    obp NUMERIC(5,3) DEFAULT 0.000 NOT NULL,
    slg NUMERIC(5,3) DEFAULT 0.000 NOT NULL,
    ops NUMERIC(5,3) DEFAULT 0.000 NOT NULL,
    babip NUMERIC(5,3) DEFAULT 0.000 NOT NULL,
    tb INT DEFAULT 0 NOT NULL,
    ip_outs INT DEFAULT 0 NOT NULL,
    ip_visual VARCHAR(10) DEFAULT '0.0' NOT NULL,
    er INT DEFAULT 0 NOT NULL,
    r_allowed INT DEFAULT 0 NOT NULL,
    era NUMERIC(6,2) DEFAULT 0.00 NOT NULL,
    whip NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    k_allowed INT DEFAULT 0 NOT NULL,
    bb_allowed INT DEFAULT 0 NOT NULL,
    tenant_id UUID NOT NULL,
    last_event_seq BIGINT DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_player_season_team UNIQUE (player_id, season_year, team_id)
);

-- 7. AUDITORÍA DE SINCRONIZACIÓN Y ERRORES
CREATE TABLE IF NOT EXISTS public.sync_audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    client_event_id VARCHAR(100) NOT NULL,
    assigned_seq BIGINT,
    sync_status VARCHAR(50) NOT NULL,
    error_message TEXT,
    ip_address INET,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES ESTRATÉGICOS MULTI-TENANT
CREATE INDEX IF NOT EXISTS idx_leagues_tenant ON public.leagues(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_teams_tenant ON public.teams(tenant_id);
CREATE INDEX IF NOT EXISTS idx_games_tenant ON public.games(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_tenant ON public.canonical_game_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_game_seq ON public.canonical_game_events(game_id, seq ASC);
CREATE INDEX IF NOT EXISTS idx_sabermetrics_tenant ON public.sabermetrics_summary(tenant_id);

-- PROTECCIÓN DE INMUTABILIDAD DEL EVENT STREAM
CREATE OR REPLACE FUNCTION public.prevent_event_stream_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'DIAMAX SECURITY VIOLATION: Canonical event stream is strictly immutable. UPDATE or DELETE operations are prohibited.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_immutable_canonical_events ON public.canonical_game_events;
CREATE TRIGGER trg_immutable_canonical_events
    BEFORE UPDATE OR DELETE ON public.canonical_game_events
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_event_stream_tampering();

-- RPC ATÓMICA: SINCRONIZACIÓN CANÓNICA CON IDEMPOTENCIA Y ASIGNACIÓN DE SEQ
CREATE OR REPLACE FUNCTION public.fn_sync_canonical_event(
    p_event JSONB,
    p_tenant_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_game_id UUID;
    v_client_event_id VARCHAR(100);
    v_existing_event RECORD;
    v_next_seq BIGINT;
    v_inserted_id UUID;
BEGIN
    v_game_id := (p_event->>'gameId')::UUID;
    v_client_event_id := p_event->>'clientEventId';

    IF v_game_id IS NULL OR v_client_event_id IS NULL THEN
        RAISE EXCEPTION 'Payload inválido: gameId y clientEventId son obligatorios.';
    END IF;

    -- Verificar idempotencia (¿ya fue recibido?)
    SELECT id, seq, client_event_id, ordering_status INTO v_existing_event
    FROM public.canonical_game_events
    WHERE game_id = v_game_id AND client_event_id = v_client_event_id;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'status', 'ALREADY_EXISTS',
            'clientEventId', v_existing_event.client_event_id,
            'seq', v_existing_event.seq,
            'orderingStatus', v_existing_event.ordering_status,
            'id', v_existing_event.id
        );
    END IF;

    -- Bloqueo a nivel de juego para asignación atómica
    PERFORM pg_advisory_xact_lock(hashtext(v_game_id::text));

    SELECT COALESCE(MAX(seq), 0) + 1 INTO v_next_seq
    FROM public.canonical_game_events
    WHERE game_id = v_game_id;

    -- Inserción canónica
    INSERT INTO public.canonical_game_events (
        game_id,
        client_event_id,
        seq,
        event_type,
        schema_version,
        timestamp,
        inning,
        half,
        outs_before,
        outs_after,
        score_home_after,
        score_away_after,
        bases_after,
        runs_scored,
        rbi_count,
        batter,
        pitcher,
        runners_advanced,
        earned_run_analysis,
        reverted_event_id,
        ordering_status,
        raw_payload,
        tenant_id
    ) VALUES (
        v_game_id,
        v_client_event_id,
        v_next_seq,
        p_event->>'type',
        COALESCE(p_event->>'schemaVersion', '1.1-FINAL'),
        COALESCE((p_event->>'timestamp')::TIMESTAMPTZ, NOW()),
        (p_event->>'inning')::INT,
        p_event->>'half',
        (p_event->>'outsBefore')::INT,
        (p_event->>'outsAfter')::INT,
        (p_event->>'scoreHomeAfter')::INT,
        (p_event->>'scoreAwayAfter')::INT,
        COALESCE(p_event->'basesAfter', '{}'::JSONB),
        COALESCE((p_event->>'runsScored')::INT, 0),
        COALESCE((p_event->>'rbiCount')::INT, 0),
        COALESCE(p_event->'batter', '{}'::JSONB),
        COALESCE(p_event->'pitcher', '{}'::JSONB),
        COALESCE(p_event->'runnersAdvanced', '[]'::JSONB),
        COALESCE(p_event->'earnedRunAnalysis', '[]'::JSONB),
        p_event->>'revertedEventId',
        'CANONICAL',
        p_event,
        p_tenant_id
    ) RETURNING id INTO v_inserted_id;

    RETURN jsonb_build_object(
        'status', 'SYNCED',
        'clientEventId', v_client_event_id,
        'seq', v_next_seq,
        'orderingStatus', 'CANONICAL',
        'id', v_inserted_id
    );
END;
$$;
