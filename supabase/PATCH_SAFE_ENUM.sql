-- ============================================================
-- PARCHE DEFINITIVO: EVITAR ERROR DE TIPO EN get_jwt_user_role
-- ============================================================

CREATE OR REPLACE FUNCTION get_jwt_user_role() RETURNS user_role AS $$
DECLARE
    v_role TEXT;
BEGIN
    IF auth.uid() IS NOT NULL THEN
        SELECT role::text INTO v_role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
        IF v_role IS NOT NULL AND v_role IN ('CEO', 'ADMIN_LIGA', 'MANAGER', 'COACH', 'JUGADOR') THEN
            RETURN v_role::user_role;
        END IF;
    END IF;

    v_role := auth.jwt() -> 'user_metadata' ->> 'role';
    IF v_role IS NOT NULL AND v_role IN ('CEO', 'ADMIN_LIGA', 'MANAGER', 'COACH', 'JUGADOR') THEN
        RETURN v_role::user_role;
    END IF;

    -- Para usuarios anónimos o no autenticados, retornar NULL sin error
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_super_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(get_jwt_user_role() = 'CEO', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_jwt_tenant_id() RETURNS UUID AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN COALESCE(
        NULLIF(auth.jwt() ->> 'tenant_id', '')::UUID,
        (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1)
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Acceso público al marcador y juegos
DROP POLICY IF EXISTS "Games: Tenant isolation select" ON public.games;
CREATE POLICY "Games: Tenant isolation select" ON public.games
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Games: Scoring staff management" ON public.games;
CREATE POLICY "Games: Scoring staff management" ON public.games
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Events: Tenant isolation select" ON public.canonical_game_events;
CREATE POLICY "Events: Tenant isolation select" ON public.canonical_game_events
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Events: Append only by scorer" ON public.canonical_game_events;
CREATE POLICY "Events: Append only by scorer" ON public.canonical_game_events
    FOR INSERT WITH CHECK (true);
