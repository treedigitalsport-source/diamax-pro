const fs = require('fs');

const targetFiles = [
  'index.html',
  'v_original_aprobada.html',
  'v6_hace_1_hora_49505bc.html',
  'v1_actual_logo_photoroom_y_planes.html'
];

const newScoreboardHTML = `        <div class="scoreboard" style="background:linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%), rgba(6,12,28,0.85); backdrop-filter:blur(24px); border:1px solid rgba(0,210,255,0.3); border-radius:18px; padding:14px; box-shadow:inset 0 1px 1.5px rgba(255,255,255,0.3), 0 12px 35px rgba(0,0,0,0.6);">
          
          <!-- Control de Inning Centrado y Simétrico -->
          <div style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:12px; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:6px 14px;">
            <button type="button" onclick="cambiarInningManual(-1)" class="btn-score-adjust" style="width:28px; height:28px; font-size:13px; background:rgba(0,210,255,0.15); border:1px solid #00D2FF; color:#00D2FF; border-radius:8px; cursor:pointer; font-weight:900; display:flex; align-items:center; justify-content:center; transition:all 0.15s;" onmouseover="this.style.background='#00D2FF'; this.style.color='#000';" onmouseout="this.style.background='rgba(0,210,255,0.15)'; this.style.color='#00D2FF';">◀</button>
            <div style="font-size:13px; color:#FFC72C; font-weight:900; letter-spacing:1px; cursor:pointer; font-family:'Montserrat',sans-serif; text-shadow:0 0 10px rgba(255,199,44,0.5);" id="scoreboard-inn" onclick="toggleHalfInningManual()" title="Clic para alternar Alta ▲ / Baja ▼">INNING 1 (ALTA ▲)</div>
            <button type="button" onclick="cambiarInningManual(1)" class="btn-score-adjust" style="width:28px; height:28px; font-size:13px; background:rgba(0,210,255,0.15); border:1px solid #00D2FF; color:#00D2FF; border-radius:8px; cursor:pointer; font-weight:900; display:flex; align-items:center; justify-content:center; transition:all 0.15s;" onmouseover="this.style.background='#00D2FF'; this.style.color='#000';" onmouseout="this.style.background='rgba(0,210,255,0.15)'; this.style.color='#00D2FF';">▶</button>
          </div>

          <!-- Cuadrícula Bilateral Simétrica (VISITANTE vs HOME CLUB) -->
          <div class="score-flex" style="display:grid; grid-template-columns:1fr auto 1fr; gap:10px; align-items:center;">
            
            <!-- CAJA EQUIPO VISITANTE (BATEA EN LA ALTA ▲) -->
            <div id="scoreboard-away-box" style="display:flex; flex-direction:column; justify-content:space-between; height:125px; text-align:center; padding:10px 8px; border-radius:14px; background:rgba(15,23,42,0.7); border:1.5px solid rgba(255,255,255,0.12); box-sizing:border-box; transition:all 0.25s;">
              <div>
                <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:3px;">
                  <img src="" id="score-away-logo" style="width:22px; height:22px; border-radius:50%; border:1.5px solid #FFC72C; object-fit:cover; flex-shrink:0;">
                  <span style="font-size:11.5px; color:#F8FAFC; font-weight:900; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:115px;" id="label-away-team" title="Equipo Visitante">VISITANTE</span>
                </div>
                <div id="status-away-team" style="min-height:18px; display:flex; align-items:center; justify-content:center;">
                  <!-- Renderizado dinámicamente -->
                </div>
              </div>
              <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
                <button type="button" onclick="ajustarCarrerasManual('away', -1)" class="btn-score-adjust" style="width:26px; height:26px; font-size:14px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#FFF; border-radius:6px; font-weight:900; cursor:pointer;">-</button>
                <span class="score-num" style="color:#00D2FF; font-size:28px; font-weight:900; font-family:'Montserrat',sans-serif; min-width:32px; text-align:center; text-shadow:0 0 15px rgba(0,210,255,0.6);" id="score-away">0</span>
                <button type="button" onclick="ajustarCarrerasManual('away', 1)" class="btn-score-adjust" style="width:26px; height:26px; font-size:14px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#FFF; border-radius:6px; font-weight:900; cursor:pointer;">+</button>
              </div>
            </div>

            <!-- Divisor Central VS en Relieve -->
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 2px;">
              <span style="background:rgba(255,199,44,0.15); border:1.5px solid #FFC72C; color:#FFC72C; font-size:11px; font-weight:900; padding:4px 8px; border-radius:8px; box-shadow:0 0 12px rgba(255,199,44,0.35); letter-spacing:0.5px;">VS</span>
            </div>

            <!-- CAJA EQUIPO HOME CLUB (BATEA EN LA BAJA ▼) -->
            <div id="scoreboard-home-box" style="display:flex; flex-direction:column; justify-content:space-between; height:125px; text-align:center; padding:10px 8px; border-radius:14px; background:rgba(15,23,42,0.7); border:1.5px solid rgba(255,255,255,0.12); box-sizing:border-box; transition:all 0.25s;">
              <div>
                <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:3px;">
                  <img src="" id="score-home-logo" style="width:22px; height:22px; border-radius:50%; border:1.5px solid #10B981; object-fit:cover; flex-shrink:0;">
                  <span style="font-size:11.5px; color:#F8FAFC; font-weight:900; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:115px;" id="label-home-team" title="Equipo Local">HOME CLUB</span>
                </div>
                <div id="status-home-team" style="min-height:18px; display:flex; align-items:center; justify-content:center;">
                  <!-- Renderizado dinámicamente -->
                </div>
              </div>
              <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
                <button type="button" onclick="ajustarCarrerasManual('home', -1)" class="btn-score-adjust" style="width:26px; height:26px; font-size:14px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#FFF; border-radius:6px; font-weight:900; cursor:pointer;">-</button>
                <span class="score-num" style="color:#10B981; font-size:28px; font-weight:900; font-family:'Montserrat',sans-serif; min-width:32px; text-align:center; text-shadow:0 0 15px rgba(16,185,129,0.6);" id="score-home">0</span>
                <button type="button" onclick="ajustarCarrerasManual('home', 1)" class="btn-score-adjust" style="width:26px; height:26px; font-size:14px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#FFF; border-radius:6px; font-weight:900; cursor:pointer;">+</button>
              </div>
            </div>

          </div>`;

function applyScoreboardFix(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace scoreboard HTML block
  const scoreboardRegex = /<div class="scoreboard">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Outs LED Stadium Indicator -->/;
  if (scoreboardRegex.test(content)) {
    content = content.replace(scoreboardRegex, `${newScoreboardHTML}\n          \n          <!-- Outs LED Stadium Indicator -->`);
  }

  // Update updateLiveBatterDisplay() to set clean team names in labels
  content = content.replace(
    /setSafeText\('label-away-team', `\$\{awayName\} \(VISITANTE\)`\);\s*setSafeText\('label-home-team', `\$\{homeName\} \(HOME CLUB\)`\);/,
    `setSafeText('label-away-team', (awayName || 'VISITANTE').toUpperCase());
  setSafeText('label-home-team', (homeName || 'HOME CLUB').toUpperCase());`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully fixed scoreboard alignment in ${filePath}`);
}

targetFiles.forEach(f => applyScoreboardFix(f));
