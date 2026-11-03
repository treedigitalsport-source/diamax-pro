import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

console.log('Iniciando integración de Fase 7 en index.html...');

// =========================================================================
// 1. BOTÓN DE CABINA EN EL NAVBAR PRINCIPAL
// =========================================================================
const navTarget = `<button class="nav-tab" data-tab="tab-perfil" onclick="switchTab('perfil')" id="nav-profile">
        <svg class="diamax-nav-ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="8" r="4"/><path d="M3.5 19.5C3.5 16.2 6.8 13.5 11 13.5C15.2 13.5 18.5 16.2 18.5 19.5"/><path d="M19 4.5C20.2 5.7 21 7.2 21 9"/><path d="M17 6.5C17.7 7.2 18.2 8.1 18.2 9"/></svg><span>Perfil</span>
      </button>
    </div>
  </div>

  <div id="nav-cabina" style="display:none;" data-tab="tab-cabina"></div>`;

const navReplacement = `<button class="nav-tab" data-tab="tab-perfil" onclick="switchTab('perfil')" id="nav-profile">
        <svg class="diamax-nav-ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="8" r="4"/><path d="M3.5 19.5C3.5 16.2 6.8 13.5 11 13.5C15.2 13.5 18.5 16.2 18.5 19.5"/><path d="M19 4.5C20.2 5.7 21 7.2 21 9"/><path d="M17 6.5C17.7 7.2 18.2 8.1 18.2 9"/></svg><span>Perfil</span>
      </button>
      <button class="nav-tab" data-tab="tab-cabina" onclick="switchTab('cabina')" id="nav-cabina">
        <svg class="diamax-nav-ico" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>🎙️ Cabina &amp; Comentaristas</span>
      </button>
    </div>
  </div>`;

if (html.includes(navTarget)) {
  html = html.replace(navTarget, navReplacement);
  console.log('✓ Botón de navegación nav-cabina insertado exitosamente.');
} else {
  console.warn('⚠️ No se encontró navTarget exacto, verificando existencia...');
}

// =========================================================================
// 2. SECCIÓN: BASE DE DATOS DE COMENTARISTAS Y PATROCINIOS DE CABINA
// =========================================================================
const cabinaSectionHTML = `
    <!-- =========================================================================
         🎙️ BASE DE DATOS OFICIAL DE COMENTARISTAS & PATROCINIOS DE CABINA (FASE 7)
         Cloud Firestore: diamax-pro-f6f16 | Sincronización Real | Aislamiento Dugout
         ========================================================================= -->
    <div id="section-commentators-db" style="margin-top:28px; background:linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.98) 100%); border:1.5px solid rgba(217, 119, 6, 0.45); border-radius:20px; padding:22px 24px; box-shadow:0 20px 50px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255, 255, 255, 0.1);">
      
      <!-- ENCABEZADO Y STATUS EN VIVO DE FIRESTORE -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:42px; height:42px; border-radius:12px; background:linear-gradient(135deg, #D97706 0%, #B45309 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(217, 119, 6, 0.45);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h3 style="margin:0; font-size:17px; font-weight:900; color:#FFFFFF; letter-spacing:0.3px;">BASE DE DATOS OFICIAL DE COMENTARISTAS &amp; CABINA PRO</h3>
              <span style="background:rgba(16, 185, 129, 0.15); border:1px solid #10B981; color:#34D399; font-size:10px; font-weight:900; padding:2px 8px; border-radius:12px; display:inline-flex; align-items:center; gap:5px;">
                <span style="width:6px; height:6px; border-radius:50%; background:#10B981; box-shadow:0 0 6px #10B981;"></span>
                FIRESTORE ONLINE
              </span>
            </div>
            <div style="font-size:11.5px; color:#94A3B8; margin-top:3px;">
              Proyecto: <strong style="color:#FDE68A;">diamax-pro-f6f16</strong> • Aislamiento Estricto: Los comentaristas leen telemetría en vivo sin alterar la anotación del dugout.
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <button type="button" onclick="DIAMAX_BROADCAST.recargarFirestore()" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#F8FAFC; font-size:11.5px; font-weight:800; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.15s ease;" title="Recargar comentaristas y patrocinios desde Firestore">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            <span>Sincronizar</span>
          </button>
          <button type="button" onclick="document.getElementById('form-nuevo-narrador').style.display = (document.getElementById('form-nuevo-narrador').style.display === 'none' ? 'block' : 'none')" style="background:#D97706; border:none; color:#FFFFFF; font-size:11.5px; font-weight:900; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 4px 14px rgba(217, 119, 6, 0.4);" title="Registrar un nuevo comentarista o locutor">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>+ Registrar Narrador</span>
          </button>
          <button type="button" onclick="document.getElementById('form-nuevo-patrocinio').style.display = (document.getElementById('form-nuevo-patrocinio').style.display === 'none' ? 'block' : 'none')" style="background:rgba(217, 119, 6, 0.18); border:1px solid rgba(217, 119, 6, 0.4); color:#FDE68A; font-size:11.5px; font-weight:900; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;" title="Registrar un nuevo patrocinio comercial">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>+ Patrocinio</span>
          </button>
        </div>
      </div>

      <!-- FORMULARIO DESPLEGABLE: NUEVO NARRADOR -->
      <div id="form-nuevo-narrador" style="display:none; background:#0B1220; border:1px solid rgba(217, 119, 6, 0.35); border-radius:14px; padding:18px; margin-bottom:20px;">
        <div style="font-size:13px; font-weight:900; color:#FDE68A; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          REGISTRAR NUEVO NARRADOR O COMENTARISTA (CLOUD FIRESTORE)
        </div>
        <form onsubmit="DIAMAX_BROADCAST.guardarNuevoNarrador(event)" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Nombre Completo:</label>
            <input type="text" id="comm-form-name" required placeholder="Ej. Carlos Valmore" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Usuario / Handle:</label>
            <input type="text" id="comm-form-handle" required placeholder="Ej. @carlosvalmore" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Medio de Transmisión:</label>
            <input type="text" id="comm-form-media" required placeholder="Ej. IVC Networks / YouTube" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Rol en Cabina:</label>
            <select id="comm-form-role" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
              <option value="NARRADOR_PLAY_BY_PLAY">NARRADOR_PLAY_BY_PLAY (Voz Principal)</option>
              <option value="COMENTARISTA_SABERMETRICO">COMENTARISTA_SABERMETRICO (Análisis &amp; Datos)</option>
              <option value="VOZ_COMERCIAL_Y_COLOR">VOZ_COMERCIAL_Y_COLOR (Patrocinios &amp; Terreno)</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Canal de Transmisión (URL):</label>
            <input type="url" id="comm-form-url" placeholder="https://youtube.com/live/..." style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div style="grid-column:1 / -1;">
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Frase Célebre / Grito de Guerra:</label>
            <input type="text" id="comm-form-catchphrase" required placeholder="Ej. ¡La bola va picando contra la pared y anota fácilmente!" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div style="grid-column:1 / -1; display:flex; justify-content:flex-end; gap:8px;">
            <button type="button" onclick="document.getElementById('form-nuevo-narrador').style.display='none'" style="background:transparent; border:1px solid #475569; color:#CBD5E1; padding:8px 16px; border-radius:8px; font-size:12px; cursor:pointer;">Cancelar</button>
            <button type="submit" style="background:#D97706; border:none; color:#FFFFFF; font-weight:900; padding:8px 20px; border-radius:8px; font-size:12px; cursor:pointer;">Guardar en Firestore</button>
          </div>
        </form>
      </div>

      <!-- FORMULARIO DESPLEGABLE: NUEVO PATROCINIO -->
      <div id="form-nuevo-patrocinio" style="display:none; background:#0B1220; border:1px solid rgba(217, 119, 6, 0.35); border-radius:14px; padding:18px; margin-bottom:20px;">
        <div style="font-size:13px; font-weight:900; color:#FDE68A; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>
          REGISTRAR NUEVO PATROCINIO COMERCIAL (CLOUD FIRESTORE)
        </div>
        <form onsubmit="DIAMAX_BROADCAST.guardarNuevoPatrocinio(event)" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Marca Comercial:</label>
            <input type="text" id="spons-form-brand" required placeholder="Ej. Farmacias Los Andes" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Detonador (Trigger Event):</label>
            <select id="spons-form-trigger" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
              <option value="HR">⚡ JONRÓN (HR)</option>
              <option value="DP">⚾ DOBLE PLAY (DP)</option>
              <option value="PITCH_CHANGE">🔄 CAMBIO DE PITCHER (PITCH_CHANGE)</option>
              <option value="FATIGUE_75">🚨 FATIGA 75+ PITCHEOS (FATIGUE_75)</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Categoría:</label>
            <input type="text" id="spons-form-category" required placeholder="Ej. Salud &amp; Bienestar" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div>
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Duración (Segundos):</label>
            <input type="number" id="spons-form-duration" value="15" min="5" max="60" style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px;">
          </div>
          <div style="grid-column:1 / -1;">
            <label style="display:block; font-size:10.5px; font-weight:800; color:#94A3B8; margin-bottom:4px; text-transform:uppercase;">Guion de Lectura al Aire:</label>
            <textarea id="spons-form-script" rows="2" required placeholder="Texto que el narrador leerá al micrófono cuando se detone este evento..." style="width:100%; box-sizing:border-box; background:#030712; border:1px solid #334155; border-radius:8px; padding:8px 12px; color:#FFFFFF; font-size:12px; font-family:inherit;"></textarea>
          </div>
          <div style="grid-column:1 / -1; display:flex; justify-content:flex-end; gap:8px;">
            <button type="button" onclick="document.getElementById('form-nuevo-patrocinio').style.display='none'" style="background:transparent; border:1px solid #475569; color:#CBD5E1; padding:8px 16px; border-radius:8px; font-size:12px; cursor:pointer;">Cancelar</button>
            <button type="submit" style="background:#D97706; border:none; color:#FFFFFF; font-weight:900; padding:8px 20px; border-radius:8px; font-size:12px; cursor:pointer;">Guardar Patrocinio</button>
          </div>
        </form>
      </div>

      <!-- ===================================================================
           SIMULADOR DE DETONADORES EN VIVO (PATROCINIOS DE TRANSMISIÓN)
           =================================================================== -->
      <div style="background:#090D16; border:1px solid rgba(255, 255, 255, 0.08); border-radius:16px; padding:18px 20px; margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:11px; font-weight:900; color:#F59E0B; text-transform:uppercase; letter-spacing:0.8px;">
              DETONADORES COMERCIALES EN VIVO (CANÓNICOS WBSC &amp; CABINA PRO)
            </span>
            <span style="font-size:10.5px; color:#64748B;">• Toca un botón para activar la cuña al aire</span>
          </div>
          <div id="trigger-sync-status" style="font-size:10.5px; color:#94A3B8;">
            Vinculado al motor de juego en tiempo real
          </div>
        </div>

        <!-- 4 BOTONES DE ALTO IMPACTO -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:16px;">
          
          <!-- DETONADOR 1: HR -->
          <button type="button" onclick="DIAMAX_BROADCAST.triggerSponsor('HR')" style="background:linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.35) 100%); border:1.5px solid #EF4444; border-radius:12px; padding:12px 14px; color:#FFFFFF; cursor:pointer; text-align:left; display:flex; flex-direction:column; gap:4px; box-shadow:0 4px 15px rgba(239, 68, 68, 0.25); transition:all 0.15s ease;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11px; font-weight:900; color:#FCA5A5;">⚡ JONRÓN (HR)</span>
              <span style="font-size:9.5px; background:rgba(239,68,68,0.3); padding:2px 6px; border-radius:4px; color:#FFF;">15s</span>
            </div>
            <div style="font-size:13px; font-weight:900; color:#FFFFFF;">Baterías Titán</div>
            <div style="font-size:10px; color:#E2E8F0; opacity:0.85;">Poder descomunal y energía clutch</div>
          </button>

          <!-- DETONADOR 2: DP -->
          <button type="button" onclick="DIAMAX_BROADCAST.triggerSponsor('DP')" style="background:linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(2, 132, 199, 0.35) 100%); border:1.5px solid #0EA5E9; border-radius:12px; padding:12px 14px; color:#FFFFFF; cursor:pointer; text-align:left; display:flex; flex-direction:column; gap:4px; box-shadow:0 4px 15px rgba(14, 165, 233, 0.25); transition:all 0.15s ease;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11px; font-weight:900; color:#7DD3FC;">⚾ DOBLE PLAY (DP)</span>
              <span style="font-size:9.5px; background:rgba(14,165,233,0.3); padding:2px 6px; border-radius:4px; color:#FFF;">12s</span>
            </div>
            <div style="font-size:13px; font-weight:900; color:#FFFFFF;">Ferretería La Solución</div>
            <div style="font-size:10px; color:#E2E8F0; opacity:0.85;">Doble matanza y cerrojo perfecto</div>
          </button>

          <!-- DETONADOR 3: PITCH_CHANGE -->
          <button type="button" onclick="DIAMAX_BROADCAST.triggerSponsor('PITCH_CHANGE')" style="background:linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.35) 100%); border:1.5px solid #10B981; border-radius:12px; padding:12px 14px; color:#FFFFFF; cursor:pointer; text-align:left; display:flex; flex-direction:column; gap:4px; box-shadow:0 4px 15px rgba(16, 185, 129, 0.25); transition:all 0.15s ease;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11px; font-weight:900; color:#6EE7B7;">🔄 CAMBIO DE PITCHER</span>
              <span style="font-size:9.5px; background:rgba(16,185,129,0.3); padding:2px 6px; border-radius:4px; color:#FFF;">15s</span>
            </div>
            <div style="font-size:13px; font-weight:900; color:#FFFFFF;">Seguros Diamante Pro</div>
            <div style="font-size:10px; color:#E2E8F0; opacity:0.85;">Relevo seguro y póliza garantizada</div>
          </button>

          <!-- DETONADOR 4: FATIGUE_75 -->
          <button type="button" onclick="DIAMAX_BROADCAST.triggerSponsor('FATIGUE_75')" style="background:linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%); border:1.5px solid #F59E0B; border-radius:12px; padding:12px 14px; color:#FFFFFF; cursor:pointer; text-align:left; display:flex; flex-direction:column; gap:4px; box-shadow:0 4px 15px rgba(245, 158, 11, 0.25); transition:all 0.15s ease;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11px; font-weight:900; color:#FDE68A;">🚨 ALERTA 75 PITCHEOS</span>
              <span style="font-size:9.5px; background:rgba(245,158,11,0.3); padding:2px 6px; border-radius:4px; color:#FFF;">15s</span>
            </div>
            <div style="font-size:13px; font-weight:900; color:#FFFFFF;">Clínica Médica +55</div>
            <div style="font-size:10px; color:#E2E8F0; opacity:0.85;">Semáforo de brazo y salud deportiva</div>
          </button>
        </div>

        <!-- TELEPROMPTER GIGANTE DE LECTURA AL AIRE -->
        <div id="prompter-active-box" style="background:#020617; border:2px solid #F59E0B; border-radius:14px; padding:18px 22px; position:relative; box-shadow:0 0 30px rgba(245, 158, 11, 0.25);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span id="prompter-trigger-badge" style="background:#F59E0B; color:#000; font-size:10px; font-weight:900; padding:3px 8px; border-radius:6px; letter-spacing:0.5px;">
                ⚡ JONRÓN (HR) DETONADO
              </span>
              <strong id="prompter-brand-title" style="font-size:14px; color:#FFFFFF; font-weight:900;">
                Baterías Titán
              </strong>
              <span id="prompter-category-badge" style="font-size:11px; color:#94A3B8;">
                (Automotriz y Energía • 15s)
              </span>
            </div>
            
            <div style="display:flex; align-items:center; gap:8px;">
              <button type="button" id="btn-prompter-copy" onclick="DIAMAX_BROADCAST.copiarMencionAlAire()" style="background:#FFFFFF; border:none; color:#0A0D14; font-size:12px; font-weight:900; padding:8px 16px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 10px rgba(255,255,255,0.3); transition:all 0.15s ease;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span id="lbl-prompter-copy">Copiar Mención (1-Clic)</span>
              </button>
            </div>
          </div>

          <p id="prompter-active-script" style="margin:0; font-size:16px; font-weight:800; color:#FFFFFF; line-height:1.55; letter-spacing:0.2px;">
            “¡Poder total en este batazo descomunal! Baterías Titán: la energía que nunca falla en el momento clutch.”
          </p>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; border-top:1px solid rgba(255,255,255,0.06); padding-top:8px;">
            <span style="font-size:10.5px; color:#64748B;">
              Lectura en vivo para narrador • Al copiar se contabiliza en las estadísticas oficiales del locutor en Firestore
            </span>
            <span id="prompter-read-count-badge" style="font-size:11px; color:#38BDF8; font-weight:800;">
              Menciones leídas en este juego: 0
            </span>
          </div>
        </div>
      </div>

      <!-- ===================================================================
           DIRECTORIO OFICIAL DE NARRADORES Y COMENTARISTAS (CARDS)
           =================================================================== -->
      <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <div style="font-size:13px; font-weight:900; color:#FFFFFF; text-transform:uppercase; letter-spacing:0.8px;">
          DIRECTORIO DE COMENTARISTAS OFICIALES (COLECCIÓN commentators)
        </div>
        <span id="commentators-count-badge" style="font-size:11px; color:#94A3B8;">3 narradores sincronizados</span>
      </div>

      <!-- GRID DE CARDS DE COMENTARISTAS -->
      <div id="commentators-cards-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:14px;">
        <!-- Se inyecta dinámicamente desde Firestore o fallback -->
      </div>

    </div>
`;

// Inserción en tab-cabina antes del cierre
const tabCabinaCloseTarget = `          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button type="button" onclick="copiarTextoCabina('cockpit-commercial-script')" style="background:#1E293B; border:none; color:#CBD5E1; font-size:11px; font-weight:800; padding:5px 10px; border-radius:6px; cursor:pointer;">
              Copiar Guion Radio
            </button>
            
          </div>
        </div>

      </div>
    </div>
  </div>`;

const tabCabinaReplacement = `          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button type="button" onclick="copiarTextoCabina('cockpit-commercial-script')" style="background:#1E293B; border:none; color:#CBD5E1; font-size:11px; font-weight:800; padding:5px 10px; border-radius:6px; cursor:pointer;">
              Copiar Guion Radio
            </button>
            
          </div>
        </div>

      </div>
    </div>

${cabinaSectionHTML}
  </div>`;

if (html.includes(tabCabinaCloseTarget)) {
  html = html.replace(tabCabinaCloseTarget, tabCabinaReplacement);
  console.log('✓ Sección section-commentators-db insertada en tab-cabina exitosamente.');
} else {
  console.warn('⚠️ No se encontró tabCabinaCloseTarget exacto, verificando...');
}

// =========================================================================
// 3. MÓDULO JAVASCRIPT: DIAMAX_BROADCAST Y SINCRONIZACIÓN FIRESTORE
// =========================================================================
const broadcastJsModule = `
  // =========================================================================
  // SISTEMA OFICIAL DE COMENTARISTAS Y PATROCINIOS DE CABINA (FASE 7)
  // CLOUD FIRESTORE: diamax-pro-f6f16
  // =========================================================================
  const DIAMAX_BROADCAST = (function() {
    const DEFAULT_COMMENTATORS = [
      {
        id: "comm_pedro_chavez",
        name: "Pedro Chávez",
        handle: "@pedro_chavez_narrador",
        mediaOutlet: "YouTube Live / Radio 101.5 FM",
        role: "NARRADOR_PLAY_BY_PLAY",
        channelUrl: "https://youtube.com/live/diamax_baseball",
        activeGameId: "game_master",
        catchphrase: "¡A lo profundo... y noooo... no regresará jamás! Cuadrangular descomunal",
        assignedSponsors: [
          { id: "spons_titan", brand: "Baterías Titán", trigger: "HR", text: "¡Poder total en este batazo descomunal! Baterías Titán: la energía que nunca falla en el momento clutch." },
          { id: "spons_ferreteria", brand: "Ferretería La Solución", trigger: "DP", text: "¡Doble matanza redonda y cerrojo perfecto! Ferretería La Solución: materiales y herramientas para cerrar cualquier entrada." }
        ],
        stats: { gamesBroadcasted: 14, pillsRead: 58 },
        status: "on_air",
        createdAt: "2026-11-03T10:00:00.000Z"
      },
      {
        id: "comm_ali_zapata",
        name: "Lic. Alí Zapata",
        handle: "@alizapata_coach",
        mediaOutlet: "DIAMAX Network TV & Streaming",
        role: "COMENTARISTA_SABERMETRICO",
        channelUrl: "https://youtube.com/live/diamax_network",
        activeGameId: "game_master",
        catchphrase: "La sabermetría y el semáforo médico dictan la jugada clave en el diamante.",
        assignedSponsors: [
          { id: "spons_diamante", brand: "Seguros Diamante Pro", trigger: "PITCH_CHANGE", text: "Llamada al bullpen y visita a la lomita. Este relevo seguro llega respaldado por Seguros Diamante Pro: tu póliza de confianza en cada jugada." },
          { id: "spons_medica_55", brand: "Clínica Especializada +55", trigger: "FATIGUE_75", text: "El brazo llega a 75 envíos y la fatiga exige precisión. Cuida tu salud y rendimiento con la Clínica Médica Deportiva 55." }
        ],
        stats: { gamesBroadcasted: 28, pillsRead: 92 },
        status: "standby",
        createdAt: "2026-11-03T10:00:00.000Z"
      },
      {
        id: "comm_beto_mendez",
        name: "Beto Méndez",
        handle: "@betomendez_radio",
        mediaOutlet: "Circuito Radial Deportivo 98.9 FM",
        role: "VOZ_COMERCIAL_Y_COLOR",
        channelUrl: "https://radio.diamaxpro.com/live",
        activeGameId: "game_master",
        catchphrase: "¡Sensación en las cuatro esquinas! Emoción pura en el diamante.",
        assignedSponsors: [
          { id: "spons_titan", brand: "Baterías Titán", trigger: "HR", text: "¡Poder total en este batazo descomunal! Baterías Titán: la energía que nunca falla en el momento clutch." },
          { id: "spons_diamante", brand: "Seguros Diamante Pro", trigger: "PITCH_CHANGE", text: "Llamada al bullpen y visita a la lomita. Este relevo seguro llega respaldado por Seguros Diamante Pro: tu póliza de confianza en cada jugada." }
        ],
        stats: { gamesBroadcasted: 9, pillsRead: 41 },
        status: "standby",
        createdAt: "2026-11-03T10:00:00.000Z"
      }
    ];

    const DEFAULT_SPONSORS = [
      {
        id: "spons_titan",
        brandName: "Baterías Titán",
        category: "Automotriz y Energía",
        triggerEvent: "HR",
        scriptText: "¡Poder total en este batazo descomunal! Baterías Titán: la energía que nunca falla en el momento clutch.",
        durationSeconds: 15,
        active: true
      },
      {
        id: "spons_diamante",
        brandName: "Seguros Diamante Pro",
        category: "Seguros & Finanzas",
        triggerEvent: "PITCH_CHANGE",
        scriptText: "Llamada al bullpen y visita a la lomita. Este relevo seguro llega respaldado por Seguros Diamante Pro: tu póliza de confianza en cada jugada.",
        durationSeconds: 15,
        active: true
      },
      {
        id: "spons_ferreteria",
        brandName: "Ferretería La Solución",
        category: "Ferretería & Construcción",
        triggerEvent: "DP",
        scriptText: "¡Doble matanza redonda y cerrojo perfecto! Ferretería La Solución: materiales y herramientas para cerrar cualquier entrada.",
        durationSeconds: 12,
        active: true
      },
      {
        id: "spons_medica_55",
        brandName: "Clínica Especializada +55",
        category: "Salud & Rendimiento",
        triggerEvent: "FATIGUE_75",
        scriptText: "El brazo llega a 75 envíos y la fatiga exige precisión. Cuida tu salud y rendimiento con la Clínica Médica Deportiva 55.",
        durationSeconds: 15,
        active: true
      }
    ];

    let cachedCommentators = [...DEFAULT_COMMENTATORS];
    let cachedSponsors = [...DEFAULT_SPONSORS];
    let activeCommentatorId = "comm_pedro_chavez";
    let activeSponsorTrigger = "HR";
    let pillsReadSession = 0;

    function init() {
      renderDirectory();
      conectarFirestore();
    }

    function conectarFirestore() {
      if (!window.firestoreDb) {
        setTimeout(conectarFirestore, 600);
        return;
      }
      try {
        // Suscripción reactiva a comentaristas
        window.firestoreDb.collection('commentators').onSnapshot(snap => {
          if (!snap.empty) {
            cachedCommentators = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderDirectory();
          }
        }, err => console.warn('[DIAMAX BROADCAST] Listener comentaristas offline:', err));

        // Suscripción reactiva a patrocinios
        window.firestoreDb.collection('broadcast_sponsors').onSnapshot(snap => {
          if (!snap.empty) {
            cachedSponsors = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          }
        }, err => console.warn('[DIAMAX BROADCAST] Listener patrocinios offline:', err));
      } catch(e) {
        console.warn('[DIAMAX BROADCAST] Error inicializando Firestore:', e);
      }
    }

    function renderDirectory() {
      const container = document.getElementById('commentators-cards-grid');
      const countBadge = document.getElementById('commentators-count-badge');
      if (!container) return;
      if (countBadge) countBadge.innerText = cachedCommentators.length + ' narradores sincronizados';

      const roleBadges = {
        'NARRADOR_PLAY_BY_PLAY': '<span style="background:rgba(14, 165, 233, 0.2); border:1px solid #0EA5E9; color:#7DD3FC; font-size:10px; font-weight:800; padding:2px 7px; border-radius:6px;">VOZ PRINCIPAL</span>',
        'COMENTARISTA_SABERMETRICO': '<span style="background:rgba(16, 185, 129, 0.2); border:1px solid #10B981; color:#6EE7B7; font-size:10px; font-weight:800; padding:2px 7px; border-radius:6px;">SABERMETRÍA</span>',
        'VOZ_COMERCIAL_Y_COLOR': '<span style="background:rgba(245, 158, 11, 0.2); border:1px solid #F59E0B; color:#FDE68A; font-size:10px; font-weight:800; padding:2px 7px; border-radius:6px;">COMERCIAL & COLOR</span>'
      };

      container.innerHTML = cachedCommentators.map(c => {
        const isOnAir = (c.status === 'on_air' || c.id === activeCommentatorId);
        const borderStyle = isOnAir ? 'border:1.8px solid #34D399; box-shadow:0 0 20px rgba(52, 211, 153, 0.25);' : 'border:1px solid #1E293B;';
        const statusBadge = isOnAir 
          ? '<span style="background:rgba(16,185,129,0.25); border:1px solid #10B981; color:#34D399; font-size:10px; font-weight:900; padding:3px 8px; border-radius:12px; display:inline-flex; align-items:center; gap:5px;"><span style="width:6px; height:6px; border-radius:50%; background:#10B981; box-shadow:0 0 6px #10B981;"></span>ON AIR</span>'
          : '<span style="background:rgba(100,116,139,0.2); border:1px solid #475569; color:#94A3B8; font-size:10px; font-weight:800; padding:3px 8px; border-radius:12px;">STANDBY</span>';

        return \`
          <div style="background:#060A12; \${borderStyle} border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; gap:12px; transition:all 0.2s ease;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg, #1E293B, #0F172A); border:1px solid rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; color:#FFFFFF;">
                    \${c.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <strong style="display:block; font-size:14px; color:#FFFFFF; font-weight:900;">\${c.name}</strong>
                    <span style="font-size:11px; color:#94A3B8;">\${c.handle || '@diamax'}</span>
                  </div>
                </div>
                \${statusBadge}
              </div>

              <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px; flex-wrap:wrap;">
                \${roleBadges[c.role] || ''}
                <span style="font-size:10.5px; color:#CBD5E1; background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">\${c.mediaOutlet}</span>
              </div>

              <div style="background:#020617; border-left:3px solid #D97706; padding:8px 10px; border-radius:0 8px 8px 0; margin-bottom:10px;">
                <p style="margin:0; font-size:11.5px; color:#F1F5F9; font-style:italic; line-height:1.4;">
                  "\${c.catchphrase || 'Emoción pura en el terreno de juego.'}"
                </p>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; font-size:10.5px; color:#64748B; border-top:1px solid rgba(255,255,255,0.05); padding-top:8px;">
                <span>🎙️ Partidos: <strong style="color:#FFF;">\${c.stats?.gamesBroadcasted || 0}</strong></span>
                <span>📢 Cuñas Leídas: <strong style="color:#FFF;">\${c.stats?.pillsRead || 0}</strong></span>
              </div>
            </div>

            <div style="display:flex; gap:8px;">
              \${c.channelUrl ? \`<a href="\${c.channelUrl}" target="_blank" rel="noopener" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#94A3B8; text-decoration:none; padding:7px 10px; border-radius:8px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>\` : ''}
              <button type="button" onclick="DIAMAX_BROADCAST.asignarNarradorActivo('\${c.id}', '\${c.name}')" style="flex:1; background:\${isOnAir ? '#10B981' : '#D97706'}; border:none; color:#FFFFFF; font-size:11.5px; font-weight:900; padding:8px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                <span>\${isOnAir ? 'Narrador Oficial ON AIR' : 'Asignar como Narrador'}</span>
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }

    function asignarNarradorActivo(id, name) {
      activeCommentatorId = id;
      try {
        localStorage.setItem('diamax_nombre_narrador', name);
        localStorage.setItem('diamax_active_commentator_id', id);
      } catch(e){}

      const cockpitEl = document.getElementById('cockpit-narrator-name');
      if (cockpitEl) cockpitEl.innerText = name;

      // Actualizar en Firestore si está conectado
      if (window.firestoreDb) {
        try {
          cachedCommentators.forEach(c => {
            const newStatus = (c.id === id) ? 'on_air' : 'standby';
            window.firestoreDb.collection('commentators').doc(c.id).set({ status: newStatus }, { merge: true });
          });
        } catch(e) {
          console.warn('[DIAMAX BROADCAST] Error actualizando status:', e);
        }
      }
      renderDirectory();
      if (typeof mostrarToast === 'function') mostrarToast('🎙️ Narrador activo en cabina: ' + name);
    }

    function triggerSponsor(triggerEvent) {
      activeSponsorTrigger = triggerEvent;
      const sponsor = cachedSponsors.find(s => s.triggerEvent === triggerEvent && s.active !== false) 
        || DEFAULT_SPONSORS.find(s => s.triggerEvent === triggerEvent) 
        || DEFAULT_SPONSORS[0];

      const triggerNames = {
        'HR': '⚡ JONRÓN (HR) DETONADO',
        'DP': '⚾ DOBLE PLAY (DP) DETONADO',
        'PITCH_CHANGE': '🔄 CAMBIO DE PITCHER DETONADO',
        'FATIGUE_75': '🚨 ALERTA 75 PITCHEOS DETONADA'
      };

      const badgeEl = document.getElementById('prompter-trigger-badge');
      const brandEl = document.getElementById('prompter-brand-title');
      const catEl = document.getElementById('prompter-category-badge');
      const scriptEl = document.getElementById('prompter-active-script');
      const boxEl = document.getElementById('prompter-active-box');

      if (badgeEl) badgeEl.innerText = triggerNames[triggerEvent] || triggerEvent;
      if (brandEl) brandEl.innerText = sponsor.brandName;
      if (catEl) catEl.innerText = \`(\${sponsor.category} • \${sponsor.durationSeconds || 15}s)\`;
      if (scriptEl) scriptEl.innerText = \`“\${sponsor.scriptText}”\`;

      // Efecto visual de destello en cabina
      if (boxEl) {
        boxEl.style.borderColor = '#F59E0B';
        boxEl.style.boxShadow = '0 0 35px rgba(245, 158, 11, 0.55)';
        setTimeout(() => {
          boxEl.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.25)';
        }, 1200);
      }

      // También sincronizar con el teleprompter superior existente
      const topTitle = document.getElementById('cockpit-sponsor-title');
      const topText = document.getElementById('cockpit-sponsor-text');
      if (topTitle) topTitle.innerText = \`PATROCINIO EN VIVO: \${sponsor.brandName}\`;
      if (topText) topText.innerText = \`“\${sponsor.scriptText}”\`;

      if (typeof DIAMAX_AUDIO !== 'undefined' && typeof DIAMAX_AUDIO.playClick === 'function') {
        DIAMAX_AUDIO.playClick();
      }
      return sponsor;
    }

    function copiarMencionAlAire() {
      const scriptEl = document.getElementById('prompter-active-script');
      if (!scriptEl) return;
      const text = scriptEl.innerText.replace(/[“”"]/g, '').trim();

      navigator.clipboard.writeText(text).then(() => {
        pillsReadSession++;
        const badge = document.getElementById('prompter-read-count-badge');
        if (badge) badge.innerText = \`Menciones leídas en este juego: \${pillsReadSession}\`;

        const btnCopy = document.getElementById('btn-prompter-copy');
        const lblCopy = document.getElementById('lbl-prompter-copy');
        if (btnCopy) btnCopy.style.background = '#10B981';
        if (btnCopy) btnCopy.style.color = '#FFFFFF';
        if (lblCopy) lblCopy.innerText = '¡Copiado al Aire! ✓';

        setTimeout(() => {
          if (btnCopy) btnCopy.style.background = '#FFFFFF';
          if (btnCopy) btnCopy.style.color = '#0A0D14';
          if (lblCopy) lblCopy.innerText = 'Copiar Mención (1-Clic)';
        }, 2000);

        // Incrementar en Firestore para el comentarista activo
        if (window.firestoreDb && activeCommentatorId) {
          try {
            const inc = (typeof firebase !== 'undefined' && firebase.firestore) 
              ? firebase.firestore.FieldValue.increment(1) 
              : 1;
            window.firestoreDb.collection('commentators').doc(activeCommentatorId).update({
              'stats.pillsRead': inc
            }).catch(()=>{});
          } catch(e){}
        }

        if (typeof mostrarToast === 'function') mostrarToast('🎙️ Cuña copiada al portapapeles. ¡Al aire!');
      }).catch(err => {
        console.warn('Error al copiar al portapapeles:', err);
      });
    }

    async function guardarNuevoNarrador(e) {
      e.preventDefault();
      const name = document.getElementById('comm-form-name')?.value?.trim();
      const handle = document.getElementById('comm-form-handle')?.value?.trim();
      const media = document.getElementById('comm-form-media')?.value?.trim();
      const role = document.getElementById('comm-form-role')?.value;
      const url = document.getElementById('comm-form-url')?.value?.trim() || '';
      const phrase = document.getElementById('comm-form-catchphrase')?.value?.trim();

      if (!name || !handle) return;
      const id = 'comm_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_');

      const nuevo = {
        id,
        name,
        handle,
        mediaOutlet: media,
        role,
        channelUrl: url,
        activeGameId: 'game_master',
        catchphrase: phrase,
        assignedSponsors: [],
        stats: { gamesBroadcasted: 1, pillsRead: 0 },
        status: 'standby',
        createdAt: new Date().toISOString()
      };

      cachedCommentators.push(nuevo);
      renderDirectory();
      document.getElementById('form-nuevo-narrador').style.display = 'none';

      if (window.firestoreDb) {
        try {
          await window.firestoreDb.collection('commentators').doc(id).set(nuevo, { merge: true });
          if (typeof mostrarToast === 'function') mostrarToast('✓ Narrador guardado en Cloud Firestore: ' + name);
        } catch(err) {
          console.warn('[DIAMAX BROADCAST] Error guardando en Firestore:', err);
        }
      }
    }

    async function guardarNuevoPatrocinio(e) {
      e.preventDefault();
      const brand = document.getElementById('spons-form-brand')?.value?.trim();
      const trigger = document.getElementById('spons-form-trigger')?.value;
      const category = document.getElementById('spons-form-category')?.value?.trim();
      const duration = parseInt(document.getElementById('spons-form-duration')?.value, 10) || 15;
      const script = document.getElementById('spons-form-script')?.value?.trim();

      if (!brand || !script) return;
      const id = 'spons_' + brand.toLowerCase().replace(/[^a-z0-9]/g, '_');

      const nuevo = {
        id,
        brandName: brand,
        category,
        triggerEvent: trigger,
        scriptText: script,
        durationSeconds: duration,
        active: true
      };

      cachedSponsors.push(nuevo);
      document.getElementById('form-nuevo-patrocinio').style.display = 'none';

      if (window.firestoreDb) {
        try {
          await window.firestoreDb.collection('broadcast_sponsors').doc(id).set(nuevo, { merge: true });
          if (typeof mostrarToast === 'function') mostrarToast('✓ Patrocinio guardado en Cloud Firestore: ' + brand);
        } catch(err) {
          console.warn('[DIAMAX BROADCAST] Error guardando patrocinio:', err);
        }
      }
    }

    function recargarFirestore() {
      if (window.firestoreDb) {
        window.firestoreDb.collection('commentators').get().then(snap => {
          if (!snap.empty) {
            cachedCommentators = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderDirectory();
            if (typeof mostrarToast === 'function') mostrarToast('✓ ' + cachedCommentators.length + ' comentaristas recargados desde Firestore');
          }
        });
        window.firestoreDb.collection('broadcast_sponsors').get().then(snap => {
          if (!snap.empty) {
            cachedSponsors = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          }
        });
      }
    }

    return {
      init,
      triggerSponsor,
      copiarMencionAlAire,
      asignarNarradorActivo,
      guardarNuevoNarrador,
      guardarNuevoPatrocinio,
      recargarFirestore,
      getCommentators: () => cachedCommentators,
      getSponsors: () => cachedSponsors
    };
  })();

  window.DIAMAX_BROADCAST = DIAMAX_BROADCAST;
  window.addEventListener('DOMContentLoaded', () => {
    DIAMAX_BROADCAST.init();
  });
`;

// Insertar DIAMAX_BROADCAST justo antes del final del script de Firebase
const rtCloseTarget = `    // 6. Suscripción en Tiempo Real para Fanáticos y Cabina (Soluciona el stub vacío)
    subscribeToGame: (gid, callback) => {
      if (!window.firestoreDb || !gid) return () => {};
      return window.firestoreDb.collection('games').doc(gid)
        .onSnapshot((doc) => {
          if (doc.exists && typeof callback === 'function') {
            callback(doc.data());
          }
        }, (err) => {
          console.warn('[DIAMAX FIREBASE] Error en subscripción reactiva:', err);
        });
    }
  };

  window.addEventListener('DOMContentLoaded', function() {
    initDiamaxFirebase();
  });
  </script>`;

const rtCloseReplacement = `    // 6. Suscripción en Tiempo Real para Fanáticos y Cabina (Soluciona el stub vacío)
    subscribeToGame: (gid, callback) => {
      if (!window.firestoreDb || !gid) return () => {};
      return window.firestoreDb.collection('games').doc(gid)
        .onSnapshot((doc) => {
          if (doc.exists && typeof callback === 'function') {
            callback(doc.data());
          }
        }, (err) => {
          console.warn('[DIAMAX FIREBASE] Error en subscripción reactiva:', err);
        });
    }
  };

${broadcastJsModule}

  window.addEventListener('DOMContentLoaded', function() {
    initDiamaxFirebase();
  });
  </script>`;

if (html.includes(rtCloseTarget)) {
  html = html.replace(rtCloseTarget, rtCloseReplacement);
  console.log('✓ Módulo DIAMAX_BROADCAST inyectado en script principal exitosamente.');
} else {
  console.warn('⚠️ No se encontró rtCloseTarget exacto, verificando...');
}

// =========================================================================
// 4. ALIASES EN switchTab
// =========================================================================
const switchTabAliasesTarget = `  const aliases = {
    'anotador': 'envivo',
    'dugout': 'envivo',
    'cabina': 'cabina',
    'radio': 'cabina',
    'tv': 'cabina',
    'media': 'cabina',
    'cockpit': 'cabina',`;

const switchTabAliasesReplacement = `  const aliases = {
    'anotador': 'envivo',
    'dugout': 'envivo',
    'cabina': 'cabina',
    'comentaristas': 'cabina',
    'base-comentaristas': 'cabina',
    'narradores': 'cabina',
    'sponsors': 'cabina',
    'radio': 'cabina',
    'tv': 'cabina',
    'media': 'cabina',
    'cockpit': 'cabina',`;

if (html.includes(switchTabAliasesTarget)) {
  html = html.replace(switchTabAliasesTarget, switchTabAliasesReplacement);
  console.log('✓ Aliases de switchTab actualizados para comentaristas.');
}

// =========================================================================
// 5. DETONAR PATROCINIO DESDE registrarJugadaLive (HR & DP)
// =========================================================================
const livePlayHrTarget = `  if (action === '1B' || action === '2B' || action === '3B' || action === 'HR' || action === 'GRD') {
    cmdType = 'RECORD_HIT';
    const hitCode = action === 'GRD' ? '2B' : action;
    payload = { resultCode: hitCode, isGroundRule: action === 'GRD', batterId: pId, description: action === 'GRD' ? \`Doble por Regla de Terreno (GRD) de \${pName}\` : \`Hit \${action} de \${pName}\`, pitcherName };`;

const livePlayHrReplacement = `  if (action === '1B' || action === '2B' || action === '3B' || action === 'HR' || action === 'GRD') {
    cmdType = 'RECORD_HIT';
    const hitCode = action === 'GRD' ? '2B' : action;
    payload = { resultCode: hitCode, isGroundRule: action === 'GRD', batterId: pId, description: action === 'GRD' ? \`Doble por Regla de Terreno (GRD) de \${pName}\` : \`Hit \${action} de \${pName}\`, pitcherName };
    if (action === 'HR' && typeof DIAMAX_BROADCAST !== 'undefined' && typeof DIAMAX_BROADCAST.triggerSponsor === 'function') {
      DIAMAX_BROADCAST.triggerSponsor('HR');
    }`;

if (html.includes(livePlayHrTarget)) {
  html = html.replace(livePlayHrTarget, livePlayHrReplacement);
  console.log('✓ Disparador automático de HR vinculado a DIAMAX_BROADCAST.');
}

const livePlayDpTarget = `  } else if (action === '6-4-3 DP' || action === '4-6-3 DP' || action === '5-4-3 DP' || action === 'DP') {`;
const livePlayDpReplacement = `  } else if (action === '6-4-3 DP' || action === '4-6-3 DP' || action === '5-4-3 DP' || action === 'DP') {
    if (typeof DIAMAX_BROADCAST !== 'undefined' && typeof DIAMAX_BROADCAST.triggerSponsor === 'function') {
      DIAMAX_BROADCAST.triggerSponsor('DP');
    }`;

if (html.includes(livePlayDpTarget)) {
  html = html.replace(livePlayDpTarget, livePlayDpReplacement);
  console.log('✓ Disparador automático de DP vinculado a DIAMAX_BROADCAST.');
}

// Guardar cambios
fs.writeFileSync(indexPath, html, 'utf-8');
console.log('=== INTEGRACIÓN DE FASE 7 EN index.html COMPLETADA CON ÉXITO ===');
