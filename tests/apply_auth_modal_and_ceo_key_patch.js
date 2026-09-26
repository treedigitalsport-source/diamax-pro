// ═══════════════════════════════════════════════════════════════════════════
// 💎 DIAMAX PRO — DEEP FORENSIC FIX FOR AUTH MODAL, CEO KEY, LOGIN & PLANS
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

  // 1. Ensure #auth-status-alert exists inside the auth modal body
  if (!code.includes('id="auth-status-alert"')) {
    code = code.replace(
      '<div style="padding:22px; max-height:calc(88vh - 120px); overflow-y:auto;">',
      '<div style="padding:22px; max-height:calc(88vh - 120px); overflow-y:auto;">\n      <div id="auth-status-alert" style="display:none; padding:12px 16px; border-radius:12px; margin-bottom:16px; font-size:13px; font-weight:700; text-align:center; transition:all 0.25s;"></div>'
    );
  }

  // 2. Ensure login inputs trigger ejecutarLogin on Enter
  code = code.replace(
    'id="login-pass" placeholder="••••••••"',
    'id="login-pass" placeholder="••••••••" onkeydown="if(event.key===\'Enter\') ejecutarLogin()"'
  );
  code = code.replace(
    'id="login-user" placeholder="manager@diamax.pro"',
    'id="login-user" placeholder="manager@diamax.pro" onkeydown="if(event.key===\'Enter\') ejecutarLogin()"'
  );

  // 3. Ensure accesoMaestroFounder is robust and immediately navigates
  const enhancedAccesoFounder = `function accesoMaestroFounder(clave) {
  const inputVal = document.getElementById('master-key-input')?.value || '';
  const k = (clave !== undefined && clave !== null && String(clave).trim().length > 0 ? String(clave) : inputVal).trim();
  
  if (!k) {
    return showAuthAlert("⚠️ Por favor ingresa la clave de acceso de Fundador/CEO.");
  }
  
  // Claves maestras autorizadas: 113714 (CEO Alí Zapata), 1234 (PIN Rápido), alizapata, diamax2026
  if (k === '113714' || k === '1234' || k.toLowerCase() === 'alizapata' || k.toLowerCase() === 'diamax2026') {
    currentUserSession = {
      id: 'usr_ceo_ali',
      name: 'Lic. Alí Zapata',
      email: 'ceo@3treedigital.com',
      role: 'FOUNDER_CEO',
      tier: 'ENTERPRISE_UNLIMITED',
      teamName: '3Tree Digital Sport IA Corp.',
      isMaster: true
    };
    try {
      localStorage.setItem('diamax_current_user', JSON.stringify(currentUserSession));
      localStorage.setItem('diamax_auth_session', JSON.stringify(currentUserSession));
    } catch(e) {}
    
    showAuthAlert("👑 ¡Bienvenido Fundador & CEO Lic. Alí Zapata! Acceso Maestro concedido.", false);
    
    setTimeout(() => {
      cerrarAuthModal();
      irAPagina(3);
    }, 350);
  } else {
    showAuthAlert("⛔ Clave de acceso maestro incorrecta. Verifique e intente nuevamente.");
    const input = document.getElementById('master-key-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}`;

  if (code.includes('function accesoMaestroFounder(')) {
    const startIdx = code.indexOf('function accesoMaestroFounder(');
    const endIdx = code.indexOf('function showAuthModal(', startIdx);
    if (endIdx !== -1) {
      code = code.substring(0, startIdx) + enhancedAccesoFounder + '\n\n' + code.substring(endIdx);
    }
  }

  // 4. Ensure showAuthModal properly shows overlay and switches tab
  const enhancedShowAuthModal = `function showAuthModal(defaultTab = 'register') {
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    switchAuthTab(defaultTab);
  }
}`;

  if (code.includes('function showAuthModal(')) {
    const startIdx = code.indexOf('function showAuthModal(');
    const endIdx = code.indexOf('function cerrarAuthModal()', startIdx);
    if (endIdx !== -1) {
      code = code.substring(0, startIdx) + enhancedShowAuthModal + '\n\n' + code.substring(endIdx);
    }
  }

  // 5. Ensure abrirAccesoClaveCEO works flawlessly
  const enhancedAbrirAccesoClaveCEO = `function abrirAccesoClaveCEO() {
  showAuthModal('master');
  setTimeout(() => {
    const input = document.getElementById('master-key-input');
    if (input) {
      input.focus();
      input.select();
    }
  }, 100);
}`;

  if (code.includes('function abrirAccesoClaveCEO()')) {
    const startIdx = code.indexOf('function abrirAccesoClaveCEO()');
    const endIdx = code.indexOf('function accesoMaestroFounder(', startIdx);
    if (endIdx !== -1) {
      code = code.substring(0, startIdx) + enhancedAbrirAccesoClaveCEO + '\n\n' + code.substring(endIdx);
    }
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Saved: ${path.basename(filePath)} (${code.length} bytes)`);
}

targetFiles.forEach(patchFile);
console.log('✨ Auth modal, CEO key, and login patches applied to all target files!');
