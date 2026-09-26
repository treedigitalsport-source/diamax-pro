const fs = require('fs');

const targetFiles = [
  'index.html',
  'v_original_aprobada.html',
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html'
];

// 1. Ultra-Robust CSS for Scoreboard (Zero Wrapping Bug, 100% Symmetrical Liquid Glass)
const scoreboardMasterCSS = `
/* ========================================================================== */
/* ⚾ SCOREBOARD & INNING CONTROLLER — BULLETPROOF SYMMETRICAL LIQUID GLASS   */
/* ========================================================================== */

.scoreboard {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(6, 12, 28, 0.88) !important;
  backdrop-filter: blur(28px) saturate(200%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(200%) !important;
  border: 1px solid rgba(0, 210, 255, 0.3) !important;
  border-radius: 20px !important;
  padding: 14px 12px !important;
  box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.4), 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 210, 255, 0.15) !important;
  text-align: center !important;
  margin-bottom: 14px !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

.scoreboard-inning-bar {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  background: rgba(0, 0, 0, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  border-radius: 24px !important;
  padding: 4px 14px !important;
  margin: 0 auto 12px auto !important;
  white-space: nowrap !important;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4) !important;
}

.scoreboard-inning-bar button {
  width: 26px !important;
  height: 26px !important;
  min-width: 26px !important;
  border-radius: 50% !important;
  border: 1px solid #00D2FF !important;
  background: rgba(0, 210, 255, 0.18) !important;
  color: #00D2FF !important;
  font-size: 11px !important;
  font-weight: 900 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  transition: all 0.2s ease !important;
}

.scoreboard-inning-bar button:hover {
  background: #00D2FF !important;
  color: #000000 !important;
  box-shadow: 0 0 12px rgba(0, 210, 255, 0.8) !important;
  transform: scale(1.1) !important;
}

.scoreboard-grid-dual {
  display: grid !important;
  grid-template-columns: 1fr auto 1fr !important;
  gap: 8px !important;
  align-items: center !important;
  margin-bottom: 12px !important;
}

.scoreboard-team-card {
  background: rgba(15, 23, 42, 0.75) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 14px !important;
  padding: 8px 6px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  align-items: center !important;
  height: 120px !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  transition: all 0.25s ease !important;
}

.scoreboard-team-title {
  font-size: 11px !important;
  font-weight: 900 !important;
  color: #FFFFFF !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 105px !important;
  display: block !important;
  letter-spacing: 0.3px !important;
}

.score-pill-counter {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(0, 0, 0, 0.45) !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  border-radius: 20px !important;
  padding: 2px 6px !important;
  gap: 4px !important;
  white-space: nowrap !important;
}

.score-pill-counter button {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  border-radius: 50% !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  color: #FFFFFF !important;
  font-size: 13px !important;
  font-weight: 900 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  transition: all 0.15s ease !important;
}

.score-pill-counter button:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: #FFFFFF !important;
}

.score-pill-counter .score-num {
  font-size: 24px !important;
  font-weight: 900 !important;
  font-family: 'Montserrat', monospace !important;
  min-width: 26px !important;
  text-align: center !important;
  line-height: 1 !important;
  display: inline-block !important;
}

.scoreboard-vs-badge {
  background: rgba(255, 199, 44, 0.15) !important;
  border: 1.5px solid #FFC72C !important;
  color: #FFC72C !important;
  font-size: 10px !important;
  font-weight: 900 !important;
  padding: 3px 6px !important;
  border-radius: 8px !important;
  box-shadow: 0 0 10px rgba(255, 199, 44, 0.35) !important;
  white-space: nowrap !important;
}
`;

const completeBulletproofScoreboardHTML = `        <!-- ⚾ MARCADOR SIMÉTRICO LIQUID GLASS (ZERO DESCUADRE) -->
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

          <!-- ⌫ BOTÓN DE BORRAR / DESHACER EN EL TABLERO -->
          <div style="margin-top:10px; display:flex; justify-content:center;">
            <button type="button" id="btn-undo-scoreboard" onclick="deshacerJugadaLive()" style="padding:8px 16px; background:linear-gradient(135deg, rgba(239,68,68,0.22) 0%, rgba(185,28,28,0.3) 100%); color:#FCA5A5; border:1.8px solid #EF4444; border-radius:8px; font-family:'Montserrat',sans-serif; font-size:11.5px; font-weight:900; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 0 14px rgba(239,68,68,0.35); transition:all 0.15s;" title="¿Te equivocaste anotando? Toca aquí para borrar/deshacer la última jugada de inmediato">
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

  // 1. Inject or update Scoreboard Master CSS
  if (content.includes('/* ⚾ SCOREBOARD & INNING CONTROLLER')) {
    content = content.replace(
      /\/\* ⚾ SCOREBOARD & INNING CONTROLLER[\s\S]*?\/\* End Scoreboard CSS \*\//,
      `${scoreboardMasterCSS.trim()}\n/* End Scoreboard CSS */`
    );
  } else if (content.includes('</style>')) {
    content = content.replace('</style>', `${scoreboardMasterCSS.trim()}\n/* End Scoreboard CSS */\n</style>`);
  }

  // 2. Replace entire scoreboard markup
  const scoreboardFullRegex = /<!-- ⚾ MARCADOR SIMÉTRICO[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
  if (scoreboardFullRegex.test(content)) {
    content = content.replace(scoreboardFullRegex, `${completeBulletproofScoreboardHTML}\n      </div>`);
  } else {
    // Alternative match for .scoreboard container
    const scoreboardDivRegex = /<div class="scoreboard"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
    if (scoreboardDivRegex.test(content)) {
      content = content.replace(scoreboardDivRegex, completeBulletproofScoreboardHTML);
    }
  }

  // 3. Make sure updateLiveBatterDisplay sets clean short team names
  content = content.replace(
    /setSafeText\('label-away-team', `\$\{awayName\} \(VISITANTE\)`\);/g,
    `setSafeText('label-away-team', (awayName || 'VISITANTE').toUpperCase());`
  );
  content = content.replace(
    /setSafeText\('label-home-team', `\$\{homeName\} \(HOME CLUB\)`\);/g,
    `setSafeText('label-home-team', (homeName || 'HOME CLUB').toUpperCase());`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully fixed scoreboard & skeuomorphic icons in ${filePath}`);
}

targetFiles.forEach(f => processFile(f));
