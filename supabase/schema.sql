-- ============================================================
-- DIAMAX PRO — SUPABASE SCHEMA COMPLETO
-- 3Tree Digital Sport IA · CEO Alí Zapata
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('MANAGER', 'COACH', 'JUGADOR', 'ADMIN_LIGA');
CREATE TYPE game_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');
CREATE TYPE pitch_type_enum AS ENUM ('4-Seam', 'Slider', 'Changeup', 'Curve', 'Bola', 'Foul', 'Cutter', 'Sinker');

-- LIGAS
CREATE TABLE public.leagues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100), city VARCHAR(100),
    category_level VARCHAR(100), season_year INT,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERFILES DE USUARIO (extiende auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role user_role DEFAULT 'JUGADOR',
    team_name VARCHAR(255), category VARCHAR(100),
    location VARCHAR(255), invite_code VARCHAR(50),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    is_team_owner BOOLEAN DEFAULT FALSE,
    permissions TEXT[] DEFAULT '{}',
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EQUIPOS
CREATE TABLE public.teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manager_id UUID REFERENCES public.profiles(id),
    league_id UUID REFERENCES public.leagues(id),
    category VARCHAR(100), city VARCHAR(100), country VARCHAR(100),
    invite_code VARCHAR(50),
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JUEGOS
CREATE TABLE public.games (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    home_team_id UUID REFERENCES public.teams(id),
    away_team_id UUID REFERENCES public.teams(id),
    league_id UUID REFERENCES public.leagues(id),
    game_date TIMESTAMPTZ NOT NULL,
    status game_status DEFAULT 'SCHEDULED',
    innings_us INT[] DEFAULT '{}',
    innings_them INT[] DEFAULT '{}',
    total_us INT DEFAULT 0, total_them INT DEFAULT 0,
    total_innings INT DEFAULT 9,
    current_inning INT DEFAULT 1,
    home_team_name VARCHAR(255), away_team_name VARCHAR(255),
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ
);

-- ENTRADAS / INNINGS
CREATE TABLE public.innings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    inning_number INT NOT NULL,
    top_bottom VARCHAR(10) NOT NULL CHECK (top_bottom IN ('TOP','BOTTOM')),
    outs INT DEFAULT 0,
    runs_scored_us INT DEFAULT 0,
    runs_scored_them INT DEFAULT 0,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TURNOS AL BATE
CREATE TABLE public.at_bats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    inning_id UUID REFERENCES public.innings(id) ON DELETE CASCADE,
    batter_id UUID REFERENCES public.profiles(id),
    pitcher_id UUID REFERENCES public.profiles(id),
    batter_name VARCHAR(255), pitcher_name VARCHAR(255),
    result VARCHAR(50), balls INT DEFAULT 0, strikes INT DEFAULT 0, rbi INT DEFAULT 0,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LANZAMIENTOS / PITCHES
CREATE TABLE public.pitches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    at_bat_id UUID REFERENCES public.at_bats(id) ON DELETE CASCADE,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    pitch_type pitch_type_enum, velocity DECIMAL(5,2),
    is_strike BOOLEAN, result VARCHAR(50),
    sequence_number INT NOT NULL, zone INT, spin_rate INT,
    tenant_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SABERMETRÍA
CREATE TABLE public.sabermetrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    season_year INT NOT NULL,
    team_id UUID REFERENCES public.teams(id),
    league_id UUID REFERENCES public.leagues(id),
    games_played INT DEFAULT 0, at_bats_count INT DEFAULT 0,
    hits INT DEFAULT 0, doubles INT DEFAULT 0, triples INT DEFAULT 0,
    home_runs INT DEFAULT 0, rbi INT DEFAULT 0,
    walks INT DEFAULT 0, strikeouts INT DEFAULT 0, stolen_bases INT DEFAULT 0,
    batting_avg DECIMAL(5,3), on_base_pct DECIMAL(5,3),
    slugging_pct DECIMAL(5,3), ops DECIMAL(5,3), babip DECIMAL(5,3),
    innings_pitched DECIMAL(5,1), earned_runs INT DEFAULT 0,
    era DECIMAL(5,2), whip DECIMAL(5,2),
    strikeouts_pitched INT DEFAULT 0, walks_allowed INT DEFAULT 0, fip DECIMAL(5,2),
    tenant_id UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES DE RENDIMIENTO
CREATE INDEX idx_leagues_tenant_id ON public.leagues(tenant_id);
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_teams_tenant_id ON public.teams(tenant_id);
CREATE INDEX idx_games_tenant_id ON public.games(tenant_id);
CREATE INDEX idx_games_date ON public.games(game_date);
CREATE INDEX idx_innings_game_id ON public.innings(game_id);
CREATE INDEX idx_at_bats_game_id ON public.at_bats(game_id);
CREATE INDEX idx_pitches_at_bat_id ON public.pitches(at_bat_id);

-- HABILITAR ROW LEVEL SECURITY EN TODAS LAS TABLAS
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.at_bats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sabermetrics ENABLE ROW LEVEL SECURITY;

-- TRIGGER: Auto-crear perfil al registrarse en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, tenant_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario DIAMAX'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'JUGADOR'),
    COALESCE((NEW.raw_user_meta_data->>'tenant_id')::UUID, uuid_generate_v4())
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();