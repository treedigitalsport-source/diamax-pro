-- ============================================================
-- DIAMAX PRO — ROW LEVEL SECURITY POLICIES V2.0
-- Aislamiento Estricto Multi-Tenant y Control Basado en Roles (RBAC)
-- CEO Alí Zapata · 3Tree Digital Sport IA
-- ============================================================

-- Habilitar RLS en todas las tablas canónicas
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_game_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sabermetrics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_audit_log ENABLE ROW LEVEL SECURITY;

-- Funciones Auxiliares de Seguridad (SECURITY DEFINER para prevenir recursión)
CREATE OR REPLACE FUNCTION get_jwt_tenant_id() RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt() ->> 'tenant_id')::UUID,
        (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_jwt_user_role() RETURNS user_role AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt() ->> 'role')::user_role,
        (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_super_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_jwt_user_role() = 'CEO';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 1. POLÍTICAS PARA PROFILES
DROP POLICY IF EXISTS "Profiles: Tenant isolation select" ON public.profiles;
CREATE POLICY "Profiles: Tenant isolation select" ON public.profiles
    FOR SELECT USING (is_super_admin() OR tenant_id = get_jwt_tenant_id());

DROP POLICY IF EXISTS "Profiles: User self update" ON public.profiles;
CREATE POLICY "Profiles: User self update" ON public.profiles
    FOR UPDATE USING (id = auth.uid() OR is_super_admin() OR (get_jwt_user_role() IN ('ADMIN_LIGA') AND tenant_id = get_jwt_tenant_id()));

DROP POLICY IF EXISTS "Profiles: Admin insert" ON public.profiles;
CREATE POLICY "Profiles: Admin insert" ON public.profiles
    FOR INSERT WITH CHECK (is_super_admin() OR (get_jwt_user_role() IN ('ADMIN_LIGA', 'MANAGER') AND tenant_id = get_jwt_tenant_id()));

-- 2. POLÍTICAS PARA LEAGUES
DROP POLICY IF EXISTS "Leagues: Tenant isolation select" ON public.leagues;
CREATE POLICY "Leagues: Tenant isolation select" ON public.leagues
    FOR SELECT USING (is_super_admin() OR tenant_id = get_jwt_tenant_id());

DROP POLICY IF EXISTS "Leagues: Admin management" ON public.leagues;
CREATE POLICY "Leagues: Admin management" ON public.leagues
    FOR ALL USING (is_super_admin() OR (get_jwt_user_role() IN ('ADMIN_LIGA') AND tenant_id = get_jwt_tenant_id()));

-- 3. POLÍTICAS PARA TEAMS
DROP POLICY IF EXISTS "Teams: Tenant isolation select" ON public.teams;
CREATE POLICY "Teams: Tenant isolation select" ON public.teams
    FOR SELECT USING (is_super_admin() OR tenant_id = get_jwt_tenant_id());

DROP POLICY IF EXISTS "Teams: Manager and Admin management" ON public.teams;
CREATE POLICY "Teams: Manager and Admin management" ON public.teams
    FOR ALL USING (is_super_admin() OR (get_jwt_user_role() IN ('ADMIN_LIGA', 'MANAGER') AND tenant_id = get_jwt_tenant_id()));

-- 4. POLÍTICAS PARA GAMES
DROP POLICY IF EXISTS "Games: Tenant isolation select" ON public.games;
CREATE POLICY "Games: Tenant isolation select" ON public.games
    FOR SELECT USING (is_super_admin() OR tenant_id = get_jwt_tenant_id());

DROP POLICY IF EXISTS "Games: Scoring staff management" ON public.games;
CREATE POLICY "Games: Scoring staff management" ON public.games
    FOR ALL USING (is_super_admin() OR (get_jwt_user_role() IN ('ADMIN_LIGA', 'MANAGER', 'COACH') AND tenant_id = get_jwt_tenant_id()));

-- 5. POLÍTICAS PARA CANONICAL_GAME_EVENTS (INMUTABILIDAD + AISLAMIENTO)
DROP POLICY IF EXISTS "Events: Tenant isolation select" ON public.canonical_game_events;
CREATE POLICY "Events: Tenant isolation select" ON public.canonical_game_events
    FOR SELECT USING (is_super_admin() OR tenant_id = get_jwt_tenant_id());

DROP POLICY IF EXISTS "Events: Append only by scorer" ON public.canonical_game_events;
CREATE POLICY "Events: Append only by scorer" ON public.canonical_game_events
    FOR INSERT WITH CHECK (
        is_super_admin() OR (
            get_jwt_user_role() IN ('ADMIN_LIGA', 'MANAGER', 'COACH') 
            AND tenant_id = get_jwt_tenant_id()
        )
    );

-- Nota: NO se crean políticas de UPDATE o DELETE para canonical_game_events (Inmutable por diseño).

-- 6. POLÍTICAS PARA SABERMETRICS SUMMARY
DROP POLICY IF EXISTS "Sabermetrics: Tenant isolation select" ON public.sabermetrics_summary;
CREATE POLICY "Sabermetrics: Tenant isolation select" ON public.sabermetrics_summary
    FOR SELECT USING (is_super_admin() OR tenant_id = get_jwt_tenant_id());

DROP POLICY IF EXISTS "Sabermetrics: Calculation engine management" ON public.sabermetrics_summary;
CREATE POLICY "Sabermetrics: Calculation engine management" ON public.sabermetrics_summary
    FOR ALL USING (is_super_admin() OR (get_jwt_user_role() IN ('ADMIN_LIGA', 'MANAGER', 'COACH') AND tenant_id = get_jwt_tenant_id()));
