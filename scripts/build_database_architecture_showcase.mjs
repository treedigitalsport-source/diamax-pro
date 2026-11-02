import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, '..');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIAMAX PRO — Arquitectura de Base de Datos Tripartita (v3.0)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0D0D11;
      --glass-bg: rgba(255, 255, 255, 0.04);
      --glass-border: rgba(255, 255, 255, 0.1);
      --apple-blue: #007AFF;
      --ice-cyan: #00D2FF;
      --gold-primary: #FFC72C;
      --emerald-green: #34C759;
      --purple-violet: #AF52DE;
      --text-muted: #8E8E93;
      --text-silver: #A1A1AA;
      --squircle: 14px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(0, 122, 255, 0.08) 0%, transparent 45%),
        radial-gradient(circle at 85% 85%, rgba(0, 210, 255, 0.08) 0%, transparent 45%);
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      padding: 32px 20px;
    }
    .header-bar {
      max-width: 1260px;
      margin: 0 auto 32px;
      background: var(--glass-bg);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid var(--glass-border);
      border-radius: var(--squircle);
      padding: 24px 30px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    }
    .brand-title {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-title h1 {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #FFF 40%, var(--ice-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .container {
      max-width: 1260px;
      margin: 0 auto;
    }
    .section-title {
      font-size: 19px;
      font-weight: 800;
      color: #FFF;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-desc {
      font-size: 13.5px;
      color: var(--text-silver);
      line-height: 1.6;
      margin-bottom: 24px;
    }

    /* SELECTOR DE DOMINIOS TRIPARTITOS */
    .domain-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .domain-btn {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--squircle);
      padding: 20px;
      text-align: left;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .domain-btn:hover {
      transform: translateY(-3px);
      border-color: rgba(0, 210, 255, 0.35);
    }
    .domain-btn.active {
      border-color: var(--ice-cyan);
      background: rgba(0, 210, 255, 0.08);
      box-shadow: 0 0 0 2px var(--ice-cyan), 0 12px 30px rgba(0, 210, 255, 0.2);
    }
    .domain-badge {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 8px;
    }
    .badge-comentarista { background: rgba(175, 82, 222, 0.15); color: var(--purple-violet); border: 1px solid rgba(175, 82, 222, 0.3); }
    .badge-manager { background: rgba(255, 199, 44, 0.15); color: var(--gold-primary); border: 1px solid rgba(255, 199, 44, 0.3); }
    .badge-anotador { background: rgba(52, 199, 89, 0.15); color: var(--emerald-green); border: 1px solid rgba(52, 199, 89, 0.3); }

    .domain-btn h3 { font-size: 17px; font-weight: 900; color: #FFF; margin-bottom: 4px; }
    .domain-btn p { font-size: 12px; color: var(--text-silver); line-height: 1.4; }

    /* CONTENEDOR DE PANELES DE DATOS */
    .data-panel {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 36px;
    }
    .data-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--squircle);
      padding: 24px;
      display: flex;
      flex-direction: column;
    }
    .data-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }
    .type-pill {
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pill-structured { background: rgba(0, 122, 255, 0.15); color: #38BDF8; border: 1px solid rgba(0, 122, 255, 0.3); }
    .pill-semi { background: rgba(255, 199, 44, 0.15); color: #FDE047; border: 1px solid rgba(255, 199, 44, 0.3); }
    .pill-unstructured { background: rgba(175, 82, 222, 0.15); color: #E879F9; border: 1px solid rgba(175, 82, 222, 0.3); }

    .table-list { list-style: none; margin: 0; padding: 0; }
    .table-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 10px;
    }
    .table-item-name {
      font-family: monospace;
      font-size: 13px;
      font-weight: 700;
      color: var(--ice-cyan);
      margin-bottom: 4px;
    }
    .table-item-desc {
      font-size: 11.5px;
      color: var(--text-silver);
      line-height: 1.4;
    }

    /* VISOR SQL INTERACTIVO */
    .sql-viewer-section {
      background: #080A0F;
      border: 1px solid var(--glass-border);
      border-radius: var(--squircle);
      padding: 24px;
    }
    .sql-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    pre.sql-code {
      background: #04060A;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 18px;
      color: #94A3B8;
      font-family: 'SF Mono', Menlo, Consolas, monospace;
      font-size: 12px;
      line-height: 1.6;
      max-height: 380px;
      overflow-y: auto;
    }
  </style>
</head>
<body>

  <header class="header-bar">
    <div class="brand-title">
      <svg width="36" height="36" viewBox="0 0 100 100">
        <polygon points="50,5 95,35 78,92 22,92 5,35" fill="#00D2FF" opacity="0.2" stroke="#00D2FF" stroke-width="4"/>
        <polygon points="50,15 85,40 70,85 30,85 15,40" fill="#FFC72C" opacity="0.8"/>
      </svg>
      <div>
        <h1>DIAMAX PRO — Arquitectura Tripartita de Base de Datos</h1>
        <p style="font-size:12px; color:var(--text-silver);">Segregación Estricta: Comentarista · Mánager · Anotador (Estructurados, JSONB &amp; pgvector)</p>
      </div>
    </div>
    <div>
      <button onclick="window.location.href='/'" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#FFF; padding:10px 18px; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer;">Abrir DIAMAX PRO</button>
    </div>
  </header>

  <main class="container">
    <div class="section-title">
      <h2>1. Selección de Dominio Segregado (Bases Divididas por Rol)</h2>
    </div>
    <p class="section-desc">
      Haga clic en cualquiera de los 3 dominios para visualizar el desglose técnico de datos estructurados, semiestructurados y no estructurados con políticas RLS de aislamiento total:
    </p>

    <!-- SELECTOR DE DOMINIOS -->
    <div class="domain-selector">
      <div class="domain-btn active" id="btn-comentarista" onclick="switchDomain('comentarista')">
        <span class="domain-badge badge-comentarista">Plan Individual por Narrador</span>
        <h3>1. Comentarista &amp; Media</h3>
        <p>Cabina broadcast individual por suscriptor. Notas privadas, spotting board, teleprompter de pautas y dictado por voz.</p>
      </div>

      <div class="domain-btn" id="btn-manager" onclick="switchDomain('manager')">
        <span class="domain-badge badge-manager">Cuerpo Técnico &amp; Táctica</span>
        <h3>2. Mánager &amp; Dugout</h3>
        <p>Estrategia 2D en tiempo real. Bullpen, monitoreo de fatiga, matrices de shifts defensivos y scouting predictivo de rivales.</p>
      </div>

      <div class="domain-btn" id="btn-anotador" onclick="switchDomain('anotador')">
        <span class="domain-badge badge-anotador">Anotador Oficial &amp; Liga</span>
        <h3>3. Anotador Oficial</h3>
        <p>Verdad canónica inmutable. EventStore de 36 jugadas con encadenamiento SHA-256, boxscore legal y jurisprudencia arbitral.</p>
      </div>
    </div>

    <!-- PANELES DE DATOS (ESTRUCTURADOS / SEMIESTRUCTURADOS / NO ESTRUCTURADOS) -->
    <div class="data-panel" id="data-panel-content">
      <!-- Se inyecta dinámicamente según el dominio seleccionado -->
    </div>

    <!-- VISOR DDL SQL -->
    <section class="sql-viewer-section">
      <div class="sql-header">
        <div>
          <h3 style="font-size:16px; font-weight:800; color:#FFF;">Definición DDL Oficial (PostgreSQL + Supabase RLS)</h3>
          <p style="font-size:12px; color:var(--text-silver);">Archivo fuente: <code>supabase/DIAMAX_PRO_TRIPARTITE_DATABASE_ARCHITECTURE.sql</code></p>
        </div>
        <span style="font-size:11px; background:rgba(52,199,89,0.15); color:var(--emerald-green); border:1px solid rgba(52,199,89,0.3); padding:4px 10px; border-radius:6px; font-weight:800;">PRODUCCIÓN LISTA</span>
      </div>
      <pre class="sql-code" id="sql-display"></pre>
    </section>

  </main>

  <script>
    const domainsData = {
      comentarista: {
        title: 'Dominio Comentarista (diamax_comentarista)',
        structured: [
          { name: 'perfiles_cabina', desc: 'Identidad del narrador, medio de difusión, estadísticas de transmisiones y preferencias del teleprompter.' },
          { name: 'pautas_patrocinadores', desc: 'Menciones publicitarias programadas, condiciones de disparo (HR, Strikeout, Inning) y contador de menciones en vivo.' }
        ],
        semi: [
          { name: 'spotting_boards (JSONB)', desc: 'Matriz visual de la cabina: alineaciones de ambos clubes, pronunciaciones fonéticas de peloteros y datos de árbitros.' },
          { name: 'notas_tacticas_en_vivo (JSONB)', desc: 'Notas rápidas por bateador/inning guardadas con índice GIN para latencia ultra-baja en transmisión.' }
        ],
        unstructured: [
          { name: 'memoria_vectorial_narrador (pgvector)', desc: 'Grabaciones de voz (STT) y anécdotas históricas vectorizadas (1536 dimensiones) para sugerencias Anti-Dead Air en vivo.' }
        ],
        sqlSnippet: \`-- ESQUEMA COMENTARISTA (MUESTRA DDL)
CREATE SCHEMA IF NOT EXISTS diamax_comentarista;

CREATE TABLE diamax_comentarista.perfiles_cabina (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES diamax_core.usuarios(id) ON DELETE CASCADE,
    nombre_narrador VARCHAR(120) NOT NULL,
    medio_difusion VARCHAR(100) DEFAULT 'Radio & Streaming Digital',
    total_juegos_narrados INT DEFAULT 0
);

CREATE TABLE diamax_comentarista.spotting_boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_cabina_id UUID REFERENCES diamax_comentarista.perfiles_cabina(id),
    datos_alineacion_home JSONB NOT NULL DEFAULT '[]'::jsonb,
    pronunciaciones_foneticas JSONB DEFAULT '{}'::jsonb,
    notas_tacticas_en_vivo JSONB DEFAULT '{}'::jsonb
);
CREATE INDEX idx_spotting_gin ON diamax_comentarista.spotting_boards USING GIN (notas_tacticas_en_vivo);

CREATE TABLE diamax_comentarista.memoria_vectorial_narrador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contenido_texto TEXT NOT NULL,
    embedding VECTOR(1536) -- Búsqueda semántica por similitud coseno
);\n\`
      },
      manager: {
        title: 'Dominio Mánager (diamax_manager)',
        structured: [
          { name: 'equipos_manager', desc: 'Franquicia, cuerpo técnico, directiva, división y roster activo.' },
          { name: 'monitoreo_bullpen', desc: 'Lanzadores disponibles, conteo de pitcheos hoy (S/B), días de descanso acumulados y umbral de fatiga máxima.' }
        ],
        semi: [
          { name: 'tacticas_defensivas (JSONB)', desc: 'Coordenadas 2D precisas (x,y) de los 7 jugadores de cuadro y jardines según el shift (Anti-Pull, Infield-In, etc.).' },
          { name: 'spray_chart_frecuencias (JSONB)', desc: 'Mapas de calor de batazos del rival (porcentajes de Pull, Center y Oppo) indexados con GIN.' }
        ],
        unstructured: [
          { name: 'scouting_ia_vectorial (pgvector)', desc: 'Informes cualitativos de scouting y modelos predictivos de tendencias de mánagers rivales con embeddings de 1536d.' }
        ],
        sqlSnippet: \`-- ESQUEMA MÁNGER (MUESTRA DDL)
CREATE SCHEMA IF NOT EXISTS diamax_manager;

CREATE TABLE diamax_manager.monitoreo_bullpen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pitcher_nombre VARCHAR(120) NOT NULL,
    brazo_lanzar VARCHAR(5) CHECK (brazo_lanzar IN ('RHP', 'LHP')),
    lanzamientos_hoy INT DEFAULT 0,
    umbral_fatiga_max INT DEFAULT 85,
    estado_disponibilidad VARCHAR(30) DEFAULT 'DISPONIBLE'
);

CREATE TABLE diamax_manager.tacticas_defensivas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bateador_rival_nombre VARCHAR(120) NOT NULL,
    posiciones_shift JSONB NOT NULL DEFAULT '{"1b": [220, 240], "ss": [140, 175]}'::jsonb,
    spray_chart_frecuencias JSONB DEFAULT '{"pull_pct": 58.2}'::jsonb
);
CREATE INDEX idx_tacticas_gin ON diamax_manager.tacticas_defensivas USING GIN (posiciones_shift);\n\`
      },
      anotador: {
        title: 'Dominio Anotador Oficial (diamax_anotador)',
        structured: [
          { name: 'juegos_oficiales', desc: 'Partidos de la Liga, line score canónico, carreras, hits, errores, estado legal y hash SHA-256 de integridad.' },
          { name: 'event_store_canonico', desc: 'Registro inmutable de las 36 jugadas canónicas con secuencia estrictamente monotónica y hashes encadenados.' }
        ],
        semi: [
          { name: 'line_score_snapshots (JSONB)', desc: 'Fotografías del estado de bases, atribución de carreras limpias/sucias y matriz completa de boxscore por inning.' }
        ],
        unstructured: [
          { name: 'jurisprudencia_reglas_vectorial (pgvector)', desc: 'Actas de arbitraje, precedentes de anotación oficial (Reglas WBSC / MLB) vectorizados para resolución instantánea de disputas.' }
        ],
        sqlSnippet: \`-- ESQUEMA ANOTADOR OFICIAL (MUESTRA DDL)
CREATE SCHEMA IF NOT EXISTS diamax_anotador;

CREATE TABLE diamax_anotador.juegos_oficiales (
    id VARCHAR(100) PRIMARY KEY,
    inning_actual INT DEFAULT 1,
    carreras_home INT DEFAULT 0,
    carreras_away INT DEFAULT 0,
    hash_estado_sha256 TEXT NOT NULL -- Blindaje determinista
);

CREATE TABLE diamax_anotador.event_store_canonico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    juego_id VARCHAR(100) REFERENCES diamax_anotador.juegos_oficiales(id),
    sequence_number BIGINT NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL, -- 1B, 2B, 3B, HR, 6-4-3 DP...
    event_hash TEXT NOT NULL,
    CONSTRAINT uq_juego_secuencia UNIQUE (juego_id, sequence_number)
);\n\`
      }
    };

    function renderDomain(key) {
      const d = domainsData[key];
      const panel = document.getElementById('data-panel-content');
      panel.innerHTML = \`
        <!-- COLUMNA 1: ESTRUCTURADOS -->
        <div class="data-card">
          <div class="data-card-header">
            <h4 style="font-size:15px; font-weight:800; color:#FFF;">Datos Estructurados</h4>
            <span class="type-pill pill-structured">ACID / SQL</span>
          </div>
          <ul class="table-list">
            \${d.structured.map(item => \`
              <li class="table-item">
                <div class="table-item-name">\${item.name}</div>
                <div class="table-item-desc">\${item.desc}</div>
              </li>
            \`).join('')}
          </ul>
        </div>

        <!-- COLUMNA 2: SEMIESTRUCTURADOS -->
        <div class="data-card">
          <div class="data-card-header">
            <h4 style="font-size:15px; font-weight:800; color:#FFF;">Semiestructurados</h4>
            <span class="type-pill pill-semi">JSONB / GIN</span>
          </div>
          <ul class="table-list">
            \${d.semi.map(item => \`
              <li class="table-item">
                <div class="table-item-name">\${item.name}</div>
                <div class="table-item-desc">\${item.desc}</div>
              </li>
            \`).join('')}
          </ul>
        </div>

        <!-- COLUMNA 3: NO ESTRUCTURADOS -->
        <div class="data-card">
          <div class="data-card-header">
            <h4 style="font-size:15px; font-weight:800; color:#FFF;">No Estructurados</h4>
            <span class="type-pill pill-unstructured">pgvector / AI</span>
          </div>
          <ul class="table-list">
            \${d.unstructured.map(item => \`
              <li class="table-item">
                <div class="table-item-name">\${item.name}</div>
                <div class="table-item-desc">\${item.desc}</div>
              </li>
            \`).join('')}
          </ul>
        </div>
      \`;
      document.getElementById('sql-display').textContent = d.sqlSnippet;
    }

    function switchDomain(key) {
      document.querySelectorAll('.domain-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('btn-' + key).classList.add('active');
      renderDomain(key);
    }

    renderDomain('comentarista');
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(baseDir, 'prototipo_base_de_datos_tripartita.html'), html, 'utf8');
console.log('✅ Prototipo interactivo generado en prototipo_base_de_datos_tripartita.html');
