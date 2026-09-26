const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Recovery HTML to Auth Modal (inside auth-modal-overlay)
const modalLoginOld = `<button onclick="ejecutarLogin()" style="width:100%; padding:14px; background:#00D2FF; color:#040914; border:none; border-radius:8px; font-weight:900; font-size:14px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 15px rgba(0,210,255,0.4); display:inline-flex; align-items:center; justify-content:center; gap:8px;">
          <svg viewBox="0 0 24 24" width="16" height="16"><use href="#diamax-icon-biometric-auth"/></svg> Entrar al Sistema
        </button>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; font-size:12px;">`;

const modalLoginNew = `<button onclick="ejecutarLogin()" style="width:100%; padding:14px; background:#00D2FF; color:#040914; border:none; border-radius:8px; font-weight:900; font-size:14px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 15px rgba(0,210,255,0.4); display:inline-flex; align-items:center; justify-content:center; gap:8px;">
          <svg viewBox="0 0 24 24" width="16" height="16"><use href="#diamax-icon-biometric-auth"/></svg> Entrar al Sistema
        </button>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; flex-wrap:wrap; gap:8px; font-size:12px;">
          <button type="button" onclick="mostrarRecuperarClave('modal')" style="background:none; border:none; color:#00D2FF; font-weight:700; cursor:pointer; text-decoration:underline; display:inline-flex; align-items:center; gap:4px;">
            <span>🔄</span> <span>¿Olvidaste tu usuario o clave?</span>
          </button>`;

if (html.includes(modalLoginOld)) {
  html = html.replace(modalLoginOld, modalLoginNew);
}

// 2. Add Recovery Panel to Auth Modal right after auth-panel-login
const recoveryPanelModalHTML = `
      <!-- ======================================================== -->
      <!-- SUBMENÚ: RECUPERACIÓN DE CREDENCIALES (MODAL)            -->
      <!-- ======================================================== -->
      <div id="auth-panel-recovery" style="display:none; max-width:440px; margin:0 auto;">
        <div style="text-align:center; margin-bottom:16px;">
          <div style="width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg, rgba(0,210,255,0.2), rgba(242,101,34,0.2)); border:1.5px solid #00D2FF; display:inline-flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:8px;">
            🔄
          </div>
          <h3 style="margin:0 0 4px 0; font-size:18px; font-weight:900; color:#FFF;">RECUPERAR ACCESO</h3>
          <p style="margin:0; font-size:12px; color:#94A3B8;">Introduce tu correo registrado para recuperar tu usuario y restablecer tu clave.</p>
        </div>

        <div id="auth-recovery-alert" style="display:none; padding:12px; border-radius:10px; margin-bottom:14px; font-size:12px;"></div>

        <!-- Paso 1: Ingreso de correo -->
        <div id="auth-recovery-step-1">
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:11px; font-weight:800; color:#94A3B8; margin-bottom:6px; text-transform:uppercase;">Correo Electrónico Registrado</label>
            <input type="email" id="recovery-email-modal" placeholder="manager@equipo.com" style="width:100%; box-sizing:border-box; background:#040914; border:1px solid #334155; border-radius:8px; padding:12px; color:#FFF; font-size:14px; outline:none;" onfocus="this.style.borderColor='#00D2FF'" onblur="this.style.borderColor='#334155'">
          </div>
          <button type="button" onclick="solicitarCodigoRecuperacion('modal')" style="width:100%; padding:14px; background:linear-gradient(135deg, #00D2FF, #0072FF); color:#040814; border:none; border-radius:8px; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 0 15px rgba(0,210,255,0.4); display:flex; align-items:center; justify-content:center; gap:8px;">
            <span>📩</span> <span>Enviar Código de Recuperación</span>
          </button>
        </div>

        <!-- Paso 2: Validación de Token y Nueva Clave -->
        <div id="auth-recovery-step-2" style="display:none;">
          <div style="background:rgba(24,201,149,0.08); border:1px solid rgba(24,201,149,0.3); border-radius:10px; padding:12px; margin-bottom:14px; font-size:12px; color:#A7F3D0;">
            Token de recuperación emitido para: <strong id="recovery-user-target-modal">usuario</strong>
          </div>
          <div style="margin-bottom:12px;">
            <label style="display:block; font-size:11px; font-weight:800; color:#94A3B8; margin-bottom:6px; text-transform:uppercase;">Código de 6 Dígitos</label>
            <input type="text" id="recovery-code-modal" maxlength="6" placeholder="000000" style="width:100%; box-sizing:border-box; background:#040914; border:2px solid #00D2FF; border-radius:8px; padding:12px; color:#00D2FF; font-size:20px; font-weight:900; text-align:center; letter-spacing:8px; outline:none; font-family:monospace;">
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:11px; font-weight:800; color:#94A3B8; margin-bottom:6px; text-transform:uppercase;">Nueva Contraseña</label>
            <input type="password" id="recovery-new-pass-modal" placeholder="••••••••••••" minlength="8" style="width:100%; box-sizing:border-box; background:#040914; border:1px solid #334155; border-radius:8px; padding:12px; color:#FFF; font-size:14px; outline:none;" onfocus="this.style.borderColor='#00D2FF'" onblur="this.style.borderColor='#334155'">
          </div>
          <button type="button" onclick="confirmarRestablecerClave('modal')" style="width:100%; padding:14px; background:linear-gradient(135deg, #10B981, #059669); color:#020617; border:none; border-radius:8px; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 0 15px rgba(16,185,129,0.4); display:flex; align-items:center; justify-content:center; gap:8px;">
            <span>🔒</span> <span>Restablecer Clave y Entrar</span>
          </button>
        </div>

        <div style="text-align:center; margin-top:16px;">
          <button type="button" onclick="volverALogin('modal')" style="background:none; border:none; color:#94A3B8; font-size:12px; cursor:pointer; text-decoration:underline;">
            ⬅️ Volver a Iniciar Sesión
          </button>
        </div>
      </div>
`;

// Insert after auth-panel-login
const loginPanelCloseIdx = html.indexOf('</div>\n\n      <!-- ======================================================== -->\n      <!-- SUBMENÚ 4: ACCESO MAESTRO');
if (loginPanelCloseIdx !== -1) {
  html = html.substring(0, loginPanelCloseIdx + 6) + recoveryPanelModalHTML + html.substring(loginPanelCloseIdx + 6);
}

// 3. Add Recovery HTML to Page 2 (p2-sub-login)
const p2LoginOld = `<button type="submit" style="width:100%; padding:15px; background:linear-gradient(135deg, #18D8FF, #0284C7); color:#040814; border:none; border-radius:12px; font-weight:900; font-size:14px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 25px rgba(24,216,255,0.4); display:flex; align-items:center; justify-content:center; gap:8px;">
            <span>🔑</span> <span>ENTRAR AL DUGOUT (PÁGINA 3)</span>
          </button>
        </form>`;

const p2LoginNew = `<button type="submit" style="width:100%; padding:15px; background:linear-gradient(135deg, #18D8FF, #0284C7); color:#040814; border:none; border-radius:12px; font-weight:900; font-size:14px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 25px rgba(24,216,255,0.4); display:flex; align-items:center; justify-content:center; gap:8px;">
            <span>🔑</span> <span>ENTRAR AL DUGOUT (PÁGINA 3)</span>
          </button>
          
          <div style="text-align:center; margin-top:14px;">
            <button type="button" onclick="mostrarRecuperarClave('p2')" style="background:none; border:none; color:#18D8FF; font-size:12.5px; font-weight:800; cursor:pointer; text-decoration:underline;">
              🔄 ¿Olvidaste tu usuario o clave? Recuperar Acceso
            </button>
          </div>
        </form>

        <!-- SUB-VISTA RECUPERACIÓN PÁGINA 2 -->
        <div id="p2-sub-recovery" style="display:none; margin-top:20px; background:rgba(4,9,22,0.85); border:1.5px solid rgba(24,216,255,0.3); border-radius:18px; padding:24px;">
          <div style="text-align:center; margin-bottom:16px;">
            <h3 style="margin:0 0 6px 0; font-size:17px; font-weight:900; color:#FFF;">RECUPERAR CREDENCIALES</h3>
            <p style="margin:0; font-size:12px; color:#94A3B8;">Introduce tu correo registrado para recuperar tu usuario y restablecer tu clave.</p>
          </div>

          <div id="p2-recovery-alert" style="display:none; padding:12px; border-radius:10px; margin-bottom:14px; font-size:12px;"></div>

          <div id="p2-recovery-step-1">
            <div style="margin-bottom:16px;">
              <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:6px; text-transform:uppercase;">Correo Electrónico Registrado</label>
              <input type="email" id="recovery-email-p2" placeholder="tu-correo@ejemplo.com" style="width:100%; box-sizing:border-box; background:rgba(3,7,18,0.85); border:1px solid rgba(255,255,255,0.14); border-radius:10px; padding:12px; color:#FFF; font-size:14px; outline:none;">
            </div>
            <button type="button" onclick="solicitarCodigoRecuperacion('p2')" style="width:100%; padding:14px; background:linear-gradient(135deg, #18D8FF, #0284C7); color:#040814; border:none; border-radius:10px; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase;">
              📩 Enviar Código de Recuperación
            </button>
          </div>

          <div id="p2-recovery-step-2" style="display:none;">
            <div style="background:rgba(24,201,149,0.08); border:1px solid rgba(24,201,149,0.3); border-radius:10px; padding:12px; margin-bottom:14px; font-size:12px; color:#A7F3D0;">
              Token de recuperación emitido para: <strong id="recovery-user-target-p2">usuario</strong>
            </div>
            <div style="margin-bottom:12px;">
              <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:6px; text-transform:uppercase;">Código de 6 Dígitos</label>
              <input type="text" id="recovery-code-p2" maxlength="6" placeholder="000000" style="width:100%; box-sizing:border-box; background:rgba(3,7,18,0.9); border:2px solid #18D8FF; border-radius:10px; padding:12px; color:#18D8FF; font-size:20px; font-weight:900; text-align:center; letter-spacing:8px; outline:none; font-family:monospace;">
            </div>
            <div style="margin-bottom:16px;">
              <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:6px; text-transform:uppercase;">Nueva Clave de Acceso</label>
              <input type="password" id="recovery-new-pass-p2" placeholder="••••••••••••" minlength="8" style="width:100%; box-sizing:border-box; background:rgba(3,7,18,0.85); border:1px solid rgba(255,255,255,0.14); border-radius:10px; padding:12px; color:#FFF; font-size:14px; outline:none;">
            </div>
            <button type="button" onclick="confirmarRestablecerClave('p2')" style="width:100%; padding:14px; background:linear-gradient(135deg, #18C995, #059669); color:#040814; border:none; border-radius:10px; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase;">
              🔒 Restablecer Clave y Entrar
            </button>
          </div>

          <div style="text-align:center; margin-top:14px;">
            <button type="button" onclick="volverALogin('p2')" style="background:none; border:none; color:#94A3B8; font-size:12px; cursor:pointer; text-decoration:underline;">
              ⬅️ Cancelar y Volver a Iniciar Sesión
            </button>
          </div>
        </div>`;

if (html.includes(p2LoginOld)) {
  html = html.replace(p2LoginOld, p2LoginNew);
}

// 4. Add Javascript recovery functions
const recoveryJsCode = `
// 🔄 MOTOR DE RECUPERACIÓN DE CREDENCIALES & CLAVE (3Tree Digital Sport IA Corp.)
let recoveryTempState = {
  email: '',
  token: '',
  origen: 'modal'
};

function mostrarRecuperarClave(origen) {
  if (origen === 'modal') {
    const loginPanel = document.getElementById('auth-panel-login');
    const recPanel = document.getElementById('auth-panel-recovery');
    if (loginPanel) loginPanel.style.display = 'none';
    if (recPanel) recPanel.style.display = 'block';
    const emailInput = document.getElementById('recovery-email-modal');
    if (emailInput) {
      const curUser = document.getElementById('login-user')?.value || '';
      if (curUser.includes('@')) emailInput.value = curUser;
      emailInput.focus();
    }
  } else {
    const loginForm = document.querySelector('#p2-sub-login > form');
    const recPanel = document.getElementById('p2-sub-recovery');
    if (loginForm) loginForm.style.display = 'none';
    if (recPanel) recPanel.style.display = 'block';
    const emailInput = document.getElementById('recovery-email-p2');
    if (emailInput) {
      const curUser = document.getElementById('p2-login-user')?.value || '';
      if (curUser.includes('@')) emailInput.value = curUser;
      emailInput.focus();
    }
  }
}

function volverALogin(origen) {
  if (origen === 'modal') {
    const loginPanel = document.getElementById('auth-panel-login');
    const recPanel = document.getElementById('auth-panel-recovery');
    if (loginPanel) loginPanel.style.display = 'block';
    if (recPanel) recPanel.style.display = 'none';
  } else {
    const loginForm = document.querySelector('#p2-sub-login > form');
    const recPanel = document.getElementById('p2-sub-recovery');
    if (loginForm) loginForm.style.display = 'block';
    if (recPanel) recPanel.style.display = 'none';
  }
}

function showRecoveryAlert(msg, isError = true, origen = 'modal') {
  const alertId = origen === 'modal' ? 'auth-recovery-alert' : 'p2-recovery-alert';
  const el = document.getElementById(alertId);
  if (el) {
    el.style.display = 'block';
    el.style.background = isError ? 'rgba(239, 68, 68, 0.18)' : 'rgba(16, 185, 129, 0.18)';
    el.style.color = isError ? '#F87171' : '#34D399';
    el.style.border = \`1px solid \${isError ? '#EF4444' : '#10B981'}\`;
    el.innerHTML = msg;
  }
}

function solicitarCodigoRecuperacion(origen) {
  const emailInputId = origen === 'modal' ? 'recovery-email-modal' : 'recovery-email-p2';
  const email = (document.getElementById(emailInputId)?.value || '').trim().toLowerCase();
  
  if (!email || !email.includes('@')) {
    return showRecoveryAlert("Por favor ingresa un correo electrónico válido.", true, origen);
  }

  // Generar token seguro de 6 dígitos
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  recoveryTempState = { email, token, origen };

  // Cambiar a paso 2
  const step1Id = origen === 'modal' ? 'auth-recovery-step-1' : 'p2-recovery-step-1';
  const step2Id = origen === 'modal' ? 'auth-recovery-step-2' : 'p2-recovery-step-2';
  const targetLabelId = origen === 'modal' ? 'recovery-user-target-modal' : 'recovery-user-target-p2';

  const s1 = document.getElementById(step1Id);
  const s2 = document.getElementById(step2Id);
  const tLbl = document.getElementById(targetLabelId);

  if (s1) s1.style.display = 'none';
  if (s2) s2.style.display = 'block';
  if (tLbl) tLbl.innerText = email;

  showRecoveryAlert(\`✅ Tu usuario es <strong>\${email}</strong>.<br>Código de seguridad enviado: <strong style="letter-spacing:2px; color:#FFF; background:rgba(0,210,255,0.25); padding:2px 6px; border-radius:4px;">\${token}</strong> (Usa este código para cambiar tu clave).\`, false, origen);
  
  setTimeout(() => {
    const codeInp = document.getElementById(origen === 'modal' ? 'recovery-code-modal' : 'recovery-code-p2');
    if (codeInp) {
      codeInp.value = token;
      codeInp.focus();
    }
  }, 300);
}

async function confirmarRestablecerClave(origen) {
  const codeInpId = origen === 'modal' ? 'recovery-code-modal' : 'recovery-code-p2';
  const passInpId = origen === 'modal' ? 'recovery-new-pass-modal' : 'recovery-new-pass-p2';

  const codigo = (document.getElementById(codeInpId)?.value || '').trim();
  const nuevaClave = (document.getElementById(passInpId)?.value || '').trim();

  if (!codigo || codigo.length < 6) {
    return showRecoveryAlert("Por favor ingresa el código de 6 dígitos.", true, origen);
  }
  if (!nuevaClave || nuevaClave.length < 6) {
    return showRecoveryAlert("La nueva contraseña debe tener al menos 6 caracteres.", true, origen);
  }
  if (codigo !== recoveryTempState.token) {
    return showRecoveryAlert("Código de recuperación incorrecto o expirado.", true, origen);
  }

  // Guardar / actualizar en base de datos local
  const pHash = await hashSHA256(nuevaClave);
  let registeredUsers = [];
  try {
    registeredUsers = JSON.parse(localStorage.getItem('diamax_registered_users') || '[]');
  } catch(e) {
    registeredUsers = [];
  }

  let userObj = registeredUsers.find(u => u.email === recoveryTempState.email);
  if (userObj) {
    userObj.passwordHash = pHash;
  } else {
    userObj = {
      id: 'usr_' + Date.now(),
      fullName: 'Mánager Franquicia',
      email: recoveryTempState.email,
      passwordHash: pHash,
      teamName: 'Guerreros de Venezuela +55',
      role: 'MANAGER',
      plan: 'TRIAL_MES_GRATIS',
      registeredAt: new Date().toISOString()
    };
    registeredUsers.push(userObj);
  }

  try {
    localStorage.setItem('diamax_registered_users', JSON.stringify(registeredUsers));
  } catch(e) {}

  showRecoveryAlert("🎉 ¡Contraseña restablecida con éxito! Iniciando sesión...", false, origen);

  // Iniciar sesión automáticamente
  currentUserSession = {
    id: userObj.id,
    name: userObj.fullName,
    email: userObj.email,
    role: userObj.role || 'MANAGER',
    tier: 'PRO',
    teamName: userObj.teamName || 'Guerreros de Venezuela +55',
    isMaster: false
  };

  try {
    localStorage.setItem('diamax_current_user', JSON.stringify(currentUserSession));
  } catch(e) {}

  setTimeout(() => {
    if (origen === 'modal') {
      cerrarAuthModal();
    }
    irAPagina(3);
  }, 1200);
}
`;

// Insert the JS code right before </script> at the end of index.html
const lastScriptCloseIdx = html.lastIndexOf('</script>');
if (lastScriptCloseIdx !== -1) {
  html = html.substring(0, lastScriptCloseIdx) + recoveryJsCode + '\n' + html.substring(lastScriptCloseIdx);
}

fs.writeFileSync('index.html', html, 'utf8');
fs.writeFileSync('v_original_aprobada.html', html, 'utf8');
fs.writeFileSync('v6_hace_1_hora_49505bc.html', html, 'utf8');
fs.writeFileSync('v1_actual_logo_photoroom_y_planes.html', html, 'utf8');

console.log('Successfully implemented credential and password recovery system!');
