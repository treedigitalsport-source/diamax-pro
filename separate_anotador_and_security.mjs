import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf-8');

console.log('Original index.html length:', html.length);

// -----------------------------------------------------------------------------
// 1. LIMPIAR EL HEADER DE PÁGINA 3 (RETIRAR BOTONES DE SEGURIDAD/ACCESO)
//    - Quitar btn-entrada-cabina-broadcast
//    - Quitar btn-toggle-milspec-header
// -----------------------------------------------------------------------------

// Target header action buttons in Página 3
const oldHeaderSecurityArea = `      <button id="btn-entrada-cabina-broadcast" type="button" onclick="abrirModalAccesoCabina()" style="
        background: linear-gradient(135deg, rgba(0, 210, 255, 0.22) 0%, rgba(0, 114, 255, 0.3) 100%);
        border: 1.8px solid #00D2FF;
        color: #00D2FF;
        font-weight: 900;
        font-size: 12px;
        padding: 8px 16px;
        border-radius: 10px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 0 18px rgba(0, 210, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      " onmouseover="this.style.transform='translateY(-2px) scale(1.02)'; this.style.boxShadow='0 0 25px rgba(0,210,255,0.7)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 0 18px rgba(0,210,255,0.4)';" title="Entrada Independiente a Cabina de Comentaristas & Medios de TV">
        <span style="
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #EF4444;
          box-shadow: 0 0 10px #EF4444;
          display: inline-block;
          animation: pulseGlow 1.2s infinite;
        "></span>
        <span style="font-size: 15px;">🎙️</span>
        <span id="btn-entrada-cabina-text" style="letter-spacing: 0.6px; text-transform: uppercase;">Entrada Cabina</span>
        <span style="
          background: #EF4444;
          color: #FFF;
          font-size: 9.5px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.6px;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
        ">ON AIR</span>
      </button>
      
      
      <button id="btn-toggle-milspec-header" type="button" onclick="abrirModalAccesoMilitar()" style="background:#070D1A; border:1.5px solid #10B981; color:#A7F3D0; padding:7px 12px; border-radius:10px; font-weight:900; font-size:11.5px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(16,185,129,0.25);" title="Canjear Pase Táctico Militar de Prueba">
        <span>🛡️</span> <span>Pase Militar</span>
      </button>`;

if (html.includes('id="btn-entrada-cabina-broadcast"')) {
  html = html.replace(oldHeaderSecurityArea, '');
  console.log('Removed security entry buttons (Entrada Cabina & Pase Militar) from Página 3 header.');
}

// -----------------------------------------------------------------------------
// 2. RETIRAR "0. CABINA MEDIOS" DE #main-nav DEL ANOTADOR
//    El anotador regular solo debe mostrar las 7 pestañas de juego de béisbol
// -----------------------------------------------------------------------------
const oldNavCabinaBtn = `<button onclick="switchTab('cabina')" id="nav-cabina" style="background:linear-gradient(135deg, rgba(0,210,255,0.22), rgba(2,6,23,0.95)); border:1.5px solid #00D2FF; color:#00D2FF; font-weight:900; box-shadow:0 0 12px rgba(0,210,255,0.35);">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle; filter:drop-shadow(0 0 4px #00D2FF); margin-right:4px;"><path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20H9c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1h-2v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg> 🎙️ 0. Cabina Medios
    </button>`;

if (html.includes('id="nav-cabina"')) {
  // Hide nav-cabina by default so Dugout scorer doesn't see it, unless role is BROADCAST_MEDIA
  html = html.replace(
    oldNavCabinaBtn,
    `<button onclick="switchTab('cabina')" id="nav-cabina" style="display:none; background:linear-gradient(135deg, rgba(0,210,255,0.22), rgba(2,6,23,0.95)); border:1.5px solid #00D2FF; color:#00D2FF; font-weight:900; box-shadow:0 0 12px rgba(0,210,255,0.35);">
      <svg viewBox="0 0 24 24" width="15" height="15" style="vertical-align:middle; filter:drop-shadow(0 0 4px #00D2FF); margin-right:4px;"><path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20H9c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1h-2v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg> 🎙️ 0. Cabina Medios
    </button>`
  );
  console.log('Set nav-cabina to display:none by default for scorer isolation.');
}

// -----------------------------------------------------------------------------
// 3. ASEGURAR QUE LAS PUERTAS DE ENTRADA QUEDEN EXCLUSIVAMENTE EN PORTADA (P1)
//    Y EN LA PANTALLA DE SEGURIDAD / PLANES (P2)
// -----------------------------------------------------------------------------

// Make sure Página 1 has the dedicated entry portals:
// [ INICIAR SESIÓN ] [ ENTRAR CON QR ] [ PASE MILITAR ] [ ACCESO MASTER ]
const portalEntryCardsP1 = `
    <!-- PORTAL DE ENTRADAS EXCLUSIVAS DE SEGURIDAD (PORTADA PÁGINA 1) -->
    <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-top:14px; flex-wrap:wrap;">
      <button type="button" onclick="abrirModalAccesoCabina()" style="background:rgba(0,210,255,0.12); border:1.5px solid #00D2FF; color:#00D2FF; padding:8px 16px; border-radius:20px; font-weight:800; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
        <span>🎙️</span> <span>Entrada a Cabina (Pase de Prensa)</span>
      </button>
      <button type="button" onclick="abrirModalAccesoMilitar()" style="background:rgba(16,185,129,0.12); border:1.5px solid #10B981; color:#A7F3D0; padding:8px 16px; border-radius:20px; font-weight:800; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
        <span>🛡️</span> <span>Canjear Pase Táctico Militar</span>
      </button>
      <button type="button" onclick="abrirModalEscanearQRLogin()" style="background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.2); color:#FFF; padding:8px 16px; border-radius:20px; font-weight:800; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
        <span>📷</span> <span>Entrar Escaneando QR</span>
      </button>
    </div>
`;

if (html.includes('id="p1-title-welcome-block"') && !html.includes('PORTAL DE ENTRADAS EXCLUSIVAS DE SEGURIDAD (PORTADA PÁGINA 1)')) {
  html = html.replace(
    '<!-- 3. Botones de Acción Cinemáticos Flotantes',
    `${portalEntryCardsP1}\n\n    <!-- 3. Botones de Acción Cinemáticos Flotantes`
  );
  console.log('Consolidated all security entrance doors on Página 1.');
}

// -----------------------------------------------------------------------------
// 4. RETIRAR CABINA DEL BARRA INFERIOR MÓVIL DEL ANOTADOR
// -----------------------------------------------------------------------------
const oldMobNavCabina = `<button type="button" class="mobile-nav-btn" onclick="switchTab('cabina')" id="mob-nav-cabina">
      <span class="mob-icon">🎙️</span>
      <span class="mob-lbl">Cabina</span>
    </button>`;

if (html.includes('id="mob-nav-cabina"')) {
  html = html.replace(oldMobNavCabina, '');
  console.log('Removed Cabina from Dugout Scorer mobile bottom navigation.');
}

// -----------------------------------------------------------------------------
// 5. CONTROLADOR DINÁMICO DE VISIBILIDAD POR ROLES (SEPARACIÓN TOTAL)
// -----------------------------------------------------------------------------
const roleIsolationScript = `
// =========================================================================
// 🔒 SEPARACIÓN ESTRICTA DE DOMINIOS: ANOTADOR vs CABINA vs SEGURIDAD
// =========================================================================
function aplicarSeparacionRolesUI() {
  const rol = localStorage.getItem('diamax_current_role') || (currentUserSession ? currentUserSession.role : 'MANAGER');
  const navCabina = document.getElementById('nav-cabina');
  
  // Si el usuario es locutor/comentarista (BROADCAST_MEDIA), solo ve Cabina
  if (rol === 'BROADCAST_MEDIA') {
    if (navCabina) navCabina.style.display = 'inline-flex';
  } else {
    // Si es mánager o anotador de Dugout, NO ve la pestaña de Cabina ni puertas de seguridad
    if (navCabina) navCabina.style.display = 'none';
  }
}

// Ejecutar al cargar la aplicación y en cada cambio de sesión
window.aplicarSeparacionRolesUI = aplicarSeparacionRolesUI;
window.addEventListener('DOMContentLoaded', aplicarSeparacionRolesUI);
`;

if (!html.includes('SEPARACIÓN ESTRICTA DE DOMINIOS: ANOTADOR vs CABINA vs SEGURIDAD')) {
  html = html.replace('</script>', `${roleIsolationScript}\n</script>`);
  console.log('Inserted Role Domain Isolation Script.');
}

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Successfully applied strict separation of Dugout Scorer and Security Doors! Length:', html.length);
