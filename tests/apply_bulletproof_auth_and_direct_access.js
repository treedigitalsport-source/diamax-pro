// ═══════════════════════════════════════════════════════════════════════════
// 💎 DIAMAX PRO — BULLETPROOF MASTER ACCESS & INSTANT ENTRANCE ENGINE v7.0
// Propiedad Intelectual: 3Tree Digital Sport IA Corp. · CEO Alí Zapata
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'v_original_aprobada.html'),
  path.join(__dirname, '..', 'v6_hace_1_hora_49505bc.html'),
  path.join(__dirname, '..', 'v1_actual_logo_photoroom_y_planes.html')
];

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  console.log(`Patching: ${path.basename(filePath)}...`);

  // 1. Update cache buster version
  code = code.replace(
    /const DEPLOY_VERSION = '[^']+';/,
    "const DEPLOY_VERSION = '7.0-instant-master-entrance';"
  );

  // 2. Add Keypad typing helper in JS
  const masterKeypadJS = `
// 👑 TECLADO NUMÉRICO TÁCTIL Y ACCESO MAESTRO ULTRA-RÁPIDO
function teclearMasterKey(caracter) {
  const input = document.getElementById('master-key-input');
  if (!input) return;
  if (caracter === 'DEL') {
    input.value = input.value.slice(0, -1);
  } else if (caracter === 'ENTER') {
    accesoMaestroFounder(input.value);
  } else {
    input.value += caracter;
  }
}

function autoLlenarClaveCEO() {
  const input = document.getElementById('master-key-input');
  if (input) input.value = '113714';
  accesoMaestroFounder('113714');
}

function ejecutarLoginDirecto() {
  currentUserSession = {
    user: 'manager@diamax.pro',
    name: 'Mánager General',
    role: 'MANAGER',
    team: 'Guerreros de Venezuela +55',
    tier: 'TEAM_PRO',
    isMaster: false
  };
  localStorage.setItem('diamax_auth_session', JSON.stringify(currentUserSession));
  showAuthAlert("⚡ ¡Acceso Rápido Concedido! Entrando al Anotador...", false);
  setTimeout(() => {
    cerrarAuthModal();
    irAPagina(3);
  }, 300);
}
`;

  if (!code.includes('function teclearMasterKey(')) {
    code = code.replace(
      'function accesoMaestroFounder(',
      masterKeypadJS + '\nfunction accesoMaestroFounder('
    );
  }

  // 3. Update #auth-panel-master with 1-click button and visual touch keypad
  const enhancedMasterPanelHTML = `
      <!-- ======================================================== -->
      <!-- SUBMENÚ 4: ACCESO MAESTRO 3TREE (FOUNDER / SUPER ADMIN)  -->
      <!-- ======================================================== -->
      <div id="auth-panel-master" style="display:none; max-width:480px; margin:0 auto;">
        <div style="background:linear-gradient(145deg, #1c1305, #0a0600); border:2px solid #FFC72C; border-radius:18px; padding:22px; box-shadow:0 0 35px rgba(255,199,44,0.3); text-align:center;">
          <div style="width:52px; height:52px; margin:0 auto 10px auto; border-radius:50%; background:rgba(255,199,44,0.15); border:2px solid #FFC72C; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 24 24" width="28" height="28" style="color:#FFC72C;"><use href="#diamax-icon-founder-crown"/></svg>
          </div>
          <h3 style="margin:0 0 4px 0; font-size:18px; font-weight:900; color:#FFC72C; letter-spacing:0.5px;">Portal Maestro 3Tree Digital Sport</h3>
          <p style="margin:0 0 14px 0; font-size:12px; color:#94A3B8;">Acceso directo exclusivo para Fundador &amp; CEO (Lic. Alí Zapata).</p>

          <!-- Botón de Acceso Inmediato 1-Clic -->
          <div style="margin-bottom:14px;">
            <button type="button" onclick="autoLlenarClaveCEO()" style="width:100%; padding:13px; background:linear-gradient(135deg, #FFC72C, #F59E0B); color:#040814; border:none; border-radius:10px; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 0 20px rgba(255,199,44,0.5); display:flex; align-items:center; justify-content:center; gap:8px;">
              <span>👑</span> <span>ENTRAR DIRECTO CON CLAVE CEO (113714)</span>
            </button>
          </div>

          <div style="margin-bottom:14px; text-align:left;">
            <label style="display:block; font-size:11px; font-weight:800; color:#FFC72C; margin-bottom:6px; text-transform:uppercase;">O escribe tu clave PIN manualmente:</label>
            <div style="position:relative;">
              <input type="password" id="master-key-input" placeholder="••••••••••••" autocomplete="off" style="width:100%; box-sizing:border-box; background:#040914; border:1.8px solid #FFC72C; border-radius:8px; padding:12px 38px 12px 14px; color:#FFF; font-size:16px; outline:none; text-align:center; letter-spacing:4px; font-weight:900;" onkeydown="if(event.key==='Enter') accesoMaestroFounder(this.value)">
              <button type="button" onclick="togglePassVisibility('master-key-input', this)" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:#FFC72C; cursor:pointer; font-size:16px;">👁️</button>
            </div>
          </div>

          <!-- Teclado Numérico Táctil Touchscreen -->
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:14px;">
            <button type="button" onclick="teclearMasterKey('1')" class="btn-pin" style="padding:10px; font-size:16px;">1</button>
            <button type="button" onclick="teclearMasterKey('2')" class="btn-pin" style="padding:10px; font-size:16px;">2</button>
            <button type="button" onclick="teclearMasterKey('3')" class="btn-pin" style="padding:10px; font-size:16px;">3</button>
            <button type="button" onclick="teclearMasterKey('4')" class="btn-pin" style="padding:10px; font-size:16px;">4</button>
            <button type="button" onclick="teclearMasterKey('5')" class="btn-pin" style="padding:10px; font-size:16px;">5</button>
            <button type="button" onclick="teclearMasterKey('6')" class="btn-pin" style="padding:10px; font-size:16px;">6</button>
            <button type="button" onclick="teclearMasterKey('7')" class="btn-pin" style="padding:10px; font-size:16px;">7</button>
            <button type="button" onclick="teclearMasterKey('8')" class="btn-pin" style="padding:10px; font-size:16px;">8</button>
            <button type="button" onclick="teclearMasterKey('9')" class="btn-pin" style="padding:10px; font-size:16px;">9</button>
            <button type="button" onclick="teclearMasterKey('DEL')" class="btn-pin" style="padding:10px; font-size:13px; color:#EF4444; border-color:#EF4444;">⌫</button>
            <button type="button" onclick="teclearMasterKey('0')" class="btn-pin" style="padding:10px; font-size:16px;">0</button>
            <button type="button" onclick="teclearMasterKey('ENTER')" class="btn-pin" style="padding:10px; font-size:13px; color:#10B981; border-color:#10B981;">✓</button>
          </div>

          <div>
            <button type="button" onclick="accesoMaestroFounder(document.getElementById('master-key-input').value)" style="width:100%; padding:12px; background:rgba(255,199,44,0.15); border:1.5px solid #FFC72C; color:#FFC72C; border-radius:8px; font-weight:900; font-size:13px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">
              Desbloquear Acceso con Clave Escrita
            </button>
          </div>
        </div>
      </div>
`;

  if (code.includes('<div id="auth-panel-master"')) {
    const startIdx = code.indexOf('<div id="auth-panel-master"');
    const endIdx = code.indexOf('<!-- ======================================================== -->\n      <!-- 🎙️ MODAL AGENTE DE DICTADO POR VOZ', startIdx);
    if (endIdx !== -1) {
      code = code.substring(0, startIdx) + enhancedMasterPanelHTML + '\n' + code.substring(endIdx);
    }
  }

  // 4. Update #auth-panel-login with 1-click Quick Access Button
  if (code.includes('id="auth-panel-login"') && !code.includes('ejecutarLoginDirecto()')) {
    code = code.replace(
      '<button onclick="ejecutarLogin()" style="width:100%; padding:14px; background:#00D2FF;',
      `<button type="button" onclick="ejecutarLoginDirecto()" style="width:100%; padding:13px; background:linear-gradient(135deg, #10B981, #059669); color:#020617; border:none; border-radius:8px; font-weight:900; font-size:13px; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 0 15px rgba(16,185,129,0.4); margin-bottom:12px; display:inline-flex; align-items:center; justify-content:center; gap:8px;">
          <span>⚡</span> <span>ACCESO RÁPIDO MÁNAGER (1 CLIC)</span>
        </button>
        <button onclick="ejecutarLogin()" style="width:100%; padding:14px; background:#00D2FF;`
    );
  }

  // 5. Add 4th Button on Page 1 for direct 1-click entrance to Dugout
  if (code.includes('id="p1-btn-ceo-key"') && !code.includes('p1-btn-direct-dugout')) {
    code = code.replace(
      '<!-- Botón 3: 3TREE MASTER ACCESS (Acceso CEO Alí Zapata / Clave 113714) -->',
      `<!-- Botón 0: ACCESO RÁPIDO DIRECTO AL ANOTADOR DUGOUT -->
      <button type="button" id="p1-btn-direct-dugout" onclick="irAPagina(3)" style="padding:16px 26px; background:linear-gradient(135deg, #10B981 0%, #059669 100%); color:#020617; border:1px solid rgba(255,255,255,0.4); border-radius:14px; font-family:'Montserrat', sans-serif; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 8px 30px rgba(16,185,129,0.45); display:inline-flex; align-items:center; gap:10px; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px) scale(1.02)';" onmouseout="this.style.transform='translateY(0) scale(1)';">
        <span style="font-size:18px;">⚡</span>
        <span>ENTRAR DIRECTO AL DUGOUT</span>
      </button>

      <!-- Botón 3: 3TREE MASTER ACCESS (Acceso CEO Alí Zapata / Clave 113714) -->`
    );
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Saved: ${path.basename(filePath)} (${code.length} bytes)`);
}

targetFiles.forEach(patchFile);
console.log('✨ All files successfully upgraded with Bulletproof Master Access and Direct Entrance!');
