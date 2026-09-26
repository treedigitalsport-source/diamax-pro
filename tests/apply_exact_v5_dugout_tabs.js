const fs = require('fs');

const v5 = fs.readFileSync('v5_dugout_emergente_ph_blindado.html', 'utf8');

const v5EnvivoStart = v5.indexOf('<div id="tab-envivo"');
const v5ManualStart = v5.indexOf('<div id="tab-manual"');
const v5FullTabsBlock = v5.substring(v5EnvivoStart, v5ManualStart);

console.log('v5FullTabsBlock length:', v5FullTabsBlock.length);
console.log('Includes panel-36-plays:', v5FullTabsBlock.includes('id="panel-36-plays"'));
console.log('Includes tab-lineup:', v5FullTabsBlock.includes('id="tab-lineup"'));
console.log('Includes tab-campo:', v5FullTabsBlock.includes('id="tab-campo"'));

const targetFiles = [
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/index.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v_original_aprobada.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v6_hace_1_hora_49505bc.html',
  'C:/Users/fitne/Documents/3Tree_Codebase/DIAMAX/v1_actual_logo_photoroom_y_planes.html'
];

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  const envivoStart = html.indexOf('<div id="tab-envivo"');
  const manualStart = html.indexOf('<div id="tab-manual"');

  if (envivoStart !== -1 && manualStart !== -1) {
    html = html.substring(0, envivoStart) + v5FullTabsBlock + html.substring(manualStart);
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Successfully synced complete Dugout (with 36 plays), Lineup Builder and Ver Terreno in ${file}`);
  } else {
    console.log(`Could not find markers in ${file}`);
  }
});
