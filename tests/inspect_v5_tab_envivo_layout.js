const fs = require('fs');
const v5 = fs.readFileSync('v5_dugout_emergente_ph_blindado.html', 'utf8');

const tEnvivo = v5.indexOf('id="tab-envivo"');
const tLineup = v5.indexOf('id="tab-lineup"');

console.log('v5 tab-envivo length:', tLineup - tEnvivo);
console.log('--- v5 tab-envivo structure ---');
console.log(v5.substring(tEnvivo, tEnvivo + 2500));
