const fs = require('fs');

const v5 = fs.readFileSync('v5_dugout_emergente_ph_blindado.html', 'utf8');

const tLineupStart = v5.indexOf('<div id="tab-lineup"');
const tManualStart = v5.indexOf('<div id="tab-manual"');
const tabsToInsert = v5.substring(tLineupStart, tManualStart);

console.log('Extracted tab-lineup and tab-campo length:', tabsToInsert.length);

const targetFiles = [
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/index.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v_original_aprobada.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v6_hace_1_hora_49505bc.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v1_actual_logo_photoroom_y_planes.html'
];

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // If tab-lineup is not already in the file, insert before tab-manual
  if (!html.includes('id="tab-lineup"')) {
    const manualIdx = html.indexOf('<div id="tab-manual"');
    if (manualIdx !== -1) {
      // Find comment before tab-manual if any
      const commentIdx = html.lastIndexOf('<!--', manualIdx);
      const insertPos = (commentIdx !== -1 && manualIdx - commentIdx < 200) ? commentIdx : manualIdx;

      html = html.substring(0, insertPos) + tabsToInsert + '\n  ' + html.substring(insertPos);
      fs.writeFileSync(file, html, 'utf8');
      console.log(`Successfully restored tab-lineup and tab-campo in ${file}`);
    } else {
      console.log(`tab-manual not found in ${file}`);
    }
  } else {
    console.log(`tab-lineup already exists in ${file}`);
  }
});
