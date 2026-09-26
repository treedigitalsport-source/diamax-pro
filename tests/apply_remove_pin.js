const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the PIN tab button
const pinBtnRegex = /<button id="auth-tab-pin-btn"[\s\S]*?<\/button>/i;
html = html.replace(pinBtnRegex, '');

// 2. Remove the entire auth-panel-pin
const pinPanelRegex = /<!-- ======================================================== -->\s*<!-- SUBMENÚ 5: PIN RÁPIDO DE DUGOUT[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- 🎙️ MODAL/i;

// Let's find the exact boundaries of auth-panel-pin
const pPinStart = html.indexOf('<!-- SUBMENÚ 5: PIN RÁPIDO DE DUGOUT');
const pPinEnd = html.indexOf('</div>\n    </div>\n  </div>\n</div>\n\n<!-- 🎙️ MODAL') !== -1 
  ? html.indexOf('</div>\n    </div>\n  </div>\n</div>\n\n<!-- 🎙️ MODAL')
  : html.indexOf('<!-- 🎙️ MODAL');

if (pPinStart !== -1 && pPinEnd !== -1) {
  html = html.substring(0, pPinStart) + html.substring(pPinEnd);
}

// 3. Clean up switchAuthTab function to only use 4 tabs
html = html.replace(
  `['pricing', 'register', 'login', 'master', 'pin']`,
  `['pricing', 'register', 'login', 'master']`
);

// 4. Clean up the Master Key panel texts
html = html.replace(
  `<label style="display:block; font-size:10.5px; font-weight:800; color:#FFC72C; margin-bottom:6px; text-transform:uppercase;">Clave Maestra o PIN de Fundador</label>`,
  `<label style="display:block; font-size:10.5px; font-weight:800; color:#FFC72C; margin-bottom:6px; text-transform:uppercase;">Clave de Acceso CEO (Alí Zapata)</label>`
);

html = html.replace(
  `¿Eres el Fundador de 3Tree Digital Sport IA? Utiliza el acceso maestro de fundador con clave PIN.`,
  `Portal de acceso exclusivo para el Fundador & CEO Lic. Alí Zapata con su clave personal autorizada.`
);

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('v_original_aprobada.html', html, 'utf8');
fs.writeFileSync('v6_hace_1_hora_49505bc.html', html, 'utf8');
fs.writeFileSync('v1_actual_logo_photoroom_y_planes.html', html, 'utf8');

console.log('Successfully eliminated PIN panel, tab, and prompts across all files!');
