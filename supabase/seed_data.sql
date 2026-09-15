-- DIAMAX PRO — DATOS DE PRUEBA (3 Ligas, 6 Equipos)
DO $$
DECLARE
    tenant_tampa UUID := uuid_generate_v4();
    tenant_caracas UUID := uuid_generate_v4();
    tenant_maracay UUID := uuid_generate_v4();
    liga_tampa UUID := uuid_generate_v4();
    liga_caracas UUID := uuid_generate_v4();
    liga_maracay UUID := uuid_generate_v4();
    team_rays UUID := uuid_generate_v4();
    team_yankees UUID := uuid_generate_v4();
    team_leones UUID := uuid_generate_v4();
    team_navegantes UUID := uuid_generate_v4();
    team_tigres UUID := uuid_generate_v4();
    team_cachorros UUID := uuid_generate_v4();
BEGIN
    INSERT INTO public.leagues (id, name, country, city, category_level, season_year, tenant_id) VALUES
    (liga_tampa, 'Liga Tampa Junior 2026', 'USA', 'Tampa', 'Junior', 2026, tenant_tampa),
    (liga_caracas, 'Liga Criollo Caracas 2026', 'Venezuela', 'Caracas', 'Criollo', 2026, tenant_caracas),
    (liga_maracay, 'Liga Preinfantil Maracay 2026', 'Venezuela', 'Maracay', 'Preinfantil', 2026, tenant_maracay);

    INSERT INTO public.teams (id, name, league_id, category, city, country, tenant_id) VALUES
    (team_rays, 'Tampa Bay Rays Jr', liga_tampa, 'Junior', 'Tampa', 'USA', tenant_tampa),
    (team_yankees, 'Tampa Yankees Jr', liga_tampa, 'Junior', 'Tampa', 'USA', tenant_tampa),
    (team_leones, 'Leones Caracas Criollo', liga_caracas, 'Criollo', 'Caracas', 'Venezuela', tenant_caracas),
    (team_navegantes, 'Navegantes Criollo', liga_caracas, 'Criollo', 'Caracas', 'Venezuela', tenant_caracas),
    (team_tigres, 'Tigres Preinfantil', liga_maracay, 'Preinfantil', 'Maracay', 'Venezuela', tenant_maracay),
    (team_cachorros, 'Cachorros Maracay', liga_maracay, 'Preinfantil', 'Maracay', 'Venezuela', tenant_maracay);

    RAISE NOTICE 'SEED OK — tenant_tampa=%', tenant_tampa;
    RAISE NOTICE 'tenant_caracas=%', tenant_caracas;
    RAISE NOTICE 'tenant_maracay=%', tenant_maracay;
END $$;