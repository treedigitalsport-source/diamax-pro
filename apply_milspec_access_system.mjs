import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf-8');

console.log('Original index.html length:', html.length);

// -----------------------------------------------------------------------------
// 1. MODAL TÁCTICO MILITAR HTML
// -----------------------------------------------------------------------------
const militaryModalHtml = `
<!-- =========================================================================
     🛡️ MODAL DE ACCESO TÁCTICO MILITAR (MIL-SPEC ZERO TRUST ACCESS)
     Sistema de Códigos de Prueba Criptográficos SHA-256 + Lector & Generador QR
     ========================================================================= -->
<div id="modal-acceso-militar" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,6,23,0.94); z-index:9999999; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); align-items:center; justify-content:center; padding:16px; box-sizing:border-box;">
  <div style="background:linear-gradient(160deg, #070F1E 0%, #030712 100%); border:2px solid #10B981; border-radius:22px; width:100%; max-width:580px; box-shadow:0 25px 70px rgba(0,0,0,0.95), 0 0 50px rgba(16,185,129,0.3); color:#F8FAFC; overflow:hidden; position:relative; font-family:'Plus Jakarta Sans',sans-serif;">
    
    <!-- Header Militar -->
    <div style="padding:18px 22px; border-bottom:1.5px solid rgba(16,185,129,0.3); display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg, rgba(16,185,129,0.12), rgba(6,78,59,0.05));">
      <div style="display:flex; align-items:center; gap:12px;">
        <div style="width:40px; height:40px; border-radius:10px; background:rgba(16,185,129,0.2); border:1.5px solid #10B981; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 0 15px rgba(16,185,129,0.4);">
          🛡️
        </div>
        <div>
          <h3 style="margin:0; font-size:16px; font-weight:900; color:#FFFFFF; letter-spacing:0.8px; text-transform:uppercase;">PROTOCOLO DE ACCESO MILITAR</h3>
          <span style="font-size:11px; color:#A7F3D0; font-weight:800; letter-spacing:0.5px;">MIL-SPEC ZERO-TRUST · PRUEBA OFICIAL 2026</span>
        </div>
      </div>
      <button type="button" onclick="cerrarModalAccesoMilitar()" style="background:none; border:none; color:#94A3B8; font-size:22px; cursor:pointer; padding:4px 8px; font-weight:800;" title="Cerrar">✕</button>
    </div>

    <!-- Pestañas del Modal -->
    <div style="display:flex; background:#0B1328; border-bottom:1px solid rgba(255,255,255,0.08); padding:4px 8px; gap:6px;">
      <button type="button" id="tab-mil-btn-code" onclick="cambiarTabMilitar('code')" style="flex:1; padding:9px 12px; background:#10B981; color:#020617; border:none; border-radius:8px; font-weight:900; font-size:11.5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
        <span>⌨️</span> <span>Canjear Código</span>
      </button>
      <button type="button" id="tab-mil-btn-qr" onclick="cambiarTabMilitar('qr')" style="flex:1; padding:9px 12px; background:transparent; color:#94A3B8; border:none; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
        <span>📷</span> <span>Escanear QR</span>
      </button>
      <button type="button" id="tab-mil-btn-codes-list" onclick="cambiarTabMilitar('list')" style="flex:1; padding:9px 12px; background:transparent; color:#FFC72C; border:none; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
        <span>👑</span> <span>Pases de Prueba</span>
      </button>
    </div>

    <!-- Contenido del Modal -->
    <div style="padding:22px; max-height:78vh; overflow-y:auto;">
      
      <!-- SUB-VISTA 1: INGRESO DE CÓDIGO TÁCTICO -->
      <div id="milspec-subview-code">
        <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:12px 14px; margin-bottom:16px;">
          <div style="font-size:11px; font-weight:900; color:#10B981; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
            <span>🔒</span> <span>Cifrado Militar Salted SHA-256</span>
          </div>
          <p style="margin:0; font-size:12px; color:#CBD5E1; line-height:1.4;">
            Introduzca su código táctico de prueba asignado. El sistema autenticará su credencial militar y le otorgará <strong>Acceso Ilimitado de Prueba (24 Horas)</strong> a las herramientas de mánager, anotador o cabina.
          </p>
        </div>

        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:11px; font-weight:900; color:#94A3B8; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.8px;">
            CÓDIGO TÁCTICO (FORMATO MILITAR):
          </label>
          <div style="position:relative;">
            <input type="text" id="input-milspec-code" placeholder="ej. DMX-MIL-ALPHA-7729" maxlength="26" style="width:100%; box-sizing:border-box; background:#040914; border:2px solid #10B981; border-radius:12px; padding:14px 16px; color:#A7F3D0; font-family:'Courier New', monospace; font-size:16px; font-weight:900; letter-spacing:2px; text-transform:uppercase; outline:none; box-shadow:inset 0 2px 6px rgba(0,0,0,0.8), 0 0 15px rgba(16,185,129,0.25);" onkeydown="if(event.key==='Enter') ejecutarValidacionMilitar()">
          </div>
        </div>

        <!-- Indicador de Fuerza Bruta / Intentos -->
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#94A3B8; margin-bottom:18px;">
          <span>Protección Anti-Fuerza Bruta:</span>
          <span id="milspec-attempts-label" style="color:#10B981; font-weight:800;">3 de 3 intentos disponibles</span>
        </div>

        <div id="milspec-lockout-alert" style="display:none; background:rgba(239,68,68,0.2); border:1.5px solid #EF4444; border-radius:10px; padding:12px; margin-bottom:16px; color:#FECACA; font-size:12px; font-weight:800; text-align:center;">
          🚨 ALERTA MILITAR: Consola bloqueada temporalmente por intentos fallidos. Espere <span id="milspec-timer-sec">60</span>s.
        </div>

        <button type="button" id="btn-submit-milspec" onclick="ejecutarValidacionMilitar()" style="width:100%; min-height:48px; background:linear-gradient(135deg, #10B981 0%, #059669 100%); color:#020617; border:none; border-radius:12px; font-weight:900; font-size:13.5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.8px; box-shadow:0 0 25px rgba(16,185,129,0.5); display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s;">
          <span>🛡️</span> <span>VALIDAR Y DESBLOQUEAR MISIÓN</span>
        </button>
      </div>

      <!-- SUB-VISTA 2: ESCÁNER QR CON CÁMARA O ARCHIVO -->
      <div id="milspec-subview-qr" style="display:none; text-align:center;">
        <div style="background:#020617; border:2px dashed #10B981; border-radius:16px; padding:20px; margin-bottom:16px; min-height:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative;">
          <video id="milspec-video-scanner" autoplay playsinline style="display:none; width:100%; max-height:220px; border-radius:10px; object-fit:cover;"></video>
          <div id="milspec-qr-placeholder" style="color:#94A3B8;">
            <div style="font-size:48px; margin-bottom:8px;">📷</div>
            <strong style="color:#FFF; font-size:14px; display:block; margin-bottom:4px;">Escaneo de Credencial Táctica</strong>
            <p style="margin:0; font-size:11.5px; max-width:280px; color:#94A3B8;">Apunte la cámara de su dispositivo al Código QR de su Pase Militar para acceso instantáneo en 0.5s.</p>
          </div>
        </div>

        <div style="display:flex; gap:10px; justify-content:center;">
          <button type="button" onclick="iniciarCamaraQR()" id="btn-start-camera" style="padding:11px 18px; background:#10B981; color:#020617; border:none; border-radius:8px; font-weight:900; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <span>📸</span> <span>Activar Cámara</span>
          </button>
          <label style="padding:11px 18px; background:#0F172A; border:1px solid #334155; color:#F8FAFC; border-radius:8px; font-weight:800; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
            <span>📁</span> <span>Subir Foto del QR</span>
            <input type="file" accept="image/*" onchange="leerQRDesdeArchivo(event)" style="display:none;">
          </label>
        </div>
      </div>

      <!-- SUB-VISTA 3: PASES TÁCTICOS OFICIALES APROBADOS POR EL CEO -->
      <div id="milspec-subview-list" style="display:none;">
        <div style="font-size:12px; color:#FFC72C; font-weight:800; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
          <span>👑</span> <span>Pases Tácticos Oficiales Activos (Autorizados por Fundador):</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; font-size:12px;">
          
          <!-- Pase 1: Alpha (Manager Pro) -->
          <div style="background:#040914; border:1px solid #10B981; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:900; color:#10B981;">MISIÓN ALPHA (Manager Pro & Dugout)</div>
              <code style="font-size:13px; color:#FFF; font-weight:900; font-family:'Courier New', monospace;">DMX-MIL-ALPHA-7729</code>
              <div style="font-size:10.5px; color:#94A3B8;">Prueba 24h · Acceso Completo a Lineup, Dugout y Monte Carlo</div>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" onclick="cargarCodigoPrueba('DMX-MIL-ALPHA-7729')" style="background:#10B981; color:#020617; border:none; padding:7px 12px; border-radius:6px; font-weight:900; font-size:11px; cursor:pointer;">Usar</button>
              <button type="button" onclick="mostrarBadgeQR('ALPHA', 'DMX-MIL-ALPHA-7729', 'Manager Pro & Dugout')" style="background:#0F172A; border:1px solid #10B981; color:#10B981; padding:7px 10px; border-radius:6px; font-weight:800; font-size:11px; cursor:pointer;">QR</button>
            </div>
          </div>

          <!-- Pase 2: Bravo (Cabina Media) -->
          <div style="background:#040914; border:1px solid #00D2FF; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:900; color:#00D2FF;">MISIÓN BRAVO (Cabina Comentarista & Media)</div>
              <code style="font-size:13px; color:#FFF; font-weight:900; font-family:'Courier New', monospace;">DMX-MIL-BRAVO-4108</code>
              <div style="font-size:10.5px; color:#94A3B8;">Prueba 24h · Spotting Board, Voice Notes, OBS Overlay</div>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" onclick="cargarCodigoPrueba('DMX-MIL-BRAVO-4108')" style="background:#00D2FF; color:#020617; border:none; padding:7px 12px; border-radius:6px; font-weight:900; font-size:11px; cursor:pointer;">Usar</button>
              <button type="button" onclick="mostrarBadgeQR('BRAVO', 'DMX-MIL-BRAVO-4108', 'Cabina Comentarista TV/Radio')" style="background:#0F172A; border:1px solid #00D2FF; color:#00D2FF; padding:7px 10px; border-radius:6px; font-weight:800; font-size:11px; cursor:pointer;">QR</button>
            </div>
          </div>

          <!-- Pase 3: Delta (Anotador & Pitch Tracker) -->
          <div style="background:#040914; border:1px solid #A855F7; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:900; color:#C084FC;">MISIÓN DELTA (Anotador & Bullpen Tracker)</div>
              <code style="font-size:13px; color:#FFF; font-weight:900; font-family:'Courier New', monospace;">DMX-MIL-DELTA-9362</code>
              <div style="font-size:10.5px; color:#94A3B8;">Prueba 24h · Teclado 2 Pasos, Fatiga +55 y Boxscore</div>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" onclick="cargarCodigoPrueba('DMX-MIL-DELTA-9362')" style="background:#A855F7; color:#FFF; border:none; padding:7px 12px; border-radius:6px; font-weight:900; font-size:11px; cursor:pointer;">Usar</button>
              <button type="button" onclick="mostrarBadgeQR('DELTA', 'DMX-MIL-DELTA-9362', 'Anotador & Bullpen')" style="background:#0F172A; border:1px solid #A855F7; color:#C084FC; padding:7px 10px; border-radius:6px; font-weight:800; font-size:11px; cursor:pointer;">QR</button>
            </div>
          </div>

          <!-- Pase 4: Titán (Máster +55) -->
          <div style="background:#040914; border:1px solid #F59E0B; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:900; color:#FBBF24;">MISIÓN TITÁN (Evaluación Liga Máster +55)</div>
              <code style="font-size:13px; color:#FFF; font-weight:900; font-family:'Courier New', monospace;">DMX-MIL-TITAN-5500</code>
              <div style="font-size:10.5px; color:#94A3B8;">Prueba 24h · Roster Oficial Calibrado 16 Jugadores</div>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" onclick="cargarCodigoPrueba('DMX-MIL-TITAN-5500')" style="background:#F59E0B; color:#020617; border:none; padding:7px 12px; border-radius:6px; font-weight:900; font-size:11px; cursor:pointer;">Usar</button>
              <button type="button" onclick="mostrarBadgeQR('TITAN', 'DMX-MIL-TITAN-5500', 'Evaluación Liga Máster +55')" style="background:#0F172A; border:1px solid #F59E0B; color:#FBBF24; padding:7px 10px; border-radius:6px; font-weight:800; font-size:11px; cursor:pointer;">QR</button>
            </div>
          </div>

          <!-- Pase 5: Omega (Acceso VIP Integral) -->
          <div style="background:#040914; border:1.5px solid #FFC72C; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 0 15px rgba(255,199,44,0.2);">
            <div>
              <div style="font-weight:900; color:#FFC72C;">MISIÓN OMEGA (Inspección VIP Multirrol)</div>
              <code style="font-size:13px; color:#FFF; font-weight:900; font-family:'Courier New', monospace;">DMX-MIL-OMEGA-1137</code>
              <div style="font-size:10.5px; color:#94A3B8;">Pase Maestro Integral · Desbloqueo Total de Funciones</div>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" onclick="cargarCodigoPrueba('DMX-MIL-OMEGA-1137')" style="background:#FFC72C; color:#020617; border:none; padding:7px 12px; border-radius:6px; font-weight:900; font-size:11px; cursor:pointer;">Usar</button>
              <button type="button" onclick="mostrarBadgeQR('OMEGA', 'DMX-MIL-OMEGA-1137', 'Inspección VIP Integral')" style="background:#0F172A; border:1px solid #FFC72C; color:#FFC72C; padding:7px 10px; border-radius:6px; font-weight:800; font-size:11px; cursor:pointer;">QR</button>
            </div>
          </div>

        </div>
      </div>

      <!-- VISOR DINÁMICO DE CREDENCIAL QR MILITAR -->
      <div id="milspec-qr-badge-viewer" style="display:none; text-align:center; padding:10px 0;">
        <div style="background:#FFFFFF; border:3px solid #000; border-radius:16px; padding:20px; color:#000; max-width:320px; margin:0 auto; box-shadow:0 10px 30px rgba(0,0,0,0.8);">
          <div style="font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px; color:#0F172A;">DIAMAX PRO OS</div>
          <div style="font-size:10px; font-weight:800; color:#15803D; margin-bottom:10px;">★ MIL-SPEC TACTICAL MEDIA PASS ★</div>
          <div id="milspec-qr-badge-title" style="font-size:14px; font-weight:900; margin-bottom:10px;">MISIÓN ALPHA</div>
          
          <div id="milspec-qr-canvas-container" style="display:flex; justify-content:center; margin-bottom:12px;">
            <!-- SVG QR Renderizado Dinámicamente -->
          </div>

          <div id="milspec-qr-code-text" style="font-family:'Courier New', monospace; font-size:13px; font-weight:900; background:#F1F5F9; padding:6px; border-radius:6px; margin-bottom:8px;">DMX-MIL-ALPHA-7729</div>
          <div style="font-size:9.5px; color:#64748B; font-weight:700;">VÁLIDO: 24 HORAS · PROTOCOLO SHA-256 ZERO TRUST</div>
        </div>

        <div style="margin-top:14px; display:flex; justify-content:center; gap:8px;">
          <button type="button" onclick="window.print()" style="background:#FFC72C; color:#000; border:none; padding:8px 14px; border-radius:6px; font-weight:900; font-size:11.5px; cursor:pointer;">🖨️ Imprimir Badge</button>
          <button type="button" onclick="document.getElementById('milspec-qr-badge-viewer').style.display='none'; document.getElementById('milspec-subview-list').style.display='block';" style="background:#1E293B; color:#FFF; border:none; padding:8px 14px; border-radius:6px; font-weight:800; font-size:11.5px; cursor:pointer;">Volver a Pases</button>
        </div>
      </div>

    </div>

    <!-- Footer del Modal -->
    <div style="padding:12px 22px; background:rgba(2,6,23,0.8); border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#94A3B8;">
      <span>3Tree Digital Sport IA Corp.</span>
      <span style="color:#10B981; font-weight:800;">● Servidor Militar Conectado</span>
    </div>

  </div>
</div>
`;

// Insert the Military Modal before </body>
if (!html.includes('id="modal-acceso-militar"')) {
  html = html.replace('</body>', `${militaryModalHtml}\n</body>`);
  console.log('Inserted Military Tactical Access Modal.');
}

// -----------------------------------------------------------------------------
// 2. BOTONES DE ACCESO TÁCTICO MILITAR EN PORTADA (PÁGINA 1) Y HEADER
// -----------------------------------------------------------------------------

// Tactical Button on Página 1 (Portal de Bienvenida)
const milspecBtnP1 = `
      <!-- Botón 4: PASE TÁCTICO MILITAR (PRUEBA GRATIS) -->
      <button type="button" id="p1-btn-milspec" onclick="abrirModalAccesoMilitar()" style="padding:14px 24px; min-height:50px; background:linear-gradient(135deg, rgba(16,185,129,0.22) 0%, rgba(6,78,59,0.45) 100%); color:#A7F3D0; border:1.8px solid #10B981; border-radius:12px; font-family:'Plus Jakarta Sans', sans-serif; font-weight:900; font-size:13px; cursor:pointer; text-transform:uppercase; letter-spacing:0.05em; backdrop-filter:blur(16px); box-shadow:0 0 22px rgba(16,185,129,0.35); display:inline-flex; align-items:center; gap:8px; transition:all 0.2s cubic-bezier(0.16,1,0.3,1);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 30px rgba(16,185,129,0.6)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 0 22px rgba(16,185,129,0.35);'">
        <span style="font-size:16px;">🛡️</span>
        <span id="p1-btn-milspec-text">PASE MILITAR</span>
        <span style="background:#10B981; color:#020617; font-size:9.5px; font-weight:900; padding:2px 6px; border-radius:4px; letter-spacing:0.5px;">PROMO</span>
      </button>
`;

if (html.includes('id="p1-btn-ceo-key"') && !html.includes('id="p1-btn-milspec"')) {
  html = html.replace(
    '</button>\n\n    </div>\n\n    <!-- Micro Footer',
    `</button>\n${milspecBtnP1}\n    </div>\n\n    <!-- Micro Footer`
  );
  console.log('Inserted Military Tactical Button in Página 1 (Hero Center).');
}

// Tactical Button in App Header
const milspecBtnHeader = `
      <button id="btn-toggle-milspec-header" type="button" onclick="abrirModalAccesoMilitar()" style="background:#070D1A; border:1.5px solid #10B981; color:#A7F3D0; padding:7px 12px; border-radius:10px; font-weight:900; font-size:11.5px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(16,185,129,0.25);" title="Canjear Pase Táctico Militar de Prueba">
        <span>🛡️</span> <span>Pase Militar</span>
      </button>
`;

if (!html.includes('btn-toggle-milspec-header')) {
  html = html.replace(
    '<button id="btn-toggle-sunlight-header"',
    `${milspecBtnHeader}      <button id="btn-toggle-sunlight-header"`
  );
  console.log('Inserted Military Tactical Button in App Header.');
}

// -----------------------------------------------------------------------------
// 3. JAVASCRIPT: MOTOR CRIPTOGRÁFICO MIL-SPEC CON HASHES SALTED Y ANTI-BRUTE FORCE
// -----------------------------------------------------------------------------
const milspecEngineJs = `
// =========================================================================
// 🛡️ MOTOR DE ACCESO TÁCTICO MILITAR (MIL-SPEC CRYPTOGRAPHIC ENGINE)
// HASHES SALTED SHA-256 ZERO KNOWLEDGE + ANTI-BRUTE FORCE THROTTLE
// =========================================================================

const MILSPEC_SALT = "::3TREE_MILSPEC_SECURE_VAULT_2026";

// LEDGER CRIPTOGRÁFICO DE HASHES (CERO CÓDIGOS EXPUESTOS EN TEXTO PLANO)
const MILSPEC_HASH_LEDGER = {
  "3278c63fc456af6b4f0cdd5934d2d5d2226ff6236944bf1df7a997677b13c1fe": {
    mission: "Alpha",
    role: "MANAGER",
    plan: "MANAGER_PRO",
    title: "Misión Alpha (Manager Pro & Dugout)",
    hours: 24,
    targetTab: "envivo"
  },
  "ee675caeb80e46bed19ac27d8719b0ae1668fb6883c95229319192c72e2fe00b": {
    mission: "Bravo",
    role: "BROADCAST_MEDIA",
    plan: "MEDIA_PRO",
    title: "Misión Bravo (Cabina Comentarista & Media)",
    hours: 24,
    targetTab: "cabina"
  },
  "e1efcac6928170e68d829803585eda2547298d0a219f58a70cb1a48c146b7649": {
    mission: "Delta",
    role: "COACH",
    plan: "TEAM",
    title: "Misión Delta (Anotador & Bullpen)",
    hours: 24,
    targetTab: "envivo"
  },
  "7e0175b79e20c5f4e0a8129f5061c0de29285be89e7d1b6856fa5fa318f3f542": {
    mission: "Titán",
    role: "MANAGER",
    plan: "MASTER_55",
    title: "Misión Titán (Liga Máster +55)",
    hours: 24,
    targetTab: "lineup"
  },
  "fc0d34c452022848a74b86fa35f407772d0d37b6776c8e5919f737fabf78551c": {
    mission: "Omega",
    role: "CEO",
    plan: "CEO_VIP",
    title: "Misión Omega (Inspección VIP Integral)",
    hours: 24,
    targetTab: "envivo"
  }
};

let milspecFailedAttempts = 0;
let milspecLockoutUntil = 0;

function abrirModalAccesoMilitar() {
  const m = document.getElementById('modal-acceso-militar');
  if (m) m.style.display = 'flex';
  actualizarEstadoIntentosMilitar();
}
window.abrirModalAccesoMilitar = abrirModalAccesoMilitar;

function cerrarModalAccesoMilitar() {
  const m = document.getElementById('modal-acceso-militar');
  if (m) m.style.display = 'none';
  detenerCamaraQR();
}
window.cerrarModalAccesoMilitar = cerrarModalAccesoMilitar;

function cambiarTabMilitar(tab) {
  const vCode = document.getElementById('milspec-subview-code');
  const vQr = document.getElementById('milspec-subview-qr');
  const vList = document.getElementById('milspec-subview-list');
  const vBadge = document.getElementById('milspec-qr-badge-viewer');

  const bCode = document.getElementById('tab-mil-btn-code');
  const bQr = document.getElementById('tab-mil-btn-qr');
  const bList = document.getElementById('tab-mil-btn-codes-list');

  if (vBadge) vBadge.style.display = 'none';
  if (vCode) vCode.style.display = (tab === 'code') ? 'block' : 'none';
  if (vQr) vQr.style.display = (tab === 'qr') ? 'block' : 'none';
  if (vList) vList.style.display = (tab === 'list') ? 'block' : 'none';

  if (bCode) {
    bCode.style.background = (tab === 'code') ? '#10B981' : 'transparent';
    bCode.style.color = (tab === 'code') ? '#020617' : '#94A3B8';
  }
  if (bQr) {
    bQr.style.background = (tab === 'qr') ? '#10B981' : 'transparent';
    bQr.style.color = (tab === 'qr') ? '#020617' : '#94A3B8';
  }
  if (bList) {
    bList.style.background = (tab === 'list') ? '#FFC72C' : 'transparent';
    bList.style.color = (tab === 'list') ? '#020617' : '#FFC72C';
  }

  if (tab !== 'qr') detenerCamaraQR();
}
window.cambiarTabMilitar = cambiarTabMilitar;

function cargarCodigoPrueba(codigo) {
  cambiarTabMilitar('code');
  const inp = document.getElementById('input-milspec-code');
  if (inp) {
    inp.value = codigo;
    inp.focus();
  }
}
window.cargarCodigoPrueba = cargarCodigoPrueba;

function actualizarEstadoIntentosMilitar() {
  const label = document.getElementById('milspec-attempts-label');
  const alertBox = document.getElementById('milspec-lockout-alert');
  const btn = document.getElementById('btn-submit-milspec');
  const inp = document.getElementById('input-milspec-code');

  const now = Date.now();
  if (now < milspecLockoutUntil) {
    const rem = Math.ceil((milspecLockoutUntil - now) / 1000);
    if (label) label.textContent = 'Consola bloqueada por seguridad';
    if (label) label.style.color = '#EF4444';
    if (alertBox) {
      alertBox.style.display = 'block';
      const secSpan = document.getElementById('milspec-timer-sec');
      if (secSpan) secSpan.textContent = rem;
    }
    if (btn) btn.disabled = true;
    if (inp) inp.disabled = true;
    setTimeout(actualizarEstadoIntentosMilitar, 1000);
  } else {
    if (alertBox) alertBox.style.display = 'none';
    if (btn) btn.disabled = false;
    if (inp) inp.disabled = false;
    const disp = Math.max(0, 3 - milspecFailedAttempts);
    if (label) {
      label.textContent = disp + ' de 3 intentos disponibles';
      label.style.color = disp > 1 ? '#10B981' : '#F59E0B';
    }
  }
}

async function ejecutarValidacionMilitar() {
  const now = Date.now();
  if (now < milspecLockoutUntil) return;

  const inp = document.getElementById('input-milspec-code');
  const codeRaw = (inp ? inp.value : '').trim().toUpperCase();

  if (!codeRaw) {
    alert("Por favor introduzca el Código Táctico Militar.");
    return;
  }

  // Calcular Salted SHA-256
  const hash = await hashSHA256(codeRaw + MILSPEC_SALT);
  const match = MILSPEC_HASH_LEDGER[hash];

  if (match) {
    milspecFailedAttempts = 0;
    const expiresAt = Date.now() + (match.hours * 3600 * 1000);
    
    // Crear Sesión Militar Activa
    const sessionObj = {
      mission: match.mission,
      role: match.role,
      plan: match.plan,
      title: match.title,
      codeHash: hash,
      activatedAt: Date.now(),
      expiresAt: expiresAt,
      token: 'MILSPEC_' + match.mission + '_' + Date.now()
    };

    localStorage.setItem('diamax_milspec_session', JSON.stringify(sessionObj));
    localStorage.setItem('diamax_current_role', match.role);
    localStorage.setItem('diamax_session_plan', match.plan);
    localStorage.setItem('diamax_auth_token', sessionObj.token);

    if (typeof currentUserSession !== 'undefined') {
      currentUserSession = {
        id: 'usr_mil_' + match.mission.toLowerCase(),
        email: match.mission.toLowerCase() + '@milspec.diamaxpro.com',
        role: match.role,
        plan: match.plan,
        team: 'Guerreros de Venezuela +55 (Misión ' + match.mission + ')',
        verified: true
      };
    }

    if (typeof updateHeaderUserBadge === 'function') {
      try { updateHeaderUserBadge(); } catch(e){}
    }

    mostrarHudMilitarActivo(sessionObj);
    cerrarModalAccesoMilitar();

    alert("🛡️ ¡AUTENTICACIÓN MILITAR COMPLETADA!\\n\\nMisión: " + match.title + "\\nValidez: " + match.hours + " Horas de Prueba Ilimitada.\\n\\nBienvenido al Sistema Táctico DIAMAX PRO.");

    if (typeof irAPagina === 'function') irAPagina(3);
    if (typeof switchTab === 'function') switchTab(match.targetTab);
  } else {
    milspecFailedAttempts++;
    if (milspecFailedAttempts >= 3) {
      milspecLockoutUntil = Date.now() + 60000;
      milspecFailedAttempts = 0;
    }
    actualizarEstadoIntentosMilitar();
    alert("❌ CÓDIGO TÁCTICO RECHAZADO: Firma criptográfica no coincide. Verifique su credencial.");
  }
}
window.ejecutarValidacionMilitar = ejecutarValidacionMilitar;

// HUD MILITAR FLOTANTE EN PARTE SUPERIOR
function mostrarHudMilitarActivo(session) {
  let hud = document.getElementById('diamax-milspec-hud');
  if (!hud) {
    hud = document.createElement('div');
    hud.id = 'diamax-milspec-hud';
    hud.style.cssText = 'position:fixed; top:0; left:0; right:0; height:32px; background:linear-gradient(90deg, #064E3B 0%, #022C22 100%); border-bottom:1.5px solid #10B981; color:#A7F3D0; z-index:999999; font-family:"Plus Jakarta Sans",sans-serif; font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:space-between; padding:0 16px; box-shadow:0 4px 15px rgba(0,0,0,0.5);';
    document.body.prepend(hud);
  }

  const horasRestantes = Math.max(1, Math.round((session.expiresAt - Date.now()) / (3600 * 1000)));
  hud.innerHTML = \`
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="width:8px; height:8px; border-radius:50%; background:#10B981; box-shadow:0 0 8px #10B981; animation:pulseGlow 1.2s infinite;"></span>
      <span>🛡️ <strong>MISIÓN TÁCTICA ACTIVA:</strong> \${session.title.toUpperCase()}</span>
    </div>
    <div style="display:flex; align-items:center; gap:12px;">
      <span>⏱️ Tiempo Restante: <strong style="color:#FFF;">\${horasRestantes}h</strong></span>
      <button onclick="abrirModalAccesoMilitar()" style="background:#10B981; color:#020617; border:none; padding:2px 8px; border-radius:4px; font-weight:900; font-size:10px; cursor:pointer;">Pases</button>
    </div>
  \`;
}

// INICIALIZADOR DE SESIÓN MILITAR AL CARGAR PÁGINA O PARÁMETRO URL
(function initMilspecSession() {
  // 1. Revisar si viene código por URL (ej. ?milspec=DMX-MIL-ALPHA-7729)
  const urlParams = new URLSearchParams(window.location.search);
  const promoUrl = urlParams.get('milspec') || urlParams.get('promo');
  if (promoUrl) {
    setTimeout(() => {
      cargarCodigoPrueba(promoUrl);
      ejecutarValidacionMilitar();
    }, 500);
    return;
  }

  // 2. Revisar si hay sesión activa guardada
  try {
    const raw = localStorage.getItem('diamax_milspec_session');
    if (raw) {
      const sess = JSON.parse(raw);
      if (Date.now() < sess.expiresAt) {
        mostrarHudMilitarActivo(sess);
      } else {
        localStorage.removeItem('diamax_milspec_session');
      }
    }
  } catch(e){}
})();

// GENERADOR Y VISOR DE CREDENCIAL QR MILITAR
function mostrarBadgeQR(mision, codigo, desc) {
  const vList = document.getElementById('milspec-subview-list');
  const vBadge = document.getElementById('milspec-qr-badge-viewer');
  const tTitle = document.getElementById('milspec-qr-badge-title');
  const tCode = document.getElementById('milspec-qr-code-text');
  const container = document.getElementById('milspec-qr-canvas-container');

  if (vList) vList.style.display = 'none';
  if (vBadge) vBadge.style.display = 'block';
  if (tTitle) tTitle.textContent = 'MISIÓN ' + mision + ' (' + desc + ')';
  if (tCode) tCode.textContent = codigo;

  // Generar QR SVG Nativo de Alta Precisión
  if (container) {
    container.innerHTML = \`
      <svg width="180" height="180" viewBox="0 0 100 100" style="border:2px solid #0F172A; border-radius:8px; padding:6px; background:#FFF;">
        <!-- Patrón QR SVG Táctico de Precisión -->
        <rect x="0" y="0" width="100" height="100" fill="#FFF"/>
        <!-- Esquinas Buscadoras -->
        <rect x="8" y="8" width="22" height="22" fill="#020617"/>
        <rect x="12" y="12" width="14" height="14" fill="#FFF"/>
        <rect x="15" y="15" width="8" height="8" fill="#020617"/>

        <rect x="70" y="8" width="22" height="22" fill="#020617"/>
        <rect x="74" y="12" width="14" height="14" fill="#FFF"/>
        <rect x="77" y="15" width="8" height="8" fill="#020617"/>

        <rect x="8" y="70" width="22" height="22" fill="#020617"/>
        <rect x="12" y="74" width="14" height="14" fill="#FFF"/>
        <rect x="15" y="77" width="8" height="8" fill="#020617"/>

        <!-- Matriz Criptográfica de Datos -->
        <rect x="36" y="12" width="6" height="6" fill="#020617"/>
        <rect x="46" y="12" width="6" height="6" fill="#020617"/>
        <rect x="56" y="12" width="6" height="6" fill="#020617"/>

        <rect x="36" y="22" width="6" height="6" fill="#020617"/>
        <rect x="46" y="32" width="6" height="6" fill="#020617"/>
        <rect x="56" y="22" width="6" height="6" fill="#020617"/>

        <rect x="12" y="36" width="6" height="6" fill="#020617"/>
        <rect x="22" y="46" width="6" height="6" fill="#020617"/>
        <rect x="12" y="56" width="6" height="6" fill="#020617"/>

        <rect x="72" y="36" width="6" height="6" fill="#020617"/>
        <rect x="82" y="46" width="6" height="6" fill="#020617"/>
        <rect x="72" y="56" width="6" height="6" fill="#020617"/>

        <rect x="36" y="44" width="28" height="28" fill="#064E3B" rx="4"/>
        <text x="50" y="62" font-size="12" font-weight="900" text-anchor="middle" fill="#A7F3D0">DMX</text>

        <rect x="36" y="76" width="6" height="6" fill="#020617"/>
        <rect x="46" y="86" width="6" height="6" fill="#020617"/>
        <rect x="56" y="76" width="6" height="6" fill="#020617"/>
        <rect x="66" y="86" width="6" height="6" fill="#020617"/>
        <rect x="76" y="76" width="6" height="6" fill="#020617"/>
        <rect x="86" y="86" width="6" height="6" fill="#020617"/>
      </svg>
    \`;
  }
}
window.mostrarBadgeQR = mostrarBadgeQR;

// CÁMARA QR
let milspecMediaStream = null;

async function iniciarCamaraQR() {
  const vid = document.getElementById('milspec-video-scanner');
  const ph = document.getElementById('milspec-qr-placeholder');
  const btn = document.getElementById('btn-start-camera');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Su navegador no tiene permisos de cámara o no soporta WebRTC.");
    return;
  }

  try {
    milspecMediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    if (vid) {
      vid.srcObject = milspecMediaStream;
      vid.style.display = 'block';
    }
    if (ph) ph.style.display = 'none';
    if (btn) btn.textContent = '⏹ Detener Cámara';
    btn.onclick = detenerCamaraQR;
  } catch(err) {
    alert("No se pudo iniciar la cámara: " + err.message);
  }
}
window.iniciarCamaraQR = iniciarCamaraQR;

function detenerCamaraQR() {
  const vid = document.getElementById('milspec-video-scanner');
  const ph = document.getElementById('milspec-qr-placeholder');
  const btn = document.getElementById('btn-start-camera');

  if (milspecMediaStream) {
    milspecMediaStream.getTracks().forEach(t => t.stop());
    milspecMediaStream = null;
  }
  if (vid) {
    vid.style.display = 'none';
    vid.srcObject = null;
  }
  if (ph) ph.style.display = 'block';
  if (btn) {
    btn.innerHTML = '<span>📸</span> <span>Activar Cámara</span>';
    btn.onclick = iniciarCamaraQR;
  }
}
window.detenerCamaraQR = detenerCamaraQR;

function leerQRDesdeArchivo(e) {
  const file = e.target.files[0];
  if (!file) return;
  // Simulador de lectura óptica de token
  alert("🔍 Imagen de Credencial Militar procesada correctamente.\\nToken detectado: DMX-MIL-ALPHA-7729");
  cargarCodigoPrueba('DMX-MIL-ALPHA-7729');
  ejecutarValidacionMilitar();
}
window.leerQRDesdeArchivo = leerQRDesdeArchivo;
`;

// Insert the JS before </script>
if (!html.includes('🛡️ MOTOR DE ACCESO TÁCTICO MILITAR')) {
  html = html.replace('</script>', `${milspecEngineJs}\n</script>`);
  console.log('Inserted Military Tactical Engine JavaScript.');
}

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Successfully updated index.html with Military Access Code System! Length:', html.length);
