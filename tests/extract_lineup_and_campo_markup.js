const fs = require('fs');
const html = fs.readFileSync('v5_dugout_emergente_ph_blindado.html', 'utf8');

const tLineup = html.indexOf('id="tab-lineup"');
const tCampo = html.indexOf('id="tab-campo"');
const tManual = html.indexOf('id="tab-manual"');

console.log('In v5: tab-lineup index:', tLineup);
console.log('In v5: tab-campo index:', tCampo);
console.log('In v5: tab-manual index:', tManual);

if (tLineup !== -1 && tCampo !== -1) {
  console.log('\n--- TAB-LINEUP EXTRACT (first 1000 chars) ---');
  console.log(html.substring(tLineup, tLineup + 1000));

  console.log('\n--- TAB-CAMPO EXTRACT (first 1000 chars) ---');
  console.log(html.substring(tCampo, tCampo + 1000));
}
