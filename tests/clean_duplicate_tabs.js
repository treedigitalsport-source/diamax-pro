const fs = require('fs');

const v5 = fs.readFileSync('v5_dugout_emergente_ph_blindado.html', 'utf8');

// In v5, extract ONLY panel-36-plays
const p36Start = v5.indexOf('<!-- Botonera Táctil Dugout Oficial (36 JUGADAS CANÓNICAS COMPLETAS) -->');
const p36End = v5.indexOf('</div>\n  </div>\n\n  \n  <!-- TAB 2: LINEUP BUILDER -->', p36Start);
const panel36Only = v5.substring(p36Start, p36End);

console.log('Clean panel36Only length:', panel36Only.length);

// Also extract tab-lineup and tab-campo cleanly
const tLineupStart = v5.indexOf('<div id="tab-lineup"');
const tManualStart = v5.indexOf('<div id="tab-manual"');
const lineupAndCampo = v5.substring(tLineupStart, tManualStart);

console.log('Clean lineupAndCampo length:', lineupAndCampo.length);

const targetFiles = [
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/index.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v_original_aprobada.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v6_hace_1_hora_49505bc.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v1_actual_logo_photoroom_y_planes.html'
];

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // Find start of quick plays or scoreboard right column
  const scoreboardGridStart = html.indexOf('<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">');
  const manualStart = html.indexOf('<div id="tab-manual"');

  if (scoreboardGridStart !== -1 && manualStart !== -1) {
    // In v5, find from scoreboardGridStart to manualStart
    const v5GridStart = v5.indexOf('<div class="responsive-grid-split">');
    const v5ManualStart = v5.indexOf('<div id="tab-manual"');
    const v5CleanSection = v5.substring(v5GridStart, v5ManualStart);

    // Replace the entire section from scoreboardGridStart to manualStart with v5CleanSection
    html = html.substring(0, scoreboardGridStart) + v5CleanSection + html.substring(manualStart);
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Cleanly synchronized Dugout grid, 36 plays, Lineup Builder and Ver Terreno in ${file}`);
  } else {
    console.log(`Markers not found in ${file}`);
  }
});
