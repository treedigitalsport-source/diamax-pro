-- ============================================================
-- DIAMAX PRO — ROW LEVEL SECURITY POLICIES
-- AISLAMIENTO MULTI-TENANT: Tampa ≠ Caracas ≠ Tokyo
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

-- Funciones auxiliares de seguridad (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION get_auth_tenant_id() RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_auth_role() RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- PERFILES
CREATE POLICY "Ver perfiles del tenant" ON public.profiles
    FOR SELECT USING (tenant_id = get_auth_tenant_id());
CREATE POLICY "Editar perfil propio" ON public.profiles
    FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admin inserta perfiles" ON public.profiles
    FOR INSERT WITH CHECK (get_auth_role() IN ('ADMIN_LIGA','MANAGER') AND tenant_id = get_auth_tenant_id());

-- LIGAS
CREATE POLICY "Ver ligas del tenant" ON public.leagues
    FOR SELECT USING (tenant_id = get_auth_tenant_id());
CREATE POLICY "Admin gestiona ligas" ON public.leagues
    FOR ALL USING (get_auth_role() = 'ADMIN_LIGA' AND tenant_id = get_auth_tenant_id());

-- EQUIPOS
CREATE POLICY "Ver equipos del tenant" ON public.teams
    FOR SELECT USING (tenant_id = get_auth_tenant_id());
CREATE POLICY "Manager gestiona equipos" ON public.teams
    FOR ALL USING (get_auth_role() IN ('MANAGER','ADMIN_LIGA') AND tenant_id = get_auth_tenant_id());

-- JUEGOS
CREATE POLICY "Ver juegos del tenant" ON public.games
    FOR SELECT USING (tenant_id = get_auth_tenant_id());
CREATE POLICY "Manager y Coach gestionan juegos" ON public.games
    FOR ALL USING (get_auth_role() IN ('MANAGER','COACH','ADMIN_LIGA') AND tenant_id = get_auth_tenant_id());

-- ENTRADAS
CREATE POLICY "Ver entradas del tenant" ON public.innings
    FOR SELECT USING (tenant_id = get_auth_tenant_id());
CREATE POLICY "Manager y Coach gestionan entradas" ON public.innings
    FOR ALL USING (get_auth_role() IN ('MANAGER','COACH') AND tenant_id = get_auth_tenant_id());

-- TURNOS AL BATE
CREATE POLICY "Ver turnos del tenant" ON public.at_bats
    FOR SELECT USING (tenant_id = get_auth_tenant_id());
CREATE POLICY "Manager y Coach gestionan turnos" ON public.at_bats
    FOR ALL USING (get_auth_role() IN ('MANAGER','COACH') AND tenant_id = get_auth_tenant_id());

-- LANZAMIENTOS
CREATE POLICY "Ver pitcheos del tenant" ON public.pitches
    FOR SELECT USING (tenant_id = get_auth_tenant_id());
CREATE POLICY "Manager y Coach gestionan pitcheos" ON public.pitches
    FOR ALL USING (get_auth_role() IN ('MANAGER','COACH') AND tenant_id = get_auth_tenant_id());

-- SABERMETRÍA
CREATE POLICY "Ver stats del tenant" ON public.sabermetrics
    FOR SELECT USING (tenant_id = get_auth_tenant_id());
CREATE POLICY "Manager actualiza stats" ON public.sabermetrics
    FOR ALL USING (get_auth_role() IN ('MANAGER','ADMIN_LIGA') AND tenant_id = get_auth_tenant_id());