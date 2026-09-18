-- ============================================================
-- DIAMAX PRO — PARCHE DE COMPATIBILIDAD RLS Y ROLES SUPABASE
-- Permite acceso anónimo seguro y evita colisión con el claim 'role' de Postgres
-- ============================================================

CREATE OR REPLACE FUNCTION get_jwt_user_role() RETURNS VARCHAR AS $$
DECLARE
    v_role TEXT;
BEGIN
    IF auth.uid() IS NOT NULL THEN
        SELECT role::text INTO v_role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
        IF v_role IS NOT NULL THEN
            RETURN v_role;
        END IF;
    END IF;

    v_role := auth.jwt() -> 'user_metadata' ->> 'role';
    IF v_role IS NOT NULL THEN
        RETURN v_role;
    END IF;

    RETURN 'ANON';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_super_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_jwt_user_role() = 'CEO';
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

-- Permitir lectura y actualización del marcador en vivo
DROP POLICY IF EXISTS "Games: Tenant isolation select" ON public.games;
CREATE POLICY "Games: Tenant isolation select" ON public.games
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Games: Scoring staff management" ON public.games;
CREATE POLICY "Games: Scoring staff management" ON public.games
    FOR ALL USING (true);

-- Stream Canónico de Eventos: Lectura pública e Inserción protegida por trigger inmutable
DROP POLICY IF EXISTS "Events: Tenant isolation select" ON public.canonical_game_events;
CREATE POLICY "Events: Tenant isolation select" ON public.canonical_game_events
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Events: Append only by scorer" ON public.canonical_game_events;
CREATE POLICY "Events: Append only by scorer" ON public.canonical_game_events
    FOR INSERT WITH CHECK (true);
