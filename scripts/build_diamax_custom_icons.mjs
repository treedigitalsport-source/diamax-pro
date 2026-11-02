import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.resolve(__dirname, '..');
const outDir = path.join(baseDir, 'assets', 'icons', 'diamax');
fs.mkdirSync(outDir, { recursive: true });

const customIcons = [
  {
    id: 'dugout',
    name: 'Anotador Dugout',
    tab: 'Anotador Dugout',
    role: 'Pestaña Principal #1',
    desc: 'Arquitectura de dugout techado con Home Plate pentagonal y punto central de anotación en vivo.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 7V5C3 4.45 3.45 4 4 4H20C20.55 4 21 4.45 21 5V7"/>
  <path d="M3 7H21"/>
  <path d="M12 10.5L16.5 14V18.5L12 21L7.5 18.5V14L12 10.5Z"/>
  <circle cx="12" cy="15.5" r="1.2" fill="currentColor"/>
</svg>`
  },
  {
    id: 'lineup',
    name: 'Alineación Táctica',
    tab: 'Alineación',
    role: 'Pestaña Principal #2',
    desc: 'Roster card de 9 bateadores con slots jerárquicos y puntero de turno al bate activo.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="3" width="16" height="18" rx="2.5"/>
  <line x1="8.5" y1="7.5" x2="16.5" y2="7.5"/>
  <line x1="8.5" y1="12" x2="16.5" y2="12"/>
  <line x1="8.5" y1="16.5" x2="13.5" y2="16.5"/>
  <circle cx="6.5" cy="7.5" r="1" fill="currentColor"/>
  <circle cx="6.5" cy="12" r="1" fill="currentColor"/>
  <circle cx="6.5" cy="16.5" r="1" fill="currentColor"/>
</svg>`
  },
  {
    id: 'campo',
    name: 'Terreno de Juego',
    tab: 'Terreno',
    role: 'Pestaña Principal #3',
    desc: 'Diamante de béisbol reglamentario con foul lines, montículo del lanzador y las 4 bases señalizadas.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 21L21 12"/>
  <path d="M12 21L3 12"/>
  <polygon points="12,7 17,12 12,17 7,12"/>
  <circle cx="12" cy="12" r="1.3" fill="currentColor"/>
  <rect x="11.2" y="6.2" width="1.6" height="1.6" fill="currentColor"/>
  <rect x="16.2" y="11.2" width="1.6" height="1.6" fill="currentColor"/>
  <rect x="6.2" y="11.2" width="1.6" height="1.6" fill="currentColor"/>
  <polygon points="12,16.5 12.8,17.2 12.5,18 11.5,18 11.2,17.2" fill="currentColor"/>
</svg>`
  },
  {
    id: 'manual',
    name: 'Manual / Scorebook',
    tab: 'Manual',
    role: 'Pestaña Principal #4',
    desc: 'Cuaderno oficial de anotación sabermétrica con rejilla matricial y diamante de boxscore clásico.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 19.5V4.5C4 3.67 4.67 3 5.5 3H19.5V21H5.5C4.67 21 4 20.33 4 19.5Z"/>
  <line x1="7" y1="3" x2="7" y2="21"/>
  <polygon points="13.5,8 16.5,11 13.5,14 10.5,11"/>
  <line x1="10" y1="17" x2="17" y2="17"/>
</svg>`
  },
  {
    id: 'tarjeta-oficial',
    name: 'Tarjeta Oficial',
    tab: 'Tarjeta Oficial',
    role: 'Pestaña Principal #5',
    desc: 'Credencial y tarjeta oficial del cuerpo arbitral con sello de certificación y firma digital.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <rect x="5" y="4" width="14" height="17" rx="2.5"/>
  <path d="M9 4V2.5C9 2.22 9.22 2 9.5 2H14.5C14.78 2 15 2.22 15 2.5V4"/>
  <line x1="8" y1="8" x2="16" y2="8"/>
  <line x1="8" y1="11.5" x2="13" y2="11.5"/>
  <circle cx="14" cy="15.5" r="2.2"/>
  <path d="M13.1 15.5L13.8 16.2L15.1 14.8"/>
</svg>`
  },
  {
    id: 'ia-tactica',
    name: 'IA Táctica Sabermétrica',
    tab: 'IA Táctica',
    role: 'Pestaña Principal #6',
    desc: 'Diamante inteligente con enlaces neuronales, análisis predictivo de turnos y shifts defensivos.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12,3 20,11 12,19 4,11"/>
  <circle cx="12" cy="11" r="2.5"/>
  <line x1="12" y1="3" x2="12" y2="8.5"/>
  <line x1="12" y1="13.5" x2="12" y2="19"/>
  <line x1="4" y1="11" x2="9.5" y2="11"/>
  <line x1="14.5" y1="11" x2="20" y2="11"/>
  <circle cx="12" cy="3" r="1" fill="currentColor"/>
  <circle cx="20" cy="11" r="1" fill="currentColor"/>
  <circle cx="4" cy="11" r="1" fill="currentColor"/>
  <circle cx="12" cy="19" r="1" fill="currentColor"/>
</svg>`
  },
  {
    id: 'perfil',
    name: 'Perfil & Conectividad',
    tab: 'Perfil',
    role: 'Pestaña Principal #7',
    desc: 'Mánager táctico autenticado con radar de sincronización y estado de telemetría de red.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="8" r="4"/>
  <path d="M3.5 19.5C3.5 16.2 6.8 13.5 11 13.5C15.2 13.5 18.5 16.2 18.5 19.5"/>
  <path d="M19 4.5C20.2 5.7 21 7.2 21 9"/>
  <path d="M17 6.5C17.7 7.2 18.2 8.1 18.2 9"/>
</svg>`
  },
  {
    id: 'cabina',
    name: 'Cabina de Medios',
    tab: 'Cabina de Medios',
    role: 'Módulo Exclusivo Comentaristas',
    desc: 'Micrófono profesional Broadcast On-Air con ondas acústicas estéreo y protección contra solapamiento.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <rect x="9" y="3" width="6" height="11" rx="3"/>
  <path d="M5 10C5 13.87 8.13 17 12 17C15.87 17 19 13.87 19 10"/>
  <line x1="12" y1="17" x2="12" y2="21"/>
  <line x1="8" y1="21" x2="16" y2="21"/>
  <path d="M2.5 10C2.5 7.4 3.6 5 5.5 3.3"/>
  <path d="M21.5 10C21.5 7.4 20.4 5 18.5 3.3"/>
</svg>`
  },
  {
    id: 'luz-solar',
    name: 'Sensor Luz Solar / Noche',
    tab: 'Toolstrip Superior',
    role: 'Control Apple HIG',
    desc: 'Sensor dual fotométrico para conmutación instantánea entre Liquid Glass Dark y Contraste WCAG AAA.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2V4.5M12 19.5V22M4.93 4.93L6.7 6.7M17.3 17.3L19.07 19.07M2 12H4.5M19.5 12H22M4.93 19.07L6.7 17.3M17.3 6.7L19.07 4.93"/>
</svg>`
  },
  {
    id: 'audio-voz',
    name: 'Audio Táctico & Dictado',
    tab: 'Toolstrip Superior',
    role: 'Reconocimiento de Voz',
    desc: 'Ondas acústicas Siri / Voice Engine para dictado continuo de jugadas en vivo sin teclear.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <line x1="4" y1="12" x2="4" y2="12.01" stroke-width="2.5"/>
  <line x1="8" y1="8.5" x2="8" y2="15.5" stroke-width="2"/>
  <line x1="12" y1="4.5" x2="12" y2="19.5" stroke-width="2"/>
  <line x1="16" y1="7.5" x2="16" y2="16.5" stroke-width="2"/>
  <line x1="20" y1="12" x2="20" y2="12.01" stroke-width="2.5"/>
</svg>`
  },
  {
    id: 'nuevo-juego',
    name: 'Cargar / Nuevo Juego',
    tab: 'Acción Primaria',
    role: 'Gestión de Temporada',
    desc: 'Pelota de béisbol con costuras tácticas y marcador de inicialización de encuentro.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="9"/>
  <path d="M7 6.5C8.5 8 9.5 10 9.5 12C9.5 14 8.5 16 7 17.5"/>
  <path d="M17 6.5C15.5 8 14.5 10 14.5 12C14.5 14 15.5 16 17 17.5"/>
  <line x1="12" y1="9" x2="12" y2="15"/>
  <line x1="9" y1="12" x2="15" y2="12"/>
</svg>`
  },
  {
    id: 'salir',
    name: 'Salida de Juego Minimalista',
    tab: 'Cabecera Apple HIG',
    role: 'Acción Crítica Segura',
    desc: 'Glifo Standby/Cierre minimalista en gris plata que solo pasa a rojo suave en hover o advertencia.',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2.5V11.5"/>
  <path d="M5.64 6.64A9 9 0 1 0 18.36 6.64"/>
</svg>`
  }
];

// Guardar cada archivo SVG individualmente
customIcons.forEach(icon => {
  const filePath = path.join(outDir, `${icon.id}.svg`);
  fs.writeFileSync(filePath, icon.svg, 'utf8');
});
console.log(`✅ Guardados ${customIcons.length} iconos vectoriales exclusivos en assets/icons/diamax/`);

// Construir la página interactiva de demostración y comparación
let cardsHtml = '';
customIcons.forEach(icon => {
  cardsHtml += `
    <div class="icon-card" id="card-${icon.id}">
      <div class="icon-card-header">
        <div class="svg-wrapper" id="preview-${icon.id}">
          ${icon.svg}
        </div>
        <span class="badge-role">${icon.role}</span>
      </div>
      <div class="icon-info">
        <h4 class="icon-title">${icon.name}</h4>
        <div class="icon-target">Destino: <strong>${icon.tab}</strong></div>
        <p class="icon-desc">${icon.desc}</p>
      </div>
      <div class="icon-actions">
        <button class="btn-state active-demo" onclick="setCardState('${icon.id}', 'active')">Activo (#007AFF)</button>
        <button class="btn-state default-demo" onclick="setCardState('${icon.id}', 'default')">Neutro (#8E8E93)</button>
      </div>
    </div>
  `;
});

const prototypeHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIAMAX PRO — Iconos Vectoriales Exclusivos (Apple HIG)</title>
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
      --text-muted: #8E8E93;
      --text-silver: #A1A1AA;
      --squircle: 14px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(circle at 20% 15%, rgba(0, 122, 255, 0.09) 0%, transparent 45%),
        radial-gradient(circle at 80% 85%, rgba(0, 210, 255, 0.08) 0%, transparent 45%);
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

    /* SIMULADOR EN VIVO: BARRA DE NAVEGACIÓN APPLE SEGMENTED CONTROL */
    .segmented-control-demo {
      background: var(--glass-bg);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid var(--glass-border);
      border-radius: var(--squircle);
      padding: 24px;
      margin-bottom: 36px;
    }
    .segmented-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 4px;
      gap: 4px;
      max-width: 1060px;
      margin: 0 auto;
      overflow-x: auto;
    }
    .seg-tab {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 10px 18px;
      border-radius: 11px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }
    .seg-tab svg {
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      transition: all 0.25s ease;
    }
    .seg-tab:hover {
      color: #FFFFFF;
    }
    .seg-tab:hover svg {
      color: #FFFFFF;
    }
    .seg-tab.active {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #FFFFFF;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }
    .seg-tab.active svg {
      color: var(--apple-blue);
      filter: drop-shadow(0 0 8px rgba(0, 122, 255, 0.6));
    }

    /* GRID DE TARJETAS DE ICONOS */
    .grid-icons {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 20px;
      margin-bottom: 48px;
    }
    .icon-card {
      background: var(--glass-bg);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid var(--glass-border);
      border-radius: var(--squircle);
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s ease;
    }
    .icon-card:hover {
      border-color: rgba(0, 122, 255, 0.35);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .icon-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .svg-wrapper {
      width: 52px;
      height: 52px;
      border-radius: 13px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }
    .svg-wrapper svg {
      width: 28px;
      height: 28px;
      color: var(--text-muted);
      transition: all 0.25s ease;
    }
    .svg-wrapper.state-active {
      background: rgba(0, 122, 255, 0.15);
      border-color: var(--apple-blue);
    }
    .svg-wrapper.state-active svg {
      color: var(--apple-blue);
      filter: drop-shadow(0 0 10px rgba(0, 122, 255, 0.7));
    }
    .badge-role {
      font-size: 10px;
      font-weight: 800;
      color: var(--ice-cyan);
      background: rgba(0, 210, 255, 0.1);
      border: 1px solid rgba(0, 210, 255, 0.2);
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .icon-title {
      font-size: 16px;
      font-weight: 800;
      color: #FFF;
      margin-bottom: 4px;
    }
    .icon-target {
      font-size: 11.5px;
      color: var(--text-silver);
      margin-bottom: 8px;
    }
    .icon-target strong {
      color: var(--gold-primary);
    }
    .icon-desc {
      font-size: 12.5px;
      color: var(--text-silver);
      line-height: 1.5;
      margin-bottom: 18px;
    }
    .icon-actions {
      display: flex;
      gap: 8px;
    }
    .btn-state {
      flex: 1;
      padding: 8px;
      border-radius: 9px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .btn-state.active-demo {
      background: rgba(0, 122, 255, 0.15);
      border-color: rgba(0, 122, 255, 0.3);
      color: #38BDF8;
    }
    .btn-state.active-demo:hover {
      background: rgba(0, 122, 255, 0.3);
    }
    .btn-state.default-demo {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.12);
      color: var(--text-silver);
    }
    .btn-state.default-demo:hover {
      background: rgba(255, 255, 255, 0.1);
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
        <h1>DIAMAX PRO — Iconos Vectoriales Propios</h1>
        <p style="font-size:12px; color:var(--text-silver);">Reglas Oficiales Apple HIG: Monocromía Secundaria (#8E8E93) e Iluminación Activa (#007AFF)</p>
      </div>
    </div>
    <div>
      <button onclick="window.location.href='/'" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#FFF; padding:10px 18px; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer;">Abrir App Principal</button>
    </div>
  </header>

  <main class="container">
    
    <!-- DEMO DE CONTROL SEGMENTADO ESTILO MACOS -->
    <section class="segmented-control-demo">
      <div class="section-title">
        <span>🍏</span>
        <h2>Simulador Apple HIG: Barra de Módulos con los Iconos Propios</h2>
      </div>
      <p class="section-desc">
        Haga clic en cualquiera de las pestañas. Los iconos inactivos permanecen en el gris plata sutil oficial de Apple (<strong>#8E8E93</strong>); únicamente la pestaña seleccionada se eleva en la pastilla de vidrio y se ilumina con el acento azul cobalto (<strong>#007AFF</strong>):
      </p>

      <div class="segmented-bar" id="demo-nav-bar">
        <button class="seg-tab active" onclick="activateTab(this)">
          ${customIcons[0].svg}
          <span>Anotador Dugout</span>
        </button>
        <button class="seg-tab" onclick="activateTab(this)">
          ${customIcons[1].svg}
          <span>Alineación</span>
        </button>
        <button class="seg-tab" onclick="activateTab(this)">
          ${customIcons[2].svg}
          <span>Terreno</span>
        </button>
        <button class="seg-tab" onclick="activateTab(this)">
          ${customIcons[3].svg}
          <span>Manual</span>
        </button>
        <button class="seg-tab" onclick="activateTab(this)">
          ${customIcons[4].svg}
          <span>Tarjeta Oficial</span>
        </button>
        <button class="seg-tab" onclick="activateTab(this)">
          ${customIcons[5].svg}
          <span>IA Táctica</span>
        </button>
        <button class="seg-tab" onclick="activateTab(this)">
          ${customIcons[6].svg}
          <span>Perfil</span>
        </button>
      </div>
    </section>

    <!-- CATÁLOGO INDIVIDUAL DE LOS 12 ICONOS PROPIOS -->
    <div class="section-title">
      <span>💎</span>
      <h2>Colección Completa de 12 Iconos Exclusivos DIAMAX PRO</h2>
    </div>
    <p class="section-desc">
      Diseñados sobre una retícula matemática de 24x24, trazo uniforme de 1.6px, squircle continuo y temáticas auténticas de béisbol y sabermetría avanzada:
    </p>

    <div class="grid-icons">
      ${cardsHtml}
    </div>

  </main>

  <script>
    function activateTab(btn) {
      document.querySelectorAll('#demo-nav-bar .seg-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
    }

    function setCardState(id, state) {
      const wrapper = document.getElementById('preview-' + id);
      if (state === 'active') {
        wrapper.classList.add('state-active');
      } else {
        wrapper.classList.remove('state-active');
      }
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(baseDir, 'prototipo_iconos_propios_diamax.html'), prototypeHtml, 'utf8');
console.log('✅ Generado prototipo_iconos_propios_diamax.html exitosamente.');
