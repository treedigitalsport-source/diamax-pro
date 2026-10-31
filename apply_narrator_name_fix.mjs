import fs from 'fs';

const indexPath = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html';
console.log('Reading index.html...');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. Añadir funciones getNombreNarradorCabina, cambiarNombreNarradorCabina, actualizarNombreNarradorEnUI
const narratorFunctionsJS = `
// =========================================================================
// 🎙️ GESTIÓN DEL NOMBRE DEL NARRADOR OFICIAL EN CABINA
// REEMPLAZA EL NOMBRE DEL EQUIPO POR LA IDENTIDAD DEL LOCUTOR HUMANO
// =========================================================================
function getNombreNarradorCabina() {
  try {
    const guardado = localStorage.getItem('diamax_nombre_narrador');
    if (guardado && guardado.trim()) return guardado.trim();
  } catch(e){}

  if (typeof currentUserSession !== 'undefined' && currentUserSession && currentUserSession.name) {
    return currentUserSession.name.trim();
  }
  return "Lic. Alí Zapata"; // Narrador Oficial / Fundador por defecto
}
window.getNombreNarradorCabina = getNombreNarradorCabina;

function cambiarNombreNarradorCabina() {
  const actual = getNombreNarradorCabina();
  const nuevo = prompt("Introduce el nombre del Narrador / Comentarista de la transmisión:", actual);
  if (nuevo !== null && nuevo.trim() !== '') {
    try {
      localStorage.setItem('diamax_nombre_narrador', nuevo.trim());
    } catch(e){}
    actualizarNombreNarradorEnUI();
    if (typeof mostrarToast === 'function') mostrarToast('🎙️ Narrador oficial actualizado: ' + nuevo.trim());
  }
}
window.cambiarNombreNarradorCabina = cambiarNombreNarradorCabina;

function actualizarNombreNarradorEnUI() {
  const nombre = getNombreNarradorCabina();

  // 1. En la barra superior del Cockpit de Cabina
  const elCockpitNarrator = document.getElementById('cockpit-narrator-name');
  if (elCockpitNarrator) elCockpitNarrator.innerText = nombre;

  // 2. Personalizar cabecera principal de la aplicación cuando estamos en Cabina
  const activeBtn = document.querySelector('.nav button.active');
  const isCabinaActive = (activeBtn && activeBtn.id === 'nav-cabina') || window.location.hash === '#cabina';

  const teamTitleSpan = document.getElementById('team-title-span');
  const headerSubtitle = document.getElementById('header-subtitle');

  if (isCabinaActive) {
    if (teamTitleSpan) {
      teamTitleSpan.innerHTML = '🎙️ CABINA EN VIVO • <span style="color:#00D2FF;">' + nombre + '</span>';
    }
    if (headerSubtitle) {
      headerSubtitle.innerHTML = 'DIAMAX PRO OS • Mesa de Transmisión Radio &amp; TV • <strong>Narrador: ' + nombre + '</strong> <button type="button" onclick="cambiarNombreNarradorCabina()" style="background:rgba(0,210,255,0.18); border:1px solid #00D2FF; color:#00D2FF; font-size:10px; font-weight:800; padding:1px 6px; border-radius:4px; cursor:pointer; margin-left:6px;">✏️ Cambiar</button>';
    }
  } else {
    // Restaurar datos del equipo en el Dugout
    const g = (typeof getActiveGame === 'function') ? getActiveGame() : null;
    const defaultTeam = (g && g.teamName) ? g.teamName : "GUERREROS DE VENEZUELA +55";
    if (teamTitleSpan) teamTitleSpan.innerText = defaultTeam;
    if (headerSubtitle) headerSubtitle.innerText = "DIAMAX PRO • Motor Dugout Pitch-by-Pitch & Reglas 1-9 • Mánager: Leandro Chavez";
  }
}
window.actualizarNombreNarradorEnUI = actualizarNombreNarradorEnUI;
`;

// Insert before actualizarCockpitCabina
const targetHook = 'function actualizarCockpitCabina(lastAction, lastPayload) {';
html = html.replace(targetHook, narratorFunctionsJS + '\n\n' + targetHook);

// 2. Modificar la cabecera del Cockpit en tab-cabina para mostrar prominentemente el nombre del narrador
const oldCockpitHeaderTitle = `<h2 style="margin:0; font-size:18px; font-weight:900; color:#FFFFFF; letter-spacing:0.8px;">
              COCKPIT DIGITAL DEL NARRADOR — RADIO &amp; TV
            </h2>
            <span style="background:rgba(239,68,68,0.2); border:1px solid #EF4444; color:#F87171; font-size:10px; font-weight:900; padding:2px 8px; border-radius:20px; display:inline-flex; align-items:center; gap:5px;">
              <span style="width:7px; height:7px; border-radius:50%; background:#EF4444; box-shadow:0 0 6px #EF4444; animation:pulseGlow 1.2s infinite;"></span>
              ON AIR
            </span>
          </div>
          <span style="font-size:11.5px; color:#00D2FF; font-weight:700;">PARTIDO EN VIVO: GVE-55 • MESA DE TRANSMISIÓN (SPOTTING BOARD DINÁMICO)</span>`;

const newCockpitHeaderTitle = `<h2 style="margin:0; font-size:18px; font-weight:900; color:#FFFFFF; letter-spacing:0.8px;">
              COCKPIT DIGITAL DEL NARRADOR — RADIO &amp; TV
            </h2>
            <span style="background:rgba(239,68,68,0.2); border:1px solid #EF4444; color:#F87171; font-size:10px; font-weight:900; padding:2px 8px; border-radius:20px; display:inline-flex; align-items:center; gap:5px;">
              <span style="width:7px; height:7px; border-radius:50%; background:#EF4444; box-shadow:0 0 6px #EF4444; animation:pulseGlow 1.2s infinite;"></span>
              ON AIR
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:3px; flex-wrap:wrap;">
            <span style="font-size:13px; color:#FFC72C; font-weight:900;">
              🎙️ NARRADOR OFICIAL: <span id="cockpit-narrator-name" style="color:#00D2FF; text-decoration:underline; cursor:pointer;" onclick="cambiarNombreNarradorCabina()" title="Toca para cambiar el nombre del narrador">Lic. Alí Zapata</span>
            </span>
            <button type="button" onclick="cambiarNombreNarradorCabina()" style="background:rgba(255,199,44,0.18); border:1px solid #FFC72C; color:#FFC72C; font-size:10px; font-weight:900; padding:2px 8px; border-radius:6px; cursor:pointer;" title="Editar nombre del narrador">
              ✏️ Cambiar
            </button>
            <span style="font-size:11px; color:#64748B;">• Transmisión Oficial en Vivo</span>
          </div>`;

html = html.replace(oldCockpitHeaderTitle, newCockpitHeaderTitle);

// 3. Hook actualizarNombreNarradorEnUI en switchTab y en actualizarCockpitCabina
const switchTabHookTarget = `  if (tabId === 'cabina') {
    if (typeof actualizarCockpitCabina === 'function') actualizarCockpitCabina();
  }`;

const newSwitchTabHook = `  if (typeof actualizarNombreNarradorEnUI === 'function') {
    actualizarNombreNarradorEnUI();
  }

  if (tabId === 'cabina') {
    if (typeof actualizarCockpitCabina === 'function') actualizarCockpitCabina();
  }`;

html = html.replace(switchTabHookTarget, newSwitchTabHook);

// Also call in actualizarCockpitCabina
html = html.replace(
  '// E. Radar de 9 Defensores\n  actualizarRadarDefensaCabina();',
  '// E. Radar de 9 Defensores\n  actualizarRadarDefensaCabina();\n  if (typeof actualizarNombreNarradorEnUI === \'function\') actualizarNombreNarradorEnUI();'
);

// Call on window load or document ready
const initHook = `if (typeof actualizarNombreNarradorEnUI === 'function') actualizarNombreNarradorEnUI();`;
if (!html.includes('actualizarNombreNarradorEnUI(); // INIT')) {
  html = html.replace(
    'window.actualizarCockpitCabina = actualizarCockpitCabina;',
    'window.actualizarCockpitCabina = actualizarCockpitCabina;\n  setTimeout(() => { if (typeof actualizarNombreNarradorEnUI === \'function\') actualizarNombreNarradorEnUI(); }, 100); // INIT'
  );
}

console.log('Writing updated index.html...');
fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Done replacing team name with Narrator Name!');
