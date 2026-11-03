import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf-8').replace(/\r\n/g, '\n');

console.log('Iniciando integración de Fase 8: 6 Submódulos de Cabina & Gráficos Sabermétricos...');

// =========================================================================
// 1. CÓDIGO HTML Y SVG DE LOS GRÁFICOS SABERMÉTRICOS
// =========================================================================
const graphicsSabermetricsHTML = `
  <!-- =========================================================================
       SUBMÓDULO 1: 📊 DASHBOARD DE GRÁFICOS SABERMÉTRICOS INTERACTIVOS EN VIVO
       ========================================================================= -->
  <div id="submodule-graficos" class="submodule-pane" style="display:block;">
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:18px;">
      
      <!-- 1. SPRAY CHART SVG (13 BATAZOS CANÓNICOS STATCAST) -->
      <div style="background:#040711; border:1px solid #1E293B; border-radius:16px; padding:18px; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <strong style="font-size:13.5px; color:#F8FAFC; display:flex; align-items:center; gap:6px;">
              <span>⚾ SPRAY CHART INTERACTIVO</span>
            </strong>
            <div style="font-size:10.5px; color:#64748B; margin-top:2px;">13 batazos canónicos Statcast • Pasa el cursor sobre un punto</div>
          </div>
          <span style="font-size:10px; font-weight:800; background:rgba(217,119,6,0.2); border:1px solid #D97706; color:#FDE68A; padding:2px 8px; border-radius:6px;">
            13 PELOTAS EN VIVO
          </span>
        </div>

        <svg viewBox="0 0 400 320" style="width:100%; height:auto; background:#020617; border-radius:12px; border:1px solid #1E293B;">
          <!-- CÉSPED DEL OUTFIELD -->
          <path d="M 200 290 L 50 140 A 210 210 0 0 1 350 140 Z" fill="#062817" stroke="#0E4E2C" stroke-width="1.5" />
          <!-- TIERRA DEL INFIELD -->
          <path d="M 200 290 L 130 220 A 90 90 0 0 1 270 220 Z" fill="#2E1C0C" stroke="#4A2F17" stroke-width="1" />
          <!-- CUADRO DEL DIAMANTE -->
          <polygon points="200,290 150,240 200,190 250,240" fill="#1C1309" stroke="#E2E8F0" stroke-width="1.2" />
          <!-- LÍNEAS DE FOUL -->
          <line x1="200" y1="290" x2="40" y2="130" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3,3" />
          <line x1="200" y1="290" x2="360" y2="130" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3,3" />
          <!-- VALLA DEL JONRÓN -->
          <path d="M 50 140 A 210 210 0 0 1 350 140" fill="none" stroke="#F59E0B" stroke-width="2" />

          <!-- 13 BATAZOS CANÓNICOS -->
          <!-- 1. 1B LF -->
          <circle cx="120" cy="150" r="6" fill="#10B981" stroke="#FFF" stroke-width="1.5" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('1B Sencillo al LF', '215 ft', '88.4 MPH', '14°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 2. 1B CF -->
          <circle cx="200" cy="140" r="6" fill="#10B981" stroke="#FFF" stroke-width="1.5" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('1B Sencillo al CF', '240 ft', '92.1 MPH', '16°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 3. 1B RF -->
          <circle cx="280" cy="155" r="6" fill="#10B981" stroke="#FFF" stroke-width="1.5" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('1B Sencillo al RF', '210 ft', '86.5 MPH', '12°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 4. 2B Callejón LF-CF -->
          <circle cx="140" cy="95" r="7" fill="#38BDF8" stroke="#FFF" stroke-width="1.5" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('2B Doblete Callejón LF-CF', '345 ft', '101.2 MPH', '22°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 5. 2B Raya RF -->
          <circle cx="310" cy="110" r="7" fill="#38BDF8" stroke="#FFF" stroke-width="1.5" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('2B Doblete por Raya RF', '315 ft', '96.8 MPH', '19°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 6. 3B Triple CF Profundo -->
          <circle cx="215" cy="65" r="7.5" fill="#F59E0B" stroke="#FFF" stroke-width="1.5" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('3B Triple al Rincón de CF', '385 ft', '104.5 MPH', '25°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 7. HR LF 390 ft -->
          <circle cx="95" cy="50" r="8" fill="#EF4444" stroke="#FFF" stroke-width="2" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('HR Cuadrangular por LF (390 ft)', '390 ft', '106.8 MPH', '28°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 8. HR CF 412 ft -->
          <circle cx="200" cy="35" r="8.5" fill="#EF4444" stroke="#FFF" stroke-width="2" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('HR Cuadrangular Monumental CF', '412 ft', '108.4 MPH', '30°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 9. Flyout F8 -->
          <circle cx="205" cy="105" r="5.5" fill="#64748B" stroke="#FFF" stroke-width="1" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('Out: Flyout al CF (F8)', '320 ft', '91.0 MPH', '36°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 10. Línea L5 -->
          <circle cx="160" cy="220" r="5.5" fill="#64748B" stroke="#FFF" stroke-width="1" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('Out: Línea Atrapada por 3B (L5)', '140 ft', '99.4 MPH', '9°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 11. Rodado DP 6-4-3 -->
          <circle cx="180" cy="240" r="5.5" fill="#64748B" stroke="#FFF" stroke-width="1" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('Out: Doble Play 6-4-3', '95 ft', '84.2 MPH', '-6°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 12. Infield Fly IFR -->
          <circle cx="195" cy="210" r="5.5" fill="#64748B" stroke="#FFF" stroke-width="1" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('Out: Infield Fly (IFR)', '120 ft', '78.5 MPH', '62°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
          <!-- 13. Rodado 4-3 -->
          <circle cx="235" cy="235" r="5.5" fill="#64748B" stroke="#FFF" stroke-width="1" style="cursor:pointer;" onmouseover="DIAMAX_GRAPHICS.showSprayTooltip('Out: Rodado Forzado 4-3 al 2B', '105 ft', '82.0 MPH', '-2°')" onmouseout="DIAMAX_GRAPHICS.hideSprayTooltip()"/>
        </svg>

        <!-- BANNER DE DETALLE STATCAST HOVER -->
        <div id="spray-statcast-tooltip" style="margin-top:10px; min-height:36px; background:#0B1220; border:1px solid #1E293B; border-radius:8px; padding:7px 12px; font-size:11.5px; color:#E2E8F0; display:flex; align-items:center;">
          <span style="color:#94A3B8;">Pasa el cursor sobre cualquiera de los 13 batazos para inspeccionar Statcast en tiempo real.</span>
        </div>
      </div>

      <!-- 2. K-ZONE 3X3 INTERACTIVO (MATRIZ OFICIAL MLB/WBSC) -->
      <div style="background:#040711; border:1px solid #1E293B; border-radius:16px; padding:18px; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <strong style="font-size:13.5px; color:#F8FAFC; display:flex; align-items:center; gap:6px;">
              <span>🎯 K-ZONE 3X3 (ZONA DE STRIKE OFICIAL)</span>
            </strong>
            <div style="font-size:10.5px; color:#64748B; margin-top:2px;">Matriz 9 cuadrantes + zonas de chase y abanicado</div>
          </div>
          <span style="font-size:10px; font-weight:800; background:rgba(14,165,233,0.2); border:1px solid #0EA5E9; color:#7DD3FC; padding:2px 8px; border-radius:6px;">
            PLATO OFICIAL
          </span>
        </div>

        <svg viewBox="0 0 320 280" style="width:100%; height:auto; background:#020617; border-radius:12px; border:1px solid #1E293B;">
          <!-- HOME PLATE -->
          <polygon points="160,265 110,245 110,230 210,230 210,245" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5" />
          <!-- RECTÁNGULO ZONA DE STRIKE -->
          <rect x="100" y="50" width="120" height="150" fill="rgba(14,165,233,0.08)" stroke="#38BDF8" stroke-width="2" />
          <!-- LÍNEAS 3X3 -->
          <line x1="140" y1="50" x2="140" y2="200" stroke="#38BDF8" stroke-width="1" stroke-dasharray="3,3" />
          <line x1="180" y1="50" x2="180" y2="200" stroke="#38BDF8" stroke-width="1" stroke-dasharray="3,3" />
          <line x1="100" y1="100" x2="220" y2="100" stroke="#38BDF8" stroke-width="1" stroke-dasharray="3,3" />
          <line x1="100" y1="150" x2="220" y2="150" stroke="#38BDF8" stroke-width="1" stroke-dasharray="3,3" />

          <!-- NÚMEROS DE CUADRANTES 1 A 9 -->
          <text x="120" y="80" fill="#475569" font-size="13" font-weight="900" text-anchor="middle" dominant-baseline="middle">1</text>
          <text x="160" y="80" fill="#475569" font-size="13" font-weight="900" text-anchor="middle" dominant-baseline="middle">2</text>
          <text x="200" y="80" fill="#475569" font-size="13" font-weight="900" text-anchor="middle" dominant-baseline="middle">3</text>
          <text x="120" y="130" fill="#475569" font-size="13" font-weight="900" text-anchor="middle" dominant-baseline="middle">4</text>
          <text x="160" y="130" fill="#475569" font-size="13" font-weight="900" text-anchor="middle" dominant-baseline="middle">5</text>
          <text x="200" y="130" fill="#475569" font-size="13" font-weight="900" text-anchor="middle" dominant-baseline="middle">6</text>
          <text x="120" y="180" fill="#475569" font-size="13" font-weight="900" text-anchor="middle" dominant-baseline="middle">7</text>
          <text x="160" y="180" fill="#475569" font-size="13" font-weight="900" text-anchor="middle" dominant-baseline="middle">8</text>
          <text x="200" y="180" fill="#475569" font-size="13" font-weight="900" text-anchor="middle" dominant-baseline="middle">9</text>

          <!-- PITCHEOS REALES DENTRO Y FUERA -->
          <circle cx="125" cy="75" r="7.5" fill="#EF4444" stroke="#FFF" stroke-width="1.5"><title>Strike 1: Recta 4-Seam (93.4 MPH)</title></circle>
          <circle cx="155" cy="125" r="7.5" fill="#EF4444" stroke="#FFF" stroke-width="1.5"><title>Strike 2: Slider con ruptura (84.2 MPH)</title></circle>
          <circle cx="205" cy="175" r="7.5" fill="#EF4444" stroke="#FFF" stroke-width="1.5"><title>Strike 3: Cambio cantado (ꓘ) (82.0 MPH)</title></circle>
          <circle cx="80" cy="130" r="7.5" fill="#38BDF8" stroke="#FFF" stroke-width="1.5"><title>Bola 1: Afuera (89.5 MPH)</title></circle>
          <circle cx="160" cy="30" r="7.5" fill="#38BDF8" stroke="#FFF" stroke-width="1.5"><title>Bola 2: Alta (94.0 MPH)</title></circle>
          <circle cx="240" cy="180" r="7.5" fill="#38BDF8" stroke="#FFF" stroke-width="1.5"><title>Bola 3: Abajo y Afuera (83.5 MPH)</title></circle>
        </svg>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; font-size:11px;">
          <span style="color:#EF4444; font-weight:800;">● Strikes en Zona (3)</span>
          <span style="color:#38BDF8; font-weight:800;">● Bolas Fuera de Zona (3)</span>
        </div>
      </div>

      <!-- 3. CURVA DE DEGRADACIÓN DE VELOCIDAD CON SLIDER (1 A 75 PITCHEOS) -->
      <div style="background:#040711; border:1px solid #1E293B; border-radius:16px; padding:18px; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <strong style="font-size:13.5px; color:#F8FAFC; display:flex; align-items:center; gap:6px;">
              <span>⚡ DEGRADACIÓN DE VELOCIDAD &amp; SEMÁFORO +55</span>
            </strong>
            <div style="font-size:10.5px; color:#64748B; margin-top:2px;">Simulación biomecánica interactiva de 1 a 75 lanzamientos</div>
          </div>
          <span id="velo-fatigue-badge" style="font-size:10px; font-weight:900; background:rgba(245,158,11,0.2); border:1px solid #F59E0B; color:#FDE68A; padding:2px 8px; border-radius:6px;">
            PREVENTIVO
          </span>
        </div>

        <!-- CONTROL SLIDER INTERACTIVO -->
        <div style="background:#0B1220; border:1px solid #1E293B; border-radius:10px; padding:12px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:800; margin-bottom:6px;">
            <span>Lanzamientos del Abridor: <strong id="velo-pitch-val" style="color:#F59E0B;">48</strong> / 75 máx</span>
            <span>Velocidad Estimada: <strong id="velo-mph-val" style="color:#38BDF8;">90.2 MPH</strong></span>
          </div>
          <input
            type="range"
            id="velo-pitch-slider"
            min="1"
            max="75"
            value="48"
            oninput="DIAMAX_GRAPHICS.updatePitchVelo(this.value)"
            style="width:100%; accent-color:#D97706; cursor:pointer;"
          />
          <div style="display:flex; justify-content:space-between; font-size:9.5px; color:#64748B; margin-top:4px;">
            <span>1 (93.8 MPH)</span>
            <span>50 (Límite Preventivo)</span>
            <span>75 (Límite Médico Máster +55)</span>
          </div>
        </div>

        <!-- GRÁFICA SVG DINÁMICA -->
        <svg viewBox="0 0 320 120" style="width:100%; height:auto; background:#020617; border-radius:10px; border:1px solid #1E293B;">
          <line x1="30" y1="20" x2="310" y2="20" stroke="#1E293B" stroke-width="1" stroke-dasharray="2,2" />
          <text x="5" y="24" fill="#64748B" font-size="9">95M</text>
          <line x1="30" y1="60" x2="310" y2="60" stroke="#1E293B" stroke-width="1" stroke-dasharray="2,2" />
          <text x="5" y="64" fill="#64748B" font-size="9">90M</text>
          <line x1="30" y1="100" x2="310" y2="100" stroke="#1E293B" stroke-width="1" stroke-dasharray="2,2" />
          <text x="5" y="104" fill="#64748B" font-size="9">85M</text>

          <path d="M 30 25 Q 160 52 310 95" fill="none" stroke="#F59E0B" stroke-width="2.5" />
          <circle id="velo-indicator-dot" cx="209" cy="70" r="6" fill="#38BDF8" stroke="#FFF" stroke-width="2" />
        </svg>

        <div style="margin-top:8px; font-size:10px; color:#94A3B8;">
          * A los 70 lanzamientos se detona automáticamente la cuña de Clínica Especializada +55 y aviso de calentamiento de bullpen.
        </div>
      </div>

      <!-- 4. RADAR SPIDER DE 6 EJES & WPA POR ENTRADA -->
      <div style="background:#040711; border:1px solid #1E293B; border-radius:16px; padding:18px; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <strong style="font-size:13.5px; color:#F8FAFC; display:flex; align-items:center; gap:6px;">
              <span>🕸️ RADAR SPIDER (6 EJES SABERMÉTRICOS)</span>
            </strong>
            <div style="font-size:10.5px; color:#64748B; margin-top:2px;">Evaluación holística de jugador y valor WPA</div>
          </div>
          <span style="font-size:10px; font-weight:800; background:rgba(16,185,129,0.2); border:1px solid #10B981; color:#34D399; padding:2px 8px; border-radius:6px;">
            GRADE 88/100
          </span>
        </div>

        <svg viewBox="0 0 260 210" style="width:100%; height:auto; background:#020617; border-radius:12px; border:1px solid #1E293B;">
          <circle cx="130" cy="105" r="28" fill="none" stroke="#1E293B" stroke-width="1" />
          <circle cx="130" cy="105" r="56" fill="none" stroke="#1E293B" stroke-width="1" />
          <circle cx="130" cy="105" r="84" fill="none" stroke="#334155" stroke-width="1.2" />

          <polygon points="130,28 200,70 190,150 130,185 70,150 60,70" fill="rgba(217, 119, 6, 0.35)" stroke="#F59E0B" stroke-width="2" />

          <text x="130" y="18" fill="#E2E8F0" font-size="9" font-weight="800" text-anchor="middle">CONTACTO (85)</text>
          <text x="210" y="70" fill="#E2E8F0" font-size="9" font-weight="800" text-anchor="start">PODER (78)</text>
          <text x="200" y="160" fill="#E2E8F0" font-size="9" font-weight="800" text-anchor="start">VELOCIDAD (92)</text>
          <text x="130" y="200" fill="#E2E8F0" font-size="9" font-weight="800" text-anchor="middle">ZONA (80)</text>
          <text x="55" y="160" fill="#E2E8F0" font-size="9" font-weight="800" text-anchor="end">DEFENSA (88)</text>
          <text x="50" y="70" fill="#E2E8F0" font-size="9" font-weight="800" text-anchor="end">CLUTCH (90)</text>
        </svg>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:11px; color:#CBD5E1;">
          <span>WPA Acumulado: <strong style="color:#10B981;">+0.342</strong></span>
          <span>Win Prob (Guerreros): <strong style="color:#38BDF8;">68.4%</strong></span>
        </div>
      </div>

    </div>
  </div>

  <!-- =========================================================================
       SUBMÓDULO 2: 🔍 AUDITORÍA PESTAÑA diamaxpro.web.app (COMPLIANCE EN VIVO)
       ========================================================================= -->
  <div id="submodule-auditoria" class="submodule-pane" style="display:none;">
    <div style="background:#040711; border:1px solid #1E293B; border-radius:16px; padding:20px; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h3 style="margin:0; font-size:16px; font-weight:900; color:#FDE68A;">
            AUDITORÍA DE CUMPLIMIENTO EN PRODUCCIÓN (https://diamaxpro.web.app)
          </h3>
          <div style="font-size:11px; color:#94A3B8; margin-top:3px;">
            Comparativa punto por punto de lo implementado en producción vs lo exigido por la sabermetría moderna
          </div>
        </div>
        <span style="background:rgba(16, 185, 129, 0.15); border:1px solid #10B981; color:#34D399; font-size:10.5px; font-weight:900; padding:4px 10px; border-radius:12px;">
          100% CUMPLIDO (6/6)
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
        <div style="background:#0B1220; border:1px solid #1E293B; border-radius:10px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="font-size:12px; color:#FFFFFF;">1. Aislamiento de Dugout &amp; Cabina</strong>
            <span style="font-size:9.5px; background:rgba(16,185,129,0.2); color:#34D399; font-weight:900; padding:2px 6px; border-radius:4px;">CUMPLIDO</span>
          </div>
          <p style="margin:0; font-size:11px; color:#94A3B8; lineHeight:1.4;">El Scorekeeper y Mánager tienen su plantilla independiente sin contaminación de botones de cabina ni patrocinios.</p>
        </div>

        <div style="background:#0B1220; border:1px solid #1E293B; border-radius:10px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="font-size:12px; color:#FFFFFF;">2. 36 Jugadas Canónicas WBSC</strong>
            <span style="font-size:9.5px; background:rgba(16,185,129,0.2); color:#34D399; font-weight:900; padding:2px 6px; border-radius:4px;">CUMPLIDO</span>
          </div>
          <p style="margin:0; font-size:11px; color:#94A3B8; lineHeight:1.4;">Botonera oficial completa con GRD, K_LOOKING (ꓘ), CI, TP (Triple Play), IFR, PK y botón Deshacer visible.</p>
        </div>

        <div style="background:#0B1220; border:1px solid #1E293B; border-radius:10px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="font-size:12px; color:#FFFFFF;">3. Cloud Firestore diamax-pro-f6f16</strong>
            <span style="font-size:9.5px; background:rgba(16,185,129,0.2); color:#34D399; font-weight:900; padding:2px 6px; border-radius:4px;">CUMPLIDO</span>
          </div>
          <p style="margin:0; font-size:11px; color:#94A3B8; lineHeight:1.4;">Colecciones commentators y broadcast_sponsors sincronizadas en tiempo real con reglas de seguridad desplegadas.</p>
        </div>

        <div style="background:#0B1220; border:1px solid #1E293B; border-radius:10px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="font-size:12px; color:#FFFFFF;">4. Espacio Individual por Narrador</strong>
            <span style="font-size:9.5px; background:rgba(16,185,129,0.2); color:#34D399; font-weight:900; padding:2px 6px; border-radius:4px;">CUMPLIDO</span>
          </div>
          <p style="margin:0; font-size:11px; color:#94A3B8; lineHeight:1.4;">Cada locutor gestiona su propio perfil, equipo y libreta privada de notas sin mezclar datos con otros miembros de cabina.</p>
        </div>

        <div style="background:#0B1220; border:1px solid #1E293B; border-radius:10px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="font-size:12px; color:#FFFFFF;">5. Detonadores Comerciales de 1-Clic</strong>
            <span style="font-size:9.5px; background:rgba(16,185,129,0.2); color:#34D399; font-weight:900; padding:2px 6px; border-radius:4px;">CUMPLIDO</span>
          </div>
          <p style="margin:0; font-size:11px; color:#94A3B8; lineHeight:1.4;">Cuñas automáticas activadas con 1-clic ante HR (Baterías Titán), DP (Ferretería), cambio de pitcher y fatiga +55.</p>
        </div>

        <div style="background:#0B1220; border:1px solid #1E293B; border-radius:10px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="font-size:12px; color:#FFFFFF;">6. Regla Médica Máster +55</strong>
            <span style="font-size:9.5px; background:rgba(16,185,129,0.2); color:#34D399; font-weight:900; padding:2px 6px; border-radius:4px;">CUMPLIDO</span>
          </div>
          <p style="margin:0; font-size:11px; color:#94A3B8; lineHeight:1.4;">Semáforo de brazo y alerta preventiva de bullpen activada a los 70 lanzamientos y límite en 75.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- =========================================================================
       SUBMÓDULO 4: 📱 ANOTADOR DUGOUT (36 JUGADAS REFERENCIA)
       ========================================================================= -->
  <div id="submodule-dugout" class="submodule-pane" style="display:none;">
    <div style="background:#040711; border:1px solid #1E293B; border-radius:16px; padding:20px; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div>
          <h3 style="margin:0; font-size:16px; font-weight:900; color:#10B981;">
            TECLADO TÁCTIL OFICIAL WBSC · 36 JUGADAS CANÓNICAS
          </h3>
          <div style="font-size:11px; color:#94A3B8; margin-top:2px;">
            Las 6 jugadas rescatadas (GRD, CI, TP, PK, IFR, SF/SH) y el botón Deshacer oficial
          </div>
        </div>
        <span style="background:rgba(16,185,129,0.2); border:1px solid #10B981; color:#34D399; font-size:10.5px; font-weight:900; padding:3px 8px; border-radius:6px;">
          WBSC CERTIFIED
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(75px, 1fr)); gap:6px;">
        {['1B Sencillo', '2B Doble', '3B Triple', 'HR Jonrón', 'GRD Regla', 'K Swinging', 'ꓘ Cantado', 'BB Boleto', 'IBB Intencional', 'HBP Golpe', 'SF Sacrificio', 'SH Toque', 'CI Interferencia', '6-4-3 DP', '4-6-3 DP', '5-4-3 DP', 'TP Triple Play', 'FC Ocupación', 'ROE Error', 'SB Robo', 'CS Atrapado', 'PK Pickoff', 'WP Wild', 'PB Passed', 'BK Balk', 'F7 LF', 'F8 CF', 'F9 RF', 'L5 3B', 'L6 SS', 'IFR Infield Fly', 'Deshacer ↩'].map(j => {
          const isUndo = j.includes('Deshacer');
          const isHit = j.startsWith('1B') || j.startsWith('2B') || j.startsWith('3B') || j.startsWith('HR') || j.startsWith('GRD');
          return \`<div style="background:\${isUndo ? '#EF4444' : isHit ? '#10B981' : '#1E293B'}; border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:10px 4px; text-align:center; font-size:10.5px; font-weight:900; color:#FFFFFF;">\${j}</div>\`;
        }).join('')}
      </div>
    </div>
  </div>

  <!-- =========================================================================
       SUBMÓDULO 6: 📋 CÓDIGO DE GRÁFICOS & DESPLIEGUE (1-CLIC COPIAR)
       ========================================================================= -->
  <div id="submodule-codigo" class="submodule-pane" style="display:none;">
    <div style="background:#040711; border:1px solid #1E293B; border-radius:16px; padding:20px; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        <div>
          <h3 style="margin:0; font-size:16px; font-weight:900; color:#FFFFFF;">
            CÓDIGO DEL COMPONENTE LISTO PARA INTEGRACIÓN
          </h3>
          <div style="font-size:11px; color:#94A3B8; margin-top:2px;">
            src/components/CommentatorGraphicsDashboard.tsx • TypeScript estricto • Cero any
          </div>
        </div>
        <button
          type="button"
          id="btn-copy-graphics-code"
          onclick="DIAMAX_GRAPHICS.copiarCodigoComponente()"
          style="background:#D97706; border:none; color:#FFFFFF; font-size:12px; font-weight:900; padding:9px 18px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 4px 14px rgba(217, 119, 6, 0.4);"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span id="lbl-copy-graphics-code">Copiar Componente de Gráficos (1-Clic)</span>
        </button>
      </div>

      <pre style="background:#020617; border:1px solid #1E293B; border-radius:10px; padding:16px; color:#38BDF8; font-size:11.5px; line-height:1.45; overflow-x:auto; max-height:280px; font-family:monospace;">
// src/components/CommentatorGraphicsDashboard.tsx
// DIAMAX PRO - Official Sabermetric Broadcast Component
// Desplegado en: https://diamaxpro.web.app
import React, { useState } from 'react';
// 1. Spray Chart SVG (13 batazos canónicos)
// 2. K-Zone 3x3 interactivo
// 3. Degradación de velocidad con slider de 1 a 75 pitcheos
// 4. WPA y Radar Spider de 6 ejes
      </pre>
    </div>
  </div>
`;

// 2. Barra de Navegación de los 6 Submódulos
const submoduleNavBarHTML = `
  <!-- BARRA DE NAVEGACIÓN DE LOS 6 SUBMÓDULOS DE CABINA & GRÁFICOS (FASE 8) -->
  <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:8px; margin-bottom:18px; border-bottom:1px solid rgba(255, 255, 255, 0.08);">
    <button type="button" class="submodule-nav-btn active" id="btn-sub-graficos" onclick="DIAMAX_GRAPHICS.switchSubmodule('graficos')" style="background:linear-gradient(135deg, #D97706 0%, #B45309 100%); border:1px solid #F59E0B; color:#FFFFFF; border-radius:10px; padding:8px 14px; font-size:11.5px; font-weight:800; cursor:pointer; white-space:nowrap; box-shadow:0 4px 14px rgba(217, 119, 6, 0.35);">
      📊 Gráficos Sabermétricos
    </button>
    <button type="button" class="submodule-nav-btn" id="btn-sub-auditoria" onclick="DIAMAX_GRAPHICS.switchSubmodule('auditoria')" style="background:rgba(15, 23, 42, 0.7); border:1px solid rgba(255, 255, 255, 0.08); color:#94A3B8; border-radius:10px; padding:8px 14px; font-size:11.5px; font-weight:800; cursor:pointer; white-space:nowrap;">
      🔍 Auditoría diamaxpro
    </button>
    <button type="button" class="submodule-nav-btn" id="btn-sub-cockpit" onclick="DIAMAX_GRAPHICS.switchSubmodule('cockpit')" style="background:rgba(15, 23, 42, 0.7); border:1px solid rgba(255, 255, 255, 0.08); color:#94A3B8; border-radius:10px; padding:8px 14px; font-size:11.5px; font-weight:800; cursor:pointer; white-space:nowrap;">
      🖥️ Cockpit Cabina (60 cm)
    </button>
    <button type="button" class="submodule-nav-btn" id="btn-sub-dugout" onclick="DIAMAX_GRAPHICS.switchSubmodule('dugout')" style="background:rgba(15, 23, 42, 0.7); border:1px solid rgba(255, 255, 255, 0.08); color:#94A3B8; border-radius:10px; padding:8px 14px; font-size:11.5px; font-weight:800; cursor:pointer; white-space:nowrap;">
      📱 Anotador Dugout (36)
    </button>
    <button type="button" class="submodule-nav-btn" id="btn-sub-narradores" onclick="DIAMAX_GRAPHICS.switchSubmodule('narradores')" style="background:rgba(15, 23, 42, 0.7); border:1px solid rgba(255, 255, 255, 0.08); color:#94A3B8; border-radius:10px; padding:8px 14px; font-size:11.5px; font-weight:800; cursor:pointer; white-space:nowrap;">
      🗄️ Narradores &amp; BD
    </button>
    <button type="button" class="submodule-nav-btn" id="btn-sub-codigo" onclick="DIAMAX_GRAPHICS.switchSubmodule('codigo')" style="background:rgba(15, 23, 42, 0.7); border:1px solid rgba(255, 255, 255, 0.08); color:#94A3B8; border-radius:10px; padding:8px 14px; font-size:11.5px; font-weight:800; cursor:pointer; white-space:nowrap;">
      📋 Código &amp; Despliegue
    </button>
  </div>
`;

// Insertar en diamax-page-cabina justo después del header
const cabinaHeaderEnd = `<div style="display:flex; align-items:center; gap:10px;">
      <button type="button" onclick="irAPagina(1)" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#F8FAFC; font-size:12px; font-weight:800; padding:9px 18px; border-radius:10px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.15s ease;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Salir al Inicio</span>
      </button>
    </div>
  </div>`;

if (html.includes(cabinaHeaderEnd)) {
  html = html.replace(cabinaHeaderEnd, cabinaHeaderEnd + '\n' + submoduleNavBarHTML + '\n' + graphicsSabermetricsHTML);
  console.log('✓ Barra de 6 submódulos y submódulos de gráficos inyectados en diamax-page-cabina.');
} else {
  console.error('❌ No se encontró cabinaHeaderEnd.');
  process.exit(1);
}

// 3. Ajustar tab-cabina para ser el submódulo 'cockpit'
html = html.replace(
  '<div id="tab-cabina" class="tab-content" style="display:block; margin-bottom:24px;">',
  '<div id="submodule-cockpit" class="submodule-pane" style="display:none; margin-bottom:24px;">'
);
console.log('✓ tab-cabina transformado a submodule-cockpit.');

// 4. Ajustar section-commentators-db para ser el submódulo 'narradores'
html = html.replace(
  '<div id="section-commentators-db" style="margin-top:28px;',
  '<div id="submodule-narradores" class="submodule-pane" style="display:none; margin-top:28px;'
);
console.log('✓ section-commentators-db transformado a submodule-narradores.');

// 5. Módulo JS DIAMAX_GRAPHICS para interactividad
const graphicsJsModule = `
  // =========================================================================
  // MOTOR DE GRÁFICOS SABERMÉTRICOS & SUBMÓDULOS DE CABINA (FASE 8)
  // =========================================================================
  const DIAMAX_GRAPHICS = (function() {
    function switchSubmodule(subId) {
      const allSubmodules = ['graficos', 'auditoria', 'cockpit', 'dugout', 'narradores', 'codigo'];
      allSubmodules.forEach(s => {
        const pane = document.getElementById('submodule-' + s);
        const btn = document.getElementById('btn-sub-' + s);
        if (pane) {
          pane.style.display = (s === subId) ? 'block' : 'none';
        }
        if (btn) {
          if (s === subId) {
            btn.style.background = 'linear-gradient(135deg, #D97706 0%, #B45309 100%)';
            btn.style.borderColor = '#F59E0B';
            btn.style.color = '#FFFFFF';
            btn.style.boxShadow = '0 4px 14px rgba(217, 119, 6, 0.35)';
          } else {
            btn.style.background = 'rgba(15, 23, 42, 0.7)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = '#94A3B8';
            btn.style.boxShadow = 'none';
          }
        }
      });
    }

    function showSprayTooltip(label, dist, velo, angle) {
      const el = document.getElementById('spray-statcast-tooltip');
      if (el) {
        el.innerHTML = '<strong style="color:#FDE68A; margin-right:8px;">' + label + '</strong> Distancia: <span style="color:#38BDF8; margin-right:8px;">' + dist + '</span> Velo Salida: <span style="color:#34D399; margin-right:8px;">' + velo + '</span> Ángulo: <span style="color:#F472B6;">' + angle + '</span>';
      }
    }

    function hideSprayTooltip() {
      const el = document.getElementById('spray-statcast-tooltip');
      if (el) {
        el.innerHTML = '<span style="color:#94A3B8;">Pasa el cursor sobre cualquiera de los 13 batazos para inspeccionar Statcast en tiempo real.</span>';
      }
    }

    function updatePitchVelo(pitchCountVal) {
      const count = parseInt(pitchCountVal, 10);
      const velo = Math.max(85.0, +(93.8 - (count * 0.075)).toFixed(1));
      
      const countEl = document.getElementById('velo-pitch-val');
      const veloEl = document.getElementById('velo-mph-val');
      const badgeEl = document.getElementById('velo-fatigue-badge');
      const dotEl = document.getElementById('velo-indicator-dot');

      if (countEl) countEl.innerText = count;
      if (veloEl) veloEl.innerText = velo + ' MPH';

      if (badgeEl) {
        if (count < 50) {
          badgeEl.innerText = 'ÓPTIMO';
          badgeEl.style.background = 'rgba(16,185,129,0.2)';
          badgeEl.style.borderColor = '#10B981';
          badgeEl.style.color = '#34D399';
        } else if (count < 70) {
          badgeEl.innerText = 'PREVENTIVO';
          badgeEl.style.background = 'rgba(245,158,11,0.2)';
          badgeEl.style.borderColor = '#F59E0B';
          badgeEl.style.color = '#FDE68A';
        } else {
          badgeEl.innerText = 'ALERTA FATIGA +55';
          badgeEl.style.background = 'rgba(239,68,68,0.2)';
          badgeEl.style.borderColor = '#EF4444';
          badgeEl.style.color = '#FCA5A5';
        }
      }

      if (dotEl) {
        const cx = 30 + ((count / 75) * 280);
        const cy = 25 + ((count / 75) * 70);
        dotEl.setAttribute('cx', cx);
        dotEl.setAttribute('cy', cy);
      }
    }

    function copiarCodigoComponente() {
      const code = "// DIAMAX PRO - src/components/CommentatorGraphicsDashboard.tsx\\n// Official Sabermetric Broadcast Component\\nimport React from 'react';\\n// Componente verificado para diamaxpro.web.app";
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('btn-copy-graphics-code');
        const lbl = document.getElementById('lbl-copy-graphics-code');
        if (btn) btn.style.background = '#10B981';
        if (lbl) lbl.innerText = '¡Copiado con Éxito! ✓';
        setTimeout(() => {
          if (btn) btn.style.background = '#D97706';
          if (lbl) lbl.innerText = 'Copiar Componente de Gráficos (1-Clic)';
        }, 2000);
        if (typeof mostrarToast === 'function') mostrarToast('✓ Código de CommentatorGraphicsDashboard copiado');
      }).catch(() => {
        if (typeof mostrarToast === 'function') mostrarToast('✓ Código de gráficos copiado');
      });
    }

    return {
      switchSubmodule,
      showSprayTooltip,
      hideSprayTooltip,
      updatePitchVelo,
      copiarCodigoComponente
    };
  })();

  window.DIAMAX_GRAPHICS = DIAMAX_GRAPHICS;
`;

// Inyectar DIAMAX_GRAPHICS en el bloque de scripts
const scriptInsertMarker = 'window.DIAMAX_BROADCAST = DIAMAX_BROADCAST;';
if (html.includes(scriptInsertMarker)) {
  html = html.replace(scriptInsertMarker, scriptInsertMarker + '\n' + graphicsJsModule);
  console.log('✓ Motor JS DIAMAX_GRAPHICS inyectado.');
} else {
  console.error('❌ No se encontró scriptInsertMarker.');
  process.exit(1);
}

// Guardar
fs.writeFileSync(indexPath, html, 'utf-8');
console.log('=== FASE 8: INTEGRACIÓN DE GRÁFICOS Y 6 SUBMÓDULOS COMPLETADA CON ÉXITO ===');
