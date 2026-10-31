import fs from 'fs';

const indexPath = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html';
console.log('Reading index.html...');
let html = fs.readFileSync(indexPath, 'utf-8');

// Construct the new tab-cabina HTML
const tabCabinaHTML = `
  <!-- =========================================================================
       🎙️ COCKPIT DIGITAL PARA EL NARRADOR HUMANO (CABINA DE RADIO Y TV)
       PLAN COMENTARISTA & MEDIA — DIAMAX PRO OS
       ========================================================================= -->
  <div id="tab-cabina" class="tab-content" style="display:none; margin-bottom:24px;">
    
    <!-- ⚠️ ALERTA DE SUSTITUCIÓN EN PARPADEO ÁMBAR (OCULTA POR DEFECTO, SALTA CON CAMBIOS) -->
    <div id="cockpit-sub-alert-bar" style="display:none; background:#78350F; border:2px solid #F59E0B; border-radius:14px; padding:14px 20px; margin-bottom:16px; color:#FFF; box-shadow:0 0 25px rgba(245,158,11,0.6);" class="cockpit-alert-blink">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:26px;">⚠️</span>
          <div>
            <div style="font-size:12px; font-weight:900; color:#FDE68A; letter-spacing:1px; text-transform:uppercase;">
              ¡ALERTA DE SUSTITUCIÓN EN CABINA — NO NOMBRAR AL JUGADOR EQUIVOCADO!
            </div>
            <div id="cockpit-sub-alert-text" style="font-size:15px; font-weight:900; color:#FFFFFF; margin-top:2px;">
              Entra como Bateador Emergente (PH) #15 Roberto Gómez por #5 Johan Olivo.
            </div>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" onclick="narrarTextoCabina(document.getElementById('cockpit-sub-alert-text').innerText)" style="background:rgba(0,0,0,0.5); border:1px solid #FDE68A; color:#FDE68A; font-size:11.5px; font-weight:900; padding:8px 14px; border-radius:8px; cursor:pointer;">
            🎙️ Narrar Sustitución
          </button>
          <button type="button" onclick="descartarAlertaSustitucionCabina()" style="background:#F59E0B; border:none; color:#000; font-size:12px; font-weight:900; padding:8px 16px; border-radius:8px; cursor:pointer; box-shadow:0 2px 10px rgba(0,0,0,0.4);">
            ✅ Enterado / Al Aire
          </button>
        </div>
      </div>
    </div>

    <!-- BARRA SUPERIOR DEL COCKPIT DIGITAL DE TRANSMISIÓN -->
    <div style="background:linear-gradient(135deg, #020617 0%, #060D1F 50%, #091329 100%); border:2px solid #00D2FF; border-radius:16px; padding:14px 20px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; box-shadow:0 10px 30px rgba(0,0,0,0.8), 0 0 25px rgba(0,210,255,0.25);">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:28px;">🎙️</span>
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <h2 style="margin:0; font-size:18px; font-weight:900; color:#FFFFFF; letter-spacing:0.8px;">
              COCKPIT DIGITAL DEL NARRADOR — RADIO &amp; TV
            </h2>
            <span style="background:rgba(239,68,68,0.2); border:1px solid #EF4444; color:#F87171; font-size:10px; font-weight:900; padding:2px 8px; border-radius:20px; display:inline-flex; align-items:center; gap:5px;">
              <span style="width:7px; height:7px; border-radius:50%; background:#EF4444; box-shadow:0 0 6px #EF4444; animation:pulseGlow 1.2s infinite;"></span>
              ON AIR
            </span>
          </div>
          <span style="font-size:11.5px; color:#00D2FF; font-weight:700;">PARTIDO EN VIVO: GVE-55 • MESA DE TRANSMISIÓN (SPOTTING BOARD DINÁMICO)</span>
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <!-- PANTALLA SIEMPRE ACTIVA (WAKE LOCK) -->
        <button type="button" id="btn-cockpit-wakelock" onclick="toggleWakeLockCabina()" style="background:rgba(16,185,129,0.18); border:1.5px solid #10B981; color:#10B981; font-size:12px; font-weight:800; padding:8px 13px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(16,185,129,0.2);" title="Evita que la tablet o laptop se apague sola por inactividad">
          <span id="wakelock-led" style="width:8px; height:8px; border-radius:50%; background:#10B981; box-shadow:0 0 6px #10B981;"></span>
          <span id="wakelock-label">💡 Pantalla Activa: ON</span>
        </button>

        <!-- OVERLAY OBS / vMix -->
        <button type="button" onclick="copiarOverlayOBS()" style="background:rgba(0,210,255,0.18); border:1.5px solid #00D2FF; color:#00D2FF; font-size:12px; font-weight:800; padding:8px 12px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;" title="Copiar URL transparente para OBS Studio o vMix">
          <span>📺</span> <span>Overlay OBS</span>
        </button>

        <!-- SALIDA A COMERCIALES INMEDIATA -->
        <button type="button" onclick="dispararSalidaComercialesManual()" style="background:linear-gradient(135deg, rgba(242,101,34,0.3), rgba(245,158,11,0.3)); border:1.5px solid #F26522; color:#FFC72C; font-size:12px; font-weight:900; padding:8px 13px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 0 12px rgba(242,101,34,0.35);" title="Generar resumen de radio de salida a comerciales en 1 segundo">
          <span>📻</span> <span>Salida Comerciales</span>
        </button>

        <!-- PROBAR ALERTA SUSTITUCIÓN (DEMO) -->
        <button type="button" onclick="probarAlertaSustitucionCabina()" style="background:#1E293B; border:1px solid #475569; color:#CBD5E1; font-size:11.5px; font-weight:800; padding:8px 11px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:5px;" title="Demostración de alerta ámbar">
          <span>⚠️</span> <span>Test Sub</span>
        </button>

        <!-- SALIR A DUGOUT -->
        <button type="button" onclick="switchTab('envivo')" style="background:#1E293B; border:1px solid #475569; color:#FFF; font-size:12px; font-weight:900; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;" title="Regresar al Anotador de Dugout">
          <span>⚾</span> <span>Dugout</span>
        </button>
      </div>
    </div>

    <!-- 📊 MEGA PIZARRA GLANCEABLE (LEGIBLE A 60 CM DEL MICRÓFONO) -->
    <div style="background:linear-gradient(180deg, #030712 0%, #060D1E 100%); border:2px solid #1E293B; border-radius:18px; padding:18px 24px; margin-bottom:18px; box-shadow:0 15px 40px rgba(0,0,0,0.85); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
      
      <!-- Inning Gigante -->
      <div style="text-align:left; min-width:140px;">
        <span style="font-size:11px; color:#94A3B8; font-weight:800; text-transform:uppercase; letter-spacing:1px; display:block;">EPISODIO EN VIVO</span>
        <div id="cockpit-mega-inning" style="font-size:30px; font-weight:900; color:#00D2FF; font-variant-numeric:tabular-nums; letter-spacing:1px;">
          INNING 4 ▲ ALTA
        </div>
      </div>

      <!-- Marcador Gigante -->
      <div style="text-align:center; flex:1; min-width:260px;">
        <span style="font-size:11px; color:#94A3B8; font-weight:800; text-transform:uppercase; letter-spacing:1px; display:block;">PIZARRA OFICIAL EN EL AIRE</span>
        <div id="cockpit-mega-score" style="font-size:40px; font-weight:900; color:#FFFFFF; font-variant-numeric:tabular-nums; letter-spacing:2px; text-shadow:0 0 25px rgba(255,199,44,0.4);">
          <span style="color:#FFF;">GUERREROS 5</span> - <span style="color:#FFC72C;">3 TIBURONES</span>
        </div>
      </div>

      <!-- Diamante de Bases SVG con Nombres de Corredores en Vivo -->
      <div style="text-align:center; padding:0 10px;">
        <span style="font-size:10px; color:#94A3B8; font-weight:800; text-transform:uppercase; display:block; margin-bottom:4px;">CORREDORES EN BASE</span>
        <div style="display:flex; align-items:center; gap:10px;">
          <svg width="56" height="56" viewBox="0 0 100 100">
            <!-- Líneas de diamante -->
            <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="#334155" stroke-width="3"/>
            <!-- 2B (Arriba) -->
            <rect id="cockpit-base-2" x="42" y="7" width="16" height="16" transform="rotate(45 50 15)" fill="#FFC72C" stroke="#FFF" stroke-width="1.5" style="filter:drop-shadow(0 0 6px #FFC72C);"/>
            <!-- 3B (Izquierda) -->
            <rect id="cockpit-base-3" x="7" y="42" width="16" height="16" transform="rotate(45 15 50)" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
            <!-- 1B (Derecha) -->
            <rect id="cockpit-base-1" x="77" y="42" width="16" height="16" transform="rotate(45 85 50)" fill="#FFC72C" stroke="#FFF" stroke-width="1.5" style="filter:drop-shadow(0 0 6px #FFC72C);"/>
            <!-- Home (Abajo) -->
            <polygon points="50,85 60,92 50,98 40,92" fill="#FFF"/>
          </svg>
          <div style="text-align:left; font-size:10.5px; line-height:1.4;">
            <div><strong style="color:#FFC72C;">1B:</strong> <span id="cockpit-runner-1b-name" style="color:#FFF;">Johan Olivo</span></div>
            <div><strong style="color:#FFC72C;">2B:</strong> <span id="cockpit-runner-2b-name" style="color:#FFF;">Carlos Mendoza</span></div>
            <div><strong style="color:#94A3B8;">3B:</strong> <span id="cockpit-runner-3b-name" style="color:#64748B;">Vacía</span></div>
          </div>
        </div>
      </div>

      <!-- Conteo B-S-O en Números Gigantes & LEDs -->
      <div style="display:flex; align-items:center; gap:16px; background:#040914; border:1.5px solid #1E293B; border-radius:14px; padding:10px 18px;">
        <div style="text-align:center;">
          <span style="font-size:10.5px; color:#10B981; font-weight:900; display:block;">BOLAS</span>
          <div style="font-size:28px; font-weight:900; color:#10B981; font-variant-numeric:tabular-nums;" id="cockpit-mega-balls">2</div>
          <div style="display:flex; gap:3px; justify-content:center; margin-top:2px;" id="cockpit-leds-balls">
            <span style="width:6px; height:6px; border-radius:50%; background:#10B981; box-shadow:0 0 5px #10B981;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:#10B981; box-shadow:0 0 5px #10B981;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:#1E293B;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:#1E293B;"></span>
          </div>
        </div>

        <div style="width:1px; height:36px; background:#1E293B;"></div>

        <div style="text-align:center;">
          <span style="font-size:10.5px; color:#FFC72C; font-weight:900; display:block;">STRIKES</span>
          <div style="font-size:28px; font-weight:900; color:#FFC72C; font-variant-numeric:tabular-nums;" id="cockpit-mega-strikes">1</div>
          <div style="display:flex; gap:3px; justify-content:center; margin-top:2px;" id="cockpit-leds-strikes">
            <span style="width:6px; height:6px; border-radius:50%; background:#FFC72C; box-shadow:0 0 5px #FFC72C;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:#1E293B;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:#1E293B;"></span>
          </div>
        </div>

        <div style="width:1px; height:36px; background:#1E293B;"></div>

        <div style="text-align:center;">
          <span style="font-size:10.5px; color:#EF4444; font-weight:900; display:block;">OUTS</span>
          <div style="font-size:28px; font-weight:900; color:#EF4444; font-variant-numeric:tabular-nums;" id="cockpit-mega-outs">2</div>
          <div style="display:flex; gap:3px; justify-content:center; margin-top:2px;" id="cockpit-leds-outs">
            <span style="width:6px; height:6px; border-radius:50%; background:#EF4444; box-shadow:0 0 5px #EF4444;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:#EF4444; box-shadow:0 0 5px #EF4444;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:#1E293B;"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- COCKPIT GRID: 3 COLUMNAS TÁCTICAS -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:18px;">
      
      <!-- ===================================================================
           COLUMNA 1: SPOTTING BOARD DINÁMICO (BATEADOR & LANZADOR)
           =================================================================== -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        
        <!-- Ficha del Bateador Activo -->
        <div style="background:#050B18; border:1.5px solid #1E293B; border-radius:14px; padding:18px; box-shadow:0 4px 20px rgba(0,0,0,0.5);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:8px;">
            <span style="font-size:11px; font-weight:900; color:#00D2FF; text-transform:uppercase; letter-spacing:0.8px;">
              👤 EN EL PLATO (SPOTTING BOARD DINÁMICO)
            </span>
            <span id="cockpit-batter-turn-badge" style="background:rgba(0,210,255,0.15); color:#00D2FF; font-size:10px; font-weight:800; padding:2px 8px; border-radius:6px;">TURNO 3</span>
          </div>

          <div style="display:flex; align-items:center; gap:14px; margin-bottom:12px;">
            <div id="cockpit-batter-dorsal" style="width:52px; height:52px; border-radius:12px; background:linear-gradient(135deg, #1E293B, #0F172A); border:2px solid #00D2FF; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:900; color:#00D2FF; box-shadow:0 0 15px rgba(0,210,255,0.3);">
              #5
            </div>
            <div>
              <div id="cockpit-batter-name" style="font-size:18px; font-weight:900; color:#FFFFFF; letter-spacing:0.4px;">
                Johan Olivo #5 (CF)
              </div>
              <div id="cockpit-batter-hands" style="font-size:12px; color:#94A3B8; font-weight:700;">
                Batea: Zurdo (L) • Lanza: Derecho (R) • Guerreros +55
              </div>
            </div>
          </div>

          <!-- Métricas de Temporada -->
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; background:#020617; border:1px solid #1E293B; border-radius:10px; padding:10px; text-align:center; font-variant-numeric:tabular-nums; margin-bottom:12px;">
            <div>
              <span style="font-size:10px; color:#64748B; font-weight:800; display:block;">AVG</span>
              <strong id="cockpit-batter-avg" style="font-size:15px; color:#FFC72C;">.385</strong>
            </div>
            <div>
              <span style="font-size:10px; color:#64748B; font-weight:800; display:block;">OBP</span>
              <strong id="cockpit-batter-obp" style="font-size:15px; color:#38BDF8;">.440</strong>
            </div>
            <div>
              <span style="font-size:10px; color:#64748B; font-weight:800; display:block;">SLG</span>
              <strong id="cockpit-batter-slg" style="font-size:15px; color:#F472B6;">.615</strong>
            </div>
            <div>
              <span style="font-size:10px; color:#64748B; font-weight:800; display:block;">OPS</span>
              <strong id="cockpit-batter-ops" style="font-size:15px; color:#10B981;">1.055</strong>
            </div>
          </div>

          <!-- LÍNEA DEL DÍA EN VIVO -->
          <div style="background:rgba(0,210,255,0.06); border:1px solid rgba(0,210,255,0.2); border-radius:8px; padding:10px 12px; margin-bottom:10px;">
            <div style="font-size:10px; color:#00D2FF; font-weight:900; text-transform:uppercase; margin-bottom:2px;">
              ⚡ LÍNEA DEL DÍA PARA EL LOCUTOR:
            </div>
            <div id="cockpit-batter-line-today" style="font-size:13px; color:#FFFFFF; font-weight:900;">
              Hoy: 3-2, 1 doble, 2 impulsadas, 1 anotada
            </div>
          </div>

          <!-- Siguiente Bateador (On-Deck) -->
          <div style="font-size:11.5px; color:#CBD5E1; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>⏳ <strong>Prevenido (En Espera):</strong></span>
            <span id="cockpit-batter-ondeck" style="color:#FFC72C; font-weight:800;">Carlos Mendoza #12 (3B)</span>
          </div>
        </div>

        <!-- Semáforo del Lanzador Activo -->
        <div style="background:#050B18; border:1.5px solid #1E293B; border-radius:14px; padding:16px; box-shadow:0 4px 20px rgba(0,0,0,0.5);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span id="cockpit-pitcher-name" style="font-size:11px; font-weight:900; color:#10B981; text-transform:uppercase; letter-spacing:0.8px;">
              ⚾ EN LA LOMITA: PEDRO CHÁVEZ (RHP)
            </span>
            <span id="cockpit-pitcher-velo" style="font-size:11px; color:#00D2FF; font-weight:900; background:rgba(0,210,255,0.15); padding:2px 8px; border-radius:6px;">
              4-Seam: 91.2 MPH
            </span>
          </div>
          
          <div style="display:flex; justify-content:space-between; font-size:12px; color:#FFF; font-weight:900; margin-bottom:6px;">
            <span>Fatiga Médica (+55 Florida):</span>
            <span id="cockpit-pitcher-count" style="color:#10B981; font-variant-numeric:tabular-nums;">42 / 75 PIT (56%)</span>
          </div>

          <div style="width:100%; height:12px; background:#0A1224; border:1px solid #1E293B; border-radius:6px; overflow:hidden; margin-bottom:8px;">
            <div id="cockpit-pitcher-bar" style="width:56%; height:100%; background:#10B981; transition:width 0.3s;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:10px; color:#64748B; font-weight:700;">
            <span style="color:#10B981;">0-50: Verde</span>
            <span style="color:#FFC72C;">51-65: Precaución</span>
            <span style="color:#EF4444;">66-75: Alerta / Límite Legal</span>
          </div>
        </div>
      </div>

      <!-- ===================================================================
           COLUMNA 2: DEFENSA EN EL TERRENO (RADAR DE LOS 9 DEFENSORES)
           =================================================================== -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        
        <!-- Radar Táctico de los 9 Defensores -->
        <div style="background:#050B18; border:1.5px solid #1E293B; border-radius:14px; padding:16px; box-shadow:0 4px 20px rgba(0,0,0,0.5);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-size:11px; font-weight:900; color:#00D2FF; text-transform:uppercase; letter-spacing:0.8px;">
              🛡️ MAPA DEFENSIVO (QUIÉN TOMÓ EL BATAZO)
            </span>
            <span id="cockpit-def-team-badge" style="background:rgba(59,130,246,0.2); border:1px solid #3B82F6; color:#93C5FD; font-size:10px; font-weight:900; padding:2px 8px; border-radius:6px;">
              DEFENSA RIVAL
            </span>
          </div>

          <!-- Terreno SVG con Nombres de los 9 Defensores -->
          <div style="position:relative; width:100%; aspect-ratio:1.2; background:#0B1A12; border:1.5px solid #1E293B; border-radius:12px; overflow:hidden; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 300 250" style="width:100%; height:100%;">
              <!-- Césped del Outfield -->
              <path d="M 150 220 L 20 70 A 180 180 0 0 1 280 70 Z" fill="#13331C" stroke="#22543D" stroke-width="2"/>
              <!-- Tierra del Infield -->
              <path d="M 150 220 L 70 140 A 110 110 0 0 1 230 140 Z" fill="#422006" stroke="#78350F" stroke-width="1.5"/>
              <!-- Cuadro del Infield (Diamante) -->
              <polygon points="150,215 195,170 150,125 105,170" fill="#1A472A" stroke="#FFF" stroke-width="1"/>
              <!-- Montículo -->
              <circle cx="150" cy="170" r="7" fill="#78350F" stroke="#FFF" stroke-width="1"/>
              
              <!-- 9 Defensores con Nombres y Posiciones -->
              <!-- LF -->
              <circle cx="70" cy="75" r="5" fill="#3B82F6" stroke="#FFF" stroke-width="1"/>
              <text id="svg-def-lf" x="70" y="67" fill="#93C5FD" font-size="8" font-weight="900" text-anchor="middle">LF: Miller #34</text>

              <!-- CF -->
              <circle cx="150" cy="50" r="5" fill="#3B82F6" stroke="#FFF" stroke-width="1"/>
              <text id="svg-def-cf" x="150" y="42" fill="#93C5FD" font-size="8" font-weight="900" text-anchor="middle">CF: Olivo #5</text>

              <!-- RF -->
              <circle cx="230" cy="75" r="5" fill="#3B82F6" stroke="#FFF" stroke-width="1"/>
              <text id="svg-def-rf" x="230" y="67" fill="#93C5FD" font-size="8" font-weight="900" text-anchor="middle">RF: Clark #18</text>

              <!-- 3B -->
              <circle cx="95" cy="165" r="5" fill="#3B82F6" stroke="#FFF" stroke-width="1"/>
              <text id="svg-def-3b" x="95" y="157" fill="#93C5FD" font-size="8" font-weight="900" text-anchor="middle">3B: Rodríg. #12</text>

              <!-- SS -->
              <circle cx="130" cy="142" r="5" fill="#3B82F6" stroke="#FFF" stroke-width="1"/>
              <text id="svg-def-ss" x="130" y="134" fill="#93C5FD" font-size="8" font-weight="900" text-anchor="middle">SS: Smith #7</text>

              <!-- 2B -->
              <circle cx="170" cy="142" r="5" fill="#3B82F6" stroke="#FFF" stroke-width="1"/>
              <text id="svg-def-2b" x="170" y="134" fill="#93C5FD" font-size="8" font-weight="900" text-anchor="middle">2B: Johns. #4</text>

              <!-- 1B -->
              <circle cx="205" cy="170" r="5" fill="#3B82F6" stroke="#FFF" stroke-width="1"/>
              <text id="svg-def-1b" x="205" y="162" fill="#93C5FD" font-size="8" font-weight="900" text-anchor="middle">1B: Vance #25</text>

              <!-- P (Pitcher) -->
              <circle cx="150" cy="170" r="5" fill="#10B981" stroke="#FFF" stroke-width="1"/>
              <text id="svg-def-p" x="150" y="186" fill="#6EE7B7" font-size="8" font-weight="900" text-anchor="middle">P: Chávez #42</text>

              <!-- C (Catcher) -->
              <circle cx="150" cy="225" r="5" fill="#F59E0B" stroke="#FFF" stroke-width="1"/>
              <text id="svg-def-c" x="150" y="240" fill="#FDE68A" font-size="8" font-weight="900" text-anchor="middle">C: White #2</text>
            </svg>
          </div>

          <!-- Roster Defensivo Glanceable (9 Badges) -->
          <div style="margin-top:12px; display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; font-size:11px;">
            <div style="background:#020617; border:1px solid #1E293B; border-radius:6px; padding:4px 8px;">
              <span style="color:#00D2FF; font-weight:900;">P:</span> <strong id="roster-def-p" style="color:#FFF;">P. Chávez #42</strong>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:6px; padding:4px 8px;">
              <span style="color:#00D2FF; font-weight:900;">C:</span> <strong id="roster-def-c" style="color:#FFF;">B. White #2</strong>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:6px; padding:4px 8px;">
              <span style="color:#00D2FF; font-weight:900;">1B:</span> <strong id="roster-def-1b" style="color:#FFF;">M. Vance #25</strong>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:6px; padding:4px 8px;">
              <span style="color:#00D2FF; font-weight:900;">2B:</span> <strong id="roster-def-2b" style="color:#FFF;">D. Johnson #4</strong>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:6px; padding:4px 8px;">
              <span style="color:#00D2FF; font-weight:900;">3B:</span> <strong id="roster-def-3b" style="color:#FFF;">L. Rodríg. #12</strong>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:6px; padding:4px 8px;">
              <span style="color:#00D2FF; font-weight:900;">SS:</span> <strong id="roster-def-ss" style="color:#FFF;">J. Smith #7</strong>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:6px; padding:4px 8px;">
              <span style="color:#00D2FF; font-weight:900;">LF:</span> <strong id="roster-def-lf" style="color:#FFF;">A. Miller #34</strong>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:6px; padding:4px 8px;">
              <span style="color:#00D2FF; font-weight:900;">CF:</span> <strong id="roster-def-cf" style="color:#FFF;">C. Pérez #10</strong>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:6px; padding:4px 8px;">
              <span style="color:#00D2FF; font-weight:900;">RF:</span> <strong id="roster-def-rf" style="color:#FFF;">S. Clark #18</strong>
            </div>
          </div>
        </div>

        <!-- Statcast Telemetry -->
        <div style="background:#050B18; border:1.5px solid #00D2FF; border-radius:14px; padding:16px; box-shadow:0 0 20px rgba(0,210,255,0.15);">
          <div style="font-size:11px; font-weight:900; color:#00D2FF; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            <span>⚡</span> <span>STATCAST TELEMETRY (ÚLTIMO CONTACTO)</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; font-variant-numeric:tabular-nums; text-align:center;">
            <div style="background:#020617; border:1px solid #1E293B; border-radius:8px; padding:8px;">
              <span style="font-size:10px; color:#64748B; font-weight:800; display:block;">EXIT VELO</span>
              <strong style="font-size:16px; color:#00D2FF;">108.4</strong>
              <small style="font-size:9px; color:#94A3B8; display:block;">MPH</small>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:8px; padding:8px;">
              <span style="font-size:10px; color:#64748B; font-weight:800; display:block;">ÁNGULO</span>
              <strong style="font-size:16px; color:#FFC72C;">28°</strong>
              <small style="font-size:9px; color:#94A3B8; display:block;">OPTIMAL</small>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:8px; padding:8px;">
              <span style="font-size:10px; color:#64748B; font-weight:800; display:block;">DISTANCIA</span>
              <strong style="font-size:16px; color:#10B981;">412</strong>
              <small style="font-size:9px; color:#94A3B8; display:block;">PIES</small>
            </div>
            <div style="background:#020617; border:1px solid #1E293B; border-radius:8px; padding:8px;">
              <span style="font-size:10px; color:#64748B; font-weight:800; display:block;">TIEMPO</span>
              <strong style="font-size:16px; color:#F472B6;">4.8s</strong>
              <small style="font-size:9px; color:#94A3B8; display:block;">VUELO</small>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================================================================
           COLUMNA 3: NUGGETS ANTI-DEAD AIR + PATROCINIOS + SALIDA COMERCIALES
           =================================================================== -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        
        <!-- PÍLDORAS Y NUGGETS ANTI-DEAD AIR -->
        <div style="background:#050B18; border:1.5px solid #FFC72C; border-radius:14px; padding:16px; box-shadow:0 4px 20px rgba(255,199,44,0.15);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="font-size:12px; font-weight:900; color:#FFC72C; display:flex; align-items:center; gap:6px;">
              <span>🎙️</span> <span>NUGGETS ANTI-DEAD AIR (PARA LOS 20 SEG)</span>
            </div>
            <button type="button" onclick="generarNuggetsCabina()" style="background:#1E293B; border:none; color:#FFC72C; font-size:10.5px; font-weight:800; padding:3px 8px; border-radius:4px; cursor:pointer;">
              🔄 Nuevos
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            <!-- Nugget 1 -->
            <div style="background:#020617; border:1px solid #1E293B; border-radius:8px; padding:8px 10px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                <span style="font-size:9.5px; color:#38BDF8; font-weight:900; text-transform:uppercase;">1. Duelo Personal (BvP)</span>
                <button type="button" onclick="narrarTextoCabina(document.getElementById('cockpit-nugget-1').innerText)" style="background:transparent; border:none; color:#38BDF8; font-size:10px; cursor:pointer;">🎙️ Narrar</button>
              </div>
              <p id="cockpit-nugget-1" style="margin:0; font-size:11.5px; color:#E2E8F0; line-height:1.35;">
                "Historial de por vida: Le batea de 9-4 (.444) a este lanzador con 2 dobles y 1 cuadrangular."
              </p>
            </div>

            <!-- Nugget 2 -->
            <div style="background:#020617; border:1px solid #1E293B; border-radius:8px; padding:8px 10px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                <span style="font-size:9.5px; color:#10B981; font-weight:900; text-transform:uppercase;">2. Racha Activa</span>
                <button type="button" onclick="narrarTextoCabina(document.getElementById('cockpit-nugget-2').innerText)" style="background:transparent; border:none; color:#10B981; font-size:10px; cursor:pointer;">🎙️ Narrar</button>
              </div>
              <p id="cockpit-nugget-2" style="margin:0; font-size:11.5px; color:#E2E8F0; line-height:1.35;">
                "Racha de fuego: Suma 5 juegos consecutivos dando hit y promedia .412 con hombres en base."
              </p>
            </div>

            <!-- Nugget 3 -->
            <div style="background:#020617; border:1px solid #1E293B; border-radius:8px; padding:8px 10px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                <span style="font-size:9.5px; color:#F472B6; font-weight:900; text-transform:uppercase;">3. Contexto de Pitcheo</span>
                <button type="button" onclick="narrarTextoCabina(document.getElementById('cockpit-nugget-3').innerText)" style="background:transparent; border:none; color:#F472B6; font-size:10px; cursor:pointer;">🎙️ Narrar</button>
              </div>
              <p id="cockpit-nugget-3" style="margin:0; font-size:11.5px; color:#E2E8F0; line-height:1.35;">
                "Pedro Chávez suma 42 pitcheos en la 4ta entrada; su recta promedia 91.2 MPH en el primer envío."
              </p>
            </div>
          </div>
        </div>

        <!-- TELEPROMPTER INTELIGENTE DE PATROCINIOS EN VIVO -->
        <div id="cockpit-sponsor-card" style="background:#050B18; border:1.5px solid #F26522; border-radius:14px; padding:16px; box-shadow:0 4px 25px rgba(242,101,34,0.15);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="font-size:12px; font-weight:900; color:#F26522; display:flex; align-items:center; gap:6px;">
              <span>📢</span> <span id="cockpit-sponsor-title">PATROCINIO EN VIVO: PONCHE (K)</span>
            </div>
            <span style="font-size:10px; color:#94A3B8;">Teleprompter</span>
          </div>

          <!-- Selector rápido de mención -->
          <div style="display:flex; gap:4px; flex-wrap:wrap; margin-bottom:10px;">
            <button type="button" onclick="seleccionarPatrocinioCabina('K')" style="background:#1E293B; border:1px solid #475569; color:#FFF; font-size:10px; padding:3px 8px; border-radius:4px; cursor:pointer;">🔥 Ponche (K)</button>
            <button type="button" onclick="seleccionarPatrocinioCabina('HR')" style="background:#1E293B; border:1px solid #475569; color:#FFF; font-size:10px; padding:3px 8px; border-radius:4px; cursor:pointer;">💥 Jonrón (HR)</button>
            <button type="button" onclick="seleccionarPatrocinioCabina('PITCHING')" style="background:#1E293B; border:1px solid #475569; color:#FFF; font-size:10px; padding:3px 8px; border-radius:4px; cursor:pointer;">🔄 Pitcher</button>
            <button type="button" onclick="seleccionarPatrocinioCabina('SB')" style="background:#1E293B; border:1px solid #475569; color:#FFF; font-size:10px; padding:3px 8px; border-radius:4px; cursor:pointer;">⚡ Robo (SB)</button>
            <button type="button" onclick="seleccionarPatrocinioCabina('DP')" style="background:#1E293B; border:1px solid #475569; color:#FFF; font-size:10px; padding:3px 8px; border-radius:4px; cursor:pointer;">🛡️ Doble Play</button>
            <button type="button" onclick="seleccionarPatrocinioCabina('HIT')" style="background:#1E293B; border:1px solid #475569; color:#FFF; font-size:10px; padding:3px 8px; border-radius:4px; cursor:pointer;">☕ Hit Café</button>
          </div>

          <div style="background:#020617; border:1px solid rgba(242,101,34,0.4); border-radius:10px; padding:12px; margin-bottom:10px;">
            <p id="cockpit-sponsor-text" style="margin:0; font-size:12.5px; color:#FFFFFF; font-weight:800; line-height:1.45;">
              "¡Tercer strike cantado! El ponche del juego llega por cortesía de Taller Mecánico El Campeón: afinación, frenos y mecánica con calidad de Grandes Ligas."
            </p>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button type="button" onclick="copiarTextoCabina('cockpit-sponsor-text')" style="background:#1E293B; border:none; color:#CBD5E1; font-size:11px; font-weight:800; padding:5px 10px; border-radius:6px; cursor:pointer;">
              📋 Copiar Mención
            </button>
            <button type="button" onclick="narrarTextoCabina(document.getElementById('cockpit-sponsor-text').innerText)" style="background:rgba(242,101,34,0.25); border:1.5px solid #F26522; color:#FFC72C; font-size:11px; font-weight:900; padding:5px 12px; border-radius:6px; cursor:pointer;">
              🎙️ Leer al Aire (Voz)
            </button>
          </div>
        </div>

        <!-- RESUMEN DE SALIDA A COMERCIALES EN 1 SEGUNDO -->
        <div style="background:#050B18; border:1.5px solid #10B981; border-radius:14px; padding:16px; box-shadow:0 4px 25px rgba(16,185,129,0.15);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="font-size:12px; font-weight:900; color:#10B981; display:flex; align-items:center; gap:6px;">
              <span>📻</span> <span>RESUMEN SALIDA A COMERCIALES (AL 3ER OUT)</span>
            </div>
            <button type="button" onclick="dispararSalidaComercialesManual()" style="background:#1E293B; border:none; color:#10B981; font-size:10.5px; font-weight:800; padding:3px 8px; border-radius:4px; cursor:pointer;">
              🔄 Recalcular
            </button>
          </div>

          <div style="background:#020617; border:1px solid rgba(16,185,129,0.3); border-radius:10px; padding:12px; margin-bottom:10px;">
            <p id="cockpit-commercial-script" style="margin:0; font-size:12px; color:#E2E8F0; line-height:1.45; font-style:italic;">
              "Se fue la alta del 4to episodio: 1 carrera, 2 hits, sin errores, 1 dejado en circulación. Pizarra Oficial en Lutz Baseball Park: Guerreros de Tampa 5, Tiburones 3. Hacemos una pausa de 60 segundos y ya regresamos por Diamax Pro Sports Radio &amp; TV... ¡No se aparten!"
            </p>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button type="button" onclick="copiarTextoCabina('cockpit-commercial-script')" style="background:#1E293B; border:none; color:#CBD5E1; font-size:11px; font-weight:800; padding:5px 10px; border-radius:6px; cursor:pointer;">
              📋 Copiar Guion Radio
            </button>
            <button type="button" onclick="narrarTextoCabina(document.getElementById('cockpit-commercial-script').innerText)" style="background:rgba(16,185,129,0.25); border:1.5px solid #10B981; color:#34D399; font-size:11px; font-weight:900; padding:5px 12px; border-radius:6px; cursor:pointer;">
              🎙️ Narrar Outro
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
`;

// Locate the existing broadcast-cockpit-view and replace it
const startTarget = '  <div id="broadcast-cockpit-view" style="display:none; margin-bottom:24px;">';
const endTarget = '  <div class="nav" id="main-nav">';

const startIndex = html.indexOf(startTarget);
const endIndex = html.indexOf(endTarget);

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + tabCabinaHTML + '\n\n' + html.substring(endIndex);
  console.log('Replaced Cockpit markup with complete Tab Cabina.');
} else {
  console.error('Could not find markup markers! startIndex:', startIndex, 'endIndex:', endIndex);
}

// 6. Write comprehensive JavaScript logic for Cockpit Cabina
const cockpitEngineJS = `
// =========================================================================
// 🎙️ COCKPIT DIGITAL DE CABINA — MOTOR DE TRANSMISIÓN Y MEDIA
// SPOTTER BOARD, ANTI-DEAD AIR, TELEPROMPTER, SALIDA COMERCIALES, WAKE LOCK
// =========================================================================

let diamaxWakeLockSentinel = null;
let diamaxWakeLockEnabled = false;

// 1. PANTALLA SIEMPRE ACTIVA (SCREEN WAKE LOCK API)
async function toggleWakeLockCabina() {
  const led = document.getElementById('wakelock-led');
  const label = document.getElementById('wakelock-label');
  const btn = document.getElementById('btn-cockpit-wakelock');

  if ('wakeLock' in navigator) {
    if (diamaxWakeLockSentinel !== null) {
      // Desactivar
      try {
        await diamaxWakeLockSentinel.release();
        diamaxWakeLockSentinel = null;
        diamaxWakeLockEnabled = false;
        if (led) { led.style.background = '#64748B'; led.style.boxShadow = 'none'; }
        if (label) label.innerText = '💡 Pantalla Activa: OFF';
        if (btn) { btn.style.borderColor = '#475569'; btn.style.color = '#94A3B8'; btn.style.background = '#1E293B'; }
        if (typeof mostrarToast === 'function') mostrarToast('💡 Pantalla Siempre Activa desactivada.');
      } catch (e) {
        console.warn('Error liberando wakeLock:', e);
      }
    } else {
      // Activar
      try {
        diamaxWakeLockSentinel = await navigator.wakeLock.request('screen');
        diamaxWakeLockEnabled = true;
        diamaxWakeLockSentinel.addEventListener('release', () => {
          diamaxWakeLockSentinel = null;
          if (led) { led.style.background = '#64748B'; led.style.boxShadow = 'none'; }
          if (label) label.innerText = '💡 Pantalla Activa: OFF';
        });
        if (led) { led.style.background = '#10B981'; led.style.boxShadow = '0 0 8px #10B981'; }
        if (label) label.innerText = '💡 Pantalla Activa: ON';
        if (btn) { btn.style.borderColor = '#10B981'; btn.style.color = '#10B981'; btn.style.background = 'rgba(16,185,129,0.18)'; }
        if (typeof mostrarToast === 'function') mostrarToast('⚡ Pantalla Siempre Activa (Wake Lock) activada con éxito para la transmisión.');
      } catch (err) {
        console.error('Error solicitando Screen Wake Lock:', err);
        alert('No se pudo activar Screen Wake Lock: ' + err.message);
      }
    }
  } else {
    alert('Tu navegador no soporta la API Screen Wake Lock.');
  }
}
window.toggleWakeLockCabina = toggleWakeLockCabina;

// Re-adquisición automática de Wake Lock al volver a la pestaña
document.addEventListener('visibilitychange', async () => {
  if (diamaxWakeLockEnabled && diamaxWakeLockSentinel === null && document.visibilityState === 'visible') {
    try {
      diamaxWakeLockSentinel = await navigator.wakeLock.request('screen');
    } catch (e) {
      console.warn('Re-wakeLock failed:', e);
    }
  }
});

// 2. PATROCINIOS DE TRANSMISIÓN
const SPONSOR_PRESETS = {
  'K': {
    title: 'PATROCINIO EN VIVO: PONCHE (K)',
    text: '“¡Tercer strike cantado! El ponche del juego llega por cortesía de Taller Mecánico El Campeón: afinación, frenos y mecánica con calidad de Grandes Ligas en Tampa.”'
  },
  'HR': {
    title: 'PATROCINIO EN VIVO: JONRÓN (HR)',
    text: '“¡Se fue, se fue, cuadrangular monumental por el jardín central! Este batazo de cuatro esquinas es presentado por Pizzería Nápoles & Grill: el verdadero sabor del diamante.”'
  },
  'PITCHING': {
    title: 'PATROCINIO EN VIVO: CAMBIO DE LANZADOR',
    text: '“Llamada al bullpen y visita a la lomita. Este relevo seguro llega gracias a Seguros Diamante Pro: respaldando cada jugada de tu vida.”'
  },
  'SB': {
    title: 'PATROCINIO EN VIVO: ROBO DE BASE (SB)',
    text: '“¡Se estafó la almohadilla! Velocidad pura sobre las bases patrocinada por Express Logistics Florida: entregas a tiempo en todo el estado.”'
  },
  'DP': {
    title: 'PATROCINIO EN VIVO: DOBLE PLAY (DP)',
    text: '“¡Doble play relampagueante por la vía 6-4-3! La doble matanza llega por cortesía de Ferretería La Solución: herramientas que resuelven en el clutch.”'
  },
  'HIT': {
    title: 'PATROCINIO EN VIVO: HIT CLUTCH',
    text: '“¡Cañonazo sólido hacia los jardines! Disfruta la energía y aroma del mejor café artesanal Don Pedro.”'
  }
};

function seleccionarPatrocinioCabina(key) {
  const p = SPONSOR_PRESETS[key] || SPONSOR_PRESETS['K'];
  const titleEl = document.getElementById('cockpit-sponsor-title');
  const textEl = document.getElementById('cockpit-sponsor-text');
  const cardEl = document.getElementById('cockpit-sponsor-card');
  if (titleEl) titleEl.innerText = p.title;
  if (textEl) textEl.innerText = p.text;
  if (cardEl) {
    cardEl.classList.add('sponsor-active-glow');
    setTimeout(() => cardEl.classList.remove('sponsor-active-glow'), 3000);
  }
}
window.seleccionarPatrocinioCabina = seleccionarPatrocinioCabina;

// 3. GENERADOR DE NUGGETS ANTI-DEAD AIR
function generarNuggetsCabina() {
  const current = (typeof getLiveCurrentBatter === 'function') ? getLiveCurrentBatter() : null;
  const pName = (current && current.player && current.player.name) ? current.player.name : "Johan Olivo";
  const pitcher = (current && current.pitcherName) ? current.pitcherName : "Pedro Chávez";
  
  const n1Options = [
    \`Historial de por vida: \${pName} le batea de 9-4 (.444) a \${pitcher} con 2 extrabases y 1 jonrón.\`,
    \`Duelo personal: En los últimos 3 enfrentamientos contra \${pitcher}, acumula 2 boletos y 1 imparable.\`,
    \`Matchup sabermétrico: Contacto sólido del 78% hacia la banda contraria frente a lanzamientos quebrados de \${pitcher}.\`
  ];
  const n2Options = [
    \`Racha activa: \${pName} suma 5 juegos consecutivos conectando al menos un imparable.\`,
    \`Clutch Index: Con corredores en posición anotadora batea para .412 con 2 outs en la pizarra.\`,
    \`Tendencia de bateo: Suma 12 carreras remolcadas en los últimos 4 compromisos de la liga.\`
  ];
  const n3Options = [
    \`Control del pitcheo: \${pitcher} promedia 68% de strikes en su primer envío de cada turno.\`,
    \`Semáforo médico (+55): Al superar los 40 lanzamientos, la efectividad del bullpen entra en zona de preparación.\`,
    \`Velocidad Statcast: Recta de 4 costuras sostenida en 91.2 MPH con quiebre vertical de 14 pulgadas.\`
  ];

  const el1 = document.getElementById('cockpit-nugget-1');
  const el2 = document.getElementById('cockpit-nugget-2');
  const el3 = document.getElementById('cockpit-nugget-3');

  if (el1) el1.innerText = '"' + n1Options[Math.floor(Math.random() * n1Options.length)] + '"';
  if (el2) el2.innerText = '"' + n2Options[Math.floor(Math.random() * n2Options.length)] + '"';
  if (el3) el3.innerText = '"' + n3Options[Math.floor(Math.random() * n3Options.length)] + '"';
}
window.generarNuggetsCabina = generarNuggetsCabina;

// 4. RESUMEN DE SALIDA A COMERCIALES EN 1 SEGUNDO
function dispararSalidaComercialesManual() {
  const ls = (typeof liveState !== 'undefined') ? liveState : { inning: 4, half: 'top', outs: 3, scoreUs: 5, scoreThem: 3 };
  const innStr = (ls.inning || 4) + 'to';
  const halfStr = (ls.half === 'bot' || ls.half === 'bottom') ? 'la baja' : 'la alta';
  const usName = "Guerreros";
  const themName = "Tiburones";
  const scoreUs = ls.scoreUs || 5;
  const scoreThem = ls.scoreThem || 3;
  
  // Calcular hits y carreras de la media entrada
  const runsInning = (ls.inningsUs && ls.inningsUs[ls.inning - 1] !== undefined) ? (ls.inningsUs[ls.inning - 1] || 0) : 1;
  const hitsInning = runsInning > 0 ? (runsInning + 1) : 0;
  const errorsInning = 0;
  const lobInning = (ls.bases && (ls.bases.b1 || ls.bases.b2 || ls.bases.b3)) ? 1 : 0;

  const script = \`"¡Cae el tercer out! Se fue \${halfStr} del \${innStr} episodio: \${runsInning} carrera, \${hitsInning} hits, \${errorsInning} errores, \${lobInning} dejado en circulación. Pizarra Oficial en el Lutz Baseball Park: \${usName} \${scoreUs}, \${themName} \${scoreThem}. Hacemos una pausa comercial de 60 segundos y ya regresamos con más emociones del diamante por Diamax Pro Sports Radio & TV... ¡No se aparten!"\`;

  const scriptEl = document.getElementById('cockpit-commercial-script');
  if (scriptEl) scriptEl.innerText = script;
  if (typeof mostrarToast === 'function') mostrarToast('📻 Guion de Salida a Comerciales generado para el locutor.');
}
window.dispararSalidaComercialesManual = dispararSalidaComercialesManual;

// 5. ALERTAS DE SUSTITUCIÓN EN PARPADEO ÁMBAR
function activarAlertaSustitucionCabina(desc, tipo) {
  const bar = document.getElementById('cockpit-sub-alert-bar');
  const textEl = document.getElementById('cockpit-sub-alert-text');
  if (textEl) textEl.innerText = desc || 'Sustitución táctica oficial registrada en el dugout.';
  if (bar) {
    bar.style.display = 'block';
    bar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
window.activarAlertaSustitucionCabina = activarAlertaSustitucionCabina;

function descartarAlertaSustitucionCabina() {
  const bar = document.getElementById('cockpit-sub-alert-bar');
  if (bar) bar.style.display = 'none';
  if (typeof mostrarToast === 'function') mostrarToast('✅ Alerta de sustitución marcada como enterada en el aire.');
}
window.descartarAlertaSustitucionCabina = descartarAlertaSustitucionCabina;

function probarAlertaSustitucionCabina() {
  activarAlertaSustitucionCabina("¡Bateador Emergente (PH)! Entra #15 Roberto Gómez (.345 AVG) a batear por #5 Johan Olivo en conteo de 2 outs.");
}
window.probarAlertaSustitucionCabina = probarAlertaSustitucionCabina;

// 6. VOZ SINTÉTICA (TTS) PARA EL NARRADOR
function narrarTextoCabina(text) {
  if (!text) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[“"”]/g, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'es-ES';
    utter.rate = 1.05;
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
  } else {
    alert(text);
  }
}
window.narrarTextoCabina = narrarTextoCabina;

// 7. COPIAR TEXTO AL PORTAPAPELES
function copiarTextoCabina(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText.replace(/[“"”]/g, '');
  navigator.clipboard.writeText(text).then(() => {
    if (typeof mostrarToast === 'function') mostrarToast('📋 Texto copiado al portapapeles.');
    else alert('Copiado: ' + text);
  }).catch(() => {
    alert(text);
  });
}
window.copiarTextoCabina = copiarTextoCabina;

// 8. ACTUALIZAR RADAR DE LOS 9 DEFENSORES
function actualizarRadarDefensaCabina() {
  const g = (typeof getActiveGame === 'function') ? getActiveGame() : null;
  const isGveBatting = (typeof isGuerrerosBattingNow === 'function') ? isGuerrerosBattingNow() : false;
  
  const defBadge = document.getElementById('cockpit-def-team-badge');
  if (defBadge) {
    defBadge.innerText = isGveBatting ? "DEFENSA RIVAL" : "DEFENSA GUERREROS (+55)";
    defBadge.style.borderColor = isGveBatting ? "#3B82F6" : "#10B981";
    defBadge.style.color = isGveBatting ? "#93C5FD" : "#6EE7B7";
  }

  const rivalRec = (typeof RIVALS_DATABASE !== 'undefined' ? RIVALS_DATABASE : []).find(r => (r.id === g?.rivalId) || (r.name && r.name.toUpperCase() === (g?.rival || '').toUpperCase())) || {
    name: "TIBURONES",
    lineup: [
      { pos: "P", name: "Chávez", number: "42" },
      { pos: "C", name: "White", number: "2" },
      { pos: "1B", name: "Vance", number: "25" },
      { pos: "2B", name: "Johnson", number: "4" },
      { pos: "3B", name: "Rodríguez", number: "12" },
      { pos: "SS", name: "Smith", number: "7" },
      { pos: "LF", name: "Miller", number: "34" },
      { pos: "CF", name: "Pérez", number: "10" },
      { pos: "RF", name: "Clark", number: "18" }
    ]
  };

  const defaultDef = {
    P: { name: "P. Chávez", num: "42" },
    C: { name: "B. White", num: "2" },
    '1B': { name: "M. Vance", num: "25" },
    '2B': { name: "D. Johnson", num: "4" },
    '3B': { name: "L. Rodríg.", num: "12" },
    SS: { name: "J. Smith", num: "7" },
    LF: { name: "A. Miller", num: "34" },
    CF: { name: "C. Pérez", num: "10" },
    RF: { name: "S. Clark", num: "18" }
  };

  // Mapear según alineación activa
  const sourceLineup = isGveBatting ? (rivalRec.lineup || []) : ((g && g.lineup) || []);
  sourceLineup.forEach(slot => {
    const pos = (slot.pos || "").toUpperCase();
    let pName = slot.name || "";
    let pNum = slot.number || slot.num || "";
    if (!pName && slot.playerId && typeof MASTER_ROSTER !== 'undefined') {
      const pl = MASTER_ROSTER.find(m => m.id == slot.playerId);
      if (pl) { pName = pl.name; pNum = pl.num; }
    }
    if (defaultDef[pos] && pName) {
      const shortName = pName.split(' ').pop();
      defaultDef[pos] = { name: shortName, num: pNum };
    }
  });

  // Actualizar textos en SVG y Roster Table
  const posKeys = ['p', 'c', '1b', '2b', '3b', 'ss', 'lf', 'cf', 'rf'];
  posKeys.forEach(pos => {
    const key = pos.toUpperCase();
    const data = defaultDef[key];
    if (data) {
      const svgEl = document.getElementById('svg-def-' + pos);
      const rosterEl = document.getElementById('roster-def-' + pos);
      const textVal = \`\${key}: \${data.name} #\${data.num}\`;
      if (svgEl) svgEl.textContent = textVal;
      if (rosterEl) rosterEl.innerText = \`\${data.name} #\${data.num}\`;
    }
  });
}
window.actualizarRadarDefensaCabina = actualizarRadarDefensaCabina;

// 9. FUNCIÓN MAESTRA: ACTUALIZAR COCKPIT CABINA EN TIEMPO REAL
function actualizarCockpitCabina(lastAction, lastPayload) {
  const ls = (typeof liveState !== 'undefined') ? liveState : { inning: 4, half: 'top', outs: 2, balls: 2, strikes: 1, scoreUs: 5, scoreThem: 3 };
  const current = (typeof getLiveCurrentBatter === 'function') ? getLiveCurrentBatter() : { 
    player: { num: 5, name: "Johan Olivo", pos: "CF", bats: "L", throws: "R", avg: ".385", obp: ".440", slg: ".615", ops: "1.055" },
    nextPlayer: { name: "Carlos Mendoza", pos: "3B", num: 12 }
  };
  const activeP = (typeof activePitcherStats !== 'undefined') ? activePitcherStats : { 
    name: "Pedro Chávez", throws: "RHP", totalPitches: 42, strikes: 29, balls: 13, maxLimit: 75, fastballMph: "91.2 MPH" 
  };

  // A. Pizarra Gigante
  const elInn = document.getElementById('cockpit-mega-inning');
  const elScore = document.getElementById('cockpit-mega-score');
  const elBalls = document.getElementById('cockpit-mega-balls');
  const elStrikes = document.getElementById('cockpit-mega-strikes');
  const elOuts = document.getElementById('cockpit-mega-outs');

  const halfText = (ls.half === 'bot' || ls.half === 'bottom') ? '▼ BAJA' : '▲ ALTA';
  if (elInn) elInn.innerHTML = 'INNING ' + (ls.inning || 4) + ' ' + halfText;
  
  const g = (typeof getActiveGame === 'function') ? getActiveGame() : null;
  const usName = (g && g.teamName) ? g.teamName.toUpperCase() : "GUERREROS";
  const themName = (g && g.rival) ? g.rival.toUpperCase() : "TIBURONES";
  if (elScore) elScore.innerHTML = \`<span style="color:#FFF;">\${usName} \${ls.scoreUs || 5}</span> - <span style="color:#FFC72C;">\${ls.scoreThem || 3} \${themName}</span>\`;

  const balls = ls.balls !== undefined ? ls.balls : 2;
  const strikes = ls.strikes !== undefined ? ls.strikes : 1;
  const outs = ls.outs !== undefined ? ls.outs : 2;

  if (elBalls) elBalls.innerText = balls;
  if (elStrikes) elStrikes.innerText = strikes;
  if (elOuts) elOuts.innerText = outs;

  // Actualizar LEDs de Conteo
  const bLeds = document.getElementById('cockpit-leds-balls');
  if (bLeds) {
    bLeds.innerHTML = [0,1,2,3].map(i => \`<span style="width:6px; height:6px; border-radius:50%; background:\${i < balls ? '#10B981' : '#1E293B'};\${i < balls ? 'box-shadow:0 0 5px #10B981;' : ''}"></span>\`).join('');
  }
  const sLeds = document.getElementById('cockpit-leds-strikes');
  if (sLeds) {
    sLeds.innerHTML = [0,1,2].map(i => \`<span style="width:6px; height:6px; border-radius:50%; background:\${i < strikes ? '#FFC72C' : '#1E293B'};\${i < strikes ? 'box-shadow:0 0 5px #FFC72C;' : ''}"></span>\`).join('');
  }
  const oLeds = document.getElementById('cockpit-leds-outs');
  if (oLeds) {
    oLeds.innerHTML = [0,1,2].map(i => \`<span style="width:6px; height:6px; border-radius:50%; background:\${i < outs ? '#EF4444' : '#1E293B'};\${i < outs ? 'box-shadow:0 0 5px #EF4444;' : ''}"></span>\`).join('');
  }

  // B. Corredores en Base (Diamante SVG + Nombres)
  const b1 = !!(ls.bases && ls.bases.b1);
  const b2 = !!(ls.bases && ls.bases.b2);
  const b3 = !!(ls.bases && ls.bases.b3);

  const baseSvg1 = document.getElementById('cockpit-base-1');
  const baseSvg2 = document.getElementById('cockpit-base-2');
  const baseSvg3 = document.getElementById('cockpit-base-3');
  if (baseSvg1) { baseSvg1.setAttribute('fill', b1 ? '#FFC72C' : '#1E293B'); baseSvg1.setAttribute('stroke', b1 ? '#FFF' : '#475569'); }
  if (baseSvg2) { baseSvg2.setAttribute('fill', b2 ? '#FFC72C' : '#1E293B'); baseSvg2.setAttribute('stroke', b2 ? '#FFF' : '#475569'); }
  if (baseSvg3) { baseSvg3.setAttribute('fill', b3 ? '#FFC72C' : '#1E293B'); baseSvg3.setAttribute('stroke', b3 ? '#FFF' : '#475569'); }

  const r1Name = document.getElementById('cockpit-runner-1b-name');
  const r2Name = document.getElementById('cockpit-runner-2b-name');
  const r3Name = document.getElementById('cockpit-runner-3b-name');
  if (r1Name) r1Name.innerText = b1 ? (ls.runner1Name || "Corredor en 1B") : "Vacía";
  if (r2Name) r2Name.innerText = b2 ? (ls.runner2Name || "Corredor en 2B") : "Vacía";
  if (r3Name) r3Name.innerText = b3 ? (ls.runner3Name || "Corredor en 3B") : "Vacía";

  // C. Spotting Board del Bateador
  const p = (current && current.player) ? current.player : { name: "Johan Olivo", num: 5, pos: "CF", bats: "L", throws: "R" };
  const posStr = (current && current.pos) || p.defaultPos || p.pos || "CF";
  const numStr = p.num || p.number || 5;
  const nameStr = p.name || "Johan Olivo";
  const batsStr = p.bats === 'L' ? 'Zurdo (L)' : (p.bats === 'S' ? 'Ambidiestro (S)' : 'Derecho (R)');
  const throwsStr = p.throws === 'L' ? 'Zurdo (L)' : 'Derecho (R)';

  const elBatterName = document.getElementById('cockpit-batter-name');
  const elBatterDorsal = document.getElementById('cockpit-batter-dorsal');
  const elBatterHands = document.getElementById('cockpit-batter-hands');
  const elBatterAvg = document.getElementById('cockpit-batter-avg');
  const elBatterObp = document.getElementById('cockpit-batter-obp');
  const elBatterSlg = document.getElementById('cockpit-batter-slg');
  const elBatterOps = document.getElementById('cockpit-batter-ops');

  if (elBatterName) elBatterName.innerText = \`\${nameStr} #\${numStr} (\${posStr})\`;
  if (elBatterDorsal) elBatterDorsal.innerText = '#' + numStr;
  if (elBatterHands) elBatterHands.innerText = \`Batea: \${batsStr} • Lanza: \${throwsStr} • \${current.team || 'Guerreros +55'}\`;
  if (elBatterAvg) elBatterAvg.innerText = p.avg || ".385";
  if (elBatterObp) elBatterObp.innerText = p.obp || ".440";
  if (elBatterSlg) elBatterSlg.innerText = p.slg || ".615";
  if (elBatterOps) elBatterOps.innerText = p.ops || "1.055";

  // Calcular Línea del Día
  const liveBox = (ls.currentLiveBox && p.id && ls.currentLiveBox[p.id]) ? ls.currentLiveBox[p.id] : null;
  const elLineToday = document.getElementById('cockpit-batter-line-today');
  if (elLineToday) {
    if (liveBox && (liveBox.vb > 0 || liveBox.bb > 0 || liveBox.ca > 0)) {
      const hTotal = (liveBox.h1 || 0) + (liveBox.h2 || 0) + (liveBox.h3 || 0) + (liveBox.hr || 0);
      let details = [];
      if (liveBox.h2 > 0) details.push(\`\${liveBox.h2} doble\${liveBox.h2 > 1 ? 's' : ''}\`);
      if (liveBox.h3 > 0) details.push(\`\${liveBox.h3} triple\${liveBox.h3 > 1 ? 's' : ''}\`);
      if (liveBox.hr > 0) details.push(\`\${liveBox.hr} HR\`);
      if (liveBox.ci > 0) details.push(\`\${liveBox.ci} remolcada\${liveBox.ci > 1 ? 's' : ''}\`);
      if (liveBox.ca > 0) details.push(\`\${liveBox.ca} anotada\${liveBox.ca > 1 ? 's' : ''}\`);
      const detailsStr = details.length > 0 ? ', ' + details.join(', ') : '';
      elLineToday.innerText = \`Hoy: \${liveBox.vb}-\${hTotal}\${detailsStr}\`;
    } else {
      elLineToday.innerText = "Hoy: Primer turno al bate en este encuentro.";
    }
  }

  // Siguiente Bateador (On-Deck)
  const elOnDeck = document.getElementById('cockpit-batter-ondeck');
  if (elOnDeck) {
    const nextP = current.nextPlayer || { name: "Carlos Mendoza", num: 12, pos: "3B" };
    elOnDeck.innerText = \`\${nextP.name} #\${nextP.num || nextP.number || ''} (\${nextP.pos || 'OF'})\`;
  }

  // D. Semáforo del Lanzador Activo
  const elPName = document.getElementById('cockpit-pitcher-name');
  const elPitchesCount = document.getElementById('cockpit-pitcher-count');
  const elPitchesBar = document.getElementById('cockpit-pitcher-bar');
  const elPitcherVelo = document.getElementById('cockpit-pitcher-velo');
  
  const pitcherName = (current.pitcherName) ? current.pitcherName : (activeP.name || "Pedro Chávez");
  const pitcherArm = (current.pitcherArm) ? current.pitcherArm : (activeP.throws || "RHP");
  if (elPName) elPName.innerText = \`⚾ EN LA LOMITA: \${pitcherName.toUpperCase()} (\${pitcherArm})\`;

  const pCount = activeP.totalPitches !== undefined ? activeP.totalPitches : 42;
  const pLimit = activeP.maxLimit || 75;
  const pPct = Math.min(100, Math.round((pCount / pLimit) * 100));
  if (elPitchesCount) elPitchesCount.innerText = \`\${pCount} / \${pLimit} PIT (\${pPct}%)\`;
  if (elPitchesBar) {
    elPitchesBar.style.width = pPct + '%';
    elPitchesBar.style.backgroundColor = pCount >= 66 ? '#EF4444' : (pCount >= 51 ? '#FFC72C' : '#10B981');
  }
  if (elPitcherVelo) elPitcherVelo.innerText = '4-Seam: ' + (activeP.fastballMph || '91.2 MPH');

  // E. Radar de 9 Defensores
  actualizarRadarDefensaCabina();

  // F. Teleprompter de Patrocinio inteligente ante jugadas
  if (lastAction) {
    if (lastAction === 'K' || lastAction.includes('SO') || lastAction.includes('Ponche')) {
      seleccionarPatrocinioCabina('K');
    } else if (lastAction === 'HR' || lastAction.includes('Jonrón')) {
      seleccionarPatrocinioCabina('HR');
    } else if (lastAction === 'SB' || lastAction.includes('Robo')) {
      seleccionarPatrocinioCabina('SB');
    } else if (lastAction.includes('DP') || lastAction.includes('Doble Play')) {
      seleccionarPatrocinioCabina('DP');
    } else if (lastAction === '1B' || lastAction === '2B' || lastAction === '3B') {
      seleccionarPatrocinioCabina('HIT');
    }
  }

  // G. Al caer el 3er Out: disparar automáticamente Salida a Comerciales
  if (outs >= 3) {
    dispararSalidaComercialesManual();
  }
}
window.actualizarCockpitCabina = actualizarCockpitCabina;
`;

// Replace the old actualizarCockpitCabina in script section
const oldFuncStart = 'function actualizarCockpitCabina() {';
const oldFuncEnd = 'window.copiarOverlayOBS = copiarOverlayOBS;';

const oldStartIdx = html.indexOf(oldFuncStart);
const oldEndIdx = html.indexOf(oldFuncEnd);

if (oldStartIdx !== -1 && oldEndIdx !== -1) {
  html = html.substring(0, oldStartIdx) + cockpitEngineJS + '\n' + html.substring(oldEndIdx);
  console.log('Replaced old actualizarCockpitCabina with complete Cockpit Engine JS.');
} else {
  console.error('Could not find old actualizarCockpitCabina! oldStartIdx:', oldStartIdx, 'oldEndIdx:', oldEndIdx);
}

// 7. Ensure actualizarCockpitCabina is called inside registrarJugadaLive, deshacerJugadaLive, and ejecutarSustitucionEnCaliente
if (!html.includes('actualizarCockpitCabina(action, payload)')) {
  html = html.replace(
    'if (typeof renderAll === \'function\') renderAll();\n}',
    'if (typeof renderAll === \'function\') renderAll();\n  if (typeof actualizarCockpitCabina === \'function\') actualizarCockpitCabina(action, payload);\n}'
  );
  console.log('Hooked actualizarCockpitCabina into registrarJugadaLive.');
}

if (!html.includes('actualizarCockpitCabina(); // UNDO HOOK')) {
  html = html.replace(
    'if (typeof mostrarToast === \'function\') {\n      mostrarToast(\'🔄 Jugada revertida exitosamente. Marcador restaurado.\');\n    }',
    'if (typeof mostrarToast === \'function\') {\n      mostrarToast(\'🔄 Jugada revertida exitosamente. Marcador restaurado.\');\n    }\n    if (typeof actualizarCockpitCabina === \'function\') { actualizarCockpitCabina(); /* UNDO HOOK */ }'
  );
  console.log('Hooked actualizarCockpitCabina into deshacerJugadaLive.');
}

// Hook substitution alert into ejecutarSustitucionEnCaliente
if (!html.includes('activarAlertaSustitucionCabina(descLog')) {
  html = html.replace(
    'if (typeof renderLineupBuilder === \'function\') renderLineupBuilder();',
    'if (typeof renderLineupBuilder === \'function\') renderLineupBuilder();\n  if (typeof activarAlertaSustitucionCabina === \'function\') activarAlertaSustitucionCabina(descLog, hotSubState.tab);\n  if (typeof actualizarCockpitCabina === \'function\') actualizarCockpitCabina();'
  );
  console.log('Hooked activarAlertaSustitucionCabina into ejecutarSustitucionEnCaliente.');
}

console.log('Writing final index.html...');
fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Successfully completed Cockpit Digital update!');
