import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Normalizar CRLF a LF
html = html.replace(/\r\n/g, '\n');

console.log('1. Buscando límites de tab-cabina...');

// 1. Quitar el botón nav-cabina del navbar del Dugout
const navCabinaButtonTarget = `      <button class="nav-tab" data-tab="tab-cabina" onclick="switchTab('cabina')" id="nav-cabina">
        <svg class="diamax-nav-ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>🎙️ Cabina &amp; Comentaristas</span>
      </button>
    </div>
  </div>`;

const navCabinaButtonReplacement = `    </div>
  </div>`;

if (html.includes(navCabinaButtonTarget)) {
  html = html.replace(navCabinaButtonTarget, navCabinaButtonReplacement);
  console.log('✓ Botón nav-cabina retirado del main-nav del Dugout (Scorekeeper/Manager).');
} else {
  console.warn('⚠️ No se encontró navCabinaButtonTarget exacto.');
}

// 2. Extraer tab-cabina del interior de diamax-page-3
const startMarker = '<div id="tab-cabina" class="tab-content" style="display:none; margin-bottom:24px;">';
const endMarker = '  <!-- =========================================================================\n       TAB 1: ANOTADOR EN VIVO (DUGOUT OPTIMIZED';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('❌ No se encontraron los marcadores de tab-cabina. start:', startIndex, 'end:', endIndex);
  process.exit(1);
}

// Extraer el contenido de la cabina
let cabinaBlockRaw = html.substring(startIndex, endIndex);
console.log('Longitud del bloque de cabina extraído:', cabinaBlockRaw.length);

// Ajustar tab-cabina para que se muestre como block
cabinaBlockRaw = cabinaBlockRaw.replace(
  '<div id="tab-cabina" class="tab-content" style="display:none; margin-bottom:24px;">',
  '<div id="tab-cabina" class="tab-content" style="display:block; margin-bottom:24px;">'
);

// Remover el bloque de cabina de diamax-page-3
html = html.substring(0, startIndex) + html.substring(endIndex);
console.log('✓ tab-cabina removido de diamax-page-3 (el Dugout de anotador y manager queda 100% limpio).');

// 3. Crear la nueva plantilla independiente diamax-page-cabina
const newPageCabina = `
<!-- =========================================================================
     DIAMAX BROADCAST COCKPIT · PLANTILLA INDEPENDIENTE DE CABINA (PAGE CABINA)
     Aislada 100% de la plantilla del Dugout (Anotador y Mánager)
     ========================================================================= -->
<div id="diamax-page-cabina" style="display:none; width:100%; min-height:100vh; background:#030712; color:#FFFFFF; padding:20px; box-sizing:border-box;">
  
  <!-- BARRA SUPERIOR DE CABINA DE TRANSMISIÓN OFICIAL -->
  <div style="background:rgba(18, 24, 38, 0.85); backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px); border:1px solid rgba(255, 255, 255, 0.08); border-radius:18px; padding:14px 22px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; box-shadow:0 15px 35px rgba(0,0,0,0.5);">
    <div style="display:flex; align-items:center; gap:14px;">
      <div style="width:42px; height:42px; border-radius:12px; background:linear-gradient(135deg, #007AFF 0%, #0051B3 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(0, 122, 255, 0.45);">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      </div>
      <div>
        <div style="display:flex; align-items:center; gap:8px;">
          <h2 style="margin:0; font-size:16px; font-weight:900; color:#FFFFFF; letter-spacing:0.5px;">DIAMAX CABINA DIGITAL · MESA DE TRANSMISIÓN (TV, RADIO &amp; YOUTUBE)</h2>
          <span style="background:rgba(0, 122, 255, 0.18); border:1px solid #007AFF; color:#7DD3FC; font-size:10px; font-weight:800; padding:2px 8px; border-radius:12px;">PLAN COMENTARISTA &amp; MEDIA</span>
        </div>
        <div style="font-size:11px; color:#94A3B8; margin-top:2px;">
          Plantilla de Cabina Aislada • Telemetría y Patrocinios en Vivo • Sin acceso ni interferencia con el Dugout
        </div>
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:10px;">
      <button type="button" onclick="irAPagina(1)" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#F8FAFC; font-size:12px; font-weight:800; padding:9px 18px; border-radius:10px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.15s ease;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Salir al Inicio</span>
      </button>
    </div>
  </div>

  <!-- CONTENIDO DE LA CABINA (COCKPIT + TELEPROMPTER + PATROCINIOS + DIRECTORIO) -->
` + cabinaBlockRaw + `
</div>
`;

// 4. Insertar diamax-page-cabina justo después del cierre de diamax-page-3
const page3CloseTarget = `  <!-- Footer -->
  <div class="footer">
    <div id="footer-address-text">Desarrollada por <strong>3Tree Digital Sport IA</strong> Lutz, Florida Usa/Todos los derechos reservados 2026. Aplicacion oficial DIAMAX</div>
  </div>
</div>`;

const page3CloseReplacement = `  <!-- Footer -->
  <div class="footer">
    <div id="footer-address-text">Desarrollada por <strong>3Tree Digital Sport IA</strong> Lutz, Florida Usa/Todos los derechos reservados 2026. Aplicacion oficial DIAMAX</div>
  </div>
</div>

` + newPageCabina;

if (html.includes(page3CloseTarget)) {
  html = html.replace(page3CloseTarget, page3CloseReplacement);
  console.log('✓ diamax-page-cabina insertada como plantilla independiente fuera de diamax-page-3.');
} else {
  console.error('❌ No se encontró page3CloseTarget exacto.');
  process.exit(1);
}

// 5. Actualizar irAPagina para soportar 'cabina'
const irAPaginaTarget = `function irAPagina(num, subtab) {
  paginaActualDiamax = num;
  const p1 = document.getElementById('diamax-page-1');
  const p2 = document.getElementById('diamax-page-2');
  const p3 = document.getElementById('diamax-page-3');

  if (p1) p1.style.display = (num === 1) ? 'flex' : 'none';
  if (p2) p2.style.display = (num === 2) ? 'block' : 'none';
  if (p3) p3.style.display = (num === 3) ? 'block' : 'none';`;

const irAPaginaReplacement = `function irAPagina(num, subtab) {
  paginaActualDiamax = num;
  const p1 = document.getElementById('diamax-page-1');
  const p2 = document.getElementById('diamax-page-2');
  const p3 = document.getElementById('diamax-page-3');
  const pCabina = document.getElementById('diamax-page-cabina');

  if (p1) p1.style.display = (num === 1) ? 'flex' : 'none';
  if (p2) p2.style.display = (num === 2) ? 'block' : 'none';
  if (p3) p3.style.display = (num === 3) ? 'block' : 'none';
  if (pCabina) pCabina.style.display = (num === 'cabina' || num === 4) ? 'block' : 'none';`;

if (html.includes(irAPaginaTarget)) {
  html = html.replace(irAPaginaTarget, irAPaginaReplacement);
  console.log('✓ irAPagina actualizado para conmutar diamax-page-cabina.');
} else {
  console.warn('⚠️ No se encontró irAPaginaTarget exacto.');
}

// 6. Actualizar entrarCabinaEnVivo para ir a la plantilla de cabina directamente
const entrarCabinaTarget = `function entrarCabinaEnVivo() {
  cerrarModalAccesoCabina();
  if (typeof irAPagina === 'function') irAPagina(3);
  const nav = document.getElementById('main-nav');
  if (nav) nav.style.display = 'flex';
  if (typeof switchTab === 'function') {
    switchTab('cabina');
  }
}`;

const entrarCabinaReplacement = `function entrarCabinaEnVivo() {
  cerrarModalAccesoCabina();
  if (typeof irAPagina === 'function') irAPagina('cabina');
  if (typeof iniciarCockpitCabina === 'function') {
    try { iniciarCockpitCabina(); } catch(e){}
  }
}`;

if (html.includes(entrarCabinaTarget)) {
  html = html.replace(entrarCabinaTarget, entrarCabinaReplacement);
  console.log('✓ entrarCabinaEnVivo actualizado para abrir diamax-page-cabina.');
} else {
  console.warn('⚠️ No se encontró entrarCabinaTarget exacto.');
}

// 7. Actualizar switchTab para que 'cabina' abra la página de cabina directamente
const switchTabCabinaTarget = `  const aliases = {
    'anotador': 'envivo',
    'dugout': 'envivo',
    'cabina': 'cabina',`;

const switchTabCabinaReplacement = `  if (rawTabId === 'cabina' || rawTabId === 'comentaristas' || rawTabId === 'narradores') {
    if (typeof irAPagina === 'function') irAPagina('cabina');
    return;
  }
  const aliases = {
    'anotador': 'envivo',
    'dugout': 'envivo',`;

if (html.includes(switchTabCabinaTarget)) {
  html = html.replace(switchTabCabinaTarget, switchTabCabinaReplacement);
  console.log('✓ switchTab actualizado para redirigir cabina a su plantilla independiente.');
} else {
  console.warn('⚠️ No se encontró switchTabCabinaTarget exacto.');
}

// 8. Actualizar listener de hash #cabina para abrir diamax-page-cabina
const hashCabinaTarget = `window.addEventListener('load', function() {
  if (window.location.hash === '#cabina' || window.location.search.includes('cabina')) {
    setTimeout(function() {
      entrarCabinaEnVivo();
    }, 400);
  }
});`;

const hashCabinaReplacement = `window.addEventListener('load', function() {
  if (window.location.hash === '#cabina' || window.location.search.includes('cabina')) {
    setTimeout(function() {
      entrarCabinaEnVivo();
    }, 400);
  }
});
window.addEventListener('hashchange', function() {
  if (window.location.hash === '#cabina' || window.location.search.includes('cabina')) {
    entrarCabinaEnVivo();
  } else if (window.location.hash === '#dugout' || window.location.hash === '#anotador') {
    irAPagina(3);
  }
});`;

if (html.includes(hashCabinaTarget)) {
  html = html.replace(hashCabinaTarget, hashCabinaReplacement);
  console.log('✓ Escuchadores de hash actualizados para navegación independiente.');
}

// Guardar
fs.writeFileSync(indexPath, html, 'utf-8');
console.log('=== SEPARACIÓN COMPLETA DE PLANTILLAS FINALIZADA CON ÉXITO ===');
