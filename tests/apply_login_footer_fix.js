const fs = require('fs');
const path = require('path');

const targetFiles = [
  'index.html',
  'v_original_aprobada.html',
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html'
];

// 1. Premium SVG Symbol Definition
const newKeyRecoverySymbol = `    <!-- 🔑 RESTABLECIMIENTO & RECUPERACIÓN DE CLAVE / CREDENCIALES (ULTRA-PREMIUM CYBERSECURITY KEY) -->
    <symbol id="diamax-icon-key-recovery" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="diamax-grad-key-shield" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#00D2FF"/>
          <stop offset="50%" stop-color="#3B82F6"/>
          <stop offset="100%" stop-color="#1D4ED8"/>
        </linearGradient>
        <linearGradient id="diamax-grad-key-gold" x1="8" y1="4" x2="20" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFF4B8"/>
          <stop offset="40%" stop-color="#FFC72C"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
      </defs>
      <!-- Shield Outer Contour -->
      <path d="M12 2.5L4 6.2V11.5C4 16.5 7.4 21.1 12 22.3C16.6 21.1 20 16.5 20 11.5V6.2L12 2.5Z" stroke="url(#diamax-grad-key-shield)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="rgba(0, 210, 255, 0.05)"/>
      <!-- Inner Security Key Vector -->
      <circle cx="10" cy="10" r="3" stroke="url(#diamax-grad-key-gold)" stroke-width="1.8" fill="rgba(255, 199, 44, 0.12)"/>
      <circle cx="10" cy="10" r="1.1" fill="url(#diamax-grad-key-gold)"/>
      <path d="M12.2 12.2L16.8 16.8M15 15L16.2 13.8M16.5 16.5L17.7 15.3" stroke="url(#diamax-grad-key-gold)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="17.2" cy="7.2" r="0.9" fill="#00D2FF"/>
    </symbol>`;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath} (not found)`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace / Add SVG symbol
  if (content.includes('id="diamax-icon-key-recovery"')) {
    const symRegex = /<!-- 🔑 RESTABLECIMIENTO[\s\S]*?<\/symbol>/;
    if (symRegex.test(content)) {
      content = content.replace(symRegex, newKeyRecoverySymbol.trim());
    } else {
      const symRegex2 = /<symbol id="diamax-icon-key-recovery"[\s\S]*?<\/symbol>/;
      content = content.replace(symRegex2, newKeyRecoverySymbol.trim());
    }
  } else if (content.includes('</defs>')) {
    content = content.replace('</defs>', `${newKeyRecoverySymbol}\n  </defs>`);
  }

  // Page 2 Login Footer Update
  const p2LoginSearch = /<!-- Caja de Recuperación de Credenciales \(Página 2\) -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
  // Let's inspect Page 2 exact footer structure
  const p2SubLoginRegex = /(<div id="p2-sub-login"[\s\S]*?<button type="submit"[\s\S]*?<\/button>)\s*([\s\S]*?)(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div id="diamax-page-3")/i;
  
  if (p2SubLoginRegex.test(content)) {
    const replacementP2Footer = `
          <!-- Recuperación de Credenciales (Página 2) -->
          <div style="margin-top:20px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08); text-align:center; display:flex; justify-content:center;">
            <button type="button" onclick="mostrarRecuperarClave('p2')" style="background:rgba(24,216,255,0.08); border:1px solid rgba(24,216,255,0.3); color:#18D8FF; font-family:'Plus Jakarta Sans', sans-serif; font-size:13px; font-weight:700; padding:11px 22px; border-radius:10px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:9px; box-shadow:0 0 15px rgba(24,216,255,0.15); transition:all 0.2s;" onmouseover="this.style.background='rgba(24,216,255,0.18)'; this.style.borderColor='#18D8FF';" onmouseout="this.style.background='rgba(24,216,255,0.08)'; this.style.borderColor='rgba(24,216,255,0.3)';">
              <svg viewBox="0 0 24 24" width="18" height="18" style="vertical-align:middle; filter:drop-shadow(0 0 6px #18D8FF);"><use href="#diamax-icon-key-recovery"/></svg>
              <span>¿Olvidaste tu usuario o clave?</span>
            </button>
          </div>
        </form>
      </div>`;
    // Replace inside p2SubLogin
    content = content.replace(/(<div id="p2-sub-login"[\s\S]*?<button type="submit"[\s\S]*?<\/button>)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div id="diamax-page-3")/i,
      (match, p1, p2, p3) => `${p1}\n${replacementP2Footer}\n      </div>\n    </div>\n  </div>\n\n${p3.substring(p3.indexOf('<div id="diamax-page-3'))}`
    );
  }

  // Modal Login Footer Update
  const modalLoginFooterTarget = /<div id="auth-panel-login"[\s\S]*?<\/button>\s*<div style="display:flex; justify-content:space-between; align-items:center; margin-top:1[46]px;[\s\S]*?<\/div>\s*<\/div>/;
  
  if (modalLoginFooterTarget.test(content)) {
    const cleanModalLogin = `<div id="auth-panel-login" style="display:none; max-width:440px; margin:0 auto;">
        <div style="margin-bottom:14px;">
          <label style="display:block; font-size:11px; font-weight:700; color:#94A3B8; margin-bottom:6px; text-transform:uppercase;">Usuario / Correo Táctico</label>
          <input type="text" id="login-user" placeholder="manager@diamax.pro" style="width:100%; box-sizing:border-box; background:#040914; border:1px solid #334155; border-radius:8px; padding:12px; color:#FFF; font-size:14px; outline:none;" onfocus="this.style.borderColor='#00D2FF'" onblur="this.style.borderColor='#334155'">
        </div>
        <div style="margin-bottom:18px;">
          <label style="display:block; font-size:11px; font-weight:700; color:#94A3B8; margin-bottom:6px; text-transform:uppercase;">Clave de Acceso</label>
          <input type="password" id="login-pass" placeholder="••••••••" style="width:100%; box-sizing:border-box; background:#040914; border:1px solid #334155; border-radius:8px; padding:12px; color:#FFF; font-size:14px; outline:none;" onfocus="this.style.borderColor='#00D2FF'" onblur="this.style.borderColor='#334155'">
        </div>
        <button onclick="ejecutarLogin()" style="width:100%; padding:14px; background:#00D2FF; color:#040914; border:none; border-radius:8px; font-weight:900; font-size:14px; cursor:pointer; text-transform:uppercase; letter-spacing:1px; box-shadow:0 0 15px rgba(0,210,255,0.4); display:inline-flex; align-items:center; justify-content:center; gap:8px;">
          <svg viewBox="0 0 24 24" width="16" height="16"><use href="#diamax-icon-biometric-auth"/></svg> Entrar al Sistema
        </button>
        
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08); text-align:center; display:flex; justify-content:center;">
          <button type="button" onclick="mostrarRecuperarClave('modal')" style="background:rgba(0,210,255,0.08); border:1px solid rgba(0,210,255,0.3); color:#00D2FF; font-family:'Plus Jakarta Sans', sans-serif; font-size:13px; font-weight:700; padding:11px 22px; border-radius:10px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:9px; box-shadow:0 0 15px rgba(0,210,255,0.15); transition:all 0.2s;" onmouseover="this.style.background='rgba(0,210,255,0.18)'; this.style.borderColor='#00D2FF';" onmouseout="this.style.background='rgba(0,210,255,0.08)'; this.style.borderColor='rgba(0,210,255,0.3)';">
            <svg viewBox="0 0 24 24" width="18" height="18" style="vertical-align:middle; filter:drop-shadow(0 0 6px #00D2FF);"><use href="#diamax-icon-key-recovery"/></svg>
            <span>¿Olvidaste tu usuario o clave?</span>
          </button>
        </div>
      </div>`;
    content = content.replace(modalLoginFooterTarget, cleanModalLogin);
  }

  // Update Recovery header icon from 🔄 to premium SVG in modal
  content = content.replace(
    /<div style="width:48px; height:48px; border-radius:14px; background:linear-gradient\(135deg, rgba\(0,210,255,0\.2\), rgba\(242,101,34,0\.2\)\); border:1\.5px solid #00D2FF; display:inline-flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:8px;">\s*🔄\s*<\/div>/g,
    `<div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg, rgba(0,210,255,0.15), rgba(59,130,246,0.15)); border:1.5px solid #00D2FF; display:inline-flex; align-items:center; justify-content:center; margin-bottom:8px; box-shadow:0 0 20px rgba(0,210,255,0.3);">
            <svg viewBox="0 0 24 24" width="28" height="28" style="filter:drop-shadow(0 0 8px #00D2FF);"><use href="#diamax-icon-key-recovery"/></svg>
          </div>`
  );

  // If there's a duplicate auth-modal-overlay block, remove the duplicate
  const dupModalMarker = '<!-- 🛡️ PORTAL DE AUTENTICACIÓN, HOJA DE REGISTRO & PLANES DE SUSCRIPCIÓN (DIAMAX PRO) -->\n<div id="auth-modal-overlay"';
  const firstIndex = content.indexOf(dupModalMarker);
  if (firstIndex !== -1) {
    const secondIndex = content.indexOf(dupModalMarker, firstIndex + 1);
    if (secondIndex !== -1) {
      const endOfDup = content.indexOf('<!-- MODAL DE CARGAR NUEVO JUEGO', secondIndex);
      if (endOfDup !== -1) {
        console.log(`Removing duplicate modal block from ${filePath}`);
        content = content.substring(0, secondIndex) + content.substring(endOfDup);
      }
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${filePath}`);
}

targetFiles.forEach(f => processFile(f));
