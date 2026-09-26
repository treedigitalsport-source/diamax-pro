const fs = require('fs');

const targetFiles = [
  'index.html',
  'v_original_aprobada.html',
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html'
];

const completeScoreboardWithDiamondHTML = `        <!-- ⚾ MARCADOR SIMÉTRICO LIQUID GLASS CON DIAMANTE INTERACTIVO -->
        <div class="scoreboard">
          
          <!-- Control de Inning (Barra Centrada Sin Desbordamiento) -->
          <div class="scoreboard-inning-bar">
            <button type="button" onclick="cambiarInningManual(-1)" title="Inning Anterior">◀</button>
            <span id="scoreboard-inn" onclick="toggleHalfInningManual()" style="font-size:12px; color:#FFC72C; font-weight:900; letter-spacing:0.8px; cursor:pointer; font-family:'Montserrat',sans-serif; text-shadow:0 0 8px rgba(255,199,44,0.6);" title="Alternar Alta ▲ / Baja ▼">INNING 1 (ALTA ▲)</span>
            <button type="button" onclick="cambiarInningManual(1)" title="Inning Siguiente">▶</button>
          </div>

          <!-- Cuadrícula Bilateral Sincrónica (VISITANTE vs HOME CLUB) -->
          <div class="scoreboard-grid-dual">
            
            <!-- CAJA VISITANTE (BATEA EN LA ALTA ▲) -->
            <div id="scoreboard-away-box" class="scoreboard-team-card">
              <div style="width:100%; display:flex; flex-direction:column; align-items:center;">
                <div style="display:flex; align-items:center; justify-content:center; gap:5px; width:100%; margin-bottom:2px;">
                  <img src="" id="score-away-logo" style="width:20px; height:20px; border-radius:50%; border:1.5px solid #FFC72C; object-fit:cover; flex-shrink:0;">
                  <span id="label-away-team" class="scoreboard-team-title" title="Equipo Visitante">VISITANTE</span>
                </div>
                <div id="status-away-team" style="min-height:18px; display:flex; align-items:center; justify-content:center; width:100%;">
                  <!-- Renderizado dinámicamente -->
                </div>
              </div>
              <div class="score-pill-counter">
                <button type="button" onclick="ajustarCarrerasManual('away', -1)">-</button>
                <span class="score-num" style="color:#00D2FF; text-shadow:0 0 12px rgba(0,210,255,0.7);" id="score-away">0</span>
                <button type="button" onclick="ajustarCarrerasManual('away', 1)">+</button>
              </div>
            </div>

            <!-- Divisor VS Central -->
            <div style="display:flex; align-items:center; justify-content:center;">
              <span class="scoreboard-vs-badge">VS</span>
            </div>

            <!-- CAJA HOME CLUB (BATEA EN LA BAJA ▼) -->
            <div id="scoreboard-home-box" class="scoreboard-team-card">
              <div style="width:100%; display:flex; flex-direction:column; align-items:center;">
                <div style="display:flex; align-items:center; justify-content:center; gap:5px; width:100%; margin-bottom:2px;">
                  <img src="" id="score-home-logo" style="width:20px; height:20px; border-radius:50%; border:1.5px solid #10B981; object-fit:cover; flex-shrink:0;">
                  <span id="label-home-team" class="scoreboard-team-title" title="Equipo Local">HOME CLUB</span>
                </div>
                <div id="status-home-team" style="min-height:18px; display:flex; align-items:center; justify-content:center; width:100%;">
                  <!-- Renderizado dinámicamente -->
                </div>
              </div>
              <div class="score-pill-counter">
                <button type="button" onclick="ajustarCarrerasManual('home', -1)">-</button>
                <span class="score-num" style="color:#10B981; text-shadow:0 0 12px rgba(16,185,129,0.7);" id="score-home">0</span>
                <button type="button" onclick="ajustarCarrerasManual('home', 1)">+</button>
              </div>
            </div>

          </div>

          <!-- Outs LED Stadium Indicator -->
          <div class="outs-container" onclick="ciclarOutsManual()" title="Clic para avanzar outs">
            <span style="font-size:11px; font-weight:800; color:#94A3B8;">OUTS:</span>
            <div class="out-led-lamp" id="led-out-1"></div>
            <div class="out-led-lamp" id="led-out-2"></div>
            <div class="out-led-lamp" id="led-out-3"></div>
            <span style="font-size:10px; color:#64748B; margin-left:4px;">(Tocar)</span>
          </div>

          <!-- 💎 DIAMANTE SVG INTERACTIVO SKEUOMÓRFICO -->
          <div style="text-align:center; margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.08);">
            <div id="lbl-diamond-caption" style="font-size:10px; color:#94A3B8; margin-bottom:6px; font-weight:700;">Toca 1B, 2B o 3B para alternar corredores en base</div>
            <div style="display:flex; justify-content:center; align-items:center;">
              <svg width="110" height="110" viewBox="0 0 100 100" style="filter:drop-shadow(0 0 12px rgba(0,210,255,0.25));">
                <!-- Basepaths -->
                <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <polygon points="50,18 82,50 50,82 18,50" fill="rgba(6,12,28,0.85)"/>
                <!-- Home Plate -->
                <polygon points="50,88 44,82 44,78 56,78 56,82" fill="#FFFFFF" stroke="#00D2FF" stroke-width="1"/>
                <!-- 1B -->
                <polygon id="base-1" onclick="toggleBaseManual(1)" points="85,50 79,44 79,56" fill="#1E293B" stroke="#00D2FF" stroke-width="1.5" style="cursor:pointer; transition:all 0.2s;" title="Primera Base (1B)"/>
                <!-- 2B -->
                <polygon id="base-2" onclick="toggleBaseManual(2)" points="50,15 44,21 56,21" fill="#1E293B" stroke="#00D2FF" stroke-width="1.5" style="cursor:pointer; transition:all 0.2s;" title="Segunda Base (2B)"/>
                <!-- 3B -->
                <polygon id="base-3" onclick="toggleBaseManual(3)" points="15,50 21,44 21,56" fill="#1E293B" stroke="#00D2FF" stroke-width="1.5" style="cursor:pointer; transition:all 0.2s;" title="Tercera Base (3B)"/>
              </svg>
            </div>
          </div>

          <!-- ⌫ BOTÓN DE BORRAR / DESHACER EN EL TABLERO (CON ID REQUERIDO) -->
          <div style="margin-top:10px; display:flex; justify-content:center;">
            <button type="button" id="btn-undo-keypad" onclick="deshacerJugadaLive()" style="padding:8px 16px; background:linear-gradient(135deg, rgba(239,68,68,0.22) 0%, rgba(185,28,28,0.3) 100%); color:#FCA5A5; border:1.8px solid #EF4444; border-radius:8px; font-family:'Montserrat',sans-serif; font-size:11px; font-weight:900; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 0 14px rgba(239,68,68,0.35); transition:all 0.15s;" title="¿Te equivocaste anotando? Toca aquí para borrar/deshacer la última jugada de inmediato">
              <svg viewBox="0 0 24 24" width="14" height="14" style="filter:drop-shadow(0 0 4px #EF4444);"><use href="#diamax-icon-db-refresh"/></svg>
              <span>BORRAR / CORREGIR JUGADA (DESHACER)</span>
            </button>
          </div>

          <!-- JUGADAS RÁPIDAS DIRECTAMENTE EN EL TABLERO -->
          <div style="margin-top:10px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:10px; color:#00D2FF; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">⚡ JUGADAS EN EL TABLERO:</span>
              <button type="button" onclick="document.getElementById('panel-36-plays').scrollIntoView({behavior:'smooth'})" style="background:transparent; border:none; color:#FFC72C; font-size:10px; font-weight:800; cursor:pointer; text-decoration:underline;">Ver las 36 jugadas ▾</button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:5px;">
              <button type="button" class="btn-action btn-hit" onclick="registrarJugadaLive('1B')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">1B</button>
              <button type="button" class="btn-action btn-hit" onclick="registrarJugadaLive('2B')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">2B</button>
              <button type="button" class="btn-action btn-hit" onclick="registrarJugadaLive('3B')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">3B</button>
              <button type="button" class="btn-action btn-hr" onclick="registrarJugadaLive('HR')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">HR</button>
              <button type="button" class="btn-action btn-out" onclick="registrarJugadaLive('K')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">K</button>
              <button type="button" class="btn-action btn-tactical" onclick="registrarJugadaLive('BB')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">BB</button>
              <button type="button" class="btn-action btn-out" onclick="registrarJugadaLive('6-3')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">6-3</button>
              <button type="button" class="btn-action btn-out" onclick="registrarJugadaLive('6-4-3 DP')" style="min-height:34px; padding:3px; font-size:11.5px; font-weight:900;">DP</button>
            </div>
          </div>
        </div>`;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace scoreboard markup
  const scoreboardFullRegex = /<!-- ⚾ MARCADOR SIMÉTRICO[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
  if (scoreboardFullRegex.test(content)) {
    content = content.replace(scoreboardFullRegex, completeScoreboardWithDiamondHTML);
  } else {
    const scoreboardDivRegex = /<div class="scoreboard"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
    if (scoreboardDivRegex.test(content)) {
      content = content.replace(scoreboardDivRegex, completeScoreboardWithDiamondHTML);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${filePath} with complete Scoreboard, Diamond and Keypad Undo.`);
}

targetFiles.forEach(f => processFile(f));
