-- ============================================================================
-- DIAMAX PRO — ARQUITECTURA DE BASE DE DATOS INTELIGENTE TRIPARTITA (v3.0)
-- ============================================================================
-- Autoridad: Lic. Alí José Zapata Mendoza (Founder, Board Chairman & Head Coach)
-- Propósito: Segregación física y lógica por Roles y Planes
--           1. Comentarista & Media (Cabina independiente por suscriptor)
--           2. Mánager & Cuerpo Técnico (Táctica 2D, Bullpen, Shifts, Scouting)
--           3. Anotador Oficial (EventStore canónico inmutable y Boxscore legal)
-- Modelo de Datos:
--   • Estructurados (Relacional ACID / PostgreSQL)
--   • Semiestructurados (JSONB con índices GIN para alta concurrencia)
--   • No Estructurados (pgvector con embeddings de 1536 dimensiones para IA)
-- ============================================================================

-- 0. EXTENSIONES CRÍTICAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Soporte para datos no estructurados / IA

-- 1. ESQUEMAS SEPARADOS POR ROL Y DOMINIO
CREATE SCHEMA IF NOT EXISTS diamax_core;         -- Núcleo compartido de autenticación y federación
CREATE SCHEMA IF NOT EXISTS diamax_comentarista; -- Dominio Cabina de Medios y Narradores
CREATE SCHEMA IF NOT EXISTS diamax_manager;      -- Dominio Mánager y Táctica de Dugout
CREATE SCHEMA IF NOT EXISTS diamax_anotador;     -- Dominio Anotador Oficial y Reglas Canónicas

-- ============================================================================
-- SECCIÓN I: NÚCLEO COMPARTIDO (FEDERACIÓN & AUTENTICACIÓN)
-- ============================================================================

CREATE TABLE IF NOT EXISTS diamax_core.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(120) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('LIGA', 'FRANQUICIA', 'EQUIPO', 'ACADEMIA', 'MEDIA_BROADCAST')),
    plan_activo VARCHAR(50) NOT NULL,
    config_seguridad JSONB DEFAULT '{"mfa_required": false, "session_timeout_min": 120}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diamax_core.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES diamax_core.tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('COMENTARISTA', 'MANAGER', 'ANOTADOR_OFICIAL', 'SUPER_ADMIN_CEO')),
    credencial_hash TEXT NOT NULL,
    metadata_sesion JSONB DEFAULT '{}'::jsonb,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECCIÓN II: DOMINIO COMENTARISTA & CABINA DE MEDIOS (SEPARADA POR PLAN)
-- ============================================================================
-- Espacio 100% individual por narrador. Cero interferencia con el Dugout.

-- 1. ESTRUCTURADOS: Perfil de Narrador, Sesiones de Cabina & Pautas Comerciales
CREATE TABLE IF NOT EXISTS diamax_comentarista.perfiles_cabina (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES diamax_core.usuarios(id) ON DELETE CASCADE,
    nombre_narrador VARCHAR(120) NOT NULL,
    medio_difusion VARCHAR(100) DEFAULT 'Radio & Streaming Digital',
    color_identidad VARCHAR(10) DEFAULT '#00D2FF',
    preferencias_pantalla JSONB DEFAULT '{"teleprompter_speed": 1.0, "auto_scroll": true, "show_radar": false}'::jsonb,
    total_juegos_narrados INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diamax_comentarista.pautas_patrocinadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_cabina_id UUID REFERENCES diamax_comentarista.perfiles_cabina(id) ON DELETE CASCADE,
    marca VARCHAR(120) NOT NULL,
    script_mencion TEXT NOT NULL,
    condicion_disparo VARCHAR(50) NOT NULL CHECK (condicion_disparo IN ('INNING_BREAK', 'HOMERUN', 'PITCHING_CHANGE', 'STRIKEOUT', 'MANUAL')),
    frecuencia_minutos INT DEFAULT 15,
    conteo_menciones INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

-- 2. SEMIESTRUCTURADOS: Spotting Board Digital & Notas Rápidas por Pelotero (JSONB)
CREATE TABLE IF NOT EXISTS diamax_comentarista.spotting_boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_cabina_id UUID REFERENCES diamax_comentarista.perfiles_cabina(id) ON DELETE CASCADE,
    game_id VARCHAR(100) NOT NULL,
    -- JSONB de alto rendimiento para datos volátiles de transmisión
    datos_alineacion_home JSONB NOT NULL DEFAULT '[]'::jsonb,
    datos_alineacion_away JSONB NOT NULL DEFAULT '[]'::jsonb,
    pronunciaciones_foneticas JSONB DEFAULT '{}'::jsonb,
    notas_tacticas_en_vivo JSONB DEFAULT '{}'::jsonb,
    datos_arbitros JSONB DEFAULT '{"principal": "Por asignar", "1b": "", "2b": "", "3b": ""}'::jsonb,
    teleprompter_nuggets JSONB DEFAULT '[]'::jsonb, -- Datos "Anti-Dead Air"
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_spotting_gin ON diamax_comentarista.spotting_boards USING GIN (notas_tacticas_en_vivo);

-- 3. NO ESTRUCTURADOS: Notas de Voz Dictadas (STT), Anécdotas & Transcripciones Vectorizadas
CREATE TABLE IF NOT EXISTS diamax_comentarista.memoria_vectorial_narrador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_cabina_id UUID REFERENCES diamax_comentarista.perfiles_cabina(id) ON DELETE CASCADE,
    pelotero_id VARCHAR(100),
    categoria VARCHAR(50) DEFAULT 'ANECDOTA_HISTORICA',
    contenido_texto TEXT NOT NULL,
    audio_storage_url TEXT, -- URL del archivo de voz grabado (.webm / .wav)
    embedding VECTOR(1536), -- Vector de búsqueda semántica (OpenAI / Gemini Embeddings)
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comentarista_vector ON diamax_comentarista.memoria_vectorial_narrador USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================================
-- SECCIÓN III: DOMINIO MÁNAGER & CUERPO TÉCNICO (TERRENO 2D, BULLPEN, TÁCTICA)
-- ============================================================================

-- 1. ESTRUCTURADOS: Gestión de Roster, Bullpen, Fatiga y Límites de Pitcheo
CREATE TABLE IF NOT EXISTS diamax_manager.equipos_manager (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES diamax_core.tenants(id) ON DELETE CASCADE,
    nombre_equipo VARCHAR(100) NOT NULL,
    manager_nombre VARCHAR(120) NOT NULL,
    categoria VARCHAR(50) DEFAULT 'PROFESIONAL_MAYOR',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diamax_manager.monitoreo_bullpen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipo_id UUID REFERENCES diamax_manager.equipos_manager(id) ON DELETE CASCADE,
    pitcher_id VARCHAR(100) NOT NULL,
    pitcher_nombre VARCHAR(120) NOT NULL,
    brazo_lanzar VARCHAR(5) CHECK (brazo_lanzar IN ('RHP', 'LHP')),
    lanzamientos_hoy INT DEFAULT 0,
    strikes_hoy INT DEFAULT 0,
    bolas_hoy INT DEFAULT 0,
    dias_descanso_acumulados INT DEFAULT 4,
    umbral_fatiga_max INT DEFAULT 85,
    estado_disponibilidad VARCHAR(30) DEFAULT 'DISPONIBLE' CHECK (estado_disponibilidad IN ('DISPONIBLE', 'CALENTANDO', 'EN_JUEGO', 'FATIGADO', 'DESCANSO_OBLIGATORIO')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SEMIESTRUCTURADOS: Shifts Defensivos, Spray Charts y Probabilidades Predictivas
CREATE TABLE IF NOT EXISTS diamax_manager.tacticas_defensivas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipo_id UUID REFERENCES diamax_manager.equipos_manager(id) ON DELETE CASCADE,
    bateador_rival_id VARCHAR(100) NOT NULL,
    bateador_rival_nombre VARCHAR(120) NOT NULL,
    perfil_bateo VARCHAR(10) CHECK (perfil_bateo IN ('DIESTRO', 'ZURDO', 'AMBIDIESTRO')),
    -- Matriz de posicionamiento de los 7 fildeadores en coordenadas 2D (x, y)
    posiciones_shift JSONB NOT NULL DEFAULT '{"1b": [220, 240], "2b": [190, 180], "ss": [140, 175], "3b": [90, 235], "lf": [60, 100], "cf": [160, 60], "rf": [250, 95]}'::jsonb,
    tipo_shift VARCHAR(50) DEFAULT 'ANTI_PULL' CHECK (tipo_shift IN ('ESTANDAR', 'ANTI_PULL', 'INFIELD_IN', 'OVERLOAD_RIGHT', 'OVERLOAD_LEFT', 'NO_DOUBLES')),
    spray_chart_frecuencias JSONB DEFAULT '{"pull_pct": 58.2, "center_pct": 24.1, "oppo_pct": 17.7}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tacticas_gin ON diamax_manager.tacticas_defensivas USING GIN (posiciones_shift);

-- 3. NO ESTRUCTURADOS: Informes de Scouting Cualitativo & Modelos IA de Decisiones
CREATE TABLE IF NOT EXISTS diamax_manager.scouting_ia_vectorial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipo_id UUID REFERENCES diamax_manager.equipos_manager(id) ON DELETE CASCADE,
    objetivo_scouting VARCHAR(120) NOT NULL, -- Ej: "Tendencias del Mánager Rival en 8vo Inning con hombres en base"
    reporte_cualitativo TEXT NOT NULL,
    recomendacion_tactica_ia TEXT NOT NULL,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_manager_vector ON diamax_manager.scouting_ia_vectorial USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================================
-- SECCIÓN IV: DOMINIO ANOTADOR OFICIAL (EVENTSTORE CANÓNICO & BOXSCORE LEGAL)
-- ============================================================================
-- Inmutable, matemáticamente blindado, verdad canónica de la Liga.

-- 1. ESTRUCTURADOS: Encuentro Oficial & Partición Canónica de Eventos
CREATE TABLE IF NOT EXISTS diamax_anotador.juegos_oficiales (
    id VARCHAR(100) PRIMARY KEY, -- Formato canónico: YYYYMMDD-AWAY-HOME
    tenant_id UUID REFERENCES diamax_core.tenants(id) ON DELETE CASCADE,
    anotador_id UUID REFERENCES diamax_core.usuarios(id),
    equipo_home VARCHAR(100) NOT NULL,
    equipo_away VARCHAR(100) NOT NULL,
    inning_actual INT DEFAULT 1,
    half_actual VARCHAR(10) DEFAULT 'TOP' CHECK (half_actual IN ('TOP', 'BOTTOM')),
    outs_actuales INT DEFAULT 0 CHECK (outs_actuales BETWEEN 0 AND 3),
    carreras_home INT DEFAULT 0,
    carreras_away INT DEFAULT 0,
    hits_home INT DEFAULT 0,
    hits_away INT DEFAULT 0,
    errores_home INT DEFAULT 0,
    errores_away INT DEFAULT 0,
    estado_partido VARCHAR(30) DEFAULT 'EN_JUEGO' CHECK (estado_partido IN ('PROGRAMADO', 'EN_JUEGO', 'PAUSADO', 'FINALIZADO', 'CONFISCADO')),
    hash_estado_sha256 TEXT NOT NULL, -- Integridad criptográfica determinista
    fecha_inicio TIMESTAMPTZ DEFAULT NOW(),
    fecha_fin TIMESTAMPTZ
);

-- EventStore Canónico Inmutable (Registro de las 36 jugadas canónicas)
CREATE TABLE IF NOT EXISTS diamax_anotador.event_store_canonico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    juego_id VARCHAR(100) REFERENCES diamax_anotador.juegos_oficiales(id) ON DELETE CASCADE,
    sequence_number BIGINT NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL, -- Ej: '1B', 'HR', 'K', '6-4-3 DP', 'BB'
    inning INT NOT NULL,
    half VARCHAR(10) NOT NULL,
    outs_previos INT NOT NULL,
    outs_posteriores INT NOT NULL,
    bateador_id VARCHAR(100) NOT NULL,
    lanzador_id VARCHAR(100) NOT NULL,
    prev_event_hash TEXT NOT NULL,
    event_hash TEXT NOT NULL, -- Hash encadenado SHA-256 (Anti-manipulación)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_juego_secuencia UNIQUE (juego_id, sequence_number)
);

-- 2. SEMIESTRUCTURADOS: Boxscore Matrix & Snapshots de Reconciliación (JSONB)
CREATE TABLE IF NOT EXISTS diamax_anotador.line_score_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    juego_id VARCHAR(100) REFERENCES diamax_anotador.juegos_oficiales(id) ON DELETE CASCADE,
    inning INT NOT NULL,
    half VARCHAR(10) NOT NULL,
    -- Snapshot completo del estado de bases y corredores
    estado_bases_json JSONB NOT NULL DEFAULT '{"b1": false, "b2": false, "b3": false}'::jsonb,
    atribucion_carreras JSONB NOT NULL DEFAULT '{"carreras_limpias": 0, "carreras_sucias": 0, "pitcher_responsable": ""}'::jsonb,
    boxscore_matriz JSONB NOT NULL, -- Matriz completa inning a inning R/H/E
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_snapshot_gin ON diamax_anotador.line_score_snapshots USING GIN (boxscore_matriz);

-- 3. NO ESTRUCTURADOS: Jurisprudencia Arbitral, Actas de Protesta & Justificaciones de Jugada
CREATE TABLE IF NOT EXISTS diamax_anotador.jurisprudencia_reglas_vectorial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regla_codigo VARCHAR(50) NOT NULL, -- Ej: "Regla 9.05 (Hits)", "Regla 9.12 (Errores)"
    titulo_caso TEXT NOT NULL,
    argumentacion_legal TEXT NOT NULL,
    precedente_oficial TEXT NOT NULL,
    embedding VECTOR(1536), -- Para consultas instantáneas durante controversias de jugadas
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_anotador_vector ON diamax_anotador.jurisprudencia_reglas_vectorial USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================================
-- SECCIÓN V: SEGURIDAD MULTI-INQUILINO (ROW LEVEL SECURITY - RLS)
-- ============================================================================

-- Habilitar RLS en todos los dominios
ALTER TABLE diamax_comentarista.perfiles_cabina ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamax_comentarista.spotting_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamax_comentarista.memoria_vectorial_narrador ENABLE ROW LEVEL SECURITY;

ALTER TABLE diamax_manager.equipos_manager ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamax_manager.monitoreo_bullpen ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamax_manager.tacticas_defensivas ENABLE ROW LEVEL SECURITY;

ALTER TABLE diamax_anotador.juegos_oficiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamax_anotador.event_store_canonico ENABLE ROW LEVEL SECURITY;

-- 1. Política Comentarista: Un narrador SOLO lee y escribe en sus propios spotting boards
CREATE POLICY rls_comentarista_propio ON diamax_comentarista.spotting_boards
    FOR ALL USING (perfil_cabina_id IN (
        SELECT id FROM diamax_comentarista.perfiles_cabina WHERE usuario_id = auth.uid()
    ));

-- 2. Política Mánager: Solo miembros del equipo pueden ver y modificar la táctica
CREATE POLICY rls_manager_equipo ON diamax_manager.tacticas_defensivas
    FOR ALL USING (equipo_id IN (
        SELECT id FROM diamax_manager.equipos_manager WHERE tenant_id = (
            SELECT tenant_id FROM diamax_core.usuarios WHERE id = auth.uid()
        )
    ));

-- 3. Política Anotador: Inmutabilidad estricta. Cero borrado en EventStore.
CREATE POLICY rls_anotador_insert_only ON diamax_anotador.event_store_canonico
    FOR INSERT WITH CHECK (juego_id IN (
        SELECT id FROM diamax_anotador.juegos_oficiales WHERE anotador_id = auth.uid()
    ));

CREATE POLICY rls_anotador_read_all ON diamax_anotador.event_store_canonico
    FOR SELECT USING (true); -- Lectura federada pública para transmisión y dugout

-- ============================================================================
-- FIN DE LA DEFINICIÓN DDL TRIPARTITA DIAMAX PRO v3.0
-- ============================================================================
