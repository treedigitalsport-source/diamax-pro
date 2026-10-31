import fs from 'fs';
import path from 'path';

const indexPath = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html';
console.log('Reading index.html...');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. Add CSS for Cockpit Amber blink, WakeLock, and Bottom Mobile Nav
const styleInjection = `
  /* =========================================================================
     🎙️ COCKPIT DIGITAL CABINA RADIO & TV — ESTILOS & ERGONOMÍA (ACTUALIZACIÓN 1 & 2)
     ========================================================================= */
  @keyframes blinkAmber {
    0% { background: rgba(245, 158, 11, 0.2); border-color: #F59E0B; box-shadow: 0 0 12px rgba(245, 158, 11, 0.4); }
    50% { background: rgba(245, 158, 11, 0.75); border-color: #FDE68A; box-shadow: 0 0 35px rgba(245, 158, 11, 0.95); }
    100% { background: rgba(245, 158, 11, 0.2); border-color: #F59E0B; box-shadow: 0 0 12px rgba(245, 158, 11, 0.4); }
  }
  .cockpit-alert-blink {
    animation: blinkAmber 0.85s infinite ease-in-out !important;
  }

  @keyframes sponsorPulse {
    0% { box-shadow: 0 0 8px rgba(255, 199, 44, 0.3); }
    50% { box-shadow: 0 0 25px rgba(255, 199, 44, 0.85); }
    100% { box-shadow: 0 0 8px rgba(255, 199, 44, 0.3); }
  }
  .sponsor-active-glow {
    border-color: #FFC72C !important;
    animation: sponsorPulse 1.2s infinite ease-in-out;
  }

  /* Barra de Navegación Inferior para Pulgares (Móvil) */
  .diamax-bottom-nav {
    display: none;
  }
  @media (max-width: 768px) {
    .diamax-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(2, 6, 23, 0.96);
      backdrop-filter: blur(12px);
      border-top: 1.5px solid rgba(0, 210, 255, 0.3);
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 9999;
      padding: 0 8px;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.8);
    }
    .diamax-bottom-nav-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 10.5px;
      font-weight: 800;
      cursor: pointer;
      padding: 6px 0;
      transition: all 0.2s;
    }
    .diamax-bottom-nav-btn.active, .diamax-bottom-nav-btn:hover {
      color: #00D2FF;
      transform: translateY(-2px);
    }
    .diamax-bottom-nav-btn svg {
      width: 20px;
      height: 20px;
      margin-bottom: 2px;
    }
    /* Espacio para que el contenido no quede tapado por la barra inferior */
    body {
      padding-bottom: 70px !important;
    }
  }
`;

if (!html.includes('cockpit-alert-blink')) {
  html = html.replace('<style>', '<style>' + styleInjection);
  console.log('Injected Cockpit styles.');
}

// 2. Add nav-cabina button to #main-nav
const cabinaNavBtn = `    <button onclick="switchTab('cabina')" id="nav-cabina" style="background:linear-gradient(135deg, rgba(0,210,255,0.22), rgba(2,6,23,0.95)); border:1.5px solid #00D2FF; color:#00D2FF; font-weight:900; box-shadow:0 0 12px rgba(0,210,255,0.35);">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle; filter:drop-shadow(0 0 4px #00D2FF); margin-right:4px;"><path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20H9c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1h-2v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg> 🎙️ 0. Cabina Medios
    </button>\n`;

if (!html.includes('id="nav-cabina"')) {
  html = html.replace('<div class="nav" id="main-nav">\n    <button class="active"', '<div class="nav" id="main-nav">\n' + cabinaNavBtn + '    <button class="active"');
  console.log('Added nav-cabina button to main-nav.');
}

// 3. Add Bottom Mobile Nav
const bottomNavHtml = `
  <!-- =========================================================================
       📱 BARRA DE NAVEGACIÓN INFERIOR PARA PULGARES (MÓVIL / TABLET)
       ========================================================================= -->
  <nav class="diamax-bottom-nav" id="diamax-bottom-nav" aria-label="Navegación Móvil Rápida">
    <button type="button" class="diamax-bottom-nav-btn active" id="bnav-envivo" onclick="switchTab('envivo')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>
      <span>En Vivo</span>
    </button>
    <button type="button" class="diamax-bottom-nav-btn" id="bnav-lineup" onclick="switchTab('lineup')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
      <span>Lineup</span>
    </button>
    <button type="button" class="diamax-bottom-nav-btn" id="bnav-campo" onclick="switchTab('campo')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 22,12 12,22 2,12"/><circle cx="12" cy="12" r="3"/></svg>
      <span>Terreno</span>
    </button>
    <button type="button" class="diamax-bottom-nav-btn" id="bnav-cabina" onclick="switchTab('cabina')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      <span style="color:#00D2FF;">Cabina</span>
    </button>
  </nav>
`;

if (!html.includes('id="diamax-bottom-nav"')) {
  html = html.replace('</body>', bottomNavHtml + '\n</body>');
  console.log('Added bottom mobile navigation bar.');
}

// 4. Update switchTab function to include 'cabina' in allTabs and aliases
const oldSwitchTabStart = `function switchTab(rawTabId) {
  // ensurePage3Visible
  if (typeof irAPagina === 'function') {
    const p3 = document.getElementById('diamax-page-3');
    if (!p3 || p3.style.display === 'none') {
      irAPagina(3);
    }
  }
  const aliases = {
    'tarjeta': 'tarjeta-oficial',`;

const newSwitchTabStart = `function switchTab(rawTabId) {
  // ensurePage3Visible
  if (typeof irAPagina === 'function') {
    const p3 = document.getElementById('diamax-page-3');
    if (!p3 || p3.style.display === 'none') {
      irAPagina(3);
    }
  }
  const aliases = {
    'cabina': 'cabina',
    'radio': 'cabina',
    'tv': 'cabina',
    'media': 'cabina',
    'cockpit': 'cabina',
    'tarjeta': 'tarjeta-oficial',`;

html = html.replace(oldSwitchTabStart, newSwitchTabStart);

const oldAllTabs = `  const allTabs = ['envivo', 'lineup', 'manual', 'tarjeta-oficial', 'campo', 'perfil', 'dashboard', 'skills'];`;
const newAllTabs = `  const allTabs = ['cabina', 'envivo', 'lineup', 'manual', 'tarjeta-oficial', 'campo', 'perfil', 'dashboard', 'skills'];`;
html = html.replace(oldAllTabs, newAllTabs);

const oldMap = `  const map = {
    'envivo':'live',`;
const newMap = `  const map = {
    'cabina':'cabina',
    'envivo':'live',`;
html = html.replace(oldMap, newMap);

// Sincronizar barra inferior móvil en switchTab
const oldSwitchTabRender = `  // Renderizados dinámicos y sincronización inmediata por pestaña
  if (tabId === 'tarjeta-oficial') {`;

const newSwitchTabRender = `  // Sincronizar barra de navegación móvil inferior
  document.querySelectorAll('.diamax-bottom-nav-btn').forEach(btn => btn.classList.remove('active'));
  const bnavBtn = document.getElementById('bnav-' + tabId);
  if (bnavBtn) bnavBtn.classList.add('active');

  if (tabId === 'cabina') {
    if (typeof actualizarCockpitCabina === 'function') actualizarCockpitCabina();
  }

  // Renderizados dinámicos y sincronización inmediata por pestaña
  if (tabId === 'tarjeta-oficial') {`;

html = html.replace(oldSwitchTabRender, newSwitchTabRender);
console.log('Updated switchTab for tab-cabina.');

// 5. Replace the Cockpit markup with the upgraded, full-featured Cockpit Digital
console.log('Writing updated index.html...');
fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Done initial step.');
