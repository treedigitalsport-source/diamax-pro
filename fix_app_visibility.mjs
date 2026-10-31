import fs from 'fs';

const indexPath = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html';
console.log('Reading index.html...');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. REPARAR entrarCabinaEnVivo Y salirDeCabinaDugout PARA QUE NUNCA OCULTEN LA NAVEGACIÓN
const oldCabinaNavFuncs = `function entrarCabinaEnVivo() {
  cerrarModalAccesoCabina();
  if (typeof irAPagina === 'function') irAPagina(3);
  
  // Ocultar ribbon de juego y pestañas regulares para vista de pantalla única sin distracciones
  const nav = document.getElementById('main-nav');
  const ribbon = document.querySelector('.game-ribbon');
  const tabs = document.querySelectorAll('.tab-content, [id^="diamax-tab-"]');
  const cockpit = document.getElementById('broadcast-cockpit-view');
  
  if (nav) nav.style.display = 'none';
  if (ribbon) ribbon.style.display = 'none';
  tabs.forEach(t => t.style.display = 'none');
  
  if (cockpit) {
    cockpit.style.display = 'block';
  }
  
  // Actualizar telemetría del cockpit
  actualizarCockpitCabina();
  window.location.hash = '#cabina';
}
window.entrarCabinaEnVivo = entrarCabinaEnVivo;

function salirDeCabinaDugout() {
  const cockpit = document.getElementById('broadcast-cockpit-view');
  const nav = document.getElementById('main-nav');
  const ribbon = document.querySelector('.game-ribbon');
  
  if (cockpit) cockpit.style.display = 'none';
  if (nav) nav.style.display = 'flex';
  if (ribbon) ribbon.style.display = 'flex';
  
  // Restaurar la pestaña activa regular (por defecto Dugout)
  if (typeof switchTab === 'function') {
    switchTab('envivo');
  } else {
    const tabEnvivo = document.getElementById('diamax-tab-envivo');
    if (tabEnvivo) tabEnvivo.style.display = 'block';
  }
  
  if (window.location.hash === '#cabina') {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
}
window.salirDeCabinaDugout = salirDeCabinaDugout;`;

const newCabinaNavFuncs = `function entrarCabinaEnVivo() {
  cerrarModalAccesoCabina();
  if (typeof irAPagina === 'function') irAPagina(3);
  const nav = document.getElementById('main-nav');
  if (nav) nav.style.display = 'flex';
  if (typeof switchTab === 'function') {
    switchTab('cabina');
  }
}
window.entrarCabinaEnVivo = entrarCabinaEnVivo;

function salirDeCabinaDugout() {
  const nav = document.getElementById('main-nav');
  if (nav) nav.style.display = 'flex';
  if (typeof switchTab === 'function') {
    switchTab('envivo');
  }
}
window.salirDeCabinaDugout = salirDeCabinaDugout;`;

html = html.replace(oldCabinaNavFuncs, newCabinaNavFuncs);
console.log('Fixed entrarCabinaEnVivo and salirDeCabinaDugout.');

// 2. MOVER <div id="tab-cabina"> PARA QUE ESTÉ DESPUÉS DE <div class="nav" id="main-nav">
// Extraer tab-cabina
const tabCabinaStart = '<div id="tab-cabina" class="tab-content"';
const tabCabinaEnd = '<!-- TAB 1: ANOTADOR EN VIVO (DUGOUT OPTIMIZED + GROQ AI) -->';

const idxStart = html.indexOf(tabCabinaStart);
const idxNav = html.indexOf('<div class="nav" id="main-nav">');
const idxEnd = html.indexOf(tabCabinaEnd);

if (idxStart !== -1 && idxNav !== -1 && idxEnd !== -1 && idxStart < idxNav) {
  // tab-cabina está antes de main-nav, extraerlo
  const tabCabinaContent = html.substring(idxStart, idxNav).trim();
  
  // Remover tab-cabina de su posición actual
  html = html.substring(0, idxStart) + html.substring(idxNav);
  
  // Ahora encontrar dónde termina #main-nav
  const navClose = '</div>\n\n  <!-- TAB 1: ANOTADOR EN VIVO';
  const newInsertion = '</div>\n\n  ' + tabCabinaContent + '\n\n  <!-- TAB 1: ANOTADOR EN VIVO';
  
  html = html.replace(navClose, newInsertion);
  console.log('Moved tab-cabina AFTER main-nav so navigation bar is always visible on top!');
} else {
  console.log('tab-cabina is already positioned or markers not matched:', { idxStart, idxNav, idxEnd });
}

// 3. ASEGURAR QUE switchTab RESTAURA nav.style.display = 'flex' SIEMPRE
const switchTabStart = 'function switchTab(rawTabId) {';
const switchTabEnsureNav = `function switchTab(rawTabId) {
  const mainNavEl = document.getElementById('main-nav');
  if (mainNavEl) mainNavEl.style.display = 'flex';`;

html = html.replace(switchTabStart, switchTabEnsureNav);
console.log('Ensured switchTab keeps main-nav visible.');

// 4. AÑADIR BOTONERA DE NAVEGACIÓN RÁPIDA EN EL COCKPIT DE CABINA (ACCESO A TODA LA APP EN 1 CLICK)
const cockpitTopBarButtons = `        <!-- SALIR A DUGOUT -->
        <button type="button" onclick="switchTab('envivo')" style="background:#1E293B; border:1px solid #475569; color:#FFF; font-size:12px; font-weight:900; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;" title="Regresar al Anotador de Dugout">
          <span>⚾</span> <span>Dugout</span>
        </button>`;

const newCockpitTopBarButtons = `        <!-- ACCESO RÁPIDO A OTRAS SECCIONES DE LA APP -->
        <button type="button" onclick="switchTab('envivo')" style="background:linear-gradient(135deg, #1E293B, #0F172A); border:1.5px solid #00D2FF; color:#00D2FF; font-size:12px; font-weight:900; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(0,210,255,0.25);" title="Ir al Anotador Oficial en Dugout">
          <span>🎯</span> <span>1. Anotador</span>
        </button>
        <button type="button" onclick="switchTab('lineup')" style="background:#1E293B; border:1px solid #334155; color:#E2E8F0; font-size:11.5px; font-weight:800; padding:8px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:5px;" title="Ir al Creador de Alineación">
          <span>📋</span> <span>2. Lineup</span>
        </button>
        <button type="button" onclick="switchTab('campo')" style="background:#1E293B; border:1px solid #334155; color:#E2E8F0; font-size:11.5px; font-weight:800; padding:8px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:5px;" title="Ver Terreno 2D">
          <span>🏟️</span> <span>3. Terreno</span>
        </button>
        <button type="button" onclick="switchTab('tarjeta-oficial')" style="background:#1E293B; border:1px solid #334155; color:#E2E8F0; font-size:11.5px; font-weight:800; padding:8px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:5px;" title="Ver Tarjeta Oficial WBSC">
          <span>📄</span> <span>5. Tarjeta</span>
        </button>
        <button type="button" onclick="switchTab('dashboard')" style="background:#1E293B; border:1px solid #334155; color:#E2E8F0; font-size:11.5px; font-weight:800; padding:8px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:5px;" title="Ver Sabermetría">
          <span>📊</span> <span>6. Stats</span>
        </button>`;

html = html.replace(cockpitTopBarButtons, newCockpitTopBarButtons);
console.log('Added quick-jump buttons in Cockpit to all sections of the app.');

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Successfully saved index.html with full visibility fix!');
